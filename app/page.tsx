'use client';

import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Circle,
  Send,
  Sparkles,
  CalendarDays,
  ListTodo,
  Clock,
} from 'lucide-react';

import { api } from './lib/api';

// Tauri API (if needed)
// import { invoke } from '@tauri-apps/api/core';

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const TODOS = [
  { id: 1, text: 'Optimize Gemma response latency', done: false, tag: 'perf' },
  { id: 2, text: 'Finalize design tokens', done: true, tag: 'design' },
  { id: 3, text: 'Sync activity graph with local db', done: false, tag: 'data' },
  { id: 4, text: 'Write onboarding copy', done: true, tag: 'content' },
  { id: 5, text: 'Set up CI/CD pipeline', done: false, tag: 'devops' },
  { id: 6, text: 'Review pull request #42', done: true, tag: 'review' },
];

const MESSAGES = [
  {
    role: 'assistant' as const,
    text: "Hi — I'm Fira, powered by Gemma. I can help you manage tasks, plan your day, or think through problems. What would you like to work on?",
  },
  {
    role: 'user' as const,
    text: "What's the status of the optimization task?",
  },
  {
    role: 'assistant' as const,
    text: 'The Gemma response latency task is still in progress. You also have one other pending item — syncing the activity graph. Would you like me to break either of those into smaller steps?',
  },
];

/* ------------------------------------------------------------------ */
/*  Graph helper                                                       */
/* ------------------------------------------------------------------ */

const LEVEL_COLORS = [
  'bg-white/[0.03]',              // 0 – empty
  'bg-violet-500/20',             // 1
  'bg-violet-500/45',             // 2
  'bg-violet-400',                // 3
];

function useGraphData() {
  const [data, setData] = useState<number[]>(new Array(7 * 20).fill(0));

  useEffect(() => {
    setData(Array.from({ length: 7 * 20 }, () => Math.floor(Math.random() * 4)));
  }, []);

  return data;
}

/* ------------------------------------------------------------------ */
/*  Tag colors                                                         */
/* ------------------------------------------------------------------ */

