(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const navLinks = [...document.querySelectorAll('.dock a[href^="#"]')];
  const sections = [...document.querySelectorAll('header[id], main section[id]')];
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
  }), { rootMargin: '-45% 0px -45% 0px' });
  sections.forEach(section => observer.observe(section));

  const reveal = document.querySelectorAll('.section-intro, .service-card, .about-copy, .about-photo, .statement p, .project, .timeline article, .credential-grid article, .recognition-grid article, .contact-form, .contact-photo');
  reveal.forEach(el => el.classList.add('reveal'));
  if (reduced) reveal.forEach(el => el.classList.add('visible'));
  else {
    const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }), { threshold: .1 });
    reveal.forEach(el => revealObserver.observe(el));
  }

  const copy = document.querySelector('.copy-email');
  copy?.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(copy.dataset.email); copy.textContent = 'Email copied ✓'; }
    catch { copy.textContent = copy.dataset.email; }
    setTimeout(() => copy.textContent = 'Copy email', 1800);
  });

  document.querySelector('.to-top')?.addEventListener('click', () => scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }));

  if (!reduced && matchMedia('(pointer:fine)').matches) {
    const cursor = document.querySelector('.cursor');
    addEventListener('pointermove', e => {
      cursor.animate({ left: `${e.clientX}px`, top: `${e.clientY}px` }, { duration: 180, fill: 'forwards', easing: 'ease-out' });
    });
    document.querySelectorAll('a,button,.project').forEach(el => {
      el.addEventListener('mouseenter', () => { cursor.style.width = '34px'; cursor.style.height = '34px'; cursor.style.opacity = '.35'; });
      el.addEventListener('mouseleave', () => { cursor.style.width = '12px'; cursor.style.height = '12px'; cursor.style.opacity = '1'; });
    });

    document.querySelectorAll('.project').forEach(card => {
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        const rx = ((e.clientY-r.top)/r.height-.5)*-3;
        const ry = ((e.clientX-r.left)/r.width-.5)*4;
        card.style.transform = `perspective(1100px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-8px)`;
      });
      card.addEventListener('pointerleave', () => card.style.transform = '');
    });
  }
  const greetingIntro = document.getElementById('greetingIntro');
  const greetingText = document.getElementById('greetingText');

  if (greetingIntro && greetingText) {

    document.body.classList.add('intro-active');

    const greetings = [
      'Hello',
      'Привет',
      'Hola',
      'Bonjour',
      'こんにちは',
      'नमस्ते',
      'चरण स्पर्श'
    ];

    let greetingIndex = 0;

    const showGreeting = () => {
      greetingText.classList.remove('show');

      setTimeout(() => {
        greetingText.textContent = greetings[greetingIndex];
        greetingText.classList.add('show');
      }, 220);
    };

    showGreeting();

    const greetingTimer = setInterval(() => {

      greetingIndex++;

      if (greetingIndex >= greetings.length) {

        clearInterval(greetingTimer);

        setTimeout(() => {

          greetingText.classList.remove('show');

          setTimeout(() => {
            greetingIntro.classList.add('hide');
            document.body.classList.remove('intro-active');
          }, 400);

        }, 650);

        return;
      }

      showGreeting();

    }, 1100);
  }

})();
