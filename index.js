#!/usr/bin/env node

const path = require('path')
const fs = require('fs-extra')
const argv = require('minimist')(process.argv.slice(2))

async function init() {
    const targetDir = argv._[0] || '.'
    const cwd = process.cwd()
    const root = path.join(cwd, targetDir)
    const templateDir = path.join(__dirname, 'template');

    await fs.ensureDir(root)
    const existing = await fs.readdir(root)
    if (existing.length) {
        console.error(`Error: target directory is not empty.`)
        process.exit(1)
    }

    const renameFiles = {
        '-gitignore': '.gitignore'
    };
    const write = async (file, content) => {
        const targetPath = path.join(root, renameFiles[file] || file);
        if (content) {
            await fs.writeFile(targetPath, content)
        } else {
            await fs.copy(path.join(templateDir, file), targetPath)
        }
    }

    const files = await fs.readdir(templateDir);
    for (const file of files) {
        await write(file)
    }

    const basename = path.basename(root);
    const replaceFile = ['vite.config.js', 'vite-proxy.config.js', 'README.md', 'src/router.config.js', 'package.json'];
    for (const file of replaceFile) {
        let content = await fs.readFile(path.join(templateDir, file), 'utf-8');
        content = content.replace(/\[basename]/g, basename)
        await write(file, content);
    }

    console.log('  项目已经创建成功，接下来：')
    if (root !== cwd) {
        console.log(`  cd ${path.relative(cwd, root)}`)
    }
    console.log(`  npm install (or \`yarn\`)`)
    console.log(`  npm run dev (or \`yarn dev\`)`)
    console.log()
}

init().catch(e => console.error(e));

