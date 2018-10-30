
export class View {
    constructor(display) {
        this.display = display;
    }
    updateDisplay(number) {
        this.display.textContent = number;
    }
    changeBgnd() {
        //random number
        const rnd = Math.floor(Math.random() * 6) + 1;
        //create filename
        const file = `table-${rnd}.png`;
        //css with the filename
        document.querySelector('body').style.background = `url('./pics/table-${rnd}.png') repeat`;
    }
}

export class Model {
    constructor() {
        // this.history = [];
        this.operators = [
            { action: 'percentage', func: this.percentage },
            { action: 'divide', func: this.divide },
            { action: 'multiply', func: this.multiply },
            { action: 'subtract', func: this.subtract },
            { action: 'add', func: this.add },
        ];
    }
    add(a, b) {
        return a + b;
    }
    subtract(a, b) {
        return a - b;
    }
    multiply(a, b) {
        return a * b;
    }
    divide(a, b) {
        if (b === 0) return new Error('Error: division by 0!');
        return a / b;
    }
    percentage(a, b) {
        return (b / 100) * a;
    }
    calculate(first, second, operator) {
        first = parseFloat(first);
        second = parseFloat(second);
        let operation = this.operators.find((op) => op.action === operator);
        let result = operation.func(first, second);
        result = this._numberToString(result);
        return result;
    }
    _numberToString(number) {
        ///fixes inaccuracies in JS calculations and clears trailing zeros
        number = number.toString().slice(0, 9);
        number = parseFloat(number);
        number = number.toString();
        return number;
    }
}

export class Controller {
    constructor(keys, model, view) {
        this.keys = keys;
        this.model = model;
        this.view = view;
        this.firstNumber = '';
        this.secondNumber = '';
        this.operator = null;
    }
    init() {
        this.keys.addEventListener('click', (evt) => {
            this.evaluate(evt.target);
        });
    }
    evaluate(el) {
        if (!el.matches('button')) return;
        if (!el.classList.contains('key--operator')) { //it's a number
            if (!this.operator) { //this is the first number
                this.firstNumber = this.firstNumber.concat(el.textContent);
                this.firstNumber = this._sanitize(this.firstNumber);
                this.view.updateDisplay(this.firstNumber);
            } else {
                this.secondNumber = this.secondNumber.concat(el.textContent);
                this.secondNumber = this._sanitize(this.secondNumber);
                this.view.updateDisplay(this.secondNumber);
            }
        } else { //it's an operator
            if (el.dataset.action === 'equals') {
                console.log('params');
                console.log(`first: ${this.firstNumber}, second: ${this.secondNumber}, operator: ${this.operator}`);
                let result = this.model.calculate(this.firstNumber, this.secondNumber, this.operator);
                this.reset();
                this.firstNumber = result;
                this.view.updateDisplay(result);
            } else if (el.dataset.action === 'AC') {
                this.reset();
                this.view.updateDisplay('0');
            } else if (el.dataset.action === 'CE') {
                if (!this.operator) {
                    this.firstNumber = '';
                    this.view.updateDisplay('0');
                } else {
                    this.secondNumber = '';
                    this.view.updateDisplay('0');
                }

            } else {
                this.operator = el.dataset.action;

            }
        }
    }
    reset() {
        this.firstNumber = '';
        this.secondNumber = '';
        this.operator = null;
    }
    _sanitize(number) {
        let negative = '';
        if (number[0] === '-') {
            number = number.slice(1);
            negative = '-';
        }
        if (number === '00') number = '0';
        if (number === '.') number = '0.';
        if (number.indexOf('0') === 0 && number.length === 2 && number !== '0.') number = number.slice(1);
        if (number.indexOf('.') !== number.lastIndexOf('.')) number = number.slice(0, number.length - 1);
        if (number.length > 10) number = number.slice(0, 10);
        return negative.concat(number);
    }

}

