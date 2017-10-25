/*
  Component root
*/
import * as React from 'react';
import Counter from './Counter';
import DisplayName from './DisplayName';


export default function App(props: {}) {
  return <div>
    <DisplayName />
    <Counter />
  </div>;
};
