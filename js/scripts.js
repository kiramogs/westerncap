// Shared navbar dropdown behavior for all pages
// Uses hover with a small delay to avoid flicker and ensures only one dropdown is open
;(function(){
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  if (!window.jQuery) return;
  var $ = window.jQuery;

  $(function() {
    var closeTimers = {};

    // Disable Bootstrap's default click toggle so hover works reliably
    $('.navbar .dropdown-toggle').attr('data-bs-toggle', '').attr('data-toggle', '');

    $('.navbar .dropdown').each(function(index) {
      var $dropdown = $(this);
      var dropdownId = 'dropdown_' + index;

      $dropdown.on('mouseenter', function() {
        if (closeTimers[dropdownId]) {
          clearTimeout(closeTimers[dropdownId]);
          delete closeTimers[dropdownId];
        }

        // Close others
        $('.navbar .dropdown').not($dropdown).each(function() {
          $(this).find('.dropdown-menu').removeClass('show');
          $(this).find('.dropdown-toggle').removeClass('show').attr('aria-expanded', 'false');
        });

        // Open this one
        $dropdown.find('.dropdown-menu').addClass('show');
        $dropdown.find('.dropdown-toggle').addClass('show').attr('aria-expanded', 'true');
      });

      $dropdown.on('mouseleave', function() {
        closeTimers[dropdownId] = setTimeout(function() {
          $dropdown.find('.dropdown-menu').removeClass('show');
          $dropdown.find('.dropdown-toggle').removeClass('show').attr('aria-expanded', 'false');
        }, 200);
      });
    });

    // Close dropdowns on ESC for accessibility
    $(document).on('keydown', function(evt){
      if (evt.key === 'Escape') {
        $('.navbar .dropdown-menu').removeClass('show');
        $('.navbar .dropdown-toggle').removeClass('show').attr('aria-expanded', 'false');
      }
    });
  });
})();

