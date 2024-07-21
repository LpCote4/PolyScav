import{u as b,C as g,j as o,B as y,x as E}from"./main.919637e1.js";document.addEventListener("DOMContentLoaded",function(h){document.getElementById("btn-file-input").addEventListener("click",function(l){document.getElementById("thumbsnail-get-path").click()}),document.getElementById("thumbsnail-get-path").addEventListener("change",function(l){const e=l.target.files[0];let n=document.getElementById("thumbsnail-upload-form");const s=new FormData(n);if(s.append("file",e),b.files.upload(s,n,function(d){const m=d.data[0],r=g.config.urlRoot+"/files/"+m.location;document.getElementById("thumbsnail-path").value=r,console.log("Thumbnail uploaded successfully:",r);const f=document.getElementById("image-preview");f.src=r,f.style.display="block"}),e){const d=new FileReader;d.onload=function(m){const r=document.getElementById("image-preview");r.src=m.target.result,r.style.display="block"},d.readAsDataURL(e)}});const a=Object.keys(document.categories),i=document.getElementById("categories-selector");a.forEach(l=>{const e=document.createElement("option");e.value=l,e.textContent=l,i.appendChild(e)});const c=document.createElement("option");c.value="other",c.textContent="Other (type below)",i.appendChild(c);const t=document.getElementById("categories-selector-input");i.value=="other"||a.length==0?(t.style.display="block",t.name="category"):(t.style.display="none",t.value="",t.name=""),i.addEventListener("change",function(){i.value=="other"||a.length==0?(t.style.display="block",t.name="category"):(t.style.display="none",t.value="",t.name="")});let u=0;document.querySelectorAll("td.id").forEach(function(l){const e=parseInt(l.textContent);!isNaN(e)&&e>u&&(u=e)});const p=u+1;document.getElementById("challenge_id_texte").textContent=p,document.getElementById("challenge_id").value=p;function v(l){const e=o("#challenge-create-options-quick").serializeJSON();delete e.challenge_id,delete e.flag_type,e.description="",e.category==""&&(e.category=document.getElementById("categories-selector-input").placeholder),g.fetch("/api/v1/challenges",{method:"POST",credentials:"same-origin",headers:{Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(e)}).then(function(n){return console.log("hello2"),n.json()}).then(function(n){if(n.success){if(console.log(n.data),n.data.type=="manualRecursive"){const s={value:"Recursif",challenge:n.data.id};g.api.post_tag_list({},s).then(d=>{})}setTimeout(function(){window.location.reload(!0)},500)}else{let s="";for(const d in n.errors)s+=n.errors[d].join(`
`),s+=`
`;y({title:"Error",body:s,button:"OK"})}})}document.getElementById("submit-button").addEventListener("click",function(l){l.preventDefault(),v()})});function I(h){let a=o("input[data-challenge-id]:checked").map(function(){return o(this).data("challenge-id")}),i=a.length===1?"challenge":"challenges";E({title:"Delete Challenges",body:`Are you sure you want to delete ${a.length} ${i}?`,success:function(){const c=[];for(var t of a)c.push(g.fetch(`/api/v1/challenges/${t}`,{method:"DELETE"}));Promise.all(c).then(u=>{window.location.reload()})}})}function k(h){let a=o("input[data-challenge-id]:checked").map(function(){return o(this).data("challenge-id")});y({title:"Edit Challenges",body:o(`
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
    `),button:"Submit",success:function(){let i=o("#challenges-bulk-edit").serializeJSON(!0);const c=[];for(var t of a)c.push(g.fetch(`/api/v1/challenges/${t}`,{method:"PATCH",body:JSON.stringify(i)}));Promise.all(c).then(u=>{window.location.reload()})}})}o(()=>{o("#challenges-delete-button").click(I),o("#challenges-edit-button").click(k)});
