import { describe, expect, it } from "vitest";
import { peek, push, pop, Heap, Node } from "../src/MinHeap";

let counter = 0;
const createNode = (val: number): Node => {
  return { id: counter++, sortIndex: val};
};

describe("test min heap", () => {
  it("empty heap peek returns null", () => {
    const tasks: Heap<Node> = [];
    expect(peek(tasks)).toBeNull();
  });
  
  it("heap length === 1", () => {
    const oneNode = createNode(1);
    const tasks: Heap<Node> = [oneNode];
    expect(peek(tasks)).toEqual(oneNode);
  });

  it("heap length > 1", () => {
    const zeroNode = createNode(0);
    const oneNode = createNode(1);
    const tasks: Heap<Node> = [oneNode];
    push(tasks, createNode(2));
    push(tasks, createNode(3));
    expect(peek(tasks)).toEqual(oneNode);
    push(tasks, zeroNode);
    expect(peek(tasks)).toEqual(zeroNode);
    pop(tasks);
    expect(peek(tasks)).toEqual(oneNode);
  });
});