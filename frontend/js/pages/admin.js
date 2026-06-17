import {
  getArtists,
  createArtist,
  updateArtist,
  deleteArtist,
} from "../api/artists.js";
import { getGear, createGear, updateGear, deleteGear } from "../api/gear.js";
import { getRigs, createRig, deleteRig } from "../api/rig.js";

var modal = document.getElementById("modal");
var modalTitle = document.getElementById("modal-title");
var modalBody = document.getElementById("modal-body");
var modalClose = document.getElementById("modal-close");

function openModal(title, formHtml, onSubmit) {
  modalTitle.textContent = title;
  modalBody.innerHTML = formHtml;
  modal.classList.remove("hidden");

  var form = document.getElementById("modal-form");
  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    await onSubmit(e);
    closeModal();
  });
}

function closeModal() {
  modal.classList.add("hidden");
  modalBody.innerHTML = "";
}

modalClose.addEventListener("click", function () {
  closeModal();
});

modal.addEventListener("click", function (e) {
  if (e.target === modal) {
    closeModal();
  }
});

var tabArtists = document.getElementById("tab-artists");
var tabGear = document.getElementById("tab-gear");
var tabRigs = document.getElementById("tab-rigs");

var btnTabArtists = document.querySelector('[data-tab="artists"]');
var btnTabGear = document.querySelector('[data-tab="gear"]');
var btnTabRigs = document.querySelector('[data-tab="rigs"]');

function hideAllTabs() {
  tabArtists.classList.add("hidden");
  tabGear.classList.add("hidden");
  tabRigs.classList.add("hidden");
  btnTabArtists.classList.remove("active");
  btnTabGear.classList.remove("active");
  btnTabRigs.classList.remove("active");
}

btnTabArtists.addEventListener("click", function () {
  hideAllTabs();
  tabArtists.classList.remove("hidden");
  btnTabArtists.classList.add("active");
});

btnTabGear.addEventListener("click", function () {
  hideAllTabs();
  tabGear.classList.remove("hidden");
  btnTabGear.classList.add("active");
});

btnTabRigs.addEventListener("click", function () {
  hideAllTabs();
  tabRigs.classList.remove("hidden");
  btnTabRigs.classList.add("active");
});

async function loadArtists() {
  try {
    var artists = await getArtists();
    var list = document.getElementById("artists-list");

    if (artists.length === 0) {
      list.innerHTML = "<p>Geen artiesten gevonden.</p>";
      return;
    }

    var rows = "";
    for (var i = 0; i < artists.length; i++) {
      var a = artists[i];
      rows += "<tr>";
      rows += "<td>" + a.name + "</td>";
      rows += "<td>" + (a.genre || "-") + "</td>";
      rows += "<td>";
      rows +=
        '<button class="btn btn-sm" data-action="edit-artist" data-id="' +
        a.id +
        '">Bewerken</button>';
      rows +=
        '<button class="btn btn-danger btn-sm" data-action="delete-artist" data-id="' +
        a.id +
        '">Verwijderen</button>';
      rows += "</td></tr>";
    }

    list.innerHTML =
      '<div class="table-wrapper"><table class="table"><thead><tr><th>Naam</th><th>Genre</th><th>Acties</th></tr></thead><tbody>' +
      rows +
      "</tbody></table></div>";
  } catch (err) {
    console.log(err);
    document.getElementById("artists-list").innerHTML =
      "<p>Kon artiesten niet laden.</p>";
  }
}

function getArtistForm(artist) {
  var name = "";
  var genre = "";
  var bio = "";
  var imageUrl = "";

  if (artist) {
    name = artist.name;
    genre = artist.genre || "";
    bio = artist.bio || "";
    imageUrl = artist.image_url || "";
  }

  return `
    <form id="modal-form">
      <div class="form-group">
        <label>Naam *</label>
        <input name="name" type="text" value="${name}" required minlength="2" />
      </div>
      <div class="form-group">
        <label>Genre</label>
        <input name="genre" type="text" value="${genre}" />
      </div>
      <div class="form-group">
        <label>Bio</label>
        <textarea name="bio" rows="3">${bio}</textarea>
      </div>
      <div class="form-group">
        <label>Afbeelding URL</label>
        <input name="image_url" type="url" value="${imageUrl}" />
      </div>
      <div class="form-actions">
        <button type="button" class="btn btn-secondary" id="cancel-btn">Annuleren</button>
        <button type="submit" class="btn">Opslaan</button>
      </div>
    </form>
  `;
}

