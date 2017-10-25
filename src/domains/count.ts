import { HandlerAdditionsMap } from '@/lib/dispatcher';
import createReduxSubFn from '@/lib/redux-sub';
import createReducers from '@/lib/targeted-reducers';

export const { reducer, dispatchers: state } = createReducers(0, {
  incr: (state: number, payload: number) => state + payload
}, { prefix: 'count' });

// Interval for timer
const INTERVAL = 1000; // ms

// Reference to active timer
let timer: number|undefined;

export const handlers: HandlerAdditionsMap = {
  START: action => {
    if (timer !== void 0) { // Already started, ignore
      return;
    }
    timer = setInterval(() => state.incr(1), 1000);
  },

  STOP: action => {
    if (timer !== void 0) {
      clearInterval(timer);
      timer = undefined;
    }
  }
};

export const countSubscription = createReduxSubFn(state => state.count);