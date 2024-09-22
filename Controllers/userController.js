const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secretKey = "your_secret_key"; // Replace with a strong secret key

// Create a new user

// Number of salt rounds for bcrypt
const saltRounds = 10;

const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create the new user with the hashed password
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword, // Store the hashed password
        role: role || "USER", // Default role is USER
      },
    });

    console.log(newUser);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

// Get a user by ID
const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
};
// Update user by ID

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, role } = req.body;

  try {
    let hashedPassword = undefined;

    // If a new password is provided, hash it
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        password: hashedPassword ? hashedPassword : undefined, // Update only if new password is provided
        role,
      },
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    if (error.code === "P2025") {
      res.status(404).json({ message: "User not found" }); // Handle not found error
    } else {
      res.status(500).json({ message: "Error updating user", error });
    }
  }
};

console.log(updateUser);

// Delete user by ID
const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.user.delete({ where: { id } });
    res.status(204).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};

// login

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log("Login request received:", { email, password });

  try {
    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare the provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create a JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      secretKey,
      { expiresIn: "1h" } // Set token expiration as needed
    );

    // Set the JWT token in an HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true, // Prevents JavaScript access to the cookie
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      expires: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour expiration
      sameSite: "strict", // Helps prevent CSRF attacks
      path: "/", // Cookie valid for the entire site
    });

    // Send response with user data (excluding the password)
    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const logout = (req, res) => {
  try {
    res
      .status(201)
      .cookie("token", "", {
        expires: new Date(0),
        path: "/",
        // sameSite: process.env.NODE_ENV === "Development" ? "lax" : "none",
        // secure: process.env.NODE_ENV === "Development" ? false : true,
      })
      .json({
        success: true,
        message: "logout sucess",
      });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  loginUser,
  logout,
};
