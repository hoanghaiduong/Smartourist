import mongoose from 'mongoose';
const { Schema } = mongoose;
const UserSchema=new Schema({
    uid:{
        type:String,
        required:true,
        unique:true,
        nullable:true,
    },
    displayName:{
        type:String,
        required:false,
        nullable:true
    },
    photoURL:{
        type:String,
        required:false,
        nullable:true
    },
    phoneNumber:{
        type:String,
        required:false,
        nullable:true
    },
    email:{
        type:String,
        required:false,
    }

});

 const User = mongoose.model('User',UserSchema);
 export{User,UserSchema}