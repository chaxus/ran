cmake_minimum_required(VERSION 3.15)
project(image-process)

# Set directory for Conan's generated files
set(CONAN_CMAKE_DIR ${CMAKE_BINARY_DIR}/cmake)

# Include Conan's generated files
include(${CONAN_CMAKE_DIR}/conandeps.cmake)
include(${CONAN_CMAKE_DIR}/conan_toolchain.cmake)

# Add your project files
add_executable(image-process main.c)

# Link against Conan dependencies
target_link_libraries(image-process ${CONAN_LIBS})
