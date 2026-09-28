document.addEventListener("DOMContentLoaded",()=>{
 const sidebar=document.getElementById("sidebar");
 const overlay=document.getElementById("sidebarOverlay");
 const toggle=document.getElementById("sidebarToggle");
 const close=document.getElementById("sidebarClose");
 const setOpen=(open)=>{sidebar.classList.toggle("open",open);overlay.classList.toggle("open",open);toggle?.setAttribute("aria-expanded",String(open));document.body.classList.toggle("menu-open",open);};
 toggle?.addEventListener("click",()=>setOpen(!sidebar.classList.contains("open")));
 close?.addEventListener("click",()=>setOpen(false));
 overlay?.addEventListener("click",()=>setOpen(false));
 document.addEventListener("keydown",e=>{if(e.key==="Escape")setOpen(false)});
 window.addEventListener("resize",()=>{if(window.innerWidth>1023)setOpen(false)});
});