import{$ as e,V as b,C as c,O as u,u as d,N as y}from"./main.da10ea18.js";import{c as m,u as p}from"../graphs.97bfeb48.js";import{C as _}from"../CommentBox.ac54737e.js";import{s as S}from"../visual.9032ce8b.js";import"../echarts.common.416942d1.js";function C(n){n.preventDefault();const s=e("#user-info-create-form").serializeJSON(!0);s.fields=[];for(const o in s)if(o.match(/fields\[\d+\]/)){let r={},l=parseInt(o.slice(7,-1));r.field_id=l,r.value=s[o],s.fields.push(r),delete s[o]}let t="/api/v1/users";s.notify===!0&&(t=`${t}?notify=true`),delete s.notify,c.fetch(t,{method:"POST",credentials:"same-origin",headers:{Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(s)}).then(function(o){return o.json()}).then(function(o){if(o.success){const r=o.data.id;window.location=c.config.urlRoot+"/admin/users/"+r}else e("#user-info-create-form > #results").empty(),Object.keys(o.errors).forEach(function(r,l){e("#user-info-create-form > #results").append(u({type:"error",body:o.errors[r]}));const a=e("#user-info-form").find("input[name={0}]".format(r)),f=e(a);f.addClass("input-filled-invalid"),f.removeClass("input-filled-valid")})})}function k(n){n.preventDefault();const s=e("#user-info-edit-form").serializeJSON(!0);s.fields=[];for(const t in s)if(t.match(/fields\[\d+\]/)){let i={},o=parseInt(t.slice(7,-1));i.field_id=o,i.value=s[t],s.fields.push(i),delete s[t]}c.fetch("/api/v1/users/"+window.USER_ID,{method:"PATCH",credentials:"same-origin",headers:{Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(s)}).then(function(t){return t.json()}).then(function(t){t.success?window.location.reload():(e("#user-info-edit-form > #results").empty(),Object.keys(t.errors).forEach(function(i,o){e("#user-info-edit-form > #results").append(u({type:"error",body:t.errors[i]}));const r=e("#user-info-edit-form").find("input[name={0}]".format(i)),l=e(r);l.addClass("input-filled-invalid"),l.removeClass("input-filled-valid")}))})}function E(n){n.preventDefault(),d({title:"Delete User",body:"Are you sure you want to delete {0}".format("<strong>"+y(window.USER_NAME)+"</strong>"),success:function(){c.fetch("/api/v1/users/"+window.USER_ID,{method:"DELETE"}).then(function(s){return s.json()}).then(function(s){s.success&&(window.location=c.config.urlRoot+"/admin/users")})}})}function D(n){n.preventDefault();const s=e("#user-award-form").serializeJSON(!0);s.user_id=window.USER_ID,c.fetch("/api/v1/awards",{method:"POST",credentials:"same-origin",headers:{Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(s)}).then(function(t){return t.json()}).then(function(t){t.success?window.location.reload():(e("#user-award-form > #results").empty(),Object.keys(t.errors).forEach(function(i,o){e("#user-award-form > #results").append(u({type:"error",body:t.errors[i]}));const r=e("#user-award-form").find("input[name={0}]".format(i)),l=e(r);l.addClass("input-filled-invalid"),l.removeClass("input-filled-valid")}))})}function I(n){n.preventDefault();var s=e("#user-mail-form").serializeJSON(!0);c.fetch("/api/v1/users/"+window.USER_ID+"/email",{method:"POST",credentials:"same-origin",headers:{Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(s)}).then(function(t){return t.json()}).then(function(t){t.success?(e("#user-mail-form > #results").append(u({type:"success",body:"E-Mail sent successfully!"})),e("#user-mail-form").find("input[type=text], textarea").val("")):(e("#user-mail-form > #results").empty(),Object.keys(t.errors).forEach(function(i,o){e("#user-mail-form > #results").append(u({type:"error",body:t.errors[i]}));var r=e("#user-mail-form").find("input[name={0}], textarea[name={0}]".format(i)),l=e(r);l.addClass("input-filled-invalid"),l.removeClass("input-filled-valid")}))})}function g(n){let t=e("input[data-submission-type=incorrect]:checked").map(function(){return e(this).data("submission-id")}),i=t.length===1?"submission":"submissions";d({title:"Correct Submissions",body:`Are you sure you want to mark ${t.length} ${i} correct?`,success:function(){const o=[];for(var r of t){let l=c.fetch(`/api/v1/submissions/${r}`,{method:"PATCH",credentials:"same-origin",headers:{Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify({type:"correct"})});o.push(l)}Promise.all(o).then(l=>{window.location.reload()})}})}function h(n,s){let t,i,o;switch(s){case"solves":t=e("input[data-submission-type=correct]:checked"),i="solve",o="Solves";break;case"fails":t=e("input[data-submission-type=incorrect]:checked"),i="fail",o="Fails";break}let r=t.map(function(){return e(this).data("submission-id")}),l=r.length===1?i:i+"s";d({title:`Delete ${o}`,body:`Are you sure you want to delete ${r.length} ${l}?`,success:function(){const a=[];for(var f of r)a.push(c.api.delete_submission({submissionId:f}));Promise.all(a).then(N=>{window.location.reload()})}})}function j(n){let s=e("input[data-award-id]:checked").map(function(){return e(this).data("award-id")}),t=s.length===1?"award":"awards";d({title:"Delete Awards",body:`Are you sure you want to delete ${s.length} ${t}?`,success:function(){const i=[];for(var o of s){let r=c.fetch("/api/v1/awards/"+o,{method:"DELETE",credentials:"same-origin",headers:{Accept:"application/json","Content-Type":"application/json"}});i.push(r)}Promise.all(i).then(r=>{window.location.reload()})}})}function A(n){n.preventDefault();let s=e("input[data-missing-challenge-id]:checked").map(function(){return e(this).data("missing-challenge-id")}),t=s.length===1?"challenge":"challenges";d({title:"Mark Correct",body:`Are you sure you want to mark ${s.length} ${t} correct for ${y(window.USER_NAME)}?`,success:function(){const i=[];for(var o of s){let r={provided:"MARKED AS SOLVED BY ADMIN",user_id:window.USER_ID,team_id:window.TEAM_ID,challenge_id:o,type:"correct"},l=c.fetch("/api/v1/submissions",{method:"POST",credentials:"same-origin",headers:{Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(r)});i.push(l)}Promise.all(i).then(r=>{window.location.reload()})}})}const v={team:[n=>c.api.get_team_solves({teamId:n}),n=>c.api.get_team_fails({teamId:n}),n=>c.api.get_team_awards({teamId:n})],user:[n=>c.api.get_user_solves({userId:n}),n=>c.api.get_user_fails({userId:n}),n=>c.api.get_user_awards({userId:n})]},O=(n,s,t,i)=>{let[o,r,l]=v[n];Promise.all([o(i),r(i),l(i)]).then(a=>{m("score_graph","#score-graph",a,n,s,t,i),m("category_breakdown","#categories-pie-graph",a,n,s,t,i),m("solve_percentages","#keys-pie-graph",a,n,s,t,i)})},T=(n,s,t,i)=>{let[o,r,l]=v[n];Promise.all([o(i),r(i),l(i)]).then(a=>{p("score_graph","#score-graph",a,n,s,t,i),p("category_breakdown","#categories-pie-graph",a,n,s,t,i),p("solve_percentages","#keys-pie-graph",a,n,s,t,i)})};e(()=>{e(".delete-user").click(E),e(".edit-user").click(function(a){e("#user-info-modal").modal("toggle")}),e(".award-user").click(function(a){e("#user-award-modal").modal("toggle")}),e(".email-user").click(function(a){e("#user-email-modal").modal("toggle")}),e(".addresses-user").click(function(a){e("#user-addresses-modal").modal("toggle")}),e("#user-mail-form").submit(I),e("#solves-delete-button").click(function(a){h(a,"solves")}),e("#correct-fail-button").click(g),e("#correct-submissions-button").click(g),e("#fails-delete-button").click(function(a){h(a,"fails")}),e("#submissions-delete-button").click(function(a){h(a,"fails")}),e("#awards-delete-button").click(function(a){j()}),e("#missing-solve-button").click(function(a){A(a)}),e("#user-info-create-form").submit(C),e("#user-info-edit-form").submit(k),e("#user-award-form").submit(D);const n=b.extend(_);let s=document.createElement("div");document.querySelector("#comment-box").appendChild(s),new n({propsData:{type:"user",id:window.USER_ID}}).$mount(s);let t,i,o,r;({type:t,id:i,name:o,account_id:r}=window.stats_data);let l;e("#user-statistics-modal").on("shown.bs.modal",function(a){O(t,i,o,r),l=setInterval(()=>{T(t,i,o,r)},3e5)}),e("#user-statistics-modal").on("hidden.bs.modal",function(a){clearInterval(l)}),e(".statistics-user").click(function(a){e("#user-statistics-modal").modal("toggle")})});let w=document.getElementsByClassName("imageContainer");for(let n=0;n<w.length;n++)S(w[n]);
