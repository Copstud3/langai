import { useState, useEffect } from "react";
import InputArea from "./InputArea"
import Header from "./Header";
import ChatMessageArea from "./ChatMessageArea";

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [error, setError] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(null); // null or messageId
  const [showClearAllConfirmation, setShowClearAllConfirmation] =
    useState(false);

  useEffect(() => {
    const savedMessages = localStorage.getItem("chatMessages");
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    try {
      const newMessage = {
        id: Date.now(),
        text: inputText,
        language: null,
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, newMessage]);
      
      setInputText("");
      const lang = await detectLanguage(inputText);
      newMessage.language = lang;
      setMessages((prev) => [...prev, newMessage]);


     
    } catch (err) {
      setError("Error detecting language: " + err.message);
    }
  };

  const handleDelete = (messageId) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
    setShowConfirmation(null);
  };

  const handleClearAll = () => {
    setMessages([]);
    setShowClearAllConfirmation(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

    return (
    <div className="flex flex-col h-screen py-4">
      <Header messages={messages} showClearAllConfirmation={showClearAllConfirmation} setShowClearAllConfirmation={setShowClearAllConfirmation} handleClearAll={handleClearAll}/>
      {/* Chat messages area */}
      <ChatMessageArea messages={messages} showConfirmation={showConfirmation} setShowConfirmation={setShowConfirmation} handleDelete={handleDelete} setMessages={setMessages} />

      {/* Input area */}
      <InputArea handleSend={handleSend} inputText={inputText} handleKeyPress={handleKeyPress} setInputText={setInputText} />
    </div>
  );
};

export default ChatInterface;
