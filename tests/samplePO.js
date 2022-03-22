const { $, $$ } = require('../src/register');

class MultipleComponent {
    selector = '.list-components li';

    ChildItem = $('div');
}

class SingleComponent {
    selector = '.container';

    ChildItem = $('.child-item');
}

class AsyncComponent {
    selector = '#async-list-components';

    ChildItems = $$('li');
}

class App {
    SingleElement = $('.single-element');
    List = $$('.list li');
    SingleComponent = $(new SingleComponent());
    MultipleComponents = $$(new MultipleComponent());
    AsyncComponent = $(new AsyncComponent());
}

module.exports = new App();
