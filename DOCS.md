# Docs

## 1. High-Level Design (HLD)

The HLD focuses on how data flows sequentially between the three members' modules. The architecture follows a **Pipeline Pattern**, where the output of one module strictly serves as the initialization data or execution trigger for the next.

### System Architecture Diagram

```text
+--------------------------------------------------------------------------+
|                                index.html                                |
|  Holds the global layout structures, UI containers, and entry buttons.  |
+--------------------------------------------------------------------------+
                                     |
                                     v
+-------------------------+   Routine Array   +-------------------------+
|  MEMBER 1: BUILDER      |------------------>|  MEMBER 2: ENGINE       |
|  - Reads Form Inputs    |  [ {name, time} ] |  - Runs setInterval     |
|  - Validates Durations  |                   |  - Tracks Active Index  |
|  - Compiles Object List |                   |  - Emits Tick/Change    |
+-------------------------+                   +-------------------------+
                                                           |
                                           Tick / State    |  Function Callbacks
                                           Change Events   |  with Live Data
                                                           v
                                              +-------------------------+
                                              |  MEMBER 3: PRESENTER    |
                                              |  - Updates DOM Text     |
                                              |  - Triggers CSS Themes  |
                                              |  - Plays Audio Beeps    |
                                              +-------------------------+

```

### Module Responsibilities & Dependencies

1. **Module 1 (Routine Builder):** Captures user configuration. It has **zero dependencies** to start but must output a clean, non-empty array of objects.
2. **Module 2 (Timer Engine):** Controls the application state over time. It **depends completely on Module 1** to supply the data array before it can execute.
3. **Module 3 (State & Audio UI):** Renders visual updates. It **depends completely on Module 2** to push structural ticks and state-change flags to update the viewport.

---

## 2. Low-Level Design (LLD)

The LLD maps out the exact code layout, specific function signatures, parameters, and the data contracts that each team member must fulfill.

### Shared Data Structure (The Contract)

This is the precise format Member 1 must generate and Member 2 must parse:

```javascript
// The Workout Queue Array
const workoutQueue = [
  { name: "Pushups", duration: 30, type: "WORK" },
  { name: "Rest", duration: 10, type: "REST" },
  { name: "Plank", duration: 45, type: "WORK" }
];

```

---

### MEMBER 1: Routine Builder (Input & Array Constructor)

**File Responsibilities:** Handles DOM interaction inside the configuration form, reads field values, and structures the master workout queue array.

```javascript
// routineBuilder.js
const RoutineBuilder = {
  // Shared state within this module
  queue: [],

  /**
   * Reads text and number inputs from the DOM form.
   * Validates that duration is a positive number greater than 0.
   */
  addIntervalFromForm() {
    // 1. Grab values from document.getElementById('exercise-name') and 'exercise-duration'
    // 2. Validate input: if string is empty or duration <= 0, throw alert/error
    // 3. Create object: const item = { name, duration: parseInt(duration), type: 'WORK' }
    // 4. Push item to this.queue
    // 5. Call a local render function to show the item in a preview list on screen
  },

  /**
   * Appends an automatic rest period between exercises if checked in configuration
   */
  injectRestIntervals(restDuration) {
    // Optional utility: Loops through this.queue and inserts a 
    // { name: "Rest", duration: restDuration, type: "REST" } object between items
  },

  /**
   * Finalizes the queue and hands it over to the engine.
   * @returns {Array} The validated array of interval objects.
   */
  getFinalQueue() {
    if (this.queue.length === 0) {
      alert("Please add at least one exercise to your routine!");
      return null;
    }
    return this.queue;
  }
};

```

---

### MEMBER 2: Timer Engine (The Core Logic Clock)

**File Responsibilities:** Manages execution timing loops via JavaScript core API timings, tracks indices, and dispatches callbacks.

