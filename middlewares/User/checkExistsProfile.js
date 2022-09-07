import { Profile } from "../../models/Profile.js"
import { User } from "../../models/User.js";

const checkProfile = async (req, res, next) => {
    const { uid } = req.query;
    const user = req.user;
    try {

        const _idUser = user._id.toString();
        await Profile.findOne({ _id: _idUser }).then((profile) => {
            req._idUser = _idUser;
            if (profile) {
                req.profile = {
                    data: profile,
                    profile: true
                };
            }
            else {
                req.profile = {
                    profile: false
                };
            }
        });
        next();
    }

    catch (err) {
        res.status(400).send({
            message: err.message
        });
    }

}
export {
    checkProfile
}