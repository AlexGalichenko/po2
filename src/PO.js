const parseTokens = require('./parseTokens');

class PO {

    init(driver) {
        /**
         * @type { import('webdriverio').BrowserBase }
         */
        this.driver = driver;
    }

    /**
     * Get element from page object
     * @public
     * @param {string} path
     * @returns { import('webdriverio').ElementCommandsType|import('webdriverio').ElementArray }
     */
    async getElement(path) {
        if (!this.driver) throw new Error('Driver is not attached. Call po.init(driver)')
        const tokens = parseTokens(path);
        let element = this.driver;
        let po = this;
        while (tokens.length > 0) {
            const token = tokens.shift();
            [element, po] = await this.getEl(element, po, token);
        }
        return element
    }

    register(obj) {
        for (const prop in obj) {
            this[prop] = obj[prop]
        }
    };

    /**
     * @private
     * @param {*} element 
     * @param {*} po 
     * @param {*} token 
     * @returns 
     */
    async getEl(element, po, token) {
        const currentElement = await element;
        const newPo = po[token.elementName.replace(/\s/, '')];
        if (!newPo) throw new Error(`${token.elementName} is not found`);
        if (currentElement.length > 0 && newPo.isCollection) throw new Error('Unsupported operation. Getting collection from collection')
        if (!newPo.isCollection && token.suffix) throw new Error(`Unsupported operation. ${token.elementName} is not collection`);
        if (newPo.isCollection && token.suffix === 'in') return this.getElementByText(currentElement, newPo, token)
        if (newPo.isCollection && token.suffix === 'of') return this.getElementByIndex(currentElement, newPo, token)
        if (currentElement.length > 0 && !newPo.isCollection) return this.getChildsOfCollectionElements(currentElement, newPo)
        if (newPo.isCollection && !token.suffix) return [currentElement.$$(newPo.selector), newPo]
        return [currentElement.$(newPo.selector), newPo]
    }

    /**
     * @private
     * @param {*} element 
     * @param {*} po 
     * @param {*} token 
     * @returns 
     */
    async getElementByText(element, po, token) {
        const collection = await element.$$(po.selector);
        let condition;
        if (token.prefix === '#') {
            condition = (text) => text.includes(token.value);
        }
        if (token.prefix === '@') {
            condition = (text) => text === token.value;
        }
        for (const element of collection) {
            const text = await element.getText();
            if (condition(text)) return [element, po]
        }
    }

    /**
     * @private
     * @param {*} element 
     * @param {*} po 
     * @param {*} token 
     * @returns 
     */
    async getElementByIndex(element, po, token) {
        const collection = await element.$$(po.selector);
        return [collection[parseInt(token.value) - 1], po]
    }

    /**
     * @private
     * @param {*} collection 
     * @param {*} po 
     * @returns 
     */
    async getChildsOfCollectionElements(collection, po) {
        return [
            collection.map(async element => element.$(po.selector)),
            po
        ]
    }

}

module.exports = new PO();