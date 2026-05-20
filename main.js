import RoutineBuilder from './routineBuilder.js';
import TimeEngine from './timeEngine.js';

RoutineBuilder.init();
document.getElementById('start-routine-btn').addEventListener('click', () => {
    
    const standardQueue = RoutineBuilder.getFinalQueue();
    
    if (standardQueue) {
        TimeEngine.startEngine(standardQueue);
    }
});
