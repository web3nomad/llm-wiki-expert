Andrej Karpathy on LLM Knowledge Bases (April 2026):

Something I find very useful recently: using LLMs to build personal knowledge bases for various topics of research interest. Instead of RAG (retrieve-then-generate), let the LLM continuously maintain a wiki knowledge base.

Key principles:
1. Explicit - memory artifact is visible and navigable, not implicit
2. Yours - data stays on your local computer, not in AI provider systems
3. File over app - simple markdown files, interoperable with any tool
4. BYOAI - use whatever AI model you want to query your wiki

The knowledge base has sources/ and concepts/ directories. Sources store raw input, concepts store structured knowledge (definitions, entities, comparisons). LLM incrementally updates concepts without overwriting existing knowledge.

Farzapedia example: @FarzaTV used this approach to create personal Wikipedia from 2500 diary entries, Apple Notes, iMessage conversations. Generated 400 detailed articles.