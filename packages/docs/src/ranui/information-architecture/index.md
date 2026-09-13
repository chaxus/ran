---
description: 'How to shape an information-dense page before a single token is chosen: the three questions that fix the page, the skeleton that answers the primary one, and where each kind of information belongs.'
---

# Information architecture

Which **shape** a page takes, decided before a single colour or gap is.

The other pages in this section answer questions about the parts. This one answers the
question that comes first: given everything a screen has to carry, what is the reader here
to do, and which arrangement lets them do it?

| Page                                                     | Answers                                             |
| -------------------------------------------------------- | --------------------------------------------------- |
| **Information architecture** (this page)                 | _What shape_ the page should take                   |
| [Design system](/src/ranui/design-system/)               | _What_ the tokens are: the vocabulary               |
| [Design guidelines](/src/ranui/design-guides/)           | _How to choose_ between them when building a screen |
| [Theming](/src/ranui/theme/)                             | _How to switch and override_ them at runtime        |

> **Use when** you are starting a screen that has to carry several objects, several states
> and the relationships between them: a console, a dashboard, an admin surface, a workbench,
> a monitoring page. Not a landing page or a single-conversion form, which succeed or fail on
> persuasion rather than on whether a reader can judge accurately under dense information.

Complete data is not a designed page. A screen can hold every field the API returns, with
filters, status tags and bulk actions all present, and still leave the reader with no idea
what to look at first. Nothing is missing; the order is.

## Three questions before any component {#three-questions}

1. **What is the one thing the reader must see on arrival?** That is the page's primary
   information.
2. **What else has to be visible to make sense of it?** The related resources, the related
   models, the context.
3. **What do they do next?** Judge something, act on something, or keep thinking about
   something.

Answer all three before opening the component list. A page whose three answers are clear
rarely picks the wrong shape; a page that skips them ends up organised around the API
response instead.

**One page, one primary model.** Supporting models may help the reader understand or act on
the primary one. They may not compete for the first screen.

## The shape follows the task, not the payload {#shape}

Two shortcuts produce most badly shaped pages:

- The endpoint returned an array, so it became a table.
- The route carries an ID, so it became a detail page.

Neither is a reason. The same object takes a different shape under a different task: an issue
is a **collection** while you search, a **status flow** while you work it, a **discussion
thread** while you collaborate, and an **event sequence** while you audit. A record having a
date field says there is a date in the data. It does not say the page is a calendar.

## Choosing a skeleton {#skeletons}

Pick the arrangement that answers the primary question with the fewest mental conversions.

| The question in front of the reader                     | What has to sit together                                    | Skeleton                  |
| -------------------------------------------------------- | ------------------------------------------------------------ | -------------------------- |
| Which of these differs, and how?                        | The compared fields, in fixed columns                       | Comparison table          |
| Which one is it, so I can open it?                      | Name, identifier, status                                    | List / resource catalog   |
| Which one is it — and the picture tells me              | Image first, name and fields around it                      | Card grid                 |
| What is this object, and how is it right now?           | Identity, status, primary action, then attributes           | Sectioned detail          |
| What does it belong to?                                 | Path, parent, siblings                                      | Hierarchy tree            |
| What depends on this, what breaks if it changes?        | Upstream and downstream, blast radius                       | Adjacency list            |
| Which step am I on, and what follows?                   | Stage, current input, the steps after it                    | Step flow                 |
| Which stage is each item in, and moving it _is_ the work | Stage as the column, identity and blockers on the card      | Kanban                    |
| Why did it stall?                                       | Stage summary, then per-step result, then the raw log       | Trace drill-down          |
| Is it healthy, and how far does the damage reach?       | Object name, status, then the event that changed it         | Status wall               |
| What happened, in what order, by whom?                  | Time, actor, event type                                     | Event timeline            |
| Who said what, and how was it answered?                 | Author, message, reply structure                            | Discussion thread         |
| What changed, before versus after?                      | The two versions, side by side                              | Diff view                 |
| What is the trend, and where is the anomaly?            | The metric, its baseline, the way into the detail           | Dashboard                 |
| When is this occupied, and does it clash?               | Start, end and duration on one axis                         | Calendar / scheduling     |
| What do I work on next?                                 | The queue on one side, the item on the other                | Master-detail workbench   |
| Which rules apply, and what do they affect?             | The setting, its scope, its consequence                     | Configuration form        |
| What does this text say?                                | The body in order, with an outline beside it                | Continuous document       |
| Where is it?                                            | Position, boundary, distribution                            | Map / canvas              |

