globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import 'node-fetch-native/polyfill';
import { Server as Server$1 } from 'node:http';
import { Server } from 'node:https';
import destr from 'destr';
import { defineEventHandler, handleCacheHeaders, createEvent, eventHandler, setHeaders, sendRedirect, proxyRequest, getRequestHeader, setResponseStatus, setResponseHeader, getRequestHeaders, createError, createApp, createRouter as createRouter$1, toNodeListener, fetchWithEvent, lazyEventHandler } from 'h3';
import { createFetch as createFetch$1, Headers } from 'ofetch';
import { createCall, createFetch } from 'unenv/runtime/fetch/index';
import { createHooks } from 'hookable';
import { snakeCase } from 'scule';
import { klona } from 'klona';
import defu, { defuFn } from 'defu';
import { hash } from 'ohash';
import { parseURL, withoutBase, joinURL, getQuery, withQuery, withLeadingSlash, withoutTrailingSlash } from 'ufo';
import { createStorage, prefixStorage } from 'unstorage';
import { toRouteMatcher, createRouter } from 'radix3';
import { promises } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'pathe';

const inlineAppConfig = {};



const appConfig = defuFn(inlineAppConfig);

const _inlineRuntimeConfig = {
  "app": {
    "baseURL": "/",
    "buildAssetsDir": "/_nuxt/",
    "cdnURL": ""
  },
  "nitro": {
    "envPrefix": "NUXT_",
    "routeRules": {
      "/__nuxt_error": {
        "cache": false
      },
      "/_nuxt/**": {
        "headers": {
          "cache-control": "public, max-age=31536000, immutable"
        }
      }
    }
  },
  "public": {}
};
const ENV_PREFIX = "NITRO_";
const ENV_PREFIX_ALT = _inlineRuntimeConfig.nitro.envPrefix ?? process.env.NITRO_ENV_PREFIX ?? "_";
const _sharedRuntimeConfig = _deepFreeze(
  _applyEnv(klona(_inlineRuntimeConfig))
);
function useRuntimeConfig(event) {
  if (!event) {
    return _sharedRuntimeConfig;
  }
  if (event.context.nitro.runtimeConfig) {
    return event.context.nitro.runtimeConfig;
  }
  const runtimeConfig = klona(_inlineRuntimeConfig);
  _applyEnv(runtimeConfig);
  event.context.nitro.runtimeConfig = runtimeConfig;
  return runtimeConfig;
}
_deepFreeze(klona(appConfig));
function _getEnv(key) {
  const envKey = snakeCase(key).toUpperCase();
  return destr(
    process.env[ENV_PREFIX + envKey] ?? process.env[ENV_PREFIX_ALT + envKey]
  );
}
function _isObject(input) {
  return typeof input === "object" && !Array.isArray(input);
}
function _applyEnv(obj, parentKey = "") {
  for (const key in obj) {
    const subKey = parentKey ? `${parentKey}_${key}` : key;
    const envValue = _getEnv(subKey);
    if (_isObject(obj[key])) {
      if (_isObject(envValue)) {
        obj[key] = { ...obj[key], ...envValue };
      }
      _applyEnv(obj[key], subKey);
    } else {
      obj[key] = envValue ?? obj[key];
    }
  }
  return obj;
}
function _deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object);
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === "object") {
      _deepFreeze(value);
    }
  }
  return Object.freeze(object);
}
new Proxy(/* @__PURE__ */ Object.create(null), {
  get: (_, prop) => {
    console.warn(
      "Please use `useRuntimeConfig()` instead of accessing config directly."
    );
    const runtimeConfig = useRuntimeConfig();
    if (prop in runtimeConfig) {
      return runtimeConfig[prop];
    }
    return void 0;
  }
});

const _assets = {

};

function normalizeKey(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0].replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "");
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

storage.mount('/assets', assets$1);

function useStorage(base = "") {
  return base ? prefixStorage(storage, base) : storage;
}

