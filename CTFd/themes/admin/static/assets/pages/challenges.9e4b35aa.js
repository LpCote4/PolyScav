import{C as u,$ as a,u as y,z as v}from"./main.f36c46f4.js";document.addEventListener("DOMContentLoaded",function(g){document.getElementById("btn-file-input").addEventListener("click",function(i){document.getElementById("thumbsnail-get-path").click()}),document.getElementById("thumbsnail-get-path").addEventListener("change",function(i){const t=i.target.files[0];console.log("File selected:",t);let f=document.getElementById("thumbsnail-upload-form");const r=new FormData(f);if(r.append("file",t),r.append("nonce",u.config.csrfNonce),fetch(u.config.urlRoot+"/api/v1/files?admin=true&is_challenge_thumbnail=true",{method:"POST",body:r}).then(c=>c.json()).then(c=>{const m=c.data[0],d=u.config.urlRoot+"/files/"+m.location;document.getElementById("thumbsnail-path").value=d,console.log("Thumbnail uploaded successfully:",d);const p=document.getElementById("image-preview");p.src=d,p.style.display="block"}).catch(c=>{console.error("Error uploading file:",c)}),t){const c=new FileReader;c.onload=function(m){const d=document.getElementById("image-preview");d.src=m.target.result,d.style.display="block"},c.readAsDataURL(t)}});const n=Object.keys(document.categories),l=document.getElementById("categories-selector");n.forEach(i=>{const t=document.createElement("option");t.value=i,t.textContent=i,l.appendChild(t)});const o=document.createElement("option");o.value="other",o.textContent="Other (type below)",l.appendChild(o);const e=document.getElementById("categories-selector-input");l.value=="other"||n.length==0?(e.style.display="block",e.name="category"):(e.style.display="none",e.value="",e.name=""),l.addEventListener("change",function(){l.value=="other"||n.length==0?(e.style.display="block",e.name="category"):(e.style.display="none",e.value="",e.name="")});let s=0;document.querySelectorAll("td.id").forEach(function(i){const t=parseInt(i.textContent);!isNaN(t)&&t>s&&(s=t)});const h=s+1;document.getElementById("challenge_id_texte").textContent=h,document.getElementById("challenge_id").value=h,document.getElementById("submit-button").addEventListener("click",function(i){document.getElementById("challenge-create-options-quick").submit()})});function b(g){let n=a("input[data-challenge-id]:checked").map(function(){return a(this).data("challenge-id")}),l=n.length===1?"challenge":"challenges";y({title:"Delete Challenges",body:`Are you sure you want to delete ${n.length} ${l}?`,success:function(){const o=[];for(var e of n)o.push(u.fetch(`/api/v1/challenges/${e}`,{method:"DELETE"}));Promise.all(o).then(s=>{window.location.reload()})}})}function E(g){let n=a("input[data-challenge-id]:checked").map(function(){return a(this).data("challenge-id")});v({title:"Edit Challenges",body:a(`
    <form id="challenges-bulk-edit">
      <div class="form-group">
        <label>Category</label>
        <input type="text" name="category" data-initial="" value="">
      </div>
      <div class="form-group">
        <label>Value</label>
        <input type="number" name="value" data-initial="" value="">
      </div>
      <div class="form-group">
        <label>State</label>
        <select name="state" data-initial="">
          <option value="">--</option>
          <option value="visible">Visible</option>
          <option value="hidden">Hidden</option>
        </select>
      </div>
    </form>
    `),button:"Submit",success:function(){let l=a("#challenges-bulk-edit").serializeJSON(!0);const o=[];for(var e of n)o.push(u.fetch(`/api/v1/challenges/${e}`,{method:"PATCH",body:JSON.stringify(l)}));Promise.all(o).then(s=>{window.location.reload()})}})}a(()=>{a("#challenges-delete-button").click(b),a("#challenges-edit-button").click(E)});
