
export class View {
    constructor(display) {
        this.display = display;
    }
    updateDisplay(number) {
        this.display.textContent = number;
    }
    changeBgnd() {
        const rnd = Math.floor(Math.random() * 6) + 1;
        document.querySelector('body').style.background = `url('./pics/table-${rnd}.png') repeat`;
    }
}

export class Model {
    constructor() {
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
        ///fixes inaccuracies in JS calculations and clears trailing digits
        number = number.toString();
        let dotPosition = number.indexOf('.');
        if (dotPosition < 0) {
            if (number.length > 10) {
                number = 'NaN';
            }
        } else if (dotPosition === 9) {
            number = number.slice(0, 9);
        } else if (dotPosition > 9) {
            number = 'NaN';
        } else {
            let newNum = number.slice(0, dotPosition);
            let decimals = number.slice(dotPosition, 10);
            number = newNum.concat(decimals);
        }
        number = parseFloat(number);
        number = number.toString();
        number = number === 'NaN' ? 'Error' : number;
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
        this.result = null;
        this.element = null;
    }
    init() {
        //mouse events
        this.keys.addEventListener('mousedown', evt => {
            this.element = evt.target;
            this.element.style.border = 'inset';
        });
        this.keys.addEventListener('mouseup', evt => {
            this.element.style.border = '';
            this.evaluate(this.element);
        });
        this.keys.addEventListener('mouseout', evt => {
            if (this.element) this.element.style.border = '';
        });
        //keyboard events
        window.addEventListener('keydown', evt => {
            this.element = this._findElement(evt);
            if (this.element) this.element.style.border = 'inset';
        });
        window.addEventListener('keyup', evt => {
            this.element.style.border = '';
            this.evaluate(this.element);
        });
    }
    evaluate(el) {
        if (!el.matches('button')) return;
        if (!el.classList.contains('key--operator')) { //it's a number
            if (!this.operator) { //this is the first number
                if (this.result) {
                    this.firstNumber = '';
                    this.result = null;
                }
                this.firstNumber = this.firstNumber.concat(el.textContent);
                this.firstNumber = this._sanitize(this.firstNumber);
                this.view.updateDisplay(this.firstNumber);
            } else {
                this.secondNumber = this.secondNumber.concat(el.textContent);
                this.secondNumber = this._sanitize(this.secondNumber);
                this.view.updateDisplay(this.secondNumber);
            }
        } else { //it's an operator

            if (el.dataset.action === 'subtract') { //implement negative numbers
                if (!this.firstNumber) {
                    this.firstNumber = '-';
                    this.view.updateDisplay(this.firstNumber);
                } else if (!this.operator) {
                    this.operator = el.dataset.action;
                } else if (!this.secondNumber) {
                    this.secondNumber = '-';
                    this.view.updateDisplay(this.secondNumber);
                } else { //chaining operations
                    this._equals(el);
                }
            } else if (el.dataset.action === 'equals') {
                if (!this.firstNumber) return;
                if (!this.secondNumber) {
                    this.reset();
                    this.view.updateDisplay('0');
                    return;
                }
                this._equals();
            } else if (el.dataset.action === 'AC') {
                this.reset();
                this.result = null;
                this.view.updateDisplay('0');
            } else if (el.dataset.action === 'CE') {
                if (!this.operator) {
                    this.firstNumber = '';
                    this.view.updateDisplay('0');
                } else {
                    this.secondNumber = '';
                    this.view.updateDisplay('0');
                }
            } else if (this.operator) {
                if (!this.secondNumber) return this.operator = el.dataset.action;
                this._equals(el);
            } else {
                if (!this.firstNumber) this.firstNumber = '0';
                this.operator = el.dataset.action;
            }
        }
        // this.element = null;
    }
    reset() {
        this.firstNumber = '';
        this.secondNumber = '';
        this.operator = null;
    }
    _equals(el) {
        this.result = this.model.calculate(this.firstNumber, this.secondNumber, this.operator);
        this.reset();
        this.firstNumber = this.result;
        this.operator = el ? el.dataset.action : null;
        if (this.result === 'NaN') {
            this.result = 'Error';
            this.reset();
        }
        this.view.updateDisplay(this.result);
        this.result = '0';
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
    _findElement(evt) {
        let key;
        switch (evt.key) {
            case 'Enter':
                key = '=';
                break;
            case '*':
                key = '×';
                break;
            case 'Escape':
                key = 'AC';
                break;
            case 'Backspace':
            case 'Delete':
                key = 'CE';
                break;
            default:
                key = evt.key;
        }
        return [...this.keys.children].find(child => child.textContent === key);
    }

}

