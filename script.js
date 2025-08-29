function getElement(id){ return document.getElementById(id); }

let hearts = 0;
let coins  = 100;
let copies = 0;

const heartCountEl = getElement("heartCount");
const coinCountEl  = getElement("coinCount");
const copyCountEl  = getElement("copyCount");
const historyList  = getElement("history-list");
const historyEmpty = getElement("history-empty");

// event delegation over all cards
document.getElementById("cards-container").addEventListener("click", async (e)=>{
  const card = e.target.closest("article.bg-white");
  if(!card) return;

  const name   = card.querySelector("h3").innerText.trim();
  const number = card.querySelector("p.mt-2").innerText.trim();

  // heart (outline; do NOT color; just count)
  if (e.target.closest(".btn-heart")) {
    hearts += 1;
    if (heartCountEl) heartCountEl.textContent = hearts;
    return;
  }

  // copy
  if (e.target.closest(".btn-copy")) {
    try {
      await navigator.clipboard.writeText(number);
      alert(`Copied ${name}: ${number}`);
      copies += 1;
      if (copyCountEl) copyCountEl.textContent = copies;
    } catch {
      alert("Copy failed");
    }
    return;
  }

  // call
  if (e.target.closest(".btn-call")) {
    if (coins < 20) {
      alert("Not enough coins (need 20). Please recharge to make a call.");
      return;
    }
    coins -= 20;
    if (coinCountEl) coinCountEl.textContent = coins;

    alert(`Calling ${name}: ${number}`);
    addHistory(name, number);
    // window.location.href = `tel:${number}`; // optional
  }
});

// clear history
document.getElementById("btn-clear").addEventListener("click", ()=>{
  historyList.innerHTML = "";
  historyEmpty.classList.remove("hidden");
});

function addHistory(name, number){
  const li = document.createElement("li");
  li.className = "bg-white rounded-xl shadow p-4 flex justify-between";
  const time = new Date().toLocaleTimeString();
  li.innerHTML = `
    <div>
      <p class="font-semibold">${name}</p>
      <p class="text-sm text-gray-500">${number}</p>
    </div>
    <span class="text-sm text-gray-400">${time}</span>
  `;
  historyList.prepend(li);
  historyEmpty.classList.add("hidden");
}

// navbar copy count button (optional UX)
const copyCountBtn = document.getElementById("copyCountBtn");
if (copyCountBtn) {
  copyCountBtn.addEventListener("click", () => {
    alert(`Total copied: ${copies}`);
  });
}
