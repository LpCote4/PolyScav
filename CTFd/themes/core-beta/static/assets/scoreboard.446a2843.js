import{m as o,C as a}from"./index.1066a40a.js";import{g as r,e as l,a as w}from"./index.9cbf22da.js";import"./echarts.54e741c1.js";window.Alpine=o;window.CTFd=a;window.ScoreboardDetail=0;window.standings=0;o.data("ScoreboardDetail",()=>({data:{},show:!0,async init(){window.standings=await a.pages.scoreboard.getScoreboard(),window.ScoreboardDetail=await a.pages.scoreboard.getScoreboardDetail(window.standings.length),console.log(window.ScoreboardDetail),console.log(window.standings);let s=r(a.config.userMode,window.standings);var n=document.getElementById("score-graph");l(n,s),this.show=window.standings.length>0}}));o.data("ScoreboardList",()=>({standings:[],brackets:[],activeBracket:null,async init(){const n=await(await a.fetch(`/api/v1/brackets?type=${a.config.userMode}`,{method:"GET"})).json();this.brackets=n.data;const t=await(await a.fetch("/api/v1/challenges",{method:"GET"})).json();console.log(t);let i={};for(let e=0;e<t.data.length;e++)i[t.data[e].id]=t.data[e].name;let d=w(window.ScoreboardDetail,window.standings,i);for(let e=0;e<d.length;e++)this.standings[e]=d[e]}}));o.start();