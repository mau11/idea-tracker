document.querySelectorAll(".delete-icon").forEach((icon) => {
  icon.addEventListener("click", handleDelete);
});

function handleDelete(e) {
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
    .then((data) => {
      console.log(data);
      window.location.href = "/dashboard";
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Failed to delete list");
    });
}
