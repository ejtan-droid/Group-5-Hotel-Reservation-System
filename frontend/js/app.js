/**
 * Auberge de Grandeur — Hotel Reservation System
 * Frontend Data Store (localStorage — Phase 1)
 */
const API = "http://localhost/auberge/api";

const ADMIN_CREDENTIALS = [
  { username:'admin',   password:'admin2026', name:'Admin'   },
  { username:'manager', password:'mgr2026',   name:'Manager' },
];

const HOTEL = {
  name:'Auberge de Grandeur', contact:'09103354758',
  rooms:[
    {roomNumber:101,type:'Standard',pricePerNight:100,capacity:2,description:'Comfortable room with a queen bed, private bathroom, flat-screen TV, and free Wi-Fi.',available:true},
    {roomNumber:102,type:'Standard',pricePerNight:100,capacity:2,description:'Comfortable room with a queen bed, private bathroom, flat-screen TV, and free Wi-Fi.',available:true},
    {roomNumber:103,type:'Standard',pricePerNight:100,capacity:2,description:'Comfortable room with a queen bed, private bathroom, flat-screen TV, and free Wi-Fi.',available:true},
    {roomNumber:201,type:'Deluxe',  pricePerNight:200,capacity:3,description:'Spacious room with king bed, mini-bar, city balcony view, and premium toiletries.',available:true},
    {roomNumber:202,type:'Deluxe',  pricePerNight:200,capacity:3,description:'Spacious room with king bed, mini-bar, city balcony view, and premium toiletries.',available:true},
    {roomNumber:203,type:'Deluxe',  pricePerNight:200,capacity:3,description:'Spacious room with king bed, mini-bar, city balcony view, and premium toiletries.',available:true},
    {roomNumber:301,type:'Suite',   pricePerNight:350,capacity:4,description:'Luxury suite with separate living area, jacuzzi, kitchenette, and panoramic views.',available:true},
    {roomNumber:302,type:'Suite',   pricePerNight:350,capacity:4,description:'Luxury suite with separate living area, jacuzzi, kitchenette, and panoramic views.',available:true},
    {roomNumber:303,type:'Suite',   pricePerNight:350,capacity:4,description:'Luxury suite with separate living area, jacuzzi, kitchenette, and panoramic views.',available:true},
  ],
  services:[
    {id:'room_cleaning',name:'Room Cleaning',   cost:15},
    {id:'food_service', name:'Food Service',    cost:25},
    {id:'laundry',      name:'Laundry',         cost:20},
    {id:'airport',      name:'Airport Transfer',cost:50},
    {id:'spa',          name:'Spa Treatment',   cost:80},
  ],
};

const Store = {
  get(k)      { try{return JSON.parse(localStorage.getItem(k));}catch{return null;} },
  set(k,v)    { localStorage.setItem(k,JSON.stringify(v)); },
  remove(k)   { localStorage.removeItem(k); },
  getUsers()          { return this.get('adg_users')||[]; },
  saveUsers(u)        { this.set('adg_users',u); },
  getReservations()   { return this.get('adg_reservations')||[]; },
  saveReservations(r) { this.set('adg_reservations',r); },
  getServices()       { return this.get('adg_services')||[]; },
  saveServices(s)     { this.set('adg_services',s); },
  getRooms()          { return this.get('adg_rooms')||HOTEL.rooms; },
  saveRooms(r)        { this.set('adg_rooms',r); },
  getCurrentUser()    { return this.get('adg_current_user'); },
  setCurrentUser(u)   { this.set('adg_current_user',u); },
  logout()            { this.remove('adg_current_user'); },
};
if(!localStorage.getItem('adg_rooms')) Store.saveRooms(HOTEL.rooms);

const Auth = {
  register(data) {
    const users=Store.getUsers();
    if(users.find(u=>u.username===data.username)) return {success:false,message:'Username already exists.'};
    if(users.find(u=>u.email===data.email)) return {success:false,message:'Email already registered.'};
    users.push({...data,profileImage:null,role:'guest',createdAt:new Date().toISOString()});
    Store.saveUsers(users);
    return {success:true};
  },
  login(username,password) {
    const user=Store.getUsers().find(u=>u.username===username&&u.password===password);
    if(user){Store.setCurrentUser(user);return {success:true,user};}
    return {success:false,message:'Incorrect username or password.'};
  },
  isAdmin(username,password) {
    return ADMIN_CREDENTIALS.find(a=>a.username===username&&a.password===password)||null;
  },
  getAdminSession()  { try{return JSON.parse(sessionStorage.getItem('adg_admin'));}catch{return null;} },
  setAdminSession(a) { sessionStorage.setItem('adg_admin',JSON.stringify(a)); },
  logoutAdmin()      { sessionStorage.removeItem('adg_admin'); },
  requireAdmin() {
    const a=this.getAdminSession();
    if(!a){window.location.href='../../index.html';return null;}
    return a;
  },
  requireAuth() {
    const u=Store.getCurrentUser();
    if(!u){window.location.href='../../index.html';return null;}
    return u;
  },
};

