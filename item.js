// Get query params: goalId, quadrant, itemId
const params = new URLSearchParams(window.location.search);
const goalId = params.get("goalId");
const quadrant = params.get("quadrant");
const itemId = params.get("itemId");

// DOM elements
const itemTitle = document.getElementById("itemTitle");
const itemText = document.getElementById("itemText");
const saveBtn = document.getElementById("saveBtn");

// Load item
db.collection("goals")
  .doc(goalId)
  .collection(quadrant)
  .doc(itemId)
  .get()
  .then(doc => {
    if (doc.exists) {
      const data = doc.data();
      itemTitle.textContent = `${quadrant} Item`;
      itemText.value = data.text;
    }
  });

// Save changes
saveBtn.addEventListener("click", () => {
  const newText = itemText.value.trim();
  if (!newText) return alert("Item cannot be empty!");

  db.collection("goals")
    .doc(goalId)
    .collection(quadrant)
    .doc(itemId)
    .update({
      text: newText,
      updatedAt: Date.now()
    })
    .then(() => alert("Item saved!"))
    .catch(err => console.error(err));
});
