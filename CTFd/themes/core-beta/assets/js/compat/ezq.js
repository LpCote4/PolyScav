import "bootstrap/js/dist/modal";
import "bootstrap/js/dist/toast";
import "./format";
import $ from "jquery";



const progressTpl =
  '<div class="progress">' +
  '  <div class="progress-bar progress-bar-success progress-bar-striped progress-bar-animated" role="progressbar" style="width: {0}%">' +
  "  </div>" +
  "</div>";





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



const ezq = {
  ezProgressBar: ezProgressBar,
};
export default ezq;
