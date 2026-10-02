const TRAINS=[
{name:'ITX-청춘',body:'#d8f0f4',stripe:'#2d74b8',text:'#18384e',cars:4,desc:'2층 객차가 있는 청춘 열차'},
{name:'새마을호',body:'#e9e9e9',stripe:'#d94b43',text:'#222',cars:4,desc:'오래 사랑받은 간선 여객열차'},
{name:'ITX-마음',body:'#ececec',stripe:'#d64045',text:'#222',cars:4,desc:'새로운 세대의 ITX 열차'},
{name:'무궁화호',body:'#e8e8e3',stripe:'#e34c42',text:'#222',cars:4,desc:'전국 여러 지역을 잇는 여객열차'},
{name:'CDC',body:'#dce6e7',stripe:'#347ab7',text:'#222',cars:3,desc:'디젤동차 형태의 별도 열차'}
];
const MISSIONS=[
{role:'관제 임무',title:'진입 신호 확인!',story:t=>`${t.name}이(가) 역에 접근합니다. 그런데 진입 신호가 빨간색입니다.`,answer:'열차를 정지시키고 신호를 확인한다',choices:['그대로 진입시킨다','열차를 정지시키고 신호를 확인한다','속도를 더 높인다','반대 선로로 보낸다']},
{role:'승강장 임무',title:'승객이 아직 타고 있어요!',story:t=>`${t.name}의 출입문 근처에 승객이 있습니다. 출발 시각은 지났습니다.`,answer:'승하차와 문 닫힘을 확인한다',choices:['바로 출발한다','경적만 울린다','승하차와 문 닫힘을 확인한다','불을 끄고 출발한다']},
{role:'선로 임무',title:'앞 열차와 간격이 좁아요!',story:t=>`${t.name} 앞쪽 구간에 다른 열차가 아직 지나가고 있습니다.`,answer:'앞 구간이 비워질 때까지 기다린다',choices:['앞 구간이 비워질 때까지 기다린다','옆으로 추월한다','최고속도로 출발한다','승강장을 바꾼다']},
{role:'날씨 임무',title:'갑자기 비가 많이 와요!',story:t=>`폭우가 시작됐습니다. ${t.name}이(가) 다음 역으로 출발하려고 합니다.`,answer:'상황을 확인하며 안전하게 운행한다',choices:['무조건 빨리 달린다','전조등을 끈다','상황을 확인하며 안전하게 운행한다','신호를 무시한다']},
{role:'역무 임무',title:'가족 손님이 길을 물어요!',story:t=>`이서와 엄마가 ${t.name}을 타려고 하는데 승강장을 찾지 못하고 있어요.`,answer:'전광판을 확인해 승강장을 안내한다',choices:['아무 열차나 타라고 한다','전광판을 확인해 승강장을 안내한다','역 밖으로 보낸다','선로로 내려가라고 한다']},
{role:'차량 임무',title:'열차를 잘 찾아봐!',story:t=>`방송에서 “${t.name}을 찾아주세요!”라고 합니다. 아래 열차 이름을 잘 기억하세요.`,answer:'열차 특징과 이름을 다시 확인한다',choices:['열차 특징과 이름을 다시 확인한다','색만 보고 아무거나 고른다','모두 같은 기차라고 한다','운행을 취소한다']},
{role:'비상 임무',title:'선로에 장애물!',story:t=>`${t.name}이(가) 출발하려는데 앞 선로에 장애물이 발견됐습니다.`,answer:'출발을 멈추고 선로 안전을 확인한다',choices:['그냥 지나간다','속도를 높인다','출발을 멈추고 선로 안전을 확인한다','승객에게 치우라고 한다']}
];
let score=0,badge=0,locked=false,current=null;
const $=s=>document.querySelector(s),pick=a=>a[Math.floor(Math.random()*a.length)];
function trainHTML(t){let h='<div class="train" style="--body:'+t.body+';--stripe:'+t.stripe+';--text:'+t.text+'">';for(let i=0;i<t.cars;i++)h+=`<div class="car"><span class="window"></span><span class="stripe"></span><span class="label">${i===0?t.name:''}</span><i class="wheel w1"></i><i class="wheel w2"></i></div>`;return h+'</div>'}
function renderCards(){ $('#cards').innerHTML=TRAINS.map(t=>`<div class="card" style="--body:${t.body}"><div class="mini"></div><b>${t.name}</b></div>`).join('') }
function newMission(){locked=false;$('#next').disabled=true;document.querySelectorAll('.track').forEach(x=>x.innerHTML='');const t=pick(TRAINS),m=pick(MISSIONS),track=pick(['#track1','#track2','#track3']);current={t,m};$(track).innerHTML=trainHTML(t);$('#role').textContent=m.role;$('#title').textContent=m.title;$('#story').textContent=m.story(t);const rain=Math.random()<.25;$('#sky').textContent=rain?'🌧️　☁️　🌧️':'☀️　☁️　　☁️';$('#weather').textContent=rain?'날씨: 비':'날씨: 맑음';const choices=[...m.choices].sort(()=>Math.random()-.5);$('#choices').innerHTML='';choices.forEach(c=>{let b=document.createElement('button');b.textContent=c;b.onclick=()=>answer(c,b);$('#choices').appendChild(b)});setTimeout(()=>{const tr=document.querySelector('.train');if(tr)tr.style.left='8%'},80);let hh=6+Math.floor(Math.random()*16),mm=pick(['00','12','25','38','45','53']);$('#clock').textContent=String(hh).padStart(2,'0')+':'+mm}
function answer(c,b){if(locked)return;locked=true;document.querySelectorAll('#choices button').forEach(x=>x.disabled=true);if(c===current.m.answer){score+=10;badge++;b.classList.add('correct');$('#title').textContent='🎉 안전 운행 성공!';$('#story').textContent=`정답! ${current.t.name} 임무를 잘 처리했어요.`}else{b.classList.add('wrong');$('#title').textContent='🚦 다시 기억해보자!';$('#story').textContent=`가장 안전한 선택은 “${current.m.answer}”예요.`;[...document.querySelectorAll('#choices button')].find(x=>x.textContent===current.m.answer)?.classList.add('correct')}$('#score').textContent=score;$('#badge').textContent=badge;$('#next').disabled=false}
$('#next').onclick=newMission;$('#announce').onclick=()=>{if(!current)return;const msg=`안내 말씀드립니다. ${current.t.name} 열차가 승강장에 들어오고 있습니다. 안전선 안쪽에서 기다려 주시기 바랍니다.`;if('speechSynthesis'in window){speechSynthesis.cancel();let u=new SpeechSynthesisUtterance(msg);u.lang='ko-KR';u.rate=.82;speechSynthesis.speak(u)}else alert(msg)};
renderCards();newMission();
