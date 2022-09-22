import { Profile } from "../models/Profile.js";
import { User } from "../models/User.js";



const createProfile = async (req, res) => {
  const { uid } = req.query;
  try {
    if (!uid) {
      res.status(400).send({
        message: "UID is required",
        code: 400,
      });
    } else {
      const user = await User.findOne({
        _id: uid
      });
      if (!user) {
        res.status(404).send({
          message: "User not found",
          code: 404,
        });
      } else {
        let profile = new Profile({
          dateOfBirth: req.body.dateOfBirth,
          user: uid,
          address: req.body.address,
          albums: req.body.albums,
          sex: req.body.sex,
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          state: req.body.state,
          country: req.body.country,
          zip_code: req.body.zip_code,
          color: req.body.color,
        });

        await profile
          .save()
          .then((profile) => {
            res.status(200).json({
              message: "Profile created",
              profile: profile,
            });
          })
          .catch((err) => {
            if (err.keyPattern) {
              res.status(500).json({
                error: err.keyPattern,
                message: "User has already been",
              });
            } else {
              res.status(500).json({
                error: err,
              });
            }
          });
      }
    }
  } catch (error) {
    res.status(404).send({
      message: "User not found" + error.message,
      code: 404,
    });
  }
};
const getProfileUser = async (req, res) => {
  const { _id } = req.query;
  try {

    const profile = await Profile.findOne({ user: _id }).populate("user", "-_id -__v").select("-__v");
    res.status(200).json({
      profile: profile,
    });
  } catch (error) {
    res.status(400).json({
      code: 400,
      message: error.message
    });
  }

};
const updateProfile = async (req, res) => {
  const { uid } = req.query;
  try {
    const profile = await Profile.findOneAndUpdate({ user: uid }, {
      $set: {
        address: req.body.address,
        albums: req.body.albums,
        dateOfBirth: req.body.dateOfBirth,
        sex: req.body.sex,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        state: req.body.state,
        country: req.body.country,
        zip_code: req.body.zip_code,
        color: req.body.color,
      },

    }, { new: true }).populate("user", "-_id -__v").select("-__v");
    if (!profile) {
      res.status(404).send({
        message: "Profile not found || user not found",
        code: 404,
      });
    }

    res.status(200).json({
      message: "Profile updated",
      code: 200,
      profile: profile,
    });

  } catch (error) {
    res.status(404).send({
      message: "Profile not found" + error.message,
      code: 404,
    });

  }
}
const deleteProfile = async (req, res) => {
  const { uid } = req.query;
  try {
    await Profile.findOneAndDelete(uid).then((profile) => {
      res.status(200).json({
        message: "Profile deleted successfully",
        code: 200,
      });
    }).catch((error) => {
      res.status(404).send({
        message: "Profile not found" + error.message,
        code: 404,
      });
    });



  }
  catch (err) {
    res.status(404).send({
      message: "Profile not found",
      code: 404,
    });

  }
}

export { createProfile, getProfileUser, updateProfile, deleteProfile };
s