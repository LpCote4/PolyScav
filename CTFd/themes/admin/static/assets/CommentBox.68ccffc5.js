import{_ as r,C as h,J as p,u as m,K as u,c as l,a as e,h as _,m as g,t as a,b as c,f as b,g as v,T as f,o as d,F as C,r as y,p as k,l as x}from"./pages/main.a58435d9.js";const $={props:{type:String,id:Number},data:function(){return{page:1,pages:null,next:null,prev:null,total:null,comment:"",comments:[],urlRoot:h.config.urlRoot}},methods:{toLocalTime(t){return p(t).format("MMMM Do, h:mm:ss A")},nextPage:function(){this.page++,this.loadComments()},prevPage:function(){this.page--,this.loadComments()},getArgs:function(){let t={};return t[`${this.$props.type}_id`]=this.$props.id,t},loadComments:function(){let t=this.getArgs();t.page=this.page,t.per_page=10,m.comments.get_comments(t).then(s=>(this.page=s.meta.pagination.page,this.pages=s.meta.pagination.pages,this.next=s.meta.pagination.next,this.prev=s.meta.pagination.prev,this.total=s.meta.pagination.total,this.comments=s.data,this.comments))},submitComment:function(){let t=this.comment.trim();t.length>0&&m.comments.add_comment(t,this.$props.type,this.getArgs(),()=>{this.loadComments()}),this.comment=""},deleteComment:function(t){confirm("Are you sure you'd like to delete this comment?")&&m.comments.delete_comment(t).then(s=>{if(s.success===!0)for(let i=this.comments.length-1;i>=0;--i)this.comments[i].id==t&&this.comments.splice(i,1)})}},created(){this.loadComments()},updated(){this.$el.querySelectorAll("pre code").forEach(t=>{u.highlightBlock(t)})}},A=t=>(k("data-v-d305388c"),t=t(),x(),t),P={class:"row mb-3"},T={class:"col-md-12"},w={class:"comment"},M={key:0,class:"row"},S={class:"col-md-12"},B={class:"text-center"},L=["disabled"],N=["disabled"],V={class:"col-md-12"},D={class:"text-center"},F={class:"text-muted"},H={class:"comments"},I={class:"card-body pl-0 pb-0 pt-2 pr-2"},R=["onClick"],E=A(()=>e("span",{"aria-hidden":"true"},"\xD7",-1)),J=[E],j={class:"card-body"},q=["innerHTML"],z={class:"text-muted float-left"},G=["href"],K={class:"text-muted float-right"},U={class:"float-right"},O={key:1,class:"row"},Q={class:"col-md-12"},W={class:"text-center"},X=["disabled"],Y=["disabled"],Z={class:"col-md-12"},tt={class:"text-center"},et={class:"text-muted"};function st(t,s,i,ot,nt,n){return d(),l("div",null,[e("div",P,[e("div",T,[e("div",w,[_(e("textarea",{class:"form-control mb-2",rows:"2",id:"comment-input",placeholder:"Add comment","onUpdate:modelValue":s[0]||(s[0]=o=>t.comment=o)},null,512),[[g,t.comment,void 0,{lazy:!0}]]),e("button",{class:"btn btn-sm btn-primary btn-outlined float-right",type:"submit",onClick:s[1]||(s[1]=o=>n.submitComment())}," Comment ")])])]),t.pages>1?(d(),l("div",M,[e("div",S,[e("div",B,[e("button",{type:"button",class:"btn btn-link p-0",onClick:s[2]||(s[2]=o=>n.prevPage()),disabled:!t.prev}," <<< ",8,L),e("button",{type:"button",class:"btn btn-link p-0",onClick:s[3]||(s[3]=o=>n.nextPage()),disabled:!t.next}," >>> ",8,N)])]),e("div",V,[e("div",D,[e("small",F,"Page "+a(t.page)+" of "+a(t.total)+" comments",1)])])])):c("",!0),e("div",H,[b(f,{name:"comment-card"},{default:v(()=>[(d(!0),l(C,null,y(t.comments,o=>(d(),l("div",{class:"comment-card card mb-2",key:o.id},[e("div",I,[e("button",{type:"button",class:"close float-right","aria-label":"Close",onClick:at=>n.deleteComment(o.id)},J,8,R)]),e("div",j,[e("div",{class:"card-text",innerHTML:o.html},null,8,q),e("small",z,[e("span",null,[e("a",{href:`${t.urlRoot}/admin/users/${o.author_id}`},a(o.author.name),9,G)])]),e("small",K,[e("span",U,a(n.toLocalTime(o.date)),1)])])]))),128))]),_:1})]),t.pages>1?(d(),l("div",O,[e("div",Q,[e("div",W,[e("button",{type:"button",class:"btn btn-link p-0",onClick:s[4]||(s[4]=o=>n.prevPage()),disabled:!t.prev}," <<< ",8,X),e("button",{type:"button",class:"btn btn-link p-0",onClick:s[5]||(s[5]=o=>n.nextPage()),disabled:!t.next}," >>> ",8,Y)])]),e("div",Z,[e("div",tt,[e("small",et,"Page "+a(t.page)+" of "+a(t.total)+" comments",1)])])])):c("",!0)])}const lt=r($,[["render",st],["__scopeId","data-v-d305388c"]]);export{lt as C};
