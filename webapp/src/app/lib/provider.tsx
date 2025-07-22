// webapp/src/lib/provider.tsx
'use client'; // This is a Client Component as it provides Redux context

import { Provider } from 'react-redux';
import { useMemo } from 'react';
import { makeStore } from './store';

export function ReduxProvider({ children }: { children: React.ReactNode }) {
    const store = useMemo(() => makeStore(), []);
    return <Provider store={store}>{children}</Provider>;
}