document.addEventListener("DOMContentLoaded", () => {
"use strict";
const menuToggle=document.getElementById("menuToggle"),navLinks=document.getElementById("navLinks"),navItems=document.querySelectorAll(".nav-link");
function closeMenu(){if(!menuToggle||!navLinks)return;navLinks.classList.remove("open");menuToggle.setAttribute("aria-expanded","false");menuToggle.setAttribute("aria-label","Open navigation menu");const i=menuToggle.querySelector("i");if(i){i.classList.remove("fa-xmark");i.classList.add("fa-bars")}document.body.classList.remove("menu-open")}
if(menuToggle&&navLinks){menuToggle.addEventListener("click",()=>{const open=navLinks.classList.toggle("open");menuToggle.setAttribute("aria-expanded",String(open));menuToggle.setAttribute("aria-label",open?"Close navigation menu":"Open navigation menu");const i=menuToggle.querySelector("i");if(i){i.classList.toggle("fa-bars",!open);i.classList.toggle("fa-xmark",open)}document.body.classList.toggle("menu-open",open)});navItems.forEach(a=>a.addEventListener("click",closeMenu));document.addEventListener("keydown",e=>{if(e.key==="Escape")closeMenu()});document.addEventListener("click",e=>{if(navLinks.classList.contains("open")&&!navLinks.contains(e.target)&&!menuToggle.contains(e.target))closeMenu()});window.addEventListener("resize",()=>{if(innerWidth>850)closeMenu()})}
const typing=document.getElementById("typingText"),reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
if(typing){const phrases=["Software Developer","Backend Developer","Web Developer","Problem Solver"];if(reduced)typing.textContent=phrases[0];else{let p=0,c=phrases[0].length,del=true;function type(){const s=phrases[p];c+=del?-1:1;typing.textContent=s.substring(0,c);let d=del?45:85;if(!del&&c===s.length){del=true;d=1500}else if(del&&c===0){del=false;p=(p+1)%phrases.length;d=350}setTimeout(type,d)}setTimeout(type,1500)}}
const progress=document.getElementById("scrollProgress");function updateProgress(){if(!progress)return;const h=document.documentElement.scrollHeight-innerHeight;progress.style.width=h<=0?"0%":`${Math.min(100,Math.max(0,scrollY/h*100))}%`}addEventListener("scroll",updateProgress,{passive:true});updateProgress();
const reveals=document.querySelectorAll(".reveal");if("IntersectionObserver"in window&&!reduced){const ob=new IntersectionObserver((entries,observer)=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");observer.unobserve(e.target)}}),{threshold:.12,rootMargin:"0px 0px -35px 0px"});reveals.forEach(el=>ob.observe(el))}else reveals.forEach(el=>el.classList.add("visible"));
if("IntersectionObserver"in window){const so=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)navItems.forEach(a=>a.classList.toggle("active",a.getAttribute("href")===`#${e.target.id}`))}),{rootMargin:"-25% 0px -60% 0px"});document.querySelectorAll("main section[id]").forEach(s=>so.observe(s))}
const year=document.getElementById("currentYear");if(year)year.textContent=new Date().getFullYear();const topBtn=document.getElementById("ctBackTop");if(topBtn)topBtn.addEventListener("click",()=>scrollTo({top:0,behavior:reduced?"auto":"smooth"}));
document.querySelectorAll('a[target="_blank"]').forEach(a=>a.setAttribute("rel","noopener noreferrer"));document.querySelectorAll('a[href="#"]').forEach(a=>a.addEventListener("click",e=>e.preventDefault()));
const form=document.getElementById("contactForm");if(form)form.addEventListener("submit",async e=>{e.preventDefault();const btn=document.getElementById("contactSubmit"),feedback=document.getElementById("formFeedback"),original=btn.innerHTML;btn.disabled=true;btn.textContent="Sending...";feedback.textContent="";feedback.classList.remove("error");try{const res=await fetch(form.action,{method:"POST",body:new FormData(form),headers:{"X-Requested-With":"XMLHttpRequest","Accept":"application/json"}});const data=await res.json();if(!res.ok)throw new Error(data.error||"Could not send your message.");feedback.textContent=data.message||"Message sent successfully.";form.reset()}catch(err){feedback.textContent=err.message||"Something went wrong. Try again.";feedback.classList.add("error")}finally{btn.disabled=false;btn.innerHTML=original}});
const themeToggle=document.getElementById("themeToggle");
const savedTheme=localStorage.getItem("codeTitanTheme");
const prefersLight=window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
function applyTheme(theme){
    const selected=theme==="light"?"light":"dark";
    document.body.dataset.theme=selected;
    if(themeToggle){
        const light=selected==="light";
        themeToggle.innerHTML=light
            ? '<i class="fa-solid fa-moon" aria-hidden="true"></i><span class="theme-toggle-label">Dark mode</span>'
            : '<i class="fa-solid fa-sun" aria-hidden="true"></i><span class="theme-toggle-label">Light mode</span>';
        themeToggle.setAttribute("aria-label",light?"Switch to dark mode":"Switch to light mode");
        themeToggle.setAttribute("aria-pressed",String(light));
    }
    const metaTheme=document.querySelector('meta[name="theme-color"]');
    if(metaTheme)metaTheme.setAttribute("content",selected==="light"?"#f5f7fb":"#0b1120");
    localStorage.setItem("codeTitanTheme",selected);
}
applyTheme(savedTheme || (prefersLight?"light":"dark"));
if(themeToggle)themeToggle.addEventListener("click",()=>applyTheme(document.body.dataset.theme==="light"?"dark":"light"));
});
