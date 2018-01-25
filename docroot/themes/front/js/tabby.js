/**
 * @file
 * tabs!
 *
 */
(function ($) {

    "use strict";

   $(document).ready(function() {
    // Make a list for the tabs
    $('.view-about-news .view-content').prepend(
      $('<ul>', { 'class': 'view-tabs' })
    );
    // iterate over our views groupings
    var $groupRow = 0;
    $('.view-grouping').each(function () {
      $groupRow++;
      // Add IDs to view groupings
      $(this).attr('id', 'tab-'+$groupRow);
      // Add to the tab list
      $('ul.view-tabs').append(
        $('<li>').append(
          $('<a>', {
            text: $(this).find('.view-grouping-header').text(),
            href: '#tab-'+$groupRow,
          })
        )
      );
      // Hide the original element
      $(this).find('.view-grouping-header').hide();
    });

    // Make some functional tabs
    $('ul.view-tabs').each(function () {
      var $active,
          $content,
          $links = $(this).find('a');

      $active = $($links.filter('[href="'+location.hash+'"]')[0] || $links[0]);
      $active.addClass('active');

      $content = $($active[0].hash);

      $links.not($active).each(function () {
        $(this.hash).hide();
      });

      // Bind the click event handler
      $('ul.view-tabs a').click(function (e) {
        // Deactivate current active tab
        $active.removeClass('active');
        $content.hide();

        // Update variables with new link and content
        $active = $(this);
        $content = $(this.hash);

        // Make the new tab active
        $active.addClass('active');
        $content.show();

        // disable normal click behavior
        e.preventDefault();
      });
    });
   });

})(jQuery);