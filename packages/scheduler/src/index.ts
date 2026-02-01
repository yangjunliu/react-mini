import { scheduleCallback } from "./Scheduler";
import { ImmediatePriority, NormalPriority, UserBlockingPriority } from "./SchedulerPriorities";

let eventTasks = [];
scheduleCallback(ImmediatePriority, () => {
  eventTasks.push("Task1");
  console.log(eventTasks);
  return null;
});
scheduleCallback(UserBlockingPriority, () => {
  eventTasks.push("Task2");
  return null;
});
scheduleCallback(NormalPriority, () => {
  eventTasks.push("Task3");
  return null;
});