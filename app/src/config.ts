// =============================================================================
// Farm Forecaste Configuration
// =============================================================================
// Voice-first farm advisory platform configuration
// =============================================================================

// -----------------------------------------------------------------------------
// Site Config
// -----------------------------------------------------------------------------
export interface SiteConfig {
  title: string;
  description: string;
  language: string;
  keywords: string;
  ogImage: string;
  canonical: string;
}

export const siteConfig: SiteConfig = {
  title: "Farm Forecaste - Voice-First Farm Advisory",
  description: "A voice-first farm advisory platform that converts weather and crop data into actionable decisions for farmers.",
  language: "en",
  keywords: "farm advisory, weather, crop management, voice assistant, agriculture",
  ogImage: "/images/og-image.jpg",
  canonical: "https://farmforecaste.com",
};

// -----------------------------------------------------------------------------
// Navigation Config
// -----------------------------------------------------------------------------
export interface NavLink {
  name: string;
  href: string;
  icon: string;
}

export interface NavigationConfig {
  brandName: string;
  brandSubname: string;
  tagline: string;
  navLinks: NavLink[];
  ctaButtonText: string;
  logoPath?: string;
}

export const navigationConfig: NavigationConfig = {
  brandName: "Farm",
  brandSubname: "Forecaste",
  tagline: "Voice-First Farm Advisory",
  navLinks: [
    { name: "Dashboard", href: "#dashboard", icon: "Home" },
    { name: "Weather", href: "#weather", icon: "Cloud" },
    { name: "Crops", href: "#crops", icon: "Leaf" },
    { name: "Alerts", href: "#alerts", icon: "AlertTriangle" },
  ],
  ctaButtonText: "Call Me",
  logoPath: "/images/farmforecast-logo.svg",
};

// -----------------------------------------------------------------------------
// Preloader Config
// -----------------------------------------------------------------------------
export interface PreloaderConfig {
  brandName: string;
  brandSubname: string;
  yearText: string;
  logoPath?: string;
}

export const preloaderConfig: PreloaderConfig = {
  brandName: "Farm",
  brandSubname: "Forecaste",
  yearText: "Your Voice Advisor",
  logoPath: "/images/farmforecast-logo.svg",
};

// -----------------------------------------------------------------------------
// Hero Config
// -----------------------------------------------------------------------------
export interface HeroStat {
  value: number;
  suffix: string;
  label: string;
}

export interface HeroConfig {
  scriptText: string;
  mainTitle: string;
  ctaButtonText: string;
  ctaTarget: string;
  stats: HeroStat[];
  decorativeText: string;
  backgroundImage: string;
}

export const heroConfig: HeroConfig = {
  scriptText: "Not just another weather dashboard",
  mainTitle: "Your Personal\nFarm Advisor",
  ctaButtonText: "Get Started",
  ctaTarget: "#dashboard",
  stats: [
    { value: 95, suffix: "%", label: "Accuracy Rate" },
    { value: 24, suffix: "/7", label: "Voice Support" },
    { value: 50, suffix: "K+", label: "Farmers Helped" },
  ],
  decorativeText: "VOICE FIRST • ACTION DRIVEN",
  backgroundImage: "/images/hero-farm.jpg",
};

// -----------------------------------------------------------------------------
// Weather Config
// -----------------------------------------------------------------------------
export interface WeatherData {
  temperature: number;
  humidity: number;
  rainfall: number;
  condition: string;
  location: string;
  forecast: {
    day: string;
    temp: number;
    condition: string;
    rainfall: number;
  }[];
}

export const mockWeatherData: WeatherData = {
  temperature: 28,
  humidity: 82,
  rainfall: 75,
  condition: "Heavy Rain",
  location: "Punjab, India",
  forecast: [
    { day: "Today", temp: 28, condition: "Rain", rainfall: 75 },
    { day: "Tomorrow", temp: 30, condition: "Cloudy", rainfall: 20 },
    { day: "Wed", temp: 32, condition: "Sunny", rainfall: 0 },
    { day: "Thu", temp: 31, condition: "Partly Cloudy", rainfall: 10 },
  ],
};

