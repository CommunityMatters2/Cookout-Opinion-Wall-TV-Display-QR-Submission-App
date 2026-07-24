// Edit this file to rebrand the whole app (title, tagline, colors) — no other files need to change.
export const siteConfig = {
  eventTitle: "CM2 Summer Cookout",
  tagline: "Tell us what you think! 🌭☀️",
  confirmationMessage: "Thanks! Your message just hit the big screen 🎉",

  // Used only on share surfaces (OG/Twitter meta tags, the share button's
  // pre-written text) — the on-page hero keeps the "CM2 Summer Cookout" name.
  shareTitle: "Community Voice: Shape Poughkeepsie",
  shareText:
    "I just helped shape Poughkeepsie's next community center at the CM2 Summer Cookout! Add your voice 👉",
  colors: {
    background: "#fff4dd",
    accent: "#ff6b35",
    text: "#2b1d0e",
    cardBackground: "#ffffff",
  },
  maxNameLength: 40,
  maxMessageLength: 200,

  // Community Matters 2 branding — pulled from CM2's own materials, used to
  // promote the org throughout the survey + display wall flow.
  cm2: {
    orgName: "Community Matters 2, Inc.",
    logo: "/cm2/logo.png",
    heroPhoto: "/cm2/hero-cookout.jpg",
    mission: "Every Child Should Have A Chance To Have A Chance",
    surveyIntroTitle: "Help Us Build Poughkeepsie's Next Community Center",
    surveyIntroBody:
      "Before you post to the big screen, CM2 needs 60 seconds of your brain. Answer a few quick questions about the community center we're planning for Poughkeepsie.",
    impactFact: "Every $1 invested in youth programming saves $3–$12 in future community costs.",
    address: "50 N. Hamilton St, Poughkeepsie, NY 12601",
    phone: "(315) 275-3087",
    website: "communitymatters2.org",
    donateUrl: "https://www.communitymatters2.org/checkout/donate?donatePageId=5f36cf18417b335f08ae083f",
    social: {
      facebook: "https://facebook.com/communitymatters2",
      instagram: "https://instagram.com/communitymatters2",
      tiktok: "https://tiktok.com/@communitymatters2",
    },
    // Secondary accent colors sampled from CM2's own presentation deck —
    // used sparingly to tie the survey chips + display wall back to their brand.
    palette: {
      teal: "#1E9FB3",
      green: "#43A75B",
      purple: "#8452D9",
      gold: "#F5A623",
      navy: "#0B2239",
    },
    // Verified stats from CM2's "Impact By The Numbers" deck — shown on the display wall.
    stats: [
      { value: "1,000+", label: "Youth Served" },
      { value: "10,000", label: "Meals Delivered" },
      { value: "$470K+", label: "Youth Employment Invested" },
      { value: "70+", label: "Collaborations & Partnerships" },
    ],
    // Rotating hype lines for the display wall's animated text panel.
    hypeLines: [
      { headline: "Every voice makes Poughkeepsie stronger.", sub: "Thank you for showing up tonight. 💪" },
      { headline: "300+ neighbors. One community.", sub: "Your opinion is shaping what comes next." },
      { headline: "Every Child Should Have A Chance To Have A Chance.", sub: "— L'Quette Taylor, Founder & CEO" },
      { headline: "$1 invested in youth saves $3–$12 down the road.", sub: "That's the power of showing up for kids." },
      { headline: "You're helping build Poughkeepsie's next Community Center.", sub: "Scan. Share. Shape the future." },
      { headline: "1,000+ youth served and counting.", sub: "Let's keep that number growing. 🌟" },
    ],
  },
};
