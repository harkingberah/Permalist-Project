import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  password: "110594",
  database: "permalist",
  host: "localhost",
  port: 1154,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// let items = [
//   { id: 1, title: "Buy milk" },
//   { id: 2, title: "Finish homework" },
// ];

async function inputTitle() {
  const result = await db.query("SELECT * FROM items");
  return result.rows;
}

app.get("/", async(req, res) => {
  const items= await inputTitle();
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", (req, res) => {
  const item = req.body.newItem;
  // items.push({ title: item });
  db.query("INSERT INTO items (title) VALUES ($1)", [item]);
  res.redirect("/");
});

app.post("/edit", (req, res) => {
  const id = req.body.id;
  db.query("UPDATE items (title) VALUES ($1)",[id])
});

app.post("/delete", (req, res) => {});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
