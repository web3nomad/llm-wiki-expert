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
