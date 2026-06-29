"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAnimeFuse = exports.ANIME_SEARCH_WEIGHTS = exports.ANIME_SEARCH_KEYS = void 0;
const fuse_js_1 = __importDefault(require("fuse.js"));
exports.ANIME_SEARCH_KEYS = [
    'title',
    'title_english',
    'title_japanese',
    'title_synonyms',
    'synopsis'
];
exports.ANIME_SEARCH_WEIGHTS = {
    title: 3,
    title_english: 3,
    title_japanese: 2,
    title_synonyms: 2,
    synopsis: 1
};
const createAnimeFuse = (data) => {
    return new fuse_js_1.default(data, {
        keys: exports.ANIME_SEARCH_KEYS.map(key => ({
            name: key,
            weight: exports.ANIME_SEARCH_WEIGHTS[key] || 1
        })),
        threshold: 0.4,
        minMatchCharLength: 2,
        shouldSort: true,
        ignoreLocation: true,
        useExtendedSearch: true,
        includeScore: true
    });
};
exports.createAnimeFuse = createAnimeFuse;
//# sourceMappingURL=fuse.config.js.map