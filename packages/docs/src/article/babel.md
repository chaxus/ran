# Babel

The core Babel libraries are:

- @babel/parser parses the source code. The parsing syntax can be specified via options such as plugins and sourceType. Its job is to convert source code into an AST.
- @babel/traverse processes the traversed AST via visitor functions, split into enter and exit phases. AST manipulation is done through the path API, and state can be used to pass data around during traversal.
- @babel/types is used to create and check AST nodes, providing APIs such as xxx, isXxx, and assertXxx.
- @babel/template simplifies AST creation logic when you need to create ASTs in bulk.
- @babel/code-frame produces friendly error messages.
- @babel/generator prints an AST into a target code string, supporting options such as comments, minified, and sourceMaps.
- @babel/core builds on the packages above to complete Babel's compilation pipeline and apply plugins and presets.
