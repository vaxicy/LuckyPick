/* ═══ LuckyPick v4.3 — 无痕模式 + 极简 ═══ */
(function(){
'use strict';

const I18N={
  zh:{
    app_name:'别纠结了',
    roll_btn:'🎲 掷骰对决',
    battle_title:'掷骰中...',
    winner_label:'获胜者',
    again:'再来一局',
    export_btn:'📸 导出',
    history_title:'📋 历史记录',
    history_empty:'暂无记录',
    history_incognito:'无痕模式下不保存记录',
    clear_history:'清空历史',
    exported:'已导出图片 ✨',
    min_options:'至少需要 2 个选项哦~',
    result_msgs:['命运已经替你决定了~','别纠结啦，就是它了！','宇宙选择了这个答案','今天就听幸运的吧','再犹豫就不礼貌了','骰子说：就是它！','幸运女神选中了这一项','相信它吧！'],
    add_option:'＋ 添加选项',
    opt_placeholder_a:'选项 A...',
    opt_placeholder_b:'选项 B...',
    opt_placeholder:'选项 {0}...',
    settings_title:'⚙️ 设置',
    settings_tip:'设置',
    history_tip:'历史记录',
    language:'语言 / Language',
    theme_label:'深色模式',
    incognito_label:'无痕模式',
    rule_label:'默认规则',
    rule_high:'大者胜',
    rule_low:'小者胜',
    dice_tab:'🎲 摇骰子',
    coin_tab:'🪙 抛硬币',
    coin_btn:'🪙 抛硬币',
    coin_flipping:'抛硬币中...',
    coin_heads:'正面',
    coin_tails:'反面',
    coin_result_heads:['就是正面！','正面命中注定','宇宙选择了正面','这次正面胜出','正面，不犹豫了','正面带来好运','听正面的！','正面从不骗人'],
    coin_result_tails:['就是反面！','反面也自有道理','硬币选了反面','反面，天意如此','这次反面赢','反面带来的好运','听反面的！','反面从不说谎'],
    wheel_tab:'🎡 转盘',
    wheel_btn:'🎡 转一转',
    wheel_spinning:'转盘中...',
    wheel_result_msgs:['指针停在这里！','转盘替你决定了','命运转出了答案','今天就是这个了','别纠结，就是它！','转盘说：选它！','幸运轮选中的答案','相信转盘的选择']
  },
  en:{
    app_name:'Lucky Picker',
    roll_btn:'🎲 Roll!',
    battle_title:'Rolling...',
    winner_label:'WINNER',
    again:'Again',
    export_btn:'📸 Export',
    history_title:'📋 History',
    history_empty:'No records',
    history_incognito:'Incognito mode: no history saved',
    clear_history:'Clear All',
    exported:'Image exported! ✨',
    min_options:'Need 2+ options!',
    result_msgs:['The universe has spoken',"It's this one!",'Fate has chosen','Trust your luck','Don\'t argue with destiny','The dice say: this is it!','Lady Luck picked this','Best outcome, believe it!'],
    add_option:'+ Add Option',
    opt_placeholder_a:'Option A...',
    opt_placeholder_b:'Option B...',
    opt_placeholder:'Option {0}...',
    settings_title:'⚙️ Settings',
    settings_tip:'Settings',
    history_tip:'History',
    language:'Language',
    theme_label:'Dark Mode',
    incognito_label:'Incognito',
    rule_label:'Default Rule',
    rule_high:'Highest',
    rule_low:'Lowest',
    dice_tab:'🎲 Roll Dice',
    coin_tab:'🪙 Coin Flip',
    coin_btn:'🪙 Flip Coin',
    coin_flipping:'Flipping...',
    coin_heads:'Heads',
    coin_tails:'Tails',
    coin_result_heads:['Heads it is!','Heads was meant to be','The universe chose Heads','Heads wins this time','Heads, no more doubt','Good luck with Heads','Trust Heads!','Heads never lies'],
    coin_result_tails:['Tails never lies','Tails has its own logic','The coin chose Tails','Tails, it is fate','Tails takes this one','Good luck with Tails','Trust Tails!','Tails always speaks the truth'],
    wheel_tab:'🎡 Wheel',
    wheel_btn:'🎡 Spin!',
    wheel_spinning:'Spinning...',
    wheel_result_msgs:['The pointer stopped here!','The wheel has spoken','Fate spun this answer','This is the one today','No more doubt, go with it!','The wheel says: this!','Lady Luck spun to this','Trust the spin']
  }
};

// State
let lang='zh',theme='light',rule='high',incognito=false,isRolling=false,mode='dice';
let history=[],optionCount=2;

const $=s=>document.querySelector(s);
const $$=s=>document.querySelectorAll(s);
function t(k){return(I18N[lang]&&I18N[lang][k])||I18N.zh[k]||k;}

function applyI18n(){
  $('#app-name').textContent=t('app_name');
  $$('[data-i18n]').forEach(el=>{el.textContent=t(el.dataset.i18n);});
  $$('[data-i18n-placeholder]').forEach(el=>{el.placeholder=t(el.dataset.i18nPlaceholder);});
  $$('[data-i18n-title]').forEach(el=>{el.title=t(el.dataset.i18nTitle);});
  // Update tabs and go button
  $('#tab-dice').textContent=t('dice_tab');
  $('#tab-coin').textContent=t('coin_tab');
  $('#tab-wheel').textContent=t('wheel_tab');
  $('#btn-roll').textContent=t(mode==='coin'?'coin_btn':mode==='wheel'?'wheel_btn':'roll_btn');
}
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
  r.innerHTML=`<span class="badge" style="${BC[(optionCount-1)%8]}">${letter}</span><input class="inp" placeholder="${t('opt_placeholder').replace('{0}',letter)}" value="${text||''}"><button class="del">×</button>`;
  l.appendChild(r);bindRow(r);
}

function bindRow(row){
  row.querySelector('.del').onclick=()=>{row.remove();optionCount--;reindex();};
  row.querySelector('.inp').onkeydown=e=>{if(e.key==='Enter')doAction();};
}

function reindex(){
  $$('.row').forEach((row,i)=>{
    row.querySelector('.badge').style=BC[i%8];
    const del=row.querySelector('.del');if(del)del.style.visibility=i<2?'hidden':'visible';
  });
}

// ── Core Action ──
function doAction(){
  if(isRolling)return;
  const opts=getOptions();
  if(opts.length<2){showToast(t('min_options'));return;}
  if(mode==='coin')doCoinFlip(opts);
  else if(mode==='wheel')doWheelSpin(opts);
  else doRoll(opts);
}

function doRoll(opts){
  isRolling=true;
  $('#btn-roll').classList.add('rolling');

  const rolls=opts.map(()=>Math.floor(Math.random()*6)+1);
  const wi=rule==='high'?rolls.indexOf(Math.max(...rolls)):rolls.indexOf(Math.min(...rolls));

  $('#input-section').classList.add('hidden');
  $('#result-section').classList.add('hidden');
  $('#battle-section').classList.remove('hidden');
  $('#footer-lucky').classList.add('hidden');
  $('#battle-section .battle-tip').textContent=t('battle_title');

  buildStage(opts);
  animateRoll(opts,rolls,wi);
}

function buildStage(opts){
  const st=$('#dice-stage');st.innerHTML='';
  if(mode==='coin'){
    st.classList.add('coin-stage');
    const coin=document.createElement('div');coin.className='coin3d';
    coin.innerHTML=`
      <div class="coin-face coin-heads">
        <span class="coin-icon">🪙</span>
        <span class="coin-opt">${(opts[0]||'').length>6?(opts[0]||'').slice(0,6)+'..':(opts[0]||'')}</span>
      </div>
      <div class="coin-face coin-tails">
        <span class="coin-icon">💰</span>
        <span class="coin-opt">${(opts[1]||'').length>6?(opts[1]||'').slice(0,6)+'..':(opts[1]||'')}</span>
      </div>`;
    coin.style.transform='rotateX('+(Math.random()*360)+'deg)';
    st.appendChild(coin);
  }else if(mode==='wheel'){
    st.classList.remove('coin-stage');
    st.classList.add('wheel-stage');
    const wrap=document.createElement('div');wrap.className='wheel-wrap';
    wrap.innerHTML=`
      <div class="wheel-outer"></div>
      <div class="wheel-pointer"></div>
      <canvas class="wheel-canvas" id="wheel-canvas" width="360" height="360"></canvas>`;
    st.appendChild(wrap);
    drawWheel($('#wheel-canvas'),opts);
  }else{
    st.classList.remove('coin-stage','wheel-stage');
  opts.forEach(o=>{
    const u=document.createElement('div');u.className='dice-unit';
    const dc=createDice();
    setDiceRaw(dc,Math.random()*360,Math.random()*360);
    u.appendChild(dc);
    const lb=document.createElement('div');lb.className='ulabel';
    lb.textContent=o.length>5?o.slice(0,5)+'..':o;
    u.appendChild(lb);
    st.appendChild(u);
  });
  }
}

// ── Coin Flip ──
function doCoinFlip(opts){
  isRolling=true;
  $('#btn-roll').classList.add('rolling');
  const wi=Math.random()<0.5?0:1;
  $('#input-section').classList.add('hidden');
  $('#result-section').classList.add('hidden');
  $('#battle-section').classList.remove('hidden');
  $('#footer-lucky').classList.add('hidden');
  $('#battle-section .battle-tip').textContent=t('coin_flipping');
  buildStage(opts);
  animateCoin(opts,wi);
}

function animateCoin(opts,wi){
  const coin=$('.coin3d'),DUR=2200,t0=performance.now();
  const targetXRot=wi===0?0:180;
  let finalRot;

  function tick(now){
    const el=now-t0,p=Math.min(el/DUR,1);
    $('#progress-bar').style.width=(p*100)+'%';

    let rx;
    if(p<0.8){
      rx=el/1000*900;
    }else{
      const eased=(p-0.8)/0.2;
      const extra=Math.ceil((el/1000*900)/360)*360;
      rx=targetXRot+(1-Math.pow(1-eased,3))*360+extra*(1-eased);
    }
    coin.style.transform='rotateX('+rx+'deg)';

    if(p>=1){
      coin.style.transform='rotateX('+targetXRot+'deg)';
      coin.style.transition='transform .45s cubic-bezier(.22,1.36,.36,1)';
      setTimeout(()=>showResult(opts,[],wi),750);
    }else{
      coin.style.transition='none';
      requestAnimationFrame(tick);
    }
  }
  requestAnimationFrame(tick);
}

// ── Wheel Spin ──
const WHEEL_COLORS=[
  {main:'#E88BA8',light:'#F5CDD8',dark:'#D46A8A'},
  {main:'#6BAFE0',light:'#A8D4F5',dark:'#4A8EC8'},
  {main:'#7BC89E',light:'#B2E4CC',dark:'#5AA87A'},
  {main:'#E8BA7A',light:'#F2D8AD',dark:'#D49A50'},
  {main:'#C99AE8',light:'#E0CAFA',dark:'#B078D6'},
  {main:'#D4C96A',light:'#EDE4A5',dark:'#BEB04E'},
  {main:'#7AB0DD',light:'#B0D0F0',dark:'#5890BF'},
  {main:'#F4A5A5',light:'#FACACA',dark:'#E07878'}
];

function drawWheel(canvas,opts){
  if(!canvas)return;
  const dpr=window.devicePixelRatio||1;
  const cssSize=200,pxSize=Math.round(cssSize*dpr);
  const cx=pxSize/2,cy=pxSize/2,r=(pxSize/2)-8;

  // Set actual canvas size for crisp rendering
  if(canvas.width!==pxSize||canvas.height!==pxSize){
    canvas.width=pxSize;canvas.height=pxSize;
    canvas.style.width=cssSize+'px';canvas.style.height=cssSize+'px';
  }
  const ctx=canvas.getContext('2d');
  ctx.clearRect(0,0,pxSize,pxSize);

  const N=opts.length,seg=2*Math.PI/N;
  // Adaptive text radius: fewer segments → smaller radius to avoid edge clipping
  const textR=r*(N<=3?0.52:N<=5?0.58:0.63);
  const fontSize=N<=3?Math.round(22*dpr):N<=5?Math.round(19*dpr):Math.round(16*dpr);

  opts.forEach((o,i)=>{
    const start=-Math.PI/2+i*seg,end=start+seg,mid=start+seg/2;
    const col=WHEEL_COLORS[i%WHEEL_COLORS.length];

    // ── Segment gradient fill (radial for depth) ──
    ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,r,start,end);ctx.closePath();
    const sg=ctx.createRadialGradient(cx,cy,r*0.15,cx,cy,r);
    sg.addColorStop(0,col.light);sg.addColorStop(0.55,col.main);sg.addColorStop(1,col.dark);
    ctx.fillStyle=sg;ctx.fill();

    // Separator line (subtle inner highlight)
    ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+r*Math.cos(start),cy+r*Math.sin(start));
    ctx.strokeStyle='rgba(255,255,255,.45)';ctx.lineWidth=Math.max(2,dpr*1.8);ctx.stroke();
    ctx.strokeStyle='rgba(0,0,0,.08)';ctx.lineWidth=Math.max(1,dpr*0.8);ctx.stroke();

    // ── Text label ──
    ctx.save();
    ctx.translate(cx+textR*Math.cos(mid),cy+textR*Math.sin(mid));
    ctx.rotate(mid+Math.PI/2);

    const label=o.length>6?o.slice(0,6)+'..':o;
    ctx.font=`bold ${fontSize}px -apple-system,"Segoe UI",sans-serif`;
    ctx.textAlign='center';ctx.textBaseline='middle';
    // Strong shadow for readability on any color
    ctx.shadowColor='rgba(0,0,0,.38)';
    ctx.shadowBlur=Math.round(dpr*5);
    ctx.shadowOffsetX=0;ctx.shadowOffsetY=Math.round(dpr*1);
    ctx.fillStyle='#fff';
    ctx.fillText(label,0,0);

    // Subtle stroke outline for extra clarity
    ctx.shadowColor='transparent';ctx.shadowBlur=0;
    ctx.strokeStyle='rgba(0,0,0,.18)';
    ctx.lineWidth=Math.round(dpr*0.8);
    ctx.strokeText(label,0,0);
    ctx.restore();
  });

  // ── Center hub (premium metallic) ──
  const hubR=Math.round(pxSize*0.09);
  ctx.beginPath();ctx.arc(cx,cy,hubR,0,2*Math.PI);
  const hg=ctx.createRadialGradient(cx-hubR*.25,cy-hubR*.25,2,cx,cy,hubR);
  hg.addColorStop(0,'#fff');hg.addColorStop(0.45,'#F4F0FA');
  hg.addColorStop(0.82,'#DDD6EA');hg.addColorStop(1,'#C8BFD8');
  ctx.fillStyle=hg;ctx.fill();

  // Hub inner ring
  ctx.beginPath();ctx.arc(cx,cy,hubR,0,2*Math.PI);
  ctx.strokeStyle='rgba(255,255,255,.55)';ctx.lineWidth=Math.round(dpr*2);ctx.stroke();
  // Hub outer ring (thin accent)
  ctx.beginPath();ctx.arc(cx,cy,hubR+Math.round(dpr*3),0,2*Math.PI);
  ctx.strokeStyle='rgba(124,111,190,.22)';ctx.lineWidth=Math.round(dpr*1.5);ctx.stroke();

  // Hub center dot (subtle glow)
  ctx.beginPath();ctx.arc(cx,cy,hubR*0.35,0,2*Math.PI);
  ctx.fillStyle='rgba(124,111,190,.15)';ctx.fill();

  // ── Outer decorative ring ──
  ctx.beginPath();ctx.arc(cx,cy,r+Math.round(dpr*4),0,2*Math.PI);
  ctx.strokeStyle='rgba(124,111,190,.14)';ctx.lineWidth=Math.round(dpr*2.5);ctx.stroke();

  // Tick marks around outer ring
  const tickCount=N*4;
  for(let t=0;t<tickCount;t++){
    const ang=-Math.PI/2+(t/tickCount)*2*Math.PI;
    const isMajor=t%N===0;
    const tInner=r+Math.round(dpr*(isMajor?5:7));
    const tOuter=r+Math.round(dpr*(isMajor?11:9));
    ctx.beginPath();
    ctx.moveTo(cx+tInner*Math.cos(ang),cy+tInner*Math.sin(ang));
    ctx.lineTo(cx+tOuter*Math.cos(ang),cy+tOuter*Math.sin(ang));
    ctx.strokeStyle=isMajor?'rgba(124,111,190,.35)':'rgba(124,111,190,.18)';
    ctx.lineWidth=Math.round(dpr*(isMajor?1.8:1));ctx.stroke();
  }

  // Thin outer border
  ctx.beginPath();ctx.arc(cx,cy,r,0,2*Math.PI);
  ctx.strokeStyle='rgba(255,255,255,.28)';ctx.lineWidth=Math.round(dpr*2.5);ctx.stroke();
}

