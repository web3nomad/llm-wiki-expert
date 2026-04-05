# SCHEMA.md — Andrej Karpathy LLM Wiki

## Wiki Purpose

This wiki consolidates Andrej Karpathy's technical knowledge, philosophies, and contributions to AI/ML. Domain coverage includes large language models, neural network education, software development practices, and knowledge management methodologies. The wiki serves as a persistent, compounding reference that evolves with new insights from Karpathy's content (videos, writings, projects).

## Directory Structure

```
concepts/
├── definitions.md   # Terminology, frameworks, conceptual explanations
├── entities.md      # People, organizations, projects, tools, software
├── sources.md       # Primary references, key facts, citations
└── comparisons.md   # Relationships, trade-offs, contrasts between concepts
```

- **definitions.md**: Abstract concepts (e.g., "LLM Wiki," "Idea File Concept," "RAG"). Explain what things *are* and how they work.
- **entities.md**: Concrete nouns (e.g., "Andrej Karpathy," "llm.c," "GPT," "Obsidian," "Neural Networks"). Include affiliations, roles, and key attributes.
- **sources.md**: Reference material (e.g., YouTube videos, blog posts, GitHub repos). Extract key facts, timestamps, and quotable insights.
- **comparisons.md**: Relational knowledge (e.g., "RAG vs. LLM Wiki," "Markdown vs. Vector DBs"). Map how concepts interact, differ, and reinforce each other.

## Ingestion Rules

When processing new sources (videos, posts, code, tweets):

1. **Identify** which concept file(s) the content belongs to
2. **Extract** definitions, entity details, or comparisons as appropriate
3. **Merge** by updating existing entries — add new details to the relevant section rather than creating duplicates
4. **Flag** uncertain or incomplete extractions with `[?]`

## Query Rules

When answering questions:

1. **Cite sources** — reference the file and specific section (e.g., see `sources.md#video-2024-01`)
2. **Distinguish** between verified wiki content and derived inference
3. **Flag gaps** — if no wiki entry exists, state: `No entry found in wiki.`
4. **Prefer definitions** over external searches when available

## Maintenance Rules

- **Update** existing entries when new information elaborates, corrects, or extends them
- **Add new entries** only when introducing a concept, entity, or comparison that has no existing anchor
- **Prune** only when content is demonstrably incorrect or obsolete