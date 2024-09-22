const express = require("express");
const {
  createVehicle,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
  getAllVehicles,
  getVehicles,
} = require("../Controllers/vechicleController");
const router = express.Router();

// Create a new vehicle
router.post("/", createVehicle);

// Get all vehicles
router.get("/", getVehicles);

// Get a vehicle by ID
router.get("/:id", getVehicleById);

// Update a vehicle by ID
router.put("/:id", updateVehicle);

// Delete a vehicle by ID
router.delete("/:id", deleteVehicle);

module.exports = router;
