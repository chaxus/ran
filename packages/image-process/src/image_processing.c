// image_processing.c
#include <stdio.h>
#include <vips/vips.h>
#include "image_processing.h"

int process_image(const char *infile, const char *outfile) {
    VipsImage *in;
    double mean;
    VipsImage *out;

    if (!(in = vips_image_new_from_file(infile, NULL))) {
        vips_error_exit(NULL);
        return -1;
    }

    printf("image width = %d\n", vips_image_get_width(in));

    if (vips_avg(in, &mean, NULL)) {
        vips_error_exit(NULL);
        g_object_unref(in);
        return -1;
    }

    printf("mean pixel value = %g\n", mean);

    if (vips_invert(in, &out, NULL)) {
        vips_error_exit(NULL);
        g_object_unref(in);
        return -1;
    }

    g_object_unref(in);

    if (vips_image_write_to_file(out, outfile, NULL)) {
        vips_error_exit(NULL);
        g_object_unref(out);
        return -1;
    }

    g_object_unref(out);

    return 0;
}
