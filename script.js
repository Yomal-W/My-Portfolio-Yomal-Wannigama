// ===== NAVBAR COMPONENT =====
// Injects the shared navbar into every page and highlights the active link.
// script.js is loaded at the bottom of <body>, so document.body is ready.
(function renderNavbar() {
  // Derive the current filename from the URL path (works on file:// and http://)
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  const links = [
    { href: 'index.html',     label: 'Home' },
    { href: 'projects.html', label: 'Projects' },
    { href: 'about.html',    label: 'About' },
    { href: 'assets/Yomal-Wannigama-Resume.pdf', label: 'Resume', external: true },
    { href: 'https://www.linkedin.com/in/yomal-wannigama-0867921b1/', label: 'LinkedIn', external: true },
  ];

  // Mark the matching link active.
  // Individual project pages (project1/2/3.html) count as sub-pages of Projects.
  function isActive(href) {
    if (href === currentPage) return true;
    if (href === 'projects.html' && /^project\d+\.html$/.test(currentPage)) return true;
    return false;
  }

  const skipHTML = `<a href="#main-content" class="skip-link">Skip to main content</a>`;

  const navHTML = `
  <nav class="navbar">
    <div class="logo"><a href="index.html" aria-label="Yomal W — Portfolio Home">YW</a></div>
    <ul class="nav-links" id="primary-nav">
      ${links.map(({ href, label, external }) =>
        `<li><a href="${href}"${isActive(href) ? ' class="active" aria-current="page"' : ''}${external ? ' target="_blank" rel="noopener noreferrer"' : ''}>${label}</a></li>`
      ).join('\n      ')}
    </ul>
    <button class="burger" aria-label="Open navigation menu" aria-expanded="false" aria-controls="primary-nav">
      <span class="line" aria-hidden="true"></span>
      <span class="line" aria-hidden="true"></span>
      <span class="line" aria-hidden="true"></span>
    </button>
  </nav>`;

  document.body.insertAdjacentHTML('afterbegin', skipHTML + navHTML);

  // Wire up mobile burger menu on the freshly-inserted elements
  const burger    = document.querySelector('.burger');
  const navLinksEl = document.querySelector('.nav-links');

  burger.addEventListener('click', () => {
    const isExpanded = burger.getAttribute('aria-expanded') === 'true';
    navLinksEl.classList.toggle('active');
    burger.classList.toggle('active');
    burger.setAttribute('aria-expanded', String(!isExpanded));
    burger.setAttribute('aria-label', !isExpanded ? 'Close navigation menu' : 'Open navigation menu');
  });

  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinksEl.classList.remove('active');
      burger.classList.remove('active');
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Open navigation menu');
    });
  });
})();

// ===== p5.js GENERATIVE BACKGROUND =====
// Uses instance mode + DOMContentLoaded so the sketch starts as soon as the
// DOM is parsed — not on window.load, which waits for all images/videos first.
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var sketch = function (p) {
    var points = [];
    var speedMultiplier = 0.005;
    var r1, r2, g1, g2, b1, b2;
    var restartTimer;

    function restartSketch() {
      p.background(10);
      points = [];
      // Space particles by area so count stays ~800 on any screen size.
      var space = Math.sqrt((p.width * p.height) / 800);
      for (var x = 0; x < p.width; x += space) {
        for (var y = 0; y < p.height; y += space) {
          var pt = p.createVector(x + p.random(-10, 10), y + p.random(-10, 10));
          points.push(pt);
        }
      }
      r1 = p.random(255); r2 = p.random(255);
      g1 = p.random(255); g2 = p.random(255);
      b1 = p.random(255); b2 = p.random(255);
      speedMultiplier = p.random(0.002, 0.01);
    }

    function changeColors() {
      r1 = p.random(255); r2 = p.random(255);
      g1 = p.random(255); g2 = p.random(255);
      b1 = p.random(255); b2 = p.random(255);
    }

    p.setup = function () {
      var canvas = p.createCanvas(p.windowWidth, p.windowHeight);
      canvas.parent('p5-container');
      p.angleMode(p.DEGREES);
      p.noiseDetail(1);
      restartSketch();
      canvas.mousePressed(changeColors);
      restartTimer = setInterval(restartSketch, 5000);

      // Pause in background tabs; resume when the tab becomes visible again
      document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
          p.noLoop();
          clearInterval(restartTimer);
        } else {
          p.loop();
          restartTimer = setInterval(restartSketch, 5000);
        }
      });

      // Halve frame rate on mobile to reduce CPU load
      if (p.windowWidth < 768) {
        p.frameRate(30);
      }
    };

    p.draw = function () {
      p.noStroke();
      for (var i = 0; i < points.length; i++) {
        var r = p.map(points[i].x, 0, p.width, r1, r2);
        var g = p.map(points[i].y, 0, p.height, g1, g2);
        var b = p.map(points[i].x, 0, p.width, b1, b2);
        var alpha = p.map(p.dist(p.width / 2, p.height / 2, points[i].x, points[i].y), 0, 500, 255, 0);
        p.fill(r, g, b, alpha);
        var angle = p.map(p.noise(points[i].x * speedMultiplier, points[i].y * speedMultiplier), 0, 1, 0, 720);
        // Inline x/y update — avoids allocating a new Vector object every frame
        points[i].x += p.cos(angle);
        points[i].y += p.sin(angle);
        var size = p.map(p.width, 0, 1920, 1, 4);
        p.ellipse(points[i].x, points[i].y, size);
      }
    };

    p.windowResized = function () {
      p.resizeCanvas(p.windowWidth, p.windowHeight);
    };
  };

  // Start on DOMContentLoaded (DOM parsed) rather than window.load (all assets downloaded).
  // This eliminates the multi-second delay on pages with large images or videos.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { new p5(sketch); });
  } else {
    new p5(sketch);
  }
}());

// ===== JOURNEY MAP MODAL FUNCTIONALITY =====

// Wait for DOM to load
document.addEventListener("DOMContentLoaded", function() {
  // Attach click listeners to journey map images
  document.querySelectorAll('.journey-map-img').forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', function(e) {
      e.stopPropagation();
      const modalImg = document.getElementById('modalImg');
      modalImg.src = this.src;
      document.getElementById('journeyMapModal').classList.add('active');
      // Change modal border based on which image
      if (this.alt.toLowerCase().includes('ben park')) {
        modalImg.style.outline = '4px solid #ffe16b'; // yellow for Ben Park (parent)                                      
      } else {
        modalImg.style.outline = '4px solid #c1a8ff'; // purple for kids
      }
    });
  });
});

// Close modal when clicking overlay or pressing Escape
function closeModal() {
  const m = document.getElementById('journeyMapModal');
  const img = document.getElementById('modalImg');
  if (m) m.classList.remove('active');
  if (img) img.src = '';
}
document.addEventListener('keydown', function(e) {
  if (e.key === "Escape") closeModal();
});

// ===== STORYBOARD IMAGE MODAL FUNCTIONALITY =====
document.addEventListener("DOMContentLoaded", function() {
  document.querySelectorAll('.storyboard-img').forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', function(e) {
      e.stopPropagation();
      const modalImg = document.getElementById('imgModalImg');
      modalImg.src = this.src;
      document.getElementById('imgModal').classList.add('active');
      // Optional: highlight style per persona
      if (this.alt.toLowerCase().includes('ben')) {
        modalImg.style.outline = '4px solid #ffe16b'; // yellow for parent
      } else {
        modalImg.style.outline = '4px solid #c1a8ff'; // purple for kids
      }
    });
  });
});

// Close modal for storyboard images
function closeImgModal() {
  const m = document.getElementById('imgModal');
  const img = document.getElementById('imgModalImg');
  if (m) m.classList.remove('active');
  if (img) img.src = '';
}
document.addEventListener('keydown', function(e) {
  if (e.key === "Escape") closeImgModal();
});

// === Brainstorm image modal ===
document.addEventListener("DOMContentLoaded", function() {
  const brainstormTrigger = document.getElementById('brainstormTrigger');
  const brainstormModal = document.getElementById('brainstormModal');
  const brainstormModalImg = document.getElementById('brainstormModalImg');
  
  if (brainstormTrigger && brainstormModal && brainstormModalImg) {
    // Open modal on click or keyboard
    function openModal() {
      brainstormModalImg.src = brainstormTrigger.src;
      brainstormModalImg.alt = brainstormTrigger.alt + " (enlarged)";
      brainstormModal.classList.add('open');
      brainstormModal.focus();
    }
    brainstormTrigger.addEventListener('click', openModal);
    brainstormTrigger.addEventListener('keydown', function(e) {
      if (e.key === "Enter" || e.key === " ") openModal();
    });

    // Close modal on click outside image or on Escape
    brainstormModal.addEventListener('click', function (event) {
      if (event.target === brainstormModal) {
        brainstormModal.classList.remove('open');
        brainstormModalImg.src = "";
      }
    });
    document.addEventListener('keydown', function(e) {
      if (e.key === "Escape" && brainstormModal.classList.contains('open')) {
        brainstormModal.classList.remove('open');
        brainstormModalImg.src = "";
      }
    });
  }
});

// === Mid-Fidelity Wireframe Image Modal ===
document.addEventListener("DOMContentLoaded", function() {
  document.querySelectorAll('.mid-fi-wireframe-img').forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', function(e) {
      e.stopPropagation();
      // Use the same modal as journey-map for consistency
      const modalImg = document.getElementById('modalImg');
      modalImg.src = this.src;
      document.getElementById('journeyMapModal').classList.add('active');
      // Optional: adjust outline color if needed
      modalImg.style.outline = '4px solid #c1a8ff';
    });
  });
});

// === Iteration Modal ===
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll('.iteration-enlargeable').forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', function (e) {
      e.stopPropagation();
      const modalImg = document.getElementById('iterationModalImg');
      modalImg.src = this.src;
      document.getElementById('iterationModal').classList.add('active');
      modalImg.style.outline = '4px solid #c1a8ff'; // Purple outline
    });
  });
});
function closeIterationModal() {
  const m = document.getElementById('iterationModal');
  const img = document.getElementById('iterationModalImg');
  if (m) m.classList.remove('active');
  if (img) img.src = '';
}
document.addEventListener('keydown', function (e) {
  if (e.key === "Escape") closeIterationModal();
});

document.querySelectorAll('.enlargeable').forEach(img => {
  img.addEventListener('click', function() {
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    modal.style.display = "flex";
    modalImg.src = this.src;
    modalImg.alt = this.alt;
  });
});

const imageModalClose = document.querySelector('.image-modal-close');
const imageModal = document.getElementById('image-modal');
if (imageModalClose && imageModal) {
  imageModalClose.onclick = function() { imageModal.style.display = "none"; };
  imageModal.onclick = function(e) { if (e.target === imageModal) imageModal.style.display = "none"; };
}