const TAG_COLORS: Record<string, string> = {
  perf:    'text-amber-400/70 bg-amber-400/[0.07]',
  design:  'text-violet-400/70 bg-violet-400/[0.07]',
  data:    'text-cyan-400/70 bg-cyan-400/[0.07]',
  content: 'text-emerald-400/70 bg-emerald-400/[0.07]',
  devops:  'text-orange-400/70 bg-orange-400/[0.07]',
  review:  'text-pink-400/70 bg-pink-400/[0.07]',
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function FiraInterface() {
  const [prompt, setPrompt] = useState('');
  const graph = useGraphData();

  const completedCount = TODOS.filter((t) => t.done).length;
  const totalCount = TODOS.length;
  const pendingCount = totalCount - completedCount;

  return (
    <main className="h-screen w-screen bg-[#0c0c0e] text-[#f0f0f2] font-sans flex overflow-hidden">





      {/* ═══════════════════════════════════════════════════════════
          CENTER – Main content area
         ═══════════════════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">




        <div className="flex-1 overflow-y-auto px-7 pb-8 no-scrollbar dot-grid">
          <div className="max-w-3xl space-y-5 pt-6">



            {/* ── Tasks card ──────────────────────────────────────── */}
            <div className="glass-card rounded-2xl overflow-hidden anim-fade-up" style={{ animationDelay: '0.05s' }}>
              <div className="flex items-center justify-between px-5 pt-4 pb-3">
                <div className="flex items-center gap-2">
                  <ListTodo className="w-3.5 h-3.5 text-violet-400/60" />
                  <h2 className="text-[11px] font-semibold text-white/30 uppercase tracking-[0.14em]">
                    Tasks
                  </h2>
                </div>
                <span className="text-[10px] font-medium text-white/20">
                  {completedCount}/{totalCount}
                </span>
              </div>

              {/* progress bar */}
              <div className="mx-5 mb-3">
                <div className="h-[3px] bg-white/[0.04] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${(completedCount / totalCount) * 100}%`,
                      background: 'linear-gradient(90deg, #8b5cf6, #a78bfa)',
                    }}
                  />
                </div>
              </div>

              <div className="px-3 pb-3 space-y-0.5">
                {TODOS.map((t, idx) => (
                  <div
                    key={t.id}
                    className={`task-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] cursor-pointer group anim-slide-in`}
                    style={{ animationDelay: `${idx * 0.04}s` }}
                  >
                    {t.done ? (
                      <CheckCircle2 className="w-[15px] h-[15px] text-violet-400/50 shrink-0" />
                    ) : (
                      <Circle className="w-[15px] h-[15px] text-white/15 group-hover:text-white/30 shrink-0 transition-colors" />
                    )}
                    <span className={`flex-1 ${t.done ? 'line-through text-white/20' : 'text-white/70 group-hover:text-white/90'} transition-colors`}>
                      {t.text}
                    </span>
                    <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-md ${TAG_COLORS[t.tag] || 'text-white/30 bg-white/[0.04]'}`}>
                      {t.tag}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Activity graph card ─────────────────────────────── */}
            <div className="glass-card rounded-2xl overflow-hidden anim-fade-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center justify-between px-5 pt-4 pb-3">
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-3.5 h-3.5 text-violet-400/60" />
                  <h2 className="text-[11px] font-semibold text-white/30 uppercase tracking-[0.14em]">
                    Activity
                  </h2>
                </div>
                <div className="flex items-center gap-1.5 text-[9px] text-white/20">
                  <span>Less</span>
                  {LEVEL_COLORS.map((c, i) => (
                    <div key={i} className={`w-[8px] h-[8px] rounded-[2px] ${c}`} />
                  ))}
                  <span>More</span>
                </div>
              </div>

              <div className="px-5 pb-5">
                <div className="flex flex-wrap gap-[3px]">
                  {graph.map((level, i) => (
                    <div key={i} className={`graph-cell ${LEVEL_COLORS[level]}`} />
                  ))}
                </div>
              </div>
            </div>



          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          RIGHT – Chat panel
         ═══════════════════════════════════════════════════════════ */}
      <div className="w-[380px] bg-[#101012] border-l border-white/[0.04] flex flex-col shrink-0">

        {/* ── Header ───────────────────────────────────────────── */}
        <div className="h-14 flex items-center justify-between px-5 shrink-0 border-b border-white/[0.04]">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center">
              <Sparkles className="w-2.5 h-2.5 text-white" />
            </div>
            <span className="text-[12px] font-semibold text-white/50 tracking-wide">
              Fira AI
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[9px] font-medium text-emerald-400/60 bg-emerald-400/[0.07] px-2 py-0.5 rounded-md flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/60" />
              Online
            </span>
          </div>
        </div>

        {/* ── Messages ──────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 no-scrollbar">
          <div className="space-y-4 pt-4">
            {MESSAGES.map((msg, i) => (
              <div
                key={i}
                className="anim-fade-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {/* sender label */}
                <div className="flex items-center gap-2 mb-2 px-1">
                  <div
                    className={`w-5 h-5 rounded-lg shrink-0 flex items-center justify-center text-[9px] font-bold ${
                      msg.role === 'user'
                        ? 'bg-white/[0.06] text-white/40'
                        : 'bg-gradient-to-br from-violet-500 to-violet-700 text-white'
                    }`}
                  >
                    {msg.role === 'user' ? 'U' : 'F'}
                  </div>
                  <span className="text-[10px] font-semibold text-white/30">
                    {msg.role === 'user' ? 'You' : 'Fira'}
                  </span>
                </div>
                {/* message body */}
                <div
                  className={`px-4 py-3 rounded-2xl text-[13px] leading-[1.75] ${
                    msg.role === 'assistant'
                      ? 'msg-assistant text-white/70'
                      : 'msg-user text-white/60'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Composer ──────────────────────────────────────────── */}
        <div className="px-4 pb-4 pt-2 shrink-0">
          <div className="flex flex-col bg-white/[0.03] rounded-2xl border border-white/[0.06] p-3 composer-ring">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask Fira anything…"
              rows={2}
              className="w-full bg-transparent text-[13px] text-white/80 placeholder-white/20 outline-none resize-none leading-relaxed"
              autoFocus
            />

            <div className="flex items-center justify-between pt-2 mt-1 border-t border-white/[0.04]">
              <div className="flex gap-1">
                <kbd className="text-[9px] font-medium text-white/20 bg-white/[0.04] border border-white/[0.06] px-1.5 py-0.5 rounded-md">
                  ⌘
                </kbd>
                <kbd className="text-[9px] font-medium text-white/20 bg-white/[0.04] border border-white/[0.06] px-1.5 py-0.5 rounded-md">
                  ↵
                </kbd>
              </div>
              <button className="w-7 h-7 rounded-xl bg-gradient-to-br from-violet-500 to-violet-700 hover:from-violet-400 hover:to-violet-600 transition-all duration-200 flex items-center justify-center text-white shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 hover:scale-105 active:scale-95">
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}



/* ------------------------------------------------------------------ */
/*  Nav icon sub-component                                             */
/* ------------------------------------------------------------------ */