const Bookings = {
  create(guest,roomNumber,checkIn,checkOut,nights,checkInTime='14:00',checkOutTime='12:00') {
    const rooms=Store.getRooms();
    const idx=rooms.findIndex(r=>r.roomNumber===roomNumber);
    if(idx===-1||!rooms[idx].available) return {success:false,message:'Room is no longer available.'};
    if(nights<=0) return {success:false,message:'Check-out must be after check-in.'};
    const room=rooms[idx];
    const reservation={
      reservationId:1000+Store.getReservations().length+1,
      username:guest.username,
      guestName:`${guest.firstName} ${guest.lastName}`,
      roomNumber:room.roomNumber,roomType:room.type,
      pricePerNight:room.pricePerNight,
      checkIn,checkOut,checkInTime,checkOutTime,nights,
      totalRoomCost:room.pricePerNight*nights,
      status:'CONFIRMED',
      createdAt:new Date().toISOString(),
      lastModified:new Date().toISOString(),
    };
    rooms[idx].available=false;
    Store.saveRooms(rooms);
    const r=Store.getReservations();
    r.push(reservation);
    Store.saveReservations(r);
    return {success:true,reservation};
  },
  getForUser(username) { return Store.getReservations().filter(r=>r.username===username); },
  getAll()             { return Store.getReservations(); },
  cancel(id) {
    let r=Store.getReservations();
    const i=r.findIndex(x=>x.reservationId===id);
    if(i===-1) return;
    const roomNum=r[i].roomNumber;
    r[i].status='CANCELLED';
    r[i].lastModified=new Date().toISOString();
    Store.saveReservations(r);
    let rooms=Store.getRooms();
    const ri=rooms.findIndex(x=>x.roomNumber===roomNum);
    if(ri!==-1) rooms[ri].available=true;
    Store.saveRooms(rooms);
  },
  modify(id,newCI,newCO,newCITime,newCOTime) {
    let r=Store.getReservations();
    const i=r.findIndex(x=>x.reservationId===id);
    if(i===-1) return {success:false,message:'Reservation not found.'};
    const res=r[i];
    if(res.checkIn===newCI&&res.checkOut===newCO&&(res.checkInTime||'14:00')===newCITime&&(res.checkOutTime||'12:00')===newCOTime)
      return {success:false,message:'No changes were made.'};
    const conflict=r.some(x=>x.reservationId!==id&&x.roomNumber===res.roomNumber&&x.status==='CONFIRMED'&&new Date(x.checkIn)<new Date(newCO)&&new Date(x.checkOut)>new Date(newCI));
    if(conflict) return {success:false,message:'Room is already booked during those dates.'};
    const nights=Math.ceil((new Date(newCO)-new Date(newCI))/86400000);
    r[i]={...res,checkIn:newCI,checkOut:newCO,checkInTime:newCITime,checkOutTime:newCOTime,nights,totalRoomCost:res.pricePerNight*nights,lastModified:new Date().toISOString()};
    Store.saveReservations(r);
    return {success:true};
  },
};

const Services = {
  request(guest,serviceId,date,time='09:00') {
    const svc=HOTEL.services.find(s=>s.id===serviceId);
    if(!svc) return {success:false,message:'Service not found.'};
    const entry={
      id:Date.now()+Math.random(),
      username:guest.username,
      guestName:`${guest.firstName} ${guest.lastName}`,
      serviceName:svc.name,serviceId:svc.id,cost:svc.cost,
      date,time,status:'PENDING',
      lastModified:new Date().toISOString(),
    };
    const s=Store.getServices();
    s.push(entry);
    Store.saveServices(s);
    return {success:true,service:entry};
  },
  getForUser(username) { return Store.getServices().filter(s=>s.username===username); },
  getAll()             { return Store.getServices(); },
  modify(id,newDate,newTime) {
    let s=Store.getServices();
    const i=s.findIndex(x=>String(x.id)===String(id));
    if(i===-1) return {success:false,message:'Service not found.'};
    if(s[i].status!=='PENDING') return {success:false,message:'Only PENDING services can be modified.'};
    if(s[i].date===newDate&&(s[i].time||'09:00')===newTime) return {success:false,message:'No changes were made.'};
    s[i].date=newDate;s[i].time=newTime;s[i].lastModified=new Date().toISOString();
    Store.saveServices(s);
    return {success:true};
  },
  updateStatus(id,status) {
    let s=Store.getServices();
    const i=s.findIndex(x=>String(x.id)===String(id));
    if(i===-1) return;
    s[i].status=status;s[i].lastModified=new Date().toISOString();
    Store.saveServices(s);
  },
};

