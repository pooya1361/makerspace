// webapp/src/lib/provider.tsx
'use client'; // This is a Client Component as it provides Redux context

import { Provider } from 'react-redux';
import { store } from './store';

export function ReduxProvider({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
}