document
  .getElementById("btn-add-artist")
  .addEventListener("click", function () {
    openModal("Artiest toevoegen", getArtistForm(null), async function (e) {
      var name = e.target.name.value;
      var genre = e.target.genre.value;
      var bio = e.target.bio.value;
      var imageUrl = e.target.image_url.value;

      if (name === "") {
        alert("Naam is verplicht");
        return;
      }

      await createArtist({
        name: name,
        genre: genre,
        bio: bio,
        image_url: imageUrl,
      });
      loadArtists();
    });

    document
      .getElementById("cancel-btn")
      .addEventListener("click", function () {
        closeModal();
      });
  });

document
  .getElementById("artists-list")
  .addEventListener("click", async function (e) {
    var action = e.target.dataset.action;
    var id = e.target.dataset.id;

    if (action === "delete-artist") {
      var confirmed = confirm(
        "Weet je zeker dat je deze artiest wil verwijderen?",
      );
      if (!confirmed) return;
      await deleteArtist(id);
      loadArtists();
    }

    if (action === "edit-artist") {
      var artists = await getArtists();
      var artist = null;

      for (var i = 0; i < artists.length; i++) {
        if (artists[i].id == id) {
          artist = artists[i];
          break;
        }
      }

      openModal("Artiest bewerken", getArtistForm(artist), async function (e) {
        await updateArtist(id, {
          name: e.target.name.value,
          genre: e.target.genre.value,
          bio: e.target.bio.value,
          image_url: e.target.image_url.value,
        });
        loadArtists();
      });

      document
        .getElementById("cancel-btn")
        .addEventListener("click", function () {
          closeModal();
        });
    }
  });

async function loadGear() {
  try {
    var gear = await getGear();
    var list = document.getElementById("gear-list");

    if (gear.length === 0) {
      list.innerHTML = "<p>Geen gear gevonden.</p>";
      return;
    }

    var rows = "";
    for (var i = 0; i < gear.length; i++) {
      var g = gear[i];
      rows += "<tr>";
      rows += "<td>" + g.name + "</td>";
      rows += "<td>" + g.brand + "</td>";
      rows += '<td><span class="badge">' + g.type + "</span></td>";
      rows += "<td>";
      rows +=
        '<button class="btn btn-sm" data-action="edit-gear" data-id="' +
        g.id +
        '">Bewerken</button>';
      rows +=
        '<button class="btn btn-danger btn-sm" data-action="delete-gear" data-id="' +
        g.id +
        '">Verwijderen</button>';
      rows += "</td></tr>";
    }

    list.innerHTML =
      '<div class="table-wrapper"><table class="table"><thead><tr><th>Naam</th><th>Merk</th><th>Type</th><th>Acties</th></tr></thead><tbody>' +
      rows +
      "</tbody></table></div>";
  } catch (err) {
    console.log(err);
    document.getElementById("gear-list").innerHTML =
      "<p>Kon gear niet laden.</p>";
  }
}

function getGearForm(gear) {
  var name = "";
  var brand = "";
  var description = "";
  var imageUrl = "";

  if (gear) {
    name = gear.name;
    brand = gear.brand;
    description = gear.description || "";
    imageUrl = gear.image_url || "";
  }

  var types = ["gitaar", "versterker", "pedaal", "snaren", "overig"];
  var typeOptions = "";

  for (var i = 0; i < types.length; i++) {
    var selected = "";
    if (gear && gear.type === types[i]) {
      selected = "selected";
    }
    typeOptions +=
      '<option value="' +
      types[i] +
      '" ' +
      selected +
      ">" +
      types[i] +
      "</option>";
  }

  return `
    <form id="modal-form">
      <div class="form-group">
        <label>Naam *</label>
        <input name="name" type="text" value="${name}" required />
      </div>
      <div class="form-group">
        <label>Merk *</label>
        <input name="brand" type="text" value="${brand}" required />
      </div>
      <div class="form-group">
        <label>Type *</label>
        <select name="type" required>
          <option value="">Selecteer type</option>
          ${typeOptions}
        </select>
      </div>
      <div class="form-group">
        <label>Beschrijving</label>
        <textarea name="description" rows="2">${description}</textarea>
      </div>
      <div class="form-group">
        <label>Afbeelding URL</label>
        <input name="image_url" type="url" value="${imageUrl}" />
      </div>
      <div class="form-actions">
        <button type="button" id="cancel-btn" class="btn btn-secondary">Annuleren</button>
        <button type="submit" class="btn">Opslaan</button>
      </div>
    </form>
  `;
}

