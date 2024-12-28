require("dotenv").config();
const expresss = require("express");

const app = expresss();

app.use(expresss.json());
app.use(require("morgan")("dev"));
let isLoggedIn;
const jwt = require("jsonwebtoken");
const JWT = process.env.JWT;
const authenticate = async ({ username, password }) => {
  if (username != undefined && password != undefined) {
    const token = await jwt.sign({ username: username }, JWT);
    isLoggedIn = token;
    return token;
  }
};

app.post("/api/auth/register", async (req, res, next) => {
  try {
    res.status(201).send("Account has been created");
  } catch (error) {
    next(error);
  }
});
app.post("/api/auth/login", async (req, res, next) => {
  try {
    const response = await authenticate(req.body);
    if (response) {
      res.send("User successfully LoggedIn");
    } else {
      res.send("Incorrect password or username ");
    }
  } catch (error) {
    next(error);
  }
});

app.get("/api/auth/me", async (req, res, next) => {
  try {
    if (isLoggedIn) {
      res.send("LoggedIn");
    } else {
      res.send("Not LoggedIn");
    }
  } catch (err) {
    next(err);
  }
});
app.get("/api/items", async (req, res, next) => {
  try {
    res.send("List of all the products");
  } catch (error) {
    next(error);
  }
});

app.get("/api/items/:id", async (req, res, next) => {
  try {
    const id = +req.params.id;
    res.send(`Individial products of id:${id}`);
  } catch (error) {
    next(error);
  }
});

app.get("/api/items/:id/reviews", async (req, res, next) => {
  try {
    const id = +req.params.id;
    res.status(200).send(`List of all the reviews for an product ${id}`);
  } catch (error) {
    next(error);
  }
});

app.get("/api/items/:itemId/reviews/:id", async (req, res, next) => {
  try {
    const id = +req.params.id;
    const itemId = +req.params.itemId;
    res.send(`Individial reviews of id:${id} for an product ${itemId}`);
  } catch (error) {
    console.log(error);
  }
});

app.post("/api/items/:id/reviews", async (req, res, next) => {
  try {
    const id = +req.params.id;
    if (isLoggedIn) {
      res.status(201).send(`Review has been added to an product ${id}`);
    } else {
      res.status(201).send(`Please login in order add review `);
    }
  } catch (err) {
    next(error);
  }
});

app.get("/api/reviews/me", async (req, res, next) => {
  try {
    if (isLoggedIn) {
      res.send(`These are my reviews`);
    } else {
      res.send("Please login to view the reviews");
    }
  } catch (error) {
    console.log(error);
  }
});

app.put("/api/users/:userId/reviews/:id", async (req, res, next) => {
  try {
    const reviewId = +req.params.id;
    if (isLoggedIn) {
      res.send(`Successfully updated your reviews for product ${reviewId}`);
    } else {
      res.send("Please login to update the your reviews for product");
    }
  } catch (error) {
    next(error);
  }
});

app.post("/api/items/:itemId/reviews/:id/comments", async (req, res, next) => {
  try {
    const itemId = +req.params.itemId;
    if (isLoggedIn) {
      res.status(201).send(`Comment has been added to an product ${itemId}`);
    } else {
      res.status(201).send(`Please login to add Comment to an product`);
    }
  } catch (err) {
    next(error);
  }
});

app.get("/api/comments/me", async (req, res, next) => {
  try {
    if (isLoggedIn) {
      res.send(`These are my comments`);
    } else {
      res.send(`Please login to view your comments`);
    }
  } catch (error) {
    console.log(error);
  }
});

app.put("/api/users/:userId/comments/:id", async (req, res, next) => {
  try {
    const id = +req.params.id;
    if (isLoggedIn) {
      res.send(`This are my comments for particular product ${id}`);
    } else {
      res.send(`Please login to update your comments for particular product`);
    }
  } catch (error) {
    next(error);
  }
});

app.delete("/api/users/:userId/comments/:id", async (req, res, next) => {
  try {
    const id = +req.params.id;
    if (isLoggedIn) {
      res
        .status(204)
        .send(
          `My comments for particular product with id:${id} has been deleted`
        );
    } else {
      res.status(204).send("please login to delete your comments");
    }
  } catch (error) {
    next(error);
  }
});

app.delete("/api/users/:userId/reviews/:id", async (req, res, next) => {
  try {
    const id = +req.params.id;
    if (isLoggedIn) {
      res.status(204).send(`My reviews with id:${id} has been deleted`);
    } else {
      res.status(204).send("please login to remove your reviews");
    }
  } catch (error) {
    next(error);
  }
});

app.listen(
  process.env.PORT,
  console.log(`listening to the port ${process.env.PORT}`)
);
