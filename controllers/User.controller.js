import { defaultAuth } from "../config/firebase-admin.js";
import { Profile, ProfileSchema } from "../models/Profile.js";
import { User } from "../models/User.js";

const createUser = async (req, res) => {
  const {uid}= req.query;
  const {  email, phoneNumber, photoURL, displayName } = req.body;

  const user = new User({ uid, email, phoneNumber, photoURL, displayName });
  const findUser = await User.findOne({ uid });
  try {
    const savedUser = await user.save();
    if (!findUser && savedUser) {
      res.status(201).send({
        message: "User created successfully",
        user: savedUser,
      });
    } else {
      res.status(409).send({
        message: "User already exists",
      });
    }
  } catch (error) {
    res.status(500).send({
      message:
        "Something went wrong while creating user || user already exists || check duplicate values",
      error: error.message,
    });
    
  }
 
};
const getUser = async (req, res) => {
  try {
    const { uid } = req.query;
    const user = await User.findOne({ uid });
    if (user) {
      res.status(200).json({
        user: user,
      });
    } else {
      res.status(404).json({
        message: "User not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (users) {
      res.status(200).json({
        message: "Get All users successfully",
        users: users,
      });
    } else {
      res.status(404).json({
        message: "No users found",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { uid } = req.query;
    const { email, phoneNumber, photoURL, displayName } = req.body;
    const user = await User.findOne({ uid });
    if (user) {
      const updateUser = await User.findByIdAndUpdate(
        uid,
        { $set: { email, phoneNumber, photoURL, displayName } },
        { new: true }
      );
      if (updateUser) {
        defaultAuth
          .updateUser(uid, {
            email: email,
            phoneNumber: phoneNumber,
            photoURL: photoURL,
            displayName: displayName,
          })
          .then(() => {
            res.status(200).json({
              message: "User updated successfully to firebase and mongodb",
              user: updateUser,
            });
          })
          .catch((err) => {
            res.status(500).json({
              message: "Error updating to firebase",
              error: err,
            });
          });
      } else {
        res.status(500).json({
          message: "Error updating user to mongodb",
          error: err,
        });
      }
    } else {
      res.status(404).json({
        message: "User not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};
const deleteUser = async (req, res) => {
  const { uid } = req.query;
  try {

    const user = await User.findOne({ uid });

    if (user) {
      const _idUser = user._id.toString();
      console.log(_idUser);
      await Profile.findOneAndDelete(_idUser).then(async (result) => {
        if (!result) {
          res.status(404).json({
            message: "Profile not found",
          });
        }
        const deleteUser = await User.findByIdAndDelete(_idUser);
        if (deleteUser) {
          defaultAuth
            .deleteUser(uid)
            .then(async () => {
              res.status(200).json({
                message: "User deleted successfully to firebase and mongodb",
                user: deleteUser,
              });

            })
            .catch((err) => {
              res.status(500).json({
                message: "Error deleting to firebase",
                error: err,
              });
            });
        } else {
          res.status(500).json({
            message: "Error deleting user from the database",
            error: err,
          });
        }
      }).catch((err) => {
        res.status(500).json({
          error: err.message,
          code: 500
        });

      });


    } else {
      res.status(404).json({
        message: "User not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong test",
      error: error.message,
    });
  }
};

export { createUser, getUser, getAllUsers, updateUser, deleteUser };
