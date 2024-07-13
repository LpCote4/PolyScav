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
        type: "shadow",
      },
    },
    legend: {
      type: "scroll",
      orient: "horizontal",
      align: "left",
      bottom: 35,
      data: [],
    },
    
    grid: {
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: [],
      show: false,
    },
    yAxis: {
      type: 'value',
      axisLabel:"",
      show: false,
    },
    series: [],
  };

  const teams = Object.keys(places);

  let lsData = [];

  let scoreSeries = {
    name: 'Score',
    type: 'bar',
    stack: 'total',
    data: [],
    itemStyle: {
      color: 'rgba(0, 0, 0, 0.85)', // Default color for the score bars
    },

  };

  let potentialScoreSeries = {
    name: 'Potential Score',
    type: 'bar',
    stack: 'total',
    data: [],
    itemStyle: {
      color: 'rgba(0, 0, 0, 0.45)', // Default color for the potential score bars
      opacity: 0.5, // Reduce opacity to distinguish potential score bars
    },

   
  };

  let characterCount = 0;
  for (let i = 0; i < teams.length; i++) {
    const teamName = places[teams[i]]["name"];
    const teamScore = places[teams[i]]["score"];
    const teamPotentialScore = places[teams[i]]["potential_score"];
    const teamColor = places[teams[i]]["color"];

    characterCount += teamName.length;

    lsData.push(teamName);
    
    potentialScoreSeries.label = {show: true,formatter: '{b}', position: 'top', fontSize:24};
    scoreSeries.data.push({
      value: teamScore,
      itemStyle: {
        color: teamColor,
        borderRadius :(teamPotentialScore == 0) ? [30, 30, 0, 0] : "",
      }
    });

    potentialScoreSeries.data.push({
      value: teamPotentialScore,
      itemStyle: {
        color: teamColor,
        opacity: 0.5,
        borderRadius: [30, 30, 0, 0],
        
      },
     
      
    });
  }

  // Determine if labels need rotation based on available space
  const xAxisWidth = characterCount * 20 + 30;
  const containerWidth = document.getElementById('score-graph').offsetWidth;
  if(xAxisWidth > containerWidth*2){
    option.xAxis.axisLabel = {
      interval: 0,
      rotate: 90,
    };
  }
  else if (xAxisWidth > containerWidth) {
    option.xAxis.axisLabel = {
      interval: 0,
      rotate: 45,
    };
  } else {
    option.xAxis.axisLabel = {
      interval: 0,
      rotate: 0,
    };
  }

  option.xAxis.data = lsData;
  option.series.push(scoreSeries);
  option.series.push(potentialScoreSeries);
  option.series.forEach(series => {
    series.barGap = '0%'; // Overlap bars for the same team
    series.barCategoryGap = '50%'; // Adjust the gap between categories (teams)
  });

  return option;
}

export function getTenLast(places, standings, dictIdChallenge){
  console.log(standings)
  const teams = Object.keys(places);
  let last10 = [];
  let max = 999;
  
  for (let i = 0; i < ((teams.length >= max) ? max : teams.length); i++) {
    let solves = places[teams[i]]["solves"];
    let fails = places[teams[i]]["fails"];
    let dictIdNom = dictUserIdToUserName(standings[i]["members"]);
    
    for (let solved = 0; solved < solves.length; solved++) {
      let challengeDate = solves[solved].date;
      console.log( places[teams[i]]);
      solves[solved]["team_name"] = places[teams[i]].name;
      solves[solved]["user_name"] = dictIdNom[solves[solved]["user_id"]];
      solves[solved]["challenge_name"] = dictIdChallenge[solves[solved]["challenge_id"]];
      solves[solved]["time"] = getTimeStamp(challengeDate);
      solves[solved]["color"] = standings[i]["color"];

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
      if (fails[solved]["type"] == "manual" || fails[solved]["type"] == "manualRecursive"){
        let challengeDate = fails[solved].date;
        fails[solved]["team_name"] = places[teams[i]].name;
        fails[solved]["user_name"] = dictIdNom[fails[solved]["user_id"]];
        fails[solved]["challenge_name"] = dictIdChallenge[fails[solved]["challenge_id"]];
        fails[solved]["time"] = getTimeStamp(challengeDate);
        fails[solved]["color"] = standings[i]["color"];


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
    //avant il y avait les il y a 
    return "" + Math.floor(timeBetween/(1000*60*60*24)) + " jours";
  }
  else if (timeBetween/(1000*60*60) >=2){
    return "" + Math.floor(timeBetween/(1000*60*60)) + " heures";
  }
  else if (timeBetween/(1000*60) >=2){
    return "" + Math.floor(timeBetween/(1000*60)) + " min";
  }
  else{
    return "a l'instant";
  }
}

export function dictUserIdToUserName(members){
  let output = {};
  for (let i = 0; i <members.length; i++){
    output[members[i]["id"]] = members[i]["name"];
  }
  return output;
}
