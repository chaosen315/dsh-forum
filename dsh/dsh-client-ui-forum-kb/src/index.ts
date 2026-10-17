// node 半：纯 UI 插件占位（同 dsh-client-ui-goal 的空 apply）。
// 空 apply 让本包作为 cordis.yml 的 ui-forum-kb 行被 Loader 挂载；
// 浏览器半经 exports["./client"] 由 package.json 的 dsh.client 声明发现。

/** Host plugin body — no host-side behavior for this surface plugin. */
function apply() {}

export { apply }
