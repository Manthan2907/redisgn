import React, { useState, useEffect } from 'https://cdn.jsdelivr.net/npm/react@18.2.0/+esm';
import { createRoot } from 'https://cdn.jsdelivr.net/npm/react-dom@18.2.0/+esm';
import { motion, AnimatePresence } from 'https://cdn.jsdelivr.net/npm/framer-motion@10.16.4/+esm';

const e = React.createElement;

const CATEGORIES = [
  { id: 'all', label: 'Top Stories' },
  { id: 'world', label: 'World' },
  { id: 'politics', label: 'Politics' },
  { id: 'business', label: 'Business' },
  { id: 'technology', label: 'Tech' },
  { id: 'culture', label: 'Culture' },
  { id: 'science', label: 'Science' }
];

const LOCATIONS = [
  { id: 'all', label: 'All Locations', icon: '🌍' },
  { id: 'global', label: 'Global', icon: '🌐' },
  { id: 'india', label: 'India', icon: '🇮🇳' },
  { id: 'state-region', label: 'State / Region', icon: '📍' },
  { id: 'local', label: 'Local', icon: '🏘️' }
];

const LIVE_INGEST_ITEMS = [
  {
    category: 'SPECIAL REPORT',
    title: 'The Silent Reshaping of Global Maritime Commerce',
    time: '7 min read',
    storyId: 'hero-1',
    summary: 'Autonomous zero-emission electric cargo vessels are quietly transforming transatlantic shipping corridors.'
  },
  {
    category: 'TECHNOLOGY',
    title: 'Silicon and Stone: Bio-Architectural Computing',
    time: '5 min read',
    storyId: 'sec-2',
    summary: 'Data centers engineered with mycelium bio-insulation reduce ambient cooling energy demands by 60%.'
  },
  {
    category: 'POLITICS',
    title: 'Cross-Border Renewable Grid Alliances',
    time: '4 min read',
    storyId: 'sec-1',
    summary: 'European and North African power networks fuse into an integrated clean-energy spot auction market.'
  }
];

const SHORTIES_DATA = [
  {
    id: 'short-1',
    category: 'WORLD',
    headline: 'Pacific Nations Sign Historic Climate Migration Accord',
    summary: 'Twelve island states establish the first binding framework for cross-border relocation as sea levels rise.',
    location: 'Pacific Basin',
    time: '12m ago',
    image: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'short-2',
    category: 'TECHNOLOGY',
    headline: 'India Launches First Quantum-Safe National Grid',
    summary: 'New encryption protocol protects critical infrastructure from next-generation computing threats.',
    location: 'New Delhi, India',
    time: '28m ago',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'short-3',
    category: 'BUSINESS',
    headline: 'Mumbai Startup Raises Record Seed for Agri-Tech Platform',
    summary: 'AI-powered crop monitoring reaches 2 million farmers across Maharashtra within six months of launch.',
    location: 'Mumbai, India',
    time: '45m ago',
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'short-4',
    category: 'SCIENCE',
    headline: 'Breakthrough Battery Doubles EV Range in Cold Climates',
    summary: 'Solid-state cells maintain 95% capacity at sub-zero temperatures, solving a major adoption barrier.',
    location: 'Oslo, Norway',
    time: '1h ago',
    image: 'https://images.unsplash.com/photo-1593941707889-a5bba14938b7?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'short-5',
    category: 'CULTURE',
    headline: 'Venice Film Festival Opens with Solar-Powered Pavilion',
    summary: 'Kinetic architecture generates its own electricity while hosting the world premiere of an indie documentary.',
    location: 'Venice, Italy',
    time: '2h ago',
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80'
  }
];

