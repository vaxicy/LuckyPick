function runSlot(options) {
    const winnerIdx = Math.floor(Math.random() * options.length);
    const result = {
      id: Date.now(),
      mode: 'slot',
      options,
      winnerIndex: winnerIdx,
      winner: options[winnerIdx],
      isTie: false,
      createdAt: new Date().toISOString()
    };
    buildSlotStage(options);
    animateSlot(winnerIdx, options.length, () => finishResult(result));
  }

  function buildSlotStage(options) {
    const stage = $('#dice-stage');
    if (!stage) return;
    stage.className = 'slot-stage';
    stage.innerHTML = `
      <div class="slot-window" id="slot-window">
        <div class="slot-reel" id="slot-reel"></div>
      </div>
    `;
    const reel = $('#slot-reel');
    if (!reel) return;
    options.forEach((option) => {
      const item = document.createElement('div');
      item.className = 'slot-item';
      item.textContent = option;
      reel.appendChild(item);
    });
  }

  function animateSlot(winnerIdx, total, done) {
    const reel = $('#slot-reel');
    const duration = animDuration(1100);
    const start = performance.now();
    const itemHeight = 40;
    const extraSpins = 5;
    const finalOffset = (extraSpins * total + winnerIdx) * itemHeight;

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      if ($('#progress-bar')) $('#progress-bar').style.width = `${progress * 100}%`;
      if (reel) {
        const currentOffset = finalOffset * eased;
        reel.style.transform = `translateY(-${currentOffset}px)`;
      }
      if (progress < 1) requestAnimationFrame(tick);
      else setTimeout(done, 220);
    }

    requestAnimationFrame(tick);
  }
    