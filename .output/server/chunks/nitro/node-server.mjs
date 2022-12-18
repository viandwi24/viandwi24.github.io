globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import 'node-fetch-native/polyfill';
import { Server as Server$1 } from 'http';
import { Server } from 'https';
import destr from 'destr';
import { eventHandler, setHeaders, sendRedirect, defineEventHandler, handleCacheHeaders, createEvent, getRequestHeader, getRequestHeaders, setResponseHeader, createError, createApp, createRouter as createRouter$1, lazyEventHandler, toNodeListener } from 'h3';
import { createFetch as createFetch$1, Headers } from 'ofetch';
import { createCall, createFetch } from 'unenv/runtime/fetch/index';
import { createHooks } from 'hookable';
import { snakeCase } from 'scule';
import { hash } from 'ohash';
import { parseURL, withQuery, joinURL, withLeadingSlash, withoutTrailingSlash } from 'ufo';
import { createStorage } from 'unstorage';
import defu from 'defu';
import { toRouteMatcher, createRouter } from 'radix3';
import { promises } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'pathe';

const _runtimeConfig = {"app":{"baseURL":"/","buildAssetsDir":"/_nuxt/","cdnURL":""},"nitro":{"routeRules":{"/__nuxt_error":{"cache":false}},"envPrefix":"NUXT_"},"public":{}};
const ENV_PREFIX = "NITRO_";
const ENV_PREFIX_ALT = _runtimeConfig.nitro.envPrefix ?? process.env.NITRO_ENV_PREFIX ?? "_";
const getEnv = (key) => {
  const envKey = snakeCase(key).toUpperCase();
  return destr(process.env[ENV_PREFIX + envKey] ?? process.env[ENV_PREFIX_ALT + envKey]);
};
function isObject(input) {
  return typeof input === "object" && !Array.isArray(input);
}
function overrideConfig(obj, parentKey = "") {
  for (const key in obj) {
    const subKey = parentKey ? `${parentKey}_${key}` : key;
    const envValue = getEnv(subKey);
    if (isObject(obj[key])) {
      if (isObject(envValue)) {
        obj[key] = { ...obj[key], ...envValue };
      }
      overrideConfig(obj[key], subKey);
    } else {
      obj[key] = envValue ?? obj[key];
    }
  }
}
overrideConfig(_runtimeConfig);
const config$1 = deepFreeze(_runtimeConfig);
const useRuntimeConfig = () => config$1;
function deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object);
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === "object") {
      deepFreeze(value);
    }
  }
  return Object.freeze(object);
}

const globalTiming = globalThis.__timing__ || {
  start: () => 0,
  end: () => 0,
  metrics: []
};
const timingMiddleware = eventHandler((event) => {
  const start = globalTiming.start();
  const _end = event.res.end;
  event.res.end = function(chunk, encoding, cb) {
    const metrics = [["Generate", globalTiming.end(start)], ...globalTiming.metrics];
    const serverTiming = metrics.map((m) => `-;dur=${m[1]};desc="${encodeURIComponent(m[0])}"`).join(", ");
    if (!event.res.headersSent) {
      event.res.setHeader("Server-Timing", serverTiming);
    }
    _end.call(event.res, chunk, encoding, cb);
    return this;
  }.bind(event.res);
});

const _assets = {

};

function normalizeKey(key) {
  if (!key) {
    return "";
  }
  return key.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "");
}

const assets$1 = {
  getKeys() {
    return Promise.resolve(Object.keys(_assets))
  },
  hasItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(id in _assets)
  },
  getItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].import() : null)
  },
  getMeta (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].meta : {})
  }
};

const storage = createStorage({});

const useStorage = () => storage;

storage.mount('/assets', assets$1);

const config = useRuntimeConfig();
const _routeRulesMatcher = toRouteMatcher(createRouter({ routes: config.nitro.routeRules }));
function createRouteRulesHandler() {
  return eventHandler((event) => {
    const routeRules = getRouteRules(event);
    if (routeRules.headers) {
      setHeaders(event, routeRules.headers);
    }
    if (routeRules.redirect) {
      return sendRedirect(event, routeRules.redirect.to, routeRules.redirect.statusCode);
    }
  });
}
function getRouteRules(event) {
  event.context._nitro = event.context._nitro || {};
  if (!event.context._nitro.routeRules) {
    const path = new URL(event.req.url, "http://localhost").pathname;
    event.context._nitro.routeRules = getRouteRulesForPath(path);
  }
  return event.context._nitro.routeRules;
}
function getRouteRulesForPath(path) {
  return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
}

