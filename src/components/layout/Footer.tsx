import Link from "@/components/i18n/LocalizedLink";
import Image from "next/image";
import { MapPin, Phone, Mail } from "lucide-react";
import {
  FacebookIcon,
  TwitterIcon,
  YoutubeIcon,
  InstagramIcon,
} from "@/components/common/SocialIcons";
import BackToTopButton from "@/components/layout/BackToTopButton";
import type { Locale } from "@/lib/i18n/config";

export default function Footer({ locale }: { locale: Locale }) {
  return (
    <footer className="bg-surface border-t-2 border-border text-foreground mt-16 font-sans">
      {/* ── 1. Top Newsletter & Charter Row ── */}
      <div className="border-b border-border">
        <div className="container-editorial py-8 sm:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Editorial Charter & Contact Info */}
            <div className="lg:col-span-12 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-6">
                <Link href="/" className="shrink-0">
                  <Image
                    src="/images/sudur-logo.png"
                    alt="Sudur Chinari Logo"
                    width={300}
                    height={100}
                    className="h-20 sm:h-24 w-auto object-contain"
                  />
                </Link>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-sm font-serif border-l-0 sm:border-l-2 border-border sm:pl-6">
                  {locale === "ne"
                    ? "सुदूरपश्चिम प्रदेशको पहिलो डिजिटल ब्रोडसिट — सौन्दर्यपूर्ण, निष्पक्ष र तथ्यपरक खोज पत्रकारिता।"
                    : "Far-West Province's foremost digital broadsheet — dedicated to aesthetic, fearless, and analytical journalism."}
                </p>
              </div>

              <div className="flex flex-col gap-2.5 text-xs text-muted-foreground">
                <div className="flex items-center gap-2.5">
                  <MapPin size={16} className="text-brand-secondary shrink-0" />
                  <span>
                    {locale === "ne"
                      ? "धनगढी उपमहानगरपालिका-१, कैलाली, सुदूरपश्चिम प्रदेश"
                      : "Dhangadhi Sub-Metropolitan City-1, Kailali, Far-West Province"}
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone size={16} className="text-brand-secondary shrink-0" />
                  <span>+९७७ ९८०००००००० / ०९१-५०००००</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail size={16} className="text-brand-secondary shrink-0" />
                  <a
                    href="mailto:info@sudurchinari.com"
                    className="hover:text-brand-secondary transition-colors"
                  >
                    info@sudurchinari.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Broadsheet Category Columns Grid ── */}
      <div className="container-editorial py-10 sm:py-12 border-b border-border">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 sm:gap-8 text-xs">
          {/* Col 1: News & Coverage */}
          <div>
            <h5 className="text-[11px] font-mono font-semibold text-brand-secondary mb-3.5">
              {locale === "ne" ? "समाचार" : "Coverage"}
            </h5>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link
                  href="/category/politics"
                  className="hover:text-brand-secondary transition-colors"
                >
                  {locale === "ne"
                    ? "राजनीति तथा सुशासन"
                    : "Politics & Governance"}
                </Link>
              </li>
              <li>
                <Link
                  href="/category/economy"
                  className="hover:text-brand-secondary transition-colors"
                >
                  {locale === "ne"
                    ? "अर्थतन्त्र तथा व्यापार"
                    : "Economy & Business"}
                </Link>
              </li>
              <li>
                <Link
                  href="/category/society"
                  className="hover:text-brand-secondary transition-colors"
                >
                  {locale === "ne" ? "समाज तथा विकास" : "Society & Development"}
                </Link>
              </li>
              <li>
                <Link
                  href="/category/education"
                  className="hover:text-brand-secondary transition-colors"
                >
                  {locale === "ne"
                    ? "शिक्षा र स्वास्थ्य"
                    : "Education & Health"}
                </Link>
              </li>
              <li>
                <Link
                  href="/category/sports"
                  className="hover:text-brand-secondary transition-colors"
                >
                  {locale === "ne" ? "खेलकुद गतिविधि" : "Sports"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Districts */}
          <div>
            <h5 className="text-[11px] font-mono font-semibold text-brand-secondary mb-3.5">
              {locale === "ne" ? "जिल्लाहरू" : "Districts"}
            </h5>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link
                  href="/district/kailali"
                  className="hover:text-brand-secondary transition-colors"
                >
                  {locale === "ne" ? "कैलाली (धनगढी)" : "Kailali (Dhangadhi)"}
                </Link>
              </li>
              <li>
                <Link
                  href="/district/kanchanpur"
                  className="hover:text-brand-secondary transition-colors"
                >
                  {locale === "ne"
                    ? "कञ्चनपुर (महेन्द्रनगर)"
                    : "Kanchanpur (Mahendranagar)"}
                </Link>
              </li>
              <li>
                <Link
                  href="/district/dadeldhura"
                  className="hover:text-brand-secondary transition-colors"
                >
                  {locale === "ne"
                    ? "डडेल्धुरा (अमरगढी)"
                    : "Dadeldhura (Amargadhi)"}
                </Link>
              </li>
              <li>
                <Link
                  href="/district/doti"
                  className="hover:text-brand-secondary transition-colors"
                >
                  {locale === "ne"
                    ? "डोटी (दिपायल सिलगढी)"
                    : "Doti (Dipayal Silgadhi)"}
                </Link>
              </li>
              <li>
                <Link
                  href="/district/achham"
                  className="hover:text-brand-secondary transition-colors"
                >
                  {locale === "ne" ? "अछाम (मंगलसेन)" : "Achham (Mangalsen)"}
                </Link>
              </li>
              <li>
                <Link
                  href="/district"
                  className="hover:text-brand-secondary transition-colors font-bold text-brand-secondary"
                >
                  {locale === "ne"
                    ? "सबै ९ जिल्लाहरू \u2192"
                    : "All 9 Districts \u2192"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Arts & Culture */}
          <div>
            <h5 className="text-[11px] font-mono font-semibold text-brand-secondary mb-3.5">
              {locale === "ne" ? "कला तथा जीवन" : "Arts & Life"}
            </h5>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link
                  href="/category/culture"
                  className="hover:text-brand-secondary transition-colors"
                >
                  {locale === "ne"
                    ? "सुदूरपश्चिमको लोकसंस्कृति"
                    : "Folk Culture"}
                </Link>
              </li>
              <li>
                <Link
                  href="/category/tourism"
                  className="hover:text-brand-secondary transition-colors"
                >
                  {locale === "ne" ? "पर्यटन तथा खप्तड" : "Tourism & Khaptad"}
                </Link>
              </li>
              <li>
                <Link
                  href="/photos"
                  className="hover:text-brand-secondary transition-colors"
                >
                  {locale === "ne" ? "फोटो फिचर ग्यालरी" : "Photo Features"}
                </Link>
              </li>
              <li>
                <Link
                  href="/videos"
                  className="hover:text-brand-secondary transition-colors"
                >
                  {locale === "ne"
                    ? "भिडियो डकुमेन्ट्री"
                    : "Video Documentaries"}
                </Link>
              </li>
              <li>
                <Link
                  href="/category/opinion"
                  className="hover:text-brand-secondary transition-colors"
                >
                  {locale === "ne" ? "विशेष विचार स्तम्भ" : "Special Columns"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Institution & Services */}
          <div>
            <h5 className="text-[11px] font-mono font-semibold text-brand-secondary mb-3.5">
              {locale === "ne" ? "संस्था" : "Services"}
            </h5>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link
                  href="/about"
                  className="hover:text-brand-secondary transition-colors"
                >
                  {locale === "ne"
                    ? "हाम्रोबारे र सम्पादकीय टोली"
                    : "About & Editorial Team"}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-brand-secondary transition-colors"
                >
                  {locale === "ne"
                    ? "सम्पर्क तथा कार्यालय"
                    : "Contact & Office"}
                </Link>
              </li>
              <li>
                <Link
                  href="/yatayat"
                  className="hover:text-brand-secondary transition-colors"
                >
                  {locale === "ne"
                    ? "सुदूर यातायात निर्देशिका"
                    : "Sudur Yatayat Directory"}
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-brand-secondary transition-colors"
                >
                  {locale === "ne" ? "गोपनीयता नीति" : "Privacy Policy"}
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-brand-secondary transition-colors"
                >
                  {locale === "ne" ? "प्रयोगका सर्तहरू" : "Terms of Use"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Social Channels */}
          <div>
            <h5 className="text-[11px] font-mono font-semibold text-brand-secondary mb-3.5">
              {locale === "ne" ? "सञ्जाल" : "Connect"}
            </h5>
            <p className="text-[11px] text-muted-foreground mb-3">
              {locale === "ne"
                ? "सुदूर चिनारीका आधिकारिक सामाजिक सञ्जालहरू:"
                : "Sudur Chinari's official social networks:"}
            </p>
            <div className="flex flex-col space-y-3 text-xs font-bold mt-1">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-brand-secondary transition-colors flex items-center gap-2"
              >
                <FacebookIcon size={14} className="text-foreground hover:text-brand-secondary" />
                <span>{locale === "ne" ? "फेसबुक" : "Facebook"}</span>
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-brand-secondary transition-colors flex items-center gap-2"
              >
                <TwitterIcon size={14} className="text-black dark:text-white" />
                <span>{locale === "ne" ? "एक्स" : "X"}</span>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-brand-secondary transition-colors flex items-center gap-2"
              >
                <YoutubeIcon size={14} className="text-foreground hover:text-brand-secondary" />
                <span>{locale === "ne" ? "युट्युब" : "YouTube"}</span>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-brand-secondary transition-colors flex items-center gap-2"
              >
                <InstagramIcon size={14} className="text-foreground hover:text-brand-secondary" />
                <span>{locale === "ne" ? "इन्स्टाग्राम" : "Instagram"}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* ── 4. Editorial Team ── */}
      <div className="border-b border-border py-8">
        <div className="container-editorial">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-xs text-muted-foreground">
            <div>
              <h5 className="font-bold text-foreground mb-1">
                {locale === "ne" ? "प्रकाशक / अध्यक्ष" : "Publisher / Chairman"}
              </h5>
              <p className="font-serif text-brand-secondary font-medium text-sm">
                {locale === "ne" ? "गणेश कुँवर" : "Ganesh Kunwar"}
              </p>
            </div>
            <div>
              <h5 className="font-bold text-foreground mb-1">
                {locale === "ne" ? "सम्पादक" : "Editor"}
              </h5>
              <p className="font-serif text-sm">
                {locale === "ne" ? "जीवन श्रेष्ठ" : "Jeevan Shrestha"}
              </p>
            </div>
            <div>
              <h5 className="font-bold text-foreground mb-1">
                {locale === "ne" ? "सम्वाददाता" : "Correspondent"}
              </h5>
              <p className="font-serif text-sm">
                {locale === "ne" ? "गणेश कुँवर" : "Ganesh Kunwar"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── 5. Bottom Legal & Back to Top ── */}
      <div className="container-editorial py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-muted-foreground">
        <div>
          <span>
            &copy; २०२४-२०२६ सुदूर चिनारी डिजिटल ब्रोडसिट। सर्वाधिकार
            सुरक्षित।{" "}
          </span>
          <span className="font-mono">ISSN 2984-1029</span>
        </div>

        <BackToTopButton />
      </div>
    </footer>
  );
}
