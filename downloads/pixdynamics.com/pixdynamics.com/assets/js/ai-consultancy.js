document.addEventListener('DOMContentLoaded', () => {
  const track = document.querySelector('.slider-track');
  const cards = document.querySelectorAll('.slider-card');
  const navContainer = document.querySelector('.slider-nav');
  const sliderContainer = document.querySelector('.slider-container');

  if (!sliderContainer || !track || !navContainer) {
    console.error('Required DOM elements not found.');
    return;
  }

  let currentIndex = 0;

  const calculateVisibleCards = () => {
    const containerWidth = sliderContainer.offsetWidth;

    if (containerWidth < 576) return 1; // Mobile screens
    if (containerWidth < 992) return 2; // Tablet screens
    return 3; // Desktop screens
  };

  const generateBullets = () => {
    navContainer.innerHTML = '';
    const visibleCards = calculateVisibleCards();
    const totalPages = Math.ceil(cards.length / visibleCards);

    for (let i = 0; i < totalPages; i++) {
      const bullet = document.createElement('div');
      bullet.className = 'nav-bullet';
      if (i === 0) bullet.classList.add('active');
      bullet.dataset.index = i;
      navContainer.appendChild(bullet);
    }
  };

  const updateSlider = (index) => {
    const visibleCards = calculateVisibleCards();
    const cardWidthPercentage = 100 / visibleCards;
    const totalCards = cards.length;
    const totalVisible = visibleCards * index;

    // Wrap-around logic: Always display 3 cards
    let offsetCards = [];
    for (let i = 0; i < visibleCards; i++) {
      const cardIndex = (totalVisible + i) % totalCards; // Circular indexing
      offsetCards.push(cards[cardIndex].outerHTML);
    }

    // Update slider with cloned visible cards
    track.innerHTML = offsetCards.join('');
    track.style.transform = `translateX(0%)`;

    // Update active bullet
    const bullets = document.querySelectorAll('.nav-bullet');
    bullets.forEach((bullet, i) => {
      bullet.classList.toggle('active', i === index);
    });
  };

  const addBulletListeners = () => {
    const bullets = document.querySelectorAll('.nav-bullet');
    bullets.forEach((bullet) => {
      bullet.addEventListener('click', (e) => {
        const targetIndex = parseInt(e.target.dataset.index, 10);
        currentIndex = targetIndex;
        updateSlider(currentIndex);
      });
    });
  };

  const initializeSlider = () => {
    const visibleCards = calculateVisibleCards();
    const cardWidthPercentage = 100 / visibleCards;

    track.style.width = `${cards.length * cardWidthPercentage}%`;

    generateBullets();
    addBulletListeners();
    updateSlider(0);
  };

  window.addEventListener('resize', initializeSlider);

  initializeSlider();
});
