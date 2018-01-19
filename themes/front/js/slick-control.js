/**
 * @file
 * Slick.js slider control
 *
 */
(function ($, Drupal) {

  "use strict";

  Drupal.behaviors.slickit = {
    attach: function (context, settings) {
      $('.node--type-home .field-node--field-images .field-items').slick({
        dots: false,
        prevArrow: '<button type="button" class="slick-prev" style="left:0;"></button>',
        nextArrow: '<button type="button" class="slick-next"></button>',
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000
      });
    }
  };

})(jQuery, Drupal);
