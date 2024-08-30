import { Compilation } from 'webpack';
import type { Compiler, WebpackPluginInstance } from 'webpack';
import type { HtmlTagObject } from 'html-webpack-plugin';
export type PluginOptions = {
    scriptMatchPattern?: RegExp[];
    htmlMatchPattern?: RegExp[];
    assetPreservePattern?: RegExp[];
};
declare class HtmlInlineScriptPlugin implements WebpackPluginInstance {
    scriptMatchPattern: NonNullable<PluginOptions['scriptMatchPattern']>;
    htmlMatchPattern: NonNullable<PluginOptions['htmlMatchPattern']>;
    processedScriptFiles: string[];
    ignoredHtmlFiles: string[];
    assetPreservePattern: NonNullable<PluginOptions['assetPreservePattern']>;
    constructor(options?: PluginOptions);
    isFileNeedsToBeInlined(assetName: string): boolean;
    isFileNeedsToBePreserved(assetName: string): boolean;
    shouldProcessHtml(templateName: string): boolean;
    processScriptTag(publicPath: string, assets: Compilation['assets'], tag: HtmlTagObject): HtmlTagObject;
    getPublicPath(compilation: Compilation, htmlFileName: string, customPublicPath: string): string;
    apply(compiler: Compiler): void;
}
export default HtmlInlineScriptPlugin;
