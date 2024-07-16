import{C as u,$ as i,u as y,z as v}from"./main.f36c46f4.js";document.addEventListener("DOMContentLoaded",function(h){document.getElementById("btn-file-input").addEventListener("click",function(a){document.getElementById("thumbsnail-get-path").click()}),document.getElementById("thumbsnail-get-path").addEventListener("change",function(a){const t=a.target.files[0];console.log("File selected:",t);let c=document.getElementById("thumbsnail-upload-form");alert(c);const m=new FormData(c);if(m.append("file",t),m.append("nonce",u.config.csrfNonce),fetch(u.config.urlRoot+"/api/v1/files?admin=true&is_challenge_thumbnail=true",{method:"POST",body:m}).then(s=>s.json()).then(s=>{const g=s.data[0],d=u.config.urlRoot+"/files/"+g.location;document.getElementById("thumbsnail-path").value=d,console.log("Thumbnail uploaded successfully:",d);const f=document.getElementById("image-preview");f.src=d,f.style.display="block"}).catch(s=>{console.error("Error uploading file:",s)}),t){const s=new FileReader;s.onload=function(g){const d=document.getElementById("image-preview");d.src=g.target.result,d.style.display="block"},s.readAsDataURL(t)}});const n=Object.keys(document.categories),l=document.getElementById("categories-selector");n.forEach(a=>{const t=document.createElement("option");t.value=a,t.textContent=a,l.appendChild(t)});const o=document.createElement("option");o.value="other",o.textContent="Other (type below)",l.appendChild(o);const e=document.getElementById("categories-selector-input");l.value=="other"||n.length==0?(e.style.display="block",e.name="category"):(e.style.display="none",e.value="",e.name=""),l.addEventListener("change",function(){l.value=="other"||n.length==0?(e.style.display="block",e.name="category"):(e.style.display="none",e.value="",e.name="")});let r=0;document.querySelectorAll("td.id").forEach(function(a){const t=parseInt(a.textContent);!isNaN(t)&&t>r&&(r=t)});const p=r+1;document.getElementById("challenge_id_texte").textContent=p,document.getElementById("challenge_id").value=p,document.getElementById("create-challenge-form").addEventListener("submit",function(a){console.log("New challenge form!"),a.preventDefault();const t=new FormData(this);fetch(this.action,{method:"POST",body:t}).then(c=>c.json()).then(c=>{c.success?alert("Challenge added successfully!"):alert("Error adding challenge: "+c.errors)}).catch(c=>{console.error("Error:",c)})})});function b(h){let n=i("input[data-challenge-id]:checked").map(function(){return i(this).data("challenge-id")}),l=n.length===1?"challenge":"challenges";y({title:"Delete Challenges",body:`Are you sure you want to delete ${n.length} ${l}?`,success:function(){const o=[];for(var e of n)o.push(u.fetch(`/api/v1/challenges/${e}`,{method:"DELETE"}));Promise.all(o).then(r=>{window.location.reload()})}})}function E(h){let n=i("input[data-challenge-id]:checked").map(function(){return i(this).data("challenge-id")});v({title:"Edit Challenges",body:i(`
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
    `),button:"Submit",success:function(){let l=i("#challenges-bulk-edit").serializeJSON(!0);const o=[];for(var e of n)o.push(u.fetch(`/api/v1/challenges/${e}`,{method:"PATCH",body:JSON.stringify(l)}));Promise.all(o).then(r=>{window.location.reload()})}})}i(()=>{i("#challenges-delete-button").click(b),i("#challenges-edit-button").click(E)});