function PinIcon({ className }) {
  return e(
    'svg',
    { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
    e('path', {
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      strokeWidth: '2',
      d: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
    }),
    e('path', {
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      strokeWidth: '2',
      d: 'M15 11a3 3 0 11-6 0 3 3 0 016 0z'
    })
  );
}

function ShortiesView({ onClose, savedIds, onToggleSave }) {
  const handleShare = (item) => {
    if (window.shareShortie) {
      window.shareShortie(item.headline);
    }
  };

  return e(
    'div',
    { className: 'shorties-view' },
    e(
      'button',
      {
        className: 'shorties-close-btn',
        onClick: onClose,
        'aria-label': 'Close Shorties'
      },
      e(
        'svg',
        { className: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
        e('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '2', d: 'M6 18L18 6M6 6l12 12' })
      )
    ),
    e(
      'div',
      { className: 'shorties-feed no-scrollbar' },
      SHORTIES_DATA.map((item, idx) =>
        e(
          'article',
          {
            key: item.id,
            className: 'shortie-slide',
            'data-shortie-id': item.id
          },
          e(
            'div',
            { className: 'shortie-slide-bg' },
            e('img', { src: item.image, alt: '', loading: idx < 2 ? 'eager' : 'lazy' })
          ),
          e(
            'div',
            { className: 'shortie-slide-content' },
            e('span', { className: 'shortie-category' }, item.category),
            e('h2', { className: 'shortie-headline' }, item.headline),
            e('p', { className: 'shortie-summary' }, item.summary),
            e(
              'div',
              { className: 'shortie-meta' },
              e('span', null, '📍 ', item.location),
              e('span', null, '•'),
              e('time', null, item.time)
            ),
            e(
              'div',
              { className: 'shortie-actions' },
              e(
                'button',
                {
                  className: `shortie-action-btn bookmark-btn ${savedIds.includes(item.id) ? 'saved' : ''}`,
                  'data-story-id': item.id,
                  onClick: (ev) => {
                    ev.stopPropagation();
                    onToggleSave(item.id);
                  },
                  title: savedIds.includes(item.id) ? 'Remove bookmark' : 'Save story'
                },
                e(
                  'svg',
                  {
                    className: 'w-5 h-5',
                    fill: savedIds.includes(item.id) ? 'currentColor' : 'none',
                    stroke: 'currentColor',
                    viewBox: '0 0 24 24'
                  },
                  e('path', {
                    strokeLinecap: 'round',
                    strokeLinejoin: 'round',
                    strokeWidth: '2',
                    d: 'M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z'
                  })
                )
              ),
              e(
                'button',
                {
                  className: 'shortie-action-btn',
                  onClick: () => handleShare(item),
                  title: 'Share story'
                },
                e(
                  'svg',
                  { className: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
                  e('path', {
                    strokeLinecap: 'round',
                    strokeLinejoin: 'round',
                    strokeWidth: '2',
                    d: 'M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z'
                  })
                )
              )
            )
          ),
          idx === 0 &&
            e('span', { className: 'shorties-scroll-hint' }, 'Scroll for more')
        )
      )
    )
  );
}

function FloatingLiquidDock() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeLocation, setActiveLocation] = useState('all');
  const [activeView, setActiveView] = useState('home');
  const [savedCount, setSavedCount] = useState(0);
  const [savedIds, setSavedIds] = useState([]);
  const [showSettingsPopover, setShowSettingsPopover] = useState(false);
  const [showCategoriesPopover, setShowCategoriesPopover] = useState(false);
  const [showLocationPopover, setShowLocationPopover] = useState(false);
  const [showIngestModal, setShowIngestModal] = useState(false);
  const [showShorties, setShowShorties] = useState(false);
  const [hoveredButton, setHoveredButton] = useState(null);
  const [fontSize, setFontSize] = useState(100);
  const [activeTheme, setActiveTheme] = useState('light');
  const [activeFont, setActiveFont] = useState('serif');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  useEffect(() => {
    const updateBookmarks = () => {
      try {
        const bookmarks = JSON.parse(localStorage.getItem('dm_minimal_bookmarks') || '[]');
        setSavedCount(bookmarks.length);
        setSavedIds(bookmarks);
      } catch {
        setSavedCount(0);
        setSavedIds([]);
      }
    };

    updateBookmarks();
    window.addEventListener('storage', updateBookmarks);
    window.addEventListener('bookmarks-updated', updateBookmarks);
    return () => {
      window.removeEventListener('storage', updateBookmarks);
      window.removeEventListener('bookmarks-updated', updateBookmarks);
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle('shorties-active', showShorties);
    return () => document.body.classList.remove('shorties-active');
  }, [showShorties]);

  const closeAllPopovers = () => {
    setShowSettingsPopover(false);
    setShowCategoriesPopover(false);
    setShowLocationPopover(false);
  };

  const handleCategorySelect = (categoryId) => {
    setActiveCategory(categoryId);
    setActiveView('home');
    setShowShorties(false);
    closeAllPopovers();
    if (window.filterStoriesByCategory) {
      window.filterStoriesByCategory(categoryId);
    }
    const main = document.getElementById('main-news');
    if (main && window.scrollY > 300) {
      main.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLocationSelect = (locationId) => {
    setActiveLocation(locationId);
    setActiveView('home');
    setShowShorties(false);
    setShowLocationPopover(false);
    if (window.filterStoriesByLocation) {
      window.filterStoriesByLocation(locationId);
    }
  };

  const goHome = () => {
    setActiveView('home');
    setShowShorties(false);
    closeAllPopovers();
    if (window.scrollToHome) window.scrollToHome();
  };

  const openSearch = () => {
    closeAllPopovers();
    if (window.openSearchModal) window.openSearchModal();
  };

  const openBookmarks = () => {
    closeAllPopovers();
    if (window.openSavedStories) window.openSavedStories();
  };

  const openStory = (storyId) => {
    const card = document.querySelector(`[data-story-id="${storyId}"]`);
    if (card) card.click();
    setShowIngestModal(false);
  };

  const openShorties = () => {
    closeAllPopovers();
    setShowShorties(true);
    setActiveView('shorties');
  };

  const closeShorties = () => {
    setShowShorties(false);
    setActiveView('home');
  };

  const toggleShortieSave = (shortieId) => {
    const btn = document.querySelector(`.shortie-action-btn[data-story-id="${shortieId}"]`);
    if (window.toggleShortieBookmark && btn) {
      window.toggleShortieBookmark(shortieId, btn);
    }
    try {
      const bookmarks = JSON.parse(localStorage.getItem('dm_minimal_bookmarks') || '[]');
      setSavedIds(bookmarks);
      setSavedCount(bookmarks.length);
    } catch { /* noop */ }
  };

  const changeFontSize = (delta) => {
    const newSize = Math.min(130, Math.max(70, fontSize + delta));
    setFontSize(newSize);
    const upBtn = document.getElementById('font-size-up');
    const downBtn = document.getElementById('font-size-down');
    if (delta > 0 && upBtn) upBtn.click();
    if (delta < 0 && downBtn) downBtn.click();
  };

  const handleThemeChange = (theme) => {
    setActiveTheme(theme);
    document.body.classList.remove('theme-warm', 'theme-dark');
    if (theme === 'warm') document.body.classList.add('theme-warm');
    else if (theme === 'dark') document.body.classList.add('theme-dark');
  };

  const handleFontChange = (font) => {
    setActiveFont(font);
    if (font === 'sans') document.body.classList.add('font-mode-sans');
    else document.body.classList.remove('font-mode-sans');
  };

  const toggleAudioReader = () => {
    const newState = !isPlayingAudio;
    setIsPlayingAudio(newState);
    if ('speechSynthesis' in window) {
      if (newState) {
        window.speechSynthesis.cancel();
        const topStory = document.querySelector('[data-story]');
        const textToRead = topStory
          ? `Top Story: ${topStory.getAttribute('data-title') || ''}. ${topStory.getAttribute('data-dek') || ''}`
          : 'Now reading Daily Mail Minimalist Briefing.';
        const utterance = new SpeechSynthesisUtterance(textToRead);
        utterance.rate = 1.0;
        utterance.onend = () => setIsPlayingAudio(false);
        window.speechSynthesis.speak(utterance);
      } else {
        window.speechSynthesis.cancel();
      }
    }
  };

  const dockIconBtn = (id, label, onClick, iconEl, extraClass = '') =>
    e(
      motion.button,
      {
        whileHover: { scale: 1.12, y: -2 },
        whileTap: { scale: 0.92 },
        onClick,
        onMouseEnter: () => setHoveredButton(id),
        onMouseLeave: () => setHoveredButton(null),
        className: `glass-icon-btn relative p-2 sm:p-2.5 rounded-full focus:outline-none text-stone-700 dark:text-stone-200 hover:text-[#C8102E] ${activeView === id ? 'dock-nav-btn-active' : ''} ${extraClass}`,
        'aria-label': label
      },
      iconEl,
      e(
        AnimatePresence,
        null,
        hoveredButton === id &&
          e(
            motion.div,
            {
              initial: { opacity: 0, y: 8 },
              animate: { opacity: 1, y: 0 },
              exit: { opacity: 0, y: 8 },
              className: 'absolute bottom-12 left-1/2 -translate-x-1/2 glass-dock-tooltip text-[10px] font-sansUI font-semibold px-2.5 py-1 rounded-full shadow-lg whitespace-nowrap pointer-events-none z-50'
            },
            label
          )
      )
    );

  return e(
    React.Fragment,
    null,

    showShorties &&
      e(ShortiesView, {
        onClose: closeShorties,
        savedIds,
        onToggleSave: toggleShortieSave
      }),

    e(
      'div',
      { className: 'fixed bottom-4 sm:bottom-5 left-0 right-0 z-[55] pointer-events-none flex flex-col items-center px-2 sm:px-4' },

      /* LIVE INGEST MODAL */
      e(
        AnimatePresence,
        null,
        showIngestModal &&
          e(
            motion.div,
            {
              key: 'ingest-modal',
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              exit: { opacity: 0 },
              onClick: () => setShowIngestModal(false),
              className: 'digest-modal-backdrop fixed inset-0 pointer-events-auto flex items-end sm:items-center justify-center p-4'
            },
            e(
              motion.div,
              {
                initial: { opacity: 0, scale: 0.94, y: 24 },
                animate: { opacity: 1, scale: 1, y: 0 },
                exit: { opacity: 0, scale: 0.94, y: 24 },
                transition: { type: 'spring', stiffness: 380, damping: 28 },
                onClick: (ev) => ev.stopPropagation(),
                className: 'digest-modal-panel w-full max-w-lg rounded-3xl p-6 font-sansUI'
              },
              e(
                'div',
                { className: 'flex items-center justify-between pb-4 border-b digest-divider' },
                e(
                  'div',
                  { className: 'flex items-center gap-2.5' },
                  e('span', { className: 'live-ingest-badge px-2.5 py-1 rounded-full text-[10px] uppercase' }, 'LIVE INGEST'),
                  e('h3', { className: 'digest-heading font-serifHeadline text-lg' }, 'Today\u2019s Essential Briefing')
                ),
                e(
                  'button',
                  {
                    onClick: () => setShowIngestModal(false),
                    className: 'p-1.5 digest-meta hover:text-stone-900 dark:hover:text-white rounded-full transition'
                  },
                  e(
                    'svg',
                    { className: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
                    e('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '2', d: 'M6 18L18 6M6 6l12 12' })
                  )
                )
              ),
              e(
                'div',
                { className: 'py-4 space-y-1' },
                LIVE_INGEST_ITEMS.map((item, idx) =>
                  e(
                    'div',
                    {
                      key: item.storyId,
                      onClick: () => openStory(item.storyId),
                      className: `digest-item cursor-pointer group p-3 rounded-xl transition ${idx > 0 ? 'border-t digest-divider pt-4' : ''}`
                    },
                    e(
                      'div',
                      { className: 'flex items-center justify-between text-[11px] digest-meta mb-1.5' },
                      e('span', { className: 'font-bold text-[#C8102E] tracking-wide uppercase text-[10px]' }, item.category),
                      e('span', null, item.time)
                    ),
                    e('h4', { className: 'digest-heading font-serifHeadline font-semibold text-sm sm:text-base leading-snug group-hover:text-[#C8102E] transition-colors' }, item.title),
                    e('p', { className: 'digest-body-text text-xs mt-1.5 line-clamp-2 leading-relaxed' }, item.summary)
                  )
                )
              ),
              e(
                'div',
                { className: 'pt-3 border-t digest-divider flex items-center justify-between' },
                e(
                  'button',
                  {
                    onClick: toggleAudioReader,
                    className: 'flex items-center gap-2 text-xs font-semibold digest-heading hover:text-[#C8102E] transition'
                  },
                  e(
                    'span',
                    { className: 'w-7 h-7 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-[#C8102E]' },
                    isPlayingAudio ? '\u2758\u2758' : '\u25B6'
                  ),
                  isPlayingAudio ? 'Pause Audio Brief' : 'Listen to 2-Min Audio Brief'
                ),
                e('span', { className: 'text-[11px] digest-meta font-medium' }, 'Updated Continuously')
              )
            )
          )
      ),

      /* CATEGORIES POPOVER */
      e(
        AnimatePresence,
        null,
        showCategoriesPopover &&
          e(
            motion.div,
            {
              key: 'categories-popover',
              initial: { opacity: 0, y: 12, scale: 0.96 },
              animate: { opacity: 1, y: 0, scale: 1 },
              exit: { opacity: 0, y: 12, scale: 0.96 },
              className: 'pointer-events-auto mb-3 w-64 categories-popover rounded-2xl p-3 shadow-2xl font-sansUI z-[56]'
            },
            e('p', { className: 'text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 px-2 pb-2' }, 'Categories'),
            e(
              'div',
              { className: 'grid grid-cols-2 gap-1' },
              CATEGORIES.map((cat) =>
                e(
                  'button',
                  {
                    key: cat.id,
                    onClick: () => handleCategorySelect(cat.id),
                    className: `px-3 py-2 rounded-lg text-xs font-medium text-left transition ${
                      activeCategory === cat.id
                        ? 'location-option-active'
                        : 'text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-white/10'
                    }`
                  },
                  cat.label
                )
              )
            )
          )
      ),

      /* LOCATION FILTER POPOVER */
      e(
        AnimatePresence,
        null,
        showLocationPopover &&
          e(
            motion.div,
            {
              key: 'location-popover',
              initial: { opacity: 0, y: 12, scale: 0.96 },
              animate: { opacity: 1, y: 0, scale: 1 },
              exit: { opacity: 0, y: 12, scale: 0.96 },
              className: 'pointer-events-auto mb-3 w-56 location-filter-popover rounded-2xl p-3 shadow-2xl font-sansUI z-[56]'
            },
            e('p', { className: 'text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 px-2 pb-2' }, 'Filter by Location'),
            e(
              'div',
              { className: 'space-y-0.5' },
              LOCATIONS.map((loc) =>
                e(
                  'button',
                  {
                    key: loc.id,
                    onClick: () => handleLocationSelect(loc.id),
                    className: `w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-left transition ${
                      activeLocation === loc.id
                        ? 'location-option-active'
                        : 'text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-white/10'
                    }`
                  },
                  e('span', { className: 'text-sm' }, loc.icon),
                  loc.label
                )
              )
            )
          )
      ),

      /* SETTINGS POPOVER */
      e(
        AnimatePresence,
        null,
        showSettingsPopover &&
          e(
            motion.div,
            {
              key: 'settings-popover',
              initial: { opacity: 0, y: 12, scale: 0.96 },
              animate: { opacity: 1, y: 0, scale: 1 },
              exit: { opacity: 0, y: 12, scale: 0.96 },
              className: 'pointer-events-auto mb-3 w-80 liquid-glass-popover rounded-2xl p-4 text-stone-800 dark:text-stone-100 shadow-2xl font-sansUI z-[56]'
            },
            e(
              'div',
              { className: 'flex items-center justify-between pb-3 border-b border-stone-200/80 dark:border-stone-700/80 mb-3' },
              e('span', { className: 'text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-200' }, 'Reader Settings'),
              e(
                'button',
                { onClick: () => setShowSettingsPopover(false), className: 'text-stone-400 hover:text-stone-700 transition' },
                e(
                  'svg',
                  { className: 'w-4 h-4', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
                  e('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '2', d: 'M6 18L18 6M6 6l12 12' })
                )
              )
            ),
            e(
              'div',
              { className: 'space-y-3.5 text-xs' },
              e(
                'div',
                { className: 'space-y-1.5' },
                e('span', { className: 'text-stone-600 dark:text-stone-400 font-medium text-[11px] uppercase tracking-wide' }, 'Theme'),
                e(
                  'div',
                  { className: 'grid grid-cols-3 gap-1.5' },
                  [
                    { id: 'light', label: 'Clean Paper', bg: 'bg-[#FAFAF8] text-stone-900 border-stone-300' },
                    { id: 'warm', label: 'Warm Sepia', bg: 'bg-[#F4EFEA] text-stone-900 border-amber-300' },
                    { id: 'dark', label: 'Dark Slate', bg: 'bg-[#1A1C23] text-stone-100 border-stone-600' }
                  ].map((t) =>
                    e(
                      'button',
                      {
                        key: t.id,
                        onClick: () => handleThemeChange(t.id),
                        className: `py-1.5 px-2 rounded-lg font-medium text-[11px] border transition ${t.bg} ${
                          activeTheme === t.id ? 'ring-2 ring-[#C8102E] font-bold' : 'opacity-80'
                        }`
                      },
                      t.label
                    )
                  )
                )
              ),
              e(
                'div',
                { className: 'flex items-center justify-between pt-2 border-t border-stone-200/60 dark:border-stone-700/60' },
                e('span', { className: 'text-stone-600 dark:text-stone-400 font-medium' }, `Text Scale (${fontSize}%)`),
                e(
                  'div',
                  { className: 'flex items-center gap-1 bg-stone-200/60 dark:bg-stone-800 rounded-lg p-0.5' },
                  e('button', { onClick: () => changeFontSize(-10), className: 'px-2.5 py-1 bg-white dark:bg-stone-700 rounded shadow-sm font-bold' }, 'A-'),
                  e('button', { onClick: () => changeFontSize(10), className: 'px-2.5 py-1 bg-white dark:bg-stone-700 rounded shadow-sm font-bold' }, 'A+')
                )
              ),
              e(
                'div',
                { className: 'flex items-center justify-between pt-2 border-t border-stone-200/60 dark:border-stone-700/60' },
                e('span', { className: 'text-stone-600 dark:text-stone-400 font-medium' }, 'Typeface'),
                e(
                  'div',
                  { className: 'flex items-center gap-1 bg-stone-200/60 dark:bg-stone-800 rounded-lg p-0.5' },
                  e('button', {
                    onClick: () => handleFontChange('serif'),
                    className: `px-2 py-1 rounded text-[11px] font-serifHeadline ${activeFont === 'serif' ? 'bg-white dark:bg-stone-700 font-bold shadow-sm' : 'text-stone-600'}`
                  }, 'Serif'),
                  e('button', {
                    onClick: () => handleFontChange('sans'),
                    className: `px-2 py-1 rounded text-[11px] font-sansUI ${activeFont === 'sans' ? 'bg-white dark:bg-stone-700 font-bold shadow-sm' : 'text-stone-600'}`
                  }, 'Sans')
                )
              ),
              e(
                'div',
                { className: 'pt-2 border-t border-stone-200/60 dark:border-stone-700/60' },
                e(
                  'button',
                  {
                    onClick: openBookmarks,
                    className: 'w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 transition text-stone-800 dark:text-stone-100 font-medium'
                  },
                  e('span', null, 'Saved Stories'),
                  savedCount > 0 &&
                    e('span', { className: 'bg-[#C8102E] text-white text-[10px] font-bold px-2 py-0.5 rounded-full' }, savedCount)
                )
              )
            )
          )
      ),

      /* MAIN FLOATING DOCK */
      e(
        motion.nav,
        {
          initial: { y: 60, opacity: 0 },
          animate: { y: 0, opacity: 1 },
          transition: { type: 'spring', stiffness: 280, damping: 24 },
          className: 'pointer-events-auto liquid-glass-dock-shell rounded-full p-1.5 sm:p-2 flex items-center gap-0.5 sm:gap-1 shadow-2xl max-w-[98vw] overflow-x-auto no-scrollbar'
        },

        /* Home */
        dockIconBtn(
          'home',
          'Home',
          goHome,
          e(
            'svg',
            { className: 'w-4 h-4', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
            e('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '2', d: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' })
          ),
          activeView === 'home' && !showShorties ? 'dock-nav-btn-active' : ''
        ),

        /* Categories */
        dockIconBtn(
          'categories',
          'Categories',
          () => {
            setShowCategoriesPopover(!showCategoriesPopover);
            setShowLocationPopover(false);
            setShowSettingsPopover(false);
          },
          e(
            'svg',
            { className: 'w-4 h-4', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
            e('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '2', d: 'M4 6h16M4 12h16M4 18h7' })
          ),
          showCategoriesPopover ? 'ring-2 ring-[#C8102E]/40' : ''
        ),

        e('div', { className: 'h-5 w-px bg-stone-300/60 dark:bg-stone-600/60 mx-0.5 shrink-0' }),

        /* LIVE INGEST */
        e(
          motion.button,
          {
            whileHover: { scale: 1.06, y: -2 },
            whileTap: { scale: 0.94 },
            onClick: () => {
              closeAllPopovers();
              setShowIngestModal(true);
            },
            onMouseEnter: () => setHoveredButton('ingest'),
            onMouseLeave: () => setHoveredButton(null),
            className: 'glass-spotlight-btn rounded-full px-3 py-1.5 sm:px-4 sm:py-2 flex items-center gap-1.5 text-[10px] sm:text-xs font-bold tracking-wider uppercase shrink-0 focus:outline-none relative'
          },
          e('span', { className: 'w-1.5 h-1.5 rounded-full bg-white animate-pulse' }),
          e('span', null, 'LIVE INGEST'),
          e(
            AnimatePresence,
            null,
            hoveredButton === 'ingest' &&
              e(
                motion.div,
                {
                  initial: { opacity: 0, y: 8 },
                  animate: { opacity: 1, y: 0 },
                  exit: { opacity: 0, y: 8 },
                  className: 'absolute bottom-12 left-1/2 -translate-x-1/2 glass-dock-tooltip text-[10px] font-sansUI font-semibold px-2.5 py-1 rounded-full shadow-lg whitespace-nowrap pointer-events-none z-50'
                },
                'Essential News Brief'
              )
          )
        ),

        e('div', { className: 'h-5 w-px bg-stone-300/60 dark:bg-stone-600/60 mx-0.5 shrink-0' }),

        /* Location Filter */
        dockIconBtn(
          'location',
          'Location Filter',
          () => {
            setShowLocationPopover(!showLocationPopover);
            setShowCategoriesPopover(false);
            setShowSettingsPopover(false);
          },
          e(PinIcon, { className: 'w-4 h-4' }),
          showLocationPopover || (activeLocation !== 'all' && activeLocation !== 'global') ? 'ring-2 ring-[#C8102E]/40' : ''
        ),

        /* Shorties */
        dockIconBtn(
          'shorties',
          'Shorties',
          openShorties,
          e(
            'svg',
            { className: 'w-4 h-4', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
            e('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '2', d: 'M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z' })
          ),
          showShorties ? 'dock-nav-btn-active ring-2 ring-[#C8102E]/40' : ''
        ),

        e('div', { className: 'h-5 w-px bg-stone-300/60 dark:bg-stone-600/60 mx-0.5 shrink-0' }),

        /* Search */
        dockIconBtn(
          'search',
          'Search',
          openSearch,
          e(
            'svg',
            { className: 'w-4 h-4', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
            e('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '2', d: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' })
          )
        ),

        /* Settings / Saved */
        e(
          motion.button,
          {
            whileHover: { scale: 1.12, y: -2 },
            whileTap: { scale: 0.92 },
            onClick: () => {
              setShowSettingsPopover(!showSettingsPopover);
              setShowCategoriesPopover(false);
              setShowLocationPopover(false);
            },
            onMouseEnter: () => setHoveredButton('settings'),
            onMouseLeave: () => setHoveredButton(null),
            className: `glass-icon-btn relative p-2 sm:p-2.5 rounded-full focus:outline-none text-stone-700 dark:text-stone-200 hover:text-[#C8102E] ${showSettingsPopover ? 'ring-2 ring-[#C8102E]/40' : ''}`,
            'aria-label': 'Settings & Saved'
          },
          e(
            'svg',
            { className: 'w-4 h-4', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
            e('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '2', d: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' }),
            e('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '2', d: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z' })
          ),
          savedCount > 0 &&
            e(
              'span',
              { className: 'absolute -top-0.5 -right-0.5 bg-[#C8102E] text-white text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center border border-white dark:border-stone-900' },
              savedCount > 9 ? '9+' : savedCount
            ),
          e(
            AnimatePresence,
            null,
            hoveredButton === 'settings' &&
              e(
                motion.div,
                {
                  initial: { opacity: 0, y: 8 },
                  animate: { opacity: 1, y: 0 },
                  exit: { opacity: 0, y: 8 },
                  className: 'absolute bottom-12 left-1/2 -translate-x-1/2 glass-dock-tooltip text-[10px] font-sansUI font-semibold px-2.5 py-1 rounded-full shadow-lg whitespace-nowrap pointer-events-none z-50'
                },
                'Settings & Saved'
              )
          )
        )
      )
    )
  );
}

const container = document.getElementById('floating-dock-root');
if (container) {
  try {
    const root = createRoot(container);
    root.render(e(FloatingLiquidDock));
  } catch (error) {
    console.error('Error initializing Floating Dock:', error);
  }
}
