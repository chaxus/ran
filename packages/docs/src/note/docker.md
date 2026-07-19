# Docker

Check whether `docker` is running:

1. Find the `PID` of the `Docker` daemon:

```sh
ps -ef | grep docker
```

If the output contains a line with `/usr/local/bin/dockerd` (or a similar path) and shows a numeric `PID`, the `Docker` daemon is running.

2. Use `docker ps`

`docker ps` is mainly for listing running containers, but if the `Docker` service isn't running it returns an error. So you can also run it and watch the output to tell whether `Docker` is up.

If the service is running, it lists all running containers (or just the header row when none are running). If the service is down, you'll see an error such as `Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?`.

3. Use `docker info`

`docker info` prints detailed information about the `Docker` system — the number of containers and images, the `Docker` version, and more. If the service is running, this command outputs normally; otherwise you'll see an error similar to `docker ps`.

Install Docker from: `https://hub.docker.com/`

## Images

`Docker` packages an application and its dependencies into an `image` file. Only through this file can a `Docker` container be created — an `image` is essentially a template for containers. `Docker` creates container instances from an `image`, and the same `image` can spawn multiple containers running at the same time.

An `image` is a binary file. In practice, an `image` is usually built by inheriting from another `image` and adding some customizations.

```shell
# Search for an image
$ docker search [keywords]
# List all local image files
$ docker image ls
# Remove an image file
$ docker image rm [imageName]
$ docker image rmi [imageID]
```

### Pull an image from a registry

- Pull an `image` from a registry to the local machine:

```shell
$ docker image pull library/hello-world
# docker image pull fetches an image file. library/hello-world is the image location in the registry:
# library is the group the image belongs to, and hello-world is the image name.

# Official images all live under library, which is the default group and can be omitted:
# $ docker image pull hello-world
```

- After a successful pull, the `image` file is visible locally:

```shell
$ docker image ls
```

- Run / create a container from the `image`:

```shell
$ docker container run hello-world
# docker container run creates a running container from an image file.
# If the image isn't present locally it is fetched automatically, so docker image pull isn't strictly required.
```

- `docker container run` creates a new container every time it runs. To reuse an existing (created or stopped) container:

```shell
# Start an already-created or stopped container
$ docker container start [containerID]
```

- View a container's output:

```shell
# Show the output of a docker container
$ docker container logs [containerID]
# Use this when docker run was started without the -it flag
```

- Enter a running container:

```shell
# When docker run was started without -it, use this to get a shell inside the container
$ docker container exec -it [containerID] /bin/bash
```

- Stop a container:

```shell
# Kill the container immediately
$ docker container kill [containerID]
# Stop the container gracefully (may run cleanup, so it doesn't always stop instantly)
$ docker container stop [containerID]
```

## Container

- A container instance created from an `image` is itself a file, called a container file.
- Once a container is created, two files exist together: the `image` file and the container file. Stopping a container does not delete the container file — it only stops running.

```shell
# List running containers on this machine
$ docker container ls
# List all containers, including stopped ones
$ docker container ls --all
```

- Stopped container files still take up disk space. You can delete them; after deletion they no longer appear in the list.

```shell
$ docker container rm [containerID]
```

### Create a container

- `docker container run` creates a container from an `image` file:

```shell
$ docker container run -p 8000:3000 -it koa-demo /bin/bash
# or
$ docker container run -p 8000:3000 -it koa-demo:0.0.1 /bin/bash
# -p: map the container's port 3000 to the host's port 8000
# -it: connect the container's shell to the current shell, so commands you type are passed into the container
# koa-demo:0.0.1: the image name (add the tag if there is one; the default tag is latest)
# /bin/bash: the first command run inside the container after it starts — here it launches Bash so you get a shell
```

- Now you're inside the container and can run commands:

```shell
root@66d80f4aaf1e:/app# node demos/01.js
```

- Note that the node process runs inside Docker's virtual environment; the file system and network interfaces it sees are virtual and isolated from the host, which is why you need to define port mappings between the container and the host.
- Stop the container and free memory:

