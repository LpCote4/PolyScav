import Alpine from "alpinejs";
import CTFd from "./index";
import { trier, getTenLast } from "./utils/graphs/echarts/scoreboard";
import { embed } from "./utils/graphs/echarts";
import * as echarts from 'echarts';
import { ezAlert } from "./compat/ezq";
import { default as helpers } from "./compat/helpers";
import { left, offset } from "@popperjs/core";

window.Alpine = Alpine;
window.CTFd = CTFd;
window.ScoreboardDetail = 0;
window.standings = 0;
window.nbStandings = 0;
window.scoreboardListLoaded = false;
window.allImages = [];
window.allSubmited = [];
//start at 0 cause we call increasing methodes on start so maxCountIncrease also = starting value
window.maxCount = 0;
window.maxCountIncrease = 5;
window.imageInit = false;
window.theninit = 0;
window.decalage = 0;
window.laoded = 0;
window.canShowMore = true;

window.splashPosition = {1:[["-55px","0","-30px","0px"],["0px","-50px","50%","0px"],["","-50px","0px","0px"]],
  2:[["-50px","0px","35%","0"],["","-10px","60%","0px"],["-40px","","-35px","0px"]],
  3:[["-45px","0px","65%","0"],["","-30px","60%","0px"],["15%","","-35px","0px"]],
  4:[["-40px","0px","-10%","0"],["","-40px","60%","0"],["-40px","","-35px","0px"]],
  5:[["-40px","0px","-10%","0"],["","-30px","60%","0"],["","-30px","-25px","0px"]],
  6:[["-0px","0px","-30%","0"],["","40px","60%","0"],["","-30px","-30px","0px"]],}


window.scoreboardSplashPosition = {
  1:["95px","","","105px"],
  2:["110px","","","50px"],
  3:["85px","","-195px",""],
  4:["130px","","","190px"],
  5:["90px","","","290px"],
}

Alpine.data("ScoreboardDetail", () => ({
  data: {},
  rankings: [],
  top:{},
  show: true,
  
  async init() {
    window.standings = await CTFd.pages.scoreboard.getScoreboard();
    window.ScoreboardDetail = await CTFd.pages.scoreboard.getScoreboardDetail(window.standings.length)
    


    var chartDom = document.getElementById('score-graph');

    this.rankings = trier(window.standings);
   
    this.top = this.rankings[0];
    

    
    this.show = window.standings.length > 0;

  },
}));

this.loserSplash = function(e, index){
  if (e.value != "laoded"){
    //splash spetial pour le dernier
    e.parentElement.style.position = "abosolute";
    if (window.standings.length -1 == index){
      e.src = "/themes/core/static/img/splash"+1+".png";
      e.parentElement.style.top = "125px";
      e.parentElement.style.right = "75%";
    }
    else {
      e.src = "/themes/core/static/img/splash"+((index%5)+1)+".png";
      let position = window.scoreboardSplashPosition[((index%5)+1)];
      e.parentElement.style.top = position[0];
      e.parentElement.style.left = position[2];
      e.parentElement.style.right = position[3];
      
    }
    
    e.value = "laoded";
    
  }
 
  
}

Alpine.data("ScoreboardList", () => ({
  standings: [],
  brackets: [],
  activeBracket: null,
    
    async init() {
      //We are wating for those value to be loaded so we dont have to load them twice
        if (window.standings.length != 0){
          let responseBrackets = await CTFd.fetch(`/api/v1/brackets?type=${CTFd.config.userMode}`, {
            method: "GET",
          });
          const bodyBrackets = await responseBrackets.json();
          this.brackets = bodyBrackets["data"];
          
  
          let responseChallenges= await CTFd.fetch(`/api/v1/challenges`, {
            method: "GET",
  
          });
          const bodyChallenges = await responseChallenges.json();
  
          
          let ChallengeIdToChallengeName = {}
          for (let i = 0; i < bodyChallenges["data"].length; i++){
            ChallengeIdToChallengeName[bodyChallenges["data"][i]["id"]] = bodyChallenges["data"][i]["name"];
          }
          if (window.ScoreboardDetail == 0 || window.standings == 0){
            this.init();
          }
          else {
            let last = getTenLast(window.ScoreboardDetail, window.standings, ChallengeIdToChallengeName);
            for (let i = 0; i < last.length; i++){
              if (!last[i].provided){
                last[i].provided = last[i].date;
              }
              this.standings[i] = last[i];

              //vue que on utilise leurs provided faire sure que il est unique si il est vide
              
            }
          }
          window.nbStandings = this.standings.length;
          
        }
     
      
    
    
    
    
  },
}));





