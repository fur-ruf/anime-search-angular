"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheService = void 0;
class CacheService {
    constructor(ttlMs = 5 * 60 * 1000) {
        this.cache = new Map();
        this.ttl = ttlMs;
    }
    set(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }
    get(key) {
        const item = this.cache.get(key);
        if (!item)
            return null;
        const isExpired = Date.now() - item.timestamp > this.ttl;
        if (isExpired) {
            this.cache.delete(key);
            return null;
        }
        return item.data;
    }
    has(key) {
        return this.cache.has(key);
    }
    delete(key) {
        this.cache.delete(key);
    }
    clear() {
        this.cache.clear();
    }
    getStats() {
        return {
            size: this.cache.size,
            keys: Array.from(this.cache.keys())
        };
    }
}
exports.CacheService = CacheService;
//# sourceMappingURL=cache.service.js.map