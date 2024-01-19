import { b as useLoading, a as useSeoMeta, h as __nuxt_component_0 } from '../server.mjs';
import { defineComponent, mergeProps, useSSRContext } from 'vue';
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
  __name: "contact",
  __ssrInlineRender: true,
  setup(__props) {
    useLoading();
    useLoading().setLoading(false);
    useSeoMeta({
      title: "Contact Me"
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_0;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "flex-1 flex flex-col justify-center page-section page-section-experience" }, _attrs))}><div class="flex-1 flex flex-col justify-center items-center w-full sm:max-w-screen-sm lg:max-w-screen-lg mx-auto px-4 mb-4 py-10"><div class="text-custom-1 text-primary mb-2">06. Contact Me?</div><div class="text-6xl mb-4 font-bold"><div class="">Get In Touch</div></div><div class="max-w-screen-sm text-center text-blue-100/50 mb-8"> Even though I&#39;m not currently looking for new opportunities, my inbox is always open. Whether you have any questions or just want to say hello, I&#39;ll try my best to get back to you! </div><div class="flex space-x-4 justify-center"><a href="https://linktr.ee/viandwi24" target="_blank" class="duration-300 transition-all flex items-center rounded px-4 py-2 border border-green-500 text-green-500 flex space-x-2 hover:bg-green-500 hover:text-gray-100">`);
      _push(ssrRenderComponent(_component_Icon, { name: "mdi:pine-tree-variant-outline" }, null, _parent));
      _push(`<span>Linktr.ee</span></a><a target="_blank" href="mailto:viandwi24@pm.me" class="duration-300 transition-all flex items-center rounded px-4 py-2 border border-primary-500 text-primary-500 flex space-x-2 hover:bg-primary-500 hover:text-gray-100">`);
      _push(ssrRenderComponent(_component_Icon, { name: "bi:envelope" }, null, _parent));
      _push(`<span>Email</span></a><a target="_blank" href="https://facebook.com/viandwi24" class="duration-300 transition-all flex items-center rounded px-4 py-2 border border-blue-300 text-blue-300 flex space-x-2 hover:bg-blue-300 hover:text-gray-100">`);
      _push(ssrRenderComponent(_component_Icon, { name: "bi:facebook" }, null, _parent));
      _push(`<span>Facebook</span></a><a target="_blank" href="https://instagram.com/viandwi_24" class="duration-300 transition-all flex items-center rounded px-4 py-2 border border-purple-300 text-purple-300 flex space-x-2 hover:bg-purple-300 hover:text-gray-100">`);
      _push(ssrRenderComponent(_component_Icon, { name: "bi:instagram" }, null, _parent));
      _push(`<span>Instagram</span></a></div></div></section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/contact.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=contact-FK1ytrtB.mjs.map
