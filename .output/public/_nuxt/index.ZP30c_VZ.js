import{f as r,g as d,h as m,i as p,j as _,o as h,T as f,a as e,b as o,w,U as u,J as x}from"./entry.S40qjrla.js";import{_ as g}from"./nuxt-link.tLmDSEgW.js";import{Q as v}from"./runtime.DchUPTdc.js";const b={class:"flex-1 flex flex-col justify-center items-center relative overflow-hidden"},y=e("div",{class:"page-section-home-canvas-wrapper"},[e("canvas",{id:"page-section-home-canvas"})],-1),k={class:"w-full sm:max-w-screen-sm lg:max-w-screen-xl mx-auto px-4 pb-20"},L={class:"wrapper-with-tag"},N={class:"container-with-tag",style:{"--tag":"'h1'"}},A=e("div",{class:"mb-4"},[e("div",{class:"text-primary font-mono"},"Hi, my name is")],-1),B=e("div",{class:"text-[3.5rem] font-bold mb-4 leading-[4rem]"},[e("div",{class:"text-blue-200"},"Alfian Dwi Nugraha."),e("div",{class:"text-orange-200"},"A website engraver for artists.")],-1),j=e("div",{class:"text-sm font-light mb-4 max-w-xl leading-[1.3rem] tracking-wide"}," I am a web developer, who can handle web design, server side web, web games, and some desktop programming. now focusing on the web front end & solana web3. ",-1),E={class:"mb-4 flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 font-mono justify-start items-start"},M=e("span",null,"About Me",-1),T={href:"https://linktr.ee/viandwi24",target:"_blank",class:"w-auto flex items-center px-4 py-2 rounded bg-green-400 sm:flex space-x-1"},z=e("span",null,"Linktr.ee",-1),I={href:"https://github.com/viandwi24",target:"_blank",class:"w-auto flex items-center px-4 py-2 rounded bg-gray-600 sm:flex space-x-1"},C=e("span",null,"Github",-1),Q=r({__name:"index",setup(D){d({title:"Alfian Dwi Nugraha (viandwi24)",titleTemplate:""});const i=m();let s;const c=()=>{if(!s)return;const t=window.innerWidth;s.canvas.parentElement&&(s.canvas.style.width="100%",s.canvas.style.height="100%"),t<836?s.canvas.style.display="none":s.canvas.style.display="block"};return p(async()=>{i.setLoading(!0);const t=document.getElementById("page-section-home-canvas");if(t){const n=new v(t);await n.load("https://prod.spline.design/ftN8iqMHiFJT3atP/scene.splinecode"),await new Promise(a=>setTimeout(a,1e3)),i.setLoading(!1),window.addEventListener("resize",c),s=n}}),_(()=>{s&&(s.dispose(),s=void 0,window.removeEventListener("resize",c))}),(t,n)=>{const a=x,l=g;return h(),f(u,null,[e("div",b,[y,e("div",k,[e("div",L,[e("div",N,[A,B,j,e("div",E,[o(l,{to:"about",class:"w-auto flex items-center px-4 py-2 rounded bg-primary-400 sm:flex space-x-1"},{default:w(()=>[o(a,{name:"ic:sharp-emoji-people"}),M]),_:1}),e("a",T,[o(a,{name:"mdi:pine-tree-variant-outline"}),z]),e("a",I,[o(a,{name:"bi:github",class:"mr-2"}),C])])])])])])],1024)}}});export{Q as default};