import RoutineBuilder from './routineBuilder.js';
import TimerEngine from './timerEngine.js';

document.getElementById('start-routine-btn').addEventListener('click', () => {
    
    const standardQueue = RoutineBuilder.getFinalQueue();
    
    if (standardQueue) {
        TimerEngine.startEngine(standardQueue);
    }
});

RoutineBuilder.init();