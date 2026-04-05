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
| **Example** | Standard retrieval pipelines | Farzapedia (2500 entries → 400 articles) |

### Key Principles of Wiki-Style Knowledge Bases

1. **Explicit** - Knowledge is visible and navigable, not hidden in embeddings
2. **Yours** - Data stays local, under user control
3. **File over App** - Simple markdown files over proprietary applications
4. **BYOAI** - Bring Your Own AI - the LLM maintains and updates the knowledge

### Farzapedia Case Study

- **Input**: 2500 diary entries, Apple Notes, and iMessages
- **Output**: 400 detailed, interconnected articles
- **Method**: LLM incrementally updates concepts without overwriting existing knowledge
- **Structure**: Separate directories for raw sources and structured concepts

---

## Sources

- Andrej Karpathy - LLM-based personal knowledge base approach
- Farzapedia - Practical implementation example