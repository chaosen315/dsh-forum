window.__ModuleLoader__.load({
  id: "@deepseek-ai/dsh-client-ui-forum-kb",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;

Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
//#region \0rolldown/runtime.js
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule || !__hasOwnProp.call(mod, "default") ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
//#endregion
let react = require("react");
react = __toESM(react, 1);
//#region ../../node_modules/.pnpm/zod@4.5.2/node_modules/zod/v4/core/util.js
function getEnumValues(entries) {
	const numericValues = Object.values(entries).filter((v) => typeof v === "number");
	return Object.entries(entries).filter(([k, _]) => numericValues.indexOf(+k) === -1).map(([_, v]) => v);
}
function joinValues(array, separator = "|") {
	return array.map((val) => stringifyPrimitive(val)).join(separator);
}
function jsonStringifyReplacer(_, value) {
	if (typeof value === "bigint") return value.toString();
	return value;
}
function cached(getter) {
	return { get value() {
		{
			const value = getter();
			Object.defineProperty(this, "value", { value });
			return value;
		}
	} };
}
function nullish(input) {
	return input === null || input === void 0;
}
function cleanRegex(source) {
	const start = source.startsWith("^") ? 1 : 0;
	const end = source.endsWith("$") ? source.length - 1 : source.length;
	return source.slice(start, end);
}
function floatSafeRemainder(val, step) {
	const ratio = val / step;
	const roundedRatio = Math.round(ratio);
	const tolerance = 4 * Number.EPSILON * Math.max(Math.abs(ratio), 1);
	if (Math.abs(ratio - roundedRatio) < tolerance) return 0;
	return ratio - roundedRatio;
}
function assignProp(target, prop, value) {
	Object.defineProperty(target, prop, {
		value,
		writable: true,
		enumerable: true,
		configurable: true
	});
}
function mergeDefs(...defs) {
	const mergedDescriptors = {};
	for (const def of defs) {
		const descriptors = Object.getOwnPropertyDescriptors(def);
		Object.assign(mergedDescriptors, descriptors);
	}
	return Object.defineProperties({}, mergedDescriptors);
}
function esc(str) {
	return JSON.stringify(str);
}
function slugify(input) {
	return input.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}
const captureStackTrace = "captureStackTrace" in Error ? Error.captureStackTrace : (..._args) => {};
function isObject(data) {
	return typeof data === "object" && data !== null && !Array.isArray(data);
}
const allowsEval = /* @__PURE__*/ cached(() => {
	if (globalConfig.jitless) return false;
	if (typeof navigator !== "undefined" && navigator?.userAgent?.includes("Cloudflare")) return false;
	try {
		new Function("");
		return true;
	} catch (_) {
		return false;
	}
});
function isPlainObject(o) {
	if (isObject(o) === false) return false;
	const ctor = o.constructor;
	if (ctor === void 0) return true;
	if (typeof ctor !== "function") return true;
	const prot = ctor.prototype;
	if (isObject(prot) === false) return false;
	if (Object.prototype.hasOwnProperty.call(prot, "isPrototypeOf") === false) return false;
	return true;
}
function shallowClone(o) {
	if (isPlainObject(o)) return { ...o };
	if (Array.isArray(o)) return [...o];
	if (o instanceof Map) return new Map(o);
	if (o instanceof Set) return new Set(o);
	return o;
}
const propertyKeyTypes = /* @__PURE__*/ new Set([
	"string",
	"number",
	"symbol"
]);
function escapeRegex(str) {
	return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function clone$1(inst, def, params) {
	const cl = new inst._zod.constr(def ?? inst._zod.def);
	if (!def || params?.parent) cl._zod.parent = inst;
	return cl;
}
function normalizeParams(_params) {
	const params = _params;
	if (!params) return {};
	if (typeof params === "string") return { error: () => params };
	if (params?.message !== void 0) {
		if (params?.error !== void 0) throw new Error("Cannot specify both `message` and `error` params");
		params.error = params.message;
	}
	delete params.message;
	if (typeof params.error === "string") return {
		...params,
		error: () => params.error
	};
	return params;
}
function stringifyPrimitive(value) {
	if (typeof value === "bigint") return value.toString() + "n";
	if (typeof value === "string") return `"${value}"`;
	return `${value}`;
}
function optionalKeys(shape) {
	return Object.keys(shape).filter((k) => {
		return shape[k]._zod.optin !== void 0 && shape[k]._zod.optout === "optional";
	});
}
const NUMBER_FORMAT_RANGES = /*@__PURE__*/ (() => ({
	safeint: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
	int32: [-2147483648, 2147483647],
	uint32: [0, 4294967295],
	float32: [-34028234663852886e22, 34028234663852886e22],
	float64: [-Number.MAX_VALUE, Number.MAX_VALUE]
}))();
function pick(schema, mask) {
	const currDef = schema._zod.def;
	const checks = currDef.checks;
	if (checks && checks.length > 0) throw new Error(".pick() cannot be used on object schemas containing refinements");
	return clone$1(schema, mergeDefs(schema._zod.def, {
		get shape() {
			const newShape = {};
			for (const key of Reflect.ownKeys(mask)) {
				if (!Object.prototype.hasOwnProperty.call(currDef.shape, key)) throw new Error(`Unrecognized key: "${String(key)}"`);
				if (!mask[key]) continue;
				assignProp(newShape, key, currDef.shape[key]);
			}
			assignProp(this, "shape", newShape);
			return newShape;
		},
		checks: []
	}));
}
function omit(schema, mask) {
	const currDef = schema._zod.def;
	const checks = currDef.checks;
	if (checks && checks.length > 0) throw new Error(".omit() cannot be used on object schemas containing refinements");
	return clone$1(schema, mergeDefs(schema._zod.def, {
		get shape() {
			const newShape = { ...schema._zod.def.shape };
			for (const key of Reflect.ownKeys(mask)) {
				if (!Object.prototype.hasOwnProperty.call(currDef.shape, key)) throw new Error(`Unrecognized key: "${String(key)}"`);
				if (!mask[key]) continue;
				delete newShape[key];
			}
			assignProp(this, "shape", newShape);
			return newShape;
		},
		checks: []
	}));
}
function extend(schema, shape) {
	if (!isPlainObject(shape)) throw new Error("Invalid input to extend: expected a plain object");
	const checks = schema._zod.def.checks;
	if (checks && checks.length > 0) {
		const existingShape = schema._zod.def.shape;
		for (const key of Reflect.ownKeys(shape)) if (Object.getOwnPropertyDescriptor(existingShape, key) !== void 0) throw new Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.");
	}
	return clone$1(schema, mergeDefs(schema._zod.def, { get shape() {
		const _shape = {
			...schema._zod.def.shape,
			...shape
		};
		assignProp(this, "shape", _shape);
		return _shape;
	} }));
}
function safeExtend(schema, shape) {
	if (!isPlainObject(shape)) throw new Error("Invalid input to safeExtend: expected a plain object");
	return clone$1(schema, mergeDefs(schema._zod.def, { get shape() {
		const _shape = {
			...schema._zod.def.shape,
			...shape
		};
		assignProp(this, "shape", _shape);
		return _shape;
	} }));
}
function merge(a, b) {
	if (!b?._zod?.def) throw new Error("Invalid input to merge: expected an object schema. To merge a plain shape, use `.extend()`.");
	if (a._zod.def.checks?.length) throw new Error(".merge() cannot be used on object schemas containing refinements. Use .safeExtend() instead.");
	return clone$1(a, mergeDefs(a._zod.def, {
		get shape() {
			const _shape = {
				...a._zod.def.shape,
				...b._zod.def.shape
			};
			assignProp(this, "shape", _shape);
			return _shape;
		},
		get catchall() {
			return b._zod.def.catchall;
		},
		checks: b._zod.def.checks ?? []
	}));
}
function partial(Class, schema, mask, name = "partial") {
	const checks = schema._zod.def.checks;
	if (checks && checks.length > 0) throw new Error(`.${name}() cannot be used on object schemas containing refinements`);
	return clone$1(schema, mergeDefs(schema._zod.def, {
		get shape() {
			const oldShape = schema._zod.def.shape;
			const shape = { ...oldShape };
			if (mask) for (const key of Reflect.ownKeys(mask)) {
				if (!Object.prototype.hasOwnProperty.call(oldShape, key)) throw new Error(`Unrecognized key: "${String(key)}"`);
				if (!mask[key]) continue;
				shape[key] = Class ? new Class({
					type: "optional",
					innerType: oldShape[key]
				}) : oldShape[key];
			}
			else for (const key of Reflect.ownKeys(oldShape)) shape[key] = Class ? new Class({
				type: "optional",
				innerType: oldShape[key]
			}) : oldShape[key];
			assignProp(this, "shape", shape);
			return shape;
		},
		checks: []
	}));
}
function required(Class, schema, mask) {
	return clone$1(schema, mergeDefs(schema._zod.def, { get shape() {
		const oldShape = schema._zod.def.shape;
		const shape = { ...oldShape };
		if (mask) for (const key of Reflect.ownKeys(mask)) {
			if (!Object.prototype.hasOwnProperty.call(shape, key)) throw new Error(`Unrecognized key: "${String(key)}"`);
			if (!mask[key]) continue;
			shape[key] = new Class({
				type: "nonoptional",
				innerType: oldShape[key]
			});
		}
		else for (const key of Reflect.ownKeys(oldShape)) shape[key] = new Class({
			type: "nonoptional",
			innerType: oldShape[key]
		});
		assignProp(this, "shape", shape);
		return shape;
	} }));
}
function aborted(x, startIndex = 0) {
	if (x.aborted === true) return true;
	for (let i = startIndex; i < x.issues.length; i++) if (x.issues[i]?.continue !== true) return true;
	return false;
}
function explicitlyAborted(x, startIndex = 0) {
	if (x.aborted === true) return true;
	for (let i = startIndex; i < x.issues.length; i++) if (x.issues[i]?.continue === false) return true;
	return false;
}
function prefixIssues(path, issues) {
	return issues.map((iss) => {
		var _a;
		(_a = iss).path ?? (_a.path = []);
		iss.path.unshift(path);
		return iss;
	});
}
function unwrapMessage(message) {
	return typeof message === "string" ? message : message?.message;
}
function attachSchema(issues, start, inst) {
	var _a;
	for (let i = start; i < issues.length; i++) (_a = issues[i]).schema ?? (_a.schema = inst);
}
function finalizeIssue(iss, ctx, config) {
	var _a;
	const traits = iss.inst?._zod?.traits;
	if (traits?.has("$ZodType")) {
		if (traits.has("$ZodCheck")) (_a = iss).schema ?? (_a.schema = iss.inst);
		else iss.schema = iss.inst;
	}
	const schemaError = iss.schema !== iss.inst ? iss.schema?._zod.def?.error : void 0;
	const message = iss.message ? iss.message : unwrapMessage(iss.inst?._zod.def?.error?.(iss)) ?? unwrapMessage(schemaError?.(iss)) ?? unwrapMessage(ctx?.error?.(iss)) ?? unwrapMessage(config.customError?.(iss)) ?? unwrapMessage(config.localeError?.(iss)) ?? "Invalid input";
	const { inst: _inst, schema: _schema, continue: _continue, input: _input, ...rest } = iss;
	rest.path ?? (rest.path = []);
	rest.message = message;
	if (ctx?.reportInput) rest.input = _input;
	return rest;
}
const highSurrogate = /[\uD800-\uDBFF]/;
function codePointLength(str) {
	const units = str.length;
	if (!highSurrogate.test(str)) return units;
	let count = units;
	for (let i = 0; i < units - 1; i++) if ((str.charCodeAt(i) & 64512) === 55296 && (str.charCodeAt(i + 1) & 64512) === 56320) {
		count--;
		i++;
	}
	return count;
}
function getLengthableOrigin(input) {
	if (Array.isArray(input)) return "array";
	if (typeof input === "string") return "string";
	return "unknown";
}
function parsedType(data) {
	const t = typeof data;
	switch (t) {
		case "number": return Number.isNaN(data) ? "nan" : "number";
		case "object": {
			if (data === null) return "null";
			if (Array.isArray(data)) return "array";
			const obj = data;
			if (obj && Object.getPrototypeOf(obj) !== Object.prototype && "constructor" in obj && obj.constructor) return obj.constructor.name;
		}
	}
	return t;
}
function issue(...args) {
	const [iss, input, inst] = args;
	if (typeof iss === "string") return {
		message: iss,
		code: "custom",
		input,
		inst
	};
	return { ...iss };
}
/**
* Installs a trait's members on its prototype. Each value builds that member for the instance on first read; the built value shadows the accessor as an own property, so a detached `const { parse } = schema` keeps working.
*
* Call this from a `proto` initializer, which runs once per prototype — never per instance.
*/
function members(proto, table) {
	for (const key in table) {
		const desc = Object.getOwnPropertyDescriptor(table, key);
		if (desc.get) Object.defineProperty(proto, key, {
			...desc,
			enumerable: false
		});
		else defineBound(proto, key, desc.value);
	}
}
/** Shadows a prototype member with an own value, so a getter that builds from the instance runs once. */
function own(inst, key, value, enumerable = true) {
	Object.defineProperty(inst, key, {
		configurable: true,
		writable: true,
		enumerable,
		value
	});
	return value;
}
/** Like {@link own}, for a member that was never an own data property and has to stay out of `Object.keys`. */
function hide(inst, key, value) {
	return own(inst, key, value, false);
}
function defineBound(proto, key, fn) {
	Object.defineProperty(proto, key, {
		configurable: true,
		get() {
			return this == null ? fn : own(this, key, fn.bind(this));
		},
		set(value) {
			own(this, key, value);
		}
	});
}
/** Returns the prototype to install on, or `undefined` if this group is already installed on it. */
function claim(inst, sentinel) {
	const proto = Object.getPrototypeOf(inst);
	return sentinel in proto ? void 0 : proto;
}
let installing;
let broke = false;
const breaker = {
	configurable: true,
	get() {
		broke = true;
	}
};
/**
* Installs a lazily-derived internal on the `_zod` prototype of `inst`'s
* constructor, computed from the internals object itself and cached there on
* first read. One accessor per constructor rather than one per instance.
*/
function defineLazyInternal(inst, key, compute) {
	const proto = Object.getPrototypeOf(inst._zod);
	if (key in proto && installing !== inst._zod) {
		installing = void 0;
		return;
	}
	installing = inst._zod;
	Object.defineProperty(proto, key, {
		configurable: true,
		get() {
			Object.defineProperty(this, key, breaker);
			const outer = broke;
			broke = false;
			try {
				const value = compute(this);
				if (broke) delete this[key];
				else Object.defineProperty(this, key, {
					configurable: true,
					writable: true,
					value
				});
				broke = broke || outer;
				return value;
			} catch (err) {
				delete this[key];
				broke = broke || outer;
				throw err;
			}
		},
		set(value) {
			Object.defineProperty(this, key, {
				configurable: true,
				writable: true,
				value
			});
		}
	});
}
/**
* Installs `key` on `inst`'s prototype, computed by `make` on first read and cached there as an own
* data property. One accessor per constructor rather than one per instance, because an own accessor
* puts every instance after the first into v8 dictionary mode. The key doubles as the sentinel.
*/
function installLazyProp(inst, key, make, enumerable) {
	const proto = claim(inst, key);
	if (!proto) return;
	Object.defineProperty(proto, key, {
		configurable: true,
		get() {
			const desc = {
				configurable: true,
				writable: true,
				enumerable,
				value: void 0
			};
			Object.defineProperty(this, key, desc);
			desc.value = make(this);
			Object.defineProperty(this, key, desc);
			return desc.value;
		},
		set(value) {
			Object.defineProperty(this, key, {
				configurable: true,
				writable: true,
				enumerable,
				value
			});
		}
	});
}
/** Marks the thunk `_catch` synthesises for a constant catch value. `Function.length` cannot tell that thunk from a user callback — rest and defaulted parameters both report arity 0 — and a user callback reads `ctx.error`, whose issues only finalize correctly against the caller's per-parse error map. Provenance can say what arity cannot. A plain string key rather than `Symbol.for`, whose call at module scope no bundler can prove pure — the same shape that anchored `urlCanParse` into every build. */
const CONSTANT_CATCH = "~constantCatch";
/** Wraps a constant catch value in a thunk tagged with {@link CONSTANT_CATCH}. */
function constantCatch(value) {
	const fn = () => value;
	fn[CONSTANT_CATCH] = true;
	return fn;
}
//#endregion
//#region ../../node_modules/.pnpm/zod@4.5.2/node_modules/zod/v4/core/core.js
var _a$1;
const _zodDesc$1 = {
	value: void 0,
	enumerable: false
};
let _E = "captureStackTrace" in Error ? Error : null;
function newError(Definition) {
	const E = _E;
	if (E) {
		const saved = E.stackTraceLimit;
		if (typeof saved === "number") {
			try {
				E.stackTraceLimit = 0;
			} catch {
				_E = null;
				return new Definition();
			}
			try {
				return new Definition();
			} finally {
				E.stackTraceLimit = saved;
			}
		}
	}
	return new Definition();
}
function $constructor(name, initializer, proto, params) {
	const zodProto = {};
	function Internals(def) {
		this.def = def;
		this.constr = _;
		this.traits = /* @__PURE__ */ new Set();
	}
	Internals.prototype = zodProto;
	const protoMembers = proto;
	const initialized = protoMembers && /* @__PURE__ */ new WeakSet();
	function init(inst, def) {
		if (!inst._zod) {
			_zodDesc$1.value = new Internals(def);
			try {
				Object.defineProperty(inst, "_zod", _zodDesc$1);
			} finally {
				_zodDesc$1.value = void 0;
			}
		}
		if (inst._zod.traits.has(name)) return;
		inst._zod.traits.add(name);
		initializer(inst, def);
		if (initialized) {
			const own = Object.getPrototypeOf(inst);
			const ctorProto = inst._zod.constr.prototype;
			let up = own;
			while (up && up !== ctorProto) up = Object.getPrototypeOf(up);
			const target = up ?? own;
			if (!initialized.has(target)) {
				initialized.add(target);
				members(target, protoMembers);
			}
		}
		const proto = _.prototype;
		for (const k in proto) {
			if (!Object.prototype.hasOwnProperty.call(proto, k)) continue;
			if (!(k in inst)) inst[k] = proto[k].bind(inst);
		}
	}
	const Parent = params?.Parent ?? Object;
	class Definition extends Parent {}
	Object.defineProperty(Definition, "name", { value: name });
	function _(def) {
		const inst = params?.Parent ? newError(Definition) : this;
		init(inst, def);
		const deferred = inst._zod.deferred;
		if (deferred) {
			for (const fn of deferred) fn();
			inst._zod.deferred = void 0;
		}
		const pp = globalThis.__zod_globalConfig?.postProcessor;
		if (pp) pp(inst);
		return inst;
	}
	Object.defineProperty(_, "init", { value: init });
	Object.defineProperty(_, Symbol.hasInstance, { value: (inst) => {
		if (params?.Parent && inst instanceof params.Parent) return true;
		return inst?._zod?.traits?.has(name);
	} });
	Object.defineProperty(_, "name", { value: name });
	return _;
}
var $ZodAsyncError = class extends Error {
	constructor() {
		super(`Encountered Promise during synchronous parse. Use .parseAsync() instead.`);
	}
};
var $ZodEncodeError = class extends Error {
	constructor(name) {
		super(`Encountered unidirectional transform during encode: ${name}`);
		this.name = "ZodEncodeError";
	}
};
(_a$1 = globalThis).__zod_globalConfig ?? (_a$1.__zod_globalConfig = {});
const globalConfig = globalThis.__zod_globalConfig;
function config(newConfig) {
	if (newConfig) Object.assign(globalConfig, newConfig);
	return globalConfig;
}
//#endregion
//#region ../../node_modules/.pnpm/zod@4.5.2/node_modules/zod/v4/core/errors.js
function _getMessage() {
	const internals = this._zod;
	internals.message ?? (internals.message = JSON.stringify(internals.def, jsonStringifyReplacer, 2));
	return internals.message;
}
function _setMessage(value) {
	this._zod.message = value;
}
const _messageDesc = {
	get: _getMessage,
	set: _setMessage,
	enumerable: true,
	configurable: true
};
const _zodDesc = {
	value: void 0,
	enumerable: false
};
const _issuesDesc = {
	value: void 0,
	enumerable: false
};
const _installedToString = /* @__PURE__ */ new WeakSet([Object.prototype, Error.prototype]);
const initializer$1 = (inst, def) => {
	inst.name = "$ZodError";
	_zodDesc.value = inst._zod;
	Object.defineProperty(inst, "_zod", _zodDesc);
	_issuesDesc.value = def;
	Object.defineProperty(inst, "issues", _issuesDesc);
	_zodDesc.value = void 0;
	_issuesDesc.value = void 0;
	Object.defineProperty(inst, "message", _messageDesc);
	const proto = Object.getPrototypeOf(inst);
	if (!_installedToString.has(proto)) {
		_installedToString.add(proto);
		Object.defineProperty(proto, "toString", {
			configurable: true,
			enumerable: false,
			get() {
				const value = () => this.message;
				Object.defineProperty(this, "toString", {
					value,
					configurable: true,
					writable: true
				});
				return value;
			},
			set(value) {
				Object.defineProperty(this, "toString", {
					value,
					configurable: true,
					writable: true
				});
			}
		});
	}
};
const $ZodError = $constructor("$ZodError", initializer$1);
const $ZodRealError = $constructor("$ZodError", initializer$1, void 0, { Parent: Error });
/** Get-or-create `obj[key]` as an own data property. A path segment naming an inherited member
* ("toString", "constructor") would otherwise read through to the prototype, and assigning
* "__proto__" would hit the setter instead of creating a key. */
function node(obj, key, make) {
	if (!Object.prototype.hasOwnProperty.call(obj, key)) {
		if (key === "__proto__") Object.defineProperty(obj, key, {
			value: make(),
			writable: true,
			enumerable: true,
			configurable: true
		});
		else obj[key] = make();
	}
	return obj[key];
}
function flattenError(error, mapper = (issue) => issue.message) {
	const fieldErrors = {};
	const formErrors = [];
	for (const sub of error.issues) if (sub.path.length > 0) node(fieldErrors, sub.path[0], () => []).push(mapper(sub));
	else formErrors.push(mapper(sub));
	return {
		formErrors,
		fieldErrors
	};
}
function formatError(error, mapper = (issue) => issue.message) {
	const fieldErrors = { _errors: [] };
	const processError = (error, path = []) => {
		for (const issue of error.issues) if (issue.code === "invalid_union" && issue.errors.length) issue.errors.map((issues) => processError({ issues }, [...path, ...issue.path]));
		else if (issue.code === "invalid_key") processError({ issues: issue.issues }, [...path, ...issue.path]);
		else if (issue.code === "invalid_element") processError({ issues: issue.issues }, [...path, ...issue.path]);
		else {
			const fullpath = [...path, ...issue.path];
			if (fullpath.length === 0) fieldErrors._errors.push(mapper(issue));
			else {
				let curr = fieldErrors;
				let i = 0;
				while (i < fullpath.length) {
					const el = fullpath[i];
					const terminal = i === fullpath.length - 1;
					if (el === "_errors") {
						if (terminal) curr._errors.push(mapper(issue));
						i++;
						continue;
					}
					if (!Object.prototype.hasOwnProperty.call(curr, el)) Object.defineProperty(curr, el, {
						value: { _errors: [] },
						enumerable: true,
						writable: true,
						configurable: true
					});
					const node = curr[el];
					if (terminal) node._errors.push(mapper(issue));
					curr = node;
					i++;
				}
			}
		}
	};
	processError(error);
	return fieldErrors;
}
//#endregion
//#region ../../node_modules/.pnpm/zod@4.5.2/node_modules/zod/v4/core/parse.js
function finalizeParams(callee, params) {
	return {
		callee: params?.callee ?? callee,
		Err: params?.Err
	};
}
const _parse = (_Err) => {
	const fn = (schema, value, _ctx, _params) => {
		const ctx = _ctx ? {
			..._ctx,
			async: false
		} : { async: false };
		const result = schema._zod.run({
			value,
			issues: []
		}, ctx);
		if (result instanceof Promise) throw new $ZodAsyncError();
		if (result.issues.length) {
			const e = new ((_params?.Err) ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
			captureStackTrace(e, _params?.callee ?? fn);
			throw e;
		}
		return result.value;
	};
	return fn;
};
const _parseAsync = (_Err) => {
	const fn = async (schema, value, _ctx, params) => {
		const ctx = _ctx ? {
			..._ctx,
			async: true
		} : { async: true };
		let result = schema._zod.run({
			value,
			issues: []
		}, ctx);
		if (result instanceof Promise) result = await result;
		if (result.issues.length) {
			const e = new ((params?.Err) ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
			captureStackTrace(e, params?.callee ?? fn);
			throw e;
		}
		return result.value;
	};
	return fn;
};
const _safeParse = (_Err) => (schema, value, _ctx) => {
	const ctx = _ctx ? {
		..._ctx,
		async: false
	} : { async: false };
	const result = schema._zod.run({
		value,
		issues: []
	}, ctx);
	if (result instanceof Promise) throw new $ZodAsyncError();
	return result.issues.length ? {
		success: false,
		error: new (_Err ?? $ZodError)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
	} : {
		success: true,
		data: result.value
	};
};
const safeParse$1 = /* @__PURE__*/ _safeParse($ZodRealError);
const _safeParseAsync = (_Err) => async (schema, value, _ctx) => {
	const ctx = _ctx ? {
		..._ctx,
		async: true
	} : { async: true };
	let result = schema._zod.run({
		value,
		issues: []
	}, ctx);
	if (result instanceof Promise) result = await result;
	return result.issues.length ? {
		success: false,
		error: new _Err(result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
	} : {
		success: true,
		data: result.value
	};
};
const safeParseAsync$1 = /* @__PURE__*/ _safeParseAsync($ZodRealError);
const _encode = (_Err) => {
	const parse = _parse(_Err);
	const fn = (schema, value, _ctx, _params) => {
		const ctx = _ctx ? {
			..._ctx,
			direction: "backward"
		} : { direction: "backward" };
		return parse(schema, value, ctx, finalizeParams(fn, _params));
	};
	return fn;
};
const _decode = (_Err) => {
	const parse = _parse(_Err);
	const fn = (schema, value, _ctx, _params) => {
		return parse(schema, value, _ctx, finalizeParams(fn, _params));
	};
	return fn;
};
const _encodeAsync = (_Err) => {
	const parseAsync = _parseAsync(_Err);
	const fn = async (schema, value, _ctx, _params) => {
		const ctx = _ctx ? {
			..._ctx,
			direction: "backward"
		} : { direction: "backward" };
		return await parseAsync(schema, value, ctx, finalizeParams(fn, _params));
	};
	return fn;
};
const _decodeAsync = (_Err) => {
	const parseAsync = _parseAsync(_Err);
	const fn = async (schema, value, _ctx, _params) => {
		return await parseAsync(schema, value, _ctx, finalizeParams(fn, _params));
	};
	return fn;
};
const _safeEncode = (_Err) => (schema, value, _ctx) => {
	const ctx = _ctx ? {
		..._ctx,
		direction: "backward"
	} : { direction: "backward" };
	return _safeParse(_Err)(schema, value, ctx);
};
const _safeDecode = (_Err) => (schema, value, _ctx) => {
	return _safeParse(_Err)(schema, value, _ctx);
};
const _safeEncodeAsync = (_Err) => async (schema, value, _ctx) => {
	const ctx = _ctx ? {
		..._ctx,
		direction: "backward"
	} : { direction: "backward" };
	return _safeParseAsync(_Err)(schema, value, ctx);
};
const _safeDecodeAsync = (_Err) => async (schema, value, _ctx) => {
	return _safeParseAsync(_Err)(schema, value, _ctx);
};
//#endregion
//#region ../../node_modules/.pnpm/zod@4.5.2/node_modules/zod/v4/core/regexes.js
/**
* @deprecated CUID v1 is deprecated by its authors due to information leakage
* (timestamps embedded in the id). Use {@link cuid2} instead.
* See https://github.com/paralleldrive/cuid.
*/
const cuid = /^[cC][0-9a-z]{6,}$/;
const cuid2 = /^[0-9a-z]+$/;
const ulid = /^[0-7][0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{25}$/;
const xid = /^[0-9a-vA-V]{20}$/;
const ksuid = /^[A-Za-z0-9]{27}$/;
const nanoid = /^[a-zA-Z0-9_-]{21}$/;
function nanoidOfLength(length) {
	return new RegExp(`^[a-zA-Z0-9_-]{${length}}$`);
}
/** ISO 8601-1 duration regex. Does not support the 8601-2 extensions like negative durations or fractional/negative components. */
const duration = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/;
/** A regex for any UUID-like identifier: 8-4-4-4-12 hex pattern */
const guid = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/;
/** Returns a regex for validating an RFC 9562/4122 UUID.
*
* @param version Optionally specify a version 1-8. If no version is specified, all versions are supported. */
const uuid = (version) => {
	if (!version) return /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/;
	return new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${version}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`);
};
/** Practical email validation */
const email = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;
const _emoji$1 = `^[\\p{Extended_Pictographic}\\p{Emoji_Component}]+$`;
function emoji() {
	return new RegExp(_emoji$1, "u");
}
const ipv4 = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
const ipv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/;
const cidrv4 = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/;
const cidrv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
const base64 = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/;
const base64url = /^[A-Za-z0-9_-]*$/;
const httpProtocol = /^https?$/;
const e164 = /^\+[1-9]\d{6,14}$/;
const dateSource = `(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))`;
/** Anchors a pattern source. The interpolation lives here rather than at the call site because
* esbuild will not drop a `@__PURE__` call whose own argument interpolates a variable, but it
* will drop `anchor(dateSource)`. Keeping it inline pinned `date` into every bundle. */
function anchor(source) {
	return new RegExp(`^${source}$`);
}
const date = /*@__PURE__*/ anchor(dateSource);
function timeSource(args) {
	const hhmm = `(?:[01]\\d|2[0-3]):[0-5]\\d`;
	return typeof args.precision === "number" ? args.precision === -1 ? `${hhmm}` : args.precision === 0 ? `${hhmm}:[0-5]\\d` : `${hhmm}:[0-5]\\d\\.\\d{${args.precision}}` : args.seconds ? `${hhmm}:[0-5]\\d(?:\\.\\d+)?` : `${hhmm}(?::[0-5]\\d(?:\\.\\d+)?)?`;
}
function time(args) {
	return new RegExp(`^${timeSource(args)}$`);
}
function datetime(args) {
	const opts = ["Z"];
	if (args.offset) opts.push(`([+-](?:[01]\\d|2[0-3]):[0-5]\\d)`);
	const qualified = `${timeSource({
		precision: args.precision,
		seconds: true
	})}(?:${opts.join("|")})`;
	const timeRegex = args.local ? `${qualified}|${timeSource({ precision: args.precision })}` : qualified;
	return new RegExp(`^${dateSource}T(?:${timeRegex})$`);
}
const string$1 = (params) => {
	const regex = params ? `[\\s\\S]{${params?.minimum ?? 0},${params?.maximum ?? ""}}` : `[\\s\\S]*`;
	return new RegExp(`^${regex}$`);
};
const integer = /^-?\d+$/;
const number$1 = /^-?\d+(?:\.\d+)?$/;
const boolean$1 = /^(?:true|false)$/i;
const _undefined$2 = /^undefined$/i;
const lowercase = /^[^A-Z]*$/;
const uppercase = /^[^a-z]*$/;
//#endregion
//#region ../../node_modules/.pnpm/zod@4.5.2/node_modules/zod/v4/core/checks.js
const $ZodCheck = /*@__PURE__*/ $constructor("$ZodCheck", (inst, def) => {
	var _a;
	inst._zod ?? (inst._zod = {});
	inst._zod.def = def;
	(_a = inst._zod).onattach ?? (_a.onattach = []);
});
/** Default `when` for length-based checks: run only on non-nullish values with a `length`. */
const _whenHasLength = (payload) => {
	const val = payload.value;
	return !nullish(val) && val.length !== void 0;
};
const numericOriginMap = {
	number: "number",
	bigint: "bigint",
	object: "date"
};
const $ZodCheckLessThan = /*@__PURE__*/ $constructor("$ZodCheckLessThan", (inst, def) => {
	$ZodCheck.init(inst, def);
	const origin = numericOriginMap[typeof def.value];
	inst._zod.onattach.push((inst) => {
		const bag = inst._zod.bag;
		const curr = (def.inclusive ? bag.maximum : bag.exclusiveMaximum) ?? Number.POSITIVE_INFINITY;
		if (def.value < curr) {
			if (def.inclusive) bag.maximum = def.value;
			else bag.exclusiveMaximum = def.value;
		}
	});
	inst._zod.check = (payload) => {
		if (def.inclusive ? payload.value <= def.value : payload.value < def.value) return;
		payload.issues.push({
			origin: numericOriginMap[typeof payload.value] ?? origin,
			code: "too_big",
			maximum: typeof def.value === "object" ? def.value.getTime() : def.value,
			input: payload.value,
			inclusive: def.inclusive,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckGreaterThan = /*@__PURE__*/ $constructor("$ZodCheckGreaterThan", (inst, def) => {
	$ZodCheck.init(inst, def);
	const origin = numericOriginMap[typeof def.value];
	inst._zod.onattach.push((inst) => {
		const bag = inst._zod.bag;
		const curr = (def.inclusive ? bag.minimum : bag.exclusiveMinimum) ?? Number.NEGATIVE_INFINITY;
		if (def.value > curr) {
			if (def.inclusive) bag.minimum = def.value;
			else bag.exclusiveMinimum = def.value;
		}
	});
	inst._zod.check = (payload) => {
		if (def.inclusive ? payload.value >= def.value : payload.value > def.value) return;
		payload.issues.push({
			origin: numericOriginMap[typeof payload.value] ?? origin,
			code: "too_small",
			minimum: typeof def.value === "object" ? def.value.getTime() : def.value,
			input: payload.value,
			inclusive: def.inclusive,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckMultipleOf = /*@__PURE__*/ $constructor("$ZodCheckMultipleOf", (inst, def) => {
	$ZodCheck.init(inst, def);
	inst._zod.onattach.push((inst) => {
		var _a;
		(_a = inst._zod.bag).multipleOf ?? (_a.multipleOf = def.value);
	});
	inst._zod.check = (payload) => {
		if (typeof payload.value !== typeof def.value) throw new Error("Cannot mix number and bigint in multiple_of check.");
		if (typeof payload.value === "bigint" ? def.value !== BigInt(0) && payload.value % def.value === BigInt(0) : floatSafeRemainder(payload.value, def.value) === 0) return;
		payload.issues.push({
			origin: typeof payload.value,
			code: "not_multiple_of",
			divisor: def.value,
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckNumberFormat = /*@__PURE__*/ $constructor("$ZodCheckNumberFormat", (inst, def) => {
	$ZodCheck.init(inst, def);
	def.format = def.format || "float64";
	const isInt = def.format?.includes("int");
	const origin = isInt ? "int" : "number";
	const [minimum, maximum] = NUMBER_FORMAT_RANGES[def.format];
	inst._zod.onattach.push((inst) => {
		const bag = inst._zod.bag;
		bag.format = def.format;
		bag.minimum = minimum;
		bag.maximum = maximum;
		if (isInt) bag.pattern = integer;
	});
	inst._zod.check = (payload) => {
		const input = payload.value;
		if (isInt) {
			if (!Number.isInteger(input)) {
				payload.issues.push({
					expected: origin,
					format: def.format,
					code: "invalid_type",
					continue: false,
					input,
					inst
				});
				return;
			}
			if (!Number.isSafeInteger(input)) {
				if (input > 0) payload.issues.push({
					input,
					code: "too_big",
					maximum: Number.MAX_SAFE_INTEGER,
					note: "Integers must be within the safe integer range.",
					inst,
					origin,
					inclusive: true,
					continue: !def.abort
				});
				else payload.issues.push({
					input,
					code: "too_small",
					minimum: Number.MIN_SAFE_INTEGER,
					note: "Integers must be within the safe integer range.",
					inst,
					origin,
					inclusive: true,
					continue: !def.abort
				});
				return;
			}
		}
		if (input < minimum) payload.issues.push({
			origin: "number",
			input,
			code: "too_small",
			minimum,
			inclusive: true,
			inst,
			continue: !def.abort
		});
		if (input > maximum) payload.issues.push({
			origin: "number",
			input,
			code: "too_big",
			maximum,
			inclusive: true,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckMaxLength = /*@__PURE__*/ $constructor("$ZodCheckMaxLength", (inst, def) => {
	var _a;
	$ZodCheck.init(inst, def);
	(_a = inst._zod.def).when ?? (_a.when = _whenHasLength);
	inst._zod.onattach.push((inst) => {
		const curr = inst._zod.bag.maximum ?? Number.POSITIVE_INFINITY;
		if (def.maximum < curr) inst._zod.bag.maximum = def.maximum;
	});
	inst._zod.check = (payload) => {
		const input = payload.value;
		const units = input.length;
		if ((typeof input === "string" && units > def.maximum ? codePointLength(input) : units) <= def.maximum) return;
		const origin = getLengthableOrigin(input);
		payload.issues.push({
			origin,
			code: "too_big",
			maximum: def.maximum,
			inclusive: true,
			input,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckMinLength = /*@__PURE__*/ $constructor("$ZodCheckMinLength", (inst, def) => {
	var _a;
	$ZodCheck.init(inst, def);
	(_a = inst._zod.def).when ?? (_a.when = _whenHasLength);
	inst._zod.onattach.push((inst) => {
		const curr = inst._zod.bag.minimum ?? Number.NEGATIVE_INFINITY;
		if (def.minimum > curr) inst._zod.bag.minimum = def.minimum;
	});
	inst._zod.check = (payload) => {
		const input = payload.value;
		const units = input.length;
		if ((typeof input === "string" && units >= def.minimum && units < def.minimum * 2 ? codePointLength(input) : units) >= def.minimum) return;
		const origin = getLengthableOrigin(input);
		payload.issues.push({
			origin,
			code: "too_small",
			minimum: def.minimum,
			inclusive: true,
			input,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckLengthEquals = /*@__PURE__*/ $constructor("$ZodCheckLengthEquals", (inst, def) => {
	var _a;
	$ZodCheck.init(inst, def);
	(_a = inst._zod.def).when ?? (_a.when = _whenHasLength);
	inst._zod.onattach.push((inst) => {
		const bag = inst._zod.bag;
		bag.minimum = def.length;
		bag.maximum = def.length;
		bag.length = def.length;
	});
	inst._zod.check = (payload) => {
		const input = payload.value;
		const units = input.length;
		const length = typeof input === "string" && units >= def.length && units <= def.length * 2 ? codePointLength(input) : units;
		if (length === def.length) return;
		const origin = getLengthableOrigin(input);
		const tooBig = length > def.length;
		payload.issues.push({
			origin,
			...tooBig ? {
				code: "too_big",
				maximum: def.length
			} : {
				code: "too_small",
				minimum: def.length
			},
			inclusive: true,
			exact: true,
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckStringFormat = /*@__PURE__*/ $constructor("$ZodCheckStringFormat", (inst, def) => {
	var _a, _b;
	$ZodCheck.init(inst, def);
	inst._zod.onattach.push((inst) => {
		const bag = inst._zod.bag;
		bag.format = def.format;
		if (def.pattern) {
			bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
			bag.patterns.add(def.pattern);
		}
	});
	if (def.pattern) (_a = inst._zod).check ?? (_a.check = (payload) => {
		def.pattern.lastIndex = 0;
		if (def.pattern.test(payload.value)) return;
		payload.issues.push({
			origin: "string",
			code: "invalid_format",
			format: def.format,
			input: payload.value,
			...def.pattern ? { pattern: def.pattern.toString() } : {},
			inst,
			continue: !def.abort
		});
	});
	else (_b = inst._zod).check ?? (_b.check = () => {});
});
const $ZodCheckRegex = /*@__PURE__*/ $constructor("$ZodCheckRegex", (inst, def) => {
	$ZodCheckStringFormat.init(inst, def);
	inst._zod.check = (payload) => {
		def.pattern.lastIndex = 0;
		if (def.pattern.test(payload.value)) return;
		payload.issues.push({
			origin: "string",
			code: "invalid_format",
			format: "regex",
			input: payload.value,
			pattern: def.pattern.toString(),
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckLowerCase = /*@__PURE__*/ $constructor("$ZodCheckLowerCase", (inst, def) => {
	def.pattern ?? (def.pattern = lowercase);
	$ZodCheckStringFormat.init(inst, def);
});
const $ZodCheckUpperCase = /*@__PURE__*/ $constructor("$ZodCheckUpperCase", (inst, def) => {
	def.pattern ?? (def.pattern = uppercase);
	$ZodCheckStringFormat.init(inst, def);
});
const $ZodCheckIncludes = /*@__PURE__*/ $constructor("$ZodCheckIncludes", (inst, def) => {
	$ZodCheck.init(inst, def);
	const escapedRegex = escapeRegex(def.includes);
	const pattern = new RegExp(typeof def.position === "number" ? `^.{${def.position},}${escapedRegex}` : escapedRegex);
	def.pattern = pattern;
	inst._zod.onattach.push((inst) => {
		const bag = inst._zod.bag;
		bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
		bag.patterns.add(pattern);
	});
	inst._zod.check = (payload) => {
		if (payload.value.includes(def.includes, def.position)) return;
		payload.issues.push({
			origin: "string",
			code: "invalid_format",
			format: "includes",
			includes: def.includes,
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckStartsWith = /*@__PURE__*/ $constructor("$ZodCheckStartsWith", (inst, def) => {
	$ZodCheck.init(inst, def);
	const pattern = new RegExp(`^${escapeRegex(def.prefix)}.*`);
	def.pattern ?? (def.pattern = pattern);
	inst._zod.onattach.push((inst) => {
		const bag = inst._zod.bag;
		bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
		bag.patterns.add(pattern);
	});
	inst._zod.check = (payload) => {
		if (payload.value.startsWith(def.prefix)) return;
		payload.issues.push({
			origin: "string",
			code: "invalid_format",
			format: "starts_with",
			prefix: def.prefix,
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckEndsWith = /*@__PURE__*/ $constructor("$ZodCheckEndsWith", (inst, def) => {
	$ZodCheck.init(inst, def);
	const pattern = new RegExp(`.*${escapeRegex(def.suffix)}$`);
	def.pattern ?? (def.pattern = pattern);
	inst._zod.onattach.push((inst) => {
		const bag = inst._zod.bag;
		bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
		bag.patterns.add(pattern);
	});
	inst._zod.check = (payload) => {
		if (payload.value.endsWith(def.suffix)) return;
		payload.issues.push({
			origin: "string",
			code: "invalid_format",
			format: "ends_with",
			suffix: def.suffix,
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckOverwrite = /*@__PURE__*/ $constructor("$ZodCheckOverwrite", (inst, def) => {
	$ZodCheck.init(inst, def);
	inst._zod.check = (payload) => {
		payload.value = def.tx(payload.value);
	};
});
//#endregion
//#region ../../node_modules/.pnpm/zod@4.5.2/node_modules/zod/v4/core/doc.js
var Doc = class {
	constructor(args = [], closed = {}) {
		this.content = [];
		this.indent = 0;
		this.args = args;
		this.closed = closed;
	}
	indented(fn) {
		this.indent += 1;
		fn(this);
		this.indent -= 1;
	}
	write(arg) {
		if (typeof arg === "function") {
			arg(this, { execution: "sync" });
			arg(this, { execution: "async" });
			return;
		}
		const lines = arg.split("\n").filter((x) => x);
		const minIndent = Math.min(...lines.map((x) => x.length - x.trimStart().length));
		const dedented = lines.map((x) => x.slice(minIndent)).map((x) => " ".repeat(this.indent * 2) + x);
		for (const line of dedented) this.content.push(line);
	}
	compile() {
		const F = Function;
		const content = this?.content ?? [``];
		return new F(...Object.keys(this.closed), `return function (${this.args.join(", ")}) {\n${content.join("\n")}\n};`)(...Object.values(this.closed));
	}
};
//#endregion
//#region ../../node_modules/.pnpm/zod@4.5.2/node_modules/zod/v4/core/versions.js
const version = {
	major: 4,
	minor: 5,
	patch: 2
};
//#endregion
//#region ../../node_modules/.pnpm/zod@4.5.2/node_modules/zod/v4/core/schemas.js
const $ZodType = /*@__PURE__*/ $constructor("$ZodType", (inst, def) => {
	var _a;
	inst ?? (inst = {});
	inst._zod.def = def;
	inst._zod.bag = inst._zod.bag || {};
	inst._zod.version = version;
	const defChecks = inst._zod.def.checks;
	const checks = inst._zod.traits.has("$ZodCheck") ? [inst, ...defChecks ?? []] : defChecks?.length ? [...defChecks] : [];
	for (const ch of checks) for (const fn of ch._zod.onattach) fn(inst);
	if (checks.length === 0) {
		(_a = inst._zod).deferred ?? (_a.deferred = []);
		inst._zod.deferred?.push(() => {
			inst._zod.run = inst._zod.parse;
		});
	} else {
		const runChecks = (payload, checks, ctx) => {
			if (payload.memo) return payload;
			let isAborted = aborted(payload);
			let asyncResult;
			for (const ch of checks) {
				if (ch._zod.def.when) {
					if (explicitlyAborted(payload)) continue;
					if (!ch._zod.def.when(payload)) continue;
				} else if (isAborted) continue;
				const currLen = payload.issues.length;
				const _ = ch._zod.check(payload);
				if (_ instanceof Promise && ctx?.async === false) throw new $ZodAsyncError();
				if (asyncResult || _ instanceof Promise) asyncResult = (asyncResult ?? Promise.resolve()).then(async () => {
					await _;
					if (payload.issues.length === currLen) return;
					attachSchema(payload.issues, currLen, inst);
					if (!isAborted) isAborted = aborted(payload, currLen);
				});
				else {
					if (payload.issues.length === currLen) continue;
					attachSchema(payload.issues, currLen, inst);
					if (!isAborted) isAborted = aborted(payload, currLen);
				}
			}
			if (asyncResult) return asyncResult.then(() => {
				return payload;
			});
			return payload;
		};
		const handleCanaryResult = (canary, payload, ctx) => {
			if (aborted(canary)) {
				canary.aborted = true;
				return canary;
			}
			const checkResult = runChecks(payload, checks, ctx);
			if (checkResult instanceof Promise) {
				if (ctx.async === false) throw new $ZodAsyncError();
				return checkResult.then((checkResult) => inst._zod.parse(checkResult, ctx));
			}
			return inst._zod.parse(checkResult, ctx);
		};
		inst._zod.run = (payload, ctx) => {
			if (ctx.skipChecks) return inst._zod.parse(payload, ctx);
			if (ctx.direction === "backward") {
				const canary = inst._zod.parse({
					value: payload.value,
					issues: []
				}, {
					...ctx,
					skipChecks: true
				});
				if (canary instanceof Promise) return canary.then((canary) => {
					return handleCanaryResult(canary, payload, ctx);
				});
				return handleCanaryResult(canary, payload, ctx);
			}
			const result = inst._zod.parse(payload, ctx);
			if (result instanceof Promise) {
				if (ctx.async === false) throw new $ZodAsyncError();
				return result.then((result) => runChecks(result, checks, ctx));
			}
			return runChecks(result, checks, ctx);
		};
	}
}, {
	get "~standard"() {
		return hide(this, "~standard", standardProps(this));
	},
	set "~standard"(value) {
		own(this, "~standard", value);
	}
});
/** The Standard Schema surface for `inst`. Shared so wrappers can extend it without forcing it. */
const toStandardResult = (r) => r.success ? { value: r.data } : { issues: r.error?.issues };
function standardProps(inst) {
	return {
		validate: (value) => {
			try {
				return toStandardResult(safeParse$1(inst, value));
			} catch (_) {
				return safeParseAsync$1(inst, value).then(toStandardResult);
			}
		},
		vendor: "zod",
		version: 1
	};
}
const $ZodString = /*@__PURE__*/ $constructor("$ZodString", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.pattern = [...inst?._zod.bag?.patterns ?? []].pop() ?? string$1(inst._zod.bag);
	inst._zod.parse = (payload, _) => {
		if (def.coerce) try {
			payload.value = String(payload.value);
		} catch (_) {}
		if (typeof payload.value === "string") return payload;
		payload.issues.push({
			expected: "string",
			code: "invalid_type",
			input: payload.value,
			inst
		});
		return payload;
	};
});
const $ZodStringFormat = /*@__PURE__*/ $constructor("$ZodStringFormat", (inst, def) => {
	$ZodCheckStringFormat.init(inst, def);
	$ZodString.init(inst, def);
});
const $ZodGUID = /*@__PURE__*/ $constructor("$ZodGUID", (inst, def) => {
	def.pattern ?? (def.pattern = guid);
	$ZodStringFormat.init(inst, def);
});
const $ZodUUID = /*@__PURE__*/ $constructor("$ZodUUID", (inst, def) => {
	if (def.version) {
		const v = {
			v1: 1,
			v2: 2,
			v3: 3,
			v4: 4,
			v5: 5,
			v6: 6,
			v7: 7,
			v8: 8
		}[def.version];
		if (v === void 0) throw new Error(`Invalid UUID version: "${def.version}"`);
		def.pattern ?? (def.pattern = uuid(v));
	} else def.pattern ?? (def.pattern = uuid());
	$ZodStringFormat.init(inst, def);
});
const $ZodEmail = /*@__PURE__*/ $constructor("$ZodEmail", (inst, def) => {
	def.pattern ?? (def.pattern = email);
	$ZodStringFormat.init(inst, def);
});
/** Parses a URL for `$ZodURL`, applying the one guard the URL constructor cannot express. Returns the parsed URL, or a code naming the stage that rejected it — the runtime needs that distinction to pick an issue note, and compiled code only needs to know it is not a URL. */
function parseURLObject(trimmed, def) {
	if (!def.normalize && def.protocol?.source === httpProtocol.source && !/^https?:\/\//i.test(trimmed)) return 1;
	try {
		return new URL(trimmed);
	} catch {
		return 2;
	}
}
const asciiTabOrNewline = /[\t\n\r]/g;
/** The URL parser deletes every ASCII tab, LF and CR from its input before it parses, so `new URL("https://exa\nmple.com")` reports on `example.com`. Applying the same deletion to the returned value closes the half of that divergence which can move the host; the parser's other rewrite, stripping C0 controls at the edges, cannot. */
function stripTabAndNewline(value) {
	return value.replace(asciiTabOrNewline, "");
}
function urlHostnameOk(url, hostname) {
	hostname.lastIndex = 0;
	return hostname.test(url.hostname);
}
function urlProtocolOk(url, protocol) {
	protocol.lastIndex = 0;
	return protocol.test(url.protocol.endsWith(":") ? url.protocol.slice(0, -1) : url.protocol);
}
const $ZodURL = /*@__PURE__*/ $constructor("$ZodURL", (inst, def) => {
	$ZodStringFormat.init(inst, def);
	inst._zod.check = (payload) => {
		try {
			const trimmed = payload.value.trim();
			const url = parseURLObject(trimmed, def);
			if (url === 1) {
				payload.issues.push({
					code: "invalid_format",
					format: "url",
					note: "Invalid URL format",
					input: payload.value,
					inst,
					continue: !def.abort
				});
				return;
			}
			if (url === 2) {
				payload.issues.push({
					code: "invalid_format",
					format: "url",
					input: payload.value,
					inst,
					continue: !def.abort
				});
				return;
			}
			if (def.hostname && !urlHostnameOk(url, def.hostname)) payload.issues.push({
				code: "invalid_format",
				format: "url",
				note: "Invalid hostname",
				pattern: def.hostname.source,
				input: payload.value,
				inst,
				continue: !def.abort
			});
			if (def.protocol && !urlProtocolOk(url, def.protocol)) payload.issues.push({
				code: "invalid_format",
				format: "url",
				note: "Invalid protocol",
				pattern: def.protocol.source,
				input: payload.value,
				inst,
				continue: !def.abort
			});
			payload.value = def.normalize ? url.href : stripTabAndNewline(trimmed);
			return;
		} catch (_) {
			payload.issues.push({
				code: "invalid_format",
				format: "url",
				input: payload.value,
				inst,
				continue: !def.abort
			});
		}
	};
});
const $ZodEmoji = /*@__PURE__*/ $constructor("$ZodEmoji", (inst, def) => {
	def.pattern ?? (def.pattern = emoji());
	$ZodStringFormat.init(inst, def);
});
const $ZodNanoID = /*@__PURE__*/ $constructor("$ZodNanoID", (inst, def) => {
	if (def.length !== void 0 && (!Number.isInteger(def.length) || def.length < 1)) throw new Error(`Invalid nanoid length: ${def.length}`);
	def.pattern ?? (def.pattern = def.length === void 0 ? nanoid : nanoidOfLength(def.length));
	$ZodStringFormat.init(inst, def);
});
/**
* @deprecated CUID v1 is deprecated by its authors due to information leakage
* (timestamps embedded in the id). Use {@link $ZodCUID2} instead.
* See https://github.com/paralleldrive/cuid.
*/
const $ZodCUID = /*@__PURE__*/ $constructor("$ZodCUID", (inst, def) => {
	def.pattern ?? (def.pattern = cuid);
	$ZodStringFormat.init(inst, def);
});
const $ZodCUID2 = /*@__PURE__*/ $constructor("$ZodCUID2", (inst, def) => {
	def.pattern ?? (def.pattern = cuid2);
	$ZodStringFormat.init(inst, def);
});
const $ZodULID = /*@__PURE__*/ $constructor("$ZodULID", (inst, def) => {
	def.pattern ?? (def.pattern = ulid);
	$ZodStringFormat.init(inst, def);
});
const $ZodXID = /*@__PURE__*/ $constructor("$ZodXID", (inst, def) => {
	def.pattern ?? (def.pattern = xid);
	$ZodStringFormat.init(inst, def);
});
const $ZodKSUID = /*@__PURE__*/ $constructor("$ZodKSUID", (inst, def) => {
	def.pattern ?? (def.pattern = ksuid);
	$ZodStringFormat.init(inst, def);
});
const $ZodISODateTime = /*@__PURE__*/ $constructor("$ZodISODateTime", (inst, def) => {
	def.pattern ?? (def.pattern = datetime(def));
	$ZodStringFormat.init(inst, def);
	if (def.local || def.precision === -1) {
		inst._zod.bag.laxFormat = true;
		inst._zod.onattach.push((s) => {
			s._zod.bag.laxFormat = true;
		});
	}
});
const $ZodISODate = /*@__PURE__*/ $constructor("$ZodISODate", (inst, def) => {
	def.pattern ?? (def.pattern = date);
	$ZodStringFormat.init(inst, def);
});
const $ZodISOTime = /*@__PURE__*/ $constructor("$ZodISOTime", (inst, def) => {
	def.pattern ?? (def.pattern = time(def));
	$ZodStringFormat.init(inst, def);
});
const $ZodISODuration = /*@__PURE__*/ $constructor("$ZodISODuration", (inst, def) => {
	def.pattern ?? (def.pattern = duration);
	$ZodStringFormat.init(inst, def);
});
const $ZodIPv4 = /*@__PURE__*/ $constructor("$ZodIPv4", (inst, def) => {
	def.pattern ?? (def.pattern = ipv4);
	$ZodStringFormat.init(inst, def);
	inst._zod.bag.format = `ipv4`;
});
/** An IPv6 address is written with hex digits, colons and dots, and nothing else. The guard is what makes the check below an IPv6 check: `new URL("http://[...]")` parses an authority, not an address, so `@` and `\` re-delimit it and `"::@1\\"` validates against the host `0.0.0.1`. The URL parser also deletes ASCII tab, LF and CR rather than failing, which is how `"::1\n"` validated as `::1`. */
const ipv6Alphabet = /^[0-9a-fA-F:.]+$/;
function isValidIPv6(value) {
	if (!ipv6Alphabet.test(value)) return false;
	try {
		new URL(`http://[${value}]`);
		return true;
	} catch {
		return false;
	}
}
const $ZodIPv6 = /*@__PURE__*/ $constructor("$ZodIPv6", (inst, def) => {
	def.pattern ?? (def.pattern = ipv6);
	$ZodStringFormat.init(inst, def);
	inst._zod.bag.format = `ipv6`;
	inst._zod.check = (payload) => {
		if (!isValidIPv6(payload.value)) payload.issues.push({
			code: "invalid_format",
			format: "ipv6",
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCIDRv4 = /*@__PURE__*/ $constructor("$ZodCIDRv4", (inst, def) => {
	def.pattern ?? (def.pattern = cidrv4);
	$ZodStringFormat.init(inst, def);
});
function isValidCIDRv6(value) {
	const parts = value.split("/");
	if (parts.length !== 2) return false;
	const [address, prefix] = parts;
	if (!prefix) return false;
	const prefixNum = Number(prefix);
	if (`${prefixNum}` !== prefix) return false;
	if (prefixNum < 0 || prefixNum > 128) return false;
	return isValidIPv6(address);
}
const $ZodCIDRv6 = /*@__PURE__*/ $constructor("$ZodCIDRv6", (inst, def) => {
	def.pattern ?? (def.pattern = cidrv6);
	$ZodStringFormat.init(inst, def);
	inst._zod.check = (payload) => {
		if (!isValidCIDRv6(payload.value)) payload.issues.push({
			code: "invalid_format",
			format: "cidrv6",
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
function isValidBase64(data) {
	if (data === "") return true;
	if (/\s/.test(data)) return false;
	if (data.length % 4 !== 0) return false;
	try {
		atob(data);
		return true;
	} catch {
		return false;
	}
}
const $ZodBase64 = /*@__PURE__*/ $constructor("$ZodBase64", (inst, def) => {
	def.pattern ?? (def.pattern = base64);
	$ZodStringFormat.init(inst, def);
	inst._zod.bag.contentEncoding = "base64";
	inst._zod.check = (payload) => {
		if (isValidBase64(payload.value)) return;
		payload.issues.push({
			code: "invalid_format",
			format: "base64",
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
function isValidBase64URL(data) {
	if (!base64url.test(data)) return false;
	const base64 = data.replace(/[-_]/g, (c) => c === "-" ? "+" : "/");
	return isValidBase64(base64.padEnd(Math.ceil(base64.length / 4) * 4, "="));
}
const $ZodBase64URL = /*@__PURE__*/ $constructor("$ZodBase64URL", (inst, def) => {
	def.pattern ?? (def.pattern = base64url);
	$ZodStringFormat.init(inst, def);
	inst._zod.bag.contentEncoding = "base64url";
	inst._zod.check = (payload) => {
		if (isValidBase64URL(payload.value)) return;
		payload.issues.push({
			code: "invalid_format",
			format: "base64url",
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodE164 = /*@__PURE__*/ $constructor("$ZodE164", (inst, def) => {
	def.pattern ?? (def.pattern = e164);
	$ZodStringFormat.init(inst, def);
});
function isValidJWT(token, algorithm = null) {
	try {
		const tokensParts = token.split(".");
		if (tokensParts.length !== 3) return false;
		const [header] = tokensParts;
		if (!header) return false;
		const parsedHeader = JSON.parse(atob(header));
		if ("typ" in parsedHeader && parsedHeader?.typ !== "JWT") return false;
		if (!parsedHeader.alg) return false;
		if (algorithm && (!("alg" in parsedHeader) || parsedHeader.alg !== algorithm)) return false;
		return true;
	} catch {
		return false;
	}
}
const $ZodJWT = /*@__PURE__*/ $constructor("$ZodJWT", (inst, def) => {
	$ZodStringFormat.init(inst, def);
	inst._zod.check = (payload) => {
		if (isValidJWT(payload.value, def.alg)) return;
		payload.issues.push({
			code: "invalid_format",
			format: "jwt",
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodNumber = /*@__PURE__*/ $constructor("$ZodNumber", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.pattern = inst._zod.bag.pattern ?? number$1;
	inst._zod.parse = (payload, _ctx) => {
		if (def.coerce) try {
			payload.value = Number(payload.value);
		} catch (_) {}
		const input = payload.value;
		if (typeof input === "number" && !Number.isNaN(input) && Number.isFinite(input)) return payload;
		const received = typeof input === "number" ? Number.isNaN(input) ? "NaN" : !Number.isFinite(input) ? String(input) : void 0 : void 0;
		payload.issues.push({
			expected: "number",
			code: "invalid_type",
			input,
			inst,
			...received ? { received } : {}
		});
		return payload;
	};
});
const $ZodNumberFormat = /*@__PURE__*/ $constructor("$ZodNumberFormat", (inst, def) => {
	$ZodCheckNumberFormat.init(inst, def);
	$ZodNumber.init(inst, def);
});
const $ZodBoolean = /*@__PURE__*/ $constructor("$ZodBoolean", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.pattern = boolean$1;
	inst._zod.parse = (payload, _ctx) => {
		if (def.coerce) try {
			payload.value = Boolean(payload.value);
		} catch (_) {}
		const input = payload.value;
		if (typeof input === "boolean") return payload;
		payload.issues.push({
			expected: "boolean",
			code: "invalid_type",
			input,
			inst
		});
		return payload;
	};
});
const $ZodUndefined = /*@__PURE__*/ $constructor("$ZodUndefined", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.pattern = _undefined$2;
	inst._zod.values = /* @__PURE__ */ new Set([void 0]);
	inst._zod.parse = (payload, _ctx) => {
		const input = payload.value;
		if (typeof input === "undefined") return payload;
		payload.issues.push({
			expected: "undefined",
			code: "invalid_type",
			input,
			inst
		});
		return payload;
	};
});
const $ZodUnknown = /*@__PURE__*/ $constructor("$ZodUnknown", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.parse = (payload) => payload;
});
const $ZodNever = /*@__PURE__*/ $constructor("$ZodNever", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.parse = (payload, _ctx) => {
		payload.issues.push({
			expected: "never",
			code: "invalid_type",
			input: payload.value,
			inst
		});
		return payload;
	};
});
function handleArrayResult(result, final, index) {
	if (result.issues.length) final.issues.push(...prefixIssues(index, result.issues));
	final.value[index] = result.value;
}
const $ZodArray = /*@__PURE__*/ $constructor("$ZodArray", (inst, def) => {
	$ZodType.init(inst, def);
	const memo = globalConfig.memoizer;
	memo?.attach(inst);
	inst._zod.parse = (payload, ctx) => {
		const input = payload.value;
		if (!Array.isArray(input)) {
			payload.issues.push({
				expected: "array",
				code: "invalid_type",
				input,
				inst
			});
			return payload;
		}
		payload.value = memo ? memo.alloc(inst, payload, Array(input.length), ctx) : Array(input.length);
		const proms = [];
		for (let i = 0; i < input.length; i++) {
			const item = input[i];
			const result = def.element._zod.run({
				value: item,
				issues: []
			}, ctx);
			if (result instanceof Promise) proms.push(result.then((result) => handleArrayResult(result, payload, i)));
			else handleArrayResult(result, payload, i);
		}
		if (proms.length) return Promise.all(proms).then(() => payload);
		return payload;
	};
});
function handlePropertyResult(result, final, key, input, optin, optout) {
	const isPresent = key in input;
	const isOptionalOut = optout === "optional";
	if (!isPresent && isOptionalOut && optin === "optional") return;
	if (result.issues.length) {
		if (optin !== void 0 && isOptionalOut && !isPresent) return;
		final.issues.push(...prefixIssues(key, result.issues));
	}
	if (!isPresent && optin === void 0) {
		if (!result.issues.length) final.issues.push({
			code: "invalid_type",
			expected: "nonoptional",
			input: void 0,
			path: [key]
		});
		return;
	}
	if (result.value === void 0) {
		if (isPresent) final.value[key] = void 0;
	} else final.value[key] = result.value;
}
const NO_SYMBOL_KEYS = [];
function normalizeDef(def) {
	const keys = Object.keys(def.shape);
	const ownSymbols = Object.getOwnPropertySymbols(def.shape);
	const symbolKeys = ownSymbols.length ? ownSymbols : NO_SYMBOL_KEYS;
	const allKeys = symbolKeys.length ? [...keys, ...symbolKeys] : keys;
	for (const k of allKeys) if (!def.shape?.[k]?._zod?.traits?.has("$ZodType")) throw new Error(`Invalid element at key "${String(k)}": expected a Zod schema`);
	const okeys = optionalKeys(def.shape);
	return {
		...def,
		allKeys,
		symbolKeys,
		keySet: new Set(keys),
		numKeys: keys.length,
		optionalKeys: new Set(okeys)
	};
}
function handleCatchall(proms, input, payload, ctx, def, inst) {
	const unrecognized = [];
	const keySet = def.keySet;
	const _catchall = def.catchall._zod;
	const t = _catchall.def.type;
	const optin = _catchall.optin;
	const optout = _catchall.optout;
	for (const key in input) {
		if (keySet.has(key)) continue;
		if (key === "__proto__") {
			if (t === "never") unrecognized.push(key);
			continue;
		}
		if (t === "never") {
			unrecognized.push(key);
			continue;
		}
		const r = _catchall.run({
			value: input[key],
			issues: []
		}, ctx);
		if (r instanceof Promise) proms.push(r.then((r) => handlePropertyResult(r, payload, key, input, optin, optout)));
		else handlePropertyResult(r, payload, key, input, optin, optout);
	}
	if (unrecognized.length) payload.issues.push({
		code: "unrecognized_keys",
		keys: unrecognized,
		input,
		inst,
		continue: true
	});
	if (!proms.length) return payload;
	return Promise.all(proms).then(() => {
		return payload;
	});
}
const propShapes = /* @__PURE__ */ new WeakMap();
const $ZodObject = /*@__PURE__*/ $constructor("$ZodObject", (inst, def) => {
	$ZodType.init(inst, def);
	if (!Object.getOwnPropertyDescriptor(def, "shape")?.get) {
		const sh = def.shape;
		propShapes.set(def, sh);
		Object.defineProperty(def, "shape", { get: () => {
			const newSh = { ...sh };
			Object.defineProperty(def, "shape", { value: newSh });
			propShapes.set(def, newSh);
			return newSh;
		} });
	}
	const _normalized = cached(() => normalizeDef(def));
	defineLazyInternal(inst, "propValues", (zod) => {
		const shape = zod.def.shape;
		const propValues = {};
		for (const key in shape) {
			const field = shape[key]._zod;
			if (field.values) {
				if (!Object.prototype.hasOwnProperty.call(propValues, key)) assignProp(propValues, key, /* @__PURE__ */ new Set());
				for (const v of field.values) propValues[key].add(v);
				if (field.optin !== void 0) propValues[key].add(void 0);
			}
		}
		return propValues;
	});
	const isObject$1 = isObject;
	const catchall = def.catchall;
	let value;
	const memo = globalConfig.memoizer;
	memo?.attach(inst);
	inst._zod.parse = (payload, ctx) => {
		value ?? (value = _normalized.value);
		const input = payload.value;
		if (!isObject$1(input)) {
			payload.issues.push({
				expected: "object",
				code: "invalid_type",
				input,
				inst
			});
			return payload;
		}
		payload.value = memo ? memo.alloc(inst, payload, {}, ctx) : {};
		const proms = [];
		const shape = value.shape;
		for (const key of value.allKeys) {
			if (key === "__proto__") continue;
			const el = shape[key];
			const optin = el._zod.optin;
			const optout = el._zod.optout;
			const r = el._zod.run({
				value: input[key],
				issues: []
			}, ctx);
			if (r instanceof Promise) proms.push(r.then((r) => handlePropertyResult(r, payload, key, input, optin, optout)));
			else handlePropertyResult(r, payload, key, input, optin, optout);
		}
		if (!catchall) return proms.length ? Promise.all(proms).then(() => payload) : payload;
		return handleCatchall(proms, input, payload, ctx, _normalized.value, inst);
	};
});
const $ZodObjectJIT = /*@__PURE__*/ $constructor("$ZodObjectJIT", (inst, def) => {
	$ZodObject.init(inst, def);
	const superParse = inst._zod.parse;
	const _normalized = cached(() => normalizeDef(def));
	const memo = globalConfig.memoizer;
	const generateFastpass = (shape) => {
		const normalized = _normalized.value;
		const syms = normalized.symbolKeys;
		const doc = new Doc(["payload", "ctx"], {
			shape,
			inst,
			memo,
			syms
		});
		const parseStr = (k) => `shape[${k}]._zod.run({ value: input[${k}], issues: [] }, ctx)`;
		const prefixStr = (id, k) => `
          for (let i = 0; i < ${id}.issues.length; i++) {
            const iss = ${id}.issues[i];
            iss.path = iss.path ? [${k}, ...iss.path] : [${k}];
            payload.issues.push(iss);
          }`;
		doc.write(`const input = payload.value;`);
		const ids = Object.create(null);
		let counter = 0;
		for (const key of normalized.allKeys) ids[key] = `key_${counter++}`;
		doc.write(memo ? `const newResult = memo.alloc(inst, payload, {}, ctx);` : `const newResult = {};`);
		for (const key of normalized.allKeys) {
			if (key === "__proto__") continue;
			const id = ids[key];
			const k = typeof key === "symbol" ? `syms[${syms.indexOf(key)}]` : esc(key);
			const isPresent = `${k} in input`;
			const schema = shape[key];
			const optin = schema?._zod?.optin;
			const isOptionalIn = optin !== void 0;
			const isOptionalOut = schema?._zod?.optout === "optional";
			doc.write(`const ${id} = ${parseStr(k)};`);
			if (isOptionalIn && isOptionalOut) {
				const assign = optin === "optional" ? `${id}_present` : `${id}.value !== undefined || ${id}_present`;
				doc.write(`
        const ${id}_present = ${isPresent};
        if (!${id}.issues.length || ${id}_present) {
          if (${id}.issues.length) {${prefixStr(id, k)}
          }

          if (${assign}) {
            newResult[${k}] = ${id}.value;
          }
        }

      `);
			} else if (!isOptionalIn) doc.write(`
        const ${id}_present = ${isPresent};
        if (${id}.issues.length) {${prefixStr(id, k)}
        }
        if (!${id}_present && !${id}.issues.length) {
          payload.issues.push({
            code: "invalid_type",
            expected: "nonoptional",
            input: undefined,
            path: [${k}]
          });
        }

        if (${id}_present) {
          newResult[${k}] = ${id}.value;
        }

      `);
			else doc.write(`
        if (${id}.issues.length) {${prefixStr(id, k)}
        }
        
        if (${id}.value === undefined) {
          if (${isPresent}) {
            newResult[${k}] = undefined;
          }
        } else {
          newResult[${k}] = ${id}.value;
        }

      `);
		}
		doc.write(`payload.value = newResult;`);
		doc.write(`return payload;`);
		return doc.compile();
	};
	let fastpass;
	const isObject$2 = isObject;
	const jit = !globalConfig.jitless;
	const fastEnabled = jit && allowsEval.value;
	const catchall = def.catchall;
	let value;
	inst._zod.parse = (payload, ctx) => {
		value ?? (value = _normalized.value);
		const input = payload.value;
		if (!isObject$2(input)) {
			payload.issues.push({
				expected: "object",
				code: "invalid_type",
				input,
				inst
			});
			return payload;
		}
		if (jit && fastEnabled && ctx?.async === false && ctx.jitless !== true) {
			if (!fastpass) fastpass = generateFastpass(def.shape);
			payload = fastpass(payload, ctx);
			if (!catchall) return payload;
			return handleCatchall([], input, payload, ctx, value, inst);
		}
		return superParse(payload, ctx);
	};
});
function handleUnionResults(results, final, inst, ctx) {
	for (const result of results) if (result.issues.length === 0) {
		final.value = result.value;
		return final;
	}
	const nonaborted = results.filter((r) => !aborted(r));
	if (nonaborted.length === 1) {
		final.value = nonaborted[0].value;
		return nonaborted[0];
	}
	final.issues.push({
		code: "invalid_union",
		input: final.value,
		inst,
		errors: results.map((result) => result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
	});
	return final;
}
const $ZodUnion = /*@__PURE__*/ $constructor("$ZodUnion", (inst, def) => {
	$ZodType.init(inst, def);
	defineLazyInternal(inst, "optin", (zod) => zod.def.options.some((o) => o._zod.optin === "defaulted") ? "defaulted" : zod.def.options.some((o) => o._zod.optin !== void 0) ? "optional" : void 0);
	defineLazyInternal(inst, "optout", (zod) => zod.def.options.some((o) => o._zod.optout === "optional") ? "optional" : void 0);
	defineLazyInternal(inst, "values", (zod) => {
		if (zod.def.options.every((o) => o._zod.values)) return new Set(zod.def.options.flatMap((option) => Array.from(option._zod.values)));
	});
	defineLazyInternal(inst, "pattern", (zod) => {
		if (zod.def.options.every((o) => o._zod.pattern)) {
			const patterns = zod.def.options.map((o) => o._zod.pattern);
			return new RegExp(`^(${patterns.map((p) => cleanRegex(p.source)).join("|")})$`);
		}
	});
	const first = def.options.length === 1 ? def.options[0]._zod.run : null;
	inst._zod.parse = (payload, ctx) => {
		if (first) return first(payload, ctx);
		let async = false;
		const results = [];
		for (const option of def.options) {
			const result = option._zod.run({
				value: payload.value,
				issues: []
			}, ctx);
			if (result instanceof Promise) {
				results.push(result);
				async = true;
			} else {
				if (result.issues.length === 0) return result;
				results.push(result);
			}
		}
		if (!async) return handleUnionResults(results, payload, inst, ctx);
		return Promise.all(results).then((results) => {
			return handleUnionResults(results, payload, inst, ctx);
		});
	};
});
const $ZodIntersection = /*@__PURE__*/ $constructor("$ZodIntersection", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.parse = (payload, ctx) => {
		const input = payload.value;
		const left = def.left._zod.run({
			value: input,
			issues: []
		}, ctx);
		const right = def.right._zod.run({
			value: input,
			issues: []
		}, ctx);
		if (left instanceof Promise || right instanceof Promise) return Promise.all([left, right]).then(([left, right]) => {
			return handleIntersectionResults(payload, left, right);
		});
		return handleIntersectionResults(payload, left, right);
	};
});
function mergeValues(a, b) {
	if (a === b) return {
		valid: true,
		data: a
	};
	if (a instanceof Date && b instanceof Date && +a === +b) return {
		valid: true,
		data: a
	};
	if (isPlainObject(a) && isPlainObject(b)) {
		const bKeys = Object.keys(b);
		const sharedKeys = Object.keys(a).filter((key) => bKeys.indexOf(key) !== -1);
		const newObj = {
			...a,
			...b
		};
		if (Object.prototype.hasOwnProperty.call(newObj, "__proto__")) delete newObj.__proto__;
		for (const key of sharedKeys) {
			if (key === "__proto__") continue;
			const sharedValue = mergeValues(a[key], b[key]);
			if (!sharedValue.valid) return {
				valid: false,
				mergeErrorPath: [key, ...sharedValue.mergeErrorPath]
			};
			newObj[key] = sharedValue.data;
		}
		return {
			valid: true,
			data: newObj
		};
	}
	if (Array.isArray(a) && Array.isArray(b)) {
		if (a.length !== b.length) return {
			valid: false,
			mergeErrorPath: []
		};
		const newArray = [];
		for (let index = 0; index < a.length; index++) {
			const itemA = a[index];
			const itemB = b[index];
			const sharedValue = mergeValues(itemA, itemB);
			if (!sharedValue.valid) return {
				valid: false,
				mergeErrorPath: [index, ...sharedValue.mergeErrorPath]
			};
			newArray.push(sharedValue.data);
		}
		return {
			valid: true,
			data: newArray
		};
	}
	return {
		valid: false,
		mergeErrorPath: []
	};
}
function handleIntersectionResults(result, left, right) {
	const unrecKeys = /* @__PURE__ */ new Map();
	let unrecIssue;
	const keyIssues = /* @__PURE__ */ new Map();
	const collect = (iss, side) => {
		let keys;
		if (iss.code === "unrecognized_keys" && !iss.path?.length) {
			unrecIssue ?? (unrecIssue = iss);
			keys = iss.keys;
		} else if (iss.code === "invalid_key" && iss.origin === "record" && iss.path?.length === 1) {
			const k = String(iss.path[0]);
			if (!keyIssues.has(k)) keyIssues.set(k, iss);
			keys = [k];
		} else return false;
		for (const k of keys) {
			if (!unrecKeys.has(k)) unrecKeys.set(k, {});
			unrecKeys.get(k)[side] = true;
		}
		return true;
	};
	for (const iss of left.issues) if (!collect(iss, "l")) result.issues.push(iss);
	for (const iss of right.issues) if (!collect(iss, "r")) result.issues.push(iss);
	const bothKeys = [...unrecKeys].filter(([, f]) => f.l && f.r).map(([k]) => k);
	if (bothKeys.length) {
		const aggregated = unrecIssue ? bothKeys.filter((k) => unrecIssue.keys.includes(k)) : [];
		if (aggregated.length) result.issues.push({
			...unrecIssue,
			keys: aggregated
		});
		for (const k of bothKeys) if (!aggregated.includes(k) && keyIssues.has(k)) result.issues.push(keyIssues.get(k));
	}
	const merged = mergeValues(left.value, right.value);
	if (!merged.valid) {
		if (aborted(result)) return result;
		throw new Error(`Unmergable intersection. Error path: ${JSON.stringify(merged.mergeErrorPath)}`);
	}
	result.value = merged.data;
	return result;
}
const $ZodEnum = /*@__PURE__*/ $constructor("$ZodEnum", (inst, def) => {
	$ZodType.init(inst, def);
	const values = getEnumValues(def.entries);
	const valuesSet = new Set(values);
	inst._zod.values = valuesSet;
	const patternValues = values.filter((k) => propertyKeyTypes.has(typeof k));
	inst._zod.pattern = new RegExp(patternValues.length ? `^(${patternValues.map((o) => escapeRegex(o.toString())).join("|")})$` : "^[^\\s\\S]$");
	inst._zod.parse = (payload, _ctx) => {
		const input = payload.value;
		if (valuesSet.has(input)) return payload;
		payload.issues.push({
			code: "invalid_value",
			values,
			input,
			inst
		});
		return payload;
	};
});
const $ZodLiteral = /*@__PURE__*/ $constructor("$ZodLiteral", (inst, def) => {
	$ZodType.init(inst, def);
	const values = new Set(def.values);
	inst._zod.values = values;
	inst._zod.pattern = new RegExp(def.values.length ? `^(${def.values.map((o) => typeof o === "string" ? escapeRegex(o) : o ? escapeRegex(o.toString()) : String(o)).join("|")})$` : "^[^\\s\\S]$");
	inst._zod.parse = (payload, _ctx) => {
		const input = payload.value;
		if (values.has(input)) return payload;
		payload.issues.push({
			code: "invalid_value",
			values: def.values,
			input,
			inst
		});
		return payload;
	};
});
const $ZodTransform = /*@__PURE__*/ $constructor("$ZodTransform", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.optin = "optional";
	globalConfig.memoizer?.guard(inst);
	inst._zod.parse = (payload, ctx) => {
		if (ctx.direction === "backward") throw new $ZodEncodeError(inst.constructor.name);
		const _out = def.transform(payload.value, payload);
		if (ctx.async) return (_out instanceof Promise ? _out : Promise.resolve(_out)).then((output) => {
			payload.value = output;
			return payload;
		});
		if (_out instanceof Promise) throw new $ZodAsyncError();
		payload.value = _out;
		return payload;
	};
});
function handleOptionalResult(payload, result) {
	payload.value = result.issues.length ? void 0 : result.value;
	return payload;
}
const $ZodOptional = /*@__PURE__*/ $constructor("$ZodOptional", (inst, def) => {
	$ZodType.init(inst, def);
	defineLazyInternal(inst, "optin", (zod) => zod.def.innerType._zod.optin === "defaulted" ? "defaulted" : "optional");
	inst._zod.optout = "optional";
	defineLazyInternal(inst, "values", (zod) => {
		const values = zod.def.innerType._zod.values;
		return values ? /* @__PURE__ */ new Set([...values, void 0]) : void 0;
	});
	defineLazyInternal(inst, "pattern", (zod) => {
		const pattern = zod.def.innerType._zod.pattern;
		return pattern ? new RegExp(`^(${cleanRegex(pattern.source)})?$`) : void 0;
	});
	inst._zod.parse = (payload, ctx) => {
		if (payload.value === void 0) {
			if (def.innerType._zod.optin !== "defaulted") return payload;
			const result = def.innerType._zod.run({
				value: payload.value,
				issues: []
			}, ctx);
			if (result instanceof Promise) return result.then((result) => handleOptionalResult(payload, result));
			return handleOptionalResult(payload, result);
		}
		return def.innerType._zod.run(payload, ctx);
	};
});
const $ZodExactOptional = /*@__PURE__*/ $constructor("$ZodExactOptional", (inst, def) => {
	$ZodOptional.init(inst, def);
	defineLazyInternal(inst, "values", (zod) => zod.def.innerType._zod.values);
	defineLazyInternal(inst, "pattern", (zod) => zod.def.innerType._zod.pattern);
	inst._zod.parse = (payload, ctx) => {
		return def.innerType._zod.run(payload, ctx);
	};
});
const $ZodNullable = /*@__PURE__*/ $constructor("$ZodNullable", (inst, def) => {
	$ZodType.init(inst, def);
	defineLazyInternal(inst, "optin", (zod) => zod.def.innerType._zod.optin);
	defineLazyInternal(inst, "optout", (zod) => zod.def.innerType._zod.optout);
	defineLazyInternal(inst, "pattern", (zod) => {
		const pattern = zod.def.innerType._zod.pattern;
		return pattern ? new RegExp(`^(${cleanRegex(pattern.source)}|null)$`) : void 0;
	});
	defineLazyInternal(inst, "values", (zod) => {
		return zod.def.innerType._zod.values ? /* @__PURE__ */ new Set([...zod.def.innerType._zod.values, null]) : void 0;
	});
	inst._zod.parse = (payload, ctx) => {
		if (payload.value === null) return payload;
		return def.innerType._zod.run(payload, ctx);
	};
});
const $ZodDefault = /*@__PURE__*/ $constructor("$ZodDefault", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.optin = "defaulted";
	defineLazyInternal(inst, "values", (zod) => zod.def.innerType._zod.values);
	inst._zod.parse = (payload, ctx) => {
		if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
		if (payload.value === void 0) {
			payload.value = def.defaultValue;
			/**
			* $ZodDefault returns the default value immediately in forward direction.
			* It doesn't pass the default value into the validator ("prefault"). There's no reason to pass the default value through validation. The validity of the default is enforced by TypeScript statically. Otherwise, it's the responsibility of the user to ensure the default is valid. In the case of pipes with divergent in/out types, you can specify the default on the `in` schema of your ZodPipe to set a "prefault" for the pipe.   */
			return payload;
		}
		const result = def.innerType._zod.run(payload, ctx);
		if (result instanceof Promise) return result.then((result) => handleDefaultResult(result, def));
		return handleDefaultResult(result, def);
	};
});
function handleDefaultResult(payload, def) {
	if (payload.value === void 0) payload.value = def.defaultValue;
	return payload;
}
const $ZodPrefault = /*@__PURE__*/ $constructor("$ZodPrefault", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.optin = "defaulted";
	defineLazyInternal(inst, "values", (zod) => zod.def.innerType._zod.values);
	inst._zod.parse = (payload, ctx) => {
		if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
		if (payload.value === void 0) payload.value = def.defaultValue;
		return def.innerType._zod.run(payload, ctx);
	};
});
const $ZodNonOptional = /*@__PURE__*/ $constructor("$ZodNonOptional", (inst, def) => {
	$ZodType.init(inst, def);
	defineLazyInternal(inst, "values", (zod) => {
		const v = zod.def.innerType._zod.values;
		return v ? new Set([...v].filter((x) => x !== void 0)) : void 0;
	});
	inst._zod.parse = (payload, ctx) => {
		const result = def.innerType._zod.run(payload, ctx);
		if (result instanceof Promise) return result.then((result) => handleNonOptionalResult(result, inst));
		return handleNonOptionalResult(result, inst);
	};
});
function handleNonOptionalResult(payload, inst) {
	if (!payload.issues.length && payload.value === void 0) payload.issues.push({
		code: "invalid_type",
		expected: "nonoptional",
		input: payload.value,
		inst
	});
	return payload;
}
function handleCatchResult(payload, result, def, ctx) {
	if (!result.issues.length) {
		payload.value = result.value;
		if (result.memo) payload.memo = true;
		return payload;
	}
	payload.value = def.catchValue({
		...result,
		value: payload.value,
		error: { issues: result.issues.map((iss) => finalizeIssue(iss, ctx, config())) },
		input: payload.value
	});
	return payload;
}
const $ZodCatch = /*@__PURE__*/ $constructor("$ZodCatch", (inst, def) => {
	$ZodType.init(inst, def);
	defineLazyInternal(inst, "optin", (zod) => zod.def.innerType._zod.optin === "defaulted" ? "defaulted" : "optional");
	defineLazyInternal(inst, "optout", (zod) => zod.def.innerType._zod.optout);
	defineLazyInternal(inst, "values", (zod) => zod.def.innerType._zod.values);
	inst._zod.parse = (payload, ctx) => {
		if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
		const result = def.innerType._zod.run({
			value: payload.value,
			issues: []
		}, ctx);
		if (result instanceof Promise) return result.then((result) => handleCatchResult(payload, result, def, ctx));
		return handleCatchResult(payload, result, def, ctx);
	};
});
const $ZodPipe = /*@__PURE__*/ $constructor("$ZodPipe", (inst, def) => {
	$ZodType.init(inst, def);
	defineLazyInternal(inst, "values", (zod) => zod.def.in._zod.values);
	defineLazyInternal(inst, "optin", (zod) => zod.def.in._zod.optin);
	defineLazyInternal(inst, "optout", (zod) => zod.def.out._zod.optout);
	defineLazyInternal(inst, "propValues", (zod) => zod.def.in._zod.propValues);
	inst._zod.parse = (payload, ctx) => {
		if (ctx.direction === "backward") {
			const right = def.out._zod.run(payload, ctx);
			if (right instanceof Promise) return right.then((right) => handlePipeResult(right, def.in, ctx));
			return handlePipeResult(right, def.in, ctx);
		}
		const left = def.in._zod.run(payload, ctx);
		if (left instanceof Promise) return left.then((left) => handlePipeResult(left, def.out, ctx));
		return handlePipeResult(left, def.out, ctx);
	};
});
function handlePipeResult(left, next, ctx) {
	if (left.issues.some((iss) => iss.code !== "unrecognized_keys")) {
		left.aborted = true;
		return left;
	}
	return next._zod.run({
		value: left.value,
		issues: left.issues
	}, ctx);
}
const $ZodReadonly = /*@__PURE__*/ $constructor("$ZodReadonly", (inst, def) => {
	$ZodType.init(inst, def);
	defineLazyInternal(inst, "propValues", (zod) => zod.def.innerType._zod.propValues);
	defineLazyInternal(inst, "values", (zod) => zod.def.innerType._zod.values);
	defineLazyInternal(inst, "optin", (zod) => zod.def.innerType?._zod?.optin);
	defineLazyInternal(inst, "optout", (zod) => zod.def.innerType?._zod?.optout);
	inst._zod.parse = (payload, ctx) => {
		if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
		const result = def.innerType._zod.run(payload, ctx);
		if (result instanceof Promise) return result.then(handleReadonlyResult);
		return handleReadonlyResult(result);
	};
});
function handleReadonlyResult(payload) {
	if (!payload.memo) payload.value = Object.freeze(payload.value);
	return payload;
}
const $ZodCustom = /*@__PURE__*/ $constructor("$ZodCustom", (inst, def) => {
	$ZodCheck.init(inst, def);
	$ZodType.init(inst, def);
	inst._zod.parse = (payload, _) => {
		return payload;
	};
	inst._zod.check = (payload) => {
		const input = payload.value;
		const r = def.fn(input);
		if (r instanceof Promise) return r.then((r) => handleRefineResult(r, payload, input, inst));
		handleRefineResult(r, payload, input, inst);
	};
});
function handleRefineResult(result, payload, input, inst) {
	if (!result) {
		const _iss = {
			code: "custom",
			input,
			inst,
			path: [...inst._zod.def.path ?? []],
			continue: !inst._zod.def.abort
		};
		if (inst._zod.def.params) _iss.params = inst._zod.def.params;
		payload.issues.push(issue(_iss));
	}
}
//#endregion
//#region ../../node_modules/.pnpm/zod@4.5.2/node_modules/zod/v4/core/memoizer.js
var $ZodCyclicError = class extends Error {
	constructor() {
		super(`Cannot parse a reference cycle that closes through a transform`);
		this.name = "ZodCyclicError";
	}
};
/** Keyed off the context object every schema in one parse call already shares. */
const STATE = "~memo";
const NO_ISSUES = [];
function cloneIssues(issues) {
	return issues.map((iss) => iss.path ? {
		...iss,
		path: iss.path.slice()
	} : { ...iss });
}
const recursive = /*@__PURE__*/ new WeakMap();
/** Whether this schema's subtree contains a cycle, so one parse can re-enter it. */
function isRecursive(inst, stack) {
	const cached = recursive.get(inst);
	if (cached !== void 0) return cached;
	if (stack.has(inst)) return true;
	stack.add(inst);
	let result = false;
	const check = (child) => {
		if (!result && child?._zod && isRecursive(child, stack)) result = true;
	};
	const def = inst._zod.def;
	if (def.type === "lazy") check(inst._zod.innerType);
	else {
		const shape = def.shape;
		if (shape) for (const key of Reflect.ownKeys(shape)) check(shape[key]);
		for (const key in def) {
			const value = def[key];
			if (!value || typeof value !== "object") continue;
			if (value._zod) check(value);
			else if (Array.isArray(value)) for (const el of value) check(el);
		}
	}
	stack.delete(inst);
	recursive.set(inst, result);
	return result;
}
function bucketFor(state, inst) {
	let bucket = state.buckets.get(inst);
	if (!bucket) {
		bucket = /* @__PURE__ */ new Map();
		state.buckets.set(inst, bucket);
	}
	return bucket;
}
let handoff;
const open = [];
const memo = {
	alloc(_inst, payload, empty) {
		const bucket = handoff;
		if (!bucket) return empty;
		handoff = void 0;
		const entry = {
			value: empty,
			issues: null
		};
		bucket.set(payload.value, entry);
		open.push(entry);
		return empty;
	},
	guard(inst) {
		var _a;
		(_a = inst._zod).deferred ?? (_a.deferred = []);
		inst._zod.deferred.push(() => {
			const base = inst._zod.parse;
			const wrapped = (payload, ctx) => {
				if (ctx.direction !== "backward" && isBackEdge(ctx, payload.value)) throw new $ZodCyclicError();
				return base(payload, ctx);
			};
			inst._zod.parse = wrapped;
			if (inst._zod.run === base) inst._zod.run = wrapped;
		});
	},
	attach(inst) {
		var _a;
		let isRecursiveInst;
		let lastCtx;
		let lastBucket;
		(_a = inst._zod).deferred ?? (_a.deferred = []);
		inst._zod.deferred.push(() => {
			const base = inst._zod.parse;
			const wrapped = (payload, ctx) => {
				if (isRecursiveInst === void 0) {
					isRecursiveInst = isRecursive(inst, /* @__PURE__ */ new Set());
					if (!isRecursiveInst) {
						inst._zod.parse = base;
						if (inst._zod.run === wrapped) inst._zod.run = base;
						return base(payload, ctx);
					}
				}
				const input = payload.value;
				if (input === null || typeof input !== "object") return base(payload, ctx);
				let state = ctx[STATE];
				if (!state) {
					state = {
						buckets: /* @__PURE__ */ new Map(),
						backEdges: void 0
					};
					ctx[STATE] = state;
				}
				let bucket;
				if (lastCtx === ctx) bucket = lastBucket;
				else {
					bucket = bucketFor(state, inst);
					lastCtx = ctx;
					lastBucket = bucket;
				}
				const hit = bucket.get(input);
				if (hit) {
					payload.value = hit.value;
					if (hit.issues) {
						if (hit.issues.length) payload.issues.push(...cloneIssues(hit.issues));
					} else {
						payload.memo = true;
						state.backEdges ?? (state.backEdges = /* @__PURE__ */ new Set());
						state.backEdges.add(hit.value);
					}
					return payload;
				}
				handoff = bucket;
				const depth = open.length;
				const result = base(payload, ctx);
				handoff = void 0;
				const entry = open.length > depth ? open.pop() : void 0;
				if (result instanceof Promise) return result.then((r) => {
					if (entry) entry.issues = r.issues.length ? cloneIssues(r.issues) : NO_ISSUES;
					return r;
				});
				if (entry) entry.issues = result.issues.length ? cloneIssues(result.issues) : NO_ISSUES;
				return result;
			};
			inst._zod.parse = wrapped;
			if (inst._zod.run === base) inst._zod.run = wrapped;
		});
	}
};
/** The memoizer that gives containers cycle support. `zod` installs it by default; `zod/mini` opts in with `config({ memoizer: memoizer() })`. */
function memoizer() {
	return memo;
}
/** Whether this value is a node a back-edge resolved to before it finished. */
function isBackEdge(ctx, value) {
	const backEdges = ctx[STATE]?.backEdges;
	return backEdges !== void 0 && value !== null && typeof value === "object" && backEdges.has(value);
}
//#endregion
//#region ../../node_modules/.pnpm/zod@4.5.2/node_modules/zod/v4/locales/en.js
const error = () => {
	const Sizable = {
		string: {
			unit: "characters",
			verb: "to have"
		},
		file: {
			unit: "bytes",
			verb: "to have"
		},
		array: {
			unit: "items",
			verb: "to have"
		},
		set: {
			unit: "items",
			verb: "to have"
		},
		map: {
			unit: "entries",
			verb: "to have"
		}
	};
	function getSizing(origin) {
		return Sizable[origin] ?? null;
	}
	const FormatDictionary = {
		regex: "input",
		email: "email address",
		url: "URL",
		emoji: "emoji",
		uuid: "UUID",
		uuidv4: "UUIDv4",
		uuidv6: "UUIDv6",
		nanoid: "nanoid",
		guid: "GUID",
		cuid: "cuid",
		cuid2: "cuid2",
		ulid: "ULID",
		xid: "XID",
		ksuid: "KSUID",
		datetime: "ISO datetime",
		date: "ISO date",
		time: "ISO time",
		duration: "ISO duration",
		ipv4: "IPv4 address",
		ipv6: "IPv6 address",
		mac: "MAC address",
		cidrv4: "IPv4 range",
		cidrv6: "IPv6 range",
		base64: "base64-encoded string",
		base64url: "base64url-encoded string",
		json_string: "JSON string",
		e164: "E.164 number",
		credit_card: "credit card number",
		jwt: "JWT",
		template_literal: "input"
	};
	const TypeDictionary = { nan: "NaN" };
	function getTypeName(type, input) {
		if (type === "number" && typeof input === "number" && !Number.isFinite(input)) return String(input);
		return TypeDictionary[type] ?? type;
	}
	return (issue) => {
		switch (issue.code) {
			case "invalid_type": return `Invalid input: expected ${getTypeName(issue.expected)}, received ${getTypeName(parsedType(issue.input), issue.input)}`;
			case "invalid_value":
				if (issue.values.length === 1) return `Invalid input: expected ${stringifyPrimitive(issue.values[0])}`;
				return `Invalid option: expected one of ${joinValues(issue.values, "|")}`;
			case "too_big": {
				const adj = issue.exact ? "exactly " : issue.inclusive ? "<=" : "<";
				const sizing = getSizing(issue.origin);
				if (sizing) return `Too big: expected ${issue.origin ?? "value"} to have ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elements"}`;
				return `Too big: expected ${issue.origin ?? "value"} to be ${adj}${issue.maximum.toString()}`;
			}
			case "too_small": {
				const adj = issue.exact ? "exactly " : issue.inclusive ? ">=" : ">";
				const sizing = getSizing(issue.origin);
				if (sizing) return `Too small: expected ${issue.origin} to have ${adj}${issue.minimum.toString()} ${sizing.unit}`;
				return `Too small: expected ${issue.origin} to be ${adj}${issue.minimum.toString()}`;
			}
			case "invalid_format": {
				const _issue = issue;
				if (_issue.format === "starts_with") return `Invalid string: must start with "${_issue.prefix}"`;
				if (_issue.format === "ends_with") return `Invalid string: must end with "${_issue.suffix}"`;
				if (_issue.format === "includes") return `Invalid string: must include "${_issue.includes}"`;
				if (_issue.format === "regex") return `Invalid string: must match pattern ${_issue.pattern}`;
				return `Invalid ${FormatDictionary[_issue.format] ?? issue.format}`;
			}
			case "not_multiple_of": return `Invalid number: must be a multiple of ${issue.divisor}`;
			case "unrecognized_keys": return `Unrecognized key${issue.keys.length > 1 ? "s" : ""}: ${joinValues(issue.keys, ", ")}`;
			case "invalid_key": return `Invalid key in ${issue.origin}`;
			case "invalid_union":
				if (issue.options && Array.isArray(issue.options) && issue.options.length > 0) return `Invalid discriminator value. Expected ${issue.options.map((o) => `'${o}'`).join(" | ")}`;
				if (issue.inclusive === false) return "Invalid input: more than one option matched";
				return "Invalid input";
			case "invalid_element": return `Invalid value in ${issue.origin}`;
			default: return `Invalid input`;
		}
	};
};
function en_default() {
	return { localeError: error() };
}
//#endregion
//#region ../../node_modules/.pnpm/zod@4.5.2/node_modules/zod/v4/core/registries.js
var _a;
var $ZodRegistry = class {
	constructor() {
		this._map = /* @__PURE__ */ new WeakMap();
		this._idmap = /* @__PURE__ */ new Map();
	}
	add(schema, ..._meta) {
		const meta = _meta[0];
		this._map.set(schema, meta);
		if (meta && typeof meta === "object" && "id" in meta) this._idmap.set(meta.id, schema);
		return this;
	}
	clear() {
		this._map = /* @__PURE__ */ new WeakMap();
		this._idmap = /* @__PURE__ */ new Map();
		return this;
	}
	remove(schema) {
		const meta = this._map.get(schema);
		if (meta && typeof meta === "object" && "id" in meta) this._idmap.delete(meta.id);
		this._map.delete(schema);
		return this;
	}
	get(schema) {
		const p = schema._zod.parent;
		if (p) {
			const pm = { ...this.get(p) ?? {} };
			delete pm.id;
			const f = {
				...pm,
				...this._map.get(schema)
			};
			return Object.keys(f).length ? f : void 0;
		}
		return this._map.get(schema);
	}
	has(schema) {
		return this._map.has(schema);
	}
};
function registry() {
	return new $ZodRegistry();
}
(_a = globalThis).__zod_globalRegistry ?? (_a.__zod_globalRegistry = registry());
const globalRegistry = globalThis.__zod_globalRegistry;
//#endregion
//#region ../../node_modules/.pnpm/zod@4.5.2/node_modules/zod/v4/core/api.js
// @__NO_SIDE_EFFECTS__
function _string(Class, params) {
	return new Class({
		type: "string",
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _email(Class, params) {
	return new Class({
		type: "string",
		format: "email",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _guid(Class, params) {
	return new Class({
		type: "string",
		format: "guid",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _uuid(Class, params) {
	return new Class({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _uuidv4(Class, params) {
	return new Class({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: false,
		version: "v4",
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _uuidv6(Class, params) {
	return new Class({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: false,
		version: "v6",
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _uuidv7(Class, params) {
	return new Class({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: false,
		version: "v7",
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _url(Class, params) {
	return new Class({
		type: "string",
		format: "url",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _emoji(Class, params) {
	return new Class({
		type: "string",
		format: "emoji",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _nanoid(Class, params) {
	return new Class({
		type: "string",
		format: "nanoid",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
/**
* @deprecated CUID v1 is deprecated by its authors due to information leakage
* (timestamps embedded in the id). Use {@link _cuid2} instead.
* See https://github.com/paralleldrive/cuid.
*/
// @__NO_SIDE_EFFECTS__
function _cuid(Class, params) {
	return new Class({
		type: "string",
		format: "cuid",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _cuid2(Class, params) {
	return new Class({
		type: "string",
		format: "cuid2",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _ulid(Class, params) {
	return new Class({
		type: "string",
		format: "ulid",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _xid(Class, params) {
	return new Class({
		type: "string",
		format: "xid",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _ksuid(Class, params) {
	return new Class({
		type: "string",
		format: "ksuid",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _ipv4(Class, params) {
	return new Class({
		type: "string",
		format: "ipv4",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _ipv6(Class, params) {
	return new Class({
		type: "string",
		format: "ipv6",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _cidrv4(Class, params) {
	return new Class({
		type: "string",
		format: "cidrv4",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _cidrv6(Class, params) {
	return new Class({
		type: "string",
		format: "cidrv6",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _base64(Class, params) {
	return new Class({
		type: "string",
		format: "base64",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _base64url(Class, params) {
	return new Class({
		type: "string",
		format: "base64url",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _e164(Class, params) {
	return new Class({
		type: "string",
		format: "e164",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _jwt(Class, params) {
	return new Class({
		type: "string",
		format: "jwt",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _isoDateTime(Class, params) {
	return new Class({
		type: "string",
		format: "datetime",
		check: "string_format",
		offset: false,
		local: false,
		precision: null,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _isoDate(Class, params) {
	return new Class({
		type: "string",
		format: "date",
		check: "string_format",
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _isoTime(Class, params) {
	return new Class({
		type: "string",
		format: "time",
		check: "string_format",
		precision: null,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _isoDuration(Class, params) {
	return new Class({
		type: "string",
		format: "duration",
		check: "string_format",
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _number(Class, params) {
	return new Class({
		type: "number",
		checks: [],
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _int(Class, params) {
	return new Class({
		type: "number",
		check: "number_format",
		abort: false,
		format: "safeint",
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _boolean(Class, params) {
	return new Class({
		type: "boolean",
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _undefined$1(Class, params) {
	return new Class({
		type: "undefined",
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _unknown(Class) {
	return new Class({ type: "unknown" });
}
// @__NO_SIDE_EFFECTS__
function _never(Class, params) {
	return new Class({
		type: "never",
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _lt(value, params) {
	return new $ZodCheckLessThan({
		check: "less_than",
		...normalizeParams(params),
		value,
		inclusive: false
	});
}
// @__NO_SIDE_EFFECTS__
function _lte(value, params) {
	return new $ZodCheckLessThan({
		check: "less_than",
		...normalizeParams(params),
		value,
		inclusive: true
	});
}
// @__NO_SIDE_EFFECTS__
function _gt(value, params) {
	return new $ZodCheckGreaterThan({
		check: "greater_than",
		...normalizeParams(params),
		value,
		inclusive: false
	});
}
// @__NO_SIDE_EFFECTS__
function _gte(value, params) {
	return new $ZodCheckGreaterThan({
		check: "greater_than",
		...normalizeParams(params),
		value,
		inclusive: true
	});
}
// @__NO_SIDE_EFFECTS__
function _multipleOf(value, params) {
	return new $ZodCheckMultipleOf({
		check: "multiple_of",
		...normalizeParams(params),
		value
	});
}
// @__NO_SIDE_EFFECTS__
function _maxLength(maximum, params) {
	return new $ZodCheckMaxLength({
		check: "max_length",
		...normalizeParams(params),
		maximum
	});
}
// @__NO_SIDE_EFFECTS__
function _minLength(minimum, params) {
	return new $ZodCheckMinLength({
		check: "min_length",
		...normalizeParams(params),
		minimum
	});
}
// @__NO_SIDE_EFFECTS__
function _length(length, params) {
	return new $ZodCheckLengthEquals({
		check: "length_equals",
		...normalizeParams(params),
		length
	});
}
// @__NO_SIDE_EFFECTS__
function _regex(pattern, params) {
	return new $ZodCheckRegex({
		check: "string_format",
		format: "regex",
		...normalizeParams(params),
		pattern
	});
}
// @__NO_SIDE_EFFECTS__
function _lowercase(params) {
	return new $ZodCheckLowerCase({
		check: "string_format",
		format: "lowercase",
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _uppercase(params) {
	return new $ZodCheckUpperCase({
		check: "string_format",
		format: "uppercase",
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _includes(includes, params) {
	return new $ZodCheckIncludes({
		check: "string_format",
		format: "includes",
		...normalizeParams(params),
		includes
	});
}
// @__NO_SIDE_EFFECTS__
function _startsWith(prefix, params) {
	return new $ZodCheckStartsWith({
		check: "string_format",
		format: "starts_with",
		...normalizeParams(params),
		prefix
	});
}
// @__NO_SIDE_EFFECTS__
function _endsWith(suffix, params) {
	return new $ZodCheckEndsWith({
		check: "string_format",
		format: "ends_with",
		...normalizeParams(params),
		suffix
	});
}
// @__NO_SIDE_EFFECTS__
function _overwrite(tx) {
	return new $ZodCheckOverwrite({
		check: "overwrite",
		tx
	});
}
// @__NO_SIDE_EFFECTS__
function _normalize(form) {
	return /* @__PURE__ */ _overwrite((input) => input.normalize(form));
}
// @__NO_SIDE_EFFECTS__
function _trim() {
	return /* @__PURE__ */ _overwrite((input) => input.trim());
}
// @__NO_SIDE_EFFECTS__
function _toLowerCase() {
	return /* @__PURE__ */ _overwrite((input) => input.toLowerCase());
}
// @__NO_SIDE_EFFECTS__
function _toUpperCase() {
	return /* @__PURE__ */ _overwrite((input) => input.toUpperCase());
}
// @__NO_SIDE_EFFECTS__
function _slugify() {
	return /* @__PURE__ */ _overwrite((input) => slugify(input));
}
// @__NO_SIDE_EFFECTS__
function _array(Class, element, params) {
	return new Class({
		type: "array",
		element,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _refine(Class, fn, _params) {
	return new Class({
		type: "custom",
		check: "custom",
		fn,
		...normalizeParams(_params)
	});
}
// @__NO_SIDE_EFFECTS__
function _superRefine(fn, params) {
	const ch = /* @__PURE__ */ _check((payload) => {
		payload.addIssue = (issue$2) => {
			if (typeof issue$2 === "string") payload.issues.push(issue(issue$2, payload.value, ch._zod.def));
			else {
				const _issue = issue$2;
				if (_issue.fatal) _issue.continue = false;
				_issue.code ?? (_issue.code = "custom");
				if (!("input" in _issue)) _issue.input = payload.value;
				_issue.inst ?? (_issue.inst = ch);
				_issue.continue ?? (_issue.continue = !ch._zod.def.abort);
				payload.issues.push(issue(_issue));
			}
		};
		return fn(payload.value, payload);
	}, params);
	return ch;
}
// @__NO_SIDE_EFFECTS__
function _check(fn, params) {
	const ch = new $ZodCheck({
		check: "custom",
		...normalizeParams(params)
	});
	ch._zod.check = fn;
	return ch;
}
//#endregion
//#region ../../node_modules/.pnpm/zod@4.5.2/node_modules/zod/v4/core/to-json-schema.js
function assignProps(target, ...sources) {
	for (const source of sources) for (const key of Reflect.ownKeys(source)) if (Object.prototype.propertyIsEnumerable.call(source, key)) assignProp(target, key, source[key]);
	return target;
}
function initializeContext(params) {
	let target = params?.target ?? "draft-2020-12";
	if (target === "draft-4") target = "draft-04";
	if (target === "draft-7") target = "draft-07";
	return {
		processors: params.processors ?? {},
		metadataRegistry: params?.metadata ?? globalRegistry,
		target,
		unrepresentable: params?.unrepresentable ?? "throw",
		override: params?.override ?? (() => {}),
		io: params?.io ?? "output",
		counter: 0,
		seen: /* @__PURE__ */ new Map(),
		sharedDefsExtractedFor: void 0,
		sharedEmitDoneFor: void 0,
		cycles: params?.cycles ?? "ref",
		reused: params?.reused ?? "inline",
		intersections: [],
		external: params?.external ?? void 0
	};
}
/**
* Applies the `unrepresentable` setting at a site that has no JSON Schema equivalent. Throws
* `message` unless the setting (or the handler's return value) says otherwise. Returns `true` if a
* custom JSON Schema was written into `json`, in which case the caller must not write its own.
*/
function handleUnrepresentable(schema, ctx, json, params, message) {
	const result = typeof ctx.unrepresentable === "function" ? ctx.unrepresentable({
		zodSchema: schema,
		path: params.path,
		message
	}) : ctx.unrepresentable;
	if (result === "any") return false;
	if (result === void 0 || result === "throw") throw new Error(message);
	Object.assign(json, result);
	return true;
}
function process(schema, ctx, _params = {
	path: [],
	schemaPath: []
}) {
	var _a;
	const def = schema._zod.def;
	const seen = ctx.seen.get(schema);
	if (seen) {
		seen.count++;
		if (_params.schemaPath.includes(schema)) seen.cycle = _params.path;
		return seen.schema;
	}
	const result = {
		schema: {},
		count: 1,
		cycle: void 0,
		path: _params.path
	};
	ctx.seen.set(schema, result);
	ctx.sharedDefsExtractedFor = void 0;
	ctx.sharedEmitDoneFor = void 0;
	const overrideSchema = schema._zod.toJSONSchema?.();
	if (overrideSchema) result.schema = overrideSchema;
	else {
		const params = {
			..._params,
			schemaPath: [..._params.schemaPath, schema],
			path: _params.path
		};
		if (schema._zod.processJSONSchema) schema._zod.processJSONSchema(ctx, result.schema, params);
		else {
			const _json = result.schema;
			const processor = ctx.processors[def.type];
			if (!processor) throw new Error(`[toJSONSchema]: Non-representable type encountered: ${def.type}`);
			processor(schema, ctx, _json, params);
		}
		const parent = schema._zod.parent;
		if (parent) {
			if (!result.ref) result.ref = parent;
			process(parent, ctx, params);
			ctx.seen.get(parent).isParent = true;
		}
	}
	const meta = ctx.metadataRegistry.get(schema);
	if (meta) assignProps(result.schema, meta);
	if (ctx.io === "input" && isTransforming(schema)) {
		delete result.schema.examples;
		delete result.schema.default;
	}
	if (ctx.io === "input" && "_prefault" in result.schema) (_a = result.schema).default ?? (_a.default = result.schema._prefault);
	delete result.schema._prefault;
	return ctx.seen.get(schema).schema;
}
function encodeJSONPointerSegment(segment) {
	return segment.replace(/~/g, "~0").replace(/\//g, "~1");
}
function extractDefs(ctx, schema) {
	const root = ctx.seen.get(schema);
	if (!root) throw new Error("Unprocessed schema. This is a bug in Zod.");
	if (ctx.external && ctx.sharedDefsExtractedFor === ctx.external) return;
	const idToSchema = /* @__PURE__ */ new Map();
	for (const entry of ctx.seen.entries()) {
		const id = ctx.metadataRegistry.get(entry[0])?.id;
		if (id) {
			const existing = idToSchema.get(id);
			if (existing && existing !== entry[0]) throw new Error(`Duplicate schema id "${id}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);
			idToSchema.set(id, entry[0]);
		}
	}
	const makeURI = (entry) => {
		const defsSegment = ctx.target === "draft-2020-12" ? "$defs" : "definitions";
		if (ctx.external) {
			const externalId = ctx.external.registry.get(entry[0])?.id;
			const uriGenerator = ctx.external.uri ?? ((id) => id);
			if (externalId) return { ref: uriGenerator(externalId) };
			const id = entry[1].defId ?? entry[1].schema.id ?? `schema${ctx.counter++}`;
			entry[1].defId = id;
			return {
				defId: id,
				ref: `${uriGenerator("__shared")}#/${defsSegment}/${encodeJSONPointerSegment(id)}`
			};
		}
		const uriPrefix = `#`;
		const defUriPrefix = `${uriPrefix}/${defsSegment}/`;
		if (entry[1] === root && !entry[1].schema.id) return { ref: uriPrefix };
		const defId = entry[1].schema.id ?? `__schema${ctx.counter++}`;
		return {
			defId,
			ref: defUriPrefix + encodeJSONPointerSegment(defId)
		};
	};
	const extractToDef = (entry) => {
		if (entry[1].schema.$ref) return;
		const seen = entry[1];
		const { ref, defId } = makeURI(entry);
		seen.def = { ...seen.schema };
		if (defId) seen.defId = defId;
		const schema = seen.schema;
		for (const key in schema) delete schema[key];
		schema.$ref = ref;
	};
	if (ctx.cycles === "throw") for (const entry of ctx.seen.entries()) {
		const seen = entry[1];
		if (seen.cycle) throw new Error(`Cycle detected: #/${seen.cycle?.join("/")}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`);
	}
	for (const entry of ctx.seen.entries()) {
		const seen = entry[1];
		if (schema === entry[0]) {
			extractToDef(entry);
			continue;
		}
		if (ctx.external) {
			const ext = ctx.external.registry.get(entry[0])?.id;
			if (schema !== entry[0] && ext) {
				extractToDef(entry);
				continue;
			}
		}
		if (ctx.metadataRegistry.get(entry[0])?.id) {
			extractToDef(entry);
			continue;
		}
		if (seen.cycle) {
			extractToDef(entry);
			continue;
		}
		if (seen.count > 1) {
			if (ctx.reused === "ref") {
				extractToDef(entry);
				continue;
			}
		}
	}
	if (ctx.external) ctx.sharedDefsExtractedFor = ctx.external;
}
/** Rewrites `anyOf: [{type: "a"}, {type: "b"}]` to `type: ["a", "b"]`, which every JSON Schema draft treats as equivalent and most consumers render far better for the nullable case. Only branches that are a bare type assertion qualify — anything carrying a constraint, `$ref`, `const` or metadata is left alone. Runs after `flattenRef`, so a branch an override decorated or `$defs` extraction turned into a `$ref` is no longer bare and correctly stays in `anyOf`. `oneOf` is excluded: `integer` and `number` overlap, so "exactly one" and "at least one" are not the same there. OpenAPI 3.0 is excluded: its `type` must be a single string. */
function compactTypeUnion(schema) {
	const options = schema.anyOf;
	if (!Array.isArray(options) || options.length === 0 || schema.type !== void 0) return;
	const types = [];
	for (const option of options) {
		if (!option || typeof option !== "object") return;
		compactTypeUnion(option);
		const keys = Object.keys(option);
		if (keys.length !== 1 || keys[0] !== "type") return;
		const type = option.type;
		for (const member of Array.isArray(type) ? type : [type]) {
			if (typeof member !== "string") return;
			if (!types.includes(member)) types.push(member);
		}
	}
	delete schema.anyOf;
	schema.type = types.length === 1 ? types[0] : types;
}
/** Keywords `foldIntersection` knows how to combine. Anything else — `$ref`, `patternProperties`,
* an annotation like `description` — makes a member unfoldable, so a constraint this does not
* understand leaves the `allOf` alone instead of being silently dropped or misattributed. */
const FOLDABLE_KEYS = /* @__PURE__ */ new Set([
	"type",
	"properties",
	"required",
	"additionalProperties"
]);
const UNION_KEYS = ["oneOf", "anyOf"];
/** A member's constraint on a key it does not declare itself. A `catchall` states one; `false`, an absent `additionalProperties`, and the empty schema a loose object emits state nothing. */
function undeclaredConstraint(member) {
	const extra = member.additionalProperties;
	if (extra === void 0 || extra === false || typeof extra !== "object" || extra === null) return null;
	return Object.keys(extra).length ? extra : null;
}
/** Combines object members into the single object they describe together, or returns `null` if any of them carries a keyword outside {@link FOLDABLE_KEYS}. */
function foldObjects(members) {
	const objects = [];
	for (const member of members) {
		if (typeof member !== "object" || member.type !== "object") return null;
		for (const key in member) if (!FOLDABLE_KEYS.has(key)) return null;
		objects.push(member);
	}
	const properties = {};
	const required = /* @__PURE__ */ new Set();
	for (const object of objects) {
		for (const key in object.properties) {
			if (Object.prototype.hasOwnProperty.call(properties, key)) continue;
			const parts = [];
			for (const other of objects) {
				const part = other.properties?.[key] ?? undeclaredConstraint(other);
				if (part === null || part === void 0) continue;
				if (!parts.some((seen) => JSON.stringify(seen) === JSON.stringify(part))) parts.push(part);
			}
			assignProp(properties, key, parts.length === 1 ? parts[0] : foldObjects(parts) ?? { allOf: parts });
		}
		for (const key of object.required ?? []) required.add(key);
	}
	const folded = {
		type: "object",
		properties
	};
	if (required.size) folded.required = [...required];
	if (objects.every((object) => object.additionalProperties === false)) folded.additionalProperties = false;
	else {
		const constraints = [];
		for (const object of objects) {
			const constraint = undeclaredConstraint(object);
			if (constraint && !constraints.some((seen) => JSON.stringify(seen) === JSON.stringify(constraint))) constraints.push(constraint);
		}
		if (constraints.length === 1) folded.additionalProperties = constraints[0];
		else if (constraints.length > 1) folded.additionalProperties = { allOf: constraints };
	}
	return folded;
}
/** `additionalProperties` in an `allOf` member sees only that member's own `properties`, so two
* closed object members reject each other's keys and the schema validates nothing. Zod's parser
* pools the key sets instead — `handleIntersectionResults` reports a key as unrecognized only when
* *every* side rejects it — so the emitted schema has to pool them too, and folding the members
* into one object is the encoding that says so on every target.
*
* This runs from `finalize`, after `extractDefs`, which is what keeps it clear of the `$ref`
* machinery: a member extracted into `$defs` is already a `$ref` by now and declines to fold, so it
* keeps its reference and its own closedness rather than being inlined as a stale copy. */
function foldIntersection(json) {
	const allOf = json.allOf;
	if (!Array.isArray(allOf) || allOf.length < 2) return;
	for (const key of FOLDABLE_KEYS) if (key in json) return;
	const unions = allOf.filter((m) => UNION_KEYS.some((k) => Array.isArray(m[k])));
	let folded = null;
	if (!unions.length) folded = foldObjects(allOf);
	else {
		const union = unions[0];
		const keyword = UNION_KEYS.find((k) => Array.isArray(union[k]));
		if (Object.keys(union).length !== 1) return;
		const rest = allOf.filter((m) => m !== union);
		const branches = union[keyword].map((branch) => foldObjects([...rest, branch]));
		if (branches.some((b) => !b)) return;
		folded = { [keyword]: branches };
	}
	if (!folded) return;
	delete json.allOf;
	assignProps(json, folded);
}
function finalize(ctx, schema) {
	const root = ctx.seen.get(schema);
	if (!root) throw new Error("Unprocessed schema. This is a bug in Zod.");
	const flattenRef = (zodSchema) => {
		const seen = ctx.seen.get(zodSchema);
		if (seen.ref === null) return;
		const schema = seen.def ?? seen.schema;
		const _cached = { ...schema };
		const ref = seen.ref;
		seen.ref = null;
		if (ref) {
			flattenRef(ref);
			const refSeen = ctx.seen.get(ref);
			const refSchema = refSeen.schema;
			if (refSchema.$ref && (ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0")) {
				schema.allOf = schema.allOf ?? [];
				schema.allOf.push(refSchema);
			} else assignProps(schema, refSchema);
			assignProps(schema, _cached);
			if (zodSchema._zod.parent === ref) for (const key in schema) {
				if (key === "$ref" || key === "allOf") continue;
				if (!(key in _cached)) delete schema[key];
			}
			if (refSchema.$ref && refSeen.def) for (const key in schema) {
				if (key === "$ref" || key === "allOf") continue;
				if (key in refSeen.def && JSON.stringify(schema[key]) === JSON.stringify(refSeen.def[key])) delete schema[key];
			}
		}
		const parent = zodSchema._zod.parent;
		if (parent && parent !== ref) {
			flattenRef(parent);
			const parentSeen = ctx.seen.get(parent);
			if (parentSeen?.schema.$ref) {
				schema.$ref = parentSeen.schema.$ref;
				if (parentSeen.def) for (const key in schema) {
					if (key === "$ref" || key === "allOf") continue;
					if (key in parentSeen.def && JSON.stringify(schema[key]) === JSON.stringify(parentSeen.def[key])) delete schema[key];
				}
			}
		}
		ctx.override({
			zodSchema,
			jsonSchema: schema,
			path: seen.path ?? []
		});
	};
	if (!ctx.external || ctx.sharedEmitDoneFor !== ctx.external) {
		for (const entry of [...ctx.seen.entries()].reverse()) flattenRef(entry[0]);
		if (ctx.target !== "openapi-3.0") for (const entry of ctx.seen.entries()) compactTypeUnion(entry[1].def ?? entry[1].schema);
		if (ctx.intersections.length) {
			const carriers = /* @__PURE__ */ new Map();
			for (const seen of ctx.seen.values()) for (const json of [seen.schema, seen.def]) {
				const allOf = json?.allOf;
				if (!Array.isArray(allOf)) continue;
				const existing = carriers.get(allOf);
				if (existing) existing.push(json);
				else carriers.set(allOf, [json]);
			}
			for (const allOf of ctx.intersections) for (const json of carriers.get(allOf) ?? []) foldIntersection(json);
		}
	}
	const result = {};
	if (ctx.target === "draft-2020-12") result.$schema = "https://json-schema.org/draft/2020-12/schema";
	else if (ctx.target === "draft-07") result.$schema = "http://json-schema.org/draft-07/schema#";
	else if (ctx.target === "draft-04") result.$schema = "http://json-schema.org/draft-04/schema#";
	else if (ctx.target === "openapi-3.0") {}
	if (ctx.external?.uri) {
		const id = ctx.external.registry.get(schema)?.id;
		if (!id) throw new Error("Schema is missing an `id` property");
		result.$id = ctx.external.uri(id);
	}
	assignProps(result, root.defId ? root.schema : root.def ?? root.schema);
	const rootMetaId = ctx.metadataRegistry.get(schema)?.id;
	if (rootMetaId !== void 0 && result.id === rootMetaId) delete result.id;
	const defs = ctx.external?.defs ?? {};
	if (!ctx.external || ctx.sharedEmitDoneFor !== ctx.external) for (const entry of ctx.seen.entries()) {
		const seen = entry[1];
		if (seen.def && seen.defId) {
			if (seen.def.id === seen.defId) delete seen.def.id;
			assignProp(defs, seen.defId, seen.def);
		}
	}
	if (ctx.external) ctx.sharedEmitDoneFor = ctx.external;
	if (ctx.external) {} else if (Object.keys(defs).length > 0) {
		if (ctx.target === "draft-2020-12") result.$defs = defs;
		else result.definitions = defs;
	}
	try {
		const finalized = JSON.parse(JSON.stringify(result));
		Object.defineProperty(finalized, "~standard", {
			value: {
				...schema["~standard"],
				jsonSchema: {
					input: createStandardJSONSchemaMethod(schema, "input", ctx.processors),
					output: createStandardJSONSchemaMethod(schema, "output", ctx.processors)
				}
			},
			enumerable: false,
			writable: false
		});
		return finalized;
	} catch (_err) {
		throw new Error("Error converting schema to JSON.");
	}
}
function isTransforming(_schema, _ctx) {
	const ctx = _ctx ?? { seen: /* @__PURE__ */ new Set() };
	if (ctx.seen.has(_schema)) return false;
	ctx.seen.add(_schema);
	const def = _schema._zod.def;
	if (def.type === "transform") return true;
	if (def.type === "array") return isTransforming(def.element, ctx);
	if (def.type === "set") return isTransforming(def.valueType, ctx);
	if (def.type === "lazy") return isTransforming(def.getter(), ctx);
	if (def.type === "promise" || def.type === "optional" || def.type === "nonoptional" || def.type === "nullable" || def.type === "readonly" || def.type === "default" || def.type === "prefault" || def.type === "catch") return isTransforming(def.innerType, ctx);
	if (def.type === "intersection") return isTransforming(def.left, ctx) || isTransforming(def.right, ctx);
	if (def.type === "record" || def.type === "map") return isTransforming(def.keyType, ctx) || isTransforming(def.valueType, ctx);
	if (def.type === "pipe") {
		if (_schema._zod.traits.has("$ZodCodec")) return true;
		return isTransforming(def.in, ctx) || isTransforming(def.out, ctx);
	}
	if (def.type === "object") {
		for (const key in def.shape) if (isTransforming(def.shape[key], ctx)) return true;
		return false;
	}
	if (def.type === "union") {
		for (const option of def.options) if (isTransforming(option, ctx)) return true;
		return false;
	}
	if (def.type === "tuple") {
		for (const item of def.items) if (isTransforming(item, ctx)) return true;
		if (def.rest && isTransforming(def.rest, ctx)) return true;
		return false;
	}
	return false;
}
/**
* Creates a toJSONSchema method for a schema instance.
* This encapsulates the logic of initializing context, processing, extracting defs, and finalizing.
*/
const createToJSONSchemaMethod = (schema, processors = {}) => (params) => {
	const ctx = initializeContext({
		...params,
		processors
	});
	process(schema, ctx);
	extractDefs(ctx, schema);
	return finalize(ctx, schema);
};
const createStandardJSONSchemaMethod = (schema, io, processors = {}) => (params) => {
	const { libraryOptions, target } = params ?? {};
	const ctx = initializeContext({
		...libraryOptions ?? {},
		target,
		io,
		processors
	});
	process(schema, ctx);
	extractDefs(ctx, schema);
	return finalize(ctx, schema);
};
//#endregion
//#region ../../node_modules/.pnpm/zod@4.5.2/node_modules/zod/v4/core/json-schema-processors.js
const formatMap = {
	guid: "uuid",
	url: "uri",
	datetime: "date-time",
	json_string: "json-string",
	regex: ""
};
const stringProcessor = (schema, ctx, _json, _params) => {
	const json = _json;
	json.type = "string";
	const { minimum, maximum, format, patterns, contentEncoding, laxFormat } = schema._zod.bag;
	if (typeof minimum === "number") json.minLength = minimum;
	if (typeof maximum === "number") json.maxLength = maximum;
	if (format) {
		json.format = formatMap[format] ?? format;
		if (json.format === "") delete json.format;
		if (format === "time" || laxFormat) delete json.format;
	}
	if (contentEncoding) json.contentEncoding = contentEncoding;
	if (patterns && patterns.size > 0) {
		const regexes = [...patterns];
		if (regexes.length === 1) json.pattern = regexes[0].source;
		else if (regexes.length > 1) json.allOf = [...regexes.map((regex) => ({
			...ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0" ? { type: "string" } : {},
			pattern: regex.source
		}))];
	}
};
const numberProcessor = (schema, ctx, _json, params) => {
	const json = _json;
	const { minimum, maximum, format, multipleOf, exclusiveMaximum, exclusiveMinimum } = schema._zod.bag;
	if (typeof format === "string" && format.includes("int")) json.type = "integer";
	else json.type = "number";
	const exMin = typeof exclusiveMinimum === "number" && exclusiveMinimum >= (minimum ?? Number.NEGATIVE_INFINITY);
	const exMax = typeof exclusiveMaximum === "number" && exclusiveMaximum <= (maximum ?? Number.POSITIVE_INFINITY);
	const legacy = ctx.target === "draft-04" || ctx.target === "openapi-3.0";
	if (exMin) {
		if (legacy) {
			json.minimum = exclusiveMinimum;
			json.exclusiveMinimum = true;
		} else json.exclusiveMinimum = exclusiveMinimum;
	} else if (typeof minimum === "number") json.minimum = minimum;
	if (exMax) {
		if (legacy) {
			json.maximum = exclusiveMaximum;
			json.exclusiveMaximum = true;
		} else json.exclusiveMaximum = exclusiveMaximum;
	} else if (typeof maximum === "number") json.maximum = maximum;
	if (typeof multipleOf === "number") {
		if (Number.isFinite(multipleOf) && multipleOf !== 0) json.multipleOf = Math.abs(multipleOf);
		else handleUnrepresentable(schema, ctx, json, params, `A multipleOf divisor of ${multipleOf} cannot be represented in JSON Schema`);
	}
};
const booleanProcessor = (_schema, _ctx, json, _params) => {
	json.type = "boolean";
};
const undefinedProcessor = (schema, ctx, json, params) => {
	handleUnrepresentable(schema, ctx, json, params, "Undefined cannot be represented in JSON Schema");
};
const neverProcessor = (_schema, _ctx, json, _params) => {
	json.not = {};
};
const enumProcessor = (schema, _ctx, json, _params) => {
	const def = schema._zod.def;
	const values = getEnumValues(def.entries);
	if (values.length === 0) {
		json.not = {};
		return;
	}
	if (values.every((v) => typeof v === "number")) json.type = "number";
	if (values.every((v) => typeof v === "string")) json.type = "string";
	json.enum = values;
};
const literalProcessor = (schema, ctx, json, params) => {
	const def = schema._zod.def;
	if (def.values.length === 0) {
		json.not = {};
		return;
	}
	const vals = [];
	for (const val of def.values) if (val === void 0) {
		if (handleUnrepresentable(schema, ctx, json, params, "Literal `undefined` cannot be represented in JSON Schema")) return;
	} else if (typeof val === "bigint") {
		if (handleUnrepresentable(schema, ctx, json, params, "BigInt literals cannot be represented in JSON Schema")) return;
		vals.push(Number(val));
	} else vals.push(val);
	if (vals.length === 0) {} else if (vals.length === 1) {
		const val = vals[0];
		json.type = val === null ? "null" : typeof val;
		if (ctx.target === "draft-04" || ctx.target === "openapi-3.0") json.enum = [val];
		else json.const = val;
	} else {
		if (vals.every((v) => typeof v === "number")) json.type = "number";
		if (vals.every((v) => typeof v === "string")) json.type = "string";
		if (vals.every((v) => typeof v === "boolean")) json.type = "boolean";
		if (vals.every((v) => v === null)) json.type = "null";
		json.enum = vals;
	}
};
const customProcessor = (schema, ctx, json, params) => {
	handleUnrepresentable(schema, ctx, json, params, "Custom types cannot be represented in JSON Schema");
};
const transformProcessor = (schema, ctx, json, params) => {
	handleUnrepresentable(schema, ctx, json, params, "Transforms cannot be represented in JSON Schema");
};
const arrayProcessor = (schema, ctx, _json, params) => {
	const json = _json;
	const def = schema._zod.def;
	const { minimum, maximum } = schema._zod.bag;
	if (typeof minimum === "number") json.minItems = minimum;
	if (typeof maximum === "number") json.maxItems = maximum;
	json.type = "array";
	json.items = process(def.element, ctx, {
		...params,
		path: [...params.path, "items"]
	});
};
function inputOptin(schema) {
	const def = schema._zod.def;
	if (def.type === "pipe" && def.in._zod.traits.has("$ZodTransform")) return inputOptin(def.out);
	if (def.type === "catch") return inputOptin(def.innerType);
	return schema._zod.optin;
}
const objectProcessor = (schema, ctx, _json, params) => {
	const json = _json;
	const def = schema._zod.def;
	const shape = def.shape;
	if (Object.getOwnPropertySymbols(shape).length && handleUnrepresentable(schema, ctx, json, params, "Symbol keys cannot be represented in JSON Schema")) return;
	json.type = "object";
	json.properties = {};
	for (const key in shape) assignProp(json.properties, key, process(shape[key], ctx, {
		...params,
		path: [
			...params.path,
			"properties",
			key
		]
	}));
	const allKeys = new Set(Object.keys(shape));
	const requiredKeys = new Set([...allKeys].filter((key) => {
		const field = def.shape[key];
		if (ctx.io === "input") return inputOptin(field) === void 0;
		else return field._zod.optout === void 0;
	}));
	if (requiredKeys.size > 0) json.required = Array.from(requiredKeys);
	if (def.catchall?._zod.def.type === "never") json.additionalProperties = false;
	else if (!def.catchall) {
		if (ctx.io === "output") json.additionalProperties = false;
	} else if (def.catchall) json.additionalProperties = process(def.catchall, ctx, {
		...params,
		path: [...params.path, "additionalProperties"]
	});
};
const unionProcessor = (schema, ctx, json, params) => {
	const def = schema._zod.def;
	const isExclusive = def.inclusive === false;
	const options = def.options.map((x, i) => process(x, ctx, {
		...params,
		path: [
			...params.path,
			isExclusive ? "oneOf" : "anyOf",
			i
		]
	}));
	if (isExclusive) json.oneOf = options;
	else json.anyOf = options;
};
const intersectionProcessor = (schema, ctx, json, params) => {
	const def = schema._zod.def;
	const a = process(def.left, ctx, {
		...params,
		path: [
			...params.path,
			"allOf",
			0
		]
	});
	const b = process(def.right, ctx, {
		...params,
		path: [
			...params.path,
			"allOf",
			1
		]
	});
	const isSimpleIntersection = (val) => "allOf" in val && Object.keys(val).length === 1;
	const allOf = [...isSimpleIntersection(a) ? a.allOf : [a], ...isSimpleIntersection(b) ? b.allOf : [b]];
	json.allOf = allOf;
	ctx.intersections.push(allOf);
};
const nullableProcessor = (schema, ctx, json, params) => {
	const def = schema._zod.def;
	const inner = process(def.innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	if (ctx.target === "openapi-3.0") {
		seen.ref = def.innerType;
		json.nullable = true;
	} else json.anyOf = [inner, { type: "null" }];
};
const nonoptionalProcessor = (schema, ctx, _json, params) => {
	const def = schema._zod.def;
	process(def.innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	seen.ref = def.innerType;
};
/** Round-trips a default value through JSON so the emitted schema is guaranteed to be valid JSON.
* A BigInt has no reliable encoding, so it goes through `unrepresentable` like any other
* unrepresentable value. Returns a sentinel when the caller must not write a default of its own. */
const UNREPRESENTABLE_DEFAULT = Symbol();
function serializeDefaultValue(value, schema, ctx, json, params) {
	let unrepresentable = false;
	const serialized = JSON.stringify(value, (_, val) => {
		if (typeof val !== "bigint") return val;
		unrepresentable = true;
		return null;
	});
	if (!unrepresentable) return JSON.parse(serialized);
	handleUnrepresentable(schema, ctx, json, params, "BigInt defaults cannot be represented in JSON Schema");
	return UNREPRESENTABLE_DEFAULT;
}
const defaultProcessor = (schema, ctx, json, params) => {
	const def = schema._zod.def;
	process(def.innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	seen.ref = def.innerType;
	const value = serializeDefaultValue(def.defaultValue, schema, ctx, json, params);
	if (value !== UNREPRESENTABLE_DEFAULT) json.default = value;
};
const prefaultProcessor = (schema, ctx, json, params) => {
	const def = schema._zod.def;
	process(def.innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	seen.ref = def.innerType;
	if (ctx.io !== "input") return;
	const value = serializeDefaultValue(def.defaultValue, schema, ctx, json, params);
	if (value !== UNREPRESENTABLE_DEFAULT) json._prefault = value;
};
const catchProcessor = (schema, ctx, json, params) => {
	const def = schema._zod.def;
	process(def.innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	seen.ref = def.innerType;
	let catchValue;
	try {
		catchValue = def.catchValue(void 0);
	} catch {
		handleUnrepresentable(schema, ctx, json, params, "Dynamic catch values are not supported in JSON Schema");
		return;
	}
	json.default = catchValue;
};
const pipeProcessor = (schema, ctx, _json, params) => {
	const def = schema._zod.def;
	const inIsTransform = def.in._zod.traits.has("$ZodTransform");
	const innerType = ctx.io === "input" ? inIsTransform ? def.out : def.in : def.out;
	process(innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	seen.ref = innerType;
};
const readonlyProcessor = (schema, ctx, json, params) => {
	const def = schema._zod.def;
	process(def.innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	seen.ref = def.innerType;
	json.readOnly = true;
};
const optionalProcessor = (schema, ctx, _json, params) => {
	const def = schema._zod.def;
	process(def.innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	seen.ref = def.innerType;
};
//#endregion
//#region ../../node_modules/.pnpm/zod@4.5.2/node_modules/zod/v4/classic/errors.js
const _installedErrorProtos = /* @__PURE__ */ new WeakSet([Object.prototype, Error.prototype]);
function _lazyMethod(proto, key, make) {
	Object.defineProperty(proto, key, {
		configurable: true,
		enumerable: false,
		get() {
			const value = make(this);
			Object.defineProperty(this, key, {
				value,
				configurable: true,
				writable: true
			});
			return value;
		},
		set(value) {
			Object.defineProperty(this, key, {
				value,
				configurable: true,
				writable: true
			});
		}
	});
}
const initializer = (inst, issues) => {
	$ZodError.init(inst, issues);
	inst.name = "ZodError";
	const proto = Object.getPrototypeOf(inst);
	if (_installedErrorProtos.has(proto)) return;
	_installedErrorProtos.add(proto);
	_lazyMethod(proto, "format", (self) => (mapper) => formatError(self, mapper));
	_lazyMethod(proto, "flatten", (self) => (mapper) => flattenError(self, mapper));
	_lazyMethod(proto, "addIssue", (self) => (issue) => {
		self.issues.push(issue);
		self.message = JSON.stringify(self.issues, jsonStringifyReplacer, 2);
	});
	_lazyMethod(proto, "addIssues", (self) => (issues) => {
		self.issues.push(...issues);
		self.message = JSON.stringify(self.issues, jsonStringifyReplacer, 2);
	});
	Object.defineProperty(proto, "isEmpty", {
		configurable: true,
		enumerable: false,
		get() {
			return this.issues.length === 0;
		}
	});
};
const ZodRealError = /*@__PURE__*/ $constructor("ZodError", initializer, void 0, { Parent: Error });
//#endregion
//#region ../../node_modules/.pnpm/zod@4.5.2/node_modules/zod/v4/classic/parse.js
const parse = /* @__PURE__ */ _parse(ZodRealError);
const parseAsync = /* @__PURE__ */ _parseAsync(ZodRealError);
const safeParse = /* @__PURE__ */ _safeParse(ZodRealError);
const safeParseAsync = /* @__PURE__ */ _safeParseAsync(ZodRealError);
const encode = /* @__PURE__ */ _encode(ZodRealError);
const decode = /* @__PURE__ */ _decode(ZodRealError);
const encodeAsync = /* @__PURE__ */ _encodeAsync(ZodRealError);
const decodeAsync = /* @__PURE__ */ _decodeAsync(ZodRealError);
const safeEncode = /* @__PURE__ */ _safeEncode(ZodRealError);
const safeDecode = /* @__PURE__ */ _safeDecode(ZodRealError);
const safeEncodeAsync = /* @__PURE__ */ _safeEncodeAsync(ZodRealError);
const safeDecodeAsync = /* @__PURE__ */ _safeDecodeAsync(ZodRealError);
//#endregion
//#region ../../node_modules/.pnpm/zod@4.5.2/node_modules/zod/v4/classic/schemas.js
function _ensureDefaultLocale() {
	if (!globalConfig.localeError) config(en_default());
}
function _ensureDefaultMemoizer() {
	if (!globalConfig.memoizer) config({ memoizer: memoizer() });
}
const ZodType = /*@__PURE__*/ $constructor("ZodType", (inst, def) => {
	_ensureDefaultLocale();
	$ZodType.init(inst, def);
	inst.def = def;
	inst.type = def.type;
	return inst;
}, {
	check(...chks) {
		const def = this.def;
		return this.clone(mergeDefs(def, { checks: [...def.checks ?? [], ...chks.map((ch) => typeof ch === "function" ? { _zod: {
			check: ch,
			def: { check: "custom" },
			onattach: []
		} } : ch)] }), { parent: true });
	},
	with(...chks) {
		return this.check(...chks);
	},
	clone(def, params) {
		return clone$1(this, def, params);
	},
	brand() {
		return this;
	},
	register(reg, meta) {
		reg.add(this, meta);
		return this;
	},
	refine(check, params) {
		return this.check(refine(check, params));
	},
	superRefine(refinement, params) {
		return this.check(superRefine(refinement, params));
	},
	overwrite(fn) {
		return this.check(/* @__PURE__ */ _overwrite(fn));
	},
	optional() {
		return optional(this);
	},
	exactOptional() {
		return exactOptional(this);
	},
	nullable() {
		return nullable(this);
	},
	nullish() {
		return optional(nullable(this));
	},
	nonoptional(params) {
		return nonoptional(this, params);
	},
	array() {
		return array(this);
	},
	or(arg) {
		return union([this, arg]);
	},
	and(arg) {
		return intersection(this, arg);
	},
	transform(tx) {
		return pipe(this, transform(tx));
	},
	default(d) {
		return _default(this, d);
	},
	prefault(d) {
		return prefault(this, d);
	},
	catch(params) {
		return _catch(this, params);
	},
	pipe(target) {
		return pipe(this, target);
	},
	readonly() {
		return readonly(this);
	},
	describe(description) {
		const cl = this.clone();
		globalRegistry.add(cl, { description });
		return cl;
	},
	meta(...args) {
		if (args.length === 0) return globalRegistry.get(this);
		const cl = this.clone();
		globalRegistry.add(cl, args[0]);
		return cl;
	},
	isOptional() {
		return this.safeParse(void 0).success;
	},
	isNullable() {
		return this.safeParse(null).success;
	},
	apply(fn, ...args) {
		return args.length === 0 ? fn(this) : fn(this, ...args);
	},
	get "~standard"() {
		return hide(this, "~standard", {
			...standardProps(this),
			jsonSchema: {
				input: createStandardJSONSchemaMethod(this, "input"),
				output: createStandardJSONSchemaMethod(this, "output")
			}
		});
	},
	set "~standard"(value) {
		own(this, "~standard", value);
	},
	parse: function _parse(data, params) {
		return parse(this, data, params, { callee: _parse });
	},
	parseAsync: async function _parseAsync(data, params) {
		return await parseAsync(this, data, params, { callee: _parseAsync });
	},
	safeParse(data, params) {
		return safeParse(this, data, params);
	},
	async safeParseAsync(data, params) {
		return safeParseAsync(this, data, params);
	},
	get spa() {
		return this?.safeParseAsync;
	},
	set spa(value) {
		own(this, "spa", value);
	},
	encode: function _encode(data, params) {
		return encode(this, data, params, { callee: _encode });
	},
	decode: function _decode(data, params) {
		return decode(this, data, params, { callee: _decode });
	},
	encodeAsync: async function _encodeAsync(data, params) {
		return await encodeAsync(this, data, params, { callee: _encodeAsync });
	},
	decodeAsync: async function _decodeAsync(data, params) {
		return await decodeAsync(this, data, params, { callee: _decodeAsync });
	},
	safeEncode(data, params) {
		return safeEncode(this, data, params);
	},
	safeDecode(data, params) {
		return safeDecode(this, data, params);
	},
	async safeEncodeAsync(data, params) {
		return safeEncodeAsync(this, data, params);
	},
	async safeDecodeAsync(data, params) {
		return safeDecodeAsync(this, data, params);
	},
	toJSONSchema(params) {
		return createToJSONSchemaMethod(this, {})(params);
	},
	get description() {
		return globalRegistry.get(this)?.description;
	},
	get _def() {
		return this._zod.def;
	}
});
/** @internal */
const _ZodString = /*@__PURE__*/ $constructor("_ZodString", (inst, def) => {
	$ZodString.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => stringProcessor(inst, ctx, json, params);
	const bag = inst._zod.bag;
	inst.format = bag.format ?? null;
	inst.minLength = bag.minimum ?? null;
	inst.maxLength = bag.maximum ?? null;
}, {
	regex(...args) {
		return this.check(/* @__PURE__ */ _regex(...args));
	},
	includes(...args) {
		return this.check(/* @__PURE__ */ _includes(...args));
	},
	startsWith(...args) {
		return this.check(/* @__PURE__ */ _startsWith(...args));
	},
	endsWith(...args) {
		return this.check(/* @__PURE__ */ _endsWith(...args));
	},
	min(...args) {
		return this.check(/* @__PURE__ */ _minLength(...args));
	},
	max(...args) {
		return this.check(/* @__PURE__ */ _maxLength(...args));
	},
	length(...args) {
		return this.check(/* @__PURE__ */ _length(...args));
	},
	nonempty(...args) {
		return this.check(/* @__PURE__ */ _minLength(1, ...args));
	},
	lowercase(params) {
		return this.check(/* @__PURE__ */ _lowercase(params));
	},
	uppercase(params) {
		return this.check(/* @__PURE__ */ _uppercase(params));
	},
	trim() {
		return this.check(/* @__PURE__ */ _trim());
	},
	normalize(...args) {
		return this.check(/* @__PURE__ */ _normalize(...args));
	},
	toLowerCase() {
		return this.check(/* @__PURE__ */ _toLowerCase());
	},
	toUpperCase() {
		return this.check(/* @__PURE__ */ _toUpperCase());
	},
	slugify() {
		return this.check(/* @__PURE__ */ _slugify());
	}
});
const ZodString = /*@__PURE__*/ $constructor("ZodString", (inst, def) => {
	$ZodString.init(inst, def);
	_ZodString.init(inst, def);
}, {
	email(params) {
		return this.check(/* @__PURE__ */ _email(ZodEmail, params));
	},
	url(params) {
		return this.check(/* @__PURE__ */ _url(ZodURL, params));
	},
	jwt(params) {
		return this.check(/* @__PURE__ */ _jwt(ZodJWT, params));
	},
	emoji(params) {
		return this.check(/* @__PURE__ */ _emoji(ZodEmoji, params));
	},
	guid(params) {
		return this.check(/* @__PURE__ */ _guid(ZodGUID, params));
	},
	uuid(params) {
		return this.check(/* @__PURE__ */ _uuid(ZodUUID, params));
	},
	uuidv4(params) {
		return this.check(/* @__PURE__ */ _uuidv4(ZodUUID, params));
	},
	uuidv6(params) {
		return this.check(/* @__PURE__ */ _uuidv6(ZodUUID, params));
	},
	uuidv7(params) {
		return this.check(/* @__PURE__ */ _uuidv7(ZodUUID, params));
	},
	nanoid(params) {
		return this.check(/* @__PURE__ */ _nanoid(ZodNanoID, params));
	},
	cuid(params) {
		return this.check(/* @__PURE__ */ _cuid(ZodCUID, params));
	},
	cuid2(params) {
		return this.check(/* @__PURE__ */ _cuid2(ZodCUID2, params));
	},
	ulid(params) {
		return this.check(/* @__PURE__ */ _ulid(ZodULID, params));
	},
	base64(params) {
		return this.check(/* @__PURE__ */ _base64(ZodBase64, params));
	},
	base64url(params) {
		return this.check(/* @__PURE__ */ _base64url(ZodBase64URL, params));
	},
	xid(params) {
		return this.check(/* @__PURE__ */ _xid(ZodXID, params));
	},
	ksuid(params) {
		return this.check(/* @__PURE__ */ _ksuid(ZodKSUID, params));
	},
	ipv4(params) {
		return this.check(/* @__PURE__ */ _ipv4(ZodIPv4, params));
	},
	ipv6(params) {
		return this.check(/* @__PURE__ */ _ipv6(ZodIPv6, params));
	},
	cidrv4(params) {
		return this.check(/* @__PURE__ */ _cidrv4(ZodCIDRv4, params));
	},
	cidrv6(params) {
		return this.check(/* @__PURE__ */ _cidrv6(ZodCIDRv6, params));
	},
	e164(params) {
		return this.check(/* @__PURE__ */ _e164(ZodE164, params));
	},
	datetime(params) {
		return this.check(/* @__PURE__ */ _isoDateTime(ZodISODateTime, params));
	},
	date(params) {
		return this.check(/* @__PURE__ */ _isoDate(ZodISODate, params));
	},
	time(params) {
		return this.check(/* @__PURE__ */ _isoTime(ZodISOTime, params));
	},
	duration(params) {
		return this.check(/* @__PURE__ */ _isoDuration(ZodISODuration, params));
	}
});
function string(params) {
	return /* @__PURE__ */ _string(ZodString, params);
}
const ZodStringFormat = /*@__PURE__*/ $constructor("ZodStringFormat", (inst, def) => {
	$ZodStringFormat.init(inst, def);
	_ZodString.init(inst, def);
});
const ZodISODateTime = /*@__PURE__*/ $constructor("ZodISODateTime", (inst, def) => {
	$ZodISODateTime.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodISODate = /*@__PURE__*/ $constructor("ZodISODate", (inst, def) => {
	$ZodISODate.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodISOTime = /*@__PURE__*/ $constructor("ZodISOTime", (inst, def) => {
	$ZodISOTime.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodISODuration = /*@__PURE__*/ $constructor("ZodISODuration", (inst, def) => {
	$ZodISODuration.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodEmail = /*@__PURE__*/ $constructor("ZodEmail", (inst, def) => {
	$ZodEmail.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodGUID = /*@__PURE__*/ $constructor("ZodGUID", (inst, def) => {
	$ZodGUID.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodUUID = /*@__PURE__*/ $constructor("ZodUUID", (inst, def) => {
	$ZodUUID.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodURL = /*@__PURE__*/ $constructor("ZodURL", (inst, def) => {
	$ZodURL.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodEmoji = /*@__PURE__*/ $constructor("ZodEmoji", (inst, def) => {
	$ZodEmoji.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodNanoID = /*@__PURE__*/ $constructor("ZodNanoID", (inst, def) => {
	$ZodNanoID.init(inst, def);
	ZodStringFormat.init(inst, def);
});
/**
* @deprecated CUID v1 is deprecated by its authors due to information leakage
* (timestamps embedded in the id). Use {@link ZodCUID2} instead.
* See https://github.com/paralleldrive/cuid.
*/
const ZodCUID = /*@__PURE__*/ $constructor("ZodCUID", (inst, def) => {
	$ZodCUID.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodCUID2 = /*@__PURE__*/ $constructor("ZodCUID2", (inst, def) => {
	$ZodCUID2.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodULID = /*@__PURE__*/ $constructor("ZodULID", (inst, def) => {
	$ZodULID.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodXID = /*@__PURE__*/ $constructor("ZodXID", (inst, def) => {
	$ZodXID.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodKSUID = /*@__PURE__*/ $constructor("ZodKSUID", (inst, def) => {
	$ZodKSUID.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodIPv4 = /*@__PURE__*/ $constructor("ZodIPv4", (inst, def) => {
	$ZodIPv4.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodIPv6 = /*@__PURE__*/ $constructor("ZodIPv6", (inst, def) => {
	$ZodIPv6.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodCIDRv4 = /*@__PURE__*/ $constructor("ZodCIDRv4", (inst, def) => {
	$ZodCIDRv4.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodCIDRv6 = /*@__PURE__*/ $constructor("ZodCIDRv6", (inst, def) => {
	$ZodCIDRv6.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodBase64 = /*@__PURE__*/ $constructor("ZodBase64", (inst, def) => {
	$ZodBase64.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodBase64URL = /*@__PURE__*/ $constructor("ZodBase64URL", (inst, def) => {
	$ZodBase64URL.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodE164 = /*@__PURE__*/ $constructor("ZodE164", (inst, def) => {
	$ZodE164.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodJWT = /*@__PURE__*/ $constructor("ZodJWT", (inst, def) => {
	$ZodJWT.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodNumber = /*@__PURE__*/ $constructor("ZodNumber", (inst, def) => {
	$ZodNumber.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => numberProcessor(inst, ctx, json, params);
	const bag = inst._zod.bag;
	inst.minValue = Math.max(bag.minimum ?? Number.NEGATIVE_INFINITY, bag.exclusiveMinimum ?? Number.NEGATIVE_INFINITY) ?? null;
	inst.maxValue = Math.min(bag.maximum ?? Number.POSITIVE_INFINITY, bag.exclusiveMaximum ?? Number.POSITIVE_INFINITY) ?? null;
	inst.isInt = (bag.format ?? "").includes("int") || Number.isSafeInteger(bag.multipleOf ?? .5);
	inst.isFinite = true;
	inst.format = bag.format ?? null;
}, {
	gt(value, params) {
		return this.check(/* @__PURE__ */ _gt(value, params));
	},
	gte(value, params) {
		return this.check(/* @__PURE__ */ _gte(value, params));
	},
	min(value, params) {
		return this.check(/* @__PURE__ */ _gte(value, params));
	},
	lt(value, params) {
		return this.check(/* @__PURE__ */ _lt(value, params));
	},
	lte(value, params) {
		return this.check(/* @__PURE__ */ _lte(value, params));
	},
	max(value, params) {
		return this.check(/* @__PURE__ */ _lte(value, params));
	},
	int(params) {
		return this.check(int(params));
	},
	safe(params) {
		return this.check(int(params));
	},
	positive(params) {
		return this.check(/* @__PURE__ */ _gt(0, params));
	},
	nonnegative(params) {
		return this.check(/* @__PURE__ */ _gte(0, params));
	},
	negative(params) {
		return this.check(/* @__PURE__ */ _lt(0, params));
	},
	nonpositive(params) {
		return this.check(/* @__PURE__ */ _lte(0, params));
	},
	multipleOf(value, params) {
		return this.check(/* @__PURE__ */ _multipleOf(value, params));
	},
	step(value, params) {
		return this.check(/* @__PURE__ */ _multipleOf(value, params));
	},
	finite() {
		return this;
	}
});
function number(params) {
	return /* @__PURE__ */ _number(ZodNumber, params);
}
const ZodNumberFormat = /*@__PURE__*/ $constructor("ZodNumberFormat", (inst, def) => {
	$ZodNumberFormat.init(inst, def);
	ZodNumber.init(inst, def);
});
function int(params) {
	return /* @__PURE__ */ _int(ZodNumberFormat, params);
}
const ZodBoolean = /*@__PURE__*/ $constructor("ZodBoolean", (inst, def) => {
	$ZodBoolean.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => booleanProcessor(inst, ctx, json, params);
});
function boolean(params) {
	return /* @__PURE__ */ _boolean(ZodBoolean, params);
}
const ZodUndefined = /*@__PURE__*/ $constructor("ZodUndefined", (inst, def) => {
	$ZodUndefined.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => undefinedProcessor(inst, ctx, json, params);
});
function _undefined(params) {
	return /* @__PURE__ */ _undefined$1(ZodUndefined, params);
}
const ZodUnknown = /*@__PURE__*/ $constructor("ZodUnknown", (inst, def) => {
	$ZodUnknown.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => void 0;
});
function unknown() {
	return /* @__PURE__ */ _unknown(ZodUnknown);
}
const ZodNever = /*@__PURE__*/ $constructor("ZodNever", (inst, def) => {
	$ZodNever.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => neverProcessor(inst, ctx, json, params);
});
function never(params) {
	return /* @__PURE__ */ _never(ZodNever, params);
}
const ZodArray = /*@__PURE__*/ $constructor("ZodArray", (inst, def) => {
	_ensureDefaultMemoizer();
	$ZodArray.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => arrayProcessor(inst, ctx, json, params);
	inst.element = def.element;
}, {
	min(n, params) {
		return this.check(/* @__PURE__ */ _minLength(n, params));
	},
	nonempty(params) {
		return this.check(/* @__PURE__ */ _minLength(1, params));
	},
	max(n, params) {
		return this.check(/* @__PURE__ */ _maxLength(n, params));
	},
	length(n, params) {
		return this.check(/* @__PURE__ */ _length(n, params));
	},
	unwrap() {
		return this.element;
	}
});
function array(element, params) {
	return /* @__PURE__ */ _array(ZodArray, element, params);
}
const ZodObject = /*@__PURE__*/ $constructor("ZodObject", (inst, def) => {
	_ensureDefaultMemoizer();
	$ZodObjectJIT.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => objectProcessor(inst, ctx, json, params);
	installLazyProp(inst, "shape", (self) => self._zod.def.shape, false);
}, {
	keyof() {
		return _enum(Object.keys(this._zod.def.shape));
	},
	catchall(catchall) {
		return this.clone({
			...this._zod.def,
			catchall
		});
	},
	passthrough() {
		return this.clone({
			...this._zod.def,
			catchall: unknown()
		});
	},
	loose() {
		return this.clone({
			...this._zod.def,
			catchall: unknown()
		});
	},
	strict() {
		return this.clone({
			...this._zod.def,
			catchall: never()
		});
	},
	strip() {
		return this.clone({
			...this._zod.def,
			catchall: void 0
		});
	},
	extend(incoming) {
		return extend(this, incoming);
	},
	safeExtend(incoming) {
		return safeExtend(this, incoming);
	},
	merge(other) {
		return merge(this, other);
	},
	pick(mask) {
		return pick(this, mask);
	},
	omit(mask) {
		return omit(this, mask);
	},
	partial(...args) {
		return partial(ZodOptional, this, args[0]);
	},
	exactPartial(...args) {
		return partial(ZodExactOptional, this, args[0], "exactPartial");
	},
	required(...args) {
		return required(ZodNonOptional, this, args[0]);
	}
});
function object(shape, params) {
	const def = {
		type: "object",
		shape: shape ?? {},
		...normalizeParams(params)
	};
	return new ZodObject(def);
}
const ZodUnion = /*@__PURE__*/ $constructor("ZodUnion", (inst, def) => {
	$ZodUnion.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => unionProcessor(inst, ctx, json, params);
	inst.options = def.options;
});
function union(options, params) {
	return new ZodUnion({
		type: "union",
		options,
		...normalizeParams(params)
	});
}
const ZodIntersection = /*@__PURE__*/ $constructor("ZodIntersection", (inst, def) => {
	$ZodIntersection.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => intersectionProcessor(inst, ctx, json, params);
});
function intersection(left, right) {
	return new ZodIntersection({
		type: "intersection",
		left,
		right
	});
}
const ZodEnum = /*@__PURE__*/ $constructor("ZodEnum", (inst, def) => {
	$ZodEnum.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => enumProcessor(inst, ctx, json, params);
	inst.enum = def.entries;
	inst.options = Object.values(def.entries);
	const keys = new Set(Object.keys(def.entries));
	inst.extract = (values, params) => {
		const newEntries = {};
		for (const value of values) if (keys.has(value)) newEntries[value] = def.entries[value];
		else throw new Error(`Key ${value} not found in enum`);
		return new ZodEnum({
			...def,
			checks: [],
			...normalizeParams(params),
			entries: newEntries
		});
	};
	inst.exclude = (values, params) => {
		const newEntries = { ...def.entries };
		for (const value of values) if (keys.has(value)) delete newEntries[value];
		else throw new Error(`Key ${value} not found in enum`);
		return new ZodEnum({
			...def,
			checks: [],
			...normalizeParams(params),
			entries: newEntries
		});
	};
});
function _enum(values, params) {
	const entries = Array.isArray(values) ? Object.fromEntries(values.map((v) => [v, v])) : values;
	return new ZodEnum({
		type: "enum",
		entries,
		...normalizeParams(params)
	});
}
const ZodLiteral = /*@__PURE__*/ $constructor("ZodLiteral", (inst, def) => {
	$ZodLiteral.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => literalProcessor(inst, ctx, json, params);
	inst.values = new Set(def.values);
	Object.defineProperty(inst, "value", { get() {
		if (def.values.length > 1) throw new Error("This schema contains multiple valid literal values. Use `.values` instead.");
		return def.values[0];
	} });
});
function literal(value, params) {
	return new ZodLiteral({
		type: "literal",
		values: Array.isArray(value) ? value : [value],
		...normalizeParams(params)
	});
}
const ZodTransform = /*@__PURE__*/ $constructor("ZodTransform", (inst, def) => {
	_ensureDefaultMemoizer();
	$ZodTransform.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => transformProcessor(inst, ctx, json, params);
	inst._zod.parse = (payload, _ctx) => {
		if (_ctx.direction === "backward") throw new $ZodEncodeError(inst.constructor.name);
		payload.addIssue = (issue$1) => {
			if (typeof issue$1 === "string") payload.issues.push(issue(issue$1, payload.value, def));
			else {
				const _issue = issue$1;
				if (_issue.fatal) _issue.continue = false;
				_issue.code ?? (_issue.code = "custom");
				if (!("input" in _issue)) _issue.input = payload.value;
				_issue.inst ?? (_issue.inst = inst);
				payload.issues.push(issue(_issue));
			}
		};
		const output = def.transform(payload.value, payload);
		if (output instanceof Promise) return output.then((output) => {
			payload.value = output;
			return payload;
		});
		payload.value = output;
		return payload;
	};
});
function transform(fn) {
	return new ZodTransform({
		type: "transform",
		transform: fn
	});
}
const ZodOptional = /*@__PURE__*/ $constructor("ZodOptional", (inst, def) => {
	$ZodOptional.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => optionalProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
});
function optional(innerType) {
	return new ZodOptional({
		type: "optional",
		innerType
	});
}
const ZodExactOptional = /*@__PURE__*/ $constructor("ZodExactOptional", (inst, def) => {
	$ZodExactOptional.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => optionalProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
});
function exactOptional(innerType) {
	return new ZodExactOptional({
		type: "optional",
		innerType
	});
}
const ZodNullable = /*@__PURE__*/ $constructor("ZodNullable", (inst, def) => {
	$ZodNullable.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => nullableProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
});
function nullable(innerType) {
	return new ZodNullable({
		type: "nullable",
		innerType
	});
}
const ZodDefault = /*@__PURE__*/ $constructor("ZodDefault", (inst, def) => {
	$ZodDefault.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => defaultProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
	inst.removeDefault = inst.unwrap;
});
function _default(innerType, defaultValue) {
	return new ZodDefault({
		type: "default",
		innerType,
		get defaultValue() {
			return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
		}
	});
}
const ZodPrefault = /*@__PURE__*/ $constructor("ZodPrefault", (inst, def) => {
	$ZodPrefault.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => prefaultProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
});
function prefault(innerType, defaultValue) {
	return new ZodPrefault({
		type: "prefault",
		innerType,
		get defaultValue() {
			return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
		}
	});
}
const ZodNonOptional = /*@__PURE__*/ $constructor("ZodNonOptional", (inst, def) => {
	$ZodNonOptional.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => nonoptionalProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
});
function nonoptional(innerType, params) {
	return new ZodNonOptional({
		type: "nonoptional",
		innerType,
		...normalizeParams(params)
	});
}
const ZodCatch = /*@__PURE__*/ $constructor("ZodCatch", (inst, def) => {
	$ZodCatch.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => catchProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
	inst.removeCatch = inst.unwrap;
});
function _catch(innerType, catchValue) {
	return new ZodCatch({
		type: "catch",
		innerType,
		catchValue: typeof catchValue === "function" ? catchValue : constantCatch(catchValue)
	});
}
const ZodPipe = /*@__PURE__*/ $constructor("ZodPipe", (inst, def) => {
	$ZodPipe.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => pipeProcessor(inst, ctx, json, params);
	inst.in = def.in;
	inst.out = def.out;
});
function pipe(in_, out) {
	return new ZodPipe({
		type: "pipe",
		in: in_,
		out
	});
}
const ZodReadonly = /*@__PURE__*/ $constructor("ZodReadonly", (inst, def) => {
	$ZodReadonly.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => readonlyProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
});
function readonly(innerType) {
	return new ZodReadonly({
		type: "readonly",
		innerType
	});
}
const ZodCustom = /*@__PURE__*/ $constructor("ZodCustom", (inst, def) => {
	$ZodCustom.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => customProcessor(inst, ctx, json, params);
});
function refine(fn, _params = {}) {
	return /* @__PURE__ */ _refine(ZodCustom, fn, _params);
}
function superRefine(fn, params) {
	return /* @__PURE__ */ _superRefine(fn, params);
}
//#endregion
//#region ../dsh-forum-kb/lib/typert.remote-client.js
let _deepseek_ai_dsh_forum_kb_forumKb_answer_parameter_0$schema$value;
const _deepseek_ai_dsh_forum_kb_forumKb_answer_parameter_0$schema = () => _deepseek_ai_dsh_forum_kb_forumKb_answer_parameter_0$schema$value ??= object({
	"post": string(),
	"as": string(),
	"source": string(),
	"rel": string(),
	"body": string()
});
let _deepseek_ai_dsh_forum_kb_forumKb_answer_result$schema$value;
const _deepseek_ai_dsh_forum_kb_forumKb_answer_result$schema = () => _deepseek_ai_dsh_forum_kb_forumKb_answer_result$schema$value ??= object({
	"ok": boolean(),
	"text": union([_undefined(), string()]).optional(),
	"error": union([_undefined(), string()]).optional(),
	"id": union([_undefined(), string()]).optional()
});
let _deepseek_ai_dsh_forum_kb_forumKb_claim_parameter_0$schema$value;
const _deepseek_ai_dsh_forum_kb_forumKb_claim_parameter_0$schema = () => _deepseek_ai_dsh_forum_kb_forumKb_claim_parameter_0$schema$value ??= object({
	"post": string(),
	"as": string()
});
let _deepseek_ai_dsh_forum_kb_forumKb_claim_result$schema$value;
const _deepseek_ai_dsh_forum_kb_forumKb_claim_result$schema = () => _deepseek_ai_dsh_forum_kb_forumKb_claim_result$schema$value ??= object({
	"ok": boolean(),
	"text": union([_undefined(), string()]).optional(),
	"error": union([_undefined(), string()]).optional(),
	"id": union([_undefined(), string()]).optional()
});
let _deepseek_ai_dsh_forum_kb_forumKb_comment_parameter_0$schema$value;
const _deepseek_ai_dsh_forum_kb_forumKb_comment_parameter_0$schema = () => _deepseek_ai_dsh_forum_kb_forumKb_comment_parameter_0$schema$value ??= object({
	"post": string(),
	"as": string(),
	"on": string(),
	"body": string()
});
let _deepseek_ai_dsh_forum_kb_forumKb_comment_result$schema$value;
const _deepseek_ai_dsh_forum_kb_forumKb_comment_result$schema = () => _deepseek_ai_dsh_forum_kb_forumKb_comment_result$schema$value ??= object({
	"ok": boolean(),
	"text": union([_undefined(), string()]).optional(),
	"error": union([_undefined(), string()]).optional(),
	"id": union([_undefined(), string()]).optional()
});
let _deepseek_ai_dsh_forum_kb_forumKb_dispatch_parameter_0$schema$value;
const _deepseek_ai_dsh_forum_kb_forumKb_dispatch_parameter_0$schema = () => _deepseek_ai_dsh_forum_kb_forumKb_dispatch_parameter_0$schema$value ??= object({
	"post": string(),
	"on": string(),
	"targets": array(union([string(), object({
		"name": string(),
		"preset": union([_undefined(), string()]).optional(),
		"permission": union([_undefined(), string()]).optional()
	})])),
	"author": string(),
	"body": string()
});
let _deepseek_ai_dsh_forum_kb_forumKb_dispatch_result$schema$value;
const _deepseek_ai_dsh_forum_kb_forumKb_dispatch_result$schema = () => _deepseek_ai_dsh_forum_kb_forumKb_dispatch_result$schema$value ??= array(object({
	"target": string(),
	"ok": boolean(),
	"sessionId": union([_undefined(), string()]).optional(),
	"action": union([
		_undefined(),
		literal("live"),
		literal("resumed"),
		literal("created")
	]).optional(),
	"permission": union([_undefined(), string()]).optional(),
	"error": union([_undefined(), string()]).optional()
}));
let _deepseek_ai_dsh_forum_kb_forumKb_dispatchInfo_parameter_0$schema$value;
const _deepseek_ai_dsh_forum_kb_forumKb_dispatchInfo_parameter_0$schema = () => _deepseek_ai_dsh_forum_kb_forumKb_dispatchInfo_parameter_0$schema$value ??= object({
	"post": union([_undefined(), string()]).optional(),
	"on": union([_undefined(), string()]).optional(),
	"targets": union([_undefined(), array(union([string(), object({
		"name": string(),
		"preset": union([_undefined(), string()]).optional(),
		"permission": union([_undefined(), string()]).optional()
	})]))]).optional()
});
let _deepseek_ai_dsh_forum_kb_forumKb_dispatchInfo_result$schema$value;
const _deepseek_ai_dsh_forum_kb_forumKb_dispatchInfo_result$schema = () => _deepseek_ai_dsh_forum_kb_forumKb_dispatchInfo_result$schema$value ??= object({
	"presets": array(object({
		"id": string(),
		"name": union([_undefined(), string()]).optional(),
		"description": union([_undefined(), string()]).optional(),
		"broken": union([_undefined(), string()]).optional(),
		"trust": union([_undefined(), string()]).optional()
	})),
	"permissions": union([_undefined(), array(object({
		"name": string(),
		"sandbox": union([_undefined(), string()]).optional(),
		"approval": union([_undefined(), string()]).optional(),
		"description": union([_undefined(), string()]).optional()
	}))]).optional(),
	"preview": union([_undefined(), array(object({
		"target": string(),
		"action": union([
			literal("live"),
			literal("resumed"),
			literal("created")
		]),
		"route": union([
			literal("selection"),
			literal("routes"),
			literal("default")
		]),
		"preset": union([literal(null), object({
			"id": string(),
			"name": union([_undefined(), string()]).optional(),
			"description": union([_undefined(), string()]).optional(),
			"broken": union([_undefined(), string()]).optional(),
			"trust": union([_undefined(), string()]).optional()
		})]),
		"model": union([_undefined(), object({
			"provider": string(),
			"model": string(),
			"reasoningEffort": union([_undefined(), string()]).optional()
		})]).optional(),
		"permission": union([
			_undefined(),
			literal(null),
			object({
				"name": string(),
				"sandbox": union([_undefined(), string()]).optional(),
				"approval": union([_undefined(), string()]).optional(),
				"description": union([_undefined(), string()]).optional()
			})
		]).optional(),
		"sessionId": union([_undefined(), string()]).optional(),
		"note": union([_undefined(), string()]).optional()
	}))]).optional(),
	"inCase": union([_undefined(), array(object({
		"post": string(),
		"author": string(),
		"sessionId": string(),
		"live": boolean(),
		"agentPreset": union([
			_undefined(),
			literal(null),
			string()
		]).optional(),
		"watermark": union([
			_undefined(),
			literal(null),
			string()
		]).optional()
	}))]).optional()
});
let _deepseek_ai_dsh_forum_kb_forumKb_dispatchSessions_result$schema$value;
const _deepseek_ai_dsh_forum_kb_forumKb_dispatchSessions_result$schema = () => _deepseek_ai_dsh_forum_kb_forumKb_dispatchSessions_result$schema$value ??= array(object({
	"post": string(),
	"author": string(),
	"sessionId": string(),
	"live": boolean(),
	"agentPreset": union([
		_undefined(),
		literal(null),
		string()
	]).optional(),
	"watermark": union([
		_undefined(),
		literal(null),
		string()
	]).optional()
}));
let _deepseek_ai_dsh_forum_kb_forumKb_list_result$schema$value;
const _deepseek_ai_dsh_forum_kb_forumKb_list_result$schema = () => _deepseek_ai_dsh_forum_kb_forumKb_list_result$schema$value ??= array(object({
	"id": string(),
	"title": string(),
	"state": string(),
	"current": union([literal(null), string()]),
	"assigned": union([literal(null), string()]),
	"entry": number(),
	"summary": string(),
	"tags": union([_undefined(), array(string())]).optional(),
	"pinned": union([_undefined(), number()]).optional(),
	"pinnedScope": union([
		_undefined(),
		literal(null),
		string()
	]).optional(),
	"createdAt": union([
		_undefined(),
		literal(null),
		string()
	]).optional(),
	"updatedAt": union([
		_undefined(),
		literal(null),
		string()
	]).optional(),
	"answers": union([_undefined(), number()]).optional(),
	"comments": union([_undefined(), number()]).optional()
}));
let _deepseek_ai_dsh_forum_kb_forumKb_openRef_parameter_0$schema$value;
const _deepseek_ai_dsh_forum_kb_forumKb_openRef_parameter_0$schema = () => _deepseek_ai_dsh_forum_kb_forumKb_openRef_parameter_0$schema$value ??= object({ "path": string() });
let _deepseek_ai_dsh_forum_kb_forumKb_openRef_result$schema$value;
const _deepseek_ai_dsh_forum_kb_forumKb_openRef_result$schema = () => _deepseek_ai_dsh_forum_kb_forumKb_openRef_result$schema$value ??= object({
	"ok": boolean(),
	"path": union([_undefined(), string()]).optional(),
	"error": union([_undefined(), string()]).optional()
});
let _deepseek_ai_dsh_forum_kb_forumKb_pin_parameter_0$schema$value;
const _deepseek_ai_dsh_forum_kb_forumKb_pin_parameter_0$schema = () => _deepseek_ai_dsh_forum_kb_forumKb_pin_parameter_0$schema$value ??= object({
	"post": string(),
	"set": string(),
	"scope": union([_undefined(), string()]).optional()
});
let _deepseek_ai_dsh_forum_kb_forumKb_pin_result$schema$value;
const _deepseek_ai_dsh_forum_kb_forumKb_pin_result$schema = () => _deepseek_ai_dsh_forum_kb_forumKb_pin_result$schema$value ??= object({
	"ok": boolean(),
	"text": union([_undefined(), string()]).optional(),
	"error": union([_undefined(), string()]).optional(),
	"id": union([_undefined(), string()]).optional()
});
let _deepseek_ai_dsh_forum_kb_forumKb_post_parameter_0$schema$value;
const _deepseek_ai_dsh_forum_kb_forumKb_post_parameter_0$schema = () => _deepseek_ai_dsh_forum_kb_forumKb_post_parameter_0$schema$value ??= object({
	"id": union([_undefined(), string()]).optional(),
	"title": string(),
	"author": string(),
	"tag": string(),
	"summary": string(),
	"body": string(),
	"dependsOn": union([_undefined(), array(object({
		"kind": string(),
		"id": string(),
		"anchor": union([_undefined(), string()]).optional()
	}))]).optional()
});
let _deepseek_ai_dsh_forum_kb_forumKb_post_result$schema$value;
const _deepseek_ai_dsh_forum_kb_forumKb_post_result$schema = () => _deepseek_ai_dsh_forum_kb_forumKb_post_result$schema$value ??= object({
	"ok": boolean(),
	"text": union([_undefined(), string()]).optional(),
	"error": union([_undefined(), string()]).optional(),
	"id": union([_undefined(), string()]).optional()
});
let _deepseek_ai_dsh_forum_kb_forumKb_read_parameter_0$schema$value;
const _deepseek_ai_dsh_forum_kb_forumKb_read_parameter_0$schema = () => _deepseek_ai_dsh_forum_kb_forumKb_read_parameter_0$schema$value ??= string();
let _deepseek_ai_dsh_forum_kb_forumKb_read_result$schema$value;
const _deepseek_ai_dsh_forum_kb_forumKb_read_result$schema = () => _deepseek_ai_dsh_forum_kb_forumKb_read_result$schema$value ??= object({
	"id": string(),
	"markdown": string()
});
let _deepseek_ai_dsh_forum_kb_forumKb_refs_parameter_0$schema$value;
const _deepseek_ai_dsh_forum_kb_forumKb_refs_parameter_0$schema = () => _deepseek_ai_dsh_forum_kb_forumKb_refs_parameter_0$schema$value ??= object({ "id": string() });
let _deepseek_ai_dsh_forum_kb_forumKb_refs_result$schema$value;
const _deepseek_ai_dsh_forum_kb_forumKb_refs_result$schema = () => _deepseek_ai_dsh_forum_kb_forumKb_refs_result$schema$value ??= object({
	"id": string(),
	"kind": string(),
	"inbound": array(object({
		"from": string(),
		"where": string(),
		"anchor": union([
			_undefined(),
			literal(null),
			string()
		]).optional(),
		"title": union([
			_undefined(),
			literal(null),
			string()
		]).optional()
	})),
	"outbound": array(object({
		"kind": string(),
		"id": string(),
		"anchor": union([
			_undefined(),
			literal(null),
			string()
		]).optional(),
		"title": union([
			_undefined(),
			literal(null),
			string()
		]).optional()
	}))
});
let _deepseek_ai_dsh_forum_kb_forumKb_search_parameter_0$schema$value;
const _deepseek_ai_dsh_forum_kb_forumKb_search_parameter_0$schema = () => _deepseek_ai_dsh_forum_kb_forumKb_search_parameter_0$schema$value ??= object({ "term": string() });
let _deepseek_ai_dsh_forum_kb_forumKb_search_result$schema$value;
const _deepseek_ai_dsh_forum_kb_forumKb_search_result$schema = () => _deepseek_ai_dsh_forum_kb_forumKb_search_result$schema$value ??= array(object({
	"id": string(),
	"title": string(),
	"state": string(),
	"current": union([literal(null), string()]),
	"summary": string()
}));
let _deepseek_ai_dsh_forum_kb_forumKb_state_parameter_0$schema$value;
const _deepseek_ai_dsh_forum_kb_forumKb_state_parameter_0$schema = () => _deepseek_ai_dsh_forum_kb_forumKb_state_parameter_0$schema$value ??= object({
	"post": string(),
	"state": string()
});
let _deepseek_ai_dsh_forum_kb_forumKb_state_result$schema$value;
const _deepseek_ai_dsh_forum_kb_forumKb_state_result$schema = () => _deepseek_ai_dsh_forum_kb_forumKb_state_result$schema$value ??= object({
	"ok": boolean(),
	"text": union([_undefined(), string()]).optional(),
	"error": union([_undefined(), string()]).optional(),
	"id": union([_undefined(), string()]).optional()
});
let _deepseek_ai_dsh_forum_kb_forumKb_toolIndex_result$schema$value;
const _deepseek_ai_dsh_forum_kb_forumKb_toolIndex_result$schema = () => _deepseek_ai_dsh_forum_kb_forumKb_toolIndex_result$schema$value ??= array(object({
	"name": string(),
	"description": union([_undefined(), string()]).optional()
}));
let _deepseek_ai_dsh_forum_kb_forumKb_view_parameter_0$schema$value;
const _deepseek_ai_dsh_forum_kb_forumKb_view_parameter_0$schema = () => _deepseek_ai_dsh_forum_kb_forumKb_view_parameter_0$schema$value ??= string();
let _deepseek_ai_dsh_forum_kb_forumKb_view_result$schema$value;
const _deepseek_ai_dsh_forum_kb_forumKb_view_result$schema = () => _deepseek_ai_dsh_forum_kb_forumKb_view_result$schema$value ??= object({
	"id": string(),
	"title": string(),
	"author": string(),
	"tags": array(string()),
	"state": string(),
	"current": union([literal(null), string()]),
	"assigned": union([literal(null), string()]),
	"entry": number(),
	"summary": string(),
	"pinned": union([_undefined(), number()]).optional(),
	"pinnedScope": union([
		_undefined(),
		literal(null),
		string()
	]).optional(),
	"dependsOn": union([_undefined(), array(object({
		"kind": string(),
		"id": string(),
		"anchor": union([_undefined(), string()]).optional()
	}))]).optional(),
	"query": union([literal(null), string()]),
	"answers": array(object({
		"id": string(),
		"author": string(),
		"body": string(),
		"source": union([literal(null), string()]),
		"sourceRel": union([literal(null), string()]),
		"current": boolean(),
		"comments": array(object({
			"id": string(),
			"author": string(),
			"body": string()
		}))
	}))
});
const TYPERT_REMOTE = {
	package: "@deepseek-ai/dsh-forum-kb",
	descriptors: [
		{
			id: "@deepseek-ai/dsh-forum-kb#forumKb/answer",
			service: "forumKb",
			namespace: "forumKb",
			method: "answer",
			invocation: { kind: "direct" },
			parameters: [{
				name: "req",
				wire: "req",
				source: "json",
				codec: {
					mode: "strict",
					typeSymbol: "@deepseek-ai/dsh-forum-kb#forumKb/answer:req",
					create: _deepseek_ai_dsh_forum_kb_forumKb_answer_parameter_0$schema
				}
			}],
			result: {
				mode: "strict",
				typeSymbol: "@deepseek-ai/dsh-forum-kb/types#WriteResult",
				create: _deepseek_ai_dsh_forum_kb_forumKb_answer_result$schema
			},
			sourceLocation: {
				"file": "packages/dsh-forum-kb/src/index.ts",
				"line": 331,
				"column": 9
			}
		},
		{
			id: "@deepseek-ai/dsh-forum-kb#forumKb/claim",
			service: "forumKb",
			namespace: "forumKb",
			method: "claim",
			invocation: { kind: "direct" },
			parameters: [{
				name: "req",
				wire: "req",
				source: "json",
				codec: {
					mode: "strict",
					typeSymbol: "@deepseek-ai/dsh-forum-kb#forumKb/claim:req",
					create: _deepseek_ai_dsh_forum_kb_forumKb_claim_parameter_0$schema
				}
			}],
			result: {
				mode: "strict",
				typeSymbol: "@deepseek-ai/dsh-forum-kb/types#WriteResult",
				create: _deepseek_ai_dsh_forum_kb_forumKb_claim_result$schema
			},
			sourceLocation: {
				"file": "packages/dsh-forum-kb/src/index.ts",
				"line": 325,
				"column": 9
			}
		},
		{
			id: "@deepseek-ai/dsh-forum-kb#forumKb/comment",
			service: "forumKb",
			namespace: "forumKb",
			method: "comment",
			invocation: { kind: "direct" },
			parameters: [{
				name: "req",
				wire: "req",
				source: "json",
				codec: {
					mode: "strict",
					typeSymbol: "@deepseek-ai/dsh-forum-kb#forumKb/comment:req",
					create: _deepseek_ai_dsh_forum_kb_forumKb_comment_parameter_0$schema
				}
			}],
			result: {
				mode: "strict",
				typeSymbol: "@deepseek-ai/dsh-forum-kb/types#WriteResult",
				create: _deepseek_ai_dsh_forum_kb_forumKb_comment_result$schema
			},
			sourceLocation: {
				"file": "packages/dsh-forum-kb/src/index.ts",
				"line": 337,
				"column": 9
			}
		},
		{
			id: "@deepseek-ai/dsh-forum-kb#forumKb/dispatch",
			service: "forumKb",
			namespace: "forumKb",
			method: "dispatch",
			invocation: { kind: "direct" },
			parameters: [{
				name: "req",
				wire: "req",
				source: "json",
				codec: {
					mode: "strict",
					typeSymbol: "@deepseek-ai/dsh-forum-kb/types#DispatchRequest",
					create: _deepseek_ai_dsh_forum_kb_forumKb_dispatch_parameter_0$schema
				}
			}],
			result: {
				mode: "strict",
				typeSymbol: "@deepseek-ai/dsh-forum-kb#forumKb/dispatch:result",
				create: _deepseek_ai_dsh_forum_kb_forumKb_dispatch_result$schema
			},
			sourceLocation: {
				"file": "packages/dsh-forum-kb/src/index.ts",
				"line": 639,
				"column": 9
			}
		},
		{
			id: "@deepseek-ai/dsh-forum-kb#forumKb/dispatchInfo",
			service: "forumKb",
			namespace: "forumKb",
			method: "dispatchInfo",
			invocation: { kind: "direct" },
			parameters: [{
				name: "req",
				wire: "req",
				source: "json",
				codec: {
					mode: "strict",
					typeSymbol: "@deepseek-ai/dsh-forum-kb#forumKb/dispatchInfo:req",
					create: _deepseek_ai_dsh_forum_kb_forumKb_dispatchInfo_parameter_0$schema
				}
			}],
			result: {
				mode: "strict",
				typeSymbol: "@deepseek-ai/dsh-forum-kb/types#DispatchInfoResult",
				create: _deepseek_ai_dsh_forum_kb_forumKb_dispatchInfo_result$schema
			},
			sourceLocation: {
				"file": "packages/dsh-forum-kb/src/index.ts",
				"line": 397,
				"column": 9
			}
		},
		{
			id: "@deepseek-ai/dsh-forum-kb#forumKb/dispatchSessions",
			service: "forumKb",
			namespace: "forumKb",
			method: "dispatchSessions",
			invocation: { kind: "direct" },
			parameters: [],
			result: {
				mode: "strict",
				typeSymbol: "@deepseek-ai/dsh-forum-kb#forumKb/dispatchSessions:result",
				create: _deepseek_ai_dsh_forum_kb_forumKb_dispatchSessions_result$schema
			},
			sourceLocation: {
				"file": "packages/dsh-forum-kb/src/index.ts",
				"line": 372,
				"column": 9
			}
		},
		{
			id: "@deepseek-ai/dsh-forum-kb#forumKb/list",
			service: "forumKb",
			namespace: "forumKb",
			method: "list",
			invocation: { kind: "direct" },
			parameters: [],
			result: {
				mode: "strict",
				typeSymbol: "@deepseek-ai/dsh-forum-kb#forumKb/list:result",
				create: _deepseek_ai_dsh_forum_kb_forumKb_list_result$schema
			},
			sourceLocation: {
				"file": "packages/dsh-forum-kb/src/index.ts",
				"line": 249,
				"column": 9
			}
		},
		{
			id: "@deepseek-ai/dsh-forum-kb#forumKb/openRef",
			service: "forumKb",
			namespace: "forumKb",
			method: "openRef",
			invocation: { kind: "direct" },
			parameters: [{
				name: "req",
				wire: "req",
				source: "json",
				codec: {
					mode: "strict",
					typeSymbol: "@deepseek-ai/dsh-forum-kb#forumKb/openRef:req",
					create: _deepseek_ai_dsh_forum_kb_forumKb_openRef_parameter_0$schema
				}
			}],
			result: {
				mode: "strict",
				typeSymbol: "@deepseek-ai/dsh-forum-kb/types#OpenRefResult",
				create: _deepseek_ai_dsh_forum_kb_forumKb_openRef_result$schema
			},
			sourceLocation: {
				"file": "packages/dsh-forum-kb/src/index.ts",
				"line": 492,
				"column": 9
			}
		},
		{
			id: "@deepseek-ai/dsh-forum-kb#forumKb/pin",
			service: "forumKb",
			namespace: "forumKb",
			method: "pin",
			invocation: { kind: "direct" },
			parameters: [{
				name: "req",
				wire: "req",
				source: "json",
				codec: {
					mode: "strict",
					typeSymbol: "@deepseek-ai/dsh-forum-kb#forumKb/pin:req",
					create: _deepseek_ai_dsh_forum_kb_forumKb_pin_parameter_0$schema
				}
			}],
			result: {
				mode: "strict",
				typeSymbol: "@deepseek-ai/dsh-forum-kb/types#WriteResult",
				create: _deepseek_ai_dsh_forum_kb_forumKb_pin_result$schema
			},
			sourceLocation: {
				"file": "packages/dsh-forum-kb/src/index.ts",
				"line": 349,
				"column": 9
			}
		},
		{
			id: "@deepseek-ai/dsh-forum-kb#forumKb/post",
			service: "forumKb",
			namespace: "forumKb",
			method: "post",
			implementation: "createPost",
			invocation: { kind: "direct" },
			parameters: [{
				name: "req",
				wire: "req",
				source: "json",
				codec: {
					mode: "strict",
					typeSymbol: "@deepseek-ai/dsh-forum-kb#forumKb/post:req",
					create: _deepseek_ai_dsh_forum_kb_forumKb_post_parameter_0$schema
				}
			}],
			result: {
				mode: "strict",
				typeSymbol: "@deepseek-ai/dsh-forum-kb/types#WriteResult",
				create: _deepseek_ai_dsh_forum_kb_forumKb_post_result$schema
			},
			sourceLocation: {
				"file": "packages/dsh-forum-kb/src/index.ts",
				"line": 616,
				"column": 9
			}
		},
		{
			id: "@deepseek-ai/dsh-forum-kb#forumKb/read",
			service: "forumKb",
			namespace: "forumKb",
			method: "read",
			invocation: { kind: "direct" },
			parameters: [{
				name: "id",
				wire: "id",
				source: "json",
				codec: {
					mode: "strict",
					typeSymbol: "@deepseek-ai/dsh-forum-kb#forumKb/read:id",
					create: _deepseek_ai_dsh_forum_kb_forumKb_read_parameter_0$schema
				}
			}],
			result: {
				mode: "strict",
				typeSymbol: "@deepseek-ai/dsh-forum-kb#forumKb/read:result",
				create: _deepseek_ai_dsh_forum_kb_forumKb_read_result$schema
			},
			sourceLocation: {
				"file": "packages/dsh-forum-kb/src/index.ts",
				"line": 289,
				"column": 9
			}
		},
		{
			id: "@deepseek-ai/dsh-forum-kb#forumKb/refs",
			service: "forumKb",
			namespace: "forumKb",
			method: "refs",
			invocation: { kind: "direct" },
			parameters: [{
				name: "req",
				wire: "req",
				source: "json",
				codec: {
					mode: "strict",
					typeSymbol: "@deepseek-ai/dsh-forum-kb#forumKb/refs:req",
					create: _deepseek_ai_dsh_forum_kb_forumKb_refs_parameter_0$schema
				}
			}],
			result: {
				mode: "strict",
				typeSymbol: "@deepseek-ai/dsh-forum-kb/types#RefsView",
				create: _deepseek_ai_dsh_forum_kb_forumKb_refs_result$schema
			},
			sourceLocation: {
				"file": "packages/dsh-forum-kb/src/index.ts",
				"line": 358,
				"column": 9
			}
		},
		{
			id: "@deepseek-ai/dsh-forum-kb#forumKb/search",
			service: "forumKb",
			namespace: "forumKb",
			method: "search",
			invocation: { kind: "direct" },
			parameters: [{
				name: "req",
				wire: "req",
				source: "json",
				codec: {
					mode: "strict",
					typeSymbol: "@deepseek-ai/dsh-forum-kb#forumKb/search:req",
					create: _deepseek_ai_dsh_forum_kb_forumKb_search_parameter_0$schema
				}
			}],
			result: {
				mode: "strict",
				typeSymbol: "@deepseek-ai/dsh-forum-kb#forumKb/search:result",
				create: _deepseek_ai_dsh_forum_kb_forumKb_search_result$schema
			},
			sourceLocation: {
				"file": "packages/dsh-forum-kb/src/index.ts",
				"line": 311,
				"column": 9
			}
		},
		{
			id: "@deepseek-ai/dsh-forum-kb#forumKb/state",
			service: "forumKb",
			namespace: "forumKb",
			method: "state",
			implementation: "setState",
			invocation: { kind: "direct" },
			parameters: [{
				name: "req",
				wire: "req",
				source: "json",
				codec: {
					mode: "strict",
					typeSymbol: "@deepseek-ai/dsh-forum-kb#forumKb/state:req",
					create: _deepseek_ai_dsh_forum_kb_forumKb_state_parameter_0$schema
				}
			}],
			result: {
				mode: "strict",
				typeSymbol: "@deepseek-ai/dsh-forum-kb/types#WriteResult",
				create: _deepseek_ai_dsh_forum_kb_forumKb_state_result$schema
			},
			sourceLocation: {
				"file": "packages/dsh-forum-kb/src/index.ts",
				"line": 343,
				"column": 9
			}
		},
		{
			id: "@deepseek-ai/dsh-forum-kb#forumKb/toolIndex",
			service: "forumKb",
			namespace: "forumKb",
			method: "toolIndex",
			invocation: { kind: "direct" },
			parameters: [],
			result: {
				mode: "strict",
				typeSymbol: "@deepseek-ai/dsh-forum-kb#forumKb/toolIndex:result",
				create: _deepseek_ai_dsh_forum_kb_forumKb_toolIndex_result$schema
			},
			sourceLocation: {
				"file": "packages/dsh-forum-kb/src/index.ts",
				"line": 475,
				"column": 9
			}
		},
		{
			id: "@deepseek-ai/dsh-forum-kb#forumKb/view",
			service: "forumKb",
			namespace: "forumKb",
			method: "view",
			invocation: { kind: "direct" },
			parameters: [{
				name: "id",
				wire: "id",
				source: "json",
				codec: {
					mode: "strict",
					typeSymbol: "@deepseek-ai/dsh-forum-kb#forumKb/view:id",
					create: _deepseek_ai_dsh_forum_kb_forumKb_view_parameter_0$schema
				}
			}],
			result: {
				mode: "strict",
				typeSymbol: "@deepseek-ai/dsh-forum-kb/types#PostView",
				create: _deepseek_ai_dsh_forum_kb_forumKb_view_result$schema
			},
			sourceLocation: {
				"file": "packages/dsh-forum-kb/src/index.ts",
				"line": 299,
				"column": 9
			}
		}
	]
};
//#endregion
//#region ../../node_modules/.pnpm/marked@15.0.12/node_modules/marked/lib/marked.esm.js
/**
* marked v15.0.12 - a markdown parser
* Copyright (c) 2011-2025, Christopher Jeffrey. (MIT Licensed)
* https://github.com/markedjs/marked
*/
/**
* DO NOT EDIT THIS FILE
* The code in this file is generated from files in ./src/
*/
function _getDefaults() {
	return {
		async: false,
		breaks: false,
		extensions: null,
		gfm: true,
		hooks: null,
		pedantic: false,
		renderer: null,
		silent: false,
		tokenizer: null,
		walkTokens: null
	};
}
var _defaults = _getDefaults();
function changeDefaults(newDefaults) {
	_defaults = newDefaults;
}
var noopTest = { exec: () => null };
function edit(regex, opt = "") {
	let source = typeof regex === "string" ? regex : regex.source;
	const obj = {
		replace: (name, val) => {
			let valSource = typeof val === "string" ? val : val.source;
			valSource = valSource.replace(other.caret, "$1");
			source = source.replace(name, valSource);
			return obj;
		},
		getRegex: () => {
			return new RegExp(source, opt);
		}
	};
	return obj;
}
var other = {
	codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm,
	outputLinkReplace: /\\([\[\]])/g,
	indentCodeCompensation: /^(\s+)(?:```)/,
	beginningSpace: /^\s+/,
	endingHash: /#$/,
	startingSpaceChar: /^ /,
	endingSpaceChar: / $/,
	nonSpaceChar: /[^ ]/,
	newLineCharGlobal: /\n/g,
	tabCharGlobal: /\t/g,
	multipleSpaceGlobal: /\s+/g,
	blankLine: /^[ \t]*$/,
	doubleBlankLine: /\n[ \t]*\n[ \t]*$/,
	blockquoteStart: /^ {0,3}>/,
	blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g,
	blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm,
	listReplaceTabs: /^\t+/,
	listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g,
	listIsTask: /^\[[ xX]\] /,
	listReplaceTask: /^\[[ xX]\] +/,
	anyLine: /\n.*\n/,
	hrefBrackets: /^<(.*)>$/,
	tableDelimiter: /[:|]/,
	tableAlignChars: /^\||\| *$/g,
	tableRowBlankLine: /\n[ \t]*$/,
	tableAlignRight: /^ *-+: *$/,
	tableAlignCenter: /^ *:-+: *$/,
	tableAlignLeft: /^ *:-+ *$/,
	startATag: /^<a /i,
	endATag: /^<\/a>/i,
	startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i,
	endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i,
	startAngleBracket: /^</,
	endAngleBracket: />$/,
	pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/,
	unicodeAlphaNumeric: /[\p{L}\p{N}]/u,
	escapeTest: /[&<>"']/,
	escapeReplace: /[&<>"']/g,
	escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,
	escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,
	unescapeTest: /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/gi,
	caret: /(^|[^\[])\^/g,
	percentDecode: /%25/g,
	findPipe: /\|/g,
	splitPipe: / \|/,
	slashPipe: /\\\|/g,
	carriageReturn: /\r\n|\r/g,
	spaceLine: /^ +$/gm,
	notSpaceStart: /^\S*/,
	endingNewline: /\n$/,
	listItemRegex: (bull) => new RegExp(`^( {0,3}${bull})((?:[	 ][^\\n]*)?(?:\\n|$))`),
	nextBulletRegex: (indent) => new RegExp(`^ {0,${Math.min(3, indent - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),
	hrRegex: (indent) => new RegExp(`^ {0,${Math.min(3, indent - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),
	fencesBeginRegex: (indent) => new RegExp(`^ {0,${Math.min(3, indent - 1)}}(?:\`\`\`|~~~)`),
	headingBeginRegex: (indent) => new RegExp(`^ {0,${Math.min(3, indent - 1)}}#`),
	htmlBeginRegex: (indent) => new RegExp(`^ {0,${Math.min(3, indent - 1)}}<(?:[a-z].*>|!--)`, "i")
};
var newline = /^(?:[ \t]*(?:\n|$))+/;
var blockCode = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/;
var fences = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/;
var hr = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/;
var heading = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/;
var bullet = /(?:[*+-]|\d{1,9}[.)])/;
var lheadingCore = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/;
var lheading = edit(lheadingCore).replace(/bull/g, bullet).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex();
var lheadingGfm = edit(lheadingCore).replace(/bull/g, bullet).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex();
var _paragraph = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/;
var blockText = /^[^\n]+/;
var _blockLabel = /(?!\s*\])(?:\\.|[^\[\]\\])+/;
var def = edit(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", _blockLabel).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex();
var list = edit(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, bullet).getRegex();
var _tag = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul";
var _comment = /<!--(?:-?>|[\s\S]*?(?:-->|$))/;
var html$2 = edit("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", _comment).replace("tag", _tag).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex();
var paragraph = edit(_paragraph).replace("hr", hr).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", _tag).getRegex();
var blockNormal = {
	blockquote: edit(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", paragraph).getRegex(),
	code: blockCode,
	def,
	fences,
	heading,
	hr,
	html: html$2,
	lheading,
	list,
	newline,
	paragraph,
	table: noopTest,
	text: blockText
};
var gfmTable = edit("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", hr).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", _tag).getRegex();
var blockGfm = {
	...blockNormal,
	lheading: lheadingGfm,
	table: gfmTable,
	paragraph: edit(_paragraph).replace("hr", hr).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", gfmTable).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", _tag).getRegex()
};
var blockPedantic = {
	...blockNormal,
	html: edit(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", _comment).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),
	def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
	heading: /^(#{1,6})(.*)(?:\n+|$)/,
	fences: noopTest,
	lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
	paragraph: edit(_paragraph).replace("hr", hr).replace("heading", " *#{1,6} *[^\n]").replace("lheading", lheading).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex()
};
var escape = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/;
var inlineCode = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/;
var br = /^( {2,}|\\)\n(?!\s*$)/;
var inlineText = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/;
var _punctuation = /[\p{P}\p{S}]/u;
var _punctuationOrSpace = /[\s\p{P}\p{S}]/u;
var _notPunctuationOrSpace = /[^\s\p{P}\p{S}]/u;
var punctuation = edit(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, _punctuationOrSpace).getRegex();
var _punctuationGfmStrongEm = /(?!~)[\p{P}\p{S}]/u;
var _punctuationOrSpaceGfmStrongEm = /(?!~)[\s\p{P}\p{S}]/u;
var _notPunctuationOrSpaceGfmStrongEm = /(?:[^\s\p{P}\p{S}]|~)/u;
var blockSkip = /\[[^[\]]*?\]\((?:\\.|[^\\\(\)]|\((?:\\.|[^\\\(\)])*\))*\)|`[^`]*?`|<[^<>]*?>/g;
var emStrongLDelimCore = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/;
var emStrongLDelim = edit(emStrongLDelimCore, "u").replace(/punct/g, _punctuation).getRegex();
var emStrongLDelimGfm = edit(emStrongLDelimCore, "u").replace(/punct/g, _punctuationGfmStrongEm).getRegex();
var emStrongRDelimAstCore = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)";
var emStrongRDelimAst = edit(emStrongRDelimAstCore, "gu").replace(/notPunctSpace/g, _notPunctuationOrSpace).replace(/punctSpace/g, _punctuationOrSpace).replace(/punct/g, _punctuation).getRegex();
var emStrongRDelimAstGfm = edit(emStrongRDelimAstCore, "gu").replace(/notPunctSpace/g, _notPunctuationOrSpaceGfmStrongEm).replace(/punctSpace/g, _punctuationOrSpaceGfmStrongEm).replace(/punct/g, _punctuationGfmStrongEm).getRegex();
var emStrongRDelimUnd = edit("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, _notPunctuationOrSpace).replace(/punctSpace/g, _punctuationOrSpace).replace(/punct/g, _punctuation).getRegex();
var anyPunctuation = edit(/\\(punct)/, "gu").replace(/punct/g, _punctuation).getRegex();
var autolink = edit(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex();
var _inlineComment = edit(_comment).replace("(?:-->|$)", "-->").getRegex();
var tag = edit("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", _inlineComment).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex();
var _inlineLabel = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/;
var link = edit(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label", _inlineLabel).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex();
var reflink = edit(/^!?\[(label)\]\[(ref)\]/).replace("label", _inlineLabel).replace("ref", _blockLabel).getRegex();
var nolink = edit(/^!?\[(ref)\](?:\[\])?/).replace("ref", _blockLabel).getRegex();
var inlineNormal = {
	_backpedal: noopTest,
	anyPunctuation,
	autolink,
	blockSkip,
	br,
	code: inlineCode,
	del: noopTest,
	emStrongLDelim,
	emStrongRDelimAst,
	emStrongRDelimUnd,
	escape,
	link,
	nolink,
	punctuation,
	reflink,
	reflinkSearch: edit("reflink|nolink(?!\\()", "g").replace("reflink", reflink).replace("nolink", nolink).getRegex(),
	tag,
	text: inlineText,
	url: noopTest
};
var inlinePedantic = {
	...inlineNormal,
	link: edit(/^!?\[(label)\]\((.*?)\)/).replace("label", _inlineLabel).getRegex(),
	reflink: edit(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", _inlineLabel).getRegex()
};
var inlineGfm = {
	...inlineNormal,
	emStrongRDelimAst: emStrongRDelimAstGfm,
	emStrongLDelim: emStrongLDelimGfm,
	url: edit(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/, "i").replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),
	_backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
	del: /^(~~?)(?=[^\s~])((?:\\.|[^\\])*?(?:\\.|[^\s~\\]))\1(?=[^~]|$)/,
	text: /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/
};
var inlineBreaks = {
	...inlineGfm,
	br: edit(br).replace("{2,}", "*").getRegex(),
	text: edit(inlineGfm.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex()
};
var block = {
	normal: blockNormal,
	gfm: blockGfm,
	pedantic: blockPedantic
};
var inline = {
	normal: inlineNormal,
	gfm: inlineGfm,
	breaks: inlineBreaks,
	pedantic: inlinePedantic
};
var escapeReplacements = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;",
	"'": "&#39;"
};
var getEscapeReplacement = (ch) => escapeReplacements[ch];
function escape2(html2, encode) {
	if (encode) {
		if (other.escapeTest.test(html2)) return html2.replace(other.escapeReplace, getEscapeReplacement);
	} else if (other.escapeTestNoEncode.test(html2)) return html2.replace(other.escapeReplaceNoEncode, getEscapeReplacement);
	return html2;
}
function cleanUrl(href) {
	try {
		href = encodeURI(href).replace(other.percentDecode, "%");
	} catch {
		return null;
	}
	return href;
}
function splitCells(tableRow, count) {
	const cells = tableRow.replace(other.findPipe, (match, offset, str) => {
		let escaped = false;
		let curr = offset;
		while (--curr >= 0 && str[curr] === "\\") escaped = !escaped;
		if (escaped) return "|";
		else return " |";
	}).split(other.splitPipe);
	let i = 0;
	if (!cells[0].trim()) cells.shift();
	if (cells.length > 0 && !cells.at(-1)?.trim()) cells.pop();
	if (count) {
		if (cells.length > count) cells.splice(count);
		else while (cells.length < count) cells.push("");
	}
	for (; i < cells.length; i++) cells[i] = cells[i].trim().replace(other.slashPipe, "|");
	return cells;
}
function rtrim(str, c, invert) {
	const l = str.length;
	if (l === 0) return "";
	let suffLen = 0;
	while (suffLen < l) {
		const currChar = str.charAt(l - suffLen - 1);
		if (currChar === c && !invert) suffLen++;
		else if (currChar !== c && invert) suffLen++;
		else break;
	}
	return str.slice(0, l - suffLen);
}
function findClosingBracket(str, b) {
	if (str.indexOf(b[1]) === -1) return -1;
	let level = 0;
	for (let i = 0; i < str.length; i++) if (str[i] === "\\") i++;
	else if (str[i] === b[0]) level++;
	else if (str[i] === b[1]) {
		level--;
		if (level < 0) return i;
	}
	if (level > 0) return -2;
	return -1;
}
function outputLink(cap, link2, raw, lexer2, rules) {
	const href = link2.href;
	const title = link2.title || null;
	const text = cap[1].replace(rules.other.outputLinkReplace, "$1");
	lexer2.state.inLink = true;
	const token = {
		type: cap[0].charAt(0) === "!" ? "image" : "link",
		raw,
		href,
		title,
		text,
		tokens: lexer2.inlineTokens(text)
	};
	lexer2.state.inLink = false;
	return token;
}
function indentCodeCompensation(raw, text, rules) {
	const matchIndentToCode = raw.match(rules.other.indentCodeCompensation);
	if (matchIndentToCode === null) return text;
	const indentToCode = matchIndentToCode[1];
	return text.split("\n").map((node) => {
		const matchIndentInNode = node.match(rules.other.beginningSpace);
		if (matchIndentInNode === null) return node;
		const [indentInNode] = matchIndentInNode;
		if (indentInNode.length >= indentToCode.length) return node.slice(indentToCode.length);
		return node;
	}).join("\n");
}
var _Tokenizer = class {
	options;
	rules;
	lexer;
	constructor(options2) {
		this.options = options2 || _defaults;
	}
	space(src) {
		const cap = this.rules.block.newline.exec(src);
		if (cap && cap[0].length > 0) return {
			type: "space",
			raw: cap[0]
		};
	}
	code(src) {
		const cap = this.rules.block.code.exec(src);
		if (cap) {
			const text = cap[0].replace(this.rules.other.codeRemoveIndent, "");
			return {
				type: "code",
				raw: cap[0],
				codeBlockStyle: "indented",
				text: !this.options.pedantic ? rtrim(text, "\n") : text
			};
		}
	}
	fences(src) {
		const cap = this.rules.block.fences.exec(src);
		if (cap) {
			const raw = cap[0];
			const text = indentCodeCompensation(raw, cap[3] || "", this.rules);
			return {
				type: "code",
				raw,
				lang: cap[2] ? cap[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : cap[2],
				text
			};
		}
	}
	heading(src) {
		const cap = this.rules.block.heading.exec(src);
		if (cap) {
			let text = cap[2].trim();
			if (this.rules.other.endingHash.test(text)) {
				const trimmed = rtrim(text, "#");
				if (this.options.pedantic) text = trimmed.trim();
				else if (!trimmed || this.rules.other.endingSpaceChar.test(trimmed)) text = trimmed.trim();
			}
			return {
				type: "heading",
				raw: cap[0],
				depth: cap[1].length,
				text,
				tokens: this.lexer.inline(text)
			};
		}
	}
	hr(src) {
		const cap = this.rules.block.hr.exec(src);
		if (cap) return {
			type: "hr",
			raw: rtrim(cap[0], "\n")
		};
	}
	blockquote(src) {
		const cap = this.rules.block.blockquote.exec(src);
		if (cap) {
			let lines = rtrim(cap[0], "\n").split("\n");
			let raw = "";
			let text = "";
			const tokens = [];
			while (lines.length > 0) {
				let inBlockquote = false;
				const currentLines = [];
				let i;
				for (i = 0; i < lines.length; i++) if (this.rules.other.blockquoteStart.test(lines[i])) {
					currentLines.push(lines[i]);
					inBlockquote = true;
				} else if (!inBlockquote) currentLines.push(lines[i]);
				else break;
				lines = lines.slice(i);
				const currentRaw = currentLines.join("\n");
				const currentText = currentRaw.replace(this.rules.other.blockquoteSetextReplace, "\n    $1").replace(this.rules.other.blockquoteSetextReplace2, "");
				raw = raw ? `${raw}
${currentRaw}` : currentRaw;
				text = text ? `${text}
${currentText}` : currentText;
				const top = this.lexer.state.top;
				this.lexer.state.top = true;
				this.lexer.blockTokens(currentText, tokens, true);
				this.lexer.state.top = top;
				if (lines.length === 0) break;
				const lastToken = tokens.at(-1);
				if (lastToken?.type === "code") break;
				else if (lastToken?.type === "blockquote") {
					const oldToken = lastToken;
					const newText = oldToken.raw + "\n" + lines.join("\n");
					const newToken = this.blockquote(newText);
					tokens[tokens.length - 1] = newToken;
					raw = raw.substring(0, raw.length - oldToken.raw.length) + newToken.raw;
					text = text.substring(0, text.length - oldToken.text.length) + newToken.text;
					break;
				} else if (lastToken?.type === "list") {
					const oldToken = lastToken;
					const newText = oldToken.raw + "\n" + lines.join("\n");
					const newToken = this.list(newText);
					tokens[tokens.length - 1] = newToken;
					raw = raw.substring(0, raw.length - lastToken.raw.length) + newToken.raw;
					text = text.substring(0, text.length - oldToken.raw.length) + newToken.raw;
					lines = newText.substring(tokens.at(-1).raw.length).split("\n");
					continue;
				}
			}
			return {
				type: "blockquote",
				raw,
				tokens,
				text
			};
		}
	}
	list(src) {
		let cap = this.rules.block.list.exec(src);
		if (cap) {
			let bull = cap[1].trim();
			const isordered = bull.length > 1;
			const list2 = {
				type: "list",
				raw: "",
				ordered: isordered,
				start: isordered ? +bull.slice(0, -1) : "",
				loose: false,
				items: []
			};
			bull = isordered ? `\\d{1,9}\\${bull.slice(-1)}` : `\\${bull}`;
			if (this.options.pedantic) bull = isordered ? bull : "[*+-]";
			const itemRegex = this.rules.other.listItemRegex(bull);
			let endsWithBlankLine = false;
			while (src) {
				let endEarly = false;
				let raw = "";
				let itemContents = "";
				if (!(cap = itemRegex.exec(src))) break;
				if (this.rules.block.hr.test(src)) break;
				raw = cap[0];
				src = src.substring(raw.length);
				let line = cap[2].split("\n", 1)[0].replace(this.rules.other.listReplaceTabs, (t) => " ".repeat(3 * t.length));
				let nextLine = src.split("\n", 1)[0];
				let blankLine = !line.trim();
				let indent = 0;
				if (this.options.pedantic) {
					indent = 2;
					itemContents = line.trimStart();
				} else if (blankLine) indent = cap[1].length + 1;
				else {
					indent = cap[2].search(this.rules.other.nonSpaceChar);
					indent = indent > 4 ? 1 : indent;
					itemContents = line.slice(indent);
					indent += cap[1].length;
				}
				if (blankLine && this.rules.other.blankLine.test(nextLine)) {
					raw += nextLine + "\n";
					src = src.substring(nextLine.length + 1);
					endEarly = true;
				}
				if (!endEarly) {
					const nextBulletRegex = this.rules.other.nextBulletRegex(indent);
					const hrRegex = this.rules.other.hrRegex(indent);
					const fencesBeginRegex = this.rules.other.fencesBeginRegex(indent);
					const headingBeginRegex = this.rules.other.headingBeginRegex(indent);
					const htmlBeginRegex = this.rules.other.htmlBeginRegex(indent);
					while (src) {
						const rawLine = src.split("\n", 1)[0];
						let nextLineWithoutTabs;
						nextLine = rawLine;
						if (this.options.pedantic) {
							nextLine = nextLine.replace(this.rules.other.listReplaceNesting, "  ");
							nextLineWithoutTabs = nextLine;
						} else nextLineWithoutTabs = nextLine.replace(this.rules.other.tabCharGlobal, "    ");
						if (fencesBeginRegex.test(nextLine)) break;
						if (headingBeginRegex.test(nextLine)) break;
						if (htmlBeginRegex.test(nextLine)) break;
						if (nextBulletRegex.test(nextLine)) break;
						if (hrRegex.test(nextLine)) break;
						if (nextLineWithoutTabs.search(this.rules.other.nonSpaceChar) >= indent || !nextLine.trim()) itemContents += "\n" + nextLineWithoutTabs.slice(indent);
						else {
							if (blankLine) break;
							if (line.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4) break;
							if (fencesBeginRegex.test(line)) break;
							if (headingBeginRegex.test(line)) break;
							if (hrRegex.test(line)) break;
							itemContents += "\n" + nextLine;
						}
						if (!blankLine && !nextLine.trim()) blankLine = true;
						raw += rawLine + "\n";
						src = src.substring(rawLine.length + 1);
						line = nextLineWithoutTabs.slice(indent);
					}
				}
				if (!list2.loose) {
					if (endsWithBlankLine) list2.loose = true;
					else if (this.rules.other.doubleBlankLine.test(raw)) endsWithBlankLine = true;
				}
				let istask = null;
				let ischecked;
				if (this.options.gfm) {
					istask = this.rules.other.listIsTask.exec(itemContents);
					if (istask) {
						ischecked = istask[0] !== "[ ] ";
						itemContents = itemContents.replace(this.rules.other.listReplaceTask, "");
					}
				}
				list2.items.push({
					type: "list_item",
					raw,
					task: !!istask,
					checked: ischecked,
					loose: false,
					text: itemContents,
					tokens: []
				});
				list2.raw += raw;
			}
			const lastItem = list2.items.at(-1);
			if (lastItem) {
				lastItem.raw = lastItem.raw.trimEnd();
				lastItem.text = lastItem.text.trimEnd();
			} else return;
			list2.raw = list2.raw.trimEnd();
			for (let i = 0; i < list2.items.length; i++) {
				this.lexer.state.top = false;
				list2.items[i].tokens = this.lexer.blockTokens(list2.items[i].text, []);
				if (!list2.loose) {
					const spacers = list2.items[i].tokens.filter((t) => t.type === "space");
					list2.loose = spacers.length > 0 && spacers.some((t) => this.rules.other.anyLine.test(t.raw));
				}
			}
			if (list2.loose) for (let i = 0; i < list2.items.length; i++) list2.items[i].loose = true;
			return list2;
		}
	}
	html(src) {
		const cap = this.rules.block.html.exec(src);
		if (cap) return {
			type: "html",
			block: true,
			raw: cap[0],
			pre: cap[1] === "pre" || cap[1] === "script" || cap[1] === "style",
			text: cap[0]
		};
	}
	def(src) {
		const cap = this.rules.block.def.exec(src);
		if (cap) {
			const tag2 = cap[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal, " ");
			const href = cap[2] ? cap[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "";
			const title = cap[3] ? cap[3].substring(1, cap[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : cap[3];
			return {
				type: "def",
				tag: tag2,
				raw: cap[0],
				href,
				title
			};
		}
	}
	table(src) {
		const cap = this.rules.block.table.exec(src);
		if (!cap) return;
		if (!this.rules.other.tableDelimiter.test(cap[2])) return;
		const headers = splitCells(cap[1]);
		const aligns = cap[2].replace(this.rules.other.tableAlignChars, "").split("|");
		const rows = cap[3]?.trim() ? cap[3].replace(this.rules.other.tableRowBlankLine, "").split("\n") : [];
		const item = {
			type: "table",
			raw: cap[0],
			header: [],
			align: [],
			rows: []
		};
		if (headers.length !== aligns.length) return;
		for (const align of aligns) if (this.rules.other.tableAlignRight.test(align)) item.align.push("right");
		else if (this.rules.other.tableAlignCenter.test(align)) item.align.push("center");
		else if (this.rules.other.tableAlignLeft.test(align)) item.align.push("left");
		else item.align.push(null);
		for (let i = 0; i < headers.length; i++) item.header.push({
			text: headers[i],
			tokens: this.lexer.inline(headers[i]),
			header: true,
			align: item.align[i]
		});
		for (const row of rows) item.rows.push(splitCells(row, item.header.length).map((cell, i) => {
			return {
				text: cell,
				tokens: this.lexer.inline(cell),
				header: false,
				align: item.align[i]
			};
		}));
		return item;
	}
	lheading(src) {
		const cap = this.rules.block.lheading.exec(src);
		if (cap) return {
			type: "heading",
			raw: cap[0],
			depth: cap[2].charAt(0) === "=" ? 1 : 2,
			text: cap[1],
			tokens: this.lexer.inline(cap[1])
		};
	}
	paragraph(src) {
		const cap = this.rules.block.paragraph.exec(src);
		if (cap) {
			const text = cap[1].charAt(cap[1].length - 1) === "\n" ? cap[1].slice(0, -1) : cap[1];
			return {
				type: "paragraph",
				raw: cap[0],
				text,
				tokens: this.lexer.inline(text)
			};
		}
	}
	text(src) {
		const cap = this.rules.block.text.exec(src);
		if (cap) return {
			type: "text",
			raw: cap[0],
			text: cap[0],
			tokens: this.lexer.inline(cap[0])
		};
	}
	escape(src) {
		const cap = this.rules.inline.escape.exec(src);
		if (cap) return {
			type: "escape",
			raw: cap[0],
			text: cap[1]
		};
	}
	tag(src) {
		const cap = this.rules.inline.tag.exec(src);
		if (cap) {
			if (!this.lexer.state.inLink && this.rules.other.startATag.test(cap[0])) this.lexer.state.inLink = true;
			else if (this.lexer.state.inLink && this.rules.other.endATag.test(cap[0])) this.lexer.state.inLink = false;
			if (!this.lexer.state.inRawBlock && this.rules.other.startPreScriptTag.test(cap[0])) this.lexer.state.inRawBlock = true;
			else if (this.lexer.state.inRawBlock && this.rules.other.endPreScriptTag.test(cap[0])) this.lexer.state.inRawBlock = false;
			return {
				type: "html",
				raw: cap[0],
				inLink: this.lexer.state.inLink,
				inRawBlock: this.lexer.state.inRawBlock,
				block: false,
				text: cap[0]
			};
		}
	}
	link(src) {
		const cap = this.rules.inline.link.exec(src);
		if (cap) {
			const trimmedUrl = cap[2].trim();
			if (!this.options.pedantic && this.rules.other.startAngleBracket.test(trimmedUrl)) {
				if (!this.rules.other.endAngleBracket.test(trimmedUrl)) return;
				const rtrimSlash = rtrim(trimmedUrl.slice(0, -1), "\\");
				if ((trimmedUrl.length - rtrimSlash.length) % 2 === 0) return;
			} else {
				const lastParenIndex = findClosingBracket(cap[2], "()");
				if (lastParenIndex === -2) return;
				if (lastParenIndex > -1) {
					const linkLen = (cap[0].indexOf("!") === 0 ? 5 : 4) + cap[1].length + lastParenIndex;
					cap[2] = cap[2].substring(0, lastParenIndex);
					cap[0] = cap[0].substring(0, linkLen).trim();
					cap[3] = "";
				}
			}
			let href = cap[2];
			let title = "";
			if (this.options.pedantic) {
				const link2 = this.rules.other.pedanticHrefTitle.exec(href);
				if (link2) {
					href = link2[1];
					title = link2[3];
				}
			} else title = cap[3] ? cap[3].slice(1, -1) : "";
			href = href.trim();
			if (this.rules.other.startAngleBracket.test(href)) {
				if (this.options.pedantic && !this.rules.other.endAngleBracket.test(trimmedUrl)) href = href.slice(1);
				else href = href.slice(1, -1);
			}
			return outputLink(cap, {
				href: href ? href.replace(this.rules.inline.anyPunctuation, "$1") : href,
				title: title ? title.replace(this.rules.inline.anyPunctuation, "$1") : title
			}, cap[0], this.lexer, this.rules);
		}
	}
	reflink(src, links) {
		let cap;
		if ((cap = this.rules.inline.reflink.exec(src)) || (cap = this.rules.inline.nolink.exec(src))) {
			const link2 = links[(cap[2] || cap[1]).replace(this.rules.other.multipleSpaceGlobal, " ").toLowerCase()];
			if (!link2) {
				const text = cap[0].charAt(0);
				return {
					type: "text",
					raw: text,
					text
				};
			}
			return outputLink(cap, link2, cap[0], this.lexer, this.rules);
		}
	}
	emStrong(src, maskedSrc, prevChar = "") {
		let match = this.rules.inline.emStrongLDelim.exec(src);
		if (!match) return;
		if (match[3] && prevChar.match(this.rules.other.unicodeAlphaNumeric)) return;
		if (!(match[1] || match[2] || "") || !prevChar || this.rules.inline.punctuation.exec(prevChar)) {
			const lLength = [...match[0]].length - 1;
			let rDelim, rLength, delimTotal = lLength, midDelimTotal = 0;
			const endReg = match[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
			endReg.lastIndex = 0;
			maskedSrc = maskedSrc.slice(-1 * src.length + lLength);
			while ((match = endReg.exec(maskedSrc)) != null) {
				rDelim = match[1] || match[2] || match[3] || match[4] || match[5] || match[6];
				if (!rDelim) continue;
				rLength = [...rDelim].length;
				if (match[3] || match[4]) {
					delimTotal += rLength;
					continue;
				} else if (match[5] || match[6]) {
					if (lLength % 3 && !((lLength + rLength) % 3)) {
						midDelimTotal += rLength;
						continue;
					}
				}
				delimTotal -= rLength;
				if (delimTotal > 0) continue;
				rLength = Math.min(rLength, rLength + delimTotal + midDelimTotal);
				const lastCharLength = [...match[0]][0].length;
				const raw = src.slice(0, lLength + match.index + lastCharLength + rLength);
				if (Math.min(lLength, rLength) % 2) {
					const text2 = raw.slice(1, -1);
					return {
						type: "em",
						raw,
						text: text2,
						tokens: this.lexer.inlineTokens(text2)
					};
				}
				const text = raw.slice(2, -2);
				return {
					type: "strong",
					raw,
					text,
					tokens: this.lexer.inlineTokens(text)
				};
			}
		}
	}
	codespan(src) {
		const cap = this.rules.inline.code.exec(src);
		if (cap) {
			let text = cap[2].replace(this.rules.other.newLineCharGlobal, " ");
			const hasNonSpaceChars = this.rules.other.nonSpaceChar.test(text);
			const hasSpaceCharsOnBothEnds = this.rules.other.startingSpaceChar.test(text) && this.rules.other.endingSpaceChar.test(text);
			if (hasNonSpaceChars && hasSpaceCharsOnBothEnds) text = text.substring(1, text.length - 1);
			return {
				type: "codespan",
				raw: cap[0],
				text
			};
		}
	}
	br(src) {
		const cap = this.rules.inline.br.exec(src);
		if (cap) return {
			type: "br",
			raw: cap[0]
		};
	}
	del(src) {
		const cap = this.rules.inline.del.exec(src);
		if (cap) return {
			type: "del",
			raw: cap[0],
			text: cap[2],
			tokens: this.lexer.inlineTokens(cap[2])
		};
	}
	autolink(src) {
		const cap = this.rules.inline.autolink.exec(src);
		if (cap) {
			let text, href;
			if (cap[2] === "@") {
				text = cap[1];
				href = "mailto:" + text;
			} else {
				text = cap[1];
				href = text;
			}
			return {
				type: "link",
				raw: cap[0],
				text,
				href,
				tokens: [{
					type: "text",
					raw: text,
					text
				}]
			};
		}
	}
	url(src) {
		let cap;
		if (cap = this.rules.inline.url.exec(src)) {
			let text, href;
			if (cap[2] === "@") {
				text = cap[0];
				href = "mailto:" + text;
			} else {
				let prevCapZero;
				do {
					prevCapZero = cap[0];
					cap[0] = this.rules.inline._backpedal.exec(cap[0])?.[0] ?? "";
				} while (prevCapZero !== cap[0]);
				text = cap[0];
				if (cap[1] === "www.") href = "http://" + cap[0];
				else href = cap[0];
			}
			return {
				type: "link",
				raw: cap[0],
				text,
				href,
				tokens: [{
					type: "text",
					raw: text,
					text
				}]
			};
		}
	}
	inlineText(src) {
		const cap = this.rules.inline.text.exec(src);
		if (cap) {
			const escaped = this.lexer.state.inRawBlock;
			return {
				type: "text",
				raw: cap[0],
				text: cap[0],
				escaped
			};
		}
	}
};
var _Lexer = class __Lexer {
	tokens;
	options;
	state;
	tokenizer;
	inlineQueue;
	constructor(options2) {
		this.tokens = [];
		this.tokens.links = /* @__PURE__ */ Object.create(null);
		this.options = options2 || _defaults;
		this.options.tokenizer = this.options.tokenizer || new _Tokenizer();
		this.tokenizer = this.options.tokenizer;
		this.tokenizer.options = this.options;
		this.tokenizer.lexer = this;
		this.inlineQueue = [];
		this.state = {
			inLink: false,
			inRawBlock: false,
			top: true
		};
		const rules = {
			other,
			block: block.normal,
			inline: inline.normal
		};
		if (this.options.pedantic) {
			rules.block = block.pedantic;
			rules.inline = inline.pedantic;
		} else if (this.options.gfm) {
			rules.block = block.gfm;
			if (this.options.breaks) rules.inline = inline.breaks;
			else rules.inline = inline.gfm;
		}
		this.tokenizer.rules = rules;
	}
	/**
	* Expose Rules
	*/
	static get rules() {
		return {
			block,
			inline
		};
	}
	/**
	* Static Lex Method
	*/
	static lex(src, options2) {
		return new __Lexer(options2).lex(src);
	}
	/**
	* Static Lex Inline Method
	*/
	static lexInline(src, options2) {
		return new __Lexer(options2).inlineTokens(src);
	}
	/**
	* Preprocessing
	*/
	lex(src) {
		src = src.replace(other.carriageReturn, "\n");
		this.blockTokens(src, this.tokens);
		for (let i = 0; i < this.inlineQueue.length; i++) {
			const next = this.inlineQueue[i];
			this.inlineTokens(next.src, next.tokens);
		}
		this.inlineQueue = [];
		return this.tokens;
	}
	blockTokens(src, tokens = [], lastParagraphClipped = false) {
		if (this.options.pedantic) src = src.replace(other.tabCharGlobal, "    ").replace(other.spaceLine, "");
		while (src) {
			let token;
			if (this.options.extensions?.block?.some((extTokenizer) => {
				if (token = extTokenizer.call({ lexer: this }, src, tokens)) {
					src = src.substring(token.raw.length);
					tokens.push(token);
					return true;
				}
				return false;
			})) continue;
			if (token = this.tokenizer.space(src)) {
				src = src.substring(token.raw.length);
				const lastToken = tokens.at(-1);
				if (token.raw.length === 1 && lastToken !== void 0) lastToken.raw += "\n";
				else tokens.push(token);
				continue;
			}
			if (token = this.tokenizer.code(src)) {
				src = src.substring(token.raw.length);
				const lastToken = tokens.at(-1);
				if (lastToken?.type === "paragraph" || lastToken?.type === "text") {
					lastToken.raw += "\n" + token.raw;
					lastToken.text += "\n" + token.text;
					this.inlineQueue.at(-1).src = lastToken.text;
				} else tokens.push(token);
				continue;
			}
			if (token = this.tokenizer.fences(src)) {
				src = src.substring(token.raw.length);
				tokens.push(token);
				continue;
			}
			if (token = this.tokenizer.heading(src)) {
				src = src.substring(token.raw.length);
				tokens.push(token);
				continue;
			}
			if (token = this.tokenizer.hr(src)) {
				src = src.substring(token.raw.length);
				tokens.push(token);
				continue;
			}
			if (token = this.tokenizer.blockquote(src)) {
				src = src.substring(token.raw.length);
				tokens.push(token);
				continue;
			}
			if (token = this.tokenizer.list(src)) {
				src = src.substring(token.raw.length);
				tokens.push(token);
				continue;
			}
			if (token = this.tokenizer.html(src)) {
				src = src.substring(token.raw.length);
				tokens.push(token);
				continue;
			}
			if (token = this.tokenizer.def(src)) {
				src = src.substring(token.raw.length);
				const lastToken = tokens.at(-1);
				if (lastToken?.type === "paragraph" || lastToken?.type === "text") {
					lastToken.raw += "\n" + token.raw;
					lastToken.text += "\n" + token.raw;
					this.inlineQueue.at(-1).src = lastToken.text;
				} else if (!this.tokens.links[token.tag]) this.tokens.links[token.tag] = {
					href: token.href,
					title: token.title
				};
				continue;
			}
			if (token = this.tokenizer.table(src)) {
				src = src.substring(token.raw.length);
				tokens.push(token);
				continue;
			}
			if (token = this.tokenizer.lheading(src)) {
				src = src.substring(token.raw.length);
				tokens.push(token);
				continue;
			}
			let cutSrc = src;
			if (this.options.extensions?.startBlock) {
				let startIndex = Infinity;
				const tempSrc = src.slice(1);
				let tempStart;
				this.options.extensions.startBlock.forEach((getStartIndex) => {
					tempStart = getStartIndex.call({ lexer: this }, tempSrc);
					if (typeof tempStart === "number" && tempStart >= 0) startIndex = Math.min(startIndex, tempStart);
				});
				if (startIndex < Infinity && startIndex >= 0) cutSrc = src.substring(0, startIndex + 1);
			}
			if (this.state.top && (token = this.tokenizer.paragraph(cutSrc))) {
				const lastToken = tokens.at(-1);
				if (lastParagraphClipped && lastToken?.type === "paragraph") {
					lastToken.raw += "\n" + token.raw;
					lastToken.text += "\n" + token.text;
					this.inlineQueue.pop();
					this.inlineQueue.at(-1).src = lastToken.text;
				} else tokens.push(token);
				lastParagraphClipped = cutSrc.length !== src.length;
				src = src.substring(token.raw.length);
				continue;
			}
			if (token = this.tokenizer.text(src)) {
				src = src.substring(token.raw.length);
				const lastToken = tokens.at(-1);
				if (lastToken?.type === "text") {
					lastToken.raw += "\n" + token.raw;
					lastToken.text += "\n" + token.text;
					this.inlineQueue.pop();
					this.inlineQueue.at(-1).src = lastToken.text;
				} else tokens.push(token);
				continue;
			}
			if (src) {
				const errMsg = "Infinite loop on byte: " + src.charCodeAt(0);
				if (this.options.silent) {
					console.error(errMsg);
					break;
				} else throw new Error(errMsg);
			}
		}
		this.state.top = true;
		return tokens;
	}
	inline(src, tokens = []) {
		this.inlineQueue.push({
			src,
			tokens
		});
		return tokens;
	}
	/**
	* Lexing/Compiling
	*/
	inlineTokens(src, tokens = []) {
		let maskedSrc = src;
		let match = null;
		if (this.tokens.links) {
			const links = Object.keys(this.tokens.links);
			if (links.length > 0) {
				while ((match = this.tokenizer.rules.inline.reflinkSearch.exec(maskedSrc)) != null) if (links.includes(match[0].slice(match[0].lastIndexOf("[") + 1, -1))) maskedSrc = maskedSrc.slice(0, match.index) + "[" + "a".repeat(match[0].length - 2) + "]" + maskedSrc.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex);
			}
		}
		while ((match = this.tokenizer.rules.inline.anyPunctuation.exec(maskedSrc)) != null) maskedSrc = maskedSrc.slice(0, match.index) + "++" + maskedSrc.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
		while ((match = this.tokenizer.rules.inline.blockSkip.exec(maskedSrc)) != null) maskedSrc = maskedSrc.slice(0, match.index) + "[" + "a".repeat(match[0].length - 2) + "]" + maskedSrc.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
		let keepPrevChar = false;
		let prevChar = "";
		while (src) {
			if (!keepPrevChar) prevChar = "";
			keepPrevChar = false;
			let token;
			if (this.options.extensions?.inline?.some((extTokenizer) => {
				if (token = extTokenizer.call({ lexer: this }, src, tokens)) {
					src = src.substring(token.raw.length);
					tokens.push(token);
					return true;
				}
				return false;
			})) continue;
			if (token = this.tokenizer.escape(src)) {
				src = src.substring(token.raw.length);
				tokens.push(token);
				continue;
			}
			if (token = this.tokenizer.tag(src)) {
				src = src.substring(token.raw.length);
				tokens.push(token);
				continue;
			}
			if (token = this.tokenizer.link(src)) {
				src = src.substring(token.raw.length);
				tokens.push(token);
				continue;
			}
			if (token = this.tokenizer.reflink(src, this.tokens.links)) {
				src = src.substring(token.raw.length);
				const lastToken = tokens.at(-1);
				if (token.type === "text" && lastToken?.type === "text") {
					lastToken.raw += token.raw;
					lastToken.text += token.text;
				} else tokens.push(token);
				continue;
			}
			if (token = this.tokenizer.emStrong(src, maskedSrc, prevChar)) {
				src = src.substring(token.raw.length);
				tokens.push(token);
				continue;
			}
			if (token = this.tokenizer.codespan(src)) {
				src = src.substring(token.raw.length);
				tokens.push(token);
				continue;
			}
			if (token = this.tokenizer.br(src)) {
				src = src.substring(token.raw.length);
				tokens.push(token);
				continue;
			}
			if (token = this.tokenizer.del(src)) {
				src = src.substring(token.raw.length);
				tokens.push(token);
				continue;
			}
			if (token = this.tokenizer.autolink(src)) {
				src = src.substring(token.raw.length);
				tokens.push(token);
				continue;
			}
			if (!this.state.inLink && (token = this.tokenizer.url(src))) {
				src = src.substring(token.raw.length);
				tokens.push(token);
				continue;
			}
			let cutSrc = src;
			if (this.options.extensions?.startInline) {
				let startIndex = Infinity;
				const tempSrc = src.slice(1);
				let tempStart;
				this.options.extensions.startInline.forEach((getStartIndex) => {
					tempStart = getStartIndex.call({ lexer: this }, tempSrc);
					if (typeof tempStart === "number" && tempStart >= 0) startIndex = Math.min(startIndex, tempStart);
				});
				if (startIndex < Infinity && startIndex >= 0) cutSrc = src.substring(0, startIndex + 1);
			}
			if (token = this.tokenizer.inlineText(cutSrc)) {
				src = src.substring(token.raw.length);
				if (token.raw.slice(-1) !== "_") prevChar = token.raw.slice(-1);
				keepPrevChar = true;
				const lastToken = tokens.at(-1);
				if (lastToken?.type === "text") {
					lastToken.raw += token.raw;
					lastToken.text += token.text;
				} else tokens.push(token);
				continue;
			}
			if (src) {
				const errMsg = "Infinite loop on byte: " + src.charCodeAt(0);
				if (this.options.silent) {
					console.error(errMsg);
					break;
				} else throw new Error(errMsg);
			}
		}
		return tokens;
	}
};
var _Renderer = class {
	options;
	parser;
	constructor(options2) {
		this.options = options2 || _defaults;
	}
	space(token) {
		return "";
	}
	code({ text, lang, escaped }) {
		const langString = (lang || "").match(other.notSpaceStart)?.[0];
		const code = text.replace(other.endingNewline, "") + "\n";
		if (!langString) return "<pre><code>" + (escaped ? code : escape2(code, true)) + "</code></pre>\n";
		return "<pre><code class=\"language-" + escape2(langString) + "\">" + (escaped ? code : escape2(code, true)) + "</code></pre>\n";
	}
	blockquote({ tokens }) {
		return `<blockquote>
${this.parser.parse(tokens)}</blockquote>
`;
	}
	html({ text }) {
		return text;
	}
	heading({ tokens, depth }) {
		return `<h${depth}>${this.parser.parseInline(tokens)}</h${depth}>
`;
	}
	hr(token) {
		return "<hr>\n";
	}
	list(token) {
		const ordered = token.ordered;
		const start = token.start;
		let body = "";
		for (let j = 0; j < token.items.length; j++) {
			const item = token.items[j];
			body += this.listitem(item);
		}
		const type = ordered ? "ol" : "ul";
		const startAttr = ordered && start !== 1 ? " start=\"" + start + "\"" : "";
		return "<" + type + startAttr + ">\n" + body + "</" + type + ">\n";
	}
	listitem(item) {
		let itemBody = "";
		if (item.task) {
			const checkbox = this.checkbox({ checked: !!item.checked });
			if (item.loose) {
				if (item.tokens[0]?.type === "paragraph") {
					item.tokens[0].text = checkbox + " " + item.tokens[0].text;
					if (item.tokens[0].tokens && item.tokens[0].tokens.length > 0 && item.tokens[0].tokens[0].type === "text") {
						item.tokens[0].tokens[0].text = checkbox + " " + escape2(item.tokens[0].tokens[0].text);
						item.tokens[0].tokens[0].escaped = true;
					}
				} else item.tokens.unshift({
					type: "text",
					raw: checkbox + " ",
					text: checkbox + " ",
					escaped: true
				});
			} else itemBody += checkbox + " ";
		}
		itemBody += this.parser.parse(item.tokens, !!item.loose);
		return `<li>${itemBody}</li>
`;
	}
	checkbox({ checked }) {
		return "<input " + (checked ? "checked=\"\" " : "") + "disabled=\"\" type=\"checkbox\">";
	}
	paragraph({ tokens }) {
		return `<p>${this.parser.parseInline(tokens)}</p>
`;
	}
	table(token) {
		let header = "";
		let cell = "";
		for (let j = 0; j < token.header.length; j++) cell += this.tablecell(token.header[j]);
		header += this.tablerow({ text: cell });
		let body = "";
		for (let j = 0; j < token.rows.length; j++) {
			const row = token.rows[j];
			cell = "";
			for (let k = 0; k < row.length; k++) cell += this.tablecell(row[k]);
			body += this.tablerow({ text: cell });
		}
		if (body) body = `<tbody>${body}</tbody>`;
		return "<table>\n<thead>\n" + header + "</thead>\n" + body + "</table>\n";
	}
	tablerow({ text }) {
		return `<tr>
${text}</tr>
`;
	}
	tablecell(token) {
		const content = this.parser.parseInline(token.tokens);
		const type = token.header ? "th" : "td";
		return (token.align ? `<${type} align="${token.align}">` : `<${type}>`) + content + `</${type}>
`;
	}
	/**
	* span level renderer
	*/
	strong({ tokens }) {
		return `<strong>${this.parser.parseInline(tokens)}</strong>`;
	}
	em({ tokens }) {
		return `<em>${this.parser.parseInline(tokens)}</em>`;
	}
	codespan({ text }) {
		return `<code>${escape2(text, true)}</code>`;
	}
	br(token) {
		return "<br>";
	}
	del({ tokens }) {
		return `<del>${this.parser.parseInline(tokens)}</del>`;
	}
	link({ href, title, tokens }) {
		const text = this.parser.parseInline(tokens);
		const cleanHref = cleanUrl(href);
		if (cleanHref === null) return text;
		href = cleanHref;
		let out = "<a href=\"" + href + "\"";
		if (title) out += " title=\"" + escape2(title) + "\"";
		out += ">" + text + "</a>";
		return out;
	}
	image({ href, title, text, tokens }) {
		if (tokens) text = this.parser.parseInline(tokens, this.parser.textRenderer);
		const cleanHref = cleanUrl(href);
		if (cleanHref === null) return escape2(text);
		href = cleanHref;
		let out = `<img src="${href}" alt="${text}"`;
		if (title) out += ` title="${escape2(title)}"`;
		out += ">";
		return out;
	}
	text(token) {
		return "tokens" in token && token.tokens ? this.parser.parseInline(token.tokens) : "escaped" in token && token.escaped ? token.text : escape2(token.text);
	}
};
var _TextRenderer = class {
	strong({ text }) {
		return text;
	}
	em({ text }) {
		return text;
	}
	codespan({ text }) {
		return text;
	}
	del({ text }) {
		return text;
	}
	html({ text }) {
		return text;
	}
	text({ text }) {
		return text;
	}
	link({ text }) {
		return "" + text;
	}
	image({ text }) {
		return "" + text;
	}
	br() {
		return "";
	}
};
var _Parser = class __Parser {
	options;
	renderer;
	textRenderer;
	constructor(options2) {
		this.options = options2 || _defaults;
		this.options.renderer = this.options.renderer || new _Renderer();
		this.renderer = this.options.renderer;
		this.renderer.options = this.options;
		this.renderer.parser = this;
		this.textRenderer = new _TextRenderer();
	}
	/**
	* Static Parse Method
	*/
	static parse(tokens, options2) {
		return new __Parser(options2).parse(tokens);
	}
	/**
	* Static Parse Inline Method
	*/
	static parseInline(tokens, options2) {
		return new __Parser(options2).parseInline(tokens);
	}
	/**
	* Parse Loop
	*/
	parse(tokens, top = true) {
		let out = "";
		for (let i = 0; i < tokens.length; i++) {
			const anyToken = tokens[i];
			if (this.options.extensions?.renderers?.[anyToken.type]) {
				const genericToken = anyToken;
				const ret = this.options.extensions.renderers[genericToken.type].call({ parser: this }, genericToken);
				if (ret !== false || ![
					"space",
					"hr",
					"heading",
					"code",
					"table",
					"blockquote",
					"list",
					"html",
					"paragraph",
					"text"
				].includes(genericToken.type)) {
					out += ret || "";
					continue;
				}
			}
			const token = anyToken;
			switch (token.type) {
				case "space":
					out += this.renderer.space(token);
					continue;
				case "hr":
					out += this.renderer.hr(token);
					continue;
				case "heading":
					out += this.renderer.heading(token);
					continue;
				case "code":
					out += this.renderer.code(token);
					continue;
				case "table":
					out += this.renderer.table(token);
					continue;
				case "blockquote":
					out += this.renderer.blockquote(token);
					continue;
				case "list":
					out += this.renderer.list(token);
					continue;
				case "html":
					out += this.renderer.html(token);
					continue;
				case "paragraph":
					out += this.renderer.paragraph(token);
					continue;
				case "text": {
					let textToken = token;
					let body = this.renderer.text(textToken);
					while (i + 1 < tokens.length && tokens[i + 1].type === "text") {
						textToken = tokens[++i];
						body += "\n" + this.renderer.text(textToken);
					}
					if (top) out += this.renderer.paragraph({
						type: "paragraph",
						raw: body,
						text: body,
						tokens: [{
							type: "text",
							raw: body,
							text: body,
							escaped: true
						}]
					});
					else out += body;
					continue;
				}
				default: {
					const errMsg = "Token with \"" + token.type + "\" type was not found.";
					if (this.options.silent) {
						console.error(errMsg);
						return "";
					} else throw new Error(errMsg);
				}
			}
		}
		return out;
	}
	/**
	* Parse Inline Tokens
	*/
	parseInline(tokens, renderer = this.renderer) {
		let out = "";
		for (let i = 0; i < tokens.length; i++) {
			const anyToken = tokens[i];
			if (this.options.extensions?.renderers?.[anyToken.type]) {
				const ret = this.options.extensions.renderers[anyToken.type].call({ parser: this }, anyToken);
				if (ret !== false || ![
					"escape",
					"html",
					"link",
					"image",
					"strong",
					"em",
					"codespan",
					"br",
					"del",
					"text"
				].includes(anyToken.type)) {
					out += ret || "";
					continue;
				}
			}
			const token = anyToken;
			switch (token.type) {
				case "escape":
					out += renderer.text(token);
					break;
				case "html":
					out += renderer.html(token);
					break;
				case "link":
					out += renderer.link(token);
					break;
				case "image":
					out += renderer.image(token);
					break;
				case "strong":
					out += renderer.strong(token);
					break;
				case "em":
					out += renderer.em(token);
					break;
				case "codespan":
					out += renderer.codespan(token);
					break;
				case "br":
					out += renderer.br(token);
					break;
				case "del":
					out += renderer.del(token);
					break;
				case "text":
					out += renderer.text(token);
					break;
				default: {
					const errMsg = "Token with \"" + token.type + "\" type was not found.";
					if (this.options.silent) {
						console.error(errMsg);
						return "";
					} else throw new Error(errMsg);
				}
			}
		}
		return out;
	}
};
var _Hooks = class {
	options;
	block;
	constructor(options2) {
		this.options = options2 || _defaults;
	}
	static passThroughHooks = /* @__PURE__ */ new Set([
		"preprocess",
		"postprocess",
		"processAllTokens"
	]);
	/**
	* Process markdown before marked
	*/
	preprocess(markdown) {
		return markdown;
	}
	/**
	* Process HTML after marked is finished
	*/
	postprocess(html2) {
		return html2;
	}
	/**
	* Process all tokens before walk tokens
	*/
	processAllTokens(tokens) {
		return tokens;
	}
	/**
	* Provide function to tokenize markdown
	*/
	provideLexer() {
		return this.block ? _Lexer.lex : _Lexer.lexInline;
	}
	/**
	* Provide function to parse tokens
	*/
	provideParser() {
		return this.block ? _Parser.parse : _Parser.parseInline;
	}
};
var Marked = class {
	defaults = _getDefaults();
	options = this.setOptions;
	parse = this.parseMarkdown(true);
	parseInline = this.parseMarkdown(false);
	Parser = _Parser;
	Renderer = _Renderer;
	TextRenderer = _TextRenderer;
	Lexer = _Lexer;
	Tokenizer = _Tokenizer;
	Hooks = _Hooks;
	constructor(...args) {
		this.use(...args);
	}
	/**
	* Run callback for every token
	*/
	walkTokens(tokens, callback) {
		let values = [];
		for (const token of tokens) {
			values = values.concat(callback.call(this, token));
			switch (token.type) {
				case "table": {
					const tableToken = token;
					for (const cell of tableToken.header) values = values.concat(this.walkTokens(cell.tokens, callback));
					for (const row of tableToken.rows) for (const cell of row) values = values.concat(this.walkTokens(cell.tokens, callback));
					break;
				}
				case "list": {
					const listToken = token;
					values = values.concat(this.walkTokens(listToken.items, callback));
					break;
				}
				default: {
					const genericToken = token;
					if (this.defaults.extensions?.childTokens?.[genericToken.type]) this.defaults.extensions.childTokens[genericToken.type].forEach((childTokens) => {
						const tokens2 = genericToken[childTokens].flat(Infinity);
						values = values.concat(this.walkTokens(tokens2, callback));
					});
					else if (genericToken.tokens) values = values.concat(this.walkTokens(genericToken.tokens, callback));
				}
			}
		}
		return values;
	}
	use(...args) {
		const extensions = this.defaults.extensions || {
			renderers: {},
			childTokens: {}
		};
		args.forEach((pack) => {
			const opts = { ...pack };
			opts.async = this.defaults.async || opts.async || false;
			if (pack.extensions) {
				pack.extensions.forEach((ext) => {
					if (!ext.name) throw new Error("extension name required");
					if ("renderer" in ext) {
						const prevRenderer = extensions.renderers[ext.name];
						if (prevRenderer) extensions.renderers[ext.name] = function(...args2) {
							let ret = ext.renderer.apply(this, args2);
							if (ret === false) ret = prevRenderer.apply(this, args2);
							return ret;
						};
						else extensions.renderers[ext.name] = ext.renderer;
					}
					if ("tokenizer" in ext) {
						if (!ext.level || ext.level !== "block" && ext.level !== "inline") throw new Error("extension level must be 'block' or 'inline'");
						const extLevel = extensions[ext.level];
						if (extLevel) extLevel.unshift(ext.tokenizer);
						else extensions[ext.level] = [ext.tokenizer];
						if (ext.start) {
							if (ext.level === "block") {
								if (extensions.startBlock) extensions.startBlock.push(ext.start);
								else extensions.startBlock = [ext.start];
							} else if (ext.level === "inline") {
								if (extensions.startInline) extensions.startInline.push(ext.start);
								else extensions.startInline = [ext.start];
							}
						}
					}
					if ("childTokens" in ext && ext.childTokens) extensions.childTokens[ext.name] = ext.childTokens;
				});
				opts.extensions = extensions;
			}
			if (pack.renderer) {
				const renderer = this.defaults.renderer || new _Renderer(this.defaults);
				for (const prop in pack.renderer) {
					if (!(prop in renderer)) throw new Error(`renderer '${prop}' does not exist`);
					if (["options", "parser"].includes(prop)) continue;
					const rendererProp = prop;
					const rendererFunc = pack.renderer[rendererProp];
					const prevRenderer = renderer[rendererProp];
					renderer[rendererProp] = (...args2) => {
						let ret = rendererFunc.apply(renderer, args2);
						if (ret === false) ret = prevRenderer.apply(renderer, args2);
						return ret || "";
					};
				}
				opts.renderer = renderer;
			}
			if (pack.tokenizer) {
				const tokenizer = this.defaults.tokenizer || new _Tokenizer(this.defaults);
				for (const prop in pack.tokenizer) {
					if (!(prop in tokenizer)) throw new Error(`tokenizer '${prop}' does not exist`);
					if ([
						"options",
						"rules",
						"lexer"
					].includes(prop)) continue;
					const tokenizerProp = prop;
					const tokenizerFunc = pack.tokenizer[tokenizerProp];
					const prevTokenizer = tokenizer[tokenizerProp];
					tokenizer[tokenizerProp] = (...args2) => {
						let ret = tokenizerFunc.apply(tokenizer, args2);
						if (ret === false) ret = prevTokenizer.apply(tokenizer, args2);
						return ret;
					};
				}
				opts.tokenizer = tokenizer;
			}
			if (pack.hooks) {
				const hooks = this.defaults.hooks || new _Hooks();
				for (const prop in pack.hooks) {
					if (!(prop in hooks)) throw new Error(`hook '${prop}' does not exist`);
					if (["options", "block"].includes(prop)) continue;
					const hooksProp = prop;
					const hooksFunc = pack.hooks[hooksProp];
					const prevHook = hooks[hooksProp];
					if (_Hooks.passThroughHooks.has(prop)) hooks[hooksProp] = (arg) => {
						if (this.defaults.async) return Promise.resolve(hooksFunc.call(hooks, arg)).then((ret2) => {
							return prevHook.call(hooks, ret2);
						});
						const ret = hooksFunc.call(hooks, arg);
						return prevHook.call(hooks, ret);
					};
					else hooks[hooksProp] = (...args2) => {
						let ret = hooksFunc.apply(hooks, args2);
						if (ret === false) ret = prevHook.apply(hooks, args2);
						return ret;
					};
				}
				opts.hooks = hooks;
			}
			if (pack.walkTokens) {
				const walkTokens2 = this.defaults.walkTokens;
				const packWalktokens = pack.walkTokens;
				opts.walkTokens = function(token) {
					let values = [];
					values.push(packWalktokens.call(this, token));
					if (walkTokens2) values = values.concat(walkTokens2.call(this, token));
					return values;
				};
			}
			this.defaults = {
				...this.defaults,
				...opts
			};
		});
		return this;
	}
	setOptions(opt) {
		this.defaults = {
			...this.defaults,
			...opt
		};
		return this;
	}
	lexer(src, options2) {
		return _Lexer.lex(src, options2 ?? this.defaults);
	}
	parser(tokens, options2) {
		return _Parser.parse(tokens, options2 ?? this.defaults);
	}
	parseMarkdown(blockType) {
		const parse2 = (src, options2) => {
			const origOpt = { ...options2 };
			const opt = {
				...this.defaults,
				...origOpt
			};
			const throwError = this.onError(!!opt.silent, !!opt.async);
			if (this.defaults.async === true && origOpt.async === false) return throwError(/* @__PURE__ */ new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
			if (typeof src === "undefined" || src === null) return throwError(/* @__PURE__ */ new Error("marked(): input parameter is undefined or null"));
			if (typeof src !== "string") return throwError(/* @__PURE__ */ new Error("marked(): input parameter is of type " + Object.prototype.toString.call(src) + ", string expected"));
			if (opt.hooks) {
				opt.hooks.options = opt;
				opt.hooks.block = blockType;
			}
			const lexer2 = opt.hooks ? opt.hooks.provideLexer() : blockType ? _Lexer.lex : _Lexer.lexInline;
			const parser2 = opt.hooks ? opt.hooks.provideParser() : blockType ? _Parser.parse : _Parser.parseInline;
			if (opt.async) return Promise.resolve(opt.hooks ? opt.hooks.preprocess(src) : src).then((src2) => lexer2(src2, opt)).then((tokens) => opt.hooks ? opt.hooks.processAllTokens(tokens) : tokens).then((tokens) => opt.walkTokens ? Promise.all(this.walkTokens(tokens, opt.walkTokens)).then(() => tokens) : tokens).then((tokens) => parser2(tokens, opt)).then((html2) => opt.hooks ? opt.hooks.postprocess(html2) : html2).catch(throwError);
			try {
				if (opt.hooks) src = opt.hooks.preprocess(src);
				let tokens = lexer2(src, opt);
				if (opt.hooks) tokens = opt.hooks.processAllTokens(tokens);
				if (opt.walkTokens) this.walkTokens(tokens, opt.walkTokens);
				let html2 = parser2(tokens, opt);
				if (opt.hooks) html2 = opt.hooks.postprocess(html2);
				return html2;
			} catch (e) {
				return throwError(e);
			}
		};
		return parse2;
	}
	onError(silent, async) {
		return (e) => {
			e.message += "\nPlease report this to https://github.com/markedjs/marked.";
			if (silent) {
				const msg = "<p>An error occurred:</p><pre>" + escape2(e.message + "", true) + "</pre>";
				if (async) return Promise.resolve(msg);
				return msg;
			}
			if (async) return Promise.reject(e);
			throw e;
		};
	}
};
var markedInstance = new Marked();
function marked(src, opt) {
	return markedInstance.parse(src, opt);
}
marked.options = marked.setOptions = function(options2) {
	markedInstance.setOptions(options2);
	marked.defaults = markedInstance.defaults;
	changeDefaults(marked.defaults);
	return marked;
};
marked.getDefaults = _getDefaults;
marked.defaults = _defaults;
marked.use = function(...args) {
	markedInstance.use(...args);
	marked.defaults = markedInstance.defaults;
	changeDefaults(marked.defaults);
	return marked;
};
marked.walkTokens = function(tokens, callback) {
	return markedInstance.walkTokens(tokens, callback);
};
marked.parseInline = markedInstance.parseInline;
marked.Parser = _Parser;
marked.parser = _Parser.parse;
marked.Renderer = _Renderer;
marked.TextRenderer = _TextRenderer;
marked.Lexer = _Lexer;
marked.lexer = _Lexer.lex;
marked.Tokenizer = _Tokenizer;
marked.Hooks = _Hooks;
marked.parse = marked;
marked.options;
marked.setOptions;
marked.use;
marked.walkTokens;
marked.parseInline;
_Parser.parse;
_Lexer.lex;
//#endregion
//#region ../../node_modules/.pnpm/dompurify@3.4.14/node_modules/dompurify/dist/purify.es.mjs
/*! @license DOMPurify 3.4.14 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.4.14/LICENSE */
function _arrayLikeToArray(r, a) {
	(null == a || a > r.length) && (a = r.length);
	for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
	return n;
}
function _arrayWithHoles(r) {
	if (Array.isArray(r)) return r;
}
function _iterableToArrayLimit(r, l) {
	var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
	if (null != t) {
		var e, n, i, u, a = [], f = true, o = false;
		try {
			if (i = (t = t.call(r)).next, 0 === l);
			else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
		} catch (r) {
			o = true, n = r;
		} finally {
			try {
				if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return;
			} finally {
				if (o) throw n;
			}
		}
		return a;
	}
}
function _nonIterableRest() {
	throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _slicedToArray(r, e) {
	return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
}
function _unsupportedIterableToArray(r, a) {
	if (r) {
		if ("string" == typeof r) return _arrayLikeToArray(r, a);
		var t = {}.toString.call(r).slice(8, -1);
		return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
	}
}
const entries = Object.entries;
const setPrototypeOf = Object.setPrototypeOf;
const isFrozen = Object.isFrozen;
const getPrototypeOf = Object.getPrototypeOf;
const getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
let freeze = Object.freeze;
let seal = Object.seal;
let create = Object.create;
let _ref = typeof Reflect !== "undefined" && Reflect;
let apply$1 = _ref.apply;
let construct = _ref.construct;
if (!freeze) freeze = function freeze(x) {
	return x;
};
if (!seal) seal = function seal(x) {
	return x;
};
if (!apply$1) apply$1 = function apply(func, thisArg) {
	for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) args[_key - 2] = arguments[_key];
	return func.apply(thisArg, args);
};
if (!construct) construct = function construct(Func) {
	for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) args[_key2 - 1] = arguments[_key2];
	return new Func(...args);
};
const arrayForEach = unapply(Array.prototype.forEach);
const arrayLastIndexOf = unapply(Array.prototype.lastIndexOf);
const arrayPop = unapply(Array.prototype.pop);
const arrayPush = unapply(Array.prototype.push);
const arraySplice = unapply(Array.prototype.splice);
const arrayIsArray = Array.isArray;
const stringToLowerCase = unapply(String.prototype.toLowerCase);
const stringToString = unapply(String.prototype.toString);
const stringMatch = unapply(String.prototype.match);
const stringReplace = unapply(String.prototype.replace);
const stringIndexOf = unapply(String.prototype.indexOf);
const stringTrim = unapply(String.prototype.trim);
const numberToString = unapply(Number.prototype.toString);
const booleanToString = unapply(Boolean.prototype.toString);
const bigintToString = typeof BigInt === "undefined" ? null : unapply(BigInt.prototype.toString);
const symbolToString = typeof Symbol === "undefined" ? null : unapply(Symbol.prototype.toString);
const objectHasOwnProperty = unapply(Object.prototype.hasOwnProperty);
const objectToString = unapply(Object.prototype.toString);
const regExpTest = unapply(RegExp.prototype.test);
const typeErrorCreate = unconstruct(TypeError);
/**
* Creates a new function that calls the given function with a specified thisArg and arguments.
*
* @param func - The function to be wrapped and called.
* @returns A new function that calls the given function with a specified thisArg and arguments.
*/
function unapply(func) {
	return function(thisArg) {
		if (thisArg instanceof RegExp) thisArg.lastIndex = 0;
		for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) args[_key3 - 1] = arguments[_key3];
		return apply$1(func, thisArg, args);
	};
}
/**
* Creates a new function that constructs an instance of the given constructor function with the provided arguments.
*
* @param func - The constructor function to be wrapped and called.
* @returns A new function that constructs an instance of the given constructor function with the provided arguments.
*/
function unconstruct(Func) {
	return function() {
		for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) args[_key4] = arguments[_key4];
		return construct(Func, args);
	};
}
/**
* Add properties to a lookup table
*
* @param set - The set to which elements will be added.
* @param array - The array containing elements to be added to the set.
* @param transformCaseFunc - An optional function to transform the case of each element before adding to the set.
* @returns The modified set with added elements.
*/
function addToSet(set, array) {
	let transformCaseFunc = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : stringToLowerCase;
	if (setPrototypeOf) setPrototypeOf(set, null);
	if (!arrayIsArray(array)) return set;
	let l = array.length;
	while (l--) {
		let element = array[l];
		if (typeof element === "string") {
			const lcElement = transformCaseFunc(element);
			if (lcElement !== element) {
				if (!isFrozen(array)) array[l] = lcElement;
				element = lcElement;
			}
		}
		set[element] = true;
	}
	return set;
}
/**
* Clean up an array to harden against CSPP
*
* @param array - The array to be cleaned.
* @returns The cleaned version of the array
*/
function cleanArray(array) {
	for (let index = 0; index < array.length; index++) if (!objectHasOwnProperty(array, index)) array[index] = null;
	return array;
}
/**
* Shallow clone an object
*
* @param object - The object to be cloned.
* @returns A new object that copies the original.
*/
function clone(object) {
	const newObject = create(null);
	for (const _ref2 of entries(object)) {
		var _ref3 = _slicedToArray(_ref2, 2);
		const property = _ref3[0];
		const value = _ref3[1];
		if (objectHasOwnProperty(object, property)) {
			if (arrayIsArray(value)) newObject[property] = cleanArray(value);
			else if (value && typeof value === "object" && value.constructor === Object) newObject[property] = clone(value);
			else newObject[property] = value;
		}
	}
	return newObject;
}
/**
* Convert non-node values into strings without depending on direct property access.
*
* @param value - The value to stringify.
* @returns A string representation of the provided value.
*/
function stringifyValue(value) {
	switch (typeof value) {
		case "string": return value;
		case "number": return numberToString(value);
		case "boolean": return booleanToString(value);
		case "bigint": return bigintToString ? bigintToString(value) : "0";
		case "symbol": return symbolToString ? symbolToString(value) : "Symbol()";
		case "undefined": return objectToString(value);
		case "function":
		case "object": {
			if (value === null) return objectToString(value);
			const valueAsRecord = value;
			const valueToString = lookupGetter(valueAsRecord, "toString");
			if (typeof valueToString === "function") {
				const stringified = valueToString(valueAsRecord);
				return typeof stringified === "string" ? stringified : objectToString(stringified);
			}
			return objectToString(value);
		}
		default: return objectToString(value);
	}
}
/**
* This method automatically checks if the prop is function or getter and behaves accordingly.
*
* @param object - The object to look up the getter function in its prototype chain.
* @param prop - The property name for which to find the getter function.
* @returns The getter function found in the prototype chain or a fallback function.
*/
function lookupGetter(object, prop) {
	while (object !== null) {
		const desc = getOwnPropertyDescriptor(object, prop);
		if (desc) {
			if (desc.get) return unapply(desc.get);
			if (typeof desc.value === "function") return unapply(desc.value);
		}
		object = getPrototypeOf(object);
	}
	function fallbackValue() {
		return null;
	}
	return fallbackValue;
}
function isRegex(value) {
	try {
		regExpTest(value, "");
		return true;
	} catch (_unused) {
		return false;
	}
}
const html$1 = freeze([
	"a",
	"abbr",
	"acronym",
	"address",
	"area",
	"article",
	"aside",
	"audio",
	"b",
	"bdi",
	"bdo",
	"big",
	"blink",
	"blockquote",
	"body",
	"br",
	"button",
	"canvas",
	"caption",
	"center",
	"cite",
	"code",
	"col",
	"colgroup",
	"content",
	"data",
	"datalist",
	"dd",
	"decorator",
	"del",
	"details",
	"dfn",
	"dialog",
	"dir",
	"div",
	"dl",
	"dt",
	"element",
	"em",
	"fieldset",
	"figcaption",
	"figure",
	"font",
	"footer",
	"form",
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"h6",
	"head",
	"header",
	"hgroup",
	"hr",
	"html",
	"i",
	"img",
	"input",
	"ins",
	"kbd",
	"label",
	"legend",
	"li",
	"main",
	"map",
	"mark",
	"marquee",
	"menu",
	"menuitem",
	"meter",
	"nav",
	"nobr",
	"ol",
	"optgroup",
	"option",
	"output",
	"p",
	"picture",
	"pre",
	"progress",
	"q",
	"rp",
	"rt",
	"ruby",
	"s",
	"samp",
	"search",
	"section",
	"select",
	"shadow",
	"slot",
	"small",
	"source",
	"spacer",
	"span",
	"strike",
	"strong",
	"style",
	"sub",
	"summary",
	"sup",
	"table",
	"tbody",
	"td",
	"template",
	"textarea",
	"tfoot",
	"th",
	"thead",
	"time",
	"tr",
	"track",
	"tt",
	"u",
	"ul",
	"var",
	"video",
	"wbr"
]);
const svg$1 = freeze([
	"svg",
	"a",
	"altglyph",
	"altglyphdef",
	"altglyphitem",
	"animatecolor",
	"animatemotion",
	"animatetransform",
	"circle",
	"clippath",
	"defs",
	"desc",
	"ellipse",
	"enterkeyhint",
	"exportparts",
	"filter",
	"font",
	"g",
	"glyph",
	"glyphref",
	"hkern",
	"image",
	"inputmode",
	"line",
	"lineargradient",
	"marker",
	"mask",
	"metadata",
	"mpath",
	"part",
	"path",
	"pattern",
	"polygon",
	"polyline",
	"radialgradient",
	"rect",
	"stop",
	"style",
	"switch",
	"symbol",
	"text",
	"textpath",
	"title",
	"tref",
	"tspan",
	"view",
	"vkern"
]);
const svgFilters = freeze([
	"feBlend",
	"feColorMatrix",
	"feComponentTransfer",
	"feComposite",
	"feConvolveMatrix",
	"feDiffuseLighting",
	"feDisplacementMap",
	"feDistantLight",
	"feDropShadow",
	"feFlood",
	"feFuncA",
	"feFuncB",
	"feFuncG",
	"feFuncR",
	"feGaussianBlur",
	"feImage",
	"feMerge",
	"feMergeNode",
	"feMorphology",
	"feOffset",
	"fePointLight",
	"feSpecularLighting",
	"feSpotLight",
	"feTile",
	"feTurbulence"
]);
const svgDisallowed = freeze([
	"animate",
	"color-profile",
	"cursor",
	"discard",
	"font-face",
	"font-face-format",
	"font-face-name",
	"font-face-src",
	"font-face-uri",
	"foreignobject",
	"hatch",
	"hatchpath",
	"mesh",
	"meshgradient",
	"meshpatch",
	"meshrow",
	"missing-glyph",
	"script",
	"set",
	"solidcolor",
	"unknown",
	"use"
]);
const mathMl$1 = freeze([
	"math",
	"menclose",
	"merror",
	"mfenced",
	"mfrac",
	"mglyph",
	"mi",
	"mlabeledtr",
	"mmultiscripts",
	"mn",
	"mo",
	"mover",
	"mpadded",
	"mphantom",
	"mroot",
	"mrow",
	"ms",
	"mspace",
	"msqrt",
	"mstyle",
	"msub",
	"msup",
	"msubsup",
	"mtable",
	"mtd",
	"mtext",
	"mtr",
	"munder",
	"munderover",
	"mprescripts"
]);
const mathMlDisallowed = freeze([
	"maction",
	"maligngroup",
	"malignmark",
	"mlongdiv",
	"mscarries",
	"mscarry",
	"msgroup",
	"mstack",
	"msline",
	"msrow",
	"semantics",
	"annotation",
	"annotation-xml",
	"mprescripts",
	"none"
]);
const text = freeze(["#text"]);
const html = freeze([
	"accept",
	"action",
	"align",
	"alt",
	"autocapitalize",
	"autocomplete",
	"autopictureinpicture",
	"autoplay",
	"background",
	"bgcolor",
	"border",
	"capture",
	"cellpadding",
	"cellspacing",
	"checked",
	"cite",
	"class",
	"clear",
	"color",
	"cols",
	"colspan",
	"command",
	"commandfor",
	"controls",
	"controlslist",
	"coords",
	"crossorigin",
	"datetime",
	"decoding",
	"default",
	"dir",
	"disabled",
	"disablepictureinpicture",
	"disableremoteplayback",
	"download",
	"draggable",
	"enctype",
	"enterkeyhint",
	"exportparts",
	"face",
	"for",
	"headers",
	"height",
	"hidden",
	"high",
	"href",
	"hreflang",
	"id",
	"inert",
	"inputmode",
	"integrity",
	"ismap",
	"kind",
	"label",
	"lang",
	"list",
	"loading",
	"loop",
	"low",
	"max",
	"maxlength",
	"media",
	"method",
	"min",
	"minlength",
	"multiple",
	"muted",
	"name",
	"nonce",
	"noshade",
	"novalidate",
	"nowrap",
	"open",
	"optimum",
	"part",
	"pattern",
	"placeholder",
	"playsinline",
	"popover",
	"popovertarget",
	"popovertargetaction",
	"poster",
	"preload",
	"pubdate",
	"radiogroup",
	"readonly",
	"rel",
	"required",
	"rev",
	"reversed",
	"role",
	"rows",
	"rowspan",
	"spellcheck",
	"scope",
	"selected",
	"shape",
	"size",
	"sizes",
	"slot",
	"span",
	"srclang",
	"start",
	"src",
	"srcset",
	"step",
	"style",
	"summary",
	"tabindex",
	"title",
	"translate",
	"type",
	"usemap",
	"valign",
	"value",
	"width",
	"wrap",
	"xmlns"
]);
const svg = freeze([
	"accent-height",
	"accumulate",
	"additive",
	"alignment-baseline",
	"amplitude",
	"ascent",
	"attributename",
	"attributetype",
	"azimuth",
	"basefrequency",
	"baseline-shift",
	"begin",
	"bias",
	"by",
	"class",
	"clip",
	"clippathunits",
	"clip-path",
	"clip-rule",
	"color",
	"color-interpolation",
	"color-interpolation-filters",
	"color-profile",
	"color-rendering",
	"cx",
	"cy",
	"d",
	"dx",
	"dy",
	"diffuseconstant",
	"direction",
	"display",
	"divisor",
	"dominant-baseline",
	"dur",
	"edgemode",
	"elevation",
	"end",
	"exponent",
	"fill",
	"fill-opacity",
	"fill-rule",
	"filter",
	"filterunits",
	"flood-color",
	"flood-opacity",
	"font-family",
	"font-size",
	"font-size-adjust",
	"font-stretch",
	"font-style",
	"font-variant",
	"font-weight",
	"fx",
	"fy",
	"g1",
	"g2",
	"glyph-name",
	"glyphref",
	"gradientunits",
	"gradienttransform",
	"height",
	"href",
	"id",
	"image-rendering",
	"in",
	"in2",
	"intercept",
	"k",
	"k1",
	"k2",
	"k3",
	"k4",
	"kerning",
	"keypoints",
	"keysplines",
	"keytimes",
	"lang",
	"lengthadjust",
	"letter-spacing",
	"kernelmatrix",
	"kernelunitlength",
	"lighting-color",
	"local",
	"marker-end",
	"marker-mid",
	"marker-start",
	"markerheight",
	"markerunits",
	"markerwidth",
	"maskcontentunits",
	"maskunits",
	"max",
	"mask",
	"mask-type",
	"media",
	"method",
	"mode",
	"min",
	"name",
	"numoctaves",
	"offset",
	"operator",
	"opacity",
	"order",
	"orient",
	"orientation",
	"origin",
	"overflow",
	"paint-order",
	"path",
	"pathlength",
	"patterncontentunits",
	"patterntransform",
	"patternunits",
	"pointer-events",
	"points",
	"preservealpha",
	"preserveaspectratio",
	"primitiveunits",
	"r",
	"rx",
	"ry",
	"radius",
	"refx",
	"refy",
	"repeatcount",
	"repeatdur",
	"restart",
	"result",
	"rotate",
	"scale",
	"seed",
	"shape-rendering",
	"slope",
	"specularconstant",
	"specularexponent",
	"spreadmethod",
	"startoffset",
	"stddeviation",
	"stitchtiles",
	"stop-color",
	"stop-opacity",
	"stroke-dasharray",
	"stroke-dashoffset",
	"stroke-linecap",
	"stroke-linejoin",
	"stroke-miterlimit",
	"stroke-opacity",
	"stroke",
	"stroke-width",
	"style",
	"surfacescale",
	"systemlanguage",
	"tabindex",
	"tablevalues",
	"targetx",
	"targety",
	"transform",
	"transform-origin",
	"text-anchor",
	"text-decoration",
	"text-orientation",
	"text-rendering",
	"textlength",
	"type",
	"u1",
	"u2",
	"unicode",
	"values",
	"vector-effect",
	"viewbox",
	"visibility",
	"version",
	"vert-adv-y",
	"vert-origin-x",
	"vert-origin-y",
	"width",
	"word-spacing",
	"wrap",
	"writing-mode",
	"xchannelselector",
	"ychannelselector",
	"x",
	"x1",
	"x2",
	"xmlns",
	"y",
	"y1",
	"y2",
	"z",
	"zoomandpan"
]);
const mathMl = freeze([
	"accent",
	"accentunder",
	"align",
	"bevelled",
	"close",
	"columnalign",
	"columnlines",
	"columnspacing",
	"columnspan",
	"denomalign",
	"depth",
	"dir",
	"display",
	"displaystyle",
	"encoding",
	"fence",
	"frame",
	"height",
	"href",
	"id",
	"largeop",
	"length",
	"linethickness",
	"lquote",
	"lspace",
	"mathbackground",
	"mathcolor",
	"mathsize",
	"mathvariant",
	"maxsize",
	"minsize",
	"movablelimits",
	"notation",
	"numalign",
	"open",
	"rowalign",
	"rowlines",
	"rowspacing",
	"rowspan",
	"rspace",
	"rquote",
	"scriptlevel",
	"scriptminsize",
	"scriptsizemultiplier",
	"selection",
	"separator",
	"separators",
	"stretchy",
	"subscriptshift",
	"supscriptshift",
	"symmetric",
	"voffset",
	"width",
	"xmlns"
]);
const xml = freeze([
	"xlink:href",
	"xml:id",
	"xlink:title",
	"xml:space",
	"xmlns:xlink"
]);
const MUSTACHE_EXPR = seal(/{{[\w\W]*|^[\w\W]*}}/g);
const ERB_EXPR = seal(/<%[\w\W]*|^[\w\W]*%>/g);
const TMPLIT_EXPR = seal(/\${[\w\W]*/g);
const DATA_ATTR = seal(/^data-[\-\w.\u00B7-\uFFFF]+$/);
const ARIA_ATTR = seal(/^aria-[\-\w]+$/);
const IS_ALLOWED_URI = seal(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i);
const IS_SCRIPT_OR_DATA = seal(/^(?:\w+script|data):/i);
const ATTR_WHITESPACE = seal(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g);
const DOCTYPE_NAME = seal(/^html$/i);
const CUSTOM_ELEMENT = seal(/^[a-z][.\w]*(-[.\w]+)+$/i);
const ELEMENT_MARKUP_PROBE = seal(/<[/\w!]/g);
const COMMENT_MARKUP_PROBE = seal(/<[/\w]/g);
const FALLBACK_TAG_CLOSE = seal(/<\/no(script|embed|frames)/i);
const SELF_CLOSING_TAG = seal(/\/>/i);
const NODE_TYPE = {
	element: 1,
	attribute: 2,
	text: 3,
	cdataSection: 4,
	entityReference: 5,
	entityNode: 6,
	processingInstruction: 7,
	comment: 8,
	document: 9,
	documentType: 10,
	documentFragment: 11,
	notation: 12
};
const LITERAL_TEXT_ELEMENT_NAMES = [
	"style",
	"script",
	"xmp",
	"iframe",
	"noembed",
	"noframes",
	"plaintext",
	"noscript"
];
const LITERAL_TEXT_ELEMENTS = freeze(addToSet({}, LITERAL_TEXT_ELEMENT_NAMES));
const LITERAL_TEXT_CLOSE = function() {
	const map = {};
	arrayForEach(LITERAL_TEXT_ELEMENT_NAMES, (name) => {
		map[name] = seal(new RegExp("</" + name + "(?=[\\t\\n\\f\\r />])", "i"));
	});
	return freeze(map);
}();
const getGlobal = function getGlobal() {
	return typeof window === "undefined" ? null : window;
};
/**
* Creates a no-op policy for internal use only.
* Don't export this function outside this module!
* @param trustedTypes The policy factory.
* @param purifyHostElement The Script element used to load DOMPurify (to determine policy name suffix).
* @return The policy created (or null, if Trusted Types
* are not supported or creating the policy failed).
*/
const _createTrustedTypesPolicy = function _createTrustedTypesPolicy(trustedTypes, purifyHostElement) {
	if (typeof trustedTypes !== "object" || typeof trustedTypes.createPolicy !== "function") return null;
	let suffix = null;
	const ATTR_NAME = "data-tt-policy-suffix";
	if (purifyHostElement && purifyHostElement.hasAttribute(ATTR_NAME)) suffix = purifyHostElement.getAttribute(ATTR_NAME);
	const policyName = "dompurify" + (suffix ? "#" + suffix : "");
	try {
		return trustedTypes.createPolicy(policyName, {
			createHTML(html) {
				return html;
			},
			createScriptURL(scriptUrl) {
				return scriptUrl;
			}
		});
	} catch (_) {
		console.warn("TrustedTypes policy " + policyName + " could not be created.");
		return null;
	}
};
const _createHooksMap = function _createHooksMap() {
	return {
		afterSanitizeAttributes: [],
		afterSanitizeElements: [],
		afterSanitizeShadowDOM: [],
		beforeSanitizeAttributes: [],
		beforeSanitizeElements: [],
		beforeSanitizeShadowDOM: [],
		uponSanitizeAttribute: [],
		uponSanitizeElement: [],
		uponSanitizeShadowNode: []
	};
};
/**
* Resolve a set-valued configuration option: a fresh set built from
* cfg[key] when it is an own array property (seeded with a clone of
* options.base when given, case-normalized via options.transform),
* the fallback set otherwise.
*
* @param cfg the cloned, prototype-free configuration object
* @param key the configuration property to read
* @param fallback the set to use when the option is absent or not an array
* @param options transform and optional base set to merge into
* @returns the resolved set
*/
const _resolveSetOption = function _resolveSetOption(cfg, key, fallback, options) {
	return objectHasOwnProperty(cfg, key) && arrayIsArray(cfg[key]) ? addToSet(options.base ? clone(options.base) : {}, cfg[key], options.transform) : fallback;
};
/**
* Resolve an object-valued configuration option: a prototype-free clone
* of cfg[key] when it is an own, truthy object property, else a fresh
* fallback built by makeFallback (fresh on every parse, so a previous
* parse can never leak state into the next one).
*
* @param cfg the cloned, prototype-free configuration object
* @param key the configuration property to read
* @param makeFallback builds the fallback value when the option is absent
* @returns the resolved object
*/
const _resolveObjectOption = function _resolveObjectOption(cfg, key, makeFallback) {
	const value = objectHasOwnProperty(cfg, key) ? cfg[key] : void 0;
	return value && typeof value === "object" ? clone(value) : makeFallback();
};
function createDOMPurify() {
	let window = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : getGlobal();
	const DOMPurify = (root) => createDOMPurify(root);
	DOMPurify.version = "3.4.14";
	DOMPurify.removed = [];
	if (!window || !window.document || window.document.nodeType !== NODE_TYPE.document || !window.Element) {
		DOMPurify.isSupported = false;
		return DOMPurify;
	}
	let document = window.document;
	const originalDocument = document;
	const currentScript = originalDocument.currentScript;
	window.DocumentFragment;
	const HTMLTemplateElement = window.HTMLTemplateElement, Node = window.Node, Element = window.Element, NodeFilter = window.NodeFilter;
	window.NamedNodeMap === void 0 && (window.NamedNodeMap || window.MozNamedAttrMap);
	window.HTMLFormElement;
	const DOMParser = window.DOMParser, trustedTypes = window.trustedTypes;
	const ElementPrototype = Element.prototype;
	const cloneNode = lookupGetter(ElementPrototype, "cloneNode");
	const remove = lookupGetter(ElementPrototype, "remove");
	const getNextSibling = lookupGetter(ElementPrototype, "nextSibling");
	const getChildNodes = lookupGetter(ElementPrototype, "childNodes");
	const getParentNode = lookupGetter(ElementPrototype, "parentNode");
	const getShadowRoot = lookupGetter(ElementPrototype, "shadowRoot");
	const getAttributes = lookupGetter(ElementPrototype, "attributes");
	const getNodeType = Node && Node.prototype ? lookupGetter(Node.prototype, "nodeType") : null;
	const getNodeName = Node && Node.prototype ? lookupGetter(Node.prototype, "nodeName") : null;
	const getOwnerDocument = Node && Node.prototype ? lookupGetter(Node.prototype, "ownerDocument") : null;
	const _readNodeType = function _readNodeType(node) {
		return getNodeType ? getNodeType(node) : node.nodeType;
	};
	const _readNodeName = function _readNodeName(node) {
		return getNodeName ? getNodeName(node) : node.nodeName;
	};
	if (typeof HTMLTemplateElement === "function") {
		const template = document.createElement("template");
		if (template.content && template.content.ownerDocument) document = template.content.ownerDocument;
	}
	let trustedTypesPolicy;
	let emptyHTML = "";
	let defaultTrustedTypesPolicy;
	let defaultTrustedTypesPolicyResolved = false;
	let IN_TRUSTED_TYPES_POLICY = 0;
	const _assertNotInTrustedTypesPolicy = function _assertNotInTrustedTypesPolicy() {
		if (IN_TRUSTED_TYPES_POLICY > 0) throw typeErrorCreate("A configured TRUSTED_TYPES_POLICY callback (createHTML or createScriptURL) must not call DOMPurify.sanitize, as that causes infinite recursion. Do not pass a policy whose callbacks wrap DOMPurify as TRUSTED_TYPES_POLICY; see the \"DOMPurify and Trusted Types\" section of the README.");
	};
	const _createTrustedHTML = function _createTrustedHTML(html) {
		_assertNotInTrustedTypesPolicy();
		IN_TRUSTED_TYPES_POLICY++;
		try {
			return trustedTypesPolicy.createHTML(html);
		} finally {
			IN_TRUSTED_TYPES_POLICY--;
		}
	};
	const _createTrustedScriptURL = function _createTrustedScriptURL(scriptUrl) {
		_assertNotInTrustedTypesPolicy();
		IN_TRUSTED_TYPES_POLICY++;
		try {
			return trustedTypesPolicy.createScriptURL(scriptUrl);
		} finally {
			IN_TRUSTED_TYPES_POLICY--;
		}
	};
	const _getDefaultTrustedTypesPolicy = function _getDefaultTrustedTypesPolicy() {
		if (!defaultTrustedTypesPolicyResolved) {
			defaultTrustedTypesPolicy = _createTrustedTypesPolicy(trustedTypes, currentScript);
			defaultTrustedTypesPolicyResolved = true;
		}
		return defaultTrustedTypesPolicy;
	};
	const _document = document, implementation = _document.implementation, createNodeIterator = _document.createNodeIterator, createDocumentFragment = _document.createDocumentFragment, getElementsByTagName = _document.getElementsByTagName;
	const importNode = originalDocument.importNode;
	let hooks = _createHooksMap();
	/**
	* Expose whether this browser supports running the full DOMPurify.
	*/
	DOMPurify.isSupported = typeof entries === "function" && typeof getParentNode === "function" && implementation && implementation.createHTMLDocument !== void 0;
	const MUSTACHE_EXPR$1 = MUSTACHE_EXPR, ERB_EXPR$1 = ERB_EXPR, TMPLIT_EXPR$1 = TMPLIT_EXPR, DATA_ATTR$1 = DATA_ATTR, ARIA_ATTR$1 = ARIA_ATTR, IS_SCRIPT_OR_DATA$1 = IS_SCRIPT_OR_DATA, ATTR_WHITESPACE$1 = ATTR_WHITESPACE, CUSTOM_ELEMENT$1 = CUSTOM_ELEMENT;
	let IS_ALLOWED_URI$1 = IS_ALLOWED_URI;
	/**
	* We consider the elements and attributes below to be safe. Ideally
	* don't add any new ones but feel free to remove unwanted ones.
	*/
	let ALLOWED_TAGS = null;
	const DEFAULT_ALLOWED_TAGS = addToSet({}, [
		...html$1,
		...svg$1,
		...svgFilters,
		...mathMl$1,
		...text
	]);
	let ALLOWED_ATTR = null;
	const DEFAULT_ALLOWED_ATTR = addToSet({}, [
		...html,
		...svg,
		...mathMl,
		...xml
	]);
	let CUSTOM_ELEMENT_HANDLING = Object.seal(create(null, {
		tagNameCheck: {
			writable: true,
			configurable: false,
			enumerable: true,
			value: null
		},
		attributeNameCheck: {
			writable: true,
			configurable: false,
			enumerable: true,
			value: null
		},
		allowCustomizedBuiltInElements: {
			writable: true,
			configurable: false,
			enumerable: true,
			value: false
		}
	}));
	let FORBID_TAGS = null;
	let FORBID_ATTR = null;
	const EXTRA_ELEMENT_HANDLING = Object.seal(create(null, {
		tagCheck: {
			writable: true,
			configurable: false,
			enumerable: true,
			value: null
		},
		attributeCheck: {
			writable: true,
			configurable: false,
			enumerable: true,
			value: null
		}
	}));
	let ALLOW_ARIA_ATTR = true;
	let ALLOW_DATA_ATTR = true;
	let ALLOW_UNKNOWN_PROTOCOLS = false;
	let ALLOW_SELF_CLOSE_IN_ATTR = true;
	let SAFE_FOR_TEMPLATES = false;
	let SAFE_FOR_XML = true;
	let WHOLE_DOCUMENT = false;
	let SET_CONFIG = false;
	let SET_CONFIG_ALLOWED_TAGS = null;
	let SET_CONFIG_ALLOWED_ATTR = null;
	let FORCE_BODY = false;
	let RETURN_DOM = false;
	let RETURN_DOM_FRAGMENT = false;
	let RETURN_TRUSTED_TYPE = false;
	let SANITIZE_DOM = true;
	let SANITIZE_NAMED_PROPS = false;
	const SANITIZE_NAMED_PROPS_PREFIX = "user-content-";
	let KEEP_CONTENT = true;
	let IN_PLACE = false;
	let USE_PROFILES = {};
	let FORBID_CONTENTS = null;
	const DEFAULT_FORBID_CONTENTS = addToSet({}, [
		"annotation-xml",
		"audio",
		"colgroup",
		"desc",
		"foreignobject",
		"head",
		"iframe",
		"math",
		"mi",
		"mn",
		"mo",
		"ms",
		"mtext",
		"noembed",
		"noframes",
		"noscript",
		"plaintext",
		"script",
		"selectedcontent",
		"style",
		"svg",
		"template",
		"thead",
		"title",
		"video",
		"xmp"
	]);
	let DATA_URI_TAGS = null;
	const DEFAULT_DATA_URI_TAGS = addToSet({}, [
		"audio",
		"video",
		"img",
		"source",
		"image",
		"track"
	]);
	let URI_SAFE_ATTRIBUTES = null;
	const DEFAULT_URI_SAFE_ATTRIBUTES = addToSet({}, [
		"alt",
		"class",
		"for",
		"id",
		"label",
		"name",
		"pattern",
		"placeholder",
		"role",
		"summary",
		"title",
		"value",
		"style",
		"xmlns"
	]);
	const MATHML_NAMESPACE = "http://www.w3.org/1998/Math/MathML";
	const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
	const HTML_NAMESPACE = "http://www.w3.org/1999/xhtml";
	let NAMESPACE = HTML_NAMESPACE;
	let IS_EMPTY_INPUT = false;
	let ALLOWED_NAMESPACES = null;
	const DEFAULT_ALLOWED_NAMESPACES = addToSet({}, [
		MATHML_NAMESPACE,
		SVG_NAMESPACE,
		HTML_NAMESPACE
	], stringToString);
	const DEFAULT_MATHML_TEXT_INTEGRATION_POINTS = freeze([
		"mi",
		"mo",
		"mn",
		"ms",
		"mtext"
	]);
	let MATHML_TEXT_INTEGRATION_POINTS = addToSet({}, DEFAULT_MATHML_TEXT_INTEGRATION_POINTS);
	const DEFAULT_HTML_INTEGRATION_POINTS = freeze(["annotation-xml"]);
	let HTML_INTEGRATION_POINTS = addToSet({}, DEFAULT_HTML_INTEGRATION_POINTS);
	const COMMON_SVG_AND_HTML_ELEMENTS = addToSet({}, [
		"title",
		"style",
		"font",
		"a",
		"script"
	]);
	let PARSER_MEDIA_TYPE = null;
	const SUPPORTED_PARSER_MEDIA_TYPES = ["application/xhtml+xml", "text/html"];
	const DEFAULT_PARSER_MEDIA_TYPE = "text/html";
	let transformCaseFunc = null;
	let CONFIG = null;
	const formElement = document.createElement("form");
	const isRegexOrFunction = function isRegexOrFunction(testValue) {
		return testValue instanceof RegExp || testValue instanceof Function;
	};
	/**
	* _parseConfig
	*
	* @param cfg optional config literal
	*/
	const _parseConfig = function _parseConfig() {
		let cfg = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
		if (CONFIG && CONFIG === cfg) return;
		if (!cfg || typeof cfg !== "object") cfg = {};
		cfg = clone(cfg);
		PARSER_MEDIA_TYPE = SUPPORTED_PARSER_MEDIA_TYPES.indexOf(cfg.PARSER_MEDIA_TYPE) === -1 ? DEFAULT_PARSER_MEDIA_TYPE : cfg.PARSER_MEDIA_TYPE;
		transformCaseFunc = PARSER_MEDIA_TYPE === "application/xhtml+xml" ? stringToString : stringToLowerCase;
		ALLOWED_TAGS = _resolveSetOption(cfg, "ALLOWED_TAGS", DEFAULT_ALLOWED_TAGS, { transform: transformCaseFunc });
		ALLOWED_ATTR = _resolveSetOption(cfg, "ALLOWED_ATTR", DEFAULT_ALLOWED_ATTR, { transform: transformCaseFunc });
		ALLOWED_NAMESPACES = _resolveSetOption(cfg, "ALLOWED_NAMESPACES", DEFAULT_ALLOWED_NAMESPACES, { transform: stringToString });
		URI_SAFE_ATTRIBUTES = _resolveSetOption(cfg, "ADD_URI_SAFE_ATTR", DEFAULT_URI_SAFE_ATTRIBUTES, {
			transform: transformCaseFunc,
			base: DEFAULT_URI_SAFE_ATTRIBUTES
		});
		DATA_URI_TAGS = _resolveSetOption(cfg, "ADD_DATA_URI_TAGS", DEFAULT_DATA_URI_TAGS, {
			transform: transformCaseFunc,
			base: DEFAULT_DATA_URI_TAGS
		});
		FORBID_CONTENTS = _resolveSetOption(cfg, "FORBID_CONTENTS", DEFAULT_FORBID_CONTENTS, { transform: transformCaseFunc });
		FORBID_TAGS = _resolveSetOption(cfg, "FORBID_TAGS", clone({}), { transform: transformCaseFunc });
		FORBID_ATTR = _resolveSetOption(cfg, "FORBID_ATTR", clone({}), { transform: transformCaseFunc });
		USE_PROFILES = objectHasOwnProperty(cfg, "USE_PROFILES") ? cfg.USE_PROFILES && typeof cfg.USE_PROFILES === "object" ? clone(cfg.USE_PROFILES) : cfg.USE_PROFILES : false;
		ALLOW_ARIA_ATTR = cfg.ALLOW_ARIA_ATTR !== false;
		ALLOW_DATA_ATTR = cfg.ALLOW_DATA_ATTR !== false;
		ALLOW_UNKNOWN_PROTOCOLS = cfg.ALLOW_UNKNOWN_PROTOCOLS || false;
		ALLOW_SELF_CLOSE_IN_ATTR = cfg.ALLOW_SELF_CLOSE_IN_ATTR !== false;
		SAFE_FOR_TEMPLATES = cfg.SAFE_FOR_TEMPLATES || false;
		SAFE_FOR_XML = cfg.SAFE_FOR_XML !== false;
		WHOLE_DOCUMENT = cfg.WHOLE_DOCUMENT || false;
		RETURN_DOM = cfg.RETURN_DOM || false;
		RETURN_DOM_FRAGMENT = cfg.RETURN_DOM_FRAGMENT || false;
		RETURN_TRUSTED_TYPE = cfg.RETURN_TRUSTED_TYPE || false;
		FORCE_BODY = cfg.FORCE_BODY || false;
		SANITIZE_DOM = cfg.SANITIZE_DOM !== false;
		SANITIZE_NAMED_PROPS = cfg.SANITIZE_NAMED_PROPS || false;
		KEEP_CONTENT = cfg.KEEP_CONTENT !== false;
		IN_PLACE = cfg.IN_PLACE || false;
		IS_ALLOWED_URI$1 = isRegex(cfg.ALLOWED_URI_REGEXP) ? cfg.ALLOWED_URI_REGEXP : IS_ALLOWED_URI;
		NAMESPACE = typeof cfg.NAMESPACE === "string" ? cfg.NAMESPACE : HTML_NAMESPACE;
		MATHML_TEXT_INTEGRATION_POINTS = _resolveObjectOption(cfg, "MATHML_TEXT_INTEGRATION_POINTS", () => addToSet({}, DEFAULT_MATHML_TEXT_INTEGRATION_POINTS));
		HTML_INTEGRATION_POINTS = _resolveObjectOption(cfg, "HTML_INTEGRATION_POINTS", () => addToSet({}, DEFAULT_HTML_INTEGRATION_POINTS));
		const customElementHandling = _resolveObjectOption(cfg, "CUSTOM_ELEMENT_HANDLING", () => create(null));
		CUSTOM_ELEMENT_HANDLING = create(null);
		if (objectHasOwnProperty(customElementHandling, "tagNameCheck") && isRegexOrFunction(customElementHandling.tagNameCheck)) CUSTOM_ELEMENT_HANDLING.tagNameCheck = customElementHandling.tagNameCheck;
		if (objectHasOwnProperty(customElementHandling, "attributeNameCheck") && isRegexOrFunction(customElementHandling.attributeNameCheck)) CUSTOM_ELEMENT_HANDLING.attributeNameCheck = customElementHandling.attributeNameCheck;
		if (objectHasOwnProperty(customElementHandling, "allowCustomizedBuiltInElements") && typeof customElementHandling.allowCustomizedBuiltInElements === "boolean") CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements = customElementHandling.allowCustomizedBuiltInElements;
		seal(CUSTOM_ELEMENT_HANDLING);
		if (SAFE_FOR_TEMPLATES) ALLOW_DATA_ATTR = false;
		if (RETURN_DOM_FRAGMENT) RETURN_DOM = true;
		if (USE_PROFILES) {
			ALLOWED_TAGS = addToSet({}, text);
			ALLOWED_ATTR = create(null);
			if (USE_PROFILES.html === true) {
				addToSet(ALLOWED_TAGS, html$1);
				addToSet(ALLOWED_ATTR, html);
			}
			if (USE_PROFILES.svg === true) {
				addToSet(ALLOWED_TAGS, svg$1);
				addToSet(ALLOWED_ATTR, svg);
				addToSet(ALLOWED_ATTR, xml);
			}
			if (USE_PROFILES.svgFilters === true) {
				addToSet(ALLOWED_TAGS, svgFilters);
				addToSet(ALLOWED_ATTR, svg);
				addToSet(ALLOWED_ATTR, xml);
			}
			if (USE_PROFILES.mathMl === true) {
				addToSet(ALLOWED_TAGS, mathMl$1);
				addToSet(ALLOWED_ATTR, mathMl);
				addToSet(ALLOWED_ATTR, xml);
			}
		}
		EXTRA_ELEMENT_HANDLING.tagCheck = null;
		EXTRA_ELEMENT_HANDLING.attributeCheck = null;
		if (objectHasOwnProperty(cfg, "ADD_TAGS")) {
			if (typeof cfg.ADD_TAGS === "function") EXTRA_ELEMENT_HANDLING.tagCheck = cfg.ADD_TAGS;
			else if (arrayIsArray(cfg.ADD_TAGS)) {
				if (ALLOWED_TAGS === DEFAULT_ALLOWED_TAGS) ALLOWED_TAGS = clone(ALLOWED_TAGS);
				addToSet(ALLOWED_TAGS, cfg.ADD_TAGS, transformCaseFunc);
			}
		}
		if (objectHasOwnProperty(cfg, "ADD_ATTR")) {
			if (typeof cfg.ADD_ATTR === "function") EXTRA_ELEMENT_HANDLING.attributeCheck = cfg.ADD_ATTR;
			else if (arrayIsArray(cfg.ADD_ATTR)) {
				if (ALLOWED_ATTR === DEFAULT_ALLOWED_ATTR) ALLOWED_ATTR = clone(ALLOWED_ATTR);
				addToSet(ALLOWED_ATTR, cfg.ADD_ATTR, transformCaseFunc);
			}
		}
		if (objectHasOwnProperty(cfg, "ADD_FORBID_CONTENTS") && arrayIsArray(cfg.ADD_FORBID_CONTENTS)) {
			if (FORBID_CONTENTS === DEFAULT_FORBID_CONTENTS) FORBID_CONTENTS = clone(FORBID_CONTENTS);
			addToSet(FORBID_CONTENTS, cfg.ADD_FORBID_CONTENTS, transformCaseFunc);
		}
		if (KEEP_CONTENT) ALLOWED_TAGS["#text"] = true;
		if (WHOLE_DOCUMENT) addToSet(ALLOWED_TAGS, [
			"html",
			"head",
			"body"
		]);
		if (ALLOWED_TAGS.table) {
			addToSet(ALLOWED_TAGS, ["tbody"]);
			delete FORBID_TAGS.tbody;
		}
		if (cfg.TRUSTED_TYPES_POLICY) {
			if (typeof cfg.TRUSTED_TYPES_POLICY.createHTML !== "function") throw typeErrorCreate("TRUSTED_TYPES_POLICY configuration option must provide a \"createHTML\" hook.");
			if (typeof cfg.TRUSTED_TYPES_POLICY.createScriptURL !== "function") throw typeErrorCreate("TRUSTED_TYPES_POLICY configuration option must provide a \"createScriptURL\" hook.");
			const previousTrustedTypesPolicy = trustedTypesPolicy;
			trustedTypesPolicy = cfg.TRUSTED_TYPES_POLICY;
			try {
				emptyHTML = _createTrustedHTML("");
			} catch (error) {
				trustedTypesPolicy = previousTrustedTypesPolicy;
				throw error;
			}
		} else if (cfg.TRUSTED_TYPES_POLICY === null) {
			trustedTypesPolicy = void 0;
			emptyHTML = "";
		} else {
			if (trustedTypesPolicy === void 0) trustedTypesPolicy = _getDefaultTrustedTypesPolicy();
			if (trustedTypesPolicy && typeof emptyHTML === "string") emptyHTML = _createTrustedHTML("");
		}
		if (freeze) freeze(cfg);
		CONFIG = cfg;
	};
	const ALL_SVG_TAGS = addToSet({}, [
		...svg$1,
		...svgFilters,
		...svgDisallowed
	]);
	const ALL_MATHML_TAGS = addToSet({}, [...mathMl$1, ...mathMlDisallowed]);
	/**
	* Namespace rules for an element in the SVG namespace.
	*
	* @param tagName the element's lowercase tag name
	* @param parent the (possibly simulated) parent node
	* @param parentTagName the parent's lowercase tag name
	* @returns true if a spec-compliant parser could produce this element
	*/
	const _checkSvgNamespace = function _checkSvgNamespace(tagName, parent, parentTagName) {
		if (parent.namespaceURI === HTML_NAMESPACE) return tagName === "svg";
		if (parent.namespaceURI === MATHML_NAMESPACE) return tagName === "svg" && (parentTagName === "annotation-xml" || MATHML_TEXT_INTEGRATION_POINTS[parentTagName]);
		return Boolean(ALL_SVG_TAGS[tagName]);
	};
	/**
	* Namespace rules for an element in the MathML namespace.
	*
	* @param tagName the element's lowercase tag name
	* @param parent the (possibly simulated) parent node
	* @param parentTagName the parent's lowercase tag name
	* @returns true if a spec-compliant parser could produce this element
	*/
	const _checkMathMlNamespace = function _checkMathMlNamespace(tagName, parent, parentTagName) {
		if (parent.namespaceURI === HTML_NAMESPACE) return tagName === "math";
		if (parent.namespaceURI === SVG_NAMESPACE) return tagName === "math" && HTML_INTEGRATION_POINTS[parentTagName];
		return Boolean(ALL_MATHML_TAGS[tagName]);
	};
	/**
	* Namespace rules for an element in the HTML namespace.
	*
	* @param tagName the element's lowercase tag name
	* @param parent the (possibly simulated) parent node
	* @param parentTagName the parent's lowercase tag name
	* @returns true if a spec-compliant parser could produce this element
	*/
	const _checkHtmlNamespace = function _checkHtmlNamespace(tagName, parent, parentTagName) {
		if (parent.namespaceURI === SVG_NAMESPACE && !HTML_INTEGRATION_POINTS[parentTagName]) return false;
		if (parent.namespaceURI === MATHML_NAMESPACE && !MATHML_TEXT_INTEGRATION_POINTS[parentTagName]) return false;
		return !ALL_MATHML_TAGS[tagName] && (COMMON_SVG_AND_HTML_ELEMENTS[tagName] || !ALL_SVG_TAGS[tagName]);
	};
	/**
	* @param element a DOM element whose namespace is being checked
	* @returns Return false if the element has a
	*  namespace that a spec-compliant parser would never
	*  return. Return true otherwise.
	*/
	const _checkValidNamespace = function _checkValidNamespace(element) {
		let parent = getParentNode(element);
		if (!parent || !parent.tagName) parent = {
			namespaceURI: NAMESPACE,
			tagName: "template"
		};
		const tagName = stringToLowerCase(element.tagName);
		const parentTagName = stringToLowerCase(parent.tagName);
		if (!ALLOWED_NAMESPACES[element.namespaceURI]) return false;
		if (element.namespaceURI === SVG_NAMESPACE) return _checkSvgNamespace(tagName, parent, parentTagName);
		if (element.namespaceURI === MATHML_NAMESPACE) return _checkMathMlNamespace(tagName, parent, parentTagName);
		if (element.namespaceURI === HTML_NAMESPACE) return _checkHtmlNamespace(tagName, parent, parentTagName);
		if (PARSER_MEDIA_TYPE === "application/xhtml+xml" && ALLOWED_NAMESPACES[element.namespaceURI]) return true;
		return false;
	};
	/**
	* _forceRemove
	*
	* @param node a DOM node
	*/
	const _forceRemove = function _forceRemove(node) {
		arrayPush(DOMPurify.removed, { element: node });
		try {
			getParentNode(node).removeChild(node);
		} catch (_) {
			remove(node);
			if (!getParentNode(node)) throw typeErrorCreate("a node selected for removal could not be detached from its tree and cannot be safely returned; refusing to sanitize in place");
		}
	};
	/**
	* _stripAttributeNode
	*
	* Remove a single Attr node case/namespace-exactly on an attribute-teardown
	* path. Name-based removeAttribute() ASCII-lowercases its lookup key for an
	* HTML element in an HTML document and so silently misses a case-preserved
	* handler (e.g. `ONERROR` off an XML/XHTML import) - the same defect
	* _removeAttribute() was fixed for, which a name-based call would reintroduce
	* on these IN_PLACE teardown paths. Unlike _removeAttribute this does not
	* record into DOMPurify.removed: the neutralize passes intentionally do not
	* book-keep. A clobbered/detached node falls back to best-effort name-based
	* removal.
	*
	* @param element the element to strip the attribute from
	* @param attribute the Attr node to remove
	* @param name the attribute's name, for the fallback path
	*/
	const _stripAttributeNode = function _stripAttributeNode(element, attribute, name) {
		try {
			element.removeAttributeNode(attribute);
		} catch (_) {
			try {
				element.removeAttribute(name);
			} catch (_) {}
		}
	};
	/**
	* _neutralizeRoot
	*
	* Fail-closed teardown of an in-place root after the sanitize walk aborts
	* (campaign-3 F2). An internal throw mid-walk — e.g. a page-registered
	* custom element's reaction detaches a node so `_forceRemove`'s deliberate
	* parentless guard throws, or any other re-entrant engine mutation — would
	* otherwise leave the caller's *live* tree half-sanitized, with everything
	* after the abort point still carrying its handlers. There is no safe way
	* to resume the walk (the tree mutated under us), so we strip the root bare:
	* remove every child and every attribute, then let the caller's catch see
	* the original error. Clobber-safe (cached `remove`/`childNodes`/`attributes`
	* getters; the root was already clobber-pre-flighted at the IN_PLACE entry).
	*
	* @param root the in-place root to empty
	*/
	const _neutralizeRoot = function _neutralizeRoot(root) {
		_neutralizeSubtree(root);
		const childNodes = getChildNodes(root);
		if (childNodes) {
			const snapshot = [];
			arrayForEach(childNodes, (child) => {
				arrayPush(snapshot, child);
			});
			arrayForEach(snapshot, (child) => {
				try {
					remove(child);
				} catch (_) {}
			});
		}
		const attributes = getAttributes(root);
		if (attributes) for (let i = attributes.length - 1; i >= 0; --i) {
			const attribute = attributes[i];
			const name = attribute && attribute.name;
			if (typeof name === "string") _stripAttributeNode(root, attribute, name);
		}
	};
	/**
	* _removeAttribute
	*
	* Name-based getAttributeNode()/removeAttribute() ASCII-lowercase their
	* lookup key for HTML elements in an HTML document, so they silently miss an
	* attribute whose stored qualified name still contains uppercase ASCII
	* letters. That happens when the node came from a case-preserving source
	* (an XML/XHTML document imported via importNode(), or createAttributeNS()),
	* where e.g. `ONERROR` survives the walk: the policy check lowercases to
	* `onerror` and rejects it, but `removeAttribute('ONERROR')` looks up
	* `onerror` and finds nothing. Remove the exact Attr node instead, which is
	* case- and namespace-exact, and fall back to name-based removal only when
	* the caller could not supply the node.
	*
	* @param name an Attribute name
	* @param element a DOM node
	* @param attr the exact Attr node to remove, when the caller has it
	*/
	const _removeAttribute = function _removeAttribute(name, element, attr) {
		if (!attr) try {
			attr = element.getAttributeNode(name);
		} catch (_) {
			attr = null;
		}
		arrayPush(DOMPurify.removed, {
			attribute: attr || null,
			from: element
		});
		try {
			if (attr) element.removeAttributeNode(attr);
			else element.removeAttribute(name);
		} catch (_) {
			try {
				element.removeAttribute(name);
			} catch (_) {}
		}
		if (name === "is") {
			if (RETURN_DOM || RETURN_DOM_FRAGMENT) try {
				_forceRemove(element);
			} catch (_) {}
			else try {
				element.setAttribute(name, "");
			} catch (_) {}
		}
	};
	/**
	* _stripDisallowedAttributes
	*
	* Removes every attribute the active configuration does not allow from a
	* single element, using the same allowlist as the main attribute pass (so
	* `on*` handlers go, but no `/^on/` blocklist is introduced). Used only to
	* neutralise nodes that are being discarded from an in-place tree.
	*
	* @param element the element to strip
	*/
	const _stripDisallowedAttributes = function _stripDisallowedAttributes(element) {
		const attributes = getAttributes(element);
		if (!attributes) return;
		for (let i = attributes.length - 1; i >= 0; --i) {
			const attribute = attributes[i];
			const name = attribute && attribute.name;
			if (typeof name !== "string" || ALLOWED_ATTR[transformCaseFunc(name)]) continue;
			_stripAttributeNode(element, attribute, name);
		}
	};
	/**
	* _neutralizeSubtree
	*
	* Completes the audit-5 F1 fix across every removal path. The KEEP_CONTENT
	* move-hoist neutralises only disallowed-tag removals; clobber, mXSS-canary,
	* namespace, comment, processing-instruction and KEEP_CONTENT:false removals
	* all drop their subtree wholesale via `_forceRemove`. On the IN_PLACE path
	* those dropped nodes are detached from the caller's LIVE tree but a
	* handler-bearing original among them (an `<img onerror>`/`<video>` that was
	* loading) keeps its queued resource event, which fires in page scope after
	* sanitize returns. This walks a removed subtree and strips every attribute
	* the active configuration does not allow — so `on*` handlers are cancelled
	* through the SAME allowlist that governs kept nodes, not a separate `/^on/`
	* blocklist. Run synchronously before sanitize returns, i.e. before any
	* queued event can fire. Hook-free by design: these nodes leave the output,
	* so firing attribute hooks for them would be surprising. Clobber-safe reads;
	* a doomed clobbered node may shadow `removeAttribute` (its own attributes are
	* irrelevant — it is discarded — while its non-clobbered descendants, e.g.
	* the `<img>`, are reached and scrubbed).
	*
	* @param root the root of a removed subtree to neutralise
	*/
	const _neutralizeSubtree = function _neutralizeSubtree(root) {
		const stack = [root];
		while (stack.length > 0) {
			const node = stack.pop();
			if (_readNodeType(node) === NODE_TYPE.element) _stripDisallowedAttributes(node);
			const childNodes = getChildNodes(node);
			if (childNodes) for (let i = childNodes.length - 1; i >= 0; --i) stack.push(childNodes[i]);
		}
	};
	/**
	* _neutralizePatchLinkage
	*
	* IN_PLACE entry pre-pass (declarative-partial-updates / streaming
	* hardening, https://github.com/WICG/declarative-partial-updates).
	*
	* The main walk strips patch linkage (`for`/`patchsrc`) and removes range
	* markers (PIs / markup comments) node-by-node, in document order, AS it
	* reaches each node. On a live in-place root that leaves a window: from the
	* moment the root is connected until the walk arrives at a given node, that
	* node's linkage is live. A patch applied on connection/stream can fire as
	* a microtask during the walk and inject or teleport an unsanitized DOM
	* range into a region the iterator has already passed and will not revisit,
	* so the post-return "tree is sanitized" contract is violated. Sweep the
	* whole tree once up front and sever every linkage before the walk begins,
	* closing that window.
	*
	* This CANNOT undo a patch that already fired before sanitize ran — that is
	* the irreducible "do not IN_PLACE a live-connected attacker tree" caveat —
	* but it closes everything from sanitize-start onward. Gated on SAFE_FOR_XML
	* to group with the rest of the declarative-partial-updates handling and
	* stay overridable, consistent with the codebase.
	*
	* Clobber-safe traversal (cached childNodes getter); per-node try/catch so a
	* clobbered root cannot defeat the sweep of its non-clobbered descendants.
	*
	* NOTE (pending real-Chrome confirmation, see test/declarative-patch-probe
	* .html Q1): this mirrors the existing policy of keeping `for` on
	* <label>/<output>. If the shipping feature can drive a patch through a
	* surviving `for`-on-label/output + `id` pair, this pre-pass and the
	* attribute check at _isBasicCustomElement's caller must additionally drop
	* that pair on the IN_PLACE path. Left as-is until the taxonomy is verified.
	*
	* @param root the in-place root to sweep
	*/
	/**
	* Central policy for declarative-partial-updates patch-linkage attributes,
	* shared by the _neutralizePatchLinkage pre-pass and _isValidAttribute so
	* the two sites cannot drift: `patchsrc` always links, `for` links
	* everywhere except on <label>/<output>, and the whole policy is gated on
	* SAFE_FOR_XML (see the rationale block in _isValidAttribute).
	*
	* @param lcName the transformCaseFunc'd attribute name
	* @param lcTag the transformCaseFunc'd tag name of the carrying element
	* @return true if the attribute is patch linkage and must be dropped
	*/
	const _isPatchLinkageAttribute = function _isPatchLinkageAttribute(lcName, lcTag) {
		if (!SAFE_FOR_XML) return false;
		if (lcName === "patchsrc") return true;
		return lcName === "for" && lcTag !== "label" && lcTag !== "output";
	};
	const _neutralizePatchLinkage = function _neutralizePatchLinkage(root) {
		if (!SAFE_FOR_XML) return;
		const stack = [root];
		while (stack.length > 0) {
			const node = stack.pop();
			const nodeType = _readNodeType(node);
			if (nodeType === NODE_TYPE.processingInstruction || nodeType === NODE_TYPE.comment && regExpTest(COMMENT_MARKUP_PROBE, node.data)) {
				try {
					remove(node);
				} catch (_) {}
				continue;
			}
			if (nodeType === NODE_TYPE.element) {
				const element = node;
				const lcTag = transformCaseFunc(_readNodeName(node));
				try {
					if (element.hasAttribute && element.hasAttribute("patchsrc")) element.removeAttribute("patchsrc");
					if (element.hasAttribute && element.hasAttribute("for") && _isPatchLinkageAttribute("for", lcTag)) element.removeAttribute("for");
				} catch (_) {}
			}
			const childNodes = getChildNodes(node);
			if (childNodes) for (let i = childNodes.length - 1; i >= 0; --i) stack.push(childNodes[i]);
		}
	};
	/**
	* _initDocument
	*
	* @param dirty - a string of dirty markup
	* @return a DOM, filled with the dirty markup
	*/
	const _initDocument = function _initDocument(dirty) {
		let doc = null;
		let leadingWhitespace = null;
		if (FORCE_BODY) dirty = "<remove></remove>" + dirty;
		else {
			const matches = stringMatch(dirty, /^[\r\n\t ]+/);
			leadingWhitespace = matches && matches[0];
		}
		if (PARSER_MEDIA_TYPE === "application/xhtml+xml" && NAMESPACE === HTML_NAMESPACE) dirty = "<html xmlns=\"http://www.w3.org/1999/xhtml\"><head></head><body>" + dirty + "</body></html>";
		const dirtyPayload = trustedTypesPolicy ? _createTrustedHTML(dirty) : dirty;
		if (NAMESPACE === HTML_NAMESPACE) try {
			doc = new DOMParser().parseFromString(dirtyPayload, PARSER_MEDIA_TYPE);
		} catch (_) {}
		if (!doc || !doc.documentElement) {
			doc = implementation.createDocument(NAMESPACE, "template", null);
			try {
				doc.documentElement.innerHTML = IS_EMPTY_INPUT ? emptyHTML : dirtyPayload;
			} catch (_) {}
		}
		const body = doc.body || doc.documentElement;
		if (dirty && leadingWhitespace) body.insertBefore(document.createTextNode(leadingWhitespace), body.childNodes[0] || null);
		if (NAMESPACE === HTML_NAMESPACE) return getElementsByTagName.call(doc, WHOLE_DOCUMENT ? "html" : "body")[0];
		return WHOLE_DOCUMENT ? doc.documentElement : body;
	};
	/**
	* Creates a NodeIterator object that you can use to traverse filtered lists of nodes or elements in a document.
	*
	* @param root The root element or node to start traversing on.
	* @return The created NodeIterator
	*/
	const _createNodeIterator = function _createNodeIterator(root) {
		const doc = getOwnerDocument ? getOwnerDocument(root) : root.ownerDocument;
		return createNodeIterator.call(doc || root, root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT | NodeFilter.SHOW_TEXT | NodeFilter.SHOW_PROCESSING_INSTRUCTION | NodeFilter.SHOW_CDATA_SECTION, null);
	};
	/**
	* Replace template expression syntax (mustache, ERB, template
	* literal) with a space; shared by all SAFE_FOR_TEMPLATES scrub
	* sites. Order matters: mustache, then ERB, then template literal.
	*
	* @param value the string to scrub
	* @returns the scrubbed string
	*/
	const _stripTemplateExpressions = function _stripTemplateExpressions(value) {
		value = stringReplace(value, MUSTACHE_EXPR$1, " ");
		value = stringReplace(value, ERB_EXPR$1, " ");
		value = stringReplace(value, TMPLIT_EXPR$1, " ");
		return value;
	};
	/**
	* Strip template-engine expressions ({{...}}, ${...}, <%...%>) from the
	* character data of an element subtree. Used as the final safety net for
	* SAFE_FOR_TEMPLATES on every DOM-returning code path so that expressions
	* which only form after text-node normalization (e.g. fragments split across
	* stripped elements) cannot survive into a template-evaluating framework.
	*
	* Walks text/comment/CDATA/processing-instruction nodes and mutates `.data`
	* in place rather than round-tripping through innerHTML. This preserves
	* descendant node references (important for IN_PLACE callers), avoids a
	* serialize/reparse cycle, and reads literal character data — which means
	* `<%...%>` in text content matches the ERB regex against its real bytes
	* instead of the HTML-entity-escaped form innerHTML would produce.
	*
	* Attribute values are not visited here; SAFE_FOR_TEMPLATES handling for
	* attributes is performed during the per-node `_sanitizeAttributes` pass.
	*
	* @param node The root element whose character data should be scrubbed.
	*/
	const _scrubTemplateExpressions2 = function _scrubTemplateExpressions(node) {
		var _node$querySelectorAl;
		node.normalize();
		const doc = getOwnerDocument ? getOwnerDocument(node) : node.ownerDocument;
		const walker = createNodeIterator.call(doc || node, node, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_COMMENT | NodeFilter.SHOW_CDATA_SECTION | NodeFilter.SHOW_PROCESSING_INSTRUCTION, null);
		let currentNode = walker.nextNode();
		while (currentNode) {
			currentNode.data = _stripTemplateExpressions(currentNode.data);
			currentNode = walker.nextNode();
		}
		const templates = (_node$querySelectorAl = node.querySelectorAll) === null || _node$querySelectorAl === void 0 ? void 0 : _node$querySelectorAl.call(node, "template");
		if (templates) arrayForEach(templates, (tmpl) => {
			if (_isDocumentFragment(tmpl.content)) _scrubTemplateExpressions2(tmpl.content);
		});
	};
	/**
	* _isClobbered
	*
	* Detect DOM-clobbering on HTMLFormElement nodes. Form is the only HTML
	* interface with [LegacyOverrideBuiltIns]; a descendant element with a
	* `name` attribute matching a prototype property shadows that property
	* on direct reads. We use this check at the IN_PLACE entry-point and
	* during attribute sanitization to refuse clobbered forms.
	*
	* @param element element to check for clobbering attacks
	* @return true if clobbered, false if safe
	*/
	const _isClobbered = function _isClobbered(element) {
		const realTagName = getNodeName ? getNodeName(element) : null;
		if (typeof realTagName !== "string") return false;
		if (transformCaseFunc(realTagName) !== "form") return false;
		return typeof element.nodeName !== "string" || typeof element.textContent !== "string" || typeof element.removeChild !== "function" || element.attributes !== getAttributes(element) || typeof element.removeAttribute !== "function" || typeof element.setAttribute !== "function" || typeof element.namespaceURI !== "string" || typeof element.insertBefore !== "function" || typeof element.hasChildNodes !== "function" || element.nodeType !== getNodeType(element) || element.childNodes !== getChildNodes(element);
	};
	/**
	* Checks whether the given value is a DocumentFragment from any realm.
	*
	* The realm-independent replacement reads `nodeType` through the cached
	* Node.prototype getter and compares to the DOCUMENT_FRAGMENT_NODE
	* constant (11). nodeType is a numeric value resolved from the node's
	* internal slot, identical across realms for the same kind of node.
	*
	* @param value object to check
	* @return true if value is a DocumentFragment-shaped node from any realm
	*/
	const _isDocumentFragment = function _isDocumentFragment(value) {
		if (!getNodeType || typeof value !== "object" || value === null) return false;
		try {
			return getNodeType(value) === NODE_TYPE.documentFragment;
		} catch (_) {
			return false;
		}
	};
	/**
	* Checks whether the given object is a DOM node, including nodes that
	* originate from a different window/realm (e.g. an iframe's
	* contentDocument). The previous `value instanceof Node` check was
	* realm-bound: nodes from a different window failed it, causing
	* sanitize() to silently stringify them and reset IN_PLACE to false,
	* returning the original node unsanitized. See GHSA-4w3q-35jp-p934.
	*
	* @param value object to check whether it's a DOM node
	* @return true if value is a DOM node from any realm
	*/
	const _isNode = function _isNode(value) {
		if (!getNodeType || typeof value !== "object" || value === null) return false;
		try {
			return typeof getNodeType(value) === "number";
		} catch (_) {
			return false;
		}
	};
	function _executeHooks(hooks, currentNode, data) {
		if (hooks.length === 0) return;
		arrayForEach(hooks, (hook) => {
			hook.call(DOMPurify, currentNode, data, CONFIG);
		});
	}
	/**
	* Structural-threat checks that condemn a node regardless of the
	* allowlists: mXSS via namespace confusion, risky CSS construction,
	* processing instructions, markup-bearing comments. Pure predicate;
	* the caller removes. Check order is load-bearing.
	*
	* @param currentNode the node to inspect
	* @param tagName the node's transformCaseFunc'd tag name
	* @return true if the node must be removed
	*/
	const _isUnsafeNode = function _isUnsafeNode(currentNode, tagName) {
		if (SAFE_FOR_XML && currentNode.hasChildNodes() && !_isNode(currentNode.firstElementChild) && regExpTest(ELEMENT_MARKUP_PROBE, currentNode.textContent) && regExpTest(ELEMENT_MARKUP_PROBE, currentNode.innerHTML)) return true;
		if (SAFE_FOR_XML && currentNode.namespaceURI === HTML_NAMESPACE && LITERAL_TEXT_ELEMENTS[tagName] && (_isNode(currentNode.firstElementChild) || typeof currentNode.textContent === "string" && regExpTest(LITERAL_TEXT_CLOSE[tagName], currentNode.textContent))) return true;
		if (currentNode.nodeType === NODE_TYPE.processingInstruction) return true;
		if (SAFE_FOR_XML && currentNode.nodeType === NODE_TYPE.comment && regExpTest(COMMENT_MARKUP_PROBE, currentNode.data)) return true;
		return false;
	};
	/**
	* Evaluate a CUSTOM_ELEMENT_HANDLING check (a RegExp or a predicate
	* function, per the validation in _parseConfig) against a name.
	* Additional arguments are forwarded to predicate functions - the
	* attributeNameCheck predicate receives the tag name as its second
	* argument. A null/absent check never matches.
	*
	* @param check the configured tagNameCheck / attributeNameCheck value
	* @param name the name to test
	* @param args extra arguments forwarded to a predicate function
	* @return true if the check matches the name
	*/
	const _matchesNameCheck = function _matchesNameCheck(check, name) {
		if (check instanceof RegExp) return regExpTest(check, name);
		if (check instanceof Function) {
			for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) args[_key - 2] = arguments[_key];
			return Boolean(check(name, ...args));
		}
		return false;
	};
	/**
	* Handle a node whose tag is forbidden or not allowlisted: keep
	* allowed custom elements (false return exits _sanitizeElements
	* early - the namespace and fallback-tag removal checks are
	* intentionally skipped for kept custom elements), else hoist
	* content per KEEP_CONTENT and remove.
	*
	* A kept custom element is the ONLY case in which this function
	* returns false, so the caller uses that return value to run the
	* afterSanitizeElements hook on the kept element and keep the
	* element-hook lifecycle consistent with normal allowlisted
	* elements (GHSA-c2j3-45gr-mqc4).
	*
	* @param currentNode the disallowed node
	* @param tagName the node's transformCaseFunc'd tag name
	* @return true if the node was removed, false if kept
	*/
	const _sanitizeDisallowedNode = function _sanitizeDisallowedNode(currentNode, tagName, root) {
		if (!FORBID_TAGS[tagName] && _isBasicCustomElement(tagName) && _matchesNameCheck(CUSTOM_ELEMENT_HANDLING.tagNameCheck, tagName)) return false;
		if (KEEP_CONTENT && !FORBID_CONTENTS[tagName]) {
			const parentNode = getParentNode(currentNode);
			const childNodes = getChildNodes(currentNode);
			if (childNodes && parentNode) {
				const childCount = childNodes.length;
				for (let i = childCount - 1; i >= 0; --i) {
					const hoisted = currentNode === root ? cloneNode(childNodes[i], true) : childNodes[i];
					parentNode.insertBefore(hoisted, getNextSibling(currentNode));
				}
			}
		}
		_forceRemove(currentNode);
		return true;
	};
	/**
	* Fork a hook-mutable allowlist off its shared binding the first time a
	* (possibly lazily-installed) uponSanitize* hook is about to see it, so the
	* hook cannot widen the per-instance default or the setConfig binding by
	* reference and leak past the call. Returns the set unchanged once it is
	* already call-local, so repeated calls across elements are idempotent.
	*
	* @param hookList the uponSanitize* hook array for this event
	* @param set the current ALLOWED_TAGS / ALLOWED_ATTR binding
	* @param defaultSet the per-instance DEFAULT_ALLOWED_* constant
	* @param setConfigSet the captured setConfig() binding, or null
	* @return a call-local clone if a hook is present and set is still shared,
	*   else set unchanged
	*/
	const _forkSharedAllowlist = function _forkSharedAllowlist(hookList, set, defaultSet, setConfigSet) {
		if (hookList.length === 0) return set;
		return set === defaultSet || set === setConfigSet ? clone(set) : set;
	};
	/**
	* Shared guard for a node that a hook has detached from the walk tree,
	* used after each element-hook site in _sanitizeElements. Detaching is a
	* long-standing user pattern (issue #469; draw.io-style foreignObject
	* filtering). Per the cached, unclobberable parentNode getter the node is
	* genuinely out of the tree, so it can reach neither the serialized
	* output nor an IN_PLACE live tree; treat it as removed and stop
	* processing it. Without this guard, the unsafe-node / namespace checks
	* would call _forceRemove on a parentless node and hit the REPORT-3
	* fail-closed throw — which exists for nodes DOMPurify wants gone but
	* *cannot* detach (clobbered / parentless roots), the opposite of a node
	* that is already safely gone. The walk root is exempt: a detached
	* IN_PLACE root is legitimate input and must still be fully sanitized,
	* and a kill-decision on it must keep hitting the REPORT-3 throw.
	*
	* Nodes detached by hooks stay the hook's responsibility for placement:
	* they are not recorded in DOMPurify.removed, so the post-walk IN_PLACE
	* pass (which iterates DOMPurify.removed) does not reach them. But a
	* hook-detached subtree can still hold a queued resource-event handler -
	* e.g. an <img onload> that began loading when the caller built the live
	* tree - which fires in page scope after sanitize returns even though the
	* handler never reached the returned tree. That is the audit-5 F1 hazard,
	* and the documented node.remove() hook pattern walks straight into it.
	* So on the IN_PLACE path we neutralize the detached subtree inline,
	* stripping its non-allow-listed attributes before returning, exactly as
	* the post-walk pass does for _forceRemove'd subtrees.
	*
	* @param currentNode the node a hook may have detached
	* @param root the current walk root
	* @return true if the node is detached and now handled, false otherwise
	*/
	const _handleHookDetachedNode = function _handleHookDetachedNode(currentNode, root) {
		if (currentNode === root || getParentNode(currentNode) !== null) return false;
		if (IN_PLACE) _neutralizeSubtree(currentNode);
		return true;
	};
	/**
	* _sanitizeElements
	*
	* @protect nodeName
	* @protect textContent
	* @protect removeChild
	* @param currentNode to check for permission to exist
	* @return true if node was killed, false if left alive
	*/
	const _sanitizeElements = function _sanitizeElements(currentNode, root) {
		_executeHooks(hooks.beforeSanitizeElements, currentNode, null);
		if (_handleHookDetachedNode(currentNode, root)) return true;
		if (_isClobbered(currentNode)) {
			_forceRemove(currentNode);
			return true;
		}
		const tagName = transformCaseFunc(_readNodeName(currentNode));
		ALLOWED_TAGS = _forkSharedAllowlist(hooks.uponSanitizeElement, ALLOWED_TAGS, DEFAULT_ALLOWED_TAGS, SET_CONFIG_ALLOWED_TAGS);
		_executeHooks(hooks.uponSanitizeElement, currentNode, {
			tagName,
			allowedTags: ALLOWED_TAGS
		});
		if (_handleHookDetachedNode(currentNode, root)) return true;
		if (_isUnsafeNode(currentNode, tagName)) {
			_forceRemove(currentNode);
			return true;
		}
		if (FORBID_TAGS[tagName] || !(EXTRA_ELEMENT_HANDLING.tagCheck instanceof Function && EXTRA_ELEMENT_HANDLING.tagCheck(tagName)) && !ALLOWED_TAGS[tagName]) {
			const removed = _sanitizeDisallowedNode(currentNode, tagName, root);
			if (removed === false) _executeHooks(hooks.afterSanitizeElements, currentNode, null);
			return removed;
		}
		if (_readNodeType(currentNode) === NODE_TYPE.element && !_checkValidNamespace(currentNode)) {
			_forceRemove(currentNode);
			return true;
		}
		if ((tagName === "noscript" || tagName === "noembed" || tagName === "noframes") && regExpTest(FALLBACK_TAG_CLOSE, currentNode.innerHTML)) {
			_forceRemove(currentNode);
			return true;
		}
		if (SAFE_FOR_TEMPLATES && currentNode.nodeType === NODE_TYPE.text) {
			const content = _stripTemplateExpressions(currentNode.textContent);
			if (currentNode.textContent !== content) {
				arrayPush(DOMPurify.removed, { element: currentNode.cloneNode() });
				currentNode.textContent = content;
			}
		}
		_executeHooks(hooks.afterSanitizeElements, currentNode, null);
		return false;
	};
	/**
	* _isValidAttribute
	*
	* @param lcTag Lowercase tag name of containing element.
	* @param lcName Lowercase attribute name.
	* @param value Attribute value.
	* @return Returns true if `value` is valid, otherwise false.
	*/
	const _isValidAttribute = function _isValidAttribute(lcTag, lcName, value) {
		if (FORBID_ATTR[lcName]) return false;
		if (_isPatchLinkageAttribute(lcName, lcTag)) return false;
		if (SANITIZE_DOM && (lcName === "id" || lcName === "name") && (value in document || value in formElement)) return false;
		const nameIsPermitted = ALLOWED_ATTR[lcName] || EXTRA_ELEMENT_HANDLING.attributeCheck instanceof Function && EXTRA_ELEMENT_HANDLING.attributeCheck(lcName, lcTag);
		if (ALLOW_DATA_ATTR && regExpTest(DATA_ATTR$1, lcName)) return true;
		if (ALLOW_ARIA_ATTR && regExpTest(ARIA_ATTR$1, lcName)) return true;
		if (!nameIsPermitted) return _isBasicCustomElement(lcTag) && _matchesNameCheck(CUSTOM_ELEMENT_HANDLING.tagNameCheck, lcTag) && _matchesNameCheck(CUSTOM_ELEMENT_HANDLING.attributeNameCheck, lcName, lcTag) || lcName === "is" && CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements && _matchesNameCheck(CUSTOM_ELEMENT_HANDLING.tagNameCheck, value);
		if (URI_SAFE_ATTRIBUTES[lcName]) return true;
		if (regExpTest(IS_ALLOWED_URI$1, stringReplace(value, ATTR_WHITESPACE$1, ""))) return true;
		if ((lcName === "src" || lcName === "xlink:href" || lcName === "href") && lcTag !== "script" && stringIndexOf(value, "data:") === 0 && DATA_URI_TAGS[lcTag]) return true;
		if (ALLOW_UNKNOWN_PROTOCOLS && !regExpTest(IS_SCRIPT_OR_DATA$1, stringReplace(value, ATTR_WHITESPACE$1, ""))) return true;
		return !value;
	};
	const RESERVED_CUSTOM_ELEMENT_NAMES = addToSet({}, [
		"annotation-xml",
		"color-profile",
		"font-face",
		"font-face-format",
		"font-face-name",
		"font-face-src",
		"font-face-uri",
		"missing-glyph"
	]);
	/**
	* _isBasicCustomElement
	* checks if at least one dash is included in tagName, and it's not the first char
	* for more sophisticated checking see https://github.com/sindresorhus/validate-element-name
	*
	* @param tagName name of the tag of the node to sanitize
	* @returns Returns true if the tag name meets the basic criteria for a custom element, otherwise false.
	*/
	const _isBasicCustomElement = function _isBasicCustomElement(tagName) {
		return !RESERVED_CUSTOM_ELEMENT_NAMES[stringToLowerCase(tagName)] && regExpTest(CUSTOM_ELEMENT$1, tagName);
	};
	/**
	* Wrap an attribute value in the matching Trusted Types object when
	* the active policy requires it. Namespaced attributes pass through
	* unchanged (no TT support yet, see
	* https://bugs.chromium.org/p/chromium/issues/detail?id=1305293).
	*
	* @param lcTag lowercase tag name of the containing element
	* @param lcName lowercase attribute name
	* @param namespaceURI the attribute's namespace, if any
	* @param value the attribute value to wrap
	* @return the value, wrapped when Trusted Types demand it
	*/
	const _applyTrustedTypesToAttribute = function _applyTrustedTypesToAttribute(lcTag, lcName, namespaceURI, value) {
		if (trustedTypesPolicy && typeof trustedTypes === "object" && typeof trustedTypes.getAttributeType === "function" && !namespaceURI) switch (trustedTypes.getAttributeType(lcTag, lcName)) {
			case "TrustedHTML": return _createTrustedHTML(value);
			case "TrustedScriptURL": return _createTrustedScriptURL(value);
		}
		return value;
	};
	/**
	* Write a modified attribute value back onto the element. On
	* success, re-probe for clobbering introduced by the new value and
	* remove the element when found; otherwise pop the removal entry
	* recorded by the earlier _removeAttribute (long-standing pairing
	* with the SANITIZE_NAMED_PROPS path - do not "fix" casually). On
	* failure, remove the attribute instead.
	*
	* @param currentNode the element carrying the attribute
	* @param name the attribute name as present on the element
	* @param namespaceURI the attribute's namespace, if any
	* @param value the new attribute value
	*/
	const _setAttributeValue = function _setAttributeValue(currentNode, name, namespaceURI, value) {
		try {
			if (namespaceURI) currentNode.setAttributeNS(namespaceURI, name, value);
			else currentNode.setAttribute(name, value);
			if (_isClobbered(currentNode)) _forceRemove(currentNode);
			else arrayPop(DOMPurify.removed);
		} catch (_) {
			_removeAttribute(name, currentNode);
		}
	};
	/**
	* _sanitizeAttributes
	*
	* @protect attributes
	* @protect nodeName
	* @protect removeAttribute
	* @protect setAttribute
	*
	* @param currentNode to sanitize
	*/
	const _sanitizeAttributes = function _sanitizeAttributes(currentNode) {
		_executeHooks(hooks.beforeSanitizeAttributes, currentNode, null);
		const attributes = currentNode.attributes;
		if (!attributes || _isClobbered(currentNode)) return;
		ALLOWED_ATTR = _forkSharedAllowlist(hooks.uponSanitizeAttribute, ALLOWED_ATTR, DEFAULT_ALLOWED_ATTR, SET_CONFIG_ALLOWED_ATTR);
		const hookEvent = {
			attrName: "",
			attrValue: "",
			keepAttr: true,
			allowedAttributes: ALLOWED_ATTR,
			forceKeepAttr: void 0
		};
		let l = attributes.length;
		const lcTag = transformCaseFunc(currentNode.nodeName);
		while (l--) {
			const attr = attributes[l];
			const name = attr.name, namespaceURI = attr.namespaceURI, attrValue = attr.value;
			const lcName = transformCaseFunc(name);
			const initValue = attrValue;
			let value = name === "value" ? initValue : stringTrim(initValue);
			hookEvent.attrName = lcName;
			hookEvent.attrValue = value;
			hookEvent.keepAttr = true;
			hookEvent.forceKeepAttr = void 0;
			_executeHooks(hooks.uponSanitizeAttribute, currentNode, hookEvent);
			value = hookEvent.attrValue;
			if (SANITIZE_NAMED_PROPS && (lcName === "id" || lcName === "name") && stringIndexOf(value, SANITIZE_NAMED_PROPS_PREFIX) !== 0) {
				_removeAttribute(name, currentNode, attr);
				value = SANITIZE_NAMED_PROPS_PREFIX + value;
			}
			if (SAFE_FOR_XML && regExpTest(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i, value)) {
				_removeAttribute(name, currentNode, attr);
				continue;
			}
			if (lcName === "attributename" && stringMatch(value, "href")) {
				_removeAttribute(name, currentNode, attr);
				continue;
			}
			if (hookEvent.forceKeepAttr) continue;
			if (!hookEvent.keepAttr) {
				_removeAttribute(name, currentNode, attr);
				continue;
			}
			if (!ALLOW_SELF_CLOSE_IN_ATTR && regExpTest(SELF_CLOSING_TAG, value)) {
				_removeAttribute(name, currentNode, attr);
				continue;
			}
			if (SAFE_FOR_TEMPLATES) value = _stripTemplateExpressions(value);
			if (!_isValidAttribute(lcTag, lcName, value)) {
				_removeAttribute(name, currentNode, attr);
				continue;
			}
			value = _applyTrustedTypesToAttribute(lcTag, lcName, namespaceURI, value);
			if (value !== initValue) _setAttributeValue(currentNode, name, namespaceURI, value);
		}
		_executeHooks(hooks.afterSanitizeAttributes, currentNode, null);
	};
	/**
	* _sanitizeShadowDOM
	*
	* @param fragment to iterate over recursively
	*/
	const _sanitizeShadowDOM2 = function _sanitizeShadowDOM(fragment) {
		let shadowNode = null;
		const shadowIterator = _createNodeIterator(fragment);
		_executeHooks(hooks.beforeSanitizeShadowDOM, fragment, null);
		while (shadowNode = shadowIterator.nextNode()) {
			_executeHooks(hooks.uponSanitizeShadowNode, shadowNode, null);
			_sanitizeElements(shadowNode, fragment);
			_sanitizeAttributes(shadowNode);
			if (_isDocumentFragment(shadowNode.content)) _sanitizeShadowDOM2(shadowNode.content);
			if (_readNodeType(shadowNode) === NODE_TYPE.element) {
				const innerSr = getShadowRoot(shadowNode);
				if (_isDocumentFragment(innerSr)) {
					_sanitizeAttachedShadowRoots(innerSr);
					_sanitizeShadowDOM2(innerSr);
				}
			}
		}
		_executeHooks(hooks.afterSanitizeShadowDOM, fragment, null);
	};
	/**
	* _sanitizeAttachedShadowRoots
	*
	* Walks `root` and feeds every attached shadow root we encounter into
	* the existing _sanitizeShadowDOM pipeline. The default node iterator
	* does not descend into shadow trees, so nodes inside an attached
	* shadow root would otherwise be skipped entirely.
	*
	* Two real input paths put attached shadow roots in front of us:
	*   1. IN_PLACE on a DOM node that already has shadow roots attached.
	*   2. DOM-node input where importNode(dirty, true) deep-clones the
	*      shadow root because it was created with `clonable: true`.
	*
	* This pass runs once, up front, so the main iteration loop (and the
	* existing _sanitizeShadowDOM template-content recursion) stay
	* untouched — string-input paths are not affected.
	*
	* @param root the subtree root to walk for attached shadow roots
	*/
	const _sanitizeAttachedShadowRoots = function _sanitizeAttachedShadowRoots(root) {
		const stack = [{
			node: root,
			shadow: null
		}];
		while (stack.length > 0) {
			const item = stack.pop();
			if (item.shadow) {
				_sanitizeShadowDOM2(item.shadow);
				continue;
			}
			const node = item.node;
			const isElement = _readNodeType(node) === NODE_TYPE.element;
			const childNodes = getChildNodes(node);
			if (childNodes) for (let i = childNodes.length - 1; i >= 0; --i) stack.push({
				node: childNodes[i],
				shadow: null
			});
			if (isElement) {
				const rootName = getNodeName ? getNodeName(node) : null;
				if (typeof rootName === "string" && transformCaseFunc(rootName) === "template") {
					const content = node.content;
					if (_isDocumentFragment(content)) stack.push({
						node: content,
						shadow: null
					});
				}
			}
			if (isElement) {
				const sr = getShadowRoot(node);
				if (_isDocumentFragment(sr)) stack.push({
					node: null,
					shadow: sr
				}, {
					node: sr,
					shadow: null
				});
			}
		}
	};
	DOMPurify.sanitize = function(dirty) {
		let cfg = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
		let body = null;
		let importedNode = null;
		let currentNode = null;
		let returnNode = null;
		IS_EMPTY_INPUT = !dirty;
		if (IS_EMPTY_INPUT) dirty = "<!-->";
		if (typeof dirty !== "string" && !_isNode(dirty)) {
			dirty = stringifyValue(dirty);
			if (typeof dirty !== "string") throw typeErrorCreate("dirty is not a string, aborting");
		}
		if (!DOMPurify.isSupported) return dirty;
		if (SET_CONFIG) {
			ALLOWED_TAGS = SET_CONFIG_ALLOWED_TAGS;
			ALLOWED_ATTR = SET_CONFIG_ALLOWED_ATTR;
		} else _parseConfig(cfg);
		if (hooks.uponSanitizeElement.length > 0 || hooks.uponSanitizeAttribute.length > 0) ALLOWED_TAGS = clone(ALLOWED_TAGS);
		if (hooks.uponSanitizeAttribute.length > 0) ALLOWED_ATTR = clone(ALLOWED_ATTR);
		DOMPurify.removed = [];
		const inPlace = IN_PLACE && typeof dirty !== "string" && _isNode(dirty);
		if (inPlace) {
			_neutralizePatchLinkage(dirty);
			const nn = _readNodeName(dirty);
			if (typeof nn === "string") {
				const tagName = transformCaseFunc(nn);
				if (!ALLOWED_TAGS[tagName] || FORBID_TAGS[tagName]) {
					_neutralizeRoot(dirty);
					throw typeErrorCreate("root node is forbidden and cannot be sanitized in-place");
				}
			}
			if (_isClobbered(dirty)) {
				_neutralizeRoot(dirty);
				throw typeErrorCreate("root node is clobbered and cannot be sanitized in-place");
			}
			try {
				_sanitizeAttachedShadowRoots(dirty);
			} catch (error) {
				_neutralizeRoot(dirty);
				throw error;
			}
		} else if (_isNode(dirty)) {
			body = _initDocument("<!---->");
			importedNode = body.ownerDocument.importNode(dirty, true);
			if (importedNode.nodeType === NODE_TYPE.element && importedNode.nodeName === "BODY") body = importedNode;
			else if (importedNode.nodeName === "HTML") body = importedNode;
			else body.appendChild(importedNode);
			_sanitizeAttachedShadowRoots(importedNode);
		} else {
			if (!RETURN_DOM && !SAFE_FOR_TEMPLATES && !WHOLE_DOCUMENT && dirty.indexOf("<") === -1) return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? _createTrustedHTML(dirty) : dirty;
			body = _initDocument(dirty);
			if (!body) return RETURN_DOM ? null : RETURN_TRUSTED_TYPE ? emptyHTML : "";
		}
		if (body && FORCE_BODY) _forceRemove(body.firstChild);
		const walkRoot = inPlace ? dirty : body;
		try {
			const nodeIterator = _createNodeIterator(walkRoot);
			while (currentNode = nodeIterator.nextNode()) {
				_sanitizeElements(currentNode, walkRoot);
				_sanitizeAttributes(currentNode);
				if (_isDocumentFragment(currentNode.content)) _sanitizeShadowDOM2(currentNode.content);
			}
		} catch (error) {
			if (inPlace) {
				_neutralizeRoot(dirty);
				arrayForEach(DOMPurify.removed, (entry) => {
					if (entry.element) _neutralizeSubtree(entry.element);
				});
			}
			throw error;
		}
		if (inPlace) {
			arrayForEach(DOMPurify.removed, (entry) => {
				if (entry.element) _neutralizeSubtree(entry.element);
			});
			if (SAFE_FOR_TEMPLATES) _scrubTemplateExpressions2(dirty);
			return dirty;
		}
		if (RETURN_DOM) {
			if (SAFE_FOR_TEMPLATES) _scrubTemplateExpressions2(body);
			if (RETURN_DOM_FRAGMENT) {
				returnNode = createDocumentFragment.call(body.ownerDocument);
				while (body.firstChild) returnNode.appendChild(body.firstChild);
			} else returnNode = body;
			if (ALLOWED_ATTR.shadowroot || ALLOWED_ATTR.shadowrootmode) returnNode = importNode.call(originalDocument, returnNode, true);
			return returnNode;
		}
		let serializedHTML = WHOLE_DOCUMENT ? body.outerHTML : body.innerHTML;
		if (WHOLE_DOCUMENT && ALLOWED_TAGS["!doctype"] && body.ownerDocument && body.ownerDocument.doctype && body.ownerDocument.doctype.name && regExpTest(DOCTYPE_NAME, body.ownerDocument.doctype.name)) serializedHTML = "<!DOCTYPE " + body.ownerDocument.doctype.name + ">\n" + serializedHTML;
		if (SAFE_FOR_TEMPLATES) serializedHTML = _stripTemplateExpressions(serializedHTML);
		return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? _createTrustedHTML(serializedHTML) : serializedHTML;
	};
	DOMPurify.setConfig = function() {
		let cfg = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
		_parseConfig(cfg);
		SET_CONFIG = true;
		SET_CONFIG_ALLOWED_TAGS = ALLOWED_TAGS;
		SET_CONFIG_ALLOWED_ATTR = ALLOWED_ATTR;
	};
	DOMPurify.clearConfig = function() {
		CONFIG = null;
		SET_CONFIG = false;
		SET_CONFIG_ALLOWED_TAGS = null;
		SET_CONFIG_ALLOWED_ATTR = null;
		trustedTypesPolicy = defaultTrustedTypesPolicy;
		emptyHTML = "";
	};
	DOMPurify.isValidAttribute = function(tag, attr, value) {
		if (!CONFIG) _parseConfig({});
		const lcTag = transformCaseFunc(tag);
		const lcName = transformCaseFunc(attr);
		return _isValidAttribute(lcTag, lcName, value);
	};
	DOMPurify.addHook = function(entryPoint, hookFunction) {
		if (typeof hookFunction !== "function") return;
		if (!objectHasOwnProperty(hooks, entryPoint)) return;
		arrayPush(hooks[entryPoint], hookFunction);
	};
	DOMPurify.removeHook = function(entryPoint, hookFunction) {
		if (!objectHasOwnProperty(hooks, entryPoint)) return;
		if (hookFunction !== void 0) {
			const index = arrayLastIndexOf(hooks[entryPoint], hookFunction);
			return index === -1 ? void 0 : arraySplice(hooks[entryPoint], index, 1)[0];
		}
		return arrayPop(hooks[entryPoint]);
	};
	DOMPurify.removeHooks = function(entryPoint) {
		if (!objectHasOwnProperty(hooks, entryPoint)) return;
		hooks[entryPoint] = [];
	};
	DOMPurify.removeAllHooks = function() {
		hooks = _createHooksMap();
	};
	return DOMPurify;
}
var purify = createDOMPurify();
//#endregion
//#region src/refresh.ts
function createRefreshLoop(options) {
	let generation = 0;
	let disposed = false;
	let running = false;
	let pending = false;
	async function request(force = true) {
		if (disposed || !options.visible()) return;
		if (running) {
			if (force) pending = true;
			return;
		}
		running = true;
		const version = generation;
		const isCurrent = () => !disposed && generation === version;
		try {
			await options.read(isCurrent);
		} catch (error) {
			if (isCurrent()) options.onError?.(error);
		} finally {
			running = false;
			if (pending) {
				pending = false;
				request();
			}
		}
	}
	const timer = setInterval(() => void request(false), options.interval ?? 5e3);
	return {
		request,
		invalidate() {
			generation += 1;
		},
		dispose() {
			disposed = true;
			generation += 1;
			pending = false;
			clearInterval(timer);
		}
	};
}
//#endregion
//#region src/client.ts
const name = "@deepseek-ai/dsh-client-ui-forum-kb";
const BUILD = "v0.10.0-global-refresh";
const T = {
	bg: "#f9fafb",
	surface: "#ffffff",
	surface2: "#f5f5f5",
	border: "rgba(0,0,0,.10)",
	borderStrong: "rgba(0,0,0,.16)",
	text1: "#0f1115",
	text2: "#61666b",
	text3: "#81858c",
	brand: "#4176e6",
	brand2: "#5686fe",
	brandSoft: "rgba(65,118,230,.09)",
	green: "#22c55e",
	amber: "#f59e0b",
	gray: "#6b7280",
	grayL: "#9ca3af",
	blue: "#3b82f6",
	danger: "#b91c1c",
	dangerBg: "rgba(220,38,38,.06)",
	dangerBd: "rgba(220,38,38,.25)",
	shadow: "0 1px 2px rgba(0,0,0,.04),0 4px 12px rgba(0,0,0,.06)",
	sans: "-apple-system,'Segoe UI','PingFang SC','Microsoft YaHei',sans-serif",
	mono: "'SF Mono','JetBrains Mono','Fira Code',Consolas,'Liberation Mono',Menlo,monospace"
};
const STATE_COLOR = {
	active: T.green,
	waiting: T.amber,
	done: T.gray,
	archived: T.grayL
};
const REL_LABEL = {
	extends: "延伸自",
	supersedes: "取代自",
	"relates-to": "关联自"
};
const REL_OPTS = [
	{
		v: "supersedes",
		l: "取代"
	},
	{
		v: "extends",
		l: "延伸"
	},
	{
		v: "relates-to",
		l: "关联"
	}
];
function loadLocalMap(key) {
	try {
		const raw = localStorage.getItem(key);
		if (!raw) return {};
		const v = JSON.parse(raw);
		return v && typeof v === "object" && !Array.isArray(v) ? v : {};
	} catch {
		return {};
	}
}
function saveLocalMap(key, v) {
	try {
		localStorage.setItem(key, JSON.stringify(v));
	} catch {}
}
function normalizeView(v) {
	const current = v.current ?? null;
	const answers = (Array.isArray(v.answers) ? v.answers : []).map((a) => ({
		id: String(a.id ?? ""),
		author: String(a.author ?? ""),
		body: String(a.body ?? ""),
		source: a.source ?? null,
		sourceRel: a.sourceRel ?? a.source_rel ?? null,
		current: typeof a.current === "boolean" ? a.current : current != null && a.id === current,
		comments: (Array.isArray(a.comments) ? a.comments : []).map((c) => ({
			id: String(c.id ?? ""),
			author: String(c.author ?? ""),
			body: String(c.body ?? "")
		}))
	}));
	return {
		id: String(v.id ?? ""),
		title: String(v.title ?? ""),
		author: String(v.author ?? ""),
		tags: Array.isArray(v.tags) ? v.tags.map(String) : [],
		state: String(v.state ?? ""),
		current,
		assigned: v.assigned ?? null,
		entry: !!v.entry,
		pinned: !!v.pinned,
		pinnedScope: v.pinnedScope ?? v.pinned_scope ?? null,
		summary: String(v.summary ?? ""),
		query: String(v.query ?? ""),
		answers
	};
}
function StateBadge(state) {
	return react.default.createElement("span", { style: {
		display: "inline-flex",
		alignItems: "center",
		gap: 5,
		padding: "1px 8px",
		borderRadius: 6,
		background: T.surface2,
		border: `1px solid ${T.border}`,
		fontFamily: T.mono,
		fontSize: 11,
		color: T.text2,
		whiteSpace: "nowrap"
	} }, react.default.createElement("span", { style: {
		width: 7,
		height: 7,
		borderRadius: 7,
		background: STATE_COLOR[state] || T.grayL,
		flex: "none"
	} }), state || "-");
}
function MonoChip(text, brand, title) {
	return react.default.createElement("span", {
		title,
		style: {
			fontFamily: T.mono,
			fontSize: 11,
			padding: "1px 7px",
			borderRadius: 6,
			whiteSpace: "nowrap",
			background: brand ? T.brand : T.surface2,
			color: brand ? "#fff" : T.text2,
			border: brand ? `1px solid ${T.brand2}` : `1px solid ${T.border}`
		}
	}, text);
}
function Card(children, extraStyle, key) {
	return react.default.createElement("div", {
		key,
		style: Object.assign({
			background: T.surface,
			border: `1px solid ${T.border}`,
			borderRadius: 12,
			boxShadow: T.shadow
		}, extraStyle || {})
	}, children);
}
function SectionLabel(text, color) {
	return react.default.createElement("div", { style: {
		display: "flex",
		alignItems: "center",
		gap: 6,
		fontFamily: T.mono,
		fontSize: 11,
		color: color || T.text3,
		letterSpacing: ".04em"
	} }, react.default.createElement("span", { style: {
		width: 7,
		height: 7,
		borderRadius: 7,
		background: color || T.text3,
		flex: "none"
	} }), text);
}
function ghostBtn(extra) {
	return Object.assign({
		padding: "3px 10px",
		borderRadius: 8,
		border: `1px solid ${T.border}`,
		background: T.surface,
		color: T.text2,
		cursor: "pointer",
		fontSize: 12,
		flex: "none"
	}, extra || {});
}
function SubNav(props) {
	return react.default.createElement("div", { style: {
		position: "sticky",
		top: 0,
		zIndex: 10,
		flex: "0 0 auto",
		display: "flex",
		alignItems: "center",
		gap: 8,
		padding: "8px 16px",
		background: "rgba(255,255,255,.96)",
		backdropFilter: "blur(6px)",
		borderBottom: `1px solid ${T.border}`,
		flexWrap: "nowrap"
	} }, react.default.createElement("span", { style: {
		fontFamily: T.mono,
		fontSize: 12.5,
		fontWeight: 700,
		color: T.brand,
		letterSpacing: ".02em",
		flex: "none"
	} }, "forum-kb"), react.default.createElement("span", { style: {
		color: T.grayL,
		flex: "none"
	} }, "›"), props.inDetail ? react.default.createElement("button", {
		key: "back",
		onClick: props.onBack,
		style: ghostBtn({ padding: "2px 9px" }),
		title: "返回帖子列表"
	}, "列表") : react.default.createElement("span", {
		style: {
			fontFamily: T.mono,
			fontSize: 11,
			color: T.text3,
			flex: "none"
		},
		title: "可见/全部"
	}, props.count == null ? "…" : (props.shown == null ? props.count : `${props.shown}/${props.count}`) + " 帖"), props.inDetail ? react.default.createElement("span", { style: {
		display: "flex",
		alignItems: "center",
		gap: 8,
		minWidth: 0,
		flex: "1 1 auto",
		overflow: "hidden"
	} }, react.default.createElement("span", { style: {
		color: T.grayL,
		flex: "none"
	} }, "›"), react.default.createElement("span", { style: {
		fontSize: 13,
		fontWeight: 600,
		color: T.text1,
		whiteSpace: "nowrap",
		overflow: "hidden",
		textOverflow: "ellipsis"
	} }, props.title || ""), props.state ? StateBadge(props.state) : null) : react.default.createElement("span", { style: { flex: "1 1 auto" } }), react.default.createElement("button", {
		onClick: props.onRefresh,
		disabled: props.busy,
		style: ghostBtn(),
		title: "同步帖子列表和当前详情"
	}, "⟳ 刷新"), !props.inDetail ? react.default.createElement("button", {
		onClick: props.onNew,
		style: ghostBtn({
			color: T.brand,
			borderColor: T.brand2,
			fontWeight: 600
		}),
		title: "发起新帖"
	}, "＋ 发帖") : null, react.default.createElement("span", { style: {
		fontFamily: T.mono,
		fontSize: 10,
		color: T.text3,
		opacity: .7,
		flex: "none"
	} }, BUILD));
}
const selectStyle = {
	padding: "4px 7px",
	borderRadius: 8,
	border: `1px solid ${T.border}`,
	background: T.surface,
	color: T.text2,
	fontSize: 12,
	fontFamily: T.sans,
	outline: "none",
	flex: "none"
};
function FilterBar(props) {
	return react.default.createElement("div", { style: {
		flex: "0 0 auto",
		display: "flex",
		alignItems: "center",
		gap: 6,
		padding: "6px 16px",
		background: T.surface,
		borderBottom: `1px solid ${T.border}`,
		flexWrap: "wrap"
	} }, react.default.createElement("input", {
		value: props.q,
		onChange: (e) => props.onQ(String(e.target.value || "")),
		placeholder: "搜索帖子（标题 / 摘要 / 正文…）",
		title: props.ftsAvailable ? "走 host FTS（与 kb_search 同源）；回车即时生效" : "host 未升级，本地过滤（标题/摘要/id）",
		style: {
			flex: "1 1 200px",
			minWidth: 160,
			maxWidth: 320,
			padding: "4px 9px",
			borderRadius: 8,
			border: `1px solid ${T.border}`,
			fontSize: 12.5,
			background: T.surface,
			color: T.text1,
			outline: "none",
			fontFamily: T.sans
		}
	}), react.default.createElement("select", {
		value: props.fState,
		onChange: (e) => props.onState(e.target.value),
		style: selectStyle,
		title: "按状态筛选"
	}, react.default.createElement("option", { value: "all" }, "全部状态"), [
		"active",
		"waiting",
		"done",
		"archived"
	].map((s) => react.default.createElement("option", {
		key: s,
		value: s
	}, s))), react.default.createElement("select", {
		value: props.fTag,
		onChange: (e) => props.onTag(e.target.value),
		style: selectStyle,
		title: "按标签筛选"
	}, react.default.createElement("option", { value: "all" }, "全部标签"), props.tags.map((t) => react.default.createElement("option", {
		key: t,
		value: t
	}, "#" + t))), react.default.createElement("select", {
		value: props.fSort,
		onChange: (e) => props.onSort(e.target.value),
		style: selectStyle,
		title: "排序（客户端本地）：最新=created_at · 活跃=updated_at · 热度=answer+评论数；host 未重启缺字段时退回 id 序"
	}, react.default.createElement("option", { value: "default" }, "排序: 默认"), react.default.createElement("option", { value: "new" }, "最新"), react.default.createElement("option", { value: "active" }, "活跃"), react.default.createElement("option", { value: "top" }, "热度")), react.default.createElement("button", {
		onClick: () => props.onEntry(!props.fEntry),
		title: "只看 entry 上手帖",
		style: {
			padding: "4px 10px",
			borderRadius: 8,
			fontSize: 12,
			cursor: "pointer",
			flex: "none",
			border: `1px solid ${props.fEntry ? T.brand2 : T.border}`,
			background: props.fEntry ? T.brandSoft : T.surface,
			color: props.fEntry ? T.brand : T.text2,
			fontWeight: props.fEntry ? 600 : 400
		}
	}, "★ 仅 entry"), props.hasTerm ? react.default.createElement("span", { style: {
		display: "inline-flex",
		alignItems: "center",
		gap: 6,
		flex: "none"
	} }, props.searching ? react.default.createElement("span", { style: {
		fontFamily: T.mono,
		fontSize: 10.5,
		color: T.text3
	} }, "搜索中…") : props.ftsAvailable ? MonoChip("FTS", true, "host FTS 搜索（kb_search 同源）") : MonoChip("本地过滤", false, "host 无 search 端点（未重启），本地子串过滤")) : null);
}
function AnswerCard(a, actions) {
	const kids = a.comments || [];
	return Card([
		react.default.createElement("div", {
			key: "head",
			style: {
				display: "flex",
				alignItems: "center",
				gap: 8,
				flexWrap: "wrap"
			}
		}, MonoChip(a.id, !!a.current, a.current ? "current · 当前真相" : "answer"), react.default.createElement("span", { style: {
			fontSize: 12,
			color: T.text2
		} }, a.author), a.source ? MonoChip(`${REL_LABEL[a.sourceRel] ?? "关联自"} ${a.source}`, false, "source 软引用") : null, a.current ? react.default.createElement("span", { style: {
			fontFamily: T.mono,
			fontSize: 10,
			color: T.brand
		} }, "current") : null, actions ? react.default.createElement("span", { style: {
			marginLeft: "auto",
			display: "inline-flex",
			gap: 6
		} }, react.default.createElement("button", {
			onClick: () => actions.onComment(a.id),
			style: ghostBtn({
				fontSize: 11,
				padding: "2px 8px"
			}),
			title: `在 ${a.id} 下写评论（草稿）`
		}, "评论"), react.default.createElement("button", {
			onClick: () => actions.onQuote(a),
			style: ghostBtn({
				fontSize: 11,
				padding: "2px 8px"
			}),
			title: `引用 ${a.id} 写新 answer（巩固）`
		}, "引用")) : null),
		RichText(a.body, {
			fontSize: 13,
			lineHeight: 1.6,
			color: T.text1,
			marginTop: 8
		}),
		kids.length ? react.default.createElement("div", {
			key: "comments",
			style: {
				marginTop: 10,
				paddingTop: 8,
				borderTop: `1px solid ${T.border}`
			}
		}, SectionLabel(`评论区 · ${kids.length}`, T.amber), react.default.createElement("div", { style: {
			display: "flex",
			flexDirection: "column",
			gap: 6,
			marginTop: 6
		} }, kids.map((c) => react.default.createElement("div", {
			key: c.id,
			style: {
				background: T.surface2,
				border: `1px solid ${T.border}`,
				borderLeft: `3px solid ${T.amber}`,
				borderRadius: 8,
				padding: "7px 10px"
			}
		}, react.default.createElement("div", { style: {
			display: "flex",
			alignItems: "baseline",
			gap: 8
		} }, react.default.createElement("span", { style: {
			fontSize: 12,
			fontWeight: 600,
			color: T.text1
		} }, c.author), react.default.createElement("span", { style: {
			fontFamily: T.mono,
			fontSize: 10,
			color: T.text3
		} }, c.id)), RichText(c.body, {
			fontSize: 12.5,
			lineHeight: 1.55,
			color: T.text2,
			marginTop: 2
		}, c.id))))) : null
	], {
		padding: "12px 14px",
		borderLeft: a.current ? `3px solid ${T.brand}` : "3px solid transparent"
	});
}
function QueryCard(text) {
	return Card([SectionLabel("QUERY", T.blue), RichText(text, {
		fontSize: 13,
		lineHeight: 1.6,
		color: T.text1,
		marginTop: 8
	})], {
		padding: "12px 14px",
		borderLeft: `3px solid ${T.blue}`
	});
}
function PostHeader(post, pinAction, inCase, starAction) {
	const pinScopeLabel = post.pinnedScope ? "#" + post.pinnedScope : "全局";
	return Card([
		react.default.createElement("div", {
			key: "row1",
			style: {
				display: "flex",
				alignItems: "center",
				gap: 8,
				flexWrap: "wrap"
			}
		}, react.default.createElement("span", { style: {
			fontSize: 14.5,
			fontWeight: 600,
			color: T.text1
		} }, post.title), StateBadge(post.state), post.entry ? MonoChip("★ entry", true, "推荐上手起点") : null, post.pinned ? react.default.createElement("span", {
			title: post.pinnedScope ? "tag 内置顶（对同一 tag 的读者置顶）" : "全局置顶（对所有读者置顶）",
			style: {
				fontFamily: T.mono,
				fontSize: 11,
				padding: "1px 7px",
				borderRadius: 6,
				whiteSpace: "nowrap",
				background: "rgba(245,158,11,.12)",
				color: T.amber,
				border: "1px solid rgba(245,158,11,.4)"
			}
		}, `📌 ${pinScopeLabel}`) : null, pinAction ? react.default.createElement("button", {
			onClick: pinAction.onPin,
			style: ghostBtn({
				fontSize: 11,
				padding: "2px 8px",
				marginLeft: "auto"
			}),
			title: post.pinned ? "取消置顶（off 同时清 scope）" : "全局置顶（tag 级置顶走 CLI：kb pin --scope <tag>）"
		}, post.pinned ? "取消置顶" : "📌 置顶") : null, starAction ? react.default.createElement("button", {
			onClick: starAction.onToggle,
			style: ghostBtn({
				fontSize: 11,
				padding: "2px 8px",
				color: starAction.starred ? T.amber : T.text2,
				fontWeight: starAction.starred ? 600 : 400
			}),
			title: starAction.starred ? "取消常用（本地星标，仅本浏览器）" : "标为常用（本地星标，仅本浏览器；列表页「⭐ 常用」区可见）"
		}, starAction.starred ? "★ 已常用" : "☆ 常用") : null),
		react.default.createElement("div", {
			key: "row2",
			style: {
				display: "flex",
				alignItems: "center",
				gap: 8,
				flexWrap: "wrap",
				marginTop: 8
			}
		}, MonoChip(post.id, false, "帖子 id"), post.author ? react.default.createElement("span", { style: {
			fontSize: 12,
			color: T.text3
		} }, "发起 " + post.author) : null, post.assigned ? react.default.createElement("span", { style: {
			fontSize: 12,
			color: T.text3
		} }, "负责 " + post.assigned) : null, post.current ? MonoChip("current " + post.current, false, "当前真相指针") : null, ...(post.tags || []).map((tg) => MonoChip("#" + tg)), ...(inCase || []).map((r) => react.default.createElement("span", {
			key: "ic" + r.author,
			title: `在案会话 ${r.sessionId}${r.agentPreset ? " · preset " + r.agentPreset : ""}（${r.live ? "活会话：@ 即增量续聊" : "冷会话：@ 触发冷恢复"}）`,
			style: {
				fontFamily: T.mono,
				fontSize: 11,
				padding: "1px 7px",
				borderRadius: 6,
				whiteSpace: "nowrap",
				background: r.live ? T.brandSoft : T.surface2,
				color: r.live ? T.brand : T.text2,
				border: `1px solid ${r.live ? T.brand2 : T.border}`
			}
		}, `在案 @${r.author} · ${r.live ? "续聊" : "冷"}`))),
		post.summary ? react.default.createElement("div", {
			key: "sum",
			style: {
				marginTop: 10,
				paddingTop: 8,
				borderTop: `1px solid ${T.border}`
			}
		}, SectionLabel("SUMMARY"), react.default.createElement("div", { style: {
			whiteSpace: "pre-wrap",
			wordBreak: "break-word",
			fontSize: 12.5,
			lineHeight: 1.55,
			color: T.text2,
			marginTop: 6
		} }, post.summary)) : null
	], { padding: "12px 14px" });
}
function quoteOf(a) {
	const lines = String(a.body || "").split("\n").map((l) => "> " + l).join("\n");
	return `> 引用 ${a.id} · ${a.author}：\n${lines}\n\n`;
}
function RefsPanel(data, onOpen) {
	const inbound = Array.isArray(data.inbound) ? data.inbound : [];
	const outbound = Array.isArray(data.outbound) ? data.outbound : [];
	if (!inbound.length && !outbound.length) return null;
	const rowStyle = {
		display: "flex",
		alignItems: "center",
		gap: 8,
		padding: "5px 8px",
		borderRadius: 8,
		border: `1px solid ${T.border}`,
		background: T.surface2,
		flexWrap: "wrap"
	};
	const inboundRows = inbound.map((r, i) => react.default.createElement("div", {
		key: "i" + i,
		onClick: () => onOpen(String(r.from)),
		style: Object.assign({}, rowStyle, { cursor: "pointer" }),
		title: "跳转到引用方帖子"
	}, MonoChip(String(r.from), false, "引用方帖子 id"), react.default.createElement("span", { style: {
		fontSize: 12,
		color: T.text2,
		overflow: "hidden",
		textOverflow: "ellipsis",
		whiteSpace: "nowrap",
		maxWidth: 340
	} }, String(r.title ?? "")), MonoChip(String(r.where ?? ""), false, r.where === "depends_on" ? "结构化引用（depends_on）" : "正文 [[token]] 内联引用"), r.anchor ? MonoChip("#" + r.anchor, false, "锚点") : null));
	const outboundRows = outbound.map((d, i) => {
		const isPost = d.kind === "post";
		return react.default.createElement("div", {
			key: "o" + i,
			onClick: isPost ? () => onOpen(String(d.id)) : void 0,
			style: Object.assign({}, rowStyle, { cursor: isPost ? "pointer" : "default" }),
			title: isPost ? "跳转到被依赖帖子" : "文档引用（仓库相对路径）"
		}, MonoChip(isPost ? "post" : "doc", false, "引用类型"), MonoChip(String(d.id), false, isPost ? "帖子 id" : "文档路径"), react.default.createElement("span", { style: {
			fontSize: 12,
			color: T.text2,
			overflow: "hidden",
			textOverflow: "ellipsis",
			whiteSpace: "nowrap",
			maxWidth: 340
		} }, String(d.title ?? "")), d.anchor ? MonoChip("#" + d.anchor, false, "锚点") : null);
	});
	return Card([
		SectionLabel(`REFS · 被引用 ${inbound.length} · 出向 ${outbound.length}`, T.blue),
		inbound.length ? react.default.createElement("div", {
			key: "in",
			style: { marginTop: 8 }
		}, react.default.createElement("div", { style: {
			fontFamily: T.mono,
			fontSize: 10.5,
			color: T.text3,
			marginBottom: 4
		} }, "入向（谁引用本帖）"), react.default.createElement("div", { style: {
			display: "flex",
			flexDirection: "column",
			gap: 5
		} }, inboundRows)) : null,
		outbound.length ? react.default.createElement("div", {
			key: "out",
			style: { marginTop: inbound.length ? 10 : 8 }
		}, react.default.createElement("div", { style: {
			fontFamily: T.mono,
			fontSize: 10.5,
			color: T.text3,
			marginBottom: 4
		} }, "出向（本帖 depends_on）"), react.default.createElement("div", { style: {
			display: "flex",
			flexDirection: "column",
			gap: 5
		} }, outboundRows)) : null
	], {
		padding: "12px 14px",
		marginTop: 10,
		borderLeft: `3px solid ${T.blue}`
	});
}
function parseMentions(text) {
	const out = [];
	for (const m of String(text || "").matchAll(/@(?!(?:post|file|tool):)([a-z0-9][a-z0-9_-]{0,63})/gi)) {
		const t = m[1].toLowerCase();
		if (!out.includes(t)) out.push(t);
	}
	return out;
}
const MENTION_SPLIT = /(@(?!(?:post|file|tool):)[a-z0-9][a-z0-9_-]{0,63}|@(?:post|file|tool):[A-Za-z0-9_\-./\\]+)/gi;
const MENTION_TOKEN = /^@[a-z0-9][a-z0-9_-]{0,63}$/i;
const REF_TOKEN = /^@(post|file|tool):([A-Za-z0-9_\-./\\]+)$/i;
const REF_STYLE = {
	post: `color:${T.brand};font-family:${T.mono};font-weight:600;border-bottom:1px dotted ${T.brand2};cursor:pointer`,
	file: `color:${T.green};font-family:${T.mono};font-weight:600;border-bottom:1px dotted ${T.green};cursor:pointer`,
	tool: `color:${T.amber};font-family:${T.mono};font-weight:600;border-bottom:1px dotted ${T.amber}`
};
const REF_TITLE = {
	post: "点击在论坛内打开该帖子",
	file: "点击用系统默认应用打开（workspace 相对路径）",
	tool: "host 工具"
};
function enhanceRichDom(root) {
	const mentionStyle = `color:${T.brand};font-family:${T.mono};font-weight:600`;
	const walk = (node) => {
		if (node.nodeType === Node.TEXT_NODE) {
			const parts = (node.nodeValue || "").split(MENTION_SPLIT);
			if (parts.length > 1) {
				const frag = document.createDocumentFragment();
				for (const p of parts) {
					if (!p) continue;
					if (MENTION_TOKEN.test(p)) {
						const span = document.createElement("span");
						span.className = "kbd-mention";
						span.setAttribute("style", mentionStyle);
						span.textContent = p;
						frag.appendChild(span);
						continue;
					}
					const ref = REF_TOKEN.exec(p);
					if (ref) {
						const kind = ref[1].toLowerCase();
						const span = document.createElement("span");
						span.className = "kbd-ref";
						span.setAttribute("data-ref-kind", kind);
						span.setAttribute("data-ref-value", ref[2]);
						span.setAttribute("style", REF_STYLE[kind] || mentionStyle);
						span.setAttribute("title", ((REF_TITLE[kind] || "") + " · " + p).replace(/^ · /, ""));
						span.textContent = p;
						frag.appendChild(span);
						continue;
					}
					frag.appendChild(document.createTextNode(p));
				}
				node.parentNode?.replaceChild(frag, node);
				return;
			}
		} else if (node.nodeType === Node.ELEMENT_NODE) {
			const el = node;
			if (el.tagName === "A") {
				if ((el.getAttribute("href") || "").startsWith("http")) {
					el.setAttribute("target", "_blank");
					el.setAttribute("rel", "noopener noreferrer");
				}
				el.style.color = T.brand;
			}
		}
		Array.from(node.childNodes).forEach(walk);
	};
	walk(root.body || root.documentElement);
}
function richHtml(text) {
	const raw = marked.parse(String(text ?? ""), {
		gfm: true,
		breaks: true,
		async: false
	});
	const clean = purify.sanitize(raw);
	const doc = new DOMParser().parseFromString(`<div id="r">${clean}</div>`, "text/html");
	enhanceRichDom(doc);
	const el = doc.getElementById("r");
	return el ? el.innerHTML : clean;
}
const MD_CSS = [
	".kbd-md p{margin:0 0 6px}.kbd-md p:last-child{margin-bottom:0}",
	".kbd-md h1,.kbd-md h2,.kbd-md h3,.kbd-md h4,.kbd-md h5,.kbd-md h6{margin:10px 0 4px;font-weight:600;color:#0f1115;line-height:1.35}",
	".kbd-md h1{font-size:16px}.kbd-md h2{font-size:14.5px}.kbd-md h3{font-size:13.5px}.kbd-md h4{font-size:13px}.kbd-md h5{font-size:12.5px}.kbd-md h6{font-size:12px;color:#61666b}",
	".kbd-md ul,.kbd-md ol{margin:0 0 6px;padding-left:20px}.kbd-md li{margin:2px 0;line-height:1.55}",
	".kbd-md li>input[type=checkbox]{margin-right:4px;vertical-align:-1px}",
	".kbd-md pre{margin:6px 0;padding:8px 10px;background:#f5f5f5;border:1px solid rgba(0,0,0,.10);border-radius:8px;overflow-x:auto}",
	".kbd-md code{font-family:'SF Mono','JetBrains Mono','Fira Code',Consolas,Menlo,monospace;font-size:12px;background:rgba(0,0,0,.05);padding:1px 4px;border-radius:4px}",
	".kbd-md pre code{background:transparent;padding:0;font-size:12px}",
	".kbd-md blockquote{margin:6px 0;padding:4px 10px;border-left:3px solid rgba(65,118,230,.4);color:#61666b}",
	".kbd-md a{color:#4176e6}.kbd-md hr{border:none;border-top:1px solid rgba(0,0,0,.10);margin:8px 0}",
	".kbd-md strong{font-weight:600}",
	".kbd-md table{border-collapse:collapse;margin:6px 0;display:block;overflow-x:auto;max-width:100%}",
	".kbd-md th,.kbd-md td{border:1px solid rgba(0,0,0,.12);padding:4px 10px;font-size:12.5px}",
	".kbd-md th{background:#f5f5f5;font-weight:600}"
].join("");
function handleRefClick(e, onRef) {
	const t = e && e.target;
	const node = t && typeof t.closest === "function" ? t.closest(".kbd-ref") : null;
	if (!node) return;
	const kind = node.getAttribute("data-ref-kind");
	const value = node.getAttribute("data-ref-value");
	if (kind && value) {
		e.preventDefault();
		onRef(kind, value);
	}
}
function RichText(text, style, key) {
	return react.default.createElement("div", {
		key,
		className: "kbd-md",
		style: Object.assign({ wordBreak: "break-word" }, style || {}),
		dangerouslySetInnerHTML: { __html: richHtml(text) }
	});
}
function MentionTextarea(props) {
	const [mention, setMention] = react.default.useState(null);
	const innerRef = react.default.useRef(null);
	const ref = props.inputRef || innerRef;
	react.default.useEffect(() => {
		setMention((m) => m && m.start > props.value.length ? null : m);
	}, [props.value]);
	const onChange = (e) => {
		const v = e.target.value;
		props.onChange(v);
		const caret = e.target.selectionStart == null ? v.length : e.target.selectionStart;
		const m = /(?:^|\s)@([a-z0-9_-]*)$/i.exec(v.slice(0, caret));
		setMention(m ? {
			start: caret - m[1].length - 1,
			query: m[1].toLowerCase(),
			index: 0
		} : null);
	};
	const q = mention ? mention.query.toLowerCase() : "";
	const cand = [];
	for (const src of props.sources || []) for (const it of src.items || []) {
		const token = String((it && it.token) ?? "");
		const desc = String((it && it.desc) ?? "");
		if (q && (src.startsWithOnly ? !token.startsWith(q) : !(token.toLowerCase().startsWith(q) || desc.toLowerCase().includes(q)))) continue;
		cand.push({
			token,
			label: "@" + token,
			desc,
			section: src.section
		});
	}
	if (cand.length > 30) cand.length = 30;
	const pick = (token) => {
		if (!mention) return;
		const v = props.value;
		props.onChange(v.slice(0, mention.start) + "@" + token + " " + v.slice(mention.start + 1 + mention.query.length));
		setMention(null);
		setTimeout(() => {
			try {
				if (ref.current) ref.current.focus();
			} catch {}
		}, 30);
	};
	return react.default.createElement(react.default.Fragment, null, react.default.createElement("textarea", {
		ref,
		value: props.value,
		rows: props.rows ?? 3,
		onChange,
		onBlur: () => {
			setTimeout(() => setMention(null), 150);
		},
		onKeyDown: (e) => {
			if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
				e.preventDefault();
				if (props.onCtrlEnter) props.onCtrlEnter();
				return;
			}
			if (mention && cand.length) {
				if (e.key === "ArrowDown") {
					e.preventDefault();
					setMention({
						...mention,
						index: (mention.index + 1) % cand.length
					});
					return;
				}
				if (e.key === "ArrowUp") {
					e.preventDefault();
					setMention({
						...mention,
						index: (mention.index - 1 + cand.length) % cand.length
					});
					return;
				}
				if (e.key === "Enter" || e.key === "Tab") {
					e.preventDefault();
					pick(cand[mention.index].token);
					return;
				}
				if (e.key === "Escape") {
					setMention(null);
					return;
				}
			}
		},
		placeholder: props.placeholder,
		style: props.style
	}), mention && cand.length ? react.default.createElement("div", { style: {
		marginBottom: 6,
		border: `1px solid ${T.border}`,
		borderRadius: 10,
		background: T.surface,
		maxHeight: 240,
		overflowY: "auto",
		boxShadow: T.shadow
	} }, cand.map((c, i) => {
		const showHeader = i === 0 || cand[i - 1].section !== c.section;
		return react.default.createElement(react.default.Fragment, { key: c.section + ":" + c.token }, showHeader ? react.default.createElement("div", { style: {
			fontFamily: T.mono,
			fontSize: 10,
			color: T.text3,
			padding: "7px 10px 2px",
			letterSpacing: ".04em"
		} }, c.section) : null, react.default.createElement("div", {
			onClick: () => pick(c.token),
			style: {
				display: "flex",
				alignItems: "baseline",
				gap: 8,
				padding: "5px 10px",
				cursor: "pointer",
				background: i === mention.index ? T.brandSoft : "transparent",
				borderLeft: i === mention.index ? `2px solid ${T.brand}` : "2px solid transparent"
			},
			title: c.desc
		}, react.default.createElement("span", { style: {
			fontFamily: T.mono,
			fontSize: 11.5,
			fontWeight: 600,
			color: i === mention.index ? T.brand : T.text1,
			whiteSpace: "nowrap"
		} }, c.label), c.desc ? react.default.createElement("span", { style: {
			fontSize: 11.5,
			color: T.text3,
			overflow: "hidden",
			textOverflow: "ellipsis",
			whiteSpace: "nowrap"
		} }, c.desc) : null));
	})) : null);
}
function ForumView(props) {
	const { forumKb } = props;
	const [posts, setPosts] = react.default.useState(null);
	const [sel, setSel] = react.default.useState(null);
	const [detail, setDetail] = react.default.useState(null);
	const [err, setErr] = react.default.useState(null);
	const [busy, setBusy] = react.default.useState(false);
	const [syncErr, setSyncErr] = react.default.useState(null);
	const rootRef = react.default.useRef(null);
	const loopRef = react.default.useRef(null);
	const readRef = react.default.useRef(async () => {});
	const draftAnchor = react.default.useRef(null);
	const mounted = react.default.useRef(false);
	const [q, setQ] = react.default.useState("");
	const [fltState, setFltState] = react.default.useState("all");
	const [fltTag, setFltTag] = react.default.useState("all");
	const [fltEntry, setFltEntry] = react.default.useState(false);
	const [fltSort, setFltSort] = react.default.useState("default");
	const [ftsIds, setFtsIds] = react.default.useState(null);
	const [searching, setSearching] = react.default.useState(false);
	const [refsData, setRefsData] = react.default.useState(null);
	const [refsErr, setRefsErr] = react.default.useState(null);
	const [inCase, setInCase] = react.default.useState(null);
	const [presetSel, setPresetSel] = react.default.useState({});
	const [presetMenuFor, setPresetMenuFor] = react.default.useState(null);
	const [infoData, setInfoData] = react.default.useState(null);
	const [roster, setRoster] = react.default.useState([]);
	const [permSel, setPermSel] = react.default.useState({});
	const [permRoster, setPermRoster] = react.default.useState([]);
	const [toolsCache, setToolsCache] = react.default.useState([]);
	const [stars, setStars] = react.default.useState(() => loadLocalMap("forum-kb:stars"));
	const [reads, setReads] = react.default.useState(() => loadLocalMap("forum-kb:reads"));
	const [sessIdx, setSessIdx] = react.default.useState(null);
	const dispatchInfoAvailable = typeof forumKb.dispatchInfo === "function";
	const ftsAvailable = typeof forumKb.search === "function";
	const pinAvailable = typeof forumKb.pin === "function";
	const term = q.trim();
	react.default.useEffect(() => {
		setFtsIds(null);
		setSearching(!!term && ftsAvailable);
		loopRef.current?.invalidate();
		const t = setTimeout(() => void loopRef.current?.request(), 250);
		return () => clearTimeout(t);
	}, [term, ftsAvailable]);
	const allTags = react.default.useMemo(() => {
		const s = /* @__PURE__ */ new Set();
		for (const p of posts || []) for (const t of Array.isArray(p.tags) ? p.tags : []) s.add(t);
		return [...s].sort();
	}, [posts]);
	const ql = term.toLowerCase();
	const visible = (posts || []).filter((p) => {
		if (fltState !== "all" && p.state !== fltState) return false;
		if (fltTag !== "all" && !(Array.isArray(p.tags) ? p.tags : []).includes(fltTag)) return false;
		if (fltEntry && !p.entry) return false;
		if (ftsIds) return ftsIds.has(p.id);
		if (ql) {
			const hay = [
				p.id,
				p.title,
				p.summary,
				p.assigned
			].map((x) => String(x ?? "").toLowerCase()).join("\n");
			return ql.split(/\s+/).every((w) => hay.includes(w));
		}
		return true;
	});
	const num = (x) => Number(x) || 0;
	const sortedVisible = (() => {
		const arr = [...visible];
		if (fltSort === "new" && arr.some((p) => p.createdAt)) arr.sort((a, b) => String(a.createdAt ?? "") < String(b.createdAt ?? "") ? 1 : -1);
		else if (fltSort === "active" && arr.some((p) => p.updatedAt)) arr.sort((a, b) => String(a.updatedAt ?? "") < String(b.updatedAt ?? "") ? 1 : -1);
		else if (fltSort === "top" && arr.some((p) => p.answers != null)) arr.sort((a, b) => num(b.answers) + num(b.comments) - (num(a.answers) + num(a.comments)));
		return arr;
	})();
	const pinnedPosts = sortedVisible.filter((p) => p.pinned).sort((a, b) => (a.pinnedScope ? 1 : 0) - (b.pinnedScope ? 1 : 0));
	const normalPosts = sortedVisible.filter((p) => !p.pinned);
	const sessOf = (id) => sessIdx && sessIdx[id] || null;
	const isNewPost = (p) => {
		const r = reads[p.id];
		return !!r && num(p.answers) + num(p.comments) > (Number(r.a) || 0) + (Number(r.c) || 0);
	};
	const freqPosts = sortedVisible.filter((p) => !p.pinned && (stars[p.id] || sessOf(p.id))).sort((a, b) => {
		const sa = Number(stars[a.id]) || 0;
		const sb = Number(stars[b.id]) || 0;
		if (sa > 0 !== sb > 0) return sa > 0 ? -1 : 1;
		if (sa && sb && sa !== sb) return sb - sa;
		return String(b.updatedAt ?? "").localeCompare(String(a.updatedAt ?? "")) || (a.id < b.id ? -1 : 1);
	});
	if (freqPosts.length > 12) freqPosts.length = 12;
	const freqIds = new Set(freqPosts.map((p) => p.id));
	const listPosts = normalPosts.filter((p) => !freqIds.has(p.id));
	const [role, setRole] = react.default.useState(() => {
		try {
			return localStorage.getItem("forum-kb:role") || "user";
		} catch {
			return "user";
		}
	});
	react.default.useEffect(() => {
		try {
			localStorage.setItem("forum-kb:role", role);
		} catch {}
	}, [role]);
	const [mode, setMode] = react.default.useState("comment");
	const [target, setTarget] = react.default.useState(null);
	const [source, setSource] = react.default.useState(null);
	const [rel, setRel] = react.default.useState("supersedes");
	const [text, setText] = react.default.useState("");
	const taRef = react.default.useRef(null);
	const [dispatching, setDispatching] = react.default.useState(false);
	const [dispatchOut, setDispatchOut] = react.default.useState(null);
	const [composing, setComposing] = react.default.useState(false);
	const [fId, setFId] = react.default.useState("");
	const [fTitle, setFTitle] = react.default.useState("");
	const [fTag, setFTag] = react.default.useState("forum-kb");
	const [fSummary, setFSummary] = react.default.useState("");
	const [fBody, setFBody] = react.default.useState("");
	react.default.useEffect(() => {
		mounted.current = true;
		const loop = createRefreshLoop({
			read: (valid) => readRef.current(valid),
			visible: () => document.visibilityState !== "hidden" && !!rootRef.current?.getClientRects().length,
			onError: (error) => setSyncErr(String(error))
		});
		loopRef.current = loop;
		const wake = () => {
			loop.request();
		};
		window.addEventListener("focus", wake);
		document.addEventListener("visibilitychange", wake);
		wake();
		return () => {
			mounted.current = false;
			loop.dispose();
			window.removeEventListener("focus", wake);
			document.removeEventListener("visibilitychange", wake);
			loopRef.current = null;
		};
	}, [forumKb]);
	react.default.useEffect(() => {
		if (typeof forumKb.toolIndex !== "function") return;
		Promise.resolve(forumKb.toolIndex()).then((r) => {
			if (r && r.ok === false) throw new Error(r.error && r.error.message);
			const v = r && r.value ? r.value : r;
			if (mounted.current) setToolsCache(Array.isArray(v) ? v : []);
		}).catch(() => {
			if (mounted.current) setToolsCache([]);
		});
	}, []);
	react.default.useEffect(() => {
		saveLocalMap("forum-kb:stars", stars);
	}, [stars]);
	react.default.useEffect(() => {
		saveLocalMap("forum-kb:reads", reads);
	}, [reads]);
	function updateSessions(v) {
		const idx = {};
		for (const row of Array.isArray(v) ? v : []) {
			const pid = String((row && row.post) ?? "");
			if (!pid) continue;
			const cur = idx[pid] || {
				n: 0,
				live: 0,
				authors: []
			};
			cur.n += 1;
			if (row.live) cur.live += 1;
			const a = String((row && row.author) ?? "").toLowerCase();
			if (a && !cur.authors.includes(a)) cur.authors.push(a);
			idx[pid] = cur;
		}
		setSessIdx(idx);
	}
	function onRef(kind, value) {
		if (kind === "post" && value) open(value);
		else if (kind === "file" && value && typeof forumKb.openRef === "function") Promise.resolve(forumKb.openRef({ path: value })).then((r) => {
			const v = r && r.value ? r.value : r;
			if (v && v.ok === false) setErr("打开文件失败：" + (v.error ?? "?"));
		}).catch((e) => setErr("打开文件失败：" + String(e && e.message || e)));
	}
	const activeMentions = react.default.useMemo(() => parseMentions(text), [text]);
	const presetSig = activeMentions.map((t) => t + "=" + (presetSel[t] || "") + "/" + (permSel[t] || "")).join(",");
	const inView = !!detail && detail.kind === "view";
	const viewCurrent = inView ? currentOf() : null;
	const previewGen = react.default.useRef(0);
	react.default.useEffect(() => {
		if (!activeMentions.length || !sel || !dispatchInfoAvailable || !inView) {
			setInfoData((d) => d && d.preview ? null : d);
			return;
		}
		const on = target || viewCurrent;
		const gen = ++previewGen.current;
		const t = setTimeout(() => {
			Promise.resolve(forumKb.dispatchInfo({
				post: sel,
				on,
				targets: activeMentions.map((m) => ({
					name: m,
					preset: presetSel[m] || void 0,
					permission: permSel[m] || void 0
				}))
			})).then((r) => {
				if (gen !== previewGen.current) return;
				if (r && r.ok === false) throw new Error(r.error && r.error.message);
				const v = r && r.value ? r.value : r;
				setInfoData(v && typeof v === "object" ? v : null);
				if (v && Array.isArray(v.presets) && v.presets.length) setRoster(v.presets);
				if (v && Array.isArray(v.permissions)) setPermRoster(v.permissions);
			}).catch(() => {
				if (gen === previewGen.current) setInfoData(null);
			});
		}, 300);
		return () => {
			clearTimeout(t);
			previewGen.current += 1;
		};
	}, [
		activeMentions,
		presetSig,
		sel,
		target,
		dispatchInfoAvailable,
		inView,
		viewCurrent
	]);
	function open(id) {
		loopRef.current?.invalidate();
		draftAnchor.current = null;
		setSel(id);
		setDetail(null);
		setErr(null);
		setTarget(null);
		setSource(null);
		setRel("supersedes");
		setDispatchOut(null);
		setDispatching(false);
		setRefsData(null);
		setRefsErr(null);
		setInCase(null);
		setPresetSel({});
		setPermSel({});
		setPresetMenuFor(null);
		setInfoData(null);
	}
	react.default.useEffect(() => {
		loopRef.current?.request();
	}, [sel]);
	readRef.current = async (valid) => {
		if (busy) return;
		const errors = [];
		const unwrap = (r) => {
			if (r?.ok === false) throw new Error(r.error?.message || String(r.error));
			return r?.value ?? r;
		};
		const run = async (label, work) => {
			try {
				await work();
			} catch (e) {
				errors.push(label + "：" + String(e?.message || e));
			}
		};
		await Promise.all([
			run("列表", async () => {
				const v = unwrap(await forumKb.list());
				if (!Array.isArray(v)) throw new Error("列表返回格式错误");
				if (valid()) setPosts(v);
			}),
			run("搜索", async () => {
				if (!term || !ftsAvailable) return;
				try {
					const rows = unwrap(await forumKb.search({ term }));
					if (!Array.isArray(rows)) throw new Error("搜索返回格式错误");
					if (valid()) setFtsIds(new Set(rows.map((x) => String(x.id))));
				} catch (error) {
					if (valid()) setFtsIds(null);
					throw error;
				} finally {
					if (valid()) setSearching(false);
				}
			}),
			run("在案", async () => {
				if (typeof forumKb.dispatchSessions !== "function") return;
				const v = unwrap(await forumKb.dispatchSessions());
				if (valid()) updateSessions(v);
			}),
			run("详情", async () => {
				if (!sel) return;
				try {
					if (typeof forumKb.view !== "function") throw new Error("view 端点缺席");
					const v = unwrap(await forumKb.view(sel));
					if (!v?.id || v.id !== sel) throw new Error("view 返回的帖子不匹配");
					const nv = normalizeView(v);
					if (valid()) {
						setDetail({
							kind: "view",
							post: nv
						});
						recordRead(sel, nv.answers.length, nv.answers.reduce((n, a) => n + a.comments.length, 0));
					}
				} catch (error) {
					if (detail) throw error;
					const v = unwrap(await forumKb.read(sel));
					if (valid()) setDetail({
						kind: "md",
						markdown: v?.markdown || "",
						viewError: String(error)
					});
				}
			}),
			run("引用", async () => {
				if (!sel || typeof forumKb.refs !== "function") return;
				const v = unwrap(await forumKb.refs({ id: sel }));
				if (valid()) {
					setRefsData(v);
					setRefsErr(null);
				}
			}),
			run("派活信息", async () => {
				if (!sel || !dispatchInfoAvailable) return;
				const v = unwrap(await forumKb.dispatchInfo({ post: sel }));
				if (valid()) {
					setInCase(Array.isArray(v?.inCase) ? v.inCase : []);
					if (Array.isArray(v?.presets)) setRoster(v.presets);
					if (Array.isArray(v?.permissions)) setPermRoster(v.permissions);
				}
			})
		]);
		if (valid()) setSyncErr(errors.length ? "同步失败，将自动重试。" + errors.join("；") : null);
	};
	function currentOf() {
		if (draftAnchor.current?.post === sel) return draftAnchor.current.current;
		if (detail && detail.kind === "view" && detail.post.current) return detail.post.current;
		if (!sel || !posts) return null;
		const p = posts.find((x) => x.id === sel);
		return p && p.current ? p.current : null;
	}
	function assignedOf() {
		if (detail && detail.kind === "view") return detail.post.assigned ?? null;
		if (!sel || !posts) return null;
		const p = posts.find((x) => x.id === sel);
		return p ? p.assigned ?? null : null;
	}
	function call(method, args) {
		loopRef.current?.invalidate();
		setBusy(true);
		setErr(null);
		return Promise.resolve(forumKb[method](args)).then((r) => {
			setBusy(false);
			if (r && r.ok === false) {
				setErr(r.error && r.error.message);
				return r;
			}
			return r;
		}).catch((e) => {
			setBusy(false);
			setErr(String(e));
			return null;
		});
	}
	react.default.useEffect(() => {
		if (!busy) loopRef.current?.request();
	}, [busy]);
	const focusTa = () => {
		setTimeout(() => {
			try {
				if (taRef.current) taRef.current.focus();
			} catch {}
		}, 30);
	};
	const onAnswerComment = (id) => {
		setMode("comment");
		setTarget(id);
		focusTa();
	};
	const onAnswerQuote = (a) => {
		setMode("answer");
		setSource(a.id);
		setRel(a.current ? "supersedes" : "extends");
		if (sel && !draftAnchor.current) draftAnchor.current = {
			post: sel,
			current: currentOf()
		};
		setText((t) => quoteOf(a) + t);
		focusTa();
	};
	const doClaim = () => call("claim", {
		post: sel,
		as: role
	});
	const doPin = () => {
		if (!sel) return;
		const p = (posts || []).find((x) => x.id === sel);
		const pinnedNow = detail && detail.kind === "view" ? !!detail.post.pinned : !!(p && p.pinned);
		return call("pin", {
			post: sel,
			set: pinnedNow ? "off" : "on"
		});
	};
	const toggleStar = (id) => {
		if (!id) return;
		setStars((s) => {
			const n = { ...s };
			if (n[id]) delete n[id];
			else n[id] = Date.now();
			return n;
		});
	};
	const recordRead = (id, answers, comments) => {
		if (!id) return;
		setReads((r) => ({
			...r,
			[id]: {
				a: answers,
				c: comments,
				at: (/* @__PURE__ */ new Date()).toISOString()
			}
		}));
	};
	const doComment = async () => {
		const on = target || currentOf();
		if (!on) {
			setErr("暂无可挂评论的 answer——先用「巩固」发出首条 answer");
			return;
		}
		if (!text.trim()) {
			setErr("评论内容为空");
			return;
		}
		const bodyText = text;
		const targets = parseMentions(bodyText);
		const r = await call("comment", {
			post: sel,
			as: role,
			on,
			body: bodyText
		});
		if (r && r.ok !== false) {
			draftAnchor.current = null;
			setText("");
			setTarget(null);
			setPresetSel({});
			setPermSel({});
			setPresetMenuFor(null);
			if (targets.length && detail && detail.kind === "view" && typeof forumKb.dispatch === "function") {
				setDispatching(true);
				setDispatchOut(null);
				try {
					const dr = await Promise.resolve(forumKb.dispatch({
						post: sel,
						on,
						targets: targets.map((t) => ({
							name: t,
							preset: presetSel[t] || void 0,
							permission: permSel[t] || void 0
						})),
						author: role,
						body: bodyText
					}));
					const v = dr && dr.value ? dr.value : dr;
					setDispatchOut(Array.isArray(v) ? v : [{
						target: "?",
						ok: false,
						error: "dispatch 返回异常"
					}]);
				} catch (e) {
					setDispatchOut([{
						target: "?",
						ok: false,
						error: String(e && e.message || e)
					}]);
				} finally {
					setDispatching(false);
				}
				if (typeof forumKb.dispatchInfo === "function") Promise.resolve(forumKb.dispatchInfo({ post: sel })).then((r2) => {
					const v2 = r2 && r2.value ? r2.value : r2;
					if (v2 && Array.isArray(v2.inCase)) setInCase(v2.inCase);
				}).catch(() => {});
			} else if (targets.length && typeof forumKb.dispatch !== "function") setDispatchOut([{
				target: targets[0],
				ok: false,
				error: "bundle 描述符无 dispatch（host 未升级或浏览器是旧构建）"
			}]);
		}
	};
	const doAnswer = async () => {
		if (!text.trim()) {
			setErr("answer 正文为空");
			return;
		}
		const hasAnswers = !!(detail && detail.kind === "view" ? detail.post.answers.length : currentOf());
		const src = source || currentOf();
		if (hasAnswers && !src) {
			setErr("无 source（非首条 answer 必须指向一条先前 reply）");
			return;
		}
		const r = await call("answer", {
			post: sel,
			as: role,
			source: src || "",
			rel: src ? rel : "extends",
			body: text
		});
		if (r && r.ok !== false) {
			draftAnchor.current = null;
			setText("");
			setSource(null);
			setRel("supersedes");
		}
	};
	const doCreatePost = async () => {
		const explicit = fId.trim();
		if (explicit && !/^[a-z0-9][a-z0-9-]*$/.test(explicit)) {
			setErr("slug 非法：小写字母/数字/连字符，且以字母或数字开头（或留空自动生成哈希 id）");
			return;
		}
		if (!fTitle.trim() || !fTag.trim() || !fSummary.trim() || !fBody.trim()) {
			setErr("title / tag / summary / query 正文均必填");
			return;
		}
		const r = await call("post", {
			id: explicit,
			title: fTitle,
			author: role,
			tag: fTag,
			summary: fSummary,
			body: fBody
		});
		if (r && r.ok !== false) {
			const val = r && r.value ? r.value : r;
			const fromText = (val && typeof val.text === "string" ? (val.text.match(/✓ 创建帖子 (\S+)/) || [])[1] : "") || "";
			const newId = String(val && val.id || explicit || fromText || "");
			setComposing(false);
			setFId("");
			setFTitle("");
			setFTag("forum-kb");
			setFSummary("");
			setFBody("");
			if (newId) open(newId);
		}
	};
	const wrap = {
		display: "flex",
		flexDirection: "column",
		height: "100%",
		minHeight: 0,
		background: T.bg,
		color: T.text1,
		fontFamily: T.sans
	};
	const scroll = {
		flex: "1 1 auto",
		minHeight: 0,
		overflowY: "auto",
		padding: "12px 16px 16px",
		boxSizing: "border-box"
	};
	const errBar = err ? react.default.createElement("div", { style: {
		background: T.dangerBg,
		border: `1px solid ${T.dangerBd}`,
		color: T.danger,
		borderRadius: 8,
		padding: "7px 10px",
		fontSize: 12,
		marginBottom: 10
	} }, String(err)) : null;
	const inp = {
		padding: "7px 9px",
		borderRadius: 8,
		border: `1px solid ${T.border}`,
		fontSize: 13,
		width: "100%",
		boxSizing: "border-box",
		marginBottom: 8,
		background: T.surface,
		color: T.text1,
		fontFamily: T.sans,
		outline: "none"
	};
	const btn = {
		padding: "6px 12px",
		borderRadius: 8,
		border: `1px solid ${T.brand2}`,
		background: T.brand,
		color: "#fff",
		cursor: busy ? "default" : "pointer",
		fontSize: 12.5,
		opacity: busy ? .6 : 1,
		flex: "none"
	};
	const postRow = (p, pinnedRow, freq) => react.default.createElement("div", {
		key: p.id,
		onClick: () => open(p.id),
		style: {
			padding: "10px 12px",
			borderRadius: 10,
			cursor: "pointer",
			marginBottom: 6,
			background: sel === p.id ? T.brandSoft : T.surface,
			border: `1px solid ${sel === p.id ? T.brand : T.border}`,
			borderLeft: pinnedRow ? `3px solid ${T.amber}` : freq && freq.starred ? `3px solid ${T.amber}` : void 0,
			boxShadow: sel === p.id ? T.shadow : "none"
		}
	}, react.default.createElement("div", { style: {
		display: "flex",
		alignItems: "center",
		gap: 8
	} }, StateBadge(p.state), p.entry ? react.default.createElement("span", {
		style: {
			color: T.brand,
			fontSize: 12
		},
		title: "entry 上手入口"
	}, "★") : null, p.pinned ? react.default.createElement("span", {
		style: {
			color: T.amber,
			fontSize: 12
		},
		title: p.pinnedScope ? "tag 内置顶 #" + p.pinnedScope : "全局置顶"
	}, "📌") : null, react.default.createElement("span", { style: {
		fontWeight: 600,
		fontSize: 13.5,
		color: T.text1
	} }, p.title), isNewPost(p) ? react.default.createElement("span", {
		style: {
			fontFamily: T.mono,
			fontSize: 10,
			padding: "1px 6px",
			borderRadius: 6,
			background: T.blue,
			color: "#fff",
			flex: "none"
		},
		title: "上次打开后有新回复"
	}, "有新") : null, react.default.createElement("span", { style: { flex: "1 1 auto" } }), freq && freq.sess ? react.default.createElement("span", {
		style: {
			fontFamily: T.mono,
			fontSize: 10,
			color: T.text2,
			background: T.surface2,
			border: `1px solid ${T.border}`,
			borderRadius: 6,
			padding: "1px 6px",
			flex: "none"
		},
		title: "在案 " + freq.sess.n + " 个派活会话（" + freq.sess.authors.map((a) => "@" + a).join(" ") + "）" + (freq.sess.live ? " · " + freq.sess.live + " 活" : " · 冷：@ 触发冷恢复")
	}, "在案 " + freq.sess.n) : null, react.default.createElement("button", {
		onClick: (e) => {
			e.stopPropagation();
			toggleStar(p.id);
		},
		title: freq && freq.starred ? "取消常用（本地星标，仅本浏览器）" : "标为常用（本地星标，仅本浏览器）",
		style: {
			border: "none",
			background: "transparent",
			cursor: "pointer",
			fontSize: 13,
			lineHeight: 1,
			padding: "0 2px",
			color: freq && freq.starred ? T.amber : T.grayL,
			flex: "none"
		}
	}, freq && freq.starred ? "⭐" : "☆")), react.default.createElement("div", { style: {
		fontFamily: T.mono,
		fontSize: 11,
		color: T.text3,
		marginTop: 4
	} }, [
		p.assigned ? "负责 " + p.assigned : null,
		p.current ? "current " + p.current : null,
		p.answers != null ? `${p.answers}a·${p.comments}c` : null,
		p.pinned ? "📌" + (p.pinnedScope || "global") : null,
		p.id
	].filter(Boolean).join(" · ")), p.summary ? react.default.createElement("div", { style: {
		fontSize: 12,
		color: T.text2,
		marginTop: 3,
		display: "-webkit-box",
		WebkitBoxOrient: "vertical",
		WebkitLineClamp: 2,
		overflow: "hidden"
	} }, p.summary) : null);
	const listEl = react.default.createElement("div", null, posts === null ? react.default.createElement("div", { style: {
		color: T.text3,
		fontSize: 13
	} }, "加载中…") : composing ? newPostForm() : posts.length === 0 ? react.default.createElement("div", { style: {
		color: T.text3,
		fontSize: 13
	} }, "（无帖子）") : visible.length === 0 ? react.default.createElement("div", { style: {
		color: T.text3,
		fontSize: 13
	} }, "（无匹配——调整搜索词或筛选条件）") : react.default.createElement("div", null, pinnedPosts.length ? react.default.createElement("div", { style: { marginBottom: 10 } }, SectionLabel(`📌 置顶 · ${pinnedPosts.length}`, T.amber), react.default.createElement("div", { style: { marginTop: 6 } }, pinnedPosts.map((p) => postRow(p, true, {
		starred: !!stars[p.id],
		sess: sessOf(p.id)
	})))) : null, freqPosts.length ? react.default.createElement("div", { style: { marginBottom: 10 } }, SectionLabel(`⭐ 常用 · ${freqPosts.length}`, T.green), react.default.createElement("div", { style: {
		fontFamily: T.mono,
		fontSize: 10,
		color: T.text3,
		marginTop: 3
	} }, sessIdx ? "本地星标 + dispatch 在案推导（仅本浏览器可见）" : "本地星标（host 未重启，暂无在案推导）"), react.default.createElement("div", { style: { marginTop: 6 } }, freqPosts.map((p) => postRow(p, false, {
		starred: !!stars[p.id],
		sess: sessOf(p.id)
	})))) : null, listPosts.map((p) => postRow(p, false, {
		starred: !!stars[p.id],
		sess: sessOf(p.id)
	}))));
	function newPostForm() {
		return Card([
			SectionLabel("发起新帖", T.brand),
			react.default.createElement("div", {
				key: "slug",
				style: {
					display: "flex",
					gap: 8,
					marginTop: 10
				}
			}, react.default.createElement("input", {
				value: fId,
				onChange: (e) => setFId(String(e.target.value || "").toLowerCase().replace(/[^a-z0-9-]/g, "-")),
				placeholder: "slug（可留空 = 自动生成哈希 id）",
				title: "留空由系统生成 12 位哈希 id；填写则用小写字母/数字/连字符",
				style: Object.assign({}, inp, {
					fontFamily: T.mono,
					flex: "1 1 40%"
				})
			}), react.default.createElement("input", {
				value: fTag,
				onChange: (e) => setFTag(e.target.value),
				placeholder: "tag",
				style: Object.assign({}, inp, { flex: "1 1 20%" })
			})),
			react.default.createElement("input", {
				key: "title",
				value: fTitle,
				onChange: (e) => setFTitle(e.target.value),
				placeholder: "标题",
				style: inp
			}),
			react.default.createElement("input", {
				key: "summary",
				value: fSummary,
				onChange: (e) => setFSummary(e.target.value),
				placeholder: "summary：一句话定位 + 资产清单",
				style: inp
			}),
			react.default.createElement(MentionTextarea, {
				key: "body",
				value: fBody,
				onChange: setFBody,
				rows: 5,
				sources: (() => {
					const authorSet = [];
					for (const p of posts || []) for (const a of [p.author, p.assigned]) {
						const s = String(a ?? "").toLowerCase();
						if (s && s !== "user" && s !== role.toLowerCase() && !authorSet.includes(s)) authorSet.push(s);
					}
					return [
						{
							section: "作者",
							startsWithOnly: true,
							items: authorSet.map((s) => ({
								token: s,
								desc: "召唤该 agent（到帖子评论区 @ 它）"
							}))
						},
						{
							section: "论坛帖子",
							items: (posts || []).map((p) => ({
								token: "post:" + String(p.id ?? ""),
								desc: String(p.title ?? "") || "帖子"
							}))
						},
						{
							section: "host 工具",
							items: toolsCache.map((t) => ({
								token: "tool:" + String(t.name ?? ""),
								desc: String(t.description ?? "host 工具")
							}))
						}
					];
				})(),
				onCtrlEnter: doCreatePost,
				placeholder: "query 正文（任务定义 · 可 @post:<id> / @tool:<名> / @作者 引用与召唤）",
				style: Object.assign({}, inp, { resize: "vertical" })
			}),
			react.default.createElement("div", {
				key: "foot",
				style: {
					display: "flex",
					gap: 8,
					justifyContent: "flex-end"
				}
			}, react.default.createElement("button", {
				onClick: () => {
					setComposing(false);
					setErr(null);
				},
				style: ghostBtn()
			}, "取消"), react.default.createElement("button", {
				onClick: doCreatePost,
				disabled: busy,
				style: btn
			}, "发布")),
			react.default.createElement("div", {
				key: "hint",
				style: {
					fontFamily: T.mono,
					fontSize: 10.5,
					color: T.text3,
					marginTop: 8
				}
			}, `author = ${role}（身份可在下方 composer 修改）· slug 留空 = 发布后自动获得哈希 id 并直接打开新帖`)
		], { padding: "12px 14px" });
	}
	function composer(p) {
		const on = target || p.currentId;
		const src = source || p.currentId;
		const isComment = mode === "comment";
		const submit = isComment ? doComment : doAnswer;
		const disabled = busy || !text.trim() || isComment && !p.hasAnswers;
		const mentionsInText = parseMentions(text);
		const seen = [];
		const push = (x) => {
			const s = String(x ?? "").toLowerCase();
			if (s && s !== "user" && s !== role.toLowerCase() && !seen.includes(s)) seen.push(s);
		};
		if (detail && detail.kind === "view") {
			push(detail.post.assigned);
			push(detail.post.author);
			for (const a of detail.post.answers) {
				push(a.author);
				for (const c of a.comments) push(c.author);
			}
		}
		const threadAuthor = String((detail && detail.kind === "view" ? (detail.post.answers.find((a) => a.id === on) || {}).author : "") || "").toLowerCase();
		const composerSources = [
			{
				section: "作者",
				startsWithOnly: true,
				items: (threadAuthor && seen.includes(threadAuthor) ? [threadAuthor, ...seen.filter((s) => s !== threadAuthor)] : seen).map((s) => ({
					token: s,
					desc: s === threadAuthor ? "thread 作者（默认配对）· 派活候选" : "召唤该 agent（派活候选）"
				}))
			},
			{
				section: "论坛帖子",
				items: (posts || []).map((p) => ({
					token: "post:" + String(p.id ?? ""),
					desc: String(p.title ?? "") || "帖子"
				}))
			},
			{
				section: "host 工具",
				items: toolsCache.map((t) => ({
					token: "tool:" + String(t.name ?? ""),
					desc: String(t.description ?? "host 工具")
				}))
			}
		];
		const modeBtn = (m, label) => react.default.createElement("button", {
			onClick: () => setMode(m),
			style: {
				padding: "3px 10px",
				fontSize: 12,
				border: "none",
				cursor: "pointer",
				background: mode === m ? T.brandSoft : "transparent",
				color: mode === m ? T.brand : T.text3,
				fontWeight: mode === m ? 600 : 400
			}
		}, label);
		const clearChip = (doClear) => react.default.createElement("button", {
			onClick: doClear,
			style: ghostBtn({
				fontSize: 10,
				padding: "1px 6px",
				color: T.text3
			}),
			title: "恢复默认目标"
		}, "✕");
		const menuRow = (active, broken) => ({
			display: "flex",
			alignItems: "center",
			gap: 6,
			padding: "5px 8px",
			borderRadius: 7,
			cursor: broken ? "not-allowed" : "pointer",
			fontSize: 12,
			color: broken ? T.text3 : active ? T.brand : T.text1,
			background: active ? T.brandSoft : "transparent",
			opacity: broken ? .6 : 1
		});
		const presetMenu = (t) => {
			const menuDivider = (label) => react.default.createElement("div", {
				key: label,
				style: {
					fontFamily: T.mono,
					fontSize: 10,
					color: T.text3,
					padding: "6px 8px 2px",
					borderTop: `1px solid ${T.border}`,
					marginTop: 4
				}
			}, label);
			return react.default.createElement("div", { style: {
				position: "absolute",
				top: "calc(100% + 4px)",
				left: 0,
				zIndex: 30,
				minWidth: 280,
				maxHeight: 300,
				overflowY: "auto",
				background: T.surface,
				border: `1px solid ${T.borderStrong}`,
				borderRadius: 10,
				boxShadow: T.shadow,
				padding: 6
			} }, react.default.createElement("div", {
				key: "__default",
				onClick: () => {
					setPresetSel((s) => {
						const n = { ...s };
						delete n[t];
						return n;
					});
					setPresetMenuFor(null);
				},
				style: menuRow(!presetSel[t]),
				title: "解析链：发派选择 > config.presetRoutes > 部署默认"
			}, (!presetSel[t] ? "✓ " : "") + "部署默认（按解析链）"), ...roster.map((pr) => react.default.createElement("div", {
				key: pr.id,
				onClick: pr.broken ? void 0 : () => {
					setPresetSel((s) => ({
						...s,
						[t]: pr.id
					}));
					setPresetMenuFor(null);
				},
				style: menuRow(presetSel[t] === pr.id, pr.broken),
				title: (pr.description ? pr.description + " · " : "") + (pr.broken ? "不可挂载：" + pr.broken : "trust " + (pr.trust ?? "?")) + " · id " + pr.id
			}, (presetSel[t] === pr.id ? "✓ " : "") + (pr.name || pr.id) + (pr.broken ? "（broken）" : ""))), ...permRoster.length ? [
				menuDivider("── 权限档（仅新建生效；缺省 = 部署默认）"),
				react.default.createElement("div", {
					key: "__perm_default",
					onClick: () => {
						setPermSel((s) => {
							const n = { ...s };
							delete n[t];
							return n;
						});
						setPresetMenuFor(null);
					},
					style: menuRow(!permSel[t]),
					title: "不显式选档：新会话吃部署默认权限面（现行为）"
				}, (!permSel[t] ? "✓ " : "") + "部署默认档"),
				...permRoster.map((pm) => react.default.createElement("div", {
					key: "perm" + pm.name,
					onClick: () => {
						setPermSel((s) => ({
							...s,
							[t]: pm.name
						}));
						setPresetMenuFor(null);
					},
					style: menuRow(permSel[t] === pm.name),
					title: (pm.description ? pm.description + " · " : "") + [pm.sandbox ? "sandbox " + pm.sandbox : null, pm.approval ? "approval " + pm.approval : null].filter(Boolean).join(" · ")
				}, (permSel[t] === pm.name ? "✓ " : "") + (pm.name || "?") + (pm.sandbox || pm.approval ? `（${[pm.sandbox, pm.approval].filter(Boolean).join(" + ")}）` : "")))
			] : []);
		};
		return Card([
			react.default.createElement("div", {
				key: "head",
				style: {
					display: "flex",
					alignItems: "center",
					gap: 8,
					flexWrap: "wrap",
					marginBottom: 8
				}
			}, SectionLabel("撰写", T.brand), react.default.createElement("span", { style: {
				display: "inline-flex",
				alignItems: "center",
				gap: 5
			} }, react.default.createElement("span", { style: {
				fontFamily: T.mono,
				fontSize: 10.5,
				color: T.text3
			} }, "身份"), react.default.createElement("input", {
				value: role,
				onChange: (e) => setRole(e.target.value),
				style: {
					fontFamily: T.mono,
					fontSize: 12,
					padding: "2px 8px",
					width: 110,
					borderRadius: 6,
					border: `1px solid ${T.border}`,
					background: T.surface2,
					color: T.text1,
					outline: "none"
				},
				title: "发帖/认领/评论/巩固的作者名"
			})), p.assigned === role ? MonoChip("已认领 " + p.assigned, true, "assigned = 当前身份") : react.default.createElement("button", {
				onClick: doClaim,
				disabled: busy,
				style: ghostBtn({
					fontSize: 11,
					padding: "2px 8px"
				}),
				title: "乐观认领：assigned = 当前身份"
			}, "认领此帖"), react.default.createElement("span", { style: {
				marginLeft: "auto",
				display: "inline-flex",
				border: `1px solid ${T.border}`,
				borderRadius: 8,
				overflow: "hidden",
				flex: "none"
			} }, modeBtn("comment", "评论 · 草稿"), modeBtn("answer", "巩固 · answer"))),
			isComment && !p.hasAnswers ? react.default.createElement("div", {
				key: "noans",
				style: {
					fontFamily: T.mono,
					fontSize: 11,
					color: T.amber,
					marginBottom: 8
				}
			}, "暂无 answer——切到「巩固」发出首条 answer 后，评论（草稿）才可用。") : null,
			react.default.createElement(MentionTextarea, {
				value: text,
				onChange: (value) => {
					if (value && sel && !draftAnchor.current) draftAnchor.current = {
						post: sel,
						current: currentOf()
					};
					if (!value) draftAnchor.current = null;
					setText(value);
				},
				rows: 3,
				inputRef: taRef,
				sources: composerSources,
				onCtrlEnter: () => {
					if (!disabled) submit();
				},
				placeholder: isComment ? p.hasAnswers ? `评论（草稿）→ 挂在 ${on} 下 · @agent 派活 · Ctrl+Enter 发送` : "暂无 answer 可评论" : `answer 正文（巩固 → current 移到新 answer）${src ? " · 源 " + src : " · 首条（root）"} · Ctrl+Enter 发送`,
				style: Object.assign({}, inp, {
					resize: "vertical",
					marginBottom: 6
				})
			}),
			react.default.createElement("div", {
				key: "act",
				style: {
					display: "flex",
					alignItems: "center",
					gap: 6,
					flexWrap: "wrap"
				}
			}, isComment ? react.default.createElement(react.default.Fragment, null, MonoChip(`→ 草稿 · 挂在 ${on || "?"}`, false, "评论目标 answer"), target ? clearChip(() => setTarget(null)) : null, ...mentionsInText.length ? mentionsInText.map((t) => react.default.createElement("span", {
				key: "tg" + t,
				style: {
					display: "inline-flex",
					position: "relative"
				}
			}, react.default.createElement("button", {
				onClick: () => {
					setPresetMenuFor(presetMenuFor === t ? null : t);
					if ((!roster.length || !permRoster.length) && dispatchInfoAvailable && sel) Promise.resolve(forumKb.dispatchInfo({ post: sel })).then((r) => {
						const v = r && r.value ? r.value : r;
						if (v && Array.isArray(v.presets) && v.presets.length) setRoster(v.presets);
						if (v && Array.isArray(v.permissions)) setPermRoster(v.permissions);
					}).catch(() => {});
				},
				style: {
					fontFamily: T.mono,
					fontSize: 11,
					padding: "1px 7px",
					borderRadius: 6,
					cursor: "pointer",
					whiteSpace: "nowrap",
					background: T.brand,
					color: "#fff",
					border: `1px solid ${T.brand2}`
				},
				title: "发派组成 + 权限（点击选；解析链 = 选择 > 路由表 > 部署默认；权限档缺省 = 部署默认；均仅对新建生效）"
			}, "@" + t + " · " + (presetSel[t] ? presetLabelOf(presetSel[t]) : "默认组成") + (permSel[t] ? " · " + permSel[t] : "")), presetMenuFor === t ? presetMenu(t) : null)) : []) : react.default.createElement(react.default.Fragment, null, MonoChip(src ? `→ answer · 源 ${src}` : "→ answer · 首条（root）", false, "新 answer 的 source 软引用"), source ? clearChip(() => {
				setSource(null);
				setRel("supersedes");
			}) : null, src ? REL_OPTS.map((o) => react.default.createElement("button", {
				key: o.v,
				onClick: () => setRel(o.v),
				title: REL_LABEL[o.v] + " " + src,
				style: {
					fontFamily: T.mono,
					fontSize: 10.5,
					padding: "1px 7px",
					borderRadius: 6,
					cursor: "pointer",
					border: `1px solid ${rel === o.v ? T.brand2 : T.border}`,
					background: rel === o.v ? T.brandSoft : T.surface,
					color: rel === o.v ? T.brand : T.text3
				}
			}, o.l)) : null), react.default.createElement("span", { style: { flex: "1 1 auto" } }), react.default.createElement("span", { style: {
				fontFamily: T.mono,
				fontSize: 10,
				color: T.text3,
				marginRight: 4
			} }, isComment ? "评论不入 current" : "巩固会移动 current"), react.default.createElement("button", {
				onClick: submit,
				disabled,
				style: Object.assign({}, btn, { opacity: disabled ? .5 : 1 })
			}, isComment ? "发送评论" : "巩固为 answer"))
		], {
			padding: "12px 14px",
			marginTop: 12
		});
	}
	const presetLabelOf = (id) => {
		const row = roster.find((x) => x.id === id);
		return row && row.name || id;
	};
	const dangerChipStyle = {
		fontFamily: T.mono,
		fontSize: 11,
		color: T.danger,
		background: T.dangerBg,
		border: `1px solid ${T.dangerBd}`,
		borderRadius: 6,
		padding: "2px 8px"
	};
	const previewLine = infoData && Array.isArray(infoData.preview) && infoData.preview.length ? react.default.createElement("div", { style: {
		marginTop: 6,
		display: "flex",
		gap: 6,
		flexWrap: "wrap",
		alignItems: "center"
	} }, react.default.createElement("span", { style: {
		fontFamily: T.mono,
		fontSize: 10,
		color: T.text3
	} }, "发派前预览"), ...infoData.preview.map((r, i) => {
		const actionLabel = r.action === "created" ? "新会话" : r.action === "resumed" ? "冷恢复" : "现存·续聊";
		const inCase = r.action !== "created";
		const selPreset = presetSel[r.target];
		const selPerm = permSel[r.target];
		const presetLabel = r.preset ? (r.preset.name || r.preset.id) + (r.preset.broken ? " · broken" : "") : "?";
		const presetTag = inCase && (r.route === "selection" || selPreset) ? `${presetLabel}（现存沿原组成）` : presetLabel;
		const modelLabel = r.model && r.model.provider ? ` · ${r.model.provider}/${r.model.model}` : "";
		const permLabel = inCase ? selPerm ? ` · 权限 ${selPerm}（仅新建生效·现存沿原档）` : r.permission && r.permission.name ? ` · 权限 ${r.permission.name}` : " · 沿会话权限" : r.permission && r.permission.name ? ` · 权限 ${r.permission.name}` : "";
		const label = `@${r.target} · ${actionLabel} · ${r.route === "selection" ? "选定 " : r.route === "routes" ? "路由 " : ""}${presetTag}${modelLabel}${permLabel}`;
		const tip = (r.note ? r.note + " · " : "") + [r.preset && r.preset.description ? r.preset.description : "发派组成预览", r.permission && r.permission.description ? r.permission.description : null].filter(Boolean).join(" · ");
		if (r.preset && r.preset.broken) return react.default.createElement("span", {
			key: i,
			style: dangerChipStyle,
			title: tip
		}, label);
		return MonoChip(label, false, tip);
	})) : null;
	const dispatchLine = dispatching || dispatchOut && dispatchOut.length ? react.default.createElement("div", { style: {
		marginTop: 8,
		display: "flex",
		gap: 6,
		flexWrap: "wrap",
		alignItems: "center"
	} }, dispatching ? react.default.createElement("span", { style: {
		fontFamily: T.mono,
		fontSize: 11,
		color: T.text3
	} }, "派活中…") : null, ...(dispatchOut || []).map((o, i) => o.ok ? MonoChip(`已派 @${o.target} · ${o.action === "created" ? "新会话" : o.action === "resumed" ? "冷恢复" : "现存会话·续聊"}${o.permission ? " · 权限 " + o.permission : ""}`, true, "sessionId " + (o.sessionId ?? "") + (o.action === "live" ? "（增量派活：只递新评论 + 触发评论）" : "") + (o.permission ? "（已落权限档 " + o.permission + "）" : "")) : react.default.createElement("span", {
		key: i,
		style: {
			fontFamily: T.mono,
			fontSize: 11,
			color: T.danger,
			background: T.dangerBg,
			border: `1px solid ${T.dangerBd}`,
			borderRadius: 6,
			padding: "2px 8px"
		}
	}, `@${o.target} 派活失败：${o.error ?? "?"}`))) : null;
	let body = null;
	if (sel === null) body = listEl;
	else if (detail === null) body = react.default.createElement("div", { style: {
		color: T.text3,
		fontSize: 13
	} }, "加载中…");
	else if (detail.kind === "view") {
		const post = detail.post;
		body = react.default.createElement("div", null, PostHeader(post, pinAvailable ? { onPin: doPin } : null, inCase, {
			starred: !!stars[post.id],
			onToggle: () => toggleStar(post.id)
		}), refsData ? RefsPanel(refsData, open) : refsErr ? react.default.createElement("div", { style: {
			marginTop: 10,
			fontFamily: T.mono,
			fontSize: 11,
			color: T.text3,
			background: T.surface2,
			border: `1px solid ${T.border}`,
			borderRadius: 8,
			padding: "6px 9px"
		} }, "refs 面板加载失败：" + refsErr) : null, react.default.createElement("div", { style: {
			display: "flex",
			flexDirection: "column",
			gap: 10,
			marginTop: 10
		} }, post.query ? QueryCard(post.query) : null, ...post.answers.map((a) => AnswerCard(a, {
			onComment: onAnswerComment,
			onQuote: onAnswerQuote
		})), post.answers.length === 0 ? react.default.createElement("div", { style: {
			color: T.text3,
			fontSize: 13
		} }, "（暂无 answer）") : null), composer({
			currentId: currentOf(),
			assigned: post.assigned,
			hasAnswers: post.answers.length > 0
		}), previewLine, dispatchLine);
	} else {
		const cur = currentOf();
		body = react.default.createElement("div", null, Card([
			SectionLabel("markdown 回退", T.grayL),
			detail.viewError ? react.default.createElement("div", {
				key: "verr",
				style: {
					marginTop: 6,
					padding: "6px 9px",
					borderRadius: 8,
					background: T.dangerBg,
					border: `1px solid ${T.dangerBd}`,
					color: T.danger,
					fontSize: 12,
					fontFamily: T.mono,
					wordBreak: "break-word"
				}
			}, "view 失败原因：" + detail.viewError) : null,
			react.default.createElement("div", {
				key: "md",
				style: {
					whiteSpace: "pre-wrap",
					wordBreak: "break-word",
					fontSize: 13,
					lineHeight: 1.6,
					color: T.text1,
					marginTop: 8
				}
			}, detail.markdown)
		], { padding: "12px 14px" }), composer({
			currentId: cur,
			assigned: assignedOf(),
			hasAnswers: cur != null
		}));
	}
	return react.default.createElement("div", {
		style: wrap,
		ref: rootRef,
		"data-forum-kb": BUILD,
		onClick: (e) => handleRefClick(e, onRef)
	}, react.default.createElement("style", { key: "md-css" }, MD_CSS), SubNav({
		inDetail: sel !== null,
		title: detail && detail.kind === "view" ? detail.post.title : (posts || []).find((x) => x.id === sel)?.title,
		state: detail && detail.kind === "view" ? detail.post.state : void 0,
		shown: visible.length,
		count: posts ? posts.length : null,
		busy,
		onBack: () => {
			loopRef.current?.invalidate();
			setSel(null);
			setDetail(null);
			setErr(null);
		},
		onNew: () => {
			setComposing(true);
			setErr(null);
		},
		onRefresh: () => {
			loopRef.current?.request();
		}
	}), sel === null ? FilterBar({
		q,
		onQ: setQ,
		fState: fltState,
		onState: setFltState,
		fTag: fltTag,
		onTag: setFltTag,
		tags: allTags,
		fEntry: fltEntry,
		onEntry: setFltEntry,
		fSort: fltSort,
		onSort: setFltSort,
		searching,
		ftsAvailable,
		hasTerm: !!term
	}) : null, react.default.createElement("div", {
		style: {
			minHeight: 20,
			padding: "2px 16px",
			fontSize: 11,
			color: syncErr ? T.danger : T.text3
		},
		role: "status"
	}, syncErr || "页面可见时每 5 秒自动同步"), react.default.createElement("div", { style: {
		...scroll,
		overflowAnchor: "none"
	} }, errBar, body));
}
const inject = [
	"slots",
	"remote",
	"inputTriggers"
];
function apply(ctx) {
	ctx.effect(async () => {
		const dispose = await ctx.remote.$mount(TYPERT_REMOTE);
		const forumKb = ctx.get("remote.forumKb");
		if (forumKb === void 0) return dispose;
		const unregister = ctx.slots.inject("conversation.view", () => ctx.slots.register({
			name: "conversation.view",
			id: "forum-kb",
			order: 20,
			label: "论坛"
		}, () => react.default.createElement(ForumView, { forumKb })));
		const unregisterMain = ctx.slots.inject("main", () => ctx.slots.register({
			name: "main",
			key: "forum-kb"
		}, () => react.default.createElement(ForumView, { forumKb })));
		const unregisterSidebar = ctx.slots.inject("sidebar.panellist", () => ctx.slots.register({
			name: "sidebar.panellist",
			id: "forum-kb",
			order: 20,
			label: "论坛"
		}, ({ size = 20 }) => react.default.createElement("svg", {
			width: size,
			height: size,
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: 1.7,
			"aria-hidden": true
		}, react.default.createElement("path", { d: "M4 4h16v12H9l-5 4V4zM8 8h8M8 12h6" }))));
		let unregisterSource;
		let retryTimer = null;
		let attempts = 0;
		let disposed = false;
		const tryRegisterSource = () => {
			if (disposed) return;
			try {
				const triggers = ctx.inputTriggers ?? ctx.get("inputTriggers");
				const registerFn = triggers && typeof triggers.registerSource === "function" ? triggers.registerSource.bind(triggers) : triggers && typeof triggers.register === "function" ? triggers.register.bind(triggers) : void 0;
				if (registerFn) {
					unregisterSource = registerForumRefSource(registerFn, forumKb);
					try {
						console.info("[forum-kb] 主输入框 @ 候选源已注册（forum-kb 分组：帖子/工具/作者；@file 走随部署的统一引用源）");
					} catch {}
					return;
				}
				if (triggers) {
					try {
						console.warn("[forum-kb] inputTriggers 形状不符（期待 registerSource）——实际键：" + Object.keys(triggers).join(","));
					} catch {}
					return;
				}
				if (attempts < 20) {
					attempts += 1;
					retryTimer = setTimeout(tryRegisterSource, 500);
					return;
				}
				try {
					console.warn("[forum-kb] inputTriggers 服务缺席——主输入框 @ 候选未注册（论坛功能不受影响）");
				} catch {}
			} catch (e) {
				try {
					console.warn("[forum-kb] @ source 注册异常", e);
				} catch {}
			}
		};
		tryRegisterSource();
		return () => {
			disposed = true;
			try {
				if (retryTimer) clearTimeout(retryTimer);
			} catch {}
			try {
				if (typeof unregisterSource === "function") unregisterSource();
			} catch {}
			if (typeof unregister === "function") unregister();
			if (typeof unregisterMain === "function") unregisterMain();
			if (typeof unregisterSidebar === "function") unregisterSidebar();
			return dispose();
		};
	}, "forum-kb: mount remote.forumKb + register conversation.view");
}
function registerForumRefSource(registerFn, forumKb) {
	const cache = {
		posts: [],
		tools: [],
		at: 0
	};
	const refresh = async () => {
		try {
			const rows = await Promise.resolve(forumKb.list()).then((r) => {
				const v = r && r.value ? r.value : r;
				return Array.isArray(v) ? v : [];
			});
			const tools = typeof forumKb.toolIndex === "function" ? await Promise.resolve(forumKb.toolIndex()).then((r) => {
				const v = r && r.value ? r.value : r;
				return Array.isArray(v) ? v : [];
			}).catch(() => []) : [];
			cache.posts = rows;
			cache.tools = tools;
			cache.at = Date.now();
		} catch {}
	};
	refresh();
	const iv = typeof setInterval === "function" ? setInterval(() => {
		refresh();
	}, 12e4) : void 0;
	const off = registerFn({
		trigger: "@",
		name: "forum-kb",
		order: 20,
		showGroupTitle: true,
		async candidates(_session, req) {
			if (Date.now() - cache.at > 6e4) await refresh();
			const q = String((req && req.query) ?? "").toLowerCase();
			const match = (s) => !q || s.toLowerCase().includes(q);
			const out = [];
			for (const p of cache.posts) if (match(p.id) || match(String(p.title ?? ""))) out.push({
				name: "post:" + p.id,
				description: String(p.title ?? "") + (p.summary ? " — " + String(p.summary).slice(0, 60) : ""),
				section: "论坛帖子",
				value: "@post:" + p.id
			});
			for (const t of cache.tools) if (match(t.name)) out.push({
				name: "tool:" + t.name,
				description: t.description || "host 工具",
				section: "host 工具",
				value: "@tool:" + t.name
			});
			const authors = [];
			for (const p of cache.posts) for (const a of [p.author, p.assigned]) {
				const s = String(a ?? "").toLowerCase();
				if (s && s !== "user" && !authors.includes(s)) authors.push(s);
			}
			for (const a of authors) if (match(a)) out.push({
				name: a,
				description: "论坛作者（召唤/派活在帖子评论区 @ 它）",
				section: "论坛作者",
				value: "@" + a
			});
			return out.slice(0, 12);
		},
		onPick(pick) {
			const value = String((pick && pick.candidate && pick.candidate.value) ?? "");
			if (!value) return void 0;
			return { insert: {
				source: "forum-kb",
				ref: value,
				label: value,
				clipboardText: value
			} };
		},
		codec: {
			clipboardText(ref) {
				return String(ref ?? "");
			},
			async serialize(ref) {
				const s = String(ref ?? "");
				const m = /^@post:(.+)$/.exec(s);
				if (m) {
					let title = "";
					try {
						const v = await Promise.resolve(forumKb.view(m[1])).then((r) => r && r.value ? r.value : r);
						title = v && v.title ? `「${v.title}」` : "";
					} catch {}
					return `forum-kb 帖子 ${m[1]}${title} · 需要详情时用 kb_view（post=${m[1]}）自读`;
				}
				const t = /^@tool:(.+)$/.exec(s);
				if (t) {
					const row = cache.tools.find((x) => x.name === t[1]);
					return `host 工具 ${t[1]}${row && row.description ? "：" + row.description : ""}`;
				}
				const a = /^@([a-z0-9][a-z0-9_-]{0,63})$/i.exec(s);
				if (a) return `论坛作者 ${a[1]}（召唤/派活：到相关帖子的评论区 @ 它）`;
				return s;
			}
		}
	});
	return () => {
		if (typeof iv === "number" || typeof iv === "object") try {
			clearInterval(iv);
		} catch {}
		if (typeof off === "function") off();
	};
}
//#endregion
exports.apply = apply;
exports.inject = inject;
exports.name = name;


    return module.exports;
  }
});
