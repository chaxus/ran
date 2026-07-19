## Project Repository:

```sh
git clone https://git.libreoffice.org/core
```

GitHub address: `https://github.com/LibreOffice/core/blob/master/static/README.wasm.md`

## Containerized Environment

Since this is a `c/c++` project, the build process requires a lot of system-level configuration. If your current machine doesn't support it, it's not recommended to force compatibility. You can containerize the environment instead.

For example, using one of the most common server systems:

```sh
docker image pull ubuntu
```

Once the download is complete, you can build a service:

```sh
docker container run -p 30105:30105 --name=alit -itd ubuntu /bin/bash
```

After the build and startup succeed, you can check the running status with `docker container ls`:

```sh
CONTAINER ID   IMAGE     COMMAND       CREATED         STATUS         PORTS                      NAMES
efd831ab0ba8   ubuntu    "/bin/bash"   5 seconds ago   Up 4 seconds   0.0.0.0:30105->30105/tcp   alit
```

Then move the project into the container:

```sh
docker cp ./core alit:/home
# Overall, the project is quite large
# Successfully copied 3.59GB to alit:/home
```

Enter the container to proceed.

```sh
docker exec -it alit /bin/bash
```

This way, you can isolate the development build environment from your computer's system, preventing unsafe system-level operations.

## Install the Necessary Dependencies:

````sh
dnf install -y git cmake python3 nodejs

## Issues Encountered:

1. Running `./autogen.sh` fails with the error `Failed to run aclocal at ./autogen.sh line 195.`

```sh
brew install automake
````

After installation, run `aclocal --version` or `automake --version` to check whether the installation succeeded.

2. Running `./autogen.sh` results in the following error:

```sh
checking the GNU Make version... configure: error: failed (/usr/bin/make version >= 4.0 needed)
Error running configure at ./autogen.sh line 323.
```

Check the `make` version with `make --version`, run `brew install make`, then run `brew upgrade` to upgrade it. Make sure the `make` version is greater than `4.0`.

When you install `GNU Make` via `brew`, it's usually named `gmake` instead of `make`, to distinguish it from the `BSD Make` that ships with `macOS`. If you want the `make` command to actually invoke `gmake`, you need some special handling to replace it or set up an alias.

Add the following line to your .zshrc file:

```sh
# Configure the brew installation of gmake, alias to make
alias make='gmake'
```

Then save the file and reload the configuration (via `source ~/.zshrc` or by reopening the terminal).

Search the project and replace it with:

```sh
# args.makecmd = '/usr/bin/make'
args.makecmd = '/opt/homebrew/bin/gmake'
```

After the build finishes, locate the executable file:

```sh
find . -name soffice
```

Then run

```sh
/home/core/instdir/program/soffice --headless --convert-to pdf /home/office/pptx.pptx
```

Compiling LibreOffice to WebAssembly and running a specific command on the Web (such as soffice --headless --convert-to pdf /home/office/pptx.pptx) is a complex task. Below is a rough outline of the implementation steps and approach:

1. Compile LibreOffice to WebAssembly
   Assume you've already successfully compiled LibreOffice and generated the .wasm file and related JavaScript files.

2. Create the HTML and JavaScript Files
   Create an HTML file to load the WebAssembly module, and write JavaScript code to invoke the soffice command.

HTML file (index.html)

```html
<!doctype html>
<html>
  <head>
    <title>LibreOffice WebAssembly</title>
    <script src="libreoffice.js"></script>
  </head>
  <body>
    <input type="file" id="fileInput" />
    <button onclick="convertToPDF()">Convert to PDF</button>
    <script src="main.js"></script>
  </body>
