/*
  Counter / timer
*/
import * as React from 'react';
import dispatch from '@/lib/dispatch';
import subscribe from '@/lib/subscribe';
import { countSubscription } from '@/domains/count';

const start = () => dispatch({ type: 'START' });

const stop = () => dispatch({ type: 'STOP' });

export function Counter({ count }: { count: number }) {
  return <div>
    <div>Counter value: { count }</div>
    <div>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </div>
  </div>;
};

export default subscribe({
  count: countSubscription
})(Counter);
