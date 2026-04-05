# Source References

References to sources of knowledge.

---

# Personal Wiki-Style Knowledge Bases

## Overview

Andrej Karpathy describes using LLMs to build personal wiki-style knowledge bases instead of traditional RAG (Retrieval-Augmented Generation) systems. This approach emphasizes local data storage, simple markdown files, and incremental knowledge updates across sources and concepts directories, allowing the wiki to grow organically and compound knowledge over time.

The LLM Wiki pattern is a methodology for building persistent, compounding knowledge bases using LLMs, where instead of traditional RAG that rediscovers knowledge from scratch on every query, the LLM incrementally builds and maintains a structured wiki between the user and raw source documents.

## Key Principles

The approach is built on four fundamental principles:

1. **Explicit** - Knowledge should be visible and navigable
2. **Yours** - Data should be stored locally
3. **File over App** - Use simple markdown files rather than proprietary applications
4. **BYOAI** - Bring Your Own AI - the AI assists but doesn't own the data; implemented using any OpenAI-compatible API, swappable via `LLM_BASE_URL` and `LLM_MODEL` environment variables

## Directory Structure

A recommended structure separates:

- **Sources Directory** - Raw, unprocessed data (notes, messages, documents), organized as timestamped inputs
- **Concepts Directory** - Structured, interconnected knowledge articles

The LLM incrementally updates concepts without overwriting existing knowledge, allowing the wiki to grow organically.

### Three-Layer Architecture

The LLM Wiki methodology employs a three-layer architecture:

1. **Schema Layer** - Configuration files (e.g., CLAUDE.md, AGENTS.md) that define the wiki's structure, conventions, and behavioral guidelines
2. **Wiki Layer** - Markdown files containing the structured, interconnected knowledge articles
3. **Raw Sources** - Immutable source documents that serve as the foundation of knowledge

### Four Concept Files

Within the concepts directory, four core files are maintained by the LLM:

1. **definitions.md** - Core definitions and conceptual explanations
2. **entities.md** - Named entities, people, places, and objects
3. **sources.md** - References to source materials and their key contributions
4. **comparisons.md** - Comparative analyses and contrasts between concepts

### Query Flow

The query operation follows a sophisticated workflow:

1. LLM reads relevant concept files to understand existing knowledge
2. Synthesizes an answer based on the accumulated wiki content
3. Detects gaps or inconsistencies in the knowledge
4. Records identified gaps as tasks for future filling
5. Files answers back into the wiki as new pages when valuable

This approach allows explorations to compound just like ingested sources.

### Three Core Operations

The LLM Wiki pattern supports three fundamental operations:

1. **Ingest** - Process new sources into the wiki, transforming raw data into structured knowledge articles
2. **Query** - Answer questions against the wiki, retrieving and synthesizing information from existing articles
3. **Lint** - Health-check the wiki for contradictions, stale content, orphaned pages, and consistency issues

## Document Processing: Recursive Summarization

A key technique for processing long-form documents is the **recursive summarization tree approach**. This method:

1. Converts PDF pages to markdown
2. Summarizes each page individually
3. Summarizes the page summaries into higher-level summaries
4. Preserves document structure while creating a hierarchical knowledge tree

This approach enables efficient ingestion of lengthy documents while maintaining structural context and enabling quick navigation to relevant sections.

## The Idea File Concept

Sharing markdown files instead of code or applications is more valuable in the LLM agent era. The wiki itself becomes a portable, shareable knowledge artifact that can be used by LLMs or tools like Obsidian and Cursor. All knowledge is stored as plain markdown, making it portable, Git-trackable, and universally accessible.

## Related Entities

- Andrej Karpathy - AI researcher who popularized this approach
- Farzapedia - Notable example of this method in practice
- Apple Notes - One of the source data types that can be integrated
- iMessage - Personal communication source that can be ingested
- Obsidian - Recommended IDE for managing the wiki like a codebase
- CLAUDE.md - Schema configuration file for defining wiki structure
- AGENTS.md - Schema configuration file for agent behavior conventions
- LLM Wiki - The methodology itself
- RAG (Retrieval-Augmented Generation) - Traditional approach being replaced
- OpenAI - Provider of compatible API for BYOAI implementation
- VaultMind - Browser-based implementation of the wiki pattern with zero backend (single HTML file), supporting PDF drops, URLs, voice memos, and file drag with live knowledge graph visualization
- LOTR Memory Explorer - Demonstrated explicit memory at scale by converting 480,000 words into 20,000 navigable memories with visual graph

---

## Farzapedia Case Study

**Farzapedia** demonstrates the effectiveness of this approach:

- **Input**: 2,500 personal entries including diary entries, Apple Notes, and iMessages
- **Output**: 400 detailed, interconnected articles
- **Process**: LLM transformation of raw personal data into structured wiki content

This example showcases how diverse personal data sources can be consolidated into a usable knowledge base through LLM-assisted processing.

---

## VaultMind Implementation

**VaultMind** provides a modern browser-based implementation of the Karpathy wiki pattern:

- **Architecture**: Zero backend, single HTML file implementation
- **Input Types**: Supports PDF drops, URLs, voice memos, and file drag-and-drop
- **Visualization**: Live knowledge graph showing connections between memories
- **Portability**: Runs entirely in the browser with no server dependencies

This implementation demonstrates how the wiki pattern can be adapted for web-based access while maintaining local-first principles.

---

## LOTR Memory Explorer

**LOTR Memory Explorer** showcases the scalability of explicit memory systems:

- **Scale**: Converted 480,000 words into 20,000 navigable memories
- **Visualization**: Visual knowledge graph for exploring connections
- **Application**: Demonstrates that explicit, wiki-style memory can work at significant scale

This example proves the viability of the approach for large-scale knowledge bases beyond personal use.

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
| No persistent memory between queries | Knowledge gaps detected and recorded for future filling |

---

## Use Cases

The LLM Wiki pattern supports diverse applications:

- **Personal Tracking** - Maintaining personal journals, notes, and life documentation
- **Research Deep-Dives** - Building structured knowledge from research materials using recursive summarization for long documents
- **Reading Companion Wikis** - Creating interconnected notes from books and articles
- **Business/Team Wikis** - Aggregating knowledge from Slack, meetings, and documents
- **Query-to-Wiki Workflow** - Filing answers back into the wiki as new pages, allowing explorations to compound just like ingested sources
- **Large-Scale Knowledge Bases** - Demonstrated capability to handle hundreds of thousands of words with visual graph exploration

---

## Obsidian Integration

The wiki pattern integrates deeply with Obsidian through:

- **YAML Frontmatter** - Metadata support for enhanced document organization
- **Wiki Links** - `[[link]]` syntax for creating interconnected knowledge
- **Graph View** - Visual representation of knowledge connections
- **Unix-Style File Interoperability** - Plain markdown files work seamlessly with any tool

This integration enables powerful knowledge visualization and navigation while maintaining the simplicity of plain markdown files.

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
- [[BYOAI (Bring Your Own AI)]]
- [[Query-to-Wiki Workflow]]
- [[Recursive Summarization]]
- [[Knowledge Graph Visualization]]
- [[Zero-Backend Applications]]