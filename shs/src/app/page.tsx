import { HomeView } from "@/views/public";
import { meta, JsonLd, faqLd } from "@/lib/seo";
import { FAQS } from "@/lib/data";

export const metadata = {
  ...meta("Smart Home Service Ahmedabad — Maid, Cook, Baby Sitter, Elder Care & Driver", "Smart Home Service, Naranpura, Ahmedabad: verified house maids, servants, cooks, baby sitters, nanny/aaya, elder care, patient caretakers, drivers & office boys. Interview before you hire. Call +91 81607 35095.", "/"),
  title: { absolute: "Smart Home Service Ahmedabad | Maid, Cook, Baby Sitter, Elder Care & Driver Agency" },
};

export default function Page() {
  return <><JsonLd data={faqLd(FAQS)} /><HomeView /></>;
}
