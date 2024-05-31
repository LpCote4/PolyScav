import Alpine from "alpinejs";
import CTFd from "./index";
import { getOption, getTenLast } from "./utils/graphs/echarts/scoreboard";
import { embed } from "./utils/graphs/echarts";
import * as echarts from 'echarts';

window.Alpine = Alpine;
window.CTFd = CTFd;
window.ScoreboardDetail = 0;
window.standings = 0;

Alpine.data("ScoreboardDetail", () => ({
  data: {},
  show: true,
  
  async init() {
    window.standings = await CTFd.pages.scoreboard.getScoreboard();
    window.ScoreboardDetail = await CTFd.pages.scoreboard.getScoreboardDetail(window.standings.length)
    let option = getOption(CTFd.config.userMode, window.standings);
    var chartDom = document.getElementById('score-graph');
    var myChart = echarts.init(chartDom);
    myChart.setOption(option);
    this.show = window.standings.length > 0;
    
  },
}));

Alpine.data("ScoreboardList", () => ({
  standings: [],
  brackets: [],
  activeBracket: null,

  async init() {
    
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
   
    let last = getTenLast(window.ScoreboardDetail, window.standings, ChallengeIdToChallengeName);
    for (let i = 0; i < last.length; i++){
      this.standings[i] = last[i];
    }
   
  },
}));

Alpine.start();
