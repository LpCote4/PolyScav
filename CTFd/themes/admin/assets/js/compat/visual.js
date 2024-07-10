import "../compat/json";
import "../compat/format";
import { ezAlert, ezQuery, ezBadge } from "../compat/ezq";

window.carouselPosition = 0;
window.carouselMax = 0;

export async function showProvided(element) {
  let provide = element.id;

  let mediaContents;
  try {
    mediaContents = JSON.parse(provide);
  } catch {}
  //si media content est defis c que le provied est des photos/video
  //sinon c autre chose genre du texte
  if (mediaContents) {
    let thumbsnailAvailable = false;
    for (let i = 0; i < mediaContents.length; i++) {
      if (mediaContents[i]["type"] == "thumbsnail") {
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
