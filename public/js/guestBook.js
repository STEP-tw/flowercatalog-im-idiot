const logOutUser=function() {
  window.location.href="logout";
}
const addClickListenerToLogoutButton=function(){
  let logOut=document.getElementById('logout');
  logout.onclick=logOutUser;
}

const begin=function(){
  addClickListenerToLogoutButton();
}
window.onload=begin;
