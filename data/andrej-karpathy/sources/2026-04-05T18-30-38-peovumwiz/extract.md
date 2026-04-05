# Extract

## Summary
This content outlines Karpathy's approach to using LLMs as active wiki maintainers. The system relies on a schema file to discipline the LLM's behavior, with three main operations (Ingest, Query, Lint) and a strong emphasis on filing answers back into the knowledge base rather than letting them vanish into chat history.

## Key Points
- The schema file is the key configuration that transforms an LLM into a disciplined wiki maintainer through co-evolution
- Three core operations: Ingest (10-15 pages per source), Query (multiple output formats), and Lint (finding contradictions and gaps)
- File-back is critical - answers must be saved to the wiki rather than lost in chat history
- Index.md serves content navigation while Log.md maintains chronological append-only records
- LLMs handle the tedious bookkeeping that humans avoid, including cross-referencing across many files

## Entities
- Karpathy
- LLM
- Vannevar Bush
- Memex
- Git
- Markdown
- Ingest
- Query
- Lint
- Index.md
- Log.md
