"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2, Loader2, ShieldCheck, MessageSquare, Megaphone, Plus } from "lucide-react";
import FTBreadcrumb from "@/components/common/FTBreadcrumb";
import FTSectionDivider from "@/components/common/FTSectionDivider";
import AdBanner from "@/components/common/AdBanner";
import AdUploadModal from "@/components/ads/AdUploadModal";
import { newsApi } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";

export default function ContactPage() {
  const { locale } = useLanguage();
  const isNe = locale === "ne";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await newsApi.postContactInquiryClient({
        name,
        email,
        phone,
        subject,
        message,
      });
      setSuccess(true);
      setName("");
      setEmail("");
      setPhone("");
      setSubject("");
      setMessage("");
    } catch (err: any) {
      console.error("Contact inquiry error:", err);
      setError(
        isNe
          ? "सन्देश पठाउन सकिएन। कृपया केही समयपछि पुनः प्रयास गर्नुहोस्।"
          : "Failed to send message. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 mobile-safe-bottom bg-background min-h-screen">
      <FTBreadcrumb
        locale={locale}
        items={[
          {
            name: isNe ? "सम्पर्क तथा विज्ञापन" : "Contact & Advertising",
          },
        ]}
      />

      <div className="container-editorial py-10 sm:py-14">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-10 text-center sm:text-left border-b border-border pb-8">
            <span className="ft-kicker mb-2">
              {isNe ? "सम्पर्क विवरण" : "Get in Touch"}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif-np font-bold text-foreground leading-tight">
              {isNe ? "सम्पादकीय तथा विज्ञापन सम्पर्क" : "Editorial & Business Inquiries"}
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base mt-2.5 max-w-2xl font-sans leading-relaxed">
              {isNe
                ? "सुदूरपश्चिमका खोजमूलक समाचार, सम्पादकीय प्रतिक्रिया, वा व्यावसायिक विज्ञापनका लागि तलको फाराम प्रयोग गर्नुहोस्।"
                : "Reach out to our news desk for investigative news tips, feedback, or strategic advertising opportunities."}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start scroll-reveal">
            {/* Contact Information & Desk */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-surface border border-border border-t-[3px] border-t-brand p-6 space-y-4">
                <h3 className="font-bold text-base text-foreground font-headline">
                  {isNe ? "केन्द्रीय कार्यालय" : "Headquarters"}
                </h3>

                <div className="space-y-3.5 text-xs sm:text-sm text-muted-foreground font-sans">
                  <div className="flex items-start gap-3">
                    <MapPin size={17} className="text-brand shrink-0 mt-0.5" />
                    <span>
                      {isNe
                        ? "धनगढी उपमहानगरपालिका-१, कैलाली, सुदूरपश्चिम प्रदेश, नेपाल"
                        : "Dhangadhi Sub-Metropolitan City-1, Kailali, Far-West Province, Nepal"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone size={17} className="text-brand shrink-0" />
                    <span>+९७७ ९८०००००००० / ०९१-५०००००</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail size={17} className="text-brand shrink-0" />
                    <a
                      href="mailto:editorial@sudurchinari.com"
                      className="text-foreground hover:text-brand font-medium transition-colors"
                    >
                      editorial@sudurchinari.com
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-surface border border-border border-t-[3px] border-t-brand-secondary p-6 space-y-3">
                <div className="flex items-center gap-2 text-brand-secondary font-bold text-sm">
                  <ShieldCheck size={18} />
                  <span>{isNe ? "गोप्य समाचार सूचना (News Tips)" : "Confidential Whistleblower Desk"}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed font-sans">
                  {isNe
                    ? "यदि तपाईंसँग भ्रष्टाचार, सार्वजनिक हित वा खोजमूलक विषयको तथ्यपरक प्रमाण छ भने हामी स्रोतको पूर्ण गोपनीयता सुनिश्चित गर्दछौं।"
                    : "We protect source confidentiality under professional journalistic standards."}
                </p>
              </div>

              {/* Digital Advertising Upload Portal Card */}
              <div className="bg-surface border border-border border-t-[3px] border-t-brand p-6 space-y-3">
                <div className="flex items-center gap-2 text-brand font-bold text-sm">
                  <Megaphone size={18} />
                  <span>{isNe ? "डिजिटल विज्ञापन पोर्टल" : "Digital Advertising Portal"}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed font-sans">
                  {isNe
                    ? "सुदूर चिनारीका गृहपृष्ठ, समाचार, विधा वा जिल्ला खण्डहरूमा तपाईंको संस्था वा व्यवसायको विज्ञापन ब्यानर सिधै अपलोड गरी प्रमाणीकरण गराउनुहोस्।"
                    : "Upload your advertising banners for Homepage, Articles, Categories, or District pages and request admin verification."}
                </p>
                <button
                  type="button"
                  onClick={() => setIsAdModalOpen(true)}
                  className="w-full mt-2 py-2.5 px-4 bg-brand hover:bg-brand-dark text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Plus size={14} strokeWidth={2.5} />
                  <span>{isNe ? "विज्ञापन सामाग्री अपलोड गर्नुहोस्" : "Upload Ad Creative"}</span>
                </button>
              </div>
            </div>

            {/* Inquiry Form */}
            <div className="lg:col-span-7 bg-surface border border-border p-6 sm:p-8 shadow-xs">
              <h3 className="text-lg font-bold text-foreground font-headline mb-4 flex items-center gap-2">
                <MessageSquare size={18} className="text-brand" />
                <span>{isNe ? "हामीलाई सन्देश पठाउनुहोस्" : "Send Us a Message"}</span>
              </h3>

              {success ? (
                <div className="py-10 text-center space-y-3">
                  <CheckCircle2 size={48} className="text-brand mx-auto animate-bounce" />
                  <h4 className="text-xl font-bold text-foreground font-headline">
                    {isNe ? "सन्देश प्राप्त भयो !" : "Message Sent Successfully!"}
                  </h4>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto font-sans">
                    {isNe
                      ? "तपाईंको सोधपुछ सम्पादकीय टोलीमा दर्ता भएको छ। हामी छिट्टै सम्पर्क गर्नेछौं।"
                      : "Thank you for reaching out. Our team will review your message and respond promptly."}
                  </p>
                  <button
                    type="button"
                    onClick={() => setSuccess(false)}
                    className="mt-4 px-5 py-2 bg-brand text-white text-xs font-bold hover:bg-brand/90 transition-colors cursor-pointer"
                  >
                    {isNe ? "अर्को सन्देश पठाउनुहोस्" : "Send Another Message"}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 text-xs font-sans">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-foreground mb-1 font-sans">
                        {isNe ? "तपाईंको नाम *" : "Your Name *"}
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={isNe ? "जस्तै: रमेश भट्ट" : "e.g. Ramesh Bhatta"}
                        className="w-full px-3 py-2 text-sm border border-border bg-background focus:outline-none focus:border-brand"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-foreground mb-1 font-sans">
                        {isNe ? "इमेल ठेगाना *" : "Email Address *"}
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-3 py-2 text-sm border border-border bg-background focus:outline-none focus:border-brand"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-foreground mb-1 font-sans">
                        {isNe ? "फोन नम्बर" : "Phone Number"}
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="98xxxxxxxx"
                        className="w-full px-3 py-2 text-sm border border-border bg-background focus:outline-none focus:border-brand"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-foreground mb-1 font-sans">
                        {isNe ? "विषय *" : "Subject *"}
                      </label>
                      <input
                        type="text"
                        required
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder={isNe ? "जस्तै: विज्ञापन सम्बन्धी सोधपुछ" : "e.g. Advertising Inquiry"}
                        className="w-full px-3 py-2 text-sm border border-border bg-background focus:outline-none focus:border-brand"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1 font-sans">
                      {isNe ? "सन्देश / विवरण *" : "Message / Details *"}
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={isNe ? "आफ्नो सन्देश यहाँ लेख्नुहोस्..." : "Write your message here..."}
                      className="w-full px-3 py-2 text-sm border border-border bg-background focus:outline-none focus:border-brand resize-y"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-brand text-white font-bold text-sm hover:bg-brand/90 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 shadow-xs"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>{isNe ? "पठाउँदै..." : "Sending..."}</span>
                      </>
                    ) : (
                      <>
                        <Send size={15} />
                        <span>{isNe ? "सन्देश पठाउनुहोस्" : "Submit Inquiry"}</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Bottom Billboard Ad Placement */}
          <div className="mt-12 scroll-reveal scroll-delay-100">
            <AdBanner placement="billboard-mid" page="all" />
          </div>
        </div>
      </div>

      {/* Ad Creative Upload Modal */}
      <AdUploadModal
        isOpen={isAdModalOpen}
        onClose={() => setIsAdModalOpen(false)}
        initialPage="all"
        initialPlacement="billboard-mid"
        initialPath="/contact"
        slotName={isNe ? "मुख्य ब्यानर (Billboard Mid)" : "Billboard Mid"}
        slotDims="1200x120 px"
      />
    </main>
  );
}
