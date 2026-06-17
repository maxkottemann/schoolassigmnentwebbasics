const express = require("express");
const { getDb } = require("../db/database");
const router = express.Router();

const db = getDb();

router.get("/", (req, res) => {
  const { artist_id } = req.query;

  try {
    let rigs;
    if (artist_id) {
      rigs = db
        .prepare(
          `
      SELECT rigs.*,
             artists.name as artist_name,
             gear.name as gear_name,
             gear.brand as gear_brand,
             gear.type as gear_type,
             gear.image_url as gear_image
      FROM rigs
      INNER JOIN artists ON artists.id = rigs.artist_id
      INNER JOIN gear ON gear.id = rigs.gear_id
      WHERE rigs.artist_id = ?
    `,
        )
        .all(artist_id);
    } else {
      rigs = db
        .prepare(
          `
      SELECT rigs.*,
             artists.name as artist_name,
             gear.name as gear_name,
             gear.brand as gear_brand,
             gear.type as gear_type,
             gear.image_url as gear_image
      FROM rigs
      INNER JOIN artists ON artists.id = rigs.artist_id
      INNER JOIN gear ON gear.id = rigs.gear_id
    `,
        )
        .all();
    }
    return res.json(rigs);
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
});

router.get("/:id", (req, res) => {
  const { id } = req.params;

  try {
    const rig = db.prepare(`SELECT * FROM rigs WHERE id = ?`).get(id);
    return res.status(200).json(rig);
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  try {
    const rig = db.prepare("SELECT * FROM rigs WHERE id = ?").get(id);
    if (!rig) return res.status(404).json({ error: "Rig not found" });

    db.prepare("DELETE FROM rigs WHERE id = ?").run(id);
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
});

router.post("/", (req, res) => {
  const { artist_id, gear_id, note } = req.body;

  if (!artist_id || !gear_id) {
    return res
      .status(400)
      .json({ error: "artist_id and gear_id are required" });
  }

  try {
    const queryRes = db
      .prepare("INSERT INTO rigs (artist_id, gear_id, note) VALUES (?,?,?)")
      .run(artist_id, gear_id, note || null);

    const rig = db
      .prepare("SELECT * FROM rigs WHERE id = ?")
      .get(queryRes.lastInsertRowid);
    return res.status(201).json(rig);
  } catch (error) {
    console.log(error.message);
    if (error.message.includes("UNIQUE")) {
      return res
        .status(409)
        .json({ error: "Gear already in this artists rig" });
    }
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