### Pairs that get swapped {#swapped-pairs}

- **Timeline or steps.** A timeline says what already happened, in order. Steps say where you
  are and what comes next. They look alike and point in opposite directions in time.
- **Kanban or a filter.** Kanban is right when moving a card _is_ the action. If the columns
  are saved filter conditions, you have built a filter that costs a drag.
- **Calendar or timeline.** A calendar answers occupancy and collision. A timeline answers
  order. The date in the record does not choose between them; the question does.
- **Card grid or table.** Either the image is the recognition anchor or it is not. When the
  choice is made by comparing numbers, a thumbnail in the first column buries the fields that
  decide it.
- **Graph or adjacency list.** Draw the graph only when the path or the propagation is itself
  the judgement. Otherwise a grouped list of upstream and downstream reads faster.
- **Document or field grid.** Prose that is read in order stays prose. Chopping every
  paragraph into a card or a key-value row destroys what made it readable.

Don't build all three views because you can. Each extra view is another filter set, another
status mapping, another set of actions to keep in sync. Add the second one when a second
usage is genuinely frequent, not in case it might be.

## Where each kind of information goes {#placement}

| Information       | Answers                          | Belongs                                                                 | Must not end up                                     |
| ------------------ | -------------------------------- | ----------------------------------------------------------------------- | --------------------------------------------------- |
| **Identity**      | What is this?                    | Title, object summary                                                   | The last column, or behind a tab                    |
| **Status**        | How is it now?                   | Title or summary region                                                 | Findable only in a detail field                     |
| **Attributes**    | What is it like?                 | Detail body, grouped the way people think about it                      | Flattened in API field order                        |
| **Relationships** | What is it connected to?         | Its own region or tab, with ownership, dependency and reference distinct | Mixed into the attribute table                      |
| **Changes**       | What is different from before?   | Diff region, timeline                                                   | Shown as the new value only                         |
| **Evidence**      | Why is that judgement safe?      | Next to the judgement, expandable                                       | A log page somewhere else                           |
| **Actions**       | What can I do now?               | Primary action in the title region, the rest beside the object they act on | Buried under "more"                                 |
| **Feedback**      | What did that do?                | Next to the action, keeping the task context                            | A global toast detached from what it is about       |

**Each fact has exactly one authoritative location.** Everywhere else shows a summary or an
entry point that links back to it.

## Reading order {#reading-order}

```text
Page identity
→ current status or exception
→ primary task and primary action
→ the information the judgement needs
→ relationships, changes, evidence
→ secondary information and low-frequency actions
```

- **One visual primary heading per page.** Section headings progress by semantics, not by a
  font size pretending to be hierarchy.
- **At most one primary action per task region.** The primary button is the most likely next
  step, not the most destructive one. Danger gets danger semantics, not the heaviest weight.
- Warning and danger colour is for states that genuinely need attention. A page where
  everything is green has already spent its signal.
- Badges, tags and banners draw on one shared attention budget. Emphasise only what would
  change a decision.

## Density {#density}

Density is not controls per square inch. It is how much _usable_ information a reader takes
in per look. Tightening the spacing raises visual density and leaves effective density
exactly where it was; removing irrelevant fields and putting the comparison in one place
raises the real thing.

