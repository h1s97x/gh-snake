/**
 * binary min-heap.
 *
 * `less(x, y)` must return true when `x` has a higher priority than `y`
 * (i.e. `x` should be popped before `y`).
 */
export class MinHeap<T> {
  private a: T[] = [];
  private less: (x: T, y: T) => boolean;

  constructor(less: (x: T, y: T) => boolean) {
    this.less = less;
  }

  get size() {
    return this.a.length;
  }

  push(x: T) {
    const a = this.a;
    a.push(x);
    let i = a.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.less(a[i], a[p])) {
        const t = a[i];
        a[i] = a[p];
        a[p] = t;
        i = p;
      } else break;
    }
  }

  pop(): T | undefined {
    const a = this.a;
    if (a.length === 0) return undefined;
    const top = a[0];
    const last = a.pop()!;
    if (a.length > 0) {
      a[0] = last;
      let i = 0;
      const n = a.length;
      for (;;) {
        const l = 2 * i + 1;
        const r = 2 * i + 2;
        let s = i;
        if (l < n && this.less(a[l], a[s])) s = l;
        if (r < n && this.less(a[r], a[s])) s = r;
        if (s === i) break;
        const t = a[i];
        a[i] = a[s];
        a[s] = t;
        i = s;
      }
    }
    return top;
  }
}

/**
 * priority comparator that mirrors the previous "sorted array + shift()"
 * behaviour:
 *  - primary: smaller key wins
 *  - tie-break: among equal keys, the most recently inserted (higher id) wins,
 *    which is exactly what `sortPush` produced when inserting before the first
 *    equal element.
 */
export const byKeyId =
  <T extends { id: number }>(key: (x: T) => number) =>
  (a: T, b: T) => {
    const ka = key(a);
    const kb = key(b);
    return ka < kb || (ka === kb && a.id > b.id);
  };
