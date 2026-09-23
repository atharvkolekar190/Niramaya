export interface MedicineTranslation {
  generic_name: string;
  purpose: string;
  dosage: string;
  indications: string;
  warnings: string;
  category: string;
}

export interface MedicineTranslations {
  en: MedicineTranslation;
  hi: MedicineTranslation;
  pa: MedicineTranslation;
}

// Common medicine translations
export const medicineTranslations: Record<string, MedicineTranslations> = {
  'paracetamol': {
    en: {
      generic_name: 'ACETAMINOPHEN',
      purpose: 'Pain reliever/fever reducer',
      dosage: 'Adults and children 12 years and over: take 2 tablets every 6 hours while symptoms last. Do not take more than 6 tablets in 24 hours, unless directed by a doctor.',
      indications: 'Temporarily relieves minor aches and pains due to: headache, the common cold, backache, minor pain of arthritis, toothache, muscular aches, premenstrual and menstrual cramps. Temporarily reduces fever.',
      warnings: 'Liver warning: This product contains acetaminophen. Severe liver damage may occur if you take more than 4,000 mg of acetaminophen in 24 hours with other drugs containing acetaminophen or 3 or more alcoholic drinks every day while using this product. Allergy alert: Acetaminophen may cause severe skin reactions.',
      category: 'Analgesic/Antipyretic'
    },
    hi: {
      generic_name: 'एसिटामिनोफेन',
      purpose: 'दर्द निवारक/बुखार कम करने वाला',
      dosage: 'वयस्क और 12 वर्ष से अधिक उम्र के बच्चे: लक्षण रहने तक हर 6 घंटे में 2 गोली लें। 24 घंटे में 6 गोली से अधिक न लें, जब तक कि डॉक्टर द्वारा निर्देशित न किया गया हो।',
      indications: 'अस्थायी रूप से निम्नलिखित के कारण होने वाले मामूली दर्द और पीड़ा को दूर करता है: सिरदर्द, सामान्य सर्दी, कमर दर्द, गठिया का मामूली दर्द, दांत दर्द, मांसपेशियों में दर्द, मासिक धर्म से पहले और मासिक धर्म के दौरान ऐंठन। अस्थायी रूप से बुखार कम करता है।',
      warnings: 'यकृत चेतावनी: इस उत्पाद में एसिटामिनोफेन होता है। यदि आप 24 घंटे में 4,000 मिलीग्राम से अधिक एसिटामिनोफेन लेते हैं या इस उत्पाद का उपयोग करते समय प्रतिदिन 3 या अधिक शराब पीते हैं तो गंभीर यकृत क्षति हो सकती है। एलर्जी चेतावनी: एसिटामिनोफेन गंभीर त्वचा प्रतिक्रियाएं पैदा कर सकता है।',
      category: 'दर्द निवारक/ज्वरनाशक'
    },
    pa: {
      generic_name: 'ਐਸੀਟਾਮਿਨੋਫੇਨ',
      purpose: 'ਦਰਦ ਨਿਵਾਰਕ/ਬੁਖਾਰ ਘਟਾਉਣ ਵਾਲਾ',
      dosage: 'ਵਡੇ ਅਤੇ 12 ਸਾਲ ਤੋਂ ਵੱਧ ਉਮਰ ਦੇ ਬੱਚੇ: ਲੱਛਣ ਰਹਿਣ ਤੱਕ ਹਰ 6 ਘੰਟੇ ਵਿੱਚ 2 ਗੋਲੀ ਲਓ। 24 ਘੰਟੇ ਵਿੱਚ 6 ਗੋਲੀ ਤੋਂ ਵੱਧ ਨਾ ਲਓ, ਜਦੋਂ ਤੱਕ ਕਿ ਡਾਕਟਰ ਵੱਲੋਂ ਨਿਰਦੇਸ਼ਿਤ ਨਾ ਕੀਤਾ ਗਿਆ ਹੋਵੇ।',
      indications: 'ਅਸਥਾਈ ਤੌਰ \'ਤੇ ਹੇਠ ਲਿਖੇ ਕਾਰਨ ਹੋਣ ਵਾਲੇ ਮਾਮੂਲੀ ਦਰਦ ਅਤੇ ਪੀੜ੍ਹਾ ਨੂੰ ਦੂਰ ਕਰਦਾ ਹੈ: ਸਿਰ ਦਰਦ, ਆਮ ਜ਼ੁਕਾਮ, ਕਮਰ ਦਰਦ, ਗਠੀਏ ਦਾ ਮਾਮੂਲੀ ਦਰਦ, ਦੰਦ ਦਰਦ, ਮਾਸਪੇਸ਼ੀਆਂ ਵਿੱਚ ਦਰਦ, ਮਾਹਵਾਰੀ ਤੋਂ ਪਹਿਲਾਂ ਅਤੇ ਮਾਹਵਾਰੀ ਦੌਰਾਨ ਐਂਠਣ। ਅਸਥਾਈ ਤੌਰ \'ਤੇ ਬੁਖਾਰ ਘਟਾਉਂਦਾ ਹੈ।',
      warnings: 'ਜਿਗਰ ਚੇਤਾਵਨੀ: ਇਸ ਉਤਪਾਦ ਵਿੱਚ ਐਸੀਟਾਮਿਨੋਫੇਨ ਹੁੰਦਾ ਹੈ। ਜੇਕਰ ਤੁਸੀਂ 24 ਘੰਟੇ ਵਿੱਚ 4,000 ਮਿਲੀਗ੍ਰਾਮ ਤੋਂ ਵੱਧ ਐਸੀਟਾਮਿਨੋਫੇਨ ਲੈਂਦੇ ਹੋ ਜਾਂ ਇਸ ਉਤਪਾਦ ਦਾ ਇਸਤੇਮਾਲ ਕਰਦੇ ਸਮੇਂ ਰੋਜ਼ਾਨਾ 3 ਜਾਂ ਵੱਧ ਸ਼ਰਾਬ ਪੀਂਦੇ ਹੋ ਤਾਂ ਗੰਭੀਰ ਜਿਗਰ ਦਾ ਨੁਕਸਾਨ ਹੋ ਸਕਦਾ ਹੈ। ਐਲਰਜੀ ਚੇਤਾਵਨੀ: ਐਸੀਟਾਮਿਨੋਫੇਨ ਗੰਭੀਰ ਚਮੜੀ ਪ੍ਰਤਿਕ੍ਰਿਆਵਾਂ ਪੈਦਾ ਕਰ ਸਕਦਾ ਹੈ।',
      category: 'ਦਰਦ ਨਿਵਾਰਕ/ਬੁਖਾਰ ਘਟਾਉਣ ਵਾਲਾ'
    }
  },
  'aspirin': {
    en: {
      generic_name: 'ACETYLSALICYLIC ACID',
      purpose: 'Pain reliever/anti-inflammatory',
      dosage: 'Adults: 1-2 tablets every 4-6 hours as needed. Do not exceed 12 tablets in 24 hours.',
      indications: 'Temporarily relieves minor aches and pains due to: headache, toothache, menstrual cramps, muscle aches, arthritis. Also reduces fever and inflammation.',
      warnings: 'Do not use if you are allergic to aspirin or have stomach problems. May cause stomach bleeding. Do not give to children under 12 years of age.',
      category: 'NSAID (Non-Steroidal Anti-Inflammatory Drug)'
    },
    hi: {
      generic_name: 'एसिटाइलसैलिसिलिक एसिड',
      purpose: 'दर्द निवारक/सूजनरोधी',
      dosage: 'वयस्क: आवश्यकतानुसार हर 4-6 घंटे में 1-2 गोली। 24 घंटे में 12 गोली से अधिक न लें।',
      indications: 'अस्थायी रूप से निम्नलिखित के कारण होने वाले मामूली दर्द और पीड़ा को दूर करता है: सिरदर्द, दांत दर्द, मासिक धर्म में ऐंठन, मांसपेशियों में दर्द, गठिया। बुखार और सूजन भी कम करता है।',
      warnings: 'यदि आपको एस्पिरिन से एलर्जी है या पेट की समस्या है तो उपयोग न करें। पेट में रक्तस्राव हो सकता है। 12 वर्ष से कम उम्र के बच्चों को न दें।',
      category: 'एनएसएआईडी (गैर-स्टेरॉयडल एंटी-इंफ्लेमेटरी ड्रग)'
    },
    pa: {
      generic_name: 'ਐਸੀਟਾਈਲਸੈਲੀਸਿਲਿਕ ਐਸਿਡ',
      purpose: 'ਦਰਦ ਨਿਵਾਰਕ/ਸੁਜਣ ਰੋਧਕ',
      dosage: 'ਵਡੇ: ਲੋੜ ਅਨੁਸਾਰ ਹਰ 4-6 ਘੰਟੇ ਵਿੱਚ 1-2 ਗੋਲੀ। 24 ਘੰਟੇ ਵਿੱਚ 12 ਗੋਲੀ ਤੋਂ ਵੱਧ ਨਾ ਲਓ।',
      indications: 'ਅਸਥਾਈ ਤੌਰ \'ਤੇ ਹੇਠ ਲਿਖੇ ਕਾਰਨ ਹੋਣ ਵਾਲੇ ਮਾਮੂਲੀ ਦਰਦ ਅਤੇ ਪੀੜ੍ਹਾ ਨੂੰ ਦੂਰ ਕਰਦਾ ਹੈ: ਸਿਰ ਦਰਦ, ਦੰਦ ਦਰਦ, ਮਾਹਵਾਰੀ ਵਿੱਚ ਐਂਠਣ, ਮਾਸਪੇਸ਼ੀਆਂ ਵਿੱਚ ਦਰਦ, ਗਠੀਆ। ਬੁਖਾਰ ਅਤੇ ਸੁਜਣ ਵੀ ਘਟਾਉਂਦਾ ਹੈ।',
      warnings: 'ਜੇਕਰ ਤੁਹਾਨੂੰ ਐਸਪਿਰਿਨ ਤੋਂ ਐਲਰਜੀ ਹੈ ਜਾਂ ਪੇਟ ਦੀ ਸਮਸਿਆ ਹੈ ਤਾਂ ਇਸਤੇਮਾਲ ਨਾ ਕਰੋ। ਪੇਟ ਵਿੱਚ ਖੂਨ ਵਹਿਣਾ ਹੋ ਸਕਦਾ ਹੈ। 12 ਸਾਲ ਤੋਂ ਘੱਟ ਉਮਰ ਦੇ ਬੱਚਿਆਂ ਨੂੰ ਨਾ ਦਓ।',
      category: 'ਐਨਐਸਏਆਈਡੀ (ਨਾਨ-ਸਟੇਰੋਇਡਲ ਐਂਟੀ-ਇਨਫਲੇਮੇਟਰੀ ਡਰੱਗ)'
    }
  },
  'ibuprofen': {
    en: {
      generic_name: 'IBUPROFEN',
      purpose: 'Pain reliever/anti-inflammatory/fever reducer',
      dosage: 'Adults: 200-400mg every 4-6 hours as needed. Do not exceed 1200mg in 24 hours.',
      indications: 'Temporarily relieves minor aches and pains due to: headache, toothache, backache, menstrual cramps, arthritis, muscle aches. Reduces fever and inflammation.',
      warnings: 'May cause stomach bleeding. Do not use if you have heart problems, high blood pressure, or are pregnant. Take with food to reduce stomach upset.',
      category: 'NSAID (Non-Steroidal Anti-Inflammatory Drug)'
    },
    hi: {
      generic_name: 'आइबुप्रोफेन',
      purpose: 'दर्द निवारक/सूजनरोधी/ज्वरनाशक',
      dosage: 'वयस्क: आवश्यकतानुसार हर 4-6 घंटे में 200-400mg। 24 घंटे में 1200mg से अधिक न लें।',
      indications: 'अस्थायी रूप से निम्नलिखित के कारण होने वाले मामूली दर्द और पीड़ा को दूर करता है: सिरदर्द, दांत दर्द, कमर दर्द, मासिक धर्म में ऐंठन, गठिया, मांसपेशियों में दर्द। बुखार और सूजन कम करता है।',
      warnings: 'पेट में रक्तस्राव हो सकता है। यदि आपको हृदय की समस्या, उच्च रक्तचाप है या आप गर्भवती हैं तो उपयोग न करें। पेट की परेशानी कम करने के लिए भोजन के साथ लें।',
      category: 'एनएसएआईडी (गैर-स्टेरॉयडल एंटी-इंफ्लेमेटरी ड्रग)'
    },
    pa: {
      generic_name: 'ਆਈਬੁਪ੍ਰੋਫੇਨ',
      purpose: 'ਦਰਦ ਨਿਵਾਰਕ/ਸੁਜਣ ਰੋਧਕ/ਬੁਖਾਰ ਘਟਾਉਣ ਵਾਲਾ',
      dosage: 'ਵਡੇ: ਲੋੜ ਅਨੁਸਾਰ ਹਰ 4-6 ਘੰਟੇ ਵਿੱਚ 200-400mg। 24 ਘੰਟੇ ਵਿੱਚ 1200mg ਤੋਂ ਵੱਧ ਨਾ ਲਓ।',
      indications: 'ਅਸਥਾਈ ਤੌਰ \'ਤੇ ਹੇਠ ਲਿਖੇ ਕਾਰਨ ਹੋਣ ਵਾਲੇ ਮਾਮੂਲੀ ਦਰਦ ਅਤੇ ਪੀੜ੍ਹਾ ਨੂੰ ਦੂਰ ਕਰਦਾ ਹੈ: ਸਿਰ ਦਰਦ, ਦੰਦ ਦਰਦ, ਕਮਰ ਦਰਦ, ਮਾਹਵਾਰੀ ਵਿੱਚ ਐਂਠਣ, ਗਠੀਆ, ਮਾਸਪੇਸ਼ੀਆਂ ਵਿੱਚ ਦਰਦ। ਬੁਖਾਰ ਅਤੇ ਸੁਜਣ ਘਟਾਉਂਦਾ ਹੈ।',
      warnings: 'ਪੇਟ ਵਿੱਚ ਖੂਨ ਵਹਿਣਾ ਹੋ ਸਕਦਾ ਹੈ। ਜੇਕਰ ਤੁਹਾਨੂੰ ਦਿਲ ਦੀ ਸਮਸਿਆ, ਉੱਚ ਰਕਤ ਚਾਪ ਹੈ ਜਾਂ ਤੁਸੀਂ ਗਰਭਵਤੀ ਹੋ ਤਾਂ ਇਸਤੇਮਾਲ ਨਾ ਕਰੋ। ਪੇਟ ਦੀ ਪਰੇਸ਼ਾਨੀ ਘਟਾਉਣ ਲਈ ਖਾਣੇ ਦੇ ਨਾਲ ਲਓ।',
      category: 'ਐਨਐਸਏਆਈਡੀ (ਨਾਨ-ਸਟੇਰੋਇਡਲ ਐਂਟੀ-ਇਨਫਲੇਮੇਟਰੀ ਡਰੱਗ)'
    }
  },
  'acetaminophen': {
    en: {
      generic_name: 'ACETAMINOPHEN',
      purpose: 'Pain reliever/fever reducer',
      dosage: 'Adults and children 12 years and over: take 2 tablets every 6 hours while symptoms last. Do not take more than 6 tablets in 24 hours, unless directed by a doctor.',
      indications: 'Temporarily relieves minor aches and pains due to: headache, the common cold, backache, minor pain of arthritis, toothache, muscular aches, premenstrual and menstrual cramps. Temporarily reduces fever.',
      warnings: 'Liver warning: This product contains acetaminophen. Severe liver damage may occur if you take more than 4,000 mg of acetaminophen in 24 hours with other drugs containing acetaminophen or 3 or more alcoholic drinks every day while using this product. Allergy alert: Acetaminophen may cause severe skin reactions.',
      category: 'Analgesic/Antipyretic'
    },
    hi: {
      generic_name: 'एसिटामिनोफेन',
      purpose: 'दर्द निवारक/बुखार कम करने वाला',
      dosage: 'वयस्क और 12 वर्ष से अधिक उम्र के बच्चे: लक्षण रहने तक हर 6 घंटे में 2 गोली लें। 24 घंटे में 6 गोली से अधिक न लें, जब तक कि डॉक्टर द्वारा निर्देशित न किया गया हो।',
      indications: 'अस्थायी रूप से निम्नलिखित के कारण होने वाले मामूली दर्द और पीड़ा को दूर करता है: सिरदर्द, सामान्य सर्दी, कमर दर्द, गठिया का मामूली दर्द, दांत दर्द, मांसपेशियों में दर्द, मासिक धर्म से पहले और मासिक धर्म के दौरान ऐंठन। अस्थायी रूप से बुखार कम करता है।',
      warnings: 'यकृत चेतावनी: इस उत्पाद में एसिटामिनोफेन होता है। यदि आप 24 घंटे में 4,000 मिलीग्राम से अधिक एसिटामिनोफेन लेते हैं या इस उत्पाद का उपयोग करते समय प्रतिदिन 3 या अधिक शराब पीते हैं तो गंभीर यकृत क्षति हो सकती है। एलर्जी चेतावनी: एसिटामिनोफेन गंभीर त्वचा प्रतिक्रियाएं पैदा कर सकता है।',
      category: 'दर्द निवारक/ज्वरनाशक'
    },
    pa: {
      generic_name: 'ਐਸੀਟਾਮਿਨੋਫੇਨ',
      purpose: 'ਦਰਦ ਨਿਵਾਰਕ/ਬੁਖਾਰ ਘਟਾਉਣ ਵਾਲਾ',
      dosage: 'ਵਡੇ ਅਤੇ 12 ਸਾਲ ਤੋਂ ਵੱਧ ਉਮਰ ਦੇ ਬੱਚੇ: ਲੱਛਣ ਰਹਿਣ ਤੱਕ ਹਰ 6 ਘੰਟੇ ਵਿੱਚ 2 ਗੋਲੀ ਲਓ। 24 ਘੰਟੇ ਵਿੱਚ 6 ਗੋਲੀ ਤੋਂ ਵੱਧ ਨਾ ਲਓ, ਜਦੋਂ ਤੱਕ ਕਿ ਡਾਕਟਰ ਵੱਲੋਂ ਨਿਰਦੇਸ਼ਿਤ ਨਾ ਕੀਤਾ ਗਿਆ ਹੋਵੇ।',
      indications: 'ਅਸਥਾਈ ਤੌਰ \'ਤੇ ਹੇਠ ਲਿਖੇ ਕਾਰਨ ਹੋਣ ਵਾਲੇ ਮਾਮੂਲੀ ਦਰਦ ਅਤੇ ਪੀੜ੍ਹਾ ਨੂੰ ਦੂਰ ਕਰਦਾ ਹੈ: ਸਿਰ ਦਰਦ, ਆਮ ਜ਼ੁਕਾਮ, ਕਮਰ ਦਰਦ, ਗਠੀਏ ਦਾ ਮਾਮੂਲੀ ਦਰਦ, ਦੰਦ ਦਰਦ, ਮਾਸਪੇਸ਼ੀਆਂ ਵਿੱਚ ਦਰਦ, ਮਾਹਵਾਰੀ ਤੋਂ ਪਹਿਲਾਂ ਅਤੇ ਮਾਹਵਾਰੀ ਦੌਰਾਨ ਐਂਠਣ। ਅਸਥਾਈ ਤੌਰ \'ਤੇ ਬੁਖਾਰ ਘਟਾਉਂਦਾ ਹੈ।',
      warnings: 'ਜਿਗਰ ਚੇਤਾਵਨੀ: ਇਸ ਉਤਪਾਦ ਵਿੱਚ ਐਸੀਟਾਮਿਨੋਫੇਨ ਹੁੰਦਾ ਹੈ। ਜੇਕਰ ਤੁਸੀਂ 24 ਘੰਟੇ ਵਿੱਚ 4,000 ਮਿਲੀਗ੍ਰਾਮ ਤੋਂ ਵੱਧ ਐਸੀਟਾਮਿਨੋਫੇਨ ਲੈਂਦੇ ਹੋ ਜਾਂ ਇਸ ਉਤਪਾਦ ਦਾ ਇਸਤੇਮਾਲ ਕਰਦੇ ਸਮੇਂ ਰੋਜ਼ਾਨਾ 3 ਜਾਂ ਵੱਧ ਸ਼ਰਾਬ ਪੀਂਦੇ ਹੋ ਤਾਂ ਗੰਭੀਰ ਜਿਗਰ ਦਾ ਨੁਕਸਾਨ ਹੋ ਸਕਦਾ ਹੈ। ਐਲਰਜੀ ਚੇਤਾਵਨੀ: ਐਸੀਟਾਮਿਨੋਫੇਨ ਗੰਭੀਰ ਚਮੜੀ ਪ੍ਰਤਿਕ੍ਰਿਆਵਾਂ ਪੈਦਾ ਕਰ ਸਕਦਾ ਹੈ।',
      category: 'ਦਰਦ ਨਿਵਾਰਕ/ਬੁਖਾਰ ਘਟਾਉਣ ਵਾਲਾ'
    }
  }
};

