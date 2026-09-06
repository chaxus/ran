# ran — biblioteca de componentes web (ranui) y utilidades TypeScript (ranuts)

<p align="center">
  <a href="https://ran.chaxus.com/" target="_blank" rel="noopener noreferrer">
    <img width="180" src="https://ran.chaxus.com/icon.png" alt="ran logo">
  </a>
</p>

<p align="center">
  <strong>Una biblioteca de componentes web construida sobre custom elements nativos y ajena a cualquier framework (ranui), y una biblioteca de utilidades TypeScript apta para tree-shaking (ranuts), con las herramientas y la documentación bilingüe (inglés y chino) que las rodean.</strong>
</p>

<p align="center">
  <a href="https://github.com/chaxus/ran">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="license">
  </a>
  <a href="https://github.com/chaxus/ran">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat" alt="PRs welcome!" />
  </a>
  <a href="https://github.com/chaxus/ran">
    <img src="https://img.shields.io/github/actions/workflow/status/chaxus/ran/ci.yml" alt="Build Status">
  </a>
  <img src="https://badgen.net/npm/types/ranui" alt="Types Included">
  <a href="https://github.com/chaxus/ran">
    <img src="https://img.shields.io/github/forks/chaxus/ran" alt="forks">
  </a>
  <a href="https://github.com/chaxus/ran">
    <img src="https://img.shields.io/github/stars/chaxus/ran" alt="stars">
  </a>
</p>

<p align="center">
  <a href="#-funcionalidades">Funcionalidades</a> •
  <a href="#-paquetes">Paquetes</a> •
  <a href="#-inicio-rápido">Inicio rápido</a> •
  <a href="#-documentación">Documentación</a> •
  <a href="#-cómo-contribuir">Cómo contribuir</a>
</p>

---

[English](./README.md) | [中文](./README.zh-CN.md) | [日本語](./README.ja.md) | **Español** | [Português](./README.pt.md) | [한국어](./README.ko.md) | [Deutsch](./README.de.md) | [فارسی](./README.fa.md)

## ✨ Funcionalidades

- 🎨 **Bibliotecas de UI**: componentes web
- 🛠️ **Bibliotecas de utilidades**: utilidades en TypeScript
- 🤖 **Aprendizaje automático**: herramientas básicas de ML y experimentos
- 📱 **Aplicaciones web**: aplicación de chat IM (prototipo)
- 🔧 **Herramientas de desarrollo**: herramientas de compilación y depuración
- 🌐 **Web3**: experimentos con contratos inteligentes
- 🎯 **Herramientas visuales**: experimentos de visualización de datos

## 📦 Paquetes

Este monorepo reúne varios paquetes experimentales:

### Bibliotecas principales (fase alfa)

