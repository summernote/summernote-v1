/**
 * `Subscribe` is a function that is called when the observable is updated.
 */
export type Subscribe<T> = (data: T) => void;

/**
 * `Unsubscribe` is a function that removes a subscriber from the observable.
 */
export type Unsubscribe = () => void;

/**
 * `Observable` is a class that allows us to subscribe to changes in a value.
 */
export class Observable<T> {
  private subscribers: Array<Subscribe<T>> = [];

  subscribe(sub: Subscribe<T>): Unsubscribe {
    this.subscribers.push(sub);

    return () => {
      this.unsubscribe(sub);
    };
  }

  private unsubscribe(subscribe: Subscribe<T>): void {
    const index = this.subscribers.indexOf(subscribe);
    if (index !== -1) {
      this.subscribers.splice(index, 1);
    }
  }

  notify(value: T): void {
    for (const subscribe of this.subscribers) {
      subscribe(value);
    }
  }
}
