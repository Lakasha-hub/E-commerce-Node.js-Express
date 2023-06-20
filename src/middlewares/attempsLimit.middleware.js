export const attempsLimitReached = async (req, res, next) => {
    if (req.session.messages.length > 4) return res.status(400).json({ error: "Attempts limit reached" });
    next()
}