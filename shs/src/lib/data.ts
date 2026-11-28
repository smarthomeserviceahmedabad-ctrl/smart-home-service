import photoList from "./photos.json";
import { ADDRESS, EMAIL, HOURS, PHONE, WHATSAPP } from "./site";
// Seed content and reference data for Smart Home Service.
// Frontend-only build: this is the starting state; edits made in the admin panel are kept in the browser (see store.tsx).

export type Group = "maid" | "cook" | "clean" | "child" | "care" | "driver";

export interface Service {
  slug: string; name: string; group: Group; short: string; features: string[]; resp: string[]; cap: string;
  price: string; unit: string; active: boolean; seoTitle: string; seoDesc: string; img?: string; scene?: string;
}
export interface City { slug: string; name: string; areas: string[]; pins: string; active: boolean }
export type VerKey = "doc" | "id" | "police" | "ref" | "interview" | "skill" | "training";
export interface Staff {
  id: string; name: string; fullName?: string; role: string; group: Group; services: string[]; exp: number; skills: string[];
  langs: string[]; hours: string; duty: string[]; city: string; area: string; gender: string; status: string;
  ver: Record<string, string>; published: boolean; phone: string; demo?: boolean; ratings: number[]; about: string;
  photo?: string; age?: number; paddr?: string; salary?: string; prev?: string; emg?: string; ref?: string; iddocName?: string; registered?: string;
}
export interface Note { at: string; by: string; t: string }
export interface Booking {
  id: string; demo?: boolean; created: string; status: string; history: { s: string; at: string }[]; service: string; extra: string[];
  city: string; area: string; pin: string; duty: string; family: string; home: string; resp: string; lang: string; expReq: string;
  gender: string; notes: string; date: string; days: string[]; start: string; end: string; name: string; phone: string; email: string;
  address: string; source: string; staff: string; shortlist: string[]; internal: Note[]; amountPaid: number; coupon?: string;
  urgent?: boolean; interviewAt?: string; interviewPref?: string; cancelReq?: boolean; cancelReason?: string; replaceReq?: boolean; reviewed?: boolean;
}
export interface Review { id: string; name: string; city: string; service: string; rating: number; text: string; status: string; demo?: boolean; date: string; phone?: string; booking?: string }
export interface Faq { id: string; q: string; a: string }
export interface Post { slug: string; title: string; cat: string; date: string; excerpt: string; body: string[]; img?: string }
export interface Plan { id: string; name: string; desc: string; features: string[]; price: string; featured?: boolean; demo?: boolean }
export interface Coupon { code: string; type: string; value: number; active: boolean; demo?: boolean }
export interface Slide { id: string; scene: string; eyebrow: string; title: string; sub: string; cta: string; link: string; active: boolean; img?: string; alt?: string; bg?: string }
export interface Ticket { id: string; phone: string; name?: string; email?: string; booking?: string; subject: string; msg: string; status: string; at: string; reply?: string; source?: string }
export interface Customer { name: string; phone: string; email: string; addresses: string[]; created: string; ref?: string }
export interface User { phone: string; name: string; email: string; addresses: string[]; ref: string }
export interface Settings {
  brand: string; phone: string; wa: string; email: string; address: string; hours: string; availability: string;
  fb: string; ig: string; li: string; yt: string; razorpay: string; notifyEmail: boolean; notifySms: boolean; notifyWa: boolean;
  adminPin: string; referralCredit: string; urgentNote: string;
}
export interface State {
  v: 1; lang: string; settings: Settings;
  content: { heroT: string; heroS: string; ctaT: string; ctaS: string };
  stats: { pros: string; families: string; years: string; cities: string; placements: string };
  services: Service[]; cities: City[]; staff: Staff[]; faqs: Faq[]; reviews: Review[]; blog: Post[]; plans: Plan[];
  coupons: Coupon[]; bookings: Booking[]; slides: Slide[]; sliderSec: number; tickets: Ticket[];
  subscribers: { email: string; at: string }[]; customers: Record<string, Customer>; user: User | null; staffUser: string | null;
}

export const today = () => { const d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 10); };
let _u = 0;
export const uid = (p: string) => p + (++_u).toString(36) + Math.random().toString(36).slice(2, 6);

export const GROUPS: Record<Group, { n: string; g: string; ic: string; intro: string }> = {
  maid: { n: "Maids & Domestic Help", g: "linear-gradient(135deg,#2a5fc4,#0f2a66)", ic: "home", intro: "Every professional is interviewed and checked before their profile is shared with you, and you can interview them yourself before confirming." },
  cook: { n: "Cooks & Chefs", g: "linear-gradient(135deg,#f5c518,#b98a00)", ic: "chef", intro: "Tell us your family's food preferences — Gujarati, Jain, Punjabi, South Indian or continental — and we shortlist cooks who match." },
  clean: { n: "Housekeeping & Cleaning", g: "linear-gradient(135deg,#5aa0e0,#1d3f8c)", ic: "broom", intro: "Checklist-based cleaning with clear scope agreed before the work starts." },
  child: { n: "Baby & Child Care", g: "linear-gradient(135deg,#8dc63f,#3f8a12)", ic: "baby", intro: "Child-care professionals follow your routines, your rules and your pediatrician's advice — never their own." },
  care: { n: "Elder & Patient Care", g: "linear-gradient(135deg,#3f7fd6,#163a85)", ic: "care", intro: "Compassionate, non-clinical caregivers for daily living support. Nursing professionals are offered only where qualifications are verified." },
  driver: { n: "Drivers & Office Staff", g: "linear-gradient(135deg,#1d3f8c,#081739)", ic: "car", intro: "Driving licences and references are checked before a driver is introduced to your family or office." },
};

