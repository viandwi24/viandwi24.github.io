import{_ as j}from"./nuxt-link.h1iL3AdO.js";import{i as S,a7 as W,a8 as A,a9 as B,z as h,A as k,r as m,v as g,K as O,B as T,f as Z,aa as z,c as v,a as t,b as w,w as b,G as V,H,I as E,Q as M,ab as F,d as $,o as p,t as x,J as D}from"./entry.kmat55KO.js";function I(e){return A()?(B(e),!0):!1}function L(e){return typeof e=="function"?e():h(e)}const R=typeof window<"u"&&typeof document<"u";typeof WorkerGlobalScope<"u"&&globalThis instanceof WorkerGlobalScope;const G=Object.prototype.toString,P=e=>G.call(e)==="[object Object]",Q=()=>{};function Y(e){return e||k()}function J(e,s=!0,o){Y()?S(e,o):s?e():W(e)}function K(e){var s;const o=L(e);return(s=o==null?void 0:o.$el)!=null?s:o}const C=R?window:void 0;function q(...e){let s,o,r,n;if(typeof e[0]=="string"||Array.isArray(e[0])?([o,r,n]=e,s=C):[s,o,r,n]=e,!s)return Q;Array.isArray(o)||(o=[o]),Array.isArray(r)||(r=[r]);const l=[],a=()=>{l.forEach(i=>i()),l.length=0},c=(i,d,_,y)=>(i.addEventListener(d,_,y),()=>i.removeEventListener(d,_,y)),u=g(()=>[K(s),L(n)],([i,d])=>{if(a(),!i)return;const _=P(d)?{...d}:d;l.push(...o.flatMap(y=>r.map(N=>c(i,y,N,_))))},{immediate:!0,flush:"post"}),f=()=>{u(),a()};return I(f),f}function U(){const e=m(!1);return k()&&S(()=>{e.value=!0}),e}function X(e){const s=U();return T(()=>(s.value,!!e()))}function ee(e,s={}){const{window:o=C}=s,r=X(()=>o&&"matchMedia"in o&&typeof o.matchMedia=="function");let n;const l=m(!1),a=f=>{l.value=f.matches},c=()=>{n&&("removeEventListener"in n?n.removeEventListener("change",a):n.removeListener(a))},u=O(()=>{r.value&&(c(),n=o.matchMedia(L(e)),"addEventListener"in n?n.addEventListener("change",a):n.addListener(a),l.value=n.matches)});return I(()=>{u(),c(),n=void 0}),l}function te(e={}){const{window:s=C,initialWidth:o=Number.POSITIVE_INFINITY,initialHeight:r=Number.POSITIVE_INFINITY,listenOrientation:n=!0,includeScrollbar:l=!0}=e,a=m(o),c=m(r),u=()=>{s&&(l?(a.value=s.innerWidth,c.value=s.innerHeight):(a.value=s.document.documentElement.clientWidth,c.value=s.document.documentElement.clientHeight))};if(u(),J(u),q("resize",u,{passive:!0}),n){const f=ee("(orientation: portrait)");g(f,()=>u())}return{width:a,height:c}}const ne={class:"w-full min-h-screen flex flex-col text-gray-100 bg-gray-950"},se={class:"fixed top-0 left-0 w-full py-4 px-6 z-10 bg-gray-950"},oe={class:"relative flex justify-between"},ae={class:"flex"},ie=t("svg",{width:"27.71",height:"32",viewBox:"0 0 167 192",fill:"#0096FF",xmlns:"http://www.w3.org/2000/svg"},[t("path",{d:"M69.8874 125V117.448L82.3034 98.376C83.2421 96.968 84.1168 95.6027 84.9274 94.28C85.7808 92.9573 86.4634 91.6133 86.9754 90.248C87.5301 88.8827 87.8074 87.4533 87.8074 85.96C87.8074 84.4667 87.5088 83.3573 86.9114 82.632C86.3141 81.9067 85.5034 81.544 84.4794 81.544C83.3274 81.544 82.4314 81.864 81.7914 82.504C81.1514 83.144 80.7034 83.9973 80.4474 85.064C80.2341 86.1307 80.1274 87.3253 80.1274 88.648V91.208H69.7594V88.456C69.7594 85.384 70.2501 82.6533 71.2314 80.264C72.2128 77.832 73.7701 75.9333 75.9034 74.568C78.0368 73.16 80.8314 72.456 84.2874 72.456C88.9381 72.456 92.4368 73.672 94.7834 76.104C97.1728 78.4933 98.3674 81.8427 98.3674 86.152C98.3674 88.2427 98.0261 90.184 97.3434 91.976C96.7034 93.768 95.8288 95.5173 94.7194 97.224C93.6528 98.888 92.5008 100.637 91.2634 102.472L81.7914 116.616H96.9594V125H69.8874Z"}),t("path",{d:"M44.3279 125L34.9839 73.16H44.7759L50.3439 108.36L55.5279 73.16H65.8959L56.4239 125H44.3279Z"}),t("path",{"fill-rule":"evenodd","clip-rule":"evenodd",d:"M116.674 113.352V125H126.658V113.352H131.458V105.416H126.658V73.16H114.242L100.738 105.48V113.352H116.674ZM116.674 105.416H108.866L116.674 83.848V105.416Z"}),t("path",{"fill-rule":"evenodd","clip-rule":"evenodd",d:"M83.1384 0L166.277 48V144L83.1384 192L0 144V48L83.1384 0ZM10 53.7735L83.1384 11.547L156.277 53.7735V138.227L83.1384 180.453L10 138.227V53.7735Z"})],-1),re={class:"hidden flex-1 lg:flex justify-center items-center pr-6"},le={key:0,class:"flex space-x-5 text-sm font-mono"},ce={class:"text-primary-500"},ue={key:0,class:"flex mt-4"},de={class:"flex flex-col space-y-2 text-sm font-mono justify-center items-center w-full"},fe={class:"text-primary-500"},pe={class:"flex-1 flex flex-col pt-16 min-h-full"},he={class:"flex-1 flex flex-col"},me=t("div",{class:"text-center py-2"},[t("div",{class:"text-sm text-gray-500"},[$(" Design by "),t("a",{href:"https://github.com/viandwi24",class:"text-primary-500 italic underline underline-primary-500"},"@viandwi24")])],-1),ve=t("div",{class:"tso-rainbow"},null,-1),xe=Z({__name:"default",setup(e){const s=z(),o=te(),r=[{name:"Home",path:"/"},{name:"About",path:"/about"},{name:"Experience",path:"/experience"},{name:"Projects",path:"/projects"},{name:"Blog",path:"/blog"},{name:"Contact",path:"/contact"}],n=m(!1),l=m(s.currentRoute.value.path);return g(s.currentRoute,(a,c)=>{a.path!==l.value&&(n.value=!1,l.value=a.path)}),(a,c)=>{const u=j,f=D;return p(),v("div",ne,[t("div",se,[t("div",oe,[t("div",ae,[w(u,{class:"",to:"/"},{default:b(()=>[ie]),_:1})]),t("div",re,[!h(n)||h(o).width.value>768?(p(),v("ul",le,[(p(),v(V,null,H(r,(i,d)=>t("li",{key:i.name},[w(u,{class:"text-white font-semibold","active-class":"border-b border-dotted border-primary-500 pb-1",to:i.path},{default:b(()=>[t("span",ce,"0"+x(d+1)+".",1),t("span",null,"// "+x(i.name),1)]),_:2},1032,["to"])])),64))])):E("",!0)]),t("div",null,[t("button",{class:"lg:hidden",onClick:c[0]||(c[0]=i=>n.value=!h(n))},[h(n)?(p(),M(f,{key:1,name:"ic:outline-close",class:"w-6 h-6"})):(p(),M(f,{key:0,name:"ic:outline-menu",class:"w-6 h-6"}))])])]),h(n)&&h(o).width.value<=768?(p(),v("div",ue,[t("ul",de,[(p(),v(V,null,H(r,(i,d)=>t("li",{key:i.name},[w(u,{class:"text-white font-semibold","active-class":"border-b border-dotted border-primary-500 pb-1",to:i.path},{default:b(()=>[t("span",fe,"0"+x(d+1)+".",1),t("span",null,"// "+x(i.name),1)]),_:2},1032,["to"])])),64))])])):E("",!0)]),t("div",pe,[t("div",he,[F(a.$slots,"default")]),me]),ve])}}});export{xe as default};