import fs from "node:fs";
import path from "node:path";
import postcss from "postcss";

function isInsideRoot(rule) {
  return (
    rule.selectors.length !== 1 ||
    rule.selectors[0] !== ":root" ||
    rule.parent.type !== "root"
  );
}

function isVariableDeclaration(decl) {
  return Boolean(decl.value) && decl.prop.startsWith("--");
}

function parse(css, options) {
  const root = postcss.parse(css, {
    from: options.from,
    parser: options.parser,
  });

  const variables = {};
  root.walkRules((rule) => {
    if (isInsideRoot(rule)) {
      return;
    }

    rule.each((decl) => {
      if (isVariableDeclaration(decl)) {
        const name = decl.prop.slice(2);
        variables[name] = decl.value;
      }
    });
  });
  return variables;
}

function parseFileSync(fileName, options) {
  const css = fs.readFileSync(fileName, "utf-8");
  return parse(css, { ...options, from: fileName });
}

function themeReplacements() {
  const fileName = path.resolve(__dirname, "./_theme.scss");
  const variables = parseFileSync(fileName, {
    parser: "postcss-scss",
  });
  return Object.entries(variables).reduce((memo, e) => {
    memo[`var(--${e[0]})`] = e[1];
    return memo;
  }, {});
}

function borderReplacements() {
  const fileName = path.resolve(__dirname, "./_border_radius.scss");
  const variables = parseFileSync(fileName, {
    parser: "postcss-scss",
  });
  return Object.entries(variables).reduce((memo, e) => {
    memo[`var(--${e[0]})`] = e[1];
    return memo;
  }, {});
}

function widthReplacements() {
  const fileName = path.resolve(__dirname, "./_width.scss");
  const variables = parseFileSync(fileName, {
    parser: "postcss-scss",
  });
  return Object.entries(variables).reduce((memo, e) => {
    memo[`var(--${e[0]})`] = e[1];
    return memo;
  }, {});
}

function normalize(config) {
  const r = {};
  Object.keys(config).forEach((firKey) => {
    const colorVal = config[firKey];
    const key = firKey
      .replace("var(--", "")
      .replace(")", "")
      .replace(/-/g, "_");
    if (Array.isArray(colorVal)) {
      colorVal.forEach((v) => {
        r[`${firKey}_${v}`] = `var(--${firKey.replace(/_/g, "-")}-${v})`;
      });
    } else {
      r[key] = firKey;
    }
  });
  return r;
}

export { themeReplacements, normalize, borderReplacements, widthReplacements };
