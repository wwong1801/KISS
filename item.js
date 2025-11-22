// 1️⃣ Get URL parameters
const params = new URLSearchParams(window.location.search);
const goalId = params.get("goalId");
const quadrant = params.get("quadrant");
const itemId = params.get("itemId");

// 2️⃣ DOM elements
const itemTitle = document.getElementById("itemTitle");
const itemContent = document.getElementById("itemContent");
const saveBtn = document.getElementById("saveBtn");
const deleteBtn = document.getElementById("deleteBtn");

// 3️⃣ Load the item from Firestore
db.collection("goals")
  .doc(goalId)
  .collection(quadrant)
  .doc(itemId)
  .get()
  .then((doc) => {
    if (doc.exists) {
      const data = doc.data();
      itemTitle.textContent = `${quadrant}: ${data.text}`;
      itemContent.value = data.text;
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

// 5️⃣ Delete item
deleteBtn.addEventListener("click", () => {
  if (!confirm("Are you sure you want to delete this item?")) return;

  db.collection("goals")
    .doc(goalId)
    .collection(quadrant)
    .doc(itemId)
    .delete()
    .then(() => {
      alert("Item deleted!");
      window.history.back();
    })
    .catch((err) => console.error(err));
});
