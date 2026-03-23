// ─── Scripted Conversation Flow for Sierra Finance ───
// No AI backend, all responses are pre-authored and fuzzy-matched

export type QuickReply = {
  label: string;
  value: string;
  icon?: string; // boxicon class name e.g. "bx bxs-truck"
};

export type CardType =
  | "business-info"
  | "funding-estimate"
  | "progress"
  | "customer-credit"
  | "document-checklist"
  | "application-summary";

export type CardData = {
  type: CardType;
  data: Record<string, unknown>;
};

export type BotResponse = {
  text: string;
  conclusion?: string;
  card?: CardData;
  quickReplies?: QuickReply[];
  nextStep?: string;
};

export type ConversationStep = {
  id: string;
  triggers: string[];
  response: BotResponse;
};

// ─── Bigram Fuzzy Matching (ported from generative-ui) ───
function bigrams(str: string): Set<string> {
  const s = str.toLowerCase().trim();
  const set = new Set<string>();
  for (let i = 0; i < s.length - 1; i++) {
    set.add(s.substring(i, i + 2));
  }
  return set;
}

function similarity(a: string, b: string): number {
  const bigramsA = bigrams(a);
  const bigramsB = bigrams(b);
  let intersection = 0;
  bigramsA.forEach((bg) => {
    if (bigramsB.has(bg)) intersection++;
  });
  return (2 * intersection) / (bigramsA.size + bigramsB.size) || 0;
}

export function findBestMatch(
  input: string,
  steps: ConversationStep[]
): ConversationStep | null {
  let bestScore = 0;
  let bestStep: ConversationStep | null = null;

  const normalized = input.toLowerCase().trim();

  for (const step of steps) {
    for (const trigger of step.triggers) {
      // Exact substring match
      if (normalized.includes(trigger.toLowerCase())) {
        return step;
      }
      // Fuzzy match
      const score = similarity(normalized, trigger);
      if (score > bestScore && score > 0.3) {
        bestScore = score;
        bestStep = step;
      }
    }
  }

  return bestStep;
}

