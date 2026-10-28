import * as THREE from 'three'

export interface ScreenContent {
  title: string
  subtitle: string
  color: string
  /** Screenshot, shown pixelated. */
  image?: string | null
}

const W = 128
const H = 96
const FPS = 12
const GAME_FPS = 30

// Flappy tuning, in screen pixels and seconds
const GRAVITY = 300
const FLAP = -105
const PIPE_SPEED = 42
const PIPE_EVERY = 1.5
const PIPE_W = 12
const GAP = 32
const GROUND = H - 8
const BIRD_X = 32

interface Game {
  state: 'ready' | 'play' | 'over'
  y: number
  vy: number
  pipes: { x: number; gap: number; scored: boolean }[]
  spawn: number
  score: number
  best: number
  overAt: number
}

/** CRT screen drawn on a tiny canvas and shown with nearest-neighbour filtering. */
export class MonitorScreen {
  readonly mesh: THREE.Mesh
  private canvas = document.createElement('canvas')
  private ctx: CanvasRenderingContext2D
  private texture: THREE.CanvasTexture
  private content: ScreenContent | null = null
  private picture: HTMLImageElement | null = null
  private boot = 0
  private clock = 0
  private lastDraw = -1
  private game: Game | null = null
  private best = 0

  constructor(width: number, height: number) {
    this.canvas.width = W
    this.canvas.height = H
    this.ctx = this.canvas.getContext('2d')!
    this.texture = new THREE.CanvasTexture(this.canvas)
    this.texture.magFilter = THREE.NearestFilter
    this.texture.minFilter = THREE.NearestFilter
    this.texture.colorSpace = THREE.SRGBColorSpace
    this.mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(width, height),
      new THREE.MeshBasicMaterial({ map: this.texture, toneMapped: false }),
    )
    this.draw(0)
  }

  show(content: ScreenContent | null) {
    this.game = null
    this.content = content
    this.boot = 0
    this.picture = null
    if (content?.image) {
      const img = new Image()
      img.onload = () => {
        if (this.content === content) this.picture = img
      }
      img.src = content.image
    }
  }

  /** Switch the screen to the little Flappy game. */
  startGame() {
    this.show(null)
    this.game = { state: 'ready', y: H / 2, vy: 0, pipes: [], spawn: 0.6, score: 0, best: this.best, overAt: 0 }
  }

  get playing() {
    return !!this.game
  }

  /** Tap: start, flap, or (after a short pause) restart. */
  flap() {
    const g = this.game
    if (!g) return
    if (g.state === 'over') {
      if (this.clock - g.overAt > 0.5) this.startGame()
      return
    }
    g.state = 'play'
    g.vy = FLAP
  }

  private stepGame(dt: number) {
    const g = this.game!
    if (g.state === 'ready') {
      g.y = H / 2 + Math.sin(this.clock * 4) * 3
      return
    }
    if (g.state === 'over') {
      g.vy += GRAVITY * dt
      g.y = Math.min(GROUND - 3, g.y + g.vy * dt)
      return
    }
    g.vy += GRAVITY * dt
    g.y += g.vy * dt
    g.spawn -= dt
    if (g.spawn <= 0) {
      g.spawn = PIPE_EVERY
      g.pipes.push({ x: W, gap: 22 + Math.random() * (GROUND - 44 - GAP / 2), scored: false })
    }
    for (const p of g.pipes) {
      p.x -= PIPE_SPEED * dt
      if (!p.scored && p.x + PIPE_W < BIRD_X) {
        p.scored = true
        g.score++
      }
      const inX = BIRD_X + 3 > p.x && BIRD_X - 3 < p.x + PIPE_W
      if (inX && (g.y - 2 < p.gap - GAP / 2 || g.y + 2 > p.gap + GAP / 2)) this.gameOver()
    }
    g.pipes = g.pipes.filter((p) => p.x > -PIPE_W)
    if (g.y + 2 >= GROUND || g.y < -8) this.gameOver()
  }

  private gameOver() {
    const g = this.game!
    if (g.state === 'over') return
    g.state = 'over'
    g.overAt = this.clock
    g.vy = -40
    this.best = g.best = Math.max(g.best, g.score)
  }

  update(dt: number) {
    this.boot = Math.min(1, this.boot + dt * 3)
    this.clock += dt
    if (this.game) this.stepGame(Math.min(dt, 0.05))
    // Redraw at a low, retro frame rate (a bit smoother while playing)
    const frame = Math.floor(this.clock * (this.game ? GAME_FPS : FPS))
    if (frame !== this.lastDraw) {
      this.lastDraw = frame
      this.draw(this.clock)
    }
  }

  private text(s: string, x: number, y: number, size: number, color: string, align: CanvasTextAlign = 'center') {
    const { ctx } = this
    ctx.font = `${size}px Silkscreen, monospace`
    ctx.fillStyle = color
    ctx.textAlign = align
    ctx.textBaseline = 'top'
    ctx.fillText(s, x, y)
  }

  /** Text that scrolls sideways when it doesn't fit. */
  private marquee(s: string, y: number, size: number, color: string, t: number) {
    const { ctx } = this
    ctx.font = `${size}px Silkscreen, monospace`
    const w = ctx.measureText(s).width
    if (w <= W - 8) return this.text(s, W / 2, y, size, color)
    const gap = 24
    const x = 4 - ((t * 24) % (w + gap))
    ctx.save()
    ctx.beginPath()
    ctx.rect(2, y, W - 4, size + 2)
    ctx.clip()
    this.text(s, Math.round(x), y, size, color, 'left')
    this.text(s, Math.round(x + w + gap), y, size, color, 'left')
    ctx.restore()
  }

  private draw(t: number) {
    const { ctx, content } = this
    const blinkOn = Math.floor(t * 2) % 2 === 0
    ctx.imageSmoothingEnabled = true // average pixels when shrinking the screenshot
    ctx.fillStyle = '#0d1a24'
    ctx.fillRect(0, 0, W, H)

    // A "power on" sweep: the image opens from a horizontal line
    const open = this.boot < 1 ? Math.max(2, Math.round(H * this.boot)) : H
    ctx.save()
    ctx.beginPath()
    ctx.rect(0, (H - open) / 2, W, open)
    ctx.clip()

    if (this.game) {
      this.drawGame(t)
    } else if (!content) {
      this.text('PROJECTS', W / 2, 22, 16, '#7fe0c0')
      this.text('PICK A CARTRIDGE', W / 2, 52, 8, '#9fb8c8')
      if (blinkOn) this.text('FROM THE WALL', W / 2, 64, 8, '#9fb8c8')
    } else {
      ctx.fillStyle = content.color
      ctx.fillRect(0, 0, W, 13)
      this.text(content.subtitle, W / 2, 2, 8, '#fff6e0')

      const top = 13, bottom = H - 22
      if (this.picture) {
        // Cover-fit the screenshot into the picture area
        const area = { w: W, h: bottom - top }
        const s = Math.max(area.w / this.picture.width, area.h / this.picture.height)
        const dw = this.picture.width * s, dh = this.picture.height * s
        ctx.save()
        ctx.beginPath()
        ctx.rect(0, top, W, area.h)
        ctx.clip()
        ctx.drawImage(this.picture, (W - dw) / 2, top + (area.h - dh) / 2, dw, dh)
        ctx.restore()
      } else {
        for (let y = top; y < bottom; y += 4)
          for (let x = 0; x < W; x += 4) {
            ctx.fillStyle = (x + y) % 8 ? '#14242f' : '#1a3040'
            ctx.fillRect(x, y, 4, 4)
          }
        this.text('NO SCREENSHOT', W / 2, (top + bottom) / 2 - 4, 8, '#5d7a8a')
      }

      ctx.fillStyle = '#101820'
      ctx.fillRect(0, bottom, W, H - bottom)
      this.marquee(content.title.toUpperCase(), bottom + 3, 8, '#fff6e0', t)
      if (blinkOn) this.text('> PRESS START <', W / 2, bottom + 12, 8, '#ffd36b')
    }
    ctx.restore()

    // Scanlines + vignette
    ctx.fillStyle = 'rgba(0,0,0,0.22)'
    for (let y = 0; y < H; y += 2) ctx.fillRect(0, y, W, 1)
    const grad = ctx.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.8)
    grad.addColorStop(0, 'rgba(0,0,0,0)')
    grad.addColorStop(1, 'rgba(0,0,0,0.45)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, W, H)

    this.texture.needsUpdate = true
  }

  private drawGame(t: number) {
    const { ctx } = this
    const g = this.game!
    const sky = ctx.createLinearGradient(0, 0, 0, H)
    sky.addColorStop(0, '#16324a')
    sky.addColorStop(1, '#2e6a7a')
    ctx.fillStyle = sky
    ctx.fillRect(0, 0, W, H)
    // Parallax city and stars
    ctx.fillStyle = '#cfe8ff'
    for (let i = 0; i < 14; i++) ctx.fillRect((i * 37 + 11) % W, (i * 23 + 5) % 40, 1, 1)
    ctx.fillStyle = '#1f4a5c'
    const off = (t * 8) % 16
    for (let x = -16; x < W + 16; x += 16) {
      const h = 10 + ((x / 16 + 7) * 13) % 14
      ctx.fillRect(Math.round(x - off), GROUND - h, 14, h)
    }
    // Pipes with caps
    for (const p of g.pipes) {
      const x = Math.round(p.x)
      const top = Math.round(p.gap - GAP / 2), bottom = Math.round(p.gap + GAP / 2)
      ctx.fillStyle = '#5dbb4a'
      ctx.fillRect(x, 0, PIPE_W, top)
      ctx.fillRect(x, bottom, PIPE_W, GROUND - bottom)
      ctx.fillStyle = '#3d8a33'
      ctx.fillRect(x - 1, top - 4, PIPE_W + 2, 4)
      ctx.fillRect(x - 1, bottom, PIPE_W + 2, 4)
      ctx.fillRect(x + PIPE_W - 3, 0, 2, top - 4)
      ctx.fillRect(x + PIPE_W - 3, bottom + 4, 2, GROUND - bottom - 4)
    }
    // Ground
    ctx.fillStyle = '#c9a25a'
    ctx.fillRect(0, GROUND, W, H - GROUND)
    ctx.fillStyle = '#a07c3c'
    const gOff = g.state === 'play' ? (t * PIPE_SPEED) % 8 : 0
    for (let x = -8; x < W + 8; x += 8) ctx.fillRect(Math.round(x - gOff), GROUND + 2, 4, 2)
    // Bird
    const bx = BIRD_X - 3, by = Math.round(g.y) - 2
    ctx.fillStyle = '#ffd36b'
    ctx.fillRect(bx, by, 7, 5)
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(bx + 4, by, 2, 2)
    ctx.fillStyle = '#1a1a1e'
    ctx.fillRect(bx + 5, by + 1, 1, 1)
    ctx.fillStyle = '#ff8a3a'
    ctx.fillRect(bx + 7, by + 2, 2, 2)
    ctx.fillStyle = '#e8b040'
    ctx.fillRect(bx + 1, by + (Math.floor(t * 12) % 2 && g.state !== 'over' ? 1 : 3), 3, 2)

    const blinkOn = Math.floor(t * 2) % 2 === 0
    if (g.state === 'ready') {
      this.text('FLAPPY VOXEL', W / 2, 14, 8, '#fff6e0')
      if (blinkOn) this.text('CLICK OR SPACE', W / 2, 62, 8, '#ffd36b')
    } else {
      this.text(String(g.score), W / 2, 6, 16, '#fff6e0')
    }
    if (g.state === 'over') {
      ctx.fillStyle = 'rgba(10,16,24,0.6)'
      ctx.fillRect(14, 30, W - 28, 34)
      this.text('GAME OVER', W / 2, 34, 8, '#ff8a7a')
      this.text(`SCORE ${g.score}  BEST ${g.best}`, W / 2, 45, 8, '#fff6e0')
      if (blinkOn) this.text('TAP TO RETRY', W / 2, 55, 8, '#ffd36b')
    }
  }

  dispose() {
    this.texture.dispose()
    this.mesh.geometry.dispose()
    ;(this.mesh.material as THREE.Material).dispose()
  }
}
