const mongoose = require("mongoose");
const { Schema } = mongoose;


const MessageSchema = new Schema(
    {
        caseId: {
            type: Schema.Types.ObjectId,
            ref: "Case",
            required: true,
            index: true,
        },
        sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
        body: { type: String, required: true },
        isSystem: { type: Boolean, default: false },
        edited: { type: Boolean, default: false },
    },
    { timestamps: true },
);

module.exports = mongoose.model("Message", MessageSchema);