const defaultCacheOptions = {
  name: "_",
  base: "/cache",
  swr: true,
  maxAge: 1
};
function defineCachedFunction(fn, opts = {}) {
  opts = { ...defaultCacheOptions, ...opts };
  const pending = {};
  const group = opts.group || "nitro/functions";
  const name = opts.name || fn.name || "_";
  const integrity = hash([opts.integrity, fn, opts]);
  const validate = opts.validate || (() => true);
  async function get(key, resolver, shouldInvalidateCache) {
    const cacheKey = [opts.base, group, name, key + ".json"].filter(Boolean).join(":").replace(/:\/$/, ":index");
    const entry = await useStorage().getItem(cacheKey) || {};
    const ttl = (opts.maxAge ?? opts.maxAge ?? 0) * 1e3;
    if (ttl) {
      entry.expires = Date.now() + ttl;
    }
    const expired = shouldInvalidateCache || entry.integrity !== integrity || ttl && Date.now() - (entry.mtime || 0) > ttl || !validate(entry);
    const _resolve = async () => {
      const isPending = pending[key];
      if (!isPending) {
        if (entry.value !== void 0 && (opts.staleMaxAge || 0) >= 0 && opts.swr === false) {
          entry.value = void 0;
          entry.integrity = void 0;
          entry.mtime = void 0;
          entry.expires = void 0;
        }
        pending[key] = Promise.resolve(resolver());
      }
      try {
        entry.value = await pending[key];
      } catch (error) {
        if (!isPending) {
          delete pending[key];
        }
        throw error;
      }
      if (!isPending) {
        entry.mtime = Date.now();
        entry.integrity = integrity;
        delete pending[key];
        if (validate(entry)) {
          useStorage().setItem(cacheKey, entry).catch((error) => console.error("[nitro] [cache]", error));
        }
      }
    };
    const _resolvePromise = expired ? _resolve() : Promise.resolve();
    if (opts.swr && entry.value) {
      _resolvePromise.catch(console.error);
      return entry;
    }
    return _resolvePromise.then(() => entry);
  }
  return async (...args) => {
    const shouldBypassCache = opts.shouldBypassCache?.(...args);
    if (shouldBypassCache) {
      return fn(...args);
    }
    const key = await (opts.getKey || getKey)(...args);
    const shouldInvalidateCache = opts.shouldInvalidateCache?.(...args);
    const entry = await get(key, () => fn(...args), shouldInvalidateCache);
    let value = entry.value;
    if (opts.transform) {
      value = await opts.transform(entry, ...args) || value;
    }
    return value;
  };
}
const cachedFunction = defineCachedFunction;
function getKey(...args) {
  return args.length > 0 ? hash(args, {}) : "";
}
function escapeKey(key) {
  return key.replace(/[^\dA-Za-z]/g, "");
}
function defineCachedEventHandler(handler, opts = defaultCacheOptions) {
  const _opts = {
    ...opts,
    getKey: async (event) => {
      const key = await opts.getKey?.(event);
      if (key) {
        return escapeKey(key);
      }
      const url = event.node.req.originalUrl || event.node.req.url;
      const friendlyName = escapeKey(decodeURI(parseURL(url).pathname)).slice(
        0,
        16
      );
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
    integrity: [opts.integrity, handler]
  };
  const _cachedHandler = cachedFunction(
    async (incomingEvent) => {
      const reqProxy = cloneWithProxy(incomingEvent.node.req, { headers: {} });
      const resHeaders = {};
      let _resSendBody;
      const resProxy = cloneWithProxy(incomingEvent.node.res, {
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
      const headers = event.node.res.getHeaders();
      headers.etag = headers.Etag || headers.etag || `W/"${hash(body)}"`;
      headers["last-modified"] = headers["Last-Modified"] || headers["last-modified"] || (/* @__PURE__ */ new Date()).toUTCString();
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
      if (cacheControl.length > 0) {
        headers["cache-control"] = cacheControl.join(", ");
      }
      const cacheEntry = {
        code: event.node.res.statusCode,
        headers,
        body
      };
      return cacheEntry;
    },
    _opts
  );
  return defineEventHandler(async (event) => {
    if (opts.headersOnly) {
      if (handleCacheHeaders(event, { maxAge: opts.maxAge })) {
        return;
      }
      return handler(event);
    }
    const response = await _cachedHandler(event);
    if (event.node.res.headersSent || event.node.res.writableEnded) {
      return response.body;
    }
    if (handleCacheHeaders(event, {
      modifiedTime: new Date(response.headers["last-modified"]),
      etag: response.headers.etag,
      maxAge: opts.maxAge
    })) {
      return;
    }
    event.node.res.statusCode = response.code;
    for (const name in response.headers) {
      event.node.res.setHeader(name, response.headers[name]);
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

const config = useRuntimeConfig();
const _routeRulesMatcher = toRouteMatcher(
  createRouter({ routes: config.nitro.routeRules })
);
function createRouteRulesHandler() {
  return eventHandler((event) => {
    const routeRules = getRouteRules(event);
    if (routeRules.headers) {
      setHeaders(event, routeRules.headers);
    }
    if (routeRules.redirect) {
      return sendRedirect(
        event,
        routeRules.redirect.to,
        routeRules.redirect.statusCode
      );
    }
    if (routeRules.proxy) {
      let target = routeRules.proxy.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.proxy._proxyStripBase;
        if (strpBase) {
          targetPath = withoutBase(targetPath, strpBase);
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery(event.path);
        target = withQuery(target, query);
      }
      return proxyRequest(event, target, {
        fetch: $fetch.raw,
        ...routeRules.proxy
      });
    }
  });
}
function getRouteRules(event) {
  event.context._nitro = event.context._nitro || {};
  if (!event.context._nitro.routeRules) {
    const path = new URL(event.node.req.url, "http://localhost").pathname;
    event.context._nitro.routeRules = getRouteRulesForPath(
      withoutBase(path, useRuntimeConfig().app.baseURL)
    );
  }
  return event.context._nitro.routeRules;
}
function getRouteRulesForPath(path) {
  return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
}

const plugins = [
  
];

function hasReqHeader(event, name, includes) {
  const value = getRequestHeader(event, name);
  return value && typeof value === "string" && value.toLowerCase().includes(includes);
}
function isJsonRequest(event) {
  return hasReqHeader(event, "accept", "application/json") || hasReqHeader(event, "user-agent", "curl/") || hasReqHeader(event, "user-agent", "httpie/") || hasReqHeader(event, "sec-fetch-mode", "cors") || event.path.startsWith("/api/") || event.path.endsWith(".json");
}
function normalizeError(error) {
  const cwd = typeof process.cwd === "function" ? process.cwd() : "/";
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
  setResponseStatus(event, errorObject.statusCode !== 200 && errorObject.statusCode || 500, errorObject.statusMessage);
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
    setResponseHeader(event, "Content-Type", "application/json");
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
    setResponseHeader(event, "Content-Type", "text/html;charset=UTF-8");
    event.node.res.end(template(errorObject));
    return;
  }
  for (const [header, value] of res.headers.entries()) {
    setResponseHeader(event, header, value);
  }
  setResponseStatus(event, res.status && res.status !== 200 ? res.status : void 0, res.statusText);
  event.node.res.end(await res.text());
});

const assets = {
  "/mypic.jpg": {
    "type": "image/jpeg",
    "etag": "\"3666ce-5v8m/bZrTqWhO5w9bDiLroiez/U\"",
    "mtime": "2023-06-04T22:01:03.866Z",
    "size": 3565262,
    "path": "../public/mypic.jpg"
  },
  "/projects.json": {
    "type": "application/json",
    "etag": "\"1c09-OAj+VEoVTRQdNMAGHiYeY1eiY2E\"",
    "mtime": "2023-06-04T22:01:03.859Z",
    "size": 7177,
    "path": "../public/projects.json"
  },
  "/scene.splinecode": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"67e915-Yl1PcZ27cDXvrAbp3G3SFeO896A\"",
    "mtime": "2023-06-04T22:01:03.857Z",
    "size": 6809877,
    "path": "../public/scene.splinecode"
  },
  "/scene_2.splinecode": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"67ea06-BK8UR30OZwYmuAXCldX3cYjeXqo\"",
    "mtime": "2023-06-04T22:01:03.830Z",
    "size": 6810118,
    "path": "../public/scene_2.splinecode"
  },
  "/_nuxt/_plugin-vue_export-helper.c27b6911.js": {
    "type": "application/javascript",
    "etag": "\"5b-eFCz/UrraTh721pgAl0VxBNR1es\"",
    "mtime": "2023-06-04T22:01:03.823Z",
    "size": 91,
    "path": "../public/_nuxt/_plugin-vue_export-helper.c27b6911.js"
  },
  "/_nuxt/about.9acc9a90.js": {
    "type": "application/javascript",
    "etag": "\"a07-brvMT0PX3YS53fPYPWjJyjeJ30Y\"",
    "mtime": "2023-06-04T22:01:03.823Z",
    "size": 2567,
    "path": "../public/_nuxt/about.9acc9a90.js"
  },
  "/_nuxt/about.b55875de.js": {
    "type": "application/javascript",
    "etag": "\"990-1KGZa8/yn+ZC+4D6p5/13whjN0I\"",
    "mtime": "2023-06-04T22:01:03.823Z",
    "size": 2448,
    "path": "../public/_nuxt/about.b55875de.js"
  },
  "/_nuxt/boolean.63aef768.js": {
    "type": "application/javascript",
    "etag": "\"f5e0-oQvah41XNoTD4ydvjhUObf16SAY\"",
    "mtime": "2023-06-04T22:01:03.823Z",
    "size": 62944,
    "path": "../public/_nuxt/boolean.63aef768.js"
  },
  "/_nuxt/bootstrap-icons.999550fa.woff": {
    "type": "font/woff",
    "etag": "\"28208-1ZjMYgRYsi2ARDzdaRACFzFu+vM\"",
    "mtime": "2023-06-04T22:01:03.823Z",
    "size": 164360,
    "path": "../public/_nuxt/bootstrap-icons.999550fa.woff"
  },
  "/_nuxt/bootstrap-icons.cfe45b98.woff2": {
    "type": "font/woff2",
    "etag": "\"1d9fc-TA788dzMcpXvwm+r6B/+jyjVlKM\"",
    "mtime": "2023-06-04T22:01:03.822Z",
    "size": 121340,
    "path": "../public/_nuxt/bootstrap-icons.cfe45b98.woff2"
  },
  "/_nuxt/contact.4215ee70.js": {
    "type": "application/javascript",
    "etag": "\"623-qlcHAlIRiu2iK1o4dpiPnsMbE3g\"",
    "mtime": "2023-06-04T22:01:03.822Z",
    "size": 1571,
    "path": "../public/_nuxt/contact.4215ee70.js"
  },
  "/_nuxt/contact.bc4a8f2c.js": {
    "type": "application/javascript",
    "etag": "\"689-90ypgCole94sBWzkP+nL15PKLhE\"",
    "mtime": "2023-06-04T22:01:03.822Z",
    "size": 1673,
    "path": "../public/_nuxt/contact.bc4a8f2c.js"
  },
  "/_nuxt/default.65968d08.js": {
    "type": "application/javascript",
    "etag": "\"d44-VbC7A7d7iuyy66SuUBOBbEZq8tc\"",
    "mtime": "2023-06-04T22:01:03.822Z",
    "size": 3396,
    "path": "../public/_nuxt/default.65968d08.js"
  },
  "/_nuxt/entry.2bc7086d.js": {
    "type": "application/javascript",
    "etag": "\"371d3-96m3HoHLi8BGVuxbouHSXTF9nTg\"",
    "mtime": "2023-06-04T22:01:03.822Z",
    "size": 225747,
    "path": "../public/_nuxt/entry.2bc7086d.js"
  },
  "/_nuxt/entry.e3dd5304.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"15943-CPo2IxLLosJKddBknKmjjiH+YeA\"",
    "mtime": "2023-06-04T22:01:03.821Z",
    "size": 88387,
    "path": "../public/_nuxt/entry.e3dd5304.css"
  },
  "/_nuxt/error-404.a7cba482.js": {
    "type": "application/javascript",
    "etag": "\"907-lhNhyIdwlpx8c92r7HXOW8D/Gtk\"",
    "mtime": "2023-06-04T22:01:03.821Z",
    "size": 2311,
    "path": "../public/_nuxt/error-404.a7cba482.js"
  },
  "/_nuxt/error-404.dd29d79a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e2e-JYQmAncl9ODY78yRqUt9FOyUmA4\"",
    "mtime": "2023-06-04T22:01:03.821Z",
    "size": 3630,
    "path": "../public/_nuxt/error-404.dd29d79a.css"
  },
  "/_nuxt/error-500.26873dcc.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"79e-fa2OB1jZnGuSyj7jz6LP6nKsFoY\"",
    "mtime": "2023-06-04T22:01:03.821Z",
    "size": 1950,
    "path": "../public/_nuxt/error-500.26873dcc.css"
  },
  "/_nuxt/error-500.9473b823.js": {
    "type": "application/javascript",
    "etag": "\"78b-s4ELWSMN2gitEE+9Rb3sOr8M4KI\"",
    "mtime": "2023-06-04T22:01:03.820Z",
    "size": 1931,
    "path": "../public/_nuxt/error-500.9473b823.js"
  },
  "/_nuxt/error-component.99ab5fa5.js": {
    "type": "application/javascript",
    "etag": "\"4cc-1C6nu0VbBYVAtA3euMGSWFKfIWE\"",
    "mtime": "2023-06-04T22:01:03.820Z",
    "size": 1228,
    "path": "../public/_nuxt/error-component.99ab5fa5.js"
  },
  "/_nuxt/experience.7fce6dcd.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"da-W6z6hkhNDYvDnLUmaFHpuzXqolE\"",
    "mtime": "2023-06-04T22:01:03.820Z",
    "size": 218,
    "path": "../public/_nuxt/experience.7fce6dcd.css"
  },
  "/_nuxt/experience.90023560.js": {
    "type": "application/javascript",
    "etag": "\"17c6-R/AJked4kbve7CqNfyBdza/ZhXs\"",
    "mtime": "2023-06-04T22:01:03.820Z",
    "size": 6086,
    "path": "../public/_nuxt/experience.90023560.js"
  },
  "/_nuxt/experience.95d16190.js": {
    "type": "application/javascript",
    "etag": "\"4f7a-pJ6dCGBdu+F/fISWH6r/N8KGBR0\"",
    "mtime": "2023-06-04T22:01:03.820Z",
    "size": 20346,
    "path": "../public/_nuxt/experience.95d16190.js"
  },
  "/_nuxt/index.7ceb637f.js": {
    "type": "application/javascript",
    "etag": "\"90d-bJkQxHraiDpe1brrUVGkQyomrts\"",
    "mtime": "2023-06-04T22:01:03.820Z",
    "size": 2317,
    "path": "../public/_nuxt/index.7ceb637f.js"
  },
  "/_nuxt/index.f376d4a8.js": {
    "type": "application/javascript",
    "etag": "\"846-3u7cABSg6W1H3MzXIBUm6PgMljM\"",
    "mtime": "2023-06-04T22:01:03.820Z",
    "size": 2118,
    "path": "../public/_nuxt/index.f376d4a8.js"
  },
  "/_nuxt/mypic.43aed9ec.js": {
    "type": "application/javascript",
    "etag": "\"61-FeKDOXFsiSVmSjDsUQYyHAxRctM\"",
    "mtime": "2023-06-04T22:01:03.819Z",
    "size": 97,
    "path": "../public/_nuxt/mypic.43aed9ec.js"
  },
  "/_nuxt/navmesh.0b92f809.js": {
    "type": "application/javascript",
    "etag": "\"d751-9J1SxdJDEx3WOZHg3lmJFpLFjGA\"",
    "mtime": "2023-06-04T22:01:03.819Z",
    "size": 55121,
    "path": "../public/_nuxt/navmesh.0b92f809.js"
  },
  "/_nuxt/nuxt-link.37712222.js": {
    "type": "application/javascript",
    "etag": "\"10e1-bsPJAfqSb75ifyk+c5klUnnUScU\"",
    "mtime": "2023-06-04T22:01:03.819Z",
    "size": 4321,
    "path": "../public/_nuxt/nuxt-link.37712222.js"
  },
  "/_nuxt/opentype.fc28cde9.js": {
    "type": "application/javascript",
    "etag": "\"2a61d-8DvtAQQ2fWDZEjI5kG9fc+9LjJE\"",
    "mtime": "2023-06-04T22:01:03.819Z",
    "size": 173597,
    "path": "../public/_nuxt/opentype.fc28cde9.js"
  },
  "/_nuxt/physics.dee4de67.js": {
    "type": "application/javascript",
    "etag": "\"1e53d3-4xmbvS4alqVYBBw9wMPjB7YXA6k\"",
    "mtime": "2023-06-04T22:01:03.818Z",
    "size": 1987539,
    "path": "../public/_nuxt/physics.dee4de67.js"
  },
  "/_nuxt/process.10f79362.js": {
    "type": "application/javascript",
    "etag": "\"121a4-rQc/T0/+CNCuQXeRSmtUwmyuaII\"",
    "mtime": "2023-06-04T22:01:03.816Z",
    "size": 74148,
    "path": "../public/_nuxt/process.10f79362.js"
  },
  "/_nuxt/projects.78dc8c17.js": {
    "type": "application/javascript",
    "etag": "\"12ad-OWM/x4ayZf+fnrotOFc59jwJB90\"",
    "mtime": "2023-06-04T22:01:03.816Z",
    "size": 4781,
    "path": "../public/_nuxt/projects.78dc8c17.js"
  },
  "/_nuxt/projects.b874c60f.js": {
    "type": "application/javascript",
    "etag": "\"11af-HVivV66mCL27R8z1/C1WiJ2t/Bo\"",
    "mtime": "2023-06-04T22:01:03.816Z",
    "size": 4527,
    "path": "../public/_nuxt/projects.b874c60f.js"
  },
  "/_nuxt/projects.e01c32b7.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"18a-KcRxp+MWtQtt4FnWsgZRFXPD7r0\"",
    "mtime": "2023-06-04T22:01:03.816Z",
    "size": 394,
    "path": "../public/_nuxt/projects.e01c32b7.css"
  },
  "/_nuxt/runtime.eed956c2.js": {
    "type": "application/javascript",
    "etag": "\"17890a-lkW7v0BLqeFurnodewXNF+zdQ5A\"",
    "mtime": "2023-06-04T22:01:03.815Z",
    "size": 1542410,
    "path": "../public/_nuxt/runtime.eed956c2.js"
  },
  "/images/projects/0.png": {
    "type": "image/png",
    "etag": "\"2e2-9msusF/ab1lbJQ/+OGK0WNSYE7I\"",
    "mtime": "2023-06-04T22:01:03.940Z",
    "size": 738,
    "path": "../public/images/projects/0.png"
  },
  "/images/projects/1.png": {
    "type": "image/png",
    "etag": "\"87bde-F+wbXApjflMt6NLn1W0ZJU1+Wyc\"",
    "mtime": "2023-06-04T22:01:03.940Z",
    "size": 555998,
    "path": "../public/images/projects/1.png"
  },
  "/images/projects/10.png": {
    "type": "image/png",
    "etag": "\"44059-LZyPPCNyZY/AwK6lNVGLAZ3Ex50\"",
    "mtime": "2023-06-04T22:01:03.938Z",
    "size": 278617,
    "path": "../public/images/projects/10.png"
  },
  "/images/projects/11.png": {
    "type": "image/png",
    "etag": "\"3090c-tAhwWfvmaTCYWvwM09LxQfQb1eg\"",
    "mtime": "2023-06-04T22:01:03.937Z",
    "size": 198924,
    "path": "../public/images/projects/11.png"
  },
  "/images/projects/12.png": {
    "type": "image/png",
    "etag": "\"108c8-BMHuJ+mTsEZCGXjPM+Fs+dIbYRo\"",
    "mtime": "2023-06-04T22:01:03.935Z",
    "size": 67784,
    "path": "../public/images/projects/12.png"
  },
  "/images/projects/13.gif": {
    "type": "image/gif",
    "etag": "\"19a42a-pO/1KFNCanzqLkEG5I9mh16PY5c\"",
    "mtime": "2023-06-04T22:01:03.934Z",
    "size": 1680426,
    "path": "../public/images/projects/13.gif"
  },
  "/images/projects/14.png": {
    "type": "image/png",
    "etag": "\"35b536-CxUCZnnADwI2spoJXY5RRnUURhg\"",
    "mtime": "2023-06-04T22:01:03.928Z",
    "size": 3519798,
    "path": "../public/images/projects/14.png"
  },
  "/images/projects/15.png": {
    "type": "image/png",
    "etag": "\"2e447-TuTkkgZ3N5SlxgQnez5KjGAvrD4\"",
    "mtime": "2023-06-04T22:01:03.924Z",
    "size": 189511,
    "path": "../public/images/projects/15.png"
  },
  "/images/projects/16.png": {
    "type": "image/png",
    "etag": "\"4f5b8-fqkLfMKZax1WfNhFXFjXNES9ms4\"",
    "mtime": "2023-06-04T22:01:03.922Z",
    "size": 325048,
    "path": "../public/images/projects/16.png"
  },
  "/images/projects/17.png": {
    "type": "image/png",
    "etag": "\"54c3d-BdtugqR9Cwr662WnLr4s+Ln6BnM\"",
    "mtime": "2023-06-04T22:01:03.921Z",
    "size": 347197,
    "path": "../public/images/projects/17.png"
  },
  "/images/projects/17.png:Zone.Identifier": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"0-2jmj7l5rSw0yVb/vlWAYkK/YBwk\"",
    "mtime": "2023-06-04T22:01:03.918Z",
    "size": 0,
    "path": "../public/images/projects/17.png:Zone.Identifier"
  },
  "/images/projects/2.gif": {
    "type": "image/gif",
    "etag": "\"fc5b79-tAGaMguLMEGAdO9MbpykENzvqqY\"",
    "mtime": "2023-06-04T22:01:03.917Z",
    "size": 16538489,
    "path": "../public/images/projects/2.gif"
  },
  "/images/projects/2.png": {
    "type": "image/png",
    "etag": "\"60f4b-o7ttGmKy85bGMJ5htjKgWCO75Js\"",
    "mtime": "2023-06-04T22:01:03.889Z",
    "size": 397131,
    "path": "../public/images/projects/2.png"
  },
  "/images/projects/3.gif": {
    "type": "image/gif",
    "etag": "\"14d62d-rLJitim5HtDF4pdRgxag3YsE3Y8\"",
    "mtime": "2023-06-04T22:01:03.888Z",
    "size": 1365549,
    "path": "../public/images/projects/3.gif"
  },
  "/images/projects/4.png": {
    "type": "image/png",
    "etag": "\"107d2e-TbYrqwg9bRrdcgkm1QzRRHKA1oA\"",
    "mtime": "2023-06-04T22:01:03.886Z",
    "size": 1080622,
    "path": "../public/images/projects/4.png"
  },
  "/images/projects/5.png": {
    "type": "image/png",
    "etag": "\"55ae-7RITv/IuGAHS0MSC9WDtl8WRNI0\"",
    "mtime": "2023-06-04T22:01:03.882Z",
    "size": 21934,
    "path": "../public/images/projects/5.png"
  },
  "/images/projects/6.gif": {
    "type": "image/gif",
    "etag": "\"67dcf1-4Oan5t0XRy/dbL6bnwarobC3oXs\"",
    "mtime": "2023-06-04T22:01:03.880Z",
    "size": 6806769,
    "path": "../public/images/projects/6.gif"
  },
  "/images/projects/7.gif": {
    "type": "image/gif",
    "etag": "\"151202-M2iRKC5v/UyrXocj/tepIYqGjqQ\"",
    "mtime": "2023-06-04T22:01:03.872Z",
    "size": 1380866,
    "path": "../public/images/projects/7.gif"
  },
  "/images/projects/8.png": {
    "type": "image/png",
    "etag": "\"af8f8-acU6E9zjb9cBf0c5LUPwD8fzu3c\"",
    "mtime": "2023-06-04T22:01:03.869Z",
    "size": 719096,
    "path": "../public/images/projects/8.png"
  },
  "/images/projects/9.png": {
    "type": "image/png",
    "etag": "\"19973-5isY/APPV2smc+dgohUHDyIjbZ4\"",
    "mtime": "2023-06-04T22:01:03.867Z",
    "size": 104819,
    "path": "../public/images/projects/9.png"
  }
};