type SvcRow = [string, string, Group, string, string[], string[], string];
const SVC_SEED: SvcRow[] = [
  ["maid-service", "Maid Service", "maid", "Reliable maids for daily sweeping, mopping, dusting, utensils and laundry.", ["Daily home cleaning", "Utensils & laundry", "Hourly to full-time"], ["Sweeping, mopping and dusting of all rooms", "Washing utensils and keeping the kitchen counter clean", "Laundry, folding and ironing as agreed", "Bathroom and balcony cleaning on a set schedule", "Any additional tasks agreed during the interview"], "Indian housekeeper cleaning a bright living room"],
  ["house-maid", "House Maid Service", "maid", "Trained house maids who keep your home organised day after day.", ["Whole-home upkeep", "Assessed for skills", "Part or full time"], ["Daily cleaning of rooms, kitchen and bathrooms", "Organising wardrobes, shelves and linen", "Utensils, laundry and ironing", "Watering plants and basic upkeep", "Helping with guests and festive preparation"], "House maid tidying a modern Indian apartment"],
  ["servant-service", "Domestic Servant Service", "maid", "All-round domestic help for cleaning, errands and day-to-day household support.", ["All-round help", "Errands & upkeep", "Live-in option"], ["Complete household cleaning", "Grocery and local errands", "Serving meals and kitchen support", "Laundry and ironing", "Home upkeep as instructed by the family"], "Domestic helper assisting in an Indian home"],
  ["full-time-maid", "Full-Time Maid", "maid", "A dedicated maid for 8–10 hours a day, with weekly off agreed upfront.", ["8–10 hours a day", "One dedicated person", "Weekly off agreed"], ["Full-day cleaning and upkeep", "Kitchen help and utensils", "Laundry, ironing and wardrobe care", "Child or elder supervision support if agreed", "Daily routine set by the family"], "Full-time maid in a well-kept home"],
  ["part-time-maid", "Part-Time Maid", "maid", "Morning or evening help for 4-5 hours to handle the essentials.", ["4-5 hours a day", "Morning or evening slot", "Budget-friendly"], ["Jhadu–pocha (sweeping and mopping)", "Dusting and utensils", "Clothes washing or folding", "Fixed daily slot", "Tasks agreed in advance"], "Part-time helper cleaning a kitchen"],
  ["live-in-maid", "24-Hour Maid / Live-In", "maid", "Round-the-clock help who lives with your family.", ["Stays with family", "Day-long support", "Stay & food by family"], ["Complete household upkeep", "Kitchen assistance and meal serving", "Laundry and ironing", "Support for children or elders as agreed", "Rest hours and weekly off as agreed"], "Live-in helper with an Indian family at home"],
  ["cook-service", "Cook Service", "cook", "Home cooks for fresh, hygienic daily meals made the way your family likes.", ["Veg, Jain or non-veg", "Gujarati, Punjabi, South Indian", "1–3 meals a day"], ["Preparing breakfast, lunch and/or dinner", "Rotis, sabzi, dal-rice and regional dishes", "Kitchen hygiene and cleaning after cooking", "Menu planning with the family", "Following diet restrictions (Jain, diabetic, low-oil)"], "Home cook preparing fresh Indian food in a modern kitchen"],
  ["home-chef", "Home Chef Service", "cook", "Experienced chefs for multi-cuisine menus, diet plans and gatherings.", ["Multi-cuisine", "Diet & menu planning", "Parties & gatherings"], ["Multi-cuisine meals — Indian, Chinese, continental", "Weekly menu and grocery planning", "Diet-specific cooking", "Party and festive cooking", "Plating and serving for guests"], "Home chef plating a multi-course meal"],
  ["domestic-couple", "Domestic Couple Service", "maid", "A trained couple managing cooking, cleaning, driving or upkeep together.", ["Two-person team", "Ideal for bungalows", "Live-in available"], ["Cooking and kitchen management", "Full home cleaning and upkeep", "Driving or gardening (if skilled)", "Caretaking of house and property", "Shared duties agreed with both"], "Two household workers in a well-kept Indian home"],
  ["housekeeping", "Housekeeping Service", "clean", "Structured housekeeping for apartments, villas and serviced homes.", ["Checklist based", "Wardrobe & pantry", "Quality checks"], ["Room-by-room cleaning checklist", "Linen change and bed making", "Wardrobe and pantry organisation", "Surface sanitising", "Periodic quality checks"], "Housekeeping staff organising a modern apartment"],
  ["deep-cleaning", "Deep Cleaning Service", "clean", "Intensive one-time cleaning of kitchens, bathrooms, sofas and windows.", ["Kitchen degreasing", "Bathroom descaling", "Move-in / festive"], ["Kitchen degreasing — chimney, tiles, cabinets", "Bathroom descaling and sanitising", "Windows, grills and fans", "Sofa and mattress vacuuming", "Move-in / move-out and Diwali cleaning"], "Cleaning professional cleaning a premium kitchen"],
  ["babysitter", "Babysitter Service", "child", "Caring babysitters for infants and toddlers who follow your routines.", ["Infant & toddler care", "Play & homework help", "Hygiene routines"], ["Infant care — feeding, burping, diaper changes", "Toddler care, supervision and safe play", "Feeding assistance as per your diet plan", "Playtime, stories and age-appropriate activities", "Homework assistance for school-going children", "Bathing, hygiene and clean clothes", "Following parent-defined routines and screen-time rules"], "Babysitter playing with a toddler in a safe home"],
  ["nanny", "Baby Care / Nanny Service", "child", "Experienced nannies for full-day or live-in child care.", ["Full-day or live-in", "Experienced nannies", "Routine & sleep care"], ["Complete daily child care", "Sleep and feeding routines", "Bathing, dressing and hygiene", "Accompanying to parks and classes", "Daily updates to parents"], "Nanny caring for a young child at home"],
  ["japa-maid", "Japa Maid / Postnatal Care", "child", "Postnatal caregivers for mother and newborn in the first weeks.", ["Mother & newborn", "Traditional massage", "Day or 24-hour"], ["Newborn bathing and massage", "Mother's massage and postnatal support", "Helping with feeding positions", "Burping, swaddling and sleep routines", "Hygiene of baby clothes and utensils", "Following doctor's and family's instructions"], "Postnatal caregiver supporting a mother and newborn"],
  ["newborn-care", "Newborn Baby Care", "child", "Gentle, trained care for newborns — feeding, bathing and sleep routines.", ["0–12 months", "Night shifts available", "Hygiene focused"], ["Newborn feeding support and bottle sterilising", "Bathing and massage", "Diaper changes and hygiene", "Night-time care shifts", "Tracking feeds and sleep for parents"], "Caregiver gently holding a newborn"],
  ["elderly-care", "Elderly Caretaker", "care", "Compassionate caretakers for daily living support for elders at home.", ["Daily living support", "Companionship", "Medicine reminders"], ["Help with bathing, dressing and grooming", "Mobility support and walks", "Medicine reminders (not administering)", "Meals and hydration support", "Companionship and conversation", "Accompanying to doctor visits"], "Caregiver helping an elderly Indian couple at home"],
  ["senior-citizen-care", "Senior Citizen Care", "care", "Day or live-in companions who help seniors stay comfortable and safe.", ["Day or live-in", "Companionship", "Fall-risk awareness"], ["Daily routine assistance", "Light meal preparation", "Accompanying for walks and errands", "Monitoring and reporting concerns to family", "Keeping the living space safe and tidy"], "Companion walking with a senior citizen"],
  ["patient-care", "Patient Caretaker", "care", "Non-clinical attendants for patients recovering at home.", ["Non-clinical attendants", "Bedridden support", "Day / night shifts"], ["Bed-bath, hygiene and changing", "Turning and positioning bedridden patients", "Feeding support as advised", "Mobility and toilet assistance", "Medicine reminders (not administering)", "Reporting changes to family and doctor"], "Caregiver providing respectful home patient assistance"],
  ["home-nursing", "Home Nursing Assistance", "care", "Qualified nursing professionals — offered only where qualifications are verified.", ["Verified qualifications only", "Doctor-advised care", "Shift-based"], ["Clinical tasks only as prescribed by the treating doctor", "Vitals monitoring and records", "Wound dressing (where qualified)", "Post-hospital recovery support", "Coordination with the treating doctor"], "Qualified nurse checking vitals at home"],
  ["driver", "Driver Service", "driver", "Experienced drivers for daily commutes, school runs and outstation trips.", ["Licence checked", "City & outstation", "Full-time or on-call"], ["Safe daily commute and school runs", "Outstation trips as agreed", "Basic car upkeep and cleanliness", "Following traffic rules and family instructions", "Maintaining trip and fuel records"], "Chauffeur standing beside a family car"],
  ["personal-driver", "Personal Driver", "driver", "A dedicated personal chauffeur for your family car.", ["Dedicated chauffeur", "Courteous & punctual", "Licence & references checked"], ["Driving family members as scheduled", "Airport and station pickups", "Car cleanliness and service reminders", "Punctuality and discretion"], "Personal chauffeur opening a car door"],
  ["office-boy", "Office Boy Service", "driver", "Office assistants for pantry, filing, errands and upkeep.", ["Pantry & tea service", "Filing & errands", "Office upkeep"], ["Tea, coffee and pantry management", "Filing, photocopying and courier", "Bank and local errands", "Desk and meeting-room upkeep", "Supporting front office"], "Office assistant in a modern Indian office"],
];
const CITY_SEED: [string, string, string[]][] = [
  ["ahmedabad", "Ahmedabad", ["Satellite", "Bodakdev", "Prahlad Nagar", "Vastrapur", "Thaltej", "Navrangpura", "Maninagar", "Gota", "Chandkheda", "Bopal", "South Bopal", "Paldi", "Shela", "Science City"]],
  ["surat", "Surat", ["Adajan", "Vesu", "Piplod", "Athwa", "Pal", "City Light", "Katargam", "Varachha", "Althan"]],
  ["vadodara", "Vadodara", ["Alkapuri", "Gotri", "Akota", "Manjalpur", "Karelibaug", "Vasna-Bhayli", "Fatehgunj", "Sama"]],
  ["rajkot", "Rajkot", ["Kalawad Road", "Raiya Road", "University Road", "Mavdi", "150 Feet Ring Road", "Kotecha Chowk"]],
  ["gandhinagar", "Gandhinagar", ["Kudasan", "Raysan", "Sargasan", "Infocity", "Sector 21", "Sector 7"]],
  ["anand", "Anand", ["Vallabh Vidyanagar", "Karamsad", "Bakrol", "Anand–Vidyanagar Road"]],
  ["bhavnagar", "Bhavnagar", ["Kalanala", "Waghawadi Road", "Ghogha Circle", "Sardarnagar"]],
  ["jamnagar", "Jamnagar", ["Patel Colony", "Digjam Circle", "Ranjit Sagar Road", "Khodiyar Colony"]],
  ["bharuch", "Bharuch", ["Zadeshwar", "Shaktinagar", "Link Road", "Station Road"]],
  ["mehsana", "Mehsana", ["Modhera Road", "Radhanpur Road", "Nagalpur", "Highway Area"]],
];
export const CITY_GRAD = ["linear-gradient(135deg,#0f2a66,#1e4fa6)", "linear-gradient(135deg,#163a85,#3f7fd6)", "linear-gradient(135deg,#0f2a66,#3f8a12)", "linear-gradient(135deg,#1d3f8c,#5aa0e0)", "linear-gradient(135deg,#0b1f4d,#2a5fc4)", "linear-gradient(135deg,#163a85,#7cb82f)"];
export const DUTY = [
  { k: "hourly", n: "Hourly Service", ic: "clock", c: "#3f8a12", d: "Help by the hour for specific jobs — deep cleaning, a party, or an extra pair of hands.", avail: "Subject to staff availability in your locality", arr: "Minimum booking hours set per city", price: "Charged per hour" },
  { k: "part-time", n: "Part-Time Service", ic: "cal", c: "#1e4fa6", d: "A fixed daily slot of 2–4 hours, morning or evening, for regular household work.", avail: "Most services, most localities", arr: "Fixed daily slot, weekly off agreed", price: "Monthly, based on hours & tasks" },
  { k: "full-time", n: "Full-Time Service", ic: "brief", c: "#d9a800", d: "A dedicated professional for 8–10 hours a day who goes home each evening.", avail: "All listed services", arr: "8–10 hrs/day, weekly off agreed", price: "Monthly salary + service fee" },
  { k: "live-in", n: "24/7 Live-In Service", ic: "home", c: "#0f2a66", d: "A professional who stays with your family, with rest hours and leave agreed upfront.", avail: "Maids, cooks, nannies, japa & elder care", arr: "Family provides stay & meals", price: "Monthly salary + service fee" },
];
export const STATUSES = ["New Enquiry", "Contacted", "Profile Shortlisted", "Interview Scheduled", "Booking Confirmed", "Service Started", "Completed", "Cancelled"];
export const ST_COLOR: Record<string, string> = { "New Enquiry": "#2563eb", Contacted: "#7c3aed", "Profile Shortlisted": "#0891b2", "Interview Scheduled": "#c26a0a", "Booking Confirmed": "#0f8a72", "Service Started": "#0b6e5c", Completed: "#142D4E", Cancelled: "#dc2626" };
export const STAFF_ST = ["Pending", "Verification in Progress", "Approved", "Available", "Assigned", "Unavailable", "Suspended"];
export const STAFF_COLOR: Record<string, string> = { Pending: "#64748b", "Verification in Progress": "#c26a0a", Approved: "#0891b2", Available: "#0f8a72", Assigned: "#7c3aed", Unavailable: "#94a3b8", Suspended: "#dc2626" };
export const LANGS = ["Gujarati", "Hindi", "English", "Marathi", "Bengali", "Odia", "Nepali", "Malayalam", "Tamil"];
export const WHY: [string, string, string][] = [
  ["shield", "Verified & Background-Checked", "Each profile shows exactly which checks are complete — nothing is implied."],
  ["id", "Identity Document Verification", "Government ID is checked and stored securely, never shown publicly."],
  ["police", "Police Verification Support", "We help complete police verification and show its status on the profile."],
  ["interview", "In-Person Interview", "Our team meets every professional before listing them."],
  ["grad", "Skill Assessment & Training", "Practical checks for cooking, child care, cleaning and caregiving skills."],
  ["star", "Experienced Professionals", "Experience and past employment are recorded and reference-checked."],
  ["clock", "Flexible Duty Hours", "Hourly, part-time, full-time or live-in — whatever your home needs."],
  ["refresh", "Replacement Assistance", "Not the right fit? Request a replacement as per our replacement policy."],
  ["headset", "Dedicated Customer Support", "A real person follows up on every enquiry by phone or WhatsApp."],
  ["tag", "Transparent Pricing", "A clear quote before you confirm — no surprise charges."],
  ["chat", "Regular Customer Feedback", "We check in after joining and act on what you tell us."],
  ["lock", "Secure Booking Process", "OTP login, protected documents and role-based admin access."],
];
export const STEPS: [string, string, string][] = [
  ["grid", "Choose Your Service", "Pick from maids, cooks, nannies, caregivers, drivers and more."],
  ["doc", "Submit Your Requirements", "Tell us your city, duty type, schedule and household needs."],
  ["users", "Explore Suitable Profiles", "We shortlist verified professionals who match your needs."],
  ["interview", "Interview & Select", "Meet or video-call shortlisted professionals and pick the right one."],
  ["check", "Confirm & Start Service", "Confirm the booking, sign the agreement and your professional joins."],
];
export const VER_ITEMS: [VerKey, string][] = [["doc", "Document verification"], ["id", "Identity verification"], ["police", "Police verification"], ["ref", "Reference checks"], ["interview", "In-person interview"], ["skill", "Skills assessment"], ["training", "Training"]];
export const VER_DESC: Record<VerKey, string> = { doc: "documents reviewed by our team", id: "government ID checked; never shown publicly", police: "police verification completed or supported, with status shown", ref: "previous employers contacted", interview: "met in person by our team", skill: "practical check of service-specific skills", training: "orientation on hygiene, safety and conduct" };
export const emptyVer = (): Record<string, string> => Object.fromEntries(VER_ITEMS.map(([k]) => [k, "Not started"]));

