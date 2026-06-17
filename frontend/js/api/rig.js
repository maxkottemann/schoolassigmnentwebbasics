export async function getRigs(artist_id = "") {
  const url = artist_id ? `/api/rig?artist_id=${artist_id}` : "/api/rig";
  const res = await fetch(url);
  if (!res.ok) throw new Error(res.status);
  return res.json();
}

export async function createRig(data) {
  const res = await fetch("/api/rig", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(res.status);
  return res.json();
}

export async function deleteRig(id) {
  const res = await fetch(`/api/rig/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(res.status);
}
