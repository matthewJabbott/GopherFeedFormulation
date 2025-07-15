/*
export const getSpeciesArray = (selectedSpecies) => {
    const IAACSpecies = {
        'Salmon': [0.0, 0.9, 0.0, 0.15, 0.0, 0.0, 0.3, 0.6, 1.0, 1.0, 0.5, 0.6, 0.0, 0.0, 0.15, 0.65, 0.0, 0.6],
        'Chinook': [0.0, 0.69, 0.0, 0.0, 0.0, 0.0, 0.3, 0.3, 0.93, 1.0, 0.39, 0.46, 0.0, 0.0, 0.0, 0.59, 0.0, 0.6],
        'Abalone': [0.0, 1.2, 0.0, 0.27, 0.0, 0.0, 0.34, 0.7, 1.16, 1.0, 0.38, 0.6, 0.0, 0.0, 0.0, 0.8, 0.0, 0.8],
        'Barramundi': Array(18).fill(0.0),
        'Shrimp': Array(18).fill(0.0)
    };    

    return IAACSpecies[selectedSpecies] || null;
};
export const generateFeed = (selectedIngredients, selectedSpecies) => {
*/

// Input: ingredient objects like id, Name, Ingredient, created_at, IsOriginal, percentage, all the nutritional value.
export const generateFeed = (selectedIngredients) => {

    const selectedIngredientsWithoutId = selectedIngredients.map(({ id, Name, created_at, isCore, clerk_id, created_by,  ...rest }) => rest);

    let formulationOutput = {};
    let sourceKey = "Dry matter";
    let targetKey = "Gross energy";
    let changedOutputAsIsBasisFormula = false;

    for (const ingredient of selectedIngredientsWithoutId) {
        for (const key in ingredient) {
            if (ingredient.hasOwnProperty(key) && key !== "percentage") {
                if (!formulationOutput[key]) {
                    // formulationOutput[key] = [0.0, 0.0, 0.0, 0.0, 0.0];
                    formulationOutput[key] = [0.0, 0.0];
                }

                if (key === sourceKey) changedOutputAsIsBasisFormula = true;
                else if (key === targetKey) changedOutputAsIsBasisFormula = false;

                if (changedOutputAsIsBasisFormula) {
                    formulationOutput[key][1] += (ingredient["percentage"]/100) * parseFloat(ingredient[key])/10;
                } else {
                    formulationOutput[key][1] += (ingredient["percentage"]/100) * parseFloat(ingredient[key]);
                }

                formulationOutput[key][0] = ((formulationOutput[key][1])/(formulationOutput['Dry matter'][1]/1000))*(1-(0.1/100))/10;
            }
        }
    }

    sourceKey = 'Alanine';
    targetKey = 'C14:0';
    let outputAdd = false;
    /*
    formulationOutput['Lysine'][2] = 0.053 * formulationOutput['Digestible Protein'][1]*10;

    const IAACSpeciesArray = getSpeciesArray(selectedSpecies);
    let index = 0;

    for (let key in formulationOutput) {
        if (key === sourceKey) outputAdd = true;
        else if (key === targetKey) outputAdd = false;

        if (outputAdd) {
            if (key !== 'Lysine') {
                formulationOutput[key][2] = IAACSpeciesArray[index] * formulationOutput['Lysine'][2];
            }
            formulationOutput[key][4] = IAACSpeciesArray[index] * 100;
            formulationOutput[key][3] = isFinite((formulationOutput[key][1] / formulationOutput[key][2]) * 100) ? (formulationOutput[key][1] / formulationOutput[key][2]) * 100 : 0;
            index++;
        }
    }
    */

    sourceKey = 'C14:0';
    targetKey = 'SFA';
    outputAdd = false;
    let totalOutput = 0.0;
    //let totalIaacRatio = 0.0;
    //let outputIaacRatio = false;

    for (let key in formulationOutput) {
        if (key === sourceKey) {
            outputAdd = true;
        } else if (key === targetKey) {
            outputAdd = false;
        }
        if (outputAdd) {
            totalOutput += formulationOutput[key][1];
        }
    }
    /*
    for (let key in formulationOutput) {
        if (key === sourceKey) {
            outputAdd = true;
            outputIaacRatio = true;
        } 
        if (key === targetKey) {
            outputIaacRatio = false;
        }
        if (outputAdd) {
            formulationOutput[key][3] = (formulationOutput[key][1] / totalOutput) * 100;
        }
        if (outputIaacRatio) {
            totalIaacRatio += formulationOutput[key][3];
        }
    }
    */
    var totalMoisture = ((totalOutput)/(formulationOutput['Dry matter'][1]*10/1000))*(1-(0.1/100));
    //formulationOutput['Total Fatty Acids'] = [totalMoisture, totalOutput, 0.0, totalIaacRatio, 0.0];
    formulationOutput['Total Fatty Acids'] = [totalMoisture, totalOutput];

    return formulationOutput;
};
