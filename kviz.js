const questions = [
    { subject: "matematika", question: "Mennyi a sin(30°)?", answers: ["0.5", "0.866", "1"], correct: 0 },
    { subject: "matematika", question: "Mennyi a cos(60°)?", answers: ["0.5", "0.75", "1"], correct: 0 },
    { subject: "matematika", question: "Mennyi a tan(45°)?", answers: ["0", "1", "√3"], correct: 1 },

    { subject: "történelem", question: "Mikor tört ki az 1848-as forradalom?", answers: ["március 15.", "április 14.", "szeptember 29."], correct: 0 },
    { subject: "történelem", question: "Ki írta a 12 pontot?", answers: ["Petőfi Sándor", "Irinyi József", "Kossuth Lajos"], correct: 1 },
    { subject: "történelem", question: "Hol volt az első nagy tömegrendezvény?", answers: ["Nemzeti Múzeum", "Lánchíd", "Országház"], correct: 0 },

    { subject: "irodalom", question: "Hány színből áll Az ember tragédiája?", answers: ["15", "17", "20"], correct: 0 },
    { subject: "irodalom", question: "Ki írta Az ember tragédiáját?", answers: ["Arany János", "Madách Imre", "Vörösmarty Mihály"], correct: 1 },
    { subject: "irodalom", question: "Ki a főszereplő?", answers: ["Ádám", "Lucifer", "Mindkettő"], correct: 2 },

    { subject: "matematika", question: "Mennyi a π értéke?", answers: ["3.14", "2.71", "1.61", "5.14"], correct: 0 }
];
let currentIndex = 0;
const userAnswers = Array(questions.length).fill(null);

const qs = s => document.querySelector(s);

function renderQuestion(i) {
  const q = questions[i];
  qs('.kerdes').textContent = `${i+1}. (${q.subject}) ${q.question}`;
  const valaszDiv = qs('#valasz');
  valaszDiv.innerHTML = '';

  q.answers.forEach((ans, idx) => {
    const div = document.createElement('div');
    div.className = 'form-check';
    const input = document.createElement('input');
    input.type='radio'; input.name='answer'; input.value=idx; input.id=`q${i}_a${idx}`;
    input.className='form-check-input';
    input.addEventListener('change', ()=>qs('#kovigomb').classList.remove('d-none'));
    const label = document.createElement('label');
    label.htmlFor=input.id; label.className='form-check-label'; label.textContent=ans;
    div.append(input,label); valaszDiv.appendChild(div);
  });

  if(userAnswers[i]!==null){ qs(`#q${i}_a${userAnswers[i]}`).checked=true; qs('#kovigomb').classList.remove('d-none'); }
  else qs('#kovigomb').classList.add('d-none');

  qs('#kovigomb').textContent = i===questions.length-1 ? 'Válasz rögzítése':'Következő kérdés';
}

function updateTable(i){
  const table = qs('.table');
  let tbody = table.querySelector('tbody'); if(!tbody){ tbody=document.createElement('tbody'); table.appendChild(tbody); }

  const subjClass = (questions[i].subject.toLowerCase()==='matek'||questions[i].subject.toLowerCase()==='matematika')?'matek-row':
                    questions[i].subject.toLowerCase()==='irodalom'?'irodalom-row':'tortenelem-row';

  let row = tbody.querySelector(`#row-${i}`);
  if(!row){
    row=document.createElement('tr'); row.id=`row-${i}`; row.className=subjClass;
    const td=document.createElement('td'); td.colSpan=2; td.textContent=`${i+1}. ${questions[i].question}`; row.appendChild(td); tbody.appendChild(row);

    const row2=document.createElement('tr'); row2.id=`row-${i}-answers`; row2.className=subjClass;
    const tdC=document.createElement('td'); tdC.textContent=questions[i].answers[questions[i].correct]; tdC.className='align-middle';
    const tdG=document.createElement('td'); tdG.textContent=userAnswers[i]===null?'—':questions[i].answers[userAnswers[i]]; tdG.className='align-middle';
    tdG.style.color = userAnswers[i]===questions[i].correct?'#0f0':'#f66';
    row2.append(tdC,tdG); tbody.appendChild(row2);
  } else {
    const tds=tbody.querySelector(`#row-${i}-answers`).querySelectorAll('td');
    tds[0].textContent=questions[i].answers[questions[i].correct];
    tds[1].textContent=userAnswers[i]===null?'—':questions[i].answers[userAnswers[i]];
    tds[1].style.color = userAnswers[i]===questions[i].correct?'#0f0':'#f66';
  }
}

function kovi(){
  const selected = document.querySelector('input[name="answer"]:checked'); if(!selected) return;
  userAnswers[currentIndex]=Number(selected.value);
  qs('#helyes').textContent=questions[currentIndex].answers[questions[currentIndex].correct];
  qs('#megadott').textContent=questions[currentIndex].answers[userAnswers[currentIndex]];

  updateTable(currentIndex);

  if(currentIndex<questions.length-1){ currentIndex++; renderQuestion(currentIndex); qs('#kovigomb').classList.add('d-none'); }
  else eredmeny();
}

function eredmeny(){
  const correctCount = userAnswers.filter((a,i)=>a===questions[i].correct).length;
  const div = qs('#eredmeny'); div.classList.remove('d-none');
  div.innerHTML=`<strong>Végeredmény:</strong> ${correctCount} / ${questions.length} (${Math.round((correctCount/questions.length)*100)}%)`;
  div.classList.remove('alert-info'); div.classList.add(correctCount===questions.length?'alert-success':'alert-warning');
  qs('#kovigomb').classList.add('d-none');
}

document.addEventListener('DOMContentLoaded',()=>{
  qs('#quiz').style.background='rgba(255,255,255,0.03)'; qs('#quiz').style.padding='1rem';
  window.kovi=kovi; window.eredmeny=eredmeny;
  renderQuestion(currentIndex);
});
