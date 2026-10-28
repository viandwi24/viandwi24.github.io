import type { Ambience as Bed } from '../scenes/types'
import type { Cue } from '../world/World'

/** Music sits quietly under everything. */
const MUSIC_LEVEL = 0.3
const FIRE_LEVEL = 0.35
const GARDEN_LEVEL = 0.3
const RADIO_TRACK = '/audio/shelter-lofi.mp3'

// Fmaj7, Em7, Dm7, Cmaj7: a slow, warm loop
const CHORDS = [
  [53, 57, 60, 64],
  [52, 55, 59, 62],
  [50, 53, 57, 60],
  [48, 52, 55, 59],
]
const PENTATONIC = [69, 72, 74, 76, 79, 81]
const CHORD_SECONDS = 6

const midi = (n: number) => 440 * 2 ** ((n - 69) / 12)

/**
 * All sound is synthesized with Web Audio: a lo-fi pad with the odd plucked note, a crackling
 * fire, garden birds by day and crickets at night, plus one-shot cues (knocks, pokes).
 * Browsers only allow audio after a user gesture, so nothing starts until `unlock()`.
 */
export class Ambience {
  private ctx: AudioContext | null = null
  private master!: GainNode
  private beds = new Map<Bed, GainNode>()
  private noise!: AudioBuffer
  private timer = 0
  private nextChord = 0
  private chord = 0
  private nextCrackle = 0
  private nextBird = 0
  private enabled = true
  private wanted = new Set<Bed>()
  private music!: GainNode
  private radio: HTMLAudioElement | null = null
  /** The radio is on from the start; it can only actually play once audio is unlocked. */
  private radioOn = true
  private radioGain: GainNode | null = null
  /** Radio volume for where the visitor is: loud next to it, quieter in other rooms and outside. */
  private radioLevel = 0.25
  private night = false

  /** Call from a user gesture. Safe to call repeatedly. */
  unlock() {
    if (this.ctx) {
      void this.ctx.resume()
      return
    }
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AC) return
    const ctx = (this.ctx = new AC())
    this.master = ctx.createGain()
    this.master.gain.value = this.enabled ? 1 : 0
    this.master.connect(ctx.destination)

