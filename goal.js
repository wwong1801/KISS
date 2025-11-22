// Get goal ID from URL
const params = new URLSearchParams(window.location.search);
const goalId = params.get("id");

// DOM elements
const goalTitle = document.getElementById("goalTitle");
const keepList = document.getElementById("keepList");
const improveList = document.getElementById("improveList");
const startList = document.getElementById("startList");
const stopList = document.getElementById("stopList");

const addKeepBtn = document.getElementById("addKeepBtn");
const addImproveBtn = document.getElementById("addImproveBtn");
const addStartBtn = document.getElementById("addStartBtn");
const addStopBtn = document.getElementById("addStopBtn");

// Load goal title
db.collection("goals").doc(goalId).get().then(doc => {
  if (doc.exists) {
    goalTitle.textContent = doc.data().name;
  }
});

// Function to load items from a quadrant
function loadQuadrant(quadrant, container) {
  db.collection("goals").doc(goalId).collection(quadrant).orderBy("createdAt", "desc")
    .onSnapshot(snapshot => {
      container.innerHTML = "";
      snapshot.forEach(doc => {
        const item = document.createElement("div");
        item.className = "bg-white p-2 rounded shadow cursor-pointer hover:bg-gray-50";
        item.textContent = doc.data().text;
        
        // ✅ Add click to go to Item page
        item.addEventListener("click", () => {
          window.location.href = `item.html?goalId=${goalId}&quadrant=${quadrant}&itemId=${doc.id}`;
        });
        
        container.appendChild(item);
      });
    });
}

// Load all quadrants
["Keep","Improve","Start","Stop"].forEach(q => {
  const container = {
    "Keep": keepList,
    "Improve": improveList,
    "Start": startList,
    "Stop": stopList
  }[q];
  loadQuadrant(q, container);
});

// Function to add item
function addItem(quadrant) {
  const text = prompt(`Add new ${quadrant} item:`);
  if (!text) return;

  db.collection("goals").doc(goalId).collection(quadrant).add({
    text: text,
    createdAt: Date.now()
  });
}

// Add event listeners
addKeepBtn.addEventListener("click", () => addItem("Keep"));
addImproveBtn.addEventListener("click", () => addItem("Improve"));
addStartBtn.addEventListener("click", () => addItem("Start"));
addStopBtn.addEventListener("click", () => addItem("Stop"));
