// Input: 
// 1. feedData: {
//      "feedName": "",
//      "creationDate": "",
//      "ingredientPercentages": { 
//          "ingredientCode1": "percentage1",
//          "ingredientCode2": "percentage2"
//      }
// }
// 2. formulationOutput: Output from the generateFeed() function

export const downloadCSV = (feedData, formulationOutput) => {
    if (!feedData || !formulationOutput) {
        console.error('No data available to download.');
        return;
    }

    let csvContent = '';

    // Add feed data at the top in separate rows
    const feedNameRow = ['Feed Name:', feedData.feedName].join(', ') + '\n';
    const creationDateRow = ['Creation Date:', feedData.creationDate].join(', ') + '\n';
    const ingredientsRow = ['Ingredients:'].join(', ') + '\n';

    // Add ingredients and their percentages in separate rows
    let percentagesRow = Object.entries(feedData.ingredientPercentages)
                            .map(([code, percent]) => `${code},${percent}%`)
                            .join("\n");
    csvContent += feedNameRow + creationDateRow + ingredientsRow + percentagesRow + '\n\n';

    // Add header rows to the CSV content
    const headers = [
        ['', 'MOISTURE TARGET', 'OUTPUT'],
        ['Parameters', '0%', 'AS IS BASIS']
    ];

    // Append header rows
    headers.forEach(headerRow => {
        csvContent += headerRow.join(',') + '\n';
    });

    // Loop through the keys and values of formulationOutput and append them to CSV content
    for (const key in formulationOutput) {
        if (formulationOutput.hasOwnProperty(key)) {
            // Concatenate key and its values into a single CSV row
            const row = [key, ...formulationOutput[key]].join(',');
            csvContent += row + '\n';
        }
    }

    // Create a Blob from the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    // Create a temporary download link
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', feedData.feedName ? `${feedData.feedName}.csv` : "feed.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