// ─── The Conversation Steps ───
export const CONVERSATION_STEPS: ConversationStep[] = [
  // ── Step 1: Welcome / Greeting ──
  {
    id: "welcome",
    triggers: [
      "hello",
      "hi",
      "hey",
      "start",
      "get started",
      "begin",
      "help",
      "funding",
      "apply",
      "factor",
      "invoice",
    ],
    response: {
      text: "Welcome to Sierra Finance. I'll walk you through the entire process in just a few minutes. No paperwork, no waiting on hold.",
      conclusion:
        "Let's start with the basics. What's your company name and what industry are you in?",
      quickReplies: [
        { label: "Trucking company", value: "trucking company", icon: "bx bxs-truck" },
        { label: "Manufacturing", value: "manufacturing company", icon: "bx bx-building-house" },
        { label: "Construction", value: "construction company", icon: "bx bx-buildings" },
        { label: "Other industry", value: "other industry", icon: "bx bx-briefcase" },
      ],
    },
  },

  // ── Step 2: Trucking Company ──
  {
    id: "trucking",
    triggers: [
      "trucking",
      "freight",
      "transport",
      "carrier",
      "hauling",
      "logistics",
      "cdl",
      "truck",
    ],
    response: {
      text: "Trucking is one of our core specialties. We work with over 200 carriers across the Southwest. Let me pull up a quick profile based on typical trucking operations.",
      card: {
        type: "business-info",
        data: {
          companyName: "Your Trucking Co.",
          industry: "Trucking & Freight",
          icon: "truck",
          fields: [
            { label: "Industry", value: "Transportation & Logistics" },
            { label: "Avg Invoice Size", value: "$2,500 – $15,000" },
            { label: "Payment Terms", value: "Net 30–45 typical" },
            { label: "Advance Rate", value: "Up to 97%" },
          ],
        },
      },
      conclusion:
        "How much are you currently invoicing per month? This helps me estimate your funding.",
      quickReplies: [
        { label: "$10K – $50K/mo", value: "Invoicing $25,000/month" },
        { label: "$50K – $150K/mo", value: "Invoicing $100,000/month" },
        { label: "$150K+/mo", value: "Invoicing $200,000/month" },
      ],
    },
  },

  // ── Step 2b: Manufacturing ──
  {
    id: "manufacturing",
    triggers: [
      "manufacturing",
      "factory",
      "production",
      "fabricat",
      "assembly",
      "industrial",
    ],
    response: {
      text: "Manufacturing is a great fit for factoring because of the long payment cycles and steady receivables. We've funded everything from food processing to aerospace parts.",
      card: {
        type: "business-info",
        data: {
          companyName: "Your Manufacturing Co.",
          industry: "Manufacturing",
          icon: "factory",
          fields: [
            { label: "Industry", value: "Manufacturing & Production" },
            { label: "Avg Invoice Size", value: "$5,000 – $50,000" },
            { label: "Payment Terms", value: "Net 30–60 typical" },
            { label: "Advance Rate", value: "Up to 95%" },
          ],
        },
      },
      conclusion:
        "How much are you currently invoicing per month? This helps me estimate your funding.",
      quickReplies: [
        { label: "$25K – $75K/mo", value: "Invoicing $50,000/month" },
        { label: "$75K – $250K/mo", value: "Invoicing $150,000/month" },
        { label: "$250K+/mo", value: "Invoicing $350,000/month" },
      ],
    },
  },

  // ── Step 2c: Construction ──
  {
    id: "construction",
    triggers: [
      "construction",
      "contractor",
      "building",
      "subcontract",
      "general contractor",
      "plumbing",
      "electrical",
    ],
    response: {
      text: "Construction companies deal with some of the longest payment cycles in any industry. Factoring lets you fund your next project without waiting 60–90 days for the last one to pay.",
      card: {
        type: "business-info",
        data: {
          companyName: "Your Construction Co.",
          industry: "Construction",
          icon: "building",
          fields: [
            { label: "Industry", value: "Construction & Contracting" },
            { label: "Avg Invoice Size", value: "$10,000 – $100,000" },
            { label: "Payment Terms", value: "Net 45–90 typical" },
            { label: "Advance Rate", value: "Up to 93%" },
          ],
        },
      },
      conclusion:
        "How much are you currently invoicing per month? This helps me estimate your funding.",
      quickReplies: [
        { label: "$50K – $150K/mo", value: "Invoicing $100,000/month" },
        { label: "$150K – $500K/mo", value: "Invoicing $300,000/month" },
        { label: "$500K+/mo", value: "Invoicing $600,000/month" },
      ],
    },
  },

  // ── Step 2d: Other ──
  {
    id: "other-industry",
    triggers: [
      "other",
      "different",
      "service",
      "consulting",
      "staffing",
      "apparel",
      "food",
      "telecom",
      "government",
    ],
    response: {
      text: "We work with businesses across dozens of industries. If you have invoices from creditworthy customers, you're likely a great fit.",
      card: {
        type: "business-info",
        data: {
          companyName: "Your Business",
          industry: "General Business",
          icon: "briefcase",
          fields: [
            { label: "Industry", value: "Various Industries" },
            { label: "Avg Invoice Size", value: "Varies" },
            { label: "Payment Terms", value: "Net 30–60 typical" },
            { label: "Advance Rate", value: "Up to 95%" },
          ],
        },
      },
      conclusion:
        "How much are you currently invoicing per month? This helps me estimate your funding.",
      quickReplies: [
        { label: "$10K – $50K/mo", value: "Invoicing $25,000/month" },
        { label: "$50K – $150K/mo", value: "Invoicing $100,000/month" },
        { label: "$150K+/mo", value: "Invoicing $200,000/month" },
      ],
    },
  },

  // ── Step 3: Monthly Invoice Volume → Funding Estimate ──
  {
    id: "invoice-volume",
    triggers: [
      "invoicing",
      "monthly",
      "month",
      "revenue",
      "volume",
      "$25,000",
      "$50,000",
      "$100,000",
      "$150,000",
      "$200,000",
      "$300,000",
      "$350,000",
      "$600,000",
      "$10k",
      "$25k",
      "$50k",
      "$100k",
      "$150k",
    ],
    response: {
      text: "Based on your invoice volume, here's a preliminary funding estimate. These numbers are based on our standard advance rates, and your actual terms may be even better.",
      card: {
        type: "funding-estimate",
        data: {
          monthlyVolume: 100000,
          advanceRate: 95,
          estimatedFunding: 95000,
          feeRange: "1.5% – 3%",
          fundingSpeed: "Same day",
          metrics: [
            {
              label: "Monthly Invoices",
              value: "$100,000",
              icon: "receipt",
            },
            {
              label: "Advance Rate",
              value: "95%",
              icon: "percent",
              trend: "+2% vs industry avg",
            },
            {
              label: "Est. Same-Day Funding",
              value: "$95,000",
              icon: "zap",
              highlight: true,
            },
            {
              label: "Financing Fee",
              value: "1.5 – 3%",
              icon: "tag",
            },
          ],
        },
      },
      conclusion:
        "Now let's check your customers' credit. Who are your top 2-3 clients that you invoice most often?",
      quickReplies: [
        {
          label: "Large enterprise clients",
          value: "enterprise clients fortune 500",
        },
        {
          label: "Mid-size businesses",
          value: "mid-size business clients",
        },
        {
          label: "Government contracts",
          value: "government agency contracts",
        },
      ],
    },
  },

  // ── Step 4: Customer Credit Check ──
  {
    id: "customer-credit",
    triggers: [
      "enterprise",
      "fortune",
      "mid-size",
      "government",
      "agency",
      "client",
      "customer",
      "walmart",
      "amazon",
      "target",
    ],
    response: {
      text: "I ran a preliminary credit check on typical customers in your segment. This is what determines your approval because we look at your customers' creditworthiness, not yours.",
      card: {
        type: "customer-credit",
        data: {
          customers: [
            {
              name: "Acme Distribution Corp",
              creditScore: "A+",
              status: "approved",
              payHistory: "Excellent",
              avgPayDays: 28,
            },
            {
              name: "National Freight Partners",
              creditScore: "A",
              status: "approved",
              payHistory: "Good",
              avgPayDays: 34,
            },
            {
              name: "Regional Supply Co",
              creditScore: "B+",
              status: "review",
              payHistory: "Fair",
              avgPayDays: 45,
            },
          ],
        },
      },
      conclusion:
        "Two of three customers pass with flying colors. Let me show you what documents we'll need to finalize everything.",
      quickReplies: [
        { label: "Show me the documents", value: "what documents needed" },
        {
          label: "What about the B+ customer?",
          value: "tell me about the B+ review",
        },
      ],
    },
  },

  // ── Step 4b: B+ Customer Explanation ──
  {
    id: "b-plus-explain",
    triggers: ["b+", "review", "fair", "regional supply"],
    response: {
      text: "A B+ rating doesn't mean denial, it means we do a deeper look. Regional Supply Co has a fair payment history, averaging 45 days. We can still factor those invoices, potentially at a slightly adjusted advance rate (90-92% instead of 95%).",
      conclusion:
        "Want to see the full document checklist to get started?",
      quickReplies: [
        { label: "Show me the documents", value: "what documents needed" },
        {
          label: "Sounds good, let's proceed",
          value: "proceed with documents",
        },
      ],
    },
  },

  // ── Step 5: Document Checklist ──
  {
    id: "documents",
    triggers: ["document", "paperwork", "needed", "upload", "submit", "file", "proceed"],
    response: {
      text: "Here's everything we need. Most clients have these ready to go, and you can upload them right here when you're ready.",
      card: {
        type: "document-checklist",
        data: {
          documents: [
            {
              name: "Accounts Receivable Aging Report",
              status: "required",
              description: "Current AR aging showing outstanding invoices",
            },
            {
              name: "Sample Invoices (2-3)",
              status: "required",
              description: "Recent invoices from your top customers",
            },
            {
              name: "Business Tax ID (EIN)",
              status: "required",
              description: "IRS EIN confirmation letter or W-9",
            },
            {
              name: "Bank Statements (3 months)",
              status: "optional",
              description: "Helps us expedite the review process",
            },
            {
              name: "Articles of Incorporation",
              status: "optional",
              description: "Or equivalent business formation docs",
            },
          ],
        },
      },
      conclusion:
        "Ready to see your full application summary? I'll compile everything we've discussed.",
      quickReplies: [
        {
          label: "Show me the summary",
          value: "show application summary",
        },
        { label: "I have a question first", value: "question about process" },
      ],
    },
  },

  // ── Step 6: Application Summary ──
  {
    id: "summary",
    triggers: ["summary", "overview", "compile", "application", "review all"],
    response: {
      text: "Here's your complete application overview. Everything looks strong and you're pre-qualified based on what we've discussed.",
      card: {
        type: "application-summary",
        data: {
          status: "Pre-Qualified",
          company: "Your Company",
          industry: "Transportation & Logistics",
          monthlyVolume: "$100,000",
          estimatedFunding: "$95,000/mo",
          advanceRate: "95%",
          fundingSpeed: "Same day",
          customersApproved: 2,
          customersReview: 1,
          docsRequired: 3,
          docsSubmitted: 0,
          nextSteps: [
            "Upload required documents",
            "15-minute call with a funding specialist",
            "Receive your factoring agreement",
            "Start submitting invoices & get funded",
          ],
        },
      },
      conclusion:
        "A Sierra Finance specialist will reach out within 2 hours to finalize your setup. Want to leave your contact info, or do you have any other questions?",
      quickReplies: [
        { label: "Leave my contact info", value: "contact information" },
        { label: "How fast is funding?", value: "how fast funding" },
        { label: "What are the fees?", value: "tell me about fees" },
      ],
    },
  },

  // ── FAQ: Speed ──
  {
    id: "faq-speed",
    triggers: ["how fast", "how long", "same day", "quick", "speed", "time"],
    response: {
      text: "Once your account is set up, funding is same-day. You submit an invoice in the morning, and the advance hits your bank account that afternoon. Setup itself takes 24-48 hours from when we receive your documents.",
      quickReplies: [
        {
          label: "Show me the summary",
          value: "show application summary",
        },
        { label: "What are the fees?", value: "tell me about fees" },
        { label: "Leave my contact info", value: "contact information" },
      ],
    },
  },

  // ── FAQ: Fees ──
  {
    id: "faq-fees",
    triggers: [
      "fee",
      "cost",
      "charge",
      "price",
      "rate",
      "expensive",
      "how much",
      "percent",
    ],
    response: {
      text: "Our financing fee typically ranges from 1.5% to 3% per invoice, depending on your volume and your customers' creditworthiness. There are no hidden fees, no monthly minimums, and no long-term contracts. You only pay when you factor an invoice.",
      quickReplies: [
        {
          label: "Show me the summary",
          value: "show application summary",
        },
        { label: "Leave my contact info", value: "contact information" },
      ],
    },
  },

  // ── Contact Info ──
  {
    id: "contact",
    triggers: ["contact", "phone", "email", "call me", "reach out", "name"],
    response: {
      text: "You can reach our team directly at (915) 593-7111 or info@sierra.finance. We're based in El Paso, TX and our specialists are available Monday through Friday, 8am to 6pm MT.",
      card: {
        type: "progress",
        data: {
          steps: [
            { label: "Initial Conversation", status: "complete" },
            { label: "Business Profile", status: "complete" },
            { label: "Credit Verification", status: "complete" },
            { label: "Document Collection", status: "current" },
            { label: "Final Approval", status: "upcoming" },
            { label: "Start Factoring", status: "upcoming" },
          ],
          progress: 65,
        },
      },
      conclusion:
        "You're already 65% through the process just from this conversation. Upload your documents and we'll have you funded in no time.",
    },
  },

  // ── Fallback: Question ──
  {
    id: "question",
    triggers: ["question", "ask", "wonder", "curious", "explain", "how does"],
    response: {
      text: "Happy to explain. Invoice factoring is simple: you sell your unpaid invoices to us at a small discount, and we advance you up to 95-97% of the value the same day. We then collect from your customer. It's not a loan, so there's no debt on your books.",
      quickReplies: [
        { label: "How fast is funding?", value: "how fast funding" },
        { label: "What are the fees?", value: "tell me about fees" },
        { label: "Let's continue", value: "show application summary" },
      ],
    },
  },
];

// Off-topic / profanity detection
const OFF_TOPIC_WORDS = [
  "fuck", "shit", "damn", "ass", "bitch", "hell", "crap",
  "test", "testing", "asdf", "aaa", "xxx", "lol", "lmao",
  "pizza", "weather", "sports", "game", "movie",
  "hello world", "lorem ipsum", "blah",
];

function isOffTopic(input: string): boolean {
  const lower = input.toLowerCase().trim();
  if (lower.length < 3) return true;
  return OFF_TOPIC_WORDS.some((w) => lower.includes(w));
}

export const OFF_TOPIC_RESPONSE: BotResponse = {
  text: "It looks like that's not related to invoice factoring or funding. I'm specifically built to help you turn unpaid invoices into cash. Let's get back on track.",
  quickReplies: [
    { label: "Start my application", value: "get started", icon: "bx bx-right-arrow-alt" },
    { label: "How does factoring work?", value: "question about process", icon: "bx bx-help-circle" },
    { label: "Talk to a specialist", value: "contact information", icon: "bx bx-phone" },
  ],
};

// Default fallback response (matched nothing but seems on-topic)
export const FALLBACK_RESPONSE: BotResponse = {
  text: "I'm not sure I understood that, but I'm here to help you get funded. Try one of the options below or rephrase your question.",
  quickReplies: [
    { label: "Start my application", value: "get started", icon: "bx bx-right-arrow-alt" },
    { label: "How does factoring work?", value: "question about process", icon: "bx bx-help-circle" },
    { label: "Talk to a specialist", value: "contact information", icon: "bx bx-phone" },
  ],
};

export { isOffTopic };