function readAsset (id) {
  const serverDir = dirname(fileURLToPath(globalThis._importMeta_.url));
  return promises.readFile(resolve(serverDir, assets[id].path))
}

const publicAssetBases = {"/_nuxt":{"maxAge":31536000}};

function isPublicAssetURL(id = '') {
  if (assets[id]) {
    return true
  }
  for (const base in publicAssetBases) {
    if (id.startsWith(base)) { return true }
  }
  return false
}

function getAsset (id) {
  return assets[id]
}

const METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
const EncodingMap = { gzip: ".gz", br: ".br" };
const _f4b49z = eventHandler((event) => {
  if (event.node.req.method && !METHODS.has(event.node.req.method)) {
    return;
  }
  let id = decodeURIComponent(
    withLeadingSlash(
      withoutTrailingSlash(parseURL(event.node.req.url).pathname)
    )
  );
  let asset;
  const encodingHeader = String(
    event.node.req.headers["accept-encoding"] || ""
  );
  const encodings = [
    ...encodingHeader.split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(),
    ""
  ];
  if (encodings.length > 1) {
    event.node.res.setHeader("Vary", "Accept-Encoding");
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
      event.node.res.removeHeader("cache-control");
      throw createError({
        statusMessage: "Cannot find static asset " + id,
        statusCode: 404
      });
    }
    return;
  }
  const ifNotMatch = event.node.req.headers["if-none-match"] === asset.etag;
  if (ifNotMatch) {
    event.node.res.statusCode = 304;
    event.node.res.end();
    return;
  }
  const ifModifiedSinceH = event.node.req.headers["if-modified-since"];
  const mtimeDate = new Date(asset.mtime);
  if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
    event.node.res.statusCode = 304;
    event.node.res.end();
    return;
  }
  if (asset.type && !event.node.res.getHeader("Content-Type")) {
    event.node.res.setHeader("Content-Type", asset.type);
  }
  if (asset.etag && !event.node.res.getHeader("ETag")) {
    event.node.res.setHeader("ETag", asset.etag);
  }
  if (asset.mtime && !event.node.res.getHeader("Last-Modified")) {
    event.node.res.setHeader("Last-Modified", mtimeDate.toUTCString());
  }
  if (asset.encoding && !event.node.res.getHeader("Content-Encoding")) {
    event.node.res.setHeader("Content-Encoding", asset.encoding);
  }
  if (asset.size > 0 && !event.node.res.getHeader("Content-Length")) {
    event.node.res.setHeader("Content-Length", asset.size);
  }
  return readAsset(id);
});

