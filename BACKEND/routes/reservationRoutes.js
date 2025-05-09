import express from 'express';
import Reservation from '../models/Reservation.js';

const router = express.Router();

// POST - Create a new reservation
router.post("/", async (req, res) => {
    console.log("[POST] Creating reservation:", req.body);
    const {
        name, email, checkIn, checkOut,
        roomCount, roomPrice, phone, message,
        hotelName, city
    } = req.body;

    console.log("Request body:", req.body);
    

    // Validate required fields including hotelName
    if (!name || !email || !checkIn || !checkOut ||
        !roomCount || !roomPrice || !phone || !message || !hotelName) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkOutDate <= checkInDate) {
        return res.status(400).json({ error: "Check-out date must be after check-in date." });
    }

    const reservation = new Reservation({
        ...req.body,
        status: req.body.status || 'pending'
    });

    try {
        await reservation.save();
        res.status(201).json({
            message: "Reservation created successfully",
            reservation,
        });
    } catch (error) {
        res.status(400).json({
            error: "Failed to create reservation",
            details: error.message,
        });
    }
});

// GET - Fetch all reservations
router.get("/", async (req, res) => {
    try {
        const reservations = await Reservation.find().sort({ createdAt: -1 });
        res.status(200).json(reservations);
    } catch (error) {
        res.status(500).json({
            error: "Failed to fetch reservations",
            details: error.message,
        });
    }
});

// DELETE - Delete a reservation by ID
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedReservation = await Reservation.findByIdAndDelete(id);

        if (!deletedReservation) {
            return res.status(404).json({ error: "Reservation not found" });
        }

        res.status(200).json({ message: "Reservation deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete reservation", details: error.message });
    }
});

// PUT - Update a reservation by ID
router.put("/:id", async (req, res) => {
    try {
        console.log("[PUT] Updating reservation ID:", req.params.id);
        console.log("Payload:", req.body);

        const { id } = req.params;
        const { checkIn, checkOut } = req.body;

        if (checkIn && checkOut) {
            const checkInDate = new Date(checkIn);
            const checkOutDate = new Date(checkOut);

            if (checkOutDate <= checkInDate) {
                return res.status(400).json({ error: "Check-out date must be after check-in date." });
            }
        }

        const updatedReservation = await Reservation.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedReservation) {
            return res.status(404).json({ error: "Reservation not found" });
        }

        res.status(200).json({
            message: "Reservation updated successfully",
            reservation: updatedReservation,
        });
    } catch (error) {
        console.error("Error updating reservation:", error);
        res.status(500).json({
            error: "Failed to update reservation",
            details: error.message,
        });
    }
});

export default router;
