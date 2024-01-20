class IconComponent extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }
  
    static get observedAttributes() {
      return ['icon', 'size'];
    }
  
    connectedCallback() {
      this.render();
    }
  
    attributeChangedCallback(name, oldValue, newValue) {
      if (oldValue !== newValue) {
        this.render();
      }
    }
  
    render() {
      const iconName = this.getAttribute('icon');
      const size = parseInt(this.getAttribute('size')) || 16;
      const iconPath = this.getIconPath(iconName, size);
  
      // Vérifier le cache
      caches.open('icon-cache').then((cache) => {
        cache.match(iconPath).then((cachedResponse) => {
          if (cachedResponse) {
            // Si le SVG est dans le cache, l'utiliser directement
            this.renderFromCache(cachedResponse, size, iconName);
          } else {
            // Si le SVG n'est pas dans le cache, le récupérer via fetch
            fetch(iconPath)
              .then((response) => response.text())
              .then((svgText) => {
                // Mettre le SVG dans le cache pour une utilisation future
                cache.put(iconPath, new Response(svgText, { headers: { 'Content-Type': 'image/svg+xml' } }));
                this.renderFromCache(new Response(svgText, { headers: { 'Content-Type': 'image/svg+xml' } }), size, iconName);
              })
              .catch((error) => {
                console.error('Error loading or caching icon:', error);
                this.renderErrorIcon(size);
              });
          }
        });
      });
    }
  
    renderFromCache(response, size, iconName) {
      response.text().then((svgText) => {
        const svgDocument = new DOMParser().parseFromString(svgText, 'image/svg+xml');
        const svgElement = svgDocument.documentElement;
  
        svgElement.setAttribute('width', size);
        svgElement.setAttribute('height', size);
        svgElement.setAttribute('class', `icon icon-${iconName}`);
  
        // Supprimer le contenu existant du Shadow DOM
        this.shadowRoot.innerHTML = '';
  
        // Ajouter le style et le SVG au Shadow DOM
        const style = document.createElement('style');
        style.textContent = `
          :host {
            display: inline-block;
            width: ${size}px;
            height: ${size}px;
          }
          svg {
            width: 100%;
            height: 100%;
            fill: currentColor;
          }
        `;
        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(svgElement.cloneNode(true));
      });
    }
  
    renderLoadingIcon(size) {
      // Affiche une icône de chargement par défaut
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: inline-block;
            width: ${size}px;
            height: ${size}px;
          }
          .loading-icon {
            animation: spin 1s linear infinite;
            width: 100%;
            height: 100%;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        </style>
        <div class="loading-icon">Loading...</div>
      `;
    }
  
    renderErrorIcon(size) {
      // Affiche une icône d'erreur par défaut
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: inline-block;
            width: ${size}px;
            height: ${size}px;
          }
          .error-icon {
            color: red;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        </style>
        <div class="error-icon">Error</div>
      `;
    }
  
    getIconPath(name, size) {
      const prefix = size <= 16 ? 'ico' : 'ico-lg';
      const suffix = size > 16 ? '-lg' : '';
      return `icons/${prefix}/${name}${suffix}.svg`;
    }
  }
  
  customElements.define('icon-component', IconComponent);
  