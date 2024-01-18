import Parser from 'rss-parser'
import RssParser from 'rss-parser'
import dayjs from 'dayjs'
import jsdom from 'jsdom'

export default defineEventHandler(async (event) => {
  const $storage = useStorage()
  const $config = useRuntimeConfig()

  let getItems = (type: string) => $storage.getItem(`feeds_${type}`) as Promise<RssParser.Output<unknown>>

  const getFeed = async (type: 'medium'|'static') => {
    const configUrl = ($config.feed.sources as any)[type]?.url
    const configUpdateInterval = ($config.feed.sources as any)[type]?.updateInterval || 60 * 1000

    if (!configUrl) return false

    let fromStorage = true
    let items = await getItems(type)
    let lastUpdated: dayjs.Dayjs | null = await $storage.getItem(`feeds_${type}_last_updated`)

    // need update if lastUpdated not null and now - lastUpdated > configUpdateInterval
    let needUpdate = lastUpdated && dayjs().diff(dayjs(lastUpdated), 'millisecond') > configUpdateInterval
    
    if (!items || items == null || needUpdate) {
      fromStorage = false
      const parser = new RssParser({})
      const feeds: RssParser.Output<unknown> = await parser.parseURL(configUrl)
      lastUpdated = dayjs()


      // get img
      for (const item of feeds.items) {
        const dom = new jsdom.JSDOM((item as any)['content:encoded'])
        const img = dom.window.document.querySelector('img')?.src
        Object.assign(item, { img })
      }

      await $storage.setItem(`feeds_${type}`, feeds)
      await $storage.setItem(`feeds_${type}_last_updated`, lastUpdated.toISOString())
      items = feeds
    }

    return {
      fromStorage,
      feed: items,
      lastUpdated,
      typeName: ($config.feed.sources as any)[type]?.name,
    }
  }

  const data: {
    fromStorage: boolean
    lastUpdated: dayjs.Dayjs | null
    typeName: string
    type: string
    feed: RssParser.Output<unknown>
  }[] = []
  const allowedTypes = $config.feed.active || [] as string[]
  for (const type of allowedTypes) {
    const feed = await getFeed(type as any)
    if (!feed) continue
    data.push({
      ...feed,
      type,
    })
  }

  return {
    ok: true,
    message: '🚀',
    data
  }
})