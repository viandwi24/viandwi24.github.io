import{a as c,b as d,e as i,f as l,h as r,j as e,l as p,w as m,i as v,m as h,o as _}from"./entry.a487ca13.js";import{l as f}from"./runtime.2bd0c8a9.js";const w={class:"page-section page-section-home pt-4 position-relative overflow-hidden d-flex"},u=e("div",{class:"page-section-home-canvas-wrapper"},[e("canvas",{id:"page-section-home-canvas"})],-1),g={class:"container py-4 px-4 mx-auto d-flex flex-column justify-content-center flex-1"},b={class:"wrapper-with-tag"},x={class:"container-with-tag",style:{"--tag":"'h1'"}},y=v('<div class="mb-4"><div class="text-primary font-mono">Hi, my name is</div></div><div class="display-4 fw-bolder mb-4"><div class="text-custom-1">Alfian Dwi Nugraha.</div><div class="text-custom-2">A website engraver for artists.</div></div><div class="text-sm fw-light mb-4 w-50"> I am a web developer, who can handle web design, server side web, web games, and some desktop programming. now focusing on the web front end. </div>',3),k={class:"mb-4 d-flex flex-col md:flex-row space-y-4 md:space-x-4 md:space-y-0 font-mono"},L=e("i",{class:"bi-play-fill"},null,-1),B=e("span",null,"Lets Close About Me",-1),E=e("a",{href:"https://github.com/viandwi24",target:"_blank",class:"btn btn-dark d-flex gap-2"},[e("i",{class:"bi-github mr-2"}),e("span",null,"Github")],-1),C=c({__name:"index",setup(N){let s;const o=()=>{if(!s)return;const t=window.innerWidth;s.canvas.parentElement&&(s.canvas.style.width="100%",s.canvas.style.height="100%"),t<836?s.canvas.style.display="none":s.canvas.style.display="block"};return d(async()=>{i().isLoading.value=!0;const t=document.getElementById("page-section-home-canvas");if(t){const a=new f(t);await a.load("/scene.splinecode"),await new Promise(n=>setTimeout(n,1e3)),i().isLoading.value=!1,window.addEventListener("resize",o),s=a}}),l(()=>{s&&(s.dispose(),s=void 0,window.removeEventListener("resize",o))}),(t,a)=>{const n=h;return _(),r("section",w,[u,e("div",g,[e("div",b,[e("div",x,[y,e("div",k,[p(n,{to:"about",class:"btn btn-primary d-flex gap-1"},{default:m(()=>[L,B]),_:1}),E])])])])])}}});export{C as default};
