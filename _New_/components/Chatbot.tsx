import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sprout, Loader, Image as ImageIcon, Trash2, Zap } from 'lucide-react';
import { ChatMessage } from '../types';
import { getBotanistChat } from '../services/geminiService';
import { GenerateContentResponse } from "@google/genai";

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "System Online. I am your Eco-Botanist. Upload a plant photo for diagnosis or ask me about environmental data.",
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  
  // Image State: Store both data and mime type
  const [selectedImage, setSelectedImage] = useState<{data: string, mime: string} | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        // Robust mime type detection from the data URL
        const mime = result.match(/data:([^;]+);/)?.[1] || 'image/jpeg';
        setSelectedImage({ data: result, mime });
      };
      reader.readAsDataURL(file);
    }
    // Reset input to allow re-selecting same file
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const clearImage = () => {
    setSelectedImage(null);
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || isTyping) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    // Optimistically add user message
    const displayMsg = { ...userMsg };
    if (selectedImage) {
        displayMsg.text = input ? `${input} [Image Uploaded]` : "[Image Analysis Request]";
    }
    setMessages(prev => [...prev, displayMsg]);
    
    const currentImage = selectedImage; 
    setInput('');
    setSelectedImage(null);
    setIsTyping(true);

    try {
      const chat = getBotanistChat();
      
      let response: GenerateContentResponse;
      
      if (currentImage) {
          // Prepare parts for multimodal request
          const base64Data = currentImage.data.split(',')[1];
          const parts: any[] = [];
          
          if (input.trim()) {
            parts.push({ text: input });
          }
          
          parts.push({ 
            inlineData: { 
              mimeType: currentImage.mime, 
              data: base64Data 
            } 
          });
          
          // Strict payload format for SDK to avoid "ContentUnion is required"
          // We pass the parts array wrapped in the message property
          response = await chat.sendMessage({ message: parts });
      } else {
          // Text only
          response = await chat.sendMessage({ message: userMsg.text });
      }

      const responseText = response.text || "I'm detecting some interference. Please try asking again.";

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (error: any) {
      console.error("Chat error details:", error);
      let errorMessage = "Connection to Neural Net lost. Please verify your API Key.";
      
      if (error.message?.includes("400")) errorMessage = "I couldn't process that image. Please try a standard JPEG or PNG.";
      
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: errorMessage,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center border-2 border-white/20 backdrop-blur-sm group ${
          isOpen ? 'bg-red-500 rotate-90' : 'bg-black/80 hover:bg-black text-emerald-400'
        }`}
      >
        {isOpen ? <X className="text-white" size={24} /> : (
            <div className="relative">
                <div className="absolute inset-0 bg-emerald-500 blur-lg opacity-40 animate-pulse"></div>
                <Zap className="relative z-10" size={28} />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-black"></div>
            </div>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-full max-w-sm md:w-96 bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 flex flex-col overflow-hidden animate-slide-up h-[600px] ring-1 ring-emerald-500/30">
          {/* Header */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-4 flex items-center gap-3 border-b border-white/5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-transparent"></div>
            <div className="p-2 bg-emerald-500/10 rounded-full border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
               <Sprout className="text-emerald-400" size={20} />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg leading-none tracking-wide flex items-center gap-2">
                  ArborBot <span className="text-[10px] bg-emerald-500 text-black px-1.5 py-0.5 rounded font-bold uppercase">Beta</span>
              </h3>
              <span className="text-gray-400 text-xs font-medium">Neural Plant Diagnostic</span>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/20">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-lg backdrop-blur-sm ${
                    msg.role === 'user'
                      ? 'bg-emerald-600/90 text-white rounded-tr-none border border-emerald-500/50'
                      : 'bg-gray-800/90 text-gray-100 border border-white/10 rounded-tl-none'
                  }`}
                >
                  {/* Basic markdown-like rendering */}
                  {msg.text.split('\n').map((line, i) => (
                    <p key={i} className={line.startsWith('-') ? 'ml-2' : 'mb-1'}>
                        {line}
                    </p>
                  ))}
                  <div className={`text-[10px] mt-1 text-right ${msg.role === 'user' ? 'text-emerald-200' : 'text-gray-500'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-800 border border-white/10 p-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-gray-900 border-t border-white/10">
            {selectedImage && (
                <div className="mb-2 flex items-center gap-2 bg-gray-800 p-2 rounded-lg border border-white/10">
                    <img src={selectedImage.data} alt="Preview" className="w-10 h-10 object-cover rounded-md border border-white/20" />
                    <span className="text-xs text-emerald-400 flex-1 truncate font-medium">Image Ready</span>
                    <button onClick={clearImage} className="p-1 hover:bg-gray-700 rounded-full text-gray-400 hover:text-red-400 transition-colors">
                        <Trash2 size={14} />
                    </button>
                </div>
            )}
            
            <div className="relative flex items-center gap-2">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-3 text-emerald-400 hover:text-white hover:bg-emerald-500/20 rounded-xl transition-all border border-transparent hover:border-emerald-500/30"
                title="Upload image"
              >
                <ImageIcon size={20} />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleImageSelect}
              />
              
              {/* Ensure text is black for visibility against white/light backgrounds in any mode */}
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type query..."
                className="flex-1 py-3 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:bg-white text-black placeholder-gray-500 text-sm transition-all"
              />
              
              <button
                onClick={handleSend}
                disabled={(!input.trim() && !selectedImage) || isTyping}
                className="p-3 bg-emerald-500 text-black font-bold rounded-xl hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] disabled:opacity-50 disabled:shadow-none transition-all transform hover:scale-105 active:scale-95"
              >
                {isTyping ? <Loader className="animate-spin" size={18} /> : <Send size={18} />}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;