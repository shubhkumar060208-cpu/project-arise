const bootSound = document.getElementById("bootSound");
const clickSound = document.getElementById("clickSound");

function saveProgress() {
  const goals = {
    pushups: 100,
    situps: 100,
    squats: 100,
    running: 10
  };

  let completedToday = true;

  for (let goal in goals) {
    const inputEl = document.getElementById(goal);
    const check = document.getElementById(goal + "Check");

    if (!inputEl.value.trim()) {
      completedToday = false;
      check.textContent = "☐";
      continue;
    }

    const value = Number(inputEl.value);

    if (isNaN(value) || value < 0 || value > goals[goal]) {
      completedToday = false;
      check.textContent = "☐";
    } else {
      localStorage.setItem(goal, value);
      check.textContent = "✔";
    }
  }

  updateStreak(completedToday);
  updateStreakUI();

  localStorage.setItem("lastDailyReset", new Date().toDateString());
}

window.onload = function () {

  checkDailyReset();

  // Workout
  if (document.getElementById("pushups")) {
    document.getElementById("pushups").value = localStorage.getItem("pushups") || 0;
    document.getElementById("situps").value = localStorage.getItem("situps") || 0;
    document.getElementById("squats").value = localStorage.getItem("squats") || 0;
    document.getElementById("running").value = localStorage.getItem("running") || 0;
  }

  // Skills
  if (document.getElementById("coding")) {
    document.getElementById("coding").value = localStorage.getItem("coding") || 0;
    document.getElementById("reading").value = localStorage.getItem("reading") || 0;
    document.getElementById("meditation").value = localStorage.getItem("meditation") || 0;
    document.getElementById("discipline").value = localStorage.getItem("discipline") || 0;
  }

  // Experiences
  if (document.getElementById("experienceList")) {
    loadExperiences();
  }
  
};

//////////////////// experience.html    ////////////////////////////

function saveExperience() {
  let text = document.getElementById("experienceText").value;
  if (text.trim() === "") return;

  let date = new Date().toLocaleDateString();
  let experiences = JSON.parse(localStorage.getItem("experiences")) || [];

  experiences.push({ date: date, text: text });

  localStorage.setItem("experiences", JSON.stringify(experiences));

  localStorage.setItem("showExperiences", "true");

  document.getElementById("experienceText").value = "";
  loadExperiences();
}

let experiencesVisible = false;

function hideExperiences() {
  const container = document.getElementById("experienceList");
  if (!container) return;

  container.innerHTML = "";
}
function loadExperiences(forceShow = false) {
  let experiences = JSON.parse(localStorage.getItem("experiences")) || [];
  let container = document.getElementById("experienceList");

  if (!container) return;

  const show = forceShow || localStorage.getItem("showExperiences") === "true";

  if (!show) {
    container.innerHTML = "";
    return;
  }

  container.innerHTML = "";

  experiences.slice().reverse().forEach((exp, index) => {
    let realIndex = experiences.length - 1 - index;

    let div = document.createElement("div");
    div.className = "entry";

    div.innerHTML = `
      <strong>${exp.date}</strong><br>
      ${exp.text}
      <br>
      <button class="delete-btn" onclick="deleteExperience(${realIndex})">
        DELETE
      </button>
    `;

    container.appendChild(div);
  });
}
function deleteExperience(index) {
  let experiences = JSON.parse(localStorage.getItem("experiences")) || [];

  if (confirm("Delete this experience?")) {
    experiences.splice(index, 1);
    localStorage.setItem("experiences", JSON.stringify(experiences));

    // 🔥 Force re-render
    loadExperiences(true);
  }
}


function playClick() {
  if (clickSound) {
    clickSound.currentTime = 0;
    clickSound.play().catch(() => {});
  }
}

window.addEventListener("DOMContentLoaded", () => {

  // Boot sound (first user interaction)
  document.body.addEventListener("click", () => {
    if (bootSound && bootSound.paused) {
      bootSound.currentTime = 0;
      bootSound.play().catch(() => {});
    }
  }, { once: true });

  // Click sound + optional navigation
  document.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => {

      // 🔊 Play click sound
      if (clickSound) {
        clickSound.currentTime = 0;
        clickSound.play().catch(() => {});
      }

      // ⏳ Navigate AFTER sound finishes
      const link = btn.dataset.link;
      if (link) {
        setTimeout(() => {
          window.location.href = link;
        }, 400); // sound-safe delay
      }
      const updateBtn = document.getElementById("updatebtn");
      if (updateBtn) {
      updateBtn.addEventListener("click", saveProgress);
}
    });
  });
      const toggleBtn = document.getElementById("toggleExperiences");

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      experiencesVisible = !experiencesVisible;

      if (experiencesVisible) {
        toggleBtn.textContent = "HIDE LOGS";
        loadExperiences(true);
      } else {
        toggleBtn.textContent = "SHOW LOGS";
        hideExperiences();
      }
    });
  }
});

function saveSkills() {
  localStorage.setItem("coding", document.getElementById("coding").value);
  localStorage.setItem("reading", document.getElementById("reading").value);
  localStorage.setItem("meditation", document.getElementById("meditation").value);
  localStorage.setItem("discipline", document.getElementById("discipline").value);
}


window.addEventListener("beforeunload", () => {
  localStorage.setItem("showExperiences", "false");
});

///  reset daily goals function  //////
function checkDailyReset() {
  const lastReset = localStorage.getItem("lastDailyReset");
  const today = new Date().toDateString();

  if (lastReset !== today) {
    // Reset daily goals
    ["pushups", "situps", "squats", "running"].forEach(goal => {
      localStorage.setItem(goal, 0);
    });
    ["coding", "reading", "meditation", "discipline"].forEach(goal => {
      localStorage.setItem(goal, 0);
    });

    localStorage.setItem("lastDailyReset", today);
  }
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");

}

