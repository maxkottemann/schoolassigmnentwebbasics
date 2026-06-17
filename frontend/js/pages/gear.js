import { getGear } from "../api/gear.js";

var grid = document.getElementById("gear-grid");
var search = document.getElementById("search");
var typeFilter = document.getElementById("type-filter");

async function load() {
  var search = document.getElementById("search").value;
  var type = typeFilter.value;

  try {
    var gear = await getGear(search, type);

    if (gear.length === 0) {
      grid.innerHTML = "<p>Geen gear gevonden.</p>";
      return;
    }

    var cards = "";
    for (var i = 0; i < gear.length; i++) {
      var g = gear[i];
      cards += `
        <div class="card">
          <img class="card-image" src="${g.image_url || "https://placehold.co/400x300"}" alt="${g.name}" />
          <div class="card-body">
            <h3>${g.name}</h3>
            <p>${g.brand}</p>
            <span class="badge">${g.type}</span>
          </div>
        </div>
      `;
    }

    grid.innerHTML = cards;
  } catch (err) {
    console.log(err);
    grid.innerHTML = "<p>Kon gear niet laden.</p>";
  }
}

search.addEventListener("input", function () {
  load();
});

typeFilter.addEventListener("change", function () {
  load();
});

load();
