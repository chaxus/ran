# Bundler

Using `Bundler`:
Pass in the `options` parameter

```
function build(options: Options):Promise<Build> {
  const bundle = new Bundle({
    entry: options.input
  });
  return bundle.build().then(() => {
    return {
      generate: () => bundle.render()
    };
  });
}
```

Architecture diagram

![](../../../assets/article/bundle/bundle.png)
