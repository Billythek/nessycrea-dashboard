// DATA PRODUITS
const products = [
  {
    id: 1,
    name: "Bougie Vanille Douce",
    type: "Gourmand",
    size: "grand",
    sizeLabel: "Grand (250g)",
    price: 24.99,
    rating: 5,
    description: "Parfum gourmand de vanille Madagascar, doux et enveloppant. Une fragrance classique qui transforme votre intérieur en sanctuary chaleureux.",
    image_url: "https://user-gen-media-assets.s3.amazonaws.com/seedream_images/5ff06277-c960-49ff-88c3-80023c260e0d.png",
    image_color: "#E8D5B7",
    scent: "Vanille"
  },
  {
    id: 2,
    name: "Lavande Provence",
    type: "Relaxation",
    size: "moyen",
    sizeLabel: "Moyen (160g)",
    price: 26.99,
    rating: 5,
    description: "Lavande authentique de Provence pour un moment de détente. Favorise la relaxation et crée une ambiance zen dans votre foyer.",
    image_url: "https://user-gen-media-assets.s3.amazonaws.com/seedream_images/993b049d-633d-48d0-8a2d-71d2ad01fe98.png",
    image_color: "#D4C5E2",
    scent: "Lavande"
  },
  {
    id: 3,
    name: "Eucalyptus Menthe",
    type: "Naturel",
    size: "petit",
    sizeLabel: "Petit (100g)",
    price: 22.99,
    rating: 4,
    description: "Mélange tonifiant d'eucalyptus et menthe fraîche. Parfait pour revitaliser votre espace et purifie l'air naturellement.",
    image_url: "https://user-gen-media-assets.s3.amazonaws.com/seedream_images/3ac59884-6810-456c-9bd2-191aa9ea7368.png",
    image_color: "#B8E6D5",
    scent: "Eucalyptus"
  },
  {
    id: 4,
    name: "Rose Luxe Premium",
    type: "Luxe",
    size: "grand",
    sizeLabel: "Grand (300g)",
    price: 34.99,
    rating: 5,
    description: "Rose ancienne et musc blanc pour une expérience haut de gamme. Notre création la plus prestigieuse pour moments d'exception.",
    image_url: "https://user-gen-media-assets.s3.amazonaws.com/seedream_images/6fbd27a9-ef56-4d6b-9c08-e7b811d2454a.png",
    image_color: "#E8C9D8",
    scent: "Rose"
  },
  {
    id: 5,
    name: "Ambre Boisé",
    type: "Luxe",
    size: "moyen",
    sizeLabel: "Moyen (180g)",
    price: 29.99,
    rating: 5,
    description: "Ambre, cèdre et bois de santal pour une atmosphère chaleureuse. Crée une ambiance sophistiquée et apaisante.",
    image_url: "https://user-gen-media-assets.s3.amazonaws.com/seedream_images/19d07d07-c6e5-4ac2-b8be-45eeb976a10c.png",
    image_color: "#D4B8A0",
    scent: "Ambre"
  },
  {
    id: 6,
    name: "Citron Énergisant",
    type: "Naturel",
    size: "petit",
    sizeLabel: "Petit (90g)",
    price: 21.99,
    rating: 4,
    description: "Citron frais et vivifiant pour démarrer la journée. Recharge d'énergie positive et clarté mentale garanties.",
    image_url: "https://user-gen-media-assets.s3.amazonaws.com/seedream_images/efdb02f6-d0ec-4715-adfa-c0bebc12804b.png",
    image_color: "#FFF8DC",
    scent: "Citron"
  },
  {
    id: 7,
    name: "Cacao Apaisement",
    type: "Gourmand",
    size: "moyen",
    sizeLabel: "Moyen (170g)",
    price: 25.99,
    rating: 5,
    description: "Cacao riche avec notes de vanille et caramel. Pour les amateurs de gourmandises qui cherchent réconfort et chaleur.",
    image_url: "https://user-gen-media-assets.s3.amazonaws.com/seedream_images/e72d4d44-95c9-40da-ad26-96f38b9a5d70.png",
    image_color: "#D2B48C",
    scent: "Cacao"
  },
  {
    id: 8,
    name: "Rose & Violette",
    type: "Relaxation",
    size: "grand",
    sizeLabel: "Grand (280g)",
    price: 27.99,
    rating: 5,
    description: "Rose délicate et violette pour une sérénité totale. Parfum poétique pour les moments introspectifs et la méditation.",
    image_url: "https://user-gen-media-assets.s3.amazonaws.com/seedream_images/d62bf794-ab3e-487f-803d-4f2829015a66.png",
    image_color: "#E6D5E0",
    scent: "Rose-Violette"
  },
];

