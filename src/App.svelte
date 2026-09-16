<script>
  import { onMount } from 'svelte';

  let theme = $state('dark');
  let menuOpen = $state(false);
  let canvasRef;
  let copiedEmail = $state(false);

  // Time display (Jakarta / Local)
  let currentTime = $state('');

  function updateClock() {
    const now = new Date();
    currentTime = now.toLocaleTimeString('en-US', {
      timeZone: 'Asia/Jakarta',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }

  onMount(() => {
    // Theme setup
    const saved = localStorage.getItem('theme');
    if (saved) {
      theme = saved;
    } else {
      theme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    document.documentElement.setAttribute('data-theme', theme);

    updateClock();
    const clockInterval = setInterval(updateClock, 1000);

    // Intersection Observer for scroll reveals
    const observerCallback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      threshold: 0.08,
      rootMargin: '0px 0px -30px 0px',
    });

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach((el) => observer.observe(el));

    // Particle Canvas with Sparkles ✨
    let cleanupParticles;
    if (canvasRef && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      cleanupParticles = initSparkleCanvas();
    }

    return () => {
      clearInterval(clockInterval);
      observer.disconnect();
      if (cleanupParticles) cleanupParticles();
    };
  });

  function toggleTheme() {
    theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  function closeMenu() {
    menuOpen = false;
  }

  function copyEmail() {
    navigator.clipboard.writeText('reasvyn@gmail.com');
    copiedEmail = true;
    setTimeout(() => {
      copiedEmail = false;
    }, 2200);
  }

  // Sparkle & Firefly Spore Particle System
  function initSparkleCanvas() {
    const canvas = canvasRef;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let animId;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const mouse = { x: -1000, y: -1000, active: false };
    const interactiveSparkles = [];
    const ambientStars = [];
    const AMBIENT_COUNT = Math.min(Math.floor(window.innerWidth / 32), 42);

    // Helper to draw a 4-point editorial sparkle star ✦
    function drawStar4(ctx, cx, cy, spikes, outerRadius, innerRadius, angle = 0) {
      let rot = (Math.PI / 2) * 3 + angle;
      let x = cx;
      let y = cy;
      let step = Math.PI / spikes;

      ctx.beginPath();
      ctx.moveTo(cx, cy - outerRadius);
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
      }
      ctx.lineTo(cx, cy - outerRadius);
      ctx.closePath();
    }

    // Spawn ambient twinkling stars & spores
    for (let i = 0; i < AMBIENT_COUNT; i++) {
      ambientStars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25 - 0.05,
        size: Math.random() * 3.5 + 1.2,
        twinkleSpeed: Math.random() * 0.03 + 0.015,
        twinklePhase: Math.random() * Math.PI * 2,
        isStar: Math.random() > 0.45,
        rotation: Math.random() * Math.PI,
        rotSpeed: (Math.random() - 0.5) * 0.01,
      });
    }

    // Mouse Move Sparkles
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;

      // Spawn 1-2 interactive sparkles per tick
      for (let i = 0; i < 2; i++) {
        interactiveSparkles.push({
          x: mouse.x + (Math.random() - 0.5) * 12,
          y: mouse.y + (Math.random() - 0.5) * 12,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5 - 0.4,
          size: Math.random() * 4.5 + 2.5,
          life: 1,
          decay: Math.random() * 0.03 + 0.02,
          rotation: Math.random() * Math.PI,
          rotSpeed: (Math.random() - 0.5) * 0.08,
          isStar: Math.random() > 0.3,
        });
      }
    };

    // Click Starburst
    const handleClick = (e) => {
      for (let i = 0; i < 12; i++) {
        const angle = (Math.PI * 2 * i) / 12 + Math.random() * 0.2;
        const speed = Math.random() * 2.8 + 1.2;
        interactiveSparkles.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 5 + 3,
          life: 1.2,
          decay: Math.random() * 0.025 + 0.02,
          rotation: Math.random() * Math.PI,
          rotSpeed: (Math.random() - 0.5) * 0.1,
          isStar: true,
        });
      }
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
    document.addEventListener('mouseleave', handleMouseLeave);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const neonRgb = isDark ? '16, 255, 112' : '5, 180, 75';
      const glowRgb = isDark ? '184, 255, 59' : '16, 255, 112';
      const mutedRgb = isDark ? '139, 165, 151' : '86, 105, 94';

      // 1. Draw Ambient Twinkling Stars & Spores
      for (let i = 0; i < ambientStars.length; i++) {
        const p = ambientStars[i];
        p.x += p.vx;
        p.y += p.vy;
        p.twinklePhase += p.twinkleSpeed;
        p.rotation += p.rotSpeed;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const currentAlpha = (Math.sin(p.twinklePhase) * 0.5 + 0.5) * (isDark ? 0.6 : 0.45) + 0.1;

        ctx.save();
        ctx.fillStyle = p.isStar
          ? `rgba(${neonRgb}, ${currentAlpha * 0.85})`
          : `rgba(${mutedRgb}, ${currentAlpha * 0.6})`;

        if (p.isStar) {
          drawStar4(ctx, p.x, p.y, 4, p.size, p.size * 0.32, p.rotation);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.6, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // 2. Draw Interactive Neon Sparkles
      for (let i = interactiveSparkles.length - 1; i >= 0; i--) {
        const s = interactiveSparkles[i];
        s.x += s.vx;
        s.y += s.vy;
        s.life -= s.decay;
        s.rotation += s.rotSpeed;
        s.size = Math.max(0.4, s.size * 0.965);

        if (s.life <= 0) {
          interactiveSparkles.splice(i, 1);
          continue;
        }

        const alpha = Math.min(1, s.life);
        ctx.save();
        ctx.fillStyle = `rgba(${neonRgb}, ${alpha * 0.85})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `rgba(${glowRgb}, ${alpha * 0.75})`;

        if (s.isStar) {
          drawStar4(ctx, s.x, s.y, 4, s.size, s.size * 0.28, s.rotation);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size * 0.7, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (animId) cancelAnimationFrame(animId);
    };
  }

  const navLinks = [
    { href: '#philosophy', num: '01', label: 'Philosophy' },
    { href: '#tech', num: '02', label: 'Stack' },
    { href: '#projects', num: '03', label: 'Works' },
    { href: '#highlights', num: '04', label: 'Field Notes' },
    { href: '#telemetry', num: '05', label: 'Telemetry' },
    { href: '#dispatch', num: '06', label: 'Dispatch' },
  ];

  const editorialBadges = [
    { label: 'DOCTRINE', value: '3S Architecture (Secure · Sustain · Scalable)', icon: '🛡️' },
    { label: 'STATUS', value: 'Open for Inquiries & Systems', icon: '🌿' },
    { label: 'PRACTICE', value: 'Fullstack Systems & Solopreneur', icon: '✦' },
  ];

  const principles = [
    {
      num: 'I',
      tag: 'NON-NEGOTIABLE FOUNDATION',
      title: 'Secure',
      subtitle: 'Integrity of code, state, and contracts',
      desc: 'Building with deliberate protection. Logic is deterministic and explicit. No silent errors, no hidden assumptions, no bypassable access paths. Systems that act as safe harbors for data and trust.',
      points: ['Explicit Failures & Verified Contracts', 'Strict Boundary Defense', 'Zero Ambient / Hidden State'],
      glyph: '✦',
    },
    {
      num: 'II',
      tag: 'ENDURING STEWARDSHIP',
      title: 'Sustain',
      subtitle: 'Cognitive clarity and digital ecology',
      desc: 'Crafting code that human maintainers can understand and operate with ease across decades. Eliminating computational waste and invisible technical debt. Simplicity is treated as the premier feature.',
      points: ['Clarity Over Cleverness', 'Minimal Resource Footprint', 'Living & Synchronized Documentation'],
      glyph: '🌿',
    },
    {
      num: 'III',
      tag: 'EVOLVING HORIZONS',
      title: 'Scalable',
      subtitle: 'Growth without structural rewrites',
      desc: 'Ecosystems engineered to expand in traffic, domain complexity, and team size without decay. Clear seams and decoupled modules preserve strategic agility for future pivots.',
      points: ['Explicit Seams & Interfaces', 'Single Source of Truth', 'Unbroken Forward Evolution'],
      glyph: '✧',
    },
  ];

  const techStacks = [
    {
      category: 'Core Logic & Systems',
      subtitle: 'Precision Backends',
      items: ['Rust', 'TypeScript', 'PHP', 'Go'],
    },
    {
      category: 'Frameworks & Habitats',
      subtitle: 'Modern Interfaces',
      items: ['Svelte 5', 'Laravel', 'Next.js', 'Astro', 'Tailwind CSS'],
    },
    {
      category: 'Datastores & State',
      subtitle: 'Reliable Persistence',
      items: ['PostgreSQL', 'Redis', 'Event Sourcing', 'SQLite'],
    },
    {
      category: 'Infrastructure & Ops',
      subtitle: 'Cloud & Environments',
      items: ['Docker', 'Linux', 'AWS', 'CI/CD Pipelines'],
    },
    {
      category: 'Engineering Craft',
      subtitle: 'Architectural Rigor',
      items: ['Clean Architecture', 'Domain-Driven Design (DDD)', 'TDD', '3S Governance'],
    },
  ];

  const featuredProjects = [
    {
      vol: 'VOL. 01',
      title: 'DevBook',
      url: 'https://github.com/reasvyn/devbook',
      type: 'Open Source Learning Library',
      desc: 'A comprehensive, markdown-based digital herbarium for developers. Encompasses 21 curated subjects—from mathematics & computer science foundations to distributed systems, AI/ML, career wisdom, and software philosophy. Built with zero dependencies and no build step: pure readable knowledge.',
      tags: ['Markdown', 'Git', 'Knowledge Base', 'Open Source', 'Zero-Build'],
      badge: 'Curated Folio',
      stars: 'Featured',
    },
  ];

  const highlights = [
    {
      num: '01',
      emoji: '🕊️',
      title: 'Faithful Stewardship',
      date: 'Since 2020',
      desc: 'Designing and deploying production-grade systems with an unwavering focus on reliability, security, and ethical craftsmanship.',
    },
    {
      num: '02',
      emoji: '🏗️',
      title: 'Solopreneur Ownership',
      date: 'Full Lifecycle',
      desc: 'Operating with end-to-end responsibility: from domain modeling and database schemas to intuitive interfaces and bare-metal orchestration.',
    },
    {
      num: '03',
      emoji: '🌿',
      title: 'Digital Commons',
      date: 'Public Artifacts',
      desc: 'Contributing precise documentation, open frameworks, and transparent knowledge back to the global software ecosystem.',
    },
  ];

  const socialLinks = [
    { name: 'Website', url: 'https://gh.reasvyn.web.id', handle: 'gh.reasvyn.web.id', note: 'Primary Domain' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/reasvyn', handle: 'in/reasvyn', note: 'Professional Network' },
    { name: 'Instagram', url: 'https://instagram.com/reasvyn', handle: '@reasvyn', note: 'Visual Field Notes' },
    { name: 'GitHub', url: 'https://github.com/reasvyn', handle: '@reasvyn', note: 'Source Repository' },
  ];

  const bgColor = $derived(theme === 'dark' ? '0e1511' : 'f3f1ea');
  const textColor = $derived(theme === 'dark' ? 'f3f7f4' : '121a15');
  const mutedColor = $derived(theme === 'dark' ? '8ba597' : '56695e');
  const accentHex = $derived(theme === 'dark' ? '10ff70' : '05b44b');
  const trophyTheme = $derived(theme === 'dark' ? 'darkhub' : 'flat');

  const statsUrl = $derived(
    `https://github-readme-stats-eight-theta.vercel.app/api?username=reasvyn&show_icons=true&count_private=true&hide_border=true&bg_color=${bgColor}&text_color=${textColor}&icon_color=${accentHex}&title_color=${accentHex}`
  );
  const topLangsUrl = $derived(
    `https://github-readme-stats-eight-theta.vercel.app/api/top-langs/?username=reasvyn&layout=compact&hide_border=true&bg_color=${bgColor}&text_color=${textColor}&title_color=${accentHex}`
  );
  const streakUrl = $derived(
    `https://streak-stats.demolab.com/?user=reasvyn&hide_border=true&background=${bgColor}&stroke=${accentHex}&ring=${accentHex}&fire=${accentHex}&currStreakNum=${textColor}&sideNums=${textColor}&currStreakLabel=${accentHex}&sideLabels=${mutedColor}&dates=${mutedColor}`
  );
  const chartUrl = $derived(`https://ghchart.rshah.org/${accentHex}/reasvyn`);
  const trophiesUrl = $derived(
    `https://github-trophies.vercel.app/?username=reasvyn&theme=${trophyTheme}&no-frame=true&no-bg=true&margin-w=4`
  );
</script>

<div class="relative min-h-screen bg-botanical-grid selection:bg-[var(--color-accent)]/20 selection:text-[var(--color-foreground)]" style="background-color: var(--color-surface);">
  <!-- Ambient Botanical Glows -->
  <div class="ambient-glow"></div>

  <!-- Interactive Sparkle & Firefly Spore Canvas -->
  <canvas
    bind:this={canvasRef}
    class="pointer-events-none fixed inset-0 z-0 h-full w-full"
    aria-hidden="true"
  ></canvas>

  <!-- Main Content Wrapper -->
  <div class="relative z-10 flex flex-col min-h-screen">
    <!-- Top Editorial Header Bar (Folio Marquee & Metadata) -->
    <header class="border-b border-hairline text-xs font-mono tracking-wider backdrop-blur-md" style="background-color: color-mix(in srgb, var(--color-surface) 90%, transparent); color: var(--color-muted);">
      <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-2 sm:px-6">
        <div class="flex items-center gap-3">
          <span class="inline-flex items-center gap-1 font-semibold text-[var(--color-accent)]">
            <span class="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)] animate-ping"></span>
            VOL. 04 / 2026
          </span>
          <span class="hidden sm:inline opacity-40">|</span>
          <span class="hidden sm:inline">JAKARTA ✦ UTC+7 [{currentTime || '12:00:00'}]</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium" style="background-color: var(--color-accent-soft); color: var(--color-accent); border: 1px solid var(--color-border-accent);">
            <span class="text-xs">🌿</span> THE CODE GARDEN
          </span>
        </div>
      </div>
    </header>

    <!-- Navigation Bar -->
    <nav class="sticky top-0 z-50 border-b border-hairline transition-all duration-300 backdrop-blur-xl" style="background-color: color-mix(in srgb, var(--color-surface) 86%, transparent);">
      <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
        <!-- Logo / Monogram -->
        <a href="/" class="group flex items-center gap-2 text-decoration-none">
          <span class="flex h-7 w-7 items-center justify-center rounded-lg border border-hairline text-xs font-serif font-bold transition-all duration-300 group-hover:scale-105 group-hover:border-[var(--color-accent)] group-hover:shadow-[0_0_12px_var(--color-accent-glow)]" style="background-color: var(--color-surface-lighter); color: var(--color-accent);">
            ✦
          </span>
          <div class="flex flex-col">
            <span class="font-serif text-lg font-medium tracking-tight text-[var(--color-foreground)] transition-colors group-hover:text-[var(--color-accent)]">
              Reas Vyn
            </span>
            <span class="text-[9px] font-mono tracking-widest uppercase opacity-60 -mt-1 text-[var(--color-muted)]">
              The Code Garden
            </span>
          </div>
        </a>

        <!-- Desktop Navigation Links -->
        <div class="hidden items-center gap-7 md:flex">
          {#each navLinks as link}
            <a
              href={link.href}
              class="group flex items-baseline gap-1 text-xs font-mono tracking-wider transition-colors hover:text-[var(--color-accent)]"
              style="color: var(--color-muted);"
            >
              <span class="text-[10px] opacity-40 transition-colors group-hover:text-[var(--color-accent)]">{link.num}.</span>
              <span class="font-sans text-sm font-medium tracking-normal group-hover:underline underline-offset-4 decoration-[var(--color-accent)]">{link.label}</span>
            </a>
          {/each}

          <div class="h-4 w-[1px] bg-[var(--color-border)]"></div>

          <!-- Theme Toggle Button -->
          <button
            onclick={toggleTheme}
            class="relative flex h-8 w-8 items-center justify-center rounded-lg border border-hairline transition-all duration-300 hover:scale-105 hover:border-[var(--color-accent)] hover:shadow-[0_0_10px_var(--color-accent-glow)] active:scale-95 cursor-pointer"
            style="background-color: var(--color-surface-lighter); color: var(--color-foreground);"
            aria-label="Toggle theme mode"
            title="Toggle theme mode"
          >
            {#if theme === 'dark'}
              <!-- Sun sparkle icon for switching to light -->
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 text-[var(--color-accent)]">
                <circle cx="12" cy="12" r="4"></circle>
                <path d="M12 2v2"></path>
                <path d="M12 20v2"></path>
                <path d="m4.93 4.93 1.41 1.41"></path>
                <path d="m17.66 17.66 1.41 1.41"></path>
                <path d="M2 12h2"></path>
                <path d="M20 12h2"></path>
                <path d="m6.34 17.66-1.41 1.41"></path>
                <path d="m19.07 4.93-1.41 1.41"></path>
              </svg>
            {:else}
              <!-- Moon botanical sparkle icon for switching to dark -->
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 text-[var(--color-accent)]">
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
                <path d="M19 3v4"></path>
                <path d="M21 5h-4"></path>
              </svg>
            {/if}
          </button>
        </div>

        <!-- Mobile Controls (Theme Toggle + Menu Trigger) -->
        <div class="flex items-center gap-2 md:hidden">
          <button
            onclick={toggleTheme}
            class="flex h-8 w-8 items-center justify-center rounded-lg border border-hairline text-sm"
            style="background-color: var(--color-surface-lighter); color: var(--color-foreground);"
            aria-label="Toggle theme"
          >
            {#if theme === 'dark'}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-4 w-4 text-[var(--color-accent)]"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"/></svg>
            {:else}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-4 w-4 text-[var(--color-accent)]"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/></svg>
            {/if}
          </button>
          <button
            onclick={() => (menuOpen = !menuOpen)}
            class="flex h-8 w-8 items-center justify-center rounded-lg border border-hairline text-sm"
            style="color: var(--color-foreground);"
            aria-label="Toggle navigation menu"
          >
            {#if menuOpen}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-5 w-5"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
            {:else}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-5 w-5"><path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"/></svg>
            {/if}
          </button>
        </div>
      </div>

      <!-- Mobile Dropdown Menu -->
      {#if menuOpen}
        <div class="border-t border-hairline md:hidden" style="background-color: var(--color-surface);">
          <div class="flex flex-col gap-1 px-4 py-3">
            {#each navLinks as link}
              <a
                href={link.href}
                onclick={closeMenu}
                class="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:text-[var(--color-accent)] hover:bg-[var(--color-surface-lighter)]"
                style="color: var(--color-muted);"
              >
                <span>{link.label}</span>
                <span class="font-mono text-xs opacity-50">{link.num}</span>
              </a>
            {/each}
          </div>
        </div>
      {/if}
    </nav>

    <!-- Main Content Stream -->
    <main class="mx-auto max-w-6xl px-4 sm:px-6 w-full flex-grow">
      <!-- HERO SECTION (Editorial Cover & Botanical Manifesto) -->
      <section class="flex min-h-[82vh] flex-col items-center justify-center py-16 text-center reveal">
        <!-- Top Editorial Issue Ribbon -->
        <div class="mb-6 inline-flex items-center gap-2 rounded-full border border-hairline px-3.5 py-1 text-xs font-mono tracking-widest uppercase backdrop-blur-md" style="background-color: var(--color-accent-soft); color: var(--color-accent); border-color: var(--color-border-accent);">
          <span class="inline-block animate-twinkle">✦</span>
          <span>EST. 2020 // ARCHITECTURAL STEWARDSHIP</span>
          <span class="inline-block animate-twinkle-delay">✦</span>
        </div>

        <!-- Main Editorial Headline with Serif Splendor -->
        <h1 class="max-w-4xl font-serif text-4xl sm:text-6xl md:text-7xl font-light tracking-tight leading-[1.12] text-[var(--color-foreground)]">
          Building <span class="italic font-serif font-light text-[var(--color-accent)] drop-shadow-[0_0_20px_var(--color-accent-glow)]">quietly</span>, for a <span class="relative inline-block font-normal">faithful impact<span class="absolute -top-3 -right-4 sm:-right-6 text-sm sm:text-base text-[var(--color-accent)] animate-twinkle">✦</span></span>.
        </h1>

        <!-- Manifesto Subheading -->
        <p class="mt-6 max-w-2xl font-sans text-base sm:text-lg leading-relaxed" style="color: var(--color-muted);">
          Hello, I am <strong class="font-medium text-[var(--color-foreground)]">Reas Vyn</strong> — a fullstack developer cultivating digital ecosystems in the <strong class="text-[var(--color-foreground)]">Code Garden</strong>, rooted in natural serenity, mathematical rigor, and neon vitality.
        </p>

        <!-- Editorial Doctrine Badges -->
        <div class="mt-8 flex flex-wrap justify-center gap-2.5 max-w-3xl">
          {#each editorialBadges as badge}
            <div
              class="inline-flex items-center gap-2 rounded-full border border-hairline px-4 py-1.5 text-xs font-mono backdrop-blur-sm transition-all duration-300 hover:border-[var(--color-accent)] hover:shadow-[0_0_12px_var(--color-accent-soft)]"
              style="background-color: var(--color-surface-lighter); color: var(--color-muted);"
            >
              <span class="text-sm">{badge.icon}</span>
              <span class="text-[10px] font-bold uppercase tracking-wider text-[var(--color-accent)]">{badge.label}:</span>
              <span class="text-[var(--color-foreground)]">{badge.value}</span>
            </div>
          {/each}
        </div>

        <!-- Action Buttons & Direct Interaction -->
        <div class="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#projects"
            class="group inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-300 hover:scale-105 active:scale-95 shadow-md shadow-emerald-950/20"
            style="background-color: var(--color-accent); color: #080c0a;"
          >
            <span>Explore Works</span>
            <span class="transition-transform group-hover:translate-x-1">→</span>
          </a>

          <button
            onclick={copyEmail}
            class="group inline-flex items-center gap-2 rounded-xl border border-hairline px-5 py-3 text-sm font-medium transition-all duration-300 hover:border-[var(--color-accent)] hover:bg-[var(--color-surface-lighter)] active:scale-95 cursor-pointer"
            style="color: var(--color-foreground); background-color: var(--color-surface-card);"
          >
            {#if copiedEmail}
              <span class="text-[var(--color-accent)]">✓ Copied to Clipboard!</span>
            {:else}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-4 w-4 text-[var(--color-accent)]"><path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z"/><path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z"/></svg>
              <span>Copy Dispatch Email</span>
            {/if}
          </button>
        </div>

        <!-- Metric Badges & Proof -->
        <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
          <img src="https://img.shields.io/github/stars/reasvyn?style=flat-square&label=Curated%20Stars&color=10ff70&labelColor=16211b" alt="Total Stars" class="h-5 rounded" />
          <img src="https://komarev.com/ghpvc/?username=reasvyn&color=10ff70&style=flat-square&label=Folio%20Visits" alt="Profile Views" class="h-5 rounded" />
        </div>

        <!-- Scroll Indicator -->
        <a href="#philosophy" class="mt-14 inline-flex flex-col items-center gap-1 text-xs font-mono tracking-widest uppercase transition-colors hover:text-[var(--color-accent)]" style="color: var(--color-muted);" aria-label="Scroll to philosophy">
          <span class="text-xs">DESCEND</span>
          <span class="animate-bounce text-lg text-[var(--color-accent)]">↓</span>
        </a>
      </section>

      <!-- Section Divider with Center Sparkle -->
      <div class="relative my-8 flex items-center justify-center">
        <div class="w-full border-t border-hairline"></div>
        <span class="absolute px-4 font-serif text-sm text-[var(--color-accent)]" style="background-color: var(--color-surface);">✦ 🌿 ✦</span>
      </div>

      <!-- SECTION 1: PHILOSOPHY (The 3S Governing Triptych) -->
      <section id="philosophy" class="py-16 sm:py-24">
        <div class="mb-12 text-center reveal">
          <div class="inline-block text-xs font-mono tracking-widest uppercase text-[var(--color-accent)] mb-2">§ 01 — THE GOVERNING DOCTRINE</div>
          <h2 class="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[var(--color-foreground)]">
            The <span class="italic font-normal text-[var(--color-accent)]">3S</span> Philosophy
          </h2>
          <p class="mt-3 max-w-xl mx-auto text-sm leading-relaxed" style="color: var(--color-muted);">
            A principled architecture inspired by natural ecosystems: non-negotiable security, enduring sustainability, and organic scalability.
          </p>
        </div>

        <div class="grid gap-6 md:grid-cols-3">
          {#each principles as principle, i}
            <div
              class="editorial-card reveal stagger-{i + 1} flex flex-col justify-between rounded-2xl p-7 sm:p-8"
            >
              <div>
                <!-- Card Header with Roman Numeral and Sparkle Mark -->
                <div class="flex items-center justify-between border-b border-hairline pb-4 mb-6">
                  <div class="flex items-center gap-2">
                    <span class="font-serif text-2xl font-light text-[var(--color-accent)]">{principle.num}.</span>
                    <span class="text-[10px] font-mono tracking-widest uppercase text-[var(--color-muted-dim)]">{principle.tag}</span>
                  </div>
                  <span class="text-lg text-[var(--color-accent)] animate-twinkle">{principle.glyph}</span>
                </div>

                <h3 class="font-serif text-2xl font-semibold text-[var(--color-foreground)] mb-1">
                  {principle.title}
                </h3>
                <p class="text-xs font-mono tracking-wide text-[var(--color-accent)] mb-4">{principle.subtitle}</p>
                <p class="text-sm leading-relaxed mb-6" style="color: var(--color-muted);">
                  {principle.desc}
                </p>
              </div>

              <!-- Key Invariants / Checklist -->
              <div class="border-t border-hairline pt-4 mt-auto">
                <div class="text-[10px] font-mono uppercase tracking-widest text-[var(--color-muted-dim)] mb-2">Key Invariants:</div>
                <ul class="space-y-1.5">
                  {#each principle.points as point}
                    <li class="flex items-center gap-2 text-xs" style="color: var(--color-foreground);">
                      <span class="h-1 w-1 rounded-full bg-[var(--color-accent)]"></span>
                      <span>{point}</span>
                    </li>
                  {/each}
                </ul>
              </div>
            </div>
          {/each}
        </div>
      </section>

      <!-- Section Divider -->
      <div class="relative my-8 flex items-center justify-center">
        <div class="w-full border-t border-hairline"></div>
        <span class="absolute px-4 font-serif text-sm text-[var(--color-accent)]" style="background-color: var(--color-surface);">✦</span>
      </div>

      <!-- SECTION 2: TECH STACK (Curated Digital Herbarium) -->
      <section id="tech" class="py-16 sm:py-24">
        <div class="mb-12 text-center reveal">
          <div class="inline-block text-xs font-mono tracking-widest uppercase text-[var(--color-accent)] mb-2">§ 02 — THE DIGITAL HERBARIUM</div>
          <h2 class="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[var(--color-foreground)]">
            Curated <span class="italic font-normal text-[var(--color-accent)]">Tools & Craft</span>
          </h2>
          <p class="mt-3 max-w-xl mx-auto text-sm leading-relaxed" style="color: var(--color-muted);">
            Battle-tested instruments chosen for long-term health, uncompromising type-safety, and minimal computational footprint.
          </p>
        </div>

        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {#each techStacks as stack, i}
            <div
              class="editorial-card reveal stagger-{i + 1} flex flex-col rounded-xl p-5 sm:p-6"
            >
              <div class="mb-4">
                <span class="text-[10px] font-mono tracking-widest uppercase text-[var(--color-accent)] block mb-1">
                  {stack.subtitle}
                </span>
                <h3 class="font-serif text-lg font-semibold text-[var(--color-foreground)]">
                  {stack.category}
                </h3>
              </div>

              <div class="w-full border-t border-hairline mb-4"></div>

              <ul class="space-y-2.5 mt-auto">
                {#each stack.items as item}
                  <li class="flex items-center gap-2 text-xs font-mono" style="color: var(--color-foreground);">
                    <span class="text-[var(--color-accent)]">✦</span>
                    <span class="font-sans text-sm" style="color: var(--color-muted);">{item}</span>
                  </li>
                {/each}
              </ul>
            </div>
          {/each}
        </div>
      </section>

      <!-- Section Divider -->
      <div class="relative my-8 flex items-center justify-center">
        <div class="w-full border-t border-hairline"></div>
        <span class="absolute px-4 font-serif text-sm text-[var(--color-accent)]" style="background-color: var(--color-surface);">✦ 🌿 ✦</span>
      </div>

      <!-- SECTION 3: SELECTED WORKS (Editorial Feature Story) -->
      <section id="projects" class="py-16 sm:py-24">
        <div class="mb-12 text-center reveal">
          <div class="inline-block text-xs font-mono tracking-widest uppercase text-[var(--color-accent)] mb-2">§ 03 — SELECTED WORKS & ARTIFACTS</div>
          <h2 class="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[var(--color-foreground)]">
            Featured <span class="italic font-normal text-[var(--color-accent)]">Folio</span>
          </h2>
          <p class="mt-3 max-w-xl mx-auto text-sm leading-relaxed" style="color: var(--color-muted);">
            Open ecosystems engineered for longevity, transparent pedagogy, and clean architecture.
          </p>
        </div>

        <div class="grid gap-8">
          {#each featuredProjects as project}
            <div
              class="editorial-card reveal rounded-2xl p-7 sm:p-10 relative overflow-hidden"
            >
              <!-- Decorative Neon Glow Sparkle in Corner -->
              <div class="pointer-events-none absolute -top-12 -right-12 h-36 w-36 rounded-full blur-2xl opacity-20" style="background-color: var(--color-accent);"></div>

              <div class="flex flex-wrap items-center justify-between gap-3 border-b border-hairline pb-4 mb-6">
                <div class="flex items-center gap-3">
                  <span class="rounded-full px-3 py-0.5 text-xs font-mono font-semibold" style="background-color: var(--color-accent-soft); color: var(--color-accent); border: 1px solid var(--color-border-accent);">
                    {project.badge}
                  </span>
                  <span class="text-xs font-mono text-[var(--color-muted)]">{project.vol} // {project.type}</span>
                </div>

                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="group inline-flex items-center gap-2 rounded-lg border border-hairline px-3.5 py-1.5 text-xs font-mono transition-all duration-300 hover:border-[var(--color-accent)] hover:bg-[var(--color-surface-lighter)]"
                  style="color: var(--color-accent);"
                >
                  <span>Repository</span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                    <path fill-rule="evenodd" d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h4a.75.75 0 010 1.5h-4z" clip-rule="evenodd" />
                    <path fill-rule="evenodd" d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.156 8.35a.75.75 0 00-.053 1.06z" clip-rule="evenodd" />
                  </svg>
                </a>
              </div>

              <h3 class="font-serif text-3xl font-medium text-[var(--color-foreground)] mb-3">
                {project.title}
              </h3>

              <p class="text-sm sm:text-base leading-relaxed mb-6 max-w-3xl" style="color: var(--color-muted);">
                {project.desc}
              </p>

              <!-- Tags in Clean Editorial Pills -->
              <div class="flex flex-wrap gap-2 pt-2">
                {#each project.tags as tag}
                  <span
                    class="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-mono"
                    style="background-color: var(--color-surface-lighter); color: var(--color-foreground); border: 1px solid var(--color-border);"
                  >
                    <span class="text-[var(--color-accent)] opacity-70">#</span>
                    {tag}
                  </span>
                {/each}
              </div>
            </div>
          {/each}
        </div>
      </section>

      <!-- Section Divider -->
      <div class="relative my-8 flex items-center justify-center">
        <div class="w-full border-t border-hairline"></div>
        <span class="absolute px-4 font-serif text-sm text-[var(--color-accent)]" style="background-color: var(--color-surface);">✦</span>
      </div>

      <!-- SECTION 4: FIELD NOTES & HIGHLIGHTS -->
      <section id="highlights" class="py-16 sm:py-24">
        <div class="mb-12 text-center reveal">
          <div class="inline-block text-xs font-mono tracking-widest uppercase text-[var(--color-accent)] mb-2">§ 04 — CHRONICLE & MILESTONES</div>
          <h2 class="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[var(--color-foreground)]">
            Field <span class="italic font-normal text-[var(--color-accent)]">Notes</span>
          </h2>
          <p class="mt-3 max-w-xl mx-auto text-sm leading-relaxed" style="color: var(--color-muted);">
            Principles distilled from years of practical software delivery and sovereign engineering.
          </p>
        </div>

        <div class="grid gap-6 md:grid-cols-3">
          {#each highlights as h, i}
            <div
              class="editorial-card reveal stagger-{i + 1} flex flex-col justify-between rounded-2xl p-7 text-left"
            >
              <div>
                <div class="flex items-center justify-between border-b border-hairline pb-3 mb-5">
                  <span class="text-2xl">{h.emoji}</span>
                  <span class="text-[10px] font-mono uppercase tracking-widest text-[var(--color-accent)]">{h.date}</span>
                </div>
                <h3 class="font-serif text-xl font-medium text-[var(--color-foreground)] mb-2">
                  {h.title}
                </h3>
                <p class="text-sm leading-relaxed" style="color: var(--color-muted);">
                  {h.desc}
                </p>
              </div>

              <div class="mt-6 flex items-center gap-1.5 text-[10px] font-mono text-[var(--color-muted-dim)]">
                <span>NOTE REF // 0{i + 1}</span>
                <span>✦</span>
                <span>VERIFIED</span>
              </div>
            </div>
          {/each}
        </div>
      </section>

      <!-- Section Divider -->
      <div class="relative my-8 flex items-center justify-center">
        <div class="w-full border-t border-hairline"></div>
        <span class="absolute px-4 font-serif text-sm text-[var(--color-accent)]" style="background-color: var(--color-surface);">✦ 🌿 ✦</span>
      </div>

      <!-- SECTION 5: TELEMETRY (Cyber-Botanical GitHub Analytics) -->
      <section id="telemetry" class="py-16 sm:py-24">
        <div class="mb-12 text-center reveal">
          <div class="inline-block text-xs font-mono tracking-widest uppercase text-[var(--color-accent)] mb-2">§ 05 — LIVE PROFILE TELEMETRY</div>
          <h2 class="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[var(--color-foreground)]">
            Ecosystem <span class="italic font-normal text-[var(--color-accent)]">Telemetry</span>
          </h2>
          <p class="mt-3 max-w-xl mx-auto text-sm leading-relaxed" style="color: var(--color-muted);">
            Real-time telemetry of commits, streaks, language distributions, and open achievements.
          </p>
        </div>

        <div class="grid gap-6 sm:grid-cols-2">
          <!-- Stats Card -->
          <div class="editorial-card reveal stagger-1 flex flex-col justify-center items-center rounded-2xl p-5 sm:p-7">
            <div class="w-full flex items-center justify-between text-xs font-mono text-[var(--color-muted)] mb-4 border-b border-hairline pb-2">
              <span>METRICS // STATS</span>
              <span class="text-[var(--color-accent)]">● ACTIVE</span>
            </div>
            <img
              src={statsUrl}
              alt="GitHub Stats"
              class="gh-stat w-full max-w-md h-auto"
              loading="lazy"
            />
          </div>

          <!-- Streak Card -->
          <div class="editorial-card reveal stagger-2 flex flex-col justify-center items-center rounded-2xl p-5 sm:p-7">
            <div class="w-full flex items-center justify-between text-xs font-mono text-[var(--color-muted)] mb-4 border-b border-hairline pb-2">
              <span>METRICS // STREAK</span>
              <span class="text-[var(--color-accent)]">● ACTIVE</span>
            </div>
            <img
              src={streakUrl}
              alt="GitHub Streak"
              class="gh-stat w-full max-w-md h-auto"
              loading="lazy"
            />
          </div>

          <!-- Top Languages -->
          <div class="editorial-card reveal stagger-3 flex flex-col justify-center items-center rounded-2xl p-5 sm:p-7">
            <div class="w-full flex items-center justify-between text-xs font-mono text-[var(--color-muted)] mb-4 border-b border-hairline pb-2">
              <span>METRICS // LANGUAGES</span>
              <span class="text-[var(--color-accent)]">● ACTIVE</span>
            </div>
            <img
              src={topLangsUrl}
              alt="Top Languages"
              class="gh-stat w-full max-w-md h-auto"
              loading="lazy"
            />
          </div>

          <!-- Contribution Activity Chart -->
          <div class="editorial-card reveal stagger-4 flex flex-col justify-center items-center rounded-2xl p-5 sm:p-7 overflow-hidden">
            <div class="w-full flex items-center justify-between text-xs font-mono text-[var(--color-muted)] mb-4 border-b border-hairline pb-2">
              <span>METRICS // CONTRIBUTION MATRIX</span>
              <span class="text-[var(--color-accent)]">● ANNUAL</span>
            </div>
            <div class="w-full overflow-x-auto flex justify-center py-2">
              <img
                src={chartUrl}
                alt="GitHub Contribution Activity Chart"
                class="gh-stat min-w-[480px] w-full max-w-md h-auto"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        <!-- Trophy Showcase -->
        <div class="editorial-card reveal stagger-5 mt-8 rounded-2xl p-6 sm:p-8 flex flex-col items-center">
          <div class="w-full flex items-center justify-between text-xs font-mono text-[var(--color-muted)] mb-6 border-b border-hairline pb-2">
            <span>DISTINCTIONS & BADGES</span>
            <span class="text-[var(--color-accent)]">✦ RECOGNITION</span>
          </div>
          <img
            src={trophiesUrl}
            alt="GitHub Trophies"
            class="gh-stat w-full max-w-4xl h-auto"
            loading="lazy"
          />
        </div>
      </section>

      <!-- Section Divider -->
      <div class="relative my-8 flex items-center justify-center">
        <div class="w-full border-t border-hairline"></div>
        <span class="absolute px-4 font-serif text-sm text-[var(--color-accent)]" style="background-color: var(--color-surface);">✦ 🌿 ✦</span>
      </div>

      <!-- SECTION 6: DISPATCH & CORRESPONDENCE -->
      <section id="dispatch" class="py-16 sm:py-24 text-center">
        <div class="reveal max-w-2xl mx-auto">
          <div class="inline-block text-xs font-mono tracking-widest uppercase text-[var(--color-accent)] mb-2">§ 06 — DISPATCH & CHANNELS</div>
          <h2 class="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[var(--color-foreground)]">
            Open for <span class="italic font-normal text-[var(--color-accent)]">Dialogue</span>
          </h2>
          <p class="mt-3 text-base font-serif italic" style="color: var(--color-muted);">
            "Following the quietest guidance to build a faithful impact." 🌿
          </p>
        </div>

        <!-- Social Channels Grid -->
        <div class="grid gap-4 max-w-2xl mx-auto mt-12 sm:grid-cols-2">
          {#each socialLinks as link, i}
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              class="editorial-card reveal stagger-{i + 1} flex items-center justify-between rounded-xl p-4 transition-all"
            >
              <div class="flex flex-col text-left">
                <span class="font-serif text-base font-medium text-[var(--color-foreground)]">{link.name}</span>
                <span class="text-[11px] font-mono text-[var(--color-muted)]">{link.note}</span>
              </div>
              <div class="flex items-center gap-1.5 text-xs font-mono text-[var(--color-accent)]">
                <span>{link.handle}</span>
                <span>→</span>
              </div>
            </a>
          {/each}
        </div>

        <!-- Cottagecore Patronage & Support Banner -->
        <div
          class="editorial-card reveal stagger-5 mt-14 rounded-2xl p-8 sm:p-10 max-w-lg mx-auto relative overflow-hidden"
        >
          <div class="mb-2 text-2xl">🫶</div>
          <h3 class="font-serif text-xl font-medium text-[var(--color-foreground)] mb-2">
            Support Independent Craft
          </h3>
          <p class="text-xs leading-relaxed mb-6" style="color: var(--color-muted);">
            Every contribution sustains free educational resources like DevBook, open-source tooling, and peaceful digital habitats.
          </p>

          <a
            href="https://sociabuzz.com/reasvyn/tribe"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3 text-sm font-semibold transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-emerald-950/20"
            style="background-color: var(--color-accent); color: #080c0a;"
          >
            <span>Support on SociaBuzz</span>
            <span>✦</span>
          </a>
        </div>
      </section>
    </main>

    <!-- Editorial Colophon & Footer -->
    <footer class="border-t border-hairline py-10 text-center text-xs font-mono backdrop-blur-md" style="background-color: var(--color-surface); color: var(--color-muted);">
      <div class="mx-auto max-w-6xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-2">
          <span class="text-[var(--color-accent)]">✦</span>
          <span>&copy; {new Date().getFullYear()} Reas Vyn. Cultivated in silence, shaped for faithful impact.</span>
        </div>

        <div class="flex items-center gap-4 text-[11px]">
          <span>3S GOVERNED</span>
          <span>•</span>
          <span>CODE GARDEN</span>
          <span>•</span>
          <button
            onclick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            class="text-[var(--color-accent)] hover:underline cursor-pointer bg-transparent border-none p-0 font-mono text-[11px]"
          >
            BACK TO APEX ↑
          </button>
        </div>
      </div>
    </footer>
  </div>
</div>
