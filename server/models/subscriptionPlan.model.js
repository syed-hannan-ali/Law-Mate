const mongoose = require("mongoose");
const { Schema } = mongoose;

const subscriptionPlanSchema = new Schema({
    name: { type: String, required: true, unique: true }, // e.g. "Basic", "Pro", "Enterprise"
    price: { type: Number, required: true },
    durationInDays: { type: Number, required: true }, // e.g. 30 for monthly
    features: [
        {
            key: { type: String }, // e.g. "maxCases", "taskManagement", "auditLogs"
            value: Schema.Types.Mixed, // can be number or boolean
        }
    ],
    isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model("SubscriptionPlan", subscriptionPlanSchema);
    