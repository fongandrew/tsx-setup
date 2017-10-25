/*
  An action dispatcher (relies on global ActionT interface)
*/

// Function that handles some action, returns promise if async
export type Handler<K extends keyof ActionT> =
  (action: ActionT[K]) => void|Promise<void>;

// Interface for list of active handlers
export type HandlerListMap = {
  [K in keyof ActionT]?: Handler<K>[];
};

// Interface for adding handlers to Dispatcher
export type HandlerAdditionsMap = {
  [K in keyof ActionT]?: Handler<K>[]|Handler<K>;
};

// Dispatch function calls handlers
export type DispatchFn =
  <K extends keyof ActionT>(action: ActionT[K]) => Promise<any>;


// Calls registered handlers with dispatched actions
export class Dispatcher {
  readonly typedHandlers: HandlerListMap = {};

  constructor(...handlerMaps: HandlerAdditionsMap[]) {
    handlerMaps.forEach(handlerMap => this.add(handlerMap));
  }

  add(handlerMap: HandlerAdditionsMap) {
    Object.keys(handlerMap).map(<K extends keyof ActionT>(type: K) => {

      // Init list if doesn't exist
      const handlers = this.typedHandlers[type] =
        (this.typedHandlers[type] || []) as Handler<K>[];

      // Can add either single handler or list
      const newHandlers = handlerMap[type] as Handler<K>[]|Handler<K>;
      if (newHandlers instanceof Array) {
        for (let handler of newHandlers) {
          handlers.push(handler);
        }
      } else {
        handlers.push(newHandlers);
      }
    });

    // For chainable API
    return this;
  }

  // Protected, internal dispatch function
  protected _dispatch<K extends keyof ActionT>(action: ActionT[K]) {
    const handlers =
      (this.typedHandlers[action.type as K] || []) as Handler<K>[];
    return Promise.all(handlers.map(h => h(action)));
  }

  // Publicly accessible bound dispatch function, can be replaced
  dispatch: DispatchFn = action => this._dispatch(action);

  // Replace dispatch function
  wrap(fn: (next: DispatchFn) => DispatchFn) {
    this.dispatch = fn(this.dispatch);

    // For chainable API
    return this;
  }
}

export default function createDispatcher(
  ...handlerMaps: HandlerAdditionsMap[]
) {
  return new Dispatcher(...handlerMaps);
}