const testimonials = [
  { name: "Marie Dubois", text: "Ses bougies transforment mon intérieur en un havre de paix. Qualité exceptionnelle et durée de vie impressionnante!", rating: 5 },
  { name: "Jean Pierre", text: "Je recommande vivement NessyCrea. Les parfums sont authentiques et durables. Un vrai savoir-faire artisanal.", rating: 5 },
  { name: "Sophie Martin", text: "Parfait pour les cadeaux! Packaging élégant, produit de qualité supérieure. Devenue ma marque préférée.", rating: 5 }
];

// ACCUEIL: Bougies vedettes 3 premières
function renderVedettes() {
  const vedettes = products.slice(0,3);
  const grid = document.querySelector('.vedettes-grid');
  grid.innerHTML = vedettes.map(product => `
    <div class="card-product fade-in">
      <div class="card-img">${product.image_url ? `<img src="${product.image_url}" alt="${product.name}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='block'"><span style="background: ${product.image_color};display:none;"></span>` : `<span style="background: ${product.image_color}"></span>`}</div>
      <div class="product-type">${product.type}</div>
      <div class="product-name">${product.name}</div>
      <div class="product-price">${product.price.toFixed(2)}&nbsp;€</div>
      <div class="product-rating">${[...Array(product.rating)].map(()=>'<span>★</span>').join('')}</div>
      <div class="product-desc">${product.description}</div>
      <button class="btn-details" data-id="${product.id}">Voir détails</button>
    </div>
  `).join('');
}

// ACCUEIL: Témoignages
function renderTestimonials() {
  const grid = document.querySelector('.testimonials-grid');
  grid.innerHTML = testimonials.map(t => `
    <div class="testimonial-card fade-in">
      <div class="testimonial-rating">${'★'.repeat(t.rating)}</div>
      <div class="testimonial-author">${t.name}</div>
      <div class="testimonial-text">${t.text}</div>
    </div>
  `).join('');
}

