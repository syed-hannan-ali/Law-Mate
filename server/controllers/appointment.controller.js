const Appointment = require("@models/appointment.model.js");
const logAudit = require("@middleware/auditLog.middleware.js");
const User = require("@models/user.model.js");
const { google } = require("googleapis");
const { meet } = require("googleapis/build/src/apis/meet");

console.log(logAudit);

exports.createAppointment = async (req, res) => {
    console.log("Creating appointment with data:", req.body);

    console.log("User ID from request:", req.userId);

    const user = await User.findById(req.userId).select("+googleRefreshToken");
    const appointment = new Appointment({
        ...req.body,
        createdBy: req.userId,
    });

    const meetingBegin = new Date(req.body.date);
    const meetingEnd = new Date(req.body.date);
    meetingEnd.setMinutes(meetingBegin.getMinutes() + req.body.duration);

    const event = {
        summary: req.body.title,
        description: req.body.description,
        startDateTime: meetingBegin,
        endDateTime: meetingEnd,
        attendees: req.body.participants.map((participant) => ({
            email: participant.email,
        })),
        timezone: req.body.timezone || "Asia/Karachi",
    };

    console.log("Event details:", event);

    try {
        const { eventLink, meetLink } = await createGoogleMeetEvent(
            user,
            event,
        );
        appointment.meetingUrl = eventLink;

        const saved = await appointment.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getAllAppointments = async (req, res) => {
    console.log("Fetching all appointments");
    try {
        const appointments = await Appointment.find().sort({
            date: 1,
        }); // upcoming first
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAppointmentById = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id).populate(
            "participants createdBy",
            "name email",
        );
        if (!appointment || appointment.isDeleted)
            return res.status(404).json({ error: "Appointment not found" });

        res.json(appointment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateAppointment = async (req, res) => {
    try {
        const updated = await Appointment.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            req.body,
            { new: true },
        );

        if (!updated) return res.status(404).json({ error: "Not found" });

        // console.log(req);
        const user = await User.findById(req.userId);

        await logAudit({
            user: user,
            action: "UPDATE_APPOINTMENT",
            target: "Appointment",
            description: `Case ${req.params.id} was updated`,
            metadata: { updatedFields: req.body },
        });

        console.log("Logged");

        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteAppointment = async (req, res) => {
    try {
        const deleted = await Appointment.findByIdAndUpdate(
            req.params.id,
            { isDeleted: true },
            { new: true },
        );
        if (!deleted) return res.status(404).json({ error: "Not found" });

        const user = await User.findById(req.userId);

        // Log audit
        await logAudit({
            user: user,
            action: "DELETE_APPOINTMENT",
            target: "Appointment",
            description: `Appointment ${deleted._id} was marked as deleted`,
            metadata: { appointmentId: deleted._id },
        });

        res.json({ message: "Appointment deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

async function createGoogleMeetEvent(user, eventDetails) {
    try {
        const oAuth2Client = new google.auth.OAuth2(
            process.env.OAuth_Google_Client_ID,
            process.env.OAuth_Google_Client_Secret,
            process.env.GOOGLE_REDIRECT_URI, // can be anything valid, not used here
        );

        console.log("user : ", user);

        console.log("OAuth2 client created");
        // Set credentials from stored refresh token
        oAuth2Client.setCredentials({
            refresh_token: user.googleRefreshToken,
        });

        console.log("OAuth2 client credentials set");

        const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

        console.log("Google Calendar API client created");

        // Event object
        const event = {
            summary: eventDetails.summary, // Title of the meeting
            description: eventDetails.description, // Optional description
            start: {
                dateTime: eventDetails.startDateTime, // e.g., "2025-08-16T10:00:00+05:00"
                timezone: eventDetails.timezone,
            },
            end: {
                dateTime: eventDetails.endDateTime, // e.g., "2025-08-16T11:00:00+05:00"
                timezone: eventDetails.timezone,
            },
            attendees: eventDetails.attendees,
            conferenceData: {
                createRequest: {
                    requestId: `meet-${Date.now()}`,
                    conferenceSolutionKey: { type: "hangoutsMeet" },
                },
            },
        };

        console.log("Event object created:", event);

        // Insert event with Google Meet link
        const response = await calendar.events.insert({
            calendarId: "primary",
            resource: event,
            conferenceDataVersion: 1,
            sendUpdates: "all",
        });

        console.log("Meeting created:", response.data.htmlLink);
        console.log(
            "Google Meet link:",
            response.data.conferenceData.entryPoints[0].uri,
        );

        return {
            eventLink: response.data.htmlLink,
            meetLink: response.data.conferenceData.entryPoints[0].uri,
        };
    } catch (error) {
        console.error("Error creating Google Meet event:", error);
        throw error;
    }
}
