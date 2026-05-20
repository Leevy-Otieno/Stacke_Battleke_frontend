import { useState, useEffect, useCallback } from 'react';

export const useAsync = (fn, deps = []) => {
  const [state, setState] = useState({ data: null, loading: true, error: null });

  const run = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await fn();
      setState({ data, loading: false, error: null });
    } catch (e) {
      setState({ data: null, loading: false, error: e.message || 'Something went wrong.' });
    }
  }, deps);

  useEffect(() => { run(); }, [run]);

  return { ...state, refetch: run };
};
