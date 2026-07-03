/* ═══ LuckyPick v4.3 — 无痕模式 + 极简 ═══ */
(function(){
'use strict';

const I18N={
  zh:{
    app_name:'别纠结了',
    roll_btn:'掷骰对决',
    battle_title:'掷骰中...',
    winner_label:'获胜者',
    again:'再来一局',
    export:'导出',
    history_title:'历史记录',
    history_empty:'暂无记录',
    history_incognito:'无痕模式下不保存记录',
    clear_history:'清空历史',
    exported:'已导出图片 ✨',
    min_options:'至少需要 2 个选项哦~',
    result_msgs:['命运已经替你决定了~','别纠结啦，就是它了！','宇宙选择了这个答案','今天就听幸运的吧','再犹豫就不礼貌了','骰子说：就是它！','幸运女神选中了这一项','相信它吧！']
  },
  en:{
    app_name:'Lucky Picker',
    roll_btn:'Roll!',
    battle_title:'Rolling...',
    winner_label:'WINNER',
    again:'Again',
    export:'Export',
    history_title:'History',
    history_empty:'No records',
    history_incognito:'Incognito mode: no history saved',
    clear_history:'Clear All',
    exported:'Image exported! ✨',
    min_options:'Need 2+ options!',
    result_msgs:['The universe has spoken',"It's this one!",'Fate has chosen','Trust your luck','Don\'t argue with destiny','The dice say: this is it!','Lady Luck picked this','Best outcome, believe it!']
  }
};

// State
let lang='zh',theme='light',rule='high',incognito=false,isRolling=false;
let history=[],optionCount=2;

const $=s=>document.querySelector(s);
const $$=s=>document.querySelectorAll(s);
function t(k){return(I18N[lang]&&I18N[lang][k])||I18N.zh[k]||k;}

function applyI18n(){$('#app-name').textContent=t('app_name');}
function applyTheme(){document.documentElement.setAttribute('data-theme',theme);}

// ── Dice Model ──
const FACE_NUM={front:1,back:6,right:3,left:4,top:2,bottom:5};
const NUM_ROT={1:{x:0,y:0},6:{x:0,y:180},3:{x:0,y:-90},4:{x:0,y:90},2:{x:-90,y:0},5:{x:90,y:0}};
const DOT_N={1:1,2:2,3:3,4:4,5:5,6:6};
const FC={1:'f1',2:'f2',3:'f3',4:'f4',5:'f5',6:'f6'};

function createDice(){
  const d=document.createElement('div');d.className='dice3d';
  ['front','back','right','left','top','bottom'].forEach(fn=>{
    const n=FACE_NUM[fn],f=document.createElement('div');
    f.className=`dice-face face-${fn} ${FC[n]}`;
    for(let i=0;i<DOT_N[n];i++){const dot=document.createElement('span');dot.className='dot';f.appendChild(dot);}
    d.appendChild(f);
  });
  return d;
}
function setDice(d,n){const r=NUM_ROT[n]||{x:0,y:0};d.style.transform=`rotateX(${r.x}deg) rotateY(${r.y}deg)`;}
function setDiceRaw(d,rx,ry){d.style.transform=`rotateX(${rx}deg) rotateY(${ry}deg)`;}

// ── Options ──
function getOptions(){return Array.from($$('.inp')).map(i=>i.value.trim()).filter(v=>v);}
const BC=['background:#E88BA8','background:#6BAFE0','background:#7BC89E','background:#E8BA7A','background:#C99AE8','background:#D4C96A','background:#7AB0DD','background:#E88BA8'];

function addRow(text){
  if(optionCount>=8)return;optionCount++;
  const l=$('#options-list'),letter=String.fromCharCode(64+optionCount);
  const r=document.createElement('div');r.className='row';
  r.innerHTML=`<span class="badge" style="${BC[(optionCount-1)%8]}">${letter}</span><input class="inp" placeholder="选项 ${letter}..." value="${text||''}"><button class="del">×</button>`;
  l.appendChild(r);bindRow(r);
}

function bindRow(row){
  row.querySelector('.del').onclick=()=>{row.remove();optionCount--;reindex();};
  row.querySelector('.inp').onkeydown=e=>{if(e.key==='Enter')doRoll();};
}

function reindex(){
  $$('.row').forEach((row,i)=>{
    row.querySelector('.badge').style=BC[i%8];
    const del=row.querySelector('.del');if(del)del.style.visibility=i<2?'hidden':'visible';
  });
}

// ── Core Roll ──
function doRoll(){
  if(isRolling)return;
  const opts=getOptions();
  if(opts.length<2){showToast(t('min_options'));return;}
  isRolling=true;
  $('#btn-roll').classList.add('rolling');

  const rolls=opts.map(()=>Math.floor(Math.random()*6)+1);
  const wi=rule==='high'?rolls.indexOf(Math.max(...rolls)):rolls.indexOf(Math.min(...rolls));

  $('#input-section').classList.add('hidden');
  $('#result-section').classList.add('hidden');
  $('#battle-section').classList.remove('hidden');
  $('#footer-lucky').classList.add('hidden');

  buildStage(opts);
  animateRoll(opts,rolls,wi);
}

function buildStage(opts){
  const st=$('#dice-stage');st.innerHTML='';
  opts.forEach(o=>{
    const u=document.createElement('div');u.className='dice-unit';
    const lb=document.createElement('div');lb.className='ulabel';
    lb.textContent=o.length>5?o.slice(0,5)+'..':o;
    u.appendChild(lb);
    const dc=createDice();
    setDiceRaw(dc,Math.random()*360,Math.random()*360);
    u.appendChild(dc);
    st.appendChild(u);
  });
}

function animateRoll(opts,rolls,wi){
  const units=$$('.dice-unit'),DUR=1800,t0=performance.now();
  const sm=new Map();
  units.forEach(u=>{
    u.querySelectorAll('.dice3d').forEach(d=>{
      sm.set(d,{
        vx:500+Math.random()*400,
        vy:380+Math.random()*320,
        vz:150+Math.random()*200,
        ox:(Math.random()-0.5)*14,
        oy:(Math.random()-0.5)*10
      });
    });
  });

  function tick(now){
    const el=now-t0,p=Math.min(el/DUR,1);
    $('#progress-bar').style.width=(p*100)+'%';

    let eased,bf;
    if(p<0.7){eased=p/0.7;bf=1-0.82*eased;}
    else{eased=1-Math.pow(1-(p-0.7)/0.3,3);bf=1-0.82*eased;}

    units.forEach((u,ui)=>{
      const dc=u.querySelector('.dice3d');
      const sp=sm.get(dc),ts=el/1000;

      if(p>=1){
        setDice(dc,rolls[ui]);
        dc.style.transition='transform .45s cubic-bezier(.22,1.36,.36,1)';
        setTimeout(()=>{u.classList.add(ui===wi?'winner':'loser');},100+ui*100);
      }else{
        dc.style.transform=
          `translateX(${sp.ox*(1-bf)}px)`+
          `translateY(${sp.oy*(1-bf)}px)`+
          `rotateX(${sp.vx*ts*bf}deg) rotateY(${sp.vy*ts*bf}deg) rotateZ(${sp.vz*ts*.25}deg)`;
        dc.style.transition='none';
      }
    });

    if(p>=1){
      setTimeout(()=>showResult(opts,rolls,wi),750);
    }else{
      requestAnimationFrame(tick);
    }
  }
  requestAnimationFrame(tick);
}

// ── Show Result ──
function showResult(opts,rolls,wi){
  $('#battle-section').classList.add('hidden');
  $('#result-section').classList.remove('hidden');
  $('#footer-lucky').classList.remove('hidden');
  isRolling=false;
  $('#btn-roll').classList.remove('rolling');

  const msgs=I18N[lang].result_msgs;
  $('#result-winner').textContent=opts[wi];
  $('#result-msg').textContent=msgs[Math.floor(Math.random()*msgs.length)];

  const cr=$('#result-dice-show');cr.innerHTML='';
  const ic=['','⚀','⚁','⚂','⚃','⚄','⚅'];
  opts.forEach((o,i)=>{
    const c=document.createElement('div');c.className='chip'+(i===wi?' win':'');
    c.innerHTML=`<span class="ci">${ic[rolls[i]]}</span><span>${o} (${rolls[i]})</span>`;
    cr.appendChild(c);
  });

  spawnConf();
  if(!incognito) saveHist(opts,rolls,wi);
  updateLucky();
}

function spawnConf(){
  const c=$('#confetti-container');c.innerHTML='';
  const cl=['#E88BA8','#7C6FBE','#6BAFE0','#7BC89E','#E8BA7A'];
  for(let i=0;i<20;i++){
    const p=document.createElement('div');p.className='cf-piece';
    p.style.left=Math.random()*100+'%';p.style.top='-8px';
    p.style.background=cl[Math.floor(Math.random()*cl.length)];
    p.style.borderRadius=Math.random()>.5?'50%':'1px';
    p.style.width=p.style.height=(4+Math.random()*5)+'px';
    p.style.animationDuration=(.7+Math.random()*.8)+'s';
    p.style.animationDelay=Math.random()*.35+'s';
    c.appendChild(p);
  }
  setTimeout(()=>c.innerHTML='',2000);
}

function showToast(msg){
  const o=document.querySelector('.toast');if(o)o.remove();
  const el=document.createElement('div');el.className='toast';el.textContent=msg;
  document.body.appendChild(el);setTimeout(()=>el.remove(),1800);
}

// ── History ──
function saveHist(o,r,w){history.unshift({id:Date.now(),options:o,rolls:r,totals:r,winnerIdx:w,rule,createdAt:new Date().toISOString()});if(history.length>100)history.pop();chrome.storage.local.set({luckypick_history:history});}
function renderH(){
  const l=$('#history-list');
  if(incognito){
    l.innerHTML=`<div class="pe pe-incognito">${t('history_incognito')}</div>`;
    $('#btn-clear-history').style.display='none';
    return;
  }
  $('#btn-clear-history').style.display='';
  if(!history.length){l.innerHTML='<div class="pe">'+t('history_empty')+'</div>';return;}
  l.innerHTML='';
  const ic=['','⚀','⚁','⚂','⚃','⚄','⚅'];
  history.forEach((rec,i)=>{
    const el=document.createElement('div');el.className='hi';
    el.innerHTML=`<div class="hw">🎲 ${rec.options[rec.winnerIdx]}</div><div class="ho">${rec.options.map((o,j)=>ic[rec.totals[j]]+o).join('　')}</div><div class="hm"><span>${new Date(rec.createdAt).toLocaleDateString().slice(5)} ${new Date(rec.createdAt).toTimeString().slice(0,5)}</span><button class="hd-b" data-i="${i}">🗑</button></div>`;
    l.appendChild(el);
  });
  l.querySelectorAll('.hd-b').forEach(b=>{b.onclick=()=>{history.splice(+b.dataset.i,1);chrome.storage.local.set({luckypick_history:history});renderH();};});
}
function clearH(){if(confirm(lang==='zh'?'清空所有历史？':'Clear all?')){history=[];chrome.storage.local.set({luckypick_history:[]});renderH();}}

// ── Export as Image ──
function exportAsImage(){
  const winnerName=$('#result-winner').textContent;
  const msg=$('#result-msg').textContent;
  const chips=Array.from($$('#result-dice-show .chip')).map(c=>c.textContent.trim());

  const W=400,H=280;
  const canvas=document.createElement('canvas');
  canvas.width=W*2;canvas.height=H*2;
  const ctx=canvas.getContext('2d');
  ctx.scale(2,2);

  const isDark=theme==='dark';
  const bgColor=isDark?'#1A1825':'#FAFBFF';
  const cardColor=isDark?'#242135':'#FFFFFF';
  const accentColor='#7C6FBE';
  const winColor='#E88BA8';
  const subColor=isDark?'#9089AD':'#8E86A5';

  ctx.fillStyle=bgColor;
  ctx.fillRect(0,0,W,H);

  const cr=12;
  ctx.fillStyle=cardColor;
  ctx.beginPath();
  ctx.moveTo(20,16);ctx.lineTo(W-20,16);
  ctx.arcTo(W-20,16,W-20,16+cr,cr);
  ctx.lineTo(W-20,H-16-cr);ctx.arcTo(W-20,H-16,W-20-cr,H-16,cr);
  ctx.lineTo(20+cr,H-16);ctx.arcTo(20,H-16,20,H-16-cr,cr);
  ctx.lineTo(20,16+cr);ctx.arcTo(20,16,20+cr,16,cr);
  ctx.closePath();ctx.fill();

  const grad=ctx.createLinearGradient(20,0,W-20,0);
  grad.addColorStop(0,accentColor);grad.addColorStop(1,winColor);
  ctx.strokeStyle=grad;ctx.lineWidth=2.5;
  ctx.beginPath();ctx.moveTo(20+cr,16+1.5);ctx.lineTo(W-20-cr,16+1.5);ctx.stroke();

  ctx.fillStyle=accentColor;ctx.font='600 10px sans-serif';
  ctx.textAlign='center';
  ctx.fillText(t('winner_label'),W/2,48);

  ctx.font='800 22px sans-serif';
  const nameGrad=ctx.createLinearGradient(W/2-60,H/2-30,W/2+60,H/2);
  nameGrad.addColorStop(0,winColor);nameGrad.addColorStop(1,accentColor);
  ctx.fillStyle=nameGrad;
  ctx.textAlign='center';
  ctx.fillText(winnerName,W/2,H/2-4);

  ctx.font='12px sans-serif';ctx.fillStyle=subColor;
  ctx.textAlign='center';
  ctx.fillText(chips.join('   '),W/2,H/2+24);

  ctx.font='italic 12px sans-serif';ctx.fillStyle=subColor;
  ctx.fillText(msg,W/2,H/2+50);

  ctx.font='600 11px sans-serif';ctx.fillStyle=accentColor;ctx.globalAlpha=0.5;
  ctx.fillText('— LuckyPick 🎲',W/2,H-32);
  ctx.globalAlpha=1;

  const bGrad=ctx.createLinearGradient(20,0,W-20,0);
  bGrad.addColorStop(0,accentColor);bGrad.addColorStop(1,winColor);
  ctx.strokeStyle=bGrad;ctx.lineWidth=1.5;
  ctx.beginPath();ctx.moveTo(20+cr,H-16-1.5);ctx.lineTo(W-20-cr,H-16-1.5);ctx.stroke();

  canvas.toBlob(blob=>{
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');
    a.href=url;a.download=`luckypick-${winnerName}.png`;
    a.click();URL.revokeObjectURL(url);
    showToast(t('exported'));
  },'image/png');
}

// ── Daily Luck ──
function dailyL(){
  const d=new Date(),seed=d.getFullYear()*10000+(d.getMonth()+1)*100+d.getDate();
  const sr=n=>Math.sin(n*9999)-Math.floor(Math.sin(n*9999));
  const tips=lang==='zh'
    ?['适合尝试新事物','相信直觉','运气在勇敢者这边','今天适合做决定','跟着心走就对了','幸运偏爱行动派','适合和朋友聚会','放轻松好事即将发生']
    :['Try something new','Trust your gut','Fortune favors bold','Great day to decide','Follow heart','Luck loves action','Hang with friends','Relax, good things coming'];
  return {tip:tips[Math.floor(Math.abs(sr(seed+2))*tips.length)]};
}
function updateLucky(){
  const l=dailyL();
  $('#lucky-tip').textContent=l.tip;
}

// ── Settings Load/Save ──
function loadSettings(cb){
  chrome.storage.local.get(['luckypick_settings','luckypick_history'],res=>{
    const s=res.luckypick_settings||{};
    lang=s.lang||'zh';theme=s.theme||'light';rule=s.rule||'high';incognito=!!s.incognito;
    history=res.luckypick_history||[];
    applyTheme();
    applyI18n();
    updateLucky();if(cb)cb();
  });
}
function saveSettings(){chrome.storage.local.set({luckypick_settings:{lang,theme,rule,incognito}});}

// ── Panel ──
function openHistoryPanel(){$('#history-panel').classList.remove('hidden');$('#panel-overlay').classList.remove('hidden');renderH();}
function closeAllPanels(){$('#history-panel').classList.add('hidden');$('#settings-panel').classList.add('hidden');$('#panel-overlay').classList.add('hidden');}

function openSettingsPanel(){
  $('#set-theme').classList.toggle('on',theme==='dark');
  $('#set-incognito').classList.toggle('on',incognito);
  $$('#set-lang .seg-btn').forEach(b=>b.classList.toggle('active',b.dataset.v===lang));
  $$('#set-rule .seg-btn').forEach(b=>b.classList.toggle('active',b.dataset.v===rule));
  $('#settings-panel').classList.remove('hidden');
  $('#panel-overlay').classList.remove('hidden');
}

// ── Init ──
function init(){
  loadSettings(()=>{
    $$('.row').forEach(bindRow);

    $('#btn-add-option').onclick=()=>addRow();

    $$('#set-rule .seg-btn').forEach(btn=>{
      btn.onclick=()=>{
        rule=btn.dataset.v;
        $$('#set-rule .seg-btn').forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        saveSettings();
      };
    });

    $('#btn-roll').onclick=doRoll;

    $('#btn-again').onclick=()=>{
      $('#result-section').classList.add('hidden');
      $('#input-section').classList.remove('hidden');
      $('#footer-lucky').classList.remove('hidden');
      $$('.dice-unit').forEach(u=>u.classList.remove('winner','loser'));
    };
    $('#btn-export').onclick=exportAsImage;

    $('#btn-history').onclick=openHistoryPanel;
    $('#btn-close-panel').onclick=closeAllPanels;
    $('#panel-overlay').onclick=closeAllPanels;
    $('#btn-clear-history').onclick=clearH;

    $('#btn-settings').onclick=openSettingsPanel;
    $('#btn-close-settings').onclick=closeAllPanels;

    $$('#set-lang .seg-btn').forEach(b=>b.onclick=()=>{
      lang=b.dataset.v;
      $$('#set-lang .seg-btn').forEach(x=>x.classList.remove('active'));
      b.classList.add('active');
      saveSettings();
    });

    $('#set-theme').onclick=()=>{
      theme=theme==='dark'?'light':'dark';
      $('#set-theme').classList.toggle('on',theme==='dark');
      applyTheme();saveSettings();
    };

    $('#set-incognito').onclick=()=>{
      incognito=!incognito;
      $('#set-incognito').classList.toggle('on',incognito);
      saveSettings();
    };

    document.addEventListener('keydown',e=>{
      if(e.key==='Enter'&&!isRolling&&!$('#input-section').classList.contains('hidden')&&document.activeElement.tagName!=='INPUT')
        doRoll();
    });
  });
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);
else init();

})();
