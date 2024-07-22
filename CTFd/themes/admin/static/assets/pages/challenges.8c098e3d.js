import{u as b,C as g,j as l,D as y,x as E}from"./main.e953fe2f.js";document.addEventListener("DOMContentLoaded",function(h){document.getElementById("btn-file-input").addEventListener("click",function(n){document.getElementById("thumbsnail-get-path").click()}),document.getElementById("thumbsnail-get-path").addEventListener("change",function(n){const e=n.target.files[0];let c=document.getElementById("thumbsnail-upload-form");const s=new FormData(c);if(s.append("file",e),b.files.upload(s,c,function(d){const m=d.data[0],r=g.config.urlRoot+"/files/"+m.location;document.getElementById("thumbsnail-path").value=r,console.log("Thumbnail uploaded successfully:",r);const f=document.getElementById("image-preview");f.src=r,f.style.display="block"}),e){const d=new FileReader;d.onload=function(m){const r=document.getElementById("image-preview");r.src=m.target.result,r.style.display="block"},d.readAsDataURL(e)}});const o=Object.keys(document.categories),a=document.getElementById("categories-selector");o.forEach(n=>{const e=document.createElement("option");e.value=n,e.textContent=n,a.appendChild(e)});const i=document.createElement("option");i.value="other",i.textContent="Other (type below)",a.appendChild(i);const t=document.getElementById("categories-selector-input");a.value=="other"||o.length==0?(t.style.display="block",t.name="category"):(t.style.display="none",t.value="",t.name=""),a.addEventListener("change",function(){a.value=="other"||o.length==0?(t.style.display="block",t.name="category"):(t.style.display="none",t.value="",t.name="")});let u=0;document.querySelectorAll("td.id").forEach(function(n){const e=parseInt(n.textContent);!isNaN(e)&&e>u&&(u=e)});const p=u+1;document.getElementById("challenge_id_texte").textContent=p,document.getElementById("challenge_id").value=p;function v(n){console.log("hello");const e=l("#challenge-create-options-quick").serializeJSON();delete e.challenge_id,delete e.flag_type,e.description="",e.category==""&&(e.category=document.getElementById("categories-selector-input").placeholder),g.fetch("/api/v1/challenges",{method:"POST",credentials:"same-origin",headers:{Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(e)}).then(function(c){return console.log("hello2"),c.json()}).then(function(c){if(c.success)setTimeout(function(){window.location.reload(!0)},500);else{let s="";for(const d in c.errors)s+=c.errors[d].join(`
`),s+=`
`;y({title:"Error",body:s,button:"OK"})}})}document.getElementById("submit-button").addEventListener("click",function(n){n.preventDefault(),v()})});function I(h){let o=l("input[data-challenge-id]:checked").map(function(){return l(this).data("challenge-id")}),a=o.length===1?"challenge":"challenges";E({title:"Delete Challenges",body:`Are you sure you want to delete ${o.length} ${a}?`,success:function(){const i=[];for(var t of o)i.push(g.fetch(`/api/v1/challenges/${t}`,{method:"DELETE"}));Promise.all(i).then(u=>{window.location.reload()})}})}function k(h){let o=l("input[data-challenge-id]:checked").map(function(){return l(this).data("challenge-id")});y({title:"Edit Challenges",body:l(`
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
    `),button:"Submit",success:function(){let a=l("#challenges-bulk-edit").serializeJSON(!0);const i=[];for(var t of o)i.push(g.fetch(`/api/v1/challenges/${t}`,{method:"PATCH",body:JSON.stringify(a)}));Promise.all(i).then(u=>{window.location.reload()})}})}l(()=>{l("#challenges-delete-button").click(I),l("#challenges-edit-button").click(k)});