const defaultCacheOptions = {
  name: "_",
  base: "/cache",
  swr: true,
  maxAge: 1
};
function defineCachedFunction(fn, opts) {
  opts = { ...defaultCacheOptions, ...opts };
  const pending = {};
  const group = opts.group || "nitro";
  const name = opts.name || fn.name || "_";
  const integrity = hash([opts.integrity, fn, opts]);
  const validate = opts.validate || (() => true);
  async function get(key, resolver) {
    const cacheKey = [opts.base, group, name, key + ".json"].filter(Boolean).join(":").replace(/:\/$/, ":index");
    const entry = await useStorage().getItem(cacheKey) || {};
    const ttl = (opts.maxAge ?? opts.maxAge ?? 0) * 1e3;
    if (ttl) {
      entry.expires = Date.now() + ttl;
    }
    const expired = entry.integrity !== integrity || ttl && Date.now() - (entry.mtime || 0) > ttl || !validate(entry);
    const _resolve = async () => {
      if (!pending[key]) {
        entry.value = void 0;
        entry.integrity = void 0;
        entry.mtime = void 0;
        entry.expires = void 0;
        pending[key] = Promise.resolve(resolver());
      }
      entry.value = await pending[key];
      entry.mtime = Date.now();
      entry.integrity = integrity;
      delete pending[key];
      if (validate(entry)) {
        useStorage().setItem(cacheKey, entry).catch((error) => console.error("[nitro] [cache]", error));
      }
    };
    const _resolvePromise = expired ? _resolve() : Promise.resolve();
    if (opts.swr && entry.value) {
      _resolvePromise.catch(console.error);
      return Promise.resolve(entry);
    }
    return _resolvePromise.then(() => entry);
  }
  return async (...args) => {
    const key = (opts.getKey || getKey)(...args);
    const entry = await get(key, () => fn(...args));
    let value = entry.value;
    if (opts.transform) {
      value = await opts.transform(entry, ...args) || value;
    }
    return value;
  };
}
const cachedFunction = defineCachedFunction;
function getKey(...args) {
  return args.length ? hash(args, {}) : "";
}
function defineCachedEventHandler(handler, opts = defaultCacheOptions) {
  const _opts = {
    ...opts,
    getKey: (event) => {
      const url = event.req.originalUrl || event.req.url;
      const friendlyName = decodeURI(parseURL(url).pathname).replace(/[^a-zA-Z0-9]/g, "").substring(0, 16);
      const urlHash = hash(url);
      return `${friendlyName}.${urlHash}`;
    },
    validate: (entry) => {
      if (entry.value.code >= 400) {
        return false;
      }
      if (entry.value.body === void 0) {
        return false;
      }
      return true;
    },
    group: opts.group || "nitro/handlers",
    integrity: [
      opts.integrity,
      handler
    ]
  };
  const _cachedHandler = cachedFunction(async (incomingEvent) => {
    const reqProxy = cloneWithProxy(incomingEvent.req, { headers: {} });
    const resHeaders = {};
    let _resSendBody;
    const resProxy = cloneWithProxy(incomingEvent.res, {
      statusCode: 200,
      getHeader(name) {
        return resHeaders[name];
      },
      setHeader(name, value) {
        resHeaders[name] = value;
        return this;
      },
      getHeaderNames() {
        return Object.keys(resHeaders);
      },
      hasHeader(name) {
        return name in resHeaders;
      },
      removeHeader(name) {
        delete resHeaders[name];
      },
      getHeaders() {
        return resHeaders;
      },
      end(chunk, arg2, arg3) {
        if (typeof chunk === "string") {
          _resSendBody = chunk;
        }
        if (typeof arg2 === "function") {
          arg2();
        }
        if (typeof arg3 === "function") {
          arg3();
        }
        return this;
      },
      write(chunk, arg2, arg3) {
        if (typeof chunk === "string") {
          _resSendBody = chunk;
        }
        if (typeof arg2 === "function") {
          arg2();
        }
        if (typeof arg3 === "function") {
          arg3();
        }
        return this;
      },
      writeHead(statusCode, headers2) {
        this.statusCode = statusCode;
        if (headers2) {
          for (const header in headers2) {
            this.setHeader(header, headers2[header]);
          }
        }
        return this;
      }
    });
    const event = createEvent(reqProxy, resProxy);
    event.context = incomingEvent.context;
    const body = await handler(event) || _resSendBody;
    const headers = event.res.getHeaders();
    headers.etag = headers.Etag || headers.etag || `W/"${hash(body)}"`;
    headers["last-modified"] = headers["Last-Modified"] || headers["last-modified"] || new Date().toUTCString();
    const cacheControl = [];
    if (opts.swr) {
      if (opts.maxAge) {
        cacheControl.push(`s-maxage=${opts.maxAge}`);
      }
      if (opts.staleMaxAge) {
        cacheControl.push(`stale-while-revalidate=${opts.staleMaxAge}`);
      } else {
        cacheControl.push("stale-while-revalidate");
      }
    } else if (opts.maxAge) {
      cacheControl.push(`max-age=${opts.maxAge}`);
    }
    if (cacheControl.length) {
      headers["cache-control"] = cacheControl.join(", ");
    }
    const cacheEntry = {
      code: event.res.statusCode,
      headers,
      body
    };
    return cacheEntry;
  }, _opts);
  return defineEventHandler(async (event) => {
    if (opts.headersOnly) {
      if (handleCacheHeaders(event, { maxAge: opts.maxAge })) {
        return;
      }
      return handler(event);
    }
    const response = await _cachedHandler(event);
    if (event.res.headersSent || event.res.writableEnded) {
      return response.body;
    }
    if (handleCacheHeaders(event, {
      modifiedTime: new Date(response.headers["last-modified"]),
      etag: response.headers.etag,
      maxAge: opts.maxAge
    })) {
      return;
    }
    event.res.statusCode = response.code;
    for (const name in response.headers) {
      event.res.setHeader(name, response.headers[name]);
    }
    return response.body;
  });
}
function cloneWithProxy(obj, overrides) {
  return new Proxy(obj, {
    get(target, property, receiver) {
      if (property in overrides) {
        return overrides[property];
      }
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      if (property in overrides) {
        overrides[property] = value;
        return true;
      }
      return Reflect.set(target, property, value, receiver);
    }
  });
}
const cachedEventHandler = defineCachedEventHandler;

