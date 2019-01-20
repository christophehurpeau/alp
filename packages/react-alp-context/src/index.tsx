import React from 'react';
import { Context } from 'alp-types';

export type AlpContext = Context;

export type AppState = any;

export const AppStateContext = React.createContext<AppState>({});

export default React.createContext<Context>({});
