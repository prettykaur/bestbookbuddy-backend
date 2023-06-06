const BaseController = require("./baseController");
const { Op } = require("sequelize");

class FriendsController extends BaseController {
  constructor(model, friendRequestModel, friendRequestStatusModel) {
    super(model);
    this.friendRequestModel = friendRequestModel;
    this.friendRequestStatusModel = friendRequestStatusModel;
  }

  // Get friends of user - OK
  getFriends = async (req, res) => {
    const { userId } = req.params;

    try {
      const user = await this.model.findByPk(userId);

      if (!user) {
        return res.status(404).json({ error: true, msg: "User not found" });
      }

      const user1Friends = await user.getUser1Friends({
        attributes: ["id", "username", "email", "photoUrl", "lastLogin"],
      });
      const user2Friends = await user.getUser2Friends({
        attributes: ["id", "username", "email", "photoUrl", "lastLogin"],
      });

      const friends = [...user1Friends, ...user2Friends];

      return res.json(friends);
    } catch (err) {
      console.log("Error fetching user's friends:", err);
      return res.status(500).json({ error: true, msg: err.message });
    }
  };

  // Get all friend requests for user
  getFriendRequests = async (req, res) => {
    const { userId } = req.params;

    try {
      const friendRequests = await this.friendRequestModel.findAll({
        where: {
          [Op.or]: [{ senderId: userId }, { recipientId: userId }],
        },
        include: [
          {
            model: this.model,
            as: "sender",
            attributes: ["id", "username", "email", "photoUrl", "lastLogin"],
          },
          {
            model: this.model,
            as: "recipient",
            attributes: ["id", "username", "email", "photoUrl", "lastLogin"],
          },
          {
            model: this.friendRequestStatusModel,
            as: "status",
            attributes: ["id", "status"],
          },
        ],
      });

      if (friendRequests.length === 0) {
        return res
          .status(404)
          .json({ error: true, msg: "No friend requests found" });
      }

      return res.json(friendRequests);
    } catch (err) {
      console.log("Error fetching friend requests:", err);
      return res.status(500).json({ error: true, msg: err });
    }
  };

  // Get friend requests sent by user
  getSentFriendRequests = async (req, res) => {
    const { userId } = req.params;

    try {
      const friendRequests = await this.friendRequestModel.findAll({
        where: { senderId: userId },
        include: [
          {
            model: this.model,
            as: "recipient",
            attributes: ["id", "username", "email", "photoUrl", "lastLogin"],
          },
          {
            model: this.friendRequestStatusModel,
            as: "status",
            attributes: ["id", "status"],
          },
        ],
      });

      if (friendRequests.length === 0) {
        return res
          .status(404)
          .json({ error: true, msg: "No friend requests found" });
      }

      return res.json(friendRequests);
    } catch (err) {
      console.log("Error fetching friend requests:", err);
      return res.status(500).json({ error: true, msg: err });
    }
  };

  // Get friend requests received by user
  getReceivedFriendRequests = async (req, res) => {
    const { userId } = req.params;

    try {
      const friendRequests = await this.friendRequestModel.findAll({
        where: { recipientId: userId },
        include: [
          {
            model: this.model,
            as: "sender",
            attributes: ["id", "username", "email", "photoUrl", "lastLogin"],
          },
          {
            model: this.friendRequestStatusModel,
            as: "status",
            attributes: ["id", "status"],
          },
        ],
      });

      if (friendRequests.length === 0) {
        return res
          .status(404)
          .json({ error: true, msg: "No friend requests found" });
      }

      return res.json(friendRequests);
    } catch (err) {
      console.log("Error fetching friend requests:", err);
      return res.status(500).json({ error: true, msg: err });
    }
  };

  // Send friend request to another user
  sendFriendRequest = async (req, res) => {
    const { userId } = req.params;
    const { recipientId } = req.body;

    try {
      // Check if friend request already exists
      const existingRequest = await this.friendRequestModel.findOne({
        where: {
          senderId: userId,
          recipientId,
        },
      });

      if (existingRequest) {
        return res
          .status(400)
          .json({ error: true, msg: "Friend request already sent" });
      }

      const friendRequest = await this.friendRequestModel.create({
        senderId: userId,
        recipientId,
        statusId: 1,
      });

      return res.json(friendRequest);
    } catch (err) {
      console.log("Error sending friend request:", err);
      return res.status(500).json({ error: true, msg: err });
    }
  };

  // Accept/reject friend request
  updateFriendRequestStatus = async (req, res) => {
    const { userId, requestId } = req.params;
    const { status } = req.body;

    try {
      // Find the friend request
      const friendRequest = await this.friendRequestModel.findOne({
        where: {
          id: requestId,
          recipientId: userId,
        },
        include: [
          {
            model: this.model,
            as: "sender",
            attributes: ["id", "username", "email", "photoUrl", "lastLogin"],
          },
          {
            model: this.model,
            as: "recipient",
            attributes: ["id", "username", "email", "photoUrl", "lastLogin"],
          },
          {
            model: this.friendRequestStatusModel,
            as: "status",
            attributes: ["id", "status"],
          },
        ],
      });

      if (!friendRequest) {
        return res
          .status(404)
          .json({ error: true, msg: "Friend request not found" });
      }

      // Update friend request status
      friendRequest.statusId = status;
      await friendRequest.save();

      // If request is accepted, create friendship in friends table
      if (status === 2) {
        const senderId = friendRequest.senderId;
        const recipientId = friendRequest.recipientId;

        await this.model.findByPk(senderId).then((sender) => {
          sender.addUser2Friends(recipientId);
        });

        await this.model.findByPk(recipientId).then((recipient) => {
          recipient.addUser1Friends(senderId);
        });
      }

      // If request is rejected, update status in friend requests table
      if (status === 3) {
        await this.friendRequestModel.update(
          { statusId: 3 },
          { where: { id: requestId } }
        );
      }

      // Fetch updated friend request
      const updatedFriendRequest = await this.friendRequestModel.findByPk(
        requestId,
        {
          include: [
            {
              model: this.model,
              as: "sender",
              attributes: ["id", "username", "email", "photoUrl", "lastLogin"],
            },
            {
              model: this.model,
              as: "recipient",
              attributes: ["id", "username", "email", "photoUrl", "lastLogin"],
            },
            {
              model: this.friendRequestStatusModel,
              as: "status",
              attributes: ["id", "status"],
            },
          ],
        }
      );

      return res.json(updatedFriendRequest);
    } catch (err) {
      console.log("Error updating friend request status:", err);
      return res.status(500).json({ error: true, msg: err });
    }
  };
}

module.exports = FriendsController;