const plugins = [
  
];

function hasReqHeader(event, name, includes) {
  const value = getRequestHeader(event, name);
  return value && typeof value === "string" && value.toLowerCase().includes(includes);
}
function isJsonRequest(event) {
  return hasReqHeader(event, "accept", "application/json") || hasReqHeader(event, "user-agent", "curl/") || hasReqHeader(event, "user-agent", "httpie/") || event.req.url?.endsWith(".json") || event.req.url?.includes("/api/");
}
function normalizeError(error) {
  const cwd = process.cwd();
  const stack = (error.stack || "").split("\n").splice(1).filter((line) => line.includes("at ")).map((line) => {
    const text = line.replace(cwd + "/", "./").replace("webpack:/", "").replace("file://", "").trim();
    return {
      text,
      internal: line.includes("node_modules") && !line.includes(".cache") || line.includes("internal") || line.includes("new Promise")
    };
  });
  const statusCode = error.statusCode || 500;
  const statusMessage = error.statusMessage ?? (statusCode === 404 ? "Not Found" : "");
  const message = error.message || error.toString();
  return {
    stack,
    statusCode,
    statusMessage,
    message
  };
}

const errorHandler = (async function errorhandler(error, event) {
  const { stack, statusCode, statusMessage, message } = normalizeError(error);
  const errorObject = {
    url: event.node.req.url,
    statusCode,
    statusMessage,
    message,
    stack: "",
    data: error.data
  };
  event.node.res.statusCode = errorObject.statusCode !== 200 && errorObject.statusCode || 500;
  if (errorObject.statusMessage) {
    event.node.res.statusMessage = errorObject.statusMessage;
  }
  if (error.unhandled || error.fatal) {
    const tags = [
      "[nuxt]",
      "[request error]",
      error.unhandled && "[unhandled]",
      error.fatal && "[fatal]",
      Number(errorObject.statusCode) !== 200 && `[${errorObject.statusCode}]`
    ].filter(Boolean).join(" ");
    console.error(tags, errorObject.message + "\n" + stack.map((l) => "  " + l.text).join("  \n"));
  }
  if (isJsonRequest(event)) {
    event.node.res.setHeader("Content-Type", "application/json");
    event.node.res.end(JSON.stringify(errorObject));
    return;
  }
  const isErrorPage = event.node.req.url?.startsWith("/__nuxt_error");
  const res = !isErrorPage ? await useNitroApp().localFetch(withQuery(joinURL(useRuntimeConfig().app.baseURL, "/__nuxt_error"), errorObject), {
    headers: getRequestHeaders(event),
    redirect: "manual"
  }).catch(() => null) : null;
  if (!res) {
    const { template } = await import('../error-500.mjs');
    event.node.res.setHeader("Content-Type", "text/html;charset=UTF-8");
    event.node.res.end(template(errorObject));
    return;
  }
  for (const [header, value] of res.headers.entries()) {
    setResponseHeader(event, header, value);
  }
  if (res.status && res.status !== 200) {
    event.node.res.statusCode = res.status;
  }
  if (res.statusText) {
    event.node.res.statusMessage = res.statusText;
  }
  event.node.res.end(await res.text());
});

