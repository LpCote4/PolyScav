import{j as e,x as r,C as a,D as u}from"./main.0eb0e942.js";function d(l){let t=e("input[data-user-id]:checked").map(function(){return e(this).data("user-id")}),s=t.length===1?"user":"users";r({title:"Delete Users",body:`Are you sure you want to delete ${t.length} ${s}?`,success:function(){const o=[];for(var i of t)o.push(a.fetch(`/api/v1/users/${i}`,{method:"DELETE"}));Promise.all(o).then(n=>{window.location.reload()})}})}function c(l){let t=e("input[data-user-id]:checked").map(function(){return e(this).data("user-id")});u({title:"Edit Users",body:e(`
    <form id="users-bulk-edit">
      <div class="form-group">
        <label>Verified</label>
        <select name="verified" data-initial="">
          <option value="">--</option>
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
      </div>
      <div class="form-group">
        <label>Banned</label>
        <select name="banned" data-initial="">
          <option value="">--</option>
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
      </div>
      <div class="form-group">
        <label>Hidden</label>
        <select name="hidden" data-initial="">
          <option value="">--</option>
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
      </div>
    </form>
    `),button:"Submit",success:function(){let s=e("#users-bulk-edit").serializeJSON(!0);const o=[];for(var i of t)o.push(a.fetch(`/api/v1/users/${i}`,{method:"PATCH",body:JSON.stringify(s)}));Promise.all(o).then(n=>{window.location.reload()})}})}e(()=>{e("#users-delete-button").click(d),e("#users-edit-button").click(c)});
