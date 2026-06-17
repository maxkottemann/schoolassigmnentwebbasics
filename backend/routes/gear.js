const express = require("express");
const { getDb } = require("../db/database");
const router = express.Router();

const db = getDb();

router.get("/", (req, res) => {
  const { search = "", type } = req.query;
  const db = getDb();

  try {
    let query = "SELECT * FROM gear WHERE name LIKE ?";
    const params = [`%${search}%`];

    if (type) {
      query += " AND type = ?";
      params.push(type);
    }

    const gear = db.prepare(query).all(...params);
    res.json(gear);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/:id", (req, res) => {
  const { id } = req.params;

  try {
    const gear = db.prepare("SELECT * FROM gear WHERE id = ?").get(id);

    if (!gear) return res.status(404).json({ error: "Gear not found" });

    return res.status(200).json(gear);
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
});

router.post("/", (req, res) => {
  console.log(req.body);
  const { name, brand, type, description, image_url } = req.body;

  if (!name || !brand || !type) {
    return res.status(400).json({ error: "Name, brand and type are required" });
  }

  try {
    const queryRes = db
      .prepare(
        "INSERT INTO gear (name,brand,type,description,image_url) VALUES(?,?,?,?,?)",
      )
      .run(
        name,
        brand || null,
        type || null,
        description || null,
        image_url || null,
      );

    const gear = db
      .prepare("SELECT * FROM gear WHERE id = ?")
      .get(queryRes.lastInsertRowid);

    return res.status(201).json(gear);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  try {
    const gear = db.prepare("SELECT * FROM gear WHERE id = ?").get(id);
    if (!gear) return res.status(404).json({ error: "Gear not found" });

    db.prepare("DELETE FROM gear WHERE id = ?").run(id);

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
});

router.put("/:id", (req, res) => {
  const { name, brand, type, description, image_url } = req.body;
  const { id } = req.params;

  if (!name || !brand || !type) {
    return res.status(400).json({ error: "Name, brand and type are required" });
  }

  try {
    const gear = db.prepare("SELECT * FROM gear WHERE id = ?").get(id);
    if (!gear) return res.status(404).json({ error: "Gear not found" });

    db.prepare(
      "UPDATE gear SET name = ?, brand = ?, type = ?, description = ?, image_url = ? WHERE id = ?",
    ).run(name, brand, type, description || null, image_url || null, id);

    const updated = db.prepare("SELECT * FROM gear WHERE id = ?").get(id);

    return res.status(200).json(updated);
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
