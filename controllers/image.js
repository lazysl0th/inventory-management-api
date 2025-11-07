import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});

export const uploadImage = async(req, res) => {
    try {
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        const dataURI = `data:${req.file.mimetype};base64,${b64}`;
        const result = await cloudinary.uploader.upload(dataURI, {
            folder: "inventory-images",
        });
        return res.json({ url: result.secure_url });
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: "Ошибка загрузки изображения" });
    }
}