function staffSeed(): Staff[] {
  const mk = (id: string, name: string, role: string, group: Group, services: string[], exp: number, skills: string[], langs: string[], hours: string, duty: string[], city: string, area: string, gender: string, status: string, ver: Record<string, string>): Staff =>
    ({ id, name, role, group, services, exp, skills, langs, hours, duty, city, area, gender, status, ver, published: true, phone: "", demo: true, ratings: [], about: "" });
  const full = { doc: "Done", id: "Done", police: "Done", ref: "Done", interview: "Done", skill: "Done", training: "Done" };
  const part = { doc: "Done", id: "Done", police: "In progress", ref: "Done", interview: "Done", skill: "Done", training: "Not started" };
  return [
    mk("pro-sunita", "Sunita", "House Maid", "maid", ["maid-service", "house-maid", "full-time-maid", "part-time-maid", "servant-service"], 6, ["Cleaning", "Laundry", "Ironing", "Utensils"], ["Gujarati", "Hindi"], "9:00 AM – 6:00 PM", ["part-time", "full-time"], "ahmedabad", "Satellite", "Female", "Available", full),
    mk("pro-ramesh", "Ramesh", "Home Cook", "cook", ["cook-service", "home-chef"], 9, ["Gujarati thali", "Jain food", "Punjabi", "South Indian"], ["Gujarati", "Hindi"], "7:00 AM – 11:00 AM, 6:00 – 9:00 PM", ["part-time", "full-time"], "surat", "Adajan", "Male", "Available", full),
    mk("pro-kavita", "Kavita", "Babysitter", "child", ["babysitter", "nanny"], 5, ["Toddler care", "Homework help", "Feeding", "Hygiene"], ["Gujarati", "Hindi", "English"], "8:00 AM – 7:00 PM", ["full-time", "live-in"], "vadodara", "Alkapuri", "Female", "Available", part),
    mk("pro-meena", "Meena", "Japa Maid", "child", ["japa-maid", "newborn-care"], 12, ["Newborn massage", "Mother care", "Swaddling", "Night care"], ["Hindi", "Gujarati"], "24-hour / live-in", ["live-in", "full-time"], "ahmedabad", "Bodakdev", "Female", "Assigned", full),
    mk("pro-prakash", "Prakash", "Personal Driver", "driver", ["driver", "personal-driver"], 11, ["Automatic & manual", "Outstation", "City routes"], ["Gujarati", "Hindi"], "8:00 AM – 8:00 PM", ["full-time", "hourly"], "ahmedabad", "Prahlad Nagar", "Male", "Available", full),
    mk("pro-lata", "Lata", "Elderly Caretaker", "care", ["elderly-care", "senior-citizen-care"], 8, ["Mobility support", "Companionship", "Medicine reminders"], ["Gujarati", "Hindi"], "Live-in", ["live-in", "full-time"], "rajkot", "Kalawad Road", "Female", "Available", part),
    mk("pro-anil", "Anil", "Patient Attendant", "care", ["patient-care", "elderly-care"], 7, ["Bedridden care", "Transfers", "Hygiene"], ["Hindi", "Gujarati"], "Night shift 8:00 PM – 8:00 AM", ["full-time", "live-in"], "gandhinagar", "Kudasan", "Male", "Available", full),
    mk("pro-rekha", "Rekha", "Housekeeper", "clean", ["housekeeping", "deep-cleaning", "maid-service"], 4, ["Deep cleaning", "Wardrobe organising", "Kitchen care"], ["Gujarati", "Hindi"], "10:00 AM – 2:00 PM", ["part-time", "hourly"], "surat", "Vesu", "Female", "Available", part),
  ];
}
const FAQ_SEED: [string, string][] = [
  ["How can I book a maid?", "Use Book a Service, choose the service, city, duty type and schedule, and submit. You get an enquiry ID instantly, and our team calls you to understand your needs and share suitable profiles."],
  ["Are professionals verified?", "Every profile shows its own verification status. Our process covers identity documents, reference checks, an in-person interview and a skills assessment, with police verification support. Where a check is still in progress, the profile says so."],
  ["Can I hire a full-time maid?", "Yes. Full-time arrangements are usually 8–10 hours a day. Exact hours, weekly off and duties are agreed before the professional joins."],
  ["Is 24-hour domestic help available?", "Live-in help is available for many services, subject to staff availability in your area. Stay, food and rest-hour arrangements are agreed in advance."],
  ["Can I interview the staff?", "Yes. Request an interview from any profile and we schedule an in-person or video interview before you confirm."],
  ["Do you provide replacements?", "Replacement assistance is provided as per our Replacement Policy. Raise a request from your dashboard and our team will share alternative profiles."],
  ["Can I book multiple services?", "Yes. Add extra services in step 1 of the booking form, or book them separately — your dashboard keeps them together."],
  ["Are babysitters trained?", "Babysitters are assessed on child-care basics such as hygiene, feeding and safe play. Each profile lists their skills and current training status."],
  ["Do you provide patient-care services?", "Yes. We provide non-clinical patient attendants for daily care. Qualified nursing professionals are offered only where their qualifications have been verified."],
  ["Which cities do you cover?", "Ahmedabad, Surat, Vadodara, Rajkot, Gandhinagar, Anand, Bhavnagar, Jamnagar, Bharuch and Mehsana. Availability varies by locality — enter your area when booking."],
  ["How is pricing calculated?", "Pricing depends on the service, duty type, working hours, household size and the professional's experience. You receive a clear quote before you confirm."],
  ["How can I cancel a booking?", "Open your dashboard and choose Request cancellation, or contact support. Any charges follow our Cancellation Policy."],
];
export const FAQS = FAQ_SEED.map(([q, a], i) => ({ id: "f" + i, q, a }));
/** FAQs shown on service and city-service pages (also used for FAQPage structured data). */
export const serviceFaqs = (name: string, price: string) => [
  { q: `How quickly can I get ${name.toLowerCase()}?`, a: "After you submit your requirement, our team calls you to confirm details and shares suitable profiles. Timelines depend on availability in your locality and duty type." },
  { q: `Can I interview the ${name.toLowerCase()} professional first?`, a: "Yes — every placement includes an interview, in person or on video, before you confirm." },
  { q: "What if the professional is not the right fit?", a: "You can request replacement assistance from your dashboard, as per our Replacement Policy." },
  { q: "How is the price decided?", a: `It depends on duty type, working hours, household size and experience. ${price ? `Current starting price: ${price}.` : "You receive a clear quote before confirming."}` },
];
export const BLOG_SEED: Post[] = [
  { slug: "choosing-a-full-time-maid", title: "How to choose the right full-time maid for your home", cat: "Hiring guide", date: "2026-10-02", excerpt: "Write down the work, agree hours and off-days in writing, and always meet before you decide.", body: ["Before you start looking, list every task you want covered and how often — daily sweeping and utensils, weekly bathroom cleaning, ironing twice a week. A clear list is the single biggest predictor of a good match.", "Agree the working hours, weekly off, festival leave and meal arrangements upfront. Put them in the service agreement so both sides know what was promised.", "Always interview in person or on video. Ask about previous homes, how long they stayed and why they left, and give a small practical task if relevant.", "Finally, check the verification status on the profile. Identity, references and police verification should all be complete or clearly in progress — never assumed."] },
  { slug: "japa-maid-guide", title: "Japa maid: what to expect in the first 40 days", cat: "Mother & baby", date: "2026-09-18", excerpt: "A good japa maid supports both mother and newborn — here is what a typical day looks like.", body: ["A japa maid supports a new mother and her baby in the weeks after delivery. Most families book from the day of discharge for 30 to 45 days, either live-in or for a long day shift.", "A typical day includes newborn massage and bath, helping the mother with feeding positions, burping and swaddling, washing baby clothes, and mother's massage where the doctor permits it.", "Always share your pediatrician's and gynaecologist's advice with the caregiver, and make sure they follow it over traditional practices when the two differ.", "Book early — experienced japa maids are often reserved weeks ahead, especially around festival season."] },
  { slug: "elder-care-at-home", title: "Elder care at home: questions to ask before you hire", cat: "Elder care", date: "2026-08-27", excerpt: "Companionship, mobility, medicines — be clear about what support your parents actually need.", body: ["Start with what your parent needs help with today: bathing and dressing, walking, meals, reminders or simply company. Needs often change, so review them every few months.", "Ask the caregiver how they handle mobility and fall risk, and how they would respond if something seemed wrong. A good caregiver reports concerns early.", "Be clear on the line between caregiving and nursing. Non-clinical caretakers can remind about medicines but should not administer injections or change doses.", "Involve your parent in the interview. Comfort and trust between them matters as much as experience."] },
];
const PLAN_SEED: Plan[] = [
  { id: "essential", name: "Essential", desc: "Part-time help for everyday chores", features: ["Part-time maid or cook", "4-5 hours a day", "Verified professional", "Replacement as per policy"], price: "", demo: true },
  { id: "family", name: "Family", desc: "A dedicated full-time professional", features: ["Full-time maid, cook or nanny", "8–10 hours a day", "Priority shortlisting", "Monthly check-in calls"], price: "", featured: true, demo: true },
  { id: "live-in", name: "Live-In Care", desc: "Round-the-clock support at home", features: ["Live-in maid, nanny or caregiver", "Rest hours & leave planned", "Dedicated relationship manager", "Replacement as per policy"], price: "", demo: true },
];
export const blankBooking = (): Omit<Booking, "id" | "created" | "status" | "history" | "name" | "phone" | "service" | "city"> => ({
  extra: [], area: "", pin: "", duty: "", family: "", home: "", resp: "", lang: "Any", expReq: "Any", gender: "No preference", notes: "", date: "",
  days: [], start: "", end: "", email: "", address: "", staff: "", shortlist: [], internal: [], amountPaid: 0, source: "Website",
});
function bookingSeed(): Booking[] {
  const now = Date.now(), day = 864e5;
  const mk = (i: number, name: string, service: string, city: string, area: string, duty: string, status: string, daysAgo: number, staff?: string): Booking => {
    const created = new Date(now - daysAgo * day).toISOString(); const idx = STATUSES.indexOf(status); const history: Booking["history"] = [];
    if (status === "Cancelled") history.push({ s: "New Enquiry", at: created }, { s: "Cancelled", at: new Date(now - (daysAgo - 1) * day).toISOString() });
    else for (let k = 0; k <= idx; k++) history.push({ s: STATUSES[k], at: new Date(now - (daysAgo - k * 0.6) * day).toISOString() });
    return { ...blankBooking(), id: "GM-DEMO-" + i, demo: true, created, status, history, service, city, area, duty, family: "4", home: "3 BHK", lang: "Gujarati", date: today(), days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], start: "09:00", end: "18:00", name, phone: "900000000" + i, address: "Demo address", source: ["Booking form", "Search widget", "Assistant", "Interview request"][i % 4], staff: staff || "", shortlist: staff ? [staff] : [] };
  };
  return [mk(1, "Demo Customer A", "full-time-maid", "ahmedabad", "Satellite", "full-time", "Service Started", 12, "pro-sunita"), mk(2, "Demo Customer B", "cook-service", "surat", "Adajan", "part-time", "Interview Scheduled", 5, "pro-ramesh"), mk(3, "Demo Customer C", "japa-maid", "ahmedabad", "Bodakdev", "live-in", "Booking Confirmed", 8, "pro-meena"), mk(4, "Demo Customer D", "elderly-care", "rajkot", "Kalawad Road", "live-in", "Contacted", 2), mk(5, "Demo Customer E", "babysitter", "vadodara", "Alkapuri", "full-time", "New Enquiry", 1), mk(6, "Demo Customer F", "driver", "ahmedabad", "Prahlad Nagar", "full-time", "Completed", 30, "pro-prakash"), mk(7, "Demo Customer G", "deep-cleaning", "surat", "Vesu", "hourly", "Cancelled", 9)];
}
export function slideSeed(): Slide[] {
  return [
    { id: "s1", scene: "family", eyebrow: "Smart Home Service · Ahmedabad · Gujarat", title: "Trusted Home Services. *Verified Professionals.* Complete Peace of Mind.", sub: "Find reliable maids, cooks, babysitters, nannies, drivers, and professional home-care staff for your family. Flexible services designed around your lifestyle.", cta: "Book a Service", link: "book", active: true },
    { id: "s2", scene: "maid", eyebrow: "Maids & housekeeping", title: "Spotless homes, *without the stress.*", sub: "Part-time, full-time and live-in maids — interviewed, ID-checked and matched to your daily routine.", cta: "Book a Maid", link: "book:maid-service", active: true },
    { id: "s3", scene: "cook", eyebrow: "Cooks & home chefs", title: "Fresh home-cooked meals, *every single day.*", sub: "Cooks for Gujarati, Jain, Punjabi and South Indian food — prepared just the way your family likes it.", cta: "Hire a Cook", link: "book:cook-service", active: true },
    { id: "s4", scene: "child", eyebrow: "Babysitters · Nannies · Japa maids", title: "Loving care for *your little ones.*", sub: "Child-care professionals who follow your routines, your rules and your pediatrician's advice.", cta: "Find a Nanny", link: "book:babysitter", active: true },
    { id: "s5", scene: "care", eyebrow: "Elder & patient care", title: "Compassionate care for *the people you love.*", sub: "Elderly caretakers and non-clinical patient attendants for day, night or live-in support at home.", cta: "Book Elder Care", link: "book:elderly-care", active: true },
    { id: "s6", scene: "driver", eyebrow: "Drivers & office staff", title: "Safe, experienced drivers *at your service.*", sub: "Licence- and reference-checked drivers for daily commutes, school runs and outstation trips.", cta: "Hire a Driver", link: "book:driver", active: true },
  ];
}
/* Real photography — downloaded to public/images/<key>.jpg by `npm run images` (list in src/lib/photos.json).
   Keys: hero/group keys (family, maid, cook, …) plus one key per service slug, so every service card has its own photo.
   Representative stock photos, not photos of listed staff. An admin-uploaded photo always overrides these. */