// BOUTIQUE: Filtres dynamiques
function filterProducts() {
  const type = document.getElementById('filter-type').value;
  const price = document.getElementById('filter-price').value;
  const size = document.getElementById('filter-size').value;
  return products.filter(p => {
    if(type && p.type !== type) return false;
    if(price === 'low' && p.price >= 25) return false;
    if(price === 'mid' && (p.price < 25 || p.price > 30)) return false;
    if(price === 'high' && p.price <= 30) return false;
    if(size && p.size !== size) return false;
    return true;
  });
}
function renderBoutiqueProducts() {
  const prodList = filterProducts();
  const grid = document.getElementById('products-grid');
  if (prodList.length === 0) {
    grid.innerHTML = '<div style="text-align:center;color:#6B5344;padding:38px;">Aucun produit ne correspond à ces critères.</div>';
    return;
  }
  grid.innerHTML = prodList.map(product => `
    <div class="card-product scale-up">
      <div class="card-img">${product.image_url ? `<img src="${product.image_url}" alt="${product.name}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='block'"><span style="background:${product.image_color};display:none;"></span>` : `<span style="background:${product.image_color}"></span>`}</div>
      <div class="product-size-badge size-${product.size}">${product.sizeLabel}</div>
      <div class="product-type">${product.type}</div>
      <div class="product-name">${product.name}</div>
      <div class="product-price">${product.price.toFixed(2)}&nbsp;€</div>
      <div class="product-rating">${[...Array(product.rating)].map(()=>'<span>★</span>').join('')}</div>
      <div class="product-desc">${product.description}</div>
      <button class="btn-details" data-id="${product.id}">Voir détails</button>
      <button class="btn btn--secondary btn--sm" style="margin-top:8px;" data-addcart="${product.id}"><svg width="18" height="18" style="margin-right:2px;vertical-align:-4px;" fill="none" stroke="#6B5344" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h7.72a2 2 0 0 0 2-1.61l1.38-7.39H6"></path></svg>Ajouter au panier</button>
    </div>
  `).join('');
}
// Modal produit boutique
// Close animation on modal
function animateModalClose(modal) {
  modal.style.opacity = 0;
  modal.style.transform = 'translate(-50%,-50%) scale(0.96)';
  setTimeout(()=>{
    modal.classList.add('hidden');
    modal.style.opacity = '';
    modal.style.transform = '';
    document.getElementById('modal-bg').classList.add('hidden');
  }, 300);
}
function openProductModal(productId) {
  const product = products.find(p=>p.id===parseInt(productId));
  if(!product) return;
  const modal = document.getElementById('product-modal');
  const bg = document.getElementById('modal-bg');
  const cont = document.getElementById('modal-content');
  cont.innerHTML = `
    ${product.image_url ? `<img src="${product.image_url}" alt="${product.name}" class="modal-product-image" style="margin:auto;width:200px;height:200px;object-fit:cover;border-radius:16px;" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='block'"><div class="modal-product-image" style="background:${product.image_color};margin:auto;display:none;"></div>` : `<div class="modal-product-image" style="background:${product.image_color};margin:auto"></div>`}
    <h3 style="color:#6B5344">${product.name}</h3>
    <div class="product-size-badge size-${product.size}" style="margin:12px auto 8px;">${product.sizeLabel}</div>
    <div class="product-type">${product.type}</div>
    <div class="product-price">${product.price.toFixed(2)}&nbsp;€</div>
    <div class="product-rating">${[...Array(product.rating)].map(()=>'<span>★</span>').join('')}</div>
    <p style="margin:13px 0 8px;font-size:1.09em; color:#6B5344c6;">${product.description}</p>
    <div><b>Parfum: </b>${product.scent}</div>
    <div style="margin:6px 0 12px;font-size:0.97em;">Composition: Cire végétale, mèche coton, parfum naturel</div>
    <p><span style="color:#D4A574;font-size:1em;">Avis clients: </span>${'★'.repeat(product.rating)} (${product.rating}/5)</p>
    <button class="btn btn--primary" style="margin-top:16px;" data-addcart="${product.id}">
      <svg width="18" height="18" style="margin-right:4px;" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
        <circle cx="9" cy="21" r="1"></circle>
        <circle cx="20" cy="21" r="1"></circle>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h7.72a2 2 0 0 0 2-1.61l1.38-7.39H6"></path>
      </svg>
      Ajouter au panier
    </button>
  `;
  modal.classList.remove('hidden');
  bg.classList.remove('hidden');
}
function closeProductModal() {
  const modal = document.getElementById('product-modal');
  animateModalClose(modal);
}
// Event listeners cartes
function setupProductCardListeners() {
  document.body.addEventListener('click',function(e){
    if(e.target.matches('.btn-details') && e.target.dataset.id){
      openProductModal(e.target.dataset.id);
    }
    if(e.target.matches('.btn-close-modal') || e.target.closest('.btn-close-modal')){
      closeProductModal();
    }
    if(e.target.id==='modal-bg'){
      closeProductModal();
    }
  });
}
// Filtres change
function setupFilters(){
  ['filter-type','filter-price','filter-size'].forEach(fId=>{
    document.getElementById(fId).addEventListener('change',()=>renderBoutiqueProducts());
  });
}
// NAVIGATION STICKY & SMOOTH SCROLL
function setupNavigation(){
  const header = document.getElementById('header');
  const links = Array.from(document.querySelectorAll('.nav__link'));

  // Add scroll effect to header
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    // Add/remove scrolled class
    if (currentScroll > 10) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  });

  links.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const hash = this.getAttribute('href');
      const target = document.querySelector(hash);
      if(!target) return;
      window.scrollTo({top:target.offsetTop-56, behavior:'smooth'});
      links.forEach(l=>l.classList.remove('active'));
      this.classList.add('active');
      if(window.innerWidth<900) document.querySelector('.nav__list').classList.remove('open');
    });
  });

  // Mark section as active on scroll
  window.addEventListener('scroll',()=>{
    const scrollY = window.scrollY;
    let sectionActive = 'accueil';
    ['accueil','boutique','about','contact','dashboard'].forEach(id=>{
      const sec = document.getElementById(id);
      if(sec && sec.offsetTop-60<=scrollY) sectionActive=id;
    });
    links.forEach(l=>l.classList.toggle('active',l.getAttribute('href')==='#'+sectionActive));
  });
}
// MENU HAMBURGER (Mobile)
function setupHamburger(){
  const burger = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  
  burger.addEventListener('click', (e) => {
    e.stopPropagation();
    burger.classList.toggle('active');
    mobileMenu.classList.toggle('hidden');
  });
  
  // Close on link click
  document.querySelectorAll('.mobile-menu-link').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('active');
      mobileMenu.classList.add('hidden');
    });
  });
  
  // Close on outside click
  document.body.addEventListener('click', (e) => {
    if (!mobileMenu.classList.contains('hidden') && 
        !e.target.closest('.mobile-menu-popover') && 
        !e.target.closest('.nav__hamburger')) {
      burger.classList.remove('active');
      mobileMenu.classList.add('hidden');
    }
  });
}
// LAZYLOADING IMAGES
// (In real app, use <img loading="lazy">, here: color blocks)
// ANIMATIONS ON LOAD
function animateOnLoad(){
  setTimeout(()=>{
    document.querySelectorAll('.fade-in').forEach(el=>el.style.opacity=1);
    document.querySelectorAll('.slide-up').forEach(el=>el.style.opacity=1);
    document.querySelectorAll('.scale-up').forEach(el=>el.style.opacity=1);
  },160);
}

// SCROLL ANIMATIONS - Intersection Observer
function setupScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all cards and sections
  const elementsToAnimate = document.querySelectorAll('.card-product, .valeur-card, .testimonial-card, .section-title');
  elementsToAnimate.forEach(el => {
    el.classList.add('animate-on-scroll');
    observer.observe(el);
  });
}
// CONTACT FORM VALIDATION
function setupContactForm(){
  const form=document.getElementById('contact-form');
  if(!form) return;
  form.addEventListener('submit',function(e){
    e.preventDefault();
    let valid=true;
    ['name','email','message'].forEach(id=>{
      const field=form.querySelector(`[name=${id}]`);
      const err=field.nextElementSibling;
      if(!field.value.trim()){
        err.textContent='Ce champ est requis';
        valid=false;
      }else{
        err.textContent='';
      }
      if(id==='email' && field.value){
        if(!/^\S+@\S+\.\S+$/.test(field.value)){
          err.textContent='Email invalide';
          valid=false;
        } else {
          err.textContent='';
        }
      }
    });
    if(valid){
      // Store message for admin
      const messageData = {
        name: form.querySelector('[name=name]').value,
        email: form.querySelector('[name=email]').value,
        subject: form.querySelector('[name=subject]').value,
        message: form.querySelector('[name=message]').value,
        date: new Date().toISOString()
      };
      contactMessages.push(messageData);
      
      document.getElementById('form-success').classList.remove('hidden');
      form.reset();
      setTimeout(()=>{
        document.getElementById('form-success').classList.add('hidden');
      },2700);
    }
  });
  ['name','email','message'].forEach(id=>{
    const field=form.querySelector(`[name=${id}]`);
    field.addEventListener('input',function(){
      const err=this.nextElementSibling;
      if(this.value.trim()) err.textContent='';
    });
  });
}

// DASHBOARD ERREUR
function setupDashboardIframe(){
  const iframe=document.getElementById('dashboard-iframe');
  if(!iframe) return;
  iframe.onerror=function(){
    document.getElementById('dashboard-frame-alt').classList.remove('hidden');
  };
}
// ADMIN AUTHENTICATION
const ADMIN_CREDENTIALS = {
  email: 'admin@nessycrea.fr',
  password: 'admin123'
};

// Session management (in-memory for demo)
let adminSession = {
  isAuthenticated: false,
  loginTime: null
};

// Messages storage (in-memory)
let contactMessages = [];

function setupAdminLogin() {
  const form = document.getElementById('admin-login-form');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('admin-email').value.trim();
    const password = document.getElementById('admin-password').value;
    const errorDiv = document.getElementById('admin-login-error');
    
    // Clear previous errors
    document.getElementById('admin-email-error').textContent = '';
    document.getElementById('admin-password-error').textContent = '';
    errorDiv.style.display = 'none';
    
    // Validate credentials
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      // Successful login
      adminSession.isAuthenticated = true;
      adminSession.loginTime = new Date();
      
      // Hide login, show dashboard
      document.querySelector('.section-admin-login').classList.add('hidden');
      document.getElementById('admin-dashboard').classList.remove('hidden');
      
      // Scroll to dashboard
      document.getElementById('admin-dashboard').scrollIntoView({ behavior: 'smooth' });
      
      // Load admin data
      loadAdminProducts();
      loadAdminMessages();
      
    } else {
      // Failed login
      errorDiv.textContent = 'Email ou mot de passe incorrect';
      errorDiv.style.display = 'block';
    }
  });
}

function setupAdminLogout() {
  const logoutBtn = document.getElementById('admin-logout');
  if (!logoutBtn) return;
  
  logoutBtn.addEventListener('click', function() {
    // Clear session
    adminSession.isAuthenticated = false;
    adminSession.loginTime = null;
    
    // Show login, hide dashboard
    document.querySelector('.section-admin-login').classList.remove('hidden');
    document.getElementById('admin-dashboard').classList.add('hidden');
    
    // Clear form
    document.getElementById('admin-login-form').reset();
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function setupAdminTabs() {
  const tabBtns = document.querySelectorAll('.admin-tab-btn');
  const tabPanels = document.querySelectorAll('.admin-tab-panel');
  
  tabBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const targetTab = this.dataset.tab;
      
      // Update active states
      tabBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      tabPanels.forEach(panel => {
        if (panel.dataset.panel === targetTab) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });
    });
  });
}

function loadAdminProducts() {
  const container = document.getElementById('admin-products-list');
  if (!container) return;
  
  container.innerHTML = products.map(p => `
    <div class="admin-product-card">
      <img src="${p.image_url}" alt="${p.name}" loading="lazy" onerror="this.style.display='none'">
      <h4>${p.name}</h4>
      <div class="product-info"><strong>Type:</strong> ${p.type}</div>
      <div class="product-info"><strong>Prix:</strong> ${p.price.toFixed(2)} €</div>
      <div class="product-info"><strong>Note:</strong> ${'★'.repeat(p.rating)} (${p.rating}/5)</div>
      <div class="product-info"><strong>Parfum:</strong> ${p.scent}</div>
    </div>
  `).join('');
}

function loadAdminMessages() {
  const container = document.getElementById('admin-messages-list');
  const countEl = document.getElementById('messages-count');
  if (!container) return;
  
  if (contactMessages.length === 0) {
    container.innerHTML = '<p style="color:#6B5344;text-align:center;padding:20px;">Aucun message pour le moment.</p>';
    if (countEl) countEl.textContent = '0';
    return;
  }
  
  if (countEl) countEl.textContent = contactMessages.length;
  
  container.innerHTML = contactMessages.map((msg, idx) => `
    <div class="admin-message-card">
      <div class="message-header">
        <div class="message-from">${msg.name} (${msg.email})</div>
        <div class="message-date">${new Date(msg.date).toLocaleDateString('fr-FR')}</div>
      </div>
      ${msg.subject ? `<div class="message-subject"><strong>Sujet:</strong> ${msg.subject}</div>` : ''}
      <div class="message-body">${msg.message}</div>
    </div>
  `).join('');
}

// SHOPPING CART MANAGEMENT (In-memory storage)
let cart = [];

// Load cart on init
function loadCart() {
  // Cart is maintained in memory during the session
  updateCartUI();
}

// Save cart (in-memory only)
function saveCart() {
  // Cart persists in memory during the session
  // Note: Cart will reset on page refresh (sandboxed environment limitation)
}

// Add product to cart
function addToCart(product) {
  const existing = cart.find(item => item.id === product.id);
  
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  
  saveCart();
  updateCartUI();
  showCartToast(product);
}

// Remove product from cart
function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  updateCartUI();
}

// Update quantity
function updateQuantity(productId, delta) {
  const item = cart.find(item => item.id === productId);
  if (!item) return;
  
  item.quantity += delta;
  
  if (item.quantity <= 0) {
    removeFromCart(productId);
  } else {
    saveCart();
    updateCartUI();
  }
}

// Calculate total
function calculateTotal() {
  return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// Update cart UI (badge and drawer content)
function updateCartUI() {
  const badge = document.getElementById('cart-badge');
  const count = document.getElementById('cart-count');
  const plural = document.getElementById('cart-plural');
  const itemsContainer = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total');
  
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  // Update badge
  if (badge) badge.textContent = totalItems;
  if (count) count.textContent = totalItems;
  if (plural) plural.style.display = totalItems > 1 ? 'inline' : 'none';
  
  // Update total
  const total = calculateTotal();
  if (totalEl) totalEl.textContent = total.toFixed(2) + ' €';
  
  // Update cart items
  if (!itemsContainer) return;
  
  if (cart.length === 0) {
    itemsContainer.innerHTML = `
      <div class="cart-empty">
        <svg width="64" height="64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" style="margin: 0 auto 16px; opacity: 0.3;">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h7.72a2 2 0 0 0 2-1.61l1.38-7.39H6"></path>
        </svg>
        <p>Votre panier est vide</p>
      </div>
    `;
  } else {
    itemsContainer.innerHTML = cart.map(item => `
      <div class="cart-item">
        <img src="${item.image_url}" alt="${item.name}" class="cart-item-image" loading="lazy" onerror="this.style.display='none'">
        <div class="cart-item-details">
          <h4 class="cart-item-name">${item.name}</h4>
          <div class="cart-item-price">${item.price.toFixed(2)} € × ${item.quantity}</div>
          <div class="cart-item-subtotal">= ${(item.price * item.quantity).toFixed(2)} €</div>
          <div class="cart-item-actions">
            <button class="cart-qty-btn" data-cart-action="decrease" data-product-id="${item.id}">-</button>
            <span class="cart-qty">${item.quantity}</span>
            <button class="cart-qty-btn" data-cart-action="increase" data-product-id="${item.id}">+</button>
            <button class="cart-remove-btn" data-cart-action="remove" data-product-id="${item.id}" aria-label="Supprimer">
              <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }
}

