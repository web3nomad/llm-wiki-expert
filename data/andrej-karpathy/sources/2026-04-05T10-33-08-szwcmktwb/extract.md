# Extract

## Summary
The LLM Wiki pattern is a methodology for building persistent, compounding knowledge bases using LLMs, where instead of traditional RAG that rediscovers knowledge from scratch on every query, the LLM incrementally builds and maintains a structured wiki between the user and raw source documents.

## Key Points
- Traditional RAG has no accumulation - LLM must find and piece together fragments every query; LLM Wiki instead compiles knowledge once and keeps it current
- Three-layer architecture: Schema layer (CLAUDE.md/AGENTS.md) defines structure/conventions, Wiki layer contains markdown files, Raw Sources are immutable
- Three core operations: Ingest (process new sources into wiki), Query (answer questions against wiki), Lint (health-check for contradictions, stale content, orphans)
- Key difference: RAG re-derives knowledge per-query while LLM Wiki persists and compounds knowledge between sessions
- Practical setup uses Obsidian as IDE with LLM as programmer managing the wiki like a codebase
- Query answers should be filed back into wiki as new pages - allowing explorations to compound just like ingested sources
- Use cases: personal tracking, research deep-dives, reading companion wikis, business/team wikis fed by Slack/meetings

## Entities
- Andrej Karpathy
- LLM Wiki
- RAG (Retrieval-Augmented Generation)
- Obsidian
- CLAUDE.md
- AGENTS.md
- Large Language Models
