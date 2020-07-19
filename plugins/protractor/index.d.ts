declare module 'protractor' {
    import { Locator } from 'protractor';

    export interface ProtractorBy {
        /**
         * Find element within the Shadow DOM.
         *
         * @param {string} selector
         * @returns {Locator} location strategy
         */
        shadowDomCss(selector: string): Locator;
    }
}
