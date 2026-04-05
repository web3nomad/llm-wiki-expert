# Comparisons

Comparisons and contrasts between concepts.

## Traditional RAG vs. Wiki-Style Knowledge Base

| Aspect | Traditional RAG | LLM-Maintained Wiki (Karpathy Approach) |
|--------|-----------------|------------------------------------------|
| **Data Storage** | Vector databases, embeddings | Local markdown files |
| **Knowledge Structure** | Retrieval-augmented chunks | Structured concepts with incremental updates |
| **Maintenance** | Periodic re-indexing | Continuous LLM-driven updates |
| **Ownership** | Cloud/app-dependent | Local, user-controlled |
| **Format** | Flat document chunks | Hierarchical, navigable articles |
| **Knowledge Persistence** | Re-derives knowledge per query | Persists and compounds between sessions |
| **Example** | Standard retrieval pipelines | Farzapedia (2500 entries → 400 articles) |

### Key Principles of Wiki-Style Knowledge Bases

1. **Explicit** - Knowledge is visible and navigable, not hidden in embeddings
2. **Yours** - Data stays local, under user control
3. **File over App** - Simple markdown files over proprietary applications
4. **BYOAI** - Bring Your Own AI - the LLM maintains and updates the knowledge

### Three-Layer Architecture

| Layer | Description | Examples |
|-------|-------------|----------|
| **Schema Layer** | Defines structure, conventions, and agent behavior | CLAUDE.md, AGENTS.md |
| **Wiki Layer** | Structured markdown files containing curated knowledge | Interconnected articles |
| **Raw Sources** | Immutable source documents | Original diary entries, notes, messages |

### Core Operations

The LLM Wiki pattern operates through three fundamental processes:

1. **Ingest** - Process new sources into the wiki structure
   - LLM analyzes raw documents
   - Creates or updates related wiki articles
   - Maintains links between concepts

2. **Query** - Answer questions against the wiki
   - Answers reference existing wiki content
   - Can cite sources from both wiki and raw documents

3. **Lint** - Health-check operations
   - Detect contradictions between articles
   - Identify stale or outdated content
   - Find orphaned pages (articles with no links)

### Use Cases

- **Personal Tracking** - Life journals, daily notes, personal insights
- **Research Deep-Dives** - Compiling findings from multiple papers or sources
- **Reading Companion Wikis** - Notes and summaries from books or articles
- **Business/Team Wikis** - Aggregating information from Slack, meetings, and documents
- **Farzapedia-Style** - Transforming personal digital traces (messages, notes, entries) into structured knowledge

### Farzapedia Case Study

- **Input**: 2500 diary entries, Apple Notes, and iMessages
- **Output**: 400 detailed, interconnected articles
- **Method**: LLM incrementally updates concepts without overwriting existing knowledge
- **Structure**: Separate directories for raw sources and structured concepts
- **Workflow**: Query answers can be filed back into wiki as new pages, allowing explorations to compound just like ingested sources

### Practical Setup

- **IDE**: Obsidian serves as the primary interface for editing and navigating markdown files
- **LLM Role**: Functions as a programmer managing the wiki like a codebase
- **Query Flow**: When answering questions, responses should reference existing wiki entries and potentially create new articles from insights

### Key Distinction: RAG vs. LLM Wiki

| Characteristic | Traditional RAG | LLM Wiki |
|----------------|-----------------|----------|
| **Knowledge Accumulation** | No accumulation - rediscovers fragments on every query | Compiles knowledge once and keeps it current |
| **Session Behavior** | Starts fresh each interaction | Builds on previous sessions |
| **Query Efficiency** | Must retrieve and assemble context each time | Directly references existing compiled knowledge |

---

## Sources

- Andrej Karpathy - LLM-based personal knowledge base approach
- Farzapedia - Practical implementation example
- LLM Wiki Pattern - Three-layer architecture methodology
- Obsidian - Markdown-based knowledge management tool