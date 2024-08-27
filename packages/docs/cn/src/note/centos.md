# CentOS

查看当前系统的版本：

```sh
cat /etc/centos-release
```

## YUM

YUM 是 Yellowdog Updater, Modified 的缩写，虽然不是 CentOS 开发的，但已成为 CentOS 系统中常用的包管理工具。YUM 作为 RPM 的前端程序，解决了 RPM 软件包之间的依赖性问题，并提供了更加便捷的软件包管理方式。

### YUM 仓库源

CentOS 8 的官方支持已经结束，但您仍然可以使用 CentOS Stream 8 或其他第三方仓库。如果您正在使用 CentOS 8，并且希望继续使用类似的仓库，可以考虑切换到 CentOS Stream 8。

#### 1.替换镜像源

由于众所周知的原因，访问官方镜像会非常慢，所以

修改 /etc/yum.repos.d/CentOS-AppStream.repo 文件（或相应的仓库配置文件），将 baseurl 或 mirrorlist 指向一个可用的源。

我个人尝试，发现需要修改三个文件：

```sh
/etc/yum.repos.d/CentOS-Base.repo
/etc/yum.repos.d/CentOS-AppStream.repo
/etc/yum.repos.d/CentOS-Extras.repo
```

修改文件内容：

```sh
[baseos]
name=CentOS-8 - Base
baseurl=http://vault.centos.org/8.5.2111/BaseOS/$basearch/os/
gpgcheck=1
enabled=1
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-centosofficial

[appstream]
name=CentOS-8 - AppStream
baseurl=http://vault.centos.org/8.5.2111/AppStream/$basearch/os/
gpgcheck=1
enabled=1
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-centosofficial

[extras]
name=CentOS-8 - Extras
baseurl=http://vault.centos.org/8.5.2111/extras/$basearch/os/
gpgcheck=1
enabled=1
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-centosofficial
```

更新缓存并重试

1. 清理缓存：`yum clean all`
2. 生成新的缓存：`yum makecache`
3. 更新系统：`yum update`
