# I Built Karpathy's LLM Wiki Idea — And Open Sourced It

A few weeks ago, Andrej Karpathy shared a fascinating idea: what if LLMs had their own continuously-updating knowledge bases, instead of relying on RAG?

The core insight: instead of "search-then-read" (RAG), let the LLM continuously update a structured wiki. Each piece of content gets processed into both a source file and an extract. Then, the LLM incrementally updates concept files — definitions, entities, sources, comparisons — by merging new knowledge rather than replacing it.

I decided to build it. Here's what I learned.

## The Architecture

```
/data/[expert-id]/
├── sources/
│   ├── 2026-04-05-xxx/
│   │   ├── source.md    # Original content
│   │   └── extract.md   # LLM-generated summary
├── concepts/
│   ├── definitions.md   # AI-maintained definitions
│   ├── entities.md      # Named entities, people, topics
│   ├── sources.md       # Source references
│   └── comparisons.md   # Comparisons, contrasts
├── gaps.md              # Knowledge gaps (auto-detected)
└── conversation.md      # Chat history
```

## Key Functions

**addSource()** — Creates source.md + extract.md
- Saves original content with timestamp
- Calls LLM to generate structured extract (summary, key points, entities)
- Triggers concept update

**updateConcepts()** — Incremental merge (not replace!)
- Reads ALL existing extracts
- Reads current concept files
- Calls LLM to merge new knowledge into each concept
- This is the magic: knowledge compounds over time

**generateResponse()** — Context-aware answers
- Reads relevant concepts/sources
- Generates response using wiki context
- Detects gaps: if LLM mentions missing info, logs it

**autoFillGap()** — Self-improving system
- Takes a detected gap
- Calls LLM to generate knowledge about it
- Adds as new source
- Updates concepts

## Why This Matters

RAG has fundamental limitations:
- Chunking loses context
- Embeddings miss semantic nuance
- No memory of what the model doesn't know

This wiki approach:
- Compounds knowledge over time
- Self-identifies gaps
- Generates context from first principles

## Try It

Open source: github.com/web3nomad/llm-wiki-expert

It's a Next.js app. Set ANTHROPIC_API_KEY, add some sources, and chat with your expert.

This is just the beginning. A small experiment. Would love to hear thoughts, feedback, and see what others build.

@karpathy

---

*Building in public. More to come.*
