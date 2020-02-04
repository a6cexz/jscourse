"use strict";

/**
 * @property {Object} settings Объект с настройками галереи.
 * @property {string} settings.previewSelector Селектор обертки для миниатюр галереи.
 * @property {string} settings.openedImageWrapperClass Класс для обертки открытой картинки.
 * @property {string} settings.openedImageClass Класс открытой картинки.
 * @property {string} settings.openedImageScreenClass Класс для ширмы открытой картинки.
 * @property {string} settings.openedImageCloseBtnClass Класс для картинки кнопки закрыть.
 * @property {string} settings.openedImageCloseBtnSrc Путь до картинки кнопки открыть.
 */
const gallery = {
  settings: {
    previewSelector: '.mySuperGallery',
    openedImageWrapperClass: 'galleryWrapper',
    openedImageClass: 'galleryWrapper__image',
    openedImageScreenClass: 'galleryWrapper__screen',
    openedImageCloseBtnClass: 'galleryWrapper__close',
    openedImageCloseBtnSrc: 'images/gallery/close.png',
    noImageSrc: 'images/noImage.jpg',
    backButtonClass: 'galleryWrapper__back',
    nextButtonClass: 'galleryWrapper__next',
    backImageSrc: 'images/back.png',
    nextImageSrc: 'images/next.png',
  },

  openedImageEl: null,
  images: null,

  /**
   * Инициализирует галерею, ставит обработчик события.
   * @param {Object} userSettings Объект настроек для галереи.
   */
  init(userSettings = {}) {
    // Записываем настройки, которые передал пользователь в наши настройки.
    Object.assign(this.settings, userSettings);

    // Находим элемент, где будут превью картинок и ставим обработчик на этот элемент,
    // при клике на этот элемент вызовем функцию containerClickHandler в нашем объекте
    // gallery и передадим туда событие MouseEvent, которое случилось.

    const container = document.querySelector(this.settings.previewSelector);
    this.images = container.children;
    container.addEventListener('click', event => this.containerClickHandler(event));
  },

  /**
   * Обработчик события клика для открытия картинки.
   * @param {MouseEvent} event Событие клики мышью.
   * @param {HTMLElement} event.target Целевой объект, куда был произведен клик.
   */
  containerClickHandler(event) {
    // Если целевой тег не был картинкой, то ничего не делаем, просто завершаем функцию.
    if (event.target.tagName !== 'IMG') {
      return;
    }
    // Открываем картинку с полученным из целевого тега (data-full_image_url аттрибут).
    this.showImageElement(event.target);
  },

  /**
   * Показывает элемент картинки.
   * @param {Element} img Элемент картинки которую надо показать.
   */
  showImageElement(img) {
    this.openedImageEl = img;
    this.openImage(img.dataset.full_image_url);
  },

  /**
   * Открывает картинку.
   * @param {string} src Ссылка на картинку, которую надо открыть.
   */
  openImage(src) {
    // Получаем контейнер для открытой картинки, в нем находим тег img и ставим ему нужный src.
    this.getScreenContainer().querySelector(`.${this.settings.openedImageClass}`).src = src;
  },

  /**
   * Возвращает контейнер для открытой картинки, либо создает такой контейнер, если его еще нет.
   * @returns {Element}
   */
  getScreenContainer() {
    // Получаем контейнер для открытой картинки.
    const galleryWrapperElement = document.querySelector(`.${this.settings.openedImageWrapperClass}`);
    // Если контейнер для открытой картинки существует - возвращаем его.
    if (galleryWrapperElement) {
      return galleryWrapperElement;
    }

    // Возвращаем полученный из метода createScreenContainer контейнер.
    return this.createScreenContainer();
  },

  /**
  * Возвращает индекс текущей открытой картинки в контейнере,
  * @returns {number} Индекс текущей открытой картинки в контейнере.
  */
  getOpenedImageIdx() {
    let idx = 0;
    for (const childImg of this.images) {
      if (childImg === this.openedImageEl)
        break;
      idx++;
    }
    return idx;
  },

  /**
  * Возвращает следующий элемент (картинку) от открытой или первую картинку в контейнере,
  * если текущая открытая картинка последняя.
  * @returns {Element} Следующую картинку от текущей открытой.
  */
  getNextImage() {
    const idx = this.getOpenedImageIdx();
    let nextIdx = idx + 1;
    if (nextIdx >= this.images.length) {
      nextIdx = 0;
    }
    const img = this.images.item(nextIdx);
    return img;
  },

  /**
   * Возвращает предыдущий элемент (картинку) от открытой или последнюю картинку в контейнере,
   * если текущая открытая картинка первая.
   * @returns {Element} Предыдущую картинку от текущей открытой.
   */
  getPrevImage() {
    const idx = this.getOpenedImageIdx();
    let prevIdx = idx - 1;
    if (prevIdx < 0) {
      prevIdx = this.images.length - 1;
    }
    const img = this.images.item(prevIdx);
    return img;
  },

  /**
   * Создает контейнер для открытой картинки.
   * @returns {HTMLElement}
   */
  createScreenContainer() {
    // Создаем сам контейнер-обертку и ставим ему класс.
    const galleryWrapperElement = document.createElement('div');
    galleryWrapperElement.classList.add(this.settings.openedImageWrapperClass);

    const galleryWrapperBack = document.createElement('img');
    galleryWrapperBack.classList.add(this.settings.backButtonClass);
    galleryWrapperBack.src = this.settings.backImageSrc;
    galleryWrapperElement.appendChild(galleryWrapperBack);

    const galleryWrapperNext = document.createElement('img');
    galleryWrapperNext.classList.add(this.settings.nextButtonClass);
    galleryWrapperNext.src = this.settings.nextImageSrc;
    galleryWrapperElement.appendChild(galleryWrapperNext);

    // Создаем контейнер занавеса, ставим ему класс и добавляем в контейнер-обертку.
    const galleryScreenElement = document.createElement('div');
    galleryScreenElement.classList.add(this.settings.openedImageScreenClass);
    galleryWrapperElement.appendChild(galleryScreenElement);

    // Создаем картинку для кнопки закрыть, ставим класс, src и добавляем ее в контейнер-обертку.
    const closeImageElement = new Image();
    closeImageElement.classList.add(this.settings.openedImageCloseBtnClass);
    closeImageElement.src = this.settings.openedImageCloseBtnSrc;
    closeImageElement.addEventListener('click', () => this.close());
    galleryWrapperElement.appendChild(closeImageElement);

    // Создаем картинку, которую хотим открыть, ставим класс и добавляем ее в контейнер-обертку.
    const image = new Image();
    image.classList.add(this.settings.openedImageClass);
    galleryWrapperElement.appendChild(image);

    image.onerror = () => {
      image.src = this.settings.noImageSrc;
    };

    galleryWrapperBack.addEventListener('click', () => {
      const prev = this.getPrevImage();
      this.showImageElement(prev);
    });

    galleryWrapperNext.addEventListener('click', () => {
      const next = this.getNextImage();
      this.showImageElement(next);
    });

    // Добавляем контейнер-обертку в тег body.
    document.body.appendChild(galleryWrapperElement);

    // Возвращаем добавленный в body элемент, наш контейнер-обертку.
    return galleryWrapperElement;
  },

  /**
   * Закрывает (удаляет) контейнер для открытой картинки.
   */
  close() {
    document.querySelector(`.${this.settings.openedImageWrapperClass}`).remove();
  }
};

// Инициализируем нашу галерею при загрузке страницы.
window.onload = () => gallery.init({ previewSelector: '.galleryPreviewsContainer' });