const assets = {
  "/mypic.jpg": {
    "type": "image/jpeg",
    "etag": "\"3666ce-5v8m/bZrTqWhO5w9bDiLroiez/U\"",
    "mtime": "2022-12-18T11:20:22.885Z",
    "size": 3565262,
    "path": "../public/mypic.jpg"
  },
  "/projects.json": {
    "type": "application/json",
    "etag": "\"6ad-SdP6ITZRAYBE86fZgDyrCC99v0M\"",
    "mtime": "2022-12-18T11:20:22.875Z",
    "size": 1709,
    "path": "../public/projects.json"
  },
  "/scene.splinecode": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"67e915-Yl1PcZ27cDXvrAbp3G3SFeO896A\"",
    "mtime": "2022-12-18T11:20:22.875Z",
    "size": 6809877,
    "path": "../public/scene.splinecode"
  },
  "/scene_2.splinecode": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"67ea06-BK8UR30OZwYmuAXCldX3cYjeXqo\"",
    "mtime": "2022-12-18T11:20:22.865Z",
    "size": 6810118,
    "path": "../public/scene_2.splinecode"
  },
  "/_nuxt/_plugin-vue_export-helper.a1a6add7.js": {
    "type": "application/javascript",
    "etag": "\"5b-eFCz/UrraTh721pgAl0VxBNR1es\"",
    "mtime": "2022-12-18T11:20:22.855Z",
    "size": 91,
    "path": "../public/_nuxt/_plugin-vue_export-helper.a1a6add7.js"
  },
  "/_nuxt/about.0b6c783d.js": {
    "type": "application/javascript",
    "etag": "\"9af-zHqxhAdbrr1o8fo9RXIinyQ0O+o\"",
    "mtime": "2022-12-18T11:20:22.855Z",
    "size": 2479,
    "path": "../public/_nuxt/about.0b6c783d.js"
  },
  "/_nuxt/boolean.f5249358.js": {
    "type": "application/javascript",
    "etag": "\"f605-h0kMvWEDhooDf9An9TBKuT3Uq/U\"",
    "mtime": "2022-12-18T11:20:22.855Z",
    "size": 62981,
    "path": "../public/_nuxt/boolean.f5249358.js"
  },
  "/_nuxt/bootstrap-icons.966620f9.woff2": {
    "type": "font/woff2",
    "etag": "\"1d9d0-F9rQd2iZrRvq2r0GHDTioiss3nQ\"",
    "mtime": "2022-12-18T11:20:22.855Z",
    "size": 121296,
    "path": "../public/_nuxt/bootstrap-icons.966620f9.woff2"
  },
  "/_nuxt/bootstrap-icons.c6569d46.woff": {
    "type": "font/woff",
    "etag": "\"28200-dZGccXzlxbxxa8UXBcDNC2D0v/w\"",
    "mtime": "2022-12-18T11:20:22.855Z",
    "size": 164352,
    "path": "../public/_nuxt/bootstrap-icons.c6569d46.woff"
  },
  "/_nuxt/composables.9beb56fc.js": {
    "type": "application/javascript",
    "etag": "\"61-0F1CRFyFp/QEGcN462ZjsUJtaMc\"",
    "mtime": "2022-12-18T11:20:22.855Z",
    "size": 97,
    "path": "../public/_nuxt/composables.9beb56fc.js"
  },
  "/_nuxt/contact.e71d5d4a.js": {
    "type": "application/javascript",
    "etag": "\"623-O20sTIZcyqm+OB0XKUOpBkoDt7I\"",
    "mtime": "2022-12-18T11:20:22.855Z",
    "size": 1571,
    "path": "../public/_nuxt/contact.e71d5d4a.js"
  },
  "/_nuxt/default.9a15f5cd.js": {
    "type": "application/javascript",
    "etag": "\"1256-sKvNSbCOEHL/pLgpPX9feKQ93lY\"",
    "mtime": "2022-12-18T11:20:22.855Z",
    "size": 4694,
    "path": "../public/_nuxt/default.9a15f5cd.js"
  },
  "/_nuxt/entry.6f750b67.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"44aa6-ufCzfCvCFmrdi04sz94iS9UqLjc\"",
    "mtime": "2022-12-18T11:20:22.855Z",
    "size": 281254,
    "path": "../public/_nuxt/entry.6f750b67.css"
  },
  "/_nuxt/entry.a487ca13.js": {
    "type": "application/javascript",
    "etag": "\"36152-A++sJhL5N8/sTK5ayJNt434ppas\"",
    "mtime": "2022-12-18T11:20:22.855Z",
    "size": 221522,
    "path": "../public/_nuxt/entry.a487ca13.js"
  },
  "/_nuxt/error-404.a19a4ebd.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e2e-Biz3UmLM4pDQQdZXLGDfmoUEaOU\"",
    "mtime": "2022-12-18T11:20:22.855Z",
    "size": 3630,
    "path": "../public/_nuxt/error-404.a19a4ebd.css"
  },
  "/_nuxt/error-404.c9b935fd.js": {
    "type": "application/javascript",
    "etag": "\"909-FdiHN0FpAKelL6k4lxNTbxnlCoM\"",
    "mtime": "2022-12-18T11:20:22.855Z",
    "size": 2313,
    "path": "../public/_nuxt/error-404.c9b935fd.js"
  },
  "/_nuxt/error-500.46283c21.js": {
    "type": "application/javascript",
    "etag": "\"7b2-Fgz8yO6ZEqTVUUwFd9hwayAwN/s\"",
    "mtime": "2022-12-18T11:20:22.855Z",
    "size": 1970,
    "path": "../public/_nuxt/error-500.46283c21.js"
  },
  "/_nuxt/error-500.aa2df86e.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"79e-D/2zsEwvTXFiUxPorkqTKsnAmhA\"",
    "mtime": "2022-12-18T11:20:22.855Z",
    "size": 1950,
    "path": "../public/_nuxt/error-500.aa2df86e.css"
  },
  "/_nuxt/error-component.a1011e42.js": {
    "type": "application/javascript",
    "etag": "\"501-TctPv2WXxPqjWkaYKWED+WY7QV4\"",
    "mtime": "2022-12-18T11:20:22.855Z",
    "size": 1281,
    "path": "../public/_nuxt/error-component.a1011e42.js"
  },
  "/_nuxt/experience.cb111627.js": {
    "type": "application/javascript",
    "etag": "\"17c6-RKQgqpFwDovFnCIIUHMi0Qz3gQU\"",
    "mtime": "2022-12-18T11:20:22.845Z",
    "size": 6086,
    "path": "../public/_nuxt/experience.cb111627.js"
  },
  "/_nuxt/index.4276366d.js": {
    "type": "application/javascript",
    "etag": "\"821-a17vKIjWtx01jkpIOGtqOAgGX4I\"",
    "mtime": "2022-12-18T11:20:22.845Z",
    "size": 2081,
    "path": "../public/_nuxt/index.4276366d.js"
  },
  "/_nuxt/opentype.61c1da5b.js": {
    "type": "application/javascript",
    "etag": "\"2b451-yZMPlETty7OFv9RD4EtoynxXm/M\"",
    "mtime": "2022-12-18T11:20:22.845Z",
    "size": 177233,
    "path": "../public/_nuxt/opentype.61c1da5b.js"
  },
  "/_nuxt/physics.f92eeeac.js": {
    "type": "application/javascript",
    "etag": "\"1cfea4-h19OHHM8KO2452xf7VA0s/CaOAs\"",
    "mtime": "2022-12-18T11:20:22.845Z",
    "size": 1900196,
    "path": "../public/_nuxt/physics.f92eeeac.js"
  },
  "/_nuxt/process.48a802fa.js": {
    "type": "application/javascript",
    "etag": "\"121c9-Eg6n/5yexp2v/M2Ar1wX5IADB6k\"",
    "mtime": "2022-12-18T11:20:22.845Z",
    "size": 74185,
    "path": "../public/_nuxt/process.48a802fa.js"
  },
  "/_nuxt/projects.8ad3df57.js": {
    "type": "application/javascript",
    "etag": "\"c4f-nbs1VYpS+rUYm8Myc27QGGTfsiI\"",
    "mtime": "2022-12-18T11:20:22.845Z",
    "size": 3151,
    "path": "../public/_nuxt/projects.8ad3df57.js"
  },
  "/_nuxt/runtime.2bd0c8a9.js": {
    "type": "application/javascript",
    "etag": "\"151615-u6OLOpUrsA6hPZjEBNz8+Ne9ve4\"",
    "mtime": "2022-12-18T11:20:22.845Z",
    "size": 1381909,
    "path": "../public/_nuxt/runtime.2bd0c8a9.js"
  },
  "/images/projects/1.png": {
    "type": "image/png",
    "etag": "\"87bde-F+wbXApjflMt6NLn1W0ZJU1+Wyc\"",
    "mtime": "2022-12-18T11:20:22.905Z",
    "size": 555998,
    "path": "../public/images/projects/1.png"
  },
  "/images/projects/2.gif": {
    "type": "image/gif",
    "etag": "\"fc5b79-tAGaMguLMEGAdO9MbpykENzvqqY\"",
    "mtime": "2022-12-18T11:20:22.905Z",
    "size": 16538489,
    "path": "../public/images/projects/2.gif"
  },
  "/images/projects/2.png": {
    "type": "image/png",
    "etag": "\"60f4b-o7ttGmKy85bGMJ5htjKgWCO75Js\"",
    "mtime": "2022-12-18T11:20:22.895Z",
    "size": 397131,
    "path": "../public/images/projects/2.png"
  },
  "/images/projects/3.gif": {
    "type": "image/gif",
    "etag": "\"14d62d-rLJitim5HtDF4pdRgxag3YsE3Y8\"",
    "mtime": "2022-12-18T11:20:22.885Z",
    "size": 1365549,
    "path": "../public/images/projects/3.gif"
  },
  "/images/projects/4.png": {
    "type": "image/png",
    "etag": "\"107d2e-TbYrqwg9bRrdcgkm1QzRRHKA1oA\"",
    "mtime": "2022-12-18T11:20:22.885Z",
    "size": 1080622,
    "path": "../public/images/projects/4.png"
  }
};

