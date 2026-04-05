# Entities

Named entities, people, topics, and organizations.

## People

- **Andrej Karpathy**: AI researcher who describes using LLMs to build personal wiki-style knowledge bases instead of traditional RAG systems. Advocates for local data storage, simple markdown files, and incremental knowledge updates. Articulated four key principles for personal wikis: explicit (visible/navigable), yours (local data), file over app (markdown), and BYOAI (bring your own AI). Draws inspiration from Vannevar Bush's Memex concept—an early vision for a personal knowledge base that could store, retrieve, and augment human memory.

## Projects & Tools

- **Farzapedia**: A personal wiki project that demonstrates the wiki-style knowledge base approach. Transformed 2500 personal entries from diary entries, Apple Notes, and iMessages into 400 detailed articles using LLM-powered incremental updates. Serves as a proof-of-concept for building personal Wikipedia-style knowledge bases.

- **VaultMind**: A browser-based implementation of the Karpathy wiki pattern with zero backend (single HTML file). Supports PDF drops, URLs, voice memos, and file drag with live knowledge graph visualization. Demonstrates the viability of client-side-only personal wiki systems.

- **LOTR Memory Explorer**: A project that converted 480,000 words into 20,000 navigable memories with visual graph—demonstrating explicit memory at scale. Shows the potential for building large-scale personal knowledge graphs from source material.

- **Obsidian**: A popular knowledge management application often used as the IDE for LLM Wiki implementations, where the LLM acts as a programmer managing the wiki like a codebase. Works with YAML frontmatter and wiki links, providing graph view and Unix-style file interoperability.

- **Cursor**: A code editor that can also be used to work with LLM Wiki markdown files, alongside Obsidian.

## Technologies & Platforms

- **Apple Notes**: A source data type for personal knowledge bases, mentioned as one of the input sources (alongside diary entries and iMessages) that can be converted into structured wiki articles.

- **iMessage**: A source data type for personal knowledge bases, mentioned as one of the input sources that can be converted into structured wiki articles alongside diary entries and Apple Notes.

- **CLAUDE.md**: A schema layer file that defines the structure and conventions for an LLM Wiki, specifying how knowledge should be organized and maintained. The schema file is the key configuration that transforms an LLM into a disciplined wiki maintainer through co-evolution.

- **AGENTS.md**: A schema layer file that complements CLAUDE.md, defining agent behaviors and workflows within the LLM Wiki system.

- **OpenAI**: Provider of LLM APIs; the BYOAI principle supports using any OpenAI-compatible API, configurable via `LLM_BASE_URL` and `LLM_MODEL` environment variables.

- **YAML Frontmatter**: A metadata standard used in Obsidian and other markdown-based knowledge management tools for adding structured metadata at the top of markdown files.

- **Recursive Summary Tree**: An approach for processing PDF documents that converts pages to markdown, summarizes each page, then summarizes the summaries—preserving document structure while enabling efficient knowledge extraction. This enables LLMs to process lengthy documents by maintaining hierarchical understanding.

- **Index.md**: A navigation file within the wiki structure that serves content navigation, helping users and LLMs locate relevant information across the knowledge base.

- **Log.md**: A chronological append-only record within the wiki structure that maintains a history of additions, updates, and modifications—providing an audit trail for knowledge evolution.

## Concepts

- **BYOAI** (Bring Your Own AI): One of four key principles for personal wiki knowledge bases—emphasizing local AI processing rather than cloud-based solutions. Implementation supports any OpenAI-compatible API, swappable via `LLM_BASE_URL` and `LLM_MODEL` environment variables. This allows users to maintain data sovereignty while choosing their preferred LLM provider.

- **Personal Wiki**: A wiki-style knowledge base maintained by LLMs that replaces traditional RAG systems. Emphasizes explicit (visible/navigable) content, local data ownership ("yours"), markdown files over apps, and user-controlled AI. The LLM incrementally updates concepts without overwriting existing knowledge, allowing the wiki to compound over time. The system treats the LLM as an active maintainer rather than a passive retrieval tool.

