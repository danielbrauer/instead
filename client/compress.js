// adapted from https://gist.github.com/heyimalex/db6e734d1c4e0ac50e0dc8f2abeeae4e

import { createReadStream, createWriteStream, statSync } from 'fs'
import { sync } from 'glob'
import { eachSeries } from 'async'
import { createBrotliCompress } from 'zlib'

function compressAsBrotli(src, callback) {
    console.log(`Compressing ${src}`)
    const dst = `${src}.br`
    createReadStream(src)
        .on('error', callback)
        .pipe(
            createBrotliCompress()
        )
        .on('error', callback)
        .pipe(createWriteStream(dst))
        .on('error', callback)
        .on('close', () => {
            const srcSize = statSync(src).size;
            const dstSize = statSync(dst).size;
            console.log(`  Saved ${srcSize - dstSize} bytes`);
            console.log(`  ${Math.floor((100 * dstSize) / srcSize)}% of original`);
            callback()
        })
}

function compressBuildArtifacts(callback) {
    const assets = sync('./build/**/*.@(js|css|html)')
    eachSeries(assets, compressAsBrotli, callback)
}

compressBuildArtifacts(err => {
    if (err) {
        throw err
    }
    console.log('Compression completed sucessfully')
})