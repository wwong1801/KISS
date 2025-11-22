const focusContainer = document.getElementById("focusContainer");

// Example focus data (later we can load from Firebase)
const focusItems = [
  { goal: "Exercise", type: "Keep", text: "Increase exercise from 5 mins to 10 mins" },
  { goal: "Lose Weight", type: "Stop", text: "Go to super market" }
];

// Render focus items
focusItems.forEach(item => {
  const div = document.createElement("div");
  div.className = "bg-white p-3 rounded shadow";
  div.innerHTML = `<strong>${item.goal} - ${item.type}:</strong> ${item.text}`;
  focusContainer.appendChild(div);
});
