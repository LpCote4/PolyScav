import{m as d,C as s}from"./index.5095421b.js";import{g as r,e as w,a as m}from"./index.e988da21.js";import"./echarts.54e741c1.js";import{e as c,h as g}from"./CommentBox.f63279f1.js";window.Alpine=d;window.CTFd=s;window.ScoreboardDetail=0;window.standings=0;window.scoreboardListLoaded=!1;window.allImages=[];window.maxCount=0;window.maxCountIncrease=3;window.imageInit=!1;d.data("ScoreboardDetail",()=>({data:{},show:!0,async init(){window.standings=await s.pages.scoreboard.getScoreboard(),window.ScoreboardDetail=await s.pages.scoreboard.getScoreboardDetail(window.standings.length),console.log(window.ScoreboardDetail),console.log(window.standings);let e=r(s.config.userMode,window.standings);var t=document.getElementById("score-graph");w(t,e),this.show=window.standings.length>0}}));d.data("ScoreboardList",()=>({standings:[],brackets:[],activeBracket:null,async init(){const t=await(await s.fetch(`/api/v1/brackets?type=${s.config.userMode}`,{method:"GET"})).json();this.brackets=t.data;const n=await(await s.fetch("/api/v1/challenges",{method:"GET"})).json();console.log(n);let a={};for(let o=0;o<n.data.length;o++)a[n.data[o].id]=n.data[o].name;let l=m(window.ScoreboardDetail,window.standings,a);for(let o=0;o<l.length;o++)this.standings[o]=l[o]}}));d.data("LogImage",()=>({async init(){window.allImages.push(this.id),window.allImages.length>window.maxCount&&(document.getElementById(this.id).hidden=!0),window.allImages.length==window.maxCountIncrease&&(window.imageInit||(window.imageInit=!0,self.show10More()))}}));globalThis.show10More=async function(e){let t=[];for(let a=window.maxCount;a<window.maxCount+window.maxCountIncrease;a++)window.allImages[a]&&(t.push(window.allImages[a]),document.getElementById(window.allImages[a]).hidden=!1);const n=await(await s.fetch("/api/v1/teams?ids="+JSON.stringify(t),{method:"GET"})).json();console.log(n);for(let a=0;a<window.maxCountIncrease;a++)if(window.allImages[a+window.maxCount]){document.createElement("img");let l=n.data[a].provided,o="data:text/plain;base64,"+atob(JSON.parse(l)[0]);o.length<5e3?document.getElementById(window.allImages[a+window.maxCount]).querySelector("#img").hidden=!0:(document.getElementById(window.allImages[a+window.maxCount]).querySelector("#img").src=o,document.getElementById(window.allImages[a+window.maxCount]).onclick=showLargeSubmissions,document.getElementById(window.allImages[a+window.maxCount]).querySelector("#img").value=l)}window.maxCount+=window.maxCountIncrease,window.allImages.length<=window.maxCount&&(e.srcElement.disabled=!0)};globalThis.showLargeSubmissions=function(e){let t=e.srcElement.parentElement.tagName=="TR"?e.srcElement.parentElement:e.srcElement.parentElement.parentElement,i=JSON.parse(t.querySelector("#img").value);window.carouselPosition=0,window.carouselMax=i.length;let n="<section class='slider-wrapper' ><img src onerror='reloadCarousel(this.parentElement);'><button class='slide-arrow slide-arrow-prev' id='slide-arrow-prev' onclick='downCarousel(this)' style='display:block;position:absolute;top:50%;'>&#8249;</button><button style='position:absolute;top:50%;left:95%' class='slide-arrow slide-arrow-next' id='slide-arrow-next' onclick='upCarousel(this)'>&#8250;</button><ul class='slides-container' style:'list-style: none;' id='slides-container'>";for(let a=0;a<i.length;a++)n+='<li class="slide '+a+'slide"><img style="" src="data:text/plain;base64,'+atob(i[a])+'" style="width: 100%;" height="auto"></li>';n+="</ul></section>",c({title:"Visioneurs",body:n,button:"retour",ids:t.id},g,s.user)};window.upCarousel=function(e){window.carouselPosition+=1,window.carouselPosition!=window.carouselMax-1?(window.reloadCarousel(e.parentElement),e.parentElement.getElementsByClassName("slide-arrow-prev")[0].disabled=!1):(window.reloadCarousel(e.parentElement),e.parentElement.getElementsByClassName("slide-arrow-next")[0].disabled=!0,e.parentElement.getElementsByClassName("slide-arrow-prev")[0].disabled=!1)};window.downCarousel=function(e){window.carouselPosition-=1,window.carouselPosition!=0?(window.reloadCarousel(e.parentElement),e.parentElement.getElementsByClassName("slide-arrow-next")[0].disabled=!1):(window.reloadCarousel(e.parentElement),e.parentElement.getElementsByClassName("slide-arrow-prev")[0].disabled=!0,e.parentElement.getElementsByClassName("slide-arrow-next")[0].disabled=!1)};window.reloadCarousel=function(e){window.carouselPosition==0&&(e.getElementsByClassName("slide-arrow-prev")[0].disabled=!0),window.carouselMax==1&&(e.getElementsByClassName("slide-arrow-next")[0].disabled=!0);for(let t=0;t<window.carouselMax;t++)t==window.carouselPosition?e.getElementsByClassName(t+"slide")[0].hidden=!1:e.getElementsByClassName(t+"slide")[0].hidden=!0};d.start();
