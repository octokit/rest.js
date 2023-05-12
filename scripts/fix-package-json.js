const fs = require("fs");
const path = require("path");
const { EOL } = require("os");

const pkgPath = path.join(__dirname, "../pkg/package.json");
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));

pkg.files = pkg.files.map((file) => {
  if (file.endsWith("/")) {
    return file + "**";
  }
  return file;
});

fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + EOL, "utf8");
