<script lang="ts">
  import { animationConfigs, type DestructionType } from '$lib/animations';
  
  interface Props { active: boolean; type: DestructionType; targetRect?: DOMRect | null; }
  let { active, type, targetRect = null }: Props = $props();
  
  interface Particle { id: number; x: number; y: number; color: string; size: number; angle: number; speed: number; rotation: number; delay: number; }
  let particles = $state<Particle[]>([]);
  
  $effect(() => {
    if (active && targetRect) {
      const config = animationConfigs[type];
      const centerX = targetRect.left + targetRect.width / 2;
      const centerY = targetRect.top + targetRect.height / 2;
      const isMobile = window.innerWidth < 600;
      const count = isMobile ? Math.floor(config.count / 2) : config.count;
      
      particles = Array.from({ length: count }, (_, i) => ({
        id: i, x: centerX, y: centerY,
        color: config.colors[Math.floor(Math.random() * config.colors.length)],
        size: Math.random() * 12 + 4,
        angle: Math.random() * Math.PI * 2,
        speed: Math.random() * config.spread + 50,
        rotation: Math.random() * 720 - 360,
        delay: Math.random() * 0.3
      }));
      setTimeout(() => { particles = []; }, config.duration + 500);
    }
  });
  
  function getStyle(p: Particle): string {
    const cfg = animationConfigs[type];
    const tx = Math.cos(p.angle) * p.speed;
    const ty = Math.sin(p.angle) * p.speed;
    return `--sx:${p.x}px;--sy:${p.y}px;--tx:${tx}px;--ty:${ty}px;--rot:${p.rotation}deg;--sz:${p.size}px;--c:${p.color};--del:${p.delay}s;--dur:${cfg.duration/1000}s`;
  }
</script>

{#if active && particles.length > 0}
  <div class="overlay">
    {#each particles as p (p.id)}
      <div class="particle {type}" style={getStyle(p)}></div>
    {/each}
    {#if type === 'explosion' && targetRect}
      <div class="flash" style="--fx:{targetRect.left + targetRect.width/2}px;--fy:{targetRect.top + targetRect.height/2}px"></div>
    {/if}
    {#if type === 'blackhole' && targetRect}
      <div class="singularity" style="--fx:{targetRect.left + targetRect.width/2}px;--fy:{targetRect.top + targetRect.height/2}px"></div>
    {/if}
  </div>
{/if}

<style>
  .overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; pointer-events: none; z-index: 1000; overflow: hidden; }
  
  .particle {
    position: fixed; left: var(--sx); top: var(--sy); width: var(--sz); height: var(--sz); background: var(--c);
    animation-delay: var(--del); animation-duration: var(--dur); animation-fill-mode: forwards; animation-timing-function: ease-out;
  }
  .particle.explosion { border-radius: 50%; animation-name: pExplode; box-shadow: 0 0 10px var(--c); }
  .particle.incineration { border-radius: 50%; animation-name: pFire; filter: blur(1px); }
  .particle.disintegration { border-radius: 2px; animation-name: pDust; }
  .particle.blackhole { border-radius: 50%; animation-name: pVortex; box-shadow: 0 0 8px var(--c); }
  .particle.lightning { width: 3px; border-radius: 2px; animation-name: pSpark; box-shadow: 0 0 15px var(--c); }
  .particle.crushing { border-radius: 3px; animation-name: pDebris; }
  
  @keyframes pExplode {
    0% { transform: translate(0,0) scale(1) rotate(0); opacity: 1; }
    100% { transform: translate(var(--tx),var(--ty)) scale(0) rotate(var(--rot)); opacity: 0; }
  }
  @keyframes pFire {
    0% { transform: translate(0,0) scale(1); opacity: 1; }
    100% { transform: translate(calc(var(--tx)*0.3),calc(var(--ty) - 100px)) scale(0.2); opacity: 0; }
  }
  @keyframes pDust {
    0% { transform: translate(0,0) scale(1); opacity: 1; }
    100% { transform: translate(calc(var(--tx)+150px),var(--ty)) scale(0.3); opacity: 0; }
  }
  @keyframes pVortex {
    0% { transform: translate(var(--tx),var(--ty)) scale(1) rotate(0); opacity: 1; }
    100% { transform: translate(0,0) scale(0) rotate(720deg); opacity: 0; }
  }
  @keyframes pSpark {
    0% { transform: translate(0,0) scale(1) rotate(var(--rot)); opacity: 1; }
    50% { opacity: 1; }
    100% { transform: translate(var(--tx),var(--ty)) scale(0.5) rotate(calc(var(--rot)*2)); opacity: 0; }
  }
  @keyframes pDebris {
    0% { transform: translate(0,0) scale(1) rotate(0); opacity: 1; }
    100% { transform: translate(var(--tx),calc(var(--ty)+200px)) scale(0.5) rotate(var(--rot)); opacity: 0; }
  }
  
  .flash {
    position: fixed; left: calc(var(--fx) - 150px); top: calc(var(--fy) - 150px); width: 300px; height: 300px;
    background: radial-gradient(circle, rgba(255,215,0,0.8), rgba(255,107,0,0.5) 40%, transparent 70%);
    border-radius: 50%; animation: flashBurst 0.3s ease-out forwards;
  }
  @keyframes flashBurst { 0% { transform: scale(0); opacity: 1; } 100% { transform: scale(2); opacity: 0; } }
  
  .singularity {
    position: fixed; left: calc(var(--fx) - 50px); top: calc(var(--fy) - 50px); width: 100px; height: 100px;
    background: radial-gradient(circle, #000, #6B00FF 50%, transparent 70%); border-radius: 50%;
    animation: singularity 2s ease-in-out forwards; box-shadow: 0 0 50px 20px rgba(107,0,255,0.5);
  }
  @keyframes singularity { 0% { transform: scale(0); opacity: 0; } 30% { transform: scale(1.5); opacity: 1; } 100% { transform: scale(0); opacity: 0; } }
  
  @media (prefers-reduced-motion: reduce) { .particle, .flash, .singularity { display: none; } }
</style>
