// 1️⃣ Get goal ID from URL
const params = new URLSearchParams(window.location.search);
const goalId = params.get("id");

// 2️⃣ DOM elements
const keepList = document.getElementById("keepList");
const improveList = document.getElementById("improveList");
const startList = document.getElementById("startList");
const stopList = document.getElementById("stopList");

const addKeepBtn = document.getElementById("addKeepBtn");
const addImproveBtn = document.getElementById("addImproveBtn");
const addStartBtn = document.getElementById("addStartBtn");
const addStopBtn = document.getElementById("addStopBtn");

// 3️⃣ Load goal title
const goalTitle = document.getElementById("goalTitle");
db.collection("goals").doc(goalId).get().then(doc => {
  if (doc.exists) {
    goalTitle.textContent = doc.data().name;
  }
});

// 4️⃣ Function to load items from a quadrant
function loadQuadrant(quadrant, container) {
  db.collection("goals").doc(goalId).collection(quadrant).orderBy("createdAt", "desc")
    .onSnapshot(snapshot => {
      container.innerHTML = "";
      snapshot.forEach(doc => {
        const item = document.createElement("div");
        item.className = "bg-white p-2 rounded shadow cursor-move";
        item.textContent = doc.data().text;

        // ✅ Drag attributes
        item.setAttribute("draggable", true);
        item.setAttribute("data-id", doc.id);
        item.setAttribute("data-quadrant", quadrant);

        item.addEventListener("dragstart", drag);

        // Click to go to item page
        item.addEventListener("click", () => {
          window.location.href = `item.html?goalId=${goalId}&quadrant=${quadrant}&itemId=${doc.id}`;
        });

        container.appendChild(item);
      });
    });
}

// 5️⃣ Load all quadrants
["Keep", "Improve", "Start", "Stop"].forEach(q => {
  const container = { "Keep": keepList, "Improve": improveList, "Start": startList, "Stop": stopList }[q];
  loadQuadrant(q, container);
});

// 6️⃣ Add item function
function addItem(quadrant) {
  const text = prompt(`Add new ${quadrant} item:`);
  if (!text) return;

  db.collection("goals").doc(goalId).collection(quadrant).add({
    text: text,
    createdAt: Date.now()
  });
}

addKeepBtn.addEventListener("click", () => addItem("Keep"));
addImproveBtn.addEventListener("click", () => addItem("Improve"));
addStartBtn.addEventListener("click", () => addItem("Start"));
addStopBtn.addEventListener("click", () => addItem("Stop"));

// 7️⃣ Drag-and-drop functions
let draggedItemId = null;
let draggedFromQuadrant = null;

function drag(event) {
  draggedItemId = event.target.dataset.id;
  draggedFromQuadrant = event.target.dataset.quadrant;
  event.dataTransfer.effectAllowed = "move";
}

function allowDrop(event) {
  event.preventDefault();
}

function drop(event) {
  event.preventDefault();
  const targetQuadrant = event.currentTarget.id.replace("List", ""); // Keep/Improve/Start/Stop

  if (!draggedItemId || draggedFromQuadrant === targetQuadrant) return;

  // Move document in Firestore
  db.collection("goals").doc(goalId).collection(draggedFromQuadrant).doc(draggedItemId)
    .get().then(doc => {
      if (!doc.exists) return;

      const data = doc.data();

      // Add to new quadrant
      db.collection("goals").doc(goalId).collection(targetQuadrant).add({
        text: data.text,
        createdAt: Date.now()
      }).then(() => {
        // Delete from old quadrant
        db.collection("goals").doc(goalId).collection(draggedFromQuadrant).doc(draggedItemId).delete();
      });
    });

  draggedItemId = null;
  draggedFromQuadrant = null;
}
