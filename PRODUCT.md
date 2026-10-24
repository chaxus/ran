# ran

ran provides design methods, components and tools for building web products, for developers and coding agents. This sentence is the positioning the README and the website headline repeat; change all three together.

## Three pillars

| Pillar     | Responsibility                                                                                   | Delivery                                          |
| ---------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------- |
| Ran Design | Product composition, coherent visual language, interaction, motion and evidence-based acceptance | Portable skills, agent plugin and public guidance |
| ranui      | Accessible custom elements, themes and explicit component behavior                               | Independently installable npm package             |
| ranuts     | Typed utilities with explicit runtime boundaries                                                 | Independently installable npm package             |

Ran Design must also work in products that do not use ranui. The ranui adapter connects general methods to the installed library's actual tokens and APIs. ranuts remains useful without a UI dependency.

`@alixex/ranview` remains an independently published DOM/reactivity foundation. ranpress is private build infrastructure for the website. These implementation roles do not require additional top-level product pillars.

## Website

**https://ran.chaxus.com** is the product website, documentation and live-example destination. Its existing application owner is `packages/docs`; its build mechanism is `packages/ranpress`. Keep one navigation, search and locale system for the three pillars. The personal `chaxus.com` application is retired from this repository; domain and hosting administration are separate.

The website should help a visitor understand the product, try a real interaction, choose a library or agent workflow, and reach accurate instructions. Use composed examples with realistic content and complete states. Let the same example connect design rationale, implementation and verification.

## Ownership and quality

General methodology belongs to a neutral `design/` owner as it is extracted. Package source owns APIs and tokens. Skills route to the applicable references; public pages explain and demonstrate them. Generated distributions may include copies, but those copies must identify their source and cannot become separately edited standards.

A library consumer should not need the plugin, and a plugin user should not need to install ranui to use general design guidance. Package and plugin releases are independent; library-specific guidance must identify its applicable version.

A polished result combines coherent proportions and typography with complete behavior, readable content and purposeful motion. Claims about visuals require current rendered evidence; claims about transitions require continuous recordings. Automated checks, agent review and human acceptance are distinct.

The accepted direction and staged implementation are recorded in the [architecture plan](docs/superpowers/plans/2026-10-23-ran-product-architecture.md). The [ranui demo brief](packages/ranui/demo/PRODUCT.md) applies only to its component workbench.
