const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const VotingModule = buildModule("VotingModule", (m) => {
  const movieNames = m.getParameter("_movieNames", ["Movie 1", "Movie 2", "Movie 3"]);
  const voting = m.contract("Voting", [movieNames]);

  return { voting };
});

module.exports = VotingModule;