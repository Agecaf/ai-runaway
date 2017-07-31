((global) => {
  "use strict";

  const controls = [];

  const inControls = (key) => controls.includes(key) ;

  const pauseMenu = document.getElementById("pause");

  pauseMenu.style.visibility = "hidden"

  controls.up = () => ["w", "arrowup"].some(inControls);
  controls.down = () => ["s", "arrowdown"].some(inControls);
  controls.left = () => ["a", "arrowleft"].some(inControls);
  controls.right = () => ["d", "arrowright"].some(inControls);
  controls.slow = () => [" ", "z", "j"].some(inControls);
  controls.active = () => ["shift", "x", "k"].some(inControls);

  controls.paused = false;

  window.addEventListener('keydown', (event) => {
    const keyName = event.key.toLowerCase();
    if (controls.indexOf(keyName) == -1) {
      controls.push(keyName);
    }

    // Prevent default behavior
    if([32, 37, 38, 39, 40].indexOf(event.keyCode) > -1) {
        event.preventDefault();
    }

    if (keyName == "p") {
      controls.paused = controls.paused ? false : true;
      pauseMenu.style.visibility = controls.paused ? "visible" : "hidden";
    }
    if (keyName == "1") ability.select(0);
    if (keyName == "2") ability.select(1);
    if (keyName == "3") ability.select(2);
    if (keyName == "4") ability.select(3);
    if (keyName == "5") ability.select(4);
    if (keyName == "6") ability.select(5);
    if (keyName == "7") ability.select(6);
    if (keyName == "8") ability.select(7);
    if (keyName == "9") ability.select(8);
    if (keyName == "0") ability.select(9);

  });

  window.addEventListener('keyup', (event) => {
    const keyName = event.key.toLowerCase();
    const idx = controls.indexOf(keyName);

    if (idx >= 0) {
      controls.splice(idx, 1);
    }
  });

  controls.checkOnce = (keyName) => {
    const idx = controls.indexOf(keyName);
    if (idx >= 0) {
      controls.splice(idx, 1);
      return true;
    }
    else {
      return false;
    }
  };

  global.controls = controls;

})(this);
