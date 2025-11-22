const focusContainer = document.getElementById("focusContainer");

db.collection("focus").orderBy("createdAt", "desc").onSnapshot(snapshot => {
  focusContainer.innerHTML = ""; // clear previous
  snapshot.forEach(doc => {
    const item = doc.data();
    const div = document.createElement("div");
    div.className = "bg-white p-3 rounded shadow";
    div.innerHTML = `<strong>${item.goal} - ${item.type}:</strong> ${item.text}`;
    focusContainer.appendChild(div);
  });
});