function readAsset (id) {
  const serverDir = dirname(fileURLToPath(globalThis._importMeta_.url));
  return promises.readFile(resolve(serverDir, assets[id].path))
}

const publicAssetBases = [];

function isPublicAssetURL(id = '') {
  if (assets[id]) {
    return true
  }
  for (const base of publicAssetBases) {
    if (id.startsWith(base)) { return true }
  }
  return false
}

function getAsset (id) {
  return assets[id]
}

const METHODS = ["HEAD", "GET"];
const EncodingMap = { gzip: ".gz", br: ".br" };
const _f4b49z = eventHandler((event) => {
  if (event.req.method && !METHODS.includes(event.req.method)) {
    return;
  }
  let id = decodeURIComponent(withLeadingSlash(withoutTrailingSlash(parseURL(event.req.url).pathname)));
  let asset;
  const encodingHeader = String(event.req.headers["accept-encoding"] || "");
  const encodings = encodingHeader.split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort().concat([""]);
  if (encodings.length > 1) {
    event.res.setHeader("Vary", "Accept-Encoding");
  }
  for (const encoding of encodings) {
    for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
      const _asset = getAsset(_id);
      if (_asset) {
        asset = _asset;
        id = _id;
        break;
      }
    }
  }
  if (!asset) {
    if (isPublicAssetURL(id)) {
      throw createError({
        statusMessage: "Cannot find static asset " + id,
        statusCode: 404
      });
    }
    return;
  }
  const ifNotMatch = event.req.headers["if-none-match"] === asset.etag;
  if (ifNotMatch) {
    event.res.statusCode = 304;
    event.res.end();
    return;
  }
  const ifModifiedSinceH = event.req.headers["if-modified-since"];
  if (ifModifiedSinceH && asset.mtime) {
    if (new Date(ifModifiedSinceH) >= new Date(asset.mtime)) {
      event.res.statusCode = 304;
      event.res.end();
      return;
    }
  }
  if (asset.type && !event.res.getHeader("Content-Type")) {
    event.res.setHeader("Content-Type", asset.type);
  }
  if (asset.etag && !event.res.getHeader("ETag")) {
    event.res.setHeader("ETag", asset.etag);
  }
  if (asset.mtime && !event.res.getHeader("Last-Modified")) {
    event.res.setHeader("Last-Modified", asset.mtime);
  }
  if (asset.encoding && !event.res.getHeader("Content-Encoding")) {
    event.res.setHeader("Content-Encoding", asset.encoding);
  }
  if (asset.size && !event.res.getHeader("Content-Length")) {
    event.res.setHeader("Content-Length", asset.size);
  }
  return readAsset(id);
});

