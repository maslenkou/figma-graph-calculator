var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "webpack", "html-webpack-plugin", "./HtmlInlineScriptPlugin"], factory);
    }
})(function (require, exports) {
    "use strict";
    var webpack_1 = require("webpack");
    var html_webpack_plugin_1 = __importDefault(require("html-webpack-plugin"));
    var HtmlInlineScriptPlugin_1 = __importDefault(require("./HtmlInlineScriptPlugin"));
    var isHtmlWebpackPluginV3 = !('getHooks' in html_webpack_plugin_1.default);
    var isHtmlWebpackPluginV4 = webpack_1.version.startsWith('4.');
    var isUnsupportedVersion = isHtmlWebpackPluginV3 || isHtmlWebpackPluginV4;
    if (isUnsupportedVersion) {
        // eslint-disable-next-line no-console
        console.error('\x1b[35m%s \x1b[31m%s\x1b[0m', '[html-inline-script-webpack-plugin]', 'Version 3.x only supports webpack 5. If you are using webpack 4, please downgrade this plugin to version 1.x instead.');
        throw new Error('VERSION_INCOMPATIBLE');
    }
    return HtmlInlineScriptPlugin_1.default;
});