    // Two seconds of white noise, reused by every noisy sound
    this.noise = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate)
    const data = this.noise.getChannelData(0)
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1

    this.setupMusic()
    this.setupFire()
    const garden = ctx.createGain()
    garden.gain.value = 0
    garden.connect(this.master)
    this.beds.set('garden', garden)
    this.applyBeds()

    if (this.radioOn) this.setRadio(true)
    this.nextChord = ctx.currentTime + 0.1
    this.timer = window.setInterval(() => this.schedule(), 200)
  }

  setEnabled(on: boolean) {
    this.enabled = on
    if (!this.ctx) return
    this.master.gain.setTargetAtTime(on ? 1 : 0, this.ctx.currentTime, 0.3)
  }

  /** Which sound beds the current room wants (fire, garden...). */
  setBeds(beds: Bed[]) {
    this.wanted = new Set(beds)
    this.applyBeds()
  }

  setNight(on: boolean) {
    this.night = on
  }

  cue(c: Cue) {
    if (c === 'radio-on' || c === 'radio-off') return this.setRadio(c === 'radio-on')
    if (!this.ctx || !this.enabled) return
    const t = this.ctx.currentTime
    if (c === 'knock') {
      this.knock(t + 0.1)
      this.knock(t + 0.45)
    } else if (c === 'door') this.creak(t)
    else if (c === 'meow') this.meow(t)
    else if (c === 'woof') {
      this.woof(t)
      this.woof(t + 0.22)
    } else this.blip(t)
  }

  /** Fade the radio to `level` (0..1), e.g. as the visitor moves away from it. */
  setRadioLevel(level: number) {
    this.radioLevel = level
    if (this.ctx && this.radioGain) this.radioGain.gain.setTargetAtTime(level, this.ctx.currentTime, 0.5)
  }

  /** The living room radio plays a lofi track; the synth music steps aside while it's on. */
  private setRadio(on: boolean) {
    this.radioOn = on
    const ctx = this.ctx
    if (!ctx) return
    if (on && !this.radio) {
      this.radio = new Audio(RADIO_TRACK)
      this.radio.loop = true
      this.radioGain = ctx.createGain()
      this.radioGain.gain.value = this.radioLevel
      ctx.createMediaElementSource(this.radio).connect(this.radioGain).connect(this.master)
    }
    // A quick on/off can pause before play() settles; that's fine
    if (on) this.radio!.play().catch(() => {})
    else this.radio?.pause()
    this.music.gain.setTargetAtTime(on ? 0 : MUSIC_LEVEL, ctx.currentTime, 0.4)
  }

  dispose() {
    this.radio?.pause()
    window.clearInterval(this.timer)
    void this.ctx?.close()
  }

  // ---- Beds --------------------------------------------------------------

  private applyBeds() {
    if (!this.ctx) return
    const levels: Record<Bed, number> = { fire: FIRE_LEVEL, garden: GARDEN_LEVEL }
    for (const [bed, gain] of this.beds) gain.gain.setTargetAtTime(this.wanted.has(bed) ? levels[bed] : 0, this.ctx.currentTime, 0.8)
  }

  private setupMusic() {
    const ctx = this.ctx!
    const music = ctx.createGain()
    music.gain.value = MUSIC_LEVEL
    // Soft lowpass and a feedback echo for a hazy room sound
    const tone = ctx.createBiquadFilter()
    tone.type = 'lowpass'
    tone.frequency.value = 1400
    const echo = ctx.createDelay(1)
    echo.delayTime.value = 0.38
    const feedback = ctx.createGain()
    feedback.gain.value = 0.35
    const wet = ctx.createGain()
    wet.gain.value = 0.4
    tone.connect(music)
    tone.connect(echo)
    echo.connect(feedback).connect(echo)
    echo.connect(wet).connect(music)
    music.connect(this.master)
    this.music = music
    this.musicIn = tone
  }

  private musicIn!: AudioNode

  private setupFire() {
    const ctx = this.ctx!
    const fire = ctx.createGain()
    fire.gain.value = 0
    fire.connect(this.master)
    this.beds.set('fire', fire)
    // Low rumble: looping noise through a lowpass
    const src = ctx.createBufferSource()
    src.buffer = this.noise
    src.loop = true
    const low = ctx.createBiquadFilter()
    low.type = 'lowpass'
    low.frequency.value = 380
    const rumble = ctx.createGain()
    rumble.gain.value = 0.5
    src.connect(low).connect(rumble).connect(fire)
    src.start()
  }

  // ---- Scheduler ---------------------------------------------------------

  private schedule() {
    const ctx = this.ctx!
    const ahead = ctx.currentTime + 0.5
    while (this.nextChord < ahead) {
      this.playChord(this.nextChord, CHORDS[this.chord])
      // A few lazy plucks on top
      for (let i = 0; i < 3; i++)
        if (Math.random() < 0.55) this.pluck(this.nextChord + 1 + i * 1.6 + Math.random() * 0.4, PENTATONIC[Math.floor(Math.random() * PENTATONIC.length)])
      this.chord = (this.chord + 1) % CHORDS.length
      this.nextChord += CHORD_SECONDS
    }
    if (this.wanted.has('fire'))
      while (this.nextCrackle < ahead) {
        this.crackle(Math.max(this.nextCrackle, ctx.currentTime))
        this.nextCrackle = Math.max(this.nextCrackle, ctx.currentTime) + 0.03 + Math.random() ** 2 * 0.5
      }
    if (this.wanted.has('garden'))
      while (this.nextBird < ahead) {
        const at = Math.max(this.nextBird, ctx.currentTime)
        if (this.night) this.crickets(at)
        else this.birdSong(at)
        this.nextBird = at + (this.night ? 1.2 + Math.random() : 2.5 + Math.random() * 5)
      }
  }

  // ---- Voices ------------------------------------------------------------

  private env(at: number, attack: number, hold: number, release: number, peak: number) {
    const g = this.ctx!.createGain()
    g.gain.setValueAtTime(0, at)
    g.gain.linearRampToValueAtTime(peak, at + attack)
    g.gain.setValueAtTime(peak, at + attack + hold)
    g.gain.exponentialRampToValueAtTime(0.0001, at + attack + hold + release)
    return g
  }

  private playChord(at: number, notes: number[]) {
    const ctx = this.ctx!
    for (const n of notes) {
      const osc = ctx.createOscillator()
      osc.type = 'triangle'
      osc.frequency.value = midi(n)
      osc.detune.value = (Math.random() - 0.5) * 12 // a little tape wobble
      const g = this.env(at, 1.8, CHORD_SECONDS - 2.5, 2.5, 0.06)
      osc.connect(g).connect(this.musicIn)
      osc.start(at)
      osc.stop(at + CHORD_SECONDS + 2)
    }
  }

  private pluck(at: number, note: number) {
    const ctx = this.ctx!
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = midi(note)
    const g = this.env(at, 0.01, 0.05, 1.4, 0.07)
    osc.connect(g).connect(this.musicIn)
    osc.start(at)
    osc.stop(at + 1.6)
  }

  private noiseBurst(at: number, dur: number, filter: BiquadFilterType, freq: number, peak: number, out: AudioNode, rate = 1) {
    const ctx = this.ctx!
    const src = ctx.createBufferSource()
    src.buffer = this.noise
    src.playbackRate.value = rate
    const f = ctx.createBiquadFilter()
    f.type = filter
    f.frequency.value = freq
    const g = this.env(at, 0.002, 0, dur, peak)
    src.connect(f).connect(g).connect(out)
    src.start(at, Math.random() * 1.5)
    src.stop(at + dur + 0.05)
  }

  private crackle(at: number) {
    const big = Math.random() < 0.15
    this.noiseBurst(at, big ? 0.06 : 0.02, 'bandpass', 1200 + Math.random() * 3000, big ? 0.9 : 0.4, this.beds.get('fire')!, 0.6 + Math.random())
  }

  private birdSong(at: number) {
    const ctx = this.ctx!
    const notes = 2 + Math.floor(Math.random() * 4)
    const base = 2600 + Math.random() * 1400
    for (let i = 0; i < notes; i++) {
      const t = at + i * (0.1 + Math.random() * 0.05)
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(base, t)
      osc.frequency.exponentialRampToValueAtTime(base * (1.2 + Math.random() * 0.4), t + 0.06)
      const g = this.env(t, 0.005, 0.03, 0.05, 0.12)
      osc.connect(g).connect(this.beds.get('garden')!)
      osc.start(t)
      osc.stop(t + 0.12)
    }
  }

  private crickets(at: number) {
    const ctx = this.ctx!
    for (let i = 0; i < 3; i++) {
      const t = at + i * 0.07
      const osc = ctx.createOscillator()
      osc.type = 'square'
      osc.frequency.value = 4400 + Math.random() * 200
      const g = this.env(t, 0.004, 0.02, 0.03, 0.025)
      osc.connect(g).connect(this.beds.get('garden')!)
      osc.start(t)
      osc.stop(t + 0.07)
    }
  }

  private knock(at: number) {
    const ctx = this.ctx!
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(160, at)
    osc.frequency.exponentialRampToValueAtTime(70, at + 0.12)
    const g = this.env(at, 0.003, 0, 0.16, 0.7)
    osc.connect(g).connect(this.master)
    osc.start(at)
    osc.stop(at + 0.2)
    this.noiseBurst(at, 0.05, 'lowpass', 900, 0.5, this.master)
  }

  private creak(at: number) {
    const ctx = this.ctx!
    const osc = ctx.createOscillator()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(220, at)
    osc.frequency.linearRampToValueAtTime(320, at + 0.25)
    osc.frequency.linearRampToValueAtTime(260, at + 0.45)
    const f = ctx.createBiquadFilter()
    f.type = 'bandpass'
    f.frequency.value = 900
    f.Q.value = 6
    const g = this.env(at, 0.05, 0.25, 0.2, 0.05)
    osc.connect(f).connect(g).connect(this.master)
    osc.start(at)
    osc.stop(at + 0.6)
  }

  private meow(at: number) {
    const ctx = this.ctx!
    const osc = ctx.createOscillator()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(520, at)
    osc.frequency.linearRampToValueAtTime(820, at + 0.15)
    osc.frequency.linearRampToValueAtTime(480, at + 0.5)
    // Two formants make the saw sound vaguely like a voice
    const out = this.env(at, 0.04, 0.3, 0.2, 0.18)
    for (const [f, q] of [[900, 4], [2400, 6]]) {
      const bp = ctx.createBiquadFilter()
      bp.type = 'bandpass'
      bp.frequency.value = f
      bp.Q.value = q
      osc.connect(bp).connect(out)
    }
    out.connect(this.master)
    osc.start(at)
    osc.stop(at + 0.6)
  }

  private woof(at: number) {
    const ctx = this.ctx!
    const osc = ctx.createOscillator()
    osc.type = 'square'
    osc.frequency.setValueAtTime(240, at)
    osc.frequency.exponentialRampToValueAtTime(110, at + 0.14)
    const f = ctx.createBiquadFilter()
    f.type = 'lowpass'
    f.frequency.value = 900
    const g = this.env(at, 0.01, 0.04, 0.1, 0.25)
    osc.connect(f).connect(g).connect(this.master)
    osc.start(at)
    osc.stop(at + 0.2)
    this.noiseBurst(at, 0.08, 'bandpass', 700, 0.3, this.master)
  }

  private blip(at: number) {
    const ctx = this.ctx!
    const osc = ctx.createOscillator()
    osc.type = 'square'
    osc.frequency.setValueAtTime(660, at)
    osc.frequency.setValueAtTime(990, at + 0.06)
    const g = this.env(at, 0.002, 0.08, 0.06, 0.05)
    osc.connect(g).connect(this.master)
    osc.start(at)
    osc.stop(at + 0.2)
  }
}
