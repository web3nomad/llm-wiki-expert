# Definitions

This expert's knowledge definitions.

## Core Concepts

### Wiki-Style Knowledge Base
A personal knowledge management approach that uses LLMs to continuously update and maintain a searchable collection of markdown files. Unlike traditional RAG (Retrieval-Augmented Generation) systems that rely on vector databases and chunking, wiki-style knowledge bases store information in human-readable markdown files that can be directly edited, navigated, and versioned. This approach was championed by Andrej Karpathy as an alternative to conventional RAG implementations.

### LLM Wiki
A methodology for building persistent, compounding knowledge bases using LLMs, where instead of traditional RAG that rediscovers knowledge from scratch on every query, the LLM incrementally builds and maintains a structured wiki between the user and raw source documents. The key difference is that RAG re-derives knowledge per-query while LLM Wiki persists and compounds knowledge between sessions, compiling knowledge once and keeping it current.

### Idea File Concept
A paradigm shift in the LLM agent era where sharing markdown files instead of code or applications becomes more valuable. The wiki-style knowledge base embodies this philosophy—knowledge stored as plain markdown files is portable, Git-trackable, and usable across different tools like Obsidian or Cursor, making it inherently more shareable and interoperable than proprietary application data.

### RAG (Retrieval-Augmented Generation)
A technique where AI systems retrieve relevant documents from a database to provide context for generating responses. While popular, Karpathy argues it can be replaced with continuous wiki-style knowledge bases that maintain data in a more accessible, permanent format. A limitation of traditional RAG is that it has no accumulation—the LLM must find and piece together fragments every query rather than building on previously compiled knowledge.

### BYOAI (Bring Your Own AI)
One of four key principles for personal knowledge systems, emphasizing that users should own and control the AI components that process their personal data, rather than relying solely on cloud-based solutions. Implementation typically uses any OpenAI-compatible API, swappable via environment variables like `LLM_BASE_URL` and `LLM_MODEL`, giving users flexibility to choose and switch between different LLM providers.

### Recursive Summarization
A technique for processing long-form documents (particularly PDFs) in the LLM Wiki pattern. The approach works by first converting PDF pages to markdown, then summarizing each page individually, and finally summarizing those summaries to create a consolidated overview. This preserves the document's structural hierarchy while extracting key information for the knowledge base.

## Key Principles

### Explicit
Knowledge should be visible and navigable, stored in formats that humans can directly read and understand rather than hidden in proprietary databases.

### Yours
Data remains local and under user control, prioritizing personal data sovereignty over cloud-centric solutions.

### File Over App
Information is stored in simple markdown files rather than locked into application-specific formats, ensuring longevity and interoperability.

### BYOAI
Use whatever AI model you want to query your wiki. Implementation uses OpenAI-compatible APIs with swappable models via environment variables, giving users control over their AI infrastructure.

## Entities

### Andrej Karpathy
AI researcher and educator known for his work at Tesla Autopilot and as a founding member of OpenAI. He has been a prominent advocate for using LLMs to build personal wiki-style knowledge management systems.

### Farzapedia
A personal wiki project that demonstrates the wiki-style knowledge base approach, having transformed 2500 personal entries from diary entries, Apple Notes, and iMessages into 400 detailed articles through LLM processing.

### Apple Notes
A note-taking application that can serve as a source input for personal knowledge bases, alongside other personal data sources like diary entries and iMessages.

### Obsidian
A personal knowledge management application that functions as an IDE (Integrated Development Environment) for wiki-style knowledge bases. In the LLM Wiki pattern, Obsidian serves as the interface where users interact with their markdown files while LLMs act as programmers managing the wiki like a codebase. Supports YAML frontmatter, wiki links, graph view, and Unix-style file interoperability.

### CLAUDE.md
A schema layer file in the LLM Wiki architecture that defines the structure and conventions for how knowledge should be organized and maintained within the wiki.

### AGENTS.md
A schema layer file in the LLM Wiki architecture that defines agent behaviors and operational conventions for how the LLM should interact with and update the knowledge base.

### Large Language Models
The AI systems that serve as the "programmers" in the LLM Wiki pattern, responsible for summarizing, cross-referencing, filing, and maintaining the knowledge base between sessions.