// Show toast notification
function showCartToast(product) {
  const toast = document.createElement('div');
  toast.className = 'cart-toast';
  toast.innerHTML = `<span style="font-size:1.3em;color:var(--nc-gold)">✓</span> Produit ajouté au panier !`;
  
  Object.assign(toast.style, {
    position: 'fixed',
    bottom: '40px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'rgba(245,241,237,0.98)',
    color: '#6B5344',
    fontSize: '1.02em',
    fontWeight: '600',
    borderRadius: '12px',
    boxShadow: '0 8px 24px rgba(107,83,68,0.15)',
    border: '2px solid #D4A574',
    padding: '16px 32px',
    zIndex: '9999',
    opacity: '0',
    transition: 'opacity 250ms cubic-bezier(.4,0,.2,1), transform 350ms cubic-bezier(.4,0,.2,1)',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  });
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(-10px)';
  }, 50);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(0)';
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

// Open cart drawer
function openCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  const backdrop = document.getElementById('cart-backdrop');

  if (!drawer || !backdrop) return;

  drawer.classList.remove('hidden', 'closing');
  drawer.style.display = 'flex';
  backdrop.classList.remove('hidden');
  backdrop.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

// Close cart drawer
function closeCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  const backdrop = document.getElementById('cart-backdrop');

  if (!drawer || !backdrop) return;

  drawer.classList.add('closing');
  backdrop.classList.add('closing');

  setTimeout(() => {
    drawer.classList.add('hidden');
    drawer.classList.remove('closing');
    drawer.style.display = 'none';
    backdrop.classList.add('hidden');
    backdrop.classList.remove('closing');
    backdrop.style.display = 'none';
    document.body.style.overflow = '';
  }, 300);
}

