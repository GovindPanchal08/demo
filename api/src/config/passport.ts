import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile as GoogleProfile,
} from "passport-google-oauth20";
import {
  Strategy as GitHubStrategy,
  Profile as GitHubProfile,
} from "passport-github2";
import {
  Strategy as FacebookStrategy,
  Profile as FacebookProfile,
} from "passport-facebook";
const oAuthConfig = {
  google: { clientID: "", clientSecret: "", callbackURL: "" },
  github: { clientID: "", clientSecret: "", callbackURL: "" },
  facebook: { clientID: "", clientSecret: "", callbackURL: "" },
} as const;

type ProviderName = keyof typeof oAuthConfig;

// Type for OAuth configuration
interface OAuthProviderConfig {
  clientID: string;
  clientSecret: string;
  callbackURL: string;
}

// Type for all providers
interface OAuthConfig {
  [providerName: string]: OAuthProviderConfig;
}

// Type-safe helper function to initialize a provider
function initOAuthProvider<
  T extends GoogleProfile | GitHubProfile | FacebookProfile
>(
  providerName: ProviderName,
  Strategy: new (
    options: any,
    verify: (
      accessToken: string,
      refreshToken: string,
      profile: T,
      done: any
    ) => void
  ) => passport.Strategy
) {
  const config = oAuthConfig[providerName];
  if (!config) return;

  passport.use(
    new Strategy(
      {
        clientID: config.clientID,
        clientSecret: config.clientSecret,
        callbackURL: config.callbackURL,
      },
      (
        accessToken: string,
        refreshToken: string,
        profile: T,
        done: (err: any, user?: any) => void
      ) => {
        // TODO: Find or create the user in your DB
        return done(null, profile);
      }
    )
  );
}

// Initialize providers
initOAuthProvider("google", GoogleStrategy);
initOAuthProvider("github", GitHubStrategy);
initOAuthProvider("facebook", FacebookStrategy);

// Serialize / deserialize user
passport.serializeUser((user: any, done: Function) => done(null, user));
passport.deserializeUser((obj: any, done) => done(null, obj));

export default passport;
