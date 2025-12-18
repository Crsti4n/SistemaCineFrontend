
import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import api from '../api/axios'; // Import the configured axios instance

type Message = {
  sender: 'user' | 'bot';
  text: string;
  timestamp?: string; // Add timestamp for history
};

export const CineChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [hasLoadedHistory, setHasLoadedHistory] = useState<boolean>(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Effect to load chat history
  useEffect(() => {
    const fetchHistory = async () => {
      if (isOpen && !hasLoadedHistory) {
        setIsTyping(true);
        try {
          const { data: history } = await api.get<Message[]>('/api/chat/history');
          if (history.length > 0) {
            setMessages(history);
          } else {
            // If no history, provide the initial welcome message
            setMessages([{ sender: 'bot', text: '¡Hola! Soy el asistente de CineUNAS 🍿. ¿Buscas horarios o precios?' }]);
          }
          setHasLoadedHistory(true);
        } catch (error) {
          console.error('Failed to fetch chat history:', error);
          // Show a local error message if history fails to load
          setMessages([{ sender: 'bot', text: 'Lo siento, no pude cargar el historial. Por favor, intenta de nuevo más tarde.' }]);
        } finally {
          setIsTyping(false);
        }
      }
    };

    fetchHistory();
  }, [isOpen, hasLoadedHistory]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: Message = { sender: 'user', text: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const { data } = await api.post<{ response: string }>('/api/chat', {
        message: inputValue,
      });

      const botResponse: Message = { sender: 'bot', text: data.response };
      setMessages(prev => [...prev, botResponse]);

    } catch (error) {
      console.error('Failed to send message:', error);
      const errorResponse: Message = { sender: 'bot', text: 'Lo siento, ocurrió un error al contactar a mi sistema. Por favor, intenta de nuevo.' };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="w-80 h-[28rem] bg-[#1a1a1a] rounded-lg shadow-2xl flex flex-col transition-all duration-300 ease-in-out">
          {/* Header */}
          <div className="flex justify-between items-center p-4 bg-gray-900 rounded-t-lg">
            <h3 className="font-bold text-white">Asistente CineUNAS</h3>
            <button onClick={toggleChat} className="text-gray-400 hover:text-white">
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="flex flex-col gap-3">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`max-w-[85%] p-3 rounded-lg ${
                    msg.sender === 'bot'
                      ? 'bg-gray-700 self-start'
                      : 'bg-blue-600 self-end'
                  }`}
                >
                  <p className="text-white text-sm">{msg.text}</p>
                </div>
              ))}
              {isTyping && (
                <div className="bg-gray-700 self-start p-3 rounded-lg">
                  <div className="flex items-center gap-1">
                      <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-0"></span>
                      <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                      <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-300"></span>
                  </div>
                </div>
              )}
               <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input */}
          <div className="p-2 border-t border-gray-700">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Escribe tu consulta..."
                className="flex-1 bg-gray-700 text-white placeholder-gray-400 px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoComplete="off"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50"
                disabled={!inputValue.trim() || isTyping}
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={toggleChat}
        className="bg-red-600 text-white p-4 rounded-full shadow-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-red-500 transition-all duration-200 ease-in-out transform hover:scale-110 mt-4 ml-auto block"
        aria-label={isOpen ? 'Cerrar chat' : 'Abrir chat'}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
};
