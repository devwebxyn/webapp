// Updated TryAIPage.tsx with fullscreen mode and improved AI output formatting
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { VscSend, VscSparkle, VscShield, VscBeaker, VscPerson, VscScreenFull } from 'react-icons/vsc';

// Define message type
type Message = {
  role: 'user' | 'ai';
  content: string;
};

// Initial welcome message
const initialMessages: Message[] = [
  {
    role: 'ai',
    content: 'Selamat datang di CloudNest AI. Silakan ajukan pertanyaan mengenai data Anda.',
  },
];

const quickCommands = [
  'Tampilkan 5 file terakhir',
  'Apakah ada file duplikat?',
  'Berapa sisa penyimpanan?',
];

export const TryAIPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;
    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: currentInput }),
      });
      if (!response.ok) throw new Error('Gagal mendapatkan respon dari server.');
      const data = await response.json();
      const aiMessage: Message = { role: 'ai', content: data.reply };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { role: 'ai', content: 'Maaf, terjadi kesalahan saat menghubungi AI.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 ${fullscreen ? 'fixed inset-0 z-50 bg-black overflow-auto' : ''}`}>
      <motion.div className="text-center" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="inline-block rounded-full bg-primary/10 p-3 relative">
          <VscSparkle className="h-6 w-6 text-primary" />
          <button
            onClick={() => setFullscreen(!fullscreen)}
            className="absolute right-0 top-0 p-1 text-xs text-neutral-400 hover:text-white"
          >
            <VscScreenFull />
          </button>
        </div>
        <h1 className="mt-4 font-monument text-4xl uppercase text-neutral-100">Coba AI Kami</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-300">
          Jelajahi kekuatan AI kami yang dirancang untuk memahami, membantu, dan menyelesaikan kebutuhan Anda.
        </p>
      </motion.div>

      <motion.div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
        {/* Chat Panel */}
        <div className="rounded-2xl bg-zinc-900/70 border border-white/10 p-6 shadow-xl lg:col-span-2">
          <div className="flex h-[60vh] flex-col">
            <div className="flex-1 space-y-6 overflow-y-auto p-2">
              {messages.map((message, index) => (
                <div key={index} className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {message.role === 'ai' && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
                      <VscSparkle className="h-4 w-4 text-background" />
                    </div>
                  )}
                  <div className={`prose prose-sm max-w-xl rounded-lg p-4 text-sm shadow ${message.role === 'ai'
                    ? 'rounded-bl-none bg-neutral-800 text-neutral-200'
                    : 'rounded-br-none bg-primary/20 text-primary-content'}`}
                    >
                    <div dangerouslySetInnerHTML={{ __html: message.content.replace(/\n/g, '<br/>') }} />
                  </div>
                  {message.role === 'user' && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary">
                      <VscPerson className="h-4 w-4 text-background" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start gap-3 justify-start">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
                    <VscSparkle className="h-4 w-4 text-background" />
                  </div>
                  <div className="max-w-xl rounded-lg p-3 text-sm rounded-bl-none bg-neutral-800 text-neutral-200 flex items-center gap-2">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-primary/50 delay-0"></span>
                    <span className="h-2 w-2 animate-pulse rounded-full bg-primary/50 delay-150"></span>
                    <span className="h-2 w-2 animate-pulse rounded-full bg-primary/50 delay-300"></span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="mt-6">
              <div className="flex flex-wrap gap-2 mb-2">
                {quickCommands.map((cmd) => (
                  <button
                    key={cmd}
                    onClick={() => setInput(cmd)}
                    className="rounded-full bg-white/10 px-3 py-1 text-xs text-neutral-300 transition-colors hover:bg-white/20"
                  >
                    {cmd}
                  </button>
                ))}
              </div>
              <div className="relative">
                <textarea
                  className="w-full resize-none rounded-lg border border-white/10 bg-white p-3 pr-12 text-sm text-black placeholder:text-neutral-500 focus:border-primary focus:ring-primary"
                  rows={2}
                  placeholder="Tanya apa saja..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                />
                <button
                  onClick={handleSend}
                  className="absolute bottom-2.5 right-2.5 rounded-md bg-primary p-1.5 text-background transition-colors hover:bg-primary/80 disabled:bg-neutral-600"
                  disabled={isLoading}
                >
                  <VscSend />
                </button>
              </div>
              <div className="mt-2 flex items-center justify-end">
                <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                  <VscShield />
                  <span>Semua pertanyaan dienkripsi</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6 rounded-2xl bg-zinc-900/70 border border-white/10 p-6 shadow-xl h-fit">
          <h3 className="flex items-center gap-2 font-bold text-white">
            <VscBeaker />
            <span>Contoh Prompt</span>
          </h3>
          <ul className="mt-2 list-disc list-inside space-y-1 text-sm text-neutral-400">
            <li>Buatkan ringkasan dari dokumen 'riset_pasar.pdf'.</li>
            <li>Apakah ada foto 'kucing' di folder 'Peliharaan'?</li>
            <li>Hapus semua file duplikat di seluruh akun saya.</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
};
