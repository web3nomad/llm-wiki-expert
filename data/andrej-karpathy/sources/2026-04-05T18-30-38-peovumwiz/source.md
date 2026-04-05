Key insights from re-reading the full Karpathy LLM Wiki gist:

1. The schema file is THE key config. Not just structure — it is how the LLM becomes a disciplined wiki maintainer rather than a generic chatbot. You and the LLM co-evolve the schema over time.

2. Three operations: Ingest / Query / Lint. Each has specific behaviors. Ingest touches 10-15 pages per source. Query can output to different formats (markdown, comparison table, Marp slides, matplotlib). Lint finds contradictions, orphans, stale claims, gaps.

3. File-back is critical: good answers should be filed back into the wiki. Chat answers that disappear into history are wasted synthesis.

4. Index.md is content-oriented (catalog of pages). Log.md is chronological (append-only record). They serve different purposes — index for navigation, log for history.

5. Human role: curate sources, direct analysis, ask good questions. LLM role: everything else — summarizing, cross-referencing, filing, bookkeeping.

6. The tedious part of maintaining a knowledge base is the bookkeeping. LLMs dont get bored, dont forget cross-references, can touch 15 files in one pass.

7. Vannevar Bush Memex (1945) connection: private, actively curated, with the connections between documents as valuable as the documents themselves. The part Bush could not solve was who does the maintenance. The LLM handles that.

8. The wiki is just a git repo of markdown files. Version history, branching, collaboration for free.