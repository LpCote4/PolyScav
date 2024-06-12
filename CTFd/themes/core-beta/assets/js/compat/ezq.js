import "bootstrap/js/dist/modal";
import "bootstrap/js/dist/toast";
import "../compat/format";
import $ from "jquery";
import hljs from "highlight.js";
import { Modal, Tab } from "bootstrap";
import CommentBox from "../components/comments/CommentBox.vue";
import Vue from "vue";
import { el } from "lolight";


const modalTpl =
  '<div class="modal fade" tabindex="-1" role="dialog">' +
  '  <div class="modal-dialog" role="document">' +
  '    <div class="modal-content">' +
  '      <div class="modal-header">' +
  '        <h5 class="modal-title">{0}</h5>' +
  '        <button type="button" class="btn-close" data-dismiss="modal" aria-label="Close">' +
  '          <span aria-hidden="true"></span>' +
  "        </button>" +
  "      </div>" +
  '      <div class="modal-body">' +
  "      </div>" +
  '      <div class="modal-footer" style="display:block">' +       
  "      </div>" +
  "    </div>" +
  "  </div>" +
  "</div>";

const toastTpl =
  '<div class="toast m-3" role="alert">' +
  '  <div class="toast-header">' +
  '    <strong class="mr-auto">{0}</strong>' +
  '    <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">' +
  '      <span aria-hidden="true">&times;</span>' +
  "    </button>" +
  "  </div>" +
  '  <div class="toast-body">{1}</div>' +
  "</div>";

const progressTpl =
  '<div class="progress">' +
  '  <div class="progress-bar progress-bar-success progress-bar-striped progress-bar-animated" role="progressbar" style="width: {0}%">' +
  "  </div>" +
  "</div>";

const errorTpl =
  '<div class="alert alert-danger alert-dismissable" role="alert">\n' +
  '  <span class="sr-only">Error:</span>\n' +
  "  {0}\n" +
  '  <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button>\n' +
  "</div>";

const successTpl =
  '<div class="alert alert-success alert-dismissable submit-row" role="alert">\n' +
  "  <strong>Success!</strong>\n" +
  "  {0}\n" +
  '  <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button>\n' +
  "</div>";

const buttonTpl =
  '<button type="button" class="btn btn-primary" data-dismiss="modal">{0}</button>';
const noTpl =
  '<button type="button" class="btn btn-danger" data-dismiss="modal">No</button>';
const yesTpl =
  '<button type="button" class="btn btn-primary" data-dismiss="modal">Yes</button>';

