//Select Element
let countSpan = document.querySelector(".count span")
let bulletsSpanContainer = document.querySelector(".bullets .spans")
let bullets = document.querySelector(".bullets");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let resultsContainer = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");
//Set Option

let currentIndex = 0;
let rightAnswers = 0;
let countDownIntevrel = 0;

function getQuestions() {
    let myRequest = new XMLHttpRequest();

    myRequest.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let questionsObject = JSON.parse(this.responseText)
            let qCount = questionsObject.length;
            //Create bullets + set Questions Count
            creatBullets(qCount);

            //ADD QUESTION DATA
            addQuestionData(questionsObject[currentIndex], qCount);

            //Start CountDown 
            countdown(30, qCount);

            //click On Submit
            submitButton.onclick = () =>  {

            //GET right Answer
                let theRightAnswer = questionsObject[currentIndex].right_answer;
                
            //Increase Index
                currentIndex++;

            //check The Answer
                checkAnswer(theRightAnswer, qCount)

                //Remove Previous Quistion 
                quizArea.innerHTML = '';
                answersArea.innerHTML = '';

                //ADD THE NEXT QUESTION
                addQuestionData(questionsObject[currentIndex], qCount);

                //Handle Bullets Class
                handleBullets()

                 //Start CountDown 
                 clearInterval(countDownIntevrel);
                countdown(30, qCount);

                // Show Results
                showResults(qCount);
            }
        }
    };
    myRequest.open("GET", "html_quation.json", true);
    myRequest.send();
}
getQuestions();

function creatBullets(num) {
    countSpan.innerHTML = num;

    // Create Spans 
    for(let i = 0; i < num; i++) {
        //Create bullets
        let theBullet = document.createElement("span");
        
        //Check If Its First Span 

        if(i === 0){
            theBullet.className = "on";
        }

        //APPEND BULLETS TO MAIN BULLET CONTAINER
        bulletsSpanContainer.appendChild(theBullet);
    }
}

function addQuestionData(obj, count){
    if (currentIndex < count) {

        //  create H2 Question Title
        let questionTitle = document.createElement("h2")
        
        //create question text
        let questionText = document.createTextNode(obj[`title`]);
        
        //Append Text TO H2 
        questionTitle.appendChild(questionText);
        
        //APPEND H2 TO THE QUIZ AREA
        quizArea.appendChild(questionTitle);
        
        // Create The Answers
        for (let i = 1; i <= 4; i++) {
            // Create Main Answer Div
            let mainDiv = document.createElement("div");
            
        // Add Class To Main Div
        mainDiv.className = "answer";
  
        // Create Radio Input
        let radioInput = document.createElement("input");
        
        // Add Type + Name + Id + Data-Attribute
        radioInput.name = "question";
        radioInput.type = "radio";
        radioInput.id = `answer_${i}`;
        radioInput.dataset.answer = obj[`answer_${i}`];
        
        // Make First Option Selected
        if (i === 1) {
            radioInput.checked = true;
        }
        
        // Create Label
        let theLabel = document.createElement("label");
        
        // Add For Attribute
        theLabel.htmlFor = `answer_${i}`;
        
        // Create Label Text
        let theLabelText = document.createTextNode(obj[`answer_${i}`]);
        
        // Add The Text To Label
        theLabel.appendChild(theLabelText);
        
        // Add Input + Label To Main Div
        mainDiv.appendChild(radioInput);
        mainDiv.appendChild(theLabel);
        
        // Append All Divs To Answers Area
        answersArea.appendChild(mainDiv);
        
    }
    }
}

function checkAnswer(rAnswer, count) {
    let answers = document.getElementsByName("question");
    let theChoosenAnswer;

    for (let i = 0; i < answers.length; i++) {
        if (answers[i].checked) {
            theChoosenAnswer = answers[i].dataset.answer;
        }
    }
    if (rAnswer === theChoosenAnswer) {
        rightAnswers++;
        // console.log("Good Answer")
    }
}

function handleBullets() {
    let bulletsSpans = document.querySelectorAll(".bullets .spans span");
    let arrayOfSpans = Array.from(bulletsSpans);
    arrayOfSpans.forEach((span, index) => {
        if (currentIndex === index){
            span.className="on"
        }
    })
}

function showResults(count) {
    let theResults;
    if (currentIndex === count) {
    quizArea.remove();
    answersArea.remove();
    submitButton.remove();
    bullets.remove();
         
        if (rightAnswers > (count / 2) && rightAnswers < count) {
            theResults = `<span class="good">Good</span>, ${rightAnswers} From ${count} Is Good.`; 
        }else if (rightAnswers === count) {
            theResults = `<span class="perfect">Perfect</span>, All Answers Is Good`;

        }else {
            theResults = `<span class="bad">Bad</span>, ${rightAnswers} From ${count} Is Bad.`;

        }
        resultsContainer.innerHTML = theResults;
    }    
    
}
function countdown (duration, count) {
    if (currentIndex < count) {
        let minutes, seconds;
        countDownIntevrel = setInterval(function () {
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);

            minutes = minutes < 10 ? `0${minutes}` : minutes;
            seconds = seconds < 10 ? `0${seconds}` : seconds;

            countdownElement.innerHTML = `${minutes}:${seconds}`;

            if (--duration < 0) {
                clearInterval(countDownIntevrel);
                submitButton.click();

            }
        }, 1000);
    }
}
