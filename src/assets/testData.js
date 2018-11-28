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

let testData = [];
for (let i = 1; i <= 500; i++) {
    const data = createTestData(i);
    testData.push(data);
}

export const records  = testData;