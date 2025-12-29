<script lang="ts">
  import type { DestructionType } from "$lib/animations";

  interface Props {
    value: string;
    placeholder: string;
    disabled?: boolean;
    isChoosing?: boolean;
    isWinner?: boolean;
    isLoser?: boolean;
    destructionType?: DestructionType | null;
    onInput?: (value: string) => void;
  }

  let {
    value = "",
    placeholder,
    disabled = false,
    isChoosing = false,
    isWinner = false,
    isLoser = false,
    destructionType = null,
    onInput,
  }: Props = $props();

  function handleInput(e: Event) {
    const target = e.target as HTMLInputElement;
    onInput?.(target.value);
  }
</script>

<div
  class="option-card"
  class:choosing={isChoosing}
  class:winner={isWinner}
  class:loser={isLoser}
  class:explosion={isLoser && destructionType === "explosion"}
  class:incineration={isLoser && destructionType === "incineration"}
  class:disintegration={isLoser && destructionType === "disintegration"}
  class:blackhole={isLoser && destructionType === "blackhole"}
  class:lightning={isLoser && destructionType === "lightning"}
  class:crushing={isLoser && destructionType === "crushing"}
>
  <div class="card-inner">
    <input
      type="text"
      {value}
      {placeholder}
      {disabled}
      oninput={handleInput}
      class="option-input"
      spellcheck="false"
      autocomplete="off"
    />
    <div class="input-focus-line"></div>
  </div>

  {#if isLoser && destructionType === "lightning"}
    <div class="lightning-bolt"></div>
    <div class="lightning-bolt delay"></div>
  {/if}
  {#if isLoser && destructionType === "crushing"}
    <div class="crusher"></div>
  {/if}
</div>

<style>
  .option-card {
    position: relative;
    background: var(--bg-card);
    border-radius: var(--border-radius);
    padding: 2px;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    border: 1px solid rgba(255, 255, 255, 0.1);
    overflow: visible;
  }

  .card-inner {
    position: relative;
    background: rgba(10, 10, 10, 0.8);
    border-radius: calc(var(--border-radius) - 2px);
    overflow: hidden;
    padding: 1.5rem;
  }

  .option-card:focus-within {
    transform: translateY(-5px) scale(1.02);
    border-color: var(--destruction-yellow);
    box-shadow:
      0 10px 40px rgba(255, 215, 0, 0.15),
      0 0 20px rgba(255, 215, 0, 0.1);
  }

  .option-input {
    width: 100%;
    padding: 1rem;
    font-family: var(--font-body);
    font-size: clamp(1.2rem, 4vw, 1.75rem);
    font-weight: 700;
    color: #fff;
    background: transparent;
    border: none;
    outline: none;
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .option-input::placeholder {
    color: #333;
    font-family: var(--font-heading);
    letter-spacing: 0.1em;
  }

  .option-input:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  .input-focus-line {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 2px;
    background: var(--destruction-yellow);
    transition: width 0.3s ease;
    box-shadow: 0 0 10px var(--destruction-yellow);
  }

  .option-card:focus-within .input-focus-line {
    width: 80%;
  }

  .choosing {
    border-color: var(--destruction-yellow);
    animation: choosePulse 0.2s ease-in-out infinite alternate;
  }

  @keyframes choosePulse {
    0% {
      transform: scale(1);
      box-shadow: 0 0 10px rgba(255, 215, 0, 0.2);
    }
    100% {
      transform: scale(1.05);
      box-shadow: 0 0 30px rgba(255, 215, 0, 0.5);
    }
  }

  .winner {
    border-color: var(--winner-green);
    animation: winnerGlow 1.5s ease-in-out infinite alternate;
    transform: translateY(-10px) scale(1.05);
    z-index: 10;
  }

  @keyframes winnerGlow {
    0% {
      box-shadow:
        0 0 20px rgba(0, 255, 106, 0.2),
        0 10px 40px rgba(0, 255, 106, 0.1);
    }
    100% {
      box-shadow:
        0 0 40px rgba(0, 255, 106, 0.5),
        0 15px 60px rgba(0, 255, 106, 0.3);
    }
  }

  /* Destruction Animations */
  .explosion {
    animation: explode 0.4s cubic-bezier(0.6, -0.28, 0.735, 0.045) forwards;
  }
  @keyframes explode {
    0% {
      transform: scale(1);
      opacity: 1;
      filter: brightness(1);
    }
    40% {
      transform: scale(1.2);
      filter: brightness(3);
    }
    100% {
      transform: scale(0);
      opacity: 0;
      filter: brightness(10);
    }
  }

  .incineration {
    animation: incinerate 1.5s ease-in forwards;
  }
  @keyframes incinerate {
    0% {
      clip-path: inset(0 0 0 0);
      filter: brightness(1);
    }
    40% {
      clip-path: inset(0 0 0 0);
      filter: brightness(2) sepia(1) saturate(5) hue-rotate(-20deg);
    }
    100% {
      clip-path: inset(100% 0 0 0);
      filter: brightness(0);
      transform: translateY(30px) rotate(5deg);
    }
  }

  .disintegration {
    animation: disintegrate 1.2s ease-out forwards;
  }
  @keyframes disintegrate {
    0% {
      transform: translate(0, 0);
      filter: blur(0);
      opacity: 1;
    }
    100% {
      transform: translate(40px, -20px);
      filter: blur(20px);
      opacity: 0;
    }
  }

  .blackhole {
    animation: blackhole 1.5s cubic-bezier(0.55, 0.055, 0.675, 0.19) forwards;
  }
  @keyframes blackhole {
    0% {
      transform: scale(1) rotate(0);
      opacity: 1;
    }
    100% {
      transform: scale(0) rotate(720deg);
      opacity: 0;
      filter: contrast(2) brightness(0);
    }
  }

  .lightning {
    animation: zap 0.8s ease-out forwards;
  }
  @keyframes zap {
    0%,
    20%,
    40%,
    60% {
      filter: brightness(5) invert(1);
      transform: scale(1.05) translate(2px, -2px);
    }
    10%,
    30%,
    50% {
      filter: brightness(1) invert(0);
      transform: scale(1) translate(-2px, 2px);
    }
    100% {
      opacity: 0;
      transform: scale(0.8);
    }
  }

  .lightning-bolt {
    position: absolute;
    top: -200px;
    left: 50%;
    width: 6px;
    height: 300px;
    background: #fff;
    box-shadow:
      0 0 30px var(--accent-blue),
      0 0 60px var(--accent-blue);
    transform: translateX(-50%) skewX(-20deg);
    z-index: 100;
    opacity: 0;
    animation: boltDrop 0.4s ease-out forwards;
  }

  .lightning-bolt.delay {
    animation-delay: 0.1s;
    left: 55%;
    transform: translateX(-50%) skewX(15deg);
  }

  @keyframes boltDrop {
    0% {
      opacity: 0;
      height: 0;
    }
    20% {
      opacity: 1;
      height: 300px;
    }
    100% {
      opacity: 0;
    }
  }

  .crushing {
    animation: crush 0.6s cubic-bezier(0.6, 0.04, 0.98, 0.335) forwards;
  }
  @keyframes crush {
    0% {
      transform: scaleY(1);
    }
    80% {
      transform: scaleY(0.05);
      opacity: 1;
    }
    100% {
      transform: scaleY(0);
      opacity: 0;
    }
  }

  .crusher {
    position: absolute;
    top: -300px;
    left: -5%;
    width: 110%;
    height: 300px;
    background: linear-gradient(180deg, #222, #000);
    border-bottom: 10px solid #444;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.9);
    z-index: 100;
    animation: crushDrop 0.6s cubic-bezier(0.6, 0.04, 0.98, 0.335) forwards;
  }

  @keyframes crushDrop {
    0% {
      top: -300px;
    }
    80% {
      top: 0;
    }
    100% {
      top: 0;
    }
  }
</style>
