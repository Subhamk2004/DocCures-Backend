import express from "express";
import DoctorSchema from "../../schema/DoctorSchema.mjs";
import cloudinary from 'cloudinary';
import multer from "multer";
import dotenv from 'dotenv';

dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.put('/doctor/update',
  upload.single('image'),
  async (req, res) => {
    const updates = req.body;
    console.log(updates);

    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path);
        updates.image = result.secure_url;
      } catch (error) {
        return res.status(500).json({
          message: 'Error uploading image',
          isUpdated: false
        });
      }
    }

    const { phone } = updates;
    if (!phone) {
      return res.status(400).json({
        message: 'Phone number is required',
        isUpdated: false
      });
    }

    try {
      if (updates.email) {
        const existingUser = await DoctorSchema.findOne({
          email: updates.email,
          phone: { $ne: phone }
        });
        if (existingUser) {
          return res.status(400).json({
            message: 'Email already in use by another user',
            isUpdated: false
          });
        }
      }

      const updatedUser = await DoctorSchema.findOneAndUpdate(
        { phone: phone },
        updates,
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({
          message: 'User not found',
          isUpdated: false
        });
      }

      req.session.email = updatedUser.email;
      req.session.doctor = updatedUser;

      return res.status(200).json({
        message: 'User updated successfully',
        isUpdated: true,
        user: updatedUser
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: error.message,
        isUpdated: false
      });
    }
  }
);

export default router;