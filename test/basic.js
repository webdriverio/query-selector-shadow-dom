import { TestComponent } from './TestComponent';
import { querySelectorAllDeep, querySelectorDeep } from '../src/querySelectorDeep';



describe("Basic Suite", function() {

    it("exports querySelectorAllDeep function", function() {
        expect(querySelectorAllDeep).toEqual(jasmine.any(Function));
    });

    it("exports querySelectorDeep function", function() {
        expect(querySelectorAllDeep).toEqual(jasmine.any(Function));
    });
});