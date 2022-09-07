import { defaultAuth } from "../config/firebase-admin.js";
import { Profile, ProfileSchema } from "../models/Profile.js";
import { User } from "../models/User.js";

const createUser = async (req, res) => {
  const { uid } = req.query;
  const { email, phoneNumber, photoURL, displayName } = req.body;

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
  const isProfile = req.profile.profile;
  const _idUser = req._idUser;
  const uid = req.user.uid;
  try {
    // console.log(uid);
    // console.log(req.profile);
    // console.log(req.user);
    // console.log(req._idUser);

    await User.findByIdAndDelete(_idUser).then(() => {
      defaultAuth
        .deleteUser(uid)
        .then(async () => {
          if (isProfile) {
            await Profile.findOneAndDelete(_idUser).then(() => {
              res.status(200).send({
                message: "User deleted and Profile deleted successfully"
              })
            });
          }
          else {
            res.status(200).send({
              message: "User deleted successfully but not profile deleted"
            });
          }
        }).catch((err) => {
          res.status(500).send({ message: err.message });
        });
    });




  } catch (error) {
    res.status(500).json({
      message: "Something went wrong test",
      error: error.message,
    });
  }
};
const uploadAvatar = async (req, res) => {
  const userExists = req.user;
  const uid = req.userId;
  try {
    if (req.file) {
      console.log(req.file.firebaseUrl);
      if (userExists) {
        console.log(userExists);
        await User.findOneAndUpdate({ uid: uid }, {
          $set: {
            photoURL: req.file.firebaseUrl
          }
        }, { new: true }).then((newPhoto) => {
          res.status(200).send({
            message: "Update image user successfully",
            data: newPhoto
          });
        });

      }

    }

  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
}
export { createUser, getUser, getAllUsers, updateUser, deleteUser, uploadAvatar };
