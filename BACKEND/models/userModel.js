import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    unique: true,
    required: true
  },

  password: {
    type: String,
    required: true
  },

  verifyOtp: {
    type: String,
    default: ''
  },

  verifyOtpExpireAt: {
    type: Number,
    default: 0
  },

  isAccountVerified: {
    type: Boolean,
    default: false
  },

  resetOtp: {
    type: String,
    default: ''
  },

  resetOtpExpireAt: {
    type: Number,
    default: 0
  },

  // ✅ New Fields
  phone: {
    type: String,
    default: ''
  },

  birthday: {
    type: Date,
    default: null
  },

  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    default: 'Other'
  },

  address: {
    type: String,
    default: ''
  },
 
});

const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;