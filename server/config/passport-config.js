const passport = require('passport');
const User = require("../models/userSchema")
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const generateRandomPassword  = require("../utils/generateRandomPassword")

passport.use(
  new GoogleStrategy(
    {
      clientID: "867213969897-ubljtpfm9pco82574gcu9b0mvcv4nbj3.apps.googleusercontent.com",
      clientSecret:"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",
      callbackURL: "/auth/google/callback", 
    },
    async (accessToken, refreshToken, profile, done) => {
      const googleEmail = profile.emails[0].value

      console.log(googleEmail)
      const existingUser = await User.findOne({email:googleEmail});
      if(existingUser){

        if(existingUser.signedUpWithCustomMethod){
          existingUser.googleId = profile.id
          await existingUser.save();
          return done(null, existingUser)
        }
        return done(null, existingUser) 
      }

      const user =await User.create({
        googleId:profile.id,
        username:profile.displayName,
        email:googleEmail,
        pic:profile.photos[0].value,
        verified:true,
        password:generateRandomPassword(6)
      })

      done(null,user)
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = passport