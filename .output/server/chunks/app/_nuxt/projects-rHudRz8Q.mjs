import { b as useLoading, a as useSeoMeta, h as __nuxt_component_0 } from '../server.mjs';
import { _ as __nuxt_component_1 } from './nuxt-img-ncrCwSjj.mjs';
import { defineComponent, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrRenderStyle, ssrInterpolate } from 'vue/server-renderer';
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
  __name: "projects",
  __ssrInlineRender: true,
  setup(__props) {
    const $loading = useLoading();
    useSeoMeta({
      title: "Projects"
    });
    const projects = ref([]);
    const listingMode = ref("list");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_0;
      const _component_NuxtImg = __nuxt_component_1;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "flex-1 flex flex-col justify-center page-section page-section-experienc" }, _attrs))}><div class="w-full sm:max-w-screen-sm lg:max-w-screen-lg mx-auto px-4 mb-4"><div class="page-section-header mb-4 text-custom-1"><span>04.</span><span>My Projects</span></div><div class="flex flex-col space-y-4"><div class="text-center text-xs font-semibold text-gray-500"> Note: not all my projects are listed here. I have a lot of private projects and can&#39;t share them. </div><div><div class="flex"><button class="${ssrRenderClass([{
        "bg-gray-500/75": unref(listingMode) === "list",
        "": unref(listingMode) === "grid"
      }, "text-lg rounded flex justify-center items-center border px-1.5 py-1"])}">`);
      _push(ssrRenderComponent(_component_Icon, { name: "material-symbols:view-list-sharp" }, null, _parent));
      _push(`</button><button class="${ssrRenderClass([{
        "bg-gray-500/75": unref(listingMode) === "grid",
        "": unref(listingMode) === "list"
      }, "text-lg rounded flex justify-center items-center border px-1.5 py-1"])}">`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "bi:grid-3x3-gap-fill",
        class: "text-sm"
      }, null, _parent));
      _push(`</button></div></div>`);
      if (unref($loading).$state.isLoading) {
        _push(`<div class="text-center"> Loading, Please wait... </div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(listingMode) === "list") {
        _push(`<!--[-->`);
        if (!unref($loading).$state.isLoading) {
          _push(`<!--[-->`);
          ssrRenderList(unref(projects), (item, i) => {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            _push(`<!--[-->`);
            if (i % 2 === 0) {
              _push(`<div class="group pb-10"><div class="relative flex items-center w-full h-[300px] transition-all duration-300 group-hover:rounded-lg group-hover:p-4 group-hover:border border-primary-700"><div class="w-1/2 h-full rounded-lg relative overflow-hidden flex">`);
              if (item.image.split(".").pop() === "gif") {
                _push(`<img${ssrRenderAttr("src", item.image)}${ssrRenderAttr("alt", `Preview of ${item.name}`)} style="${ssrRenderStyle({
                  height: "100%",
                  width: "100%",
                  objectFit: "cover",
                  objectPosition: "center"
                })}">`);
              } else {
                _push(ssrRenderComponent(_component_NuxtImg, {
                  src: item.image,
                  alt: `Preview of ${item.name}`,
                  style: {
                    height: "100%",
                    width: "100%",
                    objectFit: "cover",
                    objectPosition: "center"
                  }
                }, null, _parent));
              }
              _push(`</div><div class="flex-1 flex flex-col justify-end items-end pl-8"><div class="text-primary text-xs font-mono fw-lighter mb-1 pr-2">${ssrInterpolate(item.type)}</div><div class="text-primary-500 text-lg mb-4 pr-2">${ssrInterpolate(item.name)}</div><div class="pl-4 text-right px-6 py-4 bg-slate-800 rounded-lg mb-4">${ssrInterpolate(item.description)}</div><div class="flex space-x-4 fw-lighter text-custom-1 mb-2 font-mono z-30"><!--[-->`);
              ssrRenderList(item.tags, (tag) => {
                _push(`<span>${ssrInterpolate(tag)}</span>`);
              });
              _push(`<!--]--></div><div class="flex space-x-4">`);
              if ((_a = item.links) == null ? void 0 : _a.github) {
                _push(`<a class="icon-link" target="_blank"${ssrRenderAttr("href", (_b = item.links) == null ? void 0 : _b.github)}>`);
                _push(ssrRenderComponent(_component_Icon, {
                  class: "text-lg",
                  name: "mdi:github",
                  role: "img",
                  "aria-label": "GitHub"
                }, null, _parent));
                _push(`</a>`);
              } else {
                _push(`<!---->`);
              }
              if ((_c = item.links) == null ? void 0 : _c.demo) {
                _push(`<a class="icon-link" target="_blank"${ssrRenderAttr("href", (_d = item.links) == null ? void 0 : _d.demo)}>`);
                _push(ssrRenderComponent(_component_Icon, {
                  class: "text-lg",
                  name: "material-symbols-light:open-in-new"
                }, null, _parent));
                _push(`</a>`);
              } else {
                _push(`<!---->`);
              }
              _push(`</div></div></div></div>`);
            } else {
              _push(`<!---->`);
            }
            if (i % 2 !== 0) {
              _push(`<div class="group pb-10"><div class="relative flex items-center w-full h-[300px] transition-all duration-300 group-hover:rounded-lg group-hover:p-4 group-hover:border border-primary-700"><div class="flex-1 flex flex-col justify-start items-start pr-8"><div class="text-primary text-xs font-mono fw-lighter mb-1 pr-2">${ssrInterpolate(item.type)}</div><div class="text-primary-500 text-lg mb-4 pr-2">${ssrInterpolate(item.name)}</div><div class="pl-4 text-right px-6 py-4 bg-slate-800 rounded-lg mb-4">${ssrInterpolate(item.description)}</div><div class="flex space-x-4 fw-lighter text-custom-1 mb-2 font-mono z-30"><!--[-->`);
              ssrRenderList(item.tags, (tag) => {
                _push(`<span>${ssrInterpolate(tag)}</span>`);
              });
              _push(`<!--]--></div><div class="flex space-x-4">`);
              if ((_e = item.links) == null ? void 0 : _e.github) {
                _push(`<a class="icon-link" target="_blank"${ssrRenderAttr("href", (_f = item.links) == null ? void 0 : _f.github)}>`);
                _push(ssrRenderComponent(_component_Icon, {
                  class: "text-lg",
                  name: "mdi:github",
                  role: "img",
                  "aria-label": "GitHub"
                }, null, _parent));
                _push(`</a>`);
              } else {
                _push(`<!---->`);
              }
              if ((_g = item.links) == null ? void 0 : _g.demo) {
                _push(`<a class="icon-link" target="_blank"${ssrRenderAttr("href", (_h = item.links) == null ? void 0 : _h.demo)}>`);
                _push(ssrRenderComponent(_component_Icon, {
                  class: "text-lg",
                  name: "material-symbols-light:open-in-new"
                }, null, _parent));
                _push(`</a>`);
              } else {
                _push(`<!---->`);
              }
              _push(`</div></div><div class="w-1/2 h-full rounded-lg relative overflow-hidden flex">`);
              if (item.image.split(".").pop() === "gif") {
                _push(`<img${ssrRenderAttr("src", item.image)}${ssrRenderAttr("alt", `Preview of ${item.name}`)} style="${ssrRenderStyle({
                  height: "100%",
                  width: "100%",
                  objectFit: "cover",
                  objectPosition: "center"
                })}">`);
              } else {
                _push(ssrRenderComponent(_component_NuxtImg, {
                  src: item.image,
                  alt: `Preview of ${item.name}`,
                  style: {
                    height: "100%",
                    width: "100%",
                    objectFit: "cover",
                    objectPosition: "center"
                  }
                }, null, _parent));
              }
              _push(`</div></div></div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`<!--]-->`);
          });
          _push(`<!--]-->`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      } else {
        _push(`<!---->`);
      }
      if (unref(listingMode) === "grid") {
        _push(`<div class="grid grid-cols-2 lg:grid-cols-4">`);
        if (!unref($loading).$state.isLoading) {
          _push(`<!--[-->`);
          ssrRenderList(unref(projects), (item, i) => {
            var _a;
            _push(`<a class="px-2 py-2 border border-transparent hover:border-primary-600 rounded-lg transition-all duration-300"${ssrRenderAttr("href", ((_a = item.links) == null ? void 0 : _a.demo) || void 0)} target="_blank"><div style="${ssrRenderStyle({
              position: "relative",
              height: "170px",
              overflow: "hidden",
              borderRadius: "10px"
            })}">`);
            if (item.image.split(".").pop() === "gif") {
              _push(`<img${ssrRenderAttr("src", item.image)}${ssrRenderAttr("alt", `Preview of ${item.name}`)} style="${ssrRenderStyle({
                position: "absolute",
                display: "block",
                width: "100%",
                height: "100%",
                transform: "scale(1.25) translate(-50%, -50%)",
                objectFit: "cover",
                objectPosition: "center",
                left: "50%",
                top: "50%"
              })}">`);
            } else {
              _push(ssrRenderComponent(_component_NuxtImg, {
                src: item.image,
                alt: `Preview of ${item.name}`,
                style: {
                  position: "absolute",
                  display: "block",
                  width: "100%",
                  height: "100%",
                  transform: "scale(1.25) translate(-50%, -50%)",
                  objectFit: "cover",
                  objectPosition: "center",
                  left: "50%",
                  top: "50%"
                }
              }, null, _parent));
            }
            _push(`</div></a>`);
          });
          _push(`<!--]-->`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/projects.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=projects-rHudRz8Q.mjs.map
