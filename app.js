// Journey map interaction
const chapters=[
  {title:'PhD',institution:'USC Annenberg',years:'2024 – Present',loc:'Los Angeles',caption:'Los Angeles, California',next:'PhD in Los Angeles',places:['la'],text:'I’m a third-year PhD student researching how AI and social media shape mental health stigma, support, and help-seeking among young people. My work spans health equity and communication, with experience in mental health, suicide prevention, HIV and sexual health, and environmental health. I combine quantitative and qualitative research methods with participatory approaches to bring young people’s lived experiences into the design of health programs, technologies, and messages.'},
  {title:'MPH',institution:'Harvard T.H. Chan School of Public Health',years:'2022 – 2024',loc:'Boston',caption:'Boston, Massachusetts',next:'MPH in Boston',places:['bos'],text:"At Harvard, I studied Health and Social Behavior, focusing on how people’s beliefs, social relationships, and environments shape health behaviors and outcomes. Mentors including Vish Viswanath, Jocelyn Chu, and Nancy Krieger helped shape my perspective, while work with Brigham and Women’s Hospital’s Division of Global Health Equity, East Boston Social Services, and the Asian American Pacific Islander Commission grounded my training in applied research and community-based practice. I'm grateful to Coefficient Giving for supporting my education."},
  {title:'Schwarzman Scholar',institution:'Tsinghua University',years:'2021 – 2022',loc:'Beijing',caption:'Beijing, China',next:'Schwarzman Scholar in Beijing',places:['bj'],text:'A magical year in Beijing helped me imagine a new path from consulting to public health research. Alongside wonderful mentors and friends, I explored how sociocultural factors and stigma shape conversations about health—particularly around end-of-life care—and examined palliative and hospice care policies in China and other Asian countries.'},
  {title:'Management Consultant',institution:'Oliver Wyman',years:'2017 – 2021',loc:'Singapore, Bangkok, and Doha',caption:'Singapore · Bangkok · Doha',next:'Consulting in Singapore',places:['sg','bkk','doh'],text:'Singapore became home when I began my career in consulting. I led 12 projects across health, technology, financial services, and social impact in Southeast Asia and the Middle East—including my work with health ministries. I also led the firm’s social impact consulting practice across Asia Pacific, launching 8 projects with non-profit organizations. I left as an Engagement Manager, bringing my skills in research, design, project management, and team leadership into my next chapters.'},
  {title:'BA in Economics',institution:'Amherst College',years:'2013 – 2017',loc:'Amherst',caption:'Amherst, Massachusetts',next:'BA in Amherst',places:['am'],text:'At Amherst, I began exploring what “health” means in the context of international development through diverse coursework in economics, political science, history, and sociology. Beyond the classroom, I led the student newspaper, worked in the college’s communication office, and served as a natural history museum docent. A summer with an education non-profit in Otavalo, Ecuador, brought those interests beyond campus. I also interned at JP Morgan for a finance 101 crash course.'},
  {title:'Growing up',institution:'',years:'',loc:'Seoul & Seattle',caption:'Seoul, South Korea · Seattle, Washington',next:'Growing up in Seoul & Seattle',places:['sel','sea'],text:'Music was a big part of my childhood. I played violin in many capacities, including with the Seattle Youth Symphony Orchestra and all-region and national-level youth orchestras. I loved growing up in the Pacific Northwest and flying back to Korea during breaks to visit relatives.'}
];
let currentChapter=0;
const box=document.getElementById('detail');
const NS='http://www.w3.org/2000/svg';
let proj,svg=document.getElementById('map'),pins={},route,vb=null,raf;
const W=800,H=400;
function setVB(v){vb=v;svg.setAttribute('viewBox',v.join(' '));
  const k=v[2]/svg.clientWidth; // svg units per screen px
  svg.style.setProperty('--k',k);
  Object.values(pins).forEach(g=>{g.querySelectorAll('circle').forEach(c=>c.setAttribute('r',c.classList.contains('ring')?5*k:5*k));
    const t=g.querySelector('text');t.setAttribute('font-size',13*k);
    const dx=(t.getAttribute('text-anchor')==='end'?-1:1)*10*k;t.setAttribute('x',+g.dataset.x+dx);t.setAttribute('y',+g.dataset.y+4*k);});}
