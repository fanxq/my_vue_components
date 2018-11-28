function createTestData(index) {
    return{
        index:`item-${index}`,
        name:`name-${index}`,
        age:Math.floor(Math.random()*100),
        scores:Math.floor(Math.random()*100),
        class:Math.floor(Math.random()*10),
        description:'testtestestesttetstsetststettstet'
    }
}

function getRandomNumber(range){
    return Math.floor(Math.random()*range);
}

function createTestData2(index) {
    var alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
    var wordLen = 3 + getRandomNumber(7);
    var word = '';
    for (let i = 0; i < wordLen; i++) {
        word += alphabet[getRandomNumber(alphabet.length-1)];
    }
    return word;
}

let testData = [];
for (let i = 1; i <= 500; i++) {
    const data = createTestData(i);
    testData.push(data);
}

export const records  = testData;
export const randomTexts = (function(){
    let testData = [];
    for (let i = 0; i < 20; i++) {
        const data = createTestData2();
        testData.push(data);
    }
    return testData;
})();

