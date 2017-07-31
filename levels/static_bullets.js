((global) => {

  let sb = {}

  sb.say = (txt) => {
    return new StaticBullet(
      (pose) => {
        pose.setAsCanvasTransformOf(canvas);
        ctx.fillStyle = "#f1e3fd";
        ctx.font="20px Nunito sans-serif";
        ctx.fillText(txt, 0, 0);
      },
      (pose, point) => false
    )
  }

  sb.bullet = new StaticBullet(
    (pose) => {
      pose.setAsCanvasTransformOf(canvas);
      ctx.drawImage(cache["bullet"], -5, -5, 10, 10);
    },
    (pose, point) => pose.dist(point) * canvas.width < 4
  )

  sb.bullet2 = new StaticBullet(
    (pose) => {
      pose.setAsCanvasTransformOf(canvas);
      ctx.drawImage(cache["bullet2"], -5, -5, 10, 10);
    },
    (pose, point) => pose.dist(point) * canvas.width < 4
  )

  sb.bullet3 = new StaticBullet(
    (pose) => {
      pose.setAsCanvasTransformOf(canvas);
      ctx.drawImage(cache["bullet3"], -15, -15, 30, 30);
    },
    (pose, point) => pose.dist(point) * canvas.width < 13
  )

  sb.rhombus = new StaticBullet(
    (pose) => {
      pose.rot = 0;
      pose.setAsCanvasTransformOf(canvas);
      ctx.drawImage(cache["rhombus"], -40, -40, 80, 80);
    },
    (pose, point) => pose.dist(point) * canvas.width < 20
  )

  sb.building = new StaticBullet(
    (pose) => {
      pose.rot = 0;
      pose.setAsCanvasTransformOf(canvas);
      ctx.drawImage(cache["building"], -100, -200, 200, 400);
    },
    (pose, point) => false
  )

  sb.square = new StaticBullet(
    (pose) => {
      pose.rot = 0;
      pose.setAsCanvasTransformOf(canvas);
      ctx.drawImage(cache["square"], -32, -25, 64, 50);
    },
    (pose, point) => pose.dist(point) * canvas.width < 20
  )

  sb.triangle = new StaticBullet(
    (pose) => {
      pose.setAsCanvasTransformOf(canvas);
      ctx.drawImage(cache["triangle"], -15, -15, 30, 30);
    },
    (pose, point) => pose.dist(point) * canvas.width < 12
  )

  sb.circle = new StaticBullet(
    (pose) => {
      let x = Math.cos(pose.rot) < 0;
      pose.rot = 0;
      pose.setAsCanvasTransformOf(canvas);
      if (x) {ctx.scale(-1, 1);}
      ctx.drawImage(cache["circle"], -13, -13, 26, 26);
    },
    (pose, point) => pose.dist(point) * canvas.width < 10
  )

  const cpose = new Pose(0.5, 0.2, 0, 0)

  sb.sbullet = new StaticBullet(
    (pose) => {
      pose.towards(cpose).setAsCanvasTransformOf(canvas);
      ctx.drawImage(cache["sbullet"], -15, -15, 30, 30);
    },
    (pose, point) => pose.dist(point) * canvas.width < 13
  )

  sb.sbullet2 = new StaticBullet(
    (pose) => {
      pose.setAsCanvasTransformOf(canvas);
      ctx.drawImage(cache["sbullet2"], -15, -10, 30, 20);
    },
    (pose, point) => pose.dist(point) * canvas.width < 9
  )

  sb.boss = new StaticBullet(
    (pose) => {
      pose.rot = 0;
      pose.setAsCanvasTransformOf(canvas);
      ctx.drawImage(cache["boss"], -25, -35, 60, 75);
    },
    (pose, point) => pose.dist(point) * canvas.width < 9
  )


  global.sb = sb;

})(this);
