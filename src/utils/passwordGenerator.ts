export function passwordGenerate(): string {
    var generator = require('generate-password');
    
    var password = generator.generate({
        length: 8,
        numbers: true,
        symbols: true,
        strict: true
    });

    return password;
}