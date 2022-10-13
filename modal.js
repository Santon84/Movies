function fillModal(imageSelector, titleSelector, descrSelector, yearSelector, data ) {

const img = document.querySelector(imageSelector);
img.style.backgroundImage = `url('${data.src}')`;

const title = document.querySelector(titleSelector);
title.innerText = data.title;


try {
const year = document.querySelector(yearSelector);
year.innerText = data.year;
}
catch {}
const descr = document.querySelector(descrSelector);
descr.innerText = data.descr;

const modal = document.querySelector('.modal');
modal.classList.remove('hide');
modal.classList.add('show');
document.getElementsByTagName("body")[0].style.overflowY = "hidden";
}


export default fillModal;