</html>
JavaScript file (main.js) // Initialize the Module var Module = { onRuntimeInitialized: function() {
console.log("LibreOffice WebAssembly Module Loaded"); } }; // Function to convert file to PDF function convertToPDF() {
var fileInput = document.getElementById('fileInput'); if (fileInput.files.length == 0) { alert("Please select a file.");
return; } var file = fileInput.files[0]; var reader = new FileReader(); reader.onload = function(event) { var
arrayBuffer = event.target.result; var byteArray = new Uint8Array(arrayBuffer); // Write the file to the WASM virtual
file system var filename = '/home/office/' + file.name; Module.FS_createDataFile('/', filename, byteArray, true, true);
// Call the soffice command var command = 'soffice --headless --convert-to pdf ' + filename; Module.ccall( 'system', //
name of C function 'number', // return type ['string'], // argument types [command] // arguments ); // Read the output
PDF file var outputFilename = '/home/office/' + file.name.replace(/\.[^/.]+$/, "") + '.pdf'; var output =
Module.FS_readFile(outputFilename); // Create a blob and a link to download the PDF var blob = new Blob([output], {
type: 'application/pdf' }); var link = document.createElement('a'); link.href = window.URL.createObjectURL(blob);
link.download = file.name.replace(/\.[^/.]+$/, "") + '.pdf'; link.click(); }; reader.readAsArrayBuffer(file); }
```

3. Deploy and Test
   Deploy the generated .wasm file, JavaScript files, and HTML file to your Web server, open the index.html file, select a PPTX file, and click the "Convert to PDF" button. This process will:

Read the PPTX file from the file input.
Write the file into the WebAssembly module's virtual file system.
Invoke the soffice --headless --convert-to pdf command to perform the conversion.
Read the generated PDF file from the virtual file system.
Create a download link, allowing the user to download the generated PDF file.4. Notes
This process may require a large amount of memory and computing resources, and may need optimization and tuning.
You need to make sure Emscripten's file system (MEMFS) can correctly handle large files.
You need to handle possible errors and exceptions, and provide user-friendly error messages.
By following these steps, you should be able to call the soffice command on the Web and convert a PPTX file to PDF. If you run into specific issues, please provide detailed error information so we can better help you resolve them.

Reducing the size of a WebAssembly file is a common requirement, especially when dealing with a large project like LibreOffice. If you only need specific functionality (such as converting files to PDF), you can use the following approaches to reduce the size of the generated WebAssembly file:

1. Trim Down Functional Modules
   Make sure you only compile the functional modules you need. You've already specified --with-main-module=writer in autogen.input, which limits the modules being compiled, but you can trim it down further.

2. Remove Unnecessary Components
   In autogen.input, further disable unnecessary components and features. For example:

--disable-dbus
--disable-odk
--disable-postgresql-sdbc
--disable-firebird-sdbc
--disable-coinmp
--disable-cve-tests
--disable-gtk3
--disable-gstreamer-1-0
--disable-kf5
--disable-scripting-beanshell
--disable-scripting-javascript
--disable-extensions
--disable-epm
--disable-online-update
--disable-python
--disable-pdfimport
--disable-lpsolve
--disable-sdremote
--disable-scripting
--disable-avmedia
--disable-coinmp
--disable-report-builder
--disable-odk
--disable-pch
--disable-skia
--disable-scripting

1. Use Emscripten Optimization Options
   Emscripten provides various optimization options that can help reduce the size of the generated WebAssembly file:

Use -O3 or -Oz for maximum optimization.
Use --closure 1 for JavaScript closure optimization.
Use --llvm-lto 3 for link-time optimization.
When compiling, make sure to use these options:

emconfigure ./configure ...
emmake make CXXFLAGS="-O3 --llvm-lto 3" LDFLAGS="-O3 --llvm-lto 3" 4. Remove Debug Information
Make sure to remove all debug information, which can significantly reduce the file size:

emconfigure ./configure ...
emmake make CXXFLAGS="-O3 --llvm-lto 3 -g0" LDFLAGS="-O3 --llvm-lto 3 -g0" 5. Use a WebAssembly Minifier
Use a WebAssembly minifier tool (such as wasm-opt) to further optimize and shrink the generated WebAssembly file:

wasm-opt -Oz -o optimized.wasm original.wasm 6. Custom Build Script
If the above methods still don't meet your needs, consider writing a custom build script that includes only the necessary source files and libraries, to further trim down the generated WebAssembly file.

7. Dynamically Load Modules
   If possible, split some functional modules into separate WebAssembly files and load them dynamically when needed, to reduce the initial load size.

Example autogen.input
Below is an example autogen.input file that incorporates the suggestions above:

```sh
--disable-debug
--enable-sal-log
--disable-crashdump
--host=wasm32-local-emscripten
--disable-gui
--with-main-module=writer
--with-package-format=emscripten
--disable-dbus
--disable-odk
--disable-postgresql-sdbc
--disable-firebird-sdbc
--disable-coinmp
--disable-cve-tests
--disable-gtk3
--disable-gstreamer-1-0
--disable-kf5
--disable-scripting-beanshell
--disable-scripting-javascript
--disable-extensions
--disable-epm
--disable-online-update
--disable-python
--disable-pdfimport
--disable-lpsolve
--disable-sdremote
--disable-scripting
--disable-avmedia
--disable-coinmp
--disable-report-builder
--disable-odk
--disable-pch
--disable-skia
--disable-scripting
```

By following these steps, you should be able to significantly reduce the size of the generated WebAssembly file while retaining the file-to-PDF conversion functionality. If you run into specific issues, please provide detailed error information so we can better help you resolve them.

wasm-opt is part of the Binaryen project, a tool for optimizing and processing WebAssembly binary files. You can install and use wasm-opt on Ubuntu with the following steps:

1. Install Dependencies
   First, make sure the necessary dependencies are installed on your system:

sudo apt update
sudo apt install cmake build-essential git 2. Download and Compile Binaryen
Next, compile Binaryen from source:

# Clone the Binaryen repository

git clone https://github.com/WebAssembly/binaryen.git
cd binaryen

# Create and enter the build directory

mkdir build
cd build

# Configure the build using CMake

cmake ..

# Compile Binaryen

make

# Install Binaryen

sudo make install 3. Use wasm-opt
Once installed, you can use the wasm-opt command to optimize WebAssembly files. For example:

# Suppose you have a WebAssembly file named original.wasm

wasm-opt -Oz -o optimized.wasm original.wasm
In this command:

-Oz means performing maximum size optimization.
-o optimized.wasm specifies the output filename as optimized.wasm.
original.wasm is the input WebAssembly file.4. Verify the Installation
You can verify that wasm-opt was installed correctly by running the following command:

wasm-opt --version
This will output the version information for wasm-opt, confirming that it was successfully installed and is ready to use.

Example
Suppose you have a WebAssembly file named example.wasm; you can optimize it with the following command:

wasm-opt -Oz -o example_optimized.wasm example.wasm
This will produce an optimized WebAssembly file, example_optimized.wasm, whose size will typically be significantly smaller.

By following these steps, you should be able to successfully install and use wasm-opt on Ubuntu to optimize your WebAssembly files. If you run into any issues during installation or use, please provide detailed error information so we can further help you resolve them.

--disable-debug
--enable-sal-log
--disable-crashdump
--host=wasm32-local-emscripten
--disable-gui
--with-main-module=writer
--with-package-format=emscripten
--disable-dbus
--disable-odk
--disable-postgresql-sdbc
--disable-firebird-sdbc
--disable-coinmp
--disable-cve-tests
--disable-gtk3
--disable-gstreamer-1-0
--disable-kf5
--disable-scripting-beanshell
--disable-scripting-javascript
--disable-extensions
--disable-epm
--disable-online-update
--disable-python
--disable-pdfimport
--disable-lpsolve
--disable-sdremote
--disable-scripting
--disable-avmedia
--disable-coinmp
--disable-report-builder
--disable-odk
--disable-pch
--disable-skia
--disable-scripting

Step 1: Download the Latest OpenSSL Source Code
First, make sure you're in a clean directory, then download the latest version of the OpenSSL source code. You can visit the official OpenSSL website to check the latest version. Assume the latest version is openssl-3.0.9:

wget https://www.openssl.org/source/openssl-3.0.9.tar.gz
tar -xzvf openssl-3.0.9.tar.gz
cd openssl-3.0.9
Step 2: Compile and Install OpenSSL
Next, compile and install OpenSSL:

./config --prefix=/usr/local/ssl --openssldir=/usr/local/ssl shared zlib
make
make test
make install
Step 3: Confirm the OpenSSL Installation Path
Make sure the OpenSSL header files and library files are correctly installed:

ls /usr/local/ssl/include
ls /usr/local/ssl/lib
Step 4: Set Environment Variables
Set the correct environment variables so that OpenSSL can be found during compilation:

export PKG_CONFIG_PATH="/usr/local/ssl/lib/pkgconfig"
export CFLAGS="-I/usr/local/ssl/include"
export LDFLAGS="-L/usr/local/ssl/lib -lssl -lcrypto"
Step 5: Clean Up the Previous Configuration
Before rerunning the configure script, clean up the previous configuration:

make clean
Step 6: Rerun the configure Script
Rerun the configure script to make sure it can find the new OpenSSL version:

emconfigure ./configure --disable-debug --enable-sal-log --disable-crashdump --host=wasm32-local-emscripten --disable-gui --with-main-module=writer --with-package-format=emscripten --disable-dbus --disable-odk --disable-postgresql-sdbc --disable-firebird-sdbc --disable-coinmp --disable-cve-tests --disable-gtk3 --disable-gstreamer-1-0 --disable-kf5 --disable-scripting-beanshell --disable-scripting-javascript --disable-extensions --disable-epm --disable-online-update --disable-python --disable-pdfimport --disable-lpsolve --disable-sdremote --disable-scripting --disable-avmedia --disable-coinmp --disable-report-builder --disable-odk --disable-pch --disable-skia --disable-scripting --srcdir=/home/core --enable-option-checking=fatal --disable-pthreads
Step 7: Check config.log
If the configuration still fails, check the config.log file for more details:

cat config.log | grep openssl
By making sure OpenSSL is correctly installed and the environment variables are set correctly, we should be able to resolve the issues encountered during configuration. If the problem persists, please provide more details from the config.log file related to OpenSSL so we can further diagnose and resolve the issue.

emconfigure ./configure --disable-debug --enable-sal-log --disable-crashdump --host=wasm32-local-emscripten --disable-gui --with-main-module=writer --with-package-format=emscripten --disable-dbus --disable-odk --disable-postgresql-sdbc --disable-firebird-sdbc --disable-coinmp --disable-cve-tests --disable-gtk3 --disable-gstreamer-1-0 --disable-kf5 --disable-scripting-beanshell --disable-scripting-javascript --disable-extensions --disable-epm --disable-online-update --disable-python --disable-pdfimport --disable-lpsolve --disable-sdremote --disable-scripting --disable-avmedia --disable-coinmp --disable-report-builder --disable-odk --disable-pch --disable-skia --disable-scripting --srcdir=/home/core --enable-option-checking=fatal

emmake make CXXFLAGS="-I/usr/local/ssl/include -O3 -g0 -msimd128" LDFLAGS="-L/usr/local/ssl/lib -lssl -lcrypto -O3 -g0"

emconfigure ./configure --disable-cups --disable-dbus --without-system-fontconfig --with-system-zlib --disable-dynamic-loading --disable-gui CXXFLAGS=-std=c++20 --host=wasm32-unknown-emscripten

root@8cb3480a4441:/home/core/instsetoo_native# vim CustomTarget_emscripten-install.mk

Use the file_packager.py tool to preload files into the virtual file system. Make sure Emscripten's environment variables are correctly set, then run the following command:

python3 /home/emsdk/upstream/emscripten/tools/file_packager.py preload.data --preload /home/core/instdir/share@/instdir/share --js-output=preload.js
