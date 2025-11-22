// Read ?id=xxx from URL
const params = new URLSearchParams(window.location.search);
const goalId = params.get("id");

const goalNameEl = document.getElementById("goalName");

// Load goal info
async function loadGoal() {
  const docSnap = await db.collection("goals").doc(goalId).get();

  if (!docSnap.exists) {
    goalNameEl.textContent = "Goal Not Found";
    return;
  }

  goalNameEl.textContent = docSnap.data().name;
}

loadGoal();

// Open items page
function openItems(type) {
  window.location.href = `items.html?goalId=${goalId}&type=${type}`;
}
