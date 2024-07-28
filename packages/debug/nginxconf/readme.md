
1. 使用命令行参数指定配置文件路径

```sh
nginx -c /path/to/your/nginx.conf
```

请注意，当您使用 -c 参数时，Nginx 将仅加载您指定的配置文件，而不会加载任何其他通过 include 指令包含的文件（除非这些 include 指令位于您指定的配置文件中）。因此，请确保您的自定义配置文件中包含了所有必要的设置和 include 指令。

在启动之前，可以先通过`-t`测试一下：

```sh
nginx -t -c /path/to/your/nginx.conf
```
重启
```sh
nginx -s reload
```

另外，如果您已经运行了 Nginx 实例，并且想要更改其配置而无需完全停止并重新启动服务，您可以使用 nginx -s reload 命令，但前提是您的主配置文件（或您通过 -c 参数指定的配置文件）已经更改，并且 Nginx 能够重新加载这些更改。不过，请注意，nginx -s reload 命令不会直接接受 -c 参数来指定一个新的配置文件；它只会重新加载当前正在使用的配置文件（或您通过 Nginx 的启动脚本/服务管理器指定的配置文件）的更改。

2. 配置本地 DNS 解析

由于 nginx 配置的 server_name 往往是一个真实的域名，你的本地机器默认会尝试通过互联网解析它。为了让你在本地开发环境中测试反向代理，你需要确保当在本地机器上访问这个域名时，它会被解析到 127.0.0.1（即 localhost）。

有几种方法可以实现这一点，包括修改 /etc/hosts 文件或在你的 DNS 服务器中设置条目（如果你正在使用本地 DNS 服务器）。

```sh
cat /etc/hosts
```

在文件末尾添加一行，将域名映射到 localhost：

```sh
127.0.0.1 server_name
```

保存并关闭文件。现在，当你尝试在浏览器中访问 server_name 域名时，请求应该会被转发到你的本地 localhost:5555。

注意：确保 localhost:5555 上有一个正在运行的服务器，以便 Nginx 可以成功转发请求。

3. 启动

进入 Nginx 安装目录的 sbin 文件夹：通常 Nginx 的可执行文件位于/usr/local/nginx/sbin（具体路径可能因安装方式和操作系统而异）。
执行重启命令：在 sbin 目录下，执行./nginx -s reload 命令。这条命令会优雅地重启 Nginx 服务，即不会立即关闭已经建立的连接，而是等待现有请求处理完成后，重新加载配置文件并启动新的工作进程。

使用 brew 服务命令：

```sh
brew services restart nginx
```

直接使用 Nginx 命令：

你也可以直接使用 Nginx 的-s 参数来停止服务。有两种停止方式：

快速停止（不等待处理完当前请求）：
```sh
sudo nginx -s stop
```
优雅停止（等待处理完当前请求后再停止）：
```sh
sudo nginx -s quit
```
4. 关闭

进入 Nginx 安装目录的 sbin 文件夹（如果尚未进入）。
执行关闭命令：可以使用./nginx -s stop 命令来快速停止 Nginx 服务，这将立即关闭所有连接。另外，./nginx -s quit 命令会等待所有请求处理完成后才停止服务，这是一种更优雅的关闭方式。

在某些情况下，你可能需要手动停止 Nginx 服务。这通常涉及到找到 Nginx 的主进程号（PID），并使用 kill 命令发送相应的信号来停止进程。

查找 Nginx 主进程的 PID：可以使用 ps 命令结合 grep 来查找，如：
```sh
ps -ef | grep nginx
```
发送停止信号：根据找到的 PID，使用 kill 命令发送 TERM（快速停止）或 INT（优雅停止）信号。例如，kill -TERM <pid>或 kill -INT <pid>。此外，kill -HUP <pid>也可以用于平滑重启 Nginx，但这实际上是发送了一个挂起信号，而不是停止信号。

使用 brew 服务命令：

关闭 Nginx 服务的最简单方式同样是使用 brew 提供的服务管理命令。在终端中输入以下命令：

```sh
brew services stop nginx
```

Nginx 的配置文件通常遵循以下结构：

```sh
# 全局块

events {
    # events 块
}

http {
    # http 块

    server {
        # server 块

        location / {
            # location 块
        }

        # 更多的 location 块
    }

    # 更多的 server 块
}

# 注意：server 指令必须嵌套在 http 块中
```

查看状态：

```sh
ps aux | grep nginx
```
