/**
 * @file
 * Mobile Navigation
 *
 */
(function ($, Drupal) {

"use strict";

    Drupal.behaviors.tablet_touch = {
       attach: function (context, settings) {
        $( 'nav#block-front-main-menu ul.menu li.menu-item--expanded' ).doubleTapToGo();
       }
    };



  Drupal.behaviors.mobile_nav = {
    attach: function (context, settings) {
      $('body').once().each(function () {
        // Mobile Menu Button
        $(document).on('click', '#nav-open-btn',function () {
            $('body').toggleClass('menu-active');
            return false;
        });
        // Search TODO update affected classes
        $(document).on('focusin', '#search-block-form', function () {
            $('body').addClass('search-active');
        });
        $(document).on('click touchstart', 'main', function () {
            $('body').removeClass('search-active');
            $('#search-block-form #edit-keys').blur();
        });
        $(document).on('click touchstart', '.region-primary-menu', function () {
            $('body').removeClass('search-active');
            $('#search-block-form #edit-keys').blur();
        });
      });
    }
  };

  // Wrap tables to accomodate mobile table solution.
 Drupal.behaviors.table_wrapper = {
   attach: function (context) {
     $('table').wrap('<div class="responsive-table"></div>');
   }
 }



})(jQuery, Drupal);
