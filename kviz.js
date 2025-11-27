const questions = [
    { 
        subject: "matematika",
        question: "Mennyi a sin(30°)?",
        answers: ["0.5", "0.866", "1"],
        correct: 0
    },
    { 
        subject: "matematika",
        question: "Mennyi a cos(60°)?",
        answers: ["0.5", "0.75", "1"],
        correct: 0
    },
    { 
        subject: "matematika",
        question: "Mennyi a tan(45°)?",
        answers: ["0", "1", "√3"],
        correct: 1
    },
    { 
        subject: "történelem",
        question: "Mikor tört ki az 1848-as forradalom Magyarországon?",
        answers: ["március 15.", "április 14.", "szeptember 29."],
        correct: 0
    },
    { 
        subject: "történelem",
        question: "Ki írta a 12 pontot?",
        answers: ["Petőfi Sándor", "Irinyi József", "Kossuth Lajos"],
        correct: 1
    },
    { 
        subject: "történelem",
        question: "Hol történt a forradalom egyik első nagy tömegrendezvénye?",
        answers: ["Nemzeti Múzeum", "Lánchíd", "Országház"],
        correct: 0
    },
    { 
        subject: "irodalom",
        question: "Hány színből áll Az ember tragédiája?",
        answers: ["15", "17", "20"],
        correct: 0
    },
    { 
        subject: "irodalom",
        question: "Ki írta Az ember tragédiáját?",
        answers: ["Arany János", "Madách Imre", "Vörösmarty Mihály"],
        correct: 1
    },
    { 
        subject: "irodalom",
        question: "Hogyan hívják Az ember tragédiája főszereplőjét?",
        answers: ["Ádám", "Lucifer", "Mindkettő fontos szereplő"],
        correct: 2
    },
    { 
        subject: "matek",
        question: "Mennyi a pi értéke?",
        answers: ["3.14", "2.71", "1.61", "5.14"],
        correct: 0
    }
];

let currentIndex = 0;
const userAnswers = new Array(questions.length).fill(null);

function qs(selector) { return document.querySelector(selector); }

function renderQuestion(index) {
  const q = questions[index];
  const kerdesElem = qs('.kerdes');
  const valaszDiv = qs('#valasz');
  kerdesElem.textContent = `${index + 1}. (${q.subject}) ${q.question}`;

  valaszDiv.innerHTML = '';

  q.answers.forEach((ans, i) => {
    const div = document.createElement('div');
    div.className = 'form-check';

    const input = document.createElement('input');
    input.className = 'form-check-input';
    input.type = 'radio';
    input.name = 'answer';
    input.id = `q${index}_a${i}`;
    input.value = i;
    input.addEventListener('change', () => {
      qs('#kovigomb').classList.remove('d-none');
    });

    const label = document.createElement('label');
    label.className = 'form-check-label';
    label.htmlFor = input.id;
    label.textContent = ans;

    div.appendChild(input);
    div.appendChild(label);
    valaszDiv.appendChild(div);
  });

  const prev = userAnswers[index];
  if (prev !== null) {
    const el = qs(`#q${index}_a${prev}`);
    if (el) el.checked = true;
    qs('#kovigomb').classList.remove('d-none');
  } else {
    qs('#kovigomb').classList.add('d-none');
  }

  if (index === questions.length - 1) {
    qs('#kovigomb').textContent = 'Válasz rögzítése';
  } else {
    qs('#kovigomb').textContent = 'Következő kérdés';
  }
}

function updateTableForQuestion(index) {
  const table = qs('.table');
  let tbody = table.querySelector('tbody');
  if (!tbody) {
    tbody = document.createElement('tbody');
    table.appendChild(tbody);
  }

  let subjectClass = '';
  const subj = questions[index].subject.toLowerCase();
  if (subj === 'matematika' || subj === 'matek') subjectClass = 'matek-row';
  else if (subj === 'irodalom') subjectClass = 'irodalom-row';
  else if (subj === 'történelem') subjectClass = 'tortenelem-row';

  let row = tbody.querySelector(`#row-${index}`);
  if (!row) {
    row = document.createElement('tr');
    row.id = `row-${index}`;
    if (subjectClass) row.classList.add(subjectClass);
    const tdQ = document.createElement('td');
    tdQ.colSpan = 2;
    tdQ.textContent = `${index + 1}. ${questions[index].question}`;
    row.appendChild(tdQ);
    tbody.appendChild(row);

    const row2 = document.createElement('tr');
    row2.id = `row-${index}-answers`;
    if (subjectClass) row2.classList.add(subjectClass);

    const tdCorrect = document.createElement('td');
    tdCorrect.textContent = questions[index].answers[questions[index].correct];
    tdCorrect.className = 'align-middle';

    const tdGiven = document.createElement('td');
    tdGiven.textContent = userAnswers[index] === null ? '—' : questions[index].answers[userAnswers[index]];
    tdGiven.className = 'align-middle';

    if (userAnswers[index] === questions[index].correct) {
      tdGiven.style.color = '#0f0';
    } else {
      tdGiven.style.color = '#f66';
    }

    row2.appendChild(tdCorrect);
    row2.appendChild(tdGiven);
    tbody.appendChild(row2);
  } else {
    const row2 = tbody.querySelector(`#row-${index}-answers`);
    const tds = row2.querySelectorAll('td');
    tds[0].textContent = questions[index].answers[questions[index].correct];
    tds[1].textContent = userAnswers[index] === null ? '—' : questions[index].answers[userAnswers[index]];
    tds[1].style.color = userAnswers[index] === questions[index].correct ? '#0f0' : '#f66';
  }
}

function kovi() {
  const selected = document.querySelector('input[name="answer"]:checked');
  if (!selected) return;
  const val = Number(selected.value);
  userAnswers[currentIndex] = val;

  const helyes = qs('#helyes');
  const megadott = qs('#megadott');
  if (helyes && megadott) {
    helyes.textContent = questions[currentIndex].answers[questions[currentIndex].correct];
    megadott.textContent = questions[currentIndex].answers[val];
  }

  updateTableForQuestion(currentIndex);

  if (currentIndex < questions.length - 1) {
    currentIndex++;
    renderQuestion(currentIndex);
    qs('#kovigomb').classList.add('d-none');
  } else {
    eredmeny();
  }
}

function eredmeny() {
  let correctCount = 0;
  for (let i = 0; i < questions.length; i++) {
    if (userAnswers[i] === questions[i].correct) correctCount++;
  }

  const eredmenyDiv = qs('#eredmeny');
  eredmenyDiv.classList.remove('d-none');
  eredmenyDiv.innerHTML = `<strong>Végeredmény:</strong> ${correctCount} / ${questions.length} (${Math.round((correctCount / questions.length) * 100)}%)`;

  eredmenyDiv.classList.remove('alert-info');
  eredmenyDiv.classList.add(correctCount === questions.length ? 'alert-success' : 'alert-warning');

  qs('#kovigomb').classList.add('d-none');
}

document.addEventListener('DOMContentLoaded', () => {
  qs('#quiz').style.background = 'rgba(255,255,255,0.03)';
  qs('#quiz').style.padding = '1rem';

  window.kovi = kovi;
  window.eredmeny = eredmeny;

  renderQuestion(currentIndex);
});
