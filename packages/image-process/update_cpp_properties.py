import os
import re
import json

# Function to extract include paths from conandeps.cmake
def extract_include_paths(cmake_file):
    include_paths = []
    with open(cmake_file, 'r') as file:
        for line in file:
            match = re.match(r'set\(CONAN_INCLUDE_DIRS_(.*?) "([^"]+)"\)', line)
            if match:
                paths = match.group(2).split()
                include_paths.extend(paths)
    return include_paths

# Paths
project_root = '../../..'  # Relative path to the root of the project
cpp_properties_path = os.path.join(project_root, 'ran/.vscode/c_cpp_properties.json')
conan_cmake_path = os.path.join('build/conan/conandeps.cmake')

# Ensure the c_cpp_properties.json file exists
if not os.path.exists(cpp_properties_path):
    raise FileNotFoundError(f"{cpp_properties_path} does not exist. Please create the file first.")

# Ensure the conandeps.cmake file exists
if not os.path.exists(conan_cmake_path):
    raise FileNotFoundError(f"{conan_cmake_path} does not exist. Please run 'conan install' to generate the file.")

# Load c_cpp_properties.json
with open(cpp_properties_path, 'r') as f:
    cpp_properties = json.load(f)

# Extract include paths from conandeps.cmake
conan_include_paths = extract_include_paths(conan_cmake_path)

# Update includePath with Conan include paths
cpp_properties['configurations'][0]['includePath'].extend(conan_include_paths)

# Save updated c_cpp_properties.json
with open(cpp_properties_path, 'w') as f:
    json.dump(cpp_properties, f, indent=4)

print("Updated c_cpp_properties.json with Conan include paths.")