| Level         | Where it belongs                                       | What it buys                                                     |
| -------------- | ------------------------------------------------------ | ---------------------------------------------------------------- |
| **Spacious**  | First use, rare configuration, risky confirmation      | Room for explanation, wider groups, a visible preview of impact  |
| **Standard**  | Most lists, details and forms                          | The default balance of scannability against information per screen |
| **Compact**   | Expert workbenches: monitoring, ops, audit             | Stable column widths, short copy, keyboard efficiency, saved views |

- Use **at most two adjacent levels** on one page. A compact table inside a standard page is
  fine; every region inventing its own scale is not.
- Compact is not "shrink the text and the hit targets together". Container padding and line
  height can tighten. Readable body text, a visible focus ring and pointer target size cannot.
- For expert users, column management, saved views, bulk actions and shortcuts beat showing
  more at once.

## Keeping task context {#context}

Once the skeleton is chosen, decide where the supporting content lives:

| The reader is…                                        | Give them                                                        |
| ------------------------------------------------------ | ---------------------------------------------------------------- |
| Switching between objects or evidence repeatedly      | A master-detail split: the queue on one side, the item on the other |
| Glancing at something light and transient             | An expandable row (`r-disclosure-row`) or a popover (`r-popover`) |
| Working on something shareable, or that needs room    | Its own route                                                    |
| Confirming, or typing one field                       | A modal (`r-modal`)                                              |

**A modal is not a navigation layer.** Anything that needs a copyable link, browser history,
a side-by-side comparison, or work that survives a refresh gets a route.

## What ranui gives you at this layer {#with-ranui}

ranui is deliberately unopinionated about page shape: it ships primitives and tokens, not
page templates. What it does give you here:

- `r-section` for the bands a skeleton divides into, `r-card` for a genuinely independent
  repeated entry. Never a card inside a card; group form fields with a heading or a divider.
- `r-tabs` for **peer views of one object** (its conversation, its checks, its diff), never
  for unrelated modules — that is what navigation is for.
- `r-disclosure-row` for progressive disclosure, `r-popover` and `r-dropdown` for transient
  context, `r-modal` only for what the table above allows it.
- `r-state-dot` for status, always with its label:
  [never colour alone](/src/ranui/design-guides/#accessibility).
- `r-skeleton` while the first screen loads, `r-progress` for anything long enough to make
  someone wonder, `r-message` for the result.

There is **no table, tree, calendar, kanban or timeline** in ranui. When you build one, build
it out of [the tokens](/src/ranui/design-system/) and the
[design guidelines](/src/ranui/design-guides/) rather than a second visual system: spacing
from the scale, type by role, colour from semantic tokens, every reachable state designed.

## Anti-patterns {#anti-patterns}

- Every field the endpoint returns becomes a detail row, so identity, status, relationships
  and evidence all arrive with the same weight.
- Hierarchy manufactured out of cards, colour and decorative spacing, with nothing said about
  what to read first.
- Several actions sharing the primary style, or a rare action sitting in the title region.
- Status, attributes, relationships and changes mixed into one table, so no comparison can be
  formed anywhere.
- A relationship graph where the reader only wanted to look up a name and a status.
- A modal carrying a long flow, a comparison, or something someone will want to link to.
- The same sentence repeated across the title, the summary, the tab label and the table,
  adding nothing new in any of them.

## Checklist before shipping a page

- [ ] The primary information, the supporting information and the reader's next action are
      written down.
- [ ] The skeleton was chosen from the question, not from the shape of the response.
- [ ] The page has one primary model; supporting views serve it instead of competing with it.
- [ ] Without reading the spec, the object, its status and the primary action are clear within
      five seconds.
- [ ] Comparison happens in one place; nothing has to be remembered across a tab or a page.
- [ ] Each fact has one authoritative location, and everywhere else links to it.
- [ ] Density matches how often the page is used, and no more than two adjacent levels appear.
- [ ] Long text, large numbers and a narrow viewport don't break the information order.
- [ ] Every block, field, tag and button that doesn't help a judgement has been deleted.