| Paquete                   | Versión                                                                                              | Descargas                                                                                  | Descripción                   |
| ------------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ----------------------------- |
| [ranui](packages/ranui)   | [![ranui version](https://img.shields.io/npm/v/ranui.svg?label=%20)](packages/ranui/README.es.md)    | [![npm-d](https://img.shields.io/npm/dt/ranui.svg)](https://www.npmjs.com/package/ranui)   | biblioteca de componentes web |
| [ranuts](packages/ranuts) | [![ranuts version](https://img.shields.io/npm/v/ranuts.svg?label=%20)](packages/ranuts/README.es.md) | [![npm-d](https://img.shields.io/npm/dt/ranuts.svg)](https://www.npmjs.com/package/ranuts) | biblioteca de utilidades      |

### Proyectos experimentales

| Paquete                                 | Descripción                             |
| --------------------------------------- | --------------------------------------- |
| [im](packages/im)                       | Prototipo de aplicación de chat         |
| [visual](packages/visual)               | Experimentos de visualización de datos  |
| [ranite](packages/ranite)               | Experimentos con herramientas de build  |
| [debug](packages/debug)                 | Utilidades de depuración                |
| [image-process](packages/image-process) | Experimentos de procesamiento de imagen |
| [cpro](packages/cpro)                   | Aprendizaje y experimentos en C/C++     |
| [rust](packages/rust)                   | Aprendizaje y experimentos en Rust      |

Cuáles de ellos revisa realmente la CI está declarado en [packages/manifest.json](packages/manifest.json), y ese archivo se ejecuta en lugar de limitarse a describir: `bin/run-checks.mjs` corre cada comprobación sobre los paquetes que la declaran, así que un paquete que allí figura como comprobado lo está de verdad, y el que no lo está dice por qué. `pnpm run verify:packages` falla cuando aparece bajo `packages/` un directorio que no está en el manifiesto, de modo que ningún paquete nuevo entra sin que alguien decida si se comprueba.

## 🚀 Inicio rápido

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/chaxus/ran.git
cd ran

# Instalar dependencias
pnpm install

# Compilar todos los paquetes
pnpm build
```

### Usar los paquetes principales

```bash
# Instalar ranui (componentes web)
npm install ranui

# Instalar las utilidades
npm install ranuts
```

### Desarrollo

```bash
# Levantar el servidor de desarrollo
pnpm dev

# Ejecutar las pruebas
pnpm test

# Compilar un paquete concreto
pnpm --filter ranui build
```

## 📚 Documentación

- **📖 Blog y artículos**: [vista previa de documentos web](https://ran.chaxus.com/src/article/doc_preview)
- **🎨 Documentación de RanUI**: [guía de la biblioteca de UI](https://ran.chaxus.com/src/ranui/)
- **🛠️ Documentación de RanUTS**: [guía de la biblioteca de utilidades](https://ran.chaxus.com/src/ranuts/)
- **📝 Documentación del proyecto**: [docs](packages/docs)

## 🤖 IA / Claude Code

El repositorio incluye un marketplace de plugins de Claude Code para que los asistentes de IA lean y usen las bibliotecas sin escarbar en el código fuente. Añade el marketplace y luego instala la biblioteca que uses:

```bash
/plugin marketplace add chaxus/ran
/plugin install ranui@ran      # ranui — componentes web
/plugin install ranuts@ran     # ranuts — utilidades
```

Cada skill cubre el import map, un inventario, ejemplos de uso y las convenciones, y remite a la referencia de la API que viaja en ese paquete. Los detalles están en la sección correspondiente de cada biblioteca: [ranui](packages/ranui/README.es.md) y [ranuts](packages/ranuts/README.es.md).

## ⚠️ Aviso importante

Este es un **proyecto de exploración técnica y aprendizaje** en fase temprana. La mayoría de los paquetes están en fase alfa o son experimentales.

**Puntos clave:**

- 🚧 **Desarrollo temprano**: la mayoría de las funcionalidades siguen en construcción
- 🧪 **Experimental**: las API pueden cambiar a menudo
- 📚 **Enfoque en el aprendizaje**: sobre todo sirve para aprender y experimentar

## 🤝 Cómo contribuir

Toda contribución es bienvenida, vengas a aprender o a programar. Así puedes ayudar:

1. Haz un **fork** del repositorio
2. **Crea** una rama para tu funcionalidad (`git checkout -b feature/amazing-feature`)
3. **Confirma** tus cambios (`git commit -m 'Add amazing feature'`)
4. **Sube** la rama (`git push origin feature/amazing-feature`)
5. **Abre** un pull request

### Pautas de desarrollo

- Sigue el estilo de código existente
- Añade pruebas a las funcionalidades nuevas siempre que puedas
- Actualiza la documentación cuando haga falta
- Ten paciencia con lo que aún es experimental

## 🌟 ¿Por qué código abierto?

Creo en la capacidad del código abierto para acelerar el aprendizaje y la innovación. A lo largo de mi camino como desarrollador me han influido incontables proyectos abiertos. Al publicar este código experimental espero:

- Compartir lo aprendido con la comunidad
- Que otras personas puedan aprender de este código y experimentar con él
- Fomentar la colaboración y el intercambio de conocimiento
- Crear un espacio para seguir aprendiendo y mejorando

## 📊 Estadísticas del proyecto

<a href="https://github.com/chaxus/ran/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=chaxus/ran" alt="Contributors" />
</a>

![](http://profile-counter.glitch.me/chaxus-ran/count.svg)

## 📄 Licencia

Este proyecto se publica bajo la licencia MIT; los detalles están en el archivo [LICENSE](LICENSE).

---

<div align="center">
  <p>Hecho con ❤️ por la comunidad de Ran</p>
  <p>Si el proyecto te ayuda a aprender, dale una ⭐️</p>
</div>
