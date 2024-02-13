const express = require("express");
const fs = require("fs");
let users = require("./MOCK_DATA.json");

const app = express();
const PORT = 8000;

//MiddleWare
app.use(express.urlencoded({ extended: false })); // Form data body mein dalega

app.use((req, res, next) => {
  // Edit Req,Res Objects And after caling NEXT it will move to next function
  req.Myname = "SAIM";
  console.log("MiddleWare 1 Called");
  next();
});

app.use((req, res, next) => {
  // Edit Req,Res Objects And after caling NEXT it will move to next function
  console.log("MiddleWare 2 Called", req.Myname);
  next();
});
//Routes
app
  .route("/api/users/:id")
  .get((req, res) => {
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);
    if (!user) return res.status(404).json({ msg: "User Not Found" });
    return res.json(user);
  })
  .patch((req, res) => {
    users.map((user) => {
      return user.id === Number(req.params.id)
        ? ((user.first_name = req.body.first_name),
          (user.last_name = req.body.last_name),
          (user.email = req.body.email),
          (user.ip_address = req.body.ip_address),
          (user.gender = req.body.gender))
        : user;
    });
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
      if (err) console.log(err);
      return res.json({ status: "Success", id: req.params.id });
    });
  })
  .delete((req, res) => {
    const id = Number(req.params.id);
    users = users.filter((user) => user.id !== id);
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
      if (err) console.log(err);
      return res.json({ status: "Success", id: req.params.id });
    });
  });
app.get("/users", (req, res) => {
  const html = `<ul>${users
    .map((user) => `<li>${user.first_name}</li>`)
    .join("")}</ul>`;
  return res.send(html);
});

app.get("/api/users", (req, res) => {
  return res.json(users);
});

app.post("/api/users", (req, res) => {
  if (
    !req.body ||
    !req.body.first_name ||
    !req.body.last_name ||
    !req.body.gender ||
    !req.body.email ||
    !req.body.ip_address
  ) {
    res.status(400).json({ msg: "All Fields Req...." });
  }
  users.push({ ...req.body, id: users.length + 1 });
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
    if (err) console.log(err);
    return res.status(201).json({ status: "Success", id: users.length });
  });
});

app.listen(PORT, () => console.log(`Server Running at PORT ${PORT}`));
