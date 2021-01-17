import type Application from '.';
export interface BaseResponse {
    redirect: (url: string) => Promise<void>;
}
export interface Response extends BaseResponse {
    readonly app: Application;
}
declare const response: BaseResponse;
export default response;
//# sourceMappingURL=response.d.ts.map