export type Pic = { src: string; by: string; source: string; page: string; alt: string; indian: boolean };
export const PHOTOS: Record<string, Pic> = Object.fromEntries(
  Object.entries(photoList.photos as Record<string, Omit<Pic, "src"> & { remote: string }>).map(([k, p]) => [k, { src: `/images/${k}.jpg`, by: p.by, source: p.source, page: p.page, alt: p.alt, indian: p.indian }]),
);

export const HS_BG = ["linear-gradient(135deg,#0b1f4d,#163a85 55%,#1e4fa6)", "linear-gradient(135deg,#0f2a66,#1d3f8c 55%,#2a5fc4)", "linear-gradient(135deg,#0b1f4d,#1d3f8c 55%,#3f8a12)", "linear-gradient(135deg,#0f2a66,#163a85 55%,#3f7fd6)", "linear-gradient(135deg,#081739,#163a85 60%,#1e4fa6)", "linear-gradient(135deg,#0b1f4d,#1d3f8c 50%,#2a5fc4)"];
export const HS_FLOAT: [string, string, string][] = [["shield", "ID & reference checked", "on every profile"], ["interview", "Interview first", "before you confirm"], ["clock", "Hourly to live-in", "you choose the schedule"], ["refresh", "Replacement help", "as per our policy"]];

