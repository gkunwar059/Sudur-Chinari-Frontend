import type { Locale } from "@/lib/i18n/config";

export interface BilingualText {
  en: string;
  ne: string;
}

export interface PrivacySubsection {
  id: string;
  number: string;
  title: BilingualText;
  paragraphs?: BilingualText[];
  bullets?: BilingualText[];
  paragraphsAfter?: BilingualText[];
}

export interface PrivacySection {
  id: string;
  number: string;
  title: BilingualText;
  paragraphs?: BilingualText[];
  bullets?: BilingualText[];
  paragraphsAfter?: BilingualText[];
  subsections?: PrivacySubsection[];
}

export const PRIVACY_LAST_UPDATED: BilingualText = {
  en: "November 8, 2026",
  ne: "२०८३ कात्तिक २२",
};

export const PRIVACY_META: Record<
  Locale,
  { title: string; description: string }
> = {
  en: {
    title: "Privacy Policy",
    description:
      "How Sudur Chinari collects, uses, processes, stores, and protects personal information across its digital platform.",
  },
  ne: {
    title: "गोपनीयता नीति",
    description:
      "सुदूर चिनारीले आफ्नो डिजिटल प्लेटफर्ममा व्यक्तिगत जानकारी कसरी सङ्कलन, प्रयोग, प्रशोधन, भण्डारण तथा संरक्षण गर्दछ भन्ने जानकारी।",
  },
};

export const PRIVACY_CONTACT = {
  company: {
    en: "Sudur Chinari Pvt. Ltd.",
    ne: "सुदूर चिनारी प्रा. लि.",
  },
  website: "sudurchinari.com",
  websiteUrl: "https://sudurchinari.com",
  email: "chinarisudur@gmail.com",
  phone: "9865768537",
};

export const PRIVACY_COPYRIGHT: BilingualText = {
  en: "© 2026 Sudur Chinari Pvt. Ltd. All Rights Reserved.",
  ne: "© २०२६ सुदूर चिनारी प्रा. लि. सर्वाधिकार सुरक्षित।",
};

