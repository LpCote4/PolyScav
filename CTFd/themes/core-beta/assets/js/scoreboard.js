import Alpine from "alpinejs";
import CTFd from "./index";
import { getOption, getTenLast } from "./utils/graphs/echarts/scoreboard";
import { embed } from "./utils/graphs/echarts";
import * as echarts from 'echarts';

window.Alpine = Alpine;
window.CTFd = CTFd;

Alpine.data("ScoreboardDetail", () => ({
  data: {},
  show: true,
  
  async init() {
    this.data = await CTFd.pages.scoreboard.getScoreboardDetail(10);
    let option = getOption(CTFd.config.userMode, this.data);
    var chartDom = document.getElementById('score-graph');
    var myChart = echarts.init(chartDom);
    myChart.setOption(option);
    this.show = Object.keys(this.data).length > 0;
  },
}));

Alpine.data("ScoreboardList", () => ({
  standings: [],
  brackets: [],
  activeBracket: null,

  async init() {
    let response = await CTFd.fetch(`/api/v1/brackets?type=${CTFd.config.userMode}`, {
      method: "GET",
    });
    const body = await response.json();

    let response2 = await CTFd.fetch(`/api/v1/users`, {
      method: "GET",
    });
    const body2 = await response2.json();
    console.log(body2["data"])
    let UserIdToUserName = {}
    for (let i = 0; i < body2["data"].length; i++){
      UserIdToUserName[body2["data"][i]["id"]] = body2["data"][i]["name"];
    }
    console.log(UserIdToUserName);
    this.brackets = body["data"];
    this.standings = await CTFd.pages.scoreboard.getScoreboard();
    
    let response3= await CTFd.fetch(`/api/v1/challenges`, {
      method: "GET",
    });
    const body3 = await response3.json();
    console.log(body3["data"])
    let ChallengeIdToChallengeName = {}
    for (let i = 0; i < body3["data"].length; i++){
      ChallengeIdToChallengeName[body3["data"][i]["id"]] = body3["data"][i]["name"];
    }
    console.log(this.standings);
    let last = getTenLast(await CTFd.pages.scoreboard.getScoreboardDetail(this.standings.length), UserIdToUserName, ChallengeIdToChallengeName);
    console.log(Object.assign({}, last));
    for (let i = 0; i < last.length; i++){
      this.standings[i] = last[i];
    }
    
    console.log(this.standings);
    //this.standings = Object.assign({}, last);
   
  },
}));

Alpine.start();
