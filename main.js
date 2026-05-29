import RoutineBuilder from './routineBuilder.js';
import TimeEngine from './timeEngine.js';

RoutineBuilder.init();
document.getElementById('start-routine-btn').addEventListener('click', () => {
    
    const standardQueue = RoutineBuilder.getFinalQueue();
    
    if (standardQueue) {
        TimeEngine.startEngine(standardQueue);
    }
});

const clockCircle = document.getElementById("countdown-visual-box");

clockCircle.addEventListener('click',(event)=>{
    if(TimeEngine.timerId && !TimeEngine.isPaused){
        TimeEngine.pauseEngine();
        event.stopPropagation(); //pre-built function in Event interface(WEB API)
        /* Prevents event bubbling to the body listener. 
        Without this, clicking the clock would instantly pause AND resume the timer at the same time.*/
    }  
});
document.body.addEventListener("click",()=>{
    if(TimeEngine.isPaused){
        TimeEngine.resumeEngine();
    }
})
