import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { VscSend, VscSparkle, VscShield, VscBeaker, VscPerson, VscScreenFull, VscChromeClose } from 'react-icons/vsc';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';

type Message = {
  id: number;
  role: 'user' | 'assistant';
  content: string;
};

const initialMessages: Message[] = [
  { id: 1, role: 'assistant', content: 'Selamat datang! Saya ditenagai oleh Groq (LLaMA-3). Ajukan pertanyaan apa saja.' }
];

const quickCommands = [
  'Tampilkan 5 file terakhir',
  'Apakah ada file duplikat?',
  'Berapa sisa penyimpanan?'
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
    const currentInput = input.trim();
    if (currentInput === '' || isLoading) return;

    const userMessage: Message = { id: Date.now(), role: 'user', content: currentInput };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    let aiResponseContent = '';
    const aiMessageId = Date.now() + 1;
    setMessages(prev => [...prev, { id: aiMessageId, role: 'assistant', content: '' }]);

    try {
      // --- PERBAIKAN DI SINI: Hapus 'model' dari body permintaan ---
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: currentInput }) // Hanya kirim prompt
      });

      if (!response.ok || !response.body) {
        const errorData = await response.json().catch(() => ({
          error: 'Gagal mendapatkan respon dari server.'
        }));
        throw new Error(errorData.error);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });

        aiResponseContent += chunk;
        setMessages(prev =>
          prev.map(msg =>
            msg.id === aiMessageId
              ? { ...msg, content: aiResponseContent }
              : msg
          )
        );
      }
    } catch (error: any) {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === aiMessageId
            ? { ...msg, content: `**Maaf, terjadi kesalahan:** ${error.message}` }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 transition-all duration-300 ${
        fullscreen ? 'fixed inset-0 z-[200] bg-black overflow-y-auto' : ''
      }`}
    >
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="inline-block rounded-full bg-primary/10 p-3">
          <VscSparkle className="h-6 w-6 text-primary" />
        </div>
        <h1 className="mt-4 font-monument text-4xl uppercase text-neutral-100">Coba AI Kami</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-300">
          Jelajahi kekuatan AI kami yang ditenagai oleh Groq untuk kecepatan superior.
        </p>
        <button
          onClick={() => setFullscreen(!fullscreen)}
          className="mt-4 text-xs text-neutral-400 hover:text-white flex items-center gap-2 mx-auto"
        >
          {fullscreen ? <VscChromeClose /> : <VscScreenFull />}
          {fullscreen ? 'Keluar Layar Penuh' : 'Layar Penuh'}
        </button>
      </motion.div>

      <motion.div
        className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div
          className={`rounded-2xl bg-zinc-900/70 border border-white/10 p-6 shadow-xl lg:col-span-2 ${
            fullscreen ? 'lg:col-span-3' : ''
          }`}
        >
          <div className="flex h-[60vh] flex-col">
            <div className="flex-1 space-y-6 overflow-y-auto p-2 pr-4">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex items-start gap-3 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
                      <VscSparkle className="h-4 w-4 text-background" />
                    </div>
                  )}
                  <div
                    className={`prose prose-invert prose-sm max-w-2xl rounded-lg p-3 shadow ${
                      message.role === 'assistant'
                        ? 'rounded-bl-none bg-neutral-800'
                        : 'rounded-br-none bg-primary/20'
                    }`}
                  >
                    <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                      {message.content || ' '}
                    </ReactMarkdown>
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
                    <span className="h-2 w-2 animate-pulse rounded-full bg-primary/50"></span>
                    <span
                      className="h-2 w-2 animate-pulse rounded-full bg-primary/50"
                      style={{ animationDelay: '0.1s' }}
                    ></span>
                    <span
                      className="h-2 w-2 animate-pulse rounded-full bg-primary/50"
                      style={{ animationDelay: '0.2s' }}
                    ></span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="mt-6">
              <div className="flex flex-wrap gap-2 mb-2">
                {quickCommands.map(cmd => (
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
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading}
                  className="absolute bottom-2.5 right-2.5 rounded-md bg-primary p-1.5 text-background transition-colors hover:bg-primary/80 disabled:bg-neutral-600"
                >
                  <VscSend />
                </button>
              </div>
              <div className="mt-2 flex items-center justify-end">
                <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                  <VscShield /> <span>Semua pertanyaan dienkripsi</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`space-y-6 rounded-2xl bg-zinc-900/70 border border-white/10 p-6 shadow-xl h-fit ${
            fullscreen ? 'lg:hidden' : ''
          }`}
        >
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