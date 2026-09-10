const WHATSAPP_NUMBER = '5511920193443';

const menuButton = document.querySelector('.menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');
function setMenu(open){
  if(!menuButton || !mobileMenu) return;
  menuButton.setAttribute('aria-expanded', String(open));
  mobileMenu.hidden = !open;
  document.body.classList.toggle('menu-open', open);
}
menuButton?.addEventListener('click',()=>setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
document.querySelectorAll('.mobile-menu a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
document.addEventListener('keydown',e=>{if(e.key==='Escape')setMenu(false)});

function whatsappUrl(message){return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`}
function wireWhatsApp(root=document){
  root.querySelectorAll('[data-wa]').forEach(link=>{
    link.href=whatsappUrl(link.dataset.wa || 'Olá BGTech Store!');
    link.target='_blank';link.rel='noopener noreferrer';
  });
}
wireWhatsApp();

// Fallback local para imagens externas dos fabricantes.
document.querySelectorAll('img[data-fallback-src]').forEach(img=>{
  img.addEventListener('error',()=>{
    if(img.dataset.fallbackUsed) return;
    img.dataset.fallbackUsed='1';
    img.src=img.dataset.fallbackSrc;
  });
});

const year=document.getElementById('year');if(year)year.textContent=new Date().getFullYear();

const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealElements=document.querySelectorAll('.reveal');
if(reduceMotion || !('IntersectionObserver' in window)) revealElements.forEach(el=>el.classList.add('visible'));
else{
  const io=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add('visible');io.unobserve(entry.target)}
  }),{threshold:.12,rootMargin:'0px 0px -35px'});
  revealElements.forEach(el=>io.observe(el));
}

// Movimento suave do produto principal.
const hero=document.querySelector('.hero-clean');
const heroImage=document.querySelector('.hero-product-img');
function renderHero(){
  if(!hero || !heroImage || reduceMotion) return;
  const rect=hero.getBoundingClientRect();
  const p=Math.min(1,Math.max(0,-rect.top/Math.max(1,hero.offsetHeight)));
  heroImage.style.setProperty('--hero-scale',String(1+p*.08));
  heroImage.style.setProperty('--hero-y',`${p*28}px`);
}
window.addEventListener('scroll',renderHero,{passive:true});renderHero();

// Narrativa cinematográfica controlada pelo scroll.
const story=document.querySelector('.story');
if(story && !reduceMotion){
  const copies=[...story.querySelectorAll('.story-copy')];
  const mac=story.querySelector('.device-mac');
  const phone=story.querySelector('.device-phone');
  const tablet=story.querySelector('.device-tablet');
  const progress=story.querySelector('.story-progress span');
  const stage=story.querySelector('.story-device-stage');
  if(!mac || !phone || !tablet || !progress || !stage) { /* keep section static if assets are changed */ } else {
  const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
  const smooth=(a,b,v)=>{const t=clamp((v-a)/(b-a));return t*t*(3-2*t)};
  const phase=(i,p)=>{
    const starts=[[0,.03,.24,.35],[.27,.38,.55,.67],[.6,.72,.98,1]] [i];
    return clamp(smooth(starts[0],starts[1],p)*(1-smooth(starts[2],starts[3],p)));
  };
  let ticking=false;
  function render(){
    ticking=false;
    const rect=story.getBoundingClientRect();
    const scrollable=Math.max(1,story.offsetHeight-window.innerHeight);
    const p=clamp(-rect.top/scrollable);
    copies.forEach((c,i)=>{
      c.style.opacity=phase(i,p).toFixed(3);
      const shift=(i===0?-28:i===1?-12:0)*p + (i?22*(1-p):0);
      c.style.transform=window.innerWidth<=720?`translateY(${shift*.45}px)`:`translateY(calc(-50% + ${shift}px))`;
    });
    progress.style.transform=`scaleY(${p})`;
    const mobile=window.innerWidth<=720;
    const t=smooth(.04,.82,p);
    mac.style.transform=`translate3d(${mobile?-55+55*t:-180+145*t}px,${mobile?35-25*t:105-82*t}px,${-120+220*t}px) rotateY(${-32+30*t}deg) rotateX(${8-8*t}deg) rotateZ(${-5+5*t}deg) scale(${.8+.2*t})`;
    phone.style.transform=`translate3d(${mobile?70-35*t:155-105*t}px,${mobile?-5+10*t:25+35*t}px,${30+130*t}px) rotateY(${28-30*t}deg) rotateZ(${7-8*t}deg) scale(${.84+.14*t})`;
    tablet.style.transform=`translate3d(${mobile?-90+20*t:-240+65*t}px,${mobile?75-28*t:120-45*t}px,${-220+95*t}px) rotateY(${42-18*t}deg) rotateZ(${-9+5*t}deg) scale(${.78+.14*t})`;
    const finale=smooth(.7,.96,p);
    stage.style.transform=mobile?`translate(-50%,calc(-50% + ${-18*finale}px)) scale(${1-.05*finale})`:`translateY(calc(-50% + ${28*finale}px)) scale(${1-.035*finale})`;
  }
  function request(){if(!ticking){ticking=true;requestAnimationFrame(render)}}
  window.addEventListener('scroll',request,{passive:true});window.addEventListener('resize',request);render();
  }
}

// Perfis de uso.
const profileData={
  estudo:{number:'01',title:'Para estudar com mais organização.',text:'Tablets e notebooks ajudam em pesquisas, aulas, documentos, apresentações e multitarefa sem complicar a rotina.',message:'Olá! Quero uma recomendação para estudo.',image:'assets/tablet-clean-v41.png',fallback:'assets/tablet-clean-v41.png'},
  trabalho:{number:'02',title:'Para trabalhar com mais fluidez.',text:'MacBook Pro e notebooks entregam mais espaço, conforto e produtividade para documentos, reuniões, planilhas e multitarefa.',message:'Olá! Quero uma recomendação para trabalho.',image:'assets/macbook-fallback.png',fallback:'assets/macbook-fallback.png'},
  mobilidade:{number:'03',title:'Para levar tudo com você.',text:'Smartphones e tablets equilibram conectividade, autonomia e leveza para quem resolve muita coisa fora da mesa.',message:'Olá! Quero uma recomendação focada em mobilidade.',image:'assets/smartphone-fallback.png',fallback:'assets/smartphone-fallback.png'},
  performance:{number:'04',title:'Para quem exige mais desempenho.',text:'A configuração ideal depende dos seus aplicativos, volume de multitarefa e tipo de trabalho. A BGTech ajuda a dimensionar sem exagero.',message:'Olá! Quero uma recomendação focada em performance.',image:'assets/notebook-premium-v41.png',fallback:'assets/notebook-premium-v41.png'}
};
const tabs=document.querySelectorAll('.profile-tab');
const profileTitle=document.getElementById('profile-title');
const profileText=document.getElementById('profile-text');
const profileLink=document.getElementById('profile-link');
const profileImage=document.getElementById('profile-image');
const profileNumber=document.querySelector('.profile-number');
tabs.forEach(tab=>tab.addEventListener('click',()=>{
  const d=profileData[tab.dataset.profile];if(!d)return;
  tabs.forEach(t=>{t.classList.toggle('active',t===tab);t.setAttribute('aria-selected',String(t===tab))});
  profileNumber.textContent=d.number;profileTitle.textContent=d.title;profileText.textContent=d.text;
  profileLink.dataset.wa=d.message;profileLink.href=whatsappUrl(d.message);profileLink.target='_blank';profileLink.rel='noopener noreferrer';
  profileImage.dataset.fallbackSrc=d.fallback;profileImage.dataset.fallbackUsed='';profileImage.src=d.image;
}));
