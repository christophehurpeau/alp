import type Application from '.';

export interface BaseResponse {
  redirect: (url: string) => Promise<void>;
}

export interface Response extends BaseResponse {
  readonly app: Application;
}

const response: BaseResponse = {
  redirect(this: Response, url: string): Promise<void> {
    if (!this.app.emit('redirect', url)) {
      window.location.href = url;
      return new Promise(() => {
        // promise that never resolves.
      });
    }

    return Promise.resolve();
  },
};

export default response;
