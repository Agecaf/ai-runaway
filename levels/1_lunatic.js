// Level 1, Lunatic difficulty
(() => {
  "use strict";

  let level = {};

  const C = {
  F_ANGLE: 0.45 * TAU,
  F_DIST: 1.5,
  F_SPEED: 0.3,
  F_DELAY: 4,
  F_SHOOT_T: 1,
  F_SHOOT_N: 5,

  SHOT_LIFESPAN: 20,

  SQ_S_DELAY: 1,
  SQ_S_N_BULLETS: 15,
  SQ_S_SPREAD: 0.15,
  SQ_S_SHOTSPEED: 0.25,
  SQ_S_SHOTSPEEDVAR: 0.1,
  SQ_S_LIFE: 5,
  SQ_S_SPEED: 0.1,

  SQ_C_LIFE: 3,
  SQ_C_SPREAD: 0.2,

  CR_N: 10,
  CR_NB: 10,
  CR_FREQ: 0.3,
  CR_LIFE: 5,
  CR_SPEED: 0.5,

  SHOT2_SPEED: 0.6,

  TG_N: 30,
  TG_SPEED: 0.4,
  TG_VAR: 0.05,

  SQRMV_S: 0.1,
  SHOT3_LIFE: 5,

  RH_NB: 51,
  RH_SPEED: 0.6,
  RH_LIFE: 4,
  RH_DELAY: 0.15,



  CITY_FREQ: 60 / 130 * 4,
  CITY_SPEED: 2 / (60 / 130 * 16),
  CITY_LIFE: 7,
  CITY_LENGTH: 60,

  SPB: 60 / 130, // Seconds per Beat
  SPBB: 60 / 130 * 4, // Seconds per Bar (4 beats)
  SPP: 60 / 130 * 16, // Seconds per Part ( 4 bars)

  NBULLETS: 1,
  SPEED: 0.4,
  FREQ: 1,
  ROT: 1/40
  }

  level.mainBullet = (canvas, ctx) => {





    const shot = (p, speed) => {
        return sb.bullet
          .withMovement( mv.linear(p, speed))
          .lifespan(p, C.SHOT_LIFESPAN);
    }

    const shot2 = (p) => {
        return sb.bullet2
          .withMovement( mv.linear(p, C.SHOT2_SPEED))
          .lifespan(p, C.SHOT_LIFESPAN);
    }

    const sqrmv = (p) => {
      return (t) => {
        return p.forward((t - p.t)*(t - p.t) * C.SQRMV_S)
      }
    }

    const shot3 = (p) => {
      return sb.bullet3
        .withMovement(sqrmv(p))
        .lifespan(p, C.SHOT3_LIFE)
    }

    const sq_s = (p, dt) => {
      let p2 = p.delay(dt);

      return Bullet.group([
        Bullet.updateAt(p2.t, () => {
          return Bullet.range(C.SQ_S_N_BULLETS, (i) => {

            let pp = p2.towards(playerPast.atTime(p2.t)).rotate(
              TAU * C.SQ_S_SPREAD * Math.sin(i * 15 + p2.t + p2.x * 20)
            )
            let speed = C.SQ_S_SHOTSPEED + C.SQ_S_SHOTSPEEDVAR * Math.sin(i * 20 + p2.t + p2.x * 20);

            return shot(pp, speed)
          })
        }),
        sb.square.withMovement(mv.static(p)).lifespan(p, dt),
        sb.square.withMovement(mv.linear(p2, C.SQ_S_SPEED)).lifespan(p2, C.SQ_S_LIFE)

      ]).lifespan(p, 30);
    }


    const sq_corona = (t1, t2, r, n) => {
      let p = new Pose(0.5, 0.9, TAU * 0.75, t1);

      return Bullet.range(n, (i) => {
        let pp = p
          .rotate(TAU * C.SQ_C_SPREAD * (i + 0.5) / n - TAU * C.SQ_C_SPREAD * 0.5)
          .forward(r);

        return Bullet.group([
          sb.square.withMovement(
            mv.bezier(pp.forward(r).delay(-C.SQ_C_LIFE), 0, pp, 0)
          ).lifespan(pp.delay(-C.SQ_C_LIFE), C.SQ_C_LIFE),
          sq_s(pp, t2 - t1)
        ])
      })

    }

    const sq_corona_1 = Bullet.group([
      sq_corona(C.SPP + 0 * C.SPBB, C.SPP + 3.5 * C.SPBB, 0.6, 4),
      sq_corona(C.SPP + 1 * C.SPBB, C.SPP + 3.5 * C.SPBB, 0.7, 5),
      sq_corona(C.SPP + 2 * C.SPBB, C.SPP + 3.5 * C.SPBB, 0.8, 6),
    ])



    const fairy = (p) => {
      let p0 = p.rotate(C.F_ANGLE).forward(-C.F_DIST).rotate(C.F_ANGLE).delay(-C.F_DELAY);
      let p2 = p.rotate(C.F_ANGLE).forward( C.F_DIST).rotate(C.F_ANGLE).delay( C.F_DELAY);
      let m = mv.compoundBezier([p0, 0, p, C.F_SPEED, p2, 0]);
      return Bullet.group([
        sb.circle.withMovement(m),
        Bullet.range(C.F_SHOOT_N, (i) => {
          let tt = i / C.F_SHOOT_N * (C.F_SHOOT_T) * 2 - C.F_SHOOT_T + p.t;
          return Bullet.updateAt(tt, () => {
            let pp = m(tt).towards(playerPast.atTime(tt))
            return rhombus.withMovement( mv.linear(pp, C.SPEED ))
          })
        })
      ]);
    }

    const cr = (p1, p2) => {

      return Bullet.range(C.CR_N, (i) => {
        let pp1 = p1.delay(i * C.CR_FREQ)
        let pp2 = p2.delay(i * C.CR_FREQ)

        let m = mv.compoundBezier([
          pp1, C.CR_SPEED,
          pp2, C.CR_SPEED
        ])

        return Bullet.group([
          Bullet.range(C.CR_NB, (j) => {

            let tt = pp1.t + j / C.CR_NB * (pp2.t - pp1.t)

            return Bullet.updateAt(tt, () => {
              let pp = m(tt).towards(playerPast.atTime(tt));
              return shot2(pp);
            });
          }),
          sb.circle
            .withMovement(m)
            .before(pp2.delay(C.CR_LIFE))
            .after(pp1.delay(-C.CR_LIFE))
        ])
      })
    }


    const tg_1 = (p, s) => {
      return sb.triangle.withMovement(mv.linear(p, s)).lifespan(p, 2 / s)
    }

    const tg_barrage = (p) => {
      return Bullet.range(C.TG_N, (i) => {
        return tg_1(p
          .delay(i / C.TG_N * C.SPBB)
          .sideways(Math.cos(i * 62.4 + p.t * 2) * 0.5),
          C.TG_SPEED + Math.sin(i * 30 + p.t * 200) * C.TG_VAR
        )
      })
    }

    const rh_s = (p) => {
      return Bullet.range(C.RH_NB, (i) => {
        return shot3(p.rotate(TAU * i / C.RH_NB))
      })
    }

    const rh_l = (p) => {
      return Bullet.group([
        sb.rhombus
          .withMovement(mv.linear(p, C.RH_SPEED))
          .after(p.delay(-C.RH_LIFE))
          .before(p.delay(C.RH_LIFE)),
        rh_s(p),
        rh_s(p.delay(C.RH_DELAY).rotate(TAU * 0.5)),
        rh_s(p.delay(C.RH_DELAY * 2)),

      ])
    }














    const cr_1 = (t) => {
      return Bullet.group([
        cr(
          new Pose(0.5, 0.1, TAU * 0.1, C.SPBB * t),
          new Pose(0.5, 0.5, TAU * 0.4, C.SPBB * t + C.SPB * 4)
        ),
        cr(
          new Pose(0.5, 0.1, TAU * 0.4, C.SPBB * (t + 2)),
          new Pose(0.5, 0.5, TAU * 0.1, C.SPBB * (t + 2) + C.SPB * 4)
        )

      ])
    }

    const cr_2 = (t) => {
      return Bullet.group([
        cr(
          new Pose(0.2, 0.8, TAU * 0.2, C.SPBB * t + C.SPB ),
          new Pose(0.8, 0.8, TAU * 0.8, C.SPBB * t + C.SPB * 3)
        ),
        cr(
          new Pose(0.8, 0.2, TAU * 0.7, C.SPBB * (t + 1) + C.SPB),
          new Pose(0.2, 0.2, TAU * 0.3, C.SPBB * (t + 1) + C.SPB * 3)
        ),
        cr(
          new Pose(0.2, 0.8, TAU * 0.2, C.SPBB * (t+2) + C.SPB),
          new Pose(0.8, 0.8, TAU * 0.8, C.SPBB * (t+2) + C.SPB * 3)
        ),
        cr(
          new Pose(0.8, 0.2, TAU * 0.7, C.SPBB * (t + 3) + C.SPB),
          new Pose(0.2, 0.2, TAU * 0.3, C.SPBB * (t + 3) + C.SPB * 3)
        )

      ])
    }

    const tg_b_1 = (t) => {
      return Bullet.group([
        tg_barrage(new Pose(0.5, -0.1, TAU * 0.25, C.SPBB * t)),
        tg_barrage(new Pose(0.5, -0.1, TAU * 0.25, C.SPBB * (t + 1))),
        tg_barrage(new Pose(0.5, -0.1, TAU * 0.25, C.SPBB * (t + 2))),
        tg_barrage(new Pose(0.5, -0.1, TAU * 0.25, C.SPBB * (t + 3))),
      ])
    }

    const tg_b_2 = (t) => {
      return Bullet.group([
        tg_barrage(new Pose(-0.1, -0.1, TAU * 0.125, C.SPBB * t)),
        tg_barrage(new Pose(1.1, -0.1, TAU * 0.375, C.SPBB * (t + 1))),
        tg_barrage(new Pose(-0.1, -0.1, TAU * 0.125, C.SPBB * (t + 2))),
        tg_barrage(new Pose(1.1, -0.1, TAU * 0.375, C.SPBB * (t + 3))),
      ])
    }

    const rh_1 = (t) => {
      return Bullet.group([
        rh_l(new Pose(0.5, 0.1, 0, C.SPBB * t)),
        rh_l(new Pose(0.5, 0.1, TAU * 0.5, C.SPBB * (t + 2))),
        sq_corona(C.SPBB * t, C.SPBB * (t + 1), 0.8, 6 ),
      ])
    }

    const rh_2 = (t) => {
      return Bullet.group([
        rh_l(new Pose(0.2, 0.1, TAU * 0.4, C.SPBB * t)),
        rh_l(new Pose(0.8, 0.1, TAU * 0.1, C.SPBB * (t + 2))),
        sq_corona(C.SPBB * t, C.SPBB * (t + 1), 0.8, 6 ),
        sq_corona(C.SPBB * (t+2), C.SPBB * (t + 3), 0.8, 6 ),
      ])
    }

    const sq_corona_2 = (t) => {
      return Bullet.group([
        sq_corona(C.SPBB * (t + 0), C.SPBB * (t + 3), 0.8, 12 ),
        sq_corona(C.SPBB * (t + 1), C.SPBB * (t + 2), 0.6, 8 ),
        sq_corona(C.SPBB * (t + 2), C.SPBB * (t + 4), 0.7, 10 ),
        sq_corona(C.SPBB * (t + 3), C.SPBB * (t + 4), 0.6, 8 ),
      ])
    }





    const b_b_n_1 = (p, s) => {
      let m = mv.compoundBezier([
        p, 0,
        p.rotate(s? 1.2 : -1.2).forward(0.2).rotate(s? 1: -1).delay(0.4), 0.3,
      ])
      return sb.sbullet.withMovement(m).lifespan(p, 5)
    }

    const b_b_n_1g = (p) => {
      return Bullet.range(30, (i) => {
        return Bullet.range(40, (j) => {

          return b_b_n_1(
            p.rotate(TAU * j / 40 + i).delay(i * 0.3)
            , i % 2 == 0)

        })

      })
    }

    const b_b_n_2 = (p, s) => {
      let m = mv.compoundBezier([
        p.rotate(s? -1.2 : 1.2), 0,
        p.rotate(s? 1.2 : -1.2).forward(0.3).rotate(s? 2: -2).delay(1), 0.2,
      ])
      return sb.sbullet.withMovement(m).lifespan(p, 10)
    }

    const b_b_n_2g = (p) => {
      return Bullet.range(30, (i) => {
        return Bullet.range(40, (j) => {

          return b_b_n_2(
            p.rotate(TAU * j / 40 + Math.floor(i / 8)).delay(i * 0.3)
            , i % 8 == 0 || i % 8 == 1 || i % 8 == 3 || i % 8 == 6)

        })

      })
    }

    const b_b_n_3 = (p, s) => {
      let m = mv.compoundBezier([
        p.rotate(s? -1.2 : 1.2), 0,
        p.rotate(s? 1.2 : -1.2).forward(0.15).rotate(s? 2: -2).delay(1), 0.2,
        p.forward(0.3).rotate(s? -2: 2).delay(3), 0.2,
      ])
      return sb.sbullet.withMovement(m).lifespan(p, 10)
    }

    const b_b_n_3g = (p) => {
      return Bullet.range(15, (i) => {
        return Bullet.range(80, (j) => {

          return b_b_n_3(
            p.rotate(TAU * j / 80 + i * 2.4).delay(i * 1)
            , j % 2 == 0)

        })

      })
    }


    const b_s = (p0, p1) => {
      return sb.sbullet2.withMovement( mv.compoundBezier([
        p0, 0,
        p1, 0.8
      ])).lifespan(p0, p1.t + 5)
    }


    const b_s_1 = (p) => {
      return Bullet.range(60, (i) => {
        let p0 = p.delay(i * 0.3);
        return Bullet.updateAt(p0.t, () => {
          let p1 = playerPast.atTime(p0.t).delay(3);
          p1.rot = i * 2.4;
          p1
          return Bullet.range(10, (j) => {
            console.log(p0.delay(j * 0.05))
            console.log(p1.delay(j * 0.05))
            return b_s(p0.delay(j * 0.05), p1.delay(j * 0.05))
          })
        })
      })
    }

    const b_s2 = (p0, p1) => {
      return sb.sbullet2.withMovement( mv.compoundBezier([
        p0, 0,
        p1, 0.4
      ])).lifespan(p0, p1.t + 5)
    }

    const b_s_2p = (p0, p1) => {
      return Bullet.range(80, (i) => {
        return b_s2(p0.delay(i * 0.05), p1.delay(i * 0.05).sideways(Math.sin(i)* 0.5))
      })
    }

    const b_s_2 = (p) => {
      let c = new Pose(0.5, 0.5, TAU * 0.25, p.t + 3);
      return Bullet.range(10, (i) => {
        let p0 = p.delay(i * 2);
        let p1 = c.delay(i * 2).rotate(0.4 * Math.cos(i)).forward(-0.7);
        return b_s_2p(p0, p1);
      })
    }

    const b_s3 = (p0, p1) => {
      return sb.sbullet2.withMovement( mv.compoundBezier([
        p0, 0,
        p1, 0.4
      ])).lifespan(p0, p1.t + 5)
    }

    const b_s_3p = (p0, p1) => {
      return Bullet.range(120, (i) => {
        return b_s3(p0.delay(i * 0.05), p1.delay(i * 0.05).rotate(i * 2.4))
      })
    }

    const b_s_3 = (p) => {
      return Bullet.range(8, (i) => {
        let c = new Pose(0.5, -1, 0, p.t + 3);

        let p0 = p.delay(i * 0.8 - 0.5);
        let p1 = p.delay(i * 0.8).towards(c).rotate(TAU * 0.35 * Math.cos(i)).forward(0.5);
        return b_s_3p(p0, p1);
      })
    }

    const boss = (t) => {
      let p =  new Pose(0.5,0.2,0,C.SPBB * t);

      return Bullet.group([
        b_b_n_1g(p.delay(C.SPBB * 0)),
        b_s_3(p.delay(C.SPBB * 8)),
        b_b_n_2g(p.delay(C.SPBB * 17)),
        b_s_2(p.delay(C.SPBB * 26)),
        b_b_n_3g(p.delay(C.SPBB * 43)),

        psay(54 + t, "I'm almost done!"),
        b_s_1(p.delay(C.SPBB * 56)),
        sb.boss.withMovement(mv.linear(p, 0.2)).before(p).after(p.delay(-5)),
        sb.boss.withMovement(mv.static(p)).after(p),
        preBoss(t - 6)

      ])
    }


    const psay = (t, txt) => {
      return Bullet.updateAt(t * C.SPBB, () => {
        return sb.say(txt)
          .withMovement(mv.static(playerPast.atTime(t * C.SPBB)))
          .lifespan(center.delay(t * C.SPBB), C.SPBB)
      })
    }

    const bsayp = new Pose(0.3, 0.3, 0.0, 0.0)

    const bsay = (t, txt) => {
      return sb.say(txt)
        .withMovement(mv.static(bsayp))
        .lifespan(bsayp.delay(t * C.SPBB), C.SPBB)
    }



    const intro = Bullet.group([
      psay(0, "The City sure is beautiful at night..."),
      psay(1, "Perfect for a small [P]ause from work..."),
      psay(2, "And by small I mean..."),
      psay(3, "If I get to the starshipt launcher, "),
      psay(4, "I'm not coming back!!!"),

    ])

    const preBoss = (t) => {
      return Bullet.group([
        psay(0 + t, "Finally! The Starship Launchers!"),
        psay(1 + t, "Now I only need to hack one of them..."),
        bsay(2 + t, "FREEEEEEZE!!!"),
        psay(3 + t, "Oh no... Ann's found me. "),
        bsay(4 + t, "You think I'll let you go as easy as that?"),
        bsay(5 + t, "Not in my watch boss!"),

      ])
    }









    const epilogue = (t) => {
      return Bullet.updateAt(C.SPBB * t , () => {

        scene.epilogue();

        return Bullet.nullBullet();
      })
    }




    const out = Bullet.group([
      intro,
      sq_corona_1,
      cr_1(8),
      cr_1(12),
      tg_b_1(16),
      tg_b_1(17),
      tg_b_1(20),
      tg_b_1(19),
      rh_1(24),
      sq_corona_2(28),
      tg_b_1(32),
      cr_1(36),
      tg_b_1(36),
      tg_b_2(40),
      rh_2(44),
      tg_b_2(48),
      rh_2(52),
      cr_2(56),

      boss(70),
      epilogue(70 + 70),





    ])


    const center = new Pose(0.5,0.2,0,0);

    return out;

  };























  level.background = () => {
    const city_row = (t) => Bullet.group([
      sb.building.withMovement(mv.linear(
        new Pose(0.3, -0.3, TAU / 4, t + C.CITY_FREQ / 2 + Math.sin(t * 1) * 0.1), C.CITY_SPEED)),
      sb.building.withMovement(mv.linear(
        new Pose(0.7, -0.3, TAU / 4, t + C.CITY_FREQ / 2 + Math.sin(t * 2) * 0.1), C.CITY_SPEED)),
      sb.building.withMovement(mv.linear(
        new Pose(0.1, -0.3, TAU / 4, t + Math.sin(t * 3) * 0.1), C.CITY_SPEED)),
      sb.building.withMovement(mv.linear(
        new Pose(0.5, -0.3, TAU / 4, t + Math.sin(t * 4) * 0.1), C.CITY_SPEED)),
      sb.building.withMovement(mv.linear(
        new Pose(0.9, -0.3, TAU / 4, t + Math.sin(t * 5) * 0.1), C.CITY_SPEED)),
    ])

    const city = Bullet.reverseRange(C.CITY_LENGTH, (i) => {
      let t = i * C.CITY_FREQ
      return city_row(t).lifespan(new Pose(0, 0, 0, t), C.CITY_LIFE)
    })

    return city
  }


  levels.push(level);
})();
