const express = require("express");
const router = express.Router();
const verifyToken = require("@middleware/auth.middleware");

const Bill = require("@models/bill.model");
const User = require("@models/user.model");
const Case = require("@models/case.model");
const TimeEntry = require("@models/timeEntry.model.js");

router.get("/getBills", verifyToken, async (req, res) => {
    const userId = req.userId;
    try {
        console.log("Fetching bills for user:", userId);
        const bills = await Bill.find({ generatedBy: userId }).populate(
            "case client generatedBy timeEntriesRate.timeEntry",
        );
        console.log("Fetched bills:", bills.length);
        res.json(bills);
    } catch (error) {
        console.error("Error fetching bills:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post("/createBill", verifyToken, async (req, res) => {
    const userId = req.userId;
    const { caseId, timeEntryRates, tax, dueDate, notes } = req.body;

    try {
        const user = await User.findById(userId);
        const caseDoc = await Case.findById(caseId).populate("client");

        if (!user || !caseDoc) {
            return res.status(404).json({ error: "User or Case not found" });
        }

        // get all the time entries from DB
        const entries = await TimeEntry.find({
            _id: { $in: timeEntryRates.map((t) => t.entryId) },
            case: caseId,
            isBillable: true,
        });

        // Build timeEntriesRate array with amount
        const timeEntriesRate = entries.map((entry) => {
            const matchedRate = timeEntryRates.find(
                (t) => t.entryId == entry._id.toString(),
            );
            const hourlyRate = matchedRate?.hourlyRate || 0;
            const amount = entry.hours * hourlyRate;

            return {
                timeEntry: entry._id,
                hourlyRate: hourlyRate,
                amount,
            };
        });

        console.log("Time Entries Rate:", timeEntriesRate);

        const subtotal = timeEntriesRate.reduce(
            (acc, cur) => acc + cur.amount,
            0,
        );
        const tax = req.body.tax || 0;
        const total = Math.round((subtotal + tax) * 100) / 100;

        // round to 2 decimal places
        const roundedTotal = Math.round(total * 100) / 100;

        // create Bill
        const newBill = new Bill({
            case: caseDoc._id,
            client: caseDoc.client._id,
            generatedBy: userId,
            subtotal,
            tax,
            total,
            status: "draft",
            notes,
            dueDate,
            timeEntriesRate, // ✅ actually assign here
            issuedAt: new Date(),
        });

        await newBill.save();

        console.log("new Bill generated : ", newBill);
        res.status(201).json(newBill);
    } catch (error) {
        console.error("Error creating bill:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
