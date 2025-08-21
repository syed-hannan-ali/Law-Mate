const { Server } = require("socket.io");
// const jwt = require("jsonwebtoken");
const Message = require("@models/message.model");

function initSocket(server, options = {}) {
    const io = new Server(server, {
        cors: { origin: options.corsOrigin || "*" },
        pingTimeout: 30000,
    });

    io.on("connection", (socket) => {
        console.log("User Connected");
        console.log(`Socket connected: ${socket.id}`);

        socket.on("joinCase", async ({ caseId }, ack) => {
            try {
                socket.join(`case:${caseId}`);
                if (ack)
                    ack({
                        ok: true,
                        message: `Successfully Joined room (case:${caseId})`,
                    });
            } catch (err) {
                if (ack) ack({ ok: false, error: err.message });
            }
        });

        socket.on("sendMessage", async ({ caseId, message }) => {
            console.log("Received message:", message);

            // save the message in the schema
            const newMessage = new Message({
                caseId,
                sender: message.sender._id,
                body: message.body,
                createdAt: message.createdAt,
            });
            console.log("New message saved:", newMessage);
            await newMessage.save();

            // Broadcast to everyone in the case room (including sender)
            io.to(`case:${caseId}`).emit("newMessage", {
                message,
                caseId,
                timestamp: new Date(),
            });
        });

        // socket.on("sendMessage", async (data, ack) => {
        //     // data: { caseId, body }
        //     try {
        //         const { caseId, body } = data;
        //         if (!caseId || !body || typeof body !== "string")
        //             throw new Error("Invalid payload");
        //         // server-side authorization
        //         const allowed = await authorizeCaseAccess(uid, caseId);
        //         if (!allowed) throw new Error("Not authorized for case");

        //         const msg = await Message.create({
        //             caseId,
        //             sender: uid,
        //             body: body.trim(),
        //         });

        //         const populated =
        //             (await msg
        //                 .populate("sender", "username email")
        //                 .execPopulate?.()) || msg;
        //         // emit to everyone viewing the case
        //         io.to(`case:${caseId}`).emit("newMessage", populated);

        //         if (ack) ack({ ok: true, message: populated });
        //     } catch (err) {
        //         if (ack) ack({ ok: false, error: err.message });
        //     }
        // });

        // socket.on("messageRead", async ({ messageId }, ack) => {
        //     try {
        //         if (!messageId) throw new Error("messageId required");
        //         const m = await Message.findById(messageId);
        //         if (!m) throw new Error("Message not found");
        //         // check if user can view the case
        //         const allowed = await authorizeCaseAccess(uid, m.caseId);
        //         if (!allowed) throw new Error("Not authorized for case");

        //         const already = m.receipts.some(
        //             (r) => String(r.user) === String(uid),
        //         );
        //         if (!already) {
        //             m.receipts.push({ user: uid, readAt: new Date() });
        //             await m.save();
        //         }

        //         // notify sender (if connected)
        //         io.to(`user:${m.sender}`).emit("receiptUpdate", {
        //             messageId: m._id.toString(),
        //             userId: uid,
        //             readAt: new Date(),
        //         });

        //         if (ack) ack({ ok: true });
        //     } catch (err) {
        //         if (ack) ack({ ok: false, error: err.message });
        //     }
        // });

        // socket.on("leaveCase", ({ caseId }) => {
        //     socket.leave(`case:${caseId}`);
        // });

        socket.on("disconnect", () => {
            // console.log(`Socket disconnected ${socket.id}`);
            console.log("User Disconnected");
        });
    });

    return io;
}

module.exports = { initSocket };
