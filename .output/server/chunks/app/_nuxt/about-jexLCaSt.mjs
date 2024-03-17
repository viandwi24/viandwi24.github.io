import { _ as __nuxt_component_0 } from './nuxt-link-rgMoYZ5X.mjs';
import { _ as __nuxt_component_1 } from './nuxt-img-ncrCwSjj.mjs';
import { a as useSeoMeta, b as useLoading } from '../server.mjs';
import { defineComponent, mergeProps, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
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
  __name: "about",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({
      title: "About Me"
    });
    useLoading();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_NuxtImg = __nuxt_component_1;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "flex-1 flex flex-col justify-center page-section page-section-about" }, _attrs))}><div class="w-full sm:max-w-screen-sm lg:max-w-screen-lg mx-auto px-4 mb-4"><div class="page-section-header mb-4 text-custom-1"><span>02.</span><span>About Me</span></div><div class="flex flex-col-reverse lg:flex-row"><div class="px-4 flex-1 lg:pr-6 mb-4"><p> Hello, my name is <span class="text-primary">Alfian Dwi Nugraha</span>! I have a passion in the internet world since I was 10 years old. I was browsing blogs and then trying to make some desktop applications, then again met this web-based programming. </p><ul class="mt-4"><li>\u{1F52D} I\u2019m currently working on Freelance as <span class="text-primary">Web Dev Programmer</span></li><li>\u{1F331} I\u2019m currently learning Golang, Python and Web3 Solana</li><li>\u{1F393} I\u2019m currently studying at the <span class="text-primary">Surabaya State University</span></li></ul><p class="mt-4"> You can see detail of my journey and experiences `);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/experience",
        class: "border-b hover:bg-yellow-300/50 border-primary-500 border-dotted"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`clik this`);
          } else {
            return [
              createTextVNode("clik this")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`. </p></div><div class="lg:pl-4 flex justify-center items-center lg:justify-end mb-4 lg:mb-0"><div class="relative mypic-wrapper bg-red-500">`);
      _push(ssrRenderComponent(_component_NuxtImg, {
        src: "/mypic.jpg",
        alt: "My Avatar",
        class: "block w-auto rounded mypic h-[400px]"
      }, null, _parent));
      _push(`</div></div></div></div><div class="w-full sm:max-w-screen-sm lg:max-w-screen-lg mx-auto px-4"><div class="page-section-header mb-4"><span>My Avatar</span></div><div class="flex flex-col-reverse lg:flex-row"><div class="flex-1 pr-6 col-md"><div><p> The <span class="text-purple">avatars</span> that I use on almost a lot of social media, are taken from some anime characters that I like. In the form of <span class="text-primary">Shiroe</span> (Log Horizon), <span class="text-primary">Killua</span> (Hunter x Hunter), and <span class="text-primary">Kirito</span> (Sword Art online). </p></div></div><div class="w-full lg:w-1/4 col-md-4 col-md page-section-about-canvas-wrapper h-50 flex justify-center lg:justify-end lg:pl-4 mb-4 lg:mb-0"><canvas id="page-section-about-canvas"></canvas></div></div></div></section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/about.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=about-jexLCaSt.mjs.map
