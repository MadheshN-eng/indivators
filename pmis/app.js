// Mobile nav
const navToggle = document.querySelector('.nav-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const primary = document.querySelector('nav.primary');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', String(open));
    if (open) {
      mobileMenu.innerHTML = primary.innerHTML;
    }
  });
}

// Number counters
function animateCount(el) {
  const target = Number(el.getAttribute('data-count') || '0');
  const duration = 900; // ms
  const start = performance.now();
  function step(now){
    const p = Math.min(1, (now - start)/duration);
    const val = Math.floor(p * target);
    el.textContent = val.toLocaleString('en-IN');
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.num[data-count]').forEach(animateCount);
});

// Openings data
const DATA = [
  { title:'Junior Electrical Intern', org:'Bharat Power Co.', district:'Chennai', sector:'Electrical', duration:12, stipend:5000, tags:['12 months','On-site','CSR'] },
  { title:'Data Entry Assistant', org:'DigitServe Pvt Ltd', district:'Bengaluru Urban', sector:'IT / Software', duration:6, stipend:5000, tags:['6 months','Remote'] },
  { title:'Ward Support Trainee', org:'CityCare Hospitals', district:'Hyderabad', sector:'Healthcare', duration:3, stipend:5000, tags:['3 months','On-site'] },
  { title:'Assembly Line Intern', org:'Shakti Manufacturing', district:'Mumbai Suburban', sector:'Manufacturing', duration:12, stipend:5000, tags:['12 months','On-site'] },
  { title:'Accounts Support Intern', org:'Lakshmi Finance', district:'New Delhi', sector:'Finance', duration:6, stipend:5000, tags:['6 months','Hybrid'] }
];

const cardsEl = document.getElementById('cards');
const emptyEl = document.getElementById('empty');

function renderCards(list){
  if (!cardsEl) return;
  if (!list.length){
    emptyEl.hidden = false;
    cardsEl.innerHTML = '';
    return;
  }
  emptyEl.hidden = true;
  cardsEl.innerHTML = list.map((j,idx)=>`
    <article class="card job" tabindex="0" aria-label="${j.title} at ${j.org}">
      <div>
        <h4 style="margin:0;font-size:x-large">${j.title}</h4>
        <p class="meta">${j.org} • ${j.district} • ${j.sector}</p>
        <div class="badge-line">
          ${j.tags.map(t=>`<span class="tag">${t}</span>`).join('')}
          <span class="tag">₹${j.stipend.toLocaleString('en-IN')}/month</span>
        </div>
        <div style="margin-top:10px">
          <button class="btn accent" data-apply="${idx}">Apply</button>
          <button class="btn" data-save="${idx}">Save</button>
        </div>
      </div>
    </article>
  `).join('');
}

function getFilters(){
  const district = document.getElementById('district').value;
  const sector = document.getElementById('sector').value;
  const duration = document.getElementById('duration').value;
  return { district, sector, duration: duration ? Number(duration): null };
}

function applyFilters(){
  const f = getFilters();
  const q = document.getElementById('q').value.trim().toLowerCase();
  const list = DATA.filter(j => {
    if (f.district && j.district !== f.district) return false;
    if (f.sector && j.sector !== f.sector) return false;
    if (f.duration && j.duration !== f.duration) return false;
    if (q && !(j.title.toLowerCase().includes(q) || j.org.toLowerCase().includes(q) || j.district.toLowerCase().includes(q))) return false;
    return true;
  });
  renderCards(list);
}

document.getElementById('applyFilters')?.addEventListener('click', applyFilters);
document.getElementById('searchBtn')?.addEventListener('click', applyFilters);
document.getElementById('q')?.addEventListener('keydown', (e)=>{ if(e.key==='Enter') applyFilters(); });

// Search suggestions
const suggest = document.getElementById('suggest');
const q = document.getElementById('q');
const SAMPLES = ['Data entry', 'Electrical', 'Chennai', 'CSR'];
if (q && suggest){
  q.addEventListener('focus', ()=>{
    suggest.style.display = 'block';
    suggest.innerHTML = SAMPLES.map(s=>`<button type="button" role="option">${s}</button>`).join('');
  });
  q.addEventListener('blur', ()=> setTimeout(()=>{suggest.style.display='none'}, 150));
  suggest.addEventListener('click', (e)=>{
    if (e.target.tagName === 'BUTTON'){
      q.value = e.target.textContent;
      applyFilters();
      q.focus();
    }
  });
}

// Initial render
renderCards(DATA);

// Form 
const form = document.getElementById('contactForm');
const statusEl = document.getElementById('formStatus');
form?.addEventListener('submit', (e)=>{
  e.preventDefault();
  const fd = new FormData(form);
  const name = fd.get('name');
  statusEl.textContent = `Thanks, ${name}. Your message has been recorded (demo).`;
  form.reset();
});

//Login page
const loginForm = document.getElementById('loginForm');
const loginStatus = document.getElementById('loginStatus');

loginForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const fd = new FormData(loginForm);
  const email = fd.get('email');
  const pass = fd.get('password');
  if (email && pass) {
    loginStatus.textContent = `Welcome back, ${email}!`;
    loginForm.reset();
  } else {
    loginStatus.textContent = "Please enter valid details.";
  }

  // Redirect to index.html after login
  onclick = function() { window.location.href = "index.html"; }
});

//Redirect to index.html after creating profile
document.getElementById('profilesubmit').addEventListener("click", function(event) {
  window.location.href = "index.html"; 
});



document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".pprofile-form");

  form.addEventListener("profilesubmit", function (event) {
    event.preventDefault(); // stop actual form submission
    window.location.href = "index.html"; // redirect
  });
});