// Setup cart event listeners
function setupCart() {
  // Ensure cart is closed on init
  const drawer = document.getElementById('cart-drawer');
  const backdrop = document.getElementById('cart-backdrop');
  if (drawer) {
    drawer.classList.add('hidden');
    drawer.style.display = 'none';
  }
  if (backdrop) {
    backdrop.classList.add('hidden');
    backdrop.style.display = 'none';
  }

  // Open cart
  const cartBtn = document.getElementById('cart-btn');
  if (cartBtn) {
    cartBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      openCartDrawer();
    });
  }

  // Close cart
  const closeBtn = document.getElementById('cart-close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeCartDrawer();
    });
  }

  if (backdrop) {
    backdrop.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeCartDrawer();
    });
  }

  const continueBtn = document.getElementById('continue-shopping');
  if (continueBtn) {
    continueBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeCartDrawer();
    });
  }
  
  // Checkout button
  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        alert('Votre panier est vide !');
        return;
      }
      alert(`Commande de ${calculateTotal().toFixed(2)} € en cours de traitement !\n\nFonctionnalité de paiement à venir.`);
    });
  }
  
  // Cart item actions (event delegation)
  document.addEventListener('click', (e) => {
    const action = e.target.closest('[data-cart-action]');
    if (!action) return;
    
    const actionType = action.dataset.cartAction;
    const productId = parseInt(action.dataset.productId);
    
    if (actionType === 'increase') {
      updateQuantity(productId, 1);
    } else if (actionType === 'decrease') {
      updateQuantity(productId, -1);
    } else if (actionType === 'remove') {
      removeFromCart(productId);
    }
  });
  
  // Add to cart buttons (event delegation)
  document.addEventListener('click', (e) => {
    if (e.target.matches('[data-addcart]') || e.target.closest('[data-addcart]')) {
      const btn = e.target.matches('[data-addcart]') ? e.target : e.target.closest('[data-addcart]');
      const productId = parseInt(btn.dataset.addcart);
      const product = products.find(p => p.id === productId);
      if (product) {
        addToCart(product);
      }
    }
  });

  // Close cart with ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const drawer = document.getElementById('cart-drawer');
      if (drawer && !drawer.classList.contains('hidden')) {
        closeCartDrawer();
      }
    }
  });
}