```javascript
// timerEngine.js
const TimerEngine = {
  currentQueue: [],
  currentIndex: 0,
  currentRemainingTime: 0,
  timerId: null,

  /**
   * Initializes the engine with data from Member 1
   * @param {Array} validatedQueue 
   */
  startEngine(validatedQueue) {
    if (!validatedQueue) return;
    this.currentQueue = validatedQueue;
    this.currentIndex = 0;
    this.loadCurrentInterval();
  },

  /**
   * Sets up the state variables for the current active index item
   */
  loadCurrentInterval() {
    const currentItem = this.currentQueue[this.currentIndex];
    this.currentRemainingTime = currentItem.duration;
    
    // Notify Member 3 immediately that a new structural phase has begun
    TimerPresenter.onIntervalChanged(currentItem);
    
    this.runClockLoop();
  },

  /**
   * Starts the internal 1-second counting loop
   */
  runClockLoop() {
    this.timerId = setInterval(() => {
      this.currentRemainingTime--;
      
      // Send the current remaining seconds to Member 3 to update display
      TimerPresenter.onTick(this.currentRemainingTime);

      if (this.currentRemainingTime <= 0) {
        this.stopClockLoop();
        this.nextInterval();
      }
    }, 1000);
  },

  stopClockLoop() {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  },

  /**
   * Shifts index pointers forward or handles completion tracking
   */
  nextInterval() {
    this.currentIndex++;
    if (this.currentIndex < this.currentQueue.length) {
      this.loadCurrentInterval();
    } else {
      // Completed the entire workout program!
      TimerPresenter.onWorkoutComplete();
    }
  }
};

```

---

### MEMBER 3: State & Audio UI (The Presenter)

**File Responsibilities:** Alters visual components, runs CSS transitions, alters background themes depending on activity classifications, and fires sound files.

```javascript
// timerPresenter.js
const TimerPresenter = {
  // Cache DOM references
  viewContainer: document.getElementById('timer-display-zone'),
  countdownText: document.getElementById('seconds-countdown'),
  activityText: document.getElementById('active-activity-name'),
  
  // Simple audio beep context using Web Audio API or a simple HTML Audio element
  beepSound: new Audio('https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg'),

  /**
   * Triggered by Member 2 immediately when a new exercise or rest phase begins
   * @param {Object} activeItem - Formatted as { name, duration, type }
   */
  onIntervalChanged(activeItem) {
    this.activityText.innerText = activeItem.name;
    this.countdownText.innerText = activeItem.duration;
    this.playAudioCue();

    // Dynamically manage visual state classes
    if (activeItem.type === "WORK") {
      this.viewContainer.className = "state-working-active"; 
      // Member 1's CSS file will make .state-working-active have a vibrant green background
    } else if (activeItem.type === "REST") {
      this.viewContainer.className = "state-rest-active";
      // Member 1's CSS file will make .state-rest-active have a calming blue background
    }
  },

  /**
   * Triggered by Member 2 every single second
   * @param {number} remainingSeconds 
   */
  onTick(remainingSeconds) {
    this.countdownText.innerText = remainingSeconds;
    
    // Add a subtle CSS pulse scale effect on the last 3 seconds
    if (remainingSeconds <= 3) {
      this.countdownText.classList.add("pulse-warning");
    } else {
      this.countdownText.classList.remove("pulse-warning");
    }
  },

  /**
   * Triggered by Member 2 when the index array runs completely out of objects
   */
  onWorkoutComplete() {
    this.activityText.innerText = "🎉 Workout Complete! Great Job!";
    this.countdownText.innerText = "00";
    this.viewContainer.className = "state-complete";
    this.playVictoryFanfare();
  },

  playAudioCue() {
    this.beepSound.play().catch(e => console.log("Audio waiting for user gesture interaction context"));
  }
};

```

---

## 3. The Deployment Interface (How It Plugs Together)

To make everything run seamlessly, your main file or layout event listener ties the entry triggers together using simple interface coordination:

```javascript
// main.js - Connective global workflow
document.getElementById('start-routine-btn').addEventListener('click', () => {
  // Step 1: Tell Member 1 to compile inputs
  const standardQueue = RoutineBuilder.getFinalQueue();
  
  if (standardQueue) {
    // Step 2: Pass compiled queue data straight into Member 2's system engine clock loop
    TimerEngine.startEngine(standardQueue);
  }
});

```
