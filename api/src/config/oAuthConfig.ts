
export = {
    google: {
        clientID: process.env.GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || "YOUR_GOOGLE_CLIENT_SECRET",
        callbackURL: "/auth/google/callback",
    },
    github: {
        clientID: process.env.GITHUB_CLIENT_ID || "YOUR_GITHUB_CLIENT_ID",
        clientSecret: process.env.GITHUB_CLIENT_SECRET || "YOUR_GITHUB_CLIENT_SECRET",
        callbackURL: "/auth/github/callback",
    },
    facebook: {
        clientID: process.env.FACEBOOK_CLIENT_ID || "YOUR_FACEBOOK_CLIENT_ID",
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "YOUR_FACEBOOK_CLIENT_SECRET",
        callbackURL: "/auth/facebook/callback",
    },
    // Add more providers here
};
