"use client";

import React from "react";
import { X, Phone, Clock, Map, Info, AlertTriangle, CheckCircle2 } from "lucide-react";
import FTModal from "@/components/common/FTModal";

export type ModalType = "contacts" | "schedule" | "routes" | "guidelines" | "report" | null;

interface QuickActionsModalProps {
  type: ModalType;
  onClose: () => void;
  locale?: string;
}

export default function QuickActionsModal({
  type,
  onClose,
  locale = "ne",
}: QuickActionsModalProps) {
  if (!type) return null;

  return (
    <FTModal
      onClose={onClose}
      maxWidth="max-w-lg"
      maxHeight="max-h-[85vh]"
      ariaLabel={locale === "ne" ? "छिटो जानकारी" : "Quick Information"}
    >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface/50">
          <div className="flex items-center gap-2.5">
            {type === "contacts" && <Phone size={20} className="text-brand" />}
            {type === "schedule" && <Clock size={20} className="text-brand" />}
            {type === "routes" && <Map size={20} className="text-brand-secondary" />}
            {type === "guidelines" && <Info size={20} className="text-brand-secondary" />}
            {type === "report" && <AlertTriangle size={20} className="text-red-600" />}
            <h3 className="text-lg sm:text-xl font-bold text-foreground font-headline">
              {type === "contacts" && (locale === "ne" ? "सम्पर्क नम्बरहरू (हेल्पलाइन)" : "Emergency & Hotlines")}
              {type === "schedule" && (locale === "ne" ? "दैनिक प्रस्थान समयतालिका" : "Departure Timetable")}
              {type === "routes" && (locale === "ne" ? "प्रमुख राजमार्ग तथा मार्गहरू" : "Major Highways & Corridors")}
              {type === "guidelines" && (locale === "ne" ? "यात्रु निर्देशिका तथा नियमहरू" : "Traveler Guidelines")}
              {type === "report" && (locale === "ne" ? "गलत जानकारी रिपोर्ट गर्नुहोस्" : "Report Inaccurate Information")}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-muted-foreground hover:text-foreground rounded-none hover:bg-surface transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-sm sm:text-base font-sans">
          {type === "contacts" && (
            <div className="space-y-3.5">
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                {locale === "ne"
                  ? "सुदूरपश्चिम प्रदेशका प्रमुख बसपार्क तथा ट्राफिक प्रहरी सम्पर्क नम्बरहरू:"
                  : "Major bus parks and highway traffic police hotlines across Sudurpashchim:"}
              </p>
              <div className="divide-y divide-border border border-border rounded-none overflow-hidden bg-surface">
                <div className="p-3.5 flex justify-between items-center gap-3">
                  <div>
                    <div className="font-bold text-foreground text-sm sm:text-base">{locale === "ne" ? "नेपाल ट्राफिक प्रहरी हेल्पलाइन" : "Traffic Police Helpline"}</div>
                    <div className="text-xs sm:text-[13px] text-muted-foreground">{locale === "ne" ? "चौबीसै घण्टा खुला" : "24/7 Toll Free"}</div>
                  </div>
                  <a href="tel:103" className="px-3.5 py-1.5 bg-brand text-white rounded-none font-bold text-xs sm:text-sm">१०३ / 103</a>
                </div>
                <div className="p-3.5 flex justify-between items-center gap-3">
                  <div>
                    <div className="font-bold text-foreground text-sm sm:text-base">{locale === "ne" ? "धनगढी बसपार्क काउन्टर" : "Dhangadhi Buspark"}</div>
                    <div className="text-xs sm:text-[13px] text-muted-foreground">{locale === "ne" ? "कैलाली" : "Kailali"}</div>
                  </div>
                  <a href="tel:091521234" className="px-3.5 py-1.5 bg-background border border-border text-foreground hover:text-brand rounded-none font-mono text-xs sm:text-sm font-semibold">०९१-५२१२३४</a>
                </div>
                <div className="p-3.5 flex justify-between items-center gap-3">
                  <div>
                    <div className="font-bold text-foreground text-sm sm:text-base">{locale === "ne" ? "महेन्द्रनगर बसपार्क काउन्टर" : "Mahendranagar Buspark"}</div>
                    <div className="text-xs sm:text-[13px] text-muted-foreground">{locale === "ne" ? "कञ्चनपुर" : "Kanchanpur"}</div>
                  </div>
                  <a href="tel:099521122" className="px-3.5 py-1.5 bg-background border border-border text-foreground hover:text-brand rounded-none font-mono text-xs sm:text-sm font-semibold">०९९-५२११२२</a>
                </div>
                <div className="p-3.5 flex justify-between items-center gap-3">
                  <div>
                    <div className="font-bold text-foreground text-sm sm:text-base">{locale === "ne" ? "अत्तरिया मुख्य चोक सहायता कक्ष" : "Attariya Junction Helpdesk"}</div>
                    <div className="text-xs sm:text-[13px] text-muted-foreground">{locale === "ne" ? "केन्द्रीय जंक्सन" : "Central Junction"}</div>
                  </div>
                  <a href="tel:091550111" className="px-3.5 py-1.5 bg-background border border-border text-foreground hover:text-brand rounded-none font-mono text-xs sm:text-sm font-semibold">०९१-५५०१११</a>
                </div>
              </div>
            </div>
          )}

          {type === "schedule" && (
            <div className="space-y-3.5">
              <p className="text-muted-foreground text-sm sm:text-base">
                {locale === "ne"
                  ? "सुदूरपश्चिमका मुख्य गन्तव्यहरूको दैनिक प्रस्थान समय:"
                  : "Standard daily departure slots from primary terminals:"}
              </p>
              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full min-w-[420px] text-left border border-border rounded-none overflow-hidden text-sm">
                  <thead className="bg-surface text-muted-foreground text-xs uppercase font-mono">
                    <tr>
                      <th className="p-3 border-b border-border">{locale === "ne" ? "मार्ग" : "Route"}</th>
                      <th className="p-3 border-b border-border">{locale === "ne" ? "समय" : "Time"}</th>
                      <th className="p-3 border-b border-border">{locale === "ne" ? "सवारी" : "Vehicle"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border bg-background">
                    <tr>
                      <td className="p-3 font-medium">धनगढी ➔ साँफेबगर</td>
                      <td className="p-3 text-brand font-bold">बिहान ६:००, ७:०० बजे</td>
                      <td className="p-3">बस / डिलक्स</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">महेन्द्रनगर ➔ अछाम</td>
                      <td className="p-3 text-brand font-bold">बिहान ६:३० बजे</td>
                      <td className="p-3">सुपर डिलक्स</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">धनगढी ➔ महेन्द्रनगर</td>
                      <td className="p-3 text-brand font-bold">हरेक ३० मिनेटमा</td>
                      <td className="p-3">हाइस / विङगर</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">साँफेबगर ➔ बाजुरा</td>
                      <td className="p-3 text-brand font-bold">बिहान ८:००, २:०० बजे</td>
                      <td className="p-3">४x४ जीप</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {type === "routes" && (
            <div className="space-y-3.5">
              <p className="text-muted-foreground text-sm sm:text-base">
                {locale === "ne"
                  ? "सुदूरपश्चिम प्रदेशका प्रमुख लाइफलाइन राजमार्गहरू:"
                  : "Major lifeline highways traversing Sudurpashchim:"}
              </p>
              <ul className="space-y-2.5">
                <li className="p-3.5 bg-surface border border-border border-l-[3px] border-l-brand rounded-none">
                  <div className="font-bold text-foreground text-sm sm:text-base">भीमदत्त राजमार्ग (अत्तरिया ➔ डडेलधुरा ➔ डोटी ➔ बैतडी)</div>
                  <div className="text-muted-foreground text-xs sm:text-[13px] mt-0.5">सुदूरपश्चिमका पहाडी जिल्लाहरू जोड्ने मुख्य लाइफलाइन।</div>
                </li>
                <li className="p-3.5 bg-surface border border-border border-l-[3px] border-l-brand-secondary rounded-none">
                  <div className="font-bold text-foreground text-sm sm:text-base">महेन्द्र राजमार्ग (कर्णाली पुल ➔ अत्तरिया ➔ गड्डाचौकी)</div>
                  <div className="text-muted-foreground text-xs sm:text-[13px] mt-0.5">पूर्व-पश्चिम तराई जोड्ने राष्ट्रिय राजमार्ग।</div>
                </li>
                <li className="p-3.5 bg-surface border border-border border-l-[3px] border-l-amber-600 rounded-none">
                  <div className="font-bold text-foreground text-sm sm:text-base">सेती लोकमार्ग (टीकापुर ➔ साँफेबगर ➔ ताक्लाकोट)</div>
                  <div className="text-muted-foreground text-xs sm:text-[13px] mt-0.5">कैलाली र अछाम जोड्ने व्यापारिक तथा पर्यटकीय कोरिडोर।</div>
                </li>
              </ul>
            </div>
          )}

          {type === "guidelines" && (
            <div className="space-y-3.5 text-sm sm:text-base leading-relaxed text-muted-foreground">
              <div className="p-4 bg-surface border border-border border-l-[3px] border-l-brand rounded-none space-y-2.5">
                <div className="font-bold text-brand flex items-center gap-2 text-base">
                  <CheckCircle2 size={16} />
                  <span>{locale === "ne" ? "सुरक्षित यात्राका सुझावहरू" : "Safety Recommendations"}</span>
                </div>
                <p>१. पहाडी यात्रामा जानुअघि अग्रिम सिट बुकिङ गर्नुहोस्।</p>
                <p>२. काउन्टरबाट मात्र आधिकारिक टिकट खरिद गरी बिल सुरक्षित राख्नुहोस्।</p>
                <p>३. निर्धारित भाडादर भन्दा बढी मागेमा नजिकैको ट्राफिक प्रहरीलाई खबर गर्नुहोस्।</p>
                <p>४. यात्रा गर्दा आफ्नो आवश्यक परिचयपत्र र औषधि साथमा राख्नुहोला।</p>
              </div>
            </div>
          )}

          {type === "report" && (
            <form onSubmit={(e) => { e.preventDefault(); alert(locale === "ne" ? "रिपोर्ट दर्ता गरियो। धन्यवाद !" : "Report received. Thank you!"); onClose(); }} className="space-y-3.5">
              <p className="text-muted-foreground text-sm sm:text-base">
                {locale === "ne"
                  ? "यदि कुनै बस, रूट वा भाडादरमा त्रुटि भेटिएमा कृपया तल उल्लेख गरिदिनुहोला:"
                  : "If you found outdated timings, wrong phone numbers, or changed fares:"}
              </p>
              <div>
                <label className="block text-sm font-bold mb-1.5 font-sans">{locale === "ne" ? "सवारी साधन वा कम्पनीको नाम" : "Service Name"}</label>
                <input type="text" required placeholder="e.g. Achham Yatayat" className="w-full px-3.5 py-2.5 text-sm sm:text-base border border-border bg-surface rounded-none" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1.5 font-sans">{locale === "ne" ? "गलत जानकारीको विवरण" : "Issue Description"}</label>
                <textarea rows={3} required placeholder={locale === "ne" ? "के विवरण फेरिएको छ..." : "Describe the inaccuracy..."} className="w-full px-3.5 py-2.5 text-sm sm:text-base border border-border bg-surface rounded-none" />
              </div>
              <button type="submit" className="w-full py-2.5 bg-red-600 text-white rounded-none font-bold text-sm sm:text-base hover:bg-red-700 transition-colors cursor-pointer shadow-xs">
                {locale === "ne" ? "रिपोर्ट पठाउनुहोस्" : "Submit Report"}
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-border bg-surface/50 text-right">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-surface border border-border text-foreground text-sm font-semibold rounded-none hover:bg-surface-hover transition-colors cursor-pointer"
          >
            {locale === "ne" ? "बन्द गर्नुहोस्" : "Close"}
          </button>
        </div>
      </FTModal>
  );
}
