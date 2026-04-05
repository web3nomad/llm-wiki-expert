# Entities

Named entities, people, topics, and organizations.

## People

- **Andrej Karpathy**: AI researcher who describes using LLMs to build personal wiki-style knowledge bases instead of traditional RAG systems. Advocates for local data storage, simple markdown files, and incremental knowledge updates. Articulated four key principles for personal wikis: explicit (visible/navigable), yours (local data), file over app (markdown), and BYOAI (bring your own AI).

## Projects & Tools

- **Farzapedia**: A personal wiki project that demonstrates the wiki-style knowledge base approach. Transformed 2500 personal entries from diary entries, Apple Notes, and iMessages into 400 detailed articles using LLM-powered incremental updates.
- **VaultMind**: A browser-based implementation of the Karpathy wiki pattern with zero backend (single HTML file). Supports PDF drops, URLs, voice memos, and file drag with live knowledge graph visualization. Demonstrates the viability of client-side-only personal wiki systems.
- **LOTR Memory Explorer**: A project that converted 480,000 words into 20,000 navigable memories with visual graph - demonstrating explicit memory at scale. Shows the potential for building large-scale personal knowledge graphs from source material.
- **Obsidian**: A popular knowledge management application often used as the IDE for LLM Wiki implementations, where the LLM acts as a programmer managing the wiki like a codebase. Works with YAML frontmatter and wiki links, providing graph view and Unix-style file interoperability.
- **Cursor**: A code editor that can also be used to work with LLM Wiki markdown files, alongside Obsidian.

## Technologies & Platforms

- **Apple Notes**: A source data type for personal knowledge bases, mentioned as one of the input sources (alongside diary entries and iMessages) that can be converted into structured wiki articles.
- **iMessage**: A source data type for personal knowledge bases, mentioned as one of the input sources that can be converted into structured wiki articles alongside diary entries and Apple Notes.
- **CLAUDE.md**: A schema layer file that defines the structure and conventions for an LLM Wiki, specifying how knowledge should be organized and maintained.
- **AGENTS.md**: A schema layer file that complements CLAUDE.md, defining agent behaviors and workflows within the LLM Wiki system.
- **OpenAI**: Provider of LLM APIs; the BYOAI principle supports using any OpenAI-compatible API, configurable via `LLM_BASE_URL` and `LLM_MODEL` environment variables.
- **YAML Frontmatter**: A metadata standard used in Obsidian and other markdown-based knowledge management tools for adding structured metadata at the top of markdown files.
- **Recursive Summary Tree**: An approach for processing PDF documents that converts pages to markdown, summarizes each page, then summarizes the summaries - preserving document structure while enabling efficient knowledge extraction.

## Concepts

- **BYOAI** (Bring Your Own AI): One of four key principles for personal wiki knowledge bases—emphasizing local AI processing rather than cloud-based solutions. Implementation supports any OpenAI-compatible API, swappable via `LLM_BASE_URL` and `LLM_MODEL` environment variables.
- **Personal Wiki**: A wiki-style knowledge base maintained by LLMs that replaces traditional RAG systems. Emphasizes explicit (visible/navigable) content, local data ownership ("yours"), markdown files over apps, and user-controlled AI. The LLM incrementally updates concepts without overwriting existing knowledge, allowing the wiki to compound over time.
- **LLM Wiki**: A methodology for building persistent, compounding knowledge bases using LLMs. Unlike traditional RAG that rediscovers knowledge from scratch on every query, the LLM Wiki compiles knowledge once and keeps it current through incremental updates. Features a three-layer architecture: Schema layer (CLAUDE.md/AGENTS.md), Wiki layer (markdown files), and Raw Sources (immutable input documents). The wiki typically uses a two-directory structure: `sources/` for raw timestamped inputs and ` concepts/` containing four maintained files (definitions.md, entities.md, sources.md, and comparisons.md). Query flow involves the LLM reading relevant concepts, synthesizing an answer, detecting gaps, and recording them for future filling.
- **RAG** (Retrieval-Augmented Generation): Traditional approach to querying knowledge bases where the LLM must find and piece together fragments on every query. LLM Wiki addresses RAG's key limitation—no accumulation—by persisting and compounding knowledge between sessions.
- **Three Core Operations (LLM Wiki)**: The fundamental workflows that maintain the wiki—Ingest (process new sources into wiki), Query (answer questions against wiki), and Lint (health-check for contradictions, stale content, and orphans).
- **Query Compounding**: The practice of filing answers from queries back into the wiki as new pages, allowing explorations to compound just like ingested sources. This enables the knowledge base to grow from both raw source ingestion and user queries. The LLM reads relevant concepts, synthesizes an answer, detects gaps, and records them for future filling.
- **Use Cases (LLM Wiki)**: Personal tracking, research deep-dives, reading companion wikis, business/team wikis fed by Slack/meetings.
- **Idea File Concept**: The concept that sharing markdown files instead of code/apps is more valuable in the LLM agent era, as plain markdown is portable, Git-trackable, and usable in tools like Obsidian or Cursor.
- **Directory Structure (LLM Wiki)**: The wiki uses two primary directories—`sources/` for raw timestamped inputs and `concepts/` containing four LLM-maintained files (definitions.md, entities.md, sources.md, and comparisons.md). This structure separates raw sources from structured concepts.
- **Core Compounding Principle**: The fundamental rule that LLMs merge new information into existing files—never overwriting, always compounding. This enables knowledge to grow incrementally rather than being rediscovered or lost on each session.
- **Knowledge Graph**: A visual representation of memories or concepts as navigable nodes, demonstrating explicit memory at scale. Projects like VaultMind and LOTR Memory Explorer implement knowledge graph visualizations within personal wiki systems.
- **Explicit Memory**: The principle that knowledge should be visible, navigable, and persistently stored rather than hidden in vector databases. Personal wikis based on this principle store all knowledge as markdown files that humans can read and traverse directly.