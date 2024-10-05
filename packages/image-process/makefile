# 定义编译器
CC = gcc

# 定义路径
PROJECT_DIR := $(shell pwd)
INCLUDE_DIR := $(PROJECT_DIR)/libs/include
LIB_DIR := $(PROJECT_DIR)/libs/lib/libvips

# 使用 pkg-config 获取 glib 的编译和链接选项
PKG_CONFIG := pkg-config
GLIB_CFLAGS := $(shell $(PKG_CONFIG) --cflags glib-2.0)
GLIB_LDFLAGS := $(shell $(PKG_CONFIG) --libs glib-2.0)

# 将包含路径添加到 CFLAGS
CFLAGS = -I$(INCLUDE_DIR) $(GLIB_CFLAGS)

# 定义链接选项
LDFLAGS = -L$(LIB_DIR) -lvips $(GLIB_LDFLAGS)

# 定义目标文件
TARGET = main

# 定义源文件
SRCS = main.c

# 定义目标文件的生成规则
$(TARGET): $(SRCS)
	$(CC) -o $(TARGET) $(SRCS) $(CFLAGS) $(LDFLAGS)

# 定义清理规则
.PHONY: clean
clean:
	rm -f $(TARGET)
