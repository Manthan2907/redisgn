/**
 * Minimalist Daily Mail Redesign - Interactive Script
 * Features: Scroll Animations, Live Search, Category/Location Filtering,
 * Reading Progress, Article Reader Modal, Bookmark System, and Floating Dock integration.
 */

document.addEventListener('DOMContentLoaded', () => {
  initCurrentDate();
  initScrollAnimations();
  initReadingProgressBar();
  initSearchModal();
  initCategoryFilter();
  initLocationFilter();
  initArticleReaderModal();
  initBookmarkSystem();
  initReaderSettings();
  exposeNavigationAPIs();
});

/* ==========================================================================
   1. Current Date Display
   ========================================================================== */
function initCurrentDate() {
  const dateEl = document.getElementById('current-date');
  if (!dateEl) return;
  
  const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
  const today = new Date();
  dateEl.textContent = today.toLocaleDateString('en-US', options);
}

/* ==========================================================================
   2. Scroll Fade-In Observer
   ========================================================================== */
function initScrollAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target); // trigger once
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in-on-scroll').forEach(el => observer.observe(el));
}

/* ==========================================================================
   3. Reading Progress Bar
   ========================================================================== */
function initReadingProgressBar() {
  const progressBar = document.getElementById('reading-progress-bar');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  });
}

/* ==========================================================================
   4. Navigation APIs (used by floating dock)
   ========================================================================== */
