import{j as s,C as n,B as l}from"./main.29d1c8e6.js";const d={users:(e,i)=>n.api.patch_user_public({userId:e},i),teams:(e,i)=>n.api.patch_team_public({teamId:e},i)};function u(){const e=s(this),i=e.data("account-id"),a=e.data("state");let t;a==="visible"?t=!0:a==="hidden"&&(t=!1);const o={hidden:t};d[n.config.userMode](i,o).then(c=>{c.success&&(t?(e.data("state","hidden"),e.addClass("btn-danger").removeClass("btn-success"),e.text("Hidden")):(e.data("state","visible"),e.addClass("btn-success").removeClass("btn-danger"),e.text("Visible")))})}function r(e,i){const a={hidden:i==="hidden"},t=[];for(let o of e.accounts)t.push(d[n.config.userMode](o,a));for(let o of e.users)t.push(d.users(o,a));Promise.all(t).then(o=>{window.location.reload()})}function b(e){let i=s(".tab-pane.active input[data-account-id]:checked").map(function(){return s(this).data("account-id")}),a=s(".tab-pane.active input[data-user-id]:checked").map(function(){return s(this).data("user-id")}),t={accounts:i,users:a};l({title:"Toggle Visibility",body:s(`
    <form id="scoreboard-bulk-edit">
      <div class="form-group">
        <label>Visibility</label>
        <select name="visibility" data-initial="">
          <option value="">--</option>
          <option value="visible">Visible</option>
          <option value="hidden">Hidden</option>
        </select>
      </div>
    </form>
    `),button:"Submit",success:function(){let c=s("#scoreboard-bulk-edit").serializeJSON(!0).visibility;r(t,c)}})}s(()=>{s(".scoreboard-toggle").click(u),s("#scoreboard-edit-button").click(b)});
