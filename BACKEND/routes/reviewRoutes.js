import express from 'express';
import mongoose from 'mongoose';
import Review from '../models/review.js'; // ✅ Must also be an ES Module

const router = express.Router();

// ✅ Validate booking
router.post("/validate-booking", async (req, res) => {
    const { bookingNumber, pin } = req.body;

    try {
        const reservation = await mongoose.connection
            .collection("reservations")
            .findOne({ name: bookingNumber, phone: pin });

        if (reservation) {
            res.json({ valid: true });
        } else {
            res.json({ valid: false, message: "Invalid booking number or PIN." });
        }
    } catch (error) {
        console.error("Error validating booking:", error);
        res.status(500).json({ valid: false, message: "Internal server error." });
    }
});

// ✅ Create a review
router.post("/", async (req, res) => {
    try {
        const { hotelId, name, rating, comment } = req.body;

        if (!hotelId || !name || !rating || !comment) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const review = new Review({ hotelId, name, rating, comment });
        await review.save();
        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ message: "Error creating review", error });
    }
});

// ✅ Get reviews
router.get("/", async (req, res) => {
    try {
        const { hotelId } = req.query;
        const query = hotelId ? { hotelId } : {};
        const reviews = await Review.find(query);
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: "Error fetching reviews", error });
    }
});

// ✅ Update a review
router.put("/:id", async (req, res) => {
    try {
        const { name, rating, comment } = req.body;
        const review = await Review.findByIdAndUpdate(
            req.params.id,
            { name, rating, comment },
            { new: true }
        );

        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        res.json(review);
    } catch (error) {
        res.status(500).json({ message: "Error updating review", error });
    }
});

// ✅ Delete a review
router.delete("/:id", async (req, res) => {
    try {
        const review = await Review.findByIdAndDelete(req.params.id);

        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        res.json({ message: "Review deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting review", error });
    }
});

export default router;
