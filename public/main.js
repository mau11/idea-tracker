document.querySelectorAll(".delete-icon").forEach((icon) => {
  if (icon.classList.contains("idea")) {
    icon.addEventListener("click", handleDeleteIdea);
  } else {
    icon.addEventListener("click", handleDeleteList);
  }
});

function handleDeleteIdea(e) {
  if (!confirm("Are you sure you want to delete this idea?")) {
    return;
  }

  const ideaId = e.target.id.split("-")[1];

  fetch(`/idea/${ideaId}/delete`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: ideaId,
    }),
  })
    .then((response) => {
      if (response.ok) return response.json();
      throw new Error("Delete failed");
    })
    .then(() => window.location.reload())
    .catch((error) => {
      console.error("Error:", error);
      alert("Failed to delete idea");
    });
}

function handleDeleteList(e) {
  if (!confirm("Are you sure you want to delete this list?")) {
    return;
  }

  const listId = e.target.id.split("-")[1];

  fetch(`/list/${listId}/delete`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: listId,
    }),
  })
    .then((response) => {
      if (response.ok) return response.json();
      throw new Error("Delete failed");
    })
    .then(() => (window.location.href = "/dashboard"))
    .catch((error) => {
      console.error("Error:", error);
      alert("Failed to delete list");
    });
}
