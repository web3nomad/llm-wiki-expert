'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  gaps?: { topic: string; description: string }[];
}

export default function ChatPage() {
  const params = useParams();
  const expertId = params.id as string;
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showGaps, setShowGaps] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setLoading(true);

    // Add user message immediately
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expertId, message: userMessage }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: data.response,
          gaps: data.gaps
        }]);
      } else {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: 'Sorry, I encountered an error. Please try again.' 
        }]);
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const allGaps = messages.filter(m => m.gaps && m.gaps.length > 0).flatMap(m => m.gaps!);

  return (
    <div className="animate-fade-in h-[calc(100vh-140px)] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link 
            href={`/expert/${expertId}`}
            className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          >
            ← Back to profile
          </Link>
          <h1 className="text-xl font-semibold">Chat</h1>
        </div>
        {allGaps.length > 0 && (
          <button
            onClick={() => setShowGaps(!showGaps)}
            className="badge badge-warning cursor-pointer"
          >
            🔍 {allGaps.length} gap{allGaps.length > 1 ? 's' : ''} detected
          </button>
        )}
      </div>

      {showGaps && allGaps.length > 0 && (
        <div className="mb-4 p-4 bg-[var(--card)] border border-yellow-600/30 rounded-lg">
          <h3 className="font-medium mb-2">📝 Detected Knowledge Gaps</h3>
          <div className="space-y-2">
            {allGaps.map((gap, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <span className="text-yellow-500">•</span>
                <div>
                  <span className="font-medium">{gap.topic}</span>
                  <span className="text-[var(--muted-foreground)]"> - {gap.description}</span>
                </div>
              </div>
            ))}
          </div>
          <Link href={`/expert/${expertId}/knowledge`} className="text-sm text-[var(--primary)] mt-2 inline-block">
            View knowledge base →
          </Link>
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 bg-[var(--secondary)] rounded-lg">
        {messages.length === 0 ? (
          <div className="text-center py-12 text-[var(--muted-foreground)]">
            <div className="text-4xl mb-4">💬</div>
            <p>Start a conversation with the expert</p>
            <p className="text-sm mt-2">Try asking about their expertise!</p>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-[var(--primary)] text-white'
                    : 'bg-[var(--card)]'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
                {msg.gaps && msg.gaps.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-[var(--border)] text-xs">
                    <span className="text-yellow-500">Gap detected</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-[var(--card)] p-4 rounded-lg">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-[var(--muted-foreground)] rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 bg-[var(--muted-foreground)] rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 bg-[var(--muted-foreground)] rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="text"
          className="input flex-1"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading || !input.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
}
