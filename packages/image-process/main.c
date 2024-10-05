#include <stdio.h>
#include <vips/vips.h>
#include "image_processing.h"

int main(int argc, char **argv) {
    if (VIPS_INIT(argv[0])) {
        vips_error_exit(NULL);
    }

    if (argc != 3) {
        vips_error_exit("usage: %s infile outfile", argv[0]);
    }

    if (process_image(argv[1], argv[2]) != 0) {
        vips_error_exit("Failed to process image");
    }

    return 0;
}
