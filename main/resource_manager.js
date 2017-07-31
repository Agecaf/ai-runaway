((global) => {
  "use strict";

  let resources = {}

  let bar = document.getElementById("health");
  let stars = bar.getElementsByClassName("fa-star");
  let halfStar = bar.getElementsByClassName("fa-star-half").item(0);
  let powerBar = document.getElementById("power");

  console.log(halfStar.style.visibility)

  resources.health = 3;
  resources.halfHealth = false;
  resources.power = 100;

  halfStar.style.visibility = "hidden";

  resources.setHealth = (h, hh) => {
    if (h < 0) h = 0;
    resources.halfHealth = hh;
    resources.health = h;

    halfStar.style.visibility = hh ? "" : "hidden";

    for (let i = 0; i < 8; i++) {
      let st = stars.item(i);
      st.style.visibility = i < h ? "" : "hidden";
    }
  }

  resources.setPower = (p) => {
    resources.power = p;

    if (resources.power <= 0) {
      scene.gameOver();
    }

    powerBar.style.width = (resources.power * 1000 / 100) + "px";

  }

  resources.resetPower = () => {resources.setPower(100); }

  resources.losePower = (l) => {resources.setPower(resources.power - l); }

  resources.gainHalfHeart = () => {
    if (resources.halfHealth) {
      resources.halfHealth = false
      resources.setHealth(resources.health + 1, false)
    } else {
      resources.halfHealth = true
      resources.setHealth(resources.health, true)
    }
  }

  resources.loseHeart = () => {
    resources.setHealth(resources.health - 1, resources.halfHealth)
  }

  global.resources = resources
})(this);
