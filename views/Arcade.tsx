import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, Trophy, RotateCcw, Settings, Play, Pause, Clock, Lock } from 'lucide-react';
import { useApp } from '../AppContext';

// --- CONFIGURATION & TYPES ---

const COLORS = {
  neonGreen: '#C2F9BB',
  neonPurple: '#D9D9FF',
  neonBlue: '#C2E5FF',
  neonRose: '#FFC2C2',
  darkBg: '#09090b',
  text: '#FFFFFF'
};

const GAMES = [
  {
      id: 'runner',
      title: 'Tech Sprint',
      desc: 'Cyberpunk Runner. Dodge bugs and deadlines in a neon city.',
      icon: 'zap',
      controls: 'Space / Tap to Jump',
      theme: 'indigo',
      gradient: 'from-indigo-900/40',
      border: 'border-indigo-500/30'
  },
  {
      id: 'snake',
      title: 'Data Stream',
      desc: 'Digital Snake. Collect data packets in the matrix grid.',
      icon: 'activity',
      controls: 'Arrows / Swipe to Move',
      theme: 'emerald',
      gradient: 'from-emerald-900/40',
      border: 'border-emerald-500/30'
  },
  {
      id: 'shooter',
      title: 'Debug Defender',
      desc: 'Space Shooter. Defend the core from incoming bugs.',
      icon: 'crosshair',
      controls: 'Mouse / Drag to Move',
      theme: 'rose',
      gradient: 'from-rose-900/40',
      border: 'border-rose-500/30'
  }
];

// --- PERFORMANCE UTILITIES ---

class ObjectPool<T extends { active: boolean }> {
  items: T[];

  constructor(createFn: () => T, size: number) {
    this.items = new Array(size).fill(null).map(createFn);
  }

  get(): T | null {
    for (let i = 0; i < this.items.length; i++) {
      if (!this.items[i].active) {
        this.items[i].active = true;
        return this.items[i];
      }
    }
    return null;
  }

  reset() {
    for (let i = 0; i < this.items.length; i++) {
      this.items[i].active = false;
    }
  }
}

interface Particle {
  active: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
}

interface RunnerObstacle {
  active: boolean;
  x: number;
  y: number;
  w: number;
  h: number;
  passed: boolean;
}

interface Bullet {
  active: boolean;
  x: number;
  y: number;
  vy: number;
  size: number;
}

interface Enemy {
  active: boolean;
  x: number;
  y: number;
  vy: number;
  size: number;
}

// --- REACT COMPONENT ---

