(()=>{
const carousel=document.querySelector('[data-health-carousel]');if(!carousel)return;
const track=carousel.querySelector('.health-track');const slides=[...carousel.querySelectorAll('.health-slide')];const reduced=matchMedia('(prefers-reduced-motion: reduce)');let index=0,timer=null,inView=true;
const stopped=()=>reduced.matches||document.hidden||!inView;
function sync(){clearTimeout(timer);slides.forEach((slide,i)=>{const video=slide.querySelector('video');if(!video)return;if(i!==index||stopped()){video.pause();return;}if(!video.src)video.src=video.dataset.src;video.muted=true;const playback=video.play();if(playback)playback.catch(()=>{});});if(!stopped())timer=setTimeout(()=>show((index+1)%slides.length),4000);}
function show(next){const previous=slides[index].querySelector('video');if(previous){previous.pause();try{previous.currentTime=0;}catch{}}index=next;track.style.transform='translateX(-'+index*100+'%)';slides.forEach((slide,i)=>{slide.setAttribute('aria-hidden',String(i!==index));slide.inert=i!==index;});sync();}
document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);if('IntersectionObserver'in window)new IntersectionObserver(entries=>{const visible=entries[0].isIntersecting;if(visible!==inView){inView=visible;sync();}},{threshold:.15}).observe(carousel);show(0);
})();
