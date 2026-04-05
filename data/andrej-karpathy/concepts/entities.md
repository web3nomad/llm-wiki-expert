# Entities

Named entities, people, topics, and organizations.

## People

- **Andrej Karpathy**: AI researcher who describes using LLMs to build personal wiki-style knowledge bases instead of traditional RAG systems. Advocates for local data storage, simple markdown files, and incremental knowledge updates. Articulated four key principles for personal wikis: explicit (visible/navigable), yours (local data), file over app (markdown), and BYOAI (bring your own AI).

## Projects & Tools

- **Farzapedia**: A personal wiki project that demonstrates the wiki-style knowledge base approach. Transformed 2500 personal entries from diary entries, Apple Notes, and iMessages into 400 detailed articles using LLM-powered incremental updates.
- **Obsidian**: A popular knowledge management application often used as the IDE for LLM Wiki implementations, where the LLM acts as a programmer managing the wiki like a codebase.

## Technologies & Platforms

- **Apple Notes**: A source data type for personal knowledge bases, mentioned as one of the input sources (alongside diary entries and iMessages) that can be converted into structured wiki articles.
- **CLAUDE.md**: A schema layer file that defines the structure and conventions for an LLM Wiki, specifying how knowledge should be organized and maintained.
- **AGENTS.md**: A schema layer file that complements CLAUDE.md, defining agent behaviors and workflows within the LLM Wiki system.

## Concepts

- **BYOAI** (Bring Your Own AI): One of four key principles for personal wiki knowledge bases—emphasizing local AI processing rather than cloud-based solutions.
- **Personal Wiki**: A wiki-style knowledge base maintained by LLMs that replaces traditional RAG systems. Emphasizes explicit (visible/navigable) content, local data ownership ("yours"), markdown files over apps, and user-controlled AI. The LLM incrementally updates concepts without overwriting existing knowledge, allowing the wiki to compound over time.
- **LLM Wiki**: A methodology for building persistent, compounding knowledge bases using LLMs. Unlike traditional RAG that rediscovers knowledge from scratch on every query, the LLM Wiki compiles knowledge once and keeps it current through incremental updates. Features a three-layer architecture: Schema layer (CLAUDE.md/AGENTS.md), Wiki layer (markdown files), and Raw Sources (immutable input documents).
- **RAG** (Retrieval-Augmented Generation): Traditional approach to querying knowledge bases where the LLM must find and piece together fragments on every query. LLM Wiki addresses RAG's key limitation—no accumulation—by persisting and compounding knowledge between sessions.
- **Three Core Operations (LLM Wiki)**: The fundamental workflows that maintain the wiki—Ingest (process new sources into wiki), Query (answer questions against wiki), and Lint (health-check for contradictions, stale content, and orphans).
- **Query Compounding**: The practice of filing answers from queries back into the wiki as new pages, allowing explorations to compound just like ingested sources. This enables the knowledge base to grow from both raw source ingestion and user queries.
- **Use Cases (LLM Wiki)**: Personal tracking, research deep-dives, reading companion wikis, and business/team wikis fed by Slack/meetings.