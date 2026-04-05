# Definitions

This expert's knowledge definitions.

## Core Concepts

### Wiki-Style Knowledge Base
A personal knowledge management approach that uses LLMs to continuously update and maintain a searchable collection of markdown files. Unlike traditional RAG (Retrieval-Augmented Generation) systems that rely on vector databases and chunking, wiki-style knowledge bases store information in human-readable markdown files that can be directly edited, navigated, and versioned. This approach was championed by Andrej Karpathy as an alternative to conventional RAG implementations.

### RAG (Retrieval-Augmented Generation)
A technique where AI systems retrieve relevant documents from a database to provide context for generating responses. While popular, Karpathy argues it can be replaced with continuous wiki-style knowledge bases that maintain data in a more accessible, permanent format.

### BYOAI (Bring Your Own AI)
One of four key principles for personal knowledge systems, emphasizing that users should own and control the AI components that process their personal data, rather than relying solely on cloud-based services.

## Key Principles

### Explicit
Knowledge should be visible and navigable, stored in formats that humans can directly read and understand rather than hidden in proprietary databases.

### Yours
Data remains local and under user control, prioritizing personal data sovereignty over cloud-centric solutions.

### File Over App
Information is stored in simple markdown files rather than locked into application-specific formats, ensuring longevity and interoperability.

## Entities

### Andrej Karpathy
AI researcher and educator known for his work at Tesla Autopilot and as a founding member of OpenAI. He has been a prominent advocate for using LLMs to build personal wiki-style knowledge management systems.

### Farzapedia
A personal wiki project that demonstrates the wiki-style knowledge base approach, having transformed 2500 personal entries from diary entries, Apple Notes, and iMessages into 400 detailed articles through LLM processing.

### Apple Notes
A note-taking application that can serve as a source input for personal knowledge bases, alongside other personal data sources like diary entries and iMessages.

## Architecture

### Directory Structure
A wiki-style knowledge base typically separates:
- **Sources directory**: Raw, unprocessed data from various inputs (diaries, notes, messages)
- **Concepts directory**: Structured, refined articles and knowledge entries derived from sources

This separation allows LLMs to incrementally update concepts without overwriting existing knowledge, maintaining an audit trail and preventing data loss.

## Andrej Karpathy on LLM Knowledge Bases (April 2026...

Andrej Karpathy on LLM Knowledge Bases (April 2026):

Something I find very useful recently: using LLMs to build personal knowledge bases for various topics of research interest. Instead of RAG (retrieve-then-generate), let the LLM continuously maintain a wiki knowledge base.

Key principles:
1. Explicit - memory artifact is visible and navigable, not implicit
2. Yours - data stays on your local computer, not in AI provider systems
3. File over app - simple markdown files, interoperable with any tool
4. BYOAI - use whatever AI model you want to query your wiki

The knowledge base has sources/ and concepts/ directories. Sources store raw input, concepts store structured knowledge (definitions, entities, comparisons). LLM incrementally updates concepts without overwriting existing knowledge.

Farzapedia example: @FarzaTV used this approach to create personal Wikipedia from 2500 diary entries, Apple Notes, iMessage conversations. Generated 400 detailed articles.