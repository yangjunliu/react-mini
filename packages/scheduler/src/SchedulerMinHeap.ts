type Heap<T extends Node> = Array<T>;

type Node = {
  id: number,
  sortIndex: number,
  [string: string]: any
};

/**
 * Peek the minimum element from the heap
 * @param heap The min-heap array
 * @returns The minimum element or null if the heap is empty
 */
export function peek<T extends Node>(heap: Heap<T>): T | null {
  return heap.length === 0 ? null : heap[0];
};
/**
 * Push a node into the heap
 * @param heap min-heap array
 * @param node The node to be pushed
 */
export function push<T extends Node>(heap: Heap<T>, node: T): void {
  const index = heap.length;
  heap.push(node);
  siftUp(heap, index);
};

/**
 * pop the minimum element from the heap
 * @param heap The min-heap array
 */
export function pop(heap: Heap<Node>): Node | null {
  if (heap.length === 0) return null;
  
  const first = heap[0];
  const last = heap.pop();
  if (last !== undefined) {
    heap[0] = last;
    siftDown(heap, 0);
    return first;
  }
  return null;
};

/**
 * Sift up the node at the given index
 * @param heap The min-heap array
 * @param index The index of the node to be sifted up
 */
function siftUp<T extends Node>(heap: Heap<T>, index: number): void {
  const node = heap[index];
  while (index > 0) {
    const parentIndex = (index - 1) >>> 1;
    const parent = heap[parentIndex];
    if (compare(node, parent) < 0) {
      heap[index] = parent;
      index = parentIndex;
    } else {
      break;
    }
  }
  heap[index] = node;
}

/**
 * Sift down the node at the given index
 * @param heap The min-heap array
 * @param index The index of the node to be sifted down
 */
function siftDown<T extends Node>(heap: Heap<T>, index: number): void {
  const length = heap.length;
  const node = heap[index];
  while (true) {
    const leftChildIndex = (index << 1) + 1;
    const rightChildIndex = leftChildIndex + 1;
    let smallestIndex = index;

    if (leftChildIndex < length) {
      const leftChild = heap[leftChildIndex];
      if (compare(leftChild, node) < 0) {
        smallestIndex = leftChildIndex;
      }
    }

    if (rightChildIndex < length) {
      const rightChild = heap[rightChildIndex];
      if (compare(rightChild, heap[smallestIndex]) < 0) {
        smallestIndex = rightChildIndex;
      }
    }

    if (smallestIndex === index) {
      break;
    }

    heap[index] = heap[smallestIndex];
    index = smallestIndex;
  }

  heap[index] = node;
}

/**
 * compare two nodes
 * @param a The first node to be compared
 * @param b the second node to be compared
 * @returns Negative if a < b, positive if a > b, zero if equal
 */
function compare(a: Node, b: Node): number {
  const diff = a.sortIndex - b.sortIndex;
  return diff !== 0 ? diff : a.id - b.id;
}

export { Heap, Node };