const Billing = {
  generate(reservation,services) {
    const sc=services.reduce((sum,s)=>sum+s.cost,0);
    return {
      reservationId:reservation.reservationId,guestName:reservation.guestName,
      roomType:reservation.roomType,roomNumber:reservation.roomNumber,
      checkIn:reservation.checkIn,checkOut:reservation.checkOut,
      checkInTime:reservation.checkInTime||'14:00',checkOutTime:reservation.checkOutTime||'12:00',
      nights:reservation.nights,roomCost:reservation.totalRoomCost,
      pricePerNight:reservation.pricePerNight,servicesCost:sc,
      total:reservation.totalRoomCost+sc,
    };
  },
};

// Phone validation
function isValidPhone(p) { return /^09[0-9]{9}$/.test(p); }
function validatePhoneHint(input) {
  input.value=input.value.replace(/[^0-9]/g,'');
  const hint=document.getElementById('phone-hint');
  if(!hint) return;
  const v=input.value;
  if(!v.length){ hint.style.color='var(--text-muted)';hint.textContent='Format: 09XXXXXXXXX (11 digits)';input.classList.remove('input-error'); }
  else if(!v.startsWith('09')){ hint.style.color='#c0392b';hint.textContent='Must start with 09';input.classList.add('input-error'); }
  else if(v.length<11){ hint.style.color='#e67e22';hint.textContent=`${v.length} / 11 digits`;input.classList.remove('input-error'); }
  else { hint.style.color='#27ae60';hint.textContent='✓  Looks good!';input.classList.remove('input-error'); }
}

// Time picker
function buildTimePicker(selectId,defaultHour) {
  const s=document.getElementById(selectId);
  if(!s) return;
  s.innerHTML='';
  for(let h=6;h<=23;h++){
    const ampm=h<12?'AM':'PM';
    const hr=h===12?12:h>12?h-12:h;
    const o=document.createElement('option');
    o.value=`${String(h).padStart(2,'0')}:00`;
    o.textContent=`${hr}:00 ${ampm}`;
    if(h===defaultHour) o.selected=true;
    s.appendChild(o);
  }
}
function formatTime(t) {
  if(!t) return '';
  const h=parseInt(t.split(':')[0]);
  const ampm=h<12?'AM':'PM';
  const hr=h===12?12:h>12?h-12:h;
  return `${hr}:00 ${ampm}`;
}

// UI helpers
const UI = {
  showToast(message,type='info') {
    let c=document.querySelector('.toast-container');
    if(!c){c=document.createElement('div');c.className='toast-container';document.body.appendChild(c);}
    const t=document.createElement('div');
    t.className=`toast toast-${type}`;
    const icons={success:'✓',error:'✕',info:'i'};
    t.innerHTML=`<span style="font-weight:700;font-size:0.95rem;flex-shrink:0">${icons[type]||'i'}</span><span>${message}</span>`;
    c.appendChild(t);
    setTimeout(()=>{t.style.opacity='0';t.style.transform='translateX(10px)';t.style.transition='all 0.3s ease';setTimeout(()=>t.remove(),300);},3500);
  },
  formatCurrency(a) { return '$'+Number(a).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g,','); },
  formatDate(d) {
    if(!d) return '—';
    return new Date(d+'T00:00:00').toLocaleDateString('en-US',{year:'numeric',month:'short',day:'numeric'});
  },
  renderAvatar(user,container) {
    if(user&&user.profileImage){
      container.innerHTML=`<img src="${user.profileImage}" alt="Profile" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
      container.style.cssText='';
    } else {
      const ini=((user?.firstName?.[0]||'')+(user?.lastName?.[0]||'')).toUpperCase();
      container.textContent=ini||'?';
      container.style.cssText='display:flex;align-items:center;justify-content:center;background:var(--brown-warm);color:white;font-family:var(--font-display);font-size:1rem;font-weight:600;border-radius:50%;';
    }
  },
};
function getRoomGradient(type){const g={Standard:'linear-gradient(135deg,#8b6245,#5c3317)',Deluxe:'linear-gradient(135deg,#6b4226,#3b1f0e)',Suite:'linear-gradient(135deg,#c9a84c,#8b5e3c)'};return g[type]||g.Standard;}
function getGreeting(){const h=new Date().getHours();if(h<12)return 'Good morning';if(h<18)return 'Good afternoon';return 'Good evening';}
