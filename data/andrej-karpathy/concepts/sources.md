# Source References

References to sources of knowledge.

---

# Personal Wiki-Style Knowledge Bases

## Overview

Andrej Karpathy describes using LLMs to build personal wiki-style knowledge bases instead of traditional RAG (Retrieval-Augmented Generation) systems. This approach emphasizes local data storage, simple markdown files, and incremental knowledge updates.

The LLM Wiki pattern is a methodology for building persistent, compounding knowledge bases using LLMs, where instead of traditional RAG that rediscovers knowledge from scratch on every query, the LLM incrementally builds and maintains a structured wiki between the user and raw source documents.

## Key Principles

The approach is built on four fundamental principles:

1. **Explicit** - Knowledge should be visible and navigable
2. **Yours** - Data should be stored locally
3. **File over App** - Use simple markdown files rather than proprietary applications
4. **BYOAI** - Bring Your Own AI - the AI assists but doesn't own the data

## Directory Structure

A recommended structure separates:

- **Sources Directory** - Raw, unprocessed data (notes, messages, documents)
- **Concepts Directory** - Structured, interconnected knowledge articles

The LLM incrementally updates concepts without overwriting existing knowledge, allowing the wiki to grow organically.

### Three-Layer Architecture

The LLM Wiki methodology employs a three-layer architecture:

1. **Schema Layer** - Configuration files (e.g., CLAUDE.md, AGENTS.md) that define the wiki's structure, conventions, and behavioral guidelines
2. **Wiki Layer** - Markdown files containing the structured, interconnected knowledge articles
3. **Raw Sources** - Immutable source documents that serve as the foundation of knowledge

### Three Core Operations

The LLM Wiki pattern supports three fundamental operations:

1. **Ingest** - Process new sources into the wiki, transforming raw data into structured knowledge articles
2. **Query** - Answer questions against the wiki, retrieving and synthesizing information from existing articles
3. **Lint** - Health-check the wiki for contradictions, stale content, orphaned pages, and consistency issues

## Related Entities

- Andrej Karpathy - AI researcher who popularized this approach
- Farzapedia - Notable example of this method in practice
- Apple Notes - One of the source data types that can be integrated
- Obsidian - Recommended IDE for managing the wiki like a codebase
- CLAUDE.md - Schema configuration file for defining wiki structure
- AGENTS.md - Schema configuration file for agent behavior conventions
- LLM Wiki - The methodology itself
- RAG (Retrieval-Augmented Generation) - Traditional approach being replaced

---

## Farzapedia Case Study

**Farzapedia** demonstrates the effectiveness of this approach:

- **Input**: 2,500 personal entries including diary entries, Apple Notes, and iMessages
- **Output**: 400 detailed, interconnected articles
- **Process**: LLM transformation of raw personal data into structured wiki content

This example showcases how diverse personal data sources can be consolidated into a usable knowledge base through LLM-assisted processing.

---

## Comparison with Traditional RAG

| Traditional RAG | Wiki-Style Approach |
|-----------------|---------------------|
| Query-based retrieval | Continuous curation |
| Ephemeral responses | Persistent knowledge articles |
| Black-box system | Transparent, navigable structure |
| External data processing | Local, personal data ownership |
| Re-derives knowledge per-query | Persists and compounds knowledge between sessions |
| No accumulation | Compounding knowledge base |

---

## Use Cases

The LLM Wiki pattern supports diverse applications:

- **Personal Tracking** - Maintaining personal journals, notes, and life documentation
- **Research Deep-Dives** - Building structured knowledge from research materials
- **Reading Companion Wikis** - Creating interconnected notes from books and articles
- **Business/Team Wikis** - Aggregating knowledge from Slack, meetings, and documents
- **Query-to-Wiki Workflow** - Filing answers back into the wiki as new pages, allowing explorations to compound just like ingested sources

---

## Related Concepts

- [[Knowledge Management]]
- [[Personal Knowledge Base]]
- [[LLM Applications]]
- [[Markdown-Based Note-Taking]]
- [[Local-First Software]]
- [[Obsidian]]
- [[Three-Layer Architecture]]
- [[Knowledge Compounding]]
- [[Schema-Driven Knowledge Bases]]