function doWheelSpin(opts){
  isRolling=true;
  $('#btn-roll').classList.add('rolling');
  const wi=Math.floor(Math.random()*opts.length);
  $('#input-section').classList.add('hidden');
  $('#result-section').classList.add('hidden');
  $('#battle-section').classList.remove('hidden');
  $('#footer-lucky').classList.add('hidden');
  $('#battle-section .battle-tip').textContent=t('wheel_spinning');
  buildStage(opts);
  animateWheel(opts,wi);
}

function animateWheel(opts,wi){
  const canvas=$('#wheel-canvas'),DUR=2800;
  const N=opts.length,segDeg=360/N;
  const targetAngle=wi*segDeg+segDeg/2;
  const offset=(Math.random()*0.8-0.4)*segDeg;
  const finalAngle=targetAngle+offset;
  const fullSpins=(5+Math.floor(Math.random()*3))*360;
  const totalRot=fullSpins+finalAngle;

  // CSS transition for ultra-smooth spin
  canvas.style.transition='none';
  canvas.style.transform='rotate(0deg)';
  canvas.offsetHeight;
  canvas.style.transition='transform '+DUR+'ms cubic-bezier(.12,.65,.25,1)';
  canvas.style.transform='rotate('+totalRot+'deg)';

  const t0=performance.now();
  function tick(now){
    const p=Math.min((now-t0)/DUR,1);
    $('#progress-bar').style.width=(p*100)+'%';
    if(p<1)requestAnimationFrame(tick);
    else setTimeout(()=>showResult(opts,[],wi),400);
  }
  requestAnimationFrame(tick);
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
        ox:(Math.random()-0.5)*6,
        oy:(Math.random()-0.5)*5
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

  const isCoin=mode==='coin';
  const isWheel=mode==='wheel';
  let msgKey;
  if(isCoin)msgKey=wi===0?'coin_result_heads':'coin_result_tails';
  else if(isWheel)msgKey='wheel_result_msgs';
  else msgKey='result_msgs';
  const msgs=I18N[lang][msgKey];
  $('#result-winner').textContent=opts[wi];
  $('#result-msg').textContent=msgs[Math.floor(Math.random()*msgs.length)];

  // Hide generic winner-card & dice-visual for coin/wheel modes
  $('#result-section').classList.toggle('coin-mode',isCoin);
  $('#result-section').classList.toggle('wheel-mode',isWheel);

  const dv=$('#result-dice-visual');dv.innerHTML='';

  if(isCoin){
    // Coin result: big centered coin + option name + side
    const side=wi===0?'heads':'tails';
    const sideText=wi===0?t('coin_heads'):t('coin_tails');
    const icon=wi===0?'🪙':'💰';
    dv.innerHTML=`
      <div class="cr-wrap">
        <div class="cr-coin ${side}">
          <span class="cr-icon">${icon}</span>
          <span class="cr-side">${sideText}</span>
        </div>
        <div class="cr-info">
          <span class="cr-name">${opts[wi]}</span>
          <span class="cr-sep">·</span>
          <span class="cr-side-text">${sideText}</span>
        </div>
      </div>`;
  }else if(mode==='wheel'){
    dv.innerHTML=`<div class="wr-wrap"><div class="wr-name">${opts[wi]}</div></div>`;
  }else{
  opts.forEach((o,i)=>{
    const unit=document.createElement('div');
    unit.className='dv-unit'+(i===wi?' win':'');
    const die=document.createElement('div');
    die.className='dv-die'+(i===wi?' win':' lose');
    const num=document.createElement('div');
    num.className='dv-num';num.textContent=rolls[i];
    die.appendChild(num);
    const lb=document.createElement('div');
    lb.className='dv-label';
    lb.textContent=o.length>6?o.slice(0,6)+'..':o;
    unit.appendChild(die);unit.appendChild(lb);
    dv.appendChild(unit);
    if(i<opts.length-1){
      const vs=document.createElement('div');
      vs.className='dv-vs';vs.textContent='VS';dv.appendChild(vs);
    }
  });

  }
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
function saveHist(o,r,w){history.unshift({id:Date.now(),type:mode,options:o,rolls:r,totals:r,winnerIdx:w,rule,createdAt:new Date().toISOString()});if(history.length>100)history.pop();chrome.storage.local.set({luckypick_history:history});}
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
    const el=document.createElement('div');el.className='hi';el.style.cursor='pointer';
    const isCoinEntry=rec.type==='coin';
    const isWheelEntry=rec.type==='wheel';
    const histIcon=isCoinEntry?'🪙':isWheelEntry?'🎡':'🎲';
    const detailLine=isCoinEntry
      ?`${rec.options[rec.winnerIdx]} (${rec.winnerIdx===0?t('coin_heads'):t('coin_tails')})`
      :isWheelEntry
      ?rec.options.join(' · ')
      :rec.options.map((o,j)=>ic[rec.totals[j]]+o).join('　');
    el.innerHTML=`<div class="hw">${histIcon} ${rec.options[rec.winnerIdx]}</div><div class="ho">${detailLine}</div><div class="hm"><span>${new Date(rec.createdAt).toLocaleDateString().slice(5)} ${new Date(rec.createdAt).toTimeString().slice(0,5)}</span><button class="hd-b" data-i="${i}">🗑</button></div>`;
    el.addEventListener('click',()=>{
      closeAllPanels();
      const ol=$('#options-list');ol.innerHTML='';optionCount=0;
      rec.options.forEach(o=>{
        optionCount++;
        const letter=String.fromCharCode(64+optionCount);
        const r=document.createElement('div');r.className='row';
        r.innerHTML=`<span class="badge" style="${BC[(optionCount-1)%8]}">${letter}</span><input class="inp" placeholder="${t('opt_placeholder').replace('{0}',letter)}" value="${o}"><button class="del">×</button>`;
        ol.appendChild(r);bindRow(r);
      });
      $('#result-section').classList.add('hidden');
      $('#battle-section').classList.add('hidden');
      $('#input-section').classList.remove('hidden');
      $('#footer-lucky').classList.remove('hidden');
      if(isCoinEntry&&mode!=='coin')switchMode('coin');
      if(isWheelEntry&&mode!=='wheel')switchMode('wheel');
      doAction();
    });
    l.appendChild(el);
  });
  l.querySelectorAll('.hd-b').forEach(b=>{b.onclick=(e)=>{e.stopPropagation();history.splice(+b.dataset.i,1);chrome.storage.local.set({luckypick_history:history});renderH();};});
}
function clearH(){if(confirm(lang==='zh'?'清空所有历史？':'Clear all?')){history=[];chrome.storage.local.set({luckypick_history:[]});renderH();}}

