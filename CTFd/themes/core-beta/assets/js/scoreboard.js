import Alpine from "alpinejs";
import CTFd from "./index";
import { getOption, getTenLast } from "./utils/graphs/echarts/scoreboard";
import { embed } from "./utils/graphs/echarts";
import * as echarts from 'echarts';
import { ezAlert } from "./compat/ezq";
import { default as helpers } from "./compat/helpers";

window.Alpine = Alpine;
window.CTFd = CTFd;
window.ScoreboardDetail = 0;
window.standings = 0;
window.scoreboardListLoaded = false;
window.allImages = [];
window.maxCount = 0;
window.maxCountIncrease = 3;
window.imageInit = false;

Alpine.data("ScoreboardDetail", () => ({
  data: {},
  show: true,
  
  async init() {
    window.standings = await CTFd.pages.scoreboard.getScoreboard();
    window.ScoreboardDetail = await CTFd.pages.scoreboard.getScoreboardDetail(window.standings.length)
    console.log(window.ScoreboardDetail);
    console.log(window.standings);
    let option = getOption(CTFd.config.userMode, window.standings);
    var chartDom = document.getElementById('score-graph');
    embed(chartDom, option);
    
    this.show = window.standings.length > 0;
    
  },
}));

Alpine.data("ScoreboardList", () => ({
  standings: [],
  brackets: [],
  activeBracket: null,

  async init() {

    //let responseChallengesMedia22 = CTFd.fetch(`/api/v1/medias`, {
      //method: "GET",
    //});

    //const bodyChallengesMedia2 = (await responseChallengesMedia22).json();
    //console.log(bodyChallengesMedia2);

    let responseBrackets = await CTFd.fetch(`/api/v1/brackets?type=${CTFd.config.userMode}`, {
      method: "GET",
    });
    const bodyBrackets = await responseBrackets.json();
    this.brackets = bodyBrackets["data"];
    

    let responseChallenges= await CTFd.fetch(`/api/v1/challenges`, {
      method: "GET",

    });
    const bodyChallenges = await responseChallenges.json();
    console.log(bodyChallenges);
  
    let ChallengeIdToChallengeName = {}
    for (let i = 0; i < bodyChallenges["data"].length; i++){
      ChallengeIdToChallengeName[bodyChallenges["data"][i]["id"]] = bodyChallenges["data"][i]["name"];
    }
   
    let last = getTenLast(window.ScoreboardDetail, window.standings, ChallengeIdToChallengeName);
    for (let i = 0; i < last.length; i++){
      this.standings[i] = last[i];
    }
    
  },
}));





Alpine.data("LogImage", () => ({
  
  async init() {
    window.allImages.push(this.id);

    if (window.allImages.length > window.maxCount){
      document.getElementById(this.id).hidden = true
    }
    
    if (window.allImages.length == window.maxCountIncrease){
      if (!window.imageInit){

        window.imageInit = true;
        self.show10More();
      }
      
      
      
    }
  },
}));

this.show10More = async function(e){
  let imageToPull = [];
  for (let i = window.maxCount; i < window.maxCount+window.maxCountIncrease; i++){
    if (window.allImages[i]){
      imageToPull.push(window.allImages[i]);
      document.getElementById(window.allImages[i]).hidden = false;
    }
    
  }
  
  let responseChallengesMedia= await CTFd.fetch(`/api/v1/teams?ids=`+JSON.stringify(imageToPull), {
    method: "GET",
  });
  const bodyChallengesMedia = await responseChallengesMedia.json();
  console.log(bodyChallengesMedia);
  for (let i = 0; i < window.maxCountIncrease; i++){
    if (window.allImages[i+window.maxCount]){
      let img = document.createElement("img");
      let provied = bodyChallengesMedia["data"][i]["provided"];
      let src ="data:text/plain;base64," + atob(JSON.parse(provied)[0]);
  
      
      if (src.length < 5000){
        document.getElementById(window.allImages[i+window.maxCount]).querySelector("#img").hidden = true;
      }
      else{
        document.getElementById(window.allImages[i+window.maxCount]).querySelector("#img").src = src;
        document.getElementById(window.allImages[i+window.maxCount]).onclick = showLargeSubmissions;
        document.getElementById(window.allImages[i+window.maxCount]).querySelector("#img").value = provied;
      }
    }
    

  }
  window.maxCount += window.maxCountIncrease;
  if (window.allImages.length <= window.maxCount){
    e.srcElement.disabled = true;
  }
};

this.showLargeSubmissions = function(_event) {
  
  let element = _event.srcElement.parentElement.tagName == "TR" ? _event.srcElement.parentElement: _event.srcElement.parentElement.parentElement;
  let images = JSON.parse(element.querySelector("#img").value);

  window.carouselPosition = 0;
  window.carouselMax = images.length;
  let imagesHTML =
    "<section class='slider-wrapper' ><img src onerror='reloadCarousel(this.parentElement);'><button class='slide-arrow slide-arrow-prev' id='slide-arrow-prev' onclick='downCarousel(this)' style='display:block;position:absolute;top:50%;'>&#8249;</button><button style='position:absolute;top:50%;left:95%' class='slide-arrow slide-arrow-next' id='slide-arrow-next' onclick='upCarousel(this)'>&#8250;</button><ul class='slides-container' style:'list-style: none;' id='slides-container'>";
  for (let i = 0; i < images.length; i++) {
    imagesHTML +=
      `<li class="slide ` +
      i +
      "slide" +
      `"><img style="" src="` +
      "data:text/plain;base64," +
      atob(images[i]) +
      `" style="width: 100%;" height="auto"></li>`;
  }
  imagesHTML += "</ul></section>";

  ezAlert({
    title: "Visioneurs",
    body:imagesHTML,
    button: "retour",
    ids: element.id,
  }, helpers, CTFd.user);
}

window.upCarousel = function (self) {
  window.carouselPosition += 1;
  if (window.carouselPosition != window.carouselMax - 1) {
    window.reloadCarousel(self.parentElement);
    self.parentElement.getElementsByClassName("slide-arrow-prev")[0].disabled =
      false;
  } else {
    window.reloadCarousel(self.parentElement);
    self.parentElement.getElementsByClassName("slide-arrow-next")[0].disabled =
      true;
    self.parentElement.getElementsByClassName("slide-arrow-prev")[0].disabled =
      false;
  }
};
window.downCarousel = function (self) {
  window.carouselPosition -= 1;

  if (window.carouselPosition != 0) {
    window.reloadCarousel(self.parentElement);
    self.parentElement.getElementsByClassName("slide-arrow-next")[0].disabled =
      false;
  } else {
    window.reloadCarousel(self.parentElement);
    self.parentElement.getElementsByClassName("slide-arrow-prev")[0].disabled =
      true;
    self.parentElement.getElementsByClassName("slide-arrow-next")[0].disabled =
      false;
  }
};
window.reloadCarousel = function (element) {
  if (window.carouselPosition == 0) {
    element.getElementsByClassName("slide-arrow-prev")[0].disabled = true;
  }
  if (window.carouselMax == 1) {
    element.getElementsByClassName("slide-arrow-next")[0].disabled = true;
  }
  for (let i = 0; i < window.carouselMax; i++) {
    if (i == window.carouselPosition) {
      element.getElementsByClassName(i + "slide")[0].hidden = false;
    } else {
      element.getElementsByClassName(i + "slide")[0].hidden = true;
    }
  }
};

Alpine.start();
