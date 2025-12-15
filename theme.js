(function() {
    var root = document.documentElement;
    var STORAGE_KEY = 'theme';

    var MOON_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>';
    var SUN_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>';

    function applyTheme(theme) {
        if (theme === 'dark') {
            root.setAttribute('data-theme', 'dark');
        } else {
            root.removeAttribute('data-theme');
        }
        updateIcon(theme);
    }

    function updateIcon(theme) {
        try {
            var isDark = theme === 'dark';
            var iconEls = document.querySelectorAll('#themeIcon');
            iconEls.forEach(function(el) { el.innerHTML = isDark ? SUN_SVG : MOON_SVG; });
            var toggles = document.querySelectorAll('[data-theme-toggle]');
            toggles.forEach(function(btn) { btn.setAttribute('aria-pressed', isDark); });
        } catch (e) {}
    }

    function getPreferredTheme() {
        var stored = localStorage.getItem(STORAGE_KEY);
        if (stored === 'dark' || stored === 'light') return stored;
        var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        return prefersDark ? 'dark' : 'light';
    }

    function setTheme(theme) {
        localStorage.setItem(STORAGE_KEY, theme);
        applyTheme(theme);
    }

    var initial = getPreferredTheme();
    applyTheme(initial);

    window.toggleTheme = function() {
        var current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        var next = current === 'dark' ? 'light' : 'dark';
        setTheme(next);
    };
})();
