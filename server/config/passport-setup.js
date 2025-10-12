import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LinkedInStrategy } from 'passport-linkedin-oauth2';
import userModel from '../model/user-model.js';
import logger from './logger.js';

passport.use(

  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback',
      scope: ['profile', 'email'],
    },

    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await userModel.findOne({ googleId: profile.id });
        if (existingUser) {
          logger.info(`[GoogleAuth] Existing user found by Google ID: ${profile.emails[0].value}`);
          return done(null, existingUser);
        }

        const userByEmail = await userModel.findOne({ userEmail: profile.emails[0].value });
        if (userByEmail) {
          logger.info(`[GoogleAuth] Linking Google ID to existing email: ${userByEmail.userEmail}`);
          userByEmail.googleId = profile.id;
          await userByEmail.save();
          return done(null, userByEmail);
        }

        logger.info(`[GoogleAuth] Creating new user: ${profile.emails[0].value}`);
        const newUser = await new userModel({
          googleId: profile.id,
          userName: profile.displayName,
          userEmail: profile.emails[0].value,
          verified: true, 
        }).save();
        
        return done(null, newUser);
      } catch (error) {
        logger.error(`[GoogleAuth][Error] ${error.message}`);
        return done(error, null);
      }
    }
  )
);


passport.use(
  new LinkedInStrategy(
    {
      clientID: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      callbackURL: '/api/auth/linkedin/callback',
      scope: ['openid', 'profile', 'email'], // Use OIDC scopes
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // 1. Check if user exists via LinkedIn ID
        const existingUser = await userModel.findOne({ linkedinId: profile.id });
        if (existingUser) {
          logger.info(`[LinkedInAuth] Existing user found by LinkedIn ID: ${profile.emails[0].value}`);
          return done(null, existingUser);
        }

        // 2. Check if user exists via email
        const userByEmail = await userModel.findOne({ userEmail: profile.emails[0].value });
        if (userByEmail) {
          logger.info(`[LinkedInAuth] Linking LinkedIn ID to existing email: ${userByEmail.userEmail}`);
          userByEmail.linkedinId = profile.id;
          await userByEmail.save();
          return done(null, userByEmail);
        }

        // 3. Create a new user
        logger.info(`[LinkedInAuth] Creating new user: ${profile.emails[0].value}`);
        const newUser = await new userModel({
          linkedinId: profile.id,
          userName: profile.displayName,
          userEmail: profile.emails[0].value,
          verified: true,
        }).save();
        
        return done(null, newUser);
      } catch (error) {
        logger.error(`[LinkedInAuth][Error] ${error.message}`);
        return done(error, null);
      }
    }
  )
);