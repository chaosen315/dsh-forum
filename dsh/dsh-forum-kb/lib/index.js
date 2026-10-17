import { randomUUID } from "node:crypto";
import { existsSync } from "node:fs";
import { createUserMessage } from "@deepseek-ai/dsh-llm";
import { installModelSelection } from "@deepseek-ai/dsh-agent";
import { Remote, TypertRemoteService } from "@deepseek-ai/dsh-typert-protocol";
//#region src/index.ts
var __runInitializers = function(thisArg, initializers, value) {
	var useValue = arguments.length > 2;
	for (var i = 0; i < initializers.length; i++) value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
	return useValue ? value : void 0;
};
var __esDecorate = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
	function accept(f) {
		if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected");
		return f;
	}
	var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
	var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
	var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
	var _, done = false;
	for (var i = decorators.length - 1; i >= 0; i--) {
		var context = {};
		for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
		for (var p in contextIn.access) context.access[p] = contextIn.access[p];
		context.addInitializer = function(f) {
			if (done) throw new TypeError("Cannot add initializers after decoration has completed");
			extraInitializers.push(accept(f || null));
		};
		var result = (0, decorators[i])(kind === "accessor" ? {
			get: descriptor.get,
			set: descriptor.set
		} : descriptor[key], context);
		if (kind === "accessor") {
			if (result === void 0) continue;
			if (result === null || typeof result !== "object") throw new TypeError("Object expected");
			if (_ = accept(result.get)) descriptor.get = _;
			if (_ = accept(result.set)) descriptor.set = _;
			if (_ = accept(result.init)) initializers.unshift(_);
		} else if (_ = accept(result)) {
			if (kind === "field") initializers.unshift(_);
			else descriptor[key] = _;
		}
	}
	if (target) Object.defineProperty(target, contextIn.name, descriptor);
	done = true;
};
function b64(s) {
	return Buffer.from(s, "utf8").toString("base64");
}
/** 条目取 sessionId（兼容旧格式纯字符串）。 */
function entrySession(e) {
	if (!e) return void 0;
	return typeof e === "string" ? e : e.sessionId;
}
/** 条目取水位（旧格式/缺失 = null：增量基线不可知，live 首轮按「全 thread 未递、本人回执除外」处理）。 */
function entryWatermark(e) {
	return e && typeof e === "object" ? e.watermark ?? null : null;
}
/** 剥离 undefined 值的键（浅层）。typert 网关在 schema 校验后还有 assertJsonValue：
*  「undefined 值」不是 JSON-safe——schema 会放行 optional 字段的 undefined，但 JSON 安全
*  检查直接抛 "business result failed boundary validation"（重启后核查轮坐实，dispatchInfo
*  三路全炸的共同元素 = 每路都带的名册行 `name: row.name` 这类「键恒存在、值可 undefined」
*  写法）。可空语义一律用 null（对齐 inCase 的 agentPreset/watermark），键缺失用本函数。 */
function compact(o) {
	const out = {};
	for (const [k, v] of Object.entries(o)) if (v !== void 0) out[k] = v;
	return out;
}
function kbRootCandidates(ctx, config) {
	const norm = (p) => p.replace(/\\/g, "/");
	const out = [];
	const cfgRoot = config && typeof config.kbRoot === "string" ? config.kbRoot.trim() : "";
	if (cfgRoot) out.push(norm(cfgRoot));
	const envRoot = process.env.FORUM_KB_ROOT;
	if (envRoot && envRoot.trim()) out.push(norm(envRoot.trim()));
	const sp = ctx.get("sandboxPolicy");
	if (sp && sp.workspaceRoot) out.push(norm(String(sp.workspaceRoot)) + "/forum-kb");
	out.push(norm(process.cwd()) + "/forum-kb");
	return out;
}
function resolveKbRoot(ctx, config) {
	const tried = kbRootCandidates(ctx, config);
	for (const c of tried) if (existsSync(c + "/kb.sqlite") || existsSync(c + "/posts")) return {
		root: c,
		tried,
		found: true
	};
	return {
		root: tried[0],
		tried,
		found: false
	};
}
/**
* forum-kb host 服务（`ctx.forumKb`）：kb.sqlite 单一事实源 + 每帖 md 渲染的读写面。
* @typert service forumKb
*/
let ForumKbService = (() => {
	let _classSuper = TypertRemoteService;
	let _instanceExtraInitializers = [];
	let _list_decorators;
	let _read_decorators;
	let _view_decorators;
	let _search_decorators;
	let _claim_decorators;
	let _answer_decorators;
	let _comment_decorators;
	let _setState_decorators;
	let _pin_decorators;
	let _refs_decorators;
	let _dispatchSessions_decorators;
	let _dispatchInfo_decorators;
	let _toolIndex_decorators;
	let _openRef_decorators;
	let _createPost_decorators;
	let _dispatch_decorators;
	return class ForumKbService extends _classSuper {
		static {
			const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
			_list_decorators = [Remote("list")];
			_read_decorators = [Remote("read")];
			_view_decorators = [Remote("view")];
			_search_decorators = [Remote("search")];
			_claim_decorators = [Remote("claim")];
			_answer_decorators = [Remote("answer")];
			_comment_decorators = [Remote("comment")];
			_setState_decorators = [Remote("state")];
			_pin_decorators = [Remote("pin")];
			_refs_decorators = [Remote("refs")];
			_dispatchSessions_decorators = [Remote("dispatchSessions")];
			_dispatchInfo_decorators = [Remote("dispatchInfo")];
			_toolIndex_decorators = [Remote("toolIndex")];
			_openRef_decorators = [Remote("openRef")];
			_createPost_decorators = [Remote("post")];
			_dispatch_decorators = [Remote("dispatch")];
			__esDecorate(this, null, _list_decorators, {
				kind: "method",
				name: "list",
				static: false,
				private: false,
				access: {
					has: (obj) => "list" in obj,
					get: (obj) => obj.list
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _read_decorators, {
				kind: "method",
				name: "read",
				static: false,
				private: false,
				access: {
					has: (obj) => "read" in obj,
					get: (obj) => obj.read
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _view_decorators, {
				kind: "method",
				name: "view",
				static: false,
				private: false,
				access: {
					has: (obj) => "view" in obj,
					get: (obj) => obj.view
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _search_decorators, {
				kind: "method",
				name: "search",
				static: false,
				private: false,
				access: {
					has: (obj) => "search" in obj,
					get: (obj) => obj.search
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _claim_decorators, {
				kind: "method",
				name: "claim",
				static: false,
				private: false,
				access: {
					has: (obj) => "claim" in obj,
					get: (obj) => obj.claim
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _answer_decorators, {
				kind: "method",
				name: "answer",
				static: false,
				private: false,
				access: {
					has: (obj) => "answer" in obj,
					get: (obj) => obj.answer
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _comment_decorators, {
				kind: "method",
				name: "comment",
				static: false,
				private: false,
				access: {
					has: (obj) => "comment" in obj,
					get: (obj) => obj.comment
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _setState_decorators, {
				kind: "method",
				name: "setState",
				static: false,
				private: false,
				access: {
					has: (obj) => "setState" in obj,
					get: (obj) => obj.setState
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _pin_decorators, {
				kind: "method",
				name: "pin",
				static: false,
				private: false,
				access: {
					has: (obj) => "pin" in obj,
					get: (obj) => obj.pin
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _refs_decorators, {
				kind: "method",
				name: "refs",
				static: false,
				private: false,
				access: {
					has: (obj) => "refs" in obj,
					get: (obj) => obj.refs
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _dispatchSessions_decorators, {
				kind: "method",
				name: "dispatchSessions",
				static: false,
				private: false,
				access: {
					has: (obj) => "dispatchSessions" in obj,
					get: (obj) => obj.dispatchSessions
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _dispatchInfo_decorators, {
				kind: "method",
				name: "dispatchInfo",
				static: false,
				private: false,
				access: {
					has: (obj) => "dispatchInfo" in obj,
					get: (obj) => obj.dispatchInfo
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _toolIndex_decorators, {
				kind: "method",
				name: "toolIndex",
				static: false,
				private: false,
				access: {
					has: (obj) => "toolIndex" in obj,
					get: (obj) => obj.toolIndex
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _openRef_decorators, {
				kind: "method",
				name: "openRef",
				static: false,
				private: false,
				access: {
					has: (obj) => "openRef" in obj,
					get: (obj) => obj.openRef
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _createPost_decorators, {
				kind: "method",
				name: "createPost",
				static: false,
				private: false,
				access: {
					has: (obj) => "createPost" in obj,
					get: (obj) => obj.createPost
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _dispatch_decorators, {
				kind: "method",
				name: "dispatch",
				static: false,
				private: false,
				access: {
					has: (obj) => "dispatch" in obj,
					get: (obj) => obj.dispatch
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			if (_metadata) Object.defineProperty(this, Symbol.metadata, {
				enumerable: true,
				configurable: true,
				writable: true,
				value: _metadata
			});
		}
		static inject = [
			"fs",
			"subprocess",
			"agents",
			"agentPresets",
			"agentDefaultModel",
			"workspaceRegistry"
		];
		fs = __runInitializers(this, _instanceExtraInitializers);
		subprocess;
		agents;
		presets;
		defaultModel;
		workspaces;
		kb;
		mapFile;
		kbTried;
		kbFound;
		/** @author → preset id 显式映射（cordis 行 config.presetRoutes；键小写归一）。
		*  解析链中间层：发派显式选择 > 本表 > 部署默认（ADR-0004 决策2）。 */
		routes;
		/** 可选会话持久化（resume 组成锚定读会话记录用）；缺席 = 回退部署默认（行为同 v0.6）。 */
		persistence;
		/** 可选工具注册表（toolIndex 投影用）；缺席 = 空清单。 */
		toolsReg;
		/** 可选权限档服务（v0.9.0，部署 base 组合的 `permission` 行；缺席 = 权限选择不可用，
		*  显式选择报错、缺省路径照旧部署默认）。 */
		perms;
		constructor(ctx, config = {}) {
			super(ctx, "forumKb");
			this.fs = ctx.get("fs");
			this.subprocess = ctx.get("subprocess");
			this.agents = ctx.get("agents");
			this.presets = ctx.get("agentPresets");
			this.defaultModel = ctx.get("agentDefaultModel");
			this.workspaces = ctx.get("workspaceRegistry");
			this.persistence = ctx.get("sessionPersistence");
			this.toolsReg = ctx.get("tools");
			this.perms = ctx.get("permissionPresets");
			const routes = {};
			const raw = config && typeof config.presetRoutes === "object" && config.presetRoutes ? config.presetRoutes : {};
			for (const [k, v] of Object.entries(raw)) {
				const key = String(k).trim().toLowerCase();
				if (key && typeof v === "string" && v.trim()) routes[key] = v.trim();
			}
			this.routes = routes;
			const resolved = resolveKbRoot(ctx, config);
			this.kb = resolved.root;
			this.kbTried = resolved.tried;
			this.kbFound = resolved.found;
			this.mapFile = this.kb.replace(/\/forum-kb$/, "") + "/.forum-kb/dispatch-sessions.json";
		}
		/** 路由表查询（author 小写归一；未命中 = undefined → 上层落部署默认）。 */
		routeOf(target) {
			return this.routes[String(target ?? "").trim().toLowerCase()];
		}
		/** KB 数据根缺失的报错（分发友好）：携带解析候选与两条修复路径。 */
		kbUnavailableError() {
			return /* @__PURE__ */ new Error("forum-kb 数据目录未找到（按序尝试：" + this.kbTried.join(" → ") + "）。修复任一即可：① cordis.patch.yml 的 forum-kb 行加 config.kbRoot，或设环境变量 FORUM_KB_ROOT，指向 forum-kb 目录（须含 kb.sqlite 与 posts/）；② 从 forum-kb 所在目录启动 dsh。");
		}
		parseFm(text) {
			const out = {};
			const lines = text.split("\n");
			if (lines[0] !== "---") return out;
			for (let i = 1; i < lines.length && lines[i] !== "---"; i++) {
				const idx = lines[i].indexOf(":");
				if (idx > 0) out[lines[i].slice(0, idx).trim()] = lines[i].slice(idx + 1).trim();
			}
			return out;
		}
		async runKb(args) {
			if (!this.kbFound) throw this.kbUnavailableError();
			const nodePath = await this.subprocess.resolveExecutable("node");
			const handle = this.subprocess.spawn({
				argv: [nodePath, "tools/kb.js"].concat(args),
				cwd: this.kb,
				stdio: {
					stdin: "ignore",
					stdout: { maxBytes: 5e5 },
					stderr: { maxBytes: 5e5 }
				},
				graceMs: 5e3
			});
			const outcome = await handle.done;
			const text = handle.collected.stdout ? handle.collected.stdout.readFrom(0).text : "";
			const err = handle.collected.stderr ? handle.collected.stderr.readFrom(0).text : "";
			if (outcome.exitCode !== 0) throw new Error(err || text || "exit " + outcome.exitCode);
			return text;
		}
		/** 帖子列表（summary 层：不装正文，阅读边界原则）。v0.5.0 起带 tags（client 顶栏筛选）；
		*  v0.6.0 起带 pinned/pinnedScope/createdAt/updatedAt/answers/comments（置顶区/排序/徽标）。 */
		async list() {
			if (!this.kbFound) throw this.kbUnavailableError();
			const dir = await this.fs.resolve(this.kb + "/posts");
			const entries = await this.fs.listDir(dir);
			const posts = [];
			for (const e of entries) {
				if (e.type !== "file" || !e.name.endsWith(".md")) continue;
				const text = await this.fs.readText(e.target);
				const fm = this.parseFm(text);
				let tags = [];
				try {
					const v = JSON.parse(fm.tags ?? "[]");
					if (Array.isArray(v)) tags = v.map(String);
				} catch {
					tags = String(fm.tags ?? "").replace(/^\[|\]$/g, "").split(",").map((s) => s.trim()).filter(Boolean);
				}
				posts.push({
					id: e.name.slice(0, -3),
					title: fm.title || e.name,
					state: fm.state || "",
					current: fm.current || null,
					assigned: fm.assigned || null,
					entry: fm.entry === "true" ? 1 : 0,
					pinned: fm.pinned === "true" ? 1 : 0,
					pinnedScope: fm.pinned_scope ? fm.pinned_scope : null,
					createdAt: fm.created_at || null,
					updatedAt: fm.updated_at || null,
					answers: Number(fm.answers ?? 0) || 0,
					comments: Number(fm.comments ?? 0) || 0,
					summary: fm.summary || "",
					tags
				});
			}
			posts.sort((a, b) => a.id < b.id ? -1 : 1);
			return posts;
		}
		/** 读整帖 md（显式动作：展开某帖，非默认装载）。 */
		async read(id) {
			if (!this.kbFound) throw this.kbUnavailableError();
			const t = await this.fs.resolve(this.kb + "/posts/" + id + ".md");
			return {
				id,
				markdown: await this.fs.readText(t)
			};
		}
		/** 整帖结构化投影（forum-kb-web-ui 读面升级）：post 元数据 + query + answers
		*  （source 软引用链 / 是否 current / 每条 answer 的评论线程），形状对齐 ADR-0002 §3。
		*  与写路径同通路：spawn node tools/kb.js view <id>（SQLite 单一事实源，非 md 渲染物）。 */
		async view(id) {
			const text = await this.runKb(["view", id]);
			try {
				return JSON.parse(text);
			} catch {
				throw new Error("kb view 返回非 JSON: " + text.slice(0, 200));
			}
		}
		/** FTS 搜索（v0.5.0，client 顶栏搜索框消费）：与 kb_search 同源——≥3 字走 trigram
		*  FTS5，短词自动 LIKE 回退。term 缺失/空白返回空数组；返回行带 summary 供列表渲染。 */
		async search(req) {
			const term = String((req && req.term) ?? "").trim();
			if (!term) return [];
			const text = await this.runKb([
				"search",
				term,
				"--json"
			]);
			try {
				const rows = JSON.parse(text);
				return Array.isArray(rows) ? rows : [];
			} catch {
				throw new Error("kb search 返回非 JSON: " + text.slice(0, 200));
			}
		}
		/** 乐观认领（设 assigned = 自己）。 */
		async claim(req) {
			return this.write([
				"claim",
				req.post,
				"--as",
				req.as
			]);
		}
		/** 新增 answer（交接/巩固），并移动 current。 */
		async answer(req) {
			return this.write([
				"answer",
				req.post,
				"--as",
				req.as,
				"--source",
				req.source,
				"--rel",
				req.rel,
				"--body-b64",
				b64(req.body)
			]);
		}
		/** 在某 answer 评论区新增评论（草稿面）。 */
		async comment(req) {
			return this.write([
				"comment",
				req.post,
				"--as",
				req.as,
				"--on",
				req.on,
				"--body-b64",
				b64(req.body)
			]);
		}
		/** 修改帖子状态（active/waiting/done/archived）。 */
		async setState(req) {
			return this.write([
				"state",
				req.post,
				"--state",
				req.state
			]);
		}
		/** 置顶/取消置顶（v0.6.0 P0）。set on|off；scope 缺省 = global（全局置顶），tag 名 = tag 内置顶。 */
		async pin(req) {
			const args = [
				"pin",
				req.post,
				"--set",
				req.set
			];
			if (req.scope) args.push("--scope", req.scope);
			return this.write(args);
		}
		/** 反向引用投影（v0.6.0 P0，详情页 refs 面板消费）：入向被引用 + 出向 depends_on，
		*  与 `kb refs <id> --json` 同源（tools/kb.js collectRefs 双通道：depends_on + [[token]]）。 */
		async refs(req) {
			const text = await this.runKb([
				"refs",
				req.id,
				"--json"
			]);
			try {
				return JSON.parse(text);
			} catch {
				throw new Error("kb refs 返回非 JSON: " + text.slice(0, 200));
			}
		}
		/** 全量在案会话投影（v0.8.0 P1，client 列表页「⭐ 常用」区数据源）：dispatch-sessions.json
		*  的只读快照，行形状复用 InCaseRow。与 dispatchInfo({post}) 的区别：不按帖过滤、不做
		*  agentPreset 回查（常用区只需 post/author/live，省每行一次 sessionPersistence 读）。
		*  agentPreset 恒 null（JSON-safe，语义=未查而非无）。键坏行（无 "/" 或空 sessionId）跳过。 */
		async dispatchSessions() {
			const map = await this.loadMap();
			const rows = [];
			for (const [key, entry] of Object.entries(map)) {
				const slash = key.indexOf("/");
				if (slash <= 0) continue;
				const sessionId = entrySession(entry);
				if (!sessionId) continue;
				rows.push({
					post: key.slice(0, slash),
					author: key.slice(slash + 1),
					sessionId,
					live: !!(this.agents && this.agents.get(sessionId)),
					agentPreset: null,
					watermark: entryWatermark(entry)
				});
			}
			return rows;
		}
		/** 派活面投影（v0.7.0，ADR-0004，只读无副作用不入库）：
		*  - 带 targets：发派前预览——逐 target 三态 + 组成面（解析链可视化）+ 模型（仅 created）
		*    + 「选择仅对新建生效」提示；preset 面 broken 提前暴露，发派前可改。
		*  - 不带 targets：{post} 在案投影 + 全量 preset 名册（composer 二级菜单数据源一次带走）。 */
		async dispatchInfo(req) {
			const result = {
				presets: await this.presets.list().then((rows) => (rows || []).map((r) => compact({
					id: r.id,
					name: r.name,
					description: r.description,
					broken: r.broken,
					trust: r.trust
				}))).catch(() => []),
				permissions: this.permRoster()
			};
			const post = String((req && req.post) ?? "");
			const rawTargets = req ? req.targets : void 0;
			const targetList = Array.isArray(rawTargets) ? rawTargets : [];
			if (targetList.length) {
				if (!post) throw new Error("dispatchInfo 预览需要 post");
				const map = await this.loadMap();
				let model;
				try {
					const s = this.defaultModel ? this.defaultModel.currentSelection() : null;
					if (s) model = compact({
						provider: String(s.provider ?? ""),
						model: String(s.model ?? ""),
						reasoningEffort: s.reasoningEffort
					});
				} catch {}
				const preview = [];
				for (const t of targetList) {
					const name = typeof t === "string" ? t : String((t && t.name) ?? "");
					if (!name) continue;
					const chosen = typeof t === "object" && t && typeof t.preset === "string" && t.preset.trim() ? t.preset.trim() : void 0;
					const route = this.routeOf(name);
					const known = entrySession(map[post + "/" + name]);
					const liveAgent = known && this.agents ? this.agents.get(known) : void 0;
					const action = liveAgent ? "live" : known ? "resumed" : "created";
					let preset = null;
					let note;
					if (action === "live") {
						let livePreset;
						try {
							if (liveAgent && this.presets.composedPreset) livePreset = this.presets.composedPreset(liveAgent.ctx ?? liveAgent);
						} catch {}
						preset = await this.presetFace(livePreset ?? (known ? await this.recordedPreset(known) : null) ?? route ?? void 0);
						if (chosen || route) note = "在案目标不换组成：显式选择/路由仅对新建生效";
					} else if (action === "resumed") {
						preset = await this.presetFace(known ? await this.recordedPreset(known) : null);
						if (chosen || route) note = chosen ? "该目标在案：冷恢复沿用原组成，所选 preset 仅对新建生效" : "该目标在案：冷恢复沿用原组成，presetRoutes 路由仅对新建生效";
					} else preset = await this.presetFace(chosen ?? route ?? (await this.presets.resolve()).id);
					const chosenPerm = typeof t === "object" && t && typeof t.permission === "string" && t.permission.trim() ? t.permission.trim() : void 0;
					let permission = null;
					if (action === "created" && this.perms) {
						const pn = chosenPerm ?? (typeof this.perms.defaultPreset === "string" ? this.perms.defaultPreset : "");
						permission = pn ? this.permissionFace(pn) : null;
					} else if (action !== "created" && chosenPerm && this.perms) note = (note ? note + "；" : "") + "该目标在案：权限沿会话既有档，所选权限仅对新建生效";
					const row = {
						target: name,
						action,
						route: chosen ? "selection" : route ? "routes" : "default",
						preset,
						permission
					};
					if (action === "created" && model) row.model = model;
					if (known) row.sessionId = known;
					if (note) row.note = note;
					preview.push(compact(row));
				}
				result.preview = preview;
			} else if (post) {
				const map = await this.loadMap();
				const rows = [];
				for (const [key, entry] of Object.entries(map)) {
					const slash = key.indexOf("/");
					if (slash <= 0) continue;
					const rowPost = key.slice(0, slash);
					if (rowPost !== post) continue;
					const sessionId = entrySession(entry);
					if (!sessionId) continue;
					const liveAgent = this.agents ? this.agents.get(sessionId) : void 0;
					let agentPreset;
					if (liveAgent) try {
						if (this.presets.composedPreset) agentPreset = this.presets.composedPreset(liveAgent.ctx ?? liveAgent);
					} catch {}
					if (!agentPreset) agentPreset = await this.recordedPreset(sessionId);
					rows.push({
						post: rowPost,
						author: key.slice(slash + 1),
						sessionId,
						live: !!liveAgent,
						agentPreset: agentPreset ?? null,
						watermark: entryWatermark(entry)
					});
				}
				result.inCase = rows;
			}
			return result;
		}
		/** host 工具清单（v0.7.0，主输入框 @tool 候选源）：tools.schemas() 全局视图投影，
		*  只取 name/description（模型面白名单字段），描述截断 240 字。注册表缺席 → 空清单。 */
		async toolIndex() {
			if (!this.toolsReg || typeof this.toolsReg.schemas !== "function") return [];
			try {
				const rows = this.toolsReg.schemas();
				return (Array.isArray(rows) ? rows : []).map((r) => compact({
					name: String((r && r.name) ?? ""),
					description: r && typeof r.description === "string" ? r.description.slice(0, 240) : void 0
				})).filter((r) => r.name).sort((a, b) => a.name < b.name ? -1 : 1);
			} catch {
				return [];
			}
		}
		/** @file 引用点击打开（v0.7.0，ADR-0004）：workspace 根相对路径 → OS 默认应用。
		*  根 = KB 根的父目录（与 dispatch cwd 同源）；`..` 越界拒绝。打开通道 = explorer.exe：
		*  自检修缺——原用 `cmd /c start forum-kb <abs>`，但 start 把首个【未加引号】token 当命令
		*  执行（实测 "cannot find the file forum-kb"），成功路径必挂；explorer.exe <file|dir> 走
		*  shell 关联打开（与双击同义），且退出码成功也常为 1 → 存在性前置校验，退出码不判失败。 */
		async openRef(req) {
			const root = this.kb.replace(/\/forum-kb$/, "");
			const rel = String((req && req.path) ?? "").trim().replace(/\\/g, "/").replace(/^(\.\/)+/, "").replace(/^\/+/, "");
			if (!rel) return {
				ok: false,
				error: "路径为空"
			};
			const segs = [];
			for (const seg of rel.split("/")) {
				if (!seg || seg === ".") continue;
				if (seg === "..") {
					if (!segs.length) return {
						ok: false,
						error: "路径越界 workspace 根：" + rel
					};
					segs.pop();
					continue;
				}
				segs.push(seg);
			}
			if (!segs.length) return {
				ok: false,
				error: "路径为空"
			};
			const abs = root + "/" + segs.join("/");
			if (!existsSync(abs)) return {
				ok: false,
				error: "文件不存在：" + abs
			};
			try {
				const exe = await this.subprocess.resolveExecutable("explorer");
				await this.subprocess.spawn({
					argv: [exe, abs],
					stdio: {
						stdin: "ignore",
						stdout: { maxBytes: 1e4 },
						stderr: { maxBytes: 1e4 }
					},
					graceMs: 5e3
				}).done;
				return {
					ok: true,
					path: abs
				};
			} catch (e) {
				return {
					ok: false,
					error: String(e && e.message || e)
				};
			}
		}
		/** 会话既有组成（ADR-0004 决策2/5）：读持久化记录的最新 preset——自尾向前扫
		*  agent-preset/selected 事件（blank 期换配有记录），缺省回 header 的创建时值。
		*  readRaw 不支持/读失败 → null（调用方回退部署默认）。只读，不触发恢复。 */
		async recordedPreset(sessionId) {
			const p = this.persistence;
			if (!p || typeof p.readRaw !== "function") return null;
			try {
				const raw = await p.readRaw(sessionId);
				if (!raw || typeof raw.content !== "string") return null;
				const lines = raw.content.split("\n");
				const pick = (ev) => {
					const data = ev && typeof ev.data === "object" && ev.data ? ev.data : ev;
					const v = data ? data.agentPreset : void 0;
					return typeof v === "string" && v ? v : void 0;
				};
				for (let i = lines.length - 1; i >= 0; i--) {
					if (lines[i].indexOf("agent-preset/selected") < 0) continue;
					try {
						const ev = JSON.parse(lines[i]);
						const direct = pick(ev);
						if (direct) return direct;
						if (ev && Array.isArray(ev.events)) for (let j = ev.events.length - 1; j >= 0; j--) {
							const inner = ev.events[j];
							if (inner && typeof inner === "object" && String(inner.type ?? "").indexOf("agent-preset/selected") >= 0) {
								const v = pick(inner);
								if (v) return v;
							}
						}
					} catch {}
				}
				let header = raw.header;
				if (!header && lines.length) try {
					header = JSON.parse(lines[0]);
				} catch {}
				const hp = header && typeof header === "object" ? header.agentPreset : void 0;
				return typeof hp === "string" && hp ? hp : null;
			} catch {
				return null;
			}
		}
		/** 权限档面（v0.9.0）：档名 → {name, sandbox, approval, description}。未知档名给
		*  description 标错以便预览诚实标红；permissionPresets 缺席返回 null。 */
		permissionFace(name) {
			if (!this.perms || typeof this.perms.resolve !== "function") return null;
			try {
				const spec = this.perms.resolve(name);
				return compact({
					name,
					sandbox: spec && typeof spec.sandbox === "string" ? spec.sandbox : void 0,
					approval: spec && typeof spec.approval === "string" ? spec.approval : void 0,
					description: spec && typeof spec.description === "string" ? spec.description : void 0
				});
			} catch (e) {
				return {
					name,
					description: "未知权限档：" + String(e && e.message || e)
				};
			}
		}
		/** 权限档名册（v0.9.0，composer 权限菜单数据源）：permissionPresets 名表投影，
		*  带两旋钮值（sandbox/approval）供预览透明。服务缺席 → 空数组（client 菜单不出现权限区）。
		*  v0.9.2 勘误：`names` 在 PermissionPresetService 上是 getter（返回 string[]）不是方法——
		*  初版用 `typeof names !== "function"` 当守卫恒真 → 名册恒空、权限区永不出现（真机复测坐实）。 */
		permRoster() {
			if (!this.perms) return [];
			try {
				const raw = this.perms.names;
				const list = typeof raw === "function" ? raw.call(this.perms) : Array.isArray(raw) ? raw : [];
				const out = [];
				for (const n of list) {
					const face = this.permissionFace(String(n));
					if (face) out.push(face);
				}
				return out;
			} catch {
				return [];
			}
		}
		/** preset 名册面（按 id 查元数据；未知 id 给 broken 面以便预览诚实标红）。 */
		async presetFace(id) {
			if (!id) return null;
			try {
				const row = (await this.presets.list() || []).find((r) => r && r.id === id);
				if (!row) return {
					id,
					broken: "未知 preset id（名册无此行）"
				};
				return compact({
					id: row.id,
					name: row.name,
					description: row.description,
					broken: row.broken,
					trust: row.trust
				});
			} catch {
				return {
					id,
					broken: "名册读取失败"
				};
			}
		}
		/** 新建帖子（发起任务）。v0.5.0：id 改可选——省略时 kb 侧生成哈希 id（帖子标识不再
		*  依赖人工命名 slug）；走 `post --json` 并把生成的 id 填进 WriteResult.id。
		*  dependsOn 为跨帖引用索引（可选）。 */
		async createPost(req) {
			const args = ["post"];
			const explicitId = String(req.id ?? "").trim();
			if (explicitId) args.push(explicitId);
			args.push("--title", req.title, "--author", req.author, "--tag", req.tag, "--summary", req.summary, "--body-b64", b64(req.body), "--json");
			if (req.dependsOn && req.dependsOn.length) args.push("--depends-on-b64", b64(JSON.stringify(req.dependsOn)));
			const r = await this.write(args);
			if (r.ok && r.text) try {
				const parsed = JSON.parse(r.text);
				if (parsed && typeof parsed.id === "string") r.id = parsed.id;
			} catch {}
			return r;
		}
		/** 派活（@ 调度，ADR-0003 + ADR-0004 v0.7.0）：把触发评论递给各 @target 的会话。
		*  解析顺序：映射在案且 live → followup（live，v0.4.3 起只递增量）；在案未活 → resume
		*  （冷恢复，组成锚会话既有记录，发全量阅读边界）；无案 → create（组成 = 目标显式选择 >
		*  config.presetRoutes > 部署默认；模型 = 部署默认选型，发全量）。
		*  targets 元素 string（旧版）或 {name, preset}（v0.7.0 显式选择）双形状照收。
		*  逐 target 出结果，不抛。 */
		async dispatch(req) {
			const view = await this.view(req.post);
			const answer = view.answers.find((a) => a.id === req.on);
			if (!answer) throw new Error("thread 所在 answer 不存在：" + req.on);
			if (!this.agents) throw new Error("agents 服务不可用（host 组合缺会话治理平面）");
			const targets = (Array.isArray(req.targets) ? req.targets : []).map((t) => {
				if (typeof t === "string") return { name: t };
				const name = String((t && t.name) ?? "");
				const preset = t && typeof t.preset === "string" ? t.preset.trim() : "";
				const permission = t && typeof t.permission === "string" ? t.permission.trim() : "";
				return {
					name,
					preset: preset || void 0,
					permission: permission || void 0
				};
			}).filter((t) => t.name);
			const map = await this.loadMap();
			const outcomes = [];
			for (const target of targets) outcomes.push(await this.dispatchOne(target, req, view, answer, map));
			try {
				await this.saveMap(map);
			} catch {}
			return outcomes;
		}
		async dispatchOne(target, req, view, answer, map) {
			const name = target.name;
			const key = req.post + "/" + name;
			try {
				if (target.permission && !(this.perms && typeof this.perms.set === "function")) return {
					target: name,
					ok: false,
					error: "permissionPresets 服务不可用（部署未挂 permission 面板），无法落实所选权限档：" + target.permission
				};
				const selection = this.defaultModel ? this.defaultModel.currentSelection() : null;
				const agentOptions = selection ? {
					provider: selection.provider,
					model: selection.model
				} : void 0;
				const chosen = target.preset ?? this.routeOf(name);
				const entry = map[key];
				const known = entrySession(entry);
				const watermark = entryWatermark(entry);
				const cwdCandidate = this.kb.replace(/\/forum-kb$/, "");
				let agent = known ? this.agents.get(known) : void 0;
				let action = "live";
				let sessionId = known;
				let presetId;
				let appliedPermission;
				if (!agent && known) {
					const resumePresetId = await this.recordedPreset(known) ?? void 0;
					agent = (await this.agents.resume({
						resumeSessionId: known,
						agentOptions,
						setup: async (agentCtx) => {
							if (selection) installModelSelection(agentCtx, {
								current: selection,
								assembled: void 0
							});
							const mounted = await this.presets.mount(agentCtx, resumePresetId);
							presetId = mounted && typeof mounted.id === "string" ? mounted.id : resumePresetId;
						}
					})).agent;
					sessionId = known;
					action = "resumed";
				}
				if (!agent) {
					presetId = chosen ?? (await this.presets.resolve()).id;
					sessionId = "session-" + randomUUID();
					agent = (await this.agents.create({
						sessionId,
						agentOptions,
						meta: {
							cwd: await this.canonicalCwd(cwdCandidate),
							agentPreset: presetId
						},
						setup: async (agentCtx) => {
							if (selection) installModelSelection(agentCtx, {
								current: selection,
								assembled: void 0
							});
							await this.presets.mount(agentCtx, presetId);
						}
					})).agent;
					action = "created";
					if (target.permission) {
						const session = agent.session ?? this.agents.get(sessionId)?.session ?? void 0;
						this.perms.set(session, target.permission);
						appliedPermission = target.permission;
					}
				}
				await this.attachWorkspace(sessionId, cwdCandidate);
				const comments = answer.comments;
				const wmIdx = watermark ? comments.findIndex((c) => c.id === watermark) : -1;
				const mode = action === "live" && (!watermark || wmIdx >= 0) ? "incremental" : "full";
				const message = createUserMessage({
					content: [{
						type: "text",
						text: this.dispatchMessage(name, req, view, answer, {
							mode,
							watermark,
							wmIdx
						})
					}],
					source: { kind: "user" }
				});
				const queued = agent.followup(message);
				if (queued && typeof queued.catch === "function") queued.catch(() => {});
				map[key] = {
					sessionId,
					watermark: comments.length ? comments[comments.length - 1].id : watermark ?? null
				};
				return compact({
					target: name,
					ok: true,
					sessionId,
					action,
					permission: appliedPermission
				});
			} catch (e) {
				return {
					target: name,
					ok: false,
					error: String(e && e.message || e)
				};
			}
		}
		/** workspace.path 规范形（realpath 后反斜杠写法）：旧版直接传正斜杠 cwd，与名册/其它会话写法漂移。 */
		async canonicalCwd(cwdCandidate) {
			if (!this.workspaces) return cwdCandidate;
			try {
				const workspace = await this.workspaces.resolveByPath(cwdCandidate);
				if (workspace) return workspace.path;
			} catch {}
			return cwdCandidate;
		}
		/** 会话归属记账：workspace.attachSession 幂等；resolveByPath/attach 失败不回滚派活
		*  （最坏后果 = 会话落在侧边栏 Ungrouped）。 */
		async attachWorkspace(sessionId, cwdCandidate) {
			if (!this.workspaces) return;
			try {
				const workspace = await this.workspaces.resolveByPath(cwdCandidate);
				if (workspace) await workspace.attachSession(sessionId);
			} catch {}
		}
		/** 派活消息（T1 纪律，v0.4.3 增量修订）：
		*  - full（created/resumed 冷启动、或水位失效重锚）：投影 {summary, query, current, 本 thread}
		*    + 触发评论 + kb 工具指引；thread 列表跳过触发评论（有专段）、本人回执折叠为一行指针。
		*  - incremental（live 续聊）：只递水位之后的新评论 + 触发评论 + 一行重读指引——投影与
		*    已递评论不重发，之后的展开仍靠 agent 主动 pull。 */
		dispatchMessage(target, req, view, answer, opts) {
			const comments = answer.comments;
			const isTrigger = (c) => c.author === req.author && c.body === req.body;
			const isSelf = (c) => c.author.toLowerCase() === target.toLowerCase();
			if (opts.mode === "incremental") {
				const fresh = comments.slice(opts.wmIdx >= 0 ? opts.wmIdx + 1 : 0).filter((c) => !isTrigger(c) && !isSelf(c));
				const baseline = opts.wmIdx >= 0 ? `水位 ${opts.watermark} 之后` : "旧版映射无水位：全 thread 均按未递处理（本人回执与触发评论除外），下轮起恢复增量";
				return [
					`[forum-kb 派活·续] 你在帖子「${view.title}」（${view.id}）的 thread ${req.on} 下再次被 @${target} 点名。`,
					`本条只递增量（${baseline}）——阅读边界 {summary, query, current} 与此前已递评论已在你上下文，需要时 kb_view（post=${view.id}）重读全文。`,
					"",
					`## 本轮新增（${fresh.length} 条）`,
					fresh.length ? fresh.map((c) => `- ${c.id} · ${c.author}：${c.body}`).join("\n") : "（除触发评论外无新增——本次 @ 即续聊信号）",
					"",
					"## 触发评论",
					req.author + "：" + req.body,
					"",
					`（工作约定同首轮：身份 ${target}；kb_comment 回本 thread（post=${view.id}, on=${req.on}，草稿面）；有可复用资产再 kb_answer 巩固（source=${view.current ?? req.on}）。）`
				].join("\n");
			}
			const lines = [];
			for (const c of comments) {
				if (isTrigger(c)) continue;
				if (isSelf(c)) {
					lines.push(`- ${c.id} · ${c.author}：（本人回执，折叠——kb_view 可读全文）`);
					continue;
				}
				lines.push(`- ${c.id} · ${c.author}：${c.body}`);
			}
			const thread = lines.length ? lines.join("\n") : "（本 thread 暂无其他评论）";
			const cur = view.answers.find((a) => a.id === view.current);
			return [
				`[forum-kb 派活] 你在帖子「${view.title}」（${view.id}）的 thread ${req.on} 下被 @${target} 点名。`,
				"",
				"## 阅读边界（之后的展开靠你主动 pull：kb_view 可沿 source 追来路、kb_search/kb_query 找别的帖子）",
				"- summary：" + view.summary,
				"- query：" + (view.query ?? ""),
				`- current ${view.current ?? "-"}：${cur ? cur.body : "（暂无）"}`,
				`- 本 thread（${req.on} 评论区，${comments.length} 条）：`,
				thread,
				"",
				"## 触发评论",
				req.author + "：" + req.body,
				"",
				"## 工作约定（ADR-0003）",
				"- 身份：" + target + "（写 KB 时 author/`as` 用它）",
				`- 进展与结论先回本 thread：kb_comment（post=${view.id}, on=${req.on}，草稿面）；有可复用资产再 kb_answer 巩固（source=${view.current ?? req.on}，会移动 current）。`,
				"- human 会在此 thread 多轮 @ 你续聊：后续派活只递增量（新增评论 + 触发评论），投影与已递评论不重发；历史上下文留在你会话里，丢失背景时 kb_view 重读。",
				"- 只在本 thread 汇报，不要另开帖子；读多少、读到哪由你自己决定。"
			].join("\n");
		}
		async loadMap() {
			try {
				const t = await this.fs.resolve(this.mapFile);
				const raw = JSON.parse(await this.fs.readText(t));
				return raw && typeof raw === "object" && !Array.isArray(raw) ? raw : {};
			} catch {
				return {};
			}
		}
		async saveMap(map) {
			const norm = {};
			for (const [k, v] of Object.entries(map)) {
				const sessionId = entrySession(v);
				if (sessionId) norm[k] = {
					sessionId,
					watermark: entryWatermark(v) ?? null
				};
			}
			const t = await this.fs.resolve(this.mapFile);
			await this.fs.writeText(t, JSON.stringify(norm, null, 2));
		}
		async write(args) {
			try {
				return {
					ok: true,
					text: await this.runKb(args)
				};
			} catch (e) {
				return {
					ok: false,
					error: String(e && e.message || e)
				};
			}
		}
	};
})();
//#endregion
export { ForumKbService, ForumKbService as default };
