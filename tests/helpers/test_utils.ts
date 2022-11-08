import fs from 'fs'


export function createTmpDir() {
    // Creates /tmp/a/apple, regardless of whether `/tmp` and /tmp/a exist.
    fs.mkdir('tmp', { recursive: true }, (err) => {
        if (err) throw err;
    });
}