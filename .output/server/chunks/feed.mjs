import { d as defineEventHandler, u as useStorage, a as useRuntimeConfig } from './nitro/node-server.mjs';
import RssParser from 'rss-parser';
import dayjs from 'dayjs';
import jsdom from 'jsdom';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import 'vue';
import 'node:fs';
import 'node:url';
import 'ipx';

const feed = defineEventHandler(async (event) => {
  const $storage = useStorage();
  const $config = useRuntimeConfig();
  let getItems = (type) => $storage.getItem(`feeds_${type}`);
  const getFeed = async (type) => {
    var _a, _b, _c, _d;
    const configUrl = (_a = $config.feed.sources[type]) == null ? void 0 : _a.url;
    const configUpdateInterval = ((_b = $config.feed.sources[type]) == null ? void 0 : _b.updateInterval) || 60 * 1e3;
    if (!configUrl)
      return false;
    let fromStorage = true;
    let items = await getItems(type);
    let lastUpdated = await $storage.getItem(`feeds_${type}_last_updated`);
    let needUpdate = lastUpdated && dayjs().diff(dayjs(lastUpdated), "millisecond") > configUpdateInterval;
    if (!items || items == null || needUpdate) {
      fromStorage = false;
      const parser = new RssParser({});
      const feeds = await parser.parseURL(configUrl);
      lastUpdated = dayjs();
      for (const item of feeds.items) {
        const dom = new jsdom.JSDOM(item["content:encoded"]);
        const img = (_c = dom.window.document.querySelector("img")) == null ? void 0 : _c.src;
        Object.assign(item, { img });
      }
      await $storage.setItem(`feeds_${type}`, feeds);
      await $storage.setItem(`feeds_${type}_last_updated`, lastUpdated.toISOString());
      items = feeds;
    }
    return {
      fromStorage,
      feed: items,
      lastUpdated,
      typeName: (_d = $config.feed.sources[type]) == null ? void 0 : _d.name
    };
  };
  const data = [];
  const allowedTypes = $config.feed.active || [];
  for (const type of allowedTypes) {
    const feed = await getFeed(type);
    if (!feed)
      continue;
    data.push({
      ...feed,
      type
    });
  }
  return {
    ok: true,
    message: "\u{1F680}",
    data
  };
});

export { feed as default };
//# sourceMappingURL=feed.mjs.map
