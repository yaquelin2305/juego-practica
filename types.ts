
export interface Pokemon {
  id: number;
  name: string;
  sprite: string;
}

export enum GameStatus {
  START_MENU = 'START_MENU',
  SELECTING_POKEMON = 'SELECTING_POKEMON',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER',
  LEVEL_COMPLETE = 'LEVEL_COMPLETE',
  WINNER = 'WINNER'
}

export interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
  type?: 'normal' | 'bouncy' | 'slippery';
}

export interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  damage: number;
  label: string;
}

export interface LevelConfig {
  id: number;
  name: string;
  description: string;
  theme: string;
  background: string;
  platforms: Platform[];
  obstacles: Obstacle[];
  goal: { x: number; y: number; width: number; height: number };
  width: number;
}

export interface PlayerState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  health: number;
  isJumping: boolean;
  isHurt: boolean;
  direction: 'left' | 'right';
}
