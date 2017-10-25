/*
  Subscriptions for Redux selectors
*/

import { Store } from 'redux';
import { get } from '@/context';
import { Subscription, SubCb } from './subscribe';

// Get something out of state using props
export type Selector<S, P, T> = (state: S, props: P) => T;

// Active subscription to Redux store
export class ReduxSubscription<S, P, T> implements Subscription<P, T> {
  // Last known state
  state: T;

  // Set by construcotr
  unsubscribe: () => void;

  constructor(
    protected store: Store<S>,
    protected props: P,
    protected selector: Selector<S, P, T>,
    protected callback: SubCb<T>
  ) {
    this.state = this.getState();
    this.unsubscribe = store.subscribe(() => {
      // Update only if state changed
      const nextState = this.getState();
      if (nextState !== this.state) {
        this.state = nextState;
        callback(nextState);
      }
    });
  }

  getState() {
    return this.selector(this.store.getState(), this.props);
  }

  update(nextProps: P) {
    this.props = nextProps; // Callback automatically checks this.props
  }
}

// Reshape to form expected for SubFn
export default function createReduxSubFn<P, T>(
  selector: Selector<StoreT, P, T>
) {
  return (props: P, callback: SubCb<T>) => new ReduxSubscription(
    get('store'),
    props,
    selector,
    callback
  );
}
