(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{134:function(n,t,e){"use strict";e(16),e(52);t.a=function(n,t){n.app;t("sleep",(function(n){return new Promise((function(t){return setTimeout(t,n)}))}))}},181:function(n,t,e){var content=e(349);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[n.i,content,""]]),content.locals&&(n.exports=content.locals);(0,e(59).default)("438e1f7c",content,!0,{sourceMap:!1})},197:function(n,t,e){"use strict";var o=e(8),r=(e(43),e(52),e(17));var f=Object(r.a)({setup:function(n,t){t.root;var e=Object(r.d)(!1),f=Object(r.d)(!1),l=Object(r.d)(!1),animate=function(n){var t=n.showParent,e=n.showChid,f=n.showNuxt,l=Object(r.f)(),c=l.$gsap,m=l.$sleep,d=l.route,h=c.timeline({});Object(r.g)(d,(function(){f.value=!1,h.pause(),h.fromTo(".bg .bg-primary",{width:"100%"},{width:"0%",opacity:1,duration:1,ease:"power2.out"}),h.fromTo(".bg",{left:"0%",opacity:1},{left:"100%",opacity:0,duration:1,ease:"power2.out",onComplete:function(){document.querySelector(".bg-primary").style.width="100%",animate()}}),h.resume()}));var animate=function(){var n=Object(o.a)(regeneratorRuntime.mark((function n(){return regeneratorRuntime.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return t.value=!0,e.value=!0,n.next=4,m(100);case 4:h.fromTo(".bg",{left:"100%"},{left:"0%",opacity:1,duration:1}),h.fromTo(".bg .bg-secondary",{width:"0%"},{width:"100%",duration:1,onComplete:function(){var n=Object(o.a)(regeneratorRuntime.mark((function n(){return regeneratorRuntime.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,m(100);case 2:f.value=!0;case 3:case"end":return n.stop()}}),n)})));function t(){return n.apply(this,arguments)}return t}()});case 6:case"end":return n.stop()}}),n)})));return function(){return n.apply(this,arguments)}}();return{animate:animate}}({showParent:e,showChid:f,showNuxt:l}).animate;return Object(r.c)((function(){setTimeout((function(){animate()}),100)})),{showParent:e,showChid:f,showNuxt:l}}}),l=(e(348),e(44)),component=Object(l.a)(f,(function(){var n=this,t=n.$createElement,e=n._self._c||t;return e("div",{staticClass:"bg-secondary"},[n.showParent?e("div",{staticClass:"screen max-h-screen max-w-screen h-screen w-screen flex flex-col"},[n._m(0),n._v(" "),n.showChid?[e("Navbar"),n._v(" "),n.showNuxt?e("Nuxt"):n._e()]:n._e()],2):n._e()])}),[function(){var n=this,t=n.$createElement,e=n._self._c||t;return e("div",{staticClass:"bg-container"},[e("div",{staticClass:"bg flex flex-col md:flex-row"},[e("div",{staticClass:"w-full md:w-1/2 bg-primary"}),n._v(" "),e("div",{staticClass:"hidden md:block w-full md:w-1/2 bg-secondary"})])])}],!1,null,null,null);t.a=component.exports;installComponents(component,{Navbar:e(367).default})},198:function(n,t,e){e(199),e(200),n.exports=e(203)},231:function(n,t,e){var content=e(232);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[n.i,content,""]]),content.locals&&(n.exports=content.locals);(0,e(59).default)("54037e9e",content,!0,{sourceMap:!1})},232:function(n,t,e){var o=e(58)((function(i){return i[1]}));o.push([n.i,"/*! tailwindcss v2.2.4 | MIT License | https://tailwindcss.com*/\n\n/*! modern-normalize v1.1.0 | MIT License | https://github.com/sindresorhus/modern-normalize */\n\n/*\nDocument\n========\n*/\n\n/**\nUse a better box model (opinionated).\n*/\n\n*,\n::before,\n::after {\n  box-sizing: border-box;\n}\n\n/**\nUse a more readable tab size (opinionated).\n*/\n\nhtml {\n  -moz-tab-size: 4;\n  -o-tab-size: 4;\n     tab-size: 4;\n}\n\n/**\n1. Correct the line height in all browsers.\n2. Prevent adjustments of font size after orientation changes in iOS.\n*/\n\nhtml {\n  line-height: 1.15; /* 1 */\n  -webkit-text-size-adjust: 100%; /* 2 */\n}\n\n/*\nSections\n========\n*/\n\n/**\nRemove the margin in all browsers.\n*/\n\nbody {\n  margin: 0;\n}\n\n/**\nImprove consistency of default fonts in all browsers. (https://github.com/sindresorhus/modern-normalize/issues/3)\n*/\n\nbody {\n  font-family:\n\t\tsystem-ui,\n\t\t-apple-system, /* Firefox supports this but not yet `system-ui` */\n\t\t'Segoe UI',\n\t\tRoboto,\n\t\tHelvetica,\n\t\tArial,\n\t\tsans-serif,\n\t\t'Apple Color Emoji',\n\t\t'Segoe UI Emoji';\n}\n\n/*\nGrouping content\n================\n*/\n\n/**\n1. Add the correct height in Firefox.\n2. Correct the inheritance of border color in Firefox. (https://bugzilla.mozilla.org/show_bug.cgi?id=190655)\n*/\n\nhr {\n  height: 0; /* 1 */\n  color: inherit; /* 2 */\n}\n\n/*\nText-level semantics\n====================\n*/\n\n/**\nAdd the correct text decoration in Chrome, Edge, and Safari.\n*/\n\nabbr[title] {\n  -webkit-text-decoration: underline dotted;\n          text-decoration: underline dotted;\n}\n\n/**\nAdd the correct font weight in Edge and Safari.\n*/\n\nb,\nstrong {\n  font-weight: bolder;\n}\n\n/**\n1. Improve consistency of default fonts in all browsers. (https://github.com/sindresorhus/modern-normalize/issues/3)\n2. Correct the odd 'em' font sizing in all browsers.\n*/\n\ncode,\nkbd,\nsamp,\npre {\n  font-family:\n\t\tui-monospace,\n\t\tSFMono-Regular,\n\t\tConsolas,\n\t\t'Liberation Mono',\n\t\tMenlo,\n\t\tmonospace; /* 1 */\n  font-size: 1em; /* 2 */\n}\n\n/**\nAdd the correct font size in all browsers.\n*/\n\nsmall {\n  font-size: 80%;\n}\n\n/**\nPrevent 'sub' and 'sup' elements from affecting the line height in all browsers.\n*/\n\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline;\n}\n\nsub {\n  bottom: -0.25em;\n}\n\nsup {\n  top: -0.5em;\n}\n\n/*\nTabular data\n============\n*/\n\n/**\n1. Remove text indentation from table contents in Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=999088, https://bugs.webkit.org/show_bug.cgi?id=201297)\n2. Correct table border color inheritance in all Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=935729, https://bugs.webkit.org/show_bug.cgi?id=195016)\n*/\n\ntable {\n  text-indent: 0; /* 1 */\n  border-color: inherit; /* 2 */\n}\n\n/*\nForms\n=====\n*/\n\n/**\n1. Change the font styles in all browsers.\n2. Remove the margin in Firefox and Safari.\n*/\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  font-family: inherit; /* 1 */\n  font-size: 100%; /* 1 */\n  line-height: 1.15; /* 1 */\n  margin: 0; /* 2 */\n}\n\n/**\nRemove the inheritance of text transform in Edge and Firefox.\n1. Remove the inheritance of text transform in Firefox.\n*/\n\nbutton,\nselect { /* 1 */\n  text-transform: none;\n}\n\n/**\nCorrect the inability to style clickable types in iOS and Safari.\n*/\n\nbutton,\n[type='button'] {\n  -webkit-appearance: button;\n}\n\n/**\nRemove the inner border and padding in Firefox.\n*/\n\n/**\nRestore the focus styles unset by the previous rule.\n*/\n\n/**\nRemove the additional ':invalid' styles in Firefox.\nSee: https://github.com/mozilla/gecko-dev/blob/2f9eacd9d3d995c937b4251a5557d95d494c9be1/layout/style/res/forms.css#L728-L737\n*/\n\n/**\nRemove the padding so developers are not caught out when they zero out 'fieldset' elements in all browsers.\n*/\n\nlegend {\n  padding: 0;\n}\n\n/**\nAdd the correct vertical alignment in Chrome and Firefox.\n*/\n\nprogress {\n  vertical-align: baseline;\n}\n\n/**\nCorrect the cursor style of increment and decrement buttons in Safari.\n*/\n\n/**\n1. Correct the odd appearance in Chrome and Safari.\n2. Correct the outline style in Safari.\n*/\n\n/**\nRemove the inner padding in Chrome and Safari on macOS.\n*/\n\n/**\n1. Correct the inability to style clickable types in iOS and Safari.\n2. Change font properties to 'inherit' in Safari.\n*/\n\n/*\nInteractive\n===========\n*/\n\n/*\nAdd the correct display in Chrome and Safari.\n*/\n\nsummary {\n  display: list-item;\n}\n\n/**\n * Manually forked from SUIT CSS Base: https://github.com/suitcss/base\n * A thin layer on top of normalize.css that provides a starting point more\n * suitable for web applications.\n */\n\n/**\n * Removes the default spacing and border for appropriate elements.\n */\n\nblockquote,\ndl,\ndd,\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\nhr,\nfigure,\np,\npre {\n  margin: 0;\n}\n\nbutton {\n  background-color: transparent;\n  background-image: none;\n}\n\nfieldset {\n  margin: 0;\n  padding: 0;\n}\n\nol,\nul {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n}\n\n/**\n * Tailwind custom reset styles\n */\n\n/**\n * 1. Use the user's configured `sans` font-family (with Tailwind's default\n *    sans-serif font stack as a fallback) as a sane default.\n * 2. Use Tailwind's default \"normal\" line-height so the user isn't forced\n *    to override it to ensure consistency even when using the default theme.\n */\n\nhtml {\n  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, \"Noto Sans\", sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\"; /* 1 */\n  line-height: 1.5; /* 2 */\n}\n\n/**\n * Inherit font-family and line-height from `html` so users can set them as\n * a class directly on the `html` element.\n */\n\nbody {\n  font-family: inherit;\n  line-height: inherit;\n}\n\n/**\n * 1. Prevent padding and border from affecting element width.\n *\n *    We used to set this in the html element and inherit from\n *    the parent element for everything else. This caused issues\n *    in shadow-dom-enhanced elements like <details> where the content\n *    is wrapped by a div with box-sizing set to `content-box`.\n *\n *    https://github.com/mozdevs/cssremedy/issues/4\n *\n *\n * 2. Allow adding a border to an element by just adding a border-width.\n *\n *    By default, the way the browser specifies that an element should have no\n *    border is by setting it's border-style to `none` in the user-agent\n *    stylesheet.\n *\n *    In order to easily add borders to elements by just setting the `border-width`\n *    property, we change the default border-style for all elements to `solid`, and\n *    use border-width to hide them instead. This way our `border` utilities only\n *    need to set the `border-width` property instead of the entire `border`\n *    shorthand, making our border utilities much more straightforward to compose.\n *\n *    https://github.com/tailwindcss/tailwindcss/pull/116\n */\n\n*,\n::before,\n::after {\n  box-sizing: border-box; /* 1 */\n  border-width: 0; /* 2 */\n  border-style: solid; /* 2 */\n  border-color: currentColor; /* 2 */\n}\n\n/*\n * Ensure horizontal rules are visible by default\n */\n\nhr {\n  border-top-width: 1px;\n}\n\n/**\n * Undo the `border-style: none` reset that Normalize applies to images so that\n * our `border-{width}` utilities have the expected effect.\n *\n * The Normalize reset is unnecessary for us since we default the border-width\n * to 0 on all elements.\n *\n * https://github.com/tailwindcss/tailwindcss/issues/362\n */\n\nimg {\n  border-style: solid;\n}\n\ntextarea {\n  resize: vertical;\n}\n\ninput::-moz-placeholder, textarea::-moz-placeholder {\n  opacity: 1;\n  color: #9ca3af;\n}\n\ninput:-ms-input-placeholder, textarea:-ms-input-placeholder {\n  opacity: 1;\n  color: #9ca3af;\n}\n\ninput::placeholder,\ntextarea::placeholder {\n  opacity: 1;\n  color: #9ca3af;\n}\n\nbutton {\n  cursor: pointer;\n}\n\ntable {\n  border-collapse: collapse;\n}\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  font-size: inherit;\n  font-weight: inherit;\n}\n\n/**\n * Reset links to optimize for opt-in styling instead of\n * opt-out.\n */\n\na {\n  color: inherit;\n  text-decoration: inherit;\n}\n\n/**\n * Reset form element properties that are easy to forget to\n * style explicitly so you don't inadvertently introduce\n * styles that deviate from your design system. These styles\n * supplement a partial reset that is already applied by\n * normalize.css.\n */\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  padding: 0;\n  line-height: inherit;\n  color: inherit;\n}\n\n/**\n * Use the configured 'mono' font family for elements that\n * are expected to be rendered with a monospace font, falling\n * back to the system monospace stack if there is no configured\n * 'mono' font family.\n */\n\npre,\ncode,\nkbd,\nsamp {\n  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace;\n}\n\n/**\n * 1. Make replaced elements `display: block` by default as that's\n *    the behavior you want almost all of the time. Inspired by\n *    CSS Remedy, with `svg` added as well.\n *\n *    https://github.com/mozdevs/cssremedy/issues/14\n * \n * 2. Add `vertical-align: middle` to align replaced elements more\n *    sensibly by default when overriding `display` by adding a\n *    utility like `inline`.\n *\n *    This can trigger a poorly considered linting error in some\n *    tools but is included by design.\n * \n *    https://github.com/jensimmons/cssremedy/issues/14#issuecomment-634934210\n */\n\nimg,\nsvg,\nvideo,\ncanvas,\naudio,\niframe,\nembed,\nobject {\n  display: block; /* 1 */\n  vertical-align: middle; /* 2 */\n}\n\n/**\n * Constrain images and videos to the parent width and preserve\n * their intrinsic aspect ratio.\n *\n * https://github.com/mozdevs/cssremedy/issues/14\n */\n\nimg,\nvideo {\n  max-width: 100%;\n  height: auto;\n}\n\n*, ::before, ::after{\n  --tw-border-opacity:1;\n  border-color:rgba(229, 231, 235, var(--tw-border-opacity));\n}\n\n.static{\n  position:static;\n}\n\n.relative{\n  position:relative;\n}\n\n.mr-2{\n  margin-right:0.5rem;\n}\n\n.mb-2{\n  margin-bottom:0.5rem;\n}\n\n.mb-4{\n  margin-bottom:1rem;\n}\n\n.flex{\n  display:flex;\n}\n\n.table{\n  display:table;\n}\n\n.hidden{\n  display:none;\n}\n\n.h-32{\n  height:8rem;\n}\n\n.h-screen{\n  height:100vh;\n}\n\n.max-h-full{\n  max-height:100%;\n}\n\n.max-h-screen{\n  max-height:100vh;\n}\n\n.w-32{\n  width:8rem;\n}\n\n.w-full{\n  width:100%;\n}\n\n.w-screen{\n  width:100vw;\n}\n\n.flex-1{\n  flex:1 1 0%;\n}\n\n.transform{\n  --tw-translate-x:0;\n  --tw-translate-y:0;\n  --tw-rotate:0;\n  --tw-skew-x:0;\n  --tw-skew-y:0;\n  --tw-scale-x:1;\n  --tw-scale-y:1;\n  transform:translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n}\n\n.hover\\:scale-105:hover{\n  --tw-scale-x:1.05;\n  --tw-scale-y:1.05;\n}\n\n@-webkit-keyframes spin{\n  to{\n    transform:rotate(360deg);\n  }\n}\n\n@keyframes spin{\n  to{\n    transform:rotate(360deg);\n  }\n}\n\n@-webkit-keyframes ping{\n  75%, 100%{\n    transform:scale(2);\n    opacity:0;\n  }\n}\n\n@keyframes ping{\n  75%, 100%{\n    transform:scale(2);\n    opacity:0;\n  }\n}\n\n@-webkit-keyframes pulse{\n  50%{\n    opacity:.5;\n  }\n}\n\n@keyframes pulse{\n  50%{\n    opacity:.5;\n  }\n}\n\n@-webkit-keyframes bounce{\n  0%, 100%{\n    transform:translateY(-25%);\n    -webkit-animation-timing-function:cubic-bezier(0.8,0,1,1);\n            animation-timing-function:cubic-bezier(0.8,0,1,1);\n  }\n\n  50%{\n    transform:none;\n    -webkit-animation-timing-function:cubic-bezier(0,0,0.2,1);\n            animation-timing-function:cubic-bezier(0,0,0.2,1);\n  }\n}\n\n@keyframes bounce{\n  0%, 100%{\n    transform:translateY(-25%);\n    -webkit-animation-timing-function:cubic-bezier(0.8,0,1,1);\n            animation-timing-function:cubic-bezier(0.8,0,1,1);\n  }\n\n  50%{\n    transform:none;\n    -webkit-animation-timing-function:cubic-bezier(0,0,0.2,1);\n            animation-timing-function:cubic-bezier(0,0,0.2,1);\n  }\n}\n\n.cursor-pointer{\n  cursor:pointer;\n}\n\n.flex-col{\n  flex-direction:column;\n}\n\n.justify-end{\n  justify-content:flex-end;\n}\n\n.justify-center{\n  justify-content:center;\n}\n\n.justify-between{\n  justify-content:space-between;\n}\n\n.space-x-8 > :not([hidden]) ~ :not([hidden]){\n  --tw-space-x-reverse:0;\n  margin-right:calc(2rem * var(--tw-space-x-reverse));\n  margin-left:calc(2rem * calc(1 - var(--tw-space-x-reverse)));\n}\n\n.overflow-hidden{\n  overflow:hidden;\n}\n\n.rounded-full{\n  border-radius:9999px;\n}\n\n.bg-gray-100{\n  --tw-bg-opacity:1;\n  background-color:rgba(243, 244, 246, var(--tw-bg-opacity));\n}\n\n.pb-10{\n  padding-bottom:2.5rem;\n}\n\n.text-center{\n  text-align:center;\n}\n\n.text-lg{\n  font-size:1.125rem;\n  line-height:1.75rem;\n}\n\n.text-xl{\n  font-size:1.25rem;\n  line-height:1.75rem;\n}\n\n.font-semibold{\n  font-weight:600;\n}\n\n.font-bold{\n  font-weight:700;\n}\n\n.italic{\n  font-style:italic;\n}\n\n.text-gray-50{\n  --tw-text-opacity:1;\n  color:rgba(249, 250, 251, var(--tw-text-opacity));\n}\n\n.text-gray-200{\n  --tw-text-opacity:1;\n  color:rgba(229, 231, 235, var(--tw-text-opacity));\n}\n\n*, ::before, ::after{\n  --tw-shadow:0 0 #0000;\n}\n\n.hover\\:shadow-xl:hover{\n  --tw-shadow:0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);\n  box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n}\n\n*, ::before, ::after{\n  --tw-ring-inset:var(--tw-empty,/*!*/ /*!*/);\n  --tw-ring-offset-width:0px;\n  --tw-ring-offset-color:#fff;\n  --tw-ring-color:rgba(59, 130, 246, 0.5);\n  --tw-ring-offset-shadow:0 0 #0000;\n  --tw-ring-shadow:0 0 #0000;\n}\n\n.transition-all{\n  transition-property:all;\n  transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration:150ms;\n}\n\n.transition{\n  transition-property:background-color, border-color, color, fill, stroke, opacity, box-shadow, transform, filter, -webkit-backdrop-filter;\n  transition-property:background-color, border-color, color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;\n  transition-property:background-color, border-color, color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter, -webkit-backdrop-filter;\n  transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration:150ms;\n}\n\n.duration-500{\n  transition-duration:500ms;\n}\n\n.ease-in-out{\n  transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);\n}\n\n@media (min-width: 640px){\n}\n\n@media (min-width: 768px){\n  .md\\:block{\n    display:block;\n  }\n\n  .md\\:flex{\n    display:flex;\n  }\n\n  .md\\:w-1\\/2{\n    width:50%;\n  }\n\n  .md\\:flex-row{\n    flex-direction:row;\n  }\n\n  .md\\:justify-between{\n    justify-content:space-between;\n  }\n}\n\n@media (min-width: 1024px){\n}\n\n@media (min-width: 1280px){\n}\n\n@media (min-width: 1536px){\n}",""]),o.locals={},n.exports=o},233:function(n,t,e){var content=e(234);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[n.i,content,""]]),content.locals&&(n.exports=content.locals);(0,e(59).default)("54c2559c",content,!0,{sourceMap:!1})},234:function(n,t,e){var o=e(58),r=e(235),f=e(236),l=e(237),c=e(238),m=e(239),d=e(240),h=e(241),x=e(242),w=e(243),y=e(244),v=e(245),S=e(246),P=e(247),k=e(248),I=e(249),z=e(250),C=e(251),B=e(252),j=e(253),R=e(254),T=e(255),M=e(256),_=e(257),E=e(258),O=e(259),A=e(260),L=e(261),N=e(262),F=e(263),U=e(264),$=e(265),X=e(266),Y=e(267),D=e(268),G=e(269),H=e(270),J=e(271),W=e(272),V=e(273),K=e(274),Q=e(275),Z=e(276),nn=e(277),tn=e(278),en=e(279),on=e(280),rn=e(281),an=e(282),fn=e(283),sn=e(284),ln=e(285),cn=e(286),mn=e(287),un=e(288),dn=e(289),pn=e(290),hn=e(291),xn=e(292),bn=e(293),wn=e(294),gn=e(295),yn=e(296),vn=e(297),Sn=e(298),Pn=e(299),kn=o((function(i){return i[1]})),In=r(f),zn=r(f,{hash:"?#iefix"}),Cn=r(l),Bn=r(c),jn=r(m),Rn=r(d),Tn=r(d,{hash:"?#iefix"}),Mn=r(h),_n=r(x),En=r(w),On=r(y),An=r(y,{hash:"?#iefix"}),Ln=r(v),Nn=r(S),Fn=r(P),Un=r(k),$n=r(k,{hash:"?#iefix"}),Xn=r(I),Yn=r(z),qn=r(C),Dn=r(B),Gn=r(B,{hash:"?#iefix"}),Hn=r(j),Jn=r(R),Wn=r(T),Vn=r(M),Kn=r(M,{hash:"?#iefix"}),Qn=r(_),Zn=r(E),nt=r(O),tt=r(A),et=r(A,{hash:"?#iefix"}),ot=r(L),it=r(N),at=r(F),ft=r(U),st=r(U,{hash:"?#iefix"}),lt=r($),ct=r(X),mt=r(Y),ut=r(D),pt=r(D,{hash:"?#iefix"}),ht=r(G),xt=r(H),bt=r(J),wt=r(W),gt=r(W,{hash:"?#iefix"}),yt=r(V),vt=r(K),St=r(Q),Pt=r(Z),kt=r(Z,{hash:"?#iefix"}),It=r(nn),zt=r(tn),Ct=r(en),Bt=r(on),jt=r(on,{hash:"?#iefix"}),Rt=r(rn),Tt=r(an),Mt=r(fn),_t=r(sn),Et=r(sn,{hash:"?#iefix"}),Ot=r(ln),At=r(cn),Lt=r(mn),Nt=r(un),Ft=r(un,{hash:"?#iefix"}),Ut=r(dn),$t=r(pn),Xt=r(hn),Yt=r(xn),qt=r(xn,{hash:"?#iefix"}),Dt=r(bn),Gt=r(wn),Ht=r(gn),Jt=r(yn),Wt=r(yn,{hash:"?#iefix"}),Vt=r(vn),Kt=r(Sn),Qt=r(Pn);kn.push([n.i,'@font-face{\n  font-family:"Proxima Soft";\n\n  src:url('+In+');\n\n  src:local("Proxima Soft SemiBold"),local("ProximaSoft-SemiBold"),url('+zn+') format("embedded-opentype"),url('+Cn+') format("woff2"),url('+Bn+') format("woff"),url('+jn+') format("truetype");\n\n  font-weight:600;\n\n  font-style:normal\n}\n\n@font-face{\n  font-family:"Proxima Soft";\n\n  src:url('+Rn+');\n\n  src:local("Proxima Soft Bold Italic"),local("ProximaSoft-BoldIt"),url('+Tn+') format("embedded-opentype"),url('+Mn+') format("woff2"),url('+_n+') format("woff"),url('+En+') format("truetype");\n\n  font-weight:700;\n\n  font-style:italic\n}\n\n@font-face{\n  font-family:"Proxima Soft";\n\n  src:url('+On+');\n\n  src:local("Proxima Soft Light"),local("ProximaSoft-Light"),url('+An+') format("embedded-opentype"),url('+Ln+') format("woff2"),url('+Nn+') format("woff"),url('+Fn+') format("truetype");\n\n  font-weight:300;\n\n  font-style:normal\n}\n\n@font-face{\n  font-family:"Proxima Soft";\n\n  src:url('+Un+');\n\n  src:local("Proxima Soft Thin"),local("ProximaSoft-Thin"),url('+$n+') format("embedded-opentype"),url('+Xn+') format("woff2"),url('+Yn+') format("woff"),url('+qn+') format("truetype");\n\n  font-weight:100;\n\n  font-style:normal\n}\n\n@font-face{\n  font-family:"Proxima Soft";\n\n  src:url('+Dn+');\n\n  src:local("Proxima Soft Light Italic"),local("ProximaSoft-LightIt"),url('+Gn+') format("embedded-opentype"),url('+Hn+') format("woff2"),url('+Jn+') format("woff"),url('+Wn+') format("truetype");\n\n  font-weight:300;\n\n  font-style:italic\n}\n\n@font-face{\n  font-family:"Proxima Soft";\n\n  src:url('+Vn+');\n\n  src:local("Proxima Soft Medium"),local("ProximaSoft-Medium"),url('+Kn+') format("embedded-opentype"),url('+Qn+') format("woff2"),url('+Zn+') format("woff"),url('+nt+') format("truetype");\n\n  font-weight:500;\n\n  font-style:normal\n}\n\n@font-face{\n  font-family:"Proxima Soft";\n\n  src:url('+tt+');\n\n  src:local("Proxima Soft SemiBold Italic"),local("ProximaSoft-SemiBoldIt"),url('+et+') format("embedded-opentype"),url('+ot+') format("woff2"),url('+it+') format("woff"),url('+at+') format("truetype");\n\n  font-weight:600;\n\n  font-style:italic\n}\n\n@font-face{\n  font-family:"Proxima Soft";\n\n  src:url('+ft+');\n\n  src:local("Proxima Soft Bold"),local("ProximaSoft-Bold"),url('+st+') format("embedded-opentype"),url('+lt+') format("woff2"),url('+ct+') format("woff"),url('+mt+') format("truetype");\n\n  font-weight:700;\n\n  font-style:normal\n}\n\n@font-face{\n  font-family:"Proxima Soft";\n\n  src:url('+ut+');\n\n  src:local("Proxima Soft Black"),local("ProximaSoft-Black"),url('+pt+') format("embedded-opentype"),url('+ht+') format("woff2"),url('+xt+') format("woff"),url('+bt+') format("truetype");\n\n  font-weight:900;\n\n  font-style:normal\n}\n\n@font-face{\n  font-family:"Proxima Soft";\n\n  src:url('+wt+');\n\n  src:local("Proxima Soft Regular Italic"),local("ProximaSoft-RegularIt"),url('+gt+') format("embedded-opentype"),url('+yt+') format("woff2"),url('+vt+') format("woff"),url('+St+') format("truetype");\n\n  font-weight:400;\n\n  font-style:italic\n}\n\n@font-face{\n  font-family:"Proxima Soft";\n\n  src:url('+Pt+');\n\n  src:local("Proxima Soft Regular"),local("ProximaSoft-Regular"),url('+kt+') format("embedded-opentype"),url('+It+') format("woff2"),url('+zt+') format("woff"),url('+Ct+') format("truetype");\n\n  font-weight:400;\n\n  font-style:normal\n}\n\n@font-face{\n  font-family:"Proxima Soft";\n\n  src:url('+Bt+');\n\n  src:local("Proxima Soft Medium Italic"),local("ProximaSoft-MediumIt"),url('+jt+') format("embedded-opentype"),url('+Rt+') format("woff2"),url('+Tt+') format("woff"),url('+Mt+') format("truetype");\n\n  font-weight:500;\n\n  font-style:italic\n}\n\n@font-face{\n  font-family:"Proxima Soft";\n\n  src:url('+_t+');\n\n  src:local("Proxima Soft Black Italic"),local("ProximaSoft-BlackIt"),url('+Et+') format("embedded-opentype"),url('+Ot+') format("woff2"),url('+At+') format("woff"),url('+Lt+') format("truetype");\n\n  font-weight:900;\n\n  font-style:italic\n}\n\n@font-face{\n  font-family:"Proxima Soft";\n\n  src:url('+Nt+');\n\n  src:local("Proxima Soft ExtraBold Italic"),local("ProximaSoft-ExtraBoldIt"),url('+Ft+') format("embedded-opentype"),url('+Ut+') format("woff2"),url('+$t+') format("woff"),url('+Xt+') format("truetype");\n\n  font-weight:800;\n\n  font-style:italic\n}\n\n@font-face{\n  font-family:"Proxima Soft";\n\n  src:url('+Yt+');\n\n  src:local("Proxima Soft Thin Italic"),local("ProximaSoft-ThinIt"),url('+qt+') format("embedded-opentype"),url('+Dt+') format("woff2"),url('+Gt+') format("woff"),url('+Ht+') format("truetype");\n\n  font-weight:100;\n\n  font-style:italic\n}\n\n@font-face{\n  font-family:"Proxima Soft";\n\n  src:url('+Jt+');\n\n  src:local("Proxima Soft ExtraBold"),local("ProximaSoft-ExtraBold"),url('+Wt+') format("embedded-opentype"),url('+Vt+') format("woff2"),url('+Kt+') format("woff"),url('+Qt+') format("truetype");\n\n  font-weight:800;\n\n  font-style:normal\n}\n\n*{\n  font-family:"Proxima Soft"!important\n}\n\n.text-primary{\n  color:#ff8f73\n}\n\n.text-secondary{\n  color:#ff734e\n}\n\n.bg-primary{\n  background:#ff8f73\n}\n\n.bg-secondary{\n  background:#ff734e\n}',""]),kn.locals={},n.exports=kn},236:function(n,t,e){n.exports=e.p+"fonts/ProximaSoft-SemiBold.38c42da.eot"},237:function(n,t,e){n.exports=e.p+"fonts/ProximaSoft-SemiBold.389407e.woff2"},238:function(n,t,e){n.exports=e.p+"fonts/ProximaSoft-SemiBold.f942589.woff"},239:function(n,t,e){n.exports=e.p+"fonts/ProximaSoft-SemiBold.28279b8.ttf"},240:function(n,t,e){n.exports=e.p+"fonts/ProximaSoft-BoldIt.1044af0.eot"},241:function(n,t,e){n.exports=e.p+"fonts/ProximaSoft-BoldIt.8aef978.woff2"},242:function(n,t,e){n.exports=e.p+"fonts/ProximaSoft-BoldIt.81c3041.woff"},243:function(n,t,e){n.exports=e.p+"fonts/ProximaSoft-BoldIt.8fec22b.ttf"},244:function(n,t,e){n.exports=e.p+"fonts/ProximaSoft-Light.c6098fa.eot"},245:function(n,t,e){n.exports=e.p+"fonts/ProximaSoft-Light.5538a21.woff2"},246:function(n,t,e){n.exports=e.p+"fonts/ProximaSoft-Light.6a11f04.woff"},247:function(n,t,e){n.exports=e.p+"fonts/ProximaSoft-Light.1c44bd2.ttf"},248:function(n,t,e){n.exports=e.p+"fonts/ProximaSoft-Thin.251f775.eot"},249:function(n,t,e){n.exports=e.p+"fonts/ProximaSoft-Thin.a7c5692.woff2"},250:function(n,t,e){n.exports=e.p+"fonts/ProximaSoft-Thin.1472149.woff"},251:function(n,t,e){n.exports=e.p+"fonts/ProximaSoft-Thin.c281263.ttf"},252:function(n,t,e){n.exports=e.p+"fonts/ProximaSoft-LightIt.df16810.eot"},253:function(n,t,e){n.exports=e.p+"fonts/ProximaSoft-LightIt.be039f1.woff2"},254:function(n,t,e){n.exports=e.p+"fonts/ProximaSoft-LightIt.757987f.woff"},255:function(n,t,e){n.exports=e.p+"fonts/ProximaSoft-LightIt.6812277.ttf"},256:function(n,t,e){n.exports=e.p+"fonts/ProximaSoft-Medium.8c19a8f.eot"},257:function(n,t,e){n.exports=e.p+"fonts/ProximaSoft-Medium.c60085a.woff2"},258:function(n,t,e){n.exports=e.p+"fonts/ProximaSoft-Medium.9f039e9.woff"},259:function(n,t,e){n.exports=e.p+"fonts/ProximaSoft-Medium.f0d977c.ttf"},260:function(n,t,e){n.exports=e.p+"fonts/ProximaSoft-SemiBoldIt.1cb6f1a.eot"},261:function(n,t,e){n.exports=e.p+"fonts/ProximaSoft-SemiBoldIt.5863a63.woff2"},262:function(n,t,e){n.exports=e.p+"fonts/ProximaSoft-SemiBoldIt.25e613a.woff"},263:function(n,t,e){n.exports=e.p+"fonts/ProximaSoft-SemiBoldIt.b5a7f9f.ttf"},264:function(n,t,e){n.exports=e.p+"fonts/ProximaSoft-Bold.30342b0.eot"},265:function(n,t,e){n.exports=e.p+"fonts/ProximaSoft-Bold.125a4bf.woff2"},266:function(n,t,e){n.exports=e.p+"fonts/ProximaSoft-Bold.2b98a84.woff"},267:function(n,t,e){n.exports=e.p+"fonts/ProximaSoft-Bold.ef33ef7.ttf"},268:function(n,t,e){n.exports=e.p+"fonts/ProximaSoft-Black.e961a16.eot"},269:function(n,t,e){n.exports=e.p+"fonts/ProximaSoft-Black.b16a45d.woff2"},270:function(n,t,e){n.exports=e.p+"fonts/ProximaSoft-Black.4810fd7.woff"},271:function(n,t,e){n.exports=e.p+"fonts/ProximaSoft-Black.75c61e7.ttf"},272:function(n,t,e){n.exports=e.p+"fonts/ProximaSoft-RegularIt.7bd55e6.eot"},273:function(n,t,e){n.exports=e.p+"fonts/ProximaSoft-RegularIt.e621652.woff2"},274:function(n,t,e){n.exports=e.p+"fonts/ProximaSoft-RegularIt.385a10d.woff"},275:function(n,t,e){n.exports=e.p+"fonts/ProximaSoft-RegularIt.13516f6.ttf"},276:function(n,t,e){n.exports=e.p+"fonts/ProximaSoft-Regular.5b14a42.eot"},277:function(n,t,e){n.exports=e.p+"fonts/ProximaSoft-Regular.b350941.woff2"},278:function(n,t,e){n.exports=e.p+"fonts/ProximaSoft-Regular.a5d4011.woff"},279:function(n,t,e){n.exports=e.p+"fonts/ProximaSoft-Regular.9abd536.ttf"},280:function(n,t,e){n.exports=e.p+"fonts/ProximaSoft-MediumIt.de93562.eot"},281:function(n,t,e){n.exports=e.p+"fonts/ProximaSoft-MediumIt.aaf4e37.woff2"},282:function(n,t,e){n.exports=e.p+"fonts/ProximaSoft-MediumIt.9981d59.woff"},283:function(n,t,e){n.exports=e.p+"fonts/ProximaSoft-MediumIt.644ac7b.ttf"},284:function(n,t,e){n.exports=e.p+"fonts/ProximaSoft-BlackIt.2c7754c.eot"},285:function(n,t,e){n.exports=e.p+"fonts/ProximaSoft-BlackIt.86be991.woff2"},286:function(n,t,e){n.exports=e.p+"fonts/ProximaSoft-BlackIt.6c41db4.woff"},287:function(n,t,e){n.exports=e.p+"fonts/ProximaSoft-BlackIt.7593a89.ttf"},288:function(n,t,e){n.exports=e.p+"fonts/ProximaSoft-ExtraBoldIt.d688477.eot"},289:function(n,t,e){n.exports=e.p+"fonts/ProximaSoft-ExtraBoldIt.a5c1b6f.woff2"},290:function(n,t,e){n.exports=e.p+"fonts/ProximaSoft-ExtraBoldIt.a6eb153.woff"},291:function(n,t,e){n.exports=e.p+"fonts/ProximaSoft-ExtraBoldIt.d7053e4.ttf"},292:function(n,t,e){n.exports=e.p+"fonts/ProximaSoft-ThinIt.2f5572b.eot"},293:function(n,t,e){n.exports=e.p+"fonts/ProximaSoft-ThinIt.3dfd3cc.woff2"},294:function(n,t,e){n.exports=e.p+"fonts/ProximaSoft-ThinIt.45f2250.woff"},295:function(n,t,e){n.exports=e.p+"fonts/ProximaSoft-ThinIt.f367d75.ttf"},296:function(n,t,e){n.exports=e.p+"fonts/ProximaSoft-ExtraBold.b9ff138.eot"},297:function(n,t,e){n.exports=e.p+"fonts/ProximaSoft-ExtraBold.0a7990b.woff2"},298:function(n,t,e){n.exports=e.p+"fonts/ProximaSoft-ExtraBold.642fa60.woff"},299:function(n,t,e){n.exports=e.p+"fonts/ProximaSoft-ExtraBold.0ec6f31.ttf"},348:function(n,t,e){"use strict";e(181)},349:function(n,t,e){var o=e(58)((function(i){return i[1]}));o.push([n.i,".show-enter-active,.show-leave-enter{\n  transform:translateX(0);\n  transition:all .3s linear\n}\n.show-enter,.show-leave-to{\n  transform:translateX(100%)\n}\n.screen{\n  width:100vw;\n  height:100vh;\n  overflow:hidden\n}\n.screen>.navbar{\n  z-index:2;\n  padding:.6rem\n}\n.screen>.navbar .navbar-menu>.item{\n  transition-property:all;\n  transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration:150ms;\n  transition-duration:500ms;\n  transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);\n  font-size:1.125rem;\n  line-height:1.75rem;\n  color:#e5e7eb\n}\n.screen>.navbar .navbar-menu>.item:hover{\n  color:#f9fafb\n}\n.screen>.navbar .navbar-menu>.item.active{\n  color:#f9fafb;\n  font-weight:700\n}\n.screen>.bg-container{\n  z-index:1;\n  overflow:hidden;\n  position:absolute\n}\n.screen>.bg-container>.bg{\n  width:100vw;\n  height:100vh;\n  position:relative\n}\n.screen>.bg-container>.bg>div{\n  width:100vw;\n  height:100vh\n}\n.screen>.page{\n  z-index:2\n}\n@media (min-width: 768px){\n.screen>.navbar{\n    padding-left:5rem;\n    padding-right:5rem;\n    padding-top:1rem\n}\n}",""]),o.locals={},n.exports=o},367:function(n,t,e){"use strict";e.r(t);var o=e(8),r=e(195),f=(e(43),e(36),e(17));var l=Object(f.a)({setup:function(){var n=function(){var n=Object(f.f)(),t=n.route,e=n.$gsap,l=n.$sleep,c=function(n){return n.to.name===t.value.name},menu=[{text:"About Me",to:{name:"index"}},{text:"Experience",to:{name:"experience"}},{text:"Projects",to:{name:"projects"}},{text:"Projects",to:"https://viandwi24.medium.com"},{text:"Github",to:"https://github.com/viandwi24"}],m=t;Object(f.g)(t,(function(n){n.path!==m.path?e.to(".navbar",{y:-50,duration:1,opacity:0,ease:"power2.out",onComplete:function(){var n=Object(o.a)(regeneratorRuntime.mark((function n(){return regeneratorRuntime.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,l(1e3);case 2:animate();case 3:case"end":return n.stop()}}),n)})));function t(){return n.apply(this,arguments)}return t}()}):Object(r.a)("oldRoute")}));var animate=function(){var n=Object(o.a)(regeneratorRuntime.mark((function n(){return regeneratorRuntime.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return document.querySelector(".navbar").style.opacity=0,n.next=3,l(100);case 3:e.fromTo(".navbar",{y:-50,opacity:0},{y:0,opacity:1,duration:1.5,ease:"power2.out"});case 4:case"end":return n.stop()}}),n)})));return function(){return n.apply(this,arguments)}}();return Object(f.c)((function(){return animate()})),{menu:menu,routeCheckActive:c}}();return{menu:n.menu,routeCheckActive:n.routeCheckActive}}}),c=e(44),component=Object(c.a)(l,(function(){var n=this,t=n.$createElement,e=n._self._c||t;return e("div",{staticClass:"navbar"},[e("div",{staticClass:"flex justify-between"},[e("div",{staticClass:"font-semibold text-lg text-gray-50"},[n._v("\n      VIANDWI24\n    ")]),n._v(" "),e("div",{staticClass:"navbar-menu flex-1 hidden md:flex space-x-8 justify-end"},[n._l(n.menu,(function(t,i){return["object"==typeof t.to?e("NuxtLink",{key:i,staticClass:"item",class:{active:n.routeCheckActive(t)},attrs:{tag:"a",to:t.to}},[n._v(n._s(t.text))]):e("a",{key:i,staticClass:"item",attrs:{href:t.to}},[n._v(n._s(t.text))])]}))],2)])])}),[],!1,null,null,null);t.default=component.exports}},[[198,6,1,7]]]);