// CUSTOM SELECT BOXES
function createCustomSelects() {
  const selects = document.querySelectorAll('.filter-group select');

  selects.forEach(select => {
    // Créer le conteneur custom
    const customSelect = document.createElement('div');
    customSelect.className = 'custom-select';

    // Créer le bouton trigger
    const trigger = document.createElement('div');
    trigger.className = 'custom-select-trigger';
    trigger.innerHTML = `
      <span>${select.options[select.selectedIndex].text}</span>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    `;

    // Créer le dropdown
    const dropdown = document.createElement('div');
    dropdown.className = 'custom-select-dropdown';

    Array.from(select.options).forEach((option, index) => {
      const optionDiv = document.createElement('div');
      optionDiv.className = 'custom-select-option';
      if (index === select.selectedIndex) optionDiv.classList.add('selected');
      optionDiv.textContent = option.text;
      optionDiv.dataset.value = option.value;

      optionDiv.addEventListener('click', () => {
        // Mettre à jour le select natif
        select.selectedIndex = index;
        select.dispatchEvent(new Event('change'));

        // Mettre à jour l'affichage
        trigger.querySelector('span').textContent = option.text;

        // Mettre à jour les classes selected
        dropdown.querySelectorAll('.custom-select-option').forEach(opt => {
          opt.classList.remove('selected');
        });
        optionDiv.classList.add('selected');

        // Fermer le dropdown
        customSelect.classList.remove('open');
      });

      dropdown.appendChild(optionDiv);
    });

    // Toggle dropdown
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      // Fermer les autres
      document.querySelectorAll('.custom-select').forEach(cs => {
        if (cs !== customSelect) cs.classList.remove('open');
      });
      customSelect.classList.toggle('open');
    });

    customSelect.appendChild(trigger);
    customSelect.appendChild(dropdown);

    // Cacher le select natif et insérer le custom
    select.style.display = 'none';
    select.parentNode.insertBefore(customSelect, select);
  });

  // Fermer les dropdowns en cliquant ailleurs
  document.addEventListener('click', () => {
    document.querySelectorAll('.custom-select').forEach(cs => {
      cs.classList.remove('open');
    });
  });
}

