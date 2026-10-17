import type { ArticleComment } from "@/types";

export const INITIAL_COMMENTS: Record<string, ArticleComment[]> = {
  art1: [
    {
      id: "c1",
      articleId: "art1",
      authorName: "ई. भुपेन्द्र साउद",
      authorLocation: "टिकापुर, कैलाली",
      content:
        "कर्णालीमा यो पुल बनेपछि टिकापुर र राजापुर क्षेत्रको कृषि उत्पादन सहजै धनगढी र नेपालगञ्ज पुग्नेछ। समयमै काम सम्पन्न होस्, गुणस्तरमा ध्यान दिइयोस्।",
      createdAt: "2026-09-28T11:30:00Z",
      likes: 24,
      isLiked: false,
    },
    {
      id: "c2",
      articleId: "art1",
      authorName: "मनिषा पन्त",
      authorLocation: "धनगढी",
      content:
        "अत्यन्तै सकारात्मक र स्वागतयोग्य कदम! सुदूरपश्चिमको पूर्वाधार विकासमा यस्ता ठूला आयोजनाहरूले रोजगारी र पर्यटन दुवै बढाउँछन्। प्रदेश सरकारलाई धन्यवाद।",
      createdAt: "2026-09-28T12:15:00Z",
      likes: 19,
      isLiked: false,
    },
    {
      id: "c3",
      articleId: "art1",
      authorName: "हर्क बहादुर बोहरा",
      authorLocation: "बझाङ",
      content:
        "पुलको निर्माण समयमै हुनुपर्छ। विगतमा ठेक्का लिएर लामो समय अलपत्र छाड्ने प्रवृत्ति देखिएको छ। यसमा स्थानीय सरोकारवालाहरूले पनि निरन्तर खबरदारी गर्नुपर्छ।",
      createdAt: "2026-09-28T13:40:00Z",
      likes: 11,
      isLiked: false,
    },
  ],
  art2: [
    {
      id: "c4",
      articleId: "art2",
      authorName: "राजेन्द्र जोशी",
      authorLocation: "महेन्द्रनगर, कञ्चनपुर",
      content:
        "शुक्लाफाँटामा गैंडाको संख्या वृद्धि हुनु सम्पूर्ण सुदूरपश्चिम र नेपालकै लागि गौरवको विषय हो। निकुञ्ज प्रशासन र मध्यवर्ती क्षेत्रका बासिन्दाहरूको योगदान प्रशंसनीय छ।",
      createdAt: "2026-09-28T09:10:00Z",
      likes: 18,
      isLiked: false,
    },
    {
      id: "c5",
      articleId: "art2",
      authorName: "सुमन राना",
      authorLocation: "कञ्चनपुर",
      content:
        "पर्यटन प्रवर्द्धनका लागि अब स्थानीय होमस्टे र गाइड तालिमलाई पनि प्राथमिकता दिनुपर्छ।",
      createdAt: "2026-09-28T10:05:00Z",
      likes: 8,
      isLiked: false,
    },
  ],
};

export function getCommentsForArticle(articleId: string): ArticleComment[] {
  return INITIAL_COMMENTS[articleId] || [
    {
      id: "default-1",
      articleId,
      authorName: "दिनेश भट्ट",
      authorLocation: "सुदूरपश्चिम",
      content: "धेरै राम्रो र सान्दर्भिक समाचार। यस्ता सकारात्मक समाचारहरू नियमित प्रकाशित हुनुपर्छ।",
      createdAt: "2026-09-28T10:00:00Z",
      likes: 7,
      isLiked: false,
    },
  ];
}