function exposeNavigationAPIs() {
  window.openSearchModal = () => {
    const searchBtn = document.getElementById('search-btn');
    if (searchBtn) searchBtn.click();
  };

  window.openSavedStories = () => {
    window.openSearchModal();
    setTimeout(() => {
      const input = document.getElementById('search-input');
      if (input) {
        input.value = 'saved';
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }, 100);
  };

  window.filterStoriesByCategory = filterStoriesByCategory;
  window.filterStoriesByLocation = filterStoriesByLocation;
  window.scrollToHome = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    filterStoriesByCategory('all');
    filterStoriesByLocation('all');
  };

  window.toggleShortieBookmark = (shortieId, btnElement) => {
    toggleBookmark(shortieId, btnElement);
  };

  window.shareShortie = (title, url) => {
    const shareUrl = url || window.location.href;
    if (navigator.share) {
      navigator.share({ title, url: shareUrl }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(`${title}\n${shareUrl}`).then(() => {
        showToast('Link copied to clipboard');
      });
    }
  };

  window.addEventListener('filter-category', (e) => {
    filterStoriesByCategory(e.detail?.category || 'all');
  });

  window.addEventListener('filter-location', (e) => {
    filterStoriesByLocation(e.detail?.location || 'all');
  });
}

function filterStoriesByCategory(targetCategory) {
  window.__activeCategoryFilter = (targetCategory || 'all').toLowerCase();
  applyStoryFilters();
}

function filterStoriesByLocation(targetLocation) {
  window.__activeLocationFilter = (targetLocation || 'all').toLowerCase();
  applyStoryFilters();
}

function applyStoryFilters() {
  const category = window.__activeCategoryFilter || 'all';
  const location = window.__activeLocationFilter || 'all';
  const stories = document.querySelectorAll('[data-story]');

  stories.forEach(story => {
    const storyCat = (story.getAttribute('data-category') || '').toLowerCase();
    const storyLoc = (story.getAttribute('data-location') || 'global').toLowerCase();
    const catMatch = category === 'all' || storyCat === category;
    const locMatch = location === 'all' || storyLoc === location;

    if (catMatch && locMatch) {
      story.classList.remove('hidden');
      setTimeout(() => story.classList.add('is-visible'), 50);
    } else {
      story.classList.add('hidden');
    }
  });
}

function initLocationFilter() {
  window.__activeCategoryFilter = 'all';
  window.__activeLocationFilter = 'all';
}

/* ==========================================================================
   5. Live Search Modal & Keyboard Shortcuts
   ========================================================================== */
function initSearchModal() {
  const searchBtn = document.getElementById('search-btn');
  const searchModal = document.getElementById('search-modal');
  const closeSearchBtn = document.getElementById('close-search');
  const searchInput = document.getElementById('search-input');
  const searchResultsContainer = document.getElementById('search-results');

  if (!searchModal) return;

  function openSearch() {
    searchModal.classList.remove('opacity-0', 'pointer-events-none');
    searchModal.querySelector('.modal-content').classList.remove('scale-95');
    document.body.classList.add('overflow-hidden');
    setTimeout(() => searchInput && searchInput.focus(), 100);
  }

  function closeSearch() {
    searchModal.classList.add('opacity-0', 'pointer-events-none');
    searchModal.querySelector('.modal-content').classList.add('scale-95');
    document.body.classList.remove('overflow-hidden');
    if (searchInput) searchInput.value = '';
    resetSearchResults();
  }

  if (searchBtn) searchBtn.addEventListener('click', openSearch);
  if (closeSearchBtn) closeSearchBtn.addEventListener('click', closeSearch);

  searchModal.addEventListener('click', (e) => {
    if (e.target === searchModal) closeSearch();
  });

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      if (searchModal.classList.contains('pointer-events-none')) {
        openSearch();
      } else {
        closeSearch();
      }
    } else if (e.key === 'Escape') {
      closeSearch();
      closeArticleModal();
    }
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      filterStoriesByQuery(query);
    });
  }

  function filterStoriesByQuery(query) {
    if (!searchResultsContainer) return;

    if (!query) {
      resetSearchResults();
      return;
    }

    if (query === 'saved') {
      showSavedStoriesInSearch();
      return;
    }

    const allCards = Array.from(document.querySelectorAll('[data-story]'));
    const matchedStories = [];

    allCards.forEach(card => {
      const title = card.getAttribute('data-title') || '';
      const category = card.getAttribute('data-category') || '';
      const dek = card.getAttribute('data-dek') || '';
      
      if (title.toLowerCase().includes(query) || category.toLowerCase().includes(query) || dek.toLowerCase().includes(query)) {
        matchedStories.push({
          title,
          category,
          dek,
          id: card.getAttribute('data-story-id'),
          time: card.getAttribute('data-time') || '5 min read'
        });
      }
    });

    if (matchedStories.length === 0) {
      searchResultsContainer.innerHTML = `
        <div class="py-8 text-center text-stone-500 font-sans-ui text-sm">
          No stories found matching "<span class="font-semibold text-stone-800">${escapeHtml(query)}</span>"
        </div>
      `;
      return;
    }

    searchResultsContainer.innerHTML = matchedStories.map(story => `
      <div class="p-3 hover:bg-stone-100 rounded cursor-pointer transition flex flex-col gap-1 search-result-item" data-story-id="${story.id}">
        <div class="flex items-center gap-2">
          <span class="tag-pill">${escapeHtml(story.category)}</span>
          <span class="text-xs text-stone-400 font-sans-ui">${escapeHtml(story.time)}</span>
        </div>
        <h4 class="font-serif-headline text-stone-900 font-semibold text-base leading-snug">${escapeHtml(story.title)}</h4>
      </div>
    `).join('');

    searchResultsContainer.querySelectorAll('.search-result-item').forEach(item => {
      item.addEventListener('click', () => {
        const storyId = item.getAttribute('data-story-id');
        closeSearch();
        openStoryModalById(storyId);
      });
    });
  }

  function showSavedStoriesInSearch() {
    const savedBookmarks = JSON.parse(localStorage.getItem('dm_minimal_bookmarks') || '[]');
    if (savedBookmarks.length === 0) {
      searchResultsContainer.innerHTML = `
        <div class="py-8 text-center text-stone-500 font-sans-ui text-sm">
          You haven't saved any stories yet. Click the bookmark icon on any story card to save for later.
        </div>
      `;
      return;
    }

    const allCards = Array.from(document.querySelectorAll('[data-story]'));
    const savedStories = [];

    allCards.forEach(card => {
      const id = card.getAttribute('data-story-id');
      if (savedBookmarks.includes(id)) {
        savedStories.push({
          title: card.getAttribute('data-title') || '',
          category: card.getAttribute('data-category') || '',
          id: id,
          time: card.getAttribute('data-time') || '5 min read'
        });
      }
    });

    searchResultsContainer.innerHTML = `
      <div class="text-xs font-semibold text-stone-600 uppercase tracking-wider mb-2">Saved Stories (${savedStories.length})</div>
      ${savedStories.map(story => `
        <div class="p-3 hover:bg-stone-100 rounded cursor-pointer transition flex flex-col gap-1 search-result-item" data-story-id="${story.id}">
          <div class="flex items-center gap-2">
            <span class="tag-pill">${escapeHtml(story.category)}</span>
            <span class="text-xs text-stone-400 font-sans-ui">${escapeHtml(story.time)}</span>
          </div>
          <h4 class="font-serif-headline text-stone-900 font-semibold text-base leading-snug">${escapeHtml(story.title)}</h4>
        </div>
      `).join('')}
    `;

    searchResultsContainer.querySelectorAll('.search-result-item').forEach(item => {
      item.addEventListener('click', () => {
        const storyId = item.getAttribute('data-story-id');
        closeSearch();
        openStoryModalById(storyId);
      });
    });
  }

  function resetSearchResults() {
    if (!searchResultsContainer) return;
    searchResultsContainer.innerHTML = `
      <div class="text-xs text-stone-400 font-sans-ui uppercase tracking-wider mb-2">Suggested Topics</div>
      <div class="flex flex-wrap gap-2">
        <button class="search-tag-chip px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-sans-ui rounded-full transition">Global Economy</button>
        <button class="search-tag-chip px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-sans-ui rounded-full transition">Climate Technology</button>
        <button class="search-tag-chip px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-sans-ui rounded-full transition">Artificial Intelligence</button>
        <button class="search-tag-chip px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-sans-ui rounded-full transition">Modern Architecture</button>
      </div>
    `;

    searchResultsContainer.querySelectorAll('.search-tag-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const text = chip.textContent;
        if (searchInput) {
          searchInput.value = text;
          filterStoriesByQuery(text);
        }
      });
    });
  }
}

