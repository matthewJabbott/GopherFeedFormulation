import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Accordion, AccordionTab } from "primereact/accordion";

// This function formats the values in the result table to 2 decimal places
const formatValue = (value) => {
    return (value) ? value.toFixed(2) : '-';
};

export const FeedResultTable = ({ formulationResult }) => {

    // This function reformat the table to have an empty rows after "Digestible energy" and "Valine"
    const formattedRows = Object.entries(formulationResult).reduce((acc, [key, value]) => {
        acc.push([key, value]);
        if (key === "Digestible energy") {
            acc.push(["Amino Acids", []]);
        } else if (key === "Valine") {
            acc.push(["Fatty Acids", []]);
        }
        return acc;
    }, []);

    return (
        <DataTable
            value={formattedRows}
            className='p-2'
        >
            <Column
                header="Output (%)"
                body={(rowData) => {
                    if (rowData[0].startsWith("Amino Acids") || rowData[0].startsWith("Fatty Acids")) {
                        return (
                            <span className="font-bold text-base font-italic">
                            {rowData[0]}
                            </span>
                        );
                    }
                    return rowData[0];
                }}
            />
            <Column
                header="Dry matter basis"
                body={(rowData) => {
                    if (!rowData[0].startsWith("Amino Acids") && !rowData[0].startsWith("Fatty Acids")) {
                        return formatValue(rowData[1][0]);
                    }
                }}
            />
            <Column
                header="As is basis"
                body={(rowData) => {
                    if (!rowData[0].startsWith("Amino Acids") && !rowData[0].startsWith("Fatty Acids")) {
                        return formatValue(rowData[1][1]);
                    }
                }}
            />
        </DataTable>
    )
}

export const FeedSummaryResultTable = ({ result, totalCost, totalCarbonFootprint }) => {
    return (
        <Accordion activeIndex={0}>
            <AccordionTab header="Summary of results" className="bg-primary">
                <DataTable value={Object.entries(result)} className="p-2" emptyMessage="No results available">
                    <Column 
                        header="Output (%)" 
                        body={(rowData) => {
                            const [key] = rowData;
                            return key;
                        }} 
                    />
                    <Column 
                        header="Dry matter basis" 
                        body={(rowData) => {
                            const [, values] = rowData;
                            return formatValue(values[0]); // First value
                        }} 
                    />
                    <Column 
                        header="As is basis" 
                        body={(rowData) => {
                            const [, values] = rowData;
                            return formatValue(values[1]); // Second value
                        }} 
                    />
                </DataTable>
                <div className="flex justify-content-end mt-3">
                <strong>Total Feed Cost: ${totalCost.toFixed(2)}</strong>
                </div>
                <div className="flex justify-content-end mt-1">
                <strong>Total Carbon Footprint: {totalCarbonFootprint.toFixed(2)} kg CO₂eq/t</strong>
                </div>
            </AccordionTab>
        </Accordion>
    )
}