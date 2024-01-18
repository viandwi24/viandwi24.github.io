import { _ as __nuxt_component_0 } from './nuxt-link-n17X0W_2.mjs';
import { a as useSeoMeta, b as useLoading, j as __nuxt_component_0$1 } from '../server.mjs';
import { defineComponent, mergeProps, withCtx, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderComponent } from 'vue/server-renderer';
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
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({
      title: "Alfian Dwi Nugraha (viandwi24)",
      titleTemplate: ""
    });
    useLoading();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_Icon = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex-1 flex flex-col justify-center items-center relative overflow-hidden" }, _attrs))}><div class="page-section-home-canvas-wrapper"><canvas id="page-section-home-canvas"></canvas></div><div class="w-full sm:max-w-screen-sm lg:max-w-screen-xl mx-auto px-4 pb-20"><div class="wrapper-with-tag"><div class="container-with-tag" style="${ssrRenderStyle({ "--tag": "'h1'" })}"><div class="mb-4"><div class="text-primary font-mono">Hi, my name is</div></div><div class="text-[3.5rem] font-bold mb-4 leading-[4rem]"><div class="text-blue-200">Alfian Dwi Nugraha.</div><div class="text-orange-200">A website engraver for artists.</div></div><div class="text-sm font-light mb-4 max-w-xl leading-[1.3rem] tracking-wide"> I am a web developer, who can handle web design, server side web, web games, and some desktop programming. now focusing on the web front end &amp; solana web3. </div><div class="mb-4 flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 font-mono justify-start items-start">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "about",
        class: "w-auto flex items-center px-4 py-2 rounded bg-primary-400 inline-block sm:flex space-x-1"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_Icon, { name: "ic:sharp-emoji-people" }, null, _parent2, _scopeId));
            _push2(`<span${_scopeId}>About Me</span>`);
          } else {
            return [
              createVNode(_component_Icon, { name: "ic:sharp-emoji-people" }),
              createVNode("span", null, "About Me")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<a href="https://linktr.ee/viandwi24" target="_blank" class="w-auto flex items-center px-4 py-2 rounded bg-green-400 inline-block sm:flex space-x-1">`);
      _push(ssrRenderComponent(_component_Icon, { name: "mdi:pine-tree-variant-outline" }, null, _parent));
      _push(`<span>Linktr.ee</span></a><a href="https://github.com/viandwi24" target="_blank" class="w-auto flex items-center px-4 py-2 rounded bg-gray-600 inline-block sm:flex space-x-1">`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "bi:github",
        class: "mr-2"
      }, null, _parent));
      _push(`<span>Github</span></a></div></div></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-pwcrqh5W.mjs.map
