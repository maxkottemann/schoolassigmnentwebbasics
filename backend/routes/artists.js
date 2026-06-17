const express = require("express");
const { getDb } = require("../db/database");
const router = express.Router();

const db = getDb();

router.get("/", (req, res) => {
  const { name = "", genre } = req.query;

  let query = "SELECT * FROM artists WHERE name LIKE ?";
  const params = [`%${name}%`];

  if (genre) {
    query += " AND genre = ?";
    params.push(genre);
  }

  try {
    const artists = db.prepare(query).all(...params);
    return res.json(artists);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  try {
    const artist = db.prepare(`SELECT * FROM artists WHERE id = ?`).get(id);

    if (!artist) return res.status(404).json({ error: "Artist not found" });

    return res.status(200).json(artist);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/", (req, res) => {
  const { name, genre, bio, image_url } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name cannot be blank" });
  }

  try {
    const queryRes = db
      .prepare(
        `INSERT INTO artists (name, genre, bio, image_url) VALUES (?,?,?,?)`,
      )
      .run(name, genre || null, bio || null, image_url || null);

    const artist = db
      .prepare("SELECT * FROM artists WHERE id = ?")
      .get(queryRes.lastInsertRowid);

    return res.status(201).json(artist);
  } catch (error) {
    return res.status("500").json({ error: "Server error" });
  }
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  try {
    const artist = db.prepare("SELECT * FROM artists WHERE id = ?").get(id);
    if (!artist) return res.status(404).json({ error: "Artist not found" });

    db.prepare("DELETE FROM artists WHERE id = ?").run(id);

    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { name, genre, bio, image_url } = req.body;

  try {
    const artist = db.prepare("SELECT * FROM artists WHERE id = ?").get(id);
    if (!artist) return res.status(404).json({ error: "Artist not found" });

    db.prepare(
      "UPDATE artists SET name = ?, genre = ?, bio = ?, image_url = ? WHERE id = ?",
    ).run(name, genre || null, bio || null, image_url || null, id);

    const updated = db.prepare("SELECT * FROM artists WHERE id = ?").get(id);

    return res.status(200).json(updated);
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
});
module.exports = router;
