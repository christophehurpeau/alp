import { HelmetData } from 'react-helmet';
export interface LayoutOptions {
    version: string;
    scriptName: string | false;
    styleName: string | false;
    initialData?: any;
    polyfillFeatures?: string;
}
export default function htmlLayout(helmet: HelmetData, content: string, { version, scriptName, styleName, initialData, polyfillFeatures, }: LayoutOptions): string;
//# sourceMappingURL=htmlLayout.d.ts.map