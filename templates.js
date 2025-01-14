const scoreSheetFramework = {
  teamInfo: { team: "", total: 0, wickets: 0 },
  batter: { dismissal: "not out", runs: 0, balls: 0, fours: 0, sixes: 0 },
  batters: {
    Praneeth: { dismissal: "not out", runs: 17, balls: 5, fours: 1, sixes: 2 },
  },
  bowlers: { Prasad: { overs: 0.0, runs: 0, wickets: 0 } },
};

export const scoreCardTemplate = (teamName) => ({
  teamInfo: { ...teamInfoTemplate(), team: teamName },
  batters: {},
  bowlers: {},
  extras: extrasTemplate(),
});

export const teamInfoTemplate = () => ({ team: "", total: 0, wickets: 0 });

export const extrasTemplate = () => ({
  byes: 0,
  legbyes: 0,
  wides: 0,
  Noballs: 0,
});

export const batterTemplate = (batsaman) => ({
  name: batsaman,
  dismissal: { kind: "not out" },
  runs: 0,
  balls: 0,
  fours: 0,
  sixes: 0,
});

export const bowlerTemplate = (bowler) => ({
  name: bowler,
  overs: { overs: 0, balls: 0 },
  runs: 0,
  wickets: 0,
});