// Default translation for unknown medicines
export const defaultTranslation: MedicineTranslations = {
  en: {
    generic_name: 'Not available',
    purpose: 'Medicine information not available',
    dosage: 'Please consult your doctor for dosage information',
    indications: 'Please consult your doctor for usage information',
    warnings: 'Please consult your doctor for safety information',
    category: 'Unknown'
  },
  hi: {
    generic_name: 'उपलब्ध नहीं',
    purpose: 'दवा की जानकारी उपलब्ध नहीं',
    dosage: 'खुराक की जानकारी के लिए कृपया अपने डॉक्टर से सलाह लें',
    indications: 'उपयोग की जानकारी के लिए कृपया अपने डॉक्टर से सलाह लें',
    warnings: 'सुरक्षा जानकारी के लिए कृपया अपने डॉक्टर से सलाह लें',
    category: 'अज्ञात'
  },
  pa: {
    generic_name: 'ਉਪਲਬਧ ਨਹੀਂ',
    purpose: 'ਦਵਾਈ ਦੀ ਜਾਣਕਾਰੀ ਉਪਲਬਧ ਨਹੀਂ',
    dosage: 'ਖੁਰਾਕ ਦੀ ਜਾਣਕਾਰੀ ਲਈ ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੇ ਡਾਕਟਰ ਨਾਲ ਸਲਾਹ ਲਓ',
    indications: 'ਵਰਤੋਂ ਦੀ ਜਾਣਕਾਰੀ ਲਈ ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੇ ਡਾਕਟਰ ਨਾਲ ਸਲਾਹ ਲਓ',
    warnings: 'ਸੁਰੱਖਿਆ ਜਾਣਕਾਰੀ ਲਈ ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੇ ਡਾਕਟਰ ਨਾਲ ਸਲਾਹ ਲਓ',
    category: 'ਅਣਜਾਣ'
  }
};

