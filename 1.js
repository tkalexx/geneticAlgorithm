const shuffle = require('shuffle-array');

function randomInt(min, max) {
    return min + Math.floor((max - min) * Math.random());
}

function printArray(matrix){
    for(const row of matrix){
        console.log(row.join( " "));
    }
}

function valueCost (cell, array){
    let valueCost = 0;
    for ( let i = 0; i < N - 1; i ++) {
        valueCost += array [cell[i]][cell[i + 1]];
    }
    return valueCost;
}

function bestKid (massiv, matrix){
    let minIndex = 0;
    for ( let i = 0; i < massiv.length; i++){
        if(valueCost(massiv[minIndex],matrix) > valueCost(massiv[i],matrix)) {
            minIndex = i;
        }
    }
    return massiv[minIndex];
}

function chooseParents (vector) {
    let minIndex = 0;
    for ( let i = 0; i < vector.length; i++){
        if( vector[minIndex] < vector [i]) {
            minIndex = i;
        }
    }
    const bestParentIndex = minIndex;
    let randomParentIndex = randomInt(0, vector.length);
    while (bestParentIndex === randomParentIndex) {
        randomParentIndex = randomInt(0, vector.length);
    }

    return [bestParentIndex, randomParentIndex];
}

function crossing (parent1, parent2){
    const M = randomInt(0, parent1.length);
    const kid1 = [...parent1.slice(0,M), ... parent2.slice(M)];
    const kid2 = [...parent2.slice(0,M), ... parent1.slice(M)];
    const kid3 = [...parent1.slice(M), ... parent2.slice(0,M)];
    const kid4 = [...parent2.slice(M), ... parent1.slice(0,M)];
    return [...pravPotomkov(kid1, kid2),...pravPotomkov( kid3, kid4)];
}

function pravPotomkov(kid1, kid2){
    const repInd1 = [];
    for (let i = 0; i < kid1.length; i++){
        for (let j = i; j < kid1.length; j++){
            if (kid1[i] === kid1[j] && i !== j){
                repInd1.push(i);
            }
        }
    }
    const repIndKid1 = repInd1;
    const repInd2 = [];
    for (let i = 0; i < kid2.length; i++){
        for (let j = i; j < kid2.length; j++){
            if (kid2[i] === kid2[j] && i !== j){
                repInd2.push(i);
            }
        }
    }
    const repIndKid2 = repInd2;

    for (let i = 0; i < repIndKid1.length; i++){
        let temp = kid2[repIndKid2[i]];
        kid2[repIndKid2[i]] = kid1[repIndKid1[i]];
        kid1[repIndKid1[i]] = temp;
    }
    return [kid1,kid2];
}

function chooseBestParent (vector){
    let minIndex = 0;
    for ( let i = 0; i < vector.length; i++){
        if( vector[minIndex] > vector [i]) {
            minIndex = i;
        }
    }
    return minIndex;
}

function worstParent (massiv){
    let minIndex = 0;
    for ( let i = 0; i < massiv.length; i++){
        if( massiv[minIndex] < massiv [i]) {
            minIndex = i;
        }
    }
    return minIndex;
}

const N = 30;
const sizePopul = 80;

const pervStr = Array.from({length: N}, (_, i) => i );
const arrayPopul = Array.from({length: sizePopul}, (_, i) => shuffle(pervStr,{copy:true}));




const matrix = [];

for (let i = 0; i < N; i++){
    const row = [];
    for (let j = 0; j  < N; j ++){
        row[j] = randomInt(10,60);
        if (i === j){
            row[j] = -1;
        }
    }
    matrix.push(row);
}

const vector = [];

for (let i = 0; i < 3000; i ++){

    for ( let i = 0; i < sizePopul; i++){
        vector[i] = valueCost(arrayPopul[i], matrix);
    }

    const chooseBestParent1 = chooseBestParent(vector);

    if (i === 0){
        console.log('Стоимость первого лучшего родителя:' + vector[chooseBestParent1]);
    }

    const parents =  chooseParents(vector);

    const kid = crossing(arrayPopul[parents[0]],arrayPopul[parents[1]]);

    arrayPopul [worstParent(vector)] = bestKid(kid, matrix);

}

for ( let i = 0; i < sizePopul; i++){
    vector[i] = valueCost(arrayPopul[i], matrix);
}

const superParent = chooseBestParent(vector);

console.log("Лучшая особь из популяции",arrayPopul[superParent])
console.log("Стоимость конечной лучшей особи",vector[superParent])

