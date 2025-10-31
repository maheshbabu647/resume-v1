import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LinkedInStrategy } from 'passport-linkedin-oauth2';
import userModel from '../model/user-model.js';
import logger from './logger.js';
import axios from 'axios';

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
      scope: ['openid', 'profile', 'email'],
      state: false,
      skipUserProfile: true,
    },
    async (accessToken, refreshToken, _ignoredProfile, done) => {
      try {
        // Fetch OpenID Connect userinfo, which includes sub (id), name and email
        const userinfoResp = await axios.get('https://api.linkedin.com/v2/userinfo', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const info = userinfoResp.data || {};
        const linkedinId = info.sub;
        const primaryEmail = info.email || info.email_verified && info.email ? info.email : null;
        const displayName = info.name || `${info.given_name || ''} ${info.family_name || ''}`.trim() || 'LinkedIn User';

        if (!linkedinId) {
          throw new Error('LinkedIn OIDC: missing sub');
        }
        if (!primaryEmail) {
          throw new Error('LinkedIn OIDC: email not available');
        }

        const existingUser = await userModel.findOne({ linkedinId });
        if (existingUser) {
          logger.info(`[LinkedInAuth] Existing user by LinkedIn ID: ${primaryEmail}`);
          return done(null, existingUser);
        }

        const userByEmail = await userModel.findOne({ userEmail: primaryEmail });
        if (userByEmail) {
          logger.info(`[LinkedInAuth] Linking LinkedIn ID to existing email: ${userByEmail.userEmail}`);
          userByEmail.linkedinId = linkedinId;
          await userByEmail.save();
          return done(null, userByEmail);
        }

        const newUser = await new userModel({
          linkedinId,
          userName: displayName,
          userEmail: primaryEmail,
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