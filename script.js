/* ─── TYPED.JS ─── */
new Typed('.typing-text', {
  strings: ['PHP &amp; Laravel', 'Clean Architecture', 'React.js', 'Open Source'],
  typeSpeed: 55, backSpeed: 30, loop: true,
});

/* ─── CUSTOM CURSOR ─── */
const dot  = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mx=0,my=0, rx=0,ry=0;
document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; dot.style.left=mx+'px'; dot.style.top=my+'px'; });
(function animRing(){
  rx += (mx-rx)*.12; ry += (my-ry)*.12;
  ring.style.left=rx+'px'; ring.style.top=ry+'px';
  requestAnimationFrame(animRing);
})();
document.querySelectorAll('a,button,[role=button],.proj-card,.skill-pill,.cert-card,.fact-item').forEach(el=>{
  el.addEventListener('mouseenter',()=>document.body.classList.add('hovering'));
  el.addEventListener('mouseleave',()=>document.body.classList.remove('hovering'));
});

/* ─── HEADER shrink + active nav ─── */
const header   = document.getElementById('header');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
window.addEventListener('scroll', ()=>{
  const y = window.scrollY;
  header.classList.toggle('compact', y > 60);
  document.getElementById('scroll-top').classList.toggle('show', y > 300);
  sections.forEach(sec=>{
    if(y >= sec.offsetTop-120 && y < sec.offsetTop+sec.offsetHeight){
      navLinks.forEach(a=>a.classList.remove('active'));
      const m = document.querySelector(`.nav-link[href="#${sec.id}"]`);
      if(m) m.classList.add('active');
    }
  });
});

/* ─── HAMBURGER ─── */
const menuBtn = document.getElementById('menu');
const navbar  = document.getElementById('navbar');
menuBtn.addEventListener('click',()=>{ menuBtn.classList.toggle('open'); navbar.classList.toggle('open'); });
navbar.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{ menuBtn.classList.remove('open'); navbar.classList.remove('open'); }));

/* ─── SCROLL REVEAL ─── */
const srObs = new IntersectionObserver(entries=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('vis'); srObs.unobserve(e.target); }});
},{ threshold:.1 });
document.querySelectorAll('.sr').forEach(el=>srObs.observe(el));

/* ─── COUNTER ANIMATION ─── */
function animCount(el,target,dur){
  let start=null;
  const step=ts=>{
    if(!start)start=ts;
    const p=Math.min((ts-start)/dur,1);
    el.textContent=Math.round(p*target);
    if(p<1)requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
const statsObs = new IntersectionObserver(entries=>{
  if(entries[0].isIntersecting){
    animCount(document.getElementById('s1'),5,1000);
    animCount(document.getElementById('s2'),49,1200);
    animCount(document.getElementById('s3'),9,1100);
    animCount(document.getElementById('s4'),100,1400);
    statsObs.disconnect();
  }
},{ threshold:.3 });
statsObs.observe(document.getElementById('stats'));

/* ─── SKILL BARS ─── */
const barObs = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.querySelectorAll('.prof-fill').forEach(b=>{ b.style.width=b.dataset.w||'0%'; });
      barObs.unobserve(e.target);
    }
  });
},{ threshold:.2 });
document.querySelectorAll('.prof-bars').forEach(el=>barObs.observe(el));

/* ─── SMOOTH SCROLL ─── */
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const t=document.querySelector(a.getAttribute('href'));
    if(t){ e.preventDefault(); t.scrollIntoView({behavior:'smooth'}); }
  });
});

/* ─── YEAR ─── */

/* ─── EMAILJS ─── */
document.getElementById('contact-form').addEventListener('submit',function(e){
  e.preventDefault();
  emailjs.init("user_TTDmetQLYgWCLzHTDgqxm");
  emailjs.sendForm('contact_service','template_contact','#contact-form')
    .then(()=>{ this.reset(); alert('Message sent successfully! 🎉'); })
    .catch(()=>alert('Failed to send. Please try again.'));
});
