import express from "express";

const port = 3000;
const app = express();

app.use(express.json());

app.use();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
