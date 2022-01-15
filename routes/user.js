const { Mongoose } = require("mongoose");
const User = require("../models/User");
const router = require("express").Router();

// login user
router.post("/login", async (req, res) => {
  try {
    /*
    sometimes mongodb allows multiple unique index's, this func is fixing the problem.
    */
    // User.createIndexes();
    // console.log(req.body);
    const user = await User.findOneAndUpdate(
      {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        isOnline: false,
      },
      {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        isOnline: true,
      },
      { new: true }
    );
    // console.log("Server console - login user", user);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// logout user
router.post("/logout", async (req, res) => {
  try {
    /*
      sometimes mongodb allows multiple unique index's, this func is fixing the problem.
      */
    // console.log("body Data", req.body);
    // User.createIndexes();
    const user = await User.findOneAndUpdate(
      {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        isOnline: true,
      },
      {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        isOnline: false,
      },
      { new: true }
    );
    console.log("Server console - Logout user", user);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE USER
router.post("/update", async (req, res) => {
  try {
    /*
    sometimes mongodb allows multiple unique index's, this func is fixing the problem.
    */
    // User.createIndexes();
    currentUser = req.body.currentUser;
    toUpdateUser = req.body.toUpdateUser;
    // User.findOneAndUpdate(current user, update user , options , callback )
    const updatedUser = await User.findOneAndUpdate(
      {
        username: currentUser.username,
        email: currentUser.email,
        password: currentUser.password,
      },
      {
        username: toUpdateUser.username,
        email: toUpdateUser.email,
        password: toUpdateUser.password,
      },
      { new: true }
    );
    updatedUser
      ? res.status(200).json(updatedUser)
      : res.status(404).json({
          error: "failed to update user." + err.message,
        });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADD USER
router.put("/add-user", async (req, res) => {
  try {
    console.log(req.body);
    await new User(req.body).save();
    res.status(200).json({ status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// DELETE USER
router.delete("/delete-user", async (req, res) => {
  try {
    // sometimes mongodb allows multiple unique index's, this func is fixing the problem.
    // User.createIndexes();
    console.log(req.body.username);
    const isDeleted = await User.findOneAndDelete({
      username: req.body.username,
    });
    console.log(isDeleted);
    isDeleted
      ? res.status(200).json({ status: "success" })
      : res.status(300).json({ error: "user in not exists in DB." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET USER Example(http://localhost:5000/api/users/guy)
router.post("/:user", async (req, res) => {
  try {
    /*
    sometimes mongodb allows multiple unique index's, this func is fixing the problem.
    */
    // User.createIndexes();
    console.log(req.body);
    const user = await User.findOne({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    // console.log(user);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET USER BY ID
router.get("/:id", async (req, res) => {
  try {
    /*
    sometimes mongodb allows multiple unique index's, this func is fixing the problem.
    */
    // User.createIndexes();
    console.log(req.body);
    const user = await User.findById({ _id: req.params.id });
    console.log("user ", user);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
