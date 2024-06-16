import Alpine from "alpinejs";
import dayjs from "dayjs";

import CTFd from "./index";

import CommentBox from "./components/comments/CommentBox.vue";
import Vue from "vue";
import { Modal, Tab, Tooltip } from "bootstrap";
import highlight from "./theme/highlight";
import favicon from ".";
import { default as helpers } from "./compat/helpers";

window.values = [];
window.TEAM_ID = CTFd.team.id;
window.USER_ID = CTFd.user.id;
function addTargetBlank(html) {
  let dom = new DOMParser();
  let view = dom.parseFromString(html, "text/html");
  let links = view.querySelectorAll('a[href*="://"]');
  links.forEach(link => {
    link.setAttribute("target", "_blank");
  });
  return view.documentElement.outerHTML;
}

window.Alpine = Alpine;

Alpine.store("challenge", {
  data: {
    view: "",
  },
});

Alpine.data("Hint", () => ({
  id: null,
  html: null,

  async showHint(event) {
    if (event.target.open) {
      let response = await CTFd.pages.challenge.loadHint(this.id);
      let hint = response.data;
      if (hint.content) {
        this.html = addTargetBlank(hint.html);
      } else {
        let answer = await CTFd.pages.challenge.displayUnlock(this.id);
        if (answer) {
          let unlock = await CTFd.pages.challenge.loadUnlock(this.id);

          if (unlock.success) {
            let response = await CTFd.pages.challenge.loadHint(this.id);
            let hint = response.data;
            this.html = addTargetBlank(hint.html);
          } else {
            event.target.open = false;
            CTFd._functions.challenge.displayUnlockError(unlock);
          }
        } else {
          event.target.open = false;
        }
      }
    }
  },
}));

Alpine.data("Challenge", () => ({
  id: null,
  next_id: null,
  submission: "",
  tab: null,
  solves: [],
  response: null,
  share_url: null,

  async init() {
    highlight();
  },

  getStyles() {
    let styles = {
      "modal-dialog": true,
    };
    try {
      let size = CTFd.config.themeSettings.challenge_window_size;
      switch (size) {
        case "sm":
          styles["modal-sm"] = true;
          break;
        case "lg":
          styles["modal-lg"] = true;
          break;
        case "xl":
          styles["modal-xl"] = true;
          break;
        default:
          break;
      }
    } catch (error) {
      // Ignore errors with challenge window size
      console.log("Error processing challenge_window_size");
      console.log(error);
    }
    return styles;
  },

  async init() {
    highlight();
  },

  async showChallenge() {
    new Tab(this.$el).show();
  },

  async showSolves() {
    this.solves = await CTFd.pages.challenge.loadSolves(this.id);
    console.log(this.solves)
    this.solves.forEach(solve => {
      solve.date = dayjs(solve.date).format("MMMM Do, h:mm:ss A");
      return solve;
    });
    new Tab(this.$el).show();
  },

  async showComments() {
    const commentBox = Vue.extend(CommentBox);
    let vueContainer = document.createElement("div");
    console.log(window);
    document.querySelector("#comment-box").appendChild(vueContainer);
    new commentBox({
      propsData: { type: "team", id: window.TEAM_ID, challenge_id: this.id },
    }).$mount(vueContainer);
    new Tab(this.$el).show();
  },

  getNextId() {
    let data = Alpine.store("challenge").data;
    return data.next_id;
  },

  async nextChallenge() {
    let modal = Modal.getOrCreateInstance("[x-ref='challengeWindow']");

    // TODO: Get rid of this private attribute access
    // See https://github.com/twbs/bootstrap/issues/31266
    modal._element.addEventListener(
      "hidden.bs.modal",
      event => {
        // Dispatch load-challenge event to call loadChallenge in the ChallengeBoard
        Alpine.nextTick(() => {
          this.$dispatch("load-challenge", this.getNextId());
        });
      },
      { once: true },
    );
    modal.hide();
  },

  async getShareUrl() {
    let body = {
      type: "solve",
      challenge_id: this.id,
    };
    const response = await CTFd.fetch("/api/v1/shares", {
      method: "POST",
      body: JSON.stringify(body),
    });
    const data = await response.json();
    const url = data["data"]["url"];
    this.share_url = url;
  },

  copyShareUrl() {
    navigator.clipboard.writeText(this.share_url);
    let t = Tooltip.getOrCreateInstance(this.$el);
    t.enable();
    t.show();
    setTimeout(() => {
      t.hide();
      t.disable();
    }, 2000);
  },


  async submitChallenge() {
    console.log(this.submission);
    this.response = await CTFd.pages.challenge.submitChallenge(
      this.id,
      this.submission,
    );
    
    await this.renderSubmissionResponse();
  },
  
  


  async renderSubmissionResponse() {
    if (this.response.data.status === "correct") {
      this.submission = "";
    }

    // Dispatch load-challenges event to call loadChallenges in the ChallengeBoard
    this.$dispatch("load-challenges");
  },

  async submitManualChallenge() {
    let form = document.getElementById("form-file-input");
    console.log(form);
    helpers.files.upload(form, {}, function (response) {
      const f = response.data[0];
      console.log(response);
    });
    //this.submission = JSON.parse(document.getElementById("challenge-input").value);
    //let vThumbsnail = "";
    //let vContent = this.submission;
    //for (let i = 0; i < this.submission.length; i++){
    //  if (this.submission[i]["thumbsnail"]){
    //    vThumbsnail = this.submission[i]["thumbsnail"];
    //    vContent.splice(i, 1);
    //  }
    //}

    //let body = {
    //  thumbsnail: vThumbsnail,
    //  content: JSON.stringify(vContent),
    //  user_id: window.USER_ID,
    //  team_id: window.TEAM_ID,
    //  challenge_id: this.id,
    //};
  
    
    //this.mediaResponse = await CTFd.fetch(`/api/v1/medias`, {
    //  method: "POST",
    //  body: JSON.stringify(body),
    //});

    //this.response = await this.mediaResponse.json();

    //if (this.response.success){
    //  this.mediaId = "#Media id:"+ this.response.data.id;
    //  this.response = await CTFd.pages.challenge.submitChallenge(
    //    this.id,
    //    this.mediaId,
    //);
    //  
    //
    //}
    //if (this.response.success){
    // this.response.data.status = "correct";
    //  this.response.data.message = "succesfuly send!";
    //}
    //this.$dispatch("load-challenges");
  },
  
 

  compressAnImage(blobURL, operation, type){
    const img = new Image();
    img.src = blobURL;
    img.onerror = function () {
      URL.revokeObjectURL(this.src);
      // Handle the failure properly
      console.log("Cannot load image");
    };
    img.onload = function () {
      URL.revokeObjectURL(this.src);
      const [newWidth, newHeight] = calculateSize(img, type =="thumbsnail" ? 50 : 400, type =="thumbsnail" ? 50 : 400);
      const canvas = document.createElement("canvas");
      canvas.width = newWidth;
      canvas.height = newHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, newWidth, newHeight);
      canvas.toBlob((blob) => operation(blob, type),"video/webm", 0.7);
      
    };
    function calculateSize(img, maxWidth, maxHeight) {
      let width = img.width;
      let height = img.height;
    
      // calculate the width and height, constraining the proportions
      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }
      return [width, height];
    };
  },
  operationImage(blob,typeI){
    var reader = new FileReader();
    
    reader.onloadend = function() {
      var data=(reader.result).split(',')[1];
      var binaryBlob = btoa(data);
      let object = {};
      
      object[String(typeI)] = binaryBlob;
      window.values.push(object);
      document.getElementById("challenge-input").value = JSON.stringify(window.values);
    }
    reader.readAsDataURL(blob);
  },
  operationVideo(blob, typeV){
    console.log(typeV);
    var reader = new FileReader();
   
    reader.onloadend = function() {
      var data=(reader.result).split(',')[1];
      var binaryBlob = btoa(data);
      let object = {};
      
      object[String(typeV)] = binaryBlob;
      window.values.push(object);
      document.getElementById("challenge-input").value = JSON.stringify(window.values);
    }
    reader.readAsDataURL(blob);
  },
  convertToBinary(data) {
    let binaryString = '';
    for (let i = 0; i < data.length; i += 4) {
        // Combine the RGBA values into a single number and convert to binary
        const rgba = (data[i] << 24) | (data[i + 1] << 16) | (data[i + 2] << 8) | data[i + 3];
        binaryString += rgba.toString(2).padStart(32, '0');
    }
    return binaryString;
  },
  generateAThumbsnail(blobUrl, operation){
    const video = document.createElement("video");
    const canvas = document.createElement("canvas");

    video.src = blobUrl;
    document.body.appendChild(canvas)
    video.play();
    video.addEventListener('loadeddata', () => {
      canvas.getContext('2d').drawImage(video, 0, 0, 50, 50);
      canvas.toBlob((blob) => operation(blob, "thumbsnail"),"image/png", 0.7);
      video.src = "";

  });
    
  },
  uploadFile(event){
    window.values = [];
    let hasThumbsnail = false;
    for (let i = 0; i < event.srcElement.files.length; i++){
      var file = event.srcElement.files[i];
      const blobURL = URL.createObjectURL(file);
      
      //au premier fichier on s'assusre que il s'agit d'une photo sinon on en creer une pour la video
      
      if (file.type.includes("image")){
        
        this.compressAnImage(blobURL, this.operationImage, "image");
        if (!hasThumbsnail) {this.compressAnImage(blobURL, this.operationImage,"thumbsnail");hasThumbsnail = true;}
      }
      else if (file.type.includes("video")){
        let blob = fetch(blobURL).then(r => r.blob());
        
        //peut pas juste utiliser la valeur file.type car la valeur change a chaque loop et que this.opvideo n'est pas executer en meme temps que le loop
        blob.then(e=>this.operationVideo(e, event.srcElement.files[i].type));
        if (!hasThumbsnail){this.generateAThumbsnail(blobURL, this.operationImage); hasThumbsnail = true;};
      }
    }

  },
}));

Alpine.data("ChallengeBoard", () => ({
  loaded: false,
  challenges: [],
  challenge: null,

  async init() {
   

    
    let args = {};
    args[`team_id`] = window.TEAM_ID;
    let apiArgs = args;
    apiArgs[`page`] = 1;
    apiArgs[`per_page`] = 10000;
    
    this.challenges = await CTFd.pages.challenges.getChallenges();
    let standings = await CTFd.pages.scoreboard.getScoreboard();
    let ScoreboardDetail = await CTFd.pages.scoreboard.getScoreboardDetail(standings.length)
    this.comments = await helpers.comments.get_comments(apiArgs);
    this.maxScore = 0;
    this.solveScore = 0;
    this.submitScore = 0;
    for (let challenge in this.challenges){
      let score = this.challenges[challenge].value
      if (this.challenges[challenge].solved_by_me){
        this.solveScore += score
      }
      else if (this.challenges[challenge].submited){
        this.submitScore += score
      }
      this.maxScore += score;
    }

    document.getElementById("scoreProgressTitle").textContent = (this.solveScore + this.submitScore) + " points";
    document.getElementById("scoreProgressBar").value = 100*((this.solveScore + this.submitScore)/this.maxScore)
    document.getElementById("scoreProgressText").textContent = ""+ parseInt(100*(this.submitScore/(this.solveScore + this.submitScore))) + "% des points en approbations"
    
    this.commentsChallengeDict = {};

    for (let i in this.comments.data){
      let message = this.comments.data[i].content
      if (message.search("#") != -1){
        message = message.split("#")[1];
        let fin = message.search(":");
        let id = 0;
        if (fin != -1) {id = parseInt(message.split(":")[0]);}
        else {id = parseInt(message.split(":")[0]);}
        
        if (this.commentsChallengeDict[id] != undefined){
          this.commentsChallengeDict[id] = this.commentsChallengeDict[id]+1;
        }
        else {
          this.commentsChallengeDict[id] = 1;
        }
      }
    }

    for (let i in this.commentsChallengeDict){
      document.getElementById(i+"a").className = "fas fa-comments float-end";
      document.getElementById(i).textContent = this.commentsChallengeDict[i] > 99 ? 99 : this.commentsChallengeDict[i];
     
    }

    this.loaded = true;
    
    if (window.location.hash) {
      let chalHash = decodeURIComponent(window.location.hash.substring(1));
      let idx = chalHash.lastIndexOf("-");
      if (idx >= 0) {
        let pieces = [chalHash.slice(0, idx), chalHash.slice(idx + 1)];
        let id = pieces[1];
        await this.loadChallenge(id);
      }
    }
  },
  getCategories() {
    
    
    
      
    
    const categories = [];
    
    
    this.challenges.forEach(challenge => {
      const { category } = challenge;

      if (!categories.includes(category)) {
        categories.push(category);
      }
    });

    try {
      const f = CTFd.config.themeSettings.challenge_category_order;
      if (f) {
        const getSort = new Function(`return (${f})`);
        categories.sort(getSort());
      }
    } catch (error) {
      // Ignore errors with theme category sorting
      console.log("Error running challenge_category_order function");
      console.log(error);
    }

    return categories;
  },
  getChallenges(category) {
    let challenges = this.challenges;
    
    
    if (category !== null) {
      challenges = this.challenges.filter(challenge => challenge.category === category);
    }

    try {
      const f = CTFd.config.themeSettings.challenge_order;
      if (f) {
        const getSort = new Function(`return (${f})`);
        challenges.sort(getSort());
      }
    } catch (error) {
      // Ignore errors with theme challenge sorting
      console.log("Error running challenge_order function");
      console.log(error);
    }

    return challenges;
  },

  async loadChallenges() {
    this.challenges = await CTFd.pages.challenges.getChallenges();
    console.log(this.comments);
    
    
  },

  async loadChallenge(challengeId) {
    
    await CTFd.pages.challenge.displayChallenge(challengeId, challenge => {
      challenge.data.view = addTargetBlank(challenge.data.view);
      Alpine.store("challenge").data = challenge.data;

      // nextTick is required here because we're working in a callback
      Alpine.nextTick(() => {
        let modal = Modal.getOrCreateInstance("[x-ref='challengeWindow']");
        // TODO: Get rid of this private attribute access
        // See https://github.com/twbs/bootstrap/issues/31266
        modal._element.addEventListener(
          "hidden.bs.modal",
          event => {
            // Remove location hash
            history.replaceState(null, null, " ");
          },
          { once: true },
        );
        modal.show();
        history.replaceState(null, null, `#${challenge.data.name}-${challengeId}`);
      });
    });
  },
}));

Alpine.start();


