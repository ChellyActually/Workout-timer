import TimerPresenter from './timerPresenter.js';

const TimeEngine = {
    currentQueue: [],
    currentIndex:0,
    currentRemainingTime: 0,
    timerId: null,
    isPaused : false,
 startEngine(validatedQueue){
    if(!validatedQueue || validatedQueue.length===0){
        alert("Workout queue is empty!!");
        return;
    }
    this.currentQueue= validatedQueue;
    this.currentIndex = 0;
    this.isPaused = false;
    this.loadCurrentInterval();
},
loadCurrentInterval(){
    const currentItem=this.currentQueue[this.currentIndex];
    this.currentRemainingTime=currentItem.duration;
    TimerPresenter.onIntervalChanged(currentItem);
    this.runClockLoop();
},
runClockLoop(){
    if(this.timerId){
        this.stopClockLoop();
    }
    this.timerId=setInterval(()=>{
       this.currentRemainingTime--;
       TimerPresenter.onTick(this.currentRemainingTime);
       if(this.currentRemainingTime<=0){
        this.stopClockLoop();
        this.nextInterval();
       }
   },1000);
},
stopClockLoop(){
 if(this.timerId){
    clearInterval(this.timerId);
 }

},
pauseEngine(){
    if(this.isPaused || !this.timerId){
        return;
    }
    this.stopClockLoop();
    this.isPaused = true;
    console.log("Timer Paused!!");
},
resumeEngine(){
    if(!this.isPaused){
        return;
    }
    this.isPaused = false;
    this.runClockLoop();
    console.log("Timer Resumed!!");
},
nextInterval(){
    this.currentIndex++;
    if(this.currentIndex < this.currentQueue.length){
        this.loadCurrentInterval();
    }
    else{
        TimerPresenter.onWorkoutComplete();
    }

},
};















export default TimeEngine;
