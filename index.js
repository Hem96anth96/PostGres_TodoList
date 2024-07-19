import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "Postgres",
  port: 5432,
});

db.connect();

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));



app.get("/", async (req, res) => {

const result = await db.query("SELECT * FROM items order by id ASC");
const items = result.rows;

  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", async(req, res) => {

  const item = req.body.newItem;
  try {
    await db.query("INSERT INTO items (title) VALUES ($1)", [item]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.post("/edit", async (req, res) => {

  const updatedItem =req.body.updatedItemTitle;
  const idOfItem = req.body.updatedItemId;
  try {
    await db.query("update items set title = ($1) where id = ($2)", [updatedItem,idOfItem]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});


app.post("/delete",  async (req, res) => {

  const idOfItem = req.body.deleteItemId;

  try {
    await db.query("delete from items where id = ($1)", [idOfItem]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }

});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
