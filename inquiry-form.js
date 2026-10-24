// Candidate form controller. Publish together with the matching contact markup.
(() => {
 const form=document.querySelector('#inquiry-form');if(!form)return;
 const button=form.querySelector('[type="submit"]'),status=document.querySelector('#form-status');
 let widget,token='',busy=false,hasError=false,reference='',previous='';
 const message=text=>status.textContent=text;
 async function initialize(){
  button.disabled=true;
  try{
   const r=await fetch('/api/inquiries/config',{signal:AbortSignal.timeout(15000)}),config=await r.json();
   if(!r.ok||!config.siteKey)throw Error();
   await new Promise((resolve,reject)=>{const script=document.createElement('script');script.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';script.onload=resolve;script.onerror=reject;document.head.append(script);});
   widget=window.turnstile.render('#inquiry-verification',{sitekey:config.siteKey,action:'inquiry',callback:value=>{token=value;button.disabled=busy;if(!busy&&!hasError)message('Ready to send your inquiry.');},'expired-callback':()=>{token='';button.disabled=true;if(!busy)message('Verification expired. Please verify again.');},'error-callback':()=>{token='';button.disabled=true;if(!busy)message('Verification could not load. Please reload this page.');}});
  }catch{message('Online submission is temporarily unavailable. Please call 919-355-8455 or try again later.');}
 }
 form.addEventListener('submit',async e=>{
  e.preventDefault();if(busy||!form.reportValidity()||!token)return;
  const data=Object.fromEntries(new FormData(form));delete data['cf-turnstile-response'];
  const fingerprint=JSON.stringify(data);if(fingerprint!==previous){reference=crypto.randomUUID();previous=fingerprint;}
  busy=true;hasError=false;button.disabled=true;button.textContent='Sending…';form.setAttribute('aria-busy','true');message('Sending your inquiry. Please keep this page open.');
  try{
   const response=await fetch('/api/inquiries',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({...data,id:reference,token}),signal:AbortSignal.timeout(30000)});
   const result=await response.json();
   if(!response.ok||result.ok!==true||result.reference!==reference)throw Error(result.error||'We could not confirm your submission. Please retry.');
   document.querySelector('#inquiry-result').hidden=false;document.querySelector('#inquiry-reference').textContent=reference;
   message('Your inquiry has been received. Our team will reply to your work email.');button.textContent='Inquiry received';
   form.querySelectorAll('input,select,textarea').forEach(el=>el.disabled=true);document.querySelector('#inquiry-result').focus();
  }catch(error){
   message(['TimeoutError','AbortError'].includes(error.name)?'The connection timed out. Retry here using the same reference to prevent duplicates.':error.message==='Failed to fetch'?'Connection lost. Please retry here; your reference prevents duplicates.':error.message);
   busy=false;hasError=true;token='';button.textContent='Send inquiry';window.turnstile.reset(widget);
  }finally{form.setAttribute('aria-busy','false');}
 });
 initialize();
})();
