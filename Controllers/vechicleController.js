const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create a new vehicle
const createVehicle = async (req, res) => {
  const { ownerId, number, type } = req.body;

  try {
    const newVehicle = await prisma.vehicle.create({
      data: {
        ownerId,
        number,
        type,
      },
    });

    res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: newVehicle,
    });
  } catch (error) {
    console.error("Error creating vehicle:", error); // Add this to log the error
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all vehicles
const getVehicles = async (req, res) => {
  try {
    const vehicles = await prisma.vehicle.findMany({
      include: {
        owner: true, // Include owner data (if needed)
      },
    });

    res.status(200).json({
      success: true,
      data: vehicles,
    });
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get vehicle by ID
const getVehicleById = async (req, res) => {
  const { id } = req.params;

  try {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
      include: {
        owner: true, // Include owner data (if needed)
      },
    });

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    res.status(200).json({
      success: true,
      data: vehicle,
    });
  } catch (error) {
    console.error("Error fetching vehicle:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update vehicle by ID
const updateVehicle = async (req, res) => {
  const { id } = req.params;
  const { ownerId, number, type } = req.body;

  try {
    const updatedVehicle = await prisma.vehicle.update({
      where: { id },
      data: {
        ownerId,
        number,
        type,
      },
    });

    res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      data: updatedVehicle,
    });
  } catch (error) {
    console.error("Error updating vehicle:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete vehicle by ID
const deleteVehicle = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.vehicle.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting vehicle:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createVehicle,
  getVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};
