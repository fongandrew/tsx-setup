/*
  Changable string value
*/
import * as React from 'react';
import dispatch from '@/lib/dispatch';
import subscribe from '@/lib/subscribe';
import { nameSubscription } from '@/domains/name';

const rename = (e: React.ChangeEvent<HTMLInputElement>) =>
  dispatch({ type: 'RENAME', payload: e.target.value });

export function DisplayName({ name }: { name: string }) {
  return <div>
    <div>Hello. My name is { name }.</div>
    <div>
      <label htmlFor="state-name">Rename</label>{' '}
      <input id="state-name" type="text" value={name} onChange={rename} />
    </div>
  </div>;
};

export default subscribe({
  name: nameSubscription
})(DisplayName);
