export async function getArtists(name = "") {
  const res = await fetch(`/api/artists?name=${name}`);
  if (!res.ok) throw new Error(res.status);
  return res.json();
}

export async function getArtist(id) {
  const res = await fetch(`/api/artists/${id}`);
  if (!res.ok) throw new Error(res.status);
  return res.json();
}

export async function updateArtist(id, data) {
  const res = await fetch(`/api/artists/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(res.status);
  return res.json();
}

export async function deleteArtist(id) {
  const res = await fetch(`/api/artists/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(res.status);
}

export async function createArtist(data) {
  const res = await fetch("/api/artists", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(res.status);
  return res.json();
}
