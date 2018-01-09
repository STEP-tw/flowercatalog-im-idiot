const makeItVisible=function(){
  let gif=document.getElementById('jar');
  gif.style.visibility='visible';
}

const disappearForASec=function(event){
  event.target.style.visibility='hidden';
  setTimeout(makeItVisible,1000);
}

const addClickListenerOnGif=function(){
  let gif=document.getElementById('jar');
  gif.onclick=disappearForASec;
};

const begin=function() {
  addClickListenerOnGif();
};

window.onload=begin;
