
const languageMap = {
    "en": "English",
    "fr": "French",
    "es": "Spanish",
    "pt": "Portuguese",
    "ru": "Russian",
    "tr": "Turkish",
    "de": "German",
    "it": "Italian",
    "ja": "Japanese",
    "zh": "Chinese",
    "unknown": "Unknown" // Fallback
  }

export const detectLanguage = async (text) =>{
    try {
        const capabilities = await window.ai.languageDetector.capabilities();
        if (capabilities.capabilites === "no"){
            throw new Error("Language detection is not supported in this environment");
        }

        const detector = await window.ai.languageDetector.create();
        const results = await detector.detect(text);
        const languageCode = results || "unknown";
        return languageMap[languageCode[0].detectedLanguage] || "unknown";
    } catch (error) {
        console.error("Detection error:", error);
        throw new Error("Language detection failed");
    }
}