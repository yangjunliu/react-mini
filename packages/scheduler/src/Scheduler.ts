/**
 * implatmentation of SchedulerPriorities
 */
import { getCurrentTime, isFunction } from "shared/utils";
import { peek, pop, push } from "./SchedulerMinHeap";
import { 
  NoPriority,
  ImmediatePriority,
  UserBlockingPriority,
  NormalPriority,
  LowPriority,
  IdlePriority,
  PriorityLevel
} from "./SchedulerPriorities";
import { lowPriorityTimeout, maxSigned31BitInt, normalPriorityTimeout, userBlockingPriorityTimeout } from "./SchedulerFeatureFlags";

type Callback = (arg: boolean) => Callback | null | undefined;

type Task = {
  id: number,
  callback: Callback | null,
  priorityLevel: PriorityLevel,
  startTime: number,
  expirationTime: number,
  sortIndex: number,
  isQueued: boolean,
};


const taskQueue: Array<Task> = [];
let taskIdCounter: number = 0;

let currentTask: Task | null = null;
let currentPriorityLevel: PriorityLevel = NormalPriority;

let startTime: number = -1;
let isHostCallbackScheduled: boolean = false;
let isPerformingWork: boolean = false;
let isMessageLoopRunning: boolean = false;

/**
 * task scheduler entry point
 * @param priorityLevel priority level
 * @param callback the callback function
 */
function scheduleCallback(priorityLevel: PriorityLevel, callback: Callback): void {
  let startTime = getCurrentTime();
  let timeout: number;

  switch (priorityLevel) {
    case ImmediatePriority:
      timeout = -1;
      break;
    case UserBlockingPriority:
      timeout = userBlockingPriorityTimeout;
      break;
    case NormalPriority:
      timeout = normalPriorityTimeout;
      break;
    case LowPriority:
      timeout = lowPriorityTimeout;
      break;
    case IdlePriority:
    case NoPriority:
    default:
      timeout = maxSigned31BitInt;
      break;
  }

  const expirationTime = startTime + timeout;
  const newTask: Task = {
    id: taskIdCounter++,
    callback,
    priorityLevel,
    startTime,
    expirationTime,
    sortIndex: expirationTime,
    isQueued: false,
  };
  
  push(taskQueue, newTask);
  if (!isHostCallbackScheduled && !isPerformingWork) {
    isHostCallbackScheduled = true;
    requestHostCallback();
  }
}

function requestHostCallback(): void {
  if (!isMessageLoopRunning) {
    isMessageLoopRunning = true;
    schedulerPreformWorkUntilDeadline();
  }
}

function performanceWorkUntilDeadline(): void {
  if (isMessageLoopRunning) {
    const currentTime = getCurrentTime();
    let hasMoreWork = true;
    try {
      hasMoreWork = flushWork(currentTime);
    } finally {
      if (hasMoreWork) {
        schedulerPreformWorkUntilDeadline();
      } else {
        isMessageLoopRunning = false;
      }
    }
  }
}

function flushWork(initialTime: number): boolean {
  isHostCallbackScheduled = false;
  isPerformingWork = true;

  let previousPriorityLevel = currentPriorityLevel;

  try {
    return workLoop(initialTime);
  } finally {
    currentTask = null;
    currentPriorityLevel = previousPriorityLevel;
    isPerformingWork = false;
  }
}

const channel = new MessageChannel();
channel.port1.onmessage = performanceWorkUntilDeadline;

function schedulerPreformWorkUntilDeadline(): void {
  channel.port2.postMessage(null);
}

/**
 * cancel the scheduled callback
 * task's callback is set to null 
 */
function cancelCallback(): void {
  if (currentTask !== null) {
    currentTask.callback = null;
  }
}

function getCurrentPriorityLevel(): PriorityLevel {
  return currentPriorityLevel;
}

function shouldYieldToHost(): boolean {
  return false;
}


function workLoop(initialTime: number): boolean {
  let currentTime = initialTime;
  currentTask = peek(taskQueue);
  while (currentTask !== null) {
    if (currentTask.expirationTime > currentTime && shouldYieldToHost()) {
      break;
    }
    const callback = currentTask.callback;
    if (isFunction(callback)) {
      currentTask.callback = null;
      currentPriorityLevel = currentTask.priorityLevel;
      const didUserCallbackTimeout = currentTask.expirationTime <= currentTime;
      const continuationCallback = callback(didUserCallbackTimeout);
      if (isFunction(continuationCallback)) {
        currentTask.callback = continuationCallback;
        currentTask.sortIndex = currentTime + 1000;
        push(taskQueue, currentTask);
      }
      currentTime = getCurrentTime();
    } else {
      pop(taskQueue);
    }

    currentTask = peek(taskQueue);
  }
  return currentTask !== null;
}

export {
  scheduleCallback,
  cancelCallback,
  getCurrentPriorityLevel,
  shouldYieldToHost as shouldYield,
};