export function getMedicineTranslation(medicineName: string, language: string): MedicineTranslation {
  const key = medicineName.toLowerCase().trim();
  const translations = medicineTranslations[key];
  
  if (translations && translations[language as keyof MedicineTranslations]) {
    return translations[language as keyof MedicineTranslations];
  }
  
  return defaultTranslation[language as keyof MedicineTranslations] || defaultTranslation.en;
}

// Function to translate FDA data to different languages
export function translateFDAData(fdaData: any, language: string): MedicineTranslation {
  if (language === 'en') {
    return {
      generic_name: fdaData.generic_name || 'Not available',
      purpose: fdaData.purpose || 'Not available',
      dosage: fdaData.dosage || 'Not available',
      indications: fdaData.indications || 'Not available',
      warnings: fdaData.warnings || 'Not available',
      category: fdaData.category || 'Not available'
    };
  }
  
  // For Hindi and Punjabi, try to find specific translations for this medicine
  const medicineName = fdaData.generic_name?.toLowerCase() || '';
  const translations = medicineTranslations[medicineName];
  
  if (translations && translations[language as keyof MedicineTranslations]) {
    return translations[language as keyof MedicineTranslations];
  }
  
  // If no specific translation found, provide a message indicating the data is in English
  // but show the English data with a note
  return {
    generic_name: fdaData.generic_name || 'Not available',
    purpose: fdaData.purpose || 'Not available',
    dosage: fdaData.dosage || 'Not available',
    indications: fdaData.indications || 'Not available',
    warnings: fdaData.warnings || 'Not available',
    category: fdaData.category || 'Not available'
  };
}

