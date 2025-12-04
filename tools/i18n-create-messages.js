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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
// creates from files messages.xxx.xlf the file messages.json,
// which contains all the translations
var fs = require("fs");
var path = require("path");
// @ts-ignore
var xliff_1 = require("xliff");
// const extract = require('extract-zip');
var outFile = '../src/assets/messages.json';
function main() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            try {
                // const filenames = ['nightrep (translations)', 'nightrep (english) (translations)'];
                // for (const filename of filenames) {
                //   let zipfile = getPath(`${os.homedir()}/Downloads/${filename}.zip`);
                //   console.log('extracting', zipfile, '...');
                //   await extract(zipfile, {dir: getPath('../temp')});
                // }
                createJson([
                    '@de-DE'
                ], []);
                // for (const filename of filenames) {
                //   fs.rename(
                //     `${os.homedir()}/Downloads/${filename}.zip`,
                //     `${getPath('../temp')}/${filename}.last.zip`,
                //     () => {
                //     });
                // }
            }
            catch (ex) {
                console.error('error when creating messages', ex);
            }
            return [2 /*return*/];
        });
    });
}
main();
// const fileList = [];
// const lng = localStorage.getItem('language') || 'de-DE';
// createJson(['@de-DE', 'en-GB'], []);
function createJson(codes, list) {
    var file;
    var id = codes[0];
    if (id.startsWith('@')) {
        id = id.substring(1);
        file = "../src/locale/messages.".concat(id, ".xliff");
    }
    else {
        var parts = codes[0].split('/');
        var path_1 = codes[0];
        if (parts.length === 2) {
            id = parts[1];
            path_1 = parts[0];
        }
        file = "../temp/".concat(path_1, "/messages.").concat(id, ".xliff");
    }
    var content = fs.readFileSync(getPath(file)).toString();
    parseTranslationsForLocalize(content).then(function (result) {
        list.push({ id: id, data: result });
        codes.splice(0, 1);
        if (codes.length === 0) {
            fs.writeFileSync(getPath(outFile), JSON.stringify(list));
            console.log("created file ".concat(getPath(outFile)));
        }
        else {
            createJson(codes, list);
        }
        //  console.log('Geladene Übersetzungen', result);
        //  loadTranslations(parsedTranslations);
    });
}
function getPath(dir, file) {
    if (dir.startsWith('.') || dir.startsWith('/')) {
        return file ? path.join(__dirname, dir, file) : path.join(__dirname, dir);
    }
    return file ? path.join(dir, file) : dir;
}
function parseTranslationsForLocalize(xml) {
    return xliff_1.default.xliff12ToJs(xml).then(function (parserResult) {
        var xliffContent = parserResult.resources['ng2.template'];
        var src = parserResult.sourceLanguage;
        var dst = parserResult.targetLanguage;
        // console.log('xliff', src, dst, JSON.stringify(parserResult).substring(0, 1000));
        return Object.keys(xliffContent)
            .reduce(function (result, current) {
            var _a;
            var elem = xliffContent[current].target;
            if (elem == null) {
                elem = xliffContent[current].source;
                if (elem != null && dst != null) {
                    console.log("Nicht \u00FCbersetzt von ".concat(src, " nach ").concat(dst, ":"), xliffContent[current].source);
                }
            }
            if (typeof elem === 'string') {
                result[current] = elem;
            }
            else {
                if (elem != null) {
                    if (elem.map == null) {
                        console.error('Fehler bei', elem);
                    }
                    result[current] = (_a = elem.map) === null || _a === void 0 ? void 0 : _a.call(elem, function (entry) {
                        return typeof entry === 'string' ? entry : '{$' + entry['Standalone'].id + '}';
                        //              return typeof entry === 'string' ? entry : '{$' + entry.Standalone['equiv-text'] + '}';
                    }).map(function (entry) {
                        return entry;
                        //                .replace('{{', '{$')
                        //                .replace('}}', '}');
                    }).join('');
                }
            }
            return result;
        }, {});
    });
}
