(() => {
  "use strict";

  // ---------------------------------------------------------------------------
  // Configuracion
  // ---------------------------------------------------------------------------

  const CONFIG = {
    width: 432,
    height: 768,
    groundHeight: 94,
    playerX: 106,
    gravity: 1280,
    jumpVelocity: -390,
    terminalVelocity: 680,
    baseSpeed: 138,
    maxSpeed: 255,
    obstacleWidth: 72,
    minGap: 168,
    maxGap: 214,
    spawnMin: 278,
    spawnMax: 352,
    hitboxPadding: 9,
    localStorageKey: "flappy-curro-sevilla-record",
    bankStorageKey: "flappy-curro-sevilla-botellines-banco",
    curiosityStorageKey: "flappy-curro-sevilla-curiosidades",
    curiosityCost: 4,
    assetPaths: {
      curro: "assets/sprites/curro.png",
      giralda: "assets/sprites/giralda.png",
      torreOro: "assets/sprites/torre_del_oro.png",
      torrePelli: "assets/sprites/torre_pelli.png",
      fondo: "assets/sprites/fondo_sevilla.png",
      puertaJerez: "assets/sprites/puerta_jerez.png",
      fuenteHispalis: "assets/sprites/fuente_hispalis.png",
      plazaBonus: "assets/sprites/plaza_espana_bonus.png",
      suelo: "assets/sprites/suelo.png"
    },
    soundPaths: {
      jump: "assets/sounds/jump.wav",
      hit: "assets/sounds/hit.wav",
      score: "assets/sounds/score.wav",
      music: "assets/sounds/himno_sevilla.mp3"
    },
    backgroundDimOpacity: 0.3,
    musicVolume: 0.14
  };

  const GameState = Object.freeze({
    LOADING: "loading",
    START: "start",
    COLLECTION: "collection",
    SHOP: "shop",
    PLAYING: "playing",
    PAUSED: "paused",
    GAME_OVER: "gameOver"
  });

  const ObstacleKinds = [
    "giralda",
    "torreOro",
    "torrePelli",
    "columna",
    "farola",
    "ensaladilla"
  ];

  const Locations = [
    {
      id: "guadalquivir",
      name: "Ribera del Guadalquivir",
      minScore: 0,
      backgroundKey: null,
      curiosities: [
        {
          id: "guadalquivir-navegable",
          title: "Puerto interior",
          text: "El Guadalquivir hizo de Sevilla un puerto interior clave para el comercio con America."
        },
        {
          id: "triana-puente",
          title: "Puente de Triana",
          text: "El Puente de Isabel II, conocido como Puente de Triana, es uno de los grandes iconos de la ciudad."
        },
        {
          id: "torre-oro-rio",
          title: "Torre junto al rio",
          text: "La Torre del Oro vigilaba el paso por el rio y formaba parte del sistema defensivo almohade."
        },
        {
          id: "guadalquivir-nao",
          title: "Ruta de navegantes",
          text: "Desde el Guadalquivir salieron y llegaron expediciones, mercancias y relatos que conectaron Sevilla con medio mundo."
        },
        {
          id: "triana-orilla",
          title: "La otra orilla",
          text: "Triana crecio frente al centro historico como barrio de alfareros, marineros y artistas populares."
        },
        {
          id: "azahar-ribera",
          title: "Azahar al rio",
          text: "En primavera, el olor del azahar llega a muchas calles cercanas al rio y forma parte del paisaje sensorial sevillano."
        },
        {
          id: "lonja-indias",
          title: "Archivo de Indias",
          text: "El Archivo de Indias conserva documentos esenciales para entender la relacion de Sevilla con America."
        },
        {
          id: "maestranza-ribera",
          title: "La Maestranza",
          text: "La plaza de toros de la Maestranza se levanta cerca del rio y es una de las estampas mas conocidas del Arenal."
        }
      ]
    },
    {
      id: "puerta-jerez",
      name: "Puerta de Jerez",
      minScore: 5,
      backgroundKey: "puertaJerez",
      curiosities: [
        {
          id: "puerta-jerez-hispalis",
          title: "Fuente de Hispalis",
          text: "La fuente de Puerta de Jerez representa a Hispalis, nombre romano de Sevilla."
        },
        {
          id: "puerta-jerez-paso",
          title: "Puerta historica",
          text: "Puerta de Jerez recuerda una antigua entrada de la muralla que comunicaba la ciudad con el camino hacia Jerez."
        },
        {
          id: "puerta-jerez-centro",
          title: "Cruce de caminos",
          text: "Hoy es una zona de paso entre el centro historico, el Alcazar, la Catedral y el rio."
        },
        {
          id: "puerta-jerez-metro",
          title: "Kilometro urbano",
          text: "Puerta de Jerez conecta tranvia, metro y calles peatonales, por eso funciona como una pequena puerta moderna a Sevilla."
        },
        {
          id: "puerta-jerez-hotel-alfonso",
          title: "Vecino ilustre",
          text: "Muy cerca esta el Hotel Alfonso XIII, construido para recibir visitantes de la Exposicion Iberoamericana."
        },
        {
          id: "puerta-jerez-palmeras",
          title: "Palmeras y sombra",
          text: "Las palmeras de la zona ayudan a reconocer el caracter calido y monumental de esta entrada al casco historico."
        },
        {
          id: "puerta-jerez-tranvia",
          title: "Tranvia al centro",
          text: "El tranvia que pasa por Puerta de Jerez enlaza esta zona con la avenida de la Constitucion y el casco monumental."
        }
      ]
    },
    {
      id: "fuente-hispalis",
      name: "Fuente de Hispalis",
      minScore: 8,
      backgroundKey: "fuenteHispalis",
      curiosities: [
        {
          id: "hispalis-romana",
          title: "Nombre romano",
          text: "Hispalis fue el nombre romano de Sevilla antes de convertirse en una gran ciudad andalusi y cristiana."
        },
        {
          id: "hispalis-escultura",
          title: "Alegoria de Sevilla",
          text: "La figura central de la fuente es una alegoria clasica de la ciudad, rodeada de surtidores y esculturas."
        },
        {
          id: "hispalis-puerta-jerez",
          title: "Entrada monumental",
          text: "El entorno mezcla arquitectura regionalista, palmeras, hoteles historicos y edificios vinculados al casco antiguo."
        },
        {
          id: "hispalis-agua",
          title: "Agua en movimiento",
          text: "Los surtidores de la fuente dan vida a la plaza y la convierten en un punto de encuentro muy fotografiado."
        },
        {
          id: "hispalis-muralla",
          title: "Memoria de muralla",
          text: "Aunque la puerta fisica desaparecio, el nombre conserva la memoria de las antiguas defensas de Sevilla."
        },
        {
          id: "hispalis-paseo",
          title: "Camino al Alcazar",
          text: "Desde esta zona se llega caminando en pocos minutos al Archivo de Indias, la Catedral y el Real Alcazar."
        },
        {
          id: "hispalis-luz",
          title: "Luz sevillana",
          text: "La fuente cambia mucho segun la hora: al atardecer, la piedra y el agua toman tonos dorados muy caracteristicos."
        }
      ]
    },
    {
      id: "plaza-espana",
      name: "Plaza de Espana",
      minScore: 11,
      backgroundKey: "plazaBonus",
      curiosities: [
        {
          id: "plaza-1929",
          title: "Expo de 1929",
          text: "La Plaza de Espana fue construida para la Exposicion Iberoamericana de 1929."
        },
        {
          id: "plaza-provincias",
          title: "Bancos provinciales",
          text: "Sus bancos de azulejos representan provincias espanolas con escenas historicas y mapas."
        },
        {
          id: "plaza-canal",
          title: "Canal navegable",
          text: "El canal semicircular de la plaza se cruza por puentes que simbolizan antiguos reinos de Espana."
        },
        {
          id: "plaza-ladrillo",
          title: "Ladrillo y ceramica",
          text: "La plaza combina ladrillo visto, ceramica y hierro forjado, materiales muy reconocibles del regionalismo sevillano."
        },
        {
          id: "plaza-cine",
          title: "Escenario de cine",
          text: "Su aspecto monumental ha servido como escenario para varias peliculas internacionales."
        },
        {
          id: "plaza-parque",
          title: "Junto a Maria Luisa",
          text: "La Plaza de Espana esta integrada en el entorno del Parque de Maria Luisa, uno de los grandes pulmones verdes de Sevilla."
        },
        {
          id: "plaza-vicente-traver",
          title: "Arquitectura regionalista",
          text: "El conjunto de la Plaza de Espana es una de las grandes obras del regionalismo sevillano de comienzos del siglo XX."
        },
        {
          id: "plaza-azulejos",
          title: "Azulejos viajeros",
          text: "Muchos visitantes buscan el banco de su provincia y se hacen una foto como pequeno ritual dentro de la plaza."
        }
      ]
    }
  ];

  const dom = {
    canvas: document.getElementById("game-canvas"),
    startScreen: document.getElementById("start-screen"),
    collectionScreen: document.getElementById("collection-screen"),
    collectionList: document.getElementById("collection-list"),
    collectionStats: document.getElementById("collection-stats"),
    shopScreen: document.getElementById("shop-screen"),
    shopList: document.getElementById("shop-list"),
    shopBank: document.getElementById("shop-bank"),
    shopMessage: document.getElementById("shop-message"),
    hud: document.getElementById("hud"),
    pauseScreen: document.getElementById("pause-screen"),
    gameOverScreen: document.getElementById("game-over-screen"),
    fadeLayer: document.getElementById("fade-layer"),
    scoreValue: document.getElementById("score-value"),
    scoreBottles: document.getElementById("score-bottles"),
    bestValue: document.getElementById("best-value"),
    beerBankValue: document.getElementById("beer-bank-value"),
    locationHudValue: document.getElementById("location-hud-value"),
    finalScoreValue: document.getElementById("final-score-value"),
    finalScoreBottles: document.getElementById("final-score-bottles"),
    finalBestValue: document.getElementById("final-best-value"),
    locationValue: document.getElementById("location-value"),
    finalBankValue: document.getElementById("final-bank-value"),
    playButton: document.getElementById("play-button"),
    shopButton: document.getElementById("shop-button"),
    shopBackButton: document.getElementById("shop-back-button"),
    collectionButton: document.getElementById("collection-button"),
    collectionBackButton: document.getElementById("collection-back-button"),
    pauseButton: document.getElementById("pause-button"),
    resumeButton: document.getElementById("resume-button"),
    pauseRestartButton: document.getElementById("pause-restart-button"),
    restartButton: document.getElementById("restart-button")
  };

  const ctx = dom.canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;

  const math = {
    clamp(value, min, max) {
      return Math.max(min, Math.min(max, value));
    },
    rand(min, max) {
      return min + Math.random() * (max - min);
    },
    randInt(min, max) {
      return Math.floor(math.rand(min, max + 1));
    },
    choose(list) {
      return list[Math.floor(Math.random() * list.length)];
    },
    rectsOverlap(a, b) {
      return (
        a.x < b.x + b.w &&
        a.x + a.w > b.x &&
        a.y < b.y + b.h &&
        a.y + a.h > b.y
      );
    }
  };

  // ---------------------------------------------------------------------------
  // Assets
  // ---------------------------------------------------------------------------

  class AssetManager {
    constructor(paths) {
      this.paths = paths;
      this.images = {};
    }

    load() {
      const jobs = Object.entries(this.paths).map(([name, path]) => {
        return new Promise((resolve) => {
          const image = new Image();
          image.onload = () => {
            this.images[name] = image;
            resolve();
          };
          image.onerror = () => {
            this.images[name] = null;
            resolve();
          };
          image.src = path;
        });
      });

      return Promise.all(jobs);
    }

    get(name) {
      return this.images[name] || null;
    }
  }

  class AudioManager {
    constructor(paths) {
      this.paths = paths;
      this.files = {};
      this.music = null;
      this.context = null;
      this.unlocked = false;
      this.enabled = true;
    }

    load() {
      Object.entries(this.paths).forEach(([name, path]) => {
        const audio = new Audio(path);
        audio.preload = "auto";
        if (name === "music") {
          audio.loop = true;
          audio.volume = CONFIG.musicVolume;
          this.music = audio;
        }
        this.files[name] = audio;
      });
    }

    unlock() {
      if (this.unlocked) return;

      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.context = this.context || new AudioContext();
        if (this.context.state === "suspended") {
          this.context.resume();
        }
      }
      this.unlocked = true;
    }

    playMusic() {
      if (!this.enabled || !this.music) return;

      this.music.volume = CONFIG.musicVolume;
      if (!this.music.paused) return;

      this.music.play().catch(() => {
        // En movil el navegador solo deja iniciar musica tras una interaccion real.
      });
    }

    pauseMusic() {
      if (this.music && !this.music.paused) {
        this.music.pause();
      }
    }

    play(name) {
      if (!this.enabled) return;

      const file = this.files[name];
      if (file) {
        file.currentTime = 0;
        file.play().catch(() => {
          // Fallback sintetico si el navegador bloquea o falta el archivo real.
          this.playSynth(name);
        });
        return;
      }

      this.playSynth(name);
    }

    playGameOver() {
      this.playSynth("gameOver");
    }

    playSynth(name) {
      if (!this.context) return;

      const now = this.context.currentTime;
      const osc = this.context.createOscillator();
      const gain = this.context.createGain();
      osc.connect(gain);
      gain.connect(this.context.destination);

      if (name === "jump") {
        osc.type = "square";
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.exponentialRampToValueAtTime(850, now + 0.09);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.13);
      } else if (name === "score") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(740, now);
        osc.frequency.setValueAtTime(988, now + 0.07);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        osc.start(now);
        osc.stop(now + 0.2);
      } else {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.exponentialRampToValueAtTime(70, now + 0.25);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc.start(now);
        osc.stop(now + 0.3);
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Score manager
  // ---------------------------------------------------------------------------

  class ScoreManager {
    constructor() {
      this.score = 0;
      this.best = this.readBest();
      this.bank = this.readNumber(CONFIG.bankStorageKey);
      this.unlockedCuriosities = new Set(this.readUnlockedCuriosities());
    }

    readBest() {
      return this.readNumber(CONFIG.localStorageKey);
    }

    readNumber(key) {
      try {
        const raw = window.localStorage.getItem(key);
        const value = Number.parseInt(raw || "0", 10);
        return Number.isFinite(value) ? value : 0;
      } catch (error) {
        return 0;
      }
    }

    readUnlockedCuriosities() {
      try {
        const raw = window.localStorage.getItem(CONFIG.curiosityStorageKey);
        const parsed = JSON.parse(raw || "[]");
        return Array.isArray(parsed) ? parsed : [];
      } catch (error) {
        return [];
      }
    }

    writeNumber(key, value) {
      try {
        window.localStorage.setItem(key, String(value));
      } catch (error) {
        // El juego puede ejecutarse aunque el navegador bloquee localStorage.
      }
    }

    writeUnlockedCuriosities() {
      try {
        window.localStorage.setItem(
          CONFIG.curiosityStorageKey,
          JSON.stringify(Array.from(this.unlockedCuriosities))
        );
      } catch (error) {
        // Las curiosidades siguen funcionando durante la sesion aunque no persistan.
      }
    }

    reset() {
      this.score = 0;
    }

    addPoint() {
      this.score += 1;
      this.bank += 1;
      this.writeNumber(CONFIG.bankStorageKey, this.bank);

      if (this.score > this.best) {
        this.best = this.score;
        this.writeNumber(CONFIG.localStorageKey, this.best);
      }
    }

    canSpend(amount) {
      return this.bank >= amount;
    }

    spend(amount) {
      if (!this.canSpend(amount)) return false;
      this.bank -= amount;
      this.writeNumber(CONFIG.bankStorageKey, this.bank);
      return true;
    }

    hasCuriosity(id) {
      return this.unlockedCuriosities.has(id);
    }

    unlockCuriosity(id) {
      this.unlockedCuriosities.add(id);
      this.writeUnlockedCuriosities();
    }
  }

  // ---------------------------------------------------------------------------
  // Player y fisica
  // ---------------------------------------------------------------------------

  class Player {
    constructor() {
      this.width = 52;
      this.height = 44;
      this.reset();
    }

    reset() {
      this.x = CONFIG.playerX;
      this.y = CONFIG.height * 0.45;
      this.velocity = 0;
      this.rotation = 0;
      this.flapTime = 0;
      this.idleTime = 0;
      this.alive = true;
    }

    flap() {
      this.velocity = CONFIG.jumpVelocity;
      this.flapTime = 0.17;
    }

    update(dt, active) {
      this.idleTime += dt;

      if (active) {
        this.velocity = math.clamp(
          this.velocity + CONFIG.gravity * dt,
          -900,
          CONFIG.terminalVelocity
        );
        this.y += this.velocity * dt;
      } else {
        this.y += Math.sin(this.idleTime * 4) * 0.08;
      }

      this.flapTime = Math.max(0, this.flapTime - dt);
      const targetRotation = math.clamp(this.velocity / 520, -0.55, 1.08);
      this.rotation += (targetRotation - this.rotation) * Math.min(1, dt * 9);
    }

    getHitbox() {
      const pad = CONFIG.hitboxPadding;
      return {
        x: this.x - this.width * 0.5 + pad,
        y: this.y - this.height * 0.5 + pad,
        w: this.width - pad * 2,
        h: this.height - pad * 2
      };
    }
  }

  // ---------------------------------------------------------------------------
  // Particulas
  // ---------------------------------------------------------------------------

  class ParticleSystem {
    constructor() {
      this.particles = [];
      this.ambientTimer = 0;
    }

    reset() {
      this.particles.length = 0;
      this.ambientTimer = 0;
    }

    emitJump(x, y) {
      for (let i = 0; i < 12; i += 1) {
        this.particles.push({
          x: x - 18 + math.rand(-6, 8),
          y: y + math.rand(-12, 14),
          vx: math.rand(-95, -35),
          vy: math.rand(-85, 45),
          size: math.randInt(2, 4),
          life: math.rand(0.24, 0.42),
          maxLife: 0.42,
          color: math.choose(["#fff5c6", "#ffcf55", "#f07134", "#f7f1dc"])
        });
      }
    }

    emitHit(x, y) {
      for (let i = 0; i < 26; i += 1) {
        this.particles.push({
          x,
          y,
          vx: math.rand(-190, 190),
          vy: math.rand(-240, 110),
          size: math.randInt(2, 5),
          life: math.rand(0.32, 0.72),
          maxLife: 0.72,
          color: math.choose(["#fff4ce", "#ec5337", "#323232", "#f8be48"])
        });
      }
    }

    update(dt, speed) {
      this.ambientTimer -= dt;
      if (this.ambientTimer <= 0 && this.particles.length < 110) {
        this.ambientTimer = math.rand(0.18, 0.36);
        this.particles.push({
          x: CONFIG.width + 8,
          y: math.rand(90, CONFIG.height - CONFIG.groundHeight - 100),
          vx: -speed * math.rand(0.22, 0.4),
          vy: math.rand(-10, 10),
          size: math.randInt(2, 3),
          life: math.rand(2.2, 3.5),
          maxLife: 3.5,
          color: math.choose(["#fff2ad", "#f8a145", "#ffffff"])
        });
      }

      for (let i = this.particles.length - 1; i >= 0; i -= 1) {
        const p = this.particles[i];
        p.life -= dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += 120 * dt;
        if (p.life <= 0 || p.x < -20 || p.y > CONFIG.height + 20) {
          this.particles.splice(i, 1);
        }
      }
    }

    draw(context) {
      for (let i = 0; i < this.particles.length; i += 1) {
        const p = this.particles[i];
        const alpha = math.clamp(p.life / p.maxLife, 0, 1);
        context.globalAlpha = alpha;
        context.fillStyle = p.color;
        context.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
      }
      context.globalAlpha = 1;
    }
  }

  // ---------------------------------------------------------------------------
  // Fondo y elementos sevillanos
  // ---------------------------------------------------------------------------

  class Background {
    constructor() {
      this.cloudOffset = 0;
      this.riverOffset = 0;
      this.skylineOffset = 0;
      this.bellsTime = 0;
      this.boats = [
        { x: 60, y: 595, speed: 12, color: "#fff4ce" },
        { x: 312, y: 618, speed: 8, color: "#2d5e7d" }
      ];
      this.fliers = [
        { x: 46, y: 142, speed: 23, flap: 0 },
        { x: 220, y: 102, speed: 18, flap: 0.8 },
        { x: 382, y: 176, speed: 25, flap: 1.6 }
      ];
    }

    reset() {
      this.cloudOffset = 0;
      this.riverOffset = 0;
      this.skylineOffset = 0;
      this.bellsTime = 0;
    }

    update(dt, speed) {
      this.cloudOffset = (this.cloudOffset + dt * speed * 0.08) % CONFIG.width;
      this.riverOffset = (this.riverOffset + dt * speed * 0.24) % 48;
      this.skylineOffset = (this.skylineOffset + dt * speed * 0.14) % CONFIG.width;
      this.bellsTime += dt;

      this.boats.forEach((boat) => {
        boat.x -= boat.speed * dt;
        if (boat.x < -55) boat.x = CONFIG.width + math.rand(20, 130);
      });

      this.fliers.forEach((flier) => {
        flier.x -= flier.speed * dt;
        flier.flap += dt * 8;
        if (flier.x < -30) {
          flier.x = CONFIG.width + math.rand(15, 90);
          flier.y = math.rand(72, 190);
        }
      });
    }
  }

  // ---------------------------------------------------------------------------
  // Obstaculos
  // ---------------------------------------------------------------------------

  class ObstacleManager {
    constructor() {
      this.obstacles = [];
      this.distanceUntilNext = 0;
    }

    reset() {
      this.obstacles.length = 0;
      this.distanceUntilNext = 150;
    }

    update(dt, speed, score) {
      const movement = speed * dt;
      this.distanceUntilNext -= movement;

      if (this.distanceUntilNext <= 0) {
        this.spawn(score);
        this.distanceUntilNext = math.rand(CONFIG.spawnMin, CONFIG.spawnMax);
      }

      for (let i = this.obstacles.length - 1; i >= 0; i -= 1) {
        const obstacle = this.obstacles[i];
        obstacle.x -= movement;
        if (obstacle.x + obstacle.width < -16) {
          this.obstacles.splice(i, 1);
        }
      }
    }

    spawn(score) {
      const gap = math.clamp(CONFIG.maxGap - score * 1.8, CONFIG.minGap, CONFIG.maxGap);
      const topMin = 84;
      const topMax = CONFIG.height - CONFIG.groundHeight - gap - 124;
      const topHeight = math.rand(topMin, Math.max(topMin + 10, topMax));

      this.obstacles.push({
        x: CONFIG.width + 14,
        width: CONFIG.obstacleWidth + math.randInt(-8, 12),
        topHeight,
        gap,
        bottomY: topHeight + gap,
        topKind: math.choose(ObstacleKinds),
        bottomKind: math.choose(ObstacleKinds),
        passed: false,
        sway: Math.random() * Math.PI * 2
      });
    }

  }

  const CollisionManager = {
    world(player) {
      const hitbox = player.getHitbox();
      return (
        hitbox.y <= 0 ||
        hitbox.y + hitbox.h >= CONFIG.height - CONFIG.groundHeight
      );
    },

    obstacles(player, obstacleManager) {
      const hitbox = player.getHitbox();
      const groundTop = CONFIG.height - CONFIG.groundHeight;

      for (let i = 0; i < obstacleManager.obstacles.length; i += 1) {
        const obstacle = obstacleManager.obstacles[i];
        const x = obstacle.x + 7;
        const w = obstacle.width - 14;

        const overlapsX = hitbox.x < x + w && hitbox.x + hitbox.w > x;
        if (!overlapsX) continue;

        const hitsTop = hitbox.y < obstacle.topHeight;
        const hitsBottom = hitbox.y + hitbox.h > obstacle.bottomY && hitbox.y < groundTop;
        if (hitsTop || hitsBottom) return true;
      }
      return false;
    }
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  class Renderer {
    constructor(context, assets) {
      this.ctx = context;
      this.assets = assets;
    }

    clear() {
      this.ctx.clearRect(0, 0, CONFIG.width, CONFIG.height);
    }

    draw(game) {
      this.clear();
      this.drawBackground(game.background, game.time, game.getCurrentLocation());
      this.drawBackgroundFilter();
      this.drawObstacles(game.obstacles, game.time);
      game.particles.draw(this.ctx);
      this.drawPlayer(game.player, game.time, game.state);
      this.drawGround(game.groundOffset);

      if (game.shakeTime > 0) {
        this.drawImpactLines(game.shakeTime);
      }
    }

    drawBackground(background, time, location) {
      const locationBackground = location.backgroundKey
        ? this.assets.get(location.backgroundKey)
        : null;

      if (locationBackground) {
        this.drawCoverImage(locationBackground, background.skylineOffset * 0.05);
        this.drawFliers(background.fliers);
        return;
      }

      this.drawSky();
      this.drawSun(time);
      this.drawClouds(background.cloudOffset);
      this.drawSevillaPanorama(background.skylineOffset, time);
      this.drawBridgeAndRiver(background.riverOffset);
      this.drawBoats(background.boats);
      this.drawFliers(background.fliers);
    }

    drawCoverImage(image, drift) {
      const imageRatio = image.width / image.height;
      const canvasRatio = CONFIG.width / CONFIG.height;
      let sourceWidth = image.width;
      let sourceHeight = image.height;
      let sourceX = 0;
      let sourceY = 0;

      if (imageRatio > canvasRatio) {
        sourceWidth = Math.round(image.height * canvasRatio);
        const travel = image.width - sourceWidth;
        sourceX = Math.round(travel * 0.5 + Math.sin(drift) * travel * 0.08);
      } else {
        sourceHeight = Math.round(image.width / canvasRatio);
        sourceY = Math.round((image.height - sourceHeight) * 0.5);
      }

      this.ctx.drawImage(
        image,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        0,
        0,
        CONFIG.width,
        CONFIG.height
      );
    }

    drawBackgroundFilter() {
      this.ctx.fillStyle = `rgba(26, 20, 28, ${CONFIG.backgroundDimOpacity})`;
      this.ctx.fillRect(0, 0, CONFIG.width, CONFIG.height - CONFIG.groundHeight);

      this.ctx.fillStyle = "rgba(0, 0, 0, 0.12)";
      this.ctx.fillRect(0, 0, CONFIG.width, 230);
    }

    drawSky() {
      const bands = [
        ["#f6a057", 0, 110],
        ["#ed8150", 110, 130],
        ["#d8624a", 240, 120],
        ["#92504b", 360, 120],
        ["#2d6f8f", 480, 90],
        ["#245779", 570, 110]
      ];
      bands.forEach(([color, y, h]) => {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, y, CONFIG.width, h);
      });
    }

    drawSun(time) {
      const x = 348;
      const y = 92 + Math.sin(time * 0.6) * 2;
      this.ctx.fillStyle = "#ffd16d";
      this.ctx.fillRect(x - 28, y - 24, 56, 8);
      this.ctx.fillRect(x - 36, y - 16, 72, 8);
      this.ctx.fillRect(x - 40, y - 8, 80, 24);
      this.ctx.fillRect(x - 32, y + 16, 64, 8);
    }

    drawClouds(offset) {
      this.ctx.fillStyle = "rgba(255, 236, 180, 0.78)";
      const positions = [
        { x: 32, y: 78, w: 74 },
        { x: 188, y: 126, w: 94 },
        { x: 360, y: 58, w: 70 }
      ];

      positions.forEach((cloud) => {
        let x = cloud.x - offset;
        if (x < -120) x += CONFIG.width + 120;
        this.ctx.fillRect(Math.round(x), cloud.y, cloud.w, 8);
        this.ctx.fillRect(Math.round(x + 14), cloud.y - 8, cloud.w - 28, 8);
      });
    }

    drawSevillaPanorama(offset, time) {
      const xShift = -offset;

      this.drawDistantHouses(xShift);
      this.drawPlazaEspana(-18 + xShift, 344, time);
      this.drawPlazaEspana(-18 + xShift + CONFIG.width, 344, time);

      this.drawTinyGiralda(38 + xShift, 226, time);
      this.drawTinyTorreOro(278 + xShift, 386);
      this.drawTinyPelli(350 + xShift, 296);

      this.drawTinyGiralda(38 + xShift + CONFIG.width, 226, time);
      this.drawTinyTorreOro(278 + xShift + CONFIG.width, 386);
      this.drawTinyPelli(350 + xShift + CONFIG.width, 296);
    }

    drawPlazaEspana(x, y, time) {
      const px = Math.round(x);
      const py = Math.round(y);
      const brick = "#a9573f";
      const brickDark = "#6d3b35";
      const tile = "#f0bd77";
      const roof = "#7a3830";
      const glow = Math.sin(time * 2.4) > 0 ? "#ffd36e" : "#c98a4e";

      this.ctx.fillStyle = "#68413e";
      this.ctx.fillRect(px + 28, py + 132, 348, 26);

      this.ctx.fillStyle = brickDark;
      this.ctx.fillRect(px + 26, py + 52, 34, 112);
      this.ctx.fillRect(px + 322, py + 52, 34, 112);
      this.ctx.fillStyle = brick;
      this.ctx.fillRect(px + 30, py + 58, 26, 102);
      this.ctx.fillRect(px + 326, py + 58, 26, 102);

      this.ctx.fillStyle = roof;
      this.ctx.fillRect(px + 22, py + 42, 42, 12);
      this.ctx.fillRect(px + 318, py + 42, 42, 12);
      this.ctx.fillRect(px + 34, py + 28, 18, 14);
      this.ctx.fillRect(px + 330, py + 28, 18, 14);
      this.ctx.fillStyle = "#2d2729";
      this.ctx.fillRect(px + 39, py + 18, 8, 10);
      this.ctx.fillRect(px + 335, py + 18, 8, 10);

      this.ctx.fillStyle = brickDark;
      this.ctx.fillRect(px + 58, py + 94, 270, 70);
      this.ctx.fillStyle = brick;
      this.ctx.fillRect(px + 66, py + 88, 254, 72);
      this.ctx.fillStyle = tile;
      this.ctx.fillRect(px + 76, py + 68, 234, 22);
      this.ctx.fillStyle = roof;
      this.ctx.fillRect(px + 68, py + 58, 250, 10);

      this.ctx.fillStyle = "#f5cc8a";
      for (let i = 0; i < 10; i += 1) {
        const ax = px + 82 + i * 22;
        this.ctx.fillRect(ax, py + 106, 12, 30);
        this.ctx.fillStyle = "#513436";
        this.ctx.fillRect(ax + 3, py + 116, 6, 20);
        this.ctx.fillStyle = "#f5cc8a";
        this.ctx.fillRect(ax - 2, py + 102, 16, 5);
      }

      this.ctx.fillStyle = "#e8b35e";
      this.ctx.fillRect(px + 94, py + 146, 196, 10);
      this.ctx.fillStyle = "#2d728c";
      this.ctx.fillRect(px + 54, py + 164, 300, 30);
      this.ctx.fillStyle = "#3a91a9";
      for (let i = 0; i < 7; i += 1) {
        this.ctx.fillRect(px + 72 + i * 39, py + 178, 24, 3);
      }

      this.drawPlazaBridge(px + 116, py + 150);
      this.drawPlazaBridge(px + 232, py + 150);

      this.ctx.fillStyle = glow;
      this.ctx.fillRect(px + 41, py + 84, 6, 8);
      this.ctx.fillRect(px + 337, py + 84, 6, 8);

      this.drawOrangeTrees(px + 72, py + 196, 5);
    }

    drawPlazaBridge(x, y) {
      this.ctx.fillStyle = "#8d4c38";
      this.ctx.fillRect(x, y + 18, 58, 8);
      this.ctx.fillRect(x + 8, y + 10, 42, 8);
      this.ctx.fillStyle = "#f0bd77";
      this.ctx.fillRect(x + 13, y + 6, 32, 6);
      this.ctx.fillStyle = "#513436";
      this.ctx.fillRect(x + 9, y + 18, 8, 8);
      this.ctx.fillRect(x + 41, y + 18, 8, 8);
    }

    drawOrangeTrees(x, y, count) {
      for (let i = 0; i < count; i += 1) {
        const tx = x + i * 48;
        this.ctx.fillStyle = "#5f3f2e";
        this.ctx.fillRect(tx + 12, y + 18, 6, 18);
        this.ctx.fillStyle = "#316342";
        this.ctx.fillRect(tx + 2, y + 5, 28, 16);
        this.ctx.fillRect(tx + 8, y, 16, 26);
        this.ctx.fillStyle = "#f28b3d";
        this.ctx.fillRect(tx + 8, y + 11, 4, 4);
        this.ctx.fillRect(tx + 20, y + 7, 4, 4);
      }
    }

    drawDistantHouses(xShift) {
      const baseY = 474;
      this.ctx.fillStyle = "#7a4d4a";
      for (let x = -80; x < CONFIG.width + 100; x += 64) {
        const drawX = Math.round(x + xShift);
        this.ctx.fillRect(drawX, baseY + 38, 58, 62);
        this.ctx.fillStyle = "#f1c17a";
        this.ctx.fillRect(drawX + 10, baseY + 52, 10, 8);
        this.ctx.fillRect(drawX + 34, baseY + 52, 10, 8);
        this.ctx.fillStyle = "#7a4d4a";
      }
    }

    drawTinyGiralda(x, y, time) {
      this.ctx.fillStyle = "#b9774d";
      this.ctx.fillRect(Math.round(x), y + 48, 42, 170);
      this.ctx.fillStyle = "#f0bc75";
      for (let row = 0; row < 8; row += 1) {
        this.ctx.fillRect(Math.round(x + 9), y + 64 + row * 16, 6, 8);
        this.ctx.fillRect(Math.round(x + 27), y + 64 + row * 16, 6, 8);
      }
      this.ctx.fillStyle = "#6c3a34";
      this.ctx.fillRect(Math.round(x + 8), y + 20, 26, 28);
      this.ctx.fillRect(Math.round(x + 14), y, 14, 20);
      this.ctx.fillStyle = Math.sin(time * 6) > 0 ? "#ffe08a" : "#51312e";
      this.ctx.fillRect(Math.round(x + 18), y + 26, 6, 8);
    }

    drawTinyTorreOro(x, y) {
      this.ctx.fillStyle = "#d89a4b";
      this.ctx.fillRect(Math.round(x), y + 34, 56, 86);
      this.ctx.fillStyle = "#f0c16b";
      this.ctx.fillRect(Math.round(x + 8), y + 18, 40, 18);
      this.ctx.fillStyle = "#7f4a38";
      this.ctx.fillRect(Math.round(x + 18), y + 4, 20, 14);
      this.ctx.fillStyle = "#fff1bf";
      this.ctx.fillRect(Math.round(x + 16), y + 56, 8, 10);
      this.ctx.fillRect(Math.round(x + 34), y + 56, 8, 10);
    }

    drawTinyPelli(x, y) {
      this.ctx.fillStyle = "#6f8790";
      this.ctx.fillRect(Math.round(x), y + 16, 42, 230);
      this.ctx.fillStyle = "#a9d0d0";
      for (let row = 0; row < 20; row += 1) {
        this.ctx.fillRect(Math.round(x + 7), y + 26 + row * 10, 6, 4);
        this.ctx.fillRect(Math.round(x + 26), y + 26 + row * 10, 6, 4);
      }
      this.ctx.fillStyle = "#d7e8d8";
      this.ctx.fillRect(Math.round(x + 10), y, 22, 16);
    }

    drawBridgeAndRiver(offset) {
      const riverY = 562;
      this.ctx.fillStyle = "#246885";
      this.ctx.fillRect(0, riverY, CONFIG.width, 104);
      this.ctx.fillStyle = "#3087a2";
      for (let x = -48; x < CONFIG.width + 48; x += 48) {
        this.ctx.fillRect(Math.round(x - offset), riverY + 28, 28, 4);
        this.ctx.fillRect(Math.round(x + 12 - offset), riverY + 64, 24, 4);
      }

      this.ctx.fillStyle = "#6d3b35";
      this.ctx.fillRect(0, riverY - 24, CONFIG.width, 8);
      this.ctx.fillStyle = "#b26042";
      this.ctx.fillRect(0, riverY - 16, CONFIG.width, 10);
      this.ctx.fillStyle = "#432f33";
      for (let x = -8; x < CONFIG.width; x += 54) {
        this.ctx.fillRect(x + 10, riverY - 32, 10, 34);
        this.ctx.fillRect(x + 26, riverY - 26, 22, 6);
        this.ctx.fillRect(x + 30, riverY - 20, 14, 4);
      }
      this.ctx.fillStyle = "#e4a35b";
      for (let x = 2; x < CONFIG.width; x += 54) {
        this.ctx.fillRect(x, riverY - 13, 34, 4);
      }
    }

    drawBoats(boats) {
      boats.forEach((boat) => {
        const x = Math.round(boat.x);
        const y = Math.round(boat.y);
        this.ctx.fillStyle = "#3e2a27";
        this.ctx.fillRect(x, y + 10, 48, 8);
        this.ctx.fillRect(x + 8, y + 18, 30, 5);
        this.ctx.fillStyle = boat.color;
        this.ctx.fillRect(x + 20, y - 2, 4, 12);
        this.ctx.fillRect(x + 24, y + 2, 16, 10);
      });
    }

    drawFliers(fliers) {
      this.ctx.fillStyle = "#fff8df";
      fliers.forEach((flier) => {
        const x = Math.round(flier.x);
        const y = Math.round(flier.y + Math.sin(flier.flap) * 3);
        const wing = Math.sin(flier.flap) > 0 ? 6 : 2;
        this.ctx.fillRect(x, y, 5, 4);
        this.ctx.fillRect(x - 5, y - wing, 6, 3);
        this.ctx.fillRect(x + 5, y - wing, 6, 3);
      });
    }

    drawObstacles(obstacleManager, time) {
      obstacleManager.obstacles.forEach((obstacle) => {
        const groundTop = CONFIG.height - CONFIG.groundHeight;
        const topRect = {
          x: obstacle.x,
          y: 0,
          w: obstacle.width,
          h: obstacle.topHeight
        };
        const bottomRect = {
          x: obstacle.x,
          y: obstacle.bottomY,
          w: obstacle.width,
          h: groundTop - obstacle.bottomY
        };
        this.drawObstaclePiece(topRect, obstacle.topKind, true, time + obstacle.sway);
        this.drawObstaclePiece(bottomRect, obstacle.bottomKind, false, time + obstacle.sway);
      });
    }

    drawObstaclePiece(rect, kind, inverted, time) {
      if (rect.h <= 18) return;

      this.ctx.save();
      if (inverted) {
        this.ctx.translate(Math.round(rect.x + rect.w), Math.round(rect.y + rect.h));
        this.ctx.rotate(Math.PI);
        rect = { x: 0, y: 0, w: rect.w, h: rect.h };
      } else {
        this.ctx.translate(Math.round(rect.x), Math.round(rect.y));
        rect = { x: 0, y: 0, w: rect.w, h: rect.h };
      }

      this.drawObstacleCap(rect.w, rect.h);

      if (kind === "giralda") {
        this.drawImageObstacle("giralda", rect);
      } else if (kind === "torreOro") {
        this.drawImageObstacle("torreOro", rect);
      } else if (kind === "torrePelli") {
        this.drawImageObstacle("torrePelli", rect);
      } else if (kind === "columna") {
        this.drawColumnObstacle(rect);
      } else if (kind === "farola") {
        this.drawLampObstacle(rect, time);
      } else {
        this.drawEnsaladillaObstacle(rect);
      }

      this.ctx.restore();
    }

    drawObstacleCap(width, height) {
      this.ctx.fillStyle = "#3b2524";
      this.ctx.fillRect(0, height - 12, width, 12);
      this.ctx.fillStyle = "#f1bd72";
      this.ctx.fillRect(4, height - 18, width - 8, 8);
      this.ctx.fillStyle = "#7b4031";
      this.ctx.fillRect(0, height - 24, width, 6);
    }

    drawImageObstacle(name, rect) {
      const image = this.assets.get(name);
      const pad = name === "torrePelli" ? 10 : 4;
      if (image) {
        this.ctx.drawImage(image, pad, 0, rect.w - pad * 2, rect.h - 15);
        return;
      }

      this.ctx.fillStyle = "#a76343";
      this.ctx.fillRect(pad, 0, rect.w - pad * 2, rect.h - 15);
      this.ctx.fillStyle = "#ffd98a";
      for (let y = 14; y < rect.h - 28; y += 20) {
        this.ctx.fillRect(pad + 12, y, 8, 8);
        this.ctx.fillRect(rect.w - pad - 22, y, 8, 8);
      }
    }

    drawColumnObstacle(rect) {
      this.ctx.fillStyle = "#6f3a31";
      this.ctx.fillRect(12, 0, rect.w - 24, rect.h - 16);
      this.ctx.fillStyle = "#d49a66";
      this.ctx.fillRect(18, 0, rect.w - 36, rect.h - 16);
      for (let y = 10; y < rect.h - 28; y += 18) {
        this.ctx.fillStyle = "#f4c27c";
        this.ctx.fillRect(23, y, 8, 9);
        this.ctx.fillRect(rect.w - 31, y, 8, 9);
      }
    }

    drawLampObstacle(rect, time) {
      const cx = Math.round(rect.w * 0.5);
      this.ctx.fillStyle = "#2f2527";
      this.ctx.fillRect(cx - 5, 0, 10, rect.h - 24);
      this.ctx.fillRect(cx - 24, rect.h - 68, 48, 6);
      this.ctx.fillStyle = "#ffdf73";
      const glow = Math.sin(time * 9) > -0.1 ? "#ffdf73" : "#b8743e";
      this.ctx.fillStyle = glow;
      this.ctx.fillRect(cx - 30, rect.h - 83, 14, 18);
      this.ctx.fillRect(cx + 16, rect.h - 83, 14, 18);
      this.ctx.fillStyle = "#2f2527";
      this.ctx.fillRect(cx - 32, rect.h - 88, 18, 5);
      this.ctx.fillRect(cx + 14, rect.h - 88, 18, 5);
    }

    drawEnsaladillaObstacle(rect) {
      this.ctx.fillStyle = "#3a2928";
      this.ctx.fillRect(10, 0, rect.w - 20, rect.h - 16);

      for (let y = 6; y < rect.h - 34; y += 42) {
        this.drawEnsaladillaPlate(rect.w * 0.5, y, rect.w);
      }
    }

    drawEnsaladillaPlate(centerX, y, width) {
      const plateW = width - 14;
      const x = Math.round(centerX - plateW * 0.5);

      this.ctx.fillStyle = "#2d2527";
      this.ctx.fillRect(x + 3, y + 25, plateW - 6, 8);
      this.ctx.fillStyle = "#f4efe0";
      this.ctx.fillRect(x, y + 19, plateW, 8);
      this.ctx.fillStyle = "#c8d6d2";
      this.ctx.fillRect(x + 7, y + 27, plateW - 14, 4);

      this.ctx.fillStyle = "#f4d98e";
      this.ctx.fillRect(x + 8, y + 10, plateW - 16, 14);
      this.ctx.fillRect(x + 14, y + 4, plateW - 28, 10);
      this.ctx.fillStyle = "#fff1bf";
      this.ctx.fillRect(x + 18, y + 7, plateW - 36, 7);

      this.ctx.fillStyle = "#d84f37";
      this.ctx.fillRect(x + 20, y + 2, 16, 4);
      this.ctx.fillRect(x + plateW - 36, y + 13, 12, 4);

      this.ctx.fillStyle = "#477c38";
      this.ctx.fillRect(x + Math.round(plateW * 0.5) - 4, y, 8, 8);
      this.ctx.fillStyle = "#fff1bf";
      this.ctx.fillRect(x + Math.round(plateW * 0.5) - 1, y + 3, 2, 2);

      this.ctx.fillStyle = "#e89645";
      for (let dot = 0; dot < 4; dot += 1) {
        this.ctx.fillRect(x + 12 + dot * 13, y + 15 + (dot % 2) * 4, 4, 4);
      }
    }

    drawPlayer(player, time) {
      this.ctx.save();
      this.ctx.translate(Math.round(player.x), Math.round(player.y));
      this.ctx.rotate(player.rotation);
      const wingLift = player.flapTime > 0 ? -10 : Math.sin(time * 13) * 5;
      this.drawCurroSprite(wingLift);
      this.ctx.restore();
    }

    drawCurroSprite(wingLift) {
      const outline = "#2a2528";
      this.ctx.fillStyle = outline;
      this.ctx.fillRect(-22, -15, 36, 32);
      this.ctx.fillRect(-17, -22, 25, 10);
      this.ctx.fillRect(10, -8, 30, 12);
      this.ctx.fillRect(36, -4, 8, 6);

      this.ctx.fillStyle = "#fffaf0";
      this.ctx.fillRect(-18, -12, 30, 26);
      this.ctx.fillRect(-13, -18, 19, 8);
      this.ctx.fillStyle = "#d8d4ca";
      this.ctx.fillRect(-14, 8, 22, 6);

      this.ctx.fillStyle = "#f06a32";
      this.ctx.fillRect(12, -5, 26, 6);
      this.ctx.fillStyle = "#ffd55b";
      this.ctx.fillRect(12, 1, 18, 4);

      this.ctx.fillStyle = outline;
      this.ctx.fillRect(1, -14, 5, 5);
      this.ctx.fillStyle = "#ffffff";
      this.ctx.fillRect(2, -13, 2, 2);

      this.ctx.fillStyle = "#df3d3d";
      this.ctx.fillRect(-18, -31, 9, 12);
      this.ctx.fillStyle = "#f4c542";
      this.ctx.fillRect(-9, -34, 8, 15);
      this.ctx.fillStyle = "#47ad5f";
      this.ctx.fillRect(-1, -31, 8, 12);
      this.ctx.fillStyle = "#326fc7";
      this.ctx.fillRect(7, -27, 8, 9);

      this.ctx.fillStyle = outline;
      this.ctx.fillRect(-28, Math.round(-2 + wingLift), 20, 16);
      this.ctx.fillStyle = "#f8f8ed";
      this.ctx.fillRect(-25, Math.round(1 + wingLift), 14, 10);

      this.ctx.fillStyle = "#f3ad3d";
      this.ctx.fillRect(-12, 15, 6, 8);
      this.ctx.fillRect(2, 15, 6, 8);
    }

    drawGround(offset) {
      const suelo = this.assets.get("suelo");
      const y = CONFIG.height - CONFIG.groundHeight;
      if (suelo) {
        const tileW = suelo.width;
        for (let x = -tileW; x < CONFIG.width + tileW; x += tileW) {
          this.ctx.drawImage(suelo, Math.round(x - (offset % tileW)), y);
        }
        return;
      }

      this.ctx.fillStyle = "#d8a14a";
      this.ctx.fillRect(0, y, CONFIG.width, CONFIG.groundHeight);
      this.ctx.fillStyle = "#c4863e";
      for (let row = 0; row < 7; row += 1) {
        for (let x = -24; x < CONFIG.width; x += 48) {
          const shift = row % 2 === 0 ? 0 : 24;
          this.ctx.fillRect(x + shift, y + row * 14, 32, 6);
        }
      }
    }

    drawImpactLines(shakeTime) {
      this.ctx.globalAlpha = math.clamp(shakeTime * 2.4, 0, 0.55);
      this.ctx.fillStyle = "#fff4ce";
      this.ctx.fillRect(0, 0, CONFIG.width, 6);
      this.ctx.fillRect(0, CONFIG.height - 6, CONFIG.width, 6);
      this.ctx.globalAlpha = 1;
    }
  }

  // ---------------------------------------------------------------------------
  // Input handler
  // ---------------------------------------------------------------------------

  class InputHandler {
    constructor(game) {
      this.game = game;
      this.pointerLocked = false;
      this.bind();
    }

    bind() {
      dom.playButton.addEventListener("click", () => this.game.start());
      dom.shopButton.addEventListener("click", () => this.game.openShop());
      dom.shopBackButton.addEventListener("click", () => this.game.closeShop());
      dom.shopList.addEventListener("click", (event) => {
        if (!(event.target instanceof Element)) return;
        const button = event.target.closest("[data-shop-location-id]");
        if (!button) return;
        event.stopPropagation();
        this.game.buyCuriosity(button.dataset.shopLocationId);
      });
      dom.collectionButton.addEventListener("click", () => this.game.openCollection());
      dom.collectionBackButton.addEventListener("click", () => this.game.closeCollection());
      dom.restartButton.addEventListener("click", () => this.game.restart());
      dom.pauseRestartButton.addEventListener("click", () => this.game.restart());
      dom.resumeButton.addEventListener("click", () => this.game.resume());
      dom.pauseButton.addEventListener("click", (event) => {
        event.stopPropagation();
        this.game.togglePause();
      });

      window.addEventListener("keydown", (event) => {
        if (event.code === "Space" || event.code === "ArrowUp") {
          event.preventDefault();
          this.game.primaryAction();
        }
        if (event.code === "KeyP" || event.code === "Escape") {
          event.preventDefault();
          this.game.togglePause();
        }
      });

      dom.canvas.addEventListener("pointerdown", (event) => {
        event.preventDefault();
        this.game.primaryAction();
      });
    }
  }

  // ---------------------------------------------------------------------------
  // Estado principal del juego
  // ---------------------------------------------------------------------------

  class Game {
    constructor() {
      this.assets = new AssetManager(CONFIG.assetPaths);
      this.audio = new AudioManager(CONFIG.soundPaths);
      this.score = new ScoreManager();
      this.player = new Player();
      this.particles = new ParticleSystem();
      this.background = new Background();
      this.obstacles = new ObstacleManager();
      this.renderer = new Renderer(ctx, this.assets);
      this.input = new InputHandler(this);

      this.state = GameState.LOADING;
      this.lastTime = 0;
      this.time = 0;
      this.speed = CONFIG.baseSpeed;
      this.groundOffset = 0;
      this.shakeTime = 0;
      this.rafId = null;
      this.shopMessageText = "";
    }

    async init() {
      this.setCanvasSize();
      window.addEventListener("resize", () => this.setCanvasSize());
      this.audio.load();
      await this.assets.load();
      this.changeState(GameState.START);
      this.syncHud();
      this.rafId = window.requestAnimationFrame((stamp) => this.loop(stamp));
    }

    setCanvasSize() {
      dom.canvas.width = CONFIG.width;
      dom.canvas.height = CONFIG.height;
      ctx.imageSmoothingEnabled = false;
    }

    changeState(nextState) {
      this.state = nextState;
      dom.startScreen.hidden = nextState !== GameState.START;
      dom.startScreen.classList.toggle("active", nextState === GameState.START);
      dom.collectionScreen.hidden = nextState !== GameState.COLLECTION;
      dom.shopScreen.hidden = nextState !== GameState.SHOP;
      dom.hud.hidden = !(nextState === GameState.PLAYING || nextState === GameState.PAUSED);
      dom.pauseScreen.hidden = nextState !== GameState.PAUSED;
      dom.gameOverScreen.hidden = nextState !== GameState.GAME_OVER;
    }

    openShop() {
      this.renderShop();
      this.changeState(GameState.SHOP);
    }

    closeShop() {
      this.changeState(GameState.START);
    }

    openCollection() {
      this.renderCollection();
      this.changeState(GameState.COLLECTION);
    }

    closeCollection() {
      this.changeState(GameState.START);
    }

    start() {
      this.audio.unlock();
      this.audio.playMusic();
      this.resetRun();
      this.fade();
      this.changeState(GameState.PLAYING);
      this.flap();
    }

    restart() {
      this.audio.unlock();
      this.audio.playMusic();
      this.resetRun();
      this.fade();
      this.changeState(GameState.PLAYING);
      this.flap();
    }

    resetRun() {
      this.score.reset();
      this.player.reset();
      this.particles.reset();
      this.obstacles.reset();
      this.background.reset();
      this.speed = CONFIG.baseSpeed;
      this.groundOffset = 0;
      this.shakeTime = 0;
      this.shopMessageText = "";
      this.syncHud();
    }

    resume() {
      if (this.state === GameState.PAUSED) {
        this.audio.unlock();
        this.audio.playMusic();
        this.changeState(GameState.PLAYING);
      }
    }

    togglePause() {
      if (this.state === GameState.PLAYING) {
        this.changeState(GameState.PAUSED);
      } else if (this.state === GameState.PAUSED) {
        this.resume();
      }
    }

    primaryAction() {
      if (this.state === GameState.COLLECTION) {
        this.closeCollection();
        return;
      }

      if (this.state === GameState.SHOP) {
        this.closeShop();
        return;
      }

      if (this.state === GameState.START) {
        this.start();
        return;
      }

      if (this.state === GameState.GAME_OVER) {
        this.restart();
        return;
      }

      if (this.state === GameState.PLAYING) {
        this.flap();
      }
    }

    flap() {
      this.player.flap();
      this.particles.emitJump(this.player.x, this.player.y);
      this.audio.play("jump");
    }

    loop(stamp) {
      const dt = this.lastTime ? math.clamp((stamp - this.lastTime) / 1000, 0, 0.033) : 0;
      this.lastTime = stamp;
      this.update(dt);
      this.renderer.draw(this);
      this.rafId = window.requestAnimationFrame((nextStamp) => this.loop(nextStamp));
    }

    update(dt) {
      this.time += dt;
      const playing = this.state === GameState.PLAYING;

      if (playing) {
        this.speed = math.clamp(
          CONFIG.baseSpeed + this.score.score * 3.7,
          CONFIG.baseSpeed,
          CONFIG.maxSpeed
        );
        this.groundOffset = (this.groundOffset + this.speed * dt) % 432;
        this.player.update(dt, true);
        this.obstacles.update(dt, this.speed, this.score.score);
        this.checkScore();
        this.checkCollisions();
      } else {
        this.player.update(dt, false);
      }

      if (this.state !== GameState.PAUSED) {
        this.background.update(dt, this.speed);
        this.particles.update(dt, this.speed);
      }

      if (this.shakeTime > 0) {
        this.shakeTime -= dt;
        const power = this.shakeTime * 10;
        dom.canvas.style.transform = `translate(${Math.sin(this.time * 95) * power}px, ${Math.cos(this.time * 83) * power}px)`;
      } else {
        dom.canvas.style.transform = "";
      }
    }

    checkScore() {
      this.obstacles.obstacles.forEach((obstacle) => {
        if (!obstacle.passed && obstacle.x + obstacle.width < this.player.x) {
          obstacle.passed = true;
          this.score.addPoint();
          this.syncHud();
          this.audio.play("score");
        }
      });
    }

    checkCollisions() {
      if (
        CollisionManager.world(this.player) ||
        CollisionManager.obstacles(this.player, this.obstacles)
      ) {
        this.endRun();
      }
    }

    endRun() {
      if (this.state !== GameState.PLAYING) return;

      this.player.alive = false;
      this.shakeTime = 0.32;
      this.particles.emitHit(this.player.x, this.player.y);
      this.audio.play("hit");
      window.setTimeout(() => this.audio.playGameOver(), 120);
      this.changeState(GameState.GAME_OVER);
      this.syncHud();
    }

    getCurrentLocation() {
      let currentLocation = Locations[0];
      for (let i = 0; i < Locations.length; i += 1) {
        if (this.score.score >= Locations[i].minScore) {
          currentLocation = Locations[i];
        }
      }
      return currentLocation;
    }

    getNextCuriosity(location) {
      return location.curiosities.find((curiosity) => {
        return !this.score.hasCuriosity(curiosity.id);
      });
    }

    getUnlockedCount(location) {
      return location.curiosities.filter((curiosity) => {
        return this.score.hasCuriosity(curiosity.id);
      }).length;
    }

    buyCuriosity(locationId) {
      const location = Locations.find((candidate) => candidate.id === locationId);
      if (!location) return;

      const curiosity = this.getNextCuriosity(location);

      if (!curiosity) {
        this.shopMessageText = `$ ${location.name}: zona completada. Ya tienes todas sus curiosidades.`;
        this.renderShop();
        return;
      }

      if (!this.score.canSpend(CONFIG.curiosityCost)) {
        const missing = CONFIG.curiosityCost - this.score.bank;
        this.shopMessageText = `$ faltan ${missing} ensaladillas para desbloquear otra curiosidad.`;
        this.renderShop();
        return;
      }

      if (!this.score.spend(CONFIG.curiosityCost)) return;

      this.score.unlockCuriosity(curiosity.id);
      this.shopMessageText = `$ ${curiosity.title}: ${curiosity.text}`;
      this.audio.play("score");
      this.syncHud();
      this.renderShop();
      this.renderCollection();
    }

    syncHud() {
      const location = this.getCurrentLocation();

      dom.scoreValue.textContent = String(this.score.score);
      dom.bestValue.textContent = String(this.score.best);
      dom.beerBankValue.textContent = String(this.score.bank);
      dom.finalScoreValue.textContent = String(this.score.score);
      dom.finalBestValue.textContent = String(this.score.best);
      dom.finalBankValue.textContent = String(this.score.bank);
      dom.locationHudValue.textContent = location.name;
      dom.locationValue.textContent = location.name;
      this.renderBottleScore(dom.scoreBottles, this.score.score, 8);
      this.renderBottleScore(dom.finalScoreBottles, this.score.score, 12);
    }

    getAllCuriosities() {
      return Locations.flatMap((location) => {
        return location.curiosities.map((curiosity) => ({
          ...curiosity,
          locationName: location.name
        }));
      });
    }

    renderCollection() {
      if (!dom.collectionList || !dom.collectionStats) return;

      const curiosities = this.getAllCuriosities();
      const unlockedTotal = curiosities.filter((curiosity) => {
        return this.score.hasCuriosity(curiosity.id);
      }).length;

      dom.collectionStats.textContent = `${unlockedTotal}/${curiosities.length} curiosidades`;
      dom.collectionList.replaceChildren();

      curiosities.forEach((curiosity, index) => {
        const unlocked = this.score.hasCuriosity(curiosity.id);
        const item = document.createElement("article");
        item.className = unlocked ? "collection-item is-unlocked" : "collection-item";

        const header = document.createElement("div");
        header.className = "collection-item-header";

        const number = document.createElement("span");
        number.className = "collection-number";
        number.textContent = String(index + 1).padStart(2, "0");

        const title = document.createElement("h3");
        title.textContent = unlocked ? curiosity.title : "Curiosidad bloqueada";

        header.append(number, title);

        const location = document.createElement("p");
        location.className = "collection-location";
        location.textContent = curiosity.locationName;

        const text = document.createElement("p");
        text.className = "collection-text";
        text.textContent = unlocked
          ? curiosity.text
          : "Compra esta curiosidad con ensaladillas cuando llegues a su zona.";

        item.append(header, location, text);
        dom.collectionList.appendChild(item);
      });
    }

    renderShop() {
      if (!dom.shopList || !dom.shopBank || !dom.shopMessage) return;

      const allCuriosities = this.getAllCuriosities();
      const unlockedTotal = allCuriosities.filter((curiosity) => {
        return this.score.hasCuriosity(curiosity.id);
      }).length;

      dom.shopBank.textContent = `Ensaladillas ${this.score.bank} | ${unlockedTotal}/${allCuriosities.length}`;
      dom.shopList.replaceChildren();

      Locations.forEach((location) => {
        const nextCuriosity = this.getNextCuriosity(location);
        const unlockedCount = this.getUnlockedCount(location);
        const total = location.curiosities.length;
        const missing = Math.max(CONFIG.curiosityCost - this.score.bank, 0);
        const completed = !nextCuriosity;
        const canBuy = !completed && this.score.canSpend(CONFIG.curiosityCost);

        const item = document.createElement("article");
        item.className = completed ? "shop-zone is-complete" : "shop-zone";

        const header = document.createElement("div");
        header.className = "shop-zone-header";

        const title = document.createElement("h3");
        title.textContent = location.name;

        const progress = document.createElement("span");
        progress.className = "shop-progress";
        progress.textContent = `${unlockedCount}/${total}`;

        header.append(title, progress);

        const preview = document.createElement("p");
        preview.className = "shop-preview";
        preview.textContent = completed
          ? "Zona completada"
          : `Siguiente: ${nextCuriosity.title}`;

        const button = document.createElement("button");
        button.className = "primary-button shop-buy-button";
        button.type = "button";
        button.dataset.shopLocationId = location.id;
        button.disabled = !canBuy;
        button.textContent = completed
          ? "Completada"
          : canBuy
            ? `${CONFIG.curiosityCost} ensaladillas`
            : `Faltan ${missing}`;
        button.setAttribute(
          "aria-label",
          completed
            ? `Todas las curiosidades de ${location.name} desbloqueadas`
            : `Canjear curiosidad de ${location.name} por ${CONFIG.curiosityCost} ensaladillas`
        );

        item.append(header, preview, button);
        dom.shopList.appendChild(item);
      });

      if (this.shopMessageText) {
        dom.shopMessage.hidden = false;
        dom.shopMessage.textContent = this.shopMessageText;
      } else {
        dom.shopMessage.hidden = true;
        dom.shopMessage.textContent = "";
      }
    }

    renderBottleScore(container, amount, maxVisible) {
      if (!container) return;

      container.replaceChildren();
      container.setAttribute("aria-label", `Botellines Cruzcampo ${amount}`);

      const visible = Math.min(amount, maxVisible);
      if (amount === 0) {
        container.appendChild(this.createBottleIcon(true));
        const emptyText = document.createElement("span");
        emptyText.className = "bottle-overflow";
        emptyText.textContent = "x0";
        container.appendChild(emptyText);
        return;
      }

      for (let i = 0; i < visible; i += 1) {
        container.appendChild(this.createBottleIcon(false));
      }

      if (amount > maxVisible) {
        const overflow = document.createElement("span");
        overflow.className = "bottle-overflow";
        overflow.textContent = `+${amount - maxVisible}`;
        container.appendChild(overflow);
      }
    }

    createBottleIcon(empty) {
      const bottle = document.createElement("span");
      bottle.className = empty ? "bottle-icon bottle-icon-empty" : "bottle-icon";
      bottle.setAttribute("aria-hidden", "true");

      const label = document.createElement("span");
      label.className = "bottle-label";
      label.textContent = "C";
      bottle.appendChild(label);

      return bottle;
    }

    fade() {
      dom.fadeLayer.classList.add("is-active");
      window.setTimeout(() => dom.fadeLayer.classList.remove("is-active"), 170);
    }
  }

  const game = new Game();
  game.init();
})();