// -----------------------------------------------------------------------------
// Crop Config
// -----------------------------------------------------------------------------
export interface CropData {
  type: string;
  sowingDate: string;
  currentStage: string;
  daysSinceSowing: number;
  stageProgress: number;
  nextStage: string;
  daysToNextStage: number;
}

export const mockCropData: CropData = {
  type: "Wheat",
  sowingDate: "2026-01-15",
  currentStage: "Flowering",
  daysSinceSowing: 72,
  stageProgress: 85,
  nextStage: "Harvest",
  daysToNextStage: 8,
};

// -----------------------------------------------------------------------------
// Advisory Config
// -----------------------------------------------------------------------------
export interface Advisory {
  id: string;
  priority: "high" | "medium" | "low";
  title: string;
  message: string;
  action: string;
  icon: string;
}

export const mockAdvisories: Advisory[] = [
  {
    id: "1",
    priority: "high",
    title: "Harvest Delay Required",
    message: "Heavy rainfall detected. Delay harvesting immediately to prevent crop damage.",
    action: "Wait for weather to clear before harvesting",
    icon: "CloudRain",
  },
  {
    id: "2",
    priority: "medium",
    title: "Fungal Risk Alert",
    message: "High humidity (82%) and temperature (28°C) create favorable conditions for fungal infection.",
    action: "Apply preventative fungicide spray within 24 hours",
    icon: "AlertTriangle",
  },
  {
    id: "3",
    priority: "low",
    title: "Optimal Sowing Conditions",
    message: "Moisture levels are optimal for sowing in nearby fields.",
    action: "Proceed with planned sowing activities",
    icon: "CheckCircle",
  },
];

// -----------------------------------------------------------------------------
// Pest Alert Config
// -----------------------------------------------------------------------------
export interface PestAlert {
  id: string;
  pestName: string;
  riskLevel: "high" | "medium" | "low";
  conditions: string;
  recommendation: string;
  active: boolean;
}

export const mockPestAlerts: PestAlert[] = [
  {
    id: "1",
    pestName: "Fungal Disease",
    riskLevel: "high",
    conditions: "Humidity > 80% + Temp > 25°C",
    recommendation: "Apply preventative spray immediately",
    active: true,
  },
  {
    id: "2",
    pestName: "Aphid Infestation",
    riskLevel: "medium",
    conditions: "Temp 20-30°C + Dry conditions",
    recommendation: "Monitor crop closely, use neem oil if detected",
    active: false,
  },
];

// -----------------------------------------------------------------------------
// Insurance Config
// -----------------------------------------------------------------------------
export interface InsuranceStatus {
  triggered: boolean;
  threshold: number;
  currentValue: number;
  message: string;
  claimStatus: string;
}

export const mockInsuranceStatus: InsuranceStatus = {
  triggered: true,
  threshold: 100,
  currentValue: 75,
  message: "Insurance monitoring active. Heavy rain threshold approaching.",
  claimStatus: "Standby",
};

// -----------------------------------------------------------------------------
// Farmer Profile Config
// -----------------------------------------------------------------------------
export interface FarmerProfile {
  id: string;
  name: string;
  phone: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  preferredLanguage: string;
}

export const mockFarmerProfile: FarmerProfile = {
  id: "farmer-001",
  name: "Rajesh Kumar",
  phone: "+91 98765 43210",
  location: "Ludhiana, Punjab",
  coordinates: { lat: 30.901, lng: 75.8573 },
  preferredLanguage: "hi-IN",
};

// -----------------------------------------------------------------------------
// Dashboard Config
// -----------------------------------------------------------------------------
export interface DashboardConfig {
  scriptText: string;
  subtitle: string;
  mainTitle: string;
  callMeButtonText: string;
  callMeSubtext: string;
  weatherCardTitle: string;
  cropCardTitle: string;
  alertCardTitle: string;
  advisoryCardTitle: string;
  insuranceCardTitle: string;
}

