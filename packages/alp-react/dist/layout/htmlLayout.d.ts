import { HelmetData } from 'react-helmet';
export interface LayoutOptions {
    version: string;
    scriptName: string | false;
    styleName: string | false;
    initialData?: any;
    polyfillFeatures?: string;
}
declare const _default: (helmet: HelmetData, content: string, { version, scriptName, styleName, initialData, polyfillFeatures, }: LayoutOptions) => string;
export default _default;
//# sourceMappingURL=htmlLayout.d.ts.map