export const PRIVACY_SECTIONS: PrivacySection[] = [
  {
    id: "introduction",
    number: "1",
    title: { en: "Introduction", ne: "परिचय" },
    paragraphs: [
      {
        en: 'Sudur Chinari Pvt. Ltd. ("Sudur Chinari", "Company", "we", "our", or "us") respects the privacy of its website visitors, registered users, and other individuals who interact with our digital platform.',
        ne: "सुदूर चिनारी प्रा. लि. (\"सुदूर चिनारी\", \"कम्पनी\", \"हामी\", \"हाम्रो\" वा \"हामीलाई\") आफ्नो वेबसाइटका आगन्तुक, दर्ता भएका प्रयोगकर्ता तथा हाम्रो डिजिटल प्लेटफर्मसँग अन्तरक्रिया गर्ने अन्य व्यक्तिहरूको गोपनीयताको सम्मान गर्दछ।",
      },
      {
        en: "Sudur Chinari is an information and documentation platform dedicated to promoting and preserving the cultural, historical, geographical, social, and tourism identity of Sudurpashchim Province and Nepal.",
        ne: "सुदूर चिनारी सुदूरपश्चिम प्रदेश र नेपालको सांस्कृतिक, ऐतिहासिक, भौगोलिक, सामाजिक तथा पर्यटन पहिचानको प्रवर्द्धन र संरक्षणमा समर्पित एक सूचना तथा अभिलेखीकरण प्लेटफर्म हो।",
      },
      {
        en: "This Privacy Policy explains how we collect, use, process, store, protect, and disclose personal information when individuals visit or use our website.",
        ne: "यो गोपनीयता नीतिले व्यक्तिहरूले हाम्रो वेबसाइट भ्रमण गर्दा वा प्रयोग गर्दा हामीले व्यक्तिगत जानकारी कसरी सङ्कलन, प्रयोग, प्रशोधन, भण्डारण, संरक्षण तथा खुलासा गर्छौं भन्ने कुरा स्पष्ट पार्दछ।",
      },
      {
        en: "By using our website, you acknowledge that you have had the opportunity to review this Privacy Policy. Where consent is legally required, we will seek appropriate consent separately.",
        ne: "हाम्रो वेबसाइट प्रयोग गरेर तपाईंले यो गोपनीयता नीति अध्ययन गर्ने अवसर प्राप्त गर्नुभएको छ भन्ने स्वीकार गर्नुहुन्छ। कानुनद्वारा सहमति आवश्यक हुने अवस्थामा हामी छुट्टै रूपमा उपयुक्त सहमति लिनेछौं।",
      },
    ],
  },
  {
    id: "information-we-collect",
    number: "2",
    title: { en: "Information We Collect", ne: "हामीले सङ्कलन गर्ने जानकारी" },
    paragraphs: [
      {
        en: "We collect information depending on how individuals interact with our website.",
        ne: "व्यक्तिहरूले हाम्रो वेबसाइटसँग कसरी अन्तरक्रिया गर्छन् भन्ने आधारमा हामी जानकारी सङ्कलन गर्छौं।",
      },
    ],
    subsections: [
      {
        id: "personal-information",
        number: "2.1",
        title: { en: "Personal Information", ne: "व्यक्तिगत जानकारी" },
        paragraphs: [
          {
            en: "When users register accounts, log in, or communicate with us through website forms, we may collect:",
            ne: "प्रयोगकर्ताहरूले खाता दर्ता गर्दा, लगइन गर्दा वा वेबसाइटका फारममार्फत हामीसँग सम्पर्क गर्दा हामी निम्न जानकारी सङ्कलन गर्न सक्छौं:",
          },
        ],
        bullets: [
          { en: "Full name", ne: "पूरा नाम" },
          { en: "Email address", ne: "इमेल ठेगाना" },
          { en: "Contact number, where requested", ne: "आवश्यक परेको खण्डमा सम्पर्क नम्बर" },
          {
            en: "Username and account credentials",
            ne: "प्रयोगकर्ता नाम तथा खाता प्रमाणहरू",
          },
          {
            en: "Profile information voluntarily provided by users",
            ne: "प्रयोगकर्ताले स्वेच्छाले उपलब्ध गराएको प्रोफाइल जानकारी",
          },
          {
            en: "Information submitted through contact and inquiry forms",
            ne: "सम्पर्क तथा जिज्ञासा फारममार्फत पेश गरिएको जानकारी",
          },
          {
            en: "Messages, feedback, and other communications",
            ne: "सन्देश, प्रतिक्रिया तथा अन्य सञ्चारहरू",
          },
        ],
        paragraphsAfter: [
          {
            en: "The specific information collected depends on the form or website functionality being used.",
            ne: "सङ्कलन गरिने विशिष्ट जानकारी प्रयोग भइरहेको फारम वा वेबसाइटको सुविधामा निर्भर हुन्छ।",
          },
        ],
      },
      {
        id: "account-information",
        number: "2.2",
        title: { en: "Account Information", ne: "खाता जानकारी" },
        paragraphs: [
          {
            en: "Our website provides user registration and login functionality. When users create accounts, we may collect information necessary to establish and maintain their accounts. This may include:",
            ne: "हाम्रो वेबसाइटले प्रयोगकर्ता दर्ता तथा लगइन सुविधा उपलब्ध गराउँछ। प्रयोगकर्ताहरूले खाता सिर्जना गर्दा खाता स्थापना तथा व्यवस्थापनका लागि आवश्यक जानकारी सङ्कलन गर्न सक्छौं। यसमा निम्न समावेश हुन सक्छन्:",
          },
        ],
        bullets: [
          { en: "Account identification details", ne: "खाता पहिचानसम्बन्धी विवरण" },
          { en: "Login credentials", ne: "लगइन प्रमाणहरू" },
          { en: "Email address", ne: "इमेल ठेगाना" },
          { en: "Profile information", ne: "प्रोफाइल जानकारी" },
          {
            en: "Account activity and login-related information",
            ne: "खाता गतिविधि तथा लगइनसम्बन्धी जानकारी",
          },
        ],
        paragraphsAfter: [
          {
            en: "Users are responsible for maintaining the confidentiality of their login credentials and should not share their passwords with others.",
            ne: "प्रयोगकर्ताहरू आफ्ना लगइन प्रमाणहरूको गोपनीयता कायम राख्न जिम्मेवार छन् र आफ्नो पासवर्ड अरूसँग साझा गर्नुहुँदैन।",
          },
        ],
      },
      {
        id: "information-through-forms",
        number: "2.3",
        title: {
          en: "Information Submitted Through Forms",
          ne: "फारममार्फत पेश गरिएको जानकारी",
        },
        paragraphs: [
          {
            en: "Our website may provide multiple forms for communication, inquiries, registrations, and other website-related purposes. Information submitted through these forms will be used to:",
            ne: "हाम्रो वेबसाइटमा सञ्चार, जिज्ञासा, दर्ता तथा अन्य वेबसाइटसम्बन्धी प्रयोजनका लागि विभिन्न फारमहरू उपलब्ध हुन सक्छन्। यी फारममार्फत पेश गरिएको जानकारी निम्न प्रयोजनका लागि प्रयोग गरिनेछ:",
          },
        ],
        bullets: [
          {
            en: "Respond to inquiries and requests.",
            ne: "जिज्ञासा तथा अनुरोधहरूको जवाफ दिन।",
          },
          {
            en: "Provide relevant information.",
            ne: "सम्बन्धित जानकारी उपलब्ध गराउन।",
          },
          {
            en: "Manage communication with users.",
            ne: "प्रयोगकर्ताहरूसँगको सञ्चार व्यवस्थापन गर्न।",
          },
          {
            en: "Process requests related to website services.",
            ne: "वेबसाइट सेवासँग सम्बन्धित अनुरोधहरू प्रशोधन गर्न।",
          },
          {
            en: "Improve our website and services.",
            ne: "हाम्रो वेबसाइट तथा सेवाहरू सुधार गर्न।",
          },
        ],
        paragraphsAfter: [
          {
            en: "We collect only the information relevant to the purpose of the respective form.",
            ne: "हामी सम्बन्धित फारमको प्रयोजनसँग प्रासंगिक जानकारी मात्र सङ्कलन गर्छौं।",
          },
        ],
      },
      {
        id: "technical-information",
        number: "2.4",
        title: { en: "Technical Information", ne: "प्राविधिक जानकारी" },
        paragraphs: [
          {
            en: "When individuals access our website, certain technical information may be collected automatically, depending on the website's configuration. This may include:",
            ne: "व्यक्तिहरूले हाम्रो वेबसाइट पहुँच गर्दा वेबसाइटको कन्फिगरेसनमा निर्भर रही केही प्राविधिक जानकारी स्वतः सङ्कलन हुन सक्छ। यसमा निम्न समावेश हुन सक्छन्:",
          },
        ],
        bullets: [
          { en: "IP address", ne: "आईपी ठेगाना" },
          { en: "Device information", ne: "उपकरणसम्बन्धी जानकारी" },
          { en: "Date and time of website access", ne: "वेबसाइट पहुँचको मिति तथा समय" },
          { en: "Referring website or source", ne: "रेफर गर्ने वेबसाइट वा स्रोत" },
        ],
      },
    ],
  },
  {
    id: "user-accounts",
    number: "3",
    title: {
      en: "User Accounts and Registration",
      ne: "प्रयोगकर्ता खाता तथा दर्ता",
    },
    paragraphs: [
      {
        en: "Sudur Chinari provides account registration and login facilities. Users must provide accurate information when creating an account.",
        ne: "सुदूर चिनारीले खाता दर्ता तथा लगइन सुविधा उपलब्ध गराउँछ। खाता सिर्जना गर्दा प्रयोगकर्ताहरूले सही जानकारी उपलब्ध गराउनुपर्छ।",
      },
      {
        en: "Users are responsible for:",
        ne: "प्रयोगकर्ताहरू निम्न कुराका लागि जिम्मेवार छन्:",
      },
    ],
    bullets: [
      {
        en: "Providing accurate registration information.",
        ne: "सही दर्ता जानकारी उपलब्ध गराउन।",
      },
      {
        en: "Maintaining the confidentiality of their login credentials.",
        ne: "आफ्ना लगइन प्रमाणहरूको गोपनीयता कायम राख्न।",
      },
      {
        en: "Not sharing their accounts with unauthorized individuals.",
        ne: "अनधिकृत व्यक्तिहरूसँग आफ्नो खाता साझा नगर्न।",
      },
      {
        en: "Informing us if they suspect unauthorized access to their accounts.",
        ne: "आफ्नो खातामा अनधिकृत पहुँच भएको शङ्का लागेमा हामीलाई जानकारी दिन।",
      },
      {
        en: "Using their accounts for lawful purposes.",
        ne: "आफ्नो खाता कानुनी प्रयोजनका लागि मात्र प्रयोग गर्न।",
      },
    ],
    paragraphsAfter: [
      {
        en: "We reserve the right to suspend or restrict accounts involved in unauthorized activities, misuse, or violations of our website policies.",
        ne: "अनधिकृत गतिविधि, दुरुपयोग वा हाम्रो वेबसाइट नीतिहरूको उल्लङ्घनमा संलग्न खाताहरूलाई निलम्बन वा प्रतिबन्ध लगाउने अधिकार हामी सुरक्षित राख्छौं।",
      },
      {
        en: "Users may contact us to request assistance with account-related matters, including account deletion.",
        ne: "प्रयोगकर्ताहरूले खाता मेटाउने लगायत खातासम्बन्धी सहायताका लागि हामीलाई सम्पर्क गर्न सक्छन्।",
      },
    ],
  },
  {
    id: "how-we-use-information",
    number: "4",
    title: {
      en: "How We Use Your Information",
      ne: "हामी तपाईंको जानकारी कसरी प्रयोग गर्छौं",
    },
    paragraphs: [
      {
        en: "We may use collected information for the following purposes:",
        ne: "सङ्कलित जानकारी हामी निम्न प्रयोजनका लागि प्रयोग गर्न सक्छौं:",
      },
    ],
    bullets: [
      {
        en: "To create and manage user accounts.",
        ne: "प्रयोगकर्ता खाता सिर्जना तथा व्यवस्थापन गर्न।",
      },
      {
        en: "To authenticate users and provide login functionality.",
        ne: "प्रयोगकर्ता प्रमाणीकरण तथा लगइन सुविधा उपलब्ध गराउन।",
      },
      {
        en: "To respond to inquiries and communications.",
        ne: "जिज्ञासा तथा सञ्चारहरूको जवाफ दिन।",
      },
      {
        en: "To manage website forms and requests.",
        ne: "वेबसाइटका फारम तथा अनुरोधहरू व्यवस्थापन गर्न।",
      },
      {
        en: "To operate, maintain, and improve website functionality.",
        ne: "वेबसाइटको कार्यक्षमता सञ्चालन, मर्मत तथा सुधार गर्न।",
      },
      {
        en: "To provide relevant information and digital services.",
        ne: "सम्बन्धित जानकारी तथा डिजिटल सेवाहरू उपलब्ध गराउन।",
      },
      {
        en: "To understand website usage and improve user experience, where applicable.",
        ne: "लागू हुने अवस्थामा वेबसाइट प्रयोगको बुझाइ तथा प्रयोगकर्ता अनुभव सुधार गर्न।",
      },
      {
        en: "To maintain website security and prevent unauthorized activities.",
        ne: "वेबसाइट सुरक्षा कायम राख्न तथा अनधिकृत गतिविधि रोक्न।",
      },
      {
        en: "To comply with applicable laws and legal requirements.",
        ne: "लागू कानुन तथा कानुनी आवश्यकताहरूको पालना गर्न।",
      },
    ],
    paragraphsAfter: [
      {
        en: "Personal information will be used for the purposes for which it was collected or other purposes permitted by applicable law.",
        ne: "व्यक्तिगत जानकारी सङ्कलन गरिएको प्रयोजन वा लागू कानुनले अनुमति दिएका अन्य प्रयोजनका लागि मात्र प्रयोग गरिनेछ।",
      },
    ],
  },
  {
    id: "content-management",
    number: "5",
    title: {
      en: "Content Management and Publication",
      ne: "सामग्री व्यवस्थापन तथा प्रकाशन",
    },
    paragraphs: [
      {
        en: "Sudur Chinari focuses on collecting, organizing, documenting, and publishing information relating to Sudurpashchim Province and Nepal. The website's content is managed and published by authorized administrators.",
        ne: "सुदूर चिनारी सुदूरपश्चिम प्रदेश र नेपालसँग सम्बन्धित जानकारी सङ्कलन, व्यवस्थापन, अभिलेखीकरण तथा प्रकाशनमा केन्द्रित छ। वेबसाइटको सामग्री अधिकृत प्रशासकहरूद्वारा व्यवस्थापन तथा प्रकाशन गरिन्छ।",
      },
      {
        en: "Published content may include:",
        ne: "प्रकाशित सामग्रीमा निम्न समावेश हुन सक्छन्:",
      },
    ],
    bullets: [
      {
        en: "Cultural and historical information.",
        ne: "सांस्कृतिक तथा ऐतिहासिक जानकारी।",
      },
      {
        en: "Tourism destinations and attractions.",
        ne: "पर्यटकीय गन्तव्य तथा आकर्षणहरू।",
      },
      {
        en: "Hotel and business information.",
        ne: "होटल तथा व्यवसायसम्बन्धी जानकारी।",
      },
      { en: "News and articles.", ne: "समाचार तथा लेखहरू।" },
      { en: "Photographs and videos.", ne: "तस्बिर तथा भिडियोहरू।" },
      {
        en: "Local traditions and community information.",
        ne: "स्थानीय परम्परा तथा समुदायसम्बन्धी जानकारी।",
      },
      {
        en: "Research and educational materials.",
        ne: "अनुसन्धान तथा शैक्षिक सामग्रीहरू।",
      },
    ],
    paragraphsAfter: [
      {
        en: "General website visitors do not have direct publishing privileges unless separately authorized by the Company.",
        ne: "सामान्य वेबसाइट आगन्तुकहरूलाई कम्पनीबाट छुट्टै अधिकार प्राप्त नभएसम्म सिधै प्रकाशन गर्ने अधिकार हुँदैन।",
      },
      {
        en: "We take reasonable steps to review information before publication. However, we cannot guarantee that all publicly available information will always be complete, accurate, or up to date.",
        ne: "प्रकाशनअघि जानकारी समीक्षा गर्न हामी उचित प्रयास गर्छौं। तथापि, सार्वजनिक रूपमा उपलब्ध सबै जानकारी सधैं पूर्ण, सही वा अद्यावधिक रहन्छ भन्ने हामी ग्यारेन्टी गर्न सक्दैनौं।",
      },
    ],
  },
  {
    id: "information-sharing",
    number: "6",
    title: {
      en: "Information Sharing and Disclosure",
      ne: "जानकारी साझेदारी तथा खुलासा",
    },
    paragraphs: [
      {
        en: "Sudur Chinari Pvt. Ltd. does not sell or rent users' personal information to third parties. However, personal information may be disclosed in the following circumstances:",
        ne: "सुदूर चिनारी प्रा. लि. प्रयोगकर्ताहरूको व्यक्तिगत जानकारी तेस्रो पक्षलाई बिक्री वा भाडामा दिँदैन। तथापि, निम्न अवस्थाहरूमा व्यक्तिगत जानकारी खुलासा गर्न सकिन्छ:",
      },
    ],
    subsections: [
      {
        id: "service-providers",
        number: "6.1",
        title: { en: "Service Providers", ne: "सेवा प्रदायकहरू" },
        paragraphs: [
          {
            en: "We may share necessary information with service providers who assist with website hosting, maintenance, technical support, security, and other essential website operations.",
            ne: "वेबसाइट होस्टिङ, मर्मत, प्राविधिक सहयोग, सुरक्षा तथा अन्य आवश्यक वेबसाइट सञ्चालनमा सहयोग गर्ने सेवा प्रदायकहरूसँग आवश्यक जानकारी साझा गर्न सक्छौं।",
          },
        ],
      },
      {
        id: "legal-requirements",
        number: "6.2",
        title: { en: "Legal Requirements", ne: "कानुनी आवश्यकताहरू" },
        paragraphs: [
          {
            en: "We may disclose information when required by applicable laws, court orders, or authorized government authorities.",
            ne: "लागू कानुन, अदालतको आदेश वा अधिकृत सरकारी निकायहरूको आवश्यकताबमोजिम जानकारी खुलासा गर्न सक्छौं।",
          },
        ],
      },
      {
        id: "user-consent",
        number: "6.3",
        title: { en: "User Consent", ne: "प्रयोगकर्ताको सहमति" },
        paragraphs: [
          {
            en: "Information may be shared with third parties when the concerned individual has provided appropriate consent.",
            ne: "सम्बन्धित व्यक्तिले उपयुक्त सहमति दिएको अवस्थामा जानकारी तेस्रो पक्षसँग साझा गर्न सकिन्छ।",
          },
        ],
      },
      {
        id: "business-operations",
        number: "6.4",
        title: { en: "Business Operations", ne: "व्यवसाय सञ्चालन" },
        paragraphs: [
          {
            en: "Information may be processed or shared where necessary for legitimate business operations, subject to applicable privacy requirements.",
            ne: "लागू गोपनीयता आवश्यकताहरूको अधीनमा रही वैध व्यवसाय सञ्चालनका लागि आवश्यक भएमा जानकारी प्रशोधन वा साझा गर्न सकिन्छ।",
          },
        ],
      },
    ],
    paragraphsAfter: [
      {
        en: "We aim to limit information sharing to what is reasonably necessary for the relevant purpose.",
        ne: "सम्बन्धित प्रयोजनका लागि उचित रूपमा आवश्यक जानकारीमा मात्र साझेदारी सीमित गर्ने हाम्रो लक्ष्य छ।",
      },
    ],
  },
  {
    id: "cookies",
    number: "7",
    title: {
      en: "Cookies and Tracking Technologies",
      ne: "कुकीज तथा ट्र्याकिङ प्रविधिहरू",
    },
    paragraphs: [
      {
        en: "Our website's use of cookies and analytics technologies is subject to verification of its current technical configuration.",
        ne: "हाम्रो वेबसाइटमा कुकीज तथा एनालिटिक्स प्रविधिहरूको प्रयोग हालको प्राविधिक कन्फिगरेसनको प्रमाणीकरणको अधीनमा छ।",
      },
      {
        en: "Cookies, where enabled, may be used to:",
        ne: "सक्रिय भएमा कुकीज निम्न कार्यका लागि प्रयोग गर्न सकिन्छ:",
      },
    ],
    bullets: [
      {
        en: "Support essential website functionality.",
        ne: "आवश्यक वेबसाइट कार्यक्षमता सञ्चालन गर्न।",
      },
      {
        en: "Maintain user sessions and login functionality.",
        ne: "प्रयोगकर्ता सत्र तथा लगइन सुविधा कायम राख्न।",
      },
      {
        en: "Remember user preferences.",
        ne: "प्रयोगकर्ताका प्राथमिकताहरू सम्झन।",
      },
      {
        en: "Improve website performance.",
        ne: "वेबसाइटको कार्यसम्पादन सुधार गर्न।",
      },
      {
        en: "Understand website traffic and usage patterns.",
        ne: "वेबसाइट ट्राफिक तथा प्रयोग ढाँचा बुझ्न।",
      },
    ],
    paragraphsAfter: [
      {
        en: "If third-party analytics or tracking services are implemented, additional information about those services and their data practices will be provided in this policy.",
        ne: "तेस्रो पक्षका एनालिटिक्स वा ट्र्याकिङ सेवाहरू लागू गरिएमा ती सेवा तथा तिनका डाटा अभ्याससम्बन्धी थप जानकारी यस नीतिमा उपलब्ध गराइनेछ।",
      },
      {
        en: "Users may manage cookies through their browser settings. Disabling certain cookies may affect website functionality, including account login features.",
        ne: "प्रयोगकर्ताहरूले ब्राउजर सेटिङमार्फत कुकीज व्यवस्थापन गर्न सक्छन्। केही कुकीज निष्क्रिय गर्दा खाता लगइन सुविधा लगायत वेबसाइटका कार्यक्षमताहरूमा असर पर्न सक्छ।",
      },
    ],
  },
  {
    id: "data-storage",
    number: "8",
    title: {
      en: "Data Storage and Security",
      ne: "डाटा भण्डारण तथा सुरक्षा",
    },
    paragraphs: [
      {
        en: "We take reasonable technical and organizational measures to protect personal information against unauthorized access, disclosure, alteration, loss, or misuse.",
        ne: "व्यक्तिगत जानकारी अनधिकृत पहुँच, खुलासा, परिवर्तन, हानि वा दुरुपयोगबाट जोगाउन हामी उचित प्राविधिक तथा संगठनात्मक उपायहरू अपनाउँछौं।",
      },
      {
        en: "These measures may include access restrictions, administrative controls, and appropriate technical safeguards.",
        ne: "यी उपायहरूमा पहुँच प्रतिबन्ध, प्रशासनिक नियन्त्रण तथा उपयुक्त प्राविधिक सुरक्षा सावधानीहरू समावेश हुन सक्छन्।",
      },
      {
        en: "Personal information may be stored and processed through website hosting infrastructure and related technical service providers.",
        ne: "व्यक्तिगत जानकारी वेबसाइट होस्टिङ पूर्वाधार तथा सम्बन्धित प्राविधिक सेवा प्रदायकहरूमार्फत भण्डारण तथा प्रशोधन गरिन सक्छ।",
      },
      {
        en: "The specific hosting provider, server location, and applicable data-storage arrangements have not yet been confirmed for this policy. We will update this section when those arrangements are verified.",
        ne: "यस नीतिका लागि विशिष्ट होस्टिङ प्रदायक, सर्भर स्थान तथा लागू हुने डाटा-भण्डारण व्यवस्थाहरू हालसम्म पुष्टि गरिएका छैनन्। ती व्यवस्थाहरू प्रमाणीकरण भएपछि हामी यो खण्ड अद्यावधिक गर्नेछौं।",
      },
      {
        en: "Although we make reasonable efforts to protect information, no electronic storage system or internet-based transmission method can be guaranteed to be completely secure.",
        ne: "जानकारी सुरक्षित राख्न हामी उचित प्रयास गरे पनि कुनै पनि इलेक्ट्रोनिक भण्डारण प्रणाली वा इन्टरनेटमार्फत हुने प्रसारण पूर्ण रूपमा सुरक्षित हुने ग्यारेन्टी गर्न सकिँदैन।",
      },
    ],
  },
  {
    id: "data-retention",
    number: "9",
    title: { en: "Data Retention", ne: "डाटा संरक्षण अवधि" },
    paragraphs: [
      {
        en: "We retain personal information only for as long as reasonably necessary to fulfill the purposes for which it was collected or as required by applicable law.",
        ne: "जुन प्रयोजनका लागि जानकारी सङ्कलन गरिएको हो त्यो पूरा गर्न वा लागू कानुनले तोकेअनुसार मात्र आवश्यक हुने समयसम्म हामी व्यक्तिगत जानकारी राख्छौं।",
      },
      {
        en: "The retention period may depend on:",
        ne: "संरक्षण अवधि निम्न कुरामा निर्भर हुन सक्छ:",
      },
    ],
    bullets: [
      {
        en: "The type of information collected.",
        ne: "सङ्कलन गरिएको जानकारीको प्रकार।",
      },
      { en: "The purpose of collection.", ne: "सङ्कलनको प्रयोजन।" },
      {
        en: "Account status and user activity.",
        ne: "खाताको स्थिति तथा प्रयोगकर्ता गतिविधि।",
      },
      {
        en: "Legal and regulatory requirements.",
        ne: "कानुनी तथा नियामक आवश्यकताहरू।",
      },
      {
        en: "Legitimate operational requirements.",
        ne: "वैध सञ्चालन आवश्यकताहरू।",
      },
    ],
    paragraphsAfter: [
      {
        en: "When personal information is no longer required, we will take reasonable steps to delete, anonymize, or securely dispose of it, subject to applicable legal obligations.",
        ne: "व्यक्तिगत जानकारीको आवश्यकता नरहेपछि लागू कानुनी दायित्वहरूको अधीनमा रही मेटाउन, अप्रत्यक्ष बनाउन वा सुरक्षित रूपमा नष्ट गर्न उचित प्रयास गरिनेछ।",
      },
    ],
  },
  {
    id: "third-party",
    number: "10",
    title: {
      en: "Third-Party Websites and Services",
      ne: "तेस्रो पक्षका वेबसाइट तथा सेवाहरू",
    },
    paragraphs: [
      {
        en: "Our website may contain links to third-party websites, social media platforms, maps, videos, or other external resources.",
        ne: "हाम्रो वेबसाइटमा तेस्रो पक्षका वेबसाइट, सामाजिक सञ्जाल प्लेटफर्म, नक्सा, भिडियो वा अन्य बाह्य स्रोतहरूका लिङ्कहरू हुन सक्छन्।",
      },
      {
        en: "These external platforms operate independently and may have their own privacy policies and data-handling practices.",
        ne: "यी बाह्य प्लेटफर्महरू स्वतन्त्र रूपमा सञ्चालित हुन्छन् र तिनका आफ्नै गोपनीयता नीति तथा डाटा व्यवस्थापन अभ्यासहरू हुन सक्छन्।",
      },
      {
        en: "Sudur Chinari Pvt. Ltd. is not responsible for the privacy practices, content, or security of external websites.",
        ne: "बाह्य वेबसाइटहरूको गोपनीयता अभ्यास, सामग्री वा सुरक्षाका लागि सुदूर चिनारी प्रा. लि. जिम्मेवार छैन।",
      },
      {
        en: "Users are encouraged to review the relevant privacy policies before sharing personal information with third-party services.",
        ne: "तेस्रो पक्षका सेवाहरूसँग व्यक्तिगत जानकारी साझा गर्नुअघि सम्बन्धित गोपनीयता नीतिहरू अध्ययन गर्न प्रयोगकर्ताहरूलाई प्रोत्साहित गरिन्छ।",
      },
    ],
  },
  {
    id: "childrens-privacy",
    number: "11",
    title: { en: "Children's Privacy", ne: "बालबालिकाको गोपनीयता" },
    paragraphs: [
      {
        en: "We recognize the importance of protecting children's personal information.",
        ne: "बालबालिकाको व्यक्तिगत जानकारी संरक्षणको महत्त्व हामी स्वीकार गर्छौं।",
      },
      {
        en: "Children should not provide personal information through our website without appropriate guidance and consent from a parent or legal guardian where required by applicable law.",
        ne: "लागू कानुनले आवश्यक तोकेको अवस्थामा अभिभावक वा कानुनी संरक्षकको उचित मार्गदर्शन तथा सहमतिबिना बालबालिकाले हाम्रो वेबसाइटमार्फत व्यक्तिगत जानकारी उपलब्ध गराउनुहुँदैन।",
      },
      {
        en: "We will take reasonable steps to address situations involving personal information collected from children without appropriate consent.",
        ne: "उचित सहमतिबिना बालबालिकाबाट सङ्कलन भएको व्यक्तिगत जानकारीसम्बन्धी अवस्थाहरूलाई सम्बोधन गर्न हामी उचित कदम चाल्नेछौं।",
      },
    ],
  },
  {
    id: "your-rights",
    number: "12",
    title: { en: "Your Privacy Rights", ne: "तपाईंका गोपनीयता अधिकारहरू" },
    paragraphs: [
      {
        en: "Subject to applicable laws, users may have the right to:",
        ne: "लागू कानुनको अधीनमा रही प्रयोगकर्ताहरूलाई निम्न अधिकारहरू हुन सक्छन्:",
      },
    ],
    bullets: [
      {
        en: "Request information about personal data collected about them.",
        ne: "आफ्नोबारे सङ्कलित व्यक्तिगत डाटासम्बन्धी जानकारी माग्न।",
      },
      {
        en: "Request correction of inaccurate personal information.",
        ne: "गलत व्यक्तिगत जानकारी सुधार गर्न अनुरोध गर्न।",
      },
      {
        en: "Request deletion of personal information where legally appropriate.",
        ne: "कानुनअनुसार उपयुक्त भएमा व्यक्तिगत जानकारी मेटाउन अनुरोध गर्न।",
      },
      {
        en: "Request assistance with account deletion.",
        ne: "खाता मेटाउन सहायता अनुरोध गर्न।",
      },
      {
        en: "Withdraw consent where processing is based on consent.",
        ne: "सहमतिमा आधारित प्रशोधनको हकमा सहमति फिर्ता लिन।",
      },
      {
        en: "Raise concerns regarding the use or disclosure of personal information.",
        ne: "व्यक्तिगत जानकारीको प्रयोग वा खुलासासम्बन्धी चिन्ता व्यक्त गर्न।",
      },
      {
        en: "Request clarification regarding how their information is collected and used.",
        ne: "आफ्नो जानकारी कसरी सङ्कलन तथा प्रयोग गरिन्छ भन्ने स्पष्टीकरण अनुरोध गर्न।",
      },
    ],
    paragraphsAfter: [
      {
        en: "Users may exercise applicable privacy rights by contacting us through our official communication channels.",
        ne: "प्रयोगकर्ताहरूले हाम्रा आधिकारिक सञ्चार माध्यमहरूमार्फत सम्पर्क गरी लागू हुने गोपनीयता अधिकारहरू प्रयोग गर्न सक्छन्।",
      },
      {
        en: "We will review and respond to legitimate requests in accordance with applicable laws.",
        ne: "लागू कानुनबमोजिम वैध अनुरोधहरूको समीक्षा तथा जवाफ हामी दिनेछौं।",
      },
    ],
  },
  {
    id: "data-breach",
    number: "13",
    title: {
      en: "Data Breach and Security Incidents",
      ne: "डाटा उल्लङ्घन तथा सुरक्षा घटनाहरू",
    },
    paragraphs: [
      {
        en: "If we become aware of a security incident involving personal information, we will take reasonable steps to investigate, contain, and address the incident.",
        ne: "व्यक्तिगत जानकारीसम्बन्धी सुरक्षा घटना भएको जानकारी पाएमा घटनाको अनुसन्धान, नियन्त्रण तथा समाधानका लागि हामी उचित कदम चाल्नेछौं।",
      },
      {
        en: "Where notification is required by applicable law, we will follow the relevant legal requirements.",
        ne: "लागू कानुनले सूचना आवश्यक तोकेको अवस्थामा हामी सम्बन्धित कानुनी आवश्यकताहरूको पालना गर्नेछौं।",
      },
    ],
  },
  {
    id: "changes",
    number: "14",
    title: {
      en: "Changes to This Privacy Policy",
      ne: "यस गोपनीयता नीतिमा परिवर्तन",
    },
    paragraphs: [
      {
        en: "Sudur Chinari Pvt. Ltd. reserves the right to update or modify this Privacy Policy when necessary to reflect changes in:",
        ne: "निम्न कुरामा परिवर्तन प्रतिबिम्बित गर्न आवश्यक परेमा यो गोपनीयता नीति अद्यावधिक वा परिमार्जन गर्ने अधिकार सुदूर चिनारी प्रा. लि. सुरक्षित राख्छ:",
      },
    ],
    bullets: [
      { en: "Website functionality.", ne: "वेबसाइटको कार्यक्षमता।" },
      {
        en: "Data collection and processing practices.",
        ne: "डाटा सङ्कलन तथा प्रशोधन अभ्यासहरू।",
      },
      { en: "Technical infrastructure.", ne: "प्राविधिक पूर्वाधार।" },
      { en: "Business operations.", ne: "व्यवसाय सञ्चालन।" },
      {
        en: "Applicable laws and regulations.",
        ne: "लागू कानुन तथा नियमहरू।",
      },
    ],
    paragraphsAfter: [
      {
        en: 'Any revised version will be published on this page with an updated "Last Updated" date.',
        ne: "कुनै पनि संशोधित संस्करण अद्यावधिक \"अन्तिम अद्यावधिक मिति\" सहित यसै पृष्ठमा प्रकाशित गरिनेछ।",
      },
      {
        en: "Users are encouraged to review this Privacy Policy periodically.",
        ne: "प्रयोगकर्ताहरूलाई यो गोपनीयता नीति समय-समयमा अध्ययन गर्न प्रोत्साहित गरिन्छ।",
      },
    ],
  },
  {
    id: "applicable-laws",
    number: "15",
    title: { en: "Applicable Laws", ne: "लागू कानुनहरू" },
    paragraphs: [
      {
        en: "This Privacy Policy shall be governed by the applicable laws of Nepal, including:",
        ne: "यो गोपनीयता नीति नेपालको लागू कानुनद्वारा शासित हुनेछ, जसमा निम्न समावेश छन्:",
      },
    ],
    bullets: [
      { en: "Privacy Act, 2075.", ne: "गोपनीयता ऐन, २०७५।" },
      {
        en: "Other applicable laws and regulations relating to personal information, privacy, and electronic transactions.",
        ne: "व्यक्तिगत जानकारी, गोपनीयता तथा इलेक्ट्रोनिक कारोबारसँग सम्बन्धित अन्य लागू कानुन तथा नियमहरू।",
      },
    ],
    paragraphsAfter: [
      {
        en: "Sudur Chinari Pvt. Ltd. is committed to respecting the privacy and confidentiality of users' personal information in accordance with applicable legal requirements.",
        ne: "सुदूर चिनारी प्रा. लि. लागू कानुनी आवश्यकताहरूबमोजिम प्रयोगकर्ताहरूको गोपनीयता तथा व्यक्तिगत जानकारीको गोप्यताको सम्मान गर्न प्रतिबद्ध छ।",
      },
    ],
  },
  {
    id: "contact",
    number: "16",
    title: { en: "Contact Information", ne: "सम्पर्क जानकारी" },
    paragraphs: [
      {
        en: "For questions, concerns, privacy-related requests, account-related matters, or complaints regarding this Privacy Policy, please contact us:",
        ne: "यो गोपनीयता नीतिसम्बन्धी प्रश्न, चिन्ता, गोपनीयतासम्बन्धी अनुरोध, खातासम्बन्धी विषय वा उजुरीका लागि कृपया हामीलाई सम्पर्क गर्नुहोस्:",
      },
    ],
  },
];
