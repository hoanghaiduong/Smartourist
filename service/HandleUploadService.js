import path from "path";
import { storageFire,defaultAppConfig } from "../config/firebase-admin.js";
import multer,{memoryStorage} from "multer";
const Mluter = multer({
    storage: memoryStorage(),
    limits: {
        fileSize: 1024 * 1024 * 5
    },
});
const uploadImageFirestore = (req, res, next) => {
    const image = req.file;
    if (!image) {
        return res.status(400).send({
            message: "No file uploaded!"
        });
    }

    console.log("User nè",req.user);
    const filename = req.userId + path.extname(image.originalname);
    const fileTypes = /jpeg|jpg|png|gif/;
    const mimeType = fileTypes.test(filename);
    const extname = fileTypes.test(path.extname(image.originalname));
    //delete "." from path.extname(image.originalname)
    const ext = path.extname(image.originalname).replace(".", "");
    console.log(ext);

    const file = storageFire.file(filename);

    if (mimeType && extname) {
        //delete file before upload
        storageFire.deleteFiles({
            prefix: req.userId
        }).then(() => {
            // upload file
            file.createWriteStream({
                metadata: {
                    contentType: `image/${ext}`,
                }
            }).on('error', err => {
                console.log(err);
            }).on('finish', async () => {
                await file.makePublic();
                req.file.firebaseUrl = `https://storage.googleapis.com/${defaultAppConfig.storageBucket}/${file.name}`;
                next();
            }).end(image.buffer);
        })

    }
    else {
         res.status(400).send({
            message: "Images Only!"
        });
    }
}
export {
    Mluter,uploadImageFirestore
}