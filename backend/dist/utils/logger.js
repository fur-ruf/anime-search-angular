"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
exports.logger = {
    info: (message, ...args) => {
        console.log(`${new Date().toISOString()} [INFO] ${message}`, ...args);
    },
    error: (message, ...args) => {
        console.error(`${new Date().toISOString()} [ERROR] ${message}`, ...args);
    },
    warn: (message, ...args) => {
        console.warn(`${new Date().toISOString()} [WARN] ${message}`, ...args);
    },
    debug: (message, ...args) => {
        console.debug(`${new Date().toISOString()} [DEBUG] ${message}`, ...args);
    }
};
//# sourceMappingURL=logger.js.map