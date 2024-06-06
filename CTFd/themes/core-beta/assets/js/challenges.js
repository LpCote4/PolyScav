import Alpine from "alpinejs";
import dayjs from "dayjs";

import CTFd from "./index";

import CommentBox from "./components/comments/CommentBox.vue";
import Vue from "vue";
import { Modal, Tab, Tooltip } from "bootstrap";
import highlight from "./theme/highlight";
import favicon from ".";
import { default as helpers } from "./compat/helpers";


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
    this.response = await CTFd.pages.challenge.submitChallenge(
      this.id,
      "IntantionalError",
    );
    
    if (this.response.success){
      this.response.data.status = "correct";
      this.response.data.message = "succesfuly send!";
    }
    this.$dispatch("load-challenges");
  },
}));

Alpine.data("ChallengeBoard", () => ({
  loaded: false,
  challenges: [],
  challenge: null,

  async init() {
   

    window.TEAM_ID = CTFd.team.id;
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


