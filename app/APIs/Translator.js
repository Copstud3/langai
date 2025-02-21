// APIs/Translator.js
const languageOptions = {
    en: "English",
    pt: "Portuguese",
    es: "Spanish",
    ru: "Russian",
    tr: "Turkish",
    fr: "French",
  };
  
  export const translateText = async (text, targetLang, sourceLang) => {
    try {
      if (!("ai" in self && "translator" in self.ai)) {
        throw new Error("Chrome AI API is not available in this browser");
      }
  
      const translatorCapabilities = await self.ai.translator.capabilities();
      if (!translatorCapabilities.languagePairAvailable(sourceLang, targetLang)) {
        throw new Error(`Language pair not supported: ${sourceLang} to ${targetLang}`);
      }
  
      const translator = await self.ai.translator.create({
        sourceLanguage: sourceLang,
        targetLanguage: targetLang,
        monitor(m) {
          m.addEventListener("downloadprogress", (e) => {
            console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
          });
        },
      });
  
      const result = await translator.translate(text);
      if (!result) {
        throw new Error("No translation result received");
      }
  
      // Assume result is a string; adjust if API docs specify otherwise
      return result;
    } catch (error) {
      console.error("Translation error:", error);
      throw error; // Let ChatMessageArea handle display
    }
  };
  
  export const getLanguageOptions = () => languageOptions;