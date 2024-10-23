export const  generateRandomFiveDigitNumber = (): number =>{
    const min = 10000; // 5 honali eng kichik son
    const max = 99999; // 5 honali eng katta son
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Misol uchun 5 honali tasodifiy son yaratamiz
const randomNumber = generateRandomFiveDigitNumber();