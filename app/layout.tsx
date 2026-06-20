import type { Metadata, Viewport } from "next";
import { PORTFOLIO_CONTENT } from "./content";
import "./globals.css";

const SITE_URL = "https://desk.shivansh.life";
const FULL_NAME = PORTFOLIO_CONTENT.resume.fullName;
const TITLE = `${FULL_NAME} — Brand, UI/UX & Frontend Designer`;
const DESCRIPTION =
  "Shivansh Pandey — brand, UI/UX & graphic designer and frontend developer in Bengaluru. Explore the work inside an interactive macOS-themed desktop portfolio.";

const SAME_AS = [
  "https://www.behance.net/shivansh-life",
  "https://www.linkedin.com/in/shivansh-life",
  "https://x.com/shivansh_life",
  "https://instagram.com/shivansh.life",
  "https://github.com/sxivansx",
];

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: "%s · desk.shivansh" },
  description: DESCRIPTION,
  applicationName: "desk.shivansh",
  authors: [{ name: FULL_NAME, url: SITE_URL }],
  creator: FULL_NAME,
  publisher: FULL_NAME,
  keywords: [
    "Shivansh Pandey",
    "Shivansh",
    "Brand Designer",
    "UI/UX Designer",
    "Graphic Designer",
    "Frontend Developer",
    "Product Designer",
    "Bengaluru",
    "Figma",
    "Next.js",
    "design portfolio",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "desk.shivansh",
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    creator: PORTFOLIO_CONTENT.contact.twitter,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: "#0063d1",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: FULL_NAME,
      alternateName: PORTFOLIO_CONTENT.name,
      url: SITE_URL,
      image: `${SITE_URL}/shivansh.jpeg`,
      jobTitle: PORTFOLIO_CONTENT.role,
      description: PORTFOLIO_CONTENT.bio,
      email: `mailto:${PORTFOLIO_CONTENT.contact.email}`,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Bengaluru",
        addressRegion: "Karnataka",
        addressCountry: "IN",
      },
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: PORTFOLIO_CONTENT.education.institution,
      },
      knowsAbout: [
        ...PORTFOLIO_CONTENT.skills.design,
        ...PORTFOLIO_CONTENT.skills.frontend,
        ...PORTFOLIO_CONTENT.skills.interests,
      ],
      sameAs: SAME_AS,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "desk.shivansh",
      description: DESCRIPTION,
      inLanguage: "en",
      publisher: { "@id": `${SITE_URL}/#person` },
    },
    {
      "@type": "ProfilePage",
      "@id": `${SITE_URL}/#profilepage`,
      url: SITE_URL,
      name: TITLE,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      mainEntity: { "@id": `${SITE_URL}/#person` },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full overflow-hidden">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
