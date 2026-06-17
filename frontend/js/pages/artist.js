// js/pages/artist.js
import { getArtist } from "../api/artists.js";
import { getRigs } from "../api/rig.js";

var id = new URLSearchParams(window.location.search).get("id");

var artistHeader = document.getElementById("artist-header");
var rigSection = document.getElementById("rig-section");

async function loadPage() {
  if (!id) {
    artistHeader.innerHTML = "<p>Geen artiest gevonden.</p>";
    return;
  }

  try {
    var artist = await getArtist(id);
    var rigs = await getRigs(id);

    artistHeader.innerHTML = `
      <div class="artist-header">
        <img src="${artist.image_url || "https://placehold.co/200x200"}" alt="${artist.name}" class="artist-image" />
        <div class="artist-info">
          <span class="badge">${artist.genre || "Onbekend"}</span>
          <h1>${artist.name}</h1>
          <p>${artist.bio || ""}</p>
        </div>
      </div>
    `;

    if (rigs.length === 0) {
      rigSection.innerHTML = "<p>Geen gear gevonden voor deze artiest.</p>";
      return;
    }

    // group gear by type
    var guitars = [];
    var amps = [];
    var pedals = [];
    var strings = [];
    var other = [];

    for (var i = 0; i < rigs.length; i++) {
      var rig = rigs[i];
      if (rig.gear_type === "guitar") guitars.push(rig);
      else if (rig.gear_type === "amp") amps.push(rig);
      else if (rig.gear_type === "pedal") pedals.push(rig);
      else if (rig.gear_type === "strings") strings.push(rig);
      else other.push(rig);
    }

    var html = "";

    if (guitars.length > 0) html += buildSection("Gitaren", guitars);
    if (amps.length > 0) html += buildSection("Versterkers", amps);
    if (pedals.length > 0) html += buildSection("Pedalen", pedals);
    if (strings.length > 0) html += buildSection("Snaren", strings);
    if (other.length > 0) html += buildSection("Overig", other);

    rigSection.innerHTML = html;
  } catch (err) {
    console.log(err);
    artistHeader.innerHTML = "<p>Kon artiest niet laden.</p>";
  }
}

function buildSection(title, items) {
  var cards = "";
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    cards += `
      <div class="card">
        <img class="card-image" src="${item.gear_image || "https://placehold.co/400x300"}" alt="${item.gear_name}" />
        <div class="card-body">
          <h3>${item.gear_name}</h3>
          <p>${item.gear_brand}</p>
          ${item.note ? '<p class="gear-note">' + item.note + "</p>" : ""}
        </div>
      </div>
    `;
  }

  return `
    <div class="rig-section">
      <h3 class="rig-section-title">${title}</h3>
      <div class="gear-grid">${cards}</div>
    </div>
  `;
}

loadPage();
