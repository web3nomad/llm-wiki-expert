# Extract

## Summary
A wiki architecture for LLMs that stores knowledge as plain markdown files rather than apps. The system uses a sources/ directory for raw inputs and a concepts/ directory with four maintained files (definitions, entities, sources, comparisons). LLMs read new sources and merge information into existing concept files, compounding knowledge over time rather than overwriting.

## Key Points
- Idea file concept: sharing markdown files instead of code/apps is more valuable in the LLM agent era
- Wiki has two directories: sources/ for raw timestamped inputs and concepts/ for 4 LLM-maintained files
- The 4 concept files are definitions.md, entities.md, sources.md, and comparisons.md
- Core principle: LLMs merge new information into existing files - never overwrites, always compounds
- Query flow: LLM reads relevant concepts, synthesizes answer, detects gaps, and records them for future filling
- BYOAI implementation uses any OpenAI-compatible API, swappable via LLM_BASE_URL and LLM_MODEL env vars
- All knowledge stored as plain markdown, making it portable, Git-trackable, and usable in Obsidian or Cursor

## Entities
- Karpathy
- OpenAI
- Obsidian
