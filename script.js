document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.querySelector('.theme-toggle');
  const sunIcon = document.querySelector('.sun-icon');
  const moonIcon = document.querySelector('.moon-icon');
  const menuToggle = document.querySelector('.menu-toggle');
  const sidebar = document.getElementById('sidebar');
  const htmlElement = document.documentElement;
  const progressBar = document.getElementById('progress-bar');
  const backToTopBtn = document.getElementById('back-to-top');
  const tocSearch = document.getElementById('toc-search');

  // 1. Theme Management
  const currentTheme = localStorage.getItem('theme') || 'light';
  if (currentTheme === 'dark') {
    htmlElement.setAttribute('data-theme', 'dark');
    sunIcon.style.display = 'block';
    moonIcon.style.display = 'none';
  }

  themeToggle.addEventListener('click', () => {
    if (htmlElement.getAttribute('data-theme') === 'dark') {
      htmlElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
      sunIcon.style.display = 'none';
      moonIcon.style.display = 'block';
    } else {
      htmlElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
      sunIcon.style.display = 'block';
      moonIcon.style.display = 'none';
    }
  });

  // 2. Reading Progress Bar & Back-to-Top Button
  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0) {
      const progress = (window.scrollY / totalHeight) * 100;
      progressBar.style.width = `${progress}%`;
    }

    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // 3. Mobile Menu Toggle
  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
  }

  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 1024 && sidebar) {
      if (!sidebar.contains(e.target) && menuToggle && !menuToggle.contains(e.target)) {
        sidebar.classList.remove('open');
      }
    }
  });

  // 4. Live TOC Instant Search Filter
  if (tocSearch) {
    tocSearch.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      const tocLinks = sidebar.querySelectorAll('li');

      tocLinks.forEach(li => {
        const text = li.textContent.toLowerCase();
        if (query === '' || text.includes(query)) {
          li.style.display = '';
        } else {
          li.style.display = 'none';
        }
      });
    });
  }

  // 5. Code Block Copy to Clipboard Buttons
  const codeBlocks = document.querySelectorAll('pre');
  codeBlocks.forEach((pre) => {
    // Don't add copy button to mermaid pre blocks
    if (pre.classList.contains('mermaid')) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'code-wrapper';
    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);

    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-btn';
    copyBtn.innerText = 'Copy';
    copyBtn.setAttribute('aria-label', 'Copy code snippet');

    copyBtn.addEventListener('click', () => {
      const codeText = pre.querySelector('code') ? pre.querySelector('code').innerText : pre.innerText;
      navigator.clipboard.writeText(codeText).then(() => {
        copyBtn.innerText = 'Copied!';
        copyBtn.style.color = '#10b981';
        setTimeout(() => {
          copyBtn.innerText = 'Copy';
          copyBtn.style.color = '';
        }, 2000);
      });
    });

    wrapper.appendChild(copyBtn);
  });

  // 6. Active TOC Link Highlighting (ScrollSpy)
  const tocLinks = document.querySelectorAll('aside a');
  tocLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 1024) {
        sidebar.classList.remove('open');
      }
    });
  });

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -75% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        tocLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  document.querySelectorAll('h1[id], h2[id], h3[id]').forEach((heading) => {
    observer.observe(heading);
  });
});
