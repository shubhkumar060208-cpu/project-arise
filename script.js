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

    if (!inputEl || !check) continue;
    
    if (inputEl.value === "") {
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
  if (completedToday) {
  showDisiplineEarned();
}

  updateStreakUI();

 if (completedToday) {
  localStorage.setItem("lastDailyReset", new Date().toDateString());
}
}

window.onload = function () {
  
  scheduleTimedReminder(17, 14); // 9:00 PM

  scheduleDailyReminder();
  requestNotificationPermission();
  
  checkDailyReset();

  // Workout
 if (document.getElementById("pushups")) {
  ["pushups", "situps", "squats", "running"].forEach(id => {
    const saved = localStorage.getItem(id);
    if (saved !== null) {
      document.getElementById(id).value = saved;
    }
  });
}

  // Skills
 if (document.getElementById("coding")) {
  ["coding", "reading", "meditation", "discipline"].forEach(id => {
    const saved = localStorage.getItem(id);
    if (saved !== null) {
      document.getElementById(id).value = saved;
    }
  });
}

  // Experiences
  if (document.getElementById("experienceList")) {
    loadExperiences();
  }
  
};

//////////////////// experience.html    ////////////////////////////

function saveExperience() {
  const input = document.getElementById("experienceText");
  if (!input) return
  let text = input.value;  

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

    if (clickSound) {
      clickSound.currentTime = 0;
      clickSound.play().catch(() => {});
    }

    const link = btn.dataset.link;
    if (link) {
      setTimeout(() => {
        window.location.href = link;
      }, 400);
    }

  });
});

const updateBtn = document.getElementById("updatebtn");
if (updateBtn) {
  updateBtn.addEventListener("click", saveProgress);
}
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
  const now = new Date();

  if (!lastReset) {
    localStorage.setItem("lastDailyReset", now.toDateString());
    return;
  }

  const last = new Date(lastReset);

  // Reset ONLY if a NEW DAY has actually started
  if (now.getDate() !== last.getDate() ||
      now.getMonth() !== last.getMonth() ||
      now.getFullYear() !== last.getFullYear()) {

    ["pushups", "situps", "squats", "running"].forEach(goal => {
      localStorage.setItem(goal);
    });

    localStorage.setItem("lastDailyReset", now.toDateString());
  }
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");

}

function showDisciplineEarned() {
  const overlay = document.getElementById("disciplineOverlay");
  if (!overlay) return;
  overlay.classList.add("show");

  setTimeout(() => {
    overlay.classList.remove("show");
  }, 1800);
}

// ================= VOICE INPUT =================

const voiceBtn = document.getElementById("voiceBtn");

if (voiceBtn) {
  voiceBtn.addEventListener("click", startVoiceInput);
}

function startVoiceInput() {
  if (!("webkitSpeechRecognition" in window)) {
    return;
  }

  const recognition = new webkitSpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.start();

  recognition.onresult = function (event) {
    const text = event.results[0][0].transcript.toLowerCase();
    console.log("Voice:", text);
    parseVoiceInput(text);
  };

  recognition.onerror = function () {
   return;
  };
}

function parseVoiceInput(text) {
  const exercises = {
    pushups: ["pushup", "push-ups", "push ups"],
    situps: ["situp", "sit-ups", "sit ups"],
    squats: ["squat", "squats"],
    running: ["run", "running"]
  };

  for (let field in exercises) {
    exercises[field].forEach(keyword => {
      const regex = new RegExp("(\\d+)\\s*" + keyword);
      const match = text.match(regex);

      if (match && document.getElementById(field)) {
        document.getElementById(field).value = match[1];
      }
    });
  }
}

//////////////////// voice input for skils//////////////////////

const skillsVoiceBtn = document.getElementById("skillsVoiceBtn");

if (skillsVoiceBtn) {
skillsVoiceBtn.addEventListener("click", () => {
  if (document.getElementById("coding")) {
    startSkillsVoiceInput();   // skills page
  } else if (document.getElementById("pushups")) {
    startVoiceInput();         // quest page
  }
});
}

function startSkillsVoiceInput() {
  if (!("webkitSpeechRecognition" in window)) {
    return;
  }

  const recognition = new webkitSpeechRecognition();
  recognition.lang = "en-US";
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.start();

  recognition.onresult = (event) => {
    const text = event.results[0][0].transcript.toLowerCase();
    console.log("Voice:", text);

    applySkillVoice(text);
  };
}

