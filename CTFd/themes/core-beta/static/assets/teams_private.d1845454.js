import{m as o,C as i,M as n,f as u}from"./index.5095421b.js";import{s as d,c as h}from"./clipboard.46111c0a.js";import{g as p}from"./userscore.d858c074.js";import{e as f}from"./index.2c8751cd.js";import{$ as r,a as g}from"./CommentBox.3be5197b.js";import"./echarts.54e741c1.js";window.Alpine=o;window.CTFd=i;o.store("inviteToken","");o.data("TeamEditModal",()=>({success:null,error:null,initial:null,errors:[],init(){this.initial=d(this.$el.querySelector("form"))},async updateProfile(){let e=d(this.$el,this.initial,!0);e.fields=[];for(const a in e)if(a.match(/fields\[\d+\]/)){let s={},l=parseInt(a.slice(7,-1));s.field_id=l,s.value=e[a],e.fields.push(s),delete e[a]}let t=await i.pages.teams.updateTeamSettings(e);t.success?(this.success=!0,this.error=!1,setTimeout(()=>{this.success=null,this.error=null},3e3)):(this.success=!1,this.error=!0,Object.keys(t.errors).map(a=>{const s=t.errors[a];this.errors.push(s)}))}}));o.data("TeamCaptainModal",()=>({success:null,error:null,errors:[],async updateCaptain(){let e=d(this.$el,null,!0),t=await i.pages.teams.updateTeamSettings(e);t.success?window.location.reload():(this.success=!1,this.error=!0,Object.keys(t.errors).map(a=>{const s=t.errors[a];this.errors.push(s)}))}}));o.data("TeamInviteModal",()=>({copy(){h(this.$refs.link)}}));o.data("TeamDisbandModal",()=>({errors:[],async disbandTeam(){let e=await i.pages.teams.disbandTeam();e.success?window.location.reload():this.errors=e.errors[""]}}));o.data("CaptainMenu",()=>({captain:!1,editTeam(){this.teamEditModal=new n(document.getElementById("team-edit-modal")),this.teamEditModal.show()},chooseCaptain(){this.teamCaptainModal=new n(document.getElementById("team-captain-modal")),this.teamCaptainModal.show()},async inviteMembers(){const e=await i.pages.teams.getInviteToken();if(e.success){const t=e.data.code,a=`${window.location.origin}${i.config.urlRoot}/teams/invite?code=${t}`;document.querySelector("#team-invite-modal input[name=link]").value=a,this.$store.inviteToken=a,this.teamInviteModal=new n(document.getElementById("team-invite-modal")),this.teamInviteModal.show()}else Object.keys(e.errors).map(t=>{const a=e.errors[t];alert(a)})},disbandTeam(){this.teamDisbandModal=new n(document.getElementById("team-disband-modal")),this.teamDisbandModal.show()}}));o.data("TeamGraphs",()=>({solves:null,fails:null,awards:null,solveCount:0,failCount:0,awardCount:0,getSolvePercentage(){return(this.solveCount/(this.solveCount+this.failCount)*100).toFixed(2)},getFailPercentage(){return(this.failCount/(this.solveCount+this.failCount)*100).toFixed(2)},getCategoryBreakdown(){const e=[],t={};this.solves.data.map(s=>{e.push(s.challenge.category)}),e.forEach(s=>{s in t?t[s]+=1:t[s]=1});const a=[];for(const s in t)a.push({name:s,count:t[s],percent:t[s]/e.length*100,color:u(s)});return a},async init(){this.solves=await i.pages.teams.teamSolves("me"),this.fails=await i.pages.teams.teamFails("me"),this.awards=await i.pages.teams.teamAwards("me"),this.solveCount=this.solves.meta.count,this.failCount=this.fails.meta.count,this.awardCount=this.awards.meta.count,f(this.$refs.scoregraph,p(i.team.id,i.team.name,this.solves.data,this.awards.data))}}));o.start();r(".delete-member").click(function(e){e.preventDefault();const t=r(this).attr("member-id"),a=r(this).attr("member-name"),s=r(this).attr("team-name"),l={user_id:t},c=r(this).parent().parent();g({title:"Remove Member",body:"<p> Es-tu s\xFBr de vouloir supprimer <strong>"+a+"</strong> de <strong>"+s+"</strong>? <p><br><br><strong> Tous leurs d\xE9fis r\xE9solus, tentatives, r\xE9compenses et indices d\xE9bloqu\xE9s seront \xE9galement supprim\xE9s !</strong>",success:function(){i.fetch("/api/v1/teams/"+i.team.id+"/members",{method:"DELETE",body:JSON.stringify(l)}).then(function(m){return m.json()}).then(function(m){m.success&&c.remove()})}})});
