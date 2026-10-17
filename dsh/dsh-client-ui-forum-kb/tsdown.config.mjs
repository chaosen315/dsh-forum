// @deepseek-ai/dsh-client-ui-forum-kb 构建：两个半面，两种格式。
// 1) node 半 lib/index.js —— ESM（host Loader 以 "type":"module" 加载空 apply）。
// 2) 浏览器半 lib/client.js —— CJS 主体 + window.__ModuleLoader__.load 包装
//    （banner/footer 手工实现上游 client 构建插件的包装格式；factory 的 require
//    解析走 client 模块表）。
//    - @deepseek-ai/dsh-forum-kb/remote 与 zod 均为 devDependencies → rolldown
//      打进 bundle（client 模块表里没有 forum-kb 的 factory，必须自带）。
//    - clean 必须关掉：两段构建共用 outDir=lib，后跑的会把先跑的清掉。
//    - ⚠️ platform:'browser' 不 polyfill node 内建——新增依赖后必须核查产物无
//      require("node:*")（zod 4.5 顶层 import node:process/path/url 的事故教训）。
const ID = '@deepseek-ai/dsh-client-ui-forum-kb'

export default [
  {
    name: 'node-half',
    entry: { index: 'src/index.ts' },
    outDir: 'lib',
    format: 'esm',
    platform: 'node',
    fixedExtension: false,
    dts: false,
    clean: false,
  },
  {
    name: 'client-half',
    entry: { client: 'src/client.ts' },
    outDir: 'lib',
    format: 'cjs',
    platform: 'browser',
    dts: false,
    clean: false,
    outExtensions: () => ({ js: '.js' }),
    banner:
      'window.__ModuleLoader__.load({\n' +
      `  id: ${JSON.stringify(ID)},\n` +
      '  factory: (require) => {\n' +
      '    var module = { exports: {} };\n' +
      '    var exports = module.exports;\n',
    footer: '\n    return module.exports;\n  }\n});\n',
  },
]