function zoomTo(pts,instant){
  let x0=Math.min(...pts.map(p=>p[0])),x1=Math.max(...pts.map(p=>p[0])),y0=Math.min(...pts.map(p=>p[1])),y1=Math.max(...pts.map(p=>p[1]));
  const ar=(svg.clientWidth/Math.max(svg.clientHeight,1))||2;
  let w=Math.max((x1-x0)*1.5,300),h=Math.max((y1-y0)*1.8,w/ar);w=Math.max(w,h*ar);
  if(w>W*1.05){w=W*1.05;}h=w/ar;
  const cx=(x0+x1)/2,cy=(y0+y1)/2;
  const x=cx-w/2,y=Math.min(Math.max(cy-h/2,-h*0.15),H-h*0.85);
  const to=[x,y,w,h];
  if(instant||!vb||matchMedia('(prefers-reduced-motion:reduce)').matches){setVB(to);return;}
  const from=vb.slice();const t0=performance.now();cancelAnimationFrame(raf);
  const step=t=>{const u=Math.min((t-t0)/800,1),e=u<.5?2*u*u:1-Math.pow(-2*u+2,2)/2;
    setVB(from.map((f,i)=>f+(to[i]-f)*e));if(u<1)raf=requestAnimationFrame(step);};
  raf=requestAnimationFrame(step);}
function select(index,instant=false){
  currentChapter=Math.max(0,Math.min(chapters.length-1,index));
  const s=chapters[currentChapter];
  box.innerHTML=`<p class="loc">${s.loc}${s.years?`<span class="yrs">${s.years}</span>`:''}</p><h3>${s.title}</h3>${s.institution?`<p class="institution">${s.institution}</p>`:''}<p class="chapter-copy">${s.text}</p>`;
  if(!matchMedia('(prefers-reduced-motion:reduce)').matches) box.animate([{opacity:.4,transform:'translateY(6px)'},{opacity:1,transform:'translateY(0)'}],{duration:300});
  document.getElementById('chapter-count').textContent=`${String(currentChapter+1).padStart(2,'0')} / 06`;
  document.querySelectorAll('.chapter-dot').forEach((dot,i)=>dot.setAttribute('aria-pressed',String(i===currentChapter)));
  const prev=document.getElementById('chapter-prev'),next=document.getElementById('chapter-next');
  prev.disabled=currentChapter===0;next.disabled=currentChapter===5;
  prev.setAttribute('aria-label',currentChapter?`Previous chapter: ${chapters[currentChapter-1].title}`:'Previous chapter');
  next.setAttribute('aria-label',currentChapter<5?`Next chapter: ${chapters[currentChapter+1].title}`:'Next chapter');
  document.getElementById('next-preview').textContent=currentChapter<5?`Up next: ${chapters[currentChapter+1].next}`:'The beginning of the story. Go back to explore.';
  document.getElementById('map-caption').textContent=s.caption;
  svg.setAttribute('aria-label',`Map showing ${s.caption}`);
  const on=s.places;
  Object.entries(pins).forEach(([k,g])=>g.classList.toggle('on',on.includes(k)));
  if(route){const pts=on.map(k=>proj(window.PLACES[k].slice(1,3)));
    route.setAttribute('d',pts.length>1?'M'+pts.map(p=>p.join(',')).join('L'):'');window._pts=pts;zoomTo(pts,instant);}
}
if(box){
  document.getElementById('chapter-prev').addEventListener('click',()=>select(currentChapter-1));
  document.getElementById('chapter-next').addEventListener('click',()=>select(currentChapter+1));
  document.querySelectorAll('.chapter-dot').forEach(dot=>dot.addEventListener('click',()=>select(Number(dot.dataset.chapter))));
  document.getElementById('journey-story').addEventListener('keydown',e=>{
    if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();select(currentChapter+(e.key==='ArrowRight'?1:-1));}
  });
}
if(svg&&window.d3&&window.topojson){
  svg.setAttribute('viewBox',`0 0 ${W} ${H}`);
  fetch('vendor/land.json').then(r=>r.json()).then(t=>{
    const land=topojson.feature(t,t.objects.land);
    const box={type:'MultiPoint',coordinates:[[-169,72],[-169,-52],[189,72],[189,-52],[10,72],[10,-52]]};
    proj=d3.geoNaturalEarth1().rotate([-10,0]).fitExtent([[8,8],[W-8,H-8]],box);
    const path=d3.geoPath(proj);
    const p=document.createElementNS(NS,'path');p.setAttribute('d',path(land));p.setAttribute('class','land');svg.appendChild(p);
    route=document.createElementNS(NS,'path');route.setAttribute('class','route');svg.appendChild(route);
    Object.entries(window.PLACES).forEach(([k,[name,lon,lat,side]])=>{
      const [x,y]=proj([lon,lat]);
      const g=document.createElementNS(NS,'g');g.setAttribute('class','pin');g.dataset.x=x;g.dataset.y=y;
      const l=side==='l';
      g.innerHTML=`<circle class="ring" cx="${x}" cy="${y}" r="5"/><circle class="dot" cx="${x}" cy="${y}" r="5"/><text class="lbl" x="${x+(l?-10:10)}" y="${y+4}" text-anchor="${l?'end':'start'}">${name}</text>`;
      svg.appendChild(g);pins[k]=g;
    });
    vb=[0,0,W,H];select(currentChapter,true);window.addEventListener('resize',()=>{if(vb&&window._pts)zoomTo(window._pts,true);});
  }).catch(()=>{document.getElementById('map-caption').textContent='Map unavailable. Chapter locations are shown in the card.';});
}
// Projects page: preview cards + details modal
const grid=document.getElementById('project-grid');
const pmodal=document.getElementById('pmodal');
const keywordGroups=[
 {id:'topic',name:'Topics',terms:['AI','Social media','Mental health','HIV/sexual health','Environmental health']},
 {id:'community',name:'Communities',terms:['Youth','Immigrants','Asian American','Older adults']},
 {id:'approach',name:'Methods & applications',terms:['Participatory','Quantitative','Health communication','Health tech','Care delivery models','Policy']}
];
function projectKeywords(p){
 const terms=(p.keywords||'').split(',').map(s=>s.trim().toLowerCase());
 return keywordGroups.flatMap(g=>g.terms.filter(t=>terms.includes(t.toLowerCase())).map(t=>({term:t,group:g.id})));
}
function keywordMarkup(p){
 return projectKeywords(p).map(k=>`<span class="keyword keyword-${k.group}">${k.term}</span>`).join('');
}
function firstSentences(t,n){
 const plain=t.replace(/<[^>]+>/g,'');
 if(typeof Intl.Segmenter==='function')return [...new Intl.Segmenter('en',{granularity:'sentence'}).segment(plain)].slice(0,n).map(s=>s.segment).join('').trim();
 return plain;
}
function openProject(i){
 const p=window.PROJECTS[i];if(!p||!pmodal)return;
 document.getElementById('pm-num').textContent=String(p.num).padStart(2,'0');
 document.getElementById('pm-title').textContent=p.title;
 document.getElementById('pm-lead').innerHTML=p.lead;
 const body=document.getElementById('pm-body');body.hidden=!p.body;if(p.body)body.textContent=p.body;
 const note=document.getElementById('pm-note');note.hidden=!p.note;if(p.note)note.textContent=p.note;
 const fig=document.getElementById('pm-img');fig.hidden=!p.img;
 const image=fig.querySelector('img');
 if(p.img){image.src='assets/'+p.img+'.jpg';image.alt=p.imageAlt||'Project photo or visual';}
 else image.removeAttribute('src');
 const linksBox=document.getElementById('pm-links');linksBox.innerHTML='';
 (p.links||[]).forEach(l=>{const a=document.createElement('a');a.className='plink';a.href=l[1];a.target='_blank';a.rel='noopener';a.textContent=l[0]+' \u2192';linksBox.appendChild(a)});
 const keys=document.getElementById('pm-keys');keys.hidden=!p.keywords;keys.innerHTML=keywordMarkup(p);
 pmodal.hidden=false;document.body.style.overflow='hidden';
 document.querySelector('.pmodal-card').scrollTop=0;
 document.getElementById('pm-close').focus();
}
function closeProject(){if(!pmodal)return;pmodal.hidden=true;document.body.style.overflow='';
 const b=document.querySelector('.pbtn[aria-expanded="true"]');if(b){b.setAttribute('aria-expanded','false');b.focus()}}
