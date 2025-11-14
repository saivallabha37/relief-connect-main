import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Send, Bot, User, Loader, Mic, MicOff, Volume2 } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const AIAssistant = () => {
  const [messages, setMessages] = useState([]);
  const { user, userLocation } = useAuth();
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState("");
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthRef = useRef(null);
  const genAI = useRef(null);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => scrollToBottom(), [messages]);

  // Personalized Greeting on load
  useEffect(() => {
    if (messages.length === 0 && geminiApiKey) {
      const name = user?.name || user?.email?.split("@")[0] || "there";
      let locationText = "";
      if (userLocation?.place) locationText = ` in ${userLocation.place}`;
      else if (userLocation?.lat && userLocation?.lng)
        locationText = " near your saved location";
      const greeting = `Hi ${name}${locationText}! I'm your emergency AI assistant. What issue are you facing right now? (e.g., medical, flood/heavy rain, fire, earthquake, cyclone, other)`;
      setMessages([
        { id: Date.now(), type: "bot", content: greeting, timestamp: new Date() },
      ]);
    }
  }, [user, userLocation, geminiApiKey]);

  // Setup Gemini AI, SpeechRecognition & SpeechSynthesis
  useEffect(() => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || localStorage.getItem("geminiApiKey");
    if (apiKey) {
      setGeminiApiKey(apiKey);
      try {
        genAI.current = new GoogleGenerativeAI(apiKey);
      } catch (error) {
        console.error("Failed to initialize GoogleGenerativeAI:", error);
        localStorage.removeItem("geminiApiKey");
        setGeminiApiKey("");
      }
    }

    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-IN";
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };
      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };
      recognitionRef.current.onend = () => setIsListening(false);
    }

    if ("speechSynthesis" in window) synthRef.current = window.speechSynthesis;

    return () => {
      recognitionRef.current?.stop();
      synthRef.current?.cancel();
    };
  }, []);

  const speakText = (text) => {
    if (synthRef.current && text) {
      synthRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      synthRef.current.speak(utterance);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading || !genAI.current) return;

    const userMessage = { id: Date.now(), type: "user", content: inputMessage, timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    const messageToSend = inputMessage;
    setInputMessage("");
    setIsLoading(true);

    try {
      if (!genAI.current) {
        throw new Error("AI not initialized. Please reload the page.");
      }
      const model = genAI.current.getGenerativeModel({ model: "gemini-1.5-flash" });
      const systemPrompt = `You are an Indian emergency response AI assistant. You help people during emergencies like floods, earthquakes, fires, medical emergencies, etc. Provide clear, concise, actionable steps with relevant emergency contact numbers when needed. Always prioritize safety and immediate action.\n\nUser question: ${messageToSend}`;
      const result = await model.generateContent(systemPrompt);
      if (!result || !result.response) {
        throw new Error("No response from API");
      }
      const botText = result.response.text();
      const botMessage = { id: Date.now() + 1, type: "bot", content: botText, timestamp: new Date() };
      setMessages((prev) => [...prev, botMessage]);
      speakText(botText);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessageContent = `I apologize, but I'm having trouble connecting right now. Error: ${error.message}. Please check your API key or try again. Contact emergency services directly if this is urgent.`;
      setMessages((prev) => [...prev, { id: Date.now() + 1, type: "bot", content: errorMessageContent, timestamp: new Date() }]);
    } finally {
      setIsLoading(false);
    }
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleApiKeySubmit = (e) => {
    e.preventDefault();
    const trimmedApiKey = geminiApiKey.trim();
    if (trimmedApiKey) {
      localStorage.setItem("geminiApiKey", trimmedApiKey);
      window.location.reload();
    }
  };

  const quickQuestions = [
    "What should I do during an earthquake?", "How do I prepare an emergency kit?",
    "What are the evacuation procedures?", "How can I report a missing person?",
    "What should I do in a flood?", "How do I find emergency shelters?",
  ];

  // Render the assistant UI regardless of whether an API key is present.
  // The app will still attempt to initialize the Gemini client when an API key
  // is available via `import.meta.env.VITE_GEMINI_API_KEY` or `localStorage`.

  return (
    <div className="h-[calc(100vh-4rem)] w-full max-w-4xl mx-auto flex flex-col p-4 bg-gray-50 dark:bg-gray-900">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center sm:text-left">AI Emergency Assistant</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2 text-center sm:text-left">Get instant help and guidance for emergency situations.</p>
        <div className="flex items-center justify-center sm:justify-start space-x-4 mt-3">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isListening ? "bg-red-500 animate-pulse" : "bg-gray-400"}`}></div>
            <span className="text-sm text-gray-600 dark:text-gray-300">{isListening ? "Listening..." : "Voice ready"}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isSpeaking ? "bg-blue-500 animate-pulse" : "bg-gray-400"}`}></div>
            <span className="text-sm text-gray-600 dark:text-gray-300">{isSpeaking ? "Speaking..." : "Audio ready"}</span>
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-start gap-3 ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
              {msg.type === "bot" && <div className="w-9 h-9 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0"><Bot className="h-5 w-5 text-white" /></div>}
              <div className={`max-w-sm lg:max-w-md px-4 py-2.5 rounded-xl shadow-sm ${msg.type === "user" ? "bg-indigo-600 text-white rounded-br-none" : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none"}`}>
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                <p className="text-xs opacity-70 mt-1.5 text-right">{msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
              </div>
              {msg.type === "user" && <div className="w-9 h-9 bg-gray-600 dark:bg-gray-500 rounded-full flex items-center justify-center flex-shrink-0"><User className="h-5 w-5 text-white" /></div>}
            </div>
          ))}
          {isLoading && <div className="flex items-start gap-3"><div className="w-9 h-9 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0"><Bot className="h-5 w-5 text-white" /></div><div className="bg-gray-100 dark:bg-gray-700 px-4 py-2.5 rounded-xl rounded-bl-none flex items-center space-x-2"><Loader className="h-4 w-4 animate-spin text-gray-600 dark:text-gray-300" /><span className="text-sm text-gray-600 dark:text-gray-300">Thinking...</span></div></div>}
          <div ref={messagesEndRef} />
        </div>
        {messages.length < 2 && !isLoading && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-600">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Or, ask a quick question:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {quickQuestions.map((q, i) => (<button key={i} onClick={() => setInputMessage(q)} className="text-left p-2.5 text-sm bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors">{q}</button>))}
            </div>
          </div>
        )}
        <div className="p-4 border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex flex-col space-y-3">
            <div className="flex items-center justify-center space-x-4">
              <button onClick={isListening ? stopListening : startListening} disabled={isLoading} className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${isListening ? "bg-red-500 hover:bg-red-600 text-white focus:ring-red-500" : "bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 focus:ring-gray-500"}`}>
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                <span className="text-sm font-medium">{isListening ? "Stop" : "Voice Input"}</span>
              </button>
              <button onClick={() => speakText(messages.length > 0 ? messages[messages.length - 1].content : "")} disabled={isLoading || messages.length === 0 || isSpeaking || messages[messages.length - 1]?.type === 'user'} className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500">
                <Volume2 className="h-4 w-4" />
                <span className="text-sm font-medium">Repeat Last</span>
              </button>
            </div>
            <form onSubmit={handleSendMessage} className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0 items-center w-full">
              <input type="text" value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} placeholder="Ask for emergency procedures or use voice input..." className="flex-1 w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" disabled={isLoading}/>
              <button type="submit" disabled={isLoading || !inputMessage.trim()} className="p-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-auto">
                <Send className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;