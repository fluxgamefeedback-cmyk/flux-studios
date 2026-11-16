/* Shared site shell — one theme, menu and Google Forms contact across every page. */
(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const names={'flux-neon':'Flux Neon','elemental-spectrum':'Elemental Spectrum','midnight-violet':'Midnight Violet'};
let saved='flux-neon';try{saved=localStorage.getItem('flux-studios-theme')||saved;}catch(_){ }
function chooseTheme(theme){if(!names[theme])theme='flux-neon';document.documentElement.dataset.theme=theme;$$('[data-ofs-theme]').forEach(b=>{const active=b.dataset.ofsTheme===theme;b.setAttribute('aria-pressed',String(active));b.title=names[b.dataset.ofsTheme]||'';});try{localStorage.setItem('flux-studios-theme',theme);}catch(_){}}
chooseTheme(saved);$$('[data-ofs-theme]').forEach(b=>b.addEventListener('click',()=>chooseTheme(b.dataset.ofsTheme)));
const toggle=$('#ofsMobileToggle'),mobile=$('#ofsMobileMenu');if(toggle&&mobile){toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));mobile.hidden=!open;toggle.setAttribute('aria-label',open?'Close navigation':'Open navigation');toggle.textContent=open?'×':'☰';});$$('a,button',mobile).forEach(a=>a.addEventListener('click',()=>{mobile.hidden=true;toggle.setAttribute('aria-expanded','false');toggle.textContent='☰';}));}
const modal=$('#ofsSupportModal'),frame=$('#ofsGoogleFormFrame'),dialog=$('#ofsDialog'),tab=$('#ofsFormExternal');let lastFocus=null,validForm='';
const raw=window.OUR_FLUX_CONFIG?.googleFormEmbedUrl||'';
try{const u=new URL(raw);if(u.protocol==='https:'&&u.hostname==='docs.google.com'&&u.pathname.startsWith('/forms/')&&u.pathname.endsWith('/viewform')){u.searchParams.set('embedded','true');validForm=u.href;u.searchParams.delete('embedded');tab.href=u.href;}}catch(_){ }
function showSupport(e){if(e)e.preventDefault();if(!modal)return;if(!validForm){if(tab?.href)window.open(tab.href,'_blank','noopener,noreferrer');return;}lastFocus=document.activeElement;if(!frame.getAttribute('src'))frame.src=validForm;modal.hidden=false;document.body.classList.add('ofs-modal-open');dialog.focus();}
function hideSupport(){if(!modal)return;modal.hidden=true;document.body.classList.remove('ofs-modal-open');if(lastFocus&&lastFocus.focus)lastFocus.focus();}
$$('.ofs-contact-open,.open-support-form').forEach(b=>b.addEventListener('click',showSupport));$$('[data-ofs-close]').forEach(b=>b.addEventListener('click',hideSupport));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!mobile?.hidden){mobile.hidden=true;toggle?.setAttribute('aria-expanded','false');if(toggle)toggle.textContent='☰';}if(!modal||modal.hidden)return;if(e.key==='Escape'){e.preventDefault();hideSupport();return;}if(e.key==='Tab'){const items=$$('button,a,iframe',dialog).filter(x=>!x.disabled&&x.offsetParent!==null);if(!items.length)return;const a=items[0],b=items[items.length-1];if(e.shiftKey&&document.activeElement===a){e.preventDefault();b.focus();}else if(!e.shiftKey&&document.activeElement===b){e.preventDefault();a.focus();}}});
// Move from any page to the one studio contact section, or open its shared popup.
window.OUR_FLUX_SITE={chooseTheme,showSupport,hideSupport};
})();