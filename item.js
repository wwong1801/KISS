// 1️⃣ Get URL parameters
const params = new URLSearchParams(window.location.search);
const goalId = params.get("goalId");
const quadrant = params.get("quadrant");
const itemId = params.get("itemId");

// 2️⃣ DOM elements
const itemTitle = document.getElementById("itemTitle"); // Create this in HTML
const itemContent = document.getElementById("itemContent"); // Create a textarea or div in HTML
const saveBtn = document.getElementById("saveBtn"); // Create a button in HTML
const deleteBtn = document.getElementById("deleteBtn"); // Optional

// 3️⃣ Load the item from Firestore
db.collection("goals")
  .doc(goalId)
  .collection(quadrant)
  .doc(itemId)
  .get()
  .then((doc) => {
    if (doc.exists) {
      const data = doc.data();
      itemTitle.textContent = `${quadrant}: ${data.text}`; // title
      itemContent.value = data.text; // if using textarea
    } else {
      alert("Item not found!");
    }
  })
  .catch((err) => console.error(err));

// 4️⃣ Save changes
saveBtn.addEventListener("click", () => {
  const newText = itemContent.value.trim();
  if (!newText) return;

  db.collection("goals")
    .doc(goalId)
    .collection(quadrant)
    .doc(itemId)
    .update({
      text: newText,
      updatedAt: Date.now(),
    })
    .then(() => alert("Item updated!"))
    .catch((err) => console.error(err));
});

// 5️⃣ Optional: Delete item
deleteBtn.addEventListener("click", () => {
  if (!confirm("Are you sure you want to delete this item?")) return;

  db.collection("goals")
    .doc(goalId)
    .collection(quadrant)
    .doc(itemId)
    .delete()
    .then(() => {
      alert("Item deleted!");
      window.history.back(); // Go back to goal page
    })
    .catch((err) => console.error(err));
});
