((global) => {
  "use strict";

  /*
  This contains some useful movement generating functions.
  A movement function is a function taking time and returning a pose.
  They are used mostly to transform a static bullet (dependent on pose) into
  a bullet (dependent on time).

  Movement generating functions take various inputs and return a movement
  function. For example we can have linear movements which pass through a pose
  (point + direction + time) at a certain speed. In that case, the pose and
  the speed would be the input arguments.

  Movement functions can (and sometimes should) be written "on the spot" in
  scripts. This contains some of the either very common, very useful, or
  relatively hard to write but useful movement generating functions.

  Remark; throughout this document, speed is measured in 1 = 1 second to
  cross the screen. You generally want speeds such as 0.3 . These units where
  chosed since they are more intuitive than, say, pixels or cm.
  */

  const mv = {};

  // No movement is a form of movement.
  mv.static = (pose) => { return (t) => { return pose; }; };

  // Linear movement passing through "pose" at "speed".
  mv.linear = (pose, speed) => { return (t) => {
      return pose
        .forward(speed * (t - pose.t))
        .delay(t - pose.t);
    }
  };

  // Linear interpolation from "pose" to "target" (pose).
  mv.linearIplt = (pose, target) => { return (t) => {
      return pose
        .towards(target)
        .forward((t-pose.t)/(target.t-pose.t)*pose.dist(target))
        .delay(t-pose.t);
    }
  }

  mv.bezier = (from, fromSpeed, to, toSpeed) => { return (t) => {
      const s0 = fromSpeed * (to.t - from.t) / 3;
      const s1 = toSpeed * (to.t - from.t) / 3;
      const tt = (t - from.t) / (to.t - from.t);
      const mt = 1 - tt;
      const p0 = from;
      const p1 = from.forward(s0);
      const p2 = to.forward(-s1);
      const p3 = to;
      const px = (
        (p0.x * (  mt*mt*mt)) +
        (p1.x * (3*mt*mt*tt)) +
        (p2.x * (3*mt*tt*tt)) +
        (p3.x * (  tt*tt*tt)));
      const py = (
        (p0.y * (  mt*mt*mt)) +
        (p1.y * (3*mt*mt*tt)) +
        (p2.y * (3*mt*tt*tt)) +
        (p3.y * (  tt*tt*tt)));
      const ox = (
        ((p1.x - p0.x) * (3*mt*mt)) +
        ((p2.x - p1.x) * (6*mt*tt)) +
        ((p3.x - p2.x) * (3*tt*tt)));
      const oy = (
        ((p1.y - p0.y) * (3*mt*mt)) +
        ((p2.y - p1.y) * (6*mt*tt)) +
        ((p3.y - p2.y) * (3*tt*tt)));

      return new Pose(px, py, Math.atan2(oy, ox), t);
    }
  }

  mv.compoundBezier = (arr) => { return (t) => {
      if (t < arr[0].t) {
        return mv.linear(arr[0], arr[1])(t);
      }
      for (let i = 1; 2*i < arr.length; i++) {
        if (t < arr[2*i].t) {
          return mv.bezier(arr[2*i-2], arr[2*i-1], arr[2*i], arr[2*i+1])(t);
        }
      }
      return mv.linear(arr[arr.length - 2], arr[arr.length - 1])(t);
    }
  }


  global.mv = mv
})(this);
