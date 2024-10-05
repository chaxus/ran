cmake_minimum_required(VERSION 3.15)
project(image-process)

# Set directory for Conan's generated files
set(CONAN_CMAKE_DIR ${CMAKE_BINARY_DIR}/conan)

# Include Conan's toolchain file
include(${CMAKE_BINARY_DIR}/conan/conan_toolchain.cmake)

# Add your project files
add_executable(image-process main.c)

# Find and link Conan dependencies
find_package(glib REQUIRED)
find_package(libvips REQUIRED)

target_link_libraries(image-process glib::glib libvips::libvips)
