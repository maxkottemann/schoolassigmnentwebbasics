export async function getGear(search = "", type = "") {
  var url = "/api/gear?search=" + search;
  if (type) url += "&type=" + type;
  const res = await fetch(url);
  if (!res.ok) throw new Error(res.status);
  return res.json();
}
export async function createGear(data) {
  const res = await fetch("/api/gear", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(res.status);
  return res.json();
}

export async function updateGear(id, data) {
  const res = await fetch(`/api/gear/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(res.status);
  return res.json();
}

export async function deleteGear(id) {
  const res = await fetch(`/api/gear/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(res.status);
}