const _lazy_WmxVNF = () => import('../handlers/renderer.mjs');

const handlers = [
  { route: '', handler: _f4b49z, lazy: false, middleware: true, method: undefined },
  { route: '/__nuxt_error', handler: _lazy_WmxVNF, lazy: true, middleware: false, method: undefined },
  { route: '/**', handler: _lazy_WmxVNF, lazy: true, middleware: false, method: undefined }
];

function createNitroApp() {
  const config = useRuntimeConfig();
  const hooks = createHooks();
  const h3App = createApp({
    debug: destr(false),
    onError: errorHandler
  });
  h3App.use(config.app.baseURL, timingMiddleware);
  const router = createRouter$1();
  h3App.use(createRouteRulesHandler());
  for (const h of handlers) {
    let handler = h.lazy ? lazyEventHandler(h.handler) : h.handler;
    if (h.middleware || !h.route) {
      const middlewareBase = (config.app.baseURL + (h.route || "/")).replace(/\/+/g, "/");
      h3App.use(middlewareBase, handler);
    } else {
      const routeRules = getRouteRulesForPath(h.route.replace(/:\w+|\*\*/g, "_"));
      if (routeRules.cache) {
        handler = cachedEventHandler(handler, {
          group: "nitro/routes",
          ...routeRules.cache
        });
      }
      router.use(h.route, handler, h.method);
    }
  }
  h3App.use(config.app.baseURL, router);
  const localCall = createCall(toNodeListener(h3App));
  const localFetch = createFetch(localCall, globalThis.fetch);
  const $fetch = createFetch$1({ fetch: localFetch, Headers, defaults: { baseURL: config.app.baseURL } });
  globalThis.$fetch = $fetch;
  const app = {
    hooks,
    h3App,
    router,
    localCall,
    localFetch
  };
  for (const plugin of plugins) {
    plugin(app);
  }
  return app;
}
const nitroApp = createNitroApp();
const useNitroApp = () => nitroApp;

const cert = process.env.NITRO_SSL_CERT;
const key = process.env.NITRO_SSL_KEY;
const server = cert && key ? new Server({ key, cert }, toNodeListener(nitroApp.h3App)) : new Server$1(toNodeListener(nitroApp.h3App));
const port = destr(process.env.NITRO_PORT || process.env.PORT) || 3e3;
const host = process.env.NITRO_HOST || process.env.HOST;
const s = server.listen(port, host, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  const protocol = cert && key ? "https" : "http";
  const i = s.address();
  const baseURL = (useRuntimeConfig().app.baseURL || "").replace(/\/$/, "");
  const url = `${protocol}://${i.family === "IPv6" ? `[${i.address}]` : i.address}:${i.port}${baseURL}`;
  console.log(`Listening ${url}`);
});
{
  process.on("unhandledRejection", (err) => console.error("[nitro] [dev] [unhandledRejection] " + err));
  process.on("uncaughtException", (err) => console.error("[nitro] [dev] [uncaughtException] " + err));
}
const nodeServer = {};

export { useRuntimeConfig as a, getRouteRules as g, nodeServer as n, useNitroApp as u };
//# sourceMappingURL=node-server.mjs.map
