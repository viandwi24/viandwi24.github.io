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
import 'ipx';
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
    ref([
      {
        category: "Programming Languages",
        items: [
          ["Html", 2014, "https://seeklogo.com/images/H/html5-without-wordmark-color-logo-14D252D878-seeklogo.com.png"],
          ["Css", 2014, "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/CSS3_logo.svg/48px-CSS3_logo.svg.png"],
          ["JavaScript", 2014, "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Unofficial_JavaScript_logo_2.svg/1024px-Unofficial_JavaScript_logo_2.svg.png"],
          ["VB6", 2015, "https://www.vectorlogo.zone/logos/microsoft_vb/microsoft_vb-icon.svg"],
          [".NET", 2016, "https://upload.wikimedia.org/wikipedia/commons/7/7d/Microsoft_.NET_logo.svg"],
          ["PHP", 2017, "https://www.vectorlogo.zone/logos/php/php-icon.svg"],
          ["Java", 2018, "https://www.vectorlogo.zone/logos/java/java-icon.svg"],
          ["C++", 2018, "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/ISO_C%2B%2B_Logo.svg/306px-ISO_C%2B%2B_Logo.svg.png"],
          ["C#", 2018, "https://upload.wikimedia.org/wikipedia/commons/4/4f/Csharp_Logo.png?20180210215736"],
          ["Typescript", 2019, "https://www.vectorlogo.zone/logos/typescriptlang/typescriptlang-icon.svg"],
          ["SASS", 2019, "https://www.vectorlogo.zone/logos/sass-lang/sass-lang-icon.svg"],
          ["Python", 2019, "https://www.vectorlogo.zone/logos/python/python-icon.svg"],
          ["Golang", 2022, "https://www.vectorlogo.zone/logos/golang/golang-icon.svg"],
          ["Rust", 2023, "https://www.vectorlogo.zone/logos/rust-lang/rust-lang-icon.svg"]
        ]
      },
      {
        category: "Frameworks",
        items: [
          // list all of this : nodejs-2019, deno-2019, bunjs-2023, codeigniter-2017, laravel-2018
          ["Codeigniter", 2017, "https://codeigniter.com/assets/icons/44521256.png"],
          ["Bootstrap", 2017, "https://www.vectorlogo.zone/logos/getbootstrap/getbootstrap-icon.svg"],
          ["JQuery", 2017, "https://www.vectorlogo.zone/logos/jquery/jquery-icon.svg"],
          ["Laravel", 2018, "https://www.vectorlogo.zone/logos/laravel/laravel-icon.svg"],
          ["Unity", 2018, "https://www.vectorlogo.zone/logos/unity3d/unity3d-icon.svg"],
          ["Vue", 2019, "https://www.vectorlogo.zone/logos/vuejs/vuejs-icon.svg"],
          ["Nuxt", 2019, "https://www.vectorlogo.zone/logos/nuxtjs/nuxtjs-icon.svg"],
          ["Tailwind", 2019, "https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-icon.svg"],
          ["Flutter", 2019, "https://www.vectorlogo.zone/logos/flutterio/flutterio-icon.svg"],
          ["Phaser", 2020, "https://www.vectorlogo.zone/logos/phaserio/phaserio-icon.svg"],
          ["Flask", 2021, "https://www.vectorlogo.zone/logos/pocoo_flask/pocoo_flask-icon.svg"],
          ["Express", 2021, "https://www.vectorlogo.zone/logos/expressjs/expressjs-icon.svg"],
          ["React", 2021, "https://www.vectorlogo.zone/logos/reactjs/reactjs-icon.svg"],
          ["GraphQL", 2021, "https://www.vectorlogo.zone/logos/graphql/graphql-icon.svg"],
          ["Next", 2023, "https://static-00.iconduck.com/assets.00/nextjs-icon-512x512-y563b8iq.png"]
        ]
      },
      {
        category: "Tools & Runtime",
        items: [
          ["Nodejs", 2019, "https://www.vectorlogo.zone/logos/nodejs/nodejs-icon.svg"],
          ["Deno", 2020, "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Deno_2021.svg/512px-Deno_2021.svg.png"],
          ["Bun", 2023, "https://bun.sh/logo.svg"]
        ]
      },
      {
        category: "DevOps",
        items: [
          // list : docker-2020, github-action-2021, kubernetes-2023, terraform-2023, jenkins-2024
          ["Docker", 2020, "https://www.vectorlogo.zone/logos/docker/docker-icon.svg"],
          ["PM2", 2020, "https://www.vectorlogo.zone/logos/pm2io/pm2io-icon.svg"],
          ["GAction", 2021, "https://www.vectorlogo.zone/logos/github/github-icon.svg"],
          ["Kubernetes", 2023, "https://www.vectorlogo.zone/logos/kubernetes/kubernetes-icon.svg"],
          ["Terraform", 2023, "https://www.vectorlogo.zone/logos/terraformio/terraformio-icon.svg"],
          ["Jenkins", 2024, "https://www.vectorlogo.zone/logos/jenkins/jenkins-icon.svg"]
        ]
      },
      {
        category: "Database",
        items: [
          // list : mysql-2017, postgresql-2018, mongodb-2020, redis-2020, sqlite-2021
          ["Mysql", 2017, "https://www.vectorlogo.zone/logos/mysql/mysql-icon.svg"],
          ["Postgresql", 2018, "https://www.vectorlogo.zone/logos/postgresql/postgresql-icon.svg"],
          ["Firebase", 2019, "https://www.vectorlogo.zone/logos/firebase/firebase-icon.svg"],
          ["Mongodb", 2020, "https://www.vectorlogo.zone/logos/mongodb/mongodb-icon.svg"],
          ["Redis", 2020, "https://www.vectorlogo.zone/logos/redis/redis-icon.svg"],
          ["Sqlite", 2021, "https://www.vectorlogo.zone/logos/sqlite/sqlite-icon.svg"]
        ]
      },
      {
        category: "Cloud",
        items: [
          // list: aws-2019, gcp-2021
          ["AWS", 2019, "https://www.vectorlogo.zone/logos/amazon_aws/amazon_aws-icon.svg"],
          ["GCP", 2021, "https://www.vectorlogo.zone/logos/google_cloud/google_cloud-icon.svg"]
        ]
      }
    ]);
    ref("");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ClientOnly = __nuxt_component_0;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "flex-1 flex flex-col justify-center page-section page-section-experience" }, _attrs))}><div class="flex-1 flex flex-col w-full sm:max-w-screen-sm lg:max-w-screen-lg mx-auto px-4 mb-4 py-10 justify-center"><div class="page-section-header mb-4 text-custom-1"><span>03.</span><span>My Experience</span></div><div class="px-4 pr-6 flex flex-col"><div>`);
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
//# sourceMappingURL=experience-zDUWBZm4.mjs.map
