((global) => {
  "use strict";

  /*
  Poses define a frame of reference in space-time given
  The center (x, y),
  The orientation (rot) as a rotation (no symmetry),
  The time difference (additive).

  Remark: x positive rightwards, y positive downwards (not upwards!).
  This means for rotations, positive is clockwise (not anticlockwise!).
  */

  class Pose {
    constructor (x, y, rot, t) {
      this.x = x;
      this.y = y;
      this.rot = rot;
      this.t = t;
    }

    clone() {
      return new Pose(this.x, this.y, this.rot, this.t);
    }

    delay(dt) {
      return new Pose(this.x, this.y, this.rot, this.t + dt);
    }

    rotate(angle) {
      return new Pose(this.x, this.y, this.rot + angle, this.t);
    }

    forward(d) {
      return new Pose(
        this.x + d * Math.cos(this.rot),
        this.y + d * Math.sin(this.rot),
        this.rot, this.t);
    }

    sideways(d) {
      return new Pose(
        this.x - d * Math.sin(this.rot),
        this.y + d * Math.cos(this.rot),
        this.rot, this.t);
    }

    towards(other) {
      return new Pose(
        this.x, this.y,
        Math.atan2(other.y - this.y, other.x - this.x),
        this.t);
    }

    setAsCanvasTransformOf(canvas) {
      canvas
        .getContext('2d')
        .setTransform(
          Math.cos(this.rot), Math.sin(this.rot),
          -Math.sin(this.rot), Math.cos(this.rot),
          this.x * canvas.width,
          this.y * canvas.width
        );
    }

    dist(other) {
      return Math.hypot(this.x - other.x, this.y - other.y);
    }

    distsqr(other) {
      return (this.x-other.x)*(this.x-other.x)+(this.y-other.y)*(this.y-other.y);
    }
  }

  Pose.origin = new Pose(0, 0, 0, 0);


  global.Pose = Pose;
  global.TAU = Math.PI * 2;

})(this);
