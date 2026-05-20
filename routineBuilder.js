const RoutineBuilder = {
    exName: document.querySelector("#exercise-name"),
    exDuration: document.querySelector("#exercise-duration"),
    restTime: document.querySelector("#default-rest-time"),
    buttonAddIntervalBtn: document.querySelector('button#add-interval-btn'),
    routinePreviewList: document.querySelector('#routine-preview-list'),
    
    queue: [],

    init() {
        this.buttonAddIntervalBtn.addEventListener('click', ()=>{
            this.addIntervalFromForm();
        })
    },

    addIntervalFromForm() {
        if (!this.exName.value || !this.exDuration.value) {
            alert("Please fill in both fields!");
            return;
        }

        const exersice = {
            name: this.exName.value,
            duration: parseInt(this.exDuration.value),
            type: "WORK"
        };
        
        const rest = {
            name: 'Rest',
            duration: parseInt(this.restTime.value),
            type: "REST"
        };
    
        this.queue.push(exersice);
        this.queue.push(rest);
        this.updateRoutinePreview(exersice.name,exersice.duration,rest.duration);

        this.exName.value = '';
        this.exDuration.value = '';
    },

    updateRoutinePreview(name,duration,restDuration) {
        const emptyNotice = this.routinePreviewList.querySelector('.empty-notice');
        if (emptyNotice) emptyNotice.remove();

        const li = document.createElement('li');
        li.innerHTML = `<span>💪 ${name}</span> <span>${duration}s</span> <span>Rest: ${restDuration}s</span>`;
        this.routinePreviewList.appendChild(li);
    },

    getFinalQueue() {
        if (this.queue.length === 0){
            alert("Please add at least one exercise to your routine!");
            return;
        }
        else {
            return this.queue;
        }
    }
}

export default RoutineBuilder;