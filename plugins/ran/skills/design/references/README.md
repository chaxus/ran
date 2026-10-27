<!-- Generated from design/README.md; edit the source, then run sync:agent-plugin. -->

# Ran Design

A design guide for people and coding agents building the interface of a web product, in any stack.
Read [the guide](./DESIGN.md) top to bottom once; it follows the order you design in, from the task to
verifying the change, and ends with checklists to reuse on every change.

[Reference research](./REFERENCE_RESEARCH.md) collects the outside material behind some of its
decisions; it supplies examples, not rules.

These files are the editable source. The ranui npm guides compose the guide with ranui's
[implementation adapter](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/adapters/DESIGN.md),
and the agent plugin distributes a checked copy. Edit this source, then run `pnpm sync:design` and
`pnpm sync:agent-plugin` from the ran repository. Consuming the guide requires no checkout.
