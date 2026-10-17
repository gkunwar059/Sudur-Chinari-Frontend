import { Utensils } from "lucide-react";
import FTSectionDivider from "@/components/common/FTSectionDivider";

interface Props {
    isEn: boolean;
  t: (obj: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => string;
}

export default function HotelDining({ isEn }: Omit<Props, "hotel" | "t">) {
  return (
    <section id="dining" className="scroll-mt-32 mt-16">
      <FTSectionDivider
        title={isEn ? "Dining & Restaurant" : "भोजन र रेस्टुरेन्ट"}
        sectionIndex="03"
      />
      <div className="bg-surface border border-border/50 p-6 sm:p-8 mt-6 rounded-none">
        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
          <div className="w-16 h-16 bg-brand/10 text-brand flex items-center justify-center shrink-0 rounded-none">
            <Utensils size={32} />
          </div>
          <div>
            <h4 className="text-xl font-bold text-foreground mb-2">
              {isEn ? "On-site Dining" : "होटलमै भोजनको सुविधा"}
            </h4>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl">
              {isEn 
                ? "Experience local flavors and diverse cuisines prepared by our expert chefs. Whether you're looking for a quick breakfast, a hearty lunch, or a relaxing dinner, our dining facilities have you covered." 
                : "हाम्रा विशेषज्ञ भान्सेहरूद्वारा तयार पारिएका स्थानीय स्वाद र विविध परिकारहरूको अनुभव लिनुहोस्। चाहे तपाईं छिटो खाजा, स्वादिष्ट दिउँसोको खाना वा आरामदायी रात्रीभोज चाहनुहुन्छ, हाम्रो भोजन सुविधाले तपाईंलाई सन्तुष्ट पार्नेछ।"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
