(() => {
  "use strict";

  let game = {}

  // Main Properties
  let mainloop;
  let last = null;
  this.t = 0;

  // Get Context.
  const canvas = document.getElementById('game_canvas');
  const ctx = canvas.getContext("2d");

  this.mainBullet = Bullet.nullBullet();
  this.background = Bullet.nullBullet();
  ability.cooldown = 0.0;
  ability.heat = 0.0;

  this.gameOn = false;

  // Player Properties
  let hitMercy = 0.0;
  let isAbilityActive = false;
  let powerLeft = 100.0;

  const player = new Pose(0.5, 0.9, 0, 0);
  let   ghost = player.clone();

  const CHARACTER_SPEED = 0.5;
  const CHARACTER_ALT_SPEED = 0.2;
  const HIT_MERCY = 2.0;


  game.reset = () => {
    player.x = 0.5;
    player.y = 0.9;
  }

  // Check ability.
  ability.isActive = (arr) => {
    let out = false;
    arr.forEach((ab) => {
      if (ab == ability.current) {
        if (["eco", "fast", "warp"].includes(ab)) {
          out =  true;
        }

        if (controls.active()) out =  true;
      }
    })

    return out;
  }

  // Define the main loop.
  mainloop = (timestamp) => {

    // Define start.
    last = last || timestamp;

    // Calculate change of time (milliseconds).
    let dt = (timestamp - last) / 1000;

    if (controls.paused) {
      dt = 0;
    }

    // If dt is too big, assume player went see another window, so restart from the next frame on.
    if (dt > 1.0) {
      // Prepare for next frame.
      last = timestamp;
      window.requestAnimationFrame(mainloop);
    };

    if (ability.isActive(["slow"])) {
      t += dt * 0.5;
    } else if (ability.isActive(["reverse"])) {
      t += dt * -1;
    } else if (ability.isActive(["forward"])) {
      t += dt * 3.0;
    } else if (ability.isActive(["stop"])) {
    } else {
      t += dt;
    }


    // LOSE POWERRR
    if (ability.isActive(["eco"])) {

    } else if (ability.isActive(["ghost", "slow"])) {
      resources.losePower((1 + ability.heat * 0.2) * dt)

    } else if (ability.isActive([ "stop"])) {
      resources.losePower((0.5) * dt)

    } else if (ability.isActive(["phantom"])) {
      resources.losePower((2 + ability.heat * 1.0) * dt)

    } else if (ability.isActive(["forward"])) {
      resources.losePower((2 + ability.heat * 1.0) * dt * 3.0)

    } else if (resources.health < 1) {
      resources.losePower(2 * dt)
    } else {
      resources.losePower(0.1 * dt)
    }


    // Cooldown etc.
    if (ability.cooldown > 0) {
      ability.cooldown -= dt;
    }
    if( hitMercy > 0) {
      hitMercy -= dt;
    }
    if (ability.isActive(["ghost", "stop", "slow", "phantom", "forward"])) {
      ability.heat += dt;
    } else if (ability.heat > 0) {
      ability.heat -= dt;
    }



    // Clear the screen.
    Pose.origin.setAsCanvasTransformOf(canvas);
    ctx.fillStyle = "#11232d";
    ctx.fillRect(0, 0, canvas.width, canvas.height);


    // Move player.
    if (!ability.isActive(["reverse", "forward"])) {
      let dx = 0;
      let dy = 0;
      let speed = (controls.slow()) ?
        CHARACTER_ALT_SPEED : CHARACTER_SPEED;

      if (ability.isActive(["teleport"]) && ability.cooldown < 0.1) {
        resources.losePower(1)
        speed = 0.2 / dt;
        ability.cooldown = 0.5;
      }

      if (ability.isActive(["fast"])) speed *= 1.5;

      if (controls.up()) dy -= 1;
      if (controls.down()) dy += 1;
      if (controls.left()) dx -= 1;
      if (controls.right()) dx += 1;
      if (dx != 0 && dy != 0) {dx *= 0.7; dy *= 0.7}
      dx *= speed * dt;
      dy *= speed * dt;
      player.x += dx;
      player.y += dy;

      player.t = t;
      ghost.t = t;
    }

    // Check player position
    if (ability.isActive(["warp"])) {
      if (player.x < 0 || player.x > 1 || player.y < 0 || player.y > 1 ) {
        resources.losePower(1)

      }
      if (player.x < 0) player.x++;
      if (player.x > 1) player.x--;
      if (player.y < 0) player.y++;
      if (player.y > 1) player.y--;
    } else {
      if (player.x < 0) player.x = 0;
      if (player.x > 1) player.x = 1;
      if (player.y < 0) player.y = 0;
      if (player.y > 1) player.y = 1;
    }

    // RECORD THE PAST
    if (ability.isActive(["reverse"])) {
      let pp = playerPast.atTime(t);
      player.x = pp.x;
      player.y = pp.y;
    } else if (ability.isActive(["ghost"])) {
      if (ability.cooldown < 0.1) {
        ghost.x = player.x;
        ghost.y = player.y;
      }

      playerPast.addPose(ghost);
      ability.cooldown = 0.5;
    } else {
      playerPast.addPose(player);
    }

    // Reduce POWER

    // Draw background
    background.render(t);

    // Draw player.
    player.setAsCanvasTransformOf(canvas);

    if (ability.isActive(["phantom", "forward"]) || hitMercy > 0.1) {
      ctx.globalAlpha = 0.4;
      ctx.drawImage(cache["player"], -15, -17, 30, 34);
      ctx.globalAlpha = 1;
    } else {
      ctx.drawImage(cache["player"], -15, -17, 30, 34);
    }

    if (ability.isActive(["ghost"])) {
      ghost.setAsCanvasTransformOf(canvas);

      ctx.globalAlpha = 0.4;
      ctx.drawImage(cache["player"], -15, -17, 30, 34);
      ctx.globalAlpha = 1;
    }

    // Draw Bullets
    mainBullet.render(t);

    // Check collision
    if (!ability.isActive(["phantom", "forward"])) {
      if (mainBullet.isHitting(t, player) && hitMercy < 0.1) {
        resources.loseHeart();
        if (resources.health < 1) {

          resources.losePower(20)
        }
        hitMercy = 3;

      }
    }


    // Prepare for next frame.
    last = timestamp;

    if (gameOn) {
      window.requestAnimationFrame(mainloop);
    }
  }

  this.game = game;

  this.canvas = canvas;
  this.ctx = ctx;
  this.mainloop = mainloop;

})();
