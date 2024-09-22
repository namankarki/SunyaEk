const express = require("express");
const userController = require("../Controllers/userController");

const router = express.Router();

router.post("/createUser", userController.createUser);
router.get("/getAllUsers", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);
router.post("/login", userController.loginUser);
router.post("/logout", userController.logout);

module.exports = router;
