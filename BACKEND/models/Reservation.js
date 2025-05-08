import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        match: [/\S+@\S+\.\S+/, 'Please use a valid email address'],
    },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    roomCount: {
        type: Number,
        required: true,
    },
    roomPrice: {
        type: Number,
        required: true,
    },
    phone: {
        type: String,
        required: true,
        validate: {
            validator: function(value) {
                return /\+?\d{1,3}?\s?\(?\d+\)?\s?\d+\s?\d+/g.test(value);
            },
            message: 'Please provide a valid phone number.'
        },
    },
    message: {
        type: String,
        required: true,
        maxlength: [500, 'Message cannot exceed 500 characters.'],
    },
    hotelName: {
        type: String,
        required: true, // ✅ required field
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending',
    },
    Location: {
        type: String,
        required: true, 
    },
}, { timestamps: true });

reservationSchema.index({ email: 1, checkIn: 1, checkOut: 1 });

export default mongoose.model('Reservation', reservationSchema);
