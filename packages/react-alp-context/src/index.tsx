import type { Context } from 'alp-types';
import React from 'react';

export type AlpContext = Context;

export default React.createContext<Context>({} as any);