// ── Export as Image ──
function exportAsImage(){
  const winnerName=$('#result-winner').textContent;
  const msg=$('#result-msg').textContent;
  const isCoinExport=mode==='coin';
  const isWheelExport=mode==='wheel';
  const diceData=isCoinExport
    ?[t('coin_heads'),t('coin_tails')]
    :isWheelExport
    ?Array.from($$('#result-dice-visual .wr-info')).map(()=>'')
    :Array.from($$('#result-dice-visual .dv-unit')).map(u=>{
      const n=u.querySelector('.dv-num').textContent;
      const lb=u.querySelector('.dv-label').textContent;
      return `${lb}(${n})`;
    });

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
  const midText=isCoinExport?('🪙 '+diceData[0]+' / '+diceData[1]):isWheelExport?'🎡 '+t('wheel_tab'):diceData.join('  VS  ');
  ctx.fillText(midText,W/2,H/2+24);

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
    ?['适合尝试新事物','相信直觉','运气在勇敢者这边','今天适合做决定','跟着心走就对了','幸运偏爱行动派','适合和朋友聚会','放轻松好事即将发生','别想太多，去做就对了','今天可能会遇到惊喜','保持微笑，好运自来','勇敢迈出第一步','顺其自然，水到渠成','今天的努力是明天的运气','心存善意，必有回响','偶尔任性一下没关系','新的一天，新的可能','好事多磨，耐心等待','做自己，不需要理由','阳光总在风雨后','每一步都算数','今天比昨天更靠近目标','停下来，深呼吸，再出发','运气是你自己的选择','偶尔迷茫也没关系','拥抱不确定性','今天的你特别幸运','大声说出你的想法','小确幸就在身边','别怕犯错，试了才知道','换个角度看世界','你是自己的锦鲤','今天出门会有好事','对陌生人微笑试试','去做那件一直想做的事','相信过程','简单的事情重复做','心态决定运气','允许一切发生','今天的烦恼明天就忘了','别比较，你是独一无二的','好运正在派送中','享受当下这一刻','你的坚持终将美好','给自己一个小奖励','有人正在偷偷喜欢你','万事开头难，后面也不难','今天是个好日子','保持好奇心','你已经很棒了']
    :['Try something new','Trust your gut','Fortune favors the bold','Great day to decide','Follow your heart','Luck loves action','Hang with friends','Relax, good things coming','Don\'t overthink, just do it','A surprise may await today','Keep smiling, luck follows','Take that first brave step','Let it flow, everything clicks','Today\'s effort is tomorrow\'s luck','Kindness always echoes back','It\'s okay to be spontaneous','New day, new possibilities','Good things take time','Be yourself, no reasons needed','Sunshine after the storm','Every step counts','Closer to your goal than yesterday','Pause, breathe, and continue','You create your own luck','It\'s okay to feel lost sometimes','Embrace the unknown','You are extra lucky today','Speak your mind','Tiny joys are everywhere','Don\'t fear mistakes, just try','See things from a new angle','You are your own lucky charm','Something good awaits you outside','Try smiling at a stranger','Do the thing you\'ve been putting off','Trust the process','Simple things, done consistently','Your mindset shapes your luck','Let everything unfold naturally','Today\'s worries fade tomorrow','Don\'t compare, you are unique','Good luck is on its way','Enjoy this very moment','Your persistence will bloom','Treat yourself to something nice','Someone out there likes you','The hardest part is starting','Today is a good day','Stay curious','You are already amazing'];
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
    lang=s.lang||'zh';theme=s.theme||'light';rule=s.rule||'high';incognito=!!s.incognito;mode=s.mode||'dice';
    history=res.luckypick_history||[];
    applyTheme();
    applyI18n();
    updateLucky();if(cb)cb();
  });
}
function saveSettings(){chrome.storage.local.set({luckypick_settings:{lang,theme,rule,incognito,mode}});}

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