/////////////////////////   smart skill parser  //////////////////////////////////////////////
const numberWords = {
  zero: 0,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  eleven: 11,
  twelve: 12,
  fifteen: 15,
  twenty: 20,
  thirty: 30,
  forty: 40,
  fifty: 50
};

function applySkillVoice(text) {
  const skills = {
    coding: ["coding", "code"],
    reading: ["reading", "read"],
    meditation: ["meditation", "meditate"],
    discipline: ["discipline"]
  };

  // Convert number words to digits
  Object.keys(numberWords).forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, "g");
    text = text.replace(regex, numberWords[word]);
  });

  for (let skill in skills) {
    for (let keyword of skills[skill]) {
      const regex = new RegExp(`(\\d+)\\s*${keyword}|${keyword}\\s*(\\d+)`);
      const match = text.match(regex);

      if (match) {
        const value = match[1] || match[2];
        const input = document.getElementById(skill);
        if (input) {
          input.value = value;
        }
      }
    }
  }
}



////////////////////   voice input for experience //////////////////

let experienceRecognition;
let silenceTimer;
const SILENCE_LIMIT = 2000; // 2 seconds

const experienceVoiceBtn = document.getElementById("experienceVoiceBtn");

if (experienceVoiceBtn) {
  experienceVoiceBtn.addEventListener("click", startExperienceVoice);
}

function startExperienceVoiceInput() {
  if (!("webkitSpeechRecognition" in window)) {
    return;
  }

  const recognition = new webkitSpeechRecognition();
  recognition.lang = "en-US";
  recognition.start();

  recognition.onresult = (event) => {
    document.getElementById("experienceText").value =
      event.results[0][0].transcript;
  };
}

function startExperienceVoice() {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    return;
  }

  experienceRecognition = new SpeechRecognition();
  experienceRecognition.lang = "en-US";
  experienceRecognition.continuous = true;
  experienceRecognition.interimResults = false;

  let finalText = "";

  experienceRecognition.onresult = (event) => {
    const lastResult = event.results[event.results.length - 1][0].transcript;
    finalText += lastResult + " ";

    document.getElementById("experienceText").value = finalText;

    // 🔁 Reset silence timer every time user speaks
    clearTimeout(silenceTimer);
    silenceTimer = setTimeout(() => {
      stopExperienceVoice(finalText);
    }, SILENCE_LIMIT);
  };

  experienceRecognition.onerror = (e) => {
    console.error("Voice error:", e);
  };

  experienceRecognition.start();
}


function stopExperienceVoice(text) {
  if (experienceRecognition) {
    experienceRecognition.stop();
  }

  if (text.trim().length > 0) {
    saveExperience(); // your existing function
  }
}



////////////////////////////  notifications  ////////////////////////////////////////

function requestNotificationPermission() {
  if (!("Notification" in window)) {
    return;
  }

  if (Notification.permission === "default") {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        console.log("Notifications enabled");
      }
    });
  }
}

function showDailyNotification() {
  if (Notification.permission !== "granted") return;

  navigator.serviceWorker.ready.then(registration => {
    registration.showNotification("ARISE ⚔️", {
      body: "Daily quest awaits. Discipline decides your future.",
      icon: "icons/icon-192.png",
      badge: "icons/icon-192.png",
      vibrate: [100, 50, 100],
      tag: "daily-reminder",
      renotify: true
    });
  });
}

function scheduleDailyReminder() {
  const lastNotified = localStorage.getItem("lastNotificationDate");
  const today = new Date().toDateString();

  if (lastNotified !== today) {
    showDailyNotification();
    localStorage.setItem("lastNotificationDate", today);
  }
}

function scheduleTimedReminder(hour = 9, minute = 0) {
  const now = new Date();
  const today = now.toDateString();
  const lastNotified = localStorage.getItem("lastNotificationDate");

  const targetTime = new Date();
  targetTime.setHours(hour, minute, 0, 0);

  if (now >= targetTime && lastNotified !== today) {
    showDailyNotification();
    localStorage.setItem("lastNotificationDate", today);
  }
}

//  -----  skills save input function call ----- //

["coding", "reading", "meditation", "discipline"].forEach(id => {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener("change", saveSkills);
  }
});










