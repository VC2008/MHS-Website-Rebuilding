// Render 12 months as horizontal sliding wide cards with correct month lengths (handles 28/29/30/31)
(function(){
  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const monthsStrip = document.getElementById('monthsStrip');
  const upcomingEl = document.getElementById('upcomingEvents');
  const yearLabel = document.getElementById('yearLabel');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const todayBtn = document.getElementById('todayBtn');

  const now = new Date();
  let activeYear = now.getFullYear();

  // sample events across months (for demo)
  const sampleEvents = [
    { date: new Date(activeYear, 0, 5), title: 'New Term Begins' },
    { date: new Date(activeYear, 1, 14), title: 'Valentine Event' },
    { date: new Date(activeYear, 8, 22), title: 'Parent-Teacher Conf.' },
    { date: new Date(activeYear, 10, 25), title: 'Thanksgiving Break' },
  ];

  function daysInMonth(y,m){ return new Date(y, m+1, 0).getDate(); }
  function isLeapYear(y){ return (y%4===0 && y%100!==0) || (y%400===0); }
  function isSameDay(a,b){ return a && b && a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate(); }

  function createMonthCard(year, monthIndex){
    const card = document.createElement('article');
    card.className = 'month-card';

    const header = document.createElement('div'); header.className = 'month-header';
    const title = document.createElement('div'); title.className = 'month-title'; title.textContent = `${monthNames[monthIndex]} ${year}`;
    const info = document.createElement('div'); info.className = 'small text-muted';
    info.textContent = `${daysInMonth(year, monthIndex)} days`;
    header.appendChild(title); header.appendChild(info);

    const weekdays = document.createElement('div'); weekdays.className = 'weekdays';
    ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].forEach(d=>{ const w = document.createElement('div'); w.textContent = d; weekdays.appendChild(w); });

    const daysWrap = document.createElement('div'); daysWrap.className = 'days';

    const firstDay = new Date(year, monthIndex, 1).getDay();
    const total = daysInMonth(year, monthIndex);

    // previous month's trailing days
    for(let i=0;i<firstDay;i++){
      const d = new Date(year, monthIndex, i - firstDay + 1);
      const el = buildDayCell(d, true);
      daysWrap.appendChild(el);
    }

    // current month days
    for(let d=1; d<=total; d++){
      const dateObj = new Date(year, monthIndex, d);
      const el = buildDayCell(dateObj, false);
      daysWrap.appendChild(el);
    }

    // trailing days to fill last row
    const trailing = (7 - (daysWrap.children.length % 7)) % 7;
    for(let i=1;i<=trailing;i++){
      const d = new Date(year, monthIndex, total + i);
      const el = buildDayCell(d, true);
      daysWrap.appendChild(el);
    }

    card.appendChild(header);
    card.appendChild(weekdays);
    card.appendChild(daysWrap);
    return card;
  }

  function buildDayCell(dateObj, otherMonth){
    const el = document.createElement('div');
    el.className = 'day' + (otherMonth? ' other-month' : '');
    const dateEl = document.createElement('div'); dateEl.className = 'date'; dateEl.textContent = dateObj.getDate();
    el.appendChild(dateEl);

    // mark today
    if(isSameDay(dateObj, now)){
      el.style.background = 'linear-gradient(90deg, rgba(6,182,212,0.06), rgba(245,158,11,0.02))';
      el.classList.add('today');
    }

    // show sample events if any
    const ev = sampleEvents.find(e=> isSameDay(e.date, dateObj));
    if(ev){
      el.classList.add('has-event');
      const p = document.createElement('div'); p.className = 'event';
      p.innerHTML = `<span class="event-dot" style="background:${'#f59e0b'}"></span>${ev.title}`;
      el.appendChild(p);
    }

    return el;
  }

  function renderYear(year){
    monthsStrip.innerHTML = '';
    yearLabel.textContent = year;
    for(let m=0;m<12;m++){
      const card = createMonthCard(year, m);
      monthsStrip.appendChild(card);
    }

    // after inserting, ensure we can scroll to current month
    setTimeout(()=> scrollToMonth(now.getMonth()), 50);
    renderUpcoming(year);
  }

  function renderUpcoming(year){
    upcomingEl.innerHTML = '';
    const upcoming = sampleEvents.filter(e => e.date.getFullYear() === year).slice(0,6);
    if(!upcoming.length){ upcomingEl.innerHTML = '<p class="text-muted">No upcoming events.</p>'; return; }
    upcoming.forEach(ev=>{
      const div = document.createElement('div'); div.className = 'mb-2';
      div.innerHTML = `<strong>${ev.title}</strong><div class="text-muted small">${ev.date.toDateString()}</div>`;
      upcomingEl.appendChild(div);
    });
  }

  function scrollToMonth(index){
    const cards = monthsStrip.querySelectorAll('.month-card');
    if(!cards.length) return;
    const target = cards[index];
    if(!target) return;
    monthsStrip.scrollTo({ left: target.offsetLeft - 12, behavior: 'smooth' });
  }

  // prev/next scroll by one card
  prevBtn.addEventListener('click', ()=>{
    const cards = monthsStrip.querySelectorAll('.month-card');
    if(!cards.length) return;
    // find leftmost fully visible card
    const left = monthsStrip.scrollLeft;
    let idx = 0;
    for(let i=0;i<cards.length;i++){ if(cards[i].offsetLeft - 1 >= left){ idx = Math.max(0,i-1); break; } }
    scrollToMonth(Math.max(0, idx-1));
  });

  nextBtn.addEventListener('click', ()=>{
    const cards = monthsStrip.querySelectorAll('.month-card');
    if(!cards.length) return;
    const left = monthsStrip.scrollLeft;
    for(let i=0;i<cards.length;i++){ if(cards[i].offsetLeft - 1 > left){ scrollToMonth(i); break; } }
  });

  todayBtn.addEventListener('click', ()=>{ renderYear(now.getFullYear()); scrollToMonth(now.getMonth()); });

  // initial
  document.addEventListener('DOMContentLoaded', ()=> renderYear(activeYear));

})();
