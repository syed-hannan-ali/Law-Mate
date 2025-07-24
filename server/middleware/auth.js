const passport = require("passport");
require("dotenv").config();

const GOOGLE_CLIENT_ID = process.env.OAuth_Google_Client_ID;
const GOOGLE_CLIENT_SECRET = process.env.OAuth_Google_Client_Secret;

const GoogleStrategy = require("passport-google-oauth2").Strategy;

passport.use(
    new GoogleStrategy(
        {
            clientID: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:3000/auth/google/callback",
        },
        function (accessToken, refreshToken, profile, done) {
            return done(null,profile);
        },
    ),
);
passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});