export function ezAlert(args, helpers, user) {
  let modalElement = document.createElement("div");
  modalElement.innerHTML = modalTpl;
  modalElement = modalElement.firstChild;
  
  let modalBody = document.createElement("div");
  
  if (typeof args.body === "string") {
    modalBody.innerHTML = `<p>${args.body}</p>`;
    
  } else {
    modalBody.innerHTML = $(args.body);
  }
  
  modalBody = modalBody.children[1];
  modalElement.getElementsByClassName("modal-body")[0].append(modalBody);
  modalElement.getElementsByClassName("modal-title")[0].textContent = args.title;

  let modalLikeBtn = document.createElement("button");
  modalLikeBtn.onclick = () => {submitLike(args.ids, helpers, user, modalLikeBtn)};
  
  modalLikeBtn.className = "btn";
  modalLikeBtn.style.backgroundColor = "rgba(255, 130, 238, 0.7)";
  modalElement.getElementsByClassName("modal-body")[0].append(modalLikeBtn);
  loadLike(args.ids, helpers, modalLikeBtn, user);
  

  let visioneur = new Modal(modalElement);
  
  visioneur.show();
  showComments(modalElement.getElementsByClassName("modal-footer")[0], args.ids);
  
  modalElement.getElementsByClassName("btn-close")[0].onclick = (e) => {visioneur.dispose();e.target.parentElement.parentElement.parentElement.parentElement.outerHTML = ""; document.body.style = "";}

}
function showComments(element, ids) {
  let challenge_id = ids.split("c_id:")[1].split("t_id:")[0];
  let team_id = ids.split("c_id:")[1].split("t_id:")[1];
  
  const commentBox = Vue.extend(CommentBox);
  let vueContainer = document.createElement("div");
  element.appendChild(vueContainer);
  new commentBox({
    propsData: { type: "challenge", id: challenge_id, challenge_id: team_id},
  }).$mount(vueContainer);
  
}
function submitLike(ids, helpers, user, object) {
  let challenge_id = ids.split("c_id:")[1].split("t_id:")[0];
  let team_id = ids.split("c_id:")[1].split("t_id:")[1];
  let args = {};
  args["challenge_id"] = challenge_id;
  let comment = "#"+team_id+"LIKE"+":"+user.id+" "+user.name;
  if (comment.length > 0) {
    helpers.comments.add_comment(
      comment,
      "challenge",
      args,
      () => {
        loadLike(ids, helpers, object, user);
      },
    );
  }
  comment = "";
}
function loadLike(ids, helpers, element, user){
  let challenge_id = ids.split("c_id:")[1].split("t_id:")[0];
  let team_id = ids.split("c_id:")[1].split("t_id:")[1];
  let args = {};
  args["challenge_id"] = challenge_id;
  args[`challengeid`] = team_id+"LIKE";
  args[`page`] = 1;
  args[`per_page`] = 1000;
      
  let response = helpers.comments.get_comments(args).then((response) => {
    element.innerHTML= "&nbsp"+"<i class='fa fa-heart' aria-hidden='true'></i>"+response.data.length;
   
    let founded = false;
    for (let i = 0; i < response.data.length; i++){
      console.log(response.data[i].content.split("LIKE:")[1]);
      console.log(user.id+" "+user.name);
      if (response.data[i].content.split("LIKE:")[1] == user.id+" "+user.name){
        founded = true
      }
    }
    element.disabled = founded;
    return founded;
  });
  

}
export function ezToast(args) {
  const container_available = $("#ezq--notifications-toast-container").length;
  if (!container_available) {
    $("body").append(
      $("<div/>").attr({ id: "ezq--notifications-toast-container" }).css({
        position: "fixed",
        bottom: "0",
        right: "0",
        "min-width": "20%",
      }),
    );
  }

  var res = toastTpl.format(args.title, args.body);
  var obj = $(res);

  if (args.onclose) {
    $(obj)
      .find("button[data-dismiss=toast]")
      .click(function () {
        args.onclose();
      });
  }

  if (args.onclick) {
    let body = $(obj).find(".toast-body");
    body.addClass("cursor-pointer");
    body.click(function () {
      args.onclick();
    });
  }

  let autohide = args.autohide !== false;
  let animation = args.animation !== false;
  let delay = args.delay || 10000; // 10 seconds

  $("#ezq--notifications-toast-container").prepend(obj);

  obj.toast({
    autohide: autohide,
    delay: delay,
    animation: animation,
  });
  obj.toast("show");
  return obj;
}

export function ezQuery(args) {
  const modal = modalTpl.format(args.title);
  const obj = $(modal);

  if (typeof args.body === "string") {
    obj.find(".modal-body").append(`<p>${args.body}</p>`);
  } else {
    obj.find(".modal-body").append($(args.body));
  }

  const yes = $(yesTpl);
  const no = $(noTpl);

  obj.find(".modal-footer").append(no);
  obj.find(".modal-footer").append(yes);

  // Syntax highlighting
  obj.find("pre code").each(function (_idx) {
    hljs.highlightBlock(this);
  });

  $("main").append(obj);

  $(obj).on("hidden.bs.modal", function () {
    $(this).modal("dispose");
  });

  $(yes).click(function () {
    args.success();
  });

  obj.modal("show");

  return obj;
}

export function ezProgressBar(args) {
  if (args.target) {
    const obj = $(args.target);
    const pbar = obj.find(".progress-bar");
    pbar.css("width", args.width + "%");
    return obj;
  }

  const progress = progressTpl.format(args.width);
  const modal = modalTpl.format(args.title);

  const obj = $(modal);
  obj.find(".modal-body").append($(progress));
  $("main").append(obj);

  return obj.modal("show");
}

export function ezBadge(args) {
  const mapping = {
    success: successTpl,
    error: errorTpl,
  };

  const tpl = mapping[args.type].format(args.body);
  return $(tpl);
}

const ezq = {
  ezAlert: ezAlert,
  ezToast: ezToast,
  ezQuery: ezQuery,
  ezProgressBar: ezProgressBar,
  ezBadge: ezBadge,
};
export default ezq;
