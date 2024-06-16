import{_ as B,C as d,y,u as b,c as w,a as f,h as q,l as J,m as k,F as j,r as D,b as M,o as g,j as R,t as U,q as $,O as I,$ as t,P as C,Q as F,V as O,z}from"./main-BK-6xwcM.js";import{c as T,u as N}from"../graphs-CTxJCszp.js";import{C as V}from"../CommentBox-BNX8oB-i.js";import"../echarts.common-D0_GFNNI.js";const L={name:"UserAddForm",props:{team_id:Number},data:function(){return{searchedName:"",awaitingSearch:!1,emptyResults:!1,userResults:[],selectedResultIdx:0,selectedUsers:[]}},methods:{searchUsers:function(){if(this.selectedResultIdx=0,this.searchedName==""){this.userResults=[];return}d.fetch(`/api/v1/users?view=admin&field=name&q=${this.searchedName}`,{method:"GET",credentials:"same-origin",headers:{Accept:"application/json","Content-Type":"application/json"}}).then(e=>e.json()).then(e=>{e.success&&(this.userResults=e.data.slice(0,10))})},moveCursor:function(e){switch(e){case"up":this.selectedResultIdx&&(this.selectedResultIdx-=1);break;case"down":this.selectedResultIdx<this.userResults.length-1&&(this.selectedResultIdx+=1);break}},selectUser:function(e){e===void 0&&(e=this.selectedResultIdx);let s=this.userResults[e];this.selectedUsers.some(n=>n.id===s.id)===!1&&this.selectedUsers.push(s),this.userResults=[],this.searchedName=""},removeSelectedUser:function(e){this.selectedUsers=this.selectedUsers.filter(s=>s.id!==e)},handleAddUsersRequest:function(){let e=[];return this.selectedUsers.forEach(s=>{let a={user_id:s.id};e.push(d.fetch(`/api/v1/teams/${this.$props.team_id}/members`,{method:"POST",credentials:"same-origin",headers:{Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(a)}))}),Promise.all(e)},handleRemoveUsersFromTeams:function(){let e=[];return this.selectedUsers.forEach(s=>{let a={user_id:s.id};e.push(d.fetch(`/api/v1/teams/${s.team_id}/members`,{method:"DELETE",body:JSON.stringify(a)}))}),Promise.all(e)},addUsers:function(){let e=[];if(this.selectedUsers.forEach(s=>{s.team_id&&e.push(s.name)}),e.length){let s=y(e.join(", "));b({title:"Confirm Team Removal",body:`The following users are currently in teams:<br><br> ${s} <br><br>Are you sure you want to remove them from their current teams and add them to this one? <br><br>All of their challenge solves, attempts, awards, and unlocked hints will also be deleted!`,success:()=>{this.handleRemoveUsersFromTeams().then(a=>{this.handleAddUsersRequest().then(n=>{window.location.reload()})})}})}else this.handleAddUsersRequest().then(s=>{window.location.reload()})}},watch:{searchedName:function(e){this.awaitingSearch===!1&&setTimeout(()=>{this.searchUsers(),this.awaitingSearch=!1},1e3),this.awaitingSearch=!0}}},G={class:"form-group"},H=f("label",null,"Search Users",-1),K={class:"form-group"},Q=["onClick"],W={class:"form-group"},Y={key:0,class:"text-center"},X=f("span",{class:"text-muted"}," No users found ",-1),Z=[X],ee={class:"list-group"},te=["onClick"],se={class:"form-group"};function ae(e,s,a,n,l,r){return g(),w("div",null,[f("div",G,[H,q(f("input",{type:"text",class:"form-control",placeholder:"Search for users","onUpdate:modelValue":s[0]||(s[0]=i=>e.searchedName=i),onKeyup:[s[1]||(s[1]=k(i=>r.moveCursor("down"),["down"])),s[2]||(s[2]=k(i=>r.moveCursor("up"),["up"])),s[3]||(s[3]=k(i=>r.selectUser(),["enter"]))]},null,544),[[J,e.searchedName]])]),f("div",K,[(g(!0),w(j,null,D(e.selectedUsers,i=>(g(),w("span",{class:"badge badge-primary mr-1",key:i.id},[R(U(i.name)+" ",1),f("a",{class:"btn-fa",onClick:c=>r.removeSelectedUser(i.id)}," ×",8,Q)]))),128))]),f("div",W,[e.userResults.length==0&&this.searchedName!=""&&e.awaitingSearch==!1?(g(),w("div",Y,Z)):M("",!0),f("ul",ee,[(g(!0),w(j,null,D(e.userResults,(i,c)=>(g(),w("li",{class:$({"list-group-item":!0,active:c===e.selectedResultIdx}),key:i.id,onClick:v=>r.selectUser(c)},[R(U(i.name)+" ",1),i.team_id?(g(),w("small",{key:0,class:$({"float-right":!0,"text-white":c===e.selectedResultIdx,"text-muted":c!==e.selectedResultIdx})}," already in a team ",2)):M("",!0)],10,te))),128))])]),f("div",se,[f("button",{class:"btn btn-success d-inline-block float-right",onClick:s[4]||(s[4]=i=>r.addUsers())}," Add Users ")])])}const ne=B(L,[["render",ae]]);window.Alpine=I;window.CTFd=d;window.carouselPosition=0;window.carouselMax=0;I.data("Media",()=>({standings:[],brackets:[],activeBracket:null,async init(){let e={thumbsnail:"thumbsnail",content:"content",user_id:1,team_id:1,challenge_id:1};const a=(await d.fetch("/api/v1/medias",{method:"POST",body:JSON.stringify(e)})).json();console.log(a)}}));I.start();async function ie(e){console.log("hit")}function oe(e){e.preventDefault();const s=t("#team-info-create-form").serializeJSON(!0);s.fields=[];for(const a in s)if(a.match(/fields\[\d+\]/)){let n={},l=parseInt(a.slice(7,-1));n.field_id=l,n.value=s[a],s.fields.push(n),delete s[a]}d.fetch("/api/v1/teams",{method:"POST",credentials:"same-origin",headers:{Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(s)}).then(function(a){return a.json()}).then(function(a){if(a.success){const n=a.data.id;window.location=d.config.urlRoot+"/admin/teams/"+n}else t("#team-info-create-form > #results").empty(),Object.keys(a.errors).forEach(function(n,l){t("#team-info-create-form > #results").append(C({type:"error",body:a.errors[n]}));const r=t("#team-info-create-form").find("input[name={0}]".format(n)),i=t(r);i.addClass("input-filled-invalid"),i.removeClass("input-filled-valid")})})}function re(e){e.preventDefault();let s=t("#team-info-edit-form").serializeJSON(!0);s.fields=[];for(const a in s)if(a.match(/fields\[\d+\]/)){let n={},l=parseInt(a.slice(7,-1));n.field_id=l,n.value=s[a],s.fields.push(n),delete s[a]}d.fetch("/api/v1/teams/"+window.TEAM_ID,{method:"PATCH",credentials:"same-origin",headers:{Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(s)}).then(function(a){return a.json()}).then(function(a){a.success?window.location.reload():(t("#team-info-form > #results").empty(),Object.keys(a.errors).forEach(function(n,l){t("#team-info-form > #results").append(C({type:"error",body:a.errors[n]}));const r=t("#team-info-form").find("input[name={0}]".format(n)),i=t(r);i.addClass("input-filled-invalid"),i.removeClass("input-filled-valid")}))})}window.upCarousel=function(e){window.carouselPosition+=1,window.carouselPosition!=window.carouselMax-1?(window.reloadCarousel(e.parentElement),e.parentElement.getElementsByClassName("slide-arrow-prev")[0].disabled=!1):(window.reloadCarousel(e.parentElement),e.parentElement.getElementsByClassName("slide-arrow-next")[0].disabled=!0,e.parentElement.getElementsByClassName("slide-arrow-prev")[0].disabled=!1)};window.downCarousel=function(e){window.carouselPosition-=1,window.carouselPosition!=0?(window.reloadCarousel(e.parentElement),e.parentElement.getElementsByClassName("slide-arrow-next")[0].disabled=!1):(window.reloadCarousel(e.parentElement),e.parentElement.getElementsByClassName("slide-arrow-prev")[0].disabled=!0,e.parentElement.getElementsByClassName("slide-arrow-next")[0].disabled=!1)};window.reloadCarousel=function(e){window.carouselPosition==0&&(e.getElementsByClassName("slide-arrow-prev")[0].disabled=!0),window.carouselMax==1&&(e.getElementsByClassName("slide-arrow-next")[0].disabled=!0);for(let s=0;s<window.carouselMax;s++)s==window.carouselPosition?e.getElementsByClassName(s+"slide")[0].hidden=!1:e.getElementsByClassName(s+"slide")[0].hidden=!0};function P(e){let a=t("input[data-submission-type=incorrect]:checked").map(function(){return t(this).data("submission-id")}),n=a.length===1?"submission":"submissions";b({title:"Correct Submissions",body:`Are you sure you want to mark ${a.length} ${n} correct?`,success:function(){const l=[];for(var r of a){let i=d.fetch(`/api/v1/submissions/${r}`,{method:"PATCH",credentials:"same-origin",headers:{Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify({type:"correct"})});l.push(i)}Promise.all(l).then(i=>{window.location.reload()})}})}function S(e,s){let a,n,l;switch(s){case"solves":a=t("input[data-submission-type=correct]:checked"),n="solve",l="Solves";break;case"fails":a=t("input[data-submission-type=incorrect]:checked"),n="fail",l="Fails";break}let r=a.map(function(){return t(this).data("submission-id")}),i=r.length===1?n:n+"s";b({title:`Delete ${l}`,body:`Are you sure you want to delete ${r.length} ${i}?`,success:function(){const c=[];for(var v of r)c.push(d.api.delete_submission({submissionId:v}));Promise.all(c).then(E=>{window.location.reload()})}})}function le(e){let s=t("input[data-award-id]:checked").map(function(){return t(this).data("award-id")}),a=s.length===1?"award":"awards";b({title:"Delete Awards",body:`Are you sure you want to delete ${s.length} ${a}?`,success:function(){const n=[];for(var l of s){let r=d.fetch("/api/v1/awards/"+l,{method:"DELETE",credentials:"same-origin",headers:{Accept:"application/json","Content-Type":"application/json"}});n.push(r)}Promise.all(n).then(r=>{window.location.reload()})}})}function de(e){e.preventDefault();let s=t("input[data-missing-challenge-id]:checked").map(function(){return t(this).data("missing-challenge-id")}),a=s.length===1?"challenge":"challenges";b({title:"Mark Correct",body:`Are you sure you want to mark ${s.length} ${a} correct for ${y(window.TEAM_NAME)}?`,success:function(){z({title:"User Attribution",body:`
        Which user on ${y(window.TEAM_NAME)} solved these challenges?
        <div class="pb-3" id="query-team-member-solve">
        ${t("#team-member-select").html()}
        </div>
        `,button:"Mark Correct",success:function(){const n=t("#query-team-member-solve > select").val(),l=[];for(var r of s){let i={provided:"MARKED AS SOLVED BY ADMIN",user_id:n,team_id:window.TEAM_ID,challenge_id:r,type:"correct"},c=d.fetch("/api/v1/submissions",{method:"POST",credentials:"same-origin",headers:{Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(i)});l.push(c)}Promise.all(l).then(i=>{window.location.reload()})}})}})}const x={team:[e=>d.api.get_team_solves({teamId:e}),e=>d.api.get_team_fails({teamId:e}),e=>d.api.get_team_awards({teamId:e})],user:[e=>d.api.get_user_solves({userId:e}),e=>d.api.get_user_fails({userId:e}),e=>d.api.get_user_awards({userId:e})]},ce=(e,s,a,n)=>{let[l,r,i]=x[e];Promise.all([l(n),r(n),i(n)]).then(c=>{T("score_graph","#score-graph",c,e,s,a,n),T("category_breakdown","#categories-pie-graph",c,e,s,a,n),T("solve_percentages","#keys-pie-graph",c,e,s,a,n)})},me=(e,s,a,n)=>{let[l,r,i]=x[e];Promise.all([l(n),r(n),i(n)]).then(c=>{N("score_graph","#score-graph",c,e,s,a,n),N("category_breakdown","#categories-pie-graph",c,e,s,a,n),N("solve_percentages","#keys-pie-graph",c,e,s,a,n)})};t(()=>{t("#team-captain-form").submit(function(o){o.preventDefault();const m=t("#team-captain-form").serializeJSON(!0);d.fetch("/api/v1/teams/"+window.TEAM_ID,{method:"PATCH",credentials:"same-origin",headers:{Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(m)}).then(function(u){return u.json()}).then(function(u){u.success?window.location.reload():(t("#team-captain-form > #results").empty(),Object.keys(u.errors).forEach(function(p,A){t("#team-captain-form > #results").append(C({type:"error",body:u.errors[p]}));const h=t("#team-captain-form").find("select[name={0}]".format(p)),_=t(h);_.addClass("input-filled-invalid"),_.removeClass("input-filled-valid")}))})}),t(".edit-team").click(function(o){t("#team-info-edit-modal").modal("toggle")}),t(".invite-team").click(function(o){d.fetch(`/api/v1/teams/${window.TEAM_ID}/members`,{method:"POST",credentials:"same-origin",headers:{Accept:"application/json","Content-Type":"application/json"}}).then(function(m){return m.json()}).then(function(m){if(m.success){let u=m.data.code,p=`${window.location.origin}${d.config.urlRoot}/teams/invite?code=${u}`;t("#team-invite-modal input[name=link]").val(p),t("#team-invite-modal").modal("toggle")}})}),t("#team-invite-link-copy").click(function(o){F(o,"#team-invite-link")});let e=document.getElementsByClassName("imageContainer");for(let o=0;o<e.length;o++)ie(e[o]);t(".members-team").click(function(o){t("#team-add-modal").modal("toggle")}),t(".edit-captain").click(function(o){t("#team-captain-modal").modal("toggle")}),t(".award-team").click(function(o){t("#team-award-modal").modal("toggle")}),t(".addresses-team").click(function(o){t("#team-addresses-modal").modal("toggle")}),t("#user-award-form").submit(function(o){o.preventDefault();const m=t("#user-award-form").serializeJSON(!0);if(m.user_id=t("#award-member-input").val(),m.team_id=window.TEAM_ID,t("#user-award-form > #results").empty(),!m.user_id){t("#user-award-form > #results").append(C({type:"error",body:"Please select a team member"}));return}m.user_id=parseInt(m.user_id),d.fetch("/api/v1/awards",{method:"POST",credentials:"same-origin",headers:{Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(m)}).then(function(u){return u.json()}).then(function(u){u.success?window.location.reload():(t("#user-award-form > #results").empty(),Object.keys(u.errors).forEach(function(p,A){t("#user-award-form > #results").append(C({type:"error",body:u.errors[p]}));const h=t("#user-award-form").find("input[name={0}]".format(p)),_=t(h);_.addClass("input-filled-invalid"),_.removeClass("input-filled-valid")}))})}),t(".delete-member").click(function(o){o.preventDefault();const m=t(this).attr("member-id"),u=t(this).attr("member-name"),p={user_id:m},A=t(this).parent().parent();b({title:"Remove Member",body:"Are you sure you want to remove {0} from {1}? <br><br><strong>All of their challenge solves, attempts, awards, and unlocked hints will also be deleted!</strong>".format("<strong>"+y(u)+"</strong>","<strong>"+y(window.TEAM_NAME)+"</strong>"),success:function(){d.fetch("/api/v1/teams/"+window.TEAM_ID+"/members",{method:"DELETE",body:JSON.stringify(p)}).then(function(h){return h.json()}).then(function(h){h.success&&A.remove()})}})}),t(".delete-team").click(function(o){b({title:"Delete Team",body:"Are you sure you want to delete {0}".format("<strong>"+y(window.TEAM_NAME)+"</strong>"),success:function(){d.fetch("/api/v1/teams/"+window.TEAM_ID,{method:"DELETE"}).then(function(m){return m.json()}).then(function(m){m.success&&(window.location=d.config.urlRoot+"/admin/teams")})}})}),t("#solves-delete-button").click(function(o){S(o,"solves")}),t("#correct-fail-button").click(P),t("#fails-delete-button").click(function(o){S(o,"fails")}),t("#correct-submissions-button").click(P),t("#submissions-delete-button").click(function(o){S(o,"fails")}),t("#awards-delete-button").click(function(o){le()}),t("#missing-solve-button").click(function(o){de(o)}),t("#team-info-create-form").submit(oe),t("#team-info-edit-form").submit(re);const s=O.extend(V);let a=document.createElement("div");document.querySelector("#comment-box").appendChild(a),new s({propsData:{type:"team",id:window.TEAM_ID}}).$mount(a);const n=O.extend(ne);let l=document.createElement("div");document.querySelector("#team-add-modal .modal-body").appendChild(l),new n({propsData:{team_id:window.TEAM_ID}}).$mount(l);let r,i,c,v;({type:r,id:i,name:c,account_id:v}=window.stats_data);let E;t("#team-statistics-modal").on("shown.bs.modal",function(o){ce(r,i,c,v),E=setInterval(()=>{me(r,i,c,v)},3e5)}),t("#team-statistics-modal").on("hidden.bs.modal",function(o){clearInterval(E)}),t(".statistics-team").click(function(o){t("#team-statistics-modal").modal("toggle")})});