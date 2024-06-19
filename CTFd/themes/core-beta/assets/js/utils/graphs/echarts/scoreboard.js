import { colorHash } from "@ctfdio/ctfd-js/ui";
import dayjs from "dayjs";

export function cumulativeSum(arr) {
  let result = arr.concat();
  for (let i = 0; i < arr.length; i++) {
    result[i] = arr.slice(0, i + 1).reduce(function (p, i) {
      return p + i;
    });
  }
  return result;
}

export function getOption(mode, places) {
  let option = {
    title: {
      left: "center",
      text: (mode === "teams" ? "Teams" : "Users") + " Score",
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
      },
    },
    legend: {
      type: "scroll",
      orient: "horizontal",
      align: "left",
      bottom: 35,
      data: [],
    },
    toolbox: {
      feature: {
        dataZoom: {
          yAxisIndex: "none",
        },
        saveAsImage: {},
      },
    },
    grid: {
      containLabel: true,
    },
    xAxis: [{
      type: 'category',
    },
    {
      type: 'category',
    },
  ],
    
    yAxis: {
      type: 'value'
    },
    dataZoom: [
      {
        id: "dataZoomX",
        type: "slider",
        xAxisIndex: [0],
        filterMode: "filter",
        height: 20,
        top: 35,
        fillerColor: "rgba(233, 236, 241, 0.4)",
      },
    ],
    series: [{
      xAxisIndex: 0,
      type: 'bar',
      showBackground: false,
      itemStyle: {
        color: "#FDFD96", // red color
      },
    },
    {
      xAxisIndex: 1,
      type: 'bar',
      showBackground: false,
    }],
  };

  const teams = Object.keys(places);
  console.log("teams")
  console.log(places)
  let lsData = [];
  let lsScore = [];
  let lsPotentialScore = [];
  for (let i = 0; i < teams.length; i++) {
    lsData.push(places[teams[i]]["name"]);
    lsScore.push(places[teams[i]]["score"])
    lsPotentialScore.push(places[teams[i]]["score"]+places[teams[i]]["potential_score"])
  }
  option.xAxis[0].data = lsData;
  option.xAxis[1].data = lsData;
  option.series[0].data = lsPotentialScore;
  option.series[1].data = lsScore;
  return option;
}


export function getTenLast(places, standings, dictIdChallenge){
  
  const teams = Object.keys(places);
  let last10 = [];
  let max = 999;
  
  for (let i = 0; i < ((teams.length >= max) ? max : teams.length); i++) {
    let solves = places[teams[i]]["solves"];
    let fails = places[teams[i]]["fails"];
    let dictIdNom = dictUserIdToUserName(standings[i]["members"]);
    
    for (let solved = 0; solved < solves.length; solved++) {
      let challengeDate = solves[solved].date;
      solves[solved]["team_name"] = places[teams[i]].name;
      solves[solved]["user_name"] = dictIdNom[solves[solved]["user_id"]];
      solves[solved]["challenge_name"] = dictIdChallenge[solves[solved]["challenge_id"]];
      solves[solved]["time"] = getTimeStamp(challengeDate);


      for (let x = last10.length; x > 0; x--){
        if (dayjs(challengeDate) > dayjs(last10[x-1].date)){
          let temp = last10[x-1]
          last10[x-1] = solves[solved];
          if (x < max){
            last10[x] = temp;
          }
          
        }
        else{
          if (last10.length < max && last10.length == x){
            last10.push(solves[solved]);
            break
          }
          else{
            break;
          }
          
        }
      }
      if (last10.length == 0){
        
        last10.push(solves[solved]);
      }
    }
    for (let solved = 0; solved < fails.length; solved++) {
      if (fails[solved]["type"] == "manual"){
        let challengeDate = fails[solved].date;
        fails[solved]["team_name"] = places[teams[i]].name;
        fails[solved]["user_name"] = dictIdNom[fails[solved]["user_id"]];
        fails[solved]["challenge_name"] = dictIdChallenge[fails[solved]["challenge_id"]];
        fails[solved]["time"] = getTimeStamp(challengeDate);


        for (let x = last10.length; x > 0; x--){
          if (dayjs(challengeDate) > dayjs(last10[x-1].date)){
            let temp = last10[x-1]
            last10[x-1] = fails[solved];
            if (x < max){
              last10[x] = temp;
            }
            
          }
          else{
            if (last10.length < max && last10.length == x){
              last10.push(fails[solved]);
              break
            }
            else{
              break;
            }
            
          }
        }
        if (last10.length == 0){
          
          last10.push(fails[solved]);
        }
      }
    }

  }
  return last10;
}

export function getTimeStamp(challengeDate){
  let timeBetween = dayjs() - dayjs(challengeDate);
  if (timeBetween/(1000*60*60*24) >= 2){
    return "il y a " + Math.floor(timeBetween/(1000*60*60*24)) + " jours";
  }
  else if (timeBetween/(1000*60*60) >=2){
    return "il y a " + Math.floor(timeBetween/(1000*60*60)) + " heures";
  }
  else if (timeBetween/(1000*60) >=2){
    return "il y a " + Math.floor(timeBetween/(1000*60)) + " minutes";
  }
  else{
    return "il y a moin de 2 minutes";
  }
}

export function dictUserIdToUserName(members){
  let output = {};
  for (let i = 0; i <members.length; i++){
    output[members[i]["id"]] = members[i]["name"];
  }
  return output;
}