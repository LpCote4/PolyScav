import{C as a,m as o,h as m,T as d,d as p,M as g,a as f}from"./index.5095421b.js";import{V as y,C as w,h as u}from"./CommentBox.a6c3c962.js";window.values=[];window.TEAM_ID=a.team.id;window.USER_ID=a.user.id;function h(e){let s=new DOMParser().parseFromString(e,"text/html");return s.querySelectorAll('a[href*="://"]').forEach(n=>{n.setAttribute("target","_blank")}),s.documentElement.outerHTML}window.Alpine=o;o.store("challenge",{data:{view:""}});o.data("Hint",()=>({id:null,html:null,async showHint(e){if(e.target.open){let s=(await a.pages.challenge.loadHint(this.id)).data;if(s.content)this.html=h(s.html);else if(await a.pages.challenge.displayUnlock(this.id)){let n=await a.pages.challenge.loadUnlock(this.id);if(n.success){let r=(await a.pages.challenge.loadHint(this.id)).data;this.html=h(r.html)}else e.target.open=!1,a._functions.challenge.displayUnlockError(n)}else e.target.open=!1}}}));o.data("Challenge",()=>({id:null,next_id:null,submission:"",tab:null,solves:[],response:null,share_url:null,async init(){m()},getStyles(){let e={"modal-dialog":!0};try{switch(a.config.themeSettings.challenge_window_size){case"sm":e["modal-sm"]=!0;break;case"lg":e["modal-lg"]=!0;break;case"xl":e["modal-xl"]=!0;break;default:break}}catch(t){console.log("Error processing challenge_window_size"),console.log(t)}return e},async init(){m()},async showChallenge(){new d(this.$el).show()},async showSolves(){this.solves=await a.pages.challenge.loadSolves(this.id),this.solves.forEach(e=>(e.date=p(e.date).format("MMMM Do, h:mm:ss A"),e)),new d(this.$el).show()},async showComments(){const e=y.extend(w);let t=document.createElement("div");document.querySelector("#comment-box").removeChild(document.querySelector("#comment-box").firstChild),document.querySelector("#comment-box").appendChild(t),new e({propsData:{type:"team",id:window.TEAM_ID,challenge_id:this.id}}).$mount(t),new d(this.$el).show()},getNextId(){return o.store("challenge").data.next_id},async nextChallenge(){let e=g.getOrCreateInstance("[x-ref='challengeWindow']");e._element.addEventListener("hidden.bs.modal",t=>{o.nextTick(()=>{this.$dispatch("load-challenge",this.getNextId())})},{once:!0}),e.hide()},async getShareUrl(){let e={type:"solve",challenge_id:this.id};const i=(await(await a.fetch("/api/v1/shares",{method:"POST",body:JSON.stringify(e)})).json()).data.url;this.share_url=i},copyShareUrl(){if(alert(),window.isSecureContext){navigator.clipboard.writeText(this.share_url);let e=f.getOrCreateInstance(this.$el);e.enable(),e.show(),setTimeout(()=>{e.hide(),e.disable()},2e3)}else{const e=document.createElement("textarea");e.value=text,document.body.appendChild(e),e.focus(),e.select();try{document.execCommand("copy")}catch(t){console.error("Unable to copy to clipboard",t)}document.body.removeChild(e)}},async submitChallenge(){console.log(this.submission),this.response=await a.pages.challenge.submitChallenge(this.id,this.submission),await this.renderSubmissionResponse()},async renderSubmissionResponse(){this.response.data.status==="correct"&&(this.submission=""),this.$dispatch("load-challenges")},async submitManualChallenge(e){if(document.getElementById("file-input").hidden)document.getElementById("text-input").value!=""?(this.response=await a.pages.challenge.submitChallenge(this.id,document.getElementById("text-input").value),this.response.success?(this.response.data.status="correct",this.response.data.message="succesfuly send!"):(this.response.data.status="incorrect",this.response.data.message="en error happen pls contact the admin"),this.$dispatch("load-challenges")):alert("You're currently trying to send nothing."),document.getElementById("spinner").hidden=!0;else{let s=document.getElementById("form-file-input");document.getElementById("form-file-input").value=this;var t=new FormData(s);if(Object.fromEntries(t).file.name!="")try{await u.files.upload(s,{id:this.id,type:e},async function(i){document.getElementById("form-file-input").value.$dispatch("load-challenges")})}catch(i){this.response={},this.response.data={},this.response.data.status="incorrect",this.response.data.message="en error happen pls contact the admin for "+i,this.$dispatch("load-challenges"),document.getElementById("challenge-submit").disabled=!1,document.getElementById("spinner").hidden=!0}else alert("You're currently trying to send nothing.")}document.getElementById("file-input").textContent="Selectioner un fichier",document.getElementById("text-input").value=""}}));o.data("ChallengeBoard",()=>({loaded:!1,challenges:[],challenge:null,async init(){let e={};e.team_id=window.TEAM_ID;let t=e;t.page=1,t.per_page=1e4,this.challenges=await a.pages.challenges.getChallenges();let s=await a.pages.scoreboard.getScoreboard();await a.pages.scoreboard.getScoreboardDetail(s.length),this.comments=await u.comments.get_comments(t),this.maxScore=0,this.solveScore=0,this.submitScore=0;for(let n in this.challenges){let l=this.challenges[n].value;this.challenges[n].solved_by_me?this.solveScore+=l:this.challenges[n].submited&&(this.submitScore+=l),this.maxScore+=l}document.getElementById("scoreProgressTitle").textContent=this.solveScore+this.submitScore+" points",document.getElementById("scoreProgressBar").value=100*((this.solveScore+this.submitScore)/this.maxScore);let i;this.solveScore!=0?i=""+parseInt(100*(this.submitScore/(this.solveScore+this.submitScore)))+"% des points en approbations":i="!!! Vous devez pr\xE9alablement relever au moins un d\xE9fi avant de pouvoir \xEAtre visible par les autres \xE9quipes.",document.getElementById("scoreProgressText").textContent=i,this.commentsChallengeDict={};for(let n in this.comments.data){let l=this.comments.data[n].content;if(l.search("#")!=-1){l=l.split("#")[1];let r=l.search(":"),c=0;r!=-1,c=parseInt(l.split(":")[0]),this.commentsChallengeDict[c]!=null?this.commentsChallengeDict[c]=this.commentsChallengeDict[c]+1:this.commentsChallengeDict[c]=1}}for(let n in this.commentsChallengeDict)document.getElementById(n+"a").className="fas fa-comments float-end",document.getElementById(n).textContent=this.commentsChallengeDict[n]>99?99:this.commentsChallengeDict[n];if(this.loaded=!0,window.location.hash){let n=decodeURIComponent(window.location.hash.substring(1)),l=n.lastIndexOf("-");if(l>=0){let c=[n.slice(0,l),n.slice(l+1)][1];await this.loadChallenge(c)}}},getCategories(){const e=[];this.challenges.forEach(t=>{const{category:s}=t;e.includes(s)||e.push(s)});try{const t=a.config.themeSettings.challenge_category_order;if(t){const s=new Function(`return (${t})`);e.sort(s())}}catch(t){console.log("Error running challenge_category_order function"),console.log(t)}return e},getChallenges(e){let t=this.challenges;e!==null&&(t=this.challenges.filter(s=>s.category===e));try{const s=a.config.themeSettings.challenge_order;if(s){const i=new Function(`return (${s})`);t.sort(i())}}catch(s){console.log("Error running challenge_order function"),console.log(s)}return t},async loadChallenges(){this.challenges=await a.pages.challenges.getChallenges()},async loadChallenge(e){await a.pages.challenge.displayChallenge(e,t=>{t.data.view=h(t.data.view),o.store("challenge").data=t.data,o.nextTick(()=>{let s=g.getOrCreateInstance("[x-ref='challengeWindow']");s._element.addEventListener("hidden.bs.modal",i=>{history.replaceState(null,null," ")},{once:!0}),s.show(),history.replaceState(null,null,`#${t.data.name}-${e}`)})})}}));o.start();globalThis.hit=function(){let e=document.getElementById("file-input"),t=document.getElementById("text-input"),s=document.getElementById("file-input-fa"),i=document.getElementById("text-input-fa");t.hidden?(e.hidden=!0,t.hidden=!1,s.hidden=!1,i.hidden=!0):(e.hidden=!1,t.hidden=!0,s.hidden=!0,i.hidden=!1)};globalThis.changeLabel=function(e){let t=e.target.files.length+" folder(s) uploded",s=0,i=["hevc","mp4","avi","mkv","mov","MOV","wmv","flv","webm","mpeg","3gp","ogv"],n=["jpeg","png","gif","bmp","tiff","svg","webp","raw","heic","ico","jpg"];for(let l=0;l<e.target.files.length;l++){let r=e.target.files[l].name.split(".")[1];s+=e.target.files[l].size,!i.includes(r.toLowerCase())&&!n.includes(r.toLowerCase())&&alert("We can not garented ."+r+" will be supported")}s>1e8&&s<2e8?alert("The folders you're trying to upload are bigger than 100MB and will be further compressed to reduce their size even more. This may impact the quality and the upload time by a lot!. FolderSize: "+s/1e6+"MB"):s>2e8&&alert("File can't be bigger than 200MB, even with compression. Please use external tools and share it with a link"),e.target.files.length>20&&(alert("We know you have a lot to flex, but you cannot upload more than 20 files at a time."),t="",e.target.value="",document.getElementById("file-input").textContent=t),document.getElementById("file-input").textContent=t};