// ========== SCROLL EFFECTS ==========

// Scroll Progress Bar
function updateScrollProgress() {
  const progressBar = document.getElementById('scroll-progress');
  if (!progressBar) return;

  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  const scrollPercentage = (scrollTop / (documentHeight - windowHeight)) * 100;
  progressBar.style.width = scrollPercentage + '%';
}

// Scroll Reveal Animations
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });
}

// Add scroll reveal classes to sections
function addScrollRevealClasses() {
  // Add to section titles
  const sectionTitles = document.querySelectorAll('.section-title');
  sectionTitles.forEach(title => {
    if (!title.classList.contains('scroll-reveal')) {
      title.classList.add('scroll-reveal');
    }
  });

  // Add to product cards
  const productCards = document.querySelectorAll('.card-product');
  productCards.forEach((card, index) => {
    if (!card.classList.contains('scroll-reveal')) {
      card.classList.add('scroll-reveal');
    }
  });

  // Add to value cards
  const valueCards = document.querySelectorAll('.valeur-card');
  valueCards.forEach((card, index) => {
    if (!card.classList.contains('scroll-reveal-scale')) {
      card.classList.add('scroll-reveal-scale');
    }
  });

  // Add to testimonial cards
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  testimonialCards.forEach((card, index) => {
    if (!card.classList.contains('scroll-reveal')) {
      card.classList.add('scroll-reveal');
    }
  });

  // Add to contact info cards
  const contactCards = document.querySelectorAll('.contact-info-card');
  contactCards.forEach((card, index) => {
    if (!card.classList.contains('scroll-reveal')) {
      card.classList.add('scroll-reveal');
    }
  });

  // Add to story blocks
  const storyBlocks = document.querySelectorAll('.story-block');
  storyBlocks.forEach((block, index) => {
    if (index % 2 === 0) {
      if (!block.classList.contains('scroll-reveal-left')) {
        block.classList.add('scroll-reveal-left');
      }
    } else {
      if (!block.classList.contains('scroll-reveal-right')) {
        block.classList.add('scroll-reveal-right');
      }
    }
  });
}

// INIT
window.addEventListener('DOMContentLoaded',function(){
  // Force close cart on page load (CRITICAL FIX)
  const drawer = document.getElementById('cart-drawer');
  const backdrop = document.getElementById('cart-backdrop');
  if (drawer) {
    drawer.classList.add('hidden');
    drawer.style.display = 'none';
  }
  if (backdrop) {
    backdrop.classList.add('hidden');
    backdrop.style.display = 'none';
  }
  document.body.style.overflow = '';

  renderVedettes();
  renderTestimonials();
  renderBoutiqueProducts();
  setupProductCardListeners();
  setupFilters();
  setupNavigation();
  setupHamburger();
  setupContactForm();
  setupDashboardIframe();
  setupAdminLogin();
  setupAdminLogout();
  setupAdminTabs();

  // Initialize scroll effects
  setTimeout(() => {
    addScrollRevealClasses();
    initScrollReveal();
  }, 100);
  loadCart();
  setupCart();
  animateOnLoad();
  setupScrollAnimations();
  createCustomSelects();

  // Scroll progress bar
  updateScrollProgress();
  window.addEventListener('scroll', updateScrollProgress);
});
