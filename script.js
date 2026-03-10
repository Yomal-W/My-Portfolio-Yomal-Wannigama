// ===== NAVBAR COMPONENT =====
// Injects the shared navbar into every page and highlights the active link.
// script.js is loaded at the bottom of <body>, so document.body is ready.
(function renderNavbar() {
  // Derive the current filename from the URL path (works on file:// and http://)
  const currentPage = window.location.pathname.split('/').pop() || 'home.html';

  const links = [
    { href: 'home.html',     label: 'Home' },
    { href: 'projects.html', label: 'Projects' },
    { href: 'about.html',    label: 'About' },
  ];

  // Mark the matching link active.
  // Individual project pages (project1/2/3.html) count as sub-pages of Projects.
  function isActive(href) {
    if (href === currentPage) return true;
    if (href === 'projects.html' && /^project\d+\.html$/.test(currentPage)) return true;
    return false;
  }

  const navHTML = `
  <nav class="navbar">
    <div class="logo"><a href="home.html">YW</a></div>
    <ul class="nav-links">
      ${links.map(({ href, label }) =>
        `<li><a href="${href}"${isActive(href) ? ' class="active"' : ''}>${label}</a></li>`
      ).join('\n      ')}
    </ul>
    <div class="burger">
      <div class="line"></div>
      <div class="line"></div>
      <div class="line"></div>
    </div>
  </nav>`;

  document.body.insertAdjacentHTML('afterbegin', navHTML);

  // Wire up mobile burger menu on the freshly-inserted elements
  const burger    = document.querySelector('.burger');
  const navLinksEl = document.querySelector('.nav-links');

  burger.addEventListener('click', () => {
    navLinksEl.classList.toggle('active');
    burger.classList.toggle('active');
  });

  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinksEl.classList.remove('active');
      burger.classList.remove('active');
    });
  });
})();

// ===== YOUR ORIGINAL p5.js CODE =====
var points = [];
var speedMultiplier = 0.005;
var r1, r2, g1, g2, b1, b2;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('p5-container');
  angleMode(DEGREES);
  noiseDetail(1);
  restartSketch();
  canvas.mousePressed(changeColors);
  setInterval(restartSketch, 5000);
}

function restartSketch() {
  background(10);
  points = [];
  var density = 40;
  var space = width / density;

  for (var x = 0; x < width; x += space) {
    for (var y = 0; y < height; y += space) {
      var p = createVector(x + random(-10, 10), y + random(-10, 10));
      points.push(p);
    }
  }

  r1 = random(255);
  r2 = random(255);
  g1 = random(255);
  g2 = random(255);
  b1 = random(255);
  b2 = random(255);
  speedMultiplier = random(0.002, 0.01);
}

function draw() {
  noStroke();
  for (var i = 0; i < points.length; i++) {
    var r = map(points[i].x, 0, width, r1, r2);
    var g = map(points[i].y, 0, height, g1, g2);
    var b = map(points[i].x, 0, width, b1, b2);
    var alpha = map(dist(width/2, height/2, points[i].x, points[i].y), 0, 500, 255, 0);

    fill(r, g, b, alpha);
    var angle = map(noise(points[i].x * speedMultiplier, points[i].y * speedMultiplier), 0, 1, 0, 720);
    points[i].add(createVector(cos(angle), sin(angle)));
    var size = map(width, 0, 1920, 1, 4);
    ellipse(points[i].x, points[i].y, size);
  }
}

function changeColors() {
  r1 = random(255);
  r2 = random(255);
  g1 = random(255);
  g2 = random(255);
  b1 = random(255);
  b2 = random(255);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

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
  document.getElementById('journeyMapModal').classList.remove('active');
  document.getElementById('modalImg').src = '';
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
  document.getElementById('imgModal').classList.remove('active');
  document.getElementById('imgModalImg').src = '';
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
  document.getElementById('iterationModal').classList.remove('active');
  document.getElementById('iterationModalImg').src = '';
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

document.querySelector('.image-modal-close').onclick = function() {
  document.getElementById('image-modal').style.display = "none";
};
document.getElementById('image-modal').onclick = function(e) {
  if(e.target === this) this.style.display = "none";
};

