import { defineComponent, ref, createElementBlock, mergeProps, useSSRContext } from 'vue';
import { b as useLoading, a as useSeoMeta } from '../server.mjs';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import '../../nitro/node-server.mjs';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import 'node:fs';
import 'node:url';
import 'unhead';
import '@unhead/shared';
import 'vue-router';
import '@iconify/vue/dist/offline';
import '@iconify/vue';

const __nuxt_component_0 = defineComponent({
  name: "ClientOnly",
  inheritAttrs: false,
  // eslint-disable-next-line vue/require-prop-types
  props: ["fallback", "placeholder", "placeholderTag", "fallbackTag"],
  setup(_, { slots, attrs }) {
    const mounted = ref(false);
    return (props) => {
      var _a;
      if (mounted.value) {
        return (_a = slots.default) == null ? void 0 : _a.call(slots);
      }
      const slot = slots.fallback || slots.placeholder;
      if (slot) {
        return slot();
      }
      const fallbackStr = props.fallback || props.placeholder || "";
      const fallbackTag = props.fallbackTag || props.placeholderTag || "span";
      return createElementBlock(fallbackTag, attrs, fallbackStr);
    };
  }
});
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "experience",
  __ssrInlineRender: true,
  setup(__props) {
    useLoading();
    useSeoMeta({
      title: "My Experiences"
    });
    ref([]);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ClientOnly = __nuxt_component_0;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "flex-1 flex flex-col justify-center page-section page-section-experience" }, _attrs))}><div class="flex-1 flex flex-col w-full sm:max-w-screen-sm lg:max-w-screen-lg mx-auto px-4 mb-4 py-10 flex flex-col justify-center"><div class="page-section-header mb-4 text-custom-1"><span>03.</span><span>My Experience</span></div><div class="px-4 pr-6 flex flex-col"><div class="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-2 min-h-[400px]">`);
      _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
      _push(`</div></div></div></section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/experience.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=experience-dCFcHeMX.mjs.map
