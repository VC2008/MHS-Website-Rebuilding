// Render 12 months as horizontal sliding wide cards with correct month lengths (handles 28/29/30/31)
(function(){
  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const monthsStrip = document.getElementById('monthsStrip');
  const yearLabel = document.getElementById('yearLabel');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const todayBtn = document.getElementById('todayBtn');
  const addEventForm = document.getElementById('addEventForm');
  const eventNameInput = document.getElementById('eventName');
  const eventDateInput = document.getElementById('eventDate');

  const now = new Date();
  let activeYear = now.getFullYear();
  
  // Initialize with empty array and load from localStorage
  let userEvents = JSON.parse(localStorage.getItem('userEvents')) || [];


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

    // show user events if any
    const ev = userEvents.find(e=> isSameDay(new Date(e.date), dateObj));
    if(ev){
      el.classList.add('has-event');
      const p = document.createElement('div'); p.className = 'event';
      const eventText = document.createElement('span');
      eventText.innerHTML = `<span class="event-dot" style="background:${'#f59e0b'}"></span>${ev.name}`;
      
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'event-delete-btn';
      deleteBtn.textContent = '×';
      deleteBtn.title = 'Delete event';
      deleteBtn.type = 'button';
      deleteBtn.style.cssText = 'background:none;border:none;color:#dc2626;cursor:pointer;font-size:18px;padding:0;margin-left:4px;font-weight:bold;';
      deleteBtn.addEventListener('click', (e)=>{
        e.stopPropagation();
        if(confirm(`Delete event "${ev.name}"?`)){
          userEvents = userEvents.filter(event => event.name !== ev.name || event.date !== ev.date);
          localStorage.setItem('userEvents', JSON.stringify(userEvents));
          renderUserEvents();
          renderYear(activeYear);
        }
      });
      
      p.appendChild(eventText);
      p.appendChild(deleteBtn);
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
  
  // Handle add event form submission
  addEventForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const eventName = eventNameInput.value.trim();
    const eventDate = eventDateInput.value;
    
    if(eventName && eventDate){
      userEvents.push({
        name: eventName,
        date: eventDate
      });
      localStorage.setItem('userEvents', JSON.stringify(userEvents));
      eventNameInput.value = '';
      eventDateInput.value = '';
      renderYear(activeYear);
    }
  });

  // initial
  document.addEventListener('DOMContentLoaded', ()=>{
    renderYear(activeYear);
  });

})();

//Clubs page vue content