```shell
# In the container shell, press Ctrl + C to stop the node process, then Ctrl + D (or type exit) to leave the container
# Or use docker container kill to terminate it
# You may need another host terminal to look up the container ID
$ docker container ls
# or
$ docker container ls --all
# Stop the container
$ docker container kill [containerID]
# A stopped container doesn't disappear; you need to delete the container file
# Delete a specific container file
$ docker container rm [containerID]
# or
# Use --rm to auto-delete the container file once it stops
$ docker container run --rm -p 8000:3000 -it koa-demo /bin/bash
```

## Dockerfile

- A text file used to configure an `image`. `Docker` builds the binary `image` file from it.
- First grab a project:

```shell
$ git clone https://github.com/ruanyf/koa-demos.git
$ cd koa-demos
```

- Inside the project, write a `.dockerignore` file. The three paths below should be excluded and not packaged into the `image`:

```shell
.git
node_modules
npm-debug.log
```

- Create a `Dockerfile` in the root:

```shell
FROM node:8.4
# This image inherits the official node image; the colon marks the tag — node version 8.4 here
COPY . /app
# Copy everything in the current directory (except .dockerignore exclusions) into /app in the image
WORKDIR /app
# Set the working directory for the following steps to /app
RUN npm install
# Run npm install under /app. All installed dependencies get baked into the image
EXPOSE 3000
# Expose the container's port 3000 so external connections are allowed
```

- With a `Dockerfile` in place, build the `image` with `docker image build`:

```shell
$ docker image build -t koa-demo .
# -t sets the image name; the trailing . is the path to the Dockerfile (the current directory here)
# or
$ docker image build -t koa-demo:0.0.1 .
# You can append a tag with a colon. If omitted, the default tag is latest.
# Once it succeeds, check with docker image ls
```

## CMD

- A command that runs when the container starts, such as the `node demos/01.js` we ran manually above. You can put it in the `Dockerfile`:

```shell
FROM node:8.4
COPY . /app
WORKDIR /app
RUN npm install --registry=https://registry.npmmirror.com
EXPOSE 3000
# Runs automatically after the container starts
CMD node demos/01.js
```

- Difference between `CMD` and `RUN`:
  - `RUN` executes during the image build; its results are baked into the image file
  - `CMD` executes after the container starts
  - A Dockerfile can have multiple `RUN` commands but only one `CMD`
  - Once `CMD` is set, `docker container run` can't append a command (such as the earlier `/bin/bash`), otherwise it overrides `CMD`:

```shell
$ docker container run --rm -p 8000:3000 -it koa-demo:0.0.1
```

## Troubleshooting

1. If Docker Desktop can't sign in, try `docker login`. Signing in from the command line prints a clearer error; if it's a network problem, switch to a different proxy.
2. `Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?`

```shell
# The docker service isn't started
$ service docker start
```

## References

- [Docker getting-started tutorial](http://www.ruanyifeng.com/blog/2018/02/docker-tutorial.html)
- [Understanding Docker from zero](https://juejin.cn/post/6844903591375814669)
- [Docker official site](https://docs.docker.com)
- [Docker application deployment](https://juejin.cn/post/6844904167610253326#heading-18)
- [No vim inside Docker](https://www.cnblogs.com/river2005/p/8503238.html)
- [Configuring a domestic apt-get source](https://www.jianshu.com/p/fb337765c2c2)
- [Front-end engineer Docker tutorial — hands-on](https://juejin.cn/post/6844903956305412109)
- [Docker won't stop after starting](https://www.jianshu.com/p/ca63b6c8fdf1)
- [Docker advanced series: docker-compose / swarm / stack / secret / config](https://juejin.cn/post/6967598675820281870#heading-8)
- [docker-compose getting-started guide](https://juejin.cn/post/6886018425353682951)
- [Deleting a Docker image](https://www.cnblogs.com/vipsoft/p/12447059.html)
