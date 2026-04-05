# Conversation History


## User (4/5/2026, 4:49:03 PM)

What are the key principles of your LLM knowledge base approach?

## Assistant (4/5/2026, 4:49:03 PM)

The LLM knowledge base approach is built on four key principles: 1) Explicit - knowledge should be visible and navigable, stored in formats that humans can directly read and understand rather than hidden in proprietary databases. 2) Yours - data remains local and under user control, prioritizing personal data sovereignty over cloud-centric solutions. 3) File over App - information is stored in simple markdown files rather than locked into application-specific formats, ensuring longevity and interoperability. 4) BYOAI (Bring Your Own AI) - users should own and control the AI components that process their personal data, rather than relying solely on cloud-based services. This approach contrasts with traditional RAG systems by using a wiki-style directory structure with separate sources/ (raw unprocessed data) and concepts/ (structured knowledge articles), where the LLM incrementally updates concepts without overwriting existing knowledge. A notable example is Farzapedia, which transformed 2500 personal entries from diary entries, Apple Notes, and iMessages into 400 detailed articles.

## User (4/5/2026, 4:51:43 PM)

what is "file over app" and why does it matter?

## Assistant (4/5/2026, 4:51:43 PM)

File over App is one of the four key principles of Andrej Karpathy's wiki-style knowledge base approach. It means storing information in simple markdown files rather than locking it into application-specific formats or proprietary databases.

This matters for several reasons:

1. **Longevity**: Markdown files are plain text and will remain readable decades from now, regardless of what software tools exist or disappear. Proprietary formats can become obsolete.

2. **Interoperability**: Markdown files work with any text editor, can be version-controlled with Git, and are easily processed by any LLM or tool you choose to use.

3. **Transparency**: You can directly read, edit, and navigate your knowledge without being dependent on a specific application interface.

4. **Future-proofing**: Your data isn't trapped in a single vendor's ecosystem. If an app shuts down or changes its terms, you still have your data in an open, portable format.

In the context of LLM-maintained knowledge bases (like Farzapedia), this approach allows LLMs to continuously update and refine markdown files in your concepts/ directory, creating a persistent, visible, and controllable knowledge repository rather than an opaque system hidden inside a proprietary application.

## User (4/5/2026, 8:03:27 PM)

How is LLM Wiki different from RAG, and why does it matter?

## Assistant (4/5/2026, 8:03:27 PM)

LLM Wiki and RAG represent fundamentally different approaches to building AI-powered knowledge systems.

**Traditional RAG (Retrieval-Augmented Generation)** works by: uploading documents → storing embeddings in a vector database → at query time, retrieving relevant chunks → feeding them to the LLM to generate an answer. The key limitation is that RAG has **no accumulation**—the LLM must rediscover and piece together relevant fragments from scratch on every single query. Cross-document synthesis is difficult, and nothing persists between sessions.

**LLM Wiki** inverts this model. Instead of retrieving from raw documents at query time, the LLM continuously maintains a structured wiki—a collection of markdown files that sit between you and the raw sources. When you ingest new information, the LLM incrementally updates existing wiki pages rather than overwriting them. Knowledge compiles once and stays current.

| Aspect | RAG | LLM Wiki |
|--------|-----|----------|
| Knowledge accumulation | None—rediscovers fragments per query | Persistent, compounding between sessions |
| Cross-references | Created dynamically per query | Already exist in the wiki |
| Synthesis ability | Struggles across documents | Built-in from linked content |
| Data storage | Vector databases | Local markdown files |

**Why this matters:** The LLM Wiki approach embodies four principles that make it superior for personal knowledge management:

1. **Explicit** — Knowledge is visible and navigable, not hidden in embeddings
2. **Yours** — Data stays local on your computer, not in AI provider systems
3. **File over App** — Simple markdown files are portable and interoperable (works with Obsidian, Cursor, etc.)
4. **BYOAI** — Use whatever AI model you want via OpenAI-compatible APIs

The practical impact: A single source might touch 10-15 wiki pages during ingestion, updating summaries, entity pages, and cross-references. Over time, your wiki becomes a compounding asset where every query builds on previous work. When you ask the LLM to synthesize information, that answer can itself be filed back into the wiki as a new page—allowing explorations to compound just like ingested sources.

Real-world proof points: FarzaTV transformed 2,500 diary entries, Apple Notes, and iMessages into 400 interconnected articles. The LOTR Memory Explorer converted 480,000 words into 20,000 navigable memories with a visual graph.

## User (4/6/2026, 12:16:20 AM)

What is the key difference between LLM Wiki and RAG?

## Assistant (4/6/2026, 12:16:20 AM)

The key difference between LLM Wiki and traditional RAG (Retrieval-Augmented Generation) is persistence and accumulation. With RAG, the LLM must rediscover and piece together relevant knowledge fragments from scratch on every query—there is no accumulation between sessions. Subtle questions requiring synthesis across multiple documents are difficult because nothing is built up over time.

With LLM Wiki, the LLM incrementally builds and maintains a structured wiki between the user and raw source documents. Knowledge is compiled once and kept current through continuous updates. Cross-references already exist in the wiki, contradictions are flagged and tracked, and the system compounds knowledge between sessions rather than starting fresh each time.

In essence: RAG re-derives knowledge on every query, while LLM Wiki persists and compounds knowledge.
