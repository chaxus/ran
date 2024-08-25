# docker

查询 `docker` 是否在运行：

1. 输入以下命令来查找 `Docker` 守护进程的 `PID`（进程 `ID`）：

```sh
ps -ef | grep docker
```

如果命令返回了包含`/usr/local/bin/dockerd`（或类似路径）的行，并且 `PID` 列有数字显示，那么 `Docker` 守护进程正在运行。

2. 使用 `docker ps` 命令

虽然 `docker ps` 命令主要用于列出正在运行的容器，但如果 `Docker` 服务没有运行，该命令会返回一个错误消息。因此，你也可以通过运行该命令并观察输出来判断 `Docker` 服务是否启动。

如果 `Docker` 服务正在运行，该命令将列出所有正在运行的容器（如果没有运行的容器，则可能只显示表头）。如果 `Docker` 服务没有运行，你将看到一个错误消息，如`“Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?”`。

3. 使用 `docker info` 命令

`docker info` 命令提供 `Docker` 系统的详细信息，包括容器数量、镜像数量、`Docker` 版本等。如果 `Docker` 服务正在运行，该命令将正常输出这些信息。

如果 `Docker` 服务正在运行，你将看到一系列关于 Docker 系统的信息。如果 Docker 服务没有运行，你将看到一个错误消息，与 docker ps 命令类似。

安装 `docker` 的网站：`https://hub.docker.com/`

## images

`Docker` 把应用程序及其依赖，打包在 `image` 文件里面。只有通过这个文件，才能生成 `Docker` 容器。`image` 文件可以看作容器的模板。`Docker` 根据 `image` 文件生成的容器实例。同一个 `image` 文件，可以生成多个同时运行的容器实例

`image` 是二进制文件。实际开发过程中，一个 `image` 文件往往通过继承另一个 `image` 文件，再加上一些个性化的设置而成。

```shell
# 搜索镜像
$ docker search [keywords]
# 列出本机所有的image文件
$docker image ls
# 删除image文件
$docker image rm [imageName]
$docker image rmi [imageID]
```

### 从仓库拉取镜像

- 将 `image` 文件从仓库拉到本地

```shell
$ docker image pull library/hello-world
# docker image pull 是抓去image文件的命令。library/hello-world是image仓库的位置
# 其中library是image文件所在的组，hello-world是image文件的名字

# 由于官方提供的image文件，都在library里面，所以它是默认组，可以省略
# 因此$ docker image pull hello-world
```

- 抓取成功后，可以在本机看到这个 `image` 文件

```shell
$ docker image ls
```

- 运行/创建这个 `image` 文件

```shell
$ docker container run hello-world
# docker container run 命令会从image文件，生成一个正在运行的容器
# 如果没有指定image文件，会从仓库自动抓取，docker image pull 不是必须
```

- 运行 `image` 文件 (重复使用容器)，`docker container run` 会新建容器，每运行一次，就会新建一个容器

```shell
# 用来启动已生成，或者已经停止的容器文件
$ docker container start [containerID]
```

- 查看 `docker` 容器的输出

```shell
# 命令用来查看docker容器的输出
$ docker container logs [containerID]
# docker run 命令运行容器的时候，没有-it参数，就药用这个来输出
```

- 进入一个正在运行的 `docker` 容器

```shell
# 如果docker run 命令运行容器的时候，没有使用-it参数，就可以使用这个进入容器
$ docker container exec -it [containerID] /bin/bash
```

- 关闭容器

```shell
# 终止容器的运行，强行立即终止
$ docker container kill [containeId]
# 终止容器的运行，会自动进行收尾工作，可能不会终止
$ docker container stop [containerId]
```

## container

- `image` 文件生成的容器实例，本身也是一个文件，称为容器文件。
- 一旦容器生成，就会同时存在两个文件：`image` 文件和容器文件。关闭容器并不会删除容器文件，只是容器停止运行而已

```shell
# 列出本机正在运行的容器
$ docker container ls
# 列出本机所有的容器，包括终止运行的容器
$ docker container ls --all
```

- 终止运行的容器文件，依然会占据硬盘空间，可以删除，删除完再查看就没有了

```shell
$ docker container rm [containerID]
```

### 生成容器

- `docker container run` 命令会从 `image` 文件生成容器

```shell
$ docker container run -p 8000:3000 -it koa-demo /bin/bash
# 或者
$ docker container run -p 8000:3000 -it koa-demo:0.0.1 /bin/bash
# -p 参数：容器的3000端口映射到本机器的8000端口
# -it 参数：容器的shell映射到当前的shell，然后你在本机窗口输入命令，就会传入容器
# koa-demo:0.0.1 image文件的名字（如果有标签，还需要提供标签，默认是latest标签）
# /bin/bash: 容器启动以后，内部第一个执行的命令。这里是启动Bash，保证用户可以使用Shell。
```

