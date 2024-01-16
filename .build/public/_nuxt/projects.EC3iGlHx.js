import{f as $,h as F,g as z,r as M,i as B,o as s,c as o,a as e,C as P,B as r,b as d,E as l,F as h,A as f,l as N,t as a,H as A}from"./entry.ztnDqsEX.js";const H={class:"flex-1 flex flex-col justify-center page-section page-section-experienc"},S={class:"w-full sm:max-w-screen-sm lg:max-w-screen-lg mx-auto px-4 mb-4"},V=e("div",{class:"page-section-header mb-4 text-custom-1"},[e("span",null,"04."),e("span",null,"My Projects")],-1),E={class:"flex flex-col space-y-4"},G=e("div",{class:"text-center text-xs font-semibold text-gray-500"}," Note: not all my projects are listed here. I have a lot of private projects and can't share them. ",-1),I={class:"flex"},D={key:0,class:"text-center"},R={key:0,class:"group pb-10"},T={class:"relative flex items-center w-full h-[300px] transition-all duration-300 group-hover:rounded-lg group-hover:p-4 group-hover:border border-primary-700"},q={class:"w-1/2 h-full rounded-lg relative overflow-hidden flex"},J=["src"],K={class:"flex-1 flex flex-col justify-end items-end pl-8"},O={class:"text-primary text-xs font-mono fw-lighter mb-1 pr-2"},Q={class:"text-primary-500 text-lg mb-4 pr-2"},U={class:"pl-4 text-right px-6 py-4 bg-slate-800 rounded-lg mb-4"},W={class:"flex space-x-4 fw-lighter text-custom-1 mb-2 font-mono z-30"},X={class:"flex space-x-4"},Y=["href"],Z=["href"],ee={key:1,class:"group pb-10"},te={class:"relative flex items-center w-full h-[300px] transition-all duration-300 group-hover:rounded-lg group-hover:p-4 group-hover:border border-primary-700"},se={class:"flex-1 flex flex-col justify-start items-start pr-8"},oe={class:"text-primary text-xs font-mono fw-lighter mb-1 pr-2"},re={class:"text-primary-500 text-lg mb-4 pr-2"},le={class:"pl-4 text-right px-6 py-4 bg-slate-800 rounded-lg mb-4"},ie={class:"flex space-x-4 fw-lighter text-custom-1 mb-2 font-mono z-30"},ne={class:"flex space-x-4"},ae=["href"],ce=["href"],de={class:"w-1/2 h-full rounded-lg relative overflow-hidden flex"},he=["src"],ge={key:2,class:"grid grid-cols-2 lg:grid-cols-4"},ue=["href"],pe={style:{position:"relative",height:"170px",overflow:"hidden",borderRadius:"10px"}},_e=["src"],xe=$({__name:"projects",setup(fe){const g=F();z({title:"Projects"});const _=M([]),n=M("list"),C=async()=>{g.setLoading(!0),await new Promise(u=>setTimeout(u,1e3));try{const u=`${window.location.href}.json`,i=await $fetch(u);i&&Array.isArray(i)&&i.length>0&&i[0].name&&(_.value=i,console.log("projects",_.value))}catch{console.log("cannot fetch projects")}g.setLoading(!1)};return B(()=>{C()}),(u,i)=>{const c=N;return s(),o("section",H,[e("div",S,[V,e("div",E,[G,e("div",null,[e("div",I,[e("button",{class:P(["text-lg rounded flex justify-center items-center border px-1.5 py-1",{"bg-gray-500/75":r(n)==="list","":r(n)==="grid"}]),onClick:i[0]||(i[0]=()=>n.value="list")},[d(c,{name:"material-symbols:view-list-sharp"})],2),e("button",{class:P(["text-lg rounded flex justify-center items-center border px-1.5 py-1",{"bg-gray-500/75":r(n)==="grid","":r(n)==="list"}]),onClick:i[1]||(i[1]=()=>n.value="grid")},[d(c,{name:"bi:grid-3x3-gap-fill",class:"text-sm"})],2)])]),r(g).$state.isLoading?(s(),o("div",D," Loading, Please wait... ")):l("",!0),r(n)==="list"?(s(),o(h,{key:1},[r(g).$state.isLoading?l("",!0):(s(!0),o(h,{key:0},f(r(_),(t,m)=>{var p,b,v,y,k,w,j,L;return s(),o(h,{key:Math.random()},[m%2===0?(s(),o("div",R,[e("div",T,[e("div",q,[e("img",{src:t.image,style:{height:"100%",width:"100%",objectFit:"cover",objectPosition:"center"}},null,8,J)]),e("div",K,[e("div",O,a(t.type),1),e("div",Q,a(t.name),1),e("div",U,a(t.description),1),e("div",W,[(s(!0),o(h,null,f(t.tags,x=>(s(),o("span",{key:Math.random()},a(x),1))),128))]),e("div",X,[(p=t.links)!=null&&p.github?(s(),o("a",{key:0,class:"icon-link",target:"_blank",href:(b=t.links)==null?void 0:b.github},[d(c,{class:"text-lg",name:"mdi:github",role:"img","aria-label":"GitHub"})],8,Y)):l("",!0),(v=t.links)!=null&&v.demo?(s(),o("a",{key:1,class:"icon-link",target:"_blank",href:(y=t.links)==null?void 0:y.demo},[d(c,{class:"text-lg",name:"material-symbols-light:open-in-new"})],8,Z)):l("",!0)])])])])):l("",!0),m%2!==0?(s(),o("div",ee,[e("div",te,[e("div",se,[e("div",oe,a(t.type),1),e("div",re,a(t.name),1),e("div",le,a(t.description),1),e("div",ie,[(s(!0),o(h,null,f(t.tags,x=>(s(),o("span",{key:Math.random()},a(x),1))),128))]),e("div",ne,[(k=t.links)!=null&&k.github?(s(),o("a",{key:0,class:"icon-link",target:"_blank",href:(w=t.links)==null?void 0:w.github},[d(c,{class:"text-lg",name:"mdi:github",role:"img","aria-label":"GitHub"})],8,ae)):l("",!0),(j=t.links)!=null&&j.demo?(s(),o("a",{key:1,class:"icon-link",target:"_blank",href:(L=t.links)==null?void 0:L.demo},[d(c,{class:"text-lg",name:"material-symbols-light:open-in-new"})],8,ce)):l("",!0)])]),e("div",de,[e("img",{src:t.image,style:{height:"100%",width:"100%",objectFit:"cover",objectPosition:"center"}},null,8,he)])])])):l("",!0)],64)}),128))],64)):l("",!0),r(n)==="grid"?(s(),o("div",ge,[r(g).$state.isLoading?l("",!0):(s(!0),o(h,{key:0},f(r(_),(t,m)=>{var p;return s(),o("a",{key:Math.random(),class:"px-2 py-2 border border-transparent hover:border-primary-600 rounded-lg transition-all duration-300",href:((p=t.links)==null?void 0:p.demo)||void 0,target:"_blank"},[e("div",pe,[e("img",{src:t.image,alt:"Preview",style:A({position:"absolute",display:"block",width:"100%",height:"100%",transform:"scale(1.25) translate(-50%, -50%)",objectFit:"cover",objectPosition:"center",left:"50%",top:"50%"})},null,12,_e)])],8,ue)}),128))])):l("",!0)])])])}}});export{xe as default};
