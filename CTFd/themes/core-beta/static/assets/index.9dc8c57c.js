import{d as h}from"./index.5095421b.js";import{u as _,i as $,a as b,b as v,c as y,d as k,e as T,f as x,g as j,h as L,j as w,k as M,l as O,m as S}from"./echarts.54e741c1.js";function N(n){let e=n.concat();for(let a=0;a<n.length;a++)e[a]=n.slice(0,a+1).reduce(function(i,l){return i+l});return e}function B(n){let e=[];if(n.length>0)for(let i=0;i<n.length;i++){let l=n[i];if(e.length==0)e.push(l);else for(let o=e.length;o>0;o--)if(d(l)>d(e[o-1])){let f=e[o-1];e[o-1]=l,e[o]=f}else if(o==e.length){e.push(l);break}}let a={};for(let i=0;i<e.length;i++)e[i].pos=i+1,a[i]=e[i];return a}function d(n){let e=n.score+n.potential_score;return n.potential_score==0&&(e+=.1),e}function E(n,e,a){const i=Object.keys(n);let l=[],o=999;for(let f=0;f<(i.length>=o?o:i.length);f++){let r=n[i[f]].solves,u=n[i[f]].fails,g=U(e[f].members);for(let t=0;t<r.length;t++){let c=r[t].date;r[t].team_name=n[i[f]].name,r[t].user_name=g[r[t].user_id],r[t].challenge_name=a[r[t].challenge_id],r[t].challenge_name||(r[t].challenge_name=r[t].challenge_id),r[t].time=p(c),r[t].color=e[f].color;for(let s=l.length;s>0;s--)if(h(c)>h(l[s-1].date)){let m=l[s-1];l[s-1]=r[t],s<o&&(l[s]=m)}else if(l.length<o&&l.length==s){l.push(r[t]);break}else break;l.length==0&&l.push(r[t])}for(let t=0;t<u.length;t++)if(u[t].type=="manual"||u[t].type=="manualRecursive"){let c=u[t].date;u[t].team_name=n[i[f]].name,u[t].user_name=g[u[t].user_id],u[t].challenge_name=a[u[t].challenge_id],u[t].time=p(c),u[t].color=e[f].color;for(let s=l.length;s>0;s--)if(h(c)>h(l[s-1].date)){let m=l[s-1];l[s-1]=u[t],s<o&&(l[s]=m)}else if(l.length<o&&l.length==s){l.push(u[t]);break}else break;l.length==0&&l.push(u[t])}}return l}function p(n){let e=h()-h(n);return e/(1e3*60*60*24)>=1?"il y a "+Math.floor(e/(1e3*60*60*24))+" jours":e/(1e3*60*60)>=1?"il y a "+Math.floor(e/(1e3*60*60))+" heures":e/(1e3*60)>=1?"il y a "+Math.floor(e/(1e3*60))+" min":"a l'instant"}function U(n){let e={};for(let a=0;a<n.length;a++)e[n[a].id]=n[a].name;return e}_([$,b,v,y,k,T,x,j,L,w,M,O]);function I(n,e){let a=S(n);a.setOption(e),window.addEventListener("resize",()=>{a&&a.resize()})}export{N as c,I as e,E as g,B as t};
