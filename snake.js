document.addEventListener("DOMContentLoaded", () =>{
    
    const squares = document.querySelectorAll(".grid div"),
          scoreDisplay = document.querySelector(".score"),
          start = document.querySelector("#start"),
          gameOver = document.querySelector("#game-over"),
          highscore = document.querySelector(".highscore"),
          width = 20;

    let currentIndex = 0, //first div in the grid
        appleIndex = 0, //first div in the grid
        currentSnake = [2,1,0],
        direction = 1,
        score = 0,
        speed = 0.95,
        intervalTime = 0,
        interval = 0,
        flash = null;

    //set the highscore
    let highestScore = localStorage.getItem("highscoreStore");
	if(highestScore === null){
		highestScore = 0;
    }
    highscore.textContent = highestScore;

    //start and reset the game
    document.body.onkeyup = e => {
        if(e.keyCode === 32){
            startGame();
        }
    }

    //change the direction of the snake when a key is pressed
    document.addEventListener("keydown", control);

    //allow the player to control the movement of the snake by changing the direction
    //don't allow the player the go in the imediate opposite direction
    function control(e){
        //remove 'snake' class from all squares
        squares[currentIndex].classList.remove("snake");
        //if the right arrow is pressed
        if((e.keyCode === 39 || e.keyCode === 68) && !(currentSnake[0] + 1 === currentSnake[1])){
            //the snake will go along 1 div in the array
            direction = 1;
        } 
        //if the up arrow is pressed
        else if((e.keyCode === 38 || e.keyCode === 87) && !(currentSnake[0] - width === currentSnake[1])){
            //the snake will go back an amount of divs in the array equal to the width of the grid
            direction = -width;
        }
        //if the left arrow is pressed
        else if((e.keyCode === 37 || e.keyCode === 65) && !(currentSnake[0] - 1 === currentSnake[1])){
            //the snake will go back 1 div in the array
            direction = -1;
        }
        //if the down arrow is pressed
        else if((e.keyCode === 40 || e.keyCode === 83) && !(currentSnake[0] + width === currentSnake[1])){
            //the snake will go along an amount of divs in the array equal to the width of the grid
            direction = width;
        }
    }

    //function which deals with all the outcomes of the snake
    function moveOutcomes(){
        //if the snake hits the border or itself
        if(
            //if the snake head hits the bottom
            (currentSnake[0] + width >= (width * width) && direction === width) ||
            //if the snake head hits the right wall
            (currentSnake[0] % width === width -1 && direction === 1) ||
            //if the snake head hits the left wall
            (currentSnake[0] % width === 0 && direction === -1) ||
            //if the snake head hits the top
            (currentSnake[0] - width < 0 && direction === -width) ||
            //if the snake head hits it's body
            squares[currentSnake[0] + direction].classList.contains("snake")
        ) {
            //clear the interval
            clearInterval(interval);
            flash = setInterval(highlight, 500);
            gameOver.style.display = "block";
            return;
        }

        //move the snake along the grid acording to the direction
        //take the last item out of the 'currentSnake' array and store the value as 'tail'
        const tail = currentSnake.pop();
        //removes class of snake from the tail
        squares[tail].classList.remove("snake");
        //add an item to the begginning of the currentSnake array using the current direction
        currentSnake.unshift(currentSnake[0] + direction);
        //add 'head' class to a square on the grid using the value of the new item in the 'currentSnake' array
        squares[currentSnake[0]].classList.add("head");
        //remove the current 'head' of the snake and add 'snake' class to the same square 
        removeHeads(currentSnake[0] - direction);
        squares[currentSnake[0] - direction].classList.add("snake");
        
        //Determine which way the head should be facing depeding on the current direction        
        if(direction === 1){
            squares[currentSnake[0]].classList.add("head-right");
        } else if(direction === -1){
            squares[currentSnake[0]].classList.add("head-left");
        } else if(direction === width){
            squares[currentSnake[0]].classList.add("head-down");
        } else if(direction === -width){
            squares[currentSnake[0]].classList.add("head-up");
        }

        //if the snake gets an apple
        if(squares[currentSnake[0]].classList.contains("apple")){
            //remove the apple from the sqaure
            squares[currentSnake[0]].classList.remove("apple")
            //add 'snake' class back to where the tail used to be and add value to the 'currentSnake' array;
            squares[tail].classList.add("snake");
            currentSnake.push(tail);
            //generate another apple
            randomApple();
            //update the current score and the highscore
            score++;
            if(score > highestScore){
                localStorage.setItem("highscoreStore", score);
                highscore.textContent = score;
            }
            scoreDisplay.textContent = score;
            //increase the speed of the snake relative to its current speed
            clearInterval(interval);
            intervalTime = intervalTime * speed;
            interval = setInterval(moveOutcomes, intervalTime);
        } 
    }

    //allow the player to start and reset the game
    function startGame(){
        start.style.display = "none";
        gameOver.style.display = "none";
        clearInterval(flash);
        removeHeads(currentSnake[0]);
        currentSnake.forEach(index => squares[index].classList.remove("snake"));
        currentSnake.forEach(index => squares[index].classList.remove("head"));
        currentSnake.forEach(index => squares[index].classList.remove("blank"));
        squares[appleIndex].classList.remove("apple");
        clearInterval(interval);
        score = 0;
        direction = 1;
        scoreDisplay.textContent = score;
        intervalTime = 800;
        currentSnake = [189,188,187];
        squares[currentSnake[2]].classList.add("snake");
        squares[currentSnake[1]].classList.add("snake");
        squares[currentSnake[0]].classList.add("head");
        squares[currentSnake[0]].classList.add("head-right");
        interval = setInterval(moveOutcomes, intervalTime);
        randomApple();
    }

    function randomApple(){
       appleIndex = Math.floor(Math.random() * squares.length);
       if (squares[appleIndex].classList.contains("apple") ||
       squares[appleIndex].classList.contains("snake") ||
       squares[appleIndex].classList.contains("head")){
           randomApple();
           return;
       } else {
        squares[appleIndex].classList.add("apple");
       }         
    }

    function highlight(){
        currentSnake.forEach(index => squares[index].classList.toggle("blank"));
    }

    //remove all possible head classes from any square
    function removeHeads(item){
        squares[item].classList.remove("head");
        squares[item].classList.remove("head-left");
        squares[item].classList.remove("head-right");
        squares[item].classList.remove("head-down");
        squares[item].classList.remove("head-up");
    }
})
