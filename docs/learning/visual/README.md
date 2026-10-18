# Shader learning notes

GLSL notes, Shadertoy-style examples and their original illustrations, moved out of
the retired standalone `visual` workspace. This directory has no build or runtime dependencies.

The maintained engine is [`ranuts/visual`](../../../packages/docs/src/ranuts/visual/index.md).
The old standalone package is not a drop-in alias: chart stubs and internal geometry exports
are not part of that public API.

## Notes

- [Getting started and editor setup](start.md)
- [GLSL syntax](glsl.md)
- [UV coordinates and shape composition](ux.md)
- [Texture sampling and transitions](texture.md)
- [Randomness and noise](random.md)

## Shader examples

- [Demo](demo.glsl)
- [Four colors](fourColor.glsl)
- [Red](red.glsl)
- [Yellow](yellow.glsl)
