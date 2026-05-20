

const TimerPresenter = {

    

    timerDisplayZone: document.querySelector("#timer-display-zone"),

    activityName: document.querySelector("#active-activity-name"),

    secondsCountdown: document.querySelector("#seconds-countdown"),


   

    beepSound: new Audio(
        "https://actions.google.com/sounds/v1/alarms/beep_short.ogg"
    ),


    


    onIntervalChanged(activeItem) {

        
        this.activityName.innerText = activeItem.name;

        
        this.secondsCountdown.innerText = activeItem.duration;

       
        this.playBeep();
        
        
        
        this.timerDisplayZone.classList.remove(
            "state-idle",
            "state-working-active",
            "state-rest-active",
            "state-complete"
        );
        
        
        
        if (activeItem.type === "WORK") {
            
            this.timerDisplayZone.classList.add("state-working-active");
            
        } 
        
        else if (activeItem.type === "REST") {
            
            this.timerDisplayZone.classList.add("state-rest-active");
        }
    },
    
    
    
    
    onTick(remainingSeconds) {
        
        this.secondsCountdown.innerText = remainingSeconds;
        this.playBeep();


        // Last 3 second warning effect
        if (remainingSeconds <= 3) {

            this.secondsCountdown.classList.add("pulse-warning");

        } 
        
        else {

            this.secondsCountdown.classList.remove("pulse-warning");
        }
    },


    

    onWorkoutComplete() {

        this.activityName.innerText =
            "🎉 Workout Complete!";

        this.secondsCountdown.innerText = "00";


        this.timerDisplayZone.classList.remove(
            "state-working-active",
            "state-rest-active",
            "state-idle"
        );


       
        this.timerDisplayZone.classList.add("state-complete");


        this.secondsCountdown.classList.remove("pulse-warning");


        this.playBeep();
    },


   
  

    playBeep() {

        this.beepSound.currentTime = 0;

        this.beepSound.play()
            .catch(error => {

                console.log(
                    "Audio requires user interaction first"
                );
            });
    }
};


export default TimerPresenter;