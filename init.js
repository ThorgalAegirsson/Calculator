import { View, Model, Controller } from './app.js';

(() => {
    'use strict';
    
    const init = () => {
        //DOM elements
        const $display = document.querySelector('.display');
        const $keys = document.querySelector('.keys');
        const $bgndBtn = document.querySelector('button.background');

        
        const view = new View($display);
        const model = new Model();
        const controller = new Controller($keys, model, view);
        view.updateDisplay(0);
        controller.init();
        $bgndBtn.addEventListener('click', view.changeBgnd);

    };

    document.addEventListener('DOMContentLoaded', init, false);
})();