
const Firm = require('@models/firm.model');
async function canAccessFeature(firmId, featureKey) {
    const firm = await Firm.findById(firmId).populate('subscription.plan');
    if (!firm?.subscription?.isActive) return false;

    const feature = firm.subscription.plan.features.find(f => f.key === featureKey);
    return feature?.value || false;
}

module.exports = { canAccessFeature };
