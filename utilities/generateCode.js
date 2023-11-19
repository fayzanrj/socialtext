// generateCode.js

const generateCode = async () => {
    const characters = '0123456789';
    let result = '';

    const generateRandomCharacter = () => {
        const charactersLength = characters.length;
        return characters[Math.floor(Math.random() * charactersLength)];
    };

    const generateCodeRecursively = () => {
        while (result.length < 6) {
            result += generateRandomCharacter();
        }

        if (result.length === 6) {
            return Number.parseInt(result);
        } else {
            result = ''; // Reset result if it's not 6 characters
            return generateCodeRecursively();
        }
    };

    return generateCodeRecursively();
};

export default generateCode;
