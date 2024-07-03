import "./main";
import CTFd from "../compat/CTFd";
import $ from "jquery";
import { htmlEntities } from "@ctfdio/ctfd-js/utils/html";
import { ezQuery, ezAlert } from "../compat/ezq";
import "../compat/format";

window.carouselPosition = 0;
window.carouselMax = 0;

async function showProvided(element) {
  let provide = element.id;
  console.log(provide);
  let mediaContents;
  try {
    mediaContents = JSON.parse(provide);
  } catch {}
  //si media content est defis c que le provied est des photos/video
  //sinon c autre chose genre du texte
  if (mediaContents) {
    let thumbsnailAvailable = false;
    for (let i = 0; i < mediaContents.length; i++) {
      console.log(mediaContents[i]);
      if (mediaContents[i]["type"] == "thumbsnail") {
        console.log(mediaContents[i]["type"]);
        console.log(mediaContents[i]["location"]);
        thumbsnailAvailable = true;
        let thumbsnail = createMediaElement(mediaContents[i]);
        thumbsnail.style.width = "50px";
        thumbsnail.style.height = "auto";
        element.appendChild(thumbsnail);
        element.onclick = showLargeSubmissions;
      }
    }
    if (!thumbsnailAvailable) {
      let text = document.createElement("p");
      text.textContent = "No thumbsnail Available for the current media";
      element.appendChild(text);
    }
  } else {
    let text = document.createElement("p");
    text.textContent = provide;
    element.appendChild(text);
  }
}
function createMediaElement(mediaContent) {
  let htmlElement;
  if (mediaContent["type"] == "video/webm") {
    htmlElement = document.createElement("video");
    htmlElement.controls = true;
    htmlElement.type = "video/webm";
  } else if (
    mediaContent["type"] == "image/png" ||
    mediaContent["type"] == "thumbsnail"
  ) {
    htmlElement = document.createElement("img");
    htmlElement.type = "image/png";
  }
  htmlElement.src = "/files/" + mediaContent["location"];
  console.log(htmlElement.src);
  return htmlElement;
}
function showLargeSubmissions(_event) {
  window.carouselPosition = 0;
  let mediaContents;
  try {
    mediaContents = JSON.parse(_event.srcElement.id);
  } catch {
    mediaContents = JSON.parse(_event.srcElement.parentElement.id);
  }
  let decalage = false;
  let images = mediaContents;

  window.carouselMax = mediaContents.length - 1;
  let imagesHTML =
    "<section class='slider-wrapper'><ul class='slides-container list-unstyled' style:'list-style: none !important;' id='slides-container'>";
  for (let i = 0; i < mediaContents.length; i++) {
    if (mediaContents[i]["type"] != "thumbsnail") {
      let element = createMediaElement(mediaContents[i]);
      element.style.width = "100%";
      element.style.objectFit = "contain";
      element.style.height = "500px";

      let lambda = document.createElement("div");
      lambda.append(element);
      imagesHTML +=
        `<li class="slide ` +
        (decalage ? i - 1 : i) +
        "slide" +
        `" style="min-height:50%">`;
      imagesHTML += lambda.innerHTML;
      imagesHTML += `</li>`;
    } else {
      decalage = true;
    }
  }
  imagesHTML += "</ul></section>";
  imagesHTML +=
    "<img src onerror='reloadCarousel(this.parentElement);'><button class='btn btn-primary carousel__navigation-button slide-arrow-prev' id='slide-arrow-prev' onclick='downCarousel(this)' style='display:block;position:absolute;top:40%;left:1rem;'>" +
    `<svg viewBox="0 0 100 100"><path d="M 50,0 L 60,10 L 20,50 L 60,90 L 50,100 L 0,50 Z" class="arrow" fill="white" transform="translate(15,0) rotate(0)"></path></svg>` +
    "</button><button style='position:absolute;top:40%;right:1rem;' class='btn btn-primary carousel__navigation-button slide-arrow-next' id='slide-arrow-next' onclick='upCarousel(this)'>" +
    `<svg viewBox="0 0 100 100"><path d="M 50,0 L 60,10 L 20,50 L 60,90 L 50,100 L 0,50 Z" class="arrow" fill="white" transform="translate(85,100) rotate(180)"></path></svg>` +
    "</button>";
  ezAlert({
    title: "Visioneurs",
    body: imagesHTML,
    button: "retour",
    additionalClassMain: "FullSizeCarousel",
  });
  document.getElementsByClassName("modal-dialog")[0].style.listStyle = "none";
}
window.upCarousel = function (self) {
  window.carouselPosition += 1;
  if (window.carouselPosition != window.carouselMax - 1) {
    window.reloadCarousel(self.parentElement);
    self.parentElement.getElementsByClassName("slide-arrow-prev")[0].hidden =
      false;
  } else {
    window.reloadCarousel(self.parentElement);
    self.parentElement.getElementsByClassName("slide-arrow-next")[0].hidden =
      true;
    self.parentElement.getElementsByClassName("slide-arrow-prev")[0].hidden =
      false;
  }
};
window.downCarousel = function (self) {
  window.carouselPosition -= 1;

  if (window.carouselPosition != 0) {
    window.reloadCarousel(self.parentElement);
    self.parentElement.getElementsByClassName("slide-arrow-next")[0].hidden =
      false;
  } else {
    window.reloadCarousel(self.parentElement);
    self.parentElement.getElementsByClassName("slide-arrow-prev")[0].hiddend =
      true;
    self.parentElement.getElementsByClassName("slide-arrow-next")[0].hidden =
      false;
  }
};
window.reloadCarousel = function (element) {
  if (window.carouselPosition == 0) {
    element.getElementsByClassName("slide-arrow-prev")[0].hidden = true;
  }
  if (window.carouselMax == 1) {
    element.getElementsByClassName("slide-arrow-next")[0].hidden = true;
  }

  for (let i = 0; i < window.carouselMax; i++) {
    if (i == window.carouselPosition) {
      element.getElementsByClassName(i + "slide")[0].hidden = false;
    } else {
      element.getElementsByClassName(i + "slide")[0].hidden = true;

      let child = element.getElementsByClassName(i + "slide")[0].firstChild;

      if (child.nodeName == "VIDEO") {
        child.pause();
      }
    }
  }
};
function deleteCorrectSubmission(_event) {
  const key_id = $(this).data("submission-id");
  const $elem = $(this).parent().parent();
  const chal_name = $elem.find(".chal").text().trim();
  const team_name = $elem.find(".team").text().trim();

  const row = $(this).parent().parent();

  ezQuery({
    title: "Delete Submission",
    body: "Are you sure you want to delete correct submission from {0} for challenge {1}".format(
      "<strong>" + htmlEntities(team_name) + "</strong>",
      "<strong>" + htmlEntities(chal_name) + "</strong>"
    ),
    success: function () {
      alert({ submissionId: key_id });
      CTFd.api
        .delete_submission({ submissionId: key_id })
        .then(function (response) {
          if (response.success) {
            row.remove();
          }
        });
    },
  });
}

