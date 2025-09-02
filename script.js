const XP_INCREMENT = 25;
const DEFAULTS = {
  avgKills: 19.7,
  avgXP: 523,
  avgRoundLength: 2.5,
};

const levelInput = document.getElementById("levelInput");
const compareInput = document.getElementById("compareInput");
const avgKillsInput = document.getElementById("avgKillsInput");
const avgXPInput = document.getElementById("avgXPInput");
const avgRoundInput = document.getElementById("avgRoundInput");
const xpBoostCheckbox = document.getElementById("xpBoost");
const estimatesOnlyCheckbox = document.getElementById("estimatesOnly");
const outputElem = document.getElementById("output");

const togglePanelBtn = document.getElementById("toggleSidePanel");
const sidePanel = document.getElementById("sidePanel");
const closePanelBtn = document.getElementById("closeSidePanel");
const fillAveragesBtn = document.getElementById("fillAveragesButton");

togglePanelBtn.addEventListener("click", () => {
  sidePanel.classList.toggle("open");
});

closePanelBtn.addEventListener("click", () => {
  sidePanel.classList.remove("open");
});

fillAveragesBtn.addEventListener("click", () => {
  const careerKills = parseInt(document.getElementById("careerKillsInput").value);
  const roundsPlayed = parseInt(document.getElementById("roundsPlayedInput").value);
  const levelXP = parseInt(document.getElementById("levelXPInput").value);

  let averageKills = "";
  let averageXP = "";

  if (roundsPlayed > 0 && careerKills > 0) {
    averageKills = (careerKills / roundsPlayed).toFixed(2);
  }

  if (roundsPlayed > 0 && levelXP > 0) {
    averageXP = Math.floor(levelXP / roundsPlayed);
  }

  if (averageKills !== "") avgKillsInput.value = averageKills;
  if (averageXP !== "") avgXPInput.value = averageXP;

  const feedback = [];
  if (averageKills) feedback.push(`Average Kills: ${averageKills}`);
  if (averageXP) feedback.push(`Average XP: ${averageXP}`);
  outputElem.textContent = feedback.length ? feedback.join("\n") : "Please enter valid stats.";

  sidePanel.classList.remove("open");
});

document.getElementById("calcButton").addEventListener("click", () => {
  calculate();
});

function calculate() {
  const level = parseInt(levelInput.value);
  const compareLevel = parseInt(compareInput.value);
  const avgKills = parseFloat(avgKillsInput.value) || DEFAULTS.avgKills;
  const avgXP = parseFloat(avgXPInput.value) || DEFAULTS.avgXP;
  const avgRoundLength = parseFloat(avgRoundInput.value) || DEFAULTS.avgRoundLength;
  const xpBoost = xpBoostCheckbox.checked;
  const estimatesOnly = estimatesOnlyCheckbox.checked;

  if (!level || level <= 0) {
    outputElem.textContent = "ERROR: Enter a valid level.";
    return;
  }

  const result = runXPCalculations({
    level,
    compareLevel,
    avgKills,
    avgXP,
    avgRoundLength,
    xpBoost,
    estimatesOnly,
  });

  outputElem.textContent = result;
}

function runXPCalculations({ level, compareLevel, avgKills, avgXP, avgRoundLength, xpBoost, estimatesOnly }) {
  function getLevelXPData(lvl) {
    let xp = 100;
    let xpDiff = 100;
    for (let i = 1; i < lvl; i++) {
      xpDiff += XP_INCREMENT;
      xp += xpDiff;
    }
    return {
      xp,
      xpDiff,
      nextLevelXP: xp + xpDiff + XP_INCREMENT,
    };
  }

  const user = getLevelXPData(level);
  const userRounds = user.xp / avgXP;
  const userHours = (userRounds * avgRoundLength) / 60;
  const userKills = userRounds * avgKills;

  if (!compareLevel || isNaN(compareLevel)) {
    if (estimatesOnly) {
      return [
        `Estimates:`,
        `--Hours Played = ${userHours.toFixed(2)}`,
        `--Rounds Played = ${Math.round(userRounds)}`,
        `--Career Kills = ${Math.round(userKills)}`
      ].join("\n");
    }

    return [
      `Calculated Level Information:`,
      `--Level = ${level}`,
      `--XP = ${user.xp}`,
      `--XP to Next Level = ${user.xpDiff}`,
      `--Next Level XP = ${user.nextLevelXP}`,
      ``,
      `Estimates:`,
      `--Hours Played = ${userHours.toFixed(2)}`,
      `--Rounds Played = ${Math.round(userRounds)}`,
      `--Career Kills = ${Math.round(userKills)}`
    ].join("\n");
  }

  const comp = getLevelXPData(compareLevel);
  const compRounds = comp.xp / avgXP;
  const compHours = (compRounds * avgRoundLength) / 60;
  const compKills = compRounds * avgKills;

  const diffXP = Math.abs(user.xp - comp.xp);
  let diffRounds = Math.abs(userRounds - compRounds);
  if (xpBoost) diffRounds /= 2;
  const diffHours = (diffRounds * avgRoundLength) / 60;
  const diffKills = diffRounds * avgKills;
  const levelDiff = Math.abs(level - compareLevel);

  if (estimatesOnly) {
    return [
      `Level ${level} Estimates:`,
      `--Hours Played = ${userHours.toFixed(2)}`,
      `--Rounds Played = ${Math.round(userRounds)}`,
      `--Career Kills = ${Math.round(userKills)}`,
      ``,
      `Level ${compareLevel} Estimates:`,
      `--Hours Played = ${compHours.toFixed(2)}`,
      `--Rounds Played = ${Math.round(compRounds)}`,
      `--Career Kills = ${Math.round(compKills)}`,
      ``,
      `Estimates from ${level} to ${compareLevel}:`,
      `--Hours = ${diffHours.toFixed(2)}`,
      `--Rounds = ${Math.round(diffRounds)}`,
      `--Career Kills = ${Math.round(diffKills)}`
    ].join("\n");
  }

  return [
    `Calculated Level Information:`,
    `--Level = ${level}`,
    `--XP = ${user.xp}`,
    `--XP to Next Level = ${user.xpDiff}`,
    `--Next Level XP = ${user.nextLevelXP}`,
    ``,
    `Estimates:`,
    `--Hours Played = ${userHours.toFixed(2)}`,
    `--Rounds Played = ${Math.round(userRounds)}`,
    `--Career Kills = ${Math.round(userKills)}`,
    ``,
    `Compared Level Information:`,
    `--Comparing Level = ${compareLevel}`,
    `--XP = ${comp.xp}`,
    `--XP to Next Level = ${comp.xpDiff}`,
    `--Next Level Total XP = ${comp.nextLevelXP}`,
    ``,
    `Compared Estimates:`,
    `--Hours Played = ${compHours.toFixed(2)}`,
    `--Rounds Played = ${Math.round(compRounds)}`,
    `--Career Kills = ${Math.round(compKills)}`,
    ``,
    `Level Differences:`,
    `--Comparing levels: ${level} to ${compareLevel}`,
    `--Levels = ${levelDiff}`,
    `--XP = ${diffXP}`,
    ``,
    `Estimates from ${level} to ${compareLevel}:`,
    `--Hours = ${diffHours.toFixed(2)}`,
    `--Rounds = ${Math.round(diffRounds)}`,
    `--Career Kills = ${Math.round(diffKills)}`
  ].join("\n");
}