const _lazy_esYgJX = () => import('../handlers/renderer.mjs');

const handlers = [
  { route: '', handler: _f4b49z, lazy: false, middleware: true, method: undefined },
  { route: '/__nuxt_error', handler: _lazy_esYgJX, lazy: true, middleware: false, method: undefined },
  { route: '/**', handler: _lazy_esYgJX, lazy: true, middleware: false, method: undefined }
];

function createNitroApp() {
  const config = useRuntimeConfig();
  const hooks = createHooks();
  const h3App = createApp({
    debug: destr(false),
    onError: errorHandler
  });
  const router = createRouter$1();
  h3App.use(createRouteRulesHandler());
  const localCall = createCall(toNodeListener(h3App));
  const localFetch = createFetch(localCall, globalThis.fetch);
  const $fetch = createFetch$1({
    fetch: localFetch,
    Headers,
    defaults: { baseURL: config.app.baseURL }
  });
  globalThis.$fetch = $fetch;
  h3App.use(
    eventHandler((event) => {
      event.context.nitro = event.context.nitro || {};
      const envContext = event.node.req.__unenv__;
      if (envContext) {
        Object.assign(event.context, envContext);
      }
      event.fetch = (req, init) => fetchWithEvent(event, req, init, { fetch: localFetch });
      event.$fetch = (req, init) => fetchWithEvent(event, req, init, { fetch: $fetch });
    })
  );
  for (const h of handlers) {
    let handler = h.lazy ? lazyEventHandler(h.handler) : h.handler;
    if (h.middleware || !h.route) {
      const middlewareBase = (config.app.baseURL + (h.route || "/")).replace(
        /\/+/g,
        "/"
      );
      h3App.use(middlewareBase, handler);
    } else {
      const routeRules = getRouteRulesForPath(
        h.route.replace(/:\w+|\*\*/g, "_")
      );
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
  process.on(
    "unhandledRejection",
    (err) => console.error("[nitro] [dev] [unhandledRejection] " + err)
  );
  process.on(
    "uncaughtException",
    (err) => console.error("[nitro] [dev] [uncaughtException] " + err)
  );
}
const nodeServer = {};

export { useRuntimeConfig as a, getRouteRules as g, nodeServer as n, useNitroApp as u };
//# sourceMappingURL=node-server.mjs.map
