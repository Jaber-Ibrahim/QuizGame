//get elements form html page
let countSpan = document.querySelector(".count span");
let bulletsContainer = document.querySelector(".bullets") ;
let bulletSpanContainer = document.querySelector(".bullets .spans");
// console.log(bulletSpanContainer);
let questionContainer = document.querySelector(".question-cont");
let skillContainer = document.querySelector(".skill");
let headerQuestions = document.querySelector(".question-cont h2");
// console.log(headerQuestions);
let mainAnswersdiv = document.querySelector(".question-cont .answers");
// console.log(mainAnswersdiv);
let submitButton = document.querySelector(".question-cont .btn");
// console.log(submitButton);
let scoreDiv = document.querySelector(".score")
let timeElement =document.querySelector(".time");

let restartButton =document.querySelector(".restart");
// console.log(restartButton);
restartButton.onclick = function () {
  location.reload();
}


let langLis = document.querySelectorAll(".category ul li");
// console.log(langLis);

let myApi = {
  "html" : "https://quizapi.io/api/v1/questions?apiKey=o1HRqFdaOLmg4gnxMr0SS6CzURvGsKqz0tVIVB5f&category=code&limit=10&tags=HTML",
  "js" : "https://quizapi.io/api/v1/questions?apiKey=o1HRqFdaOLmg4gnxMr0SS6CzURvGsKqz0tVIVB5f&category=code&limit=10&tags=JavaScript", 
  "php" : "https://quizapi.io/api/v1/questions?apiKey=o1HRqFdaOLmg4gnxMr0SS6CzURvGsKqz0tVIVB5f&category=code&limit=10&tags=PHP"
}


let choosenApi;

// console.log(myApi.html);
// console.log(myApi.js);
// console.log(myApi.php);





// choosenApi = ff ;
//اول تحميل الصفحة رح يحمل السؤال الاول وبعدا رح يزداد هالعدد مشان ما يضل يحمل السؤال الاول :3
let currentQuestion = 0;
let chars = "abcd";
let rightAnswer;
let score = 0;
let counDownInterval ;

function getQuestions() {
  
  //choose the api related to the lang you choose
  langLis.forEach(ele => {
    ele.addEventListener("click", ()=> {
      if(ele.dataset.lang == "html") {choosenApi = myApi.html};
      if(ele.dataset.lang == "js") { choosenApi = myApi.js};
      if(ele.dataset.lang == "php") { choosenApi = myApi.php};
      skillContainer.remove();
      questionContainer.style.display = "block"
      
      fetch(choosenApi)
    .then((result) => {
      // convert json to js object
      return result.json();
    })
    .then((result) => {
      console.log(result);
      // console.log(typeof result);
      // console.log(result.length);
      
      let questionCount = result.length;

      //check the response
      // console.log(result[0]);
      // console.log(result[0].question);
      // console.log(result[0].answers);
      // console.log(result[0].correct_answers);
      // console.log(result[0].correct_answer);

      // create bullet spans and set the count span
      createBulletSpan(questionCount);

      //add data to page
      //جبنا عدد الاسئلة مشان ما ينشئ عناصر بس سخلصو ويصير معنا ايرور
      //بس نحمل الصفحة رح نحمل اول سؤال اجا من الريسبونس
      addDataToPage(result[currentQuestion], questionCount);
      

      //start count Down time for the first question
      countDown(55,questionCount);


      //click submit button
      submitButton.addEventListener("click", function () {
        //start A new count down for each question
        //and clear the interval
        clearInterval(counDownInterval);
        countDown(55,questionCount);
        //get right answer
        // console.log(result[0]["correct_answers"]["answer_a_correct"]);
        for (let i = 0; i < 4; i++) {
        if (result[currentQuestion]["correct_answers"][`answer_${chars[i]}_correct`] == "true") {
          // console.log(result[currentQuestion]["correct_answers"][`correct_${chars[i]}_answer`]);
          // console.log(result[currentQuestion]["answers"][`answer_${chars[i]}`]);
          rightAnswer = result[currentQuestion]["answers"][`answer_${chars[i]}`];
          // console.log(rightAnswer);
          // return rightAnswer;
        }
      }
      console.log(rightAnswer);
      
      //increase correntQuestion index
      currentQuestion++;

      //check the answer 
      checkAnswer(rightAnswer,questionCount);
      
      
      //remove old question and add new one
      headerQuestions.innerText = "";
      mainAnswersdiv.innerHTML = "";
      //add new question  (call the function again but here the index increase 1)
        addDataToPage(result[currentQuestion], questionCount);


        //اضافة كلاس دون للسبان الموافق لرقم السؤال
        addDoneClass();


        //show score
        console.log(questionCount);
        console.log(currentQuestion);
        showScore(questionCount);
      });
    }).catch (error => {
      alert(`${error} ....check your Internet connection`);
    });
    })
  })
  // console.log(choosenApi);

  // bulletsContainer.style.display = "flex";
  // questionContainer.style.display = "block"
  // console.log(choosenApi);
  
  }




  
