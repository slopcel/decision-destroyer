<script lang="ts">
  import { onMount } from "svelte";
  import OptionCard from "$lib/components/OptionCard.svelte";
  import DestroyButton from "$lib/components/DestroyButton.svelte";
  import DestructionOverlay from "$lib/components/DestructionOverlay.svelte";
  import CreatorSection from "$lib/components/CreatorSection.svelte";
  import {
    getRandomDestruction,
    type DestructionType,
    animationConfigs,
  } from "$lib/animations";
  import { playDestructionSound, playWinner } from "$lib/sounds";

  type GameState = "idle" | "ready" | "choosing" | "destroying" | "winner";

  let optionA = $state("");
  let optionB = $state("");
  let gameState = $state<GameState>("idle");
  let loser = $state<"A" | "B" | null>(null);
  let destructionType = $state<DestructionType | null>(null);
  let decisionsDestroyed = $state(0);
  let isMuted = $state(true);
  let screenShake = $state(false);
  let loserRect = $state<DOMRect | null>(null);

  let cardAElement: HTMLDivElement;
  let cardBElement: HTMLDivElement;

  let isReady = $derived(
    optionA.trim().length > 0 && optionB.trim().length > 0,
  );

  $effect(() => {
    if (isReady && gameState === "idle") {
      gameState = "ready";
    } else if (!isReady && gameState === "ready") {
      gameState = "idle";
    }
  });

  onMount(() => {
    const savedCount = localStorage.getItem("decisionsDestroyed");
    if (savedCount) decisionsDestroyed = parseInt(savedCount, 10);
    const savedMute = localStorage.getItem("isMuted");
    if (savedMute !== null) isMuted = savedMute === "true";
  });

  function toggleMute() {
    isMuted = !isMuted;
    localStorage.setItem("isMuted", String(isMuted));
  }

  async function destroyOne() {
    if (!isReady || gameState !== "ready") return;

    gameState = "choosing";

    // Tension phase - flash between options
    await new Promise((r) => setTimeout(r, 500));

    // Pick loser randomly
    loser = Math.random() < 0.5 ? "A" : "B";
    destructionType = getRandomDestruction();

    // Get loser card position for particles
    const loserElement = loser === "A" ? cardAElement : cardBElement;
    if (loserElement) {
      loserRect = loserElement.getBoundingClientRect();
    }

    gameState = "destroying";

    // Play destruction sound
    playDestructionSound(destructionType, isMuted);

    // Screen shake for impact effects
    if (
      destructionType === "explosion" ||
      destructionType === "crushing" ||
      destructionType === "lightning"
    ) {
      setTimeout(
        () => {
          screenShake = true;
          setTimeout(() => {
            screenShake = false;
          }, 500);
        },
        destructionType === "crushing" ? 700 : 100,
      );
    }

    // Wait for destruction animation
    const duration = animationConfigs[destructionType].duration;
    await new Promise((r) => setTimeout(r, duration));

    // Winner revealed
    gameState = "winner";
    playWinner(isMuted);

    // Increment counter
    decisionsDestroyed++;
    localStorage.setItem("decisionsDestroyed", String(decisionsDestroyed));
  }

  function reset() {
    optionA = "";
    optionB = "";
    gameState = "idle";
    loser = null;
    destructionType = null;
    loserRect = null;
  }

  function formatNumber(n: number): string {
    return n.toLocaleString();
  }
</script>

<svelte:head>
  <title>Decision Destroyer</title>
</svelte:head>

