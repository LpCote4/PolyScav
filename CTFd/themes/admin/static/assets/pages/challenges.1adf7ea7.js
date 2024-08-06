import{u as E,C as m,j as i,D as p,x as S}from"./main.a58435d9.js";document.addEventListener("DOMContentLoaded",function(h){document.getElementById("btn-file-input").addEventListener("click",function(t){document.getElementById("thumbsnail-get-path").click()}),document.getElementById("thumbsnail-get-path").addEventListener("change",function(t){const e=t.target.files[0];let a=document.getElementById("thumbsnail-upload-form");const l=new FormData(a);if(l.append("file",e),E.files.upload(l,a,function(r){const f=r.data[0],c=m.config.urlRoot+"/files/"+f.location;document.getElementById("thumbsnail-path").value=c,console.log("Thumbnail uploaded successfully:",c);const D=document.getElementById("image-preview");D.src=c,D.style.display="block"}),e){const r=new FileReader;r.onload=function(f){const c=document.getElementById("image-preview");c.src=f.target.result,c.style.display="block"},r.readAsDataURL(e)}});const o=Object.keys(document.categories),d=document.getElementById("categories-selector");o.forEach(t=>{const e=document.createElement("option");e.value=t,e.textContent=t,e.textContent!="D\xE9fi Flash"&&d.appendChild(e)});const s=document.createElement("option");s.value="other",s.textContent="Other (type below)",d.appendChild(s);const n=document.getElementById("categories-selector-input");d.value=="other"||o.length==0?(n.style.display="block",n.name="category"):(n.style.display="none",n.value="",n.name=""),d.addEventListener("change",function(){d.value=="other"||o.length==0?(n.style.display="block",n.name="category"):(n.style.display="none",n.value="",n.name="")});let u=0;document.querySelectorAll("td.id").forEach(function(t){const e=parseInt(t.textContent);!isNaN(e)&&e>u&&(u=e)});const g=u+1;document.getElementById("challenge_id_texte").textContent=g,document.getElementById("challenge_id").value=g;function v(){const t=i("#challenge-create-options-quick").serializeJSON();let e=document.getElementById("categories-selector"),a=document.getElementById("categories-selector-input"),l=document.getElementById("time-selector-input");e.hidden&&t.type!="flash"?(l.hidden=!0,a.hidden=!1,e.hidden=!1):!e.hidden&&t.type=="flash"&&(l.hidden=!1,a.hidden=!0,e.hidden=!0)}function b(t){p({title:"Choisir P\xE9riode",body:`<div class="mb-3" style="text-align: center;">
              <label>D\xE9but</label>
              <div class="row" style="justify-content: space-around;">
              
                  <div class="col-md-4" >
                      <label>Date</label>
                      <input required class="form-control start-date" id="start-date" type="date" placeholder="yyyy-mm-dd"  onchange="processDateTime('start')" />
                  </div>
                  <div class="col-md-4">
                      <label>Temps</label>
                      <input required class="form-control start-time" id="start-time" type="time" placeholder="hh:mm" data-preview="#start" onchange="processDateTime('start')"/>
                  </div>
                
              </div>
              <small class="form-text text-muted">
                
              </small>
          </div>

          <div class="mb-3" style="text-align: center;">
              <label>Fin</label>
              <div class="row" style="justify-content: space-around;">
                  
                  <div class="col-md-4">
                      <label>Date</label>
                      <input required class="form-control end-date" id="end-date" type="date" placeholder="yyyy-mm-dd" data-preview="#end" onchange="processDateTime('end')"/>
                  </div>
                  <div class="col-md-4">
                      <label>Time</label>
                      <input required class="form-control end-time" id="end-time" type="time" placeholder="hh:mm" data-preview="#end" onchange="processDateTime('end')"/>
                  </div>
                  
              </div>
          
          </div>
          <script>
          endDate = new Date(document.getElementById("end-preview").value * 1000);
          startDate = new Date(document.getElementById("start-preview").value * 1000);

          //faut remodeler le time formater pour avoir YYYY-MM-JJ
          timeFormatterYMD = new Intl.DateTimeFormat("en-US");
          endDateYMDNotformated = timeFormatterYMD .format(endDate);
          endDateYMD = endDateYMDNotformated.split("/")[2]+"-"+(endDateYMDNotformated.split("/")[0].length < 2 ? "0"+endDateYMDNotformated.split("/")[0]: endDateYMDNotformated.split("/")[0])
          +"-"+(endDateYMDNotformated.split("/")[1].length < 2 ? "0"+endDateYMDNotformated.split("/")[1]: endDateYMDNotformated.split("/")[1]);
          timeDateEnd = document.getElementsByClassName("end-date");
          for (let i = 0; i < timeDateEnd.length; i++) {
            timeDateEnd.item(i).value = endDateYMD;
          }


          startDateYMDNotformated = timeFormatterYMD .format(startDate);
          startDateYMD = startDateYMDNotformated.split("/")[2]+"-"+(startDateYMDNotformated.split("/")[0].length < 2 ? "0"+startDateYMDNotformated.split("/")[0]: startDateYMDNotformated.split("/")[0])
          +"-"+(startDateYMDNotformated.split("/")[1].length < 2 ? "0"+startDateYMDNotformated.split("/")[1]: startDateYMDNotformated.split("/")[1]);
          timeDateStart = document.getElementsByClassName("start-date");
          for (let i = 0; i < timeDateStart.length; i++) {
            timeDateStart.item(i).value = startDateYMD;
          }

          timeFormatterHS = new Intl.DateTimeFormat(undefined, { timeStyle: 'medium' });
          console.log(timeFormatterHS.format(endDate))
          endDateHS = timeFormatterHS.format(endDate).split(":")[0]+":"+timeFormatterHS.format(endDate).split(":")[1]
          timeHSEnd = document.getElementsByClassName("end-time");
          for (let i = 0; i < timeHSEnd.length; i++) {
            timeHSEnd.item(i).value = endDateHS;
          }

          startDateHS  = timeFormatterHS.format(startDate).split(":")[0]+":"+timeFormatterHS.format(startDate).split(":")[1]
          timeHSStart = document.getElementsByClassName("start-time");
          for (let i = 0; i < timeHSStart.length; i++) {
            timeHSStart.item(i).value = startDateHS;
          }
          

          <\/script>`,button:"OK",success:function(){console.log("done")}})}function y(t){const e=i("#challenge-create-options-quick").serializeJSON();if(delete e.challenge_id,delete e.flag_type,e.type!="flash")delete e.startTime,delete e.endTime;else if(e.category="D\xE9fi Flash",e.startTime>=e.endTime)return p({title:"not A valide Time Periode",body:"pls choose a valide time periode",button:"OK"}),!1;e.description="",m.fetch("/api/v1/challenges",{method:"POST",credentials:"same-origin",headers:{Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(e)}).then(function(a){return console.log("hello2"),a.json()}).then(function(a){if(a.success){if(a.data.type=="manualRecursive"){const l={value:"R\xE9cursif",challenge:a.data.id};m.api.post_tag_list({},l).then(r=>{})}if(a.data.type=="flash"){const l={value:"Flash",challenge:a.data.id};m.api.post_tag_list({},l).then(r=>{})}setTimeout(function(){window.location.reload(!0)},500)}else{let l="";for(const r in a.errors)l+=a.errors[r].join(`
`),l+=`
`;p({title:"Error",body:l,button:"OK"})}})}document.getElementById("submit-button").addEventListener("click",function(t){t.preventDefault(),y()}),document.getElementById("challenge-create-options-quick-selector").addEventListener("keypress",function(t){t.key==="Enter"&&(t.preventDefault(),y())}),document.getElementById("challenge-type").addEventListener("change",function(t){v()}),document.getElementById("time-selector-input").addEventListener("click",function(t){t.preventDefault(),b()})});function I(h){let o=i("input[data-challenge-id]:checked").map(function(){return i(this).data("challenge-id")}),d=o.length===1?"challenge":"challenges";S({title:"Delete Challenges",body:`Are you sure you want to delete ${o.length} ${d}?`,success:function(){const s=[];for(var n of o)s.push(m.fetch(`/api/v1/challenges/${n}`,{method:"DELETE"}));Promise.all(s).then(u=>{window.location.reload()})}})}function N(h){let o=i("input[data-challenge-id]:checked").map(function(){return i(this).data("challenge-id")});p({title:"Edit Challenges",body:i(`
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
    `),button:"Submit",success:function(){let d=i("#challenges-bulk-edit").serializeJSON(!0);const s=[];for(var n of o)s.push(m.fetch(`/api/v1/challenges/${n}`,{method:"PATCH",body:JSON.stringify(d)}));Promise.all(s).then(u=>{window.location.reload()})}})}i(()=>{i("#challenges-delete-button").click(I),i("#challenges-edit-button").click(N)});
