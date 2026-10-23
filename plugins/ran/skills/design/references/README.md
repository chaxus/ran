<!-- Generated from design/README.md; edit the source, then run sync:agent-plugin. -->

# Ran Design

Portable product design methods for people and agents. Start with the task, content and host
capabilities; use the existing product’s visual language and implementation contracts.

| Decision                                                   | Read                                        |
| ---------------------------------------------------------- | ------------------------------------------- |
| Find the relevant owner                                    | [Task index](./INTERFACE_GUIDE.md)          |
| Structure, proportion, wording, visual coherence or motion | [Design](./DESIGN.md)                       |
| Input, focus, progress and recovery                        | [Interaction](./INTERACTION.md)             |
| A supported multi-step workflow                            | [Optional patterns](./WORKFLOW_PATTERNS.md) |
| Browser proof, recordings and evidence freshness           | [Acceptance](./ACCEPTANCE.md)               |
| Research an unresolved design question                     | [References](./REFERENCE_RESEARCH.md)       |

Read only relevant sections. These files are the editable source for shared methods. The ranui
npm guides compose them with library-specific adapters; the agent plugin distributes a checked
copy. Edit this source, then run `pnpm sync:design` and `pnpm sync:agent-plugin` from the ran repository.
These commands are for maintainers; consuming these methods requires no repository checkout.
