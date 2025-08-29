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
// check history 
function addHistory(name, number) {
  if (!historyList) return;
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
  if (historyEmpty) historyEmpty.classList.add("hidden");
}

// card sections overlays
function showCallPanel(card, title, number) {
  let host = document.getElementById("top-call-alert");
  if (!host) {
    host = document.createElement("div");
    host.id = "top-call-alert";
    host.className = "fixed top-4 left-0 right-0 z-[9999] flex justify-center pointer-events-none";
    document.body.appendChild(host);
  }

  // Alert  Ok button
  host.innerHTML =
    '<div class="pointer-events-auto rounded-xl bg-white shadow-lg ring-1 ring-black/5 px-4 py-3 text-center">' +
      '<div class="text-green-600 text-sm font-semibold">📞 Calling...</div>' +
      '<div class="mt-0.5 text-xl text-gray-600">' + title + '</div>' +
      '<div class="mt-0.5 text-2xl font-bold text-gray-900">' + number + '</div>' +
      '<button id="alert-ok-btn" class="mt-3 bg-green-600 text-white px-4 py-1.5 rounded-lg hover:bg-green-700">OK</button>' +
    '</div>';

  host.style.display = "flex";

  // Ensure only one timer
  clearTimeout(showCallPanel._t);
  showCallPanel._t = setTimeout(function () {
    host.style.display = "none";
    host.innerHTML = "";
  }, 2500);

  // OK button click 
  const okBtn = document.getElementById("alert-ok-btn");
  if (okBtn) {
    okBtn.addEventListener("click", function () {
      host.style.display = "none";
      host.innerHTML = "";
      clearTimeout(showCallPanel._t);
    });
  }
}


function showMiniNote(card, message, isOk) {
  if (!card) return;
  const hadPosition = card.style.position && card.style.position.length > 0;
  if (!hadPosition) card.style.position = "relative";
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
    if (!hadPosition) card.style.position = "";
  }, 1100);
}

// copy successfully
function showCopyAlert(message) {
  var host = document.getElementById("top-copy-alert");
  if (!host) {
    host = document.createElement("div");
    host.id = "top-copy-alert";
    host.className = "fixed inset-x-0 top-4 z-[99999] flex justify-center pointer-events-none";
    document.body.appendChild(host);
  }

  host.innerHTML =
    '<div class="pointer-events-auto rounded-xl bg-white shadow-lg ring-1 ring-black/5 px-4 py-2 text-center">' +
      '<div class="text-sm font-semibold text-emerald-700">✅ Copy Succesfully ...!!</div>' +
      '<div class="text-xs text-gray-600 mt-0.5">' + (message || "") + '</div>' +
    '</div>';

  host.style.display = "flex";

  clearTimeout(showCopyAlert._t);
  showCopyAlert._t = setTimeout(function () {
    host.style.display = "none";
    host.innerHTML = "";
  }, 1800);
}

//   cards over
if (cardsContainer) {
  cardsContainer.addEventListener("click", function (e) {
    const card = e.target.closest("article.bg-white");
    if (!card) return;

    const name = textOf(card.querySelector("h3")) || "Service";
    const numberEl = card.querySelector("p.mt-2");
    const number = textOf(numberEl);

    // heart count sections
    if (e.target.closest(".btn-heart")) {
      hearts = hearts + 1;
      if (heartCountEl) heartCountEl.textContent = hearts;
      return;
    }

    // copy button 
    if (e.target.closest(".btn-copy")) {
      if (number && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(number).then(function () {
          copies = copies + 1;
          if (copyCountEl) copyCountEl.textContent = copies;

          showCopyAlert('You can paste it anywhere now (' + number + ').');

          showMiniNote(card, "Copied " + name + ": " + number, true);
        }, function () {
          showMiniNote(card, "Clipboard blocked", false);
        });
      } else {
        showMiniNote(card, "Clipboard unavailable", false);
      }
      return;
    }

    // for call coin alert
    if (e.target.closest(".btn-call")) {
      if (coins < 20) {
        showMiniNote(card, "You Need  at least 20 coins to call.....!!!!", false);
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
    if (historyList) historyList.innerHTML = "";
    if (historyEmpty) historyEmpty.classList.remove("hidden");
  });
}

// copy  click 
if (copyCountBtn) {
  copyCountBtn.addEventListener("click", function () {
    copyCountBtn.classList.add("ring-2","ring-white/70");
    setTimeout(function () {
      copyCountBtn.classList.remove("ring-2","ring-white/70");
    }, 220);
  });
}
