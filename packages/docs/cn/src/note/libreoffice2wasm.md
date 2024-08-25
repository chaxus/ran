# 项目地址：

```sh
git clone https://git.libreoffice.org/core
```

github 地址：`https://github.com/LibreOffice/core/blob/master/static/README.wasm.md`

# 遇到问题：

1. 执行 `./autogen.sh`报错，提示`Failed to run aclocal at ./autogen.sh line 195.`

```sh
brew install automake
```

安装完成后，执行`aclocal --version`或者`automake --version`检查是否安装完成

2. 执行 `./autogen.sh`遇到报错：

```sh
checking the GNU Make version... configure: error: failed (/usr/bin/make version >= 4.0 needed)
Error running configure at ./autogen.sh line 323.
```

通过 `make --version` 检查 make 的版本，执行 `brew install make`，再执行 `brew upgrade` 进行升级。确保 `make`的版本大于 `4.0`

当使用 `brew` 安装 `GNU Make` 时，它通常会被命名为 `gmake` 而不是 `make` ，以区分于 `macOS` 系统自带的 `BSD Make`。如果你希望在使用 `make` 命令时实际上调用 `gmake` ，需要进行一些特殊处理来替换或设置别名。

在.zshrc 文件中添加如下行：

```sh
# Configure the brew installation of gmake, alias to make
alias make='gmake'
```

然后，保存文件并重新加载配置文件（通过 `source ~/.zshrc` 或重新打开终端）。

在项目中搜索并替换成：

```sh
# args.makecmd = '/usr/bin/make'
args.makecmd = '/opt/homebrew/bin/gmake'
```
