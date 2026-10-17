// @deepseek-ai/dsh-forum-kb 构建：tsdown 打包 lib/index.js + lib/types.js，
// typertPlugin 在 writeBundle 期跑 workspace 级生成：
//   - analyze tsconfig.host.json（向上定位）references 的 host face；
//   - 产出 packages/dsh-forum-kb/lib/typert.host.{js,d.ts}
//     + lib/typert.remote-client.{js,d.ts,d.ts.map}（有 @Remote 方法时）。
// validateExport 会在生成期校验 package.json 的 ./typert、./remote exports 与 files。
// 装饰器由 typertPlugin.transform 先行降级（stage-3 → __esDecorate helpers）。
import { typertPlugin } from '@deepseek-ai/dsh-typert-generator/tsdown'

export default {
  entry: {
    index: 'src/index.ts',
    types: 'src/types.ts',
  },
  outDir: 'lib',
  format: 'esm',
  platform: 'node',
  fixedExtension: false,
  dts: false,
  plugins: [typertPlugin({ mode: 'workspace', faces: ['host'] })],
}