// Function to get field labels in different languages
export function getFieldLabels(language: string) {
  const labels = {
    en: {
      generic_name: 'Generic Name:',
      purpose: 'Purpose:',
      dosage: 'Dosage:',
      indications: 'Indications:',
      warnings: 'Warnings:',
      category: 'Category:',
      source: 'Source:',
      note: 'Note: This information is in English as translation is not available for this medicine.'
    },
    hi: {
      generic_name: 'जेनेरिक नाम:',
      purpose: 'उद्देश्य:',
      dosage: 'खुराक:',
      indications: 'संकेत:',
      warnings: 'चेतावनी:',
      category: 'श्रेणी:',
      source: 'स्रोत:',
      note: 'नोट: यह जानकारी अंग्रेजी में है क्योंकि इस दवा के लिए अनुवाद उपलब्ध नहीं है।'
    },
    pa: {
      generic_name: 'ਜੇਨੇਰਿਕ ਨਾਮ:',
      purpose: 'ਮਕਸਦ:',
      dosage: 'ਖੁਰਾਕ:',
      indications: 'ਸੰਕੇਤ:',
      warnings: 'ਚੇਤਾਵਨੀ:',
      category: 'ਸ਼੍ਰੇਣੀ:',
      source: 'ਸਰੋਤ:',
      note: 'ਨੋਟ: ਇਹ ਜਾਣਕਾਰੀ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਹੈ ਕਿਉਂਕਿ ਇਸ ਦਵਾਈ ਲਈ ਅਨੁਵਾਦ ਉਪਲਬਧ ਨਹੀਂ ਹੈ।'
    }
  };
  
  return labels[language as keyof typeof labels] || labels.en;
}
