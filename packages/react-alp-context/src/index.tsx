import type { Context } from 'alp-types';
import React from 'react';

export type AlpContext = Context;

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
export default React.createContext<Context>({} as any);
