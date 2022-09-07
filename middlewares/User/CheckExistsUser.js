import { User } from "../../models/User.js";

const checkUserExists = async (req, res, next) => {
    const { uid } = req.query;
    if(!uid) {
        res.status(400).send({ 
            message:"UID is required"
        })
    }
    try {
        
       await User.findOne({ uid }).then(async (user) => {
            if (user) {
                req.user = user;
                next();
            }
            else
            {
                res.status(404).json({
                    message: 'User not found',
                })
            }

        })
    } catch (error) {
        res.status(404).send(error.message);
    }

}
export {
    checkUserExists,
}