export const POL: Record<string, [string, string[]]> = {
  "privacy-policy": ["Privacy Policy", ["What we collect: name, mobile number, email, address and service requirements from customers; identity documents, references and work history from professionals.", "How we use it: to match customers with professionals, verify staff, communicate about bookings, process payments and improve our service.", "What is public: only a professional's first name, role, experience, skills, languages, locality and verification status. Phone numbers, addresses and documents are never published.", "Storage & security: documents are kept in encrypted private storage with role-based access and audit logs.", "Your rights: you may request access, correction or deletion of your data, in line with India's Digital Personal Data Protection Act, 2023.", "Contact: write to our support email for any privacy request."]],
  "terms-and-conditions": ["Terms & Conditions", ["We are a placement and service-coordination platform connecting customers with independent domestic professionals.", "Customers agree to provide accurate requirements and to treat professionals with dignity, providing agreed rest, meals (for live-in) and timely payment.", "Professionals agree to provide truthful information and complete verification.", "Service fees, salaries and schedules are as stated in the booking confirmation and service agreement.", "We are not liable for matters outside our reasonable control; disputes are handled first through our support team."]],
  "cancellation-policy": ["Cancellation Policy", ["You may request cancellation from your dashboard or by contacting support.", "Cancellation before a professional is confirmed: [business to specify charges, if any].", "Cancellation after confirmation but before joining: [business to specify].", "Cancellation after service starts: [business to specify notice period]."]],
  "replacement-policy": ["Replacement Policy", ["If a professional is not the right fit, request a replacement from your dashboard.", "Number of free replacements and validity period: [business to specify].", "Replacement timelines depend on availability in your locality and duty type.", "Replacements are not applicable where [business to specify exclusions]."]],
  "refund-policy": ["Refund Policy", ["Eligible refunds are processed to the original payment method.", "Refund eligibility and amounts: [business to specify].", "Processing time after approval: [business to specify] working days."]],
};

