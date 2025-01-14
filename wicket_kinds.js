const getAllFielders = (fielders) => fielders.map(({ name }) => name);

const bowled = (bowler, fielders) => `b ${bowler}`;
const caught = (bowler, fielders) =>
  `c ${getAllFielders(fielders).join(" ")} b ${bowler}`;
const lbw = (bowler, fielders) => `lbw ${bowler}`;
const runOut = (bowler, fielders) => `run out (${fielders[0].name})`;

export const wicketKind = { bowled, caught, lbw, "run out": runOut };
