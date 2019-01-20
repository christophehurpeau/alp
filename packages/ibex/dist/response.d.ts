import Application from '.';
export interface BaseResponse {
    redirect(url: string): void;
}
export interface Response extends BaseResponse {
    app: Application;
}
declare const response: BaseResponse;
export default response;
//# sourceMappingURL=response.d.ts.map