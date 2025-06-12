// Utility to wrap an event handler and call preventDefault
export function preventDefault<T extends Event = Event>(handler: (event: T) => any) {
  return function(event: T) {
    event.preventDefault();
    return handler(event);
  };
}