document.getElementById("btn-add-gear").addEventListener("click", function () {
  openModal("Gear toevoegen", getGearForm(null), async function (e) {
    await createGear({
      name: e.target.name.value,
      brand: e.target.brand.value,
      type: e.target.type.value,
      description: e.target.description.value,
      image_url: e.target.image_url.value,
    });
    loadGear();
  });

  document.getElementById("cancel-btn").addEventListener("click", function () {
    closeModal();
  });
});

document
  .getElementById("gear-list")
  .addEventListener("click", async function (e) {
    var action = e.target.dataset.action;
    var id = e.target.dataset.id;

    if (action === "delete-gear") {
      var confirmed = confirm(
        "Weet je zeker dat je deze gear wil verwijderen?",
      );
      if (!confirmed) return;
      await deleteGear(id);
      loadGear();
    }

    if (action === "edit-gear") {
      var gear = await getGear();
      var item = null;

      for (var i = 0; i < gear.length; i++) {
        if (gear[i].id == id) {
          item = gear[i];
          break;
        }
      }

      openModal("Gear bewerken", getGearForm(item), async function (e) {
        await updateGear(id, {
          name: e.target.name.value,
          brand: e.target.brand.value,
          type: e.target.type.value,
          description: e.target.description.value,
          image_url: e.target.image_url.value,
        });
        loadGear();
      });

      document
        .getElementById("cancel-btn")
        .addEventListener("click", function () {
          closeModal();
        });
    }
  });

async function loadRigs() {
  try {
    var rigs = await getRigs();
    var list = document.getElementById("rigs-list");

    if (rigs.length === 0) {
      list.innerHTML = "<p>Geen rigs gevonden.</p>";
      return;
    }

    var rows = "";
    for (var i = 0; i < rigs.length; i++) {
      var r = rigs[i];
      rows += "<tr>";
      rows += "<td>" + r.artist_name + "</td>";
      rows += "<td>" + r.gear_name + "</td>";
      rows += '<td><span class="badge">' + r.gear_type + "</span></td>";
      rows += "<td>" + (r.note || "-") + "</td>";
      rows +=
        '<td><button class="btn btn-danger btn-sm" data-action="delete-rig" data-id="' +
        r.id +
        '">Verwijderen</button></td>';
      rows += "</tr>";
    }

    list.innerHTML =
      '<div class="table-wrapper"><table class="table"><thead><tr><th>Artiest</th><th>Gear</th><th>Type</th><th>Notitie</th><th>Acties</th></tr></thead><tbody>' +
      rows +
      "</tbody></table></div>";
  } catch (err) {
    console.log(err);
    document.getElementById("rigs-list").innerHTML =
      "<p>Kon rigs niet laden.</p>";
  }
}

async function getRigForm() {
  var artists = await getArtists();
  var gear = await getGear();

  var artistOptions = "";
  for (var i = 0; i < artists.length; i++) {
    artistOptions +=
      '<option value="' + artists[i].id + '">' + artists[i].name + "</option>";
  }

  var gearOptions = "";
  for (var i = 0; i < gear.length; i++) {
    gearOptions +=
      '<option value="' +
      gear[i].id +
      '">' +
      gear[i].brand +
      " " +
      gear[i].name +
      "</option>";
  }

  return `
    <form id="modal-form">
      <div class="form-group">
        <label>Artiest *</label>
        <select name="artist_id" required>
          <option value="">Selecteer artiest</option>
          ${artistOptions}
        </select>
      </div>
      <div class="form-group">
        <label>Gear *</label>
        <select name="gear_id" required>
          <option value="">Selecteer gear</option>
          ${gearOptions}
        </select>
      </div>
      <div class="form-group">
        <label>Notitie</label>
        <input name="note" type="text" placeholder="bijv. Hoofd live gitaar" />
      </div>
      <div class="form-actions">
        <button type="button" id="cancel-btn" class="btn btn-secondary">Annuleren</button>
        <button type="submit" class="btn">Opslaan</button>
      </div>
    </form>
  `;
}

document
  .getElementById("btn-add-rig")
  .addEventListener("click", async function () {
    var form = await getRigForm();
    openModal("Rig toevoegen", form, async function (e) {
      await createRig({
        artist_id: e.target.artist_id.value,
        gear_id: e.target.gear_id.value,
        note: e.target.note.value,
      });
      loadRigs();
    });

    document
      .getElementById("cancel-btn")
      .addEventListener("click", function () {
        closeModal();
      });
  });

document
  .getElementById("rigs-list")
  .addEventListener("click", async function (e) {
    if (e.target.dataset.action === "delete-rig") {
      var confirmed = confirm("Wil je deze gear uit de rig verwijderen?");
      if (!confirmed) return;
      await deleteRig(e.target.dataset.id);
      loadRigs();
    }
  });

loadArtists();
loadGear();
loadRigs();
