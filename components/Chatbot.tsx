// 'use client';

// import React, { useState, useRef, useEffect } from 'react';
// import { GoogleGenAI } from '@google/genai';
// import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
// import ReactMarkdown from 'react-markdown';

// interface Message {
//   id: string;
//   role: 'user' | 'model';
//   text: string;
// }

// export default function Chatbot() {
//   const [messages, setMessages] = useState<Message[]>([
//     {
//       id: '1',
//       role: 'model',
//       text: 'Halo! Saya asisten AI Anda. Ada yang bisa saya bantu terkait penilaian ujian atau hal lainnya?',
//     },
//   ]);
//   const [input, setInput] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const handleSend = async () => {
//     if (!input.trim()) return;

//     const userMessage: Message = {
//       id: Date.now().toString(),
//       role: 'user',
//       text: input,
//     };

//     setMessages((prev) => [...prev, userMessage]);
//     setInput('');
//     setIsLoading(true);

//     try {
//       const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || '' });
//       const chat = ai.chats.create({
//         model: 'gemini-3.1-pro-preview',
//         config: {
//           systemInstruction: 'Anda adalah asisten cerdas untuk aplikasi penilaian ujian sekolah. Berikan jawaban yang ringkas, profesional, dan membantu.',
//         },
//       });

//       // We need to send previous history if we want a real chat, but for simplicity we can just send the current message.
//       // To make it a real chat, we should ideally use the chat object and keep it in state, or reconstruct history.
//       // Let's just use generateContent with history for simplicity if we don't keep the chat object.
//       // Actually, the SDK supports `chat.sendMessageStream`. Let's use `generateContent` with history for statelessness, or just `sendMessage` on a new chat instance with history.
      
//       // Reconstructing history for generateContent:
//       const history = messages.map(m => ({
//         role: m.role,
//         parts: [{ text: m.text }]
//       }));
      
//       // Add current user message
//       history.push({
//         role: 'user',
//         parts: [{ text: userMessage.text }]
//       });

//       const response = await ai.models.generateContent({
//         model: 'gemini-3.1-pro-preview',
//         contents: history,
//         config: {
//           systemInstruction: 'Anda adalah asisten cerdas untuk aplikasi penilaian ujian sekolah. Berikan jawaban yang ringkas, profesional, dan membantu.',
//         }
//       });

//       const modelMessage: Message = {
//         id: (Date.now() + 1).toString(),
//         role: 'model',
//         text: response.text || 'Maaf, saya tidak dapat memproses permintaan Anda.',
//       };

//       setMessages((prev) => [...prev, modelMessage]);
//     } catch (error) {
//       console.error('Chat error:', error);
//       const errorMessage: Message = {
//         id: (Date.now() + 1).toString(),
//         role: 'model',
//         text: 'Terjadi kesalahan saat menghubungi AI. Pastikan API key Anda valid.',
//       };
//       setMessages((prev) => [...prev, errorMessage]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleKeyDown = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSend();
//     }
//   };

//   return (
//     <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
//       <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center space-x-3">
//         <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
//           <Sparkles className="w-5 h-5" />
//         </div>
//         <div>
//           <h2 className="text-lg font-bold text-slate-800">AI Assistant</h2>
//           <p className="text-xs text-slate-500">Powered by Gemini 3.1 Pro</p>
//         </div>
//       </div>

//       <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50/50">
//         {messages.map((msg) => (
//           <div
//             key={msg.id}
//             className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
//           >
//             <div className={`flex max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
//               <div
//                 className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
//                   msg.role === 'user' ? 'bg-indigo-600 text-white ml-3' : 'bg-emerald-500 text-white mr-3'
//                 }`}
//               >
//                 {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
//               </div>
//               <div
//                 className={`px-4 py-3 rounded-2xl ${
//                   msg.role === 'user'
//                     ? 'bg-indigo-600 text-white rounded-tr-none'
//                     : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-sm'
//                 }`}
//               >
//                 {msg.role === 'user' ? (
//                   <p className="whitespace-pre-wrap text-sm">{msg.text}</p>
//                 ) : (
//                   <div className="prose prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-slate-800 prose-pre:text-slate-100">
//                     <ReactMarkdown>{msg.text}</ReactMarkdown>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         ))}
//         {isLoading && (
//           <div className="flex justify-start">
//             <div className="flex max-w-[80%] flex-row">
//               <div className="flex-shrink-0 h-8 w-8 rounded-full bg-emerald-500 text-white mr-3 flex items-center justify-center">
//                 <Bot className="w-5 h-5" />
//               </div>
//               <div className="px-4 py-3 rounded-2xl bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-sm flex items-center space-x-2">
//                 <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
//                 <span className="text-sm text-slate-500">AI sedang mengetik...</span>
//               </div>
//             </div>
//           </div>
//         )}
//         <div ref={messagesEndRef} />
//       </div>

//       <div className="p-4 bg-white border-t border-slate-200">
//         <div className="relative flex items-end space-x-2">
//           <textarea
//             className="w-full bg-slate-100 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-xl px-4 py-3 text-sm resize-none max-h-32 min-h-[52px]"
//             placeholder="Tanyakan sesuatu..."
//             rows={1}
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyDown={handleKeyDown}
//           />
//           <button
//             onClick={handleSend}
//             disabled={!input.trim() || isLoading}
//             className="flex-shrink-0 bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
//           >
//             <Send className="w-5 h-5" />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


'use client';

import React, { useEffect, useState } from 'react';

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  function handleOpen() {
    setOpen(true);
    setShowToast(true);
  }

  useEffect(() => {
    if (!showToast) return;
    const t = setTimeout(() => setShowToast(false), 2500);
    return () => clearTimeout(t);
  }, [showToast]);

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Chatbot</h2>
      <p className="text-sm text-gray-600 mb-4">
        Chatbot untuk bantuan & FAQ (sementara placeholder).
      </p>

      <div className="flex gap-3">
        <button
          onClick={handleOpen}
          className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition"
        >
          Buka Chatbot
        </button>

        <button
          onClick={() => setShowToast(true)}
          className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50 transition"
        >
          Info
        </button>
      </div>

      {/* Modal */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <div className="relative w-full max-w-md bg-white rounded-lg p-6 shadow-lg z-10">
            <h3 className="text-xl font-semibold mb-2">Fitur Belum Tersedia</h3>
            <p className="text-gray-600 mb-4">
              Fitur Chatbot belum aktif. Nantikan update selanjutnya.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {showToast && (
        <div className="fixed right-4 bottom-4 z-50">
          <div className="bg-black/90 text-white px-4 py-2 rounded shadow">
            Fitur ini belum tersedia
          </div>
        </div>
      )}
    </div>
  );
}