const Arcade: React.FC = () => {
  const { navigate, isDark, currentUser } = useApp();
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<'easy'|'medium'|'hard'>('medium');
  const [highScores, setHighScores] = useState<Record<string, number>>({});

  useEffect(() => {
    const saved = localStorage.getItem('arcade_scores');
    if (saved) setHighScores(JSON.parse(saved));
  }, []);

  const updateHighScore = (game: string, score: number) => {
    setHighScores(prev => {
      const newScores = { ...prev, [game]: Math.max(prev[game] || 0, score) };
      localStorage.setItem('arcade_scores', JSON.stringify(newScores));
      return newScores;
    });
  };

  if (activeGame) {
    return (
      <GameEngineView
        gameId={activeGame}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        onExit={() => setActiveGame(null)}
        onScore={(s) => updateHighScore(activeGame, s)}
        highScore={highScores[activeGame] || 0}
      />
    );
  }

  return (
    <div className="w-full h-full bg-slate-50 dark:bg-transparent text-black dark:text-white p-6 pt-28 relative overflow-y-auto flex flex-col items-center">
      <div className="relative z-10 w-full max-w-7xl my-auto text-center">
        <div className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold uppercase tracking-widest mb-4 shadow-lg shadow-indigo-500/30">
            Arcade Zone
        </div>
        <h2 className="text-4xl md:text-6xl font-black mb-4 text-black dark:text-white tracking-tight font-brutal dark:font-sans">
            Student <span className="text-indigo-600 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-br dark:from-indigo-400 dark:to-cyan-400">Break Room</span>
        </h2>
        <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-12 max-w-2xl mx-auto font-bold dark:font-normal">
            Train your cognitive skills essential for development while taking a break. Select your challenge.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto text-left pb-12">
            {GAMES.map(g => (
                <div
                    key={g.id}
                    onClick={() => {
                        if (!currentUser) navigate('login');
                        else setActiveGame(g.id);
                    }}
                    className={`
                        group relative overflow-hidden p-6 rounded-3xl cursor-pointer
                        hover:-translate-y-2 transition-transform duration-300 flex flex-col justify-between h-96
                        card-base bg-white dark:bg-white/5
                        dark:hover:border-${g.theme}-500/50
                    `}
                >
                    {/* Lock Overlay if not logged in */}
                    {!currentUser && (
                        <div className="absolute top-4 right-4 z-20 bg-black/60 p-2 rounded-full border border-white/20 backdrop-blur-md">
                            <Lock className="w-4 h-4 text-white" />
                        </div>
                    )}

                    {/* Dark Mode Gradient Overlay - Hidden in Light Mode */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${g.gradient} to-black opacity-0 dark:opacity-100 transition-opacity`}></div>

                    <div className="relative z-10 flex flex-col h-full">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6
                            border-2 border-black bg-${g.theme}-100 text-black
                            dark:border-white/10 dark:bg-white/5 dark:text-${g.theme}-400 dark:shadow-[0_0_15px_rgba(255,255,255,0.1)]
                        `}>
                            {g.id === 'runner' && <Play className="w-7 h-7" />}
                            {g.id === 'snake' && <RotateCcw className="w-7 h-7" />}
                            {g.id === 'shooter' && <Settings className="w-7 h-7" />}
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-black dark:text-white mb-2 uppercase font-brutal dark:font-sans">{g.title}</h3>
                            <p className="text-zinc-600 dark:text-zinc-400 text-sm font-bold dark:font-normal mb-4">{g.desc}</p>
                        </div>
                        <div className="mt-auto pt-4 border-t-2 border-dashed border-black/10 dark:border-white/10 flex justify-between items-center">
                            <span className={`text-xs font-black uppercase tracking-widest text-zinc-500 dark:text-${g.theme}-400`}>
                                High Score: {highScores[g.id] || 0}
                            </span>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white
                                bg-black dark:bg-${g.theme}-600
                            `}>
                                {currentUser ? <Play className="w-4 h-4 fill-current" /> : <Lock className="w-4 h-4 fill-current" />}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        <button
            onClick={() => navigate('home')}
            className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-black bg-white text-black hover:bg-zinc-100 dark:border-zinc-700 dark:bg-transparent dark:text-zinc-400 dark:hover:text-white dark:hover:bg-white/5 transition-colors mx-auto font-bold text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] dark:shadow-none dark:hover:translate-none dark:rounded-full"
        >
            <ArrowLeft className="w-4 h-4" /> Back to App
        </button>
      </div>
    </div>
  );
};

// --- GAME ENGINE VIEW ---

interface GameViewProps {
    gameId: string;
    difficulty: string;
    setDifficulty: (d: 'easy' | 'medium' | 'hard') => void;
    onExit: () => void;
    onScore: (score: number) => void;
    highScore: number;
}

const GameEngineView: React.FC<GameViewProps> = ({ gameId, difficulty, setDifficulty, onExit, onScore, highScore }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState<'start' | 'playing' | 'paused' | 'gameover'>('start');
    const [shake, setShake] = useState(false);

    // Time Tracking State
    const [showReminder, setShowReminder] = useState(false);
    const [reminderMinutes, setReminderMinutes] = useState(0);
    const activeTimeRef = useRef(0); // Cumulative play time in ms
    const sessionStartRef = useRef(0); // Start time of current play session segment
    const lastReminderRef = useRef(0); // Last minute we showed a reminder for

    const touchStart = useRef({ x: 0, y: 0 });

    // Theme Colors based on Game ID
    const theme = gameId === 'runner' ? 'indigo'
                : gameId === 'snake' ? 'emerald'
                : 'rose';

    const themeColor = gameId === 'runner' ? '#818cf8'
                     : gameId === 'snake' ? '#34d399'
                     : '#fb7185';

    // Mutable Game State
    const engine = useRef({
        lastTime: 0,
        gameLoopId: 0,
        score: 0,
        status: 'start' as 'start' | 'playing' | 'paused' | 'gameover',
        // POOLS
        particles: new ObjectPool<Particle>(() => ({ active: false, x: 0, y: 0, vx: 0, vy: 0, life: 0, color: '#fff', size: 0 }), 100),
        bullets: new ObjectPool<Bullet>(() => ({ active: false, x: 0, y: 0, vy: 0, size: 0 }), 30),
        enemies: new ObjectPool<Enemy>(() => ({ active: false, x: 0, y: 0, vy: 0, size: 0 }), 20),
        obstacles: new ObjectPool<RunnerObstacle>(() => ({ active: false, x: 0, y: 0, w: 0, h: 0, passed: false }), 10),
        // GAME SPECIFIC STATE
        runner: { playerY: 0, playerDy: 0, playerGrounded: false, speed: 0, spawnTimer: 0 },
        snake: { body: [] as {x: number, y: number}[], dir: {x: 1, y: 0}, nextDir: {x: 1, y: 0}, food: {x: 0, y: 0}, timer: 0 },
        shooter: { playerX: 0, spawnTimer: 0 }
    });

    const gameMeta = GAMES.find(g => g.id === gameId);

    // --- SYSTEMS ---

    const spawnExplosion = (x: number, y: number, color: string, count: number = 8) => {
        for(let i=0; i<count; i++) {
            const p = engine.current.particles.get();
            if(p) {
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 200 + 100; // Increased speed for visual pop
                p.x = x;
                p.y = y;
                p.vx = Math.cos(angle) * speed;
                p.vy = Math.sin(angle) * speed;
                p.life = 1.0;
                p.color = Math.random() > 0.5 ? color : '#ffffff'; // Mix white for sparks
                p.size = Math.random() * 6 + 2;
            }
        }
    };

    const updateParticles = (dt: number, ctx: CanvasRenderingContext2D) => {
        engine.current.particles.items.forEach(p => {
            if (p.active) {
                p.x += p.vx * dt;
                p.y += p.vy * dt;
                p.life -= 1.5 * dt; // Fade faster
                p.size *= 0.92;

                if (p.life <= 0) p.active = false;
                else {
                    ctx.globalAlpha = p.life;
                    ctx.fillStyle = p.color;
                    ctx.beginPath();
                    ctx.arc(Math.floor(p.x), Math.floor(p.y), p.size, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.globalAlpha = 1.0;
                }
            }
        });
    };

    const handleGameOver = () => {
        engine.current.status = 'gameover';
        setGameState('gameover');
        onScore(engine.current.score);

        // Effects
        setShake(true);
        setTimeout(() => setShake(false), 800); // Extended shake

        // Spawn massive explosion at center
        const w = 800, h = 400;
        spawnExplosion(w/2, h/2, themeColor, 100);
        spawnExplosion(w/2, h/2, '#ef4444', 50); // Red explosion
    };

    const togglePause = () => {
        if (engine.current.status === 'playing') {
            engine.current.status = 'paused';
            setGameState('paused');
        } else if (engine.current.status === 'paused') {
            engine.current.status = 'playing';
            setGameState('playing');
            // Re-sync time to prevent jumps
            engine.current.lastTime = performance.now();
        }
    };

    // --- GAME LOGIC ---

    const initRunner = (w: number, h: number) => {
        const baseSpeed = difficulty === 'easy' ? 300 : difficulty === 'hard' ? 500 : 400;
        engine.current.runner = {
            playerY: h - 100 - 40,
            playerDy: 0,
            playerGrounded: true,
            speed: baseSpeed,
            spawnTimer: 0
        };
        engine.current.obstacles.reset();
    };

    const updateRunner = (dt: number, w: number, h: number, ctx: CanvasRenderingContext2D) => {
        const s = engine.current.runner;
        const GRAVITY = 1800;
        const floorY = h - 100;
        const playerX = 50;

        // Physics
        s.playerDy += GRAVITY * dt;
        s.playerY += s.playerDy * dt;

        if (s.playerY + 40 >= floorY) {
            s.playerY = floorY - 40;
            s.playerDy = 0;
            s.playerGrounded = true;
        } else {
            s.playerGrounded = false;
        }

        // Draw Player
        ctx.fillStyle = COLORS.neonGreen;
        ctx.shadowBlur = 10; ctx.shadowColor = COLORS.neonGreen;
        ctx.fillRect(Math.floor(playerX), Math.floor(s.playerY), 40, 40);
        ctx.shadowBlur = 0;

        // Floor
        ctx.fillStyle = '#1e1b4b';
        ctx.fillRect(0, floorY, w, 100);
        ctx.strokeStyle = COLORS.neonBlue;
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(0, floorY); ctx.lineTo(w, floorY); ctx.stroke();

        // Spawn Logic
        s.spawnTimer += dt;
        let spawnThreshold = 2.0;
        if (difficulty === 'medium') spawnThreshold = 1.5;
        if (difficulty === 'hard') spawnThreshold = 1.0;
        spawnThreshold = Math.max(0.6, spawnThreshold - (engine.current.score / 5000));

        if (s.spawnTimer > spawnThreshold) {
            if (Math.random() > 0.3) {
                const obs = engine.current.obstacles.get();
                if(obs) {
                    obs.x = w;
                    obs.y = floorY - 40;
                    obs.w = 40;
                    obs.h = 40;
                    obs.passed = false;
                }
            }
            s.spawnTimer = 0;
        }

        engine.current.obstacles.items.forEach(obs => {
            if (obs.active) {
                obs.x -= s.speed * dt;
                ctx.fillStyle = COLORS.neonRose;
                ctx.shadowBlur = 10; ctx.shadowColor = COLORS.neonRose;
                ctx.fillRect(Math.floor(obs.x), Math.floor(obs.y), obs.w, obs.h);
                ctx.shadowBlur = 0;

                // Collision
                if (playerX < obs.x + obs.w && playerX + 40 > obs.x && s.playerY < obs.y + obs.h && s.playerY + 40 > obs.y) {
                    spawnExplosion(playerX + 20, s.playerY + 20, COLORS.neonRose, 20);
                    handleGameOver();
                }

                if (!obs.passed && obs.x + obs.w < playerX) {
                    obs.passed = true;
                    engine.current.score += 10;
                    setScore(Math.floor(engine.current.score));
                }
                if (obs.x + obs.w < 0) obs.active = false;
            }
        });
        s.speed += (difficulty === 'hard' ? 20 : 10) * dt;
    };

    const initSnake = (w: number, h: number) => {
        const GRID = 20;
        const cols = Math.floor(w / GRID);
        const rows = Math.floor(h / GRID);
        engine.current.snake = {
            body: [{x: 10, y: 10}, {x: 9, y: 10}, {x: 8, y: 10}],
            dir: {x: 1, y: 0},
            nextDir: {x: 1, y: 0},
            food: { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) },
            timer: 0
        };
    };

    const updateSnake = (dt: number, w: number, h: number, ctx: CanvasRenderingContext2D) => {
        const s = engine.current.snake;
        const GRID = 20;

        const baseTick = difficulty === 'easy' ? 0.15 : difficulty === 'hard' ? 0.08 : 0.12;
        const speedBoostPerPoint = difficulty === 'hard' ? 0.003 : 0.001;
        const speedBoost = Math.min(0.06, (engine.current.score / 50) * speedBoostPerPoint);
        const currentTickRate = Math.max(0.03, baseTick - speedBoost);

        // Grid
        ctx.strokeStyle = '#064e3b';
        ctx.lineWidth = 1;
        ctx.strokeRect(0,0,w,h);
        for(let x=0; x<w; x+=GRID) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,h); ctx.stroke(); }
        for(let y=0; y<h; y+=GRID) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(w,y); ctx.stroke(); }

        s.timer += dt;
        if (s.timer > currentTickRate) {
            s.timer = 0;
            s.dir = s.nextDir;

            const head = { x: s.body[0].x + s.dir.x, y: s.body[0].y + s.dir.y };
            const cols = Math.floor(w / GRID);
            const rows = Math.floor(h / GRID);

            // Wall Collision
            if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows) {
                handleGameOver();
                return;
            }
            // Self Collision
            if (s.body.some(part => part.x === head.x && part.y === head.y)) {
                handleGameOver();
                return;
            }

            s.body.unshift(head);

            if (head.x === s.food.x && head.y === s.food.y) {
                engine.current.score += 50;
                setScore(engine.current.score);
                spawnExplosion(head.x * GRID + 10, head.y * GRID + 10, COLORS.neonGreen, 5);
                let valid = false;
                while(!valid) {
                    s.food = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) };
                    valid = !s.body.some(p => p.x === s.food.x && p.y === s.food.y);
                }
            } else {
                s.body.pop();
            }
        }

        ctx.fillStyle = COLORS.neonRose;
        ctx.shadowBlur = 10; ctx.shadowColor = COLORS.neonRose;
        ctx.fillRect(s.food.x * GRID, s.food.y * GRID, GRID-2, GRID-2);

        ctx.shadowBlur = 0;
        ctx.fillStyle = COLORS.neonGreen;
        s.body.forEach(p => {
            ctx.fillRect(p.x * GRID, p.y * GRID, GRID-2, GRID-2);
        });
    };

    const initShooter = (w: number, h: number) => {
        engine.current.shooter = {
            playerX: w / 2,
            spawnTimer: 0
        };
        engine.current.bullets.reset();
        engine.current.enemies.reset();
    };

    const updateShooter = (dt: number, w: number, h: number, ctx: CanvasRenderingContext2D) => {
        const sh = engine.current.shooter;
        const playerY = h - 80;

        sh.spawnTimer += dt;
        let spawnRate = difficulty === 'easy' ? 1.5 : difficulty === 'hard' ? 0.5 : 1.0;
        spawnRate = Math.max(0.3, spawnRate - (engine.current.score / 5000));

        if (sh.spawnTimer > spawnRate) {
            sh.spawnTimer = 0;
            const e = engine.current.enemies.get();
            if (e) {
                e.x = Math.random() * (w - 40) + 20;
                e.y = -50;
                e.vy = (Math.random() * 100 + 100) * (difficulty === 'hard' ? 1.5 : 1);
                e.size = Math.random() * 15 + 15;
            }
        }

        // Draw Player
        ctx.fillStyle = COLORS.neonBlue;
        ctx.beginPath();
        ctx.moveTo(sh.playerX, playerY - 20);
        ctx.lineTo(sh.playerX - 20, playerY + 20);
        ctx.lineTo(sh.playerX + 20, playerY + 20);
        ctx.fill();

        // Auto Fire
        if (Math.floor(performance.now() / 200) % 2 === 0 && Math.random() > 0.8) {
             const b = engine.current.bullets.get();
             if (b) {
                 b.x = sh.playerX;
                 b.y = playerY - 20;
                 b.vy = -600;
             }
        }

        ctx.fillStyle = COLORS.neonGreen;
        engine.current.bullets.items.forEach(b => {
            if (b.active) {
                b.y += b.vy * dt;
                ctx.fillRect(Math.floor(b.x - 2), Math.floor(b.y), 4, 12);
                if (b.y < -20) b.active = false;
            }
        });

        engine.current.enemies.items.forEach(e => {
            if (e.active) {
                e.y += e.vy * dt;

                ctx.fillStyle = COLORS.neonRose;
                ctx.beginPath();
                ctx.arc(Math.floor(e.x), Math.floor(e.y), e.size, 0, Math.PI*2);
                ctx.fill();

                if (e.y > h) handleGameOver();

                const dx = e.x - sh.playerX;
                const dy = e.y - playerY;
                if (Math.sqrt(dx*dx + dy*dy) < e.size + 20) {
                    spawnExplosion(sh.playerX, playerY, COLORS.neonBlue, 20);
                    handleGameOver();
                }

                engine.current.bullets.items.forEach(b => {
                    if (b.active) {
                        const bdx = e.x - b.x;
                        const bdy = e.y - b.y;
                        if (Math.sqrt(bdx*bdx + bdy*bdy) < e.size) {
                            e.active = false;
                            b.active = false;
                            spawnExplosion(e.x, e.y, COLORS.neonRose, 10);
                            engine.current.score += 100;
                            setScore(engine.current.score);
                        }
                    }
                });
            }
        });
    };

    // --- MAIN LOOP ---

    const loop = (timestamp: number) => {
        if (engine.current.status !== 'playing') return;

        const dt = Math.min((timestamp - engine.current.lastTime) / 1000, 0.1);
        engine.current.lastTime = timestamp;

        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                const grad = ctx.createLinearGradient(0,0,0,400);
                grad.addColorStop(0, '#09090b');
                if(gameId === 'runner') grad.addColorStop(1, '#1e1b4b');
                if(gameId === 'snake') grad.addColorStop(1, '#022c22');
                if(gameId === 'shooter') grad.addColorStop(1, '#4c0519');
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                if (gameId === 'runner') updateRunner(dt, canvas.width, canvas.height, ctx);
                else if (gameId === 'snake') updateSnake(dt, canvas.width, canvas.height, ctx);
                else if (gameId === 'shooter') updateShooter(dt, canvas.width, canvas.height, ctx);

                updateParticles(dt, ctx);
            }
        }
        engine.current.gameLoopId = requestAnimationFrame(loop);
    };

    const startGame = () => {
        engine.current.score = 0;
        setScore(0);
        engine.current.status = 'playing';
        engine.current.lastTime = performance.now();
        engine.current.particles.reset();

        // Timer Reset
        activeTimeRef.current = 0;
        sessionStartRef.current = Date.now();
        lastReminderRef.current = 0;
        setShowReminder(false);

        const w = 800;
        const h = 400;

        if (canvasRef.current) {
            canvasRef.current.width = w;
            canvasRef.current.height = h;
        }

        if (gameId === 'runner') initRunner(w, h);
        else if (gameId === 'snake') initSnake(w, h);
        else if (gameId === 'shooter') initShooter(w, h);

        setGameState('playing');
        // NOTE: We do NOT call requestAnimationFrame here.
        // The useEffect hook below watches gameState and starts the loop.
    };

    // --- INPUT & EVENTS ---

    // Start/Stop Loop Effect
    useEffect(() => {
        if (gameState === 'playing') {
            engine.current.status = 'playing';
            engine.current.lastTime = performance.now();
            engine.current.gameLoopId = requestAnimationFrame(loop);
        }
        return () => {
            cancelAnimationFrame(engine.current.gameLoopId);
        };
    }, [gameState, gameId]);

    // Timer Effect for Reminders
    useEffect(() => {
        let timerId: NodeJS.Timeout;

        if (gameState === 'playing') {
            if (sessionStartRef.current === 0) sessionStartRef.current = Date.now();

            timerId = setInterval(() => {
                const now = Date.now();
                const sessionDuration = now - sessionStartRef.current;
                const totalDuration = activeTimeRef.current + sessionDuration;
                const minutes = Math.floor(totalDuration / 60000);

                // Reminder Logic: > 10 mins, every 5 mins (10, 15, 20...)
                if (minutes >= 10 && (minutes - 10) % 5 === 0 && minutes !== lastReminderRef.current) {
                    lastReminderRef.current = minutes;
                    setReminderMinutes(minutes);
                    setShowReminder(true);
                    // Hide after 6 seconds
                    setTimeout(() => setShowReminder(false), 6000);
                }
            }, 1000);
        } else {
            // If paused or gameover, accumulate the time and reset session start
            if (sessionStartRef.current > 0) {
                activeTimeRef.current += Date.now() - sessionStartRef.current;
                sessionStartRef.current = 0;
            }
        }

        return () => clearInterval(timerId);
    }, [gameState]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (engine.current.status !== 'playing') return;

            if (gameId === 'runner' && (e.code === 'Space' || e.code === 'ArrowUp')) {
                if (engine.current.runner.playerGrounded) engine.current.runner.playerDy = -800;
            }
            if (gameId === 'snake') {
                const { x, y } = engine.current.snake.dir;
                if (e.key === 'ArrowUp' && y === 0) engine.current.snake.nextDir = { x: 0, y: -1 };
                if (e.key === 'ArrowDown' && y === 0) engine.current.snake.nextDir = { x: 0, y: 1 };
                if (e.key === 'ArrowLeft' && x === 0) engine.current.snake.nextDir = { x: -1, y: 0 };
                if (e.key === 'ArrowRight' && x === 0) engine.current.snake.nextDir = { x: 1, y: 0 };
            }
        };

        const handleMouseMove = (e: MouseEvent) => {
             if (engine.current.status !== 'playing') return;
             if (gameId === 'shooter') {
                 // Map clientX to canvas coordinate space 800x400
                 const cvs = canvasRef.current;
                 if(cvs) {
                    const rect = cvs.getBoundingClientRect();
                    const scaleX = 800 / rect.width;
                    engine.current.shooter.playerX = (e.clientX - rect.left) * scaleX;
                 }
             }
        };

        // TOUCH CONTROLS
        const handleTouchMove = (e: TouchEvent) => {
             if (engine.current.status !== 'playing') return;
             e.preventDefault(); // Prevent scroll
             if (gameId === 'shooter') {
                 const cvs = canvasRef.current;
                 if(cvs) {
                    const rect = cvs.getBoundingClientRect();
                    const scaleX = 800 / rect.width;
                    const touchX = e.touches[0].clientX - rect.left;
                    // Clamp and scale
                    engine.current.shooter.playerX = Math.max(0, Math.min(800, touchX * scaleX));
                 }
             }
        };

        const handleTouchStart = (e: TouchEvent) => {
            if (engine.current.status !== 'playing') return;
            // Only prevent default if touching canvas area to allow UI buttons outside
            if ((e.target as HTMLElement).tagName === 'CANVAS') {
                e.preventDefault();
            }

            touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };

            if (gameId === 'runner' && engine.current.runner.playerGrounded) {
                engine.current.runner.playerDy = -800;
            }
        };

        const handleTouchEnd = (e: TouchEvent) => {
            if (engine.current.status !== 'playing') return;
            if ((e.target as HTMLElement).tagName === 'CANVAS') {
                e.preventDefault();
            }

            if (gameId === 'snake') {
                const dx = e.changedTouches[0].clientX - touchStart.current.x;
                const dy = e.changedTouches[0].clientY - touchStart.current.y;
                const { x, y } = engine.current.snake.dir;

                // Minimum swipe distance
                if (Math.abs(dx) < 20 && Math.abs(dy) < 20) return;

                if (Math.abs(dx) > Math.abs(dy)) {
                    if (dx > 0 && x === 0) engine.current.snake.nextDir = { x: 1, y: 0 };
                    else if (dx < 0 && x === 0) engine.current.snake.nextDir = { x: -1, y: 0 };
                } else {
                    if (dy > 0 && y === 0) engine.current.snake.nextDir = { x: 0, y: 1 };
                    else if (dy < 0 && y === 0) engine.current.snake.nextDir = { x: 0, y: -1 };
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('mousemove', handleMouseMove);

        // Attach touch listeners to window (or canvas directly if refs available, but window covers out-of-bounds drags)
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
            canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
            canvas.addEventListener('touchend', handleTouchEnd, { passive: false });
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('mousemove', handleMouseMove);
            if (canvas) {
                canvas.removeEventListener('touchmove', handleTouchMove);
                canvas.removeEventListener('touchstart', handleTouchStart);
                canvas.removeEventListener('touchend', handleTouchEnd);
            }
        };
    }, [gameId, difficulty]);

    // UI Components for Overlays
    const DifficultyButtons = () => (
        <div className="flex gap-2 mb-6 justify-center">
            {['easy', 'medium', 'hard'].map(d => (
                <button
                    key={d}
                    onClick={() => setDifficulty(d as any)}
                    className={`px-4 py-1 rounded-full text-xs font-bold uppercase transition border border-${theme}-500/30 ${difficulty === d ? `bg-${theme}-600 text-white shadow-[0_0_10px_rgba(255,255,255,0.3)] scale-105` : 'bg-black/40 text-zinc-400 hover:bg-black/60'}`}
                >
                    {d}
                </button>
            ))}
        </div>
    );

    return (
        <div className={`w-full h-full bg-slate-50 dark:bg-transparent flex flex-col items-center p-2 md:p-6 pt-28 pb-8 relative select-none touch-none`}>
             <button onClick={onExit} className="fixed top-24 left-4 md:left-8 z-30 px-4 py-2 bg-black/40 backdrop-blur border border-white/10 text-white rounded-xl text-sm font-bold hover:bg-white/10 transition flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Exit
            </button>

            {/* TIME REMINDER NOTIFICATION */}
            {showReminder && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-yellow-500 text-black px-6 py-3 rounded-full border-4 border-black font-black shadow-2xl animate-bounce flex items-center gap-3 w-max max-w-[90vw]">
                    <Clock className="w-6 h-6" />
                    <span className="text-sm md:text-base">{reminderMinutes} mins passed. Take a break!</span>
                </div>
            )}

            <div className={`
                relative rounded-3xl overflow-hidden
                bg-white dark:bg-zinc-900
                border-2 border-black dark:border-${theme}-500/30
                shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-2xl dark:shadow-black/50
                mx-auto w-full max-w-4xl my-auto
                aspect-[2/1]
                flex flex-col transition-transform duration-100 ${shake ? 'scale-[0.98] animate-glitch' : ''}
            `}>

                {/* Game Layer */}
                <canvas ref={canvasRef} className="w-full h-full bg-black block" />

                {/* HUD (Heads Up Display) */}
                {(gameState === 'playing' || gameState === 'paused') && (
                    <div className="absolute top-4 right-4 md:top-6 md:right-6 flex items-center gap-2 md:gap-4 text-white font-mono z-10 text-xs md:text-sm">
                        <div className={`bg-black/60 backdrop-blur px-2 md:px-4 py-1 md:py-2 rounded-lg border border-${theme}-500/30`}>
                            HI: <span className={`text-${theme}-400 font-bold`}>{highScore}</span>
                        </div>
                        <div className={`bg-black/60 backdrop-blur px-2 md:px-4 py-1 md:py-2 rounded-lg border border-${theme}-500/30`}>
                            SCORE: <span className="text-white font-bold">{score}</span>
                        </div>
                        <button
                            onClick={togglePause}
                            className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-lg bg-black/60 backdrop-blur border border-${theme}-500/30 hover:bg-${theme}-900/40 transition`}
                        >
                            {gameState === 'paused' ? <Play className="w-3 h-3 md:w-4 md:h-4 fill-white" /> : <Pause className="w-3 h-3 md:w-4 md:h-4 fill-white" />}
                        </button>
                    </div>
                )}

                {/* Start Screen Overlay */}
                {gameState === 'start' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/85 backdrop-blur-md z-20 p-4 text-center">
                        <h2 className="text-2xl md:text-6xl font-black text-white mb-2 italic tracking-tighter" style={{ textShadow: `0 0 20px ${themeColor}` }}>
                            {gameMeta?.title.toUpperCase()}
                        </h2>
                        <p className={`text-${theme}-300/80 mb-6 text-[10px] md:text-sm uppercase tracking-widest`}>
                            {gameId === 'runner' ? 'Neon City Dash' : gameId === 'snake' ? 'Matrix Grid Logic' : 'Deep Space Bug Shooter'}
                        </p>

                        <DifficultyButtons />

                        <p className="text-zinc-400 mb-8 font-mono text-[10px] md:text-sm bg-black/50 px-4 py-2 rounded-lg border border-white/5">
                            {gameMeta?.controls}
                        </p>

                        <button
                            onClick={startGame}
                            className={`px-6 py-3 md:px-10 md:py-4 bg-${theme}-600 hover:bg-${theme}-500 text-white font-bold rounded-full text-base md:text-xl shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-105 transition-transform flex items-center gap-2`}
                        >
                            <Play className="w-4 h-4 md:w-5 md:h-5 fill-current" /> START GAME
                        </button>
                    </div>
                )}

                {/* Pause Overlay */}
                {gameState === 'paused' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-20">
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">PAUSED</h2>
                        <div className="flex gap-4">
                            <button
                                onClick={togglePause}
                                className={`px-6 py-2 md:px-8 md:py-3 bg-white text-black font-bold rounded-xl hover:scale-105 transition-transform text-sm md:text-base`}
                            >
                                RESUME
                            </button>
                            <button
                                onClick={onExit}
                                className={`px-6 py-2 md:px-8 md:py-3 bg-zinc-800 text-white font-bold rounded-xl hover:bg-zinc-700 transition-colors text-sm md:text-base`}
                            >
                                EXIT
                            </button>
                        </div>
                    </div>
                )}

                {/* Game Over Overlay */}
                {gameState === 'gameover' && (
                    <div className={`absolute inset-0 flex flex-col items-center justify-center bg-black/85 backdrop-blur-md z-20 animate-in fade-in duration-500 ${shake ? 'shadow-[inset_0_0_100px_rgba(220,38,38,0.5)]' : ''}`}>
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-2 italic tracking-tighter text-red-500 animate-pulse" style={{ textShadow: '0 0 30px red' }}>
                            GAME OVER
                        </h2>
                        <p className={`text-${theme}-300/80 mb-6 text-xs md:text-sm uppercase tracking-widest`}>
                            Mission Failed
                        </p>

                        <div className="text-center mb-8 p-4 bg-white/5 rounded-2xl border border-white/10 transform transition-all hover:scale-105">
                            <p className="text-lg md:text-xl font-bold text-white mb-1">SCORE: <span className="text-white text-2xl md:text-3xl block mt-1">{score}</span></p>
                            <div className="w-full h-px bg-white/10 my-3"></div>
                            <p className={`text-xs md:text-sm text-${theme}-400 font-mono`}>HIGH SCORE: {highScore}</p>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={startGame}
                                className={`px-6 py-3 md:px-8 md:py-3 bg-${theme}-600 hover:bg-${theme}-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-105 transition-transform flex items-center gap-2 text-sm md:text-base`}
                            >
                                <RotateCcw className="w-4 h-4 md:w-5 md:h-5" /> REPLAY
                            </button>
                             <button
                                onClick={onExit}
                                className={`px-6 py-3 md:px-8 md:py-3 bg-zinc-800 text-white font-bold rounded-xl hover:bg-zinc-700 transition-colors text-sm md:text-base`}
                            >
                                EXIT
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                .perspective-1000 { perspective: 1000px; }
                .transform-style-3d { transform-style: preserve-3d; }
                .backface-hidden { backface-visibility: hidden; }
                .rotate-y-180 { transform: rotateY(180deg); }

                @keyframes glitch-shake {
                    0% { transform: translate(0) }
                    20% { transform: translate(-2px, 2px) }
                    40% { transform: translate(-2px, -2px) }
                    60% { transform: translate(2px, 2px) }
                    80% { transform: translate(2px, -2px) }
                    100% { transform: translate(0) }
                }
                .animate-glitch {
                    animation: glitch-shake 0.1s cubic-bezier(.36,.07,.19,.97) both;
                    animation-iteration-count: 5;
                }
            `}</style>
        </div>
    );
};

export default Arcade;