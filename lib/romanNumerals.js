/* This should take in a regular number from 1-3999 and convert it
 * to a roman numeral number */

module.exports = function romanNumerals() {
    this.convert = function(number) {

        if (number < 1 || number > 3999) {
            return "Invalid input. Number needs to be between 1 and 3999.";
        }

        let result = "";
        const romanNumbers = [
            {value: 1000, symbol: 'M'},
            {value: 100, symbol: 'C'},
            {value: 50, symbol: 'L'},
            {value: 10, symbol: 'X'},
            {value: 5, symbol: 'V'},
            {value: 1, symbol: 'I'}
        ];

        for(let i = 0; i < romanNumbers.length; i++){
            while(number >= romanNumbers[i].value){
                result += romanNumbers[i].symbol;
                number -= romanNumbers[i].value;
            }

        }

        return result;
    }

    

}