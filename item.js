// Read URL parameters
const params = new URLSearchParams(window.location.search);
const goalId = params.get("goalId");
const type = params.get("type");

const pageTitle = document.getElementById("pageTitle");
const container = document.getElementById("itemsContainer");

// Map type → display text
const titleMap = {
  keep: "Keep",
  improve: "Improve",
  start: "Start",
  stop: "Stop"
};

pageTitle.textContent = `${titleMap[type]} Items`;

// Show add box
function showAddBox() {
  document.getElementById("addBox").classList.remove("hidden");
  document.getElementById("newItemInput").focus();
}

// Hide add box
function hideAddBox() {
  document.getElementById("addBox").classList.add("hidden");
  document.getElementById("newItemInput").value = "";
}

// Load items from Firestore
async function loadItems() {
  const snap = await db
    .collection("goals")
    .doc(goalId)
    .collection(type)
    .orderBy("createdAt", "asc")
    .get();

  container.innerHTML = "";

  snap.forEach(doc => {
    const data = doc.data();

    const div = document.createElement("div");
    div.className = "bg-white p-4 rounded-xl shadow";
    div.textContent = data.text;

    container.appendChild(div);
  });
}

loadItems();

// Add item to Firestore
async function addItem() {
  const text = document.getElementById("newItemInput").value.trim();
  if (!text) return;

  await db
    .collection("goals")
    .doc(goalId)
    .collection(type)
    .add({
      text,
      createdAt: Date.now()
    });

  hideAddBox();
  loadItems(); // reload list
}
