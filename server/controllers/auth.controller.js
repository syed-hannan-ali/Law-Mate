const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("@models/user.model.js");
const logAudit = require("@middleware/auditLog.middleware.js");
require("dotenv").config();

const signingKey = process.env.JWT_SIGNING_KEY;

exports.updateToken = (req, res) => {
    // console.log("🔍 From req.cookies:", req.cookies);

    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) return res.sendStatus(401);

    jwt.verify(refreshToken, signingKey, (err, user) => {
        console.log(err, user);
        if (err) return res.sendStatus(403);

        const newAccessToken = jwt.sign(
            { id: user.id, role: user.role },
            signingKey,
            { expiresIn: "1h" },
        );

        console.log("✅ New access token generated:", newAccessToken);

        res.json({ accessToken: newAccessToken });
    });
};

exports.signupUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        let existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ username, email, hashedPassword });

        await newUser.save();

        await logAudit({
            user: newUser,
            action: "USER_SIGNUP",
            target: "User",
            description: `User ${username} signed up.`,
            metadata: { email },
        });

        console.log("User saved");

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Registration failed", error: error });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res
                .status(400)
                .json({ error: "Email and password are required." });
        }
        const user = await User.findOne({ email })
            .select("+hashedPassword")
            .populate("firm");
        if (!user) {
            return res.status(401).json({ error: "User not Found" });
        }
        const passwordMatch = await bcrypt.compare(
            password,
            user.hashedPassword,
        );
        if (!passwordMatch) {
            return res
                .status(401)
                .json({ error: "Authentication failed , Incorrect Password" });
        }

        const token = jwt.sign(
            { userId: user._id, userRole: user.role },
            signingKey,
            {
                expiresIn: "1h",
            },
        );

        const refreshToken = jwt.sign(
            { userId: user._id, userRole: user.role },
            signingKey,
            { expiresIn: "7d" }, // ⏳ longer expiry
        );

        // console.log("Token generated: ", token);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false, // true in production (HTTPS)
            sameSite: "Lax",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });



        

        let hasActiveSubscription = user.firm?.subscription?.isActive || false;

        console.log("Firm has active subscription:", hasActiveSubscription);

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.username,
                role: user.role,
                hasActiveSubscription,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Login failed", error: error });
    }
};

exports.googleCallback = async (req, res) => {
    console.log("Google callback received with user: ", req.user);
    const email = req.user.emails[0].value;
    let user = await User.findOne({ email });

    if (!user) {
        console.log("User not found, creating new user");
        const newUser = new User({
            username: req.user.displayName,
            email: email,
            hashedPassword: "",
        });
        user = await newUser.save();
        console.log("New user created: ", newUser);
    }

    const token = jwt.sign(
        { userId: user._id, userRole: user.role },
        signingKey,
        {
            expiresIn: "1h",
        },
    );

    const refreshToken = jwt.sign(
        { userId: user._id, userRole: user.role },
        signingKey,
        { expiresIn: "7d" }, // ⏳ longer expiry
    );

    // console.log("Token generated: ", token);

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false, // true in production (HTTPS)
        sameSite: "Lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // console.log("Token generated: ", token);

    const userPayload = {
        id: user._id,
        email: user.email,
        name: user.username,
        role: user.role,
    };

    const redirectUrl = `http://localhost:5173/oauth-success?user=${encodeURIComponent(
        JSON.stringify(userPayload),
    )}&token=${token}`;

    res.redirect(redirectUrl);
};