if(grid&&window.PROJECTS){
 const filters=document.querySelector('.filters');
 keywordGroups.forEach(g=>{
  const group=document.createElement('div');group.className='filter-family';group.setAttribute('role','group');group.setAttribute('aria-label',g.name);
  group.innerHTML=`<span class="filter-label">${g.name}</span><div class="filter-terms">${g.terms.map(t=>`<button class="chip keyword-${g.id}" data-filter="${t}" aria-pressed="false">${t}</button>`).join('')}</div>`;
  filters.appendChild(group);
 });
 window.PROJECTS.forEach((p,i)=>{
  const a=document.createElement('article');a.className='card proj';a.dataset.tags=projectKeywords(p).map(k=>k.term).join('|');
  a.innerHTML=`<p class="pnum">${String(p.num).padStart(2,'0')}</p><h3>${p.title}</h3><p class="plead">${firstSentences(p.lead,2)}</p><button type="button" class="pbtn" data-i="${i}" aria-expanded="false">View details &rarr;</button><p class="pkeys">${keywordMarkup(p)}</p>`;
  grid.appendChild(a);});
 grid.addEventListener('click',e=>{const b=e.target.closest('.pbtn');if(b){b.setAttribute('aria-expanded','true');openProject(+b.dataset.i)}});
 if(pmodal){
  pmodal.addEventListener('click',e=>{if(e.target.closest('[data-close]'))closeProject()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!pmodal.hidden)closeProject()});
 }
}
// Project filters
document.querySelectorAll('.chip').forEach(c=>c.addEventListener('click',()=>{
  document.querySelectorAll('.chip').forEach(x=>x.setAttribute('aria-pressed','false'));
  c.setAttribute('aria-pressed','true');
  const f=c.dataset.filter;
  document.querySelectorAll('#project-grid .card').forEach(card=>{
    card.classList.toggle('hidden',f!=='all'&&!card.dataset.tags.split('|').includes(f));
  });
}));
// Reveal on scroll
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
