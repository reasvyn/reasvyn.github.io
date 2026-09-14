<script>
  import { onMount } from 'svelte';

  let theme = $state('dark');
  let menuOpen = $state(false);

  onMount(() => {
    const saved = localStorage.getItem('theme');
    if (saved) {
      theme = saved;
    } else {
      theme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    document.documentElement.setAttribute('data-theme', theme);
  });

  function toggleTheme() {
    theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  function closeMenu() {
    menuOpen = false;
  }

  const navLinks = [
    { href: '#philosophy', label: 'Philosophy' },
    { href: '#tech', label: 'Tech Stack' },
    { href: '#projects', label: 'Projects' },
    { href: '#highlights', label: 'Highlights' },
    { href: '#insights', label: 'Insights' },
    { href: '#connect', label: 'Connect' },
  ];

  const badges = [
    { label: 'Ecosystem', value: 'Secure | Sustain | Scalable', color: '#2ea44f' },
    { label: 'Status', value: 'Open for Projects', color: '#28a745' },
    { label: 'Role', value: 'Fullstack Developer', color: '#58a6ff' },
  ];

  const principles = [
    {
      icon: '🛡️',
      title: 'Secure',
      desc: 'Building with integrity. Ensuring a safe harbor for data and users. Every line of code is written to protect what is entrusted to the system.',
    },
    {
      icon: '🌱',
      title: 'Sustain',
      desc: 'Coding for the long run. Prioritizing health and clean architecture. Systems intended to thrive and maintain stability over time.',
    },
    {
      icon: '🚀',
      title: 'Scalable',
      desc: 'Growing with order. Ensuring that as an ecosystem expands, it remains efficient, orderly, and true to its original purpose.',
    },
  ];

  const techStacks = [
    { category: 'Core Logic', items: ['Rust', 'TypeScript', 'PHP'] },
    { category: 'Frameworks', items: ['Laravel', 'Next.js', 'Astro', 'Svelte'] },
    { category: 'Databases', items: ['PostgreSQL', 'Redis', 'Event Sourcing'] },
    { category: 'Infrastructure', items: ['Docker', 'AWS', 'Linux'] },
    { category: 'Practices', items: ['Clean Architecture', 'DDD', 'TDD', 'CI/CD'] },
  ];

  const featuredProjects = [
    {
      title: 'DevBook',
      url: 'https://github.com/reasvyn/devbook',
      desc: 'Markdown-based learning library for developers — 21 subjects from math & CS fundamentals to software engineering, infrastructure, AI/ML, career growth, and philosophy. Zero dependencies, no build step, open any .md file to start reading.',
      tags: ['Markdown', 'Git'],
      badge: 'Featured',
    },
  ];

  const highlights = [
    {
      emoji: '🕊️',
      title: 'Stewardship',
      desc: 'Delivering production-grade systems with a focus on responsibility and reliability since 2020.',
    },
    {
      emoji: '🏗️',
      title: 'Independent Path',
      desc: 'Operating as a solopreneur: full ownership from architecture to deployment on every project.',
    },
    {
      emoji: '🌐',
      title: 'Open Ecosystems',
      desc: 'Building in public, contributing precise and stable logic to the broader digital commons.',
    },
  ];

  const socialLinks = [
    { name: 'Website', url: 'https://reasvyn.web.id', handle: 'reasvyn.web.id' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/reasvyn', handle: 'Reas Vyn' },
    { name: 'Instagram', url: 'https://instagram.com/reasvyn', handle: '@reasvyn' },
    { name: 'Email', url: 'mailto:reasvyn@gmail.com', handle: 'reasvyn@gmail.com' },
  ];

  const bgColor = $derived(theme === 'dark' ? '161b22' : 'f6f8fa');
  const textColor = $derived(theme === 'dark' ? 'f0f6fc' : '1f2328');
  const mutedColor = $derived(theme === 'dark' ? '8b949e' : '656d76');
  const trophyTheme = $derived(theme === 'dark' ? 'darkhub' : 'flat');

  const statsUrl = $derived(
    `https://github-readme-stats-sigma-five.vercel.app/api?username=reasvyn&show_icons=true&count_private=true&hide_border=true&bg_color=${bgColor}&text_color=${textColor}&icon_color=2ea44f&title_color=2ea44f`
  );
  const topLangsUrl = $derived(
    `https://github-readme-stats-sigma-five.vercel.app/api/top-langs/?username=reasvyn&layout=compact&hide_border=true&bg_color=${bgColor}&text_color=${textColor}&title_color=2ea44f`
  );
  const streakUrl = $derived(
    `https://streak-stats.demolab.com/?user=reasvyn&hide_border=true&background=${bgColor}&stroke=2ea44f&ring=2ea44f&fire=2ea44f&currStreakNum=${textColor}&sideNums=${textColor}&currStreakLabel=2ea44f&sideLabels=${mutedColor}&dates=${mutedColor}`
  );
  const trophiesUrl = $derived(
    `https://github-trophies.vercel.app/?username=reasvyn&theme=${trophyTheme}&no-frame=true&no-bg=true&margin-w=4`
  );
</script>

<div class="min-h-screen" style="background-color: var(--color-surface);">
  <!-- Navigation -->
  <nav class="sticky top-0 z-50 border-b" style="background-color: color-mix(in srgb, var(--color-surface) 80%, transparent); border-color: var(--color-border); backdrop-filter: blur(12px);">
    <div class="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
      <a href="/" class="text-lg font-semibold tracking-tight" style="color: var(--color-foreground);">
        Reas Vyn
      </a>

      <!-- Desktop nav + theme toggle -->
      <div class="hidden items-center gap-6 sm:flex">
        {#each navLinks as link}
          <a href={link.href} class="text-sm font-medium transition-colors hover:text-(--color-accent)" style="color: var(--color-muted);">
            {link.label}
          </a>
        {/each}
        <button
          onclick={toggleTheme}
          class="ml-2 flex h-8 w-8 items-center justify-center rounded-lg text-sm transition-colors"
          style="background-color: var(--color-surface-lighter); color: var(--color-foreground);"
          aria-label="Toggle theme"
        >
          {#if theme === 'dark'}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-4 w-4"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" fill-rule="evenodd" clip-rule="evenodd"/></svg>
          {:else}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-4 w-4"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/></svg>
          {/if}
        </button>
      </div>

      <!-- Mobile: theme toggle + hamburger -->
      <div class="flex items-center gap-2 sm:hidden">
        <button
          onclick={toggleTheme}
          class="flex h-8 w-8 items-center justify-center rounded-lg text-sm transition-colors"
          style="background-color: var(--color-surface-lighter); color: var(--color-foreground);"
          aria-label="Toggle theme"
        >
          {#if theme === 'dark'}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-4 w-4"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" fill-rule="evenodd" clip-rule="evenodd"/></svg>
          {:else}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-4 w-4"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/></svg>
          {/if}
        </button>
        <button
          onclick={() => menuOpen = !menuOpen}
          class="flex h-8 w-8 items-center justify-center rounded-lg text-sm transition-colors"
          style="color: var(--color-foreground);"
          aria-label="Toggle menu"
        >
          {#if menuOpen}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-5 w-5"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
          {:else}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-5 w-5"><path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"/></svg>
          {/if}
        </button>
      </div>
    </div>

    <!-- Mobile menu -->
    {#if menuOpen}
      <div class="border-t sm:hidden" style="border-color: var(--color-border); background-color: var(--color-surface);">
        <div class="flex flex-col gap-1 px-4 py-3">
          {#each navLinks as link}
            <a
              href={link.href}
              onclick={closeMenu}
              class="block rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:text-(--color-accent)"
              style="color: var(--color-muted);"
            >{link.label}</a>
          {/each}
        </div>
      </div>
    {/if}
  </nav>

  <main class="mx-auto max-w-5xl px-4 sm:px-6">
    <!-- Hero -->
    <section class="flex min-h-[85vh] flex-col items-center justify-center text-center py-12">
      <p class="mb-3 text-sm font-semibold tracking-wider uppercase" style="color: var(--color-accent);">
        Building quietly, for a faithful impact.
      </p>
      <h1 class="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl" style="color: var(--color-foreground);">
        Hello, I'm <span style="color: var(--color-accent);">Reas Vyn</span>
      </h1>
      <p class="mt-5 max-w-2xl text-base leading-relaxed sm:text-lg" style="color: var(--color-muted);">
        <strong style="color: var(--color-foreground);">Fullstack Developer</strong> crafting digital ecosystems that are secure, sustainable, and scalable. Translating reliable logic into systems that serve with integrity—since 2020.
      </p>

      <div class="mt-8 flex flex-wrap justify-center gap-3">
        {#each badges as badge}
          <span
            class="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium"
            style="background-color: {badge.color}18; color: {badge.color}; border: 1px solid {badge.color}40;"
          >
            <span class="h-1.5 w-1.5 rounded-full" style="background-color: {badge.color}"></span>
            {badge.label}: {badge.value}
          </span>
        {/each}
      </div>

      <div class="mt-4 flex flex-wrap justify-center items-center gap-2">
        <img src="https://img.shields.io/github/stars/reasvyn?style=flat-square&label=Total%20Stars&color=yellow" alt="Total Stars" class="h-5" />
        <img src="https://komarev.com/ghpvc/?username=reasvyn&color=blueviolet&style=flat-square&label=Profile%20Views" alt="Profile Views" class="h-5" />
      </div>

      <a href="#philosophy" class="mt-12 animate-bounce text-2xl transition-colors" style="color: var(--color-muted);" aria-label="Scroll down">↓</a>
    </section>

    <div class="border-t" style="border-color: var(--color-border);" id="philosophy"></div>

    <!-- Philosophy -->
    <section class="py-16 sm:py-24">
      <div class="mb-10 text-center">
        <h2 class="text-2xl font-bold sm:text-3xl" style="color: var(--color-foreground);">Philosophy</h2>
        <p class="mt-2 text-sm" style="color: var(--color-muted);">Core principles guiding every architectural and implementation decision</p>
      </div>
      <div class="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {#each principles as principle}
          <div class="group rounded-xl border p-6 transition-all hover:border-(--color-accent) sm:p-8" style="border-color: var(--color-border); background-color: var(--color-surface-light);">
            <div class="mb-4 text-3xl">{principle.icon}</div>
            <h3 class="mb-3 text-xl font-semibold" style="color: var(--color-foreground);">{principle.title}</h3>
            <p class="text-sm leading-relaxed" style="color: var(--color-muted);">{principle.desc}</p>
          </div>
        {/each}
      </div>
    </section>

    <div class="border-t" style="border-color: var(--color-border);" id="tech"></div>

    <!-- Tech Stack -->
    <section class="py-16 sm:py-24">
      <div class="mb-10 text-center">
        <h2 class="text-2xl font-bold sm:text-3xl" style="color: var(--color-foreground);">Tech Stack</h2>
        <p class="mt-2 text-sm" style="color: var(--color-muted);">Tools, technologies, and practices used across the development lifecycle</p>
      </div>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {#each techStacks as stack}
          <div class="rounded-xl border p-5 sm:p-6 transition-all" style="border-color: var(--color-border); background-color: var(--color-surface-light);">
            <h3 class="mb-4 text-xs font-semibold uppercase tracking-wider" style="color: var(--color-accent);">{stack.category}</h3>
            <ul class="space-y-2">
              {#each stack.items as item}
                <li class="flex items-center gap-2 text-sm" style="color: var(--color-muted);">
                  <span class="h-1 w-1 rounded-full" style="background-color: var(--color-accent);"></span>
                  {item}
                </li>
              {/each}
            </ul>
          </div>
        {/each}
      </div>
    </section>

    <div class="border-t" style="border-color: var(--color-border);" id="projects"></div>

    <!-- Featured Projects -->
    <section class="py-16 sm:py-24">
      <div class="mb-10 text-center">
        <h2 class="text-2xl font-bold sm:text-3xl" style="color: var(--color-foreground);">Featured Projects</h2>
        <p class="mt-2 text-sm" style="color: var(--color-muted);">Curated open source work and digital platforms</p>
      </div>
      <div class="grid gap-6">
        {#each featuredProjects as project}
          <div class="rounded-xl border p-6 transition-all sm:p-8 hover:border-(--color-accent)" style="border-color: var(--color-border); background-color: var(--color-surface-light);">
            <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div class="flex items-center gap-3">
                <h3 class="text-xl font-bold" style="color: var(--color-foreground);">
                  {project.title}
                </h3>
                <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold" style="background-color: color-mix(in srgb, var(--color-accent) 15%, transparent); color: var(--color-accent);">
                  {project.badge}
                </span>
              </div>
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:underline"
                style="color: var(--color-accent);"
              >
                View on GitHub
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
                  <path fill-rule="evenodd" d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h4a.75.75 0 010 1.5h-4z" clip-rule="evenodd" />
                  <path fill-rule="evenodd" d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.156 8.35a.75.75 0 00-.053 1.06z" clip-rule="evenodd" />
                </svg>
              </a>
            </div>
            <p class="text-sm leading-relaxed mb-6" style="color: var(--color-muted);">
              {project.desc}
            </p>
            <div class="flex flex-wrap gap-2">
              {#each project.tags as tag}
                <span class="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-mono font-medium" style="background-color: var(--color-surface-lighter); color: var(--color-foreground);">
                  `{tag}`
                </span>
              {/each}
            </div>
          </div>
        {/each}
      </div>
    </section>

    <div class="border-t" style="border-color: var(--color-border);" id="highlights"></div>

    <!-- Highlights -->
    <section class="py-16 sm:py-24">
      <div class="mb-10 text-center">
        <h2 class="text-2xl font-bold sm:text-3xl" style="color: var(--color-foreground);">Highlights</h2>
        <p class="mt-2 text-sm" style="color: var(--color-muted);">Key milestones and working paradigm</p>
      </div>
      <div class="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {#each highlights as h}
          <div class="rounded-xl border p-6 text-center sm:p-8" style="border-color: var(--color-border); background-color: var(--color-surface-light);">
            <div class="mb-4 text-4xl">{h.emoji}</div>
            <h3 class="mb-3 text-lg font-semibold" style="color: var(--color-foreground);">{h.title}</h3>
            <p class="text-sm leading-relaxed" style="color: var(--color-muted);">{h.desc}</p>
          </div>
        {/each}
      </div>
    </section>

    <div class="border-t" style="border-color: var(--color-border);" id="insights"></div>

    <!-- GitHub Insights -->
    <section class="py-16 sm:py-24">
      <div class="mb-10 text-center">
        <h2 class="text-2xl font-bold sm:text-3xl" style="color: var(--color-foreground);">GitHub Insights</h2>
        <p class="mt-2 text-sm" style="color: var(--color-muted);">Live profile telemetry and repository breakdown</p>
      </div>
      <div class="grid gap-6 sm:grid-cols-2">
        <div class="flex justify-center items-center rounded-xl border p-4 sm:p-6" style="border-color: var(--color-border); background-color: var(--color-surface-light);">
          <img
            src={statsUrl}
            alt="GitHub Stats"
            class="gh-stat w-full max-w-md h-auto"
            loading="lazy"
          />
        </div>
        <div class="flex justify-center items-center rounded-xl border p-4 sm:p-6" style="border-color: var(--color-border); background-color: var(--color-surface-light);">
          <img
            src={streakUrl}
            alt="GitHub Streak"
            class="gh-stat w-full max-w-md h-auto"
            loading="lazy"
          />
        </div>
        <div class="flex justify-center items-center rounded-xl border p-4 sm:p-6 sm:col-span-2" style="border-color: var(--color-border); background-color: var(--color-surface-light);">
          <img
            src={topLangsUrl}
            alt="Top Languages"
            class="gh-stat w-full max-w-lg h-auto"
            loading="lazy"
          />
        </div>
      </div>

      <div class="mt-8 rounded-xl border p-4 sm:p-6 flex flex-col items-center" style="border-color: var(--color-border); background-color: var(--color-surface-light);">
        <h3 class="mb-4 text-sm font-semibold uppercase tracking-wider" style="color: var(--color-muted);">GitHub Trophies</h3>
        <img
          src={trophiesUrl}
          alt="GitHub Trophies"
          class="gh-stat w-full max-w-4xl h-auto"
          loading="lazy"
        />
      </div>
    </section>

    <div class="border-t" style="border-color: var(--color-border);" id="connect"></div>

    <!-- Connect -->
    <section class="py-16 text-center sm:py-24">
      <h2 class="mb-4 text-2xl font-bold sm:text-3xl" style="color: var(--color-foreground);">Let's Connect</h2>
      <p class="mb-10 text-base italic" style="color: var(--color-muted);">Following the quietest guidance to build a faithful impact. 🌿</p>
      
      <div class="grid gap-4 max-w-2xl mx-auto sm:grid-cols-2">
        {#each socialLinks as link}
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center justify-between rounded-xl border p-4 transition-all hover:border-(--color-accent) hover:translate-y-[-2px]"
            style="border-color: var(--color-border); background-color: var(--color-surface-light);"
          >
            <span class="font-semibold text-sm" style="color: var(--color-foreground);">{link.name}</span>
            <span class="text-xs font-mono truncate max-w-[160px]" style="color: var(--color-muted);">{link.handle}</span>
          </a>
        {/each}
      </div>

      <div class="mt-16 rounded-2xl border p-8 max-w-lg mx-auto" style="border-color: var(--color-border); background-color: var(--color-surface-light);">
        <p class="mb-2 text-sm font-medium" style="color: var(--color-foreground);">🫶 Thanks for supporting me on</p>
        <p class="mb-6 text-xs" style="color: var(--color-muted);">Empower independent engineering & open source creation</p>
        <a
          href="https://sociabuzz.com/reasvyn/tribe"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center justify-center gap-2 rounded-xl px-8 py-3 text-sm font-semibold transition-all hover:opacity-90"
          style="background-color: var(--color-accent); color: #ffffff;"
        >
          Support on SociaBuzz
        </a>
      </div>
    </section>
  </main>

  <footer class="border-t py-8 text-center text-sm" style="border-color: var(--color-border); color: var(--color-muted);">
    <p>&copy; {new Date().getFullYear()} Reas Vyn. Built quietly, for a faithful impact. 🌿</p>
  </footer>
</div>
