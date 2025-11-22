const goalList = document.getElementById("goalList");
const addBtn = document.getElementById("addGoalBtn");

// Load all goals
function loadGoals() {
  db.collection("goals").orderBy("createdAt", "desc").onSnapshot((snapshot) => {
    goalList.innerHTML = "";

    snapshot.forEach((doc) => {
      const goal = doc.data();

      const div = document.createElement("div");
      div.className =
        "bg-white p-4 rounded-lg shadow cursor-pointer hover:bg-gray-50";
      div.textContent = goal.name;

      div.addEventListener("click", () => {
        // Go to goal.html with goal ID
        window.location.href = `goal.html?id=${doc.id}`;
      });

      goalList.appendChild(div);
    });
  });
}

// Add goal
addBtn.addEventListener("click", async () => {
  const name = prompt("Goal name (Example: Lose Weight)");

  if (!name) return;

  await db.collection("goals").add({
    name: name,
    createdAt: Date.now(),
  });

  alert("Goal added!");
});

loadGoals();
