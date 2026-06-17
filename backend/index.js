const express = require("express");
const cors = require("cors");
const path = require("path");
const { initDb } = require("./db/database");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

app.use("/api/artists", require("./routes/artists"));
app.use("/api/gear", require("./routes/gear"));
app.use("/api/rig", require("./routes/rig"));

initDb();
app.listen(PORT, () => console.log(`Running on http://localhost:${PORT}`));
