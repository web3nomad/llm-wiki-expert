# 🧠 LLM Wiki Expert

> Build AI experts backed by evolving wiki knowledge bases — not static RAG.

Inspired by [Karpathy's LLM Wiki idea](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f). Instead of retrieval-augmented generation that re-derives knowledge from scratch every query, this system lets LLMs continuously **build and maintain a structured wiki** between you and your sources.

## Why this is different from RAG

| RAG | LLM Wiki Expert |
|-----|----------------|
| Re-derives knowledge per query | Compiles knowledge once, keeps it current |
| Vector DB black box | Human-readable markdown files |
| Locked in provider systems | Your files, your machine |
| Any AI, same result | Wiki grows smarter over time |

## Karpathy's 4 Principles (implemented here)

1. **Explicit** — knowledge is visible, navigable, inspectable
2. **Yours** — data stays local, not in any AI provider's system
3. **File over app** — markdown files work with Obsidian, Cursor, Claude, anything
4. **BYOAI** — plug in any OpenAI-compatible model

## Features

- 📥 **Ingest anything** — paste text, import URLs, drop AI conversations
- 🔗 **URL import** — fetch any page, LLM extracts knowledge automatically
- 💬 **Conversation import** — compile AI chats into permanent wiki knowledge
- 🕸️ **Knowledge graph** — visual map of concepts and connections
- 📤 **Obsidian export** — markdown with frontmatter + `[[wiki links]]`
- 🔍 **Gap detection** — LLM identifies what the expert doesn't know yet
- 🤖 **Chat with your expert** — answers grounded in wiki, not hallucination

## Quick start

```bash
git clone https://github.com/web3nomad/llm-wiki-expert
cd llm-wiki-expert
cp .env.example .env.local
# add your LLM_API_KEY (any OpenAI-compatible endpoint)
npm install && npm run dev
```

Open http://localhost:3000, create an expert, start ingesting.

## Architecture

```
sources/           ← raw inputs (text, URLs, conversations)
  YYYY-MM-DD-*/
    source.md      ← original content
    extract.md     ← LLM-generated structured extract

concepts/          ← LLM-maintained wiki
  definitions.md   ← concepts, terms, frameworks
  entities.md      ← people, projects, tools
  sources.md       ← source index
  comparisons.md   ← how things relate to each other

gaps.md            ← knowledge gaps detected during chat
```

The LLM **incrementally updates** concepts — no overwriting, always compounding.

## Ingestion strategies

For long documents, two strategies auto-selected:
- **Recursive summary tree** — structured docs: section summaries → meta-summary (h/t [@antilukalister](https://x.com/antilukalister))
- **Chunking with overlap** — dense text: parallel extraction + merge pass

## Tech stack

- Next.js 16 (App Router)
- Any OpenAI-compatible LLM (default: minimax-m2.5 via ppio.com)
- Zero vector DB — pure markdown on filesystem

## Building in public

Follow the build: [@web3nomad](https://x.com/web3nomad)

---

*"agent proficiency is a CORE SKILL of the 21st century" — Karpathy*
