const { $, $$ } = require('../src/register');

class MultipleComponent {
    selector = '.list-components li';

    ChildItem = $('div');
}

class SingleComponent {
    selector = '.container';

    ChildItem = $('.child-item');
}

class App {
    SingleElement = $('.single-element');
    List = $$('.list li');
    SingleComponent = $(new SingleComponent());
    MultipleComponents = $$(new MultipleComponent());
}

module.exports = new App();