Alpine.data("LogImage", () => ({
  
  async init() {
    let notAMedia = false;
    let id = 0;
  
    try{
      id = JSON.parse(this.id)[0]["id"];
      window.allImages.push(id);
      window.allSubmited.push(id);
    }
    catch (error){
      notAMedia = true;
      let toshow = ""
      if (this.id == "Media en train d'être traité"){
        toshow = "Media en train d'être traité"
      }
      id = toshow + "%" + String(Math.random()*100000000000000000);
      window.allSubmited.push(id);
    }

      
    if (window.allSubmited.length > window.maxCount){
      
      let obj = document.getElementById(this.id);
      if (this.type == "manual" || this.type == "manualRecursive"|| this.type == "flash"){
        obj.className += "inSubmission";
      }
      if (!notAMedia){
        obj.text = this.challenge_id;
      }
      try{
        obj.id = id;
        
        obj.hidden = true
      }
      catch (error){
        this.id = id;
   
      }
    }

    
    if (window.allSubmited.length == window.maxCountIncrease || window.allSubmited.length == window.nbStandings){
      if (!window.imageInit){
        if (window.allSubmited.length != 0){
          window.imageInit = true;
          self.showXMore();
        }
        
      }
      
      
      
    }
    
    
    
  },
}));


this.showXMore = async function(e){
  
  let imageToPull = [];


  for (let i = window.maxCount; i < window.maxCount+window.maxCountIncrease; i++){

    try{
      if (i < window.allSubmited.length){
        
        if (!(window.allSubmited[i]).toString().includes("%")){
        
          imageToPull.push(window.allImages[i - window.decalage]);
        }
        else {
          
          document.getElementById(window.allSubmited[i]).getElementsByClassName("header")[1].style.height = "100px";
          document.getElementById(window.allSubmited[i]).getElementsByClassName("header")[1].style.width = "186px";
          
          let rotation = ((Math.random() > 0.50 ? -1:1)*(Math.random()*6));
          document.getElementById(window.allSubmited[i])["style"]["transform"] += "rotate("+rotation+"deg)";
          let splashes = document.getElementById(window.allSubmited[i]).getElementsByClassName("splash")
          let positions = window.splashPosition[Math.floor(Math.random()*6)+1]
          for (let i = 0; i < splashes.length; i++){
            let position = positions[i];
            let splash = splashes[i];
            
            splash.firstChild.style.top = position[0];
            splash.firstChild.style.bottom = position[1];
            splash.firstChild.style.left =position[2];
            splash.firstChild.style.right =position[3];
            splash.firstChild.src = "/themes/core/static/img/splash"+(Math.floor(Math.random()*5)+1)+".png"
            
          }
          window.laoded +=1;
          window.decalage++;
          
          
         
        }
        document.getElementById(window.allSubmited[i]).hidden = false;
      }
    }
    catch(error){
    }
    
  }

  let responseChallengesMedia= await CTFd.fetch(`/api/v1/teams?ids=`+JSON.stringify(imageToPull), {
    method: "GET",
  });
  
  const bodyChallengesMedia = await responseChallengesMedia.json();

  
  for (let i = 0; i < window.maxCountIncrease; i++){
    
    try{
      if (i < imageToPull.length){
        let provide = bodyChallengesMedia["data"][i]["provided"];
        let element = document.getElementById(imageToPull[i]);
    
        let mediaContents = false;
        try {
          mediaContents = JSON.parse(provide);
        } catch {}
        //si media content est defis c que le provied est des photos/video
        //sinon c autre chose genre du texte
      
        if (mediaContents) {
          
          let thumbsnailAvailable = false;
          let videoContent = false;
          for (let i = 0; i < mediaContents.length; i++) {
            if (mediaContents[i]["type"] == "video/webm"){
              videoContent = true;
            }
          }
          for (let i = 0; i < mediaContents.length; i++) {
            if (mediaContents[i]["type"] == "thumbsnail") {
              thumbsnailAvailable = true;
              let thumbsnail = createMediaElement(mediaContents[i]);
             
              thumbsnail.style["max-width"] = "100%";
              thumbsnail.style["display"]= "block";
              thumbsnail.style["height"] = "auto";
              
              thumbsnail.onload = function(thumbsnail){stylingImage(thumbsnail, mediaContents.length)};
              
              if (element.getElementsByClassName("imageContainer")[0].value != true){
                if (videoContent){
                  element.getElementsByClassName("imageContainer")[0].innerHTML += `<svg class="video-icon"
                  style="position: absolute;z-index: 10;top: -5%;left: -0%;pointer-events: none;"
                    width="200"
                    height="200"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M15 12.3301L9 16.6603L9 8L15 12.3301Z" fill="#212529" />
               
                  </svg>`;
                }
                
                
                
                element.getElementsByClassName("imageContainer")[0].appendChild(thumbsnail);
                console.log(thumbsnail.className);
                element.getElementsByClassName("imageContainer")[0].value = true;
              }
              
              
              
              element.getElementsByClassName("imageContainer")[0].onclick = showLargeSubmissions;
              
              element.value = provide;
            }
            
          }
          if (!thumbsnailAvailable) {
            let text = document.createElement("p");
            text.textContent = "No thumbsnail Available for the current media";
            element.getElementsByClassName("imageContainer")[0].appendChild(text);
            
          }
          
        }
        
      }
    }
    catch(error){}    
          //document.getElementById(window.allImages[i+window.maxCount]).onclick = showLargeSubmissions;
          
          
  }
  
  
  window.maxCount += window.maxCountIncrease;
  
  if (window.laoded == window.allSubmited.length || window.laoded == window.maxCount  ){
    drawLines();
  }

  if (window.allSubmited.length <= window.maxCount){
    document.getElementById("plus-btn").disabled = true;
    
  }

  let elements = document.getElementsByClassName("award-icon");
  for(let i = 0; i < elements.length; i++){
  
    if(!elements[i].parentElement.getElementsByClassName("challenge_name")[0].textContent){
      elements[i].hidden = false;
      elements[i].parentElement.getElementsByClassName("challenge_name")[0].hidden = true;
    }
    
  }  
  
};
this.stylingImage = function(event, mediaContentsLength) {
  const img = event.target;

  if (img.naturalWidth > img.naturalHeight) {
    img.classList.add('landscape');
    img.parentElement.classList.add('landscape-td');
    img.parentElement.parentElement.parentElement.classList.add('landscape-td');
    
  } else {
    img.classList.add('portrait');
    img.parentElement.classList.add('portrait-td');
    img.parentElement.parentElement.parentElement.classList.add('portrait-td');
    
  }

  
  let rotation = ((Math.random() > 0.50 ? -1:1)*(Math.random()*6));
  img.parentElement.parentElement.parentElement["style"]["transform"] += "rotate("+rotation+"deg)";
  let splashes = img.parentElement.parentElement.parentElement.getElementsByClassName("splash")
  let positions = window.splashPosition[Math.floor(Math.random()*6)+1]
  for (let i = 0; i < splashes.length; i++){
    let position = positions[i];
    let splash = splashes[i];
    
    splash.firstChild.style.top = position[0];
    splash.firstChild.style.bottom = position[1];
    splash.firstChild.style.left =position[2];
    splash.firstChild.style.right =position[3];
    splash.firstChild.src = "/themes/core/static/img/splash"+(Math.floor(Math.random()*5)+1)+".png"
    
  }

  window.laoded +=1;
  
  if (window.laoded == window.allSubmited.length || window.laoded == window.maxCount ){
    drawLines();
  }
  if (img.className == "portrait"){
    img.parentElement.parentElement.getElementsByClassName("video-icon")[0].style.top =  "15%";
    img.parentElement.parentElement.getElementsByClassName("video-icon")[0].style.left =  "-2.5%";
  }
  console.log();
  img.parentElement.parentElement.getElementsByClassName("imageContainer")[0].innerHTML += `<i class='fa fa-image `+ (img.className == "portrait"? "portrait-icon":"")+`' style="position: absolute;color: #212529;z-index: 50;top:70%;left: 5%;-webkit-text-stroke-width: 0.25px;
  -webkit-text-stroke-color: white;"></i><p class='`+ (img.className == "portrait"? "portrait-text":"")+`' style="position: absolute;color: #212529;z-index: 50;top:68.5%;left: 15%;-webkit-text-stroke-width: 0.25px;
  -webkit-text-stroke-color: white;"">`+(mediaContentsLength-1)+`</p>`;
  
  
  

}
this.drawLines = function(){
  var bodyRect = document.body.getBoundingClientRect();
  let nb =  window.maxCount-window.maxCountIncrease;

  //le dernier element a pas de lien et defois lorsque sa ajoute plus le dernier vas bouger un peut donc on refais l'avant dernier et le sien
  for (let i = (nb == 0)? nb : nb-2; i < window.laoded-1; i++){
    
    var canvas =  document.getElementsByClassName("lineCanvas")[i];
    canvas.hidden = false;
    try{
      let element = document.getElementsByClassName("lineStart")[i];
      
      
        let nextElement = document.getElementsByClassName("lineStart")[i+1];
  
        //obtient la position de notre elements et du suivants
        let elementRect = element.getBoundingClientRect();
        let nextElementRect = nextElement.getBoundingClientRect();
    
        var canvas =  document.getElementsByClassName("lineCanvas")[i];
        
        //set the z-index propely
    
        //canvas.parentElement.parentElement.parentElement.style["z-index"] = window.laoded-i;
      
    
    
        //le mettre droit so il a pas le meme angle que le frame
        let rotationCommands = canvas.parentElement.parentElement.parentElement["style"]["transform"];
        let deg =  parseFloat(rotationCommands.split("rotate(")[1].split("deg")[0]);
        
        canvas["style"]["transform"] = "rotate("+(-deg)+"deg)"
        canvas.style.left = (nextElementRect["left"] < elementRect["left"] ? nextElementRect["left"]-elementRect["left"]:0)+"px";
        //creer la taile sur mesure pour que on puisse se rendre a l'element suivant
        console.log(nextElement);
        let canvasRect = canvas.getBoundingClientRect();
        
        console.log(nextElementRect["left"]);
        canvas.width = (nextElementRect["left"] - canvasRect["left"])+Math.abs(elementRect.left-canvasRect.left)+element.offsetHeight/2;
        canvas.height = (nextElementRect["top"] - canvasRect["top"])+Math.abs(elementRect.top-canvasRect.top)+element.offsetWidth/2;
        
        let start = {"x":elementRect.left-canvasRect.left+element.offsetWidth/2, "y":elementRect.top-canvasRect.top+(element.offsetHeight/2)}
        let mouvement = {"x":nextElementRect.left-canvasRect.left+(nextElementRect["left"] < elementRect["left"]?element.offsetWidth:0), "y":nextElementRect.top-canvasRect.top+(nextElement.offsetHeight/4)}
        
        //on dessine la ligne
        var ctx=canvas.getContext("2d");
        var grad= ctx.createLinearGradient(start["x"],start["y"], mouvement["x"],canvas.height);
  
        grad.addColorStop(0, element["value"]);
        grad.addColorStop(1, nextElement["value"]);
        ctx.setLineDash([40, 20]);
        ctx.strokeStyle = grad;
   
        ctx.beginPath(); 
        ctx.lineWidth="7";
        ctx.moveTo(start["x"],start["y"]);
        ctx.lineTo(mouvement["x"],mouvement["y"]);
        ctx.stroke();
        
      
      
    }
    catch (e){
      //sinon le dernier canvas vas full depasser de lecran si il est a droite
      canvas.style.width ="0px"
     
      console.log(e)
    }
    
    
  }
  var canvas =  document.getElementsByClassName("lineCanvas")[window.laoded-1];
  canvas.hidden =true;
  
}

