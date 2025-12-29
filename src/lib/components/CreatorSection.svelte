<script lang="ts">
</script>

<div class="creator-section">
    <div class="creator-card">
        <div class="avatar-container">
            <div class="avatar-glow"></div>
            <img
                src="https://unavatar.io/twitter/_madiou"
                alt="Madiou"
                class="avatar"
            />
        </div>

        <div class="creator-info">
            <h3>Madiou</h3>
            <p class="title">CEO @ Slopcel</p>

            <p class="bio">
                This is the sixth website in a series to prove my opp <a
                    href="https://x.com/dan"
                    target="_blank">Dan</a
                > wrong. It's a fine idea but I am mostly impressed with Claude's
                execution. This is fully vibecoded and had almost 0 input from me.
                S/O Claude. Not very useful but it is fun to look at.
            </p>

            <div class="links">
                <a href="https://x.com/_madiou" target="_blank" class="link">
                    <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        width="20"
                        height="20"
                    >
                        <path
                            d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                        />
                    </svg>
                    @_madiou
                </a>
                <a href="https://slopcel.com" target="_blank" class="link">
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        width="20"
                        height="20"
                    >
                        <circle cx="12" cy="12" r="10" /><line
                            x1="2"
                            y1="12"
                            x2="22"
                            y2="12"
                        /><path
                            d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
                        />
                    </svg>
                    Slopcel
                </a>
            </div>
        </div>
    </div>
</div>

<style>
    .creator-section {
        width: 100%;
        max-width: 800px;
        margin: 6rem auto 2rem;
        padding: 2rem;
        position: relative;
        z-index: 10;
    }

    .creator-card {
        background: rgba(15, 15, 15, 0.6);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: 24px;
        padding: 3rem;
        display: flex;
        gap: 3rem;
        align-items: center;
        transition: all 0.4s ease;
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
    }

    .creator-card:hover {
        border-color: rgba(255, 107, 0, 0.2);
        box-shadow: 0 20px 60px rgba(255, 107, 0, 0.1);
        transform: translateY(-5px);
    }

    .avatar-container {
        position: relative;
        flex-shrink: 0;
    }

    .avatar-glow {
        position: absolute;
        inset: -10px;
        background: radial-gradient(
            circle,
            var(--destruction-orange),
            transparent 70%
        );
        opacity: 0.3;
        border-radius: 50%;
        filter: blur(10px);
    }

    .avatar {
        width: 140px;
        height: 140px;
        border-radius: 50%;
        border: 3px solid rgba(255, 255, 255, 0.1);
        object-fit: cover;
        position: relative;
        z-index: 1;
    }

    .creator-info {
        flex: 1;
    }

    h3 {
        font-family: var(--font-heading);
        font-size: 2.5rem;
        letter-spacing: 0.05em;
        color: #fff;
        margin-bottom: 0.25rem;
    }

    .title {
        font-family: var(--font-body);
        font-size: 1rem;
        color: var(--destruction-yellow);
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        margin-bottom: 1.5rem;
    }

    .bio {
        font-family: var(--font-body);
        font-size: 1.1rem;
        line-height: 1.7;
        color: #aaa;
        margin-bottom: 2rem;
    }

    .bio a {
        color: var(--destruction-yellow);
        text-decoration: none;
        font-weight: 600;
        border-bottom: 1px solid transparent;
        transition: all 0.2s ease;
    }

    .bio a:hover {
        border-color: var(--destruction-yellow);
        text-shadow: 0 0 10px var(--destruction-yellow);
    }

    .links {
        display: flex;
        gap: 2rem;
    }

    .link {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        color: #888;
        text-decoration: none;
        font-size: 0.9rem;
        font-weight: 500;
        transition: all 0.3s ease;
    }

    .link:hover {
        color: #fff;
        transform: translateY(-2px);
    }

    .link svg {
        opacity: 0.7;
        transition: opacity 0.3s ease;
    }

    .link:hover svg {
        opacity: 1;
        filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.5));
    }

    @media (max-width: 768px) {
        .creator-section {
            padding: 1.5rem;
        }

        .creator-card {
            flex-direction: column;
            text-align: center;
            padding: 3rem 2rem;
            gap: 2rem;
        }

        .links {
            justify-content: center;
        }

        .avatar {
            width: 120px;
            height: 120px;
        }
    }
</style>
