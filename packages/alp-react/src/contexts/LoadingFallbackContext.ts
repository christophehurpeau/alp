import { createContext, ReactNode } from 'react';

export default createContext<NonNullable<ReactNode>>('Loading...');
