import{m as r,C as o,h as u,T as g,d as w,M as p,a as b}from"./index.5095421b.js";import{V as f,C as y,h as v}from"./CommentBox.aa3adedb.js";window.values=[];function m(e){let t=new DOMParser().parseFromString(e,"text/html");return t.querySelectorAll('a[href*="://"]').forEach(a=>{a.setAttribute("target","_blank")}),t.documentElement.outerHTML}window.Alpine=r;r.store("challenge",{data:{view:""}});r.data("Hint",()=>({id:null,html:null,async showHint(e){if(e.target.open){let t=(await o.pages.challenge.loadHint(this.id)).data;if(t.content)this.html=m(t.html);else if(await o.pages.challenge.displayUnlock(this.id)){let a=await o.pages.challenge.loadUnlock(this.id);if(a.success){let i=(await o.pages.challenge.loadHint(this.id)).data;this.html=m(i.html)}else e.target.open=!1,o._functions.challenge.displayUnlockError(a)}else e.target.open=!1}}}));r.data("Challenge",()=>({id:null,next_id:null,submission:"",tab:null,solves:[],response:null,share_url:null,async init(){u()},getStyles(){let e={"modal-dialog":!0};try{switch(o.config.themeSettings.challenge_window_size){case"sm":e["modal-sm"]=!0;break;case"lg":e["modal-lg"]=!0;break;case"xl":e["modal-xl"]=!0;break;default:break}}catch(s){console.log("Error processing challenge_window_size"),console.log(s)}return e},async init(){u()},async showChallenge(){new g(this.$el).show()},async showSolves(){this.solves=await o.pages.challenge.loadSolves(this.id),console.log(this.solves),this.solves.forEach(e=>(e.date=w(e.date).format("MMMM Do, h:mm:ss A"),e)),new g(this.$el).show()},async showComments(){const e=f.extend(y);let s=document.createElement("div");console.log(window),document.querySelector("#comment-box").appendChild(s),new e({propsData:{type:"team",id:window.TEAM_ID,challenge_id:this.id}}).$mount(s),new g(this.$el).show()},getNextId(){return r.store("challenge").data.next_id},async nextChallenge(){let e=p.getOrCreateInstance("[x-ref='challengeWindow']");e._element.addEventListener("hidden.bs.modal",s=>{r.nextTick(()=>{this.$dispatch("load-challenge",this.getNextId())})},{once:!0}),e.hide()},async getShareUrl(){let e={type:"solve",challenge_id:this.id};const n=(await(await o.fetch("/api/v1/shares",{method:"POST",body:JSON.stringify(e)})).json()).data.url;this.share_url=n},copyShareUrl(){navigator.clipboard.writeText(this.share_url);let e=b.getOrCreateInstance(this.$el);e.enable(),e.show(),setTimeout(()=>{e.hide(),e.disable()},2e3)},async submitChallenge(){console.log(this.submission),this.response=await o.pages.challenge.submitChallenge(this.id,this.submission),await this.renderSubmissionResponse()},async renderSubmissionResponse(){this.response.data.status==="correct"&&(this.submission=""),this.$dispatch("load-challenges")},async submitManualChallenge(){this.submission=document.getElementById("challenge-input").value,console.log(JSON.parse(this.submission)),this.response=await o.pages.challenge.submitChallenge(this.id,this.submission),this.response.success&&(this.response.data.status="correct",this.response.data.message="succesfuly send!"),this.$dispatch("load-challenges")},compressAnImage(e,s,t){const n=new Image;n.src=e,n.onerror=function(){URL.revokeObjectURL(this.src),console.log("Cannot load image")},n.onload=function(){URL.revokeObjectURL(this.src);const[l,i]=a(n,400,400),h=document.createElement("canvas");h.width=l,h.height=i,h.getContext("2d").drawImage(n,0,0,l,i),h.toBlob(c=>s(c,t),"video/webm",.7)};function a(l,i,h){let d=l.width,c=l.height;return d>c?d>i&&(c=Math.round(c*i/d),d=i):c>h&&(d=Math.round(d*h/c),c=h),[d,c]}},operationImage(e,s){var t=new FileReader;window.type=s,t.onloadend=function(){var n=t.result.split(",")[1],a=btoa(n);let l={};console.log(s),l[String(window.type)]=a,window.values.push(l),document.getElementById("challenge-input").value=JSON.stringify(window.values)},t.readAsDataURL(e)},operationVideo(e,s){var t=new FileReader;window.type=s,t.onloadend=function(){var n=t.result.split(",")[1],a=btoa(n);let l={};console.log(s),l[String(window.type)]=a,window.values.push(l),document.getElementById("challenge-input").value=JSON.stringify(window.values)},t.readAsDataURL(e)},convertToBinary(e){let s="";for(let t=0;t<e.length;t+=4){const n=e[t]<<24|e[t+1]<<16|e[t+2]<<8|e[t+3];s+=n.toString(2).padStart(32,"0")}return s},generateAThumbsnail(e,s){const t=document.createElement("video"),n=document.createElement("canvas");t.src=e,document.body.appendChild(n),t.play(),t.addEventListener("loadeddata",()=>{n.getContext("2d").drawImage(t,0,0,200,200),n.toBlob(a=>s(a,"thumbsnail"),"image/png",.7),t.src=""})},uploadFile(e){window.values=[];for(let t=0;t<e.srcElement.files.length;t++){var s=e.srcElement.files[t];const n=URL.createObjectURL(s);s.type.includes("image")?this.compressAnImage(n,this.operationImage,t==0?"thumbsnail":"image"):s.type.includes("video")&&(fetch(n).then(l=>l.blob()).then(l=>this.operationVideo(l,s.type)),t==0&&this.generateAThumbsnail(n,this.operationImage))}}}));r.data("ChallengeBoard",()=>({loaded:!1,challenges:[],challenge:null,async init(){window.TEAM_ID=o.team.id;let e={};e.team_id=window.TEAM_ID;let s=e;s.page=1,s.per_page=1e4,this.challenges=await o.pages.challenges.getChallenges();let t=await o.pages.scoreboard.getScoreboard();await o.pages.scoreboard.getScoreboardDetail(t.length),this.comments=await v.comments.get_comments(s),this.maxScore=0,this.solveScore=0,this.submitScore=0;for(let n in this.challenges){let a=this.challenges[n].value;this.challenges[n].solved_by_me?this.solveScore+=a:this.challenges[n].submited&&(this.submitScore+=a),this.maxScore+=a}document.getElementById("scoreProgressTitle").textContent=this.solveScore+this.submitScore+" points",document.getElementById("scoreProgressBar").value=100*((this.solveScore+this.submitScore)/this.maxScore),document.getElementById("scoreProgressText").textContent=""+parseInt(100*(this.submitScore/(this.solveScore+this.submitScore)))+"% des points en approbations",this.commentsChallengeDict={};for(let n in this.comments.data){let a=this.comments.data[n].content;if(a.search("#")!=-1){a=a.split("#")[1];let l=a.search(":"),i=0;l!=-1,i=parseInt(a.split(":")[0]),this.commentsChallengeDict[i]!=null?this.commentsChallengeDict[i]=this.commentsChallengeDict[i]+1:this.commentsChallengeDict[i]=1}}for(let n in this.commentsChallengeDict)document.getElementById(n+"a").className="fas fa-comments float-end",document.getElementById(n).textContent=this.commentsChallengeDict[n]>99?99:this.commentsChallengeDict[n];if(this.loaded=!0,window.location.hash){let n=decodeURIComponent(window.location.hash.substring(1)),a=n.lastIndexOf("-");if(a>=0){let i=[n.slice(0,a),n.slice(a+1)][1];await this.loadChallenge(i)}}},getCategories(){const e=[];this.challenges.forEach(s=>{const{category:t}=s;e.includes(t)||e.push(t)});try{const s=o.config.themeSettings.challenge_category_order;if(s){const t=new Function(`return (${s})`);e.sort(t())}}catch(s){console.log("Error running challenge_category_order function"),console.log(s)}return e},getChallenges(e){let s=this.challenges;e!==null&&(s=this.challenges.filter(t=>t.category===e));try{const t=o.config.themeSettings.challenge_order;if(t){const n=new Function(`return (${t})`);s.sort(n())}}catch(t){console.log("Error running challenge_order function"),console.log(t)}return s},async loadChallenges(){this.challenges=await o.pages.challenges.getChallenges(),console.log(this.comments)},async loadChallenge(e){await o.pages.challenge.displayChallenge(e,s=>{s.data.view=m(s.data.view),r.store("challenge").data=s.data,r.nextTick(()=>{let t=p.getOrCreateInstance("[x-ref='challengeWindow']");t._element.addEventListener("hidden.bs.modal",n=>{history.replaceState(null,null," ")},{once:!0}),t.show(),history.replaceState(null,null,`#${s.data.name}-${e}`)})})}}));r.start();