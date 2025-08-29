// Start from js  here  id
function getElement(id) {
  const element = document.getElementById(id);
  return element;
}
function textOf(node) {
  return node ? String(node.textContent || node.innerText || "") : "";
}

// Defult state 
let hearts = 0;
let coins = 100;
let copies = 0;

// List of elements
const heartCountEl = getElement("heartCount");
const coinCountEl  = getElement("coinCount");
const copyCountEl  = getElement("copyCount");
const historyList  = getElement("history-list");
const historyEmpty = getElement("history-empty");
const cardsContainer = getElement("cards-container");
const clearBtn = getElement("btn-clear");
const copyCountBtn = getElement("copyCountBtn");

// check history overlays
function addHistory(name, number) {
  const li = document.createElement("li");
  li.className = "bg-white rounded-xl shadow p-4 flex justify-between";
  const time = new Date().toLocaleString();
  li.innerHTML =
    '<div>' +
      '<p class="font-semibold">' + name + '</p>' +
      '<p class="text-sm text-gray-500">' + number + '</p>' +
    '</div>' +
    '<span class="text-sm text-gray-400">' + time + '</span>';
  historyList.prepend(li);
  historyEmpty.classList.add("hidden");
}

// card sections overlays
function showCallPanel(card, title, number) {
  card.style.position = "relative"; //  overlay 

  const cover = document.createElement("div");
  cover.className = "absolute inset-0 rounded-2xl bg-black/30 grid place-items-center";
  const panel =
    '<div class="mx-6 w-full max-w-xs rounded-xl bg-white shadow-lg p-4 text-center">' +
      '<div class="text-green-600 text-lg font-semibold">📞 Calling...</div>' +
      '<div class="mt-1 text-sm text-gray-600">' + title + '</div>' +
      '<div class="mt-1 text-2xl font-bold text-gray-900">' + number + '</div>' +
    '</div>';
  cover.innerHTML = panel;
  card.appendChild(cover);

  setTimeout(function () {
    if (cover.parentNode) {
      cover.parentNode.removeChild(cover);
    }
  }, 1500);
}

function showMiniNote(card, message, isOk) {
  card.style.position = "relative";
  const note = document.createElement("div");
  note.className =
    "absolute top-3 right-3 rounded-lg px-3 py-2 text-xs shadow-md " +
    (isOk ? "bg-gray-900/90 text-white" : "bg-red-600 text-white");
  note.innerText = message;
  card.appendChild(note);
  setTimeout(function () {
    if (note.parentNode) {
      note.parentNode.removeChild(note);
    }
  }, 1100);
}

//   cards over
if (cardsContainer) {
  cardsContainer.addEventListener("click", function (e) {
    const card = e.target.closest("article.bg-white");
    if (!card) return;

    const name = textOf(card.querySelector("h3")) || "Service";
    const number = textOf(card.querySelector("p.mt-2"));

    // heart count sections
    if (e.target.closest(".btn-heart")) {
      hearts = hearts + 1;
      if (heartCountEl) heartCountEl.textContent = hearts;
      return;
    }

    // copy button 
    if (e.target.closest(".btn-copy")) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(number).then(function () {
          copies = copies + 1;
          if (copyCountEl) copyCountEl.textContent = copies;
          showMiniNote(card, "Copied " + name + ": " + number, true);
        });
      }
      return;
    }

    // for call coin alert
    if (e.target.closest(".btn-call")) {
      if (coins < 20) {
        showMiniNote(card, "you Need 20 coins to call !!!!", false);
        return;
      }
      coins = coins - 20;
      if (coinCountEl) coinCountEl.textContent = coins;

      showCallPanel(card, name, number);
      addHistory(name, number);
     
      return;
    }
  });
}

// For clear history  section
if (clearBtn) {
  clearBtn.addEventListener("click", function () {
    historyList.innerHTML = "";
    historyEmpty.classList.remove("hidden");
  });
}

// copy pill click 
if (copyCountBtn) {
  copyCountBtn.addEventListener("click", function () {
    copyCountBtn.classList.add("ring-2","ring-white/70");
    setTimeout(function () {
      copyCountBtn.classList.remove("ring-2","ring-white/70");
    }, 220);
  });
}
