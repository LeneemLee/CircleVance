(()=>{
  'use strict';
  const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
  const menu=$('.menu-toggle'),nav=$('#navigation');
  menu?.addEventListener('click',()=>{const expanded=menu.getAttribute('aria-expanded')==='true';menu.setAttribute('aria-expanded',String(!expanded));nav.classList.toggle('open',!expanded);});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav?.classList.contains('open')){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.focus();}});
  const params=new URLSearchParams(location.search);
  // Preserve incoming links from the previous single-page website.
  if(location.pathname==='/'||location.pathname.endsWith('/index.html')){
    const routes={materials:'materials.html',applications:'industries.html',producers:'producers.html',knowledge:'resources.html',about:'about.html',inquiry:'contact.html'};
    if(routes[location.hash.slice(1)]){location.replace(routes[location.hash.slice(1)]);return;}
  }
  const cards=$$('.material-card[data-family]'),search=$('#material-search'),filters=['family','producer','process','industry'];
  if(search){
    filters.forEach(key=>{const el=$('#filter-'+key),value=params.get(key);if(value&&[...el.options].some(o=>o.value===value))el.value=value;});
    search.value=params.get('q')||'';
    let pageNumber=1;const pageSize=12;
    const pagination=document.createElement('div');pagination.className='pagination';pagination.innerHTML='<button class="button secondary" id="previous-page">Previous</button><span id="page-number" aria-live="polite"></span><button class="button secondary" id="next-page">Next</button>';$('.material-grid').after(pagination);
    function filter(updateURL=true,resetPage=true){
      if(resetPage)pageNumber=1;
      const q=search.value.trim().toLowerCase();
      const matches=cards.filter(card=>(!q||card.dataset.search.toLowerCase().includes(q))&&filters.every(key=>{const v=$('#filter-'+key).value;return v==='all'||card.dataset[key].split(' ').includes(v);}));
      const count=matches.length,pages=Math.max(1,Math.ceil(count/pageSize));pageNumber=Math.min(pageNumber,pages);
      cards.forEach(card=>card.hidden=true);matches.slice((pageNumber-1)*pageSize,pageNumber*pageSize).forEach(card=>card.hidden=false);
      $('#result-count').textContent=count+' '+(count===1?'material':'materials');$('#empty-results').hidden=count!==0;
      pagination.hidden=pages===1;$('#page-number').textContent='Page '+pageNumber+' of '+pages;$('#previous-page').disabled=pageNumber===1;$('#next-page').disabled=pageNumber===pages;
      if(updateURL){const p=new URLSearchParams();filters.forEach(key=>{const v=$('#filter-'+key).value;if(v!=='all')p.set(key,v);});if(q)p.set('q',search.value.trim());history.replaceState(null,'',location.pathname+(p.size?'?'+p.toString():''));}
    }
    search.addEventListener('input',()=>filter());filters.forEach(key=>$('#filter-'+key).addEventListener('change',()=>filter()));
    $('#reset-filters').addEventListener('click',()=>{search.value='';filters.forEach(key=>$('#filter-'+key).value='all');filter();});
    $('#previous-page').addEventListener('click',()=>{pageNumber--;filter(false,false);$('.results-toolbar').scrollIntoView({block:'start'});});$('#next-page').addEventListener('click',()=>{pageNumber++;filter(false,false);$('.results-toolbar').scrollIntoView({block:'start'});});filter(false);
  }
  $$('[data-doc-filter]').forEach(button=>button.addEventListener('click',()=>{const value=button.dataset.docFilter;$$('[data-doc-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));$$('[data-doc-family]').forEach(g=>g.hidden=value!=='all'&&g.dataset.docFamily!==value);}));
  const form=$('#inquiry-form');
  if(form){
    const material=params.get('material');if(material&&[...form.elements.material.options].some(o=>o.value===material))form.elements.material.value=material;
    const application=params.get('application');if(application)form.elements.requirements.value='Application: '+application.replaceAll('-',' ')+'\n';
    form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;
      const data=new FormData(form),labels={name:'Name',company:'Company',email:'Email',material:'Material',grade:'Grade / brand',volume:'Monthly volume (metric tons)',destination:'Delivery destination',condition:'Material condition',producer:'Preferred producer',process:'Processing',documents:'Documents / samples',delivery:'Target delivery date',requirements:'Application & requirements'};
      const text='CycleVance — Product inquiry\n\n'+Object.entries(labels).map(([k,v])=>v+': '+(data.get(k)||'Not specified')).join('\n');
      $('#draft').value=text;$('#inquiry-result').hidden=false;$('#email-draft').href='mailto:info@CycleVance.com?subject='+encodeURIComponent('Material inquiry — '+(data.get('material')||'Selection assistance'))+'&body='+encodeURIComponent(text);$('#form-status').textContent='Draft prepared. Nothing has been sent.';$('#inquiry-result').scrollIntoView({block:'nearest',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
    });
    $('#copy-draft').addEventListener('click',async()=>{try{await navigator.clipboard.writeText($('#draft').value);$('#form-status').textContent='Inquiry copied. Paste it into your email to CycleVance.';}catch{$('#draft').focus();$('#draft').select();$('#form-status').textContent='Select and copy the draft above.';}});
    $('#download-draft').addEventListener('click',()=>{const url=URL.createObjectURL(new Blob([$('#draft').value],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='CycleVance-material-inquiry.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);$('#form-status').textContent='Inquiry downloaded. Email the file or its contents to CycleVance.';});
  }
})();
