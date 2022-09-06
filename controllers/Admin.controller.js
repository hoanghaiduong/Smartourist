import { defaultAuth, defaultMessaging } from "../config/firebase-admin.js";
import { createError } from "../utils/error.js";
//send notification to all users
const sendPushNotification = async (req, res) => {
  const { token, title, body } = req.body;
  const payload = {
    notification: {
      title: title,
      body: body,
    },
  };
  const options = {
    priority: "high",
    timeToLive: 60 * 60 * 24, // 1 day
  };
  try {
    if (!token) {
      throw createError(400, "No token provided");
    }

    await defaultMessaging
      .sendToDevice(token, payload, options)
      .then((result) => {
        res.status(200).json({
          message: "Push notification sent successfully",
          result: result,
        });
      })
      .catch((err) => {
        res.status(500).send({
          message: error.message,
        });
      });
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

// Subscribe the devices corresponding to the registration tokens to the
// topic.
const subscribeToTopic = async (req, res) => {
  const { registrationTokens, topic } = req.body;
  const options = {
    topic: topic,
  };
  try {
    if (!registrationTokens || !topic) {
      res.status(400).json({
        message: "No registration tokens or topic provided",
      });
    }
    await defaultMessaging
      .subscribeToTopic(registrationTokens, options)
      .then((result) => {
        res.status(200).json({
          message: "Subscribed successfully",
          result: result,
        });
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message,
        });
      });
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};
const unsubscribeFromTopic = async (req, res) => {
  const { registrationTokens, topic } = req.body;
  const options = {
    topic: topic,
  };
  try {
    if (!registrationTokens || !topic) {
      res.status(400).json({
        message: "No registration tokens or topic provided",
      });
    }
    await defaultMessaging
      .unsubscribeFromTopic(registrationTokens, options)
      .then((result) => {
        res.status(200).json({
          message: "Unsubscribed successfully",
          result: result,
        });
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message,
        });
      });
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
}

// set admin to user
const setAdmin = async (req, res) => {
  const { uid } = req.query;
  try {
    if (!uid) {
      throw createError(400, "No uid provided");
    }
    await defaultAuth
      .setCustomUserClaims(uid, { admin: true })
      .then(() => {
        res.status(200).json({
          message: "Admin set successfully | Please logout and try again !",
        });
      })
      .catch((err) => {
        throw createError(500, err.message);
      });
  } catch (error) {
    res.status(500).send({
      message: "Something went wrong",
    });
  }
};
// revoke admin from user
const removeAdmin = async (req, res) => {
  const { uid } = req.query;
  try {
    if (!uid) {
      throw createError(400, "No uid provided");
    }
    await defaultAuth

      .setCustomUserClaims(uid, { admin: false })
      .then(() => {
        res.status(200).json({
          message: "Admin removed successfully | Please logout and try again !",
        });
      })
      .catch((err) => {
        throw createError(500, err.message);
      });
  } catch (error) {
    res.status(500).send({
      message: "Something went wrong",
    });
  }
};
// revoke token from user
const revokeToken = async (req, res) => {
  const { uid } = req.query;
  try {
    if (!uid) {
      throw createError(400, "No uid provided");
    }
    await defaultAuth
      .revokeRefreshTokens(uid)
      .then(() => {
        res.status(200).json({
          message: "Tokens revoked successfully",
        });
      })
      .catch((err) => {
        throw createError(500, err.message);
      });
  } catch (error) {
    res.status(500).send({
      message: "Something went wrong",
    });
  }
};
export { setAdmin, removeAdmin, revokeToken, sendPushNotification };
