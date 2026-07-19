# CentOS

Check the current system version:

```sh
cat /etc/centos-release
```

## YUM

YUM is short for Yellowdog Updater, Modified. Although it wasn't developed by CentOS, it has become the go-to package manager on CentOS systems. As a front-end to RPM, YUM resolves dependencies between RPM packages and provides a more convenient way to manage software.

### YUM repositories

Official support for CentOS 8 has ended, but you can still use CentOS Stream 8 or other third-party repositories. If you are on CentOS 8 and want to keep using similar repositories, consider switching to CentOS Stream 8.

#### 1. Replace the mirror source

For well-known reasons, reaching the official mirrors can be very slow.

Edit `/etc/yum.repos.d/CentOS-AppStream.repo` (or the corresponding repo config file) and point `baseurl` or `mirrorlist` at a reachable source.

In my own attempts, three files needed to be changed:

```sh
/etc/yum.repos.d/CentOS-Base.repo
/etc/yum.repos.d/CentOS-AppStream.repo
/etc/yum.repos.d/CentOS-Extras.repo
```

Update their contents:

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

Refresh the cache and retry:

1. Clean the cache: `yum clean all`
2. Rebuild the cache: `yum makecache`
3. Update the system: `yum update`
