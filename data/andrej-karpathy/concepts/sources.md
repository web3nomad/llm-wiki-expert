# Source References

References to sources of knowledge.

---

# Personal Wiki-Style Knowledge Bases

## Overview

Andrej Karpathy describes using LLMs to build personal wiki-style knowledge bases instead of traditional RAG (Retrieval-Augmented Generation) systems. This approach emphasizes local data storage, simple markdown files, and incremental knowledge updates.

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

## Related Entities

- Andrej Karpathy - AI researcher who popularized this approach
- Farzapedia - Notable example of this method in practice
- Apple Notes - One of the source data types that can be integrated

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

---

## Related Concepts

- [[Knowledge Management]]
- [[Personal Knowledge Base]]
- [[LLM Applications]]
- [[Markdown-Based Note-Taking]]
- [[Local-First Software]]