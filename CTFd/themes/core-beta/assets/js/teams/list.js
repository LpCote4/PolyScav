import Alpine from "alpinejs";
import CTFd from "../index";

window.CTFd = CTFd;
window.Alpine = Alpine;


Alpine.data("TeamShowDown", () => ({
    teams: [],
    show: true,
    
    async init() {
        
      this.teams = await CTFd.pages.scoreboard.getScoreboard();
     

      this.show = true;
    },
  }));

Alpine.start();
