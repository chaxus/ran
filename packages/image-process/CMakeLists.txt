cmake_minimum_required(VERSION 3.15)
project(image-process)

# Set directory for Conan's generated files
set(CONAN_CMAKE_DIR ${CMAKE_BINARY_DIR}/conan)

# Glob all .c and .h files in the src directory
file(GLOB_RECURSE SOURCE_FILES src/*.c src/*.h)

# Add your project files
add_executable(image-process main.c ${SOURCE_FILES})

# Find and link Conan dependencies
find_package(libvips REQUIRED)

target_link_libraries(image-process glib::glib libvips::libvips)
