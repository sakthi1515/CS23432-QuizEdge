let currentQuestion = 0;
let answers = {};
let timeLeft = TOTAL_TIME;
let timerInterval;
let submitted = false;

function goToQuestion(idx) {
  const slides = document.querySelectorAll('.question-slide');
  const navBtns = document.querySelectorAll('.qnav-btn');
  slides.forEach(s => s.classList.remove('active'));
  navBtns.forEach(b => b.classList.remove('active'));
  if (slides[idx]) {
    slides[idx].classList.add('active');
    currentQuestion = idx;
  }
  if (navBtns[idx]) navBtns[idx].classList.add('active');
}

function selectAnswer(qid, input) {
  answers[qid] = input.value;
  const navBtns = document.querySelectorAll('.qnav-btn');
  const slide = input.closest('.question-slide');
  const idx = parseInt(slide.dataset.index);
  if (navBtns[idx]) navBtns[idx].classList.add('answered');
  updateProgress();
}

function updateProgress() {
  const answered = Object.keys(answers).length;
  const pct = (answered / TOTAL_QUESTIONS) * 100;
  document.getElementById('progressFill').style.width = pct + '%';
  document.getElementById('progressText').textContent = `${answered} / ${TOTAL_QUESTIONS}`;
}

function startTimer() {
  const display = document.getElementById('timerValue');
  const bar = document.getElementById('timerBar');

  timerInterval = setInterval(() => {
    timeLeft--;
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    display.textContent = `${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;
    const pct = (timeLeft / TOTAL_TIME) * 100;
    bar.style.width = pct + '%';

    if (timeLeft <= 60) {
      bar.style.background = 'var(--error)';
      display.classList.add('danger');
    } else if (timeLeft <= TOTAL_TIME * 0.25) {
      bar.style.background = 'var(--warning)';
    }

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      display.textContent = '00:00';
      autoSubmit();
    }
  }, 1000);
}

function submitQuiz() {
  const unanswered = TOTAL_QUESTIONS - Object.keys(answers).length;
  const modal = document.getElementById('submitModal');
  const msg = document.getElementById('submitMsg');
  if (unanswered > 0) {
    msg.textContent = `You have ${unanswered} unanswered question${unanswered > 1 ? 's' : ''}. Are you sure you want to submit?`;
  } else {
    msg.textContent = 'All questions answered! Ready to submit?';
  }
  modal.style.display = 'flex';
}

function closeModal() {
  document.getElementById('submitModal').style.display = 'none';
}

async function confirmSubmit() {
  if (submitted) return;
  submitted = true;
  clearInterval(timerInterval);
  document.getElementById('submitModal').style.display = 'none';

  const resp = await fetch(`/submit-quiz/${QUIZ_ID}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ answers })
  });
  const data = await resp.json();
  if (data.success) {
    window.location.href = `/result/${data.attempt_id}`;
  }
}

function autoSubmit() {
  if (submitted) return;
  submitted = true;
  alert('⏱ Time is up! Your quiz is being submitted automatically.');
  fetch(`/submit-quiz/${QUIZ_ID}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ answers })
  }).then(r => r.json()).then(data => {
    if (data.success) window.location.href = `/result/${data.attempt_id}`;
  });
}

// Init
startTimer();
updateProgress();
