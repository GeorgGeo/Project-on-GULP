//
;(function ($) {
  $(function () {
    // jQuery tabs
    $('.search__tabs').on('click', 'div:not(.active)', function (e) {
      e.preventDefault()
      e.stopPropagation()
      $(this)
        .addClass('active')
        .siblings()
        .removeClass('active')
        .closest('div.tabs')
        .find('div.tabs__content')
        .removeClass('active')
        .eq($(this).index())
        .addClass('active')
    })
  })
  // jQuery UI tabs
  $(function () {
    $('#tabs').tabs()
  })
  // Destination
  $(function () {
    $('#tabs-destination').tabs()
  })
  // Slick-salider
  $(function () {
    $('.slaider').slick({
      arrows: true,
      // dots: true,
      adaptiveHeight: true,
      // ширина слайда
      // variableWidth: true,
      slidesToShow: 2,
      speed: 1000,
      easing: 'ease',
      // центрировать по центру
      // centerMode: true,
      prevArrow:
        '<div class="wrap-angle"><div class="angle slick-prev"></div></div>',
      nextArrow:
        '<div class="wrap-angle2"><div class="angle slick-next"></div></div>',
    })
  })
  //
  $(function () {
    $('.your-class').slick({
      // setting-name: setting-value
      arrows: true,
      dots: true,
      // автоматическая адаптивная высота слайда (слайдер будет потстраиваться под конкретный слайд)
      adaptiveHeight: true,
      slidesToShow: 2,
      slidesToScroll: 2,
      speed: 2000,
      easing: 'ease-in-out',
      // будет ли слайдер бесконечный
      infinite: true,
      // с какого слайда стартуем
      initialSlide: 0,
      // автоматическое пролистывание слайда
      autoplay: true,
      // скорость пролистывания
      autoplaySpeed: 3000,
      // пауза при автопроигровании
      pauseOnFocus: true,
      pauseOnHover: true,
      pauseOnDotsHover: true,
      // перетягивания слайда мышкой
      draggable: false,
      // для мобильных
      swipe: false,
      // для быстрого перелистования слайдов (при кликах на стрелках)
      waitForAnimate: false,
    })
  })
  // Button up
  var btn = $('.button-up')
  $(window).scroll(function () {
    if ($(window).scrollTop() > 300) {
      btn.addClass('show')
    } else {
      btn.removeClass('show')
    }
  })
  btn.on('click', function (e) {
    e.preventDefault()
    $('html, body').animate({ scrollTop: 0 }, '900')
  })
  // Popup window
  $('a.modal-btn').click(function (e) {
    e.preventDefault()
    var destinationPopup = $(this).attr('href')
    $(destinationPopup).addClass('show')
  })
  $('.popup__body').click(function (e) {
    e.preventDefault()
    // e.stopPropagation();
    let destinationPopup = document.querySelector('.popup')
    if (e.target.nodeName === 'I') {
      $(destinationPopup).removeClass('show')
    }
  })
})(jQuery)
// 
// Popup registration
const btn = document.querySelector('.register-btn');
const popup = document.querySelector('.popup-click');

btn.addEventListener('click', (e) => {
  popup.classList.add('open');
  let btnPopup = document.querySelector('.btn');
  btnPopup.classList.remove('open');
  // save data form
  let formData = {};
  const form = document.querySelector('form');
  let LS = localStorage;
  form.addEventListener('input', function (event) {
    formData[event.target.name] = event.target.value;
    console.log(formData);
    LS.setItem('formData', JSON.stringify(formData))
  });
  // recover data
  if (LS.getItem('formData')) {
    formData = JSON.parse(LS.getItem('formData'));
    for (let key in formData) {
      form.elements[key].value = formData[key];
    }
  }
})
console.log(popup);
console.log(btn);
// ++++++
