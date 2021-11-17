#! /usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var merge_schemas_1 = require("@browserql/merge-schemas");
var promises_1 = require("fs/promises");
var path_1 = require("path");
var handleError_1 = require("./handleError");
var log_1 = require("./log");
var package_json_1 = require("./package.json");
var spawnify_1 = require("./spawnify");
function getConfigFile(configFile) {
    return __awaiter(this, void 0, void 0, function () {
        var stats, source, json, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, (0, promises_1.stat)(configFile)];
                case 1:
                    stats = _a.sent();
                    if (!stats.isFile()) {
                        throw new Error("Config file \"" + configFile + "\" is not a file");
                    }
                    return [4 /*yield*/, (0, promises_1.readFile)(configFile)];
                case 2:
                    source = _a.sent();
                    json = void 0;
                    try {
                        json = JSON.parse(source.toString());
                    }
                    catch (error) {
                        throw new Error("Config file \"" + configFile + "\" is not a valid JSON file");
                    }
                    return [2 /*return*/, json];
                case 3:
                    error_1 = _a.sent();
                    throw new Error('Can not find config file');
                case 4: return [2 /*return*/];
            }
        });
    });
}
function getSchema(sources) {
    return __awaiter(this, void 0, void 0, function () {
        var strings;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    strings = [];
                    return [4 /*yield*/, Promise.all(sources.map(function (source) { return __awaiter(_this, void 0, void 0, function () {
                            var files;
                            var _this = this;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, (0, promises_1.readdir)(source)];
                                    case 1:
                                        files = _a.sent();
                                        return [4 /*yield*/, Promise.all(files.map(function (file) { return __awaiter(_this, void 0, void 0, function () {
                                                var stats, _a, _b, src;
                                                return __generator(this, function (_c) {
                                                    switch (_c.label) {
                                                        case 0: return [4 /*yield*/, (0, promises_1.stat)((0, path_1.join)(source, file))];
                                                        case 1:
                                                            stats = _c.sent();
                                                            if (!stats.isDirectory()) return [3 /*break*/, 3];
                                                            _b = (_a = strings).push;
                                                            return [4 /*yield*/, getSchema([(0, path_1.join)(source, file)])];
                                                        case 2:
                                                            _b.apply(_a, [_c.sent()]);
                                                            return [3 /*break*/, 5];
                                                        case 3:
                                                            if (!/\.g(raph)?ql$/.test(file)) return [3 /*break*/, 5];
                                                            (0, log_1.log)(log_1.Log.INFO, "- " + (0, path_1.join)(source, file));
                                                            return [4 /*yield*/, (0, promises_1.readFile)((0, path_1.join)(source, file))];
                                                        case 4:
                                                            src = _c.sent();
                                                            strings.push(src.toString());
                                                            _c.label = 5;
                                                        case 5: return [2 /*return*/];
                                                    }
                                                });
                                            }); }))];
                                    case 2:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); }))];
                case 1:
                    _a.sent();
                    return [2 /*return*/, strings.join('\n')];
            }
        });
    });
}
function codegen(configFile) {
    if (configFile === void 0) { configFile = (0, path_1.join)(process.cwd(), 'codegen.json'); }
    return __awaiter(this, void 0, void 0, function () {
        var config, schema, generates, afterAll, schemas, all, sanitized, graphqlSchema, _i, generates_1, generate, file, handler, _a, executable, after, _b, args, _c, exec, execs, output, _d, contents, posts, error_2;
        var _this = this;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _e.trys.push([0, 13, , 14]);
                    return [4 /*yield*/, (0, log_1.resetLog)()];
                case 1:
                    _e.sent();
                    return [4 /*yield*/, getConfigFile(configFile)];
                case 2:
                    config = _e.sent();
                    schema = config.schema, generates = config.generates, afterAll = config.afterAll;
                    schemas = Array.isArray(schema) ? schema : [schema];
                    (0, log_1.log)(log_1.Log.VERBOSE, "Using codegen v" + package_json_1.version);
                    (0, log_1.log)(log_1.Log.VERBOSE, "Scanning for GraphQL files " + JSON.stringify(schemas.map(function (s) { return (0, path_1.join)(process.cwd(), s); })));
                    (0, log_1.log)(log_1.Log.INFO, '# GraphQL files\n');
                    return [4 /*yield*/, getSchema(schemas.map(function (s) { return (0, path_1.join)(process.cwd(), s); }))];
                case 3:
                    all = _e.sent();
                    if (!all) {
                        throw new Error('Schema is empty!');
                    }
                    sanitized = (0, merge_schemas_1.sanitizeSchema)(all);
                    graphqlSchema = sanitized;
                    (0, log_1.log)(log_1.Log.INFO, "## Schema\n\n```graphql\n" + graphqlSchema + "\n```");
                    _i = 0, generates_1 = generates;
                    _e.label = 4;
                case 4:
                    if (!(_i < generates_1.length)) return [3 /*break*/, 12];
                    generate = generates_1[_i];
                    file = generate.file, handler = generate.handler, _a = generate.executable, executable = _a === void 0 ? 'node' : _a, after = generate.after, _b = generate.arguments, args = _b === void 0 ? {} : _b;
                    (0, log_1.log)(log_1.Log.VERBOSE, "## Generating file " + file + " with handler " + handler + " (arguments: " + JSON.stringify(args) + ", executable: " + executable + ")");
                    (0, log_1.log)(log_1.Log.VERBOSE, "  -- (arguments: " + JSON.stringify(args) + ", executable: " + executable + ")");
                    _c = executable.split(/\s+/), exec = _c[0], execs = _c.slice(1);
                    return [4 /*yield*/, (0, spawnify_1.spawnify)(exec, __spreadArray(__spreadArray([], execs, true), [
                            (0, path_1.join)(process.cwd(), './node_modules/@browserql/codegen/handler.js'),
                            // join(process.cwd(), '../handler.js'),
                            handler,
                            graphqlSchema,
                            JSON.stringify(args),
                        ], false))];
                case 5:
                    output = _e.sent();
                    (0, log_1.log)(log_1.Log.INFO, "### Output\n\n```\n" + output.slice(0, 255) + " ...\n```\n");
                    if (!output) return [3 /*break*/, 7];
                    _d = output.split('======= codegen ======='), contents = _d[1];
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, path_1.join)(process.cwd(), file), contents)];
                case 6:
                    _e.sent();
                    return [3 /*break*/, 9];
                case 7:
                    (0, log_1.log)(log_1.Log.WARNING, '## Output is empty!');
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, path_1.join)(process.cwd(), file), '')];
                case 8:
                    _e.sent();
                    _e.label = 9;
                case 9:
                    posts = [];
                    if (after) {
                        posts.push.apply(posts, (Array.isArray(after) ? after : [after]));
                    }
                    if (afterAll) {
                        posts.push.apply(posts, (Array.isArray(afterAll) ? afterAll : [afterAll]));
                    }
                    return [4 /*yield*/, Promise.all(posts.map(function (post) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/];
                            });
                        }); }))];
                case 10:
                    _e.sent();
                    _e.label = 11;
                case 11:
                    _i++;
                    return [3 /*break*/, 4];
                case 12: return [3 /*break*/, 14];
                case 13:
                    error_2 = _e.sent();
                    (0, handleError_1.handleError)(error_2);
                    (0, log_1.log)(log_1.Log.ERROR, error_2.message + "\n\n" + (error_2.stack || ''));
                    return [3 /*break*/, 14];
                case 14: return [2 /*return*/];
            }
        });
    });
}
var _a = process.argv, _configFile = _a[2];
codegen(_configFile);
// codegen configFile=codegen.json
