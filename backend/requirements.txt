let questionCount = 0;

function addQuestion() {
  questionCount++;
  const template = document.getElementById('questionTemplate');
  const clone = template.content.cloneNode(true);
  const card = clone.querySelector('.question-card');
  const qid = `q_${Date.now()}`;
  card.dataset.qid = qid;
  card.querySelector('.q-num-val').textContent = questionCount;

  // Fix radio names to be unique per question
  card.querySelectorAll('.correct-radio').forEach((r, i) => {
    r.name = `correct_${qid}`;
    r.value = i;
  });

  document.getElementById('questionsContainer').appendChild(card);
  updatePreview();
}

function removeQuestion(btn) {
  const card = btn.closest('.question-card');
  card.remove();
  // Renumber
  document.querySelectorAll('.question-card').forEach((c, i) => {
    c.querySelector('.q-num-val').textContent = i + 1;
  });
  questionCount = document.querySelectorAll('.question-card').length;
  updatePreview();
}

function addOption(btn) {
  const container = btn.previousElementSibling;
  const qid = btn.closest('.question-card').dataset.qid;
  const count = container.querySelectorAll('.option-row').length;
  const row = document.createElement('div');
  row.className = 'option-row';
  row.innerHTML = `
    <input type="radio" name="correct_${qid}" value="${count}" class="correct-radio"/>
    <input type="text" class="option-input" placeholder="Option ${String.fromCharCode(65 + count)}"/>
    <button class="btn-remove-opt" onclick="removeOption(this)">✕</button>
  `;
  container.appendChild(row);
}

function removeOption(btn) {
  const row = btn.closest('.option-row');
  const container = row.parentElement;
  if (container.querySelectorAll('.option-row').length <= 2) {
    alert('A question must have at least 2 options.');
    return;
  }
  row.remove();
  // Re-index radio values
  container.querySelectorAll('.option-row').forEach((r, i) => {
    r.querySelector('.correct-radio').value = i;
    r.querySelector('.option-input').placeholder = `Option ${String.fromCharCode(65 + i)}`;
  });
}

function updatePreview() {
  const title = document.getElementById('quizTitle').value || 'Quiz Title';
  const timer = document.getElementById('quizTimer').value || 10;
  const cards = document.querySelectorAll('.question-card');
  document.getElementById('previewTitle').textContent = title;
  document.getElementById('previewCount').textContent = `${cards.length} question${cards.length !== 1 ? 's' : ''}`;
  document.getElementById('previewTimer').textContent = `⏱ ${timer} min`;
  const list = document.getElementById('previewList');
  list.innerHTML = '';
  cards.forEach((c, i) => {
    const qt = c.querySelector('.q-text').value;
    const div = document.createElement('div');
    div.className = 'preview-q-item';
    div.textContent = `${i + 1}. ${qt || '(empty question)'}`;
    list.appendChild(div);
  });
}

// Live preview updates
document.addEventListener('input', (e) => {
  if (e.target.matches('#quizTitle, #quizTimer, .q-text, .option-input')) {
    updatePreview();
  }
});

async function saveQuiz() {
  const title = document.getElementById('quizTitle').value.trim();
  const timer = parseInt(document.getElementById('quizTimer').value);
  if (!title) { alert('Please enter a quiz title.'); return; }

  const cards = document.querySelectorAll('.question-card');
  if (cards.length === 0) { alert('Please add at least one question.'); return; }

  const questions = [];
  let valid = true;

  cards.forEach((card, qi) => {
    const qText = card.querySelector('.q-text').value.trim();
    if (!qText) { alert(`Question ${qi + 1} is empty.`); valid = false; return; }

    const optInputs = card.querySelectorAll('.option-input');
    const opts = Array.from(optInputs).map(i => i.value.trim()).filter(v => v);
    if (opts.length < 2) { alert(`Question ${qi + 1} needs at least 2 options.`); valid = false; return; }

    const selectedRadio = card.querySelector('.correct-radio:checked');
    if (!selectedRadio) { alert(`Please select the correct answer for question ${qi + 1}.`); valid = false; return; }

    const correctIdx = parseInt(selectedRadio.value);
    const allInputs = Array.from(card.querySelectorAll('.option-input'));
    const correctAnswer = allInputs[correctIdx]?.value.trim();
    if (!correctAnswer) { alert(`Correct answer option for question ${qi + 1} is empty.`); valid = false; return; }

    questions.push({
      id: `${qi}_${Date.now()}`,
      question: qText,
      options: opts,
      correct_answer: correctAnswer
    });
  });

  if (!valid) return;

  const btn = document.querySelector('.btn-primary.large-btn');
  btn.textContent = 'Saving...';
  btn.disabled = true;

  const resp = await fetch('/create-quiz', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, timer, questions })
  });
  const data = await resp.json();
  if (data.success) {
    window.location.href = '/dashboard';
  } else {
    alert('Failed to save quiz. Please try again.');
    btn.textContent = 'Save Quiz';
    btn.disabled = false;
  }
}

// Add first question on load
addQuestion();