<main class:screen-shake={screenShake}>
  <div class="background-effects">
    <div class="glow glow-1"></div>
    <div class="glow glow-2"></div>
    <div class="glow glow-3"></div>
  </div>

  <header>
    <div class="title-container">
      <h1 data-text="DECISION DESTROYER">DECISION DESTROYER</h1>
      <p class="tagline">
        Let fate decide. <span class="violent">Violently.</span>
      </p>
    </div>
    <button
      class="mute-toggle"
      onclick={toggleMute}
      aria-label={isMuted ? "Unmute sounds" : "Mute sounds"}
    >
      <span class="icon">{isMuted ? "🔇" : "🔊"}</span>
      <span class="label">{isMuted ? "MUTED" : "SOUND ON"}</span>
    </button>
  </header>

  <div class="arena">
    <div class="card-container" bind:this={cardAElement}>
      {#if gameState !== "winner" || loser !== "A"}
        <OptionCard
          value={optionA}
          placeholder="ENTER OPTION A"
          disabled={gameState !== "idle" && gameState !== "ready"}
          isChoosing={gameState === "choosing"}
          isWinner={gameState === "winner" && loser === "B"}
          isLoser={gameState === "destroying" && loser === "A"}
          {destructionType}
          onInput={(v) => (optionA = v)}
        />
      {/if}
    </div>

    <div class="versus" class:hidden={gameState === "winner"}>
      <div class="vs-circle">VS</div>
    </div>

    <div class="card-container" bind:this={cardBElement}>
      {#if gameState !== "winner" || loser !== "B"}
        <OptionCard
          value={optionB}
          placeholder="ENTER OPTION B"
          disabled={gameState !== "idle" && gameState !== "ready"}
          isChoosing={gameState === "choosing"}
          isWinner={gameState === "winner" && loser === "A"}
          isLoser={gameState === "destroying" && loser === "B"}
          {destructionType}
          onInput={(v) => (optionB = v)}
        />
      {/if}
    </div>

    {#if gameState === "winner"}
      <div class="winner-message" data-text="FATE HAS SPOKEN">
        FATE HAS SPOKEN
        <div class="winner-glow"></div>
      </div>
    {/if}
  </div>

  <div class="button-container">
    {#if gameState === "winner"}
      <DestroyButton showReset={true} onClick={reset} />
    {:else}
      <DestroyButton
        disabled={!isReady ||
          gameState === "choosing" ||
          gameState === "destroying"}
        onClick={destroyOne}
      />
    {/if}
  </div>

  <footer>
    <div class="stats">
      <p class="counter">
        Total Sacrifices: <span class="count"
          >{formatNumber(decisionsDestroyed)}</span
        >
      </p>
    </div>
  </footer>

  <CreatorSection />

  <DestructionOverlay
    active={gameState === "destroying"}
    type={destructionType ?? "explosion"}
    targetRect={loserRect}
  />
</main>

<style>
  main {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: Clamp(2rem, 5vh, 5rem) 1.5rem;
    position: relative;
    overflow: hidden;
  }

  .background-effects {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 0;
  }

  .glow {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.15;
  }

  .glow-1 {
    top: -10%;
    left: 50%;
    transform: translateX(-50%);
    width: 60vw;
    height: 40vh;
    background: radial-gradient(circle, var(--destruction-yellow), transparent);
  }

  .glow-2 {
    bottom: -10%;
    left: -10%;
    width: 50vw;
    height: 50vh;
    background: radial-gradient(circle, var(--destruction-red), transparent);
  }

  .glow-3 {
    bottom: -10%;
    right: -10%;
    width: 50vw;
    height: 50vh;
    background: radial-gradient(circle, var(--destruction-orange), transparent);
  }

  header {
    width: 100%;
    max-width: 1200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    margin-bottom: 4rem;
    position: relative;
    z-index: 10;
  }

  .title-container {
    text-align: center;
  }

  h1 {
    font-family: var(--font-heading);
    font-size: clamp(2.5rem, 10vw, 6rem);
    line-height: 0.9;
    letter-spacing: 0.05em;
    color: var(--destruction-yellow);
    position: relative;
    text-shadow: 0 0 30px rgba(255, 215, 0, 0.3);
  }

  h1::after {
    content: attr(data-text);
    position: absolute;
    left: 0;
    top: 4px;
    width: 100%;
    color: var(--destruction-red);
    z-index: -1;
    filter: blur(2px);
    opacity: 0.5;
  }

  .tagline {
    font-family: var(--font-body);
    font-size: clamp(1rem, 3vw, 1.25rem);
    color: #888;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    margin-top: 1rem;
  }

  .violent {
    color: var(--destruction-red);
    font-weight: 700;
  }

  .mute-toggle {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #fff;
    padding: 0.5rem 1rem;
    border-radius: 100px;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    backdrop-filter: blur(10px);
  }

  .mute-toggle:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }

  .mute-toggle .label {
    font-family: var(--font-heading);
    letter-spacing: 0.1em;
    font-size: 0.9rem;
    opacity: 0.7;
  }

  .arena {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    width: 100%;
    max-width: 500px;
    margin-bottom: 4rem;
    position: relative;
    z-index: 5;
  }

  .card-container {
    width: 100%;
    perspective: 1000px;
  }

  .versus {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60px;
    width: 100%;
    position: relative;
    transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .vs-circle {
    width: 60px;
    height: 60px;
    background: var(--bg-dark);
    border: 2px solid var(--destruction-red);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-heading);
    font-size: 1.5rem;
    color: var(--destruction-red);
    box-shadow: 0 0 20px rgba(255, 0, 64, 0.3);
    z-index: 2;
  }

  .versus::before {
    content: "";
    position: absolute;
    width: 100%;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      var(--destruction-red),
      transparent
    );
    opacity: 0.3;
  }

  .versus.hidden {
    opacity: 0;
    pointer-events: none;
  }

  .winner-message {
    font-family: var(--font-heading);
    font-size: clamp(2rem, 8vw, 4rem);
    color: var(--winner-green);
    text-shadow: 0 0 30px rgba(0, 255, 106, 0.4);
    letter-spacing: 0.15em;
    text-align: center;
    margin-top: 3rem;
    position: relative;
    z-index: 2;
    animation: winnerIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  }

  .winner-message::before {
    content: attr(data-text);
    position: absolute;
    inset: 0;
    color: #fff;
    clip-path: inset(0 0 50% 0);
    z-index: 1;
    animation: glitchTop 1s infinite alternate;
  }

  .winner-message::after {
    content: attr(data-text);
    position: absolute;
    inset: 0;
    color: var(--winner-green);
    clip-path: inset(50% 0 0 0);
    z-index: 1;
    opacity: 0.5;
    animation: glitchBottom 1.5s infinite alternate;
  }

  .winner-glow {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 120%;
    height: 100%;
    background: radial-gradient(
      ellipse,
      rgba(0, 255, 106, 0.1) 0%,
      transparent 70%
    );
    filter: blur(20px);
    z-index: -1;
  }

  @keyframes glitchTop {
    0% {
      transform: translate(0);
    }
    100% {
      transform: translate(2px, -1px);
    }
  }

  @keyframes glitchBottom {
    0% {
      transform: translate(0);
    }
    100% {
      transform: translate(-2px, 1px);
    }
  }

  @keyframes winnerIn {
    0% {
      opacity: 0;
      transform: translateY(30px) scale(0.85);
      filter: blur(10px);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
      filter: blur(0);
    }
  }

  .button-container {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 2rem;
    margin-bottom: 6rem;
    z-index: 10;
  }

  footer {
    width: 100%;
    margin-top: 4rem;
    display: flex;
    justify-content: center;
    z-index: 10;
  }

  .stats {
    background: rgba(255, 255, 255, 0.03);
    padding: 0.75rem 2rem;
    border-radius: 100px;
    border: 1px solid rgba(255, 255, 255, 0.05);
  }

  .counter {
    font-family: var(--font-body);
    font-size: 0.9rem;
    color: #555;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .count {
    color: var(--destruction-yellow);
    font-weight: 700;
    margin-left: 0.5rem;
  }

  /* Desktop Layout */
  @media (min-width: 900px) {
    header {
      flex-direction: row;
      justify-content: space-between;
      text-align: left;
    }

    .title-container {
      text-align: left;
    }

    .mute-toggle {
      position: absolute;
      top: 0;
      right: 0;
    }

    .arena {
      flex-direction: row;
      max-width: 1000px;
      gap: 3rem;
      height: 300px;
      align-items: center;
    }

    .card-container {
      flex: 1;
    }

    .versus {
      width: 80px;
      height: 100%;
      flex-direction: column;
    }

    .versus::before {
      width: 1px;
      height: 100%;
      background: linear-gradient(
        180deg,
        transparent,
        var(--destruction-red),
        transparent
      );
    }

    .winner-message {
      position: relative;
      bottom: auto;
      left: auto;
      transform: none;
      margin-top: 4rem;
      grid-column: span 3;
    }

    @keyframes winnerIn {
      0% {
        opacity: 0;
        transform: translateY(30px) scale(0.85);
        filter: blur(10px);
      }
      100% {
        opacity: 1;
        transform: translateY(0) scale(1);
        filter: blur(0);
      }
    }
  }

  /* Mobile Tweaks */
  @media (max-width: 600px) {
    .mute-toggle {
      order: -1;
      margin-bottom: 1rem;
    }
  }
</style>
