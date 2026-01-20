
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameStatus, Pokemon, LevelConfig, PlayerState } from './types';
import { LEVELS, GRAVITY, JUMP_FORCE, MOVE_SPEED, FRICTION, MAX_HEALTH, WORLD_HEIGHT } from './constants';
import { fetchPokemons, searchPokemon } from './services/pokeApi';

// Sub-components
const HealthBar: React.FC<{ health: number }> = ({ health }) => {
  const percentage = Math.max(0, (health / MAX_HEALTH) * 100);
  return (
    <div className="fixed top-4 left-4 w-64 bg-gray-800/50 p-2 rounded-full border-2 border-white/20 backdrop-blur-sm z-50">
      <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-red-500 to-green-500 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

const GameOver: React.FC<{ onRetry: () => void, onMenu: () => void }> = ({ onRetry, onMenu }) => (
  <div className="fixed inset-0 bg-black/80 flex flex-col items-center justify-center z-[100] text-white p-6">
    <h2 className="pixel-font text-5xl mb-8 text-red-500 text-center drop-shadow-lg">¡GAME OVER!</h2>
    <div className="flex flex-col sm:flex-row gap-4">
      <button 
        onClick={onRetry}
        className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl pixel-font text-sm transition-transform active:scale-95 shadow-xl"
      >
        REINTENTAR
      </button>
      <button 
        onClick={onMenu}
        className="px-8 py-4 bg-gray-600 hover:bg-gray-700 text-white rounded-xl pixel-font text-sm transition-transform active:scale-95 shadow-xl"
      >
        MENÚ PRINCIPAL
      </button>
    </div>
  </div>
);

const LevelSuccess: React.FC<{ isFinal: boolean, onNext: () => void, onMenu: () => void }> = ({ isFinal, onNext, onMenu }) => (
  <div className="fixed inset-0 bg-white/10 backdrop-blur-md flex flex-col items-center justify-center z-[100] text-white p-6">
    <h2 className="pixel-font text-4xl mb-8 text-yellow-400 text-center drop-shadow-lg">
      {isFinal ? '¡CAMPEÓN POKÉMON!' : '¡NIVEL COMPLETADO!'}
    </h2>
    <div className="flex flex-col sm:flex-row gap-4">
      {!isFinal && (
        <button 
          onClick={onNext}
          className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl pixel-font text-sm transition-transform active:scale-95 shadow-xl"
        >
          SIGUIENTE NIVEL
        </button>
      )}
      <button 
        onClick={onMenu}
        className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl pixel-font text-sm transition-transform active:scale-95 shadow-xl"
      >
        {isFinal ? 'VOLVER AL INICIO' : 'MENÚ'}
      </button>
    </div>
  </div>
);

const App: React.FC = () => {
  const [status, setStatus] = useState<GameStatus>(GameStatus.START_MENU);
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [player, setPlayer] = useState<PlayerState>({
    x: 100, y: 400, vx: 0, vy: 0, width: 64, height: 64, health: MAX_HEALTH,
    isJumping: false, isHurt: false, direction: 'right'
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [cameraX, setCameraX] = useState(0);

  const requestRef = useRef<number>();
  const keysPressed = useRef<{ [key: string]: boolean }>({});
  const gameContainerRef = useRef<HTMLDivElement>(null);

  const currentLevel = LEVELS[currentLevelIndex];

  // Load Pokemons
  useEffect(() => {
    fetchPokemons().then(setPokemons);
  }, []);

  // Controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { keysPressed.current[e.key] = true; };
    const handleKeyUp = (e: KeyboardEvent) => { keysPressed.current[e.key] = false; };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const resetPlayer = (level: LevelConfig) => {
    setPlayer({
      x: 100, y: 400, vx: 0, vy: 0, width: 64, height: 64, health: MAX_HEALTH,
      isJumping: false, isHurt: false, direction: 'right'
    });
    setCameraX(0);
  };

  const startGame = (pokemon: Pokemon) => {
    setSelectedPokemon(pokemon);
    setCurrentLevelIndex(0);
    resetPlayer(LEVELS[0]);
    setStatus(GameStatus.PLAYING);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    const p = await searchPokemon(searchQuery);
    if (p) startGame(p);
  };

  // Game Loop
  const update = useCallback(() => {
    if (status !== GameStatus.PLAYING) return;

    setPlayer(prev => {
      // Fix: Destructure directly from prev to ensure TypeScript correctly infers values
      // and avoid initializer errors that can occur when spreading into an object literal for destructuring.
      let { x, y, vx, vy, health, isJumping, isHurt, direction } = prev;

      // Movement
      if (keysPressed.current['ArrowLeft'] || keysPressed.current['a']) {
        vx = -MOVE_SPEED;
        direction = 'left';
      } else if (keysPressed.current['ArrowRight'] || keysPressed.current['d']) {
        vx = MOVE_SPEED;
        direction = 'right';
      } else {
        vx *= FRICTION;
      }

      // Jump
      if ((keysPressed.current['ArrowUp'] || keysPressed.current['w'] || keysPressed.current[' ']) && !isJumping) {
        vy = JUMP_FORCE;
        isJumping = true;
      }

      // Physics
      vy += GRAVITY;
      x += vx;
      y += vy;

      // Platform Collisions
      let onPlatform = false;
      for (const plat of currentLevel.platforms) {
        // Simple AABB collision detection
        if (x + prev.width > plat.x && x < plat.x + plat.width &&
            y + prev.height > plat.y && y + prev.height < plat.y + plat.height + 20 &&
            vy >= 0) {
          y = plat.y - prev.height;
          vy = 0;
          isJumping = false;
          onPlatform = true;
          
          if (plat.type === 'bouncy') {
            vy = JUMP_FORCE * 1.5;
            isJumping = true;
          }
          if (plat.type === 'slippery') {
             vx *= 1.05; // Less friction / slight acceleration
          }
        }
      }

      // Obstacle Collisions
      for (const obs of currentLevel.obstacles) {
        if (x + prev.width > obs.x && x < obs.x + obs.width &&
            y + prev.height > obs.y && y < obs.y + obs.height) {
          if (!isHurt) {
            health -= obs.damage;
            isHurt = true;
            // Repulse
            vx = -vx * 2 || (direction === 'left' ? 10 : -10);
            vy = -5;
            setTimeout(() => setPlayer(p => ({ ...p, isHurt: false })), 500);
          }
        }
      }

      // Boundary Checks
      if (x < 0) x = 0;
      if (x > currentLevel.width - prev.width) x = currentLevel.width - prev.width;
      if (y > WORLD_HEIGHT) {
        // Fall out of world
        health = 0;
      }

      // Goal check
      const goal = currentLevel.goal;
      if (x + prev.width > goal.x && x < goal.x + goal.width &&
          y + prev.height > goal.y && y < goal.y + goal.height) {
        setStatus(GameStatus.LEVEL_COMPLETE);
      }

      if (health <= 0) {
        setStatus(GameStatus.GAME_OVER);
        health = 0;
      }

      return { ...prev, x, y, vx, vy, health, isJumping, isHurt, direction };
    });

    // Camera following
    setCameraX(prevCamera => {
      const target = player.x - window.innerWidth / 3;
      return Math.max(0, Math.min(target, currentLevel.width - window.innerWidth));
    });

    requestRef.current = requestAnimationFrame(update);
  }, [status, currentLevel, player.x]);

  useEffect(() => {
    if (status === GameStatus.PLAYING) {
      requestRef.current = requestAnimationFrame(update);
    } else if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [status, update]);

  // Actions
  const handleNextLevel = () => {
    if (currentLevelIndex < LEVELS.length - 1) {
      setCurrentLevelIndex(prev => prev + 1);
      resetPlayer(LEVELS[currentLevelIndex + 1]);
      setStatus(GameStatus.PLAYING);
    } else {
      setStatus(GameStatus.WINNER);
    }
  };

  const handleRetry = () => {
    resetPlayer(currentLevel);
    setStatus(GameStatus.PLAYING);
  };

  const handleMenu = () => {
    setStatus(GameStatus.START_MENU);
  };

  // Render Screens
  if (status === GameStatus.START_MENU || status === GameStatus.SELECTING_POKEMON) {
    return (
      <div className="min-h-screen bg-[#111] text-white flex flex-col items-center justify-center p-6 bg-[url('https://picsum.photos/1920/1080?blur=10')] bg-cover">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        
        <div className="relative z-10 w-full max-w-4xl flex flex-col items-center">
          <h1 className="pixel-font text-3xl sm:text-5xl mb-12 text-center text-yellow-400 drop-shadow-[0_4px_4px_rgba(0,0,0,1)] animate-bounce">
            PokéHome Adventure
          </h1>

          <div className="w-full bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
            <h2 className="pixel-font text-xl mb-6 text-center">Busca tu Mascota</h2>
            <form onSubmit={handleSearch} className="flex gap-2 mb-10 max-w-md mx-auto">
              <input 
                type="text" 
                placeholder="Nombre del Pokémon..."
                className="flex-1 bg-white/20 border-2 border-white/30 rounded-xl px-4 py-3 outline-none focus:border-yellow-400 transition-all text-white placeholder:text-white/50"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <button 
                type="submit"
                className="bg-yellow-500 hover:bg-yellow-600 px-6 py-3 rounded-xl pixel-font text-xs text-black transition-transform active:scale-95"
              >
                GO!
              </button>
            </form>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {pokemons.map(p => (
                <button 
                  key={p.id}
                  onClick={() => startGame(p)}
                  className="group relative flex flex-col items-center p-4 bg-white/5 hover:bg-white/20 rounded-xl border border-white/10 transition-all hover:-translate-y-1"
                >
                  <img src={p.sprite} alt={p.name} className="w-20 h-20 object-contain mb-2 group-hover:scale-110 transition-transform" />
                  <span className="pixel-font text-[10px] text-gray-300">{p.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative w-full h-screen overflow-hidden select-none"
      style={{ background: currentLevel.background }}
    >
      {/* UI Overlay */}
      <HealthBar health={player.health} />
      <div className="fixed top-4 right-4 pixel-font text-sm text-white/80 z-50 flex flex-col items-end gap-1">
        <span>Nivel {currentLevel.id}: {currentLevel.name}</span>
        <div className="flex gap-2 text-[10px]">
          {LEVELS.map((l, i) => (
            <div 
              key={l.id} 
              className={`w-3 h-3 rounded-full border border-white/50 ${i === currentLevelIndex ? 'bg-yellow-400' : i < currentLevelIndex ? 'bg-green-500' : 'bg-transparent'}`}
            />
          ))}
        </div>
      </div>

      {/* Game World */}
      <div 
        ref={gameContainerRef}
        className="relative h-full transition-transform duration-75 ease-out"
        style={{ 
          width: currentLevel.width, 
          transform: `translateX(-${cameraX}px)`
        }}
      >
        {/* Platforms */}
        {currentLevel.platforms.map((plat, i) => (
          <div 
            key={i}
            className={`absolute shadow-lg rounded-sm border-b-4 border-black/20 ${
              plat.type === 'slippery' ? 'bg-blue-300/80 brightness-110' : 
              plat.type === 'bouncy' ? 'bg-pink-400/80 animate-pulse' : 
              'bg-gray-700/80'
            }`}
            style={{ 
              left: plat.x, 
              top: plat.y, 
              width: plat.width, 
              height: plat.height 
            }}
          >
             <div className="absolute inset-0 bg-white/10 pointer-events-none" />
          </div>
        ))}

        {/* Obstacles */}
        {currentLevel.obstacles.map((obs, i) => (
          <div 
            key={i}
            className="absolute flex items-center justify-center text-3xl animate-float"
            style={{ 
              left: obs.x, 
              top: obs.y, 
              width: obs.width, 
              height: obs.height 
            }}
          >
            {obs.label}
          </div>
        ))}

        {/* Goal */}
        <div 
          className="absolute flex flex-col items-center justify-center"
          style={{ 
            left: currentLevel.goal.x, 
            top: currentLevel.goal.y, 
            width: currentLevel.goal.width, 
            height: currentLevel.goal.height 
          }}
        >
          <div className="text-5xl animate-bounce">🚩</div>
          <div className="w-1 h-20 bg-gray-400" />
        </div>

        {/* Player */}
        <div 
          className={`absolute transition-opacity ${player.isHurt ? 'opacity-50' : 'opacity-100'}`}
          style={{ 
            left: player.x, 
            top: player.y, 
            width: player.width, 
            height: player.height,
            transform: `scaleX(${player.direction === 'left' ? -1 : 1})`,
            filter: player.isHurt ? 'invert(20%) sepia(100%) saturate(1000%) hue-rotate(0deg)' : 'none'
          }}
        >
          <img 
            src={selectedPokemon?.sprite} 
            alt="player" 
            className={`w-full h-full object-contain ${player.isJumping ? 'animate-pulse' : ''}`}
          />
        </div>
      </div>

      {/* Screen Modals */}
      {status === GameStatus.GAME_OVER && <GameOver onRetry={handleRetry} onMenu={handleMenu} />}
      {(status === GameStatus.LEVEL_COMPLETE || status === GameStatus.WINNER) && (
        <LevelSuccess 
          isFinal={status === GameStatus.WINNER} 
          onNext={handleNextLevel} 
          onMenu={handleMenu} 
        />
      )}

      {/* Touch Controls (Mobile) */}
      <div className="fixed bottom-8 left-8 right-8 flex justify-between sm:hidden z-50">
        <div className="flex gap-4">
           <button 
            onTouchStart={() => { keysPressed.current['ArrowLeft'] = true; }} 
            onTouchEnd={() => { keysPressed.current['ArrowLeft'] = false; }}
            className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-3xl active:scale-90"
           >
            ←
           </button>
           <button 
            onTouchStart={() => { keysPressed.current['ArrowRight'] = true; }} 
            onTouchEnd={() => { keysPressed.current['ArrowRight'] = false; }}
            className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-3xl active:scale-90"
           >
            →
           </button>
        </div>
        <button 
          onTouchStart={() => { keysPressed.current['ArrowUp'] = true; }} 
          onTouchEnd={() => { keysPressed.current['ArrowUp'] = false; }}
          className="w-20 h-20 bg-yellow-500/40 backdrop-blur-md rounded-full flex items-center justify-center text-4xl active:scale-90"
        >
          ↑
        </button>
      </div>
    </div>
  );
};

export default App;
