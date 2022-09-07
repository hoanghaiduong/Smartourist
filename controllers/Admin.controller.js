import axios from "axios";
import { defaultAuth, defaultMessaging,defaultAppConfig } from "../config/firebase-admin.js";
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
      res.status(400).json({
        message: "No uid provided",
      });
    }
    else {
      await defaultAuth
        .setCustomUserClaims(uid, { admin: true })
        .then(() => {
          res.status(200).json({
            message: "Admin set successfully | Please logout and try again !",
          });
        })
        .catch((err) => {
          res.status(500).json({
            status: 500,
            message: err.message
          });
        })
    }
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
      res.status(400).json({
        message: "No uid provided",
      });
    }
    await defaultAuth.setCustomUserClaims(uid, { admin: false })
      .then(() => {
        res.status(200).json({
          message: "Admin removed successfully | Please logout and try again !",
        });
      })
      .catch((err) => {
        res.status(400).json({
          message: err.message,
        });
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
      res.status(400).json({
        message: "No uid provided",
      });
    }
    else {
      await defaultAuth
        .revokeRefreshTokens(uid)
        .then(() => {
          res.status(200).json({
            message: "Tokens revoked successfully",
          });
        })
        .catch((err) => {
          res.status(500).json({
            message: "Error while getting tokens" + err.message,
          });
        });
    }
  } catch (error) {
    res.status(500).send({
      message: "Something went wrong",
    });
  }
};
//gửi mail reset password
const sendEmailResetPassword = (req, res) => {
  /*
  curl 'https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=[API_KEY]' \
-H 'Content-Type: application/json' \
--data-binary '{"requestType":"PASSWORD_RESET","email":"[user@example.com]"}'
  */
  if (!req.body.email) {
      res.status(400).send({
          email: "Email is required"
      });
  }
  else {
      axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${defaultAppConfig.apiKey}`, {
          requestType: "PASSWORD_RESET",
          email: req.body.email
      }).then(async (response) => {
          if (response) {
              res.status(200).send({
                  message: "Send Email Successfully!",
                  data: response.data
              })
          }
          else {
              res.status(500).send({
                  message: "Some error occurred while sending Email."
              });
          }
      })
  }


}
//check code reset password
const checkObbCodeResetPassword = (req, res) => {
  /*
  curl 'https://identitytoolkit.googleapis.com/v1/accounts:resetPassword?key=[API_KEY]' \
-H 'Content-Type: application/json' --data-binary '{"oobCode":"[PASSWORD_RESET_CODE]"}'*/
  if (!req.body.oobCode) {
      res.status(400).send({
          oobCode: "OobCode is required"
      });
  }
  else {
      axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:resetPassword?key=${defaultAppConfig.apiKey}`, {
          oobCode: req.body.oobCode
      }).then(async (response) => {
          if (response) {
              res.status(200).send({
                  message: "Check OobCode Successfully!",
                  data: response.data
              })
          }
          else if (response.data.error.code == "INVALID_OOB_CODE") {
              res.status(400).send({
                  message: "Invalid OobCode"
              });
          }
          else if (response.data.error.code == "EXPIRED_OOB_CODE") {
              res.status(400).send({
                  message: "Expired OobCode"
              });
          }
          else {
              res.status(500).send({
                  message: "Some error occurred while checking OobCode."
              });
          }
      }).catch(err => {
          res.status(500).send({
              message: err.message || "Some error occurred while checking OobCode."
          });
      }
      );
  }
}
//reset password
const verifyResetPassword = (req, res) => {
  /*
  curl 'https://identitytoolkit.googleapis.com/v1/accounts:resetPassword?key=[API_KEY]' \
-H 'Content-Type: application/json' \
--data-binary '{"oobCode":"[PASSWORD_RESET_CODE]","newPassword":"[NEW_PASSWORD]"}'
  */
  try {
      if (!req.body.oobCode || !req.body.newPassword) {
          res.status(400).send({
              oobCode: "OobCode is required",
              newPassword: "New Password is required"
          });
      }

      else {
          axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:resetPassword?key=${defaultAppConfig.apiKey}`, {
              oobCode: req.body.oobCode,
              newPassword: req.body.newPassword
          }).then(async (response) => {
              if (response) {
                  res.status(200).send({
                      message: "Verify Reset Password Successfully!",
                      data: response.data
                  })
              }
              else {
                  res.status(500).send({
                      message: "Some error occurred while verifying Reset Password."
                  });
              }
          }).catch(async (err) => {
              if (err.response.data.error.code == "INVALID_OOB_CODE") {
                  res.status(400).send({
                      message: "Invalid OobCode"
                  });
              }
              else if (err.response.data.error.code == "EXPIRED_OOB_CODE") {
                  res.status(400).send({
                      message: "Expired OobCode"
                  });
              }
              else {
                  res.status(500).send({
                      message: "Some error occurred while verifying Reset Password."
                  });
              }
          }

          )
      }
  } catch (error) {
      res.status(500).send({
          message: error.message || "Some error occurred while verifying Reset Password Code."
      });
  }
}
const forgotPassword = (req, res) => {
  const {email,url}=req.body;
  if (!email || !url) {
      res.status(400).send({
          email: "Email is required",
          url: "URL is required"
      });
  }
  else {

      defaultAuth.generatePasswordResetLink(email, {
          url:url
      }).then(link => {
          console.log(link)

          res.status(200).send({
              message: "Send Email Successfully!",
              data: link
          })
      }
      ).catch(err => {
          console.log('Error creating custom token:', err);
          res.status(500).send({
              message: err.message
          });
      })
  }
}
export { setAdmin, removeAdmin, revokeToken, sendPushNotification,sendEmailResetPassword,checkObbCodeResetPassword ,verifyResetPassword,forgotPassword};
