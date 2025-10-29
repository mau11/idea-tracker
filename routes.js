import { User } from "./models/user.js";
import { List } from "./models/list.js";
import { Idea } from "./models/idea.js";

export default function (app, db) {
  // show the home page
  app.get("/", function (req, res) {
    if (req.session.userId) {
      return res.redirect("/dashboard");
    }
    res.render("index.ejs");
  });

  // ============= DASHBOARD =============
  app.get("/dashboard", isLoggedIn, async function (req, res) {
    try {
      const user = await User.findById(req.session.userId);
      const lists = await db
        .collection("lists")
        .find({ userId: user._id })
        .toArray();

      const message = req.session.listMessage || "";
      req.session.listMessage = null;
      console.log(message);

      res.render("dashboard.ejs", {
        user,
        lists,
        message,
      });
    } catch (err) {
      console.log(err);
      res.redirect("/");
    }
  });

  // ============= LOGIN =============
  function isLoggedIn(req, res, next) {
    if (req.session.userId) {
      return next();
    }
    res.redirect("/");
  }

  // show the login form
  app.get("/login", function (req, res) {
    const message = req.session.loginMessage || "";
    req.session.loginMessage = null;
    res.render("login.ejs", { message: message });
  });

  app.post("/login", async function (req, res) {
    try {
      const { username, password } = req.body;

      // validate input
      if (!username || !password) {
        req.session.loginMessage = "Username and password are required";
        return res.redirect("/login");
      }

      // find user
      const user = await User.findOne({ username: username });

      if (!user) {
        req.session.loginMessage = "User not found";
        return res.redirect("/login");
      }

      // Check password
      const isMatch = user.validPassword(password);

      if (!isMatch) {
        req.session.loginMessage = "Wrong password";
        return res.redirect("/login");
      }

      // Create session
      req.session.userId = user._id;
      res.redirect("/dashboard");
    } catch (err) {
      console.log(err);
      req.session.loginMessage = "Something went wrong";
      res.redirect("/login");
    }
  });

  // ============= SIGNUP =============
  // show the signup form
  app.get("/signup", function (req, res) {
    const message = req.session.signupMessage || "";
    req.session.signupMessage = null;
    res.render("signup.ejs", { message: message });
  });

  // process the signup form
  app.post("/signup", async function (req, res) {
    try {
      const { username, password } = req.body;

      // validate input
      if (!username || !password) {
        req.session.signupMessage = "Username and password are required";
        return res.redirect("/signup");
      }

      // check if user exists
      const existingUser = await User.findOne({ username });

      if (existingUser) {
        req.session.signupMessage = "That username is already taken";
        return res.redirect("/signup");
      }

      // create user
      const newUser = new User();
      newUser.username = username;
      newUser.password = newUser.generateHash(password);
      await newUser.save();

      // auto-login after signup
      req.session.userId = newUser._id;
      res.redirect("/dashboard");
    } catch (err) {
      console.log(err);
      req.session.signupMessage = "Something went wrong";
      res.redirect("/signup");
    }
  });

  // ============= LOGOUT =============
  app.get("/logout", function (req, res) {
    req.session.destroy((err) => {
      if (err) {
        console.log("Logout error:", err);
      }
      console.log("User has logged out");
      res.redirect("/");
    });
  });

  // ============= LISTS =============

  // create a new list
  app.post("/list", async function (req, res) {
    try {
      const { name, description } = req.body;

      // validate input
      if (!name) {
        req.session.listMessage = "Name required";
        return res.redirect("/dashboard");
      }

      // create list
      const newList = new List({
        name,
        description,
        userId: req.session.userId,
      });
      await newList.save();

      res.redirect("/dashboard");
    } catch (err) {
      console.log(err);
      req.session.listMessage = "Something went wrong";
      res.redirect("/dashboard");
    }
  });

  // render list view
  app.get("/list/:id", isLoggedIn, async (req, res) => {
    try {
      console.log(req.params);
      const list = await List.findOne({
        _id: req.params.id,
        userId: req.session.userId,
      });

      if (!list) {
        return res.status(404).send("List not found");
      }

      const ideas = await Idea.find({ listId: list._id });

      res.render("list-detail.ejs", {
        list,
        ideas,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Error loading list");
    }
  });

  // delete list
  app.delete("/list/:id/delete", isLoggedIn, async (req, res) => {
    try {
      await Idea.deleteMany({ listId: req.params.id });

      await List.findOneAndDelete({
        _id: req.params.id,
        userId: req.session.userId,
      });

      res.json({ success: true, message: "List deleted" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Error deleting list" });
    }
  });

  // ============= IDEAS =============
  // add idea to list
  app.post("/list/:id/idea", isLoggedIn, async (req, res) => {
    try {
      const newIdea = new Idea({
        title: req.body.title,
        notes: req.body.notes,
        category: req.body.category || "General",
        status: req.body.status || "Not Started",
        priority: req.body.priority || "Medium",
        startDate: req.body.startDate || null,
        completedDate: req.body.completedDate || null,
        listId: req.params.id,
        userId: req.session.userId,
      });

      await newIdea.save();
      res.redirect(`/list/${req.params.id}`);
    } catch (err) {
      console.error(err);
      res.status(500).send("Error adding idea");
    }
  });
}
