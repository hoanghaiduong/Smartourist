import { defaultAppConfig, defaultAuth, defaultMessaging } from "../config/firebase-admin.js";
import {User} from "../models/User.js";
import axios from "axios";
const signupWithEmailAndPassword = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
    res.status(401).send({ 
      email: "Email is required",
      password: "Password is required",
    });
    }
    await defaultAuth
      .createUser({
        email: email,
        password: password,
      })
      .then(async (userfirebase) => {
        await User.findOne({ uid: userfirebase.uid })
          .then(async (user) => {
            if (!user) {
              const user = new User({ uid: userfirebase.uid, email: email,photoURL:null,phoneNumber:null,displayName:null });
            await user.save().then((result)=>{
              res.status(200).send
              ({
                  status: 'success',
                  message: 'User saved mongodb and Firebase successfully.',
                  data:result
              });
            }).catch((err)=>{
              res.status(400).send({
                status: 400,
                message: 'Save Firebase failed'+err.message
             });
             })
            
            } else {
              res.status(409).send({
                message: "User already exists",
              });
            }
          })
          .catch((err) => {
            res.status(500).send({
              message: err.message,
            });
          });
      })
      .catch((err) => {
        res.status(500).send({
          message: "Something went wrong",
          error: err.message,
        });
      });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};
const signinWithEmailAndPassword = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      res.status(400).send({
        email: "Email is required",
        password: "Password is required",
      });
    } else {
      axios.defaults.headers.post["Content-Type"] =
        "application/x-www-form-urlencoded";
      axios
        .post(
          `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${defaultAppConfig.apiKey}`,
          {
            email: req.body.email,
            password: req.body.password,
            returnSecureToken: true,
          }
        )
        .then(async (response) => {
          res.status(200).send({
            message: "Signin Successfully!",
            data: {
              uid: response.data.localId,
              email: response.data.email,
              type: response.data.kind,
              displayName: response.data.displayName,
              photoURL: response.data.profilePicture,
              status: response.data.registered,
              access_token: response.data.idToken,
              refresh_token: response.data.refreshToken,
              expires_in: response.data.expiresIn,
            },
          });
        })
        
    }
  } catch (error) {
    res.status(500).send({
      message: "Something went wrong",
      error: error.message,
    });
  }
};
//logout firebase and delete token and refresh token and fcm token
const logout = async (req, res) => {
  const { uid ,fcm} = req.query;
  try {
    if (!uid) {
      throw createError(400, "uid is required");
    }
    
    await defaultAuth.revokeRefreshTokens(uid).then(() => {
     defaultMessaging.unsubscribeFromTopic(fcm, "all").then(() => {
       res.status(200).send({
         message: "Logout Successfully",
       }) 
      }).catch((err) => {
          res.status(500).send({
            message: "Something went wrong",
            error: err.message,
          });
      })
    });
  } catch (error) {
    res.status(500).send({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export { signupWithEmailAndPassword, signinWithEmailAndPassword,logout };
