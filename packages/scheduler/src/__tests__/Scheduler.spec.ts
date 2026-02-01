import { describe, it, expect } from "vitest";
import {
  ImmediatePriority,
  NormalPriority,
  LowPriority,
  IdlePriority,
  UserBlockingPriority,
  NoPriority,
  PriorityLevel
} from "../SchedulerPriorities";
import {
  scheduleCallback,
  cancelCallback,
  getCurrentPriorityLevel,
  shouldYield
} from "../Scheduler";

describe("test scheduler", () => {
  it("two scheduled callbacks with same priorities", () => {
    let eventTasks = [];
    console.log(1111);
    scheduleCallback(NormalPriority, () => {
      eventTasks.push("Task1");
      expect(eventTasks).toEqual(["Task1"]);
      return null;
    });

    scheduleCallback(ImmediatePriority, () => {
      eventTasks.push("Task2");
      expect(eventTasks).toEqual(["Task2", "Task1"]);
      return null;
    });
  });

  it("tree scheduled callbacks with different priorities", () => {
    let eventTasks = [];

    scheduleCallback(NormalPriority, () => {
      eventTasks.push("Task1");
      expect(eventTasks).toEqual(["Task3", "Task2", "Task1"]);
      return null;
    });

    scheduleCallback(UserBlockingPriority, () => {
      eventTasks.push("Task2");
      expect(eventTasks).toEqual(["Task3", "Task2"]);
      return null;
    });

    scheduleCallback(ImmediatePriority, () => {
      eventTasks.push("Task3");
      expect(eventTasks).toEqual(["Task3"]);
      return null;
    });
  });

  it("four scheduled callbacks with different priorities", () => {
    let eventTasks = [];

    scheduleCallback(NoPriority, () => {
      eventTasks.push("Task1");
      expect(eventTasks).toEqual(["Task1"]);
      return null;
    });

    scheduleCallback(ImmediatePriority, () => {
      eventTasks.push("Task2");
      expect(eventTasks).toEqual(["Task1", "Task2"]);
      return null;
    });

    scheduleCallback(LowPriority, () => {
      eventTasks.push("Task3");
      expect(eventTasks).toEqual(["Task1", "Task2", "Task3"]);
      return null;
    });

    scheduleCallback(IdlePriority, () => {
      eventTasks.push("Task4");
      expect(eventTasks).toEqual(["Task1", "Task2", "Task3", "Task4"]);
      return null;
    });
  });
});