"use strict";

/**
 * @property {object} settings Настройки корзины товаров.
 * @property {{price: number, name: string}[]} goods Список товаров что купил пользователь.
 * @property {HTMLElement} basketCountEl Место для показа количества товаров.
 * @property {HTMLElement} basketPriceEl Место для показа цены всех товаров.
 */
const basket = {
  settings: {
    buyButtonSelector: '.buy-btn',
    countSelector: '#basket-count',
    priceSelector: '#basket-price',
  },

  goods: [],
  countEl: null,
  priceEl: null,

  /**
   * Инициализирует переменные для корзины и показывает эти значения.
   */
  init(userSettings = {}) {
    Object.assign(this.settings, userSettings);

    const buttons = document.querySelectorAll(this.settings.buyButtonSelector);
    for (const button of buttons) {
      button.addEventListener('click', event => this.buyButtonClickHandler(event));
    }

    this.countEl = document.querySelector(this.settings.countSelector);
    this.priceEl = document.querySelector(this.settings.priceSelector);
    this.render();
  },

  buyButtonClickHandler(event) {
    const target = event.target;
    this.add(target.dataset.name, target.dataset.price);
  },

  /**
   * Отображает количество всех товаров и их цену.
   */
  render() {
    this.countEl.innerText = this.goods.length;
    this.priceEl.innerText = this.getGoodsPrice();
  },

  /**
   * Считает и возвращает цену всех купленных товаров из массива this.goods.
   * @returns {number} Цену всех купленных товаров.
   */
  getGoodsPrice() {
    let price = 0;
    for (const good of this.goods) {
      price += good.price;
    }
    return price;
  },

  /**
   * Добавляет купленный товар в массив купленных товаров и отображает количество и цену всех товаров.
   * @param goodName Название товара.
   * @param goodPrice Цена товара.
   */
  add(goodName, goodPrice) {
    this.goods.push({ name: goodName, price: parseInt(goodPrice) });
    this.render();
  },
};

window.onload = () => basket.init();