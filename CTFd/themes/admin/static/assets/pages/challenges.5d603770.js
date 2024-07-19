import{s as y,C as r,$ as a,u as v,y as b}from"./main.da10ea18.js";document.addEventListener("DOMContentLoaded",function(m){document.getElementById("btn-file-input").addEventListener("click",function(i){document.getElementById("thumbsnail-get-path").click()}),document.getElementById("thumbsnail-get-path").addEventListener("change",function(i){const t=i.target.files[0];let h=document.getElementById("thumbsnail-upload-form");const p=new FormData(h);if(p.append("file",t),y.files.upload(p,h,function(d){const u=d.data[0],c=r.config.urlRoot+"/files/"+u.location;document.getElementById("thumbsnail-path").value=c,console.log("Thumbnail uploaded successfully:",c);const f=document.getElementById("image-preview");f.src=c,f.style.display="block"}),t){const d=new FileReader;d.onload=function(u){const c=document.getElementById("image-preview");c.src=u.target.result,c.style.display="block"},d.readAsDataURL(t)}});const n=Object.keys(document.categories),l=document.getElementById("categories-selector");n.forEach(i=>{const t=document.createElement("option");t.value=i,t.textContent=i,l.appendChild(t)});const o=document.createElement("option");o.value="other",o.textContent="Other (type below)",l.appendChild(o);const e=document.getElementById("categories-selector-input");l.value=="other"||n.length==0?(e.style.display="block",e.name="category"):(e.style.display="none",e.value="",e.name=""),l.addEventListener("change",function(){l.value=="other"||n.length==0?(e.style.display="block",e.name="category"):(e.style.display="none",e.value="",e.name="")});let s=0;document.querySelectorAll("td.id").forEach(function(i){const t=parseInt(i.textContent);!isNaN(t)&&t>s&&(s=t)});const g=s+1;document.getElementById("challenge_id_texte").textContent=g,document.getElementById("challenge_id").value=g,document.getElementById("submit-button").addEventListener("click",function(i){document.getElementById("challenge-create-options-quick").submit()})});function E(m){let n=a("input[data-challenge-id]:checked").map(function(){return a(this).data("challenge-id")}),l=n.length===1?"challenge":"challenges";v({title:"Delete Challenges",body:`Are you sure you want to delete ${n.length} ${l}?`,success:function(){const o=[];for(var e of n)o.push(r.fetch(`/api/v1/challenges/${e}`,{method:"DELETE"}));Promise.all(o).then(s=>{window.location.reload()})}})}function I(m){let n=a("input[data-challenge-id]:checked").map(function(){return a(this).data("challenge-id")});b({title:"Edit Challenges",body:a(`
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
    `),button:"Submit",success:function(){let l=a("#challenges-bulk-edit").serializeJSON(!0);const o=[];for(var e of n)o.push(r.fetch(`/api/v1/challenges/${e}`,{method:"PATCH",body:JSON.stringify(l)}));Promise.all(o).then(s=>{window.location.reload()})}})}a(()=>{a("#challenges-delete-button").click(E),a("#challenges-edit-button").click(I)});
