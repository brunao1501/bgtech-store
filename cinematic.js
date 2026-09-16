/* Fine-pointer depth stays subtle; scrolling remains native. */
(()=>{
 const motion=matchMedia('(prefers-reduced-motion: reduce)');
 const fine=matchMedia('(hover: hover) and (pointer: fine)');
 const scene=document.querySelector('.hero-scene');
 const stage=document.querySelector('.hero-product');
 function depth(el,event,x,y,amount){const r=el.getBoundingClientRect();el.style.setProperty(x,`${-(event.clientY-r.top-r.height/2)/r.height*amount}deg`);el.style.setProperty(y,`${(event.clientX-r.left-r.width/2)/r.width*amount}deg`)}
 stage?.addEventListener('pointermove',e=>{if(motion.matches||!fine.matches)return;const r=stage.getBoundingClientRect();scene.style.setProperty('--scene-x',`${-(e.clientY-r.top-r.height/2)/r.height*9}deg`);scene.style.setProperty('--scene-y',`${(e.clientX-r.left-r.width/2)/r.width*12}deg`)});
 stage?.addEventListener('pointerleave',()=>{scene.style.setProperty('--scene-x','0deg');scene.style.setProperty('--scene-y','0deg')});
 document.querySelectorAll('.editorial-card').forEach(card=>{card.addEventListener('pointermove',e=>{if(!motion.matches&&fine.matches)depth(card,e,'--card-x','--card-y',9)});card.addEventListener('pointerleave',()=>{card.style.setProperty('--card-x','0deg');card.style.setProperty('--card-y','0deg')})});
 const tabs=[...document.querySelectorAll('.profile-tab')];const panel=document.querySelector('#profile-panel');
 tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>{tabs.forEach(t=>t.tabIndex=t===tab?0:-1);panel.setAttribute('aria-labelledby',tab.id)});tab.addEventListener('keydown',e=>{let n;if(e.key==='ArrowRight')n=(i+1)%tabs.length;if(e.key==='ArrowLeft')n=(i+tabs.length-1)%tabs.length;if(e.key==='Home')n=0;if(e.key==='End')n=tabs.length-1;if(n!==undefined){e.preventDefault();tabs[n].focus();tabs[n].click()}})});
 document.querySelectorAll('img').forEach(img=>{if(!img.closest('.hero-clean,.site-header'))img.loading='lazy';img.decoding='async'});
})();