/* ==========================================================================
   6. Category Filter (invoked by floating dock)
   ========================================================================== */
function initCategoryFilter() {
  window.addEventListener('category-filter-ready', () => {
    filterStoriesByCategory('all');
  });
}

/* ==========================================================================
   7. Article Reader Modal
   ========================================================================== */
const mockArticleDatabase = {
  'hero-1': {
    category: 'SPECIAL REPORT',
    title: 'The Silent Reshaping of Global Maritime Commerce',
    dek: 'Deep inside autonomous port terminals and quiet Arctic routes, a frictionless revolution is redefining how humanity moves goods across oceans.',
    author: 'Elena Rostova',
    role: 'Senior Global Affairs Correspondent',
    date: 'August 31, 2026',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    caption: 'An automated container vessel navigates the expanded deepwater channel outside Rotterdam at twilight.',
    body: [
      'In the quiet early hours along the North Sea, container vessel Titan VII slides past Rotterdam’s breakwaters without a whisper of diesel exhaust. Guided by real-time satellite telemetry and neural bathymetric scanning, its zero-emission electric motors adjust pitch by half-degree increments to offset tidal currents.',
      'What is happening in Rotterdam is not an isolated experiment. Over the past three years, maritime logistics has undergone its most profound transition since the advent of standard steel shipping containers in the 1950s.',
      'Economists point to three converging factors: high-capacity solid-state battery banks, automated gantry cranes operating with millimeter precision, and predictive weather algorithms that enable ships to navigate optimal swell vectors.',
      '“We used to think of shipping as brute force—massive engines burning heavy fuel oil against ocean tides,” explains Dr. Marcus Vance of the Maritime Policy Institute. “Today, it is a dance of precise calculations. Fuel consumption across transatlantic routes has dropped by 42% since 2024.”',
      'Yet this quiet revolution brings new geopolitical questions. As traditional fueling ports adapt or fade, new logistical hubs are emerging along unexpected coastlines. For readers accustomed to the loud headlines of supply chain crises, the real story of 2026 is how seamlessly the world’s lifelines have rebuilt themselves.'
    ]
  },
  'sec-1': {
    category: 'POLITICS',
    title: 'The New Diplomacy of Renewable Grid Alliances',
    dek: 'Cross-border high-voltage cables are creating unprecedented economic ties across continents.',
    author: 'Julian Thorne',
    role: 'Energy & Geopolitics Analyst',
    date: 'August 31, 2026',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1200&q=80',
    caption: 'High-voltage subsea transmission pylons linking regional clean energy grids.',
    body: [
      'As solar arrays in North Africa and offshore wind turbines in the North Sea peak at alternating hours, European and Mediterranean power grids are fusing into a unified energy market.',
      'The diplomatic implications are immediate. Nations that once negotiated oil import quotas are now trading solar gigawatts in ten-minute spot auctions.',
      'This interconnectedness creates a new form of peace dividend: when grid stability relies on your neighbor’s wind conditions, cross-border cooperation becomes a matter of national security.'
    ]
  },
  'sec-2': {
    category: 'TECHNOLOGY',
    title: 'Silicon and Stone: The Rise of Bio-Architectural Computing',
    dek: 'Data centers engineered with living mycelium insulation reduce cooling demands by 60 percent.',
    author: 'Sarah Chen',
    role: 'Technology Editor',
    date: 'August 31, 2026',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    caption: 'An experimental bio-insulated server hall in Reykjavik utilizing geothermal thermal Sinks.',
    body: [
      'The staggering energy demands of artificial intelligence have led researchers to an improbable partner: biological materials. In Iceland and Sweden, new server facilities incorporate engineered mycelium blocks that naturally absorb waste heat and convert it into structural rigidity.',
      'By replacing synthetic insulation with organic cellular structures, engineers have reduced ambient cooling requirements while creating fully biodegradable building envelopes.'
    ]
  },
  'sec-3': {
    category: 'CULTURE',
    title: 'The Renaissance of Paper: Why Physical Media Holds Strong',
    dek: 'In an age of hyper-curated digital streams, tangible print publications are seeing record subscriber growth among Gen Z readers.',
    author: 'Arthur Pendelton',
    role: 'Cultural Critic',
    date: 'August 31, 2026',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80',
    caption: 'An independent print shop in Kyoto crafting limited-run editorial magazines.',
    body: [
      'There is a tactile calmness to turning a printed page that no glass screen can replicate. Across major cities, independent newsstands are reporting a resurgence in readership for long-form quarterly journals and daily broadsheets.',
      'Readers cite digital fatigue and the desire for un-algorithmic discovery as primary reasons for their return to print.'
    ]
  },
  'sec-4': {
    category: 'BUSINESS',
    title: 'Central Banks Navigate the Shift to Decentralized Settlement',
    dek: 'How sovereign monetary authorities are incorporating instant ledger technology into daily operations.',
    author: 'Victoria Sterling',
    role: 'Financial Markets Correspondent',
    date: 'August 31, 2026',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
    caption: 'Trading desk monitors reflecting liquidity shifts during early European sessions.',
    body: [
      'Interbank settlements that previously took days to clear now finalize in milliseconds. Central banks across twenty-four currency zones have harmonized protocols for instant sovereign settlements.',
      'The result is decreased counterparty risk and billions in unlocked liquidity for international commercial trade.'
    ]
  },
  'sec-5': {
    category: 'SCIENCE',
    title: 'Deep Sea Exploration Uncovers Ancient Hydrothermal Ecosystems',
    dek: 'Robotic submersibles in the Pacific Basin capture high-definition footage of unknown organisms thriving in extreme thermal vents.',
    author: 'Dr. Liam O’Connor',
    role: 'Oceanographic Correspondent',
    date: 'August 31, 2026',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
    caption: 'Deep-ocean research vehicle deployment off the Mariana Trench.',
    body: [
      'Four thousand meters beneath the surface, far beyond the reach of sunlight, marine biologists have cataloged over sixty new species thriving near geothermal chimneys.',
      'These organisms rely on chemosynthesis rather than photosynthesis, offering astrobiologists vital clues about how life might survive on ocean moons like Europa and Enceladus.'
    ]
  },
  'sec-6': {
    category: 'WORLD',
    title: 'Urban Forestry Mandates Transform European Metropolis Air Quality',
    dek: 'Ten years after urban canopy legislation passed, cities report record reductions in heat island effects and ambient noise.',
    author: 'Claire Dubois',
    role: 'European Correspondent',
    date: 'August 31, 2026',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
    caption: 'A re-wilded avenue boulevard in Lyon featuring indigenous canopy trees.',
    body: [
      'Walking down the major boulevards of Lyon or Hamburg today feels markedly different than a decade ago. Broad canopy oaks and native shrubs now line former traffic lanes, absorbing rainwater and cooling street-level temperatures by up to 5 degrees Celsius during peak summer months.'
    ]
  }
};

