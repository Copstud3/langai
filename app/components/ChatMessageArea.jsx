import React, { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { ConfirmationDialog } from "./ConfirmationDialog";
import { detectLanguage } from "../APIs/LanguageDetector";
import { summarizeText } from "../APIs/Summarizer";
import { translateText, getLanguageOptions } from "../APIs/Translator";

const ChatMessageArea = ({
  messages,
  setMessages,
  showConfirmation,
  setShowConfirmation,
  handleDelete,
}) => {
  const [detectedLanguages, setDetectedLanguages] = useState({});
  const [selectedLang, setSelectedLang] = useState("en");
  const [isProcessing, setIsProcessing] = useState({});

  const languageOptions = getLanguageOptions();

  // Map full language names to ISO 639-1 codes (aligned with languageOptions)
  const languageCodeMap = {
    "English": "en",
    "Portuguese": "pt",
    "Spanish": "es",
    "Russian": "ru",
    "Turkish": "tr",
    "French": "fr",
    "Unknown": "en", // Default to "en" for unknown or failed detection
    "Failed to detect": "en" // Handle error case
  };


  useEffect(() => {
    const detectLanguages = async () => {
      const newLanguages = { ...detectedLanguages };
      for (const message of messages) {
        if (
          !newLanguages[message.id] &&
          !message.isTranslation &&
          !message.isSummary
        ) {
          try {
            const language = await detectLanguage(message.text);
            newLanguages[message.id] = language;
          } catch (error) {
            newLanguages[message.id] = "Failed to detect";
          }
        }
      }
      setDetectedLanguages(newLanguages);
    };
    detectLanguages();
  }, [messages]);

  const handleSummarize = async (messageId, text) => {
    setIsProcessing((prev) => ({ ...prev, [messageId]: "summarizing" }));
    try {
      const summary = await summarizeText(text);
      setMessages((prev) => [
        ...prev,
        {
          id: `${messageId}-summary-${Date.now()}`,
          text: summary,
          timestamp: new Date().toLocaleTimeString(),
          isSummary: true,
          replyingToId: messageId,
          replyingToText: text.length > 30 ? `${text.slice(0, 30)}...` : text,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: `${messageId}-summary-error-${Date.now()}`,
          text: "Failed to summarize",
          timestamp: new Date().toLocaleTimeString(),
          isSummary: true,
          replyingToId: messageId,
          replyingToText: text.length > 30 ? `${text.slice(0, 30)}...` : text,
          isError: true,
        },
      ]);
    } finally {
      setIsProcessing((prev) => ({ ...prev, [messageId]: null }));
    }
  };

  const handleTranslate = async (messageId, text) => {
    setIsProcessing((prev) => ({ ...prev, [messageId]: "translating" }));
    try {
      // Map detected full language name to its code
      const detectedLang = detectedLanguages[messageId] || "Unknown";
      const sourceLang = languageCodeMap[detectedLang] || "en"; // Default to "en" if unknown
      const translation = await translateText(text, selectedLang, sourceLang);
      setMessages((prev) => [
        ...prev,
        {
          id: `${messageId}-trans-${Date.now()}`,
          text: translation,
          timestamp: new Date().toLocaleTimeString(),
          isTranslation: true,
          targetLanguage: languageOptions[selectedLang],
          replyingToId: messageId,
          replyingToText: text.length > 30 ? `${text.slice(0, 30)}...` : text
        }
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: `${messageId}-trans-error-${Date.now()}`,
          text: error.message || "Translation failed",
          timestamp: new Date().toLocaleTimeString(),
          isTranslation: true,
          targetLanguage: languageOptions[selectedLang],
          replyingToId: messageId,
          replyingToText: text.length > 30 ? `${text.slice(0, 30)}...` : text,
          isError: true
        }
      ]);
    } finally {
      setIsProcessing((prev) => ({ ...prev, [messageId]: null }));
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-gray-50 to-gray-100 min-h-[calc(100vh-178px)] lg:px-[300px] space-y-6">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="text-3xl lg:text-6xl font-bold text-gray-600">
            Welcome to LangAI
          </h1>
          <p className="text-sm lg:text-xl font-medium text-gray-400">
            What text will you send today?
          </p>
        </div>
      ) : (
        messages.map((message) => (
          <div
            key={message.id}
            className={`flex flex-col ${
              message.isTranslation || message.isSummary
                ? "items-start"
                : "items-end"
            } group animate-fade-in`}
          >
            <div
              className={`max-w-[80%] lg:max-w-[70%] p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 relative ${
                message.isTranslation
                  ? message.isError
                    ? "bg-teal-500 text-white"
                    : "bg-teal-500 text-white"
                  : message.isSummary
                  ? message.isError
                    ? "bg-red-500 text-white"
                    : "bg-purple-500 text-white"
                  : "bg-indigo-600 text-white"
              } ${
                message.isTranslation || message.isSummary
                  ? "rounded-bl-none"
                  : "rounded-br-none"
              }`}
            >
              <button
                onClick={() => setShowConfirmation(message.id)}
                className={`absolute top-1/2 -translate-y-1/2 ${
                  message.isTranslation || message.isSummary
                    ? "-right-10 text-teal-400 hover:text-red-500"
                    : "-left-10 text-gray-400 hover:text-red-500"
                } ${
                  message.isSummary ? "text-purple-500 hover:text-red-600 " : ""
                } opacity-0 group-hover:opacity-100 transition-opacity duration-150`}
                aria-label="Delete message"
              >
                <Trash2 size={18} />
              </button>
              {showConfirmation === message.id && (
                <ConfirmationDialog
                  message="Delete this message?"
                  onConfirm={() => handleDelete(message.id)}
                  onCancel={() => setShowConfirmation(null)}
                />
              )}

              {(message.isTranslation || message.isSummary) && (
                <p className="text-xs text-gray-100 mb-2 opacity-75 italic">
                  Replying to: "{message.replyingToText}"
                </p>
              )}

              <p className="text-sm md:text-base break-words">{message.text}</p>
              <div className="mt-2 text-xs flex items-center justify-between">
                <span>{message.timestamp}</span>
              </div>
              {!message.isTranslation && !message.isSummary ? (
                <p className="text-xs text-indigo-200 mt-1">
                  Language: {detectedLanguages[message.id] || "Detecting..."}
                </p>
              ) : message.isTranslation ? (
                <p className="text-xs text-teal-100 mt-1">
                  Translated to: {message.targetLanguage}
                </p>
              ) : (
                <p className="text-xs text-purple-100 mt-1">Summary</p>
              )}

              {!message.isTranslation && !message.isSummary && (
                <div className="mt-3 space-y-2">
                  {message.text.length > 150 &&
                    detectedLanguages[message.id] === "English" && (
                      <button
                        onClick={() =>
                          handleSummarize(message.id, message.text)
                        }
                        disabled={isProcessing[message.id] === "summarizing"}
                        className=" bg-green-500 text-white text-sm py-2 px-[57px] rounded-lg hover:bg-green-600 disabled:bg-green-300 transition-colors duration-150"
                        aria-label="Summarize message"
                      >
                        {isProcessing[message.id] === "summarizing"
                          ? "Summarizing..."
                          : "Summarize"}
                      </button>
                    )}
                  <div className="flex items-center space-x-2">
                    <select
                      value={selectedLang}
                      onChange={(e) => setSelectedLang(e.target.value)}
                      className="bg-white text-gray-800 text-xs py-1 px-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      aria-label="Select translation language"
                    >
                      {Object.entries(languageOptions).map(([code, name]) => (
                        <option key={code} value={code}>
                          {name}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleTranslate(message.id, message.text)}
                      disabled={isProcessing[message.id] === "translating"}
                      className="bg-blue-500 text-white text-xs py-1 px-3 rounded-lg hover:bg-blue-600 disabled:bg-blue-300 transition-colors duration-150"
                      aria-label="Translate message"
                    >
                      {isProcessing[message.id] === "translating"
                        ? "Translating..."
                        : "Translate"}
                    </button>
                  </div>
                </div>
              )}
            </div>
            {/* Thinking Animation (for translations and summaries in progress) */}
            {isProcessing[message.id] === "translating" && (
              <div className="flex items-start mt-2 max-w-[70%] animate-fade-in">
                <div className="flex space-x-1 p-4 bg-teal-100 rounded-xl shadow-md">
                  <span
                    className="w-2 h-2 bg-teal-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0s" }}
                  ></span>
                  <span
                    className="w-2 h-2 bg-teal-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></span>
                  <span
                    className="w-2 h-2 bg-teal-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></span>
                </div>
              </div>
            )}
            {isProcessing[message.id] === "summarizing" && (
              <div className="flex items-start mt-2 max-w-[70%] animate-fade-in">
                <div className="flex space-x-1 p-4 bg-purple-100 rounded-xl shadow-md">
                  <span
                    className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0s" }}
                  ></span>
                  <span
                    className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></span>
                  <span
                    className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></span>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default ChatMessageArea;