### OpenAI
AI research company whose API standards (OpenAI-compatible API) have become a de facto specification for LLM integrations, enabling the BYOAI principle through standardized environment variables like `LLM_BASE_URL` and `LLM_MODEL`.

### VaultMind
A browser-based implementation of the Karpathy wiki pattern with zero backend (single HTML file). Supports PDF drops, URLs, voice memos, and file drag with live knowledge graph visualization. Demonstrates the portability of wiki-style knowledge bases running entirely in the browser without server infrastructure.

### LOTR Memory Explorer
A project that converted 480,000 words into 20,000 navigable memories with a visual knowledge graph, demonstrating the scalability of explicit memory systems. Serves as a proof-of-concept for building large-scale personal knowledge bases with interconnected, graph-based navigation.

### iMessage
Apple's instant messaging service that, alongside diary entries and Apple Notes, can serve as a source input for personal knowledge bases in the LLM Wiki pattern.

## Architecture

### Directory Structure
A wiki-style knowledge base typically separates:
- **Sources directory**: Raw, unprocessed data from various inputs (diaries, notes, messages), stored as timestamped immutable files
- **Concepts directory**: Structured, refined articles and knowledge entries, typically maintained as four core files:
  - **definitions.md**: Key concept definitions and explanations
  - **entities.md**: Detailed entries for people, places, organizations, and things
  - **sources.md**: Index and metadata for all source documents
  - **comparisons.md**: Side-by-side analyses and contrasts between related concepts

This separation allows LLMs to incrementally update concepts without overwriting existing knowledge, maintaining an audit trail and preventing data loss. The core principle: LLMs merge new information into existing files—never overwrites, always compounds.

### Three-Layer Architecture
The LLM Wiki pattern employs a three-layer structure:
1. **Schema Layer**: Contains CLAUDE.md and AGENTS.md files that define structure, conventions, and agent behaviors
2. **Wiki Layer**: Contains the markdown files with structured knowledge entries
3. **Raw Sources Layer**: Contains immutable source documents that feed into the wiki

### Three Core Operations
The LLM Wiki methodology supports three fundamental operations:
- **Ingest**: Process new sources into the wiki, converting raw data into structured knowledge entries. A single source might touch 10-15 wiki pages, updating summaries, entity pages, and cross-references.
- **Query**: Answer questions against the wiki by referencing existing structured knowledge. The LLM reads relevant concepts, synthesizes an answer with citations, detects gaps, and records them for future filling. Key insight: Good answers should be filed back into the wiki as new pages—a comparison you asked for, an analysis, a connection you discovered—allowing explorations to compound just like ingested sources.
- **Lint**: Health-check the wiki for contradictions, stale content, orphaned entries, missing cross-references, and data gaps that could be filled with a web search.

### Recursive Summarization Technique
For processing long-form documents, particularly PDFs, the LLM Wiki pattern employs recursive summarization:
1. Convert PDF pages to markdown format
2. Summarize each page individually
3. Summarize the page summaries to create a consolidated overview
4. Preserve the document's structural hierarchy throughout the process

This technique enables efficient processing of lengthy documents while maintaining the contextual relationships within the material.

## Andrej Karpathy on LLM Knowledge Bases (April 2026)

Andrej Karpathy on LLM Knowledge Bases (April 2026):

Something I find very useful recently: using LLMs to build personal knowledge bases for various topics of research interest. Instead of RAG (retrieve-then-generate), let the LLM continuously maintain a wiki knowledge base.

Key principles:
1. Explicit - memory artifact is visible and navigable, not implicit
2. Yours - data stays on your local computer, not in AI provider systems
3. File over app - simple markdown files, interoperable with any tool
4. BYOAI - use whatever AI model you want to query your wiki

The knowledge base has sources/ and concepts/ directories. Sources store raw input, concepts store structured knowledge (definitions, entities, comparisons). LLM incrementally updates concepts without overwriting existing knowledge.

Farzapedia example: @FarzaTV used this approach to create personal Wikipedia from 2500 diary entries, Apple Notes, iMessage conversations. Generated 400 detailed articles.

## Use Cases