function initArticleReaderModal() {
  const modal = document.getElementById('article-modal');
  const closeBtn = document.getElementById('close-article-modal');

  if (!modal) return;

  document.querySelectorAll('[data-story-id]').forEach(element => {
    element.addEventListener('click', (e) => {
      if (e.target.closest('.bookmark-btn')) return;
      const storyId = element.getAttribute('data-story-id');
      openStoryModalById(storyId);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeArticleModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeArticleModal();
  });
}

function openStoryModalById(storyId) {
  const modal = document.getElementById('article-modal');
  if (!modal) return;

  const data = mockArticleDatabase[storyId] || getGenericStoryData(storyId);

  document.getElementById('modal-category').textContent = data.category;
  document.getElementById('modal-title').textContent = data.title;
  document.getElementById('modal-dek').textContent = data.dek;
  document.getElementById('modal-author').textContent = data.author;
  document.getElementById('modal-role').textContent = data.role;
  document.getElementById('modal-date').textContent = data.date;
  document.getElementById('modal-read-time').textContent = data.readTime;
  
  const imgEl = document.getElementById('modal-image');
  if (imgEl) {
    imgEl.src = data.image;
    imgEl.alt = data.title;
  }
  document.getElementById('modal-caption').textContent = data.caption || '';

  const bodyContainer = document.getElementById('modal-body');
  if (bodyContainer && data.body) {
    bodyContainer.innerHTML = data.body.map((p, idx) => `
      <p class="${idx === 0 ? 'dropcap' : ''} mb-5 text-stone-800 leading-relaxed font-serif-body text-lg">${escapeHtml(p)}</p>
    `).join('');
  }

  const modalBookmarkBtn = document.getElementById('modal-bookmark-btn');
  if (modalBookmarkBtn) {
    modalBookmarkBtn.setAttribute('data-story-id', storyId);
    updateBookmarkButtonState(modalBookmarkBtn, storyId);
  }

  modal.classList.remove('opacity-0', 'pointer-events-none');
  modal.querySelector('.modal-content').classList.remove('scale-95');
  document.body.classList.add('overflow-hidden');
  modal.querySelector('.modal-content').scrollTop = 0;
}

function closeArticleModal() {
  const modal = document.getElementById('article-modal');
  if (!modal || modal.classList.contains('pointer-events-none')) return;

  modal.classList.add('opacity-0', 'pointer-events-none');
  modal.querySelector('.modal-content').classList.add('scale-95');
  document.body.classList.remove('overflow-hidden');
}

function getGenericStoryData(storyId) {
  return {
    category: 'NEWS',
    title: 'Editorial Overview & Longform Analysis',
    dek: 'A calm, reader-focused look into emerging developments across culture, policy, and design.',
    author: 'Editorial Board',
    role: 'Daily Mail Editorial Desk',
    date: 'August 31, 2026',
    readTime: '3 min read',
    image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80',
    caption: 'Editorial photo illustration detailing contemporary news reading experiences.',
    body: [
      'In today’s fast-paced digital environment, clarity and calm editorial focus are paramount. By paring away invasive ads and flashing widgets, readers can engage deeply with reporting.',
      'This reader view exemplifies modern typography, balanced contrast, and thoughtful layout design tailored for sustained reading comfort.'
    ]
  };
}

/* ==========================================================================
   8. Bookmark System
   ========================================================================== */
function initBookmarkSystem() {
  document.querySelectorAll('.bookmark-btn').forEach(btn => {
    const storyId = btn.getAttribute('data-story-id');
    updateBookmarkButtonState(btn, storyId);

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleBookmark(storyId, btn);
    });
  });
}

