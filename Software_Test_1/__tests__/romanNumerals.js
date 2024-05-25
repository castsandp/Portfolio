const romanNumerals = require("../lib/romanNumerals")


// this would be considered the final assert phase where the roma-numeral
// implentation fucntionality is tested and everything passes.
// Using TDD helped understand what I wanted to include in the roman numeral convert function. 
// planning in a sense what needed ot pass, having htose test fail 
// and seeing them pass in the green phase and refactor as needed. Following AAA pattern as well as TDD

test("passes by throwing error when out of bounds", function(){
    const converter = new romanNumerals();
    expect(converter.convert(0)).toBe("Invalid input. Number needs to be between 1 and 3999.");
})

test("converts 1 to I", function(){
    const converter = new romanNumerals();
    expect(converter.convert(1)).toBe('I');
})

test("converts 10 to X", function(){
    const converter = new romanNumerals();
    expect(converter.convert(10)).toBe('X');
})

test("converts 250 to CCL", function(){
    const converter = new romanNumerals();
    expect(converter.convert(250)).toBe('CCL');
})

test("converts 1050 to ML", function(){
    const converter = new romanNumerals();
    expect(converter.convert(1050)).toBe('ML');
})

test("converts 725 to CCCCCCCXXV", function(){
    const converter = new romanNumerals();
    expect(converter.convert(725)).toBe('CCCCCCCXXV');
})

test("converts 4 to IIII", function(){
    const converter = new romanNumerals();
    expect(converter.convert(4)).toBe('IIII');
})

test("converts 20 to XX", function(){
    const converter = new romanNumerals();
    expect(converter.convert(20)).toBe('XX');
})

test("error message when converts 4000", function(){
    const converter = new romanNumerals();
    expect(converter.convert(4000)).toBe("Invalid input. Number needs to be between 1 and 3999.");
})

test("converts 3999 to MMMCCCCCCCCCLXXXXVIIII", function(){
    const converter = new romanNumerals();
    expect(converter.convert(3999)).toBe('MMMCCCCCCCCCLXXXXVIIII');
})

















