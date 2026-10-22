(function(){var h=document.documentElement,b=document.querySelectorAll('[data-set]');
function set(l){h.dataset.lang=l;h.lang=l==='zh'?'zh-Hans':l;b.forEach(function(x){x.setAttribute('aria-pressed',x.dataset.set===l)});}
b.forEach(function(x){x.addEventListener('click',function(){set(x.dataset.set);try{localStorage.setItem('jia-lang',x.dataset.set)}catch(e){}})});
var s=null;try{s=localStorage.getItem('jia-lang')}catch(e){}
if(s!=='ko'&&s!=='zh'&&s!=='en')s='en';set(s);
var mq=window.matchMedia('(min-width:820px)');function acc(){document.querySelectorAll('details.mcard').forEach(function(d,i){if(mq.matches)d.open=true;else d.open=(i===0)})}acc();mq.addEventListener('change',acc);})();
