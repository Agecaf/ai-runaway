((global) => {
  "use strict";

  let scene = {}

  let main_menu = document.getElementById("main_menu");
  main_menu.style.visibility = "visible";

  let game_over = document.getElementById("game_over");
  game_over.style.visibility = "hidden";

  let epilogue = document.getElementById("epilogue");
  epilogue.style.visibility = "hidden";



  let audio1 = new Audio('assets/Night Escape.mp3');
  audio1.loop = true;



  scene.start = (n) => {
    controls.paused = false;
    gameOn = true;

    game.reset();

    main_menu.style.visibility = "hidden";

    mainBullet = levels[n].mainBullet(canvas, ctx);
    background = levels[n].background();
    t = 0;

    window.requestAnimationFrame(mainloop);

    resources.setHealth(3, false);
    resources.resetPower();

    ability.cooldown = 0.0;
    ability.heat = 0.0;

    audio1.play();
  }

  scene.mainMenu = () => {
    audio1.pause();
    audio1.currentTime = 0;

    gameOn = false;

    controls.paused = false;
    document.getElementById("pause").style.visibility = "hidden";

    main_menu.style.visibility = "visible";
    game_over.style.visibility = "hidden";
    epilogue.style.visibility = "hidden";


  }

  scene.gameOver = () => {
    audio1.pause();
    audio1.currentTime = 0;

    gameOn = false;

    controls.paused = false;
    document.getElementById("pause").style.visibility = "hidden";

    game_over.style.visibility = "visible";
  }

  scene.epilogue = () => {
    audio1.pause();
    audio1.currentTime = 0;

    gameOn = false;

    controls.paused = false;
    document.getElementById("pause").style.visibility = "hidden";

    epilogue.style.visibility = "visible";
  }



  global.scene = scene
  global.audio1 = audio1

})(this);
