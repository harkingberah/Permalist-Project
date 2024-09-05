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
  const newItem = req.body.newItem;

  db.query("UPDATE items SET  title = $1 WHERE id = $2", [req.body.newItem, id]);
  res.redirect("/");
});

app.post("/delete", (req, res) => {
  const id = req.body.id;
  console.log("Edit item ID:", id);
  db.query("DELETE FROM items WHERE id = $1", [id]);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
