import mongoose from "mongoose";
import crypto from "crypto";
import {User, UserSchema} from "./User.js";

const { Schema } = mongoose;
//console.log(Schema.Types.ObjectId);
const ProfileSchema = new Schema({
  first_name:{
    type: String,
    required: false,
    nullable: true,
  },
  last_name:{
    type: String,
    required: false,
    nullable: true,
  },
  state:{
    type: String,
    required: false,
    nullable: true,
  },
  zip_code:{
    type: String,
    required: false,
    nullable: true,
  },
  country:{
    type: String,
    required: false,
    nullable: true,
  },


  dateOfBirth: {
    type: Date,
    required: false,
    nullable: true,
  },
  albums: [
    {
      type: String,
      required: false,
      nullable: true,
    },
  ],
  sex: {
    type:Number,
    required: false,
    nullable: true,
  },
  address: {
    type: String,
    required: false,
    nullable: true,
  },
  user:{
    type: Schema.Types.ObjectId,
    ref: "User",
    nullable: true,
    required: false,
    unique: true,
  },
  color:{
    type: String,
    required: false,
    nullable: true,
  }
  // userEmbedding:UserSchema,
  // userId:{
  //   type: String,
  //   ref: "User.uid",
  //   nullable: false,
  //   required:true,
  //   unique: true,
  // }
});


const Profile = mongoose.model("Profile", ProfileSchema);

export {
    Profile,
    ProfileSchema,
}