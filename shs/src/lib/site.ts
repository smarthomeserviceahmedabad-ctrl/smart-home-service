export const SITE = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
export const BRAND = "Smart Home Service";

// Business contact details (also editable in Admin → Settings).
export const PHONE = "+91 81607 35095";        // Daksh — main number shown on the site; click-to-call uses tel:+918160735095
export const PHONE2 = "+91 87990 56949";       // Anita — second contact number
export const WHATSAPP = "918160735095";         // wa.me number: country code + number, digits only
/** Old contact values that may still be saved in visitors' browsers; replaced with the ones above on load. */
export const OLD_CONTACT = { phone: "+91 96363 26949", wa: "919636326949" };
export const EMAIL = "smarthomeserviceahmedabad@gmail.com";

// Office address
export const ADDR = {
  street: "Office No. 405, 4th Floor, Shanti Arcade, Near Jay Mangal BRTS Bus Stop",
  locality: "Naranpura", city: "Ahmedabad", region: "Gujarat", pin: "380013", country: "IN",
};
export const ADDRESS = `${ADDR.street}, ${ADDR.locality}, ${ADDR.city}, ${ADDR.region} ${ADDR.pin}`;
/** Google Maps links built from an address (no API key needed). */
export const mapsLink = (a: string) => "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(a);
export const mapsEmbed = (a: string) => "https://maps.google.com/maps?q=" + encodeURIComponent(a) + "&z=16&output=embed";
