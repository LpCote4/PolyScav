import{j as e,x as n,C as r}from"./main.5faacb7e.js";function l(d){let t=e("input[data-page-id]:checked").map(function(){return e(this).data("page-id")}),s=t.length===1?"page":"pages";n({title:"Delete Pages",body:`Are you sure you want to delete ${t.length} ${s}?`,success:function(){const a=[];for(var o of t)a.push(r.fetch(`/api/v1/pages/${o}`,{method:"DELETE"}));Promise.all(a).then(i=>{window.location.reload()})}})}e(()=>{e("#pages-delete-button").click(l)});