// ── Mode Switch ──
function switchMode(m){
  if(isRolling)return;
  mode=m;
  $$('.mt-btn').forEach(b=>b.classList.toggle('active',b.dataset.mode===mode));
  const isCoin=mode==='coin';
  $('#btn-add-option').classList.toggle('hidden',isCoin);
  // Coin mode: trim to 2 options
  if(isCoin&&optionCount>2){while(optionCount>2){$$('.row')[2].remove();optionCount--;}reindex();}
  // Update go button
  const btnKey=mode==='coin'?'coin_btn':mode==='wheel'?'wheel_btn':'roll_btn';
  $('#btn-roll').textContent=t(btnKey);
  // Reset UI
  $('#battle-section').classList.add('hidden');
  $('#result-section').classList.add('hidden');
  $('#input-section').classList.remove('hidden');
  $('#footer-lucky').classList.remove('hidden');
  saveSettings();
}

// ── Init ──
function init(){
  loadSettings(()=>{
    $$('.row').forEach(bindRow);

    $('#btn-add-option').onclick=()=>addRow();

    // Mode tabs
    $$('.mt-btn').forEach(b=>{b.classList.toggle('active',b.dataset.mode===mode);});
    const isCoinInit=mode==='coin';
    const isWheelInit=mode==='wheel';
    $('#btn-add-option').classList.toggle('hidden',isCoinInit);
    if(isCoinInit&&optionCount>2){while(optionCount>2){$$('.row')[2].remove();optionCount--;}reindex();}
    const btnInitKey=isCoinInit?'coin_btn':isWheelInit?'wheel_btn':'roll_btn';
    $('#btn-roll').textContent=t(btnInitKey);
    $('#tab-dice').onclick=()=>switchMode('dice');
    $('#tab-coin').onclick=()=>switchMode('coin');
    $('#tab-wheel').onclick=()=>switchMode('wheel');

    $$('#set-rule .seg-btn').forEach(btn=>{
      btn.onclick=()=>{
        rule=btn.dataset.v;
        $$('#set-rule .seg-btn').forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        saveSettings();
      };
    });

    $('#btn-roll').onclick=doAction;

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
      applyI18n();updateLucky();saveSettings();
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
      if(e.key==='Enter'&&e.ctrlKey&&!isRolling&&!$('#input-section').classList.contains('hidden')){
        e.preventDefault();doAction();return;
      }
      if(e.key==='Enter'&&!isRolling&&!$('#input-section').classList.contains('hidden')&&document.activeElement.tagName!=='INPUT')
        doAction();
    });
  });
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);
else init();

})();