- 这就表示在容器里面了，可以执行命令了

```shell
root@66d80f4aaf1e:/app# node demos/01.js
```

- 需要注意的是，node 进程运行在 Docker 容器的虚拟环境里面，进程接触到的文件系统和网络接口都是虚拟的，与本机的文件系统和网络接口是隔离的，因此需要定义容器与物理机的端口映射
- 停止容器，释放内存

```shell
# 在容器的命令行，通过Ctrl + c停止node进程，然后Ctrl + d（或者输入exit）退出容器
# 或者使用docker container kill终止容器运行
# 可能需要本机的另一个终端窗口，查看容器的ID
$ docker container ls
# 或
$ docker container ls --all
# 停止容器的运行
$ docker container kill [containerID]
# 容器停止运行后，并不会消失，需要删除容器文件
# 删除指定容器文件
$ docker container rm [containerID]
# 或
# 通过--rm参数，在容器终止运行后自动删除容器文件
$ docker container run --rm -p 8000:3000 -it koa-demo /bin/bash
```

## DockerFile

- 一个文本文件，用来配置 `image`。`Docker` 根据该文件生成二进制的 `image` 文件
- 先获取一个项目

```shell
$ git clone https://github.com/ruanyf/koa-demos.git
$ cd koa-demos
```

- 进入项目，编写 `.dockerignore` 文件。指的是下面三个路径要排除，不要打包进入 `image` 文件。

```shell
.git
node_modules
npm-debug.log
```

- 根目录下新建一个文本文件 `Dockerfile`。

```shell
FROM node:8.4
# 该image文件继承官方的node image，冒号表示标签，这是8.4版本的node
COPY . /app
# .是当前目录下的所有文件(除了.dockerignore排除的文件)，都拷贝进入image文件的/app目录
WORKDIR /app
# 指定接下来的工作路径为/app
RUN npm install
# 在/app目录下，运行npm install命令安装依赖。注意，安装后所有的依赖，都将打包进入image文件
EXPOSE 3000
# 将容器的3000端口暴露出来，允许外部连接这个端口
```

- 有了 `Dockerfile` 文件以后，就可以使用 `docker image build` 命令创建 `image` 文件了。

```shell
$ docker image build -t koa-demo .
# 用-t参数来制定image文件的名字，最后的 . 代表Dockerfile文件所在的路径，因为是当前路径
# 或者
$ docker image build -t koa-demo:0.0.1 .
# 后面还可以用冒号指定标签。如果不指定，默认标签就是latest。
# 运行成功就可以用 docker image ls 来查看了
```

## CMD 命令

- 可以随着容器的启动而执行的命令，比如上个例子手动执行的 `node demos/01.js`。可以把这个命令写在 `Dockerfile` 里面

```shell
FROM node:8.4
COPY . /app
WORKDIR /app
RUN npm install --registry=https://registry.npm.taobao.org
EXPOSR 3000
# 表示容器启动后自动执行
CMD node demos/01.js
```

- CMD 命令和 RUN 命令的区别
  - RUN 命令在 image 文件的构建阶段执行，执行结果都会打包进行 image 文件
  - CMD 命令是容器启动后执行
  - 一个 dockerfile 可以有多个 RUN 命令，但只有一个 CMD 命令
  - 指定了 CMD 命令后，docker container run 命令就不能附加命令了 (比如前面的/bin/bash)，否则他会覆盖 CMD 命令，现在可以使用

```shell
$ docker container run --rm - p 8000:3000 -it koa-demo:0.0.1
```

# 问题：

1. 如果遇到 docker desktop 登录不上，可以尝试 `docker login`进行登录，命令行登录会输出错误的信息，如果发现是网络问题，换一个代理即可。
2. `Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?`

```shell
# docker服务没有启动
$ service docker start
```

## 参考资料

- [docker 入门教程](http://www.ruanyifeng.com/blog/2018/02/docker-tutorial.html)
- [从 0 开始了解 Docker](https://juejin.cn/post/6844903591375814669)
- [docker 官网](https://docs.docker.com)
- [docker 应用部署](https://juejin.cn/post/6844904167610253326#heading-18)
- [docker 里面没有 vim](https://www.cnblogs.com/river2005/p/8503238.html)
- [apt-get 配置国内源](https://www.jianshu.com/p/fb337765c2c2)
- [前端工程师 docker 教程 - 实战篇](https://juejin.cn/post/6844903956305412109)
- [docker 启动后不会停止的问题](https://www.jianshu.com/p/ca63b6c8fdf1)
- [docker 进阶系列/docker-compose/swarm/stack/secret/config](https://juejin.cn/post/6967598675820281870#heading-8)
- [docker-compose 入门指南](https://juejin.cn/post/6886018425353682951)
- [docker 删除 image](https://www.cnblogs.com/vipsoft/p/12447059.html)
