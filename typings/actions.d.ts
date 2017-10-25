// Action types (not necessarily Redux actions though)
declare interface ActionT {
  // Counting
  START: {
    type: 'START';
  };

  STOP: {
    type: 'STOP';
  };

  // Change name of app
  RENAME: {
    type: 'RENAME';
    payload: string;
  }
}
