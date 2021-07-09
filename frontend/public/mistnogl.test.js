// +-------------------+---------------------------------------------
// | contains function |
// +-------------------+
const emptyArray = [];
const simpleNumArray = [1, 2, 4, 6, 9];
const simpleStringArray = ["Lisa", "Maddy", "Colin", "Mae", "Zaen", "Pinkie"];
const singletonArray = ["dogs"];
const simpleString = "dogs";
const simpleString2 = "cats";
const nameString = "Lisa";
const numVal = 2;
const numVal2 = 3;
const valOfOne = 1;
const valOfNine = 9;

describe ("Contains function", () => {
    test('empty array returns false', () => {
      expect(functions.contains(emptyArray)).toBeFalsy();
    }); 
    
    test('simple array containing num value', () => {
        expect(functions.contains(simpleNumArray, numVal)).toBeTruthy();
    });
    
    test('simple array not containing num value', () => {
        expect(functions.contains(simpleNumArray, numVal2)).toBeFalsy();
    });
    
    test('val at the beginning of array', () => {
        expect(functions.contains(simpleNumArray, valOfOne)).toBeTruthy();
    });
    
    test('val at the end of array', () => {
        expect(functions.contains(simpleNumArray, valOfNine)).toBeTruthy();
    });
    
    test('singleton array containing val', () => {
        expect(functions.contains(singletonArray, simpleString)).toBeTruthy();
    });
    
    test('singleton array not containing val', () => {
        expect(functions.contains(singletonArray, simpleString2)).toBeFalsy();
    });
    
    test('string array containing val', () => {
        expect(functions.contains(simpleStringArray, nameString)).toBeTruthy();
    });
    
    test('string array not containing val', () => {
        expect(functions.contains(simpleStringArray, simpleString)).toBeFalsy();
    });
    });