((global) => {
  "use strict";

  let abilities = document.getElementById("abilities").getElementsByClassName("ability_row");

  let ability = {}

  ability.current = "none";

  ability.names = ["eco", "reverse", "ghost", "stop", "slow", "phantom", "forward", "teleport", "fast", "warp"];

  ability.unsold = [true, true, true, true, true, true, true, true, true, true]

  ability.reset = () => {
    abilities.foreach((ab) => {
      ab.className = "ability_row";
    })
  }

  ability.select = (n) => {
    for (let i = 0; i < abilities.length; i++) {
      if( ability.unsold[i] ) {
        abilities.item(i).className = "ability_row";

      }
    }

    if (ability.unsold[n]) {
      abilities.item(n).className = "ability_row active";
      ability.current = ability.names[n];
    } else {
      // TODO MAKE IT SO THAT THE PLAYER KNOWS!
    }
  }

  ability.sell = (n, powerOrHeart) => {
    if (ability.unsold[n]) {

      if(powerOrHeart) {

        resources.resetPower();

      } else {
        resources.gainHalfHeart();
      }

      ability.unsold[n] = false;
      abilities.item(n).className = "ability_row sold";
      if (ability.current == ability.names[n] ) {
        ability.current = "none";
      }
    }
  }

  global.ability = ability

})(this);
