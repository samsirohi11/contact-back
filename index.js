const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

let contacts = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.use(cors());

app.use(express.json());

morgan.token("data", function (req, res) {
  return JSON.stringify(req.body);
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :data")
);

const defaultRoute = (req, res) => {
  const endpoint = req.path;
  res.status(404).send(`<p>endpoint ${endpoint} unknown</p>`);
};

app.get("/info", (req, res) => {
  const date = new Date();
  res.send(`<p>Phonebook got ${contacts.length} people <br/> ${date}</p>`);
});

app.get("/api/persons", (req, res) => {
  res.json(contacts);
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = contacts.find((c) => c.id == id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).json({ error: "person not found" });
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  contacts = contacts.filter((c) => c.id !== id);
  res.json(contacts);
});

app.put("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = req.body;
  contacts = contacts.map((c) => (c.id !== id ? c : person));
  res.json(contacts);
});

const generatedID = () => {
  return String(Math.floor(Math.random() * 1000000000));
};

app.post("/api/persons/", (req, res) => {
  const body = req.body;
  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "name and / or number missing",
    });
  }
  if (contacts.find((c) => c.name === body.name)) {
    return res.status(400).json({
      error: "name already exists",
    });
  }

  const contact = {
    name: body.name,
    number: body.number,
    id: generatedID(),
  };

  contacts = contacts.concat(contact);
  res.json(contact);
});

app.use(defaultRoute);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`server started on PORT: ${PORT}`);
});
