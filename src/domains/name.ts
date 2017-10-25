import { HandlerAdditionsMap } from '@/lib/dispatcher';
import createReduxSubFn from '@/lib/redux-sub';
import createReducers from '@/lib/targeted-reducers';

export const { reducer, dispatchers: state } = createReducers('Bob', {
  rename: (state: string, payload: string) => payload
}, { prefix: 'name' });

export const handlers: HandlerAdditionsMap = {
  RENAME: action => {
    state.rename(action.payload);
  }
};

export const nameSubscription = createReduxSubFn(state => state.name);
