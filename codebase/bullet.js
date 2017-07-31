((global) => {
  "use strict";

  /*
  Bullets generalize the idea of "things" that have to be rendered and
  could hit the player. They essentially have only the two methods presented
  above; render and isHitting.

  However, rather than updating them each frame, we know from the beginning
  how to render them at all times and whether they hit the player at any time
  (given the player position). Which is why the render and inHitting methods
  depend on time, and do not change internal state.

  Various bullet methods are presented to help create more sofisticated bullets,
  such as groups of bullets (after all, a group of bullet has to be rendered,
  and could hit the player), or bullets that die (are only rendered before a
  certain point in time), etc.
  */

  class Bullet {
    constructor (render, isHitting) {
      this.render = render;
      this.isHitting = isHitting;
    }

    // Bullet altering functions.
    after(pose) {
      const oldRender = this.render;
      const oldHitting = this.isHitting;

      this.render = (t) => {
        if (t > pose.t) {
          oldRender(t);
        }
      };

      this.isHitting = (t, point) => {
        if (t > pose.t) {
          return oldHitting(t, point);
        }
        else {
          return false;
        }
      }

      return this;
    }

    before(pose) {
      const oldRender = this.render;
      const oldHitting = this.isHitting;

      this.render = (t) => {
        if (t < pose.t) {
          oldRender(t);
        }
      };

      this.isHitting = (t, point) => {
        if (t < pose.t) {
          return oldHitting(t, point);
        }
        else {
          return false;
        }
      }

      return this;
    }

    between(pose1, pose2) {
      const oldRender = this.render;
      const oldHitting = this.isHitting;

      this.render = (t) => {
        if (t > pose1.t && t < pose2.t) {
          oldRender(t);
        }
      };

      this.isHitting = (t, point) => {
        if (t > pose1.t && t < pose2.t) {
          return oldHitting(t, point);
        }
        else {
          return false;
        }
      }

      return this;
    }

    lifespan(pose, life) {
      const oldRender = this.render;
      const oldHitting = this.isHitting;

      this.render = (t) => {
        if (t > pose.t && t < pose.t + life) {
          oldRender(t);
        }
      };

      this.isHitting = (t, point) => {
        if (t > pose.t && t < pose.t + life) {
          return oldHitting(t, point);
        }
        else {
          return false;
        }
      }

      return this;
    }

    // Bullet grouping functions.
    static group(bullets) {
      return new Bullet(
        // Render
        (t) => {
          for (let bullet of bullets) {
            bullet.render(t);
          }
        },

        // isHitting
        (t, point) => {
          for (let bullet of bullets) {
            if ( bullet.isHitting(t, point) ) {
              return true
            }
          }
          return false
        }
      );
    }

    static range(n, bulletGenerator) {
      return Bullet.group(
        Array.from( {length: n},
          (v, k) => bulletGenerator(k)
        )
      );
    }

    static reverseRange(n, bulletGenerator) {
      return Bullet.group(
        Array.from( {length: n},
          (v, k) => bulletGenerator(n - k)
        )
      );
    }

    static lifeRange(n, lifespan, t0, bulletGenerator) {
      return new Bullet (
        // Render
        (t) => {
          for (var k = Math.floor((t-t0-lifespan)*n/lifespan); k <= (t-t0)*n/lifespan; k++) {
            bulletGenerator(k, lifespan*k/n).render(t);
          }
        },
        // isHitting
        (t,p) => {
          for (var k = Math.floor((t-t0-lifespan)*n/lifespan); k <= (t-t0)*n/lifespan; k++) {
            if(bulletGenerator(k, lifespan*k/n).isHitting(t,p)) {
              return true;
            }
          }
          return false;
        }
      )
    };

    // Miscellaneous static methods.

    static updating(bulletGenerator) {
      return new Bullet(
        // Render.
        (t) => {
          bulletGenerator().render(t);
        },
        // isHitting
        (t,p) => {
          return bulletGenerator().isHitting(t,p);
        }
      )
    }

    static updateAt(updateTime, bulletGenerator) {
      let updated = false;
      let cache = Bullet.nullBullet();
      return new Bullet(
        // Render.
        (t) => {
          if (!updated && t > updateTime) {
            updated = true;
            cache = bulletGenerator();
          }
          cache.render(t);
        },
        // isHitting
        (t,p) => {
          return cache.isHitting(t,p);
        }
      )

    }

    static nullBullet() {
      return new Bullet(
        // render
        (t) => {/* Do nothing. */},

        // isHitting
        (t, point) => false
      )
    }
  }

  class StaticBullet {
    constructor (render, isHitting) {
      this.render = render;
      this.isHitting = isHitting;
    }

    withMovement(movement) {
      return new Bullet(
        // Render
        (t) => {
          this.render(movement(t));
        },

        // isHitting
        (t, point) => {
          return this.isHitting(movement(t), point);
        }
      );
    }
  }

global.Bullet = Bullet;
global.StaticBullet = StaticBullet;

})(this);
