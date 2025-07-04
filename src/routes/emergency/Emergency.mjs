import express from 'express';
import DoctorSchema from '../../schema/DoctorSchema.mjs';
import { EmergencyRequest } from '../../schema/Emergency.mjs';
import { io } from '../../index.mjs';
const router = express.Router();

// Get available doctors for emergency
router.get('/emergency/doctors', async (req, res) => {
  try {
    const availableDoctors = await DoctorSchema.find({ availableForEmergency: true });
    res.json(availableDoctors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching available doctors', error: error.message });
  }
});

// Send emergency request
router.post('/emergency/request', async (req, res) => {
  const { userId, doctorId } = req.body;
  try {
    const newRequest = new EmergencyRequest({ user: userId, doctor: doctorId, status: 'pending' });
    await newRequest.save();
    
    // Notify the selected doctor using Socket.IO
    io.to(`doctor_${doctorId}`).emit('newEmergencyRequest', newRequest);
    
    res.status(201).json(newRequest);
  } catch (error) {
    res.status(500).json({ message: 'Error creating emergency request', error: error.message });
  }
});

// Respond to emergency request (for doctors)
router.put('/emergency/respond/:requestId', async (req, res) => {
  const { requestId } = req.params;
  const { accepted } = req.body;
  try {
    const request = await EmergencyRequest.findByIdAndUpdate(requestId, 
      { status: accepted ? 'accepted' : 'rejected' },
      { new: true }
    );
    
    if (!request) {
      return res.status(404).json({ message: 'Emergency request not found' });
    }
    
    // Notify the user about the doctor's response using Socket.IO
    io.to(`user_${request.user}`).emit('emergencyRequestResponse', request);
    
    if (accepted) {
      // Create a private room for user and doctor
      const roomName = `emergency_${requestId}`;
      io.to(`user_${request.user}`).emit('joinEmergencyRoom', roomName);
    }
    
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: 'Error responding to emergency request', error: error.message });
  }
});

export default router;