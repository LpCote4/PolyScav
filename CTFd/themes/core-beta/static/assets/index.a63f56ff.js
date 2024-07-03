import{d as f}from"./index.5095421b.js";import{u as p,i as y,a as b,b as x,c as S,d as v,e as _,f as k,g as $,h as j,j as A,k as L,l as T,m as w}from"./echarts.54e741c1.js";function D(n){let a=n.concat();for(let l=0;l<n.length;l++)a[l]=n.slice(0,l+1).reduce(function(r,t){return r+t});return a}function I(n,a){let l={title:{left:"center",text:(n==="teams"?"Teams":"Users")+" Score"},tooltip:{trigger:"axis",axisPointer:{type:"shadow"}},legend:{type:"scroll",orient:"horizontal",align:"left",bottom:35,data:[]},toolbox:{feature:{dataZoom:{yAxisIndex:"none"},saveAsImage:{}}},grid:{containLabel:!0},xAxis:{type:"category",data:[]},yAxis:{type:"value"},series:[]};const r=Object.keys(a);let t=[],u={name:"Score",type:"bar",stack:"total",data:[],itemStyle:{color:"rgba(0, 0, 0, 0.85)"}},m={name:"Potential Score",type:"bar",stack:"total",data:[],itemStyle:{color:"rgba(0, 0, 0, 0.45)",opacity:.5}};for(let s=0;s<r.length;s++){const o=a[r[s]].name,h=a[r[s]].score,e=a[r[s]].potential_score,c=a[r[s]].color;t.push(o),u.data.push({value:h,itemStyle:{color:c}}),m.data.push({value:e,itemStyle:{color:c,opacity:.5}})}return l.xAxis.data=t,l.series.push(u),l.series.push(m),l.series.forEach(s=>{s.barGap="0%",s.barCategoryGap="50%"}),l}function M(n,a,l){const r=Object.keys(n);let t=[],u=999;for(let m=0;m<(r.length>=u?u:r.length);m++){let s=n[r[m]].solves,o=n[r[m]].fails,h=O(a[m].members);for(let e=0;e<s.length;e++){let c=s[e].date;s[e].team_name=n[r[m]].name,s[e].user_name=h[s[e].user_id],s[e].challenge_name=l[s[e].challenge_id],s[e].time=d(c);for(let i=t.length;i>0;i--)if(f(c)>f(t[i-1].date)){let g=t[i-1];t[i-1]=s[e],i<u&&(t[i]=g)}else if(t.length<u&&t.length==i){t.push(s[e]);break}else break;t.length==0&&t.push(s[e])}for(let e=0;e<o.length;e++)if(o[e].type=="manual"||o[e].type=="manualRecursive"){let c=o[e].date;o[e].team_name=n[r[m]].name,o[e].user_name=h[o[e].user_id],o[e].challenge_name=l[o[e].challenge_id],o[e].time=d(c);for(let i=t.length;i>0;i--)if(f(c)>f(t[i-1].date)){let g=t[i-1];t[i-1]=o[e],i<u&&(t[i]=g)}else if(t.length<u&&t.length==i){t.push(o[e]);break}else break;t.length==0&&t.push(o[e])}}return t}function d(n){let a=f()-f(n);return a/(1e3*60*60*24)>=2?"il y a "+Math.floor(a/(1e3*60*60*24))+" jours":a/(1e3*60*60)>=2?"il y a "+Math.floor(a/(1e3*60*60))+" heures":a/(1e3*60)>=2?"il y a "+Math.floor(a/(1e3*60))+" minutes":"il y a moin de 2 minutes"}function O(n){let a={};for(let l=0;l<n.length;l++)a[n[l].id]=n[l].name;return a}p([y,b,x,S,v,_,k,$,j,A,L,T]);function N(n,a){let l=w(n);l.setOption(a),window.addEventListener("resize",()=>{l&&l.resize()})}export{M as a,D as c,N as e,I as g};
