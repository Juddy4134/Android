const molesArr = Array.from(document.querySelectorAll(".cell"));
const difficultChange = document.getElementById("changeDifficult");
const startBtn = document.getElementById("btnStart");

class WhackAMole {

    constructor(startButton, moles, difficult){

        this.btnStart = startButton;
        this.moles = moles;
        this.difficult = difficult;
        this.difficultTime = null;
        this.gameStarted = false;
        this.finishPoint = this.moles.length / 2;
        this.playerScore = 0;
        this.computerScore = 0;
    }

    lose() {
        alert("Computer win! You are LOSSER! AZAZAZAZAZA");
    }

    win(){
        if (this.difficultTime === 500){
            alert("Oh my fucking GOD what are you!?")
        } else {
            alert("You are win! Congratulation!!!");
        }
    }

    init(){
        if (this.gameStarted === false){
            this.playerScore = 0;
            this.computerScore = 0;
            this.gameStarted = true;
            this.btnStart.textContent = 'Stop Game' ;
            this.peep();
        }

    }

    changeTime(){
            switch (this.difficult.selectedIndex) {
                case 0: {
                    this.difficultTime = 1500;
                    break;
                }
                case 1: {
                    this.difficultTime = 1000;
                    break;
                }
                case 2: {
                    this.difficultTime = 500;
                }
            }
    }

    stop(){
        console.log('Game Stopped...');
        this.btnStart.textContent = 'Start Game';
        this.gameStarted = false;
        this.moles.forEach((elem) => elem.className = "cell");
        clearInterval(this.peepTimer);
    }

    peep(){
        const mole = this._randomMole(this.moles);
        mole.classList.add('active');
        this.peepTimer = setTimeout(() => {
            if (mole.classList.contains("active")){
                mole.classList.remove("active");
                mole.classList.add("missed");
                this.computerScore++;
            } else if (mole.classList.contains("bonked")){
                this.playerScore++;
            }
            if(this.playerScore < this.finishPoint && this.computerScore < this.finishPoint){
                this.peep();
            } else if (this.computerScore === this.finishPoint){
                this.stop();
                this.lose();
            } else if (this.playerScore === this.finishPoint){
                this.stop();
                this.win();
            }
        }, this.difficultTime);
    }

    _randomMole(moles) {
        const moleIndex = Math.floor(Math.random() * moles.length);
        const mole = moles[moleIndex];
        if(mole.classList.contains("bonked") || mole.classList.contains("missed")) {
            console.log('not this mole...');
            return this._randomMole(moles);
        }
        return mole;
    }

}

const game = new WhackAMole(startBtn,molesArr,difficultChange);

game.btnStart.addEventListener("click", function (){
    if(game.btnStart.textContent === 'Start Game'){
        game.changeTime();
        game.init();
    }else{
        game.stop();
    }
});

game.moles.forEach(function (elem) {
    elem.addEventListener("click", function(){
        if (this.classList.contains("active")){
            this.classList.remove("active");
            this.classList.add("bonked");
        }
    });
});
