// Structured content mined from CM2's own presentation decks:
//   - "CM2 Community Impact Presentation (4).pdf"
//   - "Summer camp Presentation 2026.pdf"
// Both live in public/ as downloadable source material. Extracted via pdftotext
// (poppler's pdftoppm renderer isn't available in this environment, but the text
// layer in both decks is clean). This is the single source of truth for the
// display wall's Impact Dashboard / Programs Spotlight / Community Voice scenes.

export const founder = {
  name: "L'Quette Taylor",
  role: "Founder & CEO, CM2",
  tagline: "Construction Project Manager · Community Leader & Speaker",
  bio: "Founded Community Matters 2, Inc. in 2018 at 50 N. Hamilton Street, Poughkeepsie — growing it into a trusted institution for youth empowerment, family support, and neighborhood strengthening. Career background as a Construction Project Manager on landmark regional projects including Nyack Hospital and the Moynihan Train Hall Renovation.",
  awards: [
    "Community Builder Award",
    "Richard K. Wagner Inclusive Champion Award",
    "Black Achievers Award",
    "2020 — 40 Under 40 Honoree",
    "NY State Senate Proclamation",
    "NY State Assembly Recognition",
  ],
};

export const missionQuote = {
  headline: "Every Child Should Have A Chance To Have A Chance.",
  attribution: "L'Quette Taylor, Founder & CEO",
};

export const missionStatement =
  "Our mission is to initiate communal growth by organizing events and establishing programs with local organizations for residents and youth with common goals that sparks community engagement.";

export type TimelineMilestone = {
  year: string;
  title: string;
  items: string[];
};

export const growthTimeline: TimelineMilestone[] = [
  {
    year: "2018",
    title: "Start of CM2",
    items: ["Sky Works Drones & Coding", "H.O.O.K Mentorship", "That's So Pough", "300+ Youth", "Harvard Summer Institute"],
  },
  {
    year: "2019",
    title: "Community Growth",
    items: ["City of Poughkeepsie Proclamation", "Newburgh Armory Mentorship", "Think Out of Bounds Urban Planning Program"],
  },
  {
    year: "2020",
    title: "COVID Response",
    items: ["Breakfast Matters 2 Poughkeepsie", "10,000 meals served during COVID-19"],
  },
  {
    year: "2021–23",
    title: "Programs Expand",
    items: ["Right Way 2 PK", "Etiquette & Spice Masterclass", "MBK Youth Leadership", "I Got Game League", "PK Arts Empowerment"],
  },
  {
    year: "2024",
    title: "Grand Opening",
    items: ["Extraordinary Youth Summer Camp", "11th Community Cleanup", "Swim With A Friend Program", "Year-Long Employment Programs (DCWIB)"],
  },
  {
    year: "2025",
    title: "Future Vision",
    items: ["Immersive after-school program for youth ages 13–19"],
  },
];

export type ImpactNumber = { value: string; label: string; detail?: string };

// "Impact By The Numbers" — verified stats from the Community Impact deck.
export const impactNumbers: ImpactNumber[] = [
  { value: "1,000+", label: "Youth Served", detail: "Direct program participants" },
  { value: "10,000", label: "Meals Delivered", detail: "Let's Feed PK · COVID-19 Response" },
  { value: "$350K+", label: "Youth Employment Invested", detail: "OTDA YEP & SYEP programs" },
  { value: "70+", label: "Collaborations & Partnerships" },
  { value: "13", label: "City-Wide Cleanups & Events" },
  { value: "2,000+", label: "Cleanup Volunteers", detail: "Since 2018 across all events" },
  { value: "2 Tons", label: "Trash Removed" },
  { value: "12", label: "Youth Programs Developed" },
  { value: "3,000+", label: "Community Service Hours" },
  { value: "15,000+", label: "Workforce Training & Youth Employment Hours" },
  { value: "2,500+", label: "Water Bottles — Puerto Rico Relief" },
  { value: "500+", label: "AI & Technical Training Hours" },
  { value: "8", label: "Years of Impact" },
];

function chunkInto<T>(items: T[], pageCount: number): T[][] {
  const size = Math.ceil(items.length / pageCount);
  const pages: T[][] = [];
  for (let i = 0; i < items.length; i += size) pages.push(items.slice(i, i + size));
  return pages;
}

// The 13 impact numbers split into 3 balanced groups, so the Impact Stats scene shows
// one group per rotation visit instead of cramming all of them onto one screen.
export const impactNumberPages: ImpactNumber[][] = chunkInto(impactNumbers, 3);

export const photoMomentCaption = "CM2 Summer Cookout · Poughkeepsie, NY";

export type Program = { name: string; ageRange?: string; description?: string };

// "Projection - 2026 · Programs Expand"
export const programs2026: Program[] = [
  { name: "Spark Academy", ageRange: "Ages 7–12" },
  { name: "IGNITE Academy", ageRange: "Ages 13–19" },
  { name: "Extraordinary Youth Summer Camp" },
  { name: "TEE TIME Golf Program" },
  { name: "Swim With A Friend" },
  { name: "NextGen Career Connection" },
  { name: "Pathways to Workforce Success Initiative", ageRange: "Ages 18–24" },
  { name: "CM2 Talk Podcast" },
];

export const yearRoundHours = {
  schoolYear: {
    label: "School Year",
    summary: "Serves youth ages 7–24 · 500+ dedicated impact hours per child",
    breakdown: [
      { hours: "120 Hours", label: "Youth Development & Training" },
      { hours: "150 Hours", label: "Real Work Experience" },
      { hours: "140 Hours", label: "Social & Emotional Learning" },
      { hours: "100 Hours", label: "Community Service" },
    ],
  },
  summerTime: {
    label: "Summer Time",
    summary: "Serves 200+ youth ages 7–19 · 300+ dedicated impact hours per child",
    breakdown: [
      { hours: "100 Hours", label: "STEM Enrichment" },
      { hours: "150 Hours", label: "Real Work Experience" },
      { hours: "100+ Hours", label: "Social & Emotional Learning" },
      { hours: "200 Hours", label: "Outside Recreational Time" },
    ],
  },
};

// "Signature Programs · 6 Core Programs"
export const signaturePrograms: Program[] = [
  {
    name: "Swim With A Friend",
    description: "Marist College + Mid-Hudson Aquatics — water safety, swimming skills & aquatic confidence for youth.",
  },
  {
    name: "TEE TIME! Golf Program",
    description: "Character building through golf & discipline — life lessons, focus, and sportsmanship on the course.",
  },
  {
    name: "Etiquette & Spice Masterclass",
    description: "Youth professionalism, manners & life skills — culinary arts paired with professional etiquette training.",
  },
  {
    name: "Extraordinary Youth Summer Camp",
    description: "Hands-on science, tech & creativity learning — sports & recreation, STEAM, arts & crafts, swimming, VR, field trips.",
  },
  {
    name: "NexGen Career Connections",
    description: "Teen workforce development & internship pipeline — resume building, interview prep, real-world internships.",
  },
  {
    name: "IGNITE Academy",
    description: "Robotics & coding challenges, 3D printing & design projects, team building & leadership games, arts/media/innovation labs, field trips.",
  },
];

// Summer Camp deck — "By The Numbers" (confirmed program records 2023–2025).
export const summerCamp = {
  cadence: "4 Years · 6 Weeks/Year · 5 Days/Week",
  ageRange: "Ages 6–19",
  stats: [
    { value: "272", label: "Total Campers Served" },
    { value: "$97,960", label: "Total Program Funding", detail: "Confirmed 2023–2025" },
    { value: "800+", label: "Total Summer Programming Hours", detail: "6.5 hrs/day avg" },
    { value: "1,400", label: "Meals Served" },
    { value: "212+", label: "Field Trip Hours" },
    { value: "6,125+", label: "Workforce Development Hours" },
    { value: "500+", label: "STEAM Enrichment Hours" },
    { value: "4,000+", label: "Youth Employment Hours" },
    { value: "750+", label: "Youth Served", detail: "Ages 6–19" },
    { value: "108", label: "Swimming Hours" },
    { value: "20+", label: "Total Field Trips" },
    { value: "5", label: "Staff Training Types" },
  ],
};

// "The Return On Investment" — every $1 invested in summer programming.
export const roi = {
  headline: "Every $1 invested in summer programming saves $3–$12 in future remediation, justice & social service costs.",
  breakdown: [
    { value: "$7 saved", label: "Academic Remediation" },
    { value: "$12 saved", label: "Juvenile Justice Costs" },
    { value: "$5 saved", label: "Social Services" },
    { value: "$4 saved", label: "Healthcare Prevention" },
  ],
  source: "Sources: WSIPP · Heller (2014), Science 346 · Kuklinski et al., NCBI · J-PAL / Poverty Action Lab · OJJDP · Brookings Institution (2022)",
};

// "The 6 Pillars of a High-Quality Summer Program" (Weikart Center, Wallace Foundation & NWEA research).
export const qualityPillars = [
  { name: "Trained & Caring Staff", stat: "#1 factor in youth outcomes" },
  { name: "Safe & Supportive Space", stat: "2× more likely to thrive" },
  { name: "Intentional Learning Goals", stat: "3× stronger outcomes" },
  { name: "Youth Voice & Engagement", stat: "40% attendance boost" },
  { name: "Peer & Mentor Connections", stat: "43% less risk behavior" },
  { name: "Consistent Attendance", stat: "5+ weeks for lasting impact" },
];

export const qualityPillarsQuote = {
  headline: "Only 35% of youth are in high-quality programs. CM2 is committed to increasing that percentage.",
  attribution: "National Study of Youth Programs",
};

// "Why Summer Matters" — quick facts shown as an icon + stat grid on the display wall.
export const summerWhyItMatters = [
  { key: "learningLoss", value: "2–3 Mo", label: "Of learning lost each summer without engagement" },
  { key: "reducedRisk", value: "43%", label: "Less juvenile crime in areas with strong summer programs" },
  { key: "workingParents", value: "72%", label: "Of working parents depend on summer programs to work" },
  { key: "workforceReady", value: "1 in 3", label: "Teens in summer programs enter the workforce ready" },
  { key: "lessIsolation", value: "60%", label: "Less isolation & anxiety among enrolled youth" },
];

export const summerInfrastructureLine = "Summer should not be an extra — it has to be Infrastructure.";
