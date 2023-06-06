const BaseController = require("./baseController");
const { Op } = require("sequelize");

class UsersController extends BaseController {
  constructor(model) {
    super(model);
  }

  // Create new user in db
  createUser = async (req, res) => {
    const { username, email, photoUrl } = req.body;

    try {
      // Check if the user already exists in the db based on email
      const [user] = await this.model.findOrCreate({
        where: { email },
        defaults: {
          username,
          email: email,
          photoUrl,
          lastLogin: new Date(),
        },
      });

      return res.json(user);
      // }
    } catch (err) {
      console.log("Error creating user:", err);
      return res.status(400).json({ error: true, msg: err });
    }
  };

  // Get user profile
  getUserProfile = async (req, res) => {
    const { userId } = req.params;

    try {
      // Get user's profile from db
      const user = await this.model.findByPk(userId);

      if (!user) {
        return res.status(404).json({ error: true, msg: "User not found" });
      }

      return res.json(user);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  };

  // Update user profile
  updateUserProfile = async (req, res) => {
    const { userId } = req.params;
    const { username, email, bio, address, photoUrl } = req.body;

    try {
      // Get user from db
      const user = await this.model.findByPk(userId);

      if (!user) {
        return res.status(404).json({ error: true, msg: "User not found" });
      }

      // Update user's profile info
      user.username = username;
      user.email = email;
      user.bio = bio;
      user.address = address;
      user.photoUrl = photoUrl;

      // Save updated user profile
      await user.save();

      const updatedUser = await this.model.findByPk(userId);

      return res.json(updatedUser);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  };

  // Delete user
  deleteUser = async (req, res) => {
    const { userId } = req.params;

    try {
      const deletedUser = await this.model.destroy({
        where: {
          id: userId,
        },
      });
      return res.json(deletedUser);
    } catch (err) {
      console.log("Error deleting user:", err);
      return res.status(400).json({ error: true, msg: err });
    }
  };

  // Get search results for users by username
  searchUsersByUsername = async (req, res) => {
    const { username } = req.params;

    try {
      // Find all users whose username matches search term
      const users = await this.model.findAll({
        where: {
          username: {
            [Op.like]: `%${username}%`,
          },
        },
      });

      if (users.length === 0) {
        return res.status(404).json({ error: true, msg: "No users found" });
      }

      return res.json(users);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  };
}

module.exports = UsersController;
