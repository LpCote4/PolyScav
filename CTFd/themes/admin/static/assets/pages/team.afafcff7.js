import{_ as P,C as d,z as y,x as w,c as g,a as f,h as x,m as J,q as C,F as j,r as D,b as N,o as b,k as R,t as U,s as $,j as e,P as A,Q as F,V as M,A as z}from"./main.5faacb7e.js";import{c as E,u as I}from"../graphs.07b70f61.js";import{C as B}from"../CommentBox.68e8fcab.js";import{s as V}from"../visual.7ab879e4.js";import"../echarts.common.0aab5dfc.js";const L={name:"UserAddForm",props:{team_id:Number},data:function(){return{searchedName:"",awaitingSearch:!1,emptyResults:!1,userResults:[],selectedResultIdx:0,selectedUsers:[]}},methods:{searchUsers:function(){if(this.selectedResultIdx=0,this.searchedName==""){this.userResults=[];return}d.fetch(`/api/v1/users?view=admin&field=name&q=${this.searchedName}`,{method:"GET",credentials:"same-origin",headers:{Accept:"application/json","Content-Type":"application/json"}}).then(t=>t.json()).then(t=>{t.success&&(this.userResults=t.data.slice(0,10))})},moveCursor:function(t){switch(t){case"up":this.selectedResultIdx&&(this.selectedResultIdx-=1);break;case"down":this.selectedResultIdx<this.userResults.length-1&&(this.selectedResultIdx+=1);break}},selectUser:function(t){t===void 0&&(t=this.selectedResultIdx);let s=this.userResults[t];this.selectedUsers.some(i=>i.id===s.id)===!1&&this.selectedUsers.push(s),this.userResults=[],this.searchedName=""},removeSelectedUser:function(t){this.selectedUsers=this.selectedUsers.filter(s=>s.id!==t)},handleAddUsersRequest:function(){let t=[];return this.selectedUsers.forEach(s=>{let a={user_id:s.id};t.push(d.fetch(`/api/v1/teams/${this.$props.team_id}/members`,{method:"POST",credentials:"same-origin",headers:{Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(a)}))}),Promise.all(t)},handleRemoveUsersFromTeams:function(){let t=[];return this.selectedUsers.forEach(s=>{let a={user_id:s.id};t.push(d.fetch(`/api/v1/teams/${s.team_id}/members`,{method:"DELETE",body:JSON.stringify(a)}))}),Promise.all(t)},addUsers:function(){let t=[];if(this.selectedUsers.forEach(s=>{s.team_id&&t.push(s.name)}),t.length){let s=y(t.join(", "));w({title:"Confirm Team Removal",body:`The following users are currently in teams:<br><br> ${s} <br><br>Are you sure you want to remove them from their current teams and add them to this one? <br><br>All of their challenge solves, attempts, awards, and unlocked hints will also be deleted!`,success:()=>{this.handleRemoveUsersFromTeams().then(a=>{this.handleAddUsersRequest().then(i=>{window.location.reload()})})}})}else this.handleAddUsersRequest().then(s=>{window.location.reload()})}},watch:{searchedName:function(t){this.awaitingSearch===!1&&setTimeout(()=>{this.searchUsers(),this.awaitingSearch=!1},1e3),this.awaitingSearch=!0}}},G={class:"form-group"},H=f("label",null,"Search Users",-1),K={class:"form-group"},Q=["onClick"],W={class:"form-group"},Y={key:0,class:"text-center"},X=f("span",{class:"text-muted"}," No users found ",-1),Z=[X],ee={class:"list-group"},te=["onClick"],se={class:"form-group"};function ae(t,s,a,i,l,r){return b(),g("div",null,[f("div",G,[H,x(f("input",{type:"text",class:"form-control",placeholder:"Search for users","onUpdate:modelValue":s[0]||(s[0]=n=>t.searchedName=n),onKeyup:[s[1]||(s[1]=C(n=>r.moveCursor("down"),["down"])),s[2]||(s[2]=C(n=>r.moveCursor("up"),["up"])),s[3]||(s[3]=C(n=>r.selectUser(),["enter"]))]},null,544),[[J,t.searchedName]])]),f("div",K,[(b(!0),g(j,null,D(t.selectedUsers,n=>(b(),g("span",{class:"badge badge-primary mr-1",key:n.id},[R(U(n.name)+" ",1),f("a",{class:"btn-fa",onClick:c=>r.removeSelectedUser(n.id)}," \xD7",8,Q)]))),128))]),f("div",W,[t.userResults.length==0&&this.searchedName!=""&&t.awaitingSearch==!1?(b(),g("div",Y,Z)):N("",!0),f("ul",ee,[(b(!0),g(j,null,D(t.userResults,(n,c)=>(b(),g("li",{class:$({"list-group-item":!0,active:c===t.selectedResultIdx}),key:n.id,onClick:v=>r.selectUser(c)},[R(U(n.name)+" ",1),n.team_id?(b(),g("small",{key:0,class:$({"float-right":!0,"text-white":c===t.selectedResultIdx,"text-muted":c!==t.selectedResultIdx})}," already in a team ",2)):N("",!0)],10,te))),128))])]),f("div",se,[f("button",{class:"btn btn-success d-inline-block float-right",onClick:s[4]||(s[4]=n=>r.addUsers())}," Add Users ")])])}const ie=P(L,[["render",ae]]);window.CTFd=d;function ne(t){t.preventDefault();const s=e("#team-info-create-form").serializeJSON(!0);s.fields=[];for(const a in s)if(a.match(/fields\[\d+\]/)){let i={},l=parseInt(a.slice(7,-1));i.field_id=l,i.value=s[a],s.fields.push(i),delete s[a]}d.fetch("/api/v1/teams",{method:"POST",credentials:"same-origin",headers:{Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(s)}).then(function(a){return a.json()}).then(function(a){if(a.success){const i=a.data.id;window.location=d.config.urlRoot+"/admin/teams/"+i}else e("#team-info-create-form > #results").empty(),Object.keys(a.errors).forEach(function(i,l){e("#team-info-create-form > #results").append(A({type:"error",body:a.errors[i]}));const r=e("#team-info-create-form").find("input[name={0}]".format(i)),n=e(r);n.addClass("input-filled-invalid"),n.removeClass("input-filled-valid")})})}function oe(t){t.preventDefault();let s=e("#team-info-edit-form").serializeJSON(!0);s.fields=[];for(const a in s)if(a.match(/fields\[\d+\]/)){let i={},l=parseInt(a.slice(7,-1));i.field_id=l,i.value=s[a],s.fields.push(i),delete s[a]}d.fetch("/api/v1/teams/"+window.TEAM_ID,{method:"PATCH",credentials:"same-origin",headers:{Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(s)}).then(function(a){return a.json()}).then(function(a){a.success?window.location.reload():(e("#team-info-form > #results").empty(),Object.keys(a.errors).forEach(function(i,l){e("#team-info-form > #results").append(A({type:"error",body:a.errors[i]}));const r=e("#team-info-form").find("input[name={0}]".format(i)),n=e(r);n.addClass("input-filled-invalid"),n.removeClass("input-filled-valid")}))})}function O(t){let a=e("input[data-submission-type=incorrect]:checked").map(function(){return e(this).data("submission-id")}),i=a.length===1?"submission":"submissions";w({title:"Correct Submissions",body:`Are you sure you want to mark ${a.length} ${i} correct?`,success:function(){const l=[];for(var r of a){let n=d.fetch(`/api/v1/submissions/${r}`,{method:"PATCH",credentials:"same-origin",headers:{Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify({type:"correct"})});l.push(n)}Promise.all(l).then(n=>{window.location.reload()})}})}function S(t,s){let a,i,l;switch(s){case"solves":a=e("input[data-submission-type=correct]:checked"),i="solve",l="Solves";break;case"fails":a=e("input[data-submission-type=incorrect]:checked"),i="fail",l="Fails";break}let r=a.map(function(){return e(this).data("submission-id")}),n=r.length===1?i:i+"s";w({title:`Delete ${l}`,body:`Are you sure you want to delete ${r.length} ${n}? (If the challenge has already been approved, please also delete it in the submissions tabs.)`,success:function(){const c=[];for(var v of r)c.push(d.api.delete_submission({submissionId:v}));Promise.all(c).then(k=>{window.location.reload()})}})}function re(t){let s=e("input[data-award-id]:checked").map(function(){return e(this).data("award-id")}),a=s.length===1?"award":"awards";w({title:"Delete Awards",body:`Are you sure you want to delete ${s.length} ${a}?`,success:function(){const i=[];for(var l of s){let r=d.fetch("/api/v1/awards/"+l,{method:"DELETE",credentials:"same-origin",headers:{Accept:"application/json","Content-Type":"application/json"}});i.push(r)}Promise.all(i).then(r=>{window.location.reload()})}})}function le(t){t.preventDefault();let s=e("input[data-missing-challenge-id]:checked").map(function(){return e(this).data("missing-challenge-id")}),a=s.length===1?"challenge":"challenges";w({title:"Mark Correct",body:`Are you sure you want to mark ${s.length} ${a} correct for ${y(window.TEAM_NAME)}?`,success:function(){z({title:"User Attribution",body:`
        Which user on ${y(window.TEAM_NAME)} solved these challenges?
        <div class="pb-3" id="query-team-member-solve">
        ${e("#team-member-select").html()}
        </div>
        `,button:"Mark Correct",success:function(){const i=e("#query-team-member-solve > select").val(),l=[];for(var r of s){let n={provided:"MARKED AS SOLVED BY ADMIN",user_id:i,team_id:window.TEAM_ID,challenge_id:r,type:"correct"},c=d.fetch("/api/v1/submissions",{method:"POST",credentials:"same-origin",headers:{Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(n)});l.push(c)}Promise.all(l).then(n=>{window.location.reload()})}})}})}const q={team:[t=>d.api.get_team_solves({teamId:t}),t=>d.api.get_team_fails({teamId:t}),t=>d.api.get_team_awards({teamId:t})],user:[t=>d.api.get_user_solves({userId:t}),t=>d.api.get_user_fails({userId:t}),t=>d.api.get_user_awards({userId:t})]},de=(t,s,a,i)=>{let[l,r,n]=q[t];Promise.all([l(i),r(i),n(i)]).then(c=>{E("score_graph","#score-graph",c,t,s,a,i),E("category_breakdown","#categories-pie-graph",c,t,s,a,i),E("solve_percentages","#keys-pie-graph",c,t,s,a,i)})},ce=(t,s,a,i)=>{let[l,r,n]=q[t];Promise.all([l(i),r(i),n(i)]).then(c=>{I("score_graph","#score-graph",c,t,s,a,i),I("category_breakdown","#categories-pie-graph",c,t,s,a,i),I("solve_percentages","#keys-pie-graph",c,t,s,a,i)})};e(()=>{e("#team-captain-form").submit(function(o){o.preventDefault();const m=e("#team-captain-form").serializeJSON(!0);d.fetch("/api/v1/teams/"+window.TEAM_ID,{method:"PATCH",credentials:"same-origin",headers:{Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(m)}).then(function(u){return u.json()}).then(function(u){u.success?window.location.reload():(e("#team-captain-form > #results").empty(),Object.keys(u.errors).forEach(function(p,T){e("#team-captain-form > #results").append(A({type:"error",body:u.errors[p]}));const h=e("#team-captain-form").find("select[name={0}]".format(p)),_=e(h);_.addClass("input-filled-invalid"),_.removeClass("input-filled-valid")}))})}),e(".edit-team").click(function(o){e("#team-info-edit-modal").modal("toggle")}),e(".invite-team").click(function(o){d.fetch(`/api/v1/teams/${window.TEAM_ID}/members`,{method:"POST",credentials:"same-origin",headers:{Accept:"application/json","Content-Type":"application/json"}}).then(function(m){return m.json()}).then(function(m){if(m.success){let u=m.data.code,p=`${window.location.origin}${d.config.urlRoot}/teams/invite?code=${u}`;e("#team-invite-modal input[name=link]").val(p),e("#team-invite-modal").modal("toggle")}})}),e("#team-invite-link-copy").click(function(o){F(o,"#team-invite-link")});let t=document.getElementsByClassName("imageContainer");for(let o=0;o<t.length;o++)V(t[o]);e(".members-team").click(function(o){e("#team-add-modal").modal("toggle")}),e(".edit-captain").click(function(o){e("#team-captain-modal").modal("toggle")}),e(".award-team").click(function(o){e("#team-award-modal").modal("toggle")}),e(".addresses-team").click(function(o){e("#team-addresses-modal").modal("toggle")}),e("#user-award-form").submit(function(o){o.preventDefault();const m=e("#user-award-form").serializeJSON(!0);if(m.user_id=e("#award-member-input").val(),m.team_id=window.TEAM_ID,e("#user-award-form > #results").empty(),!m.user_id){e("#user-award-form > #results").append(A({type:"error",body:"Please select a team member"}));return}m.user_id=parseInt(m.user_id),d.fetch("/api/v1/awards",{method:"POST",credentials:"same-origin",headers:{Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(m)}).then(function(u){return u.json()}).then(function(u){u.success?window.location.reload():(e("#user-award-form > #results").empty(),Object.keys(u.errors).forEach(function(p,T){e("#user-award-form > #results").append(A({type:"error",body:u.errors[p]}));const h=e("#user-award-form").find("input[name={0}]".format(p)),_=e(h);_.addClass("input-filled-invalid"),_.removeClass("input-filled-valid")}))})}),e(".delete-member").click(function(o){o.preventDefault();const m=e(this).attr("member-id"),u=e(this).attr("member-name");console.log(m);const p={user_id:m},T=e(this).parent().parent();w({title:"Remove Member",body:"Are you sure you want to remove {0} from {1}? <br><br><strong>All of their challenge solves, attempts, awards, and unlocked hints will also be deleted!</strong>".format("<strong>"+y(u)+"</strong>","<strong>"+y(window.TEAM_NAME)+"</strong>"),success:function(){d.fetch("/api/v1/teams/"+window.TEAM_ID+"/members",{method:"DELETE",body:JSON.stringify(p)}).then(function(h){return h.json()}).then(function(h){h.success&&T.remove()})}})}),e(".delete-team").click(function(o){w({title:"Delete Team",body:"Are you sure you want to delete {0}".format("<strong>"+y(window.TEAM_NAME)+"</strong>"),success:function(){d.fetch("/api/v1/teams/"+window.TEAM_ID,{method:"DELETE"}).then(function(m){return m.json()}).then(function(m){m.success&&(window.location=d.config.urlRoot+"/admin/teams")})}})}),e("#solves-delete-button").click(function(o){S(o,"solves")}),e("#correct-fail-button").click(O),e("#fails-delete-button").click(function(o){S(o,"fails")}),e("#correct-submissions-button").click(O),e("#submissions-delete-button").click(function(o){S(o,"fails")}),e("#awards-delete-button").click(function(o){re()}),e("#missing-solve-button").click(function(o){le(o)}),e("#team-info-create-form").submit(ne),e("#team-info-edit-form").submit(oe);const s=M.extend(B);let a=document.createElement("div");document.querySelector("#comment-box").appendChild(a),new s({propsData:{type:"team",id:window.TEAM_ID}}).$mount(a);const i=M.extend(ie);let l=document.createElement("div");document.querySelector("#team-add-modal .modal-body").appendChild(l),new i({propsData:{team_id:window.TEAM_ID}}).$mount(l);let r,n,c,v;({type:r,id:n,name:c,account_id:v}=window.stats_data);let k;e("#team-statistics-modal").on("shown.bs.modal",function(o){de(r,n,c,v),k=setInterval(()=>{ce(r,n,c,v)},3e5)}),e("#team-statistics-modal").on("hidden.bs.modal",function(o){clearInterval(k)}),e(".statistics-team").click(function(o){e("#team-statistics-modal").modal("toggle")})});