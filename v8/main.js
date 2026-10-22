(function(){var h=document.documentElement,b=document.querySelectorAll('[data-set]');
function set(l){h.dataset.lang=l;h.lang=l==='zh'?'zh-Hans':l;b.forEach(function(x){x.setAttribute('aria-pressed',x.dataset.set===l)});try{localStorage.setItem('jia-lang',l)}catch(e){}}
b.forEach(function(x){x.addEventListener('click',function(){set(x.dataset.set)})});
var s=null;try{s=localStorage.getItem('jia-lang')}catch(e){}
if(!s){var n=(navigator.language||'').toLowerCase();s=n.indexOf('ko')===0?'ko':n.indexOf('zh')===0?'zh':'en'}set(s);})();
