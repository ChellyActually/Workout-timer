const TimeEngine = {
    currentQueue: [],
    currentIndex:0,
    currentRemainingTime: 0,
    timerId: null,

 startEngine(validatedQueue){
    if(!validatedQueue || validatedQueue.length===0){
        alert("Workout queue is empty!!");
        return;
    }
    this.currentQueue= validatedQueue;
    this.currentIndex = 0;
    this.loadCurrentInterval();
},
loadCurrentInterval(){
    const currentItem=this.currentQueue[this.currentIndex];
    this.currentRemainingTime=currentItem.duration;
    TimePresenter.onIntervalChanged(currentItem);
    this.runClockLoop();
},
runClockLoop(){
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
nextInterval(){
    this.currentIndex++;
    if(this.currentIndex < this.currentQueue.length){
        this.loadcurrentInterval();
    }
    else{
        TimerPresenter.onWorkoutCompleted();
    }

},
};















export default TimeEngine;