function toggleBookmark(storyId, btnElement) {
  let savedBookmarks = JSON.parse(localStorage.getItem('dm_minimal_bookmarks') || '[]');
  const index = savedBookmarks.indexOf(storyId);

  if (index > -1) {
    savedBookmarks.splice(index, 1);
    showToast('Removed from saved stories');
  } else {
    savedBookmarks.push(storyId);
    showToast('Saved to your reader list');
  }

  localStorage.setItem('dm_minimal_bookmarks', JSON.stringify(savedBookmarks));

  // Dispatch custom event for Framer Motion floating dock counter
  window.dispatchEvent(new Event('bookmarks-updated'));

  document.querySelectorAll(`.bookmark-btn[data-story-id="${storyId}"]`).forEach(b => {
    updateBookmarkButtonState(b, storyId);
  });
}

function updateBookmarkButtonState(btn, storyId) {
  if (!btn || !storyId) return;
  const savedBookmarks = JSON.parse(localStorage.getItem('dm_minimal_bookmarks') || '[]');
  const isSaved = savedBookmarks.includes(storyId);

  const icon = btn.querySelector('svg');
  if (isSaved) {
    btn.classList.add('text-red-700');
    btn.classList.remove('text-stone-400');
    if (icon) icon.setAttribute('fill', 'currentColor');
    btn.setAttribute('title', 'Remove bookmark');
  } else {
    btn.classList.remove('text-red-700');
    btn.classList.add('text-stone-400');
    if (icon) icon.setAttribute('fill', 'none');
    btn.setAttribute('title', 'Save for later');
  }
}

