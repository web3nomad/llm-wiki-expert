# From URL: https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f

# LLM Wiki - Personal Knowledge Base Pattern

> A pattern for building personal knowledge bases using LLMs, created by Andrej Karpathy (April 2026)

## Overview

The **LLM Wiki** pattern is a methodology for creating and maintaining a persistent, compounding knowledge base using Large Language Models. Instead of the traditional RAG (Retrieval-Augmented Generation) approach where the LLM rediscovers knowledge from scratch on every query, this pattern has the LLM incrementally build and maintain a structured wiki that sits between the user and raw source documents.

---

## Core Concept

### The Problem with Traditional RAG

- Upload a collection of files → LLM retrieves relevant chunks at query time → generates answer
- **No accumulation** — the LLM must find and piece together relevant fragments every time
- Subtle questions requiring synthesis across five documents are difficult
- Nothing is built up over time

### The Wiki Solution

Instead of just retrieving from raw documents at query time, the LLM:

1. **Incrementally builds** a persistent wiki — a structured, interlinked collection of markdown files
2. **Reads new sources** and extracts key information
3. **Integrates** new information into the existing wiki:
   - Updates entity pages
   - Revises topic summaries
   - Notes contradictions between old and new claims
   - Strengthens or challenges the evolving synthesis
4. **Compiles once, keeps current** — knowledge is not re-derived on every query

### Key Difference

| Traditional RAG | LLM Wiki |
|-----------------|----------|
| Re-derives knowledge on every query | Knowledge compiled once, kept current |
| No persistence between sessions | Persistent, compounding artifact |
| Cross-references created per-query | Cross-references already exist |
| Contradictions flagged per-query | Contradictions already flagged |

---

## Practical Setup

```
┌─────────────────────┐      ┌─────────────────────┐
│   LLM Agent         │      │   Obsidian          │
│   (Programmer)      │ ←──→ │   (IDE)             │
│                     │      │                     │
│ - Summarizes        │      │ - Browse results    │
│ - Cross-references  |      │ - Follow links      |
│ - Files and books  |      │ - Graph view        │
└─────────────────────┘      └─────────────────────┘
```

- **Obsidian** = IDE (Integrated Development Environment)
- **LLM** = Programmer
- **Wiki** = Codebase

---

## Use Cases

### Personal
- Tracking goals, health, psychology, self-improvement
- Filing journal entries, articles, podcast notes
- Building a structured picture of yourself over time

### Research
- Going deep on a topic over weeks or months
- Reading papers, articles, reports
- Incrementally building a comprehensive wiki with an evolving thesis

### Reading a Book
- Filing each chapter as you go
- Building pages for characters, themes, plot threads
- Connecting everything by the end
- Result: A rich companion wiki (like Tolkien Gateway, but personal)

### Business/Team
- Internal wiki maintained by LLMs
- Fed by Slack threads, meeting transcripts, project documents, customer calls
- Humans in the loop reviewing updates
- **Use cases:** Competitive analysis, due diligence, trip planning, course notes, hobby deep-dives

---

## Architecture

### Three Layers

```
┌────────────────────────────────────────────────────────────┐
│                    SCHEMA (CLAUDE.md / AGENTS.md)          │
│  Tells the LLM how the wiki is structured, conventions,    │
│  and workflows for ingesting sources, answering questions, │
│  and maintaining the wiki                                  │
├────────────────────────────────────────────────────────────┤
│                         WIKI                               │
│  Directory of LLM-generated markdown files:                │
│  - Summaries                                               │
│  - Entity pages                                            │
│  - Concept pages                                           │
│  - Comparisons                                             │
│  - Overview, synthesis                                      │
│  LLM owns this layer entirely (reads; writes)              │
├────────────────────────────────────────────────────────────┤
│                      RAW SOURCES                            │
│  Curated collection of source documents:                   │
│  - Articles, papers, images, data files                    │
│  Immutable — LLM reads but never modifies                  │
│  This is the source of truth                                │
└────────────────────────────────────────────────────────────┘
```

### The Schema Layer

- A configuration document (e.g., `CLAUDE.md` for Claude Code, `AGENTS.md` for Codex)
- Defines:
  - Wiki structure
  - Conventions
  - Workflows for ingesting sources
  - Workflows for answering questions
  - Workflows for maintaining the wiki
- **Co-evolved** by user and LLM over time

---

## Operations

### 1. Ingest

**Process:** Add a new source → LLM processes it

**Example flow:**
1. Drop a new source into the raw collection
2. Tell the LLM to process it
3. LLM reads the source
4. LLM discusses key takeaways with you
5. LLM writes a summary page in the wiki
6. LLM updates the index
7. LLM updates relevant entity and concept pages across the wiki
8. LLM appends an entry to the log

**Scope:** A single source might touch 10-15 wiki pages

**Workflow options:**
- **Preferred approach:** Ingest sources one at a time, stay involved
  - Read summaries, check updates, guide LLM on emphasis
- **Alternative:** Batch-ingest many sources with less supervision

### 2. Query

**Process:** Ask questions against the wiki

**Flow:**
1. LLM searches for relevant pages
2. LLM reads them
3. LLM synthesizes an answer with citations

**Answer formats:**
- Markdown page
- Comparison table
- Slide deck (Marp)
- Chart (matplotlib)
- Canvas

**Key insight:** Good answers should be filed back into the wiki as new pages:
- A comparison you asked for
- An analysis
- A connection you discovered

→ **Explorations compound in the knowledge base just like ingested sources**

### 3. Lint

**Process:** Periodically health-check the wiki

**Checks to run:**
- Contradictions between pages
- Stale claims superseded by newer sources
- Orphan pages with no inbound links
- Important concepts mentioned but lacking their own page
- Missing cross-references
- Data gaps that could be filled with a web search

---

## Summary

| Aspect | Description |
|--------|-------------|
| **Philosophy** | Persistent, compounding wiki vs. per-query retrieval |
| **User role** | Sourcing, exploration, asking questions |
| **LLM role** | Summarizing, cross-referencing, filing, bookkeeping |
| **Key file** | Schema (CLAUDE.md/AGENTS.md) — the "constitution" of the wiki |
| **Workflow** | Ingest → Query → Lint (repeat) |
| **Goal** | A wiki that gets richer with every source and every question |

---

## Related Concepts

- [RAG (Retrieval-Augmented Generation)](../rag-overview.md)
- [Obsidian](../tools/obsidian.md)
- [AI Agents](../ai-agents.md)
- [Personal Knowledge Management](../pkm-overview.md)