import{m as c,C as h}from"./index.5095421b.js";import{t as C,g as b}from"./index.9dc8c57c.js";import"./echarts.54e741c1.js";import{e as x,h as S}from"./CommentBox.3be5197b.js";window.Alpine=c;window.CTFd=h;window.ScoreboardDetail=0;window.standings=0;window.nbStandings=0;window.scoreboardListLoaded=!1;window.allImages=[];window.allSubmited=[];window.maxCount=0;window.maxCountIncrease=5;window.imageInit=!1;window.theninit=0;window.decalage=0;window.laoded=0;window.canShowMore=!0;window.splashPosition={1:[["-55px","0","-30px","0px"],["0px","-50px","50%","0px"],["","-50px","0px","0px"]],2:[["-50px","0px","35%","0"],["","-10px","60%","0px"],["-40px","","-35px","0px"]],3:[["-45px","0px","65%","0"],["","-30px","60%","0px"],["15%","","-35px","0px"]],4:[["-40px","0px","-10%","0"],["","-40px","60%","0"],["-40px","","-35px","0px"]],5:[["-40px","0px","-10%","0"],["","-30px","60%","0"],["","-30px","-25px","0px"]],6:[["-0px","0px","-30%","0"],["","40px","60%","0"],["","-30px","-30px","0px"]]};window.scoreboardSplashPosition={1:["95px","","","105px"],2:["110px","","","50px"],3:["85px","","-195px",""],4:["130px","","","190px"],5:["90px","","","290px"]};c.data("ScoreboardDetail",()=>({data:{},rankings:[],top:{},show:!0,async init(){window.standings=await h.pages.scoreboard.getScoreboard(),window.ScoreboardDetail=await h.pages.scoreboard.getScoreboardDetail(window.standings.length),document.getElementById("score-graph"),this.rankings=C(window.standings),this.top=this.rankings[0],this.show=window.standings.length>0}}));globalThis.loserSplash=function(t,e){if(t.value!="laoded"){if(t.parentElement.style.position="abosolute",window.standings.length-1==e)t.src="/themes/core/static/img/splash"+1+".png",t.parentElement.style.top="125px",t.parentElement.style.right="75%";else{t.src="/themes/core/static/img/splash"+(e%5+1)+".png";let i=window.scoreboardSplashPosition[e%5+1];t.parentElement.style.top=i[0],t.parentElement.style.left=i[2],t.parentElement.style.right=i[3]}t.value="laoded"}};c.data("ScoreboardList",()=>({standings:[],brackets:[],activeBracket:null,async init(){if(window.standings.length!=0){const e=await(await h.fetch(`/api/v1/brackets?type=${h.config.userMode}`,{method:"GET"})).json();this.brackets=e.data;const l=await(await h.fetch("/api/v1/challenges",{method:"GET"})).json();let s={};for(let n=0;n<l.data.length;n++)s[l.data[n].id]=l.data[n].name;if(window.ScoreboardDetail==0||window.standings==0)this.init();else{let n=b(window.ScoreboardDetail,window.standings,s);for(let a=0;a<n.length;a++)n[a].provided||(n[a].provided=n[a].date),this.standings[a]=n[a]}window.nbStandings=this.standings.length}}}));c.data("LogImage",()=>({async init(){let t=!1,e=0;try{e=JSON.parse(this.id)[0].id,window.allImages.push(e),window.allSubmited.push(e)}catch{t=!0;let l="";this.id=="Media en train d'\xEAtre trait\xE9"&&(l="Media en train d'\xEAtre trait\xE9"),e=l+"%"+String(Math.random()*1e17),window.allSubmited.push(e)}if(window.allSubmited.length>window.maxCount){let i=document.getElementById(this.id);(this.type=="manual"||this.type=="manualRecursive")&&(i.className+="inSubmission"),t||(i.text=this.challenge_id);try{i.id=e,i.hidden=!0}catch{this.id=e}}(window.allSubmited.length==window.maxCountIncrease||window.allSubmited.length==window.nbStandings)&&(window.imageInit||window.allSubmited.length!=0&&(window.imageInit=!0,self.showXMore()))}}));globalThis.showXMore=async function(t){let e=[];for(let n=window.maxCount;n<window.maxCount+window.maxCountIncrease;n++)try{if(n<window.allSubmited.length){if(!window.allSubmited[n].toString().includes("%"))e.push(window.allImages[n-window.decalage]);else{document.getElementById(window.allSubmited[n]).getElementsByClassName("header")[1].style.height="100px",document.getElementById(window.allSubmited[n]).getElementsByClassName("header")[1].style.width="186px";let a=(Math.random()>.5?-1:1)*(Math.random()*6);document.getElementById(window.allSubmited[n]).style.transform+="rotate("+a+"deg)";let o=document.getElementById(window.allSubmited[n]).getElementsByClassName("splash"),r=window.splashPosition[Math.floor(Math.random()*6)+1];for(let d=0;d<o.length;d++){let w=r[d],m=o[d];m.firstChild.style.top=w[0],m.firstChild.style.bottom=w[1],m.firstChild.style.left=w[2],m.firstChild.style.right=w[3],m.firstChild.src="/themes/core/static/img/splash"+(Math.floor(Math.random()*5)+1)+".png"}window.laoded+=1,window.decalage++}document.getElementById(window.allSubmited[n]).hidden=!1}}catch{}const l=await(await h.fetch("/api/v1/teams?ids="+JSON.stringify(e),{method:"GET"})).json();for(let n=0;n<window.maxCountIncrease;n++)try{if(n<e.length){let a=l.data[n].provided,o=document.getElementById(e[n]),r=!1;try{r=JSON.parse(a)}catch{}if(r){let d=!1;for(let w=0;w<r.length;w++)if(r[w].type=="thumbsnail"){d=!0;let m=createMediaElement(r[w]);m.style["max-width"]="100%",m.style.display="block",m.style.height="auto",m.onload=function(u){stylingImage(u)},o.getElementsByClassName("imageContainer")[0].value!=!0&&(o.getElementsByClassName("imageContainer")[0].appendChild(m),o.getElementsByClassName("imageContainer")[0].value=!0),o.getElementsByClassName("imageContainer")[0].onclick=showLargeSubmissions,o.value=a}if(!d){let w=document.createElement("p");w.textContent="No thumbsnail Available for the current media",o.getElementsByClassName("imageContainer")[0].appendChild(w)}}}}catch{}window.maxCount+=window.maxCountIncrease,(window.laoded==window.allSubmited.length||window.laoded==window.maxCount)&&drawLines(),window.allSubmited.length<=window.maxCount&&(document.getElementById("plus-btn").disabled=!0);let s=document.getElementsByClassName("award-icon");for(let n=0;n<s.length;n++)s[n].parentElement.getElementsByClassName("challenge_name")[0].textContent||(s[n].hidden=!1,s[n].parentElement.getElementsByClassName("challenge_name")[0].hidden=!0)};globalThis.stylingImage=function(t){const e=t.target;e.naturalWidth>e.naturalHeight?(e.classList.add("landscape"),e.parentElement.classList.add("landscape-td"),e.parentElement.parentElement.parentElement.classList.add("landscape-td")):(e.classList.add("portrait"),e.parentElement.classList.add("portrait-td"),e.parentElement.parentElement.parentElement.classList.add("portrait-td"));let i=(Math.random()>.5?-1:1)*(Math.random()*6);e.parentElement.parentElement.parentElement.style.transform+="rotate("+i+"deg)";let l=e.parentElement.parentElement.parentElement.getElementsByClassName("splash"),s=window.splashPosition[Math.floor(Math.random()*6)+1];for(let n=0;n<l.length;n++){let a=s[n],o=l[n];o.firstChild.style.top=a[0],o.firstChild.style.bottom=a[1],o.firstChild.style.left=a[2],o.firstChild.style.right=a[3],o.firstChild.src="/themes/core/static/img/splash"+(Math.floor(Math.random()*5)+1)+".png"}window.laoded+=1,(window.laoded==window.allSubmited.length||window.laoded==window.maxCount)&&drawLines()};globalThis.drawLines=function(){document.body.getBoundingClientRect();let t=window.maxCount-window.maxCountIncrease;for(let s=t==0?t:t-2;s<window.laoded-1;s++){var l=document.getElementsByClassName("lineCanvas")[s];try{let a=document.getElementsByClassName("lineStart")[s],o=document.getElementsByClassName("lineStart")[s+1],r=a.getBoundingClientRect(),d=o.getBoundingClientRect();var l=document.getElementsByClassName("lineCanvas")[s];let m=l.parentElement.parentElement.parentElement.style.transform,u=parseFloat(m.split("rotate(")[1].split("deg")[0]);l.style.transform="rotate("+-u+"deg)",l.style.left=(d.left<r.left?d.left-r.left:0)+"px",console.log(o);let p=l.getBoundingClientRect();console.log(d.left),l.width=d.left-p.left+Math.abs(r.left-p.left)+a.offsetHeight/2,l.height=d.top-p.top+Math.abs(r.top-p.top)+a.offsetWidth/2;let g={x:r.left-p.left+a.offsetWidth/2,y:r.top-p.top+a.offsetHeight/2},f={x:d.left-p.left+(d.left<r.left?a.offsetWidth:0),y:d.top-p.top+o.offsetHeight/4};var e=l.getContext("2d"),i=e.createLinearGradient(g.x,g.y,f.x,l.height);i.addColorStop(0,a.value),i.addColorStop(1,o.value),e.setLineDash([40,20]),e.strokeStyle=i,e.beginPath(),e.lineWidth="7",e.moveTo(g.x,g.y),e.lineTo(f.x,f.y),e.stroke()}catch(a){l.style.width="0px",console.log(a)}}var l=document.getElementsByClassName("lineCanvas")[window.laoded-1];l.style.width="0px"};globalThis.createMediaElement=function(t){let e;return t.type=="video/webm"?(e=document.createElement("video"),e.controls=!0,e.type="video/webm",e.poster=""):(t.type=="image/png"||t.type=="thumbsnail")&&(e=document.createElement("img"),e.type="image/png"),e.src="/files/"+t.location,e};globalThis.showLargeSubmissions=function(t){window.carouselPosition=0;let e,i;try{e=JSON.parse(t.srcElement.parentElement.parentElement.value),i=t.srcElement.parentElement.parentElement}catch{e=JSON.parse(t.srcElement.parentElement.parentElement.parentElement.value),i=t.srcElement.parentElement.parentElement.parentElement}let l=!1;window.carouselMax=e.length-1;let s="<section class='slider-wrapper'><ul class='slides-container list-unstyled' style:'list-style: none !important;' id='slides-container'>";for(let n=0;n<e.length;n++)if(e[n].type!="thumbsnail"){let a=createMediaElement(e[n]);a.style.width="100%",a.style.objectFit="contain",a.style.height="500px";let o=document.createElement("div");o.append(a),s+='<li class="slide '+(l?n-1:n)+'slide" style="min-height:50%">',s+=o.innerHTML,s+="</li>"}else l=!0;s+="</ul></section>",s+="<img src onerror='reloadCarousel(this.parentElement);'></img>",s+=`<button class='btn btn-primary carousel__navigation-button slide-arrow-prev' id='slide-arrow-prev' onclick='downCarousel(this)' style='display:block;position:absolute;top:40%;left:1rem;'><svg viewBox="0 0 100 100"><path d="M 50,0 L 60,10 L 20,50 L 60,90 L 50,100 L 0,50 Z" class="arrow" fill="white" transform="translate(15,0) rotate(0)"></path></svg></button>`,s+=`<button style='position:absolute;top:40%;right:1rem;' class='btn btn-primary carousel__navigation-button slide-arrow-next' id='slide-arrow-next' onclick='upCarousel(this)'><svg viewBox="0 0 100 100"><path d="M 50,0 L 60,10 L 20,50 L 60,90 L 50,100 L 0,50 Z" class="arrow" fill="white" transform="translate(85,100) rotate(180)"></path></svg></button>`,x({title:"Visioneurs",body:s,button:"retour",challenge_id:i.text,ids:i.id,additionalClassMain:"FullSizeCarousel"},S,h.user),document.getElementsByClassName("modal-dialog")[0].style.listStyle="none"};window.upCarousel=function(t){window.carouselPosition+=1,window.carouselPosition!=window.carouselMax-1?(window.reloadCarousel(t.parentElement),t.parentElement.getElementsByClassName("slide-arrow-prev")[0].hidden=!1):(window.reloadCarousel(t.parentElement),t.parentElement.getElementsByClassName("slide-arrow-next")[0].hidden=!0,t.parentElement.getElementsByClassName("slide-arrow-prev")[0].hidden=!1)};window.downCarousel=function(t){window.carouselPosition-=1,window.carouselPosition!=0?(window.reloadCarousel(t.parentElement),t.parentElement.getElementsByClassName("slide-arrow-next")[0].hidden=!1):(window.reloadCarousel(t.parentElement),t.parentElement.getElementsByClassName("slide-arrow-prev")[0].hiddend=!0,t.parentElement.getElementsByClassName("slide-arrow-next")[0].hidden=!1)};window.reloadCarousel=function(t){window.carouselPosition==0&&(t.getElementsByClassName("slide-arrow-prev")[0].hidden=!0),window.carouselMax==1&&(t.getElementsByClassName("slide-arrow-next")[0].hidden=!0);for(let e=0;e<window.carouselMax;e++)if(e==window.carouselPosition)t.getElementsByClassName(e+"slide")[0].hidden=!1;else{t.getElementsByClassName(e+"slide")[0].hidden=!0;let i=t.getElementsByClassName(e+"slide")[0].firstChild;i.nodeName=="VIDEO"&&i.pause()}};let E=async function(t){window.onscroll="",window.canShowMore&&y(document.getElementById("plus-btn"))&&document.getElementById("plus-btn").disabled!=!0&&(window.canShowMore=!1,self.showXMore(),await new Promise(e=>setTimeout(e,1e3)),window.canShowMore=!0),await new Promise(e=>setTimeout(e,100)),window.canShowMore&&y(document.getElementById("plus-btn"))&&document.getElementById("plus-btn").disabled!=!0&&(window.canShowMore=!1,self.showXMore(),await new Promise(e=>setTimeout(e,1e3)),window.canShowMore=!0),window.onscroll=E};window.onscroll=E;function y(t){var e=t.getBoundingClientRect(),i=Math.max(document.documentElement.clientHeight,window.innerHeight);return!(e.bottom<0||e.top-i>=0)}c.start();
