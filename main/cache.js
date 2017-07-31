((global) => {
  "use strict";

  var assetSources;
  var cache;

  // Asset Sources.
  // Add here any extra assets.
  assetSources = {
    "player" : {
      src : "./assets/player.svg",
      width: 40,
      height: 40
    },
    "bullet" : {
      src : "./assets/bullet_c.svg",
      width: 40,
      height: 40
    },
    "bullet2" : {
      src : "./assets/bullet_c2.svg",
      width: 40,
      height: 40
    },
    "bullet3" : {
      src : "./assets/bullet_c3.svg",
      width: 40,
      height: 40
    },
    "sbullet" : {
      src : "./assets/bullet_s.svg",
      width: 40,
      height: 40
    },
    "sbullet2" : {
      src : "./assets/bullet_ss.svg",
      width: 40,
      height: 40
    },
    "boss" : {
      src : "./assets/boss.svg",
      width: 50,
      height: 70
    },

    "building" : {
      src : "./assets/building.svg",
      width: 100,
      height: 200
    },
    "rhombus_1" : {
      src : "./assets/rhombus_1.svg",
      width: 40,
      height: 40
    },
    "circle" : {
      src : "./assets/circle_p.svg",
      width: 40,
      height: 40
    },
    "square" : {
      src : "./assets/square_p.svg",
      width: 40,
      height: 40
    },
    "triangle" : {
      src : "./assets/triangle_p.svg",
      width: 40,
      height: 40
    },
    "rhombus" : {
      src : "./assets/rhombus_p.svg",
      width: 40,
      height: 40
    },
    /*"circle_stroke" : {
      src : "./assets/circle_stroke.svg",
      width: 40,
      height: 40
    },
    "circle_fill" : {
      src : "./assets/circle_fill.svg",
      width: 40,
      height: 40
    },
    "dart_stroke" : {
      src : "./assets/dart_stroke.svg",
      width: 40,
      height: 40
    },
    "dart_fill" : {
      src : "./assets/dart_fill.svg",
      width: 40,
      height: 40
    },
    "player_stroke" : {
      src : "./assets/player_stroke.svg",
      width: 40,
      height: 40
    },
    "player_fill" : {
      src : "./assets/player_fill.svg",
      width: 40,
      height: 40
    },
    "rhombus_1" : {
      src : "./assets/rhombus_1.svg",
      width: 40,
      height: 40
    },
    "rhombus_2" : {
      src : "./assets/rhombus_2.svg",
      width: 40,
      height: 40
    },
    "rhombus_3" : {
      src : "./assets/rhombus_3.svg",
      width: 40,
      height: 40
    },
    "rhombus_4" : {
      src : "./assets/rhombus_4.svg",
      width: 40,
      height: 40
    }
  */};

  // Initialize Cache, a dictionary of canvases.
  cache = {}

  // Create images for each source.
  Object
    .keys(assetSources)
    .forEach((key, index) => {
      var img;

      // Creates a canvas to cache the image.
      cache[key] = document.createElement('canvas');
      cache[key].width = assetSources[key].width;
      cache[key].height = assetSources[key].height;

      // Load image.
      img = new Image();
      img.src = assetSources[key].src;

      img.onload = () => {
        // Caches image by drawing it into its cache canvas.
        cache[key]
          .getContext("2d")
          .drawImage(
            img, 0, 0,
            assetSources[key].width,
            assetSources[key].height
          );
      };
    })

  global.cache = cache;

  global.levels = [];

})(this);