export const T: Record<string, Record<string, string>> = {
  en: { home: "Home", about: "About Us", services: "All Services", find: "Find a Professional", locations: "Our Locations", how: "How It Works", pricing: "Pricing / Plans", blog: "Blog", contact: "Contact Us", login: "Login / Register", book: "Book a Service", explore: "Explore Our Services", findBtn: "Find Professionals", urgent: "Urgent requirement?" },
  hi: { home: "होम", about: "हमारे बारे में", services: "सभी सेवाएँ", find: "प्रोफेशनल खोजें", locations: "हमारे शहर", how: "यह कैसे काम करता है", pricing: "कीमतें / प्लान", blog: "ब्लॉग", contact: "संपर्क करें", login: "लॉगिन / रजिस्टर", book: "सेवा बुक करें", explore: "हमारी सेवाएँ देखें", findBtn: "प्रोफेशनल खोजें", urgent: "तुरंत ज़रूरत है?", heroT: "भरोसेमंद घरेलू सेवाएँ। सत्यापित प्रोफेशनल। पूरी निश्चिंतता।", heroS: "अपने परिवार के लिए भरोसेमंद मेड, कुक, बेबीसिटर, नैनी, ड्राइवर और होम-केयर स्टाफ़ पाएँ। आपकी जीवनशैली के अनुसार लचीली सेवाएँ।" },
  gu: { home: "હોમ", about: "અમારા વિશે", services: "બધી સેવાઓ", find: "પ્રોફેશનલ શોધો", locations: "અમારા શહેરો", how: "કેવી રીતે કામ કરે છે", pricing: "કિંમત / પ્લાન", blog: "બ્લોગ", contact: "સંપર્ક કરો", login: "લોગિન / રજિસ્ટર", book: "સેવા બુક કરો", explore: "અમારી સેવાઓ જુઓ", findBtn: "પ્રોફેશનલ શોધો", urgent: "તાત્કાલિક જરૂર છે?", heroT: "વિશ્વસનીય ઘરેલુ સેવાઓ. ચકાસાયેલ પ્રોફેશનલ્સ. સંપૂર્ણ નિશ્ચિંતતા.", heroS: "તમારા પરિવાર માટે વિશ્વસનીય મેડ, રસોઇયા, બેબીસિટર, નૅની, ડ્રાઇવર અને હોમ-કેર સ્ટાફ મેળવો. તમારી જીવનશૈલી મુજબ લવચીક સેવાઓ." },
};

