import{j as e,x as s}from"./main.a58435d9.js";function c(t){t.preventDefault(),s({title:"Reset CTF?",body:"Are you sure you want to reset your CTFd instance?",success:function(){e("#reset-ctf-form").off("submit").submit()}})}e(()=>{e("#reset-ctf-form").submit(c),e("#select-all").change(function(){const t=e(this).is(":checked");e("input[type='checkbox']").prop("checked",t)})});