### Personal Tracking
Using the LLM Wiki pattern to maintain a persistent record of personal experiences, goals, and reflections that compound over time. Users track goals, health, psychology, self-improvement, and file journal entries, articles, and podcast notes.

### Research Deep-Dives
Building structured knowledge repositories around research topics where information is collected from multiple sources and synthesized into interconnected wiki pages. Going deep on a topic over weeks or months, reading papers, articles, reports, and incrementally building a comprehensive wiki with an evolving thesis.

### Reading Companion Wikis
Creating supplemental knowledge bases alongside reading materials, where the LLM helps connect concepts across books and articles. Filing each chapter as you go, building pages for characters, themes, and plot threads, connecting everything by the end—resulting in a rich companion wiki (like Tolkien Gateway, but personal).

### Business/Team Wikis
Organizational knowledge management systems fed by internal communications like Slack messages and meeting notes, transformed into searchable institutional knowledge. LLMs maintain the wiki with humans in the loop reviewing updates. Use cases include competitive analysis, due diligence, trip planning, course notes, and hobby deep-dives.

### Explorations as First-Class Sources
A key insight from the LLM Wiki pattern: query answers should be filed back into the wiki as new pages. When you ask the LLM to synthesize information, compare concepts, or analyze connections, those outputs become new knowledge entries that compound just like ingested sources. This creates a virtuous cycle where every question enriches the wiki.

### Large-Scale Memory Systems
Building expansive personal knowledge bases that scale to hundreds of thousands of words or entries. The LOTR Memory Explorer project demonstrates this by converting 480,000 words into 20,000 navigable memories with visual graph representation, proving the viability of explicit memory systems at scale.

### Browser-Based Implementations
Running wiki-style knowledge bases entirely in the browser without backend infrastructure. VaultMind demonstrates this approach with a single HTML implementation supporting PDF uploads, URL ingestion, voice memos, and drag-and-drop file handling with live knowledge graph visualization.

## From gist.github.com (2026-04-05)

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
│ - Cross-references  |      │ - Follow links      │
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
│  Curated collection of source documents:                    │
│  - Articles, papers, images, data files                     │
│  Immutable — LLM reads but never modifies                   │
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

### The Four Concept Files

The concepts directory typically maintains four core files:
- **definitions.md**: Key concept definitions and explanations
- **entities.md**: Detailed entries for people, places, organizations, and things
- **sources.md**: Index and metadata for all source documents
- **comparisons.md**: Side-by-side analyses and contrasts between related concepts

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

**Recursive Summarization for Documents:**
For long-form documents like PDFs, the recursive summarization approach:
1. Convert PDF pages to markdown
2. Summarize each page individually
3. Summarize the summaries to create a consolidated overview
4. Preserve structural hierarchy throughout

### 2. Query

**Process:** Ask questions against the wiki

**Flow:**
1. LLM searches for relevant pages
2. LLM reads them
3. LLM synthesizes an answer with citations
4. LLM detects gaps and records them for future filling

**Answer formats:**
- Markdown

## Farzapedia case study:
@FarzaTV built personal Wik...

Farzapedia case study:
@FarzaTV built personal Wikipedia from 2500 diary entries + Apple Notes + iMessage conversations. Generated 400 detailed articles covering friends, startups, research areas, favorite animes and their impact.

Karpathy commented: This is what explicit memory looks like. The memory artifact is explicit and navigable. You can see exactly what the AI knows. Data is yours, on your local computer. Files are simple markdown - interoperable with any tool.

Recursive summary tree approach (from @antilukalister):
For PDFs and long documents: convert each page to MD → summarize each page → summarize all summaries. Better than chunking because it preserves document structure.

VaultMind project: full Karpathy wiki pattern in browser, zero backend, single HTML file. Supports PDF drop, URL paste, voice memo, file drag. Knowledge graph updates live.

LOTR Memory Explorer (@cludeproject / @sebbsssss): 480,000 words from Lord of the Rings trilogy converted to 20,000 navigable memories. Visual graph of lore, memory, meaning. Example of what explicit memory visualization can look like at scale.

Obsidian integration: wiki files with YAML frontmatter and [[wiki links]] drop directly into Obsidian vault. Graph view works out of the box. Unix philosophy: files are interoperable with everything.