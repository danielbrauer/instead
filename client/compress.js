const fs = require("fs");
const path = require("path");
const glob = require("glob");
const async = require("async");
const zlib = require('zlib');

function gzipFile(src, callback) {
  console.log(`Compressing ${src}`);
  const dst = `${src}.gz`;
  fs.createReadStream(src)
    .on("error", callback)
    .pipe(
      zlib.createBrotliCompress()
    )
    .on("error", callback)
    .pipe(fs.createWriteStream(dst))
    .on("error", callback)
    .on("close", () => {
      const srcSize = fs.statSync(src).size;
      const dstSize = fs.statSync(dst).size;
      console.log(`  Saved ${srcSize - dstSize} bytes`);
      console.log(`  ${Math.floor((100 * dstSize) / srcSize)}% of original`);
      callback();
    });
}

function compressBuildArtifacts(callback) {
  const assets = glob.sync("./build/**/*.@(js|css|html)");
  async.eachSeries(assets, gzipFile, callback);
}

compressBuildArtifacts(err => {
  if (err) {
    throw err;
  }
  console.log("Compression completed sucessfully");
});