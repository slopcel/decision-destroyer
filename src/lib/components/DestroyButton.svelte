<script lang="ts">
  interface Props {
    disabled?: boolean;
    showReset?: boolean;
    onClick?: () => void;
  }

  let { disabled = false, showReset = false, onClick }: Props = $props();
</script>

<button
  class="destroy-button"
  class:reset={showReset}
  {disabled}
  onclick={onClick}
>
  <span class="btn-content">
    {showReset ? "DESTROY AGAIN" : "DESTROY ONE"}
  </span>
  <div class="hover-glow"></div>
</button>

<style>
  .destroy-button {
    font-family: var(--font-heading);
    font-size: clamp(1.5rem, 5vw, 2.5rem);
    letter-spacing: 0.15em;
    padding: 1.5rem 4rem;
    background: linear-gradient(
      135deg,
      var(--destruction-orange),
      var(--destruction-red)
    );
    color: #fff;
    border: none;
    border-radius: 100px;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    box-shadow:
      0 10px 40px rgba(255, 107, 0, 0.3),
      0 0 20px rgba(255, 0, 64, 0.2);
    position: relative;
    overflow: hidden;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }

  .btn-content {
    position: relative;
    z-index: 2;
  }

  .hover-glow {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0);
    width: 150%;
    height: 300%;
    background: radial-gradient(
      circle,
      rgba(255, 215, 0, 0.4),
      transparent 70%
    );
    transition: transform 0.6s ease;
    pointer-events: none;
    z-index: 1;
  }

  .destroy-button:not(:disabled):hover {
    transform: translateY(-5px) scale(1.05);
    box-shadow:
      0 15px 50px rgba(255, 107, 0, 0.5),
      0 0 30px rgba(255, 0, 64, 0.3);
  }

  .destroy-button:not(:disabled):hover .hover-glow {
    transform: translate(-50%, -50%) scale(1);
  }

  .destroy-button:not(:disabled):active {
    transform: translateY(0) scale(0.98);
  }

  .destroy-button:not(:disabled):not(.reset) {
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%,
    100% {
      box-shadow:
        0 10px 40px rgba(255, 107, 0, 0.3),
        0 0 20px rgba(255, 0, 64, 0.2);
    }
    50% {
      box-shadow:
        0 15px 60px rgba(255, 107, 0, 0.6),
        0 0 40px rgba(255, 0, 64, 0.4);
    }
  }

  .destroy-button:disabled {
    background: #222;
    color: #444;
    cursor: not-allowed;
    box-shadow: none;
    opacity: 0.5;
  }

  .destroy-button.reset {
    background: linear-gradient(135deg, #00ff6a, #00d4ff);
    box-shadow: 0 10px 40px rgba(0, 255, 106, 0.3);
  }

  .destroy-button.reset:hover {
    box-shadow: 0 15px 50px rgba(0, 255, 106, 0.5);
  }

  @media (max-width: 600px) {
    .destroy-button {
      padding: 1.25rem 3rem;
      width: 100%;
      max-width: 300px;
    }
  }
</style>
