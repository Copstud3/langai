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
    // Check if the Chrome AI API is available
    if (!("ai" in self && "translator" in self.ai)) {
      throw new Error("Chrome AI API is not available in this browser");
    }

    // Validate languages
    const translatorCapabilities = await self.ai.translator.capabilities();
    translatorCapabilities.languagePairAvailable(sourceLang, targetLang);

    // Create translation model
    const translator = await self.ai.translator.create({
      sourceLanguage: sourceLang,
      targetLanguage: targetLang,
      monitor(m) {
        m.addEventListener("downloadprogress", (e) => {
          console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
        });
      },
    });

    // Perform translation
    const result = await translator.translate(text);

    if (!result || !result.translation) {
      throw new Error("No translation result received");
    }

    return result.translation;
  } catch (error) {
    console.error("Translation error:", error);

    if (error instanceof DOMException && error.name === "NotSupportedError") {
      throw new Error(
        `Language pair not supported: ${sourceLang} to ${targetLang}`
      );
    }

    throw error; // Let the component handle the error display
  }
};

export const getLanguageOptions = () => languageOptions;
