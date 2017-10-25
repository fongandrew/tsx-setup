/*
  Create targeted Redux reducers with named action dispatchers.
*/

import { Action } from 'redux';
import { get } from '@/context';

// Defines reducers. S is state type. P is a map from the name of each
// reducer to its payload.
export type ReducerMap<S, P> = {
  [K in keyof P]: (state: S, payload: P[K]) => S;
};

// Set of function to dispatch payloads using store in context.
export type DispatcherMap<P> = {
  [K in keyof P]: (payload: P[K]) => void;
};

// Return object for createReducers. Includes reducer for store plus functions
// to auto-dispatch reducers.
export interface ReducersSet<S, P> {
  reducer: (state: S, action: Action) => S; // For store
  dispatchers: DispatcherMap<P>;
}

// Options for creating targeted reducers
export interface Opts {

  // Convert name in ReducerMap arg to Redux action type (should be unique)
  nameToType: (name: string, prefix?: string) => string;

  // Optional prefix that gets passed to nameToType
  prefix: string;
}

const DEFAULT_OPTS: Opts = {
  // camelCase to CAPITAL_SNAKE_CASE
  nameToType: (name, prefix) =>
    (prefix ? prefix + "#" : '') +
    name.replace(/([A-Z])/g, ($1) => "_" + $1).toUpperCase(),

  // Allow simple prefixing without writing a nameToType function
  prefix: ''
};

// Used by domains to create reducers
export default function createReducers<S, P>(
  initState: S,
  reducerMap: ReducerMap<S, P>,
  opts: Partial<Opts> = {}
): ReducersSet<S, P> {
  const fullOpts = { ...DEFAULT_OPTS, opts };
  const { nameToType, prefix } = fullOpts;

  // Fill in dispatchers and global reducers map in context with values
  // from reducerMap in params
  const contextReducers: Record<string, (state: S, payload: any) => S> = {};
  const dispatchers: Partial<DispatcherMap<P>> = {};
  Object.keys(reducerMap).forEach(<K extends keyof P>(key: K) => {
    const actionType = nameToType(key, prefix);
    if (contextReducers[actionType]) {
      throw new Error(`${actionType} already exists`);
    }
    contextReducers[actionType] = reducerMap[key];

    dispatchers[key] = payload => get('store').dispatch({
      type: actionType,
      payload
    });
  });

  return {
    reducer(state, action) {
      // Undefined state => initialization
      if (state === void 0) return initState;


      // Check if named reducer connected here
      const subReducer = contextReducers[action.type];
      if (subReducer) {
        return subReducer(state, (action as any).payload);
      }

      // Else do nothing
      return state;
    },

    dispatchers: dispatchers as DispatcherMap<P>
  };
}
