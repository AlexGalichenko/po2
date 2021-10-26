const path = require('path');
const { remote } = require('webdriverio');
const po = require('../src/PO');
const samplePO = require('./samplePO');

beforeAll(async () => {
    const driver = await remote({
        logLevel: 'warn',
        capabilities: {
            browserName: 'chrome',
            'goog:chromeOptions': {
                args: ['--headless']
            }
        }
    });

    po.init(driver);
    po.register(samplePO);
    const fileName = path.resolve('./tests/test_page.html');
    await driver.url('file://' + fileName);
});

test('get single element', async () => {
    const element = await po.getElement('Single Element');
    expect(await element.getText()).toBe('text of single element');
});

test('get collection', async () => {
    const collection = await po.getElement('List');
    expect(collection.length).toBe(5);
});

test('get element from collection by index', async () => {
    const element = await po.getElement('#2 of List');
    expect(await element.getText()).toBe('Second');
});

test('get element from collection by parial text', async () => {
    const element = await po.getElement('#Thi in List');
    expect(await element.getText()).toBe('Third');
});

test('get element from collection by exact text', async () => {
    const element = await po.getElement('@Third in List');
    expect(await element.getText()).toBe('Third');
});

test('get element from component', async () => {
    const element = await po.getElement('Single Component > Child Item');
    expect(await element.getText()).toBe('text of first child item');
});

test('get element from multiple component item by index', async () => {
    const element = await po.getElement('#2 of Multiple Components > ChildItem');
    expect(await element.getText()).toBe('second inner');
});

test('get element from multiple component item by partials text', async () => {
    const element = await po.getElement('#second in Multiple Components > Child Item');
    expect(await element.getText()).toBe('second inner');
});

test('get element from multiple component item by exact text', async () => {
    const element = await po.getElement('@third inner in Multiple Components > Child Item');
    expect(await element.getText()).toBe('third inner');
});

test('get child item of each element of collection', async () => {
    const collection = await po.getElement('Multiple Components > Child Item');
    expect(collection.length).toBe(3);
});


afterAll(async () => {
    await po.driver.deleteSession();
})