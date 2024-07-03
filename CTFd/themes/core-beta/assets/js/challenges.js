import Alpine from "alpinejs";
import dayjs from "dayjs";

import CTFd from "./index";

import CommentBox from "./components/comments/CommentBox.vue";
import Vue from "vue";
import { Modal, Tab, Tooltip } from "bootstrap";
import highlight from "./theme/highlight";
import favicon from ".";
import { default as helpers } from "./compat/helpers";
import { el } from "lolight";

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
    this.solves.forEach(solve => {
      solve.date = dayjs(solve.date).format("MMMM Do, h:mm:ss A");
      return solve;
    });
    new Tab(this.$el).show();
  },

  async showComments() {
    const commentBox = Vue.extend(CommentBox);
    let vueContainer = document.createElement("div");
    document.querySelector("#comment-box").removeChild(document.querySelector("#comment-box").firstChild)
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

  async submitManualChallenge(type) {
    //dans le cas ou le user envoit des fichier
   
    if (!document.getElementById("file-input").hidden){
      let form = document.getElementById("form-file-input");
      document.getElementById("form-file-input").value = this;
      var formData = new FormData(form);
      // output as an object
      
      if (Object.fromEntries(formData)["file"].name != ""){
        
        try {
          await helpers.files.upload(form, {"id":this.id, "type":type}, async function (response) {
            let thiis = document.getElementById("form-file-input").value;
            
            thiis.$dispatch("load-challenges");
            // try {
            //   thiis.response = await CTFd.pages.challenge.submitChallenge(
            //     thiis.id,
            //       JSON.stringify(response.data),
            //   );
              
            //   if (thiis.response.success){
            //     if (thiis.response.data.status == "already_solved"){
            //       thiis.response.data.status = "already_solved";
            //       thiis.response.data.message = "already sent!";
            //     }
            //     else{
            //       thiis.response.data.status = "correct";
            //       thiis.response.data.message = "succesfuly send!";
            //     }
                
            //   }
            //   else {
            //     thiis.response.data.status = "incorrect";
            //     thiis.response.data.message = "en error happen pls contact the admin";
            //   }
        
            //   thiis.$dispatch("load-challenges");
            //   console.log(JSON.stringify(response.data));
            // }
            // catch (error){
            //   thiis.response = {};
            //   thiis.response.data = {};
            //   thiis.response.data.status = "incorrect";
            //   thiis.response.data.message = "en error happen pls contact the admin for "+error;
            //   thiis.$dispatch("load-challenges");
            // }
            // document.getElementById("challenge-submit").disabled = false;
            // document.getElementById('spinner').hidden = true;
            
            
          });
        }
        catch (error){
            this.response = {};
            this.response.data = {};
            this.response.data.status = "incorrect";
            this.response.data.message = "en error happen pls contact the admin for "+error;
            this.$dispatch("load-challenges");
            document.getElementById("challenge-submit").disabled = false;
            document.getElementById('spinner').hidden = true;
          }
      }
      else{
        alert("You're currently trying to send nothing.");
      }
     
    }
    //dans le cas ou le user envoit du text
    else{
      if (document.getElementById("text-input").value != ""){
        this.response = await CTFd.pages.challenge.submitChallenge(
          this.id,
          document.getElementById("text-input").value,
        );
        if (this.response.success){
          
          this.response.data.status = "correct";
          this.response.data.message = "succesfuly send!";
        }
        else {
          this.response.data.status = "incorrect";
          this.response.data.message = "en error happen pls contact the admin";
        }
  
        this.$dispatch("load-challenges");
        
      }
      else {
        alert("You're currently trying to send nothing.");
      }
      document.getElementById('spinner').hidden = true;
    
    }
    document.getElementById("file-input").textContent = "Selectioner un fichier";
    document.getElementById("text-input").value = "";
    
    
   

  
    
    

    //this.response = await this.mediaResponse.json();

    //if (this.response.success){
    //  
    //);
    //  
    //
    //}
    
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

this.hit = function(){
  let fileInput = document.getElementById("file-input");
  let textInput = document.getElementById("text-input");
  let fileInputFa = document.getElementById("file-input-fa");
  let textInputFa = document.getElementById("text-input-fa");

  if (textInput.hidden){
    fileInput.hidden = true;
    textInput.hidden = false;
    fileInputFa.hidden = false;
    textInputFa.hidden = true;
  }
  else{
    fileInput.hidden = false;
    textInput.hidden = true;
    fileInputFa.hidden = true;
    textInputFa.hidden = false;
  }
}

this.changeLabel = function(event){
  let output = event.target.files.length + " folder(s) uploded";
  let totalSize = 0;
  let formats_video = [
    "hevc",
    "mp4",
    "avi",
    "mkv",
    "mov",
    "MOV",
    "wmv",
    "flv",
    "webm",
    "mpeg",
    "3gp",
    "ogv"
    ]
    let formats_image = [
    "jpeg",
    "png",
    "gif",
    "bmp",
    "tiff",
    "svg",
    "webp",
    "raw",
    "heic",
    "ico",
    "jpg"
    ]
  
  for (let i = 0; i < event.target.files.length; i++){
    let extension = event.target.files[i].name.split(".")[1];
    console.log(event.target.files[i]);
    totalSize += event.target.files[i].size;
    if (!formats_video.includes(extension.toLowerCase()) && !formats_image.includes(extension.toLowerCase())){
      alert("We can not garented ." + extension + " will be supported")
    }

  }
  if (totalSize > 100000000 && totalSize < 200000000){
    alert("The folders you're trying to upload are bigger than 100MB and will be further compressed to reduce their size even more. This may impact the quality and the upload time by a lot!. FolderSize: "+totalSize/1000000 + "MB" );
  }
  else if (totalSize > 200000000){
    alert("File can't be bigger than 200MB, even with compression. Please use external tools and share it with a link");
  }
  if (event.target.files.length > 20){
    alert("We know you have a lot to flex, but you cannot upload more than 20 files at a time.");
    output = "";
    event.target.value = '' ;
    document.getElementById("file-input").textContent = output;
  }
  document.getElementById("file-input").textContent = output;
}