export const dashboardConfig: DashboardConfig = {
  scriptText: "Your Daily Farm Update",
  subtitle: "PERSONALIZED ADVISORY",
  mainTitle: "Farmer Dashboard",
  callMeButtonText: "CALL ME",
  callMeSubtext: "Tap to hear your advice",
  weatherCardTitle: "Current Weather",
  cropCardTitle: "Crop Status",
  alertCardTitle: "Risk Alerts",
  advisoryCardTitle: "Today's Advisory",
  insuranceCardTitle: "Insurance Status",
};

// -----------------------------------------------------------------------------
// Admin Dashboard Config
// -----------------------------------------------------------------------------
export interface AdminStat {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
}

export interface AdminDashboardConfig {
  scriptText: string;
  subtitle: string;
  mainTitle: string;
  stats: AdminStat[];
  sections: {
    weather: string;
    advisories: string;
    pests: string;
    insurance: string;
  };
}

export const adminDashboardConfig: AdminDashboardConfig = {
  scriptText: "System Overview",
  subtitle: "ADMIN PANEL",
  mainTitle: "Platform Monitor",
  stats: [
    { label: "Active Farmers", value: "12,847", change: "+234", trend: "up" },
    { label: "Advisories Sent", value: "45,231", change: "+1,203", trend: "up" },
    { label: "Voice Calls", value: "8,942", change: "+567", trend: "up" },
    { label: "Alert Accuracy", value: "94.2%", change: "+2.1%", trend: "up" },
  ],
  sections: {
    weather: "Aggregated Weather Patterns",
    advisories: "Generated Advisories Log",
    pests: "Historical / Active Pest Risks",
    insurance: "Insurance Parametric States",
  },
};

// -----------------------------------------------------------------------------
// Voice Config
// -----------------------------------------------------------------------------
export interface VoiceConfig {
  language: string;
  voiceURI: string;
  rate: number;
  pitch: number;
  volume: number;
}

export const voiceConfig: VoiceConfig = {
  language: "hi-IN",
  voiceURI: "",
  rate: 0.9,
  pitch: 1.0,
  volume: 1.0,
};

// -----------------------------------------------------------------------------
// Footer Config
// -----------------------------------------------------------------------------
export interface FooterConfig {
  brandName: string;
  tagline: string;
  description: string;
  socialLinks: { icon: string; label: string; href: string }[];
  linkGroups: { title: string; links: { name: string; href: string }[] }[];
  contactItems: { icon: string; text: string }[];
  copyrightText: string;
  backToTopText: string;
}

export const footerConfig: FooterConfig = {
  brandName: "Farm Forecaste",
  tagline: "Voice-First Farm Advisory",
  description: "Transforming weather and crop data into actionable decisions for farmers across India.",
  socialLinks: [
    { icon: "Twitter", label: "Twitter", href: "#" },
    { icon: "Facebook", label: "Facebook", href: "#" },
    { icon: "Instagram", label: "Instagram", href: "#" },
  ],
  linkGroups: [
    {
      title: "Product",
      links: [
        { name: "Features", href: "#" },
        { name: "Pricing", href: "#" },
        { name: "API", href: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About", href: "#" },
        { name: "Careers", href: "#" },
        { name: "Contact", href: "#" },
      ],
    },
  ],
  contactItems: [
    { icon: "Mail", text: "support@farmforecaste.com" },
    { icon: "Phone", text: "+91 1800-FARM-HELP" },
  ],
  copyrightText: "© 2026 Farm Forecaste. All rights reserved.",
  backToTopText: "Back to top",
};

// -----------------------------------------------------------------------------
// Scroll To Top Config
// -----------------------------------------------------------------------------
export interface ScrollToTopConfig {
  ariaLabel: string;
}

export const scrollToTopConfig: ScrollToTopConfig = {
  ariaLabel: "Back to top",
};
