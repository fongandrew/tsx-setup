import { Store } from 'redux';
import { Dispatcher } from './lib/dispatcher';

// Context things that can be set
export interface Context {
  // See lib/dispatcher
  dispatcher: Dispatcher;

  // Redux store
  store: Store<StoreT>;
}

// Raw context object
let context: Partial<Context> = {};

// Get key out of context with undefined check
export function get<K extends keyof Context>(
  k: K,
  getDefault?: () => Context[K]
): Context[K] {
  const ret = context[k] as Context[K]|undefined;
  if (ret === void 0) {
    if (getDefault) {
      return (context[k] = getDefault());
    }
    throw new Error(`${k} not set in context`);
  }
  return ret;
}

// Replace context -- option for testing
export function reset() {
  context = {};
}

export default context;

// TODO: Dev only
(window as any).context = context;