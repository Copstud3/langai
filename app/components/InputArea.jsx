import React from "react";
import {Send} from "lucide-react"

const InputArea = ({inputText, handleSend, handleKeyPress, setInputText}) => {
  return (
    <div className="flex gap-2 lg:px-[400px] px-3 pb-5 pt-4  bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="flex items-center border rounded-lg w-full py-2 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type your message..."
        className="flex-1 text-gray-800 bg-transparent focus:outline-none overflow-y-auto scrollbar-hide resize-none"
        rows={1}
      />
      <button
        onClick={handleSend}
        className="bg-gray-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Send size={20} />
      </button>
      </div>
    </div>
    
  );
};

export default InputArea;
