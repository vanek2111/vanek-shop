(() => {
 const theme = document.getElementById('theme-toggle');
 function updateThemeLabel() { theme?.setAttribute('aria-label', document.documentElement.dataset.theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'); }
 theme?.addEventListener('click', () => {
   const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
   document.documentElement.dataset.theme = next;
   try { localStorage.setItem('theme', next); } catch {}
   updateThemeLabel();
 });
 updateThemeLabel();
 const button = document.getElementById('menu-toggle');
 const menu = document.getElementById('mobile-menu');
 function setMenu(open) {
   if (!button || !menu) return;
   button.classList.toggle('active',open);menu.classList.toggle('open',open);
   button.setAttribute('aria-expanded',String(open));
   button.setAttribute('aria-label',open ? 'Закрыть меню' : 'Открыть меню');
   if (open) menu.querySelector('a')?.focus();
 }
 button?.addEventListener('click',()=>setMenu(button.getAttribute('aria-expanded')!=='true'));
 menu?.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>setMenu(false)));
 document.addEventListener('keydown',event=>{
   if(event.key==='Escape'){
     if(menu?.classList.contains('open')){setMenu(false);button.focus();}
     const sidebar=document.getElementById('filters-sidebar');
     if(sidebar?.classList.contains('open')){document.getElementById('filters-close-btn')?.click();document.getElementById('filters-open-btn')?.focus();}
   }
   const drawer=document.getElementById('filters-sidebar');
   if(event.key==='Tab' && drawer?.classList.contains('open')){
     const controls=[...drawer.querySelectorAll('button:not([disabled]),input:not([disabled]),select,a[href]')];
     const first=controls[0],last=controls[controls.length-1];
     if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
     if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
   }
   if(event.key==='Tab' && menu?.classList.contains('open')){
     const links=[button,...menu.querySelectorAll('a')];
     const first=links[0],last=links[links.length-1];
     if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
     if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
   }
 });
 document.addEventListener('click',event=>{if(menu?.classList.contains('open')&&!menu.contains(event.target)&&!button.contains(event.target))setMenu(false);});
 matchMedia('(min-width: 961px)').addEventListener('change',event=>{if(event.matches)setMenu(false);});
})();
