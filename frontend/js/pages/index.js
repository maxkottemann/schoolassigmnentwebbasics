import { getArtists } from "../api/artists.js";

const grid = document.getElementById("artists-grid");
const search = document.getElementById("search");

async function load(name = "") {
  try {
    const artists = await getArtists(name);
    grid.innerHTML = artists
      .map(
        (artist) => `
     <div class="card">
  <img class="card-image" src="${artist.image_url || "img/placeholder.png"}" alt="${artist.name}" />
  <div class="card-body">
    <h3>${artist.name}</h3>
    <p>${artist.genre || "Onbekend genre"}</p>
    <a href="artist.html?id=${artist.id}">Rig bekijken →</a>
  </div>
</div>
    `,
      )
      .join("");
  } catch (err) {}
}

search.addEventListener("input", (e) => load(e.target.value));

load();
