let currentUser=null,isPremium=false,adInterval=null;
const $=id=>document.getElementById(id);

function toggleMenu(){$('sideMenu').classList.toggle('active');$('overlay').classList.toggle('active')}
function goHome(){toggleMenu();hideAll();$('mainPage').classList.remove('hidden');$('result').style.display='none'}
function hideAll(){['fiturPage','deskripsiPage','profilePage','premiumPage'].forEach(i=>$(i).classList.add('hidden'))}
function showFitur(){hideAll();$('fiturPage').classList.remove('hidden');toggleMenu()}
function showDeskripsi(){hideAll();$('deskripsiPage').classList.remove('hidden');toggleMenu()}
function showProfile(){hideAll();$('profilePage').classList.remove('hidden');toggleMenu();loadProfile()}
function showPremium(){hideAll();$('premiumPage').classList.remove('hidden');toggleMenu()}

$('tiktokLink').addEventListener('input',()=>{$('clearBtn').style.display=$('tiktokLink').value?'block':'none'})
$('clearBtn').addEventListener('click',()=>{$('tiktokLink').value='';$('clearBtn').style.display='none'})

function register(){
 let u=$('username').value.trim(),p=$('password').value.trim(),r=$('role').value;
 if(!u||!p)return alert('Isi nama & sandi');
 let users=JSON.parse(localStorage.getItem('scarlet_users')||'{}');
 if(users[u]){if(users[u].password!==p)return alert('Sandi salah');currentUser=users[u]}
 else{currentUser={username:u,password:p,role:r,gmail:$('gmail').value,wa:$('wa').value,premium:(r==='owner'),history:[]};users[u]=currentUser;localStorage.setItem('scarlet_users',JSON.stringify(users))}
 localStorage.setItem('scarlet_current',JSON.stringify(currentUser));initApp();
}
function initApp(){
 let d=JSON.parse(localStorage.getItem('scarlet_current'));if(!d)return;currentUser=d;isPremium=d.premium||d.role==='owner';
 $('authPage').classList.add('hidden');$('mainPage').classList.remove('hidden');
 $('profileRole').innerHTML=currentUser.role+(isPremium?' <span class=badge>PREMIUM</span>':' <span class=badge style=background:#555>FREE</span>');
 $('premiumMenu').style.display=currentUser.role==='owner'?'none':'flex';startAds();
}
function startAds(){if(adInterval)clearInterval(adInterval);if(isPremium)return;adInterval=setInterval(()=>{$('adPopup').style.display='block'},75000)}
function contactAdmin(){window.open('https://wa.me/6288801883795?text=Halo%20admin%20mau%20voucher%20Scarlet','_blank')}

$('downloadBtn').addEventListener('click',async()=>{
 let link=$('tiktokLink').value.trim();if(!link)return alert('Tempel link');
 $('loading').style.display='block';$('result').style.display='none';
 try{
  let res=await fetch('https://www.tikwm.com/api/',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({url:link})});
  let j=await res.json();let data=j.data;
  $('mainVideo').src=data.play;$('bgVideo').src=data.play;$('audioPlayer').src=data.music;$('cover').src=data.cover;$('title').innerText=data.title.slice(0,50);$('dlMp4').href=data.play;$('dlMp3').href=data.music;
  document.querySelector('.video-wrap').style.display='block';$('mp3Result').style.display='block';$('result').style.display='block';
  let users=JSON.parse(localStorage.getItem('scarlet_users')||'{}');users[currentUser.username].history.unshift({title:data.title,video:data.play,music:data.music,time:new Date().toLocaleString()});
  localStorage.setItem('scarlet_users',JSON.stringify(users));localStorage.setItem('scarlet_current',JSON.stringify(users[currentUser.username]));
 }catch{alert('Gagal, API limit')}
 $('loading').style.display='none';
});

function loadProfile(){$('profileName').innerText=currentUser.username;$('editUsername').value=currentUser.username;$('editGmail').value=currentUser.gmail||'';$('editWa').value=currentUser.wa||'';$('history').innerHTML=currentUser.history.length?currentUser.history.map(x=>`<div style="padding:8px;border-bottom:1px solid #222"><b>${x.title.slice(0,30)}</b><br><small>${x.time}</small><br><a href="${x.video}" target=_blank style="color:#fe2c55">MP4</a> | <a href="${x.music}" style="color:#fff" target=_blank>MP3</a></div>`).join(''):'Belum ada download'}

$('saveProfileBtn').addEventListener('click',()=>{
 let users=JSON.parse(localStorage.getItem('scarlet_users')||'{}'),oldU=currentUser.username,newU=$('editUsername').value.trim();
 users[oldU].gmail=$('editGmail').value;users[oldU].wa=$('editWa').value;
 if(newU&&newU!==oldU){users[newU]=users[oldU];users[newU].username=newU;delete users[oldU];}
 localStorage.setItem('scarlet_users',JSON.stringify(users));localStorage.setItem('scarlet_current',JSON.stringify(users[newU||oldU]));currentUser=users[newU||oldU];alert('Saved');loadProfile();
});
$('profileInput').addEventListener('change',e=>{let f=e.target.files[0];let r=new FileReader();r.onload=()=>{$('profileImg').src=r.result;localStorage.setItem('scarlet_profile_pic',r.result)};r.readAsDataURL(f)});
$('colorInput').addEventListener('change',e=>{document.documentElement.style.setProperty('--accent',e.target.value)});
$('bgInput').addEventListener('change',e=>{let f=e.target.files[0];let r=new FileReader();r.onload=()=>{document.body.style.background=`url(${r.result}) center/cover fixed`};r.readAsDataURL(f)});
$('activateBtn').addEventListener('click',()=>{
 let c=$('voucherCode').value.trim();
 if(c==='glass5522'){ // CODE PRIVATE LU
  let users=JSON.parse(localStorage.getItem('scarlet_users')||'{}');users[currentUser.username].premium=true;
  localStorage.setItem('scarlet_users',JSON.stringify(users));localStorage.setItem('scarlet_current',JSON.stringify(users[currentUser.username]));isPremium=true;alert('Premium aktif!');initApp();
 }else alert('Code salah! Hubungi 6288801883795');
});
$('logoutBtn').addEventListener('click',()=>{localStorage.removeItem('scarlet_current');location.reload()});
$('switchBtn').addEventListener('click',()=>{localStorage.removeItem('scarlet_current');location.reload()});
$('closeAd').addEventListener('click',()=>{$('adPopup').style.display='none'});
$('goPremiumBtn').addEventListener('click',()=>{showPremium();$('adPopup').style.display='none'});

window.onload=()=>{let pic=localStorage.getItem('scarlet_profile_pic');if(pic)$('profileImg').src=pic;if(localStorage.getItem('scarlet_current'))initApp()};