function deleteSelectedSubmissions(_event) {
  let submissionIDs = $("input[data-submission-id]:checked").map(function () {
    return $(this).data("submission-id");
  });
  let target = submissionIDs.length === 1 ? "submission" : "submissions";

  ezQuery({
    title: "Delete Submissions",
    body: `Are you sure you want to delete ${submissionIDs.length} ${target}?`,
    success: function () {
      const reqs = [];

      for (var subId of submissionIDs) {
        reqs.push(CTFd.api.delete_submission({ submissionId: subId }));
      }
      Promise.all(reqs).then((_responses) => {
        window.location.reload();
      });
    },
  });
}

function correctSubmissions(_event) {
  let submissionIDs = $("input[data-submission-id]:checked").map(function () {
    return $(this).data("submission-id");
  });
  let target = submissionIDs.length === 1 ? "submission" : "submissions";

  ezQuery({
    title: "Correct Submissions",
    body: `Are you sure you want to mark ${submissionIDs.length} ${target} correct?`,
    success: function () {
      const reqs = [];
      for (var subId of submissionIDs) {
        let req = CTFd.fetch(`/api/v1/submissions/${subId}`, {
          method: "PATCH",
          credentials: "same-origin",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ type: "correct" }),
        });
        reqs.push(req);
      }
      Promise.all(reqs).then((_responses) => {
        window.location.reload();
      });
    },
  });
}

function showFlagsToggle(_event) {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has("full")) {
    urlParams.delete("full");
  } else {
    urlParams.set("full", "true");
  }
  window.location.href = `${window.location.pathname}?${urlParams.toString()}`;
}

function showFlag(event) {
  let target = $(event.currentTarget);
  let eye = target.find("i");
  let flag = target.parent().find("pre");
  if (!flag.hasClass("full-flag")) {
    flag.text(flag.attr("title"));
    flag.addClass("full-flag");
    eye.addClass("fa-eye-slash");
    eye.removeClass("fa-eye");
  } else {
    flag.text(flag.attr("title").substring(0, 42) + "...");
    flag.removeClass("full-flag");
    eye.addClass("fa-eye");
    eye.removeClass("fa-eye-slash");
  }
}

function copyFlag(event) {
  let target = $(event.currentTarget);
  let flag = target.parent().find("pre");
  let text = flag.attr("title");
  navigator.clipboard.writeText(text);

  $(event.currentTarget).tooltip({
    title: "Copied!",
    trigger: "manual",
  });
  $(event.currentTarget).tooltip("show");

  setTimeout(function () {
    $(event.currentTarget).tooltip("hide");
  }, 1500);
}

$(() => {
  $("#show-full-flags-button").click(showFlagsToggle);
  $("#show-short-flags-button").click(showFlagsToggle);
  $(".show-flag").click(showFlag);
  $(".copy-flag").click(copyFlag);
  $("#correct-flags-button").click(correctSubmissions);
  $(".delete-correct-submission").click(deleteCorrectSubmission);
  $("#submission-delete-button").click(deleteSelectedSubmissions);
});
let elements = document.getElementsByClassName("imageContainer");
for (let i = 0; i < elements.length; i++) {
  showProvided(elements[i]);
}