export const SERVICES: Service[] = SVC_SEED.map(([slug, name, group, short, features, resp, cap]) => ({ slug, name, group, short, features, resp, cap, price: "", unit: "month", active: true, seoTitle: "", seoDesc: "" }));
export const CITIES: City[] = CITY_SEED.map(([slug, name, areas]) => ({ slug, name, areas, pins: "", active: true }));
export const STAFF_SEED = staffSeed();

export function seed(): State {
  return {
    v: 1, lang: "en",
    settings: { brand: "Smart Home Service", phone: PHONE, wa: WHATSAPP, email: EMAIL, address: ADDRESS, hours: HOURS, availability: "Serving 10 cities across Gujarat", fb: "", ig: "", li: "", yt: "", razorpay: "", notifyEmail: true, notifySms: true, notifyWa: true, adminPin: "admin123", referralCredit: "", urgentNote: "Our team will call back to confirm availability. Same-day placement depends on staff availability in your locality." },
    content: { heroT: "Trusted Home Services. Verified Professionals. Complete Peace of Mind.", heroS: "Find reliable maids, cooks, babysitters, nannies, drivers, and professional home-care staff for your family. Flexible services designed around your lifestyle.", ctaT: "Your Home Deserves the Right Help.", ctaS: "Get reliable household support from verified professionals. Tell us what your family needs, and let our team help you find the right match." },
    stats: { pros: "", families: "", years: "", cities: "", placements: "" },
    services: structuredClone(SERVICES), cities: structuredClone(CITIES), staff: staffSeed(), faqs: structuredClone(FAQS),
    reviews: [
      { id: "r1", name: "Demo Customer", city: "Ahmedabad", service: "japa-maid", rating: 5, text: "Sample review shown for layout only. Real reviews appear here once customers submit them and an admin approves them.", status: "approved", demo: true, date: "2026-10-10" },
      { id: "r2", name: "Demo Customer", city: "Surat", service: "cook-service", rating: 5, text: "Sample review — the cook matched our Jain food requirements and the interview process was simple.", status: "approved", demo: true, date: "2026-09-21" },
      { id: "r3", name: "Demo Customer", city: "Vadodara", service: "babysitter", rating: 4, text: "Sample review — clear verification details on the profile helped us decide quickly.", status: "approved", demo: true, date: "2026-09-02" },
      { id: "r4", name: "Demo Customer", city: "Rajkot", service: "elderly-care", rating: 5, text: "Sample pending review — approve or reject it from Admin → Content.", status: "pending", demo: true, date: "2026-11-01" },
    ],
    blog: structuredClone(BLOG_SEED), plans: structuredClone(PLAN_SEED),
    coupons: [{ code: "WELCOME10", type: "percent", value: 10, active: true, demo: true }],
    bookings: bookingSeed(), slides: slideSeed(), sliderSec: 6, tickets: [], subscribers: [], customers: {}, user: null, staffUser: null,
  };
}
