import Application from '.';

export interface BaseResponse {
  redirect(url: string): void;
}

export interface Response extends BaseResponse {
  app: Application;
}

const response: BaseResponse = {
  redirect(this: Response, url: string) {
    if (this.app.emit('redirect', url) === false) {
      window.location.href = url;
    }
  },
};

export default response;
