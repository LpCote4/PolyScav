import{m as w,C as o}from"./index.5095421b.js";import{g as c,e as g,a as h}from"./index.5d14d67f.js";import"./echarts.54e741c1.js";import{e as p,h as b}from"./CommentBox.6d8c9990.js";window.Alpine=w;window.CTFd=o;window.ScoreboardDetail=0;window.standings=0;window.nbStandings=0;window.scoreboardListLoaded=!1;window.allImages=[];window.allSubmited=[];window.maxCount=0;window.maxCountIncrease=5;window.imageInit=!1;window.theninit=0;window.decalage=0;w.data("ScoreboardDetail",()=>({data:{},show:!0,async init(){window.standings=await o.pages.scoreboard.getScoreboard(),window.ScoreboardDetail=await o.pages.scoreboard.getScoreboardDetail(window.standings.length);let t=c(o.config.userMode,window.standings);var e=document.getElementById("score-graph");g(e,t),this.show=window.standings.length>0}}));w.data("ScoreboardList",()=>({standings:[],brackets:[],activeBracket:null,async init(){if(window.standings.length!=0){const e=await(await o.fetch(`/api/v1/brackets?type=${o.config.userMode}`,{method:"GET"})).json();this.brackets=e.data;const d=await(await o.fetch("/api/v1/challenges",{method:"GET"})).json();let a={};for(let n=0;n<d.data.length;n++)a[d.data[n].id]=d.data[n].name;if(window.ScoreboardDetail==0||window.standings==0)this.init();else{let n=h(window.ScoreboardDetail,window.standings,a);for(let l=0;l<n.length;l++)this.standings[l]=n[l]}window.nbStandings=this.standings.length}}}));w.data("LogImage",()=>({async init(){let t=!1,e=0;try{e=JSON.parse(this.id)[0].id,window.allImages.push(e),window.allSubmited.push(e)}catch{t=!0,e="t"+String(Math.random()*1e17),window.allSubmited.push(e)}if(window.allSubmited.length>window.maxCount){let i=document.getElementById(this.id);(this.type=="manual"||this.type=="manualRecursive")&&(i.className+="inSubmission"),t||(i.text="c_id:"+this.challenge_id+"t_id:"+this.team_id),i.id=e,i.hidden=!0}(window.allSubmited.length==window.maxCountIncrease||window.allSubmited.length==window.nbStandings)&&(window.imageInit||window.allSubmited.length!=0&&(window.imageInit=!0,self.showXMore()))}}));globalThis.showXMore=async function(t){let e=[];console.log(window.maxCount);for(let a=window.maxCount;a<window.maxCount+window.maxCountIncrease;a++)a<window.allSubmited.length&&(window.allSubmited[a].toString().includes("t")?window.decalage++:e.push(window.allImages[a-window.decalage]),document.getElementById(window.allSubmited[a]).hidden=!1);console.log(e);const d=await(await o.fetch("/api/v1/teams?ids="+JSON.stringify(e),{method:"GET"})).json();for(let a=0;a<window.maxCountIncrease;a++)if(a<e.length){let n=d.data[a].provided,l=document.getElementById(e[a]),s;try{s=JSON.parse(n)}catch{}if(console.log(s),s){let u=!1;for(let r=0;r<s.length;r++)if(s[r].type=="thumbsnail"){u=!0;let m=createMediaElement(s[r]);m.style.width="50px",m.style.height="auto",l.getElementsByClassName("imageContainer")[0].appendChild(m),l.getElementsByClassName("imageContainer")[0].onclick=showLargeSubmissions,l.value=n}if(!u){let r=document.createElement("p");r.textContent="No thumbsnail Available for the current media",l.getElementsByClassName("imageContainer")[0].appendChild(r)}}}window.maxCount+=window.maxCountIncrease,window.allImages.length<=window.maxCount&&(document.getElementById("plus-btn").disabled=!0)};globalThis.createMediaElement=function(t){let e;return t.type=="video/webm"?(e=document.createElement("video"),e.controls=!0,e.type="video/webm",e.poster=""):(t.type=="image/png"||t.type=="thumbsnail")&&(e=document.createElement("img"),e.type="image/png"),e.src="/files/"+t.location,e};globalThis.showLargeSubmissions=function(t){window.carouselPosition=0;let e,i;try{e=JSON.parse(t.srcElement.parentElement.value),i=t.srcElement.parentElement}catch{e=JSON.parse(t.srcElement.parentElement.parentElement.value),i=t.srcElement.parentElement.parentElement}let d=!1;window.carouselMax=e.length-1;let a="<section class='slider-wrapper'><ul class='slides-container list-unstyled' style:'list-style: none !important;' id='slides-container'>";for(let n=0;n<e.length;n++)if(e[n].type!="thumbsnail"){let l=createMediaElement(e[n]);l.style.width="100%",l.style.objectFit="contain",l.style.height="500px";let s=document.createElement("div");s.append(l),a+='<li class="slide '+(d?n-1:n)+'slide" style="min-height:50%">',a+=s.innerHTML,a+="</li>"}else d=!0;a+="</ul></section>",a+="<img src onerror='reloadCarousel(this.parentElement);'></img>",a+=`<button class='btn btn-primary carousel__navigation-button slide-arrow-prev' id='slide-arrow-prev' onclick='downCarousel(this)' style='display:block;position:absolute;top:40%;left:1rem;'><svg viewBox="0 0 100 100"><path d="M 50,0 L 60,10 L 20,50 L 60,90 L 50,100 L 0,50 Z" class="arrow" fill="white" transform="translate(15,0) rotate(0)"></path></svg></button>`,a+=`<button style='position:absolute;top:40%;right:1rem;' class='btn btn-primary carousel__navigation-button slide-arrow-next' id='slide-arrow-next' onclick='upCarousel(this)'><svg viewBox="0 0 100 100"><path d="M 50,0 L 60,10 L 20,50 L 60,90 L 50,100 L 0,50 Z" class="arrow" fill="white" transform="translate(85,100) rotate(180)"></path></svg></button>`,p({title:"Visioneurs",body:a,button:"retour",ids:i.text,additionalClassMain:"FullSizeCarousel"},b,o.user),document.getElementsByClassName("modal-dialog")[0].style.listStyle="none"};window.upCarousel=function(t){window.carouselPosition+=1,window.carouselPosition!=window.carouselMax-1?(window.reloadCarousel(t.parentElement),t.parentElement.getElementsByClassName("slide-arrow-prev")[0].hidden=!1):(window.reloadCarousel(t.parentElement),t.parentElement.getElementsByClassName("slide-arrow-next")[0].hidden=!0,t.parentElement.getElementsByClassName("slide-arrow-prev")[0].hidden=!1)};window.downCarousel=function(t){window.carouselPosition-=1,window.carouselPosition!=0?(window.reloadCarousel(t.parentElement),t.parentElement.getElementsByClassName("slide-arrow-next")[0].hidden=!1):(window.reloadCarousel(t.parentElement),t.parentElement.getElementsByClassName("slide-arrow-prev")[0].hiddend=!0,t.parentElement.getElementsByClassName("slide-arrow-next")[0].hidden=!1)};window.reloadCarousel=function(t){window.carouselPosition==0&&(t.getElementsByClassName("slide-arrow-prev")[0].hidden=!0),window.carouselMax==1&&(t.getElementsByClassName("slide-arrow-next")[0].hidden=!0);for(let e=0;e<window.carouselMax;e++)if(e==window.carouselPosition)t.getElementsByClassName(e+"slide")[0].hidden=!1;else{t.getElementsByClassName(e+"slide")[0].hidden=!0;let i=t.getElementsByClassName(e+"slide")[0].firstChild;i.nodeName=="VIDEO"&&i.pause()}};w.start();
