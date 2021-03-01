const $dashboard = document.getElementById('dashboard'),
      $timer = document.getElementById('timer'),
      $step = document.getElementById('steps'),
      $score = document.getElementById('score'),
      $board = document.getElementById('board'),
      $startButton = document.getElementById('start'),
      $audio = document.getElementById('audio'),
      soundsUrls = {
          yes: 'sounds/yes.mp3',
          no: 'sounds/no.mp3'
      },
      cards = [
          {
              answer: '1',
              image: 'photos/1.jpg'
          },
          {
              answer: '2',
              image: 'photos/2.jpg'
          },
          {
              answer: '3',
              image: 'photos/3.jpg'
          },
          {
              answer: '4',
              image: 'photos/4.jpg'
          },
          {
              answer: '5',
              image: 'photos/5.jpg'
          },
          {
              answer: '6',
              image: 'photos/6.jpg'
          },
          {
              answer: '7',
              image: 'photos/7.jpg'
          },
          {
              answer: '8',
              image: 'photos/8.jpg'
          },
      ];

let score,
    steps,
    timer,
    timerInterval, 
    selections = [];

const shuffle = (arrayOfItems) => {
    let counter = arrayOfItems.length;

    while (counter > 0) {
    let index = Math.floor (Math.random() * counter);
    counter--;
    let temp = arrayOfItems[counter];
    arrayOfItems[counter] = arrayOfItems[index];
    arrayOfItems[index] = temp;
    }

    return arrayOfItems;
}

const countTime = () => {
    timer = 70;
    timerInterval = setInterval(() => {
        --timer;
        $timer.innerText = timer;
        if(timer === 0) {
            clearInterval(timerInterval);
            swal.fire({
                title: 'G A M E  -  O V E R ! !',
                text: 'Time out... :(',
                icon: 'error',
                showConfirmButton: true,
                confirmButtonText: 'Do you want Try Again?',
                background: '#292929',
                confirmButtonColor: '#3f3f3f'
            }).then((result) => {
                if(result.isConfirmed) {
                    startGame();
                }
            })         
        }
    }, 1000) 
}

const countSteps = () => {
    ++steps;
    $step.innerText = steps;
    calcScore();
}


const calcScore = () => {
    const rating3Limit = (cards.length) + 1;
    const rating2Limit = (cards.length) + 5;
    const rating1Limit = (cards.length * 2) + 2;

    const is3Stars = steps <= rating3Limit;
    const is2Stars = steps > rating3Limit && steps < rating1Limit;
    const is1Stars = steps >= rating1Limit;
    
    if (is3Stars) {
        score = 3;
    } else if (is2Stars) {
        score = 2;
    } else if (is1Stars) {
        score = 1;
    }
    $score.innerText = score;
}

const CheckIfGameOver = () => {
    const openCards = (document.getElementsByClassName('open')).length;
    
    if ((cards.length * 2) === openCards) {
        clearInterval(timerInterval);
        setTimeout(() => {
            Swal.mixin({
                background: '#292929',
                confirmButtonColor: '#3f3f3f',
                confirmButtonText: 'Next &rarr;',
                showCancelButton: false,
                progressSteps: ['1', '2', '3']
              }).queue([
                {
                  title: 'score',
                  text: `Your Score is ${score},`
                },
                `Your Steps is ${steps}`,
                `You Play ${90 - timer} Seconds`
              ]).then((result) => {
                if (result.value) {
                  Swal.fire({
                    background: '#292929',
                    confirmButtonColor: '#3f3f3f',
                    title: 'Do you want Play Again?',
                    confirmButtonText: 'Yes!'
                  }).then((result) => {
                    if(result.isConfirmed) {
                        startGame();
                    }
                  })
                }
              })
        }, 800)
    }
}

const checkGameState = () => {
    countSteps();
    calcScore();
    CheckIfGameOver();
}

const printCards = (cardsArray) => {
    $board.innerHTML = '';
    const shuffledCards = shuffle([...cards, ...cards]);
    
    shuffledCards.forEach((card) => {
        const liElement = document.createElement('li');
        liElement.dataset.answer = card.answer;

        const imgElement = document.createElement('img');
        imgElement.src = card.image;
        imgElement.alt = card.answer;
        imgElement.title = card.answer;

        liElement.appendChild(imgElement);
        $board.appendChild(liElement);
    },)
}

const startGame = () => {
    printCards(cards);
    steps = 0;
    score = 3;
    $step.innerText = steps;
    $score.innerText = score;
    countTime();
}

const flipCards = (isCorrect) => {
    $board.classList.add('compare');
    setTimeout(() => {
        const flippedCards = Array.from(document.getElementsByClassName('flip'));
        
        flippedCards.forEach(card => {

            if(isCorrect) { 
                $audio.src = soundsUrls.yes;
                $audio.play();
                card.classList.replace('flip', 'open');
            } else {
                $audio.src = soundsUrls.no;
                $audio.play();
                card.classList.remove('flip');
            }
        });
        $board.classList.remove('compare');
        checkGameState();
    }, 800)   
}

$startButton.addEventListener('click', () => {
    startGame();
    $startButton.classList.add('hide');
})

$board.addEventListener('click', ($event) => {
    isCard = $event.target.localName === 'li';
    isOpen = $event.target.classList.contains('open');
    isFlip = $event.target.classList.contains('flip');
    if(!isCard || isOpen || isFlip) { return; }

    const currentUserSelection = $event.target.dataset.answer;
    $event.target.classList.add('flip');

    selections.push(currentUserSelection);

    if(selections.length === 2) {
        const isCorrectAnswer = selections[0] === selections [1];
        
        flipCards(isCorrectAnswer);
        selections = [];
    }
})


