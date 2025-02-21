// Summarizer.js
export const summarizeText = async (text) => {
    try {
      if (!('ai' in self && 'summarizer' in self.ai)) {
        throw new Error("Summarization API not supported in this browser");
      }
      const summarizer = await ai.summarizer.create({
        monitor(m) {
          m.addEventListener('downloadprogress', (e) => {
            console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
          });
        }
      });
      const summary = await summarizer.summarize(text);
      return summary || "Summary unavailable";
    } catch (error) {
      console.error("Summarization error:", error);
      return "Summarization failed";
    }
  };