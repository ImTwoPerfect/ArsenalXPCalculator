const XP_INCREMENT = 25;
const DEFAULTS = {
  avgKills: 19.7,
  avgXP: 523,
  avgRoundLength: 2.5,
};

function calculate() {
  const level = parseInt(document.getElementById("levelInput").value);
  const compareLevel = parseInt(document.getElementById("compareInput").value);
  const avgKills = parseFloat(document.getElementById("avgKillsInput").value) || DEFAULTS.avgKills;
  const avgXP = parseFloat(document.getElementById("avgXPInput").value) || DEFAULTS.avgXP;
  const avgRoundLength = parseFloat(document.getElementById("avgRoundInput").value) || DEFAULTS.avgRoundLength;

  const xpBoost = document.getElementById("xpBoost").checked;
  const estimatesOnly = document.getElementById("estimatesOnly").checked;

  if (!level || level <= 0) {
    return showOutput("ERROR: Enter a valid level.");
  }

  let result = runXPCalculations({
    level,
    compareLevel,
    avgKills,
    avgXP,
    avgRoundLength,
    xpBoost,
    estimatesOnly,
  });

  showOutput(result);
}

function runXPCalculations({ level, compareLevel, avgKills, avgXP, avgRoundLength, xpBoost, estimatesOnly }) {
  let currentXP = 100;
  let xpDiff = 100;
  let nextXP = 0;

  for (let i = 1; i < level; i++) {
    xpDiff += XP_INCREMENT;
    currentXP += xpDiff;
    nextXP = currentXP + xpDiff + XP_INCREMENT;
  }

  const rounds = currentXP / avgXP;
  const hours = (rounds * avgRoundLength) / 60;
  const kills = rounds * avgKills;

  let output = "";

  if (!compareLevel || isNaN(compareLevel)) {
    if (!estimatesOnly) {
      output += `Level: ${level}\nXP: ${currentXP}\nXP to Next: ${xpDiff}\nNext Level XP: ${nextXP}\n\n`;
    }
    output += `Estimated Hours: ${hours.toFixed(2)}\nRounds: ${Math.round(rounds)}\nKills: ${Math.round(kills)}`;
  } else {
    let compareXP = 100;
    let compXPDiff = 100;
    let compNextXP = 0;

    for (let i = 1; i < compareLevel; i++) {
      compXPDiff += XP_INCREMENT;
      compareXP += compXPDiff;
      compNextXP = compareXP + compXPDiff + XP_INCREMENT;
    }

    const compRounds = compareXP / avgXP;
    const compHours = (compRounds * avgRoundLength) / 60;
    const compKills = compRounds * avgKills;

    let diffXP = Math.abs(currentXP - compareXP);
    let diffRounds = Math.abs(rounds - compRounds);
    if (xpBoost) diffRounds /= 2;

    let diffHours = (diffRounds * avgRoundLength) / 60;
    let diffKills = avgKills * diffRounds;

    if (!estimatesOnly) {
      output += `Level: ${level} | XP: ${currentXP}\nCompared Level: ${compareLevel} | XP: ${compareXP}\n\n`;
    }

    output += `-- Difference --\nXP: ${diffXP}\nRounds: ${Math.round(diffRounds)}\nHours: ${diffHours.toFixed(2)}\nKills: ${Math.round(diffKills)}`;
  }

  return output;
}

function calculateAverages() {
  const careerKills = parseInt(document.getElementById("careerKillsInput").value);
  const roundsPlayed = parseInt(document
