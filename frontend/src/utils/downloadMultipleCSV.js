// Input: 
//   feeds: [
//      {
//          "feedName": "",
//          "creationDate": "",
//          "ingredientPercentages": [
//              { 
//                  "id": "1",
//                  "Name": "Fish Meal",
//                  "percentage": 20
//                  "Dry matter": 90.00,
//                  "Digestible Protein": 80.00,
//                  all the nutritional value...
//              }, 
//              {
//                  "id": "2",
//                  "Name": "Fish Oil",
//                  "percentage": 80
//                  "Dry matter": 100.00,
//                  "Digestible Protein": 10.00,
//                  all the nutritional value...
//              }
//          ]
//      }, { another feed.. }
import { generateFeed } from "./generateFeed";

export const downloadMultipleCSV = (feeds) => {
    if (!feeds) {
        console.error('No data available to download.');
        return;
    }

    let csvContent = '';

    feeds.forEach(feedData => {

        // Add feed data at the top in separate rows
        const feedNameRow = ['Feed Name:', feedData.feedName].join(', ') + '\n';
        const creationDateRow = ['Creation Date:', feedData.creationDate].join(', ') + '\n';
        const ingredientsRow = ['Ingredients:'].join(', ') + '\n';

        // Ingredient name + percentage
        const percentagesRow = feedData.ingredientPercentages
            .map(ingredient => {
                const name = ingredient.Name || 'Unnamed Ingredient';
                const percentage = ingredient.percentage || 0;
                return `${name}, ${percentage}%`;
            })
            .join('\n');
        
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

        const formulationOutput = generateFeed(feedData.ingredientPercentages);

        // Loop through the keys and values of formulationOutput and append them to CSV content
        for (const key in formulationOutput) {
            if (formulationOutput.hasOwnProperty(key)) {
                // Concatenate key and its values into a single CSV row
                const row = [key, ...formulationOutput[key]].join(',');
                csvContent += row + '\n';
            }
        }

        csvContent += '\n--------------------------------------------------------\n\n';

    });

    // Create a Blob from the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    // Create a temporary download link
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', "feed.csv");
    document.body.appendChild(link);

    // Delay click to avoid interfering with overlay
    setTimeout(() => {
        link.click();
        document.body.removeChild(link);
    }, 0);
};