this.createMediaElement = function(mediaContent) {

  let htmlElement;
  if (mediaContent["type"] == "video/webm") {
    htmlElement = document.createElement("video");
    htmlElement.controls = true;
    htmlElement.type = "video/webm";
    
    htmlElement.poster = ""
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

this.showLargeSubmissions = function(_event) {
  window.carouselPosition = 0;
  let mediaContents;
  let element;

  try {
    mediaContents = JSON.parse(_event.srcElement.parentElement.parentElement.value);
    element = _event.srcElement.parentElement.parentElement;
  } catch {
    mediaContents = JSON.parse(_event.srcElement.parentElement.parentElement.parentElement.value);
    element = _event.srcElement.parentElement.parentElement.parentElement;
  }
  console.log(mediaContents);
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
  imagesHTML += "<img src onerror='reloadCarousel(this.parentElement);'></img>"
  imagesHTML += "<button class='btn btn-primary carousel__navigation-button slide-arrow-prev' id='slide-arrow-prev' onclick='downCarousel(this)' style='display:block;position:absolute;top:40%;left:1rem;'>" +
    `<svg viewBox="0 0 100 100"><path d="M 50,0 L 60,10 L 20,50 L 60,90 L 50,100 L 0,50 Z" class="arrow" fill="white" transform="translate(15,0) rotate(0)"></path></svg>` +
    "</button>";
  imagesHTML += "<button style='position:absolute;top:40%;right:1rem;' class='btn btn-primary carousel__navigation-button slide-arrow-next' id='slide-arrow-next' onclick='upCarousel(this)'>" +
  `<svg viewBox="0 0 100 100"><path d="M 50,0 L 60,10 L 20,50 L 60,90 L 50,100 L 0,50 Z" class="arrow" fill="white" transform="translate(85,100) rotate(180)"></path></svg>` +
  "</button>";

  ezAlert({
      title: "Visioneurs",
      body:imagesHTML,
      button: "retour",
      challenge_id: element.text,
      ids: element.id,
      additionalClassMain: "FullSizeCarousel",
  }, helpers, CTFd.user);
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


Alpine.start();


