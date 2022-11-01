import * as fs from "node:fs";

let fileSystem: any;
if (typeof require !== "undefined") {
  fileSystem = require("fs");
} else {
  fileSystem = { status: false, message: "require is not defined" };
}

export default fileSystem;
