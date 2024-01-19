import { _ as __nuxt_component_0 } from './nuxt-link-rgMoYZ5X.mjs';
import { h as __nuxt_component_1 } from '../server.mjs';
import { defineComponent, mergeProps, withCtx, openBlock, createBlock, createVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderSlot } from 'vue/server-renderer';
import '../../nitro/node-server.mjs';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import 'node:fs';
import 'node:url';
import 'ipx';
import 'unhead';
import '@unhead/shared';
import 'vue-router';
import '@iconify/vue/dist/offline';
import '@iconify/vue';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    const menu = [
      {
        name: "Home",
        path: "/"
      },
      {
        name: "About",
        path: "/about"
      },
      {
        name: "Experience",
        path: "/experience"
      },
      {
        name: "Projects",
        path: "/projects"
      },
      {
        name: "Blog",
        path: "/blog"
      },
      {
        name: "Contact",
        path: "/contact"
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_Icon = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "w-full min-h-screen flex flex-col text-gray-100 bg-gray-950" }, _attrs))}><div class="fixed top-0 left-0 w-full py-4 px-6 z-10 bg-gray-950"><div class="relative flex justify-between"><div class="flex">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        class: "",
        to: "/"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<svg width="27.71" height="32" viewBox="0 0 167 192" fill="#0096FF" xmlns="http://www.w3.org/2000/svg"${_scopeId}><path d="M69.8874 125V117.448L82.3034 98.376C83.2421 96.968 84.1168 95.6027 84.9274 94.28C85.7808 92.9573 86.4634 91.6133 86.9754 90.248C87.5301 88.8827 87.8074 87.4533 87.8074 85.96C87.8074 84.4667 87.5088 83.3573 86.9114 82.632C86.3141 81.9067 85.5034 81.544 84.4794 81.544C83.3274 81.544 82.4314 81.864 81.7914 82.504C81.1514 83.144 80.7034 83.9973 80.4474 85.064C80.2341 86.1307 80.1274 87.3253 80.1274 88.648V91.208H69.7594V88.456C69.7594 85.384 70.2501 82.6533 71.2314 80.264C72.2128 77.832 73.7701 75.9333 75.9034 74.568C78.0368 73.16 80.8314 72.456 84.2874 72.456C88.9381 72.456 92.4368 73.672 94.7834 76.104C97.1728 78.4933 98.3674 81.8427 98.3674 86.152C98.3674 88.2427 98.0261 90.184 97.3434 91.976C96.7034 93.768 95.8288 95.5173 94.7194 97.224C93.6528 98.888 92.5008 100.637 91.2634 102.472L81.7914 116.616H96.9594V125H69.8874Z"${_scopeId}></path><path d="M44.3279 125L34.9839 73.16H44.7759L50.3439 108.36L55.5279 73.16H65.8959L56.4239 125H44.3279Z"${_scopeId}></path><path fill-rule="evenodd" clip-rule="evenodd" d="M116.674 113.352V125H126.658V113.352H131.458V105.416H126.658V73.16H114.242L100.738 105.48V113.352H116.674ZM116.674 105.416H108.866L116.674 83.848V105.416Z"${_scopeId}></path><path fill-rule="evenodd" clip-rule="evenodd" d="M83.1384 0L166.277 48V144L83.1384 192L0 144V48L83.1384 0ZM10 53.7735L83.1384 11.547L156.277 53.7735V138.227L83.1384 180.453L10 138.227V53.7735Z"${_scopeId}></path></svg>`);
          } else {
            return [
              (openBlock(), createBlock("svg", {
                width: "27.71",
                height: "32",
                viewBox: "0 0 167 192",
                fill: "#0096FF",
                xmlns: "http://www.w3.org/2000/svg"
              }, [
                createVNode("path", { d: "M69.8874 125V117.448L82.3034 98.376C83.2421 96.968 84.1168 95.6027 84.9274 94.28C85.7808 92.9573 86.4634 91.6133 86.9754 90.248C87.5301 88.8827 87.8074 87.4533 87.8074 85.96C87.8074 84.4667 87.5088 83.3573 86.9114 82.632C86.3141 81.9067 85.5034 81.544 84.4794 81.544C83.3274 81.544 82.4314 81.864 81.7914 82.504C81.1514 83.144 80.7034 83.9973 80.4474 85.064C80.2341 86.1307 80.1274 87.3253 80.1274 88.648V91.208H69.7594V88.456C69.7594 85.384 70.2501 82.6533 71.2314 80.264C72.2128 77.832 73.7701 75.9333 75.9034 74.568C78.0368 73.16 80.8314 72.456 84.2874 72.456C88.9381 72.456 92.4368 73.672 94.7834 76.104C97.1728 78.4933 98.3674 81.8427 98.3674 86.152C98.3674 88.2427 98.0261 90.184 97.3434 91.976C96.7034 93.768 95.8288 95.5173 94.7194 97.224C93.6528 98.888 92.5008 100.637 91.2634 102.472L81.7914 116.616H96.9594V125H69.8874Z" }),
                createVNode("path", { d: "M44.3279 125L34.9839 73.16H44.7759L50.3439 108.36L55.5279 73.16H65.8959L56.4239 125H44.3279Z" }),
                createVNode("path", {
                  "fill-rule": "evenodd",
                  "clip-rule": "evenodd",
                  d: "M116.674 113.352V125H126.658V113.352H131.458V105.416H126.658V73.16H114.242L100.738 105.48V113.352H116.674ZM116.674 105.416H108.866L116.674 83.848V105.416Z"
                }),
                createVNode("path", {
                  "fill-rule": "evenodd",
                  "clip-rule": "evenodd",
                  d: "M83.1384 0L166.277 48V144L83.1384 192L0 144V48L83.1384 0ZM10 53.7735L83.1384 11.547L156.277 53.7735V138.227L83.1384 180.453L10 138.227V53.7735Z"
                })
              ]))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="hidden flex-1 lg:flex justify-center items-center pr-6"><ul class="flex space-x-5 text-sm font-mono"><!--[-->`);
      ssrRenderList(menu, (item, i) => {
        _push(`<li>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          class: "text-white font-semibold",
          to: item.path
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="text-primary-500"${_scopeId}>0${ssrInterpolate(i + 1)}.</span><span${_scopeId}>// ${ssrInterpolate(item.name)}</span>`);
            } else {
              return [
                createVNode("span", { class: "text-primary-500" }, "0" + toDisplayString(i + 1) + ".", 1),
                createVNode("span", null, "// " + toDisplayString(item.name), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</li>`);
      });
      _push(`<!--]--></ul></div><div><button class="lg:hidden">`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "ic:outline-menu",
        class: "w-6 h-6"
      }, null, _parent));
      _push(`</button></div></div></div><div class="flex-1 flex flex-col pt-16 min-h-full"><div class="flex-1 flex flex-col">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div><div class="text-center py-2"><div class="text-sm text-gray-500"> Design by <a href="https://github.com/viandwi24" class="text-primary-500 italic underline underline-primary-500">@viandwi24</a></div></div></div><div class="tso-rainbow"></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=default-qGlH8VhA.mjs.map