- **LLM Wiki**: A methodology for building persistent, compounding knowledge bases using LLMs. Unlike traditional RAG that rediscovers knowledge from scratch on every query, the LLM Wiki compiles knowledge once and keeps it current through incremental updates. Features a three-layer architecture: Schema layer (CLAUDE.md/AGENTS.md), Wiki layer (markdown files), and Raw Sources (immutable input documents). The wiki typically uses a two-directory structure: `sources/` for raw timestamped inputs and `concepts/` containing four maintained files (definitions.md, entities.md, sources.md, and comparisons.md). Query flow involves the LLM reading relevant concepts, synthesizing an answer, detecting gaps, and recording them for future filling.

- **RAG** (Retrieval-Augmented Generation): Traditional approach to querying knowledge bases where the LLM must find and piece together fragments on every query. LLM Wiki addresses RAG's key limitation—no accumulation—by persisting and compounding knowledge between sessions. While RAG re-derives knowledge per-query, LLM Wiki maintains persistent understanding.

- **Three Core Operations (LLM Wiki)**: The fundamental workflows that maintain the wiki:
  - **Ingest**: Process new sources into the wiki (typically 10-15 pages per source)
  - **Query**: Answer questions against the wiki with multiple output formats
  - **Lint**: Health-check for contradictions, stale content, and orphans
  - These operations form the core maintenance cycle for the knowledge base.

- **File-Back**: The critical practice of filing answers from queries back into the wiki as new pages, allowing explorations to compound just like ingested sources. This enables the knowledge base to grow from both raw source ingestion and user queries. Without file-back, answers vanish into chat history rather than accumulating in the knowledge base.

- **Query Compounding**: The practice of filing answers from queries back into the wiki as new pages, allowing explorations to compound just like ingested sources. This enables the knowledge base to grow from both raw source ingestion and user queries. The LLM reads relevant concepts, synthesizes an answer, detects gaps, and records them for future filling.

- **Schema Co-Evolution**: The process by which the schema file (CLAUDE.md/AGENTS.md) transforms an LLM into a disciplined wiki maintainer through iterative refinement. The schema and LLM co-evolve together, with the schema providing the structure and conventions that guide the LLM's behavior.

- **Use Cases (LLM Wiki)**: Personal tracking, research deep-dives, reading companion wikis, business/team wikis fed by Slack/meetings. The approach is versatile enough for individual knowledge management and team-level documentation.

- **Idea File Concept**: The concept that sharing markdown files instead of code/apps is more valuable in the LLM agent era, as plain markdown is portable, Git-trackable, and usable in tools like Obsidian or Cursor. This represents a shift from software distribution to knowledge distribution.

- **Directory Structure (LLM Wiki)**: The wiki uses two primary directories—`sources/` for raw timestamped inputs and `concepts/` for four LLM-maintained files (definitions.md, entities.md, sources.md, and comparisons.md). Additional files like Index.md (for navigation) and Log.md (for chronological records) support the system. This structure separates raw sources from structured concepts.

- **Core Compounding Principle**: The fundamental rule that LLMs merge new information into existing files—never overwriting, always compounding. This enables knowledge to grow incrementally rather than being rediscovered or lost on each session. The LLM handles the tedious bookkeeping that humans avoid, including cross-referencing across many files.

- **Knowledge Graph**: A visual representation of memories or concepts as navigable nodes, demonstrating explicit memory at scale. Projects like VaultMind and LOTR Memory Explorer implement knowledge graph visualizations within personal wiki systems.

- **Explicit Memory**: The principle that knowledge should be visible, navigable, and persistently stored rather than hidden in vector databases. Personal wikis based on this principle store all knowledge as markdown files that humans can read and traverse directly. Inspired by Vannevar Bush's Memex vision, which proposed machines to augment human memory through indexed, interconnected documents.

- **Memex**: An early conceptual machine described by Vannevar Bush in 1945 that would store and retrieve information based on associative links—considered a foundational inspiration for modern personal knowledge management systems and the LLM Wiki approach.