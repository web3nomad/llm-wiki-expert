Karpathy LLM Wiki Architecture Details:

The idea file concept: share markdown files instead of code/apps. In the LLM agent era, sharing an idea file is more valuable than sharing a specific implementation.

Wiki structure:
- sources/ directory: raw inputs with timestamps
- concepts/ directory: 4 files maintained by LLM
  - definitions.md: terms, concepts, frameworks
  - entities.md: people, orgs, projects, tools
  - sources.md: index of all source materials  
  - comparisons.md: relationships, contrasts, trade-offs

Key insight: LLM reads new source, extracts relevant info, MERGES into existing concept files. Never overwrites, always compounds.

Query flow: user asks question → LLM reads relevant concept files → synthesizes answer → detects gaps → records gaps for future filling.

Gap filling: when knowledge gap detected, LLM can auto-generate content or flag for human input.

BYOAI implementation: use any OpenAI-compatible API endpoint. Swappable by changing LLM_BASE_URL and LLM_MODEL env vars.

File over app: all knowledge stored as plain markdown. Can be opened in Obsidian, Cursor, any text editor. Git-trackable. Portable.