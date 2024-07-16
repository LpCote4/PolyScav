import{C as m,j as s,x as f,A as y}from"./main.5faacb7e.js";document.addEventListener("DOMContentLoaded",function(h){document.getElementById("btn-file-input").addEventListener("click",function(i){document.getElementById("thumbsnail-get-path").click()}),document.getElementById("thumbsnail-get-path").addEventListener("change",function(i){const t=i.target.files[0];console.log("File selected:",t);let c=document.getElementById("thumbsnail-upload-form");alert(c);const g=new FormData(c);if(g.append("file",t),g.append("nonce",m.config.csrfNonce),fetch(m.config.urlRoot+"/api/v1/files?admin=true&is_challenge_thumbnail=true",{method:"POST",body:g}).then(n=>n.json()).then(n=>{if(n.success){const r=n.location;document.getElementById("thumbsnail-path").value=r,console.log("Thumbnail uploaded successfully:",r);const u=document.getElementById("image-preview");u.src=r,u.style.display="block"}else alert("Error uploading image: "+n.errors)}).catch(n=>{console.error("Error uploading file:",n)}),t){const n=new FileReader;n.onload=function(r){const u=document.getElementById("image-preview");u.src=r.target.result,u.style.display="block"},n.readAsDataURL(t)}});const l=Object.keys(document.categories),o=document.getElementById("categories-selector");l.forEach(i=>{const t=document.createElement("option");t.value=i,t.textContent=i,o.appendChild(t)});const a=document.createElement("option");a.value="other",a.textContent="Other (type below)",o.appendChild(a);const e=document.getElementById("categories-selector-input");o.value=="other"||l.length==0?(e.style.display="block",e.name="category"):(e.style.display="none",e.value="",e.name=""),o.addEventListener("change",function(){o.value=="other"||l.length==0?(e.style.display="block",e.name="category"):(e.style.display="none",e.value="",e.name="")});let d=0;document.querySelectorAll("td.id").forEach(function(i){const t=parseInt(i.textContent);!isNaN(t)&&t>d&&(d=t)});const p=d+1;document.getElementById("challenge_id_texte").textContent=p,document.getElementById("challenge_id").value=p,document.getElementById("create-challenge-form").addEventListener("submit",function(i){i.preventDefault();const t=new FormData(this);fetch(this.action,{method:"POST",body:t}).then(c=>c.json()).then(c=>{c.success?alert("Challenge added successfully!"):alert("Error adding challenge: "+c.errors)}).catch(c=>{console.error("Error:",c)})})});function v(h){let l=s("input[data-challenge-id]:checked").map(function(){return s(this).data("challenge-id")}),o=l.length===1?"challenge":"challenges";f({title:"Delete Challenges",body:`Are you sure you want to delete ${l.length} ${o}?`,success:function(){const a=[];for(var e of l)a.push(m.fetch(`/api/v1/challenges/${e}`,{method:"DELETE"}));Promise.all(a).then(d=>{window.location.reload()})}})}function b(h){let l=s("input[data-challenge-id]:checked").map(function(){return s(this).data("challenge-id")});y({title:"Edit Challenges",body:s(`
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
    `),button:"Submit",success:function(){let o=s("#challenges-bulk-edit").serializeJSON(!0);const a=[];for(var e of l)a.push(m.fetch(`/api/v1/challenges/${e}`,{method:"PATCH",body:JSON.stringify(o)}));Promise.all(a).then(d=>{window.location.reload()})}})}s(()=>{s("#challenges-delete-button").click(v),s("#challenges-edit-button").click(b)});
