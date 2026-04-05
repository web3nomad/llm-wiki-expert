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
| **Update Philosophy** | Overwrites/chunks | Never overwrites, always compounds |
| **Example** | Standard retrieval pipelines | Farzapedia (2500 entries → 400 articles) |

### Key Principles of Wiki-Style Knowledge Bases

1. **Explicit** - Knowledge is visible and navigable, not hidden in embeddings
2. **Yours** - Data stays local, under user control
3. **File over App** - Simple markdown files over proprietary applications
4. **BYOAI** - Bring Your Own AI - the LLM maintains and updates the knowledge

> **The Idea File Concept**: Sharing markdown files instead of code/apps is more valuable in the LLM agent era. Plain text knowledge files are portable, Git-trackable, and usable in Obsidian or Cursor while remaining agnostic to specific LLM providers.

### Three-Layer Architecture

| Layer | Description | Examples |
|-------|-------------|----------|
| **Schema Layer** | Defines structure, conventions, and agent behavior | CLAUDE.md, AGENTS.md |
| **Wiki Layer** | Structured markdown files containing curated knowledge | Interconnected articles |
| **Raw Sources** | Immutable source documents | Original diary entries, notes, messages |

The schema file is the key configuration that transforms an LLM into a disciplined wiki maintainer through co-evolution. Index.md serves content navigation while Log.md maintains chronological append-only records.

### Wiki Directory Structure

The wiki uses a two-directory architecture to separate raw inputs from structured knowledge:

| Directory | Purpose | Contents |
|-----------|---------|----------|
| **sources/** | Raw timestamped inputs | Original documents, diary entries, notes, messages |
| **concepts/** | LLM-maintained concept files | definitions.md, entities.md, sources.md, comparisons.md |

The **concepts/** directory contains four maintained files that form the core of the knowledge base:

- **definitions.md** - Concept definitions and explanations
- **entities.md** - Named entities and their relationships
- **sources.md** - Source materials and references
- **comparisons.md** - Comparisons between concepts (this file)

### Core Operations

The LLM Wiki pattern operates through three fundamental processes:

1. **Ingest** - Process new sources into the wiki structure
   - LLM analyzes raw documents (typically 10-15 pages per source)
   - Creates or updates related wiki articles
   - Maintains links between concepts

2. **Query** - Answer questions against the wiki
   - Answers reference existing wiki content
   - Can cite sources from both wiki and raw documents
   - Detects gaps in knowledge and records them for future filling
   - Synthesizes new insights that can be filed back into wiki as new pages

3. **Lint** - Health-check operations
   - Detect contradictions between articles
   - Identify stale or outdated content
   - Find orphaned pages (articles with no links)

> **File-Back Principle**: Query answers must be saved to the wiki rather than lost in chat history. This allows explorations to compound just like ingested sources, enabling the knowledge base to grow organically from questions asked.

### Core Update Principle

> **Never overwrite, always compound** - LLMs merge new information into existing files rather than replacing them, ensuring knowledge accumulates and persists between sessions.

### BYOAI Implementation

The wiki system can use any OpenAI-compatible API for the LLM:

| Environment Variable | Purpose |
|---------------------|---------|
| `LLM_BASE_URL` | API endpoint URL |
| `LLM_MODEL` | Model identifier |

This makes the system portable, Git-trackable, and usable in Obsidian or Cursor while remaining agnostic to the specific LLM provider.

### Use Cases

- **Personal Tracking** - Life journals, daily notes, personal insights
- **Research Deep-Dives** - Compiling findings from multiple papers or sources
- **Reading Companion Wikis** - Notes and summaries from books or articles
- **Business/Team Wikis** - Aggregating information from Slack, meetings, and documents
- **Farzapedia-Style** - Transforming personal digital traces (messages, notes, entries) into structured knowledge
- **Memex-Style** - Following Vannevar Bush's vision of personal knowledge management with associative trails

### Farzapedia Case Study

- **Input**: 2500 diary entries, Apple Notes, and iMessages
- **Output**: 400 detailed, interconnected articles
- **Method**: LLM incrementally updates concepts without overwriting existing knowledge
- **Structure**: Separate directories for raw sources and structured concepts
- **Workflow**: Query answers can be filed back into wiki as new pages, allowing explorations to compound just like ingested sources

### Practical Implementations

#### VaultMind
A browser-based Karpathy wiki implementation with zero backend (single HTML file). Features include:
- PDF drops
- URL imports
- Voice memo support
- File drag-and-drop
- Live knowledge graph visualization

#### LOTR Memory Explorer
Demonstrates explicit memory at scale:
- **Input**: 480,000 words
- **Output**: 20,000 navigable memories
- Features visual graph navigation

#### Recursive Summarization
For processing large documents like PDFs:
1. Convert pages to markdown
2. Summarize each page individually
3. Summarize the summaries recursively
4. Preserves document structure and hierarchy

This approach enables the LLM to synthesize understanding across entire documents while maintaining context.

### Historical Context

The LLM Wiki pattern draws inspiration from Vannevar Bush's Memex concept—a visionary device for storing and retrieving human knowledge through associative trails. Like the Memex, the wiki approach treats knowledge as interconnected rather than isolated. Git provides the version control backbone, enabling the wiki to evolve as a collaborative, trackable knowledge project where LLMs handle the tedious cross-referencing bookkeeping that humans avoid.

### Obsidian Integration

Obsidian serves as the primary interface for editing and navigating markdown files, with full support for:
- **YAML frontmatter** for metadata and entity linking
- **Wiki links** (`[[page name]]`) for internal navigation
- **Graph view** for visualizing knowledge connections
- **Unix-style file interoperability** for portability

The practical setup uses Obsidian as the IDE with the LLM acting as a programmer managing the wiki like a codebase—creating, updating, and linking files while maintaining structural integrity.

### Key Distinction: RAG vs. LLM Wiki

| Characteristic | Traditional RAG | LLM Wiki |
|----------------|-----------------|----------|
| **Knowledge Accumulation** | No accumulation - rediscovers fragments on every query | Compiles knowledge once and keeps it current |
| **Session Behavior** | Starts fresh each interaction | Builds on previous sessions |
| **Query Efficiency** | Must retrieve and assemble context each time | Directly references existing compiled knowledge |
| **Update Model** | Vector store updates replace old embeddings | Incremental merges preserve historical context |
| **Gap Detection** | Cannot identify knowledge gaps | Actively detects and records gaps for future filling |
| **Answer Persistence** | Answers vanish into chat history | Answers can be filed back as new wiki pages |

---

## Sources

- Andrej Karpathy - LLM-based personal knowledge base approach
- Farzapedia - Practical implementation example
- LLM Wiki Pattern - Three-layer architecture methodology
- Obsidian - Markdown-based knowledge management tool
- CLAUDE.md - Schema layer convention
- AGENTS.md - Agent behavior definition convention
- VaultMind - Browser-based wiki implementation
- LOTR Memory Explorer - Large-scale memory visualization example
- Vannevar Bush - Memex concept and associative memory
- Git - Version control for knowledge evolution