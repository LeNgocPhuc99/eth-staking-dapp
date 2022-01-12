const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.static("src"));

app.get("*", (req, res) => {
  res.sendFile(`${__dirname}/src/index.html`);
});

app.listen(PORT, () => {
  console.log(`Ethereum Dapp running on port ${PORT}`);
});
