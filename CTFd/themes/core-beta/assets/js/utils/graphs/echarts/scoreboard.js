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

export function trier(standings) {
  let lsOutput = [];
  
  if (standings.length > 0){
    for (let i =0; i < standings.length; i++){
      let standing = standings[i];
      if (lsOutput.length == 0){
        lsOutput.push(standing);
      }
      else{
        console.log(lsOutput);
        for (let x = lsOutput.length; x > 0; x--){
          if (getTeamTotalScore(standing) > getTeamTotalScore(lsOutput[x-1])){
            let temp = lsOutput[x-1];
            lsOutput[x-1] = standing;
            lsOutput[x] = temp;
          }
          else{
            if (x == lsOutput.length){
              lsOutput.push(standing);
              console.log(standing);
              break
            }
            
          }
        }
      }
      
      
    }
  }
  let output = {}
  for (let i =0; i < lsOutput.length; i++){
    lsOutput[i].pos = i+1;
    output[i] =  lsOutput[i];
  }

  return output;
  
}

export function getTeamTotalScore(team){
  let output = team.score + team.potential_score;
  if (team.potential_score == 0){
    output += 0.1;
  }
  console.log(output);
  return output;
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
  if (timeBetween/(1000*60*60*24) >= 1){
    //avant il y avait les il y a 
    return "il y a " + Math.floor(timeBetween/(1000*60*60*24)) + " jours";
  }
  else if (timeBetween/(1000*60*60) >=1){
    return "il y a " + Math.floor(timeBetween/(1000*60*60)) + " heures";
  }
  else if (timeBetween/(1000*60) >=1){
    return "il y a " + Math.floor(timeBetween/(1000*60)) + " min";
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