getQuestions();
function createBulletSpan(num) {
  //عدد رح نمررلو ياه من فوق وهوي عدد الاسئلة الكلي
  countSpan.innerHTML = num;
  //create the spans
  for (let i = 0; i < num; i++) {
    let spanBullet = document.createElement("span");
    //add done class to the first span
    if (i === 0) {
      spanBullet.className = "done";
    }
    //append spanBullet to main container
    bulletSpanContainer.appendChild(spanBullet);
  }
}

//function addDataToPage
function addDataToPage(obj, count) {
  // console.log(obj);
  // console.log(obj.question);
  // console.log(obj["answers"]);
  // console.log(obj["answers"]["answer_a"]);
  // console.log(count);
  
  if (currentQuestion < count) {
    //add the question to the h2 element
  headerQuestions.innerText = obj.question;

  //add answers to answers div
  for (let i = 0; i < 4; i++) {
    let answerDiv = document.createElement("div");
    answerDiv.className = "answer";
    //create radio input
    let radioInput = document.createElement("input");
    //add type + name + id + data attribute (to detect the right answer)
    radioInput.type = "radio";
    radioInput.name = "question";
    radioInput.id = `answer_${chars[i]}`;
    //رح تكون الداتا اتريبيوت نفس الجواب يلي بالليبل
    radioInput.dataset.answer = obj["answers"][`answer_${chars[i]}`];

    //first option is done
    if (i === 0) {
      radioInput.checked = true;
    }

    //create label
    let labelForAnswer = document.createElement("label");
    //add for to labelForAnswer
    labelForAnswer.htmlFor = `answer_${chars[i]}`;
    
    //add text to labelForAnswers
    //هيك صار معنا الداتا اتريبيوت والليبل ضمنن نفس القيمة
    let labelForAnswerText = document.createTextNode(
      obj["answers"][`answer_${chars[i]}`]
    );
    //add text to labelForAnswer
    labelForAnswer.appendChild(labelForAnswerText);
    
    //append radio input and labelForAnswer to answer div
    answerDiv.appendChild(radioInput);
    answerDiv.appendChild(labelForAnswer);
    
    mainAnswersdiv.appendChild(answerDiv);
  }
  }
  // else {
    //   alert("the questions finish")
  // }
}



//fnnction checkAnswer(rightAnswer,questionCount);
function checkAnswer(rAnswer,count) {
  // console.log(rAnswer);
  // console.log(count);

  //رج نجيب الراديو كلن ونعمل شرط على الراديو يلي تم اختيارو من قبل الشخص
  let answersInput = document.getElementsByName("question");
  let choosenAnswer ;

  for (let i = 0; i < answersInput.length; i++) {
    if(answersInput[i].checked) {
      choosenAnswer = answersInput[i].dataset.answer;
    }
  }
  // console.log(rAnswer);
  // console.log(choosenAnswer);
  if (rAnswer === choosenAnswer) {
    score++;
    // console.log("good");
  }

}


function addDoneClass() {
  let mySpans = document.querySelectorAll(".bullets .spans span");
  // console.log(mySpans);

  for (let i = 0; i < mySpans.length; i++) {
    if (currentQuestion === i) {
      mySpans[i].className = "done" ;
    }
  }
}

let lastResult =null;
//  or  let lastResult = "";


function showScore(count) {
  if (currentQuestion === count) {
    // console.log("questions finished");
    headerQuestions.remove();
    mainAnswersdiv.remove();
    submitButton.remove();
    bulletsContainer.remove();
    // totalSpan.innerHTML = "count";
    // console.log(totalSpan);
    if (score > (count / 2) && score < count) {
      lastResult = `<span class="good">Good <br>You got ${score} of ${count}`;
    } else if (score === count) {
      lastResult = `<span class="perfect">Perfect<br>You got ${score} of ${count}`;
    } else {
      lastResult = `<span class="bad">Bad<br>You got ${score} of ${count}`;
    }
    scoreDiv.innerHTML = lastResult;
    restartButton.style.display ="block";
    
  }
}


//decrease time countDown
function countDown (duration ,  count) {
  if (currentQuestion < count) {
    let minutes , seconds;
    counDownInterval = setInterval(() => {
      minutes = parseInt (duration / 60);
      seconds = parseInt (duration % 60);

      minutes = minutes < 10 ? `0${minutes}`: minutes;
      seconds = seconds < 10 ? `0${seconds}`: seconds;

      timeElement.innerHTML = `${minutes}:${seconds}`;

      if(--duration < 0) {
        clearInterval(counDownInterval);
        submitButton.click();
      }

    }, 1000);
  } 
}