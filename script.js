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
  function getLevelXPData(level) {
    let xp = 100;
    let xpDiff = 100;
    for (let i = 1; i < level; i++) {
      xpDiff += XP_INCREMENT;
      xp += xpDiff;
    }
    const nextLevelXP = xp + xpDiff + XP_INCREMENT;
    return { xp, xpDiff, nextLevelXP };
  }

  const user = getLevelXPData(level);
  const userRounds = user.xp / avgXP;
  const userHours = userRounds * avgRoundLength / 60;
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

  // Comparison Mode
  const comp = getLevelXPData(compareLevel);
  const compRounds = comp.xp / avgXP;
  const compHours = compRounds * avgRoundLength / 60;
  const compKills = compRounds * avgKills;

  let diffXP = Math.abs(user.xp - comp.xp);
  let diffRounds = Math.abs(userRounds - compRounds);
  if (xpBoost) diffRounds /= 2;

  const diffHours = diffRounds * avgRoundLength / 60;
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


function calculateAverages() {
  const careerKills = parseInt(document.getElementById("careerKillsInput").value);
  const roundsPlayed = parseInt(document