function showToast(message) {
  let toast = document.getElementById('toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-notification';
    toast.className = 'fixed bottom-24 right-6 z-50 bg-stone-900 text-stone-100 px-4 py-3 rounded shadow-lg text-sm font-sans-ui transition-all duration-300 transform translate-y-10 opacity-0 flex items-center gap-2';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
    </svg>
    <span>${escapeHtml(message)}</span>
  `;

  toast.classList.remove('translate-y-10', 'opacity-0');

  setTimeout(() => {
    toast.classList.add('translate-y-10', 'opacity-0');
  }, 2500);
}

/* ==========================================================================
   9. Reader Font Size Adjuster Controls
   ========================================================================== */
function initReaderSettings() {
  const modalBody = document.getElementById('modal-body');
  const sizeUpBtn = document.getElementById('font-size-up');
  const sizeDownBtn = document.getElementById('font-size-down');

  if (!modalBody || !sizeUpBtn || !sizeDownBtn) return;

  let currentScale = 100;

  sizeUpBtn.addEventListener('click', () => {
    if (currentScale < 130) {
      currentScale += 10;
      modalBody.style.fontSize = `${currentScale}%`;
    }
  });

  sizeDownBtn.addEventListener('click', () => {
    if (currentScale > 80) {
      currentScale -= 10;
      modalBody.style.fontSize = `${currentScale}%`;
    }
  });
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, function(m) {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }[m];
  });
}
