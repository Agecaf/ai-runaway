((global) => {
  "use strict";

  /*
  Keeps track of the player's position. Soon to be added to the original
  codebase (studious happiness).

  Essentially keeps a record of the player's position at all times, by
  having an array of arrays of record, each of the inner arrays containing
  the position of the player in a given second (e.g. playerPast[0] contains
  all the positions of the player in the first (0s -> 0.1s -> ... -> 1s) second)
  */

  const playerPast = [];

  // Reset the playerPast e.g. after the game ends.
  playerPast.reset = () => {

    playerPast.length = 0; // Empty past

    // Initialize playerPast
    playerPast.push([]);
    playerPast[0].push(new Pose(0.5, 0.9, 0, 0));
  };


  playerPast.atTime = (t) => {
    if (t < 0) return playerPast.atTime(0);

    let index = Math.floor(t);
    if (index >= playerPast.length) index = playerPast.length - 1;
    let second = playerPast[index];
    let out = second[0];
    second.forEach((p) => {
      if (t > p.t) out = p;
    })
    return out;
  };


  // Adds a pose to the record
  playerPast.addPose = (pose) => {
    let index = Math.floor(pose.t);

    // We don't want to write beyond the beginnings of time.
    if (index < 0) return;

    // Pose is in new second. Fill all the blanks, then move on.
    if (index + 1 > playerPast.length) {

      let i = playerPast.length;
      let p = pose.clone();
      while (index + 1 > playerPast.length) {


        p.t = i;
        playerPast.push([]);
        playerPast[i].push(p.clone());
        i++;
      }
    }

    // Erases future seconds
    if (index + 1< playerPast.length) {
      while (index + 1 < playerPast.length) {
        playerPast.pop();
      }
    }

    // Add a pose to the record.
    if (index + 1== playerPast.length) {
      let second = playerPast[playerPast.length - 1];

      // Filter possibly future records.
      second = second.filter( (p) => { return p.t < pose.t;} )

      second.push(pose.clone());
      playerPast[playerPast.length - 1] = second;


    }
  } // End of addPose


  this.playerPast = playerPast;

})(this);
