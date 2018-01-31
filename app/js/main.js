import hello from './lib/hello.js';
import $ from 'jquery';
import '../libs/bootstrap/dist/js/bootstrap.bundle.js';
import '../libs/slick-carousel/slick/slick.js';
import Waypoint from '../libs/waypoints/lib/jquery.waypoints.js';

hello();

$(window).ready(function() {

  $('section').css('opacity', 0);

  $('.slider__wrapper').slick({
    nextArrow: '.arrow__next',
    prevArrow: '.arrow__prev',
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true,
  });

  $('.goup').click(function(e) {

    e.preventDefault();

    $('html, body').animate({ scrollTop: 0 }, 'slow');

    return false;

  });

});

$(window).on('load', function() {

  $.when($('.loader').delay(400).fadeOut('slow'))

    .done(function() {

      $.when($('.loader_inner').fadeOut())

        .done(function() {

          $('section').each(function() {
            var self = $(this);
            $(this).waypoint({
              handler: function() {
                self.addClass('animated fade').css('opacity', 1);;
              }, offset: '65%'
            });
          });

        });

    });
});

$(window).scroll(function() {

  var wScroll = $(this).scrollTop();

  if (wScroll > 500) {
    $('.goup').addClass('is-active');
  }
  else {
    $('.goup').removeClass('is-active');
  };

});
