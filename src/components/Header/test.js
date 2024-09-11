/*function toggleMobileNav(openClose?: string): void { const body = document.body; const header = document.querySelector('#gsiHeader');

if (header.classList.contains('gsi-expanded') || openClose === 'close') { header.classList.remove('gsi-expanded'); body.classList.remove('modal-open'); } else { closeNavSearch();

;
} }

function toggleDesktopDropdown(event: JQuery.TriggeredEvent, showHide: 'show' | 'hide') { // Only toggle when nav is in desktop layout // For mobile, default bootstrap click is used if (window.innerWidth < navBreakpoint) { return; }

const $target = $(event.target); const $dropdown = $target.closest('.dropdown'); const $button = $dropdown.find('.gsi-mega-dropdown-toggle'); if (showHide === 'hide' && $dropdown.hasClass('show')) { $button.dropdown(showHide).attr('aria-expanded', 'false'); } else if (!$dropdown.hasClass('show')) { $button.dropdown(showHide); } // Dropdown forces a focus event // which isn't needed for the mouse event if (event.type === 'mouseover') $button.trigger('blur'); }

$(() => { // Hamburger menu toggles const $navToggles = $('.js-toggle-navbar');

// Make sure mobile nav is closed on nav search open $('#gsiNavSearch').on('open.gsi.navSearch', () => { toggleMobileNav('close'); });

$navToggles.on('click', (e) => { e.preventDefault(); toggleMobileNav(); });

$(window).on('resize', (e) => { const $header = $('#gsiHeader'); if (e.target.innerWidth >= navBreakpoint && $header.hasClass('gsi-expanded')) { toggleMobileNav(); } });

const _toggleDesktopDropdown = debounce(toggleDesktopDropdown, 100);

// Add hover and focus events to open nav dropdowns $('.nav-item.dropdown').on('mouseover', (e) => _toggleDesktopDropdown(e, 'show')); $('.nav-item.dropdown').on('mouseout', (e) => _toggleDesktopDropdown(e, 'hide'));

// Leave dropdowns open when clicked inside $(document).on('click', '.nav-item.dropdown > .dropdown-menu', (e) => { e.stopPropagation(); }); })*/