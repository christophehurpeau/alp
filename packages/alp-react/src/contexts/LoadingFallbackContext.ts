import type { ReactNode } from 'react';
import { createContext } from 'react';

export default createContext<NonNullable<ReactNode>>('Loading...');
