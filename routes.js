import User from "./models/user.js";

export default function (app, db) {
  // show the home page
  app.get("/", function (req, res) {
    if (req.session.userId) {
      return res.redirect("/dashboard");
    }
    res.render("index.ejs");
  });

  // ============= PROFILE =============
  app.get("/dashboard", isLoggedIn, async function (req, res) {
    try {
      const messages = await db.collection("messages").find().toArray();
      const user = await User.findById(req.session.userId);

      res.render("dashboard.ejs", {
        user: user,
        messages: messages,
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
        req.session.loginMessage = "No user found";
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
}
