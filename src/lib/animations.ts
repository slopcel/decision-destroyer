export type DestructionType = 'explosion' | 'incineration' | 'disintegration' | 'blackhole' | 'lightning' | 'crushing';

export const destructionTypes: DestructionType[] = ['explosion', 'incineration', 'disintegration', 'blackhole', 'lightning', 'crushing'];

export function getRandomDestruction(): DestructionType {
  return destructionTypes[Math.floor(Math.random() * destructionTypes.length)];
}

export interface ParticleConfig {
  count: number;
  colors: string[];
  duration: number;
  spread: number;
}

export const animationConfigs: Record<DestructionType, ParticleConfig> = {
  explosion: { count: 50, colors: ['#FF0040', '#FF6B00', '#FFD700', '#FFFFFF'], duration: 1500, spread: 300 },
  incineration: { count: 40, colors: ['#FF0040', '#FF6B00', '#FFD700', '#222222'], duration: 2000, spread: 100 },
  disintegration: { count: 80, colors: ['#FFFFFF', '#CCCCCC', '#888888', '#444444'], duration: 1800, spread: 200 },
  blackhole: { count: 60, colors: ['#6B00FF', '#0040FF', '#00FFD7', '#FFFFFF'], duration: 2000, spread: 150 },
  lightning: { count: 30, colors: ['#00D4FF', '#FFFFFF', '#FFD700', '#00FF6A'], duration: 1200, spread: 250 },
  crushing: { count: 35, colors: ['#888888', '#666666', '#444444', '#222222'], duration: 1000, spread: 200 }
};
