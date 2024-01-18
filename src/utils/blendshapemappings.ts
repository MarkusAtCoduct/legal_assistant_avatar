
export const mapBlendshapes = (azureBlendshapes: number[], blendshapeDictionary: string[]) => {
    let blendshapes = [];

    azureBlendshapes.forEach((blendshape) => {

        let blendshapeObject = { 
            [blendshapeDictionary[0]]: blendshape[43],
            [blendshapeDictionary[1]]: blendshape[41],
            [blendshapeDictionary[2]]: blendshape[42],
            [blendshapeDictionary[3]]: blendshape[44],
            [blendshapeDictionary[4]]: blendshape[45],
            [blendshapeDictionary[5]]: blendshape[4],
            [blendshapeDictionary[6]]: blendshape[11],
            [blendshapeDictionary[7]]: blendshape[1],
            [blendshapeDictionary[8]]: blendshape[8],
            [blendshapeDictionary[9]]: blendshape[2],
            [blendshapeDictionary[10]]: blendshape[9],
            [blendshapeDictionary[11]]: blendshape[3],
            [blendshapeDictionary[12]]: blendshape[10],
            [blendshapeDictionary[13]]: blendshape[0],
            [blendshapeDictionary[14]]: blendshape[7],
            [blendshapeDictionary[15]]: blendshape[5],
            [blendshapeDictionary[16]]: blendshape[12],
            [blendshapeDictionary[17]]: blendshape[6],
            [blendshapeDictionary[18]]: blendshape[13],
            [blendshapeDictionary[19]]: blendshape[46],
            [blendshapeDictionary[20]]: blendshape[47],
            [blendshapeDictionary[21]]: blendshape[48],
            [blendshapeDictionary[22]]: blendshape[49],
            [blendshapeDictionary[23]]: blendshape[50],
            [blendshapeDictionary[24]]: blendshape[17],
            [blendshapeDictionary[25]]: blendshape[14],
            [blendshapeDictionary[26]]: blendshape[15],
            [blendshapeDictionary[27]]: blendshape[16],
            [blendshapeDictionary[28]]: blendshape[19],
            [blendshapeDictionary[29]]: blendshape[20],
            [blendshapeDictionary[30]]: blendshape[21],
            [blendshapeDictionary[31]]: blendshape[22],
            [blendshapeDictionary[32]]: blendshape[32],
            [blendshapeDictionary[33]]: blendshape[31],
            [blendshapeDictionary[34]]: blendshape[34],
            [blendshapeDictionary[35]]: blendshape[33],
            [blendshapeDictionary[36]]: blendshape[18],
            [blendshapeDictionary[37]]: blendshape[23],
            [blendshapeDictionary[38]]: blendshape[24],
            [blendshapeDictionary[39]]: blendshape[25],
            [blendshapeDictionary[40]]: blendshape[26],
            [blendshapeDictionary[41]]: blendshape[27],
            [blendshapeDictionary[42]]: blendshape[28],
            [blendshapeDictionary[43]]: blendshape[39],
            [blendshapeDictionary[44]]: blendshape[40],
            [blendshapeDictionary[45]]: blendshape[37],
            [blendshapeDictionary[46]]: blendshape[38],
            [blendshapeDictionary[47]]: blendshape[35],
            [blendshapeDictionary[48]]: blendshape[36],
            [blendshapeDictionary[49]]: blendshape[29],
            [blendshapeDictionary[50]]: blendshape[30],
            [blendshapeDictionary[51]]: blendshape[51],
        };
        blendshapes.push(blendshapeObject);
    });
    
    return blendshapes;
}