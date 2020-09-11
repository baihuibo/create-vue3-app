const crequire = require('crequire');
const fs = require('fs');

const files = fs.readdirSync('./dist/_assets');
const arg = '?visitDstTime=1';
files.forEach(file => {
    if (file.endsWith('.js')) {
        const filePath = './dist/_assets/' + file;
        let content = fs.readFileSync(filePath, 'utf-8');
        const imports = crequire(content);
        let replaced = false;

        // 处理静态导入
        imports.forEach(obj => {
            if (obj.path.indexOf('visitDstTime=1') === -1) {
                const result = obj.string.replace(obj.path, obj.path + arg);
                content = content.replace(obj.string, result);
                replaced = true;
            }
        });

        // 处理动态导入
        content = content.replace(/import\(['"](.*?\.js)['"]\)/g, function (match, $1, index, content) {
            replaced = true;
            return match.replace($1, $1 + arg);
        })

        // 如果有被替换的情况
        if (replaced) {
            fs.writeFileSync(filePath, content);
        }
    }
})

const indexPath = './dist/index.html';
let indexContent = fs.readFileSync(indexPath, 'utf-8');
indexContent = indexContent.replace(/(\w+\.js)/, '$1' + arg);
fs.writeFileSync(indexPath, indexContent);

console.log('所有文件防联通资源拦截处理完成')
