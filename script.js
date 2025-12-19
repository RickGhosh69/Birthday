/* ===== Audio Unlock (robust) ===== */
let audioUnlocked = sessionStorage.getItem("audioUnlocked") === "true";
const notifySound = document.getElementById("notify");

function unlockAudio() {
    if (audioUnlocked) return;
    audioUnlocked = true;
    sessionStorage.setItem("audioUnlocked", "true");

    notifySound.volume = 0;
    notifySound.play().then(() => {
        notifySound.pause();
        notifySound.currentTime = 0;
        notifySound.volume = 1;
    }).catch(() => { });
    tryPlayNotify();

    window.removeEventListener("click", unlockAudio);
}
window.addEventListener("click", unlockAudio);

/* ===== Fade on Scroll ===== */
document.querySelectorAll(".fade-section").forEach(sec => {
    new IntersectionObserver(e => {
        if (e[0].isIntersecting) sec.classList.add("show");
    }, { threshold: 0.2 }).observe(sec);
});

/* ===== Countdown (instant) ===== */
const targetDate = new Date("December 20, 2025 00:00:00").getTime();
const countdownEl = document.getElementById("countdown");
function updateCountdown() {
    const diff = targetDate - Date.now();
    if (diff <= 0) return countdownEl.innerHTML = "🎉 It’s your special day!";
    const d = Math.floor(diff / 86400000);
    const h = Math.floor(diff / 3600000 % 24);
    const m = Math.floor(diff / 60000 % 60);
    countdownEl.innerHTML = `⏳ ${d} days ${h} hrs ${m} mins to go`;
}
updateCountdown();
setInterval(updateCountdown, 1000);

/* ===== Floating Hearts ===== */
const floating = document.querySelector(".floating");
setInterval(() => {
    const h = document.createElement("span");
    h.innerHTML = "❤️";
    h.style.left = Math.random() * 100 + "vw";
    h.style.fontSize = Math.random() * 10 + 14 + "px";
    floating.appendChild(h);
    setTimeout(() => h.remove(), 9000);
}, 500);

/* ===== MUSIC (FINAL & STABLE) ===== */
const music = document.getElementById("bg-music");
const musicBtn = document.getElementById("music-btn");

let isPlaying = false;

// set initial volume safely
music.volume = 0.85;

musicBtn.addEventListener("click", () => {
    if (!music) return;

    if (isPlaying) {
        music.pause();
        musicBtn.textContent = "🎵 Play Music";
        isPlaying = false;
    } else {
        music.play()
            .then(() => {
                musicBtn.textContent = "⏸ Pause Music";
                isPlaying = true;
            })
            .catch(() => {
                // browser blocked play (rare, but possible)
                musicBtn.textContent = "🔇 Tap again";
                setTimeout(() => {
                    musicBtn.textContent = "🎵 Play Music";
                }, 1500);
            });
    }
});


/* ===== Popup ===== */
const popup = document.getElementById("popup");
const openBtn = document.getElementById("openMessage");
const closeBtn = document.getElementById("closePopup");
const notifyDot = document.getElementById("notifyDot");

openBtn.onclick = () => {
    popup.style.display = "flex";
    popup.setAttribute('aria-hidden', 'false');
    openBtn.setAttribute('aria-expanded', 'true');
    notifyDot.classList.remove("show");
    closeBtn.focus();
};
closeBtn.onclick = () => {
    popup.style.display = "none";
    popup.setAttribute('aria-hidden', 'true');
    openBtn.setAttribute('aria-expanded', 'false');
    openBtn.focus();
};
popup.onclick = e => {
    if (e.target === popup) {
        popup.style.display = "none";
        popup.setAttribute('aria-hidden', 'true');
        openBtn.setAttribute('aria-expanded', 'false');
        openBtn.focus();
    }
};

/* ===== Notify on Scroll ===== */
let notifyPlayed = false;
let messageSeen = false;
const messageSection = document.querySelector(".message");

const notifyObserver = new IntersectionObserver(e => {
    if (e[0].isIntersecting) {
        messageSeen = true;
        notifyDot.classList.add("show");
        tryPlayNotify();
    }
}, { threshold: 0.5 });
notifyObserver.observe(messageSection);

function tryPlayNotify() {
    if (audioUnlocked && messageSeen && !notifyPlayed) {
        notifySound.play().catch(() => { });
        notifyPlayed = true;
        notifyObserver.disconnect();
    }
}

/* ===== Cursor Particles ===== */
if (!("ontouchstart" in window)) {
    let last = 0;
    document.addEventListener("mousemove", e => {
        if (Date.now() - last < 90) return;
        last = Date.now();
        const p = document.createElement("div");
        p.className = "cursor-particle";
        p.style.left = e.clientX + "px";
        p.style.top = e.clientY + "px";
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 1600);
    });
}

/* ===== Text Glow ===== */
document.addEventListener("mousemove", e => {
    document.querySelectorAll(".glow-text").forEach(el => {
        const r = el.getBoundingClientRect();
        const d = Math.hypot(r.x + r.width / 2 - e.clientX, r.y + r.height / 2 - e.clientY);
        el.style.textShadow = d < 180
            ? "0 0 12px rgba(255,140,170,0.8)"
            : "none";
    });
});

/* =========================
   PARALLAX (LIMITED SCOPE)
========================= */

const parallaxElements = document.querySelectorAll(
    ".hero .parallax, .gallery-section .parallax"
);

window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;

    parallaxElements.forEach(el => {
        let speed = 0.15;

        if (el.classList.contains("slow")) speed = 0.1;
        if (el.classList.contains("medium")) speed = 0.30;
        if (el.classList.contains("fast")) speed = 0.38;

        el.style.transform = `translateY(${scrollY * speed}px)`;
    });
});


/* ===== Night Tint ===== */
const hour = new Date().getHours();
if (hour >= 19 || hour <= 5) document.body.classList.add("night");

// lazy-load using data-srcset and class 'lazy'
document.addEventListener('DOMContentLoaded', () => {
  const lazyImgs = document.querySelectorAll('img.lazy');

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const img = entry.target;
        const srcset = img.dataset.srcset;
        if (srcset) {
          img.setAttribute('srcset', srcset);
        }
        // optional: swap src to slightly larger one to prevent tiny pixelation
        img.src = img.src.replace('/w_400,', '/w_800,');
        img.classList.remove('lazy');
        obs.unobserve(img);
      });
    }, { rootMargin: '200px 0px' }); // preloads a bit before it enters viewport

    lazyImgs.forEach(img => io.observe(img));
  } else {
    // fallback: load all
    lazyImgs.forEach(img => {
      img.setAttribute('srcset', img.dataset.srcset);
      img.classList.remove('lazy');
    });
  }
});

window.addEventListener("load", () => {
  setTimeout(() => {
    window.dispatchEvent(new Event("resize"));
  }, 300);
});
