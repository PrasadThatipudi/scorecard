import {
  batterTemplate,
  bowlerTemplate,
  scoreCardTemplate,
} from "./score_sheet_framework.js";
import { wicketKind } from "./wicket_kinds.js";
import { formatScoreCard } from "./format_scorecard.js";

const add = (first, second) => first + second;

export const incrementOvers = ({ overs, balls }) => ({
  overs: overs + Math.floor((balls + 1) / 6),
  balls: (balls + 1) % 6,
});

export const getAllDeliveries = (overs) =>
  overs.flatMap(({ deliveries }) => deliveries);

export const isBoundary = (ball, score) =>
  ball.runs.batter === score && !ball.runs.non_boundary;

const isFour = (ball) => isBoundary(ball, 4);
const isSix = (ball) => isBoundary(ball, 6);

const mergeWith = (object1, object2, mapper) => {
  const result = { ...object1 };
  for (const [key, value] of Object.entries(object2)) {
    result[key] = result[key] ? mapper(result[key], value) : value;
  }
  return result;
};

export const isFairDelivery = (delivery) =>
  !("extras" in delivery && "wides" in delivery.extras);

export const updateBatterInfo = (batsman, delivery) => {
  const latest = {
    runs: delivery.runs.batter,
    balls: isFairDelivery(delivery) ? 1 : 0,
    fours: isFour(delivery) ? 1 : 0,
    sixes: isSix(delivery) ? 1 : 0,
  };

  return mergeWith(latest, batsman || batterTemplate(delivery.batter), add);
};

export const getDismissalData = (bowler, wicket) => ({
  bowler,
  kind: wicket.kind,
  fielders: wicket.fielders || [],
});

export const insertDismissalData = (batter, delivery) => {
  const wicket = delivery.wickets[0];

  return { ...batter, dismissal: getDismissalData(delivery.bowler, wicket) };
};

const isWicket = (delivery) => "wickets" in delivery;
const isRunOut = (wicket) => wicket.kind === "run out";

export const bowlerStatsOfDelivery = (delivery) => ({
  runs: delivery.runs.total,
  wickets: isWicket(delivery) && !isRunOut(delivery.wickets[0]) ? 1 : 0,
});

export const updateBowlerInfo = (bowler, delivery) => {
  const newStats = bowlerStatsOfDelivery(delivery);
  const bowlerStats = { ...(bowler || bowlerTemplate(delivery.bowler)) };
  const overs = isFairDelivery(delivery)
    ? incrementOvers(bowlerStats.overs)
    : bowlerStats.overs;

  return {
    ...bowlerStats,
    overs: overs,
    runs: bowlerStats.runs + newStats.runs,
    wickets: bowlerStats.wickets + newStats.wickets,
  };
};

export const updateExtras = (extras, delivery) =>
  mergeWith(extras, delivery.extras || {}, add);

export const updateTeamInfo = (teamInfo, delivery) => {
  const latest = {
    total: delivery.runs.total,
    wickets: isWicket(delivery) ? 1 : 0,
  };
  return mergeWith(teamInfo, latest, add);
};

const updateBatters = (battersInfo, delivery) => {
  const batters = { ...battersInfo };
  batters[delivery.batter] = updateBatterInfo(
    batters[delivery.batter],
    delivery
  );

  if (isWicket(delivery)) {
    const { player_out } = delivery.wickets[0];
    batters[player_out] = insertDismissalData(batters[player_out], delivery);
  }

  return batters;
};

const updateBowlers = (bowlersInfo, delivery) => {
  const bowlers = { ...bowlersInfo };

  bowlers[delivery.bowler] = updateBowlerInfo(
    bowlers[delivery.bowler],
    delivery
  );

  return bowlers;
};

export const updateScoreCard = (info, delivery) => {
  const scoreSheet = { ...info };

  scoreSheet.batters = updateBatters(scoreSheet.batters, delivery);
  scoreSheet.bowlers = updateBowlers(scoreSheet.bowlers, delivery);
  scoreSheet.extras = updateExtras(scoreSheet.extras, delivery);
  scoreSheet.teamInfo = updateTeamInfo(scoreSheet.teamInfo, delivery);

  return scoreSheet;
};

export const getScoreCard = ({ team, overs }) => {
  const deliveries = getAllDeliveries(overs);

  const finalScoreCard = deliveries.reduce(
    (scoreCard, delivery) => updateScoreCard(scoreCard, delivery),
    scoreCardTemplate(team)
  );

  return finalScoreCard;
};

export const generateScoreCard = (ballByBall) => {
  const scoreCard = ballByBall.innings.map(getScoreCard);

  return scoreCard.map(formatScoreCard);
};
