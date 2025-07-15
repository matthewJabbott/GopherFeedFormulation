import React from 'react';
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { Panel } from "primereact/panel";
import { useState } from "react";
import { useUserRole } from "../utils/UserRole";

const UserGuide = () => {
    const [selectedOption, setSelectedOption] = useState(null);
    const { role } = useUserRole();

    const option = [
        {
            label: 'Ingredient',
            items: [
                { label: 'Add a new ingredient', value: 'addIngredient' },
                { label: 'Import and add a new ingredient', value: 'importIngredient' },
                { label: 'Delete an ingredient', value: 'deleteIngredient' }
            ]
        },
        {
            label: 'Feed',
            items: [
                { label: 'Add a new feed and download CSV', value: 'addFeed' },
                { label: 'Import and update an existing feed or create a new feed', value: 'updateFeed' },
                { label: 'Delete a feed', value: 'deleteFeed' },
                { label: 'Download one or more CSV', value: 'downloadCSV' }
            ]
        }
    ]

    const groupedItemTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <div>{option.label}</div>
            </div>
        );
    };

    return (

        <div className="p-4" style={{minHeight: "100vh" }}> 
            <Card title="User Guide" className="p-mb-3" style={{borderRadius: "15px", padding: "20px", color: "#333" }}>
            <p className="p-text-secondary" style={{ fontSize: "1rem" }}>
                First time using the Feed Forumulation portal? Select a task from the menu for instructions.
            </p>

            <Dropdown
                value={selectedOption}
                options={option}
                onChange={(e) => setSelectedOption(e.value)}
                placeholder="Please select a task"
                className="p-mb-3"
                style={{ marginBottom: "20px" }}
                optionLabel="label"
                optionGroupLabel="label"
                optionGroupChildren="items"
                optionGroupTemplate={groupedItemTemplate}
            />

            {selectedOption && (
                <Panel header={option.find(opt => opt.value === selectedOption)?.label} className="p-mt-3"> 
                    {selectedOption === "addIngredient" && role === "Member" && (
                        <div className="text-center flex justify-content-center align-items-center">
                            <iframe src="https://scribehow.com/viewer/User_guide_for_ingredient-related_features__ybhJ3z7gSzyPoWunPUwWUQ?scrollToActionId=03bd470d" width="50%" height="50%" allow="fullscreen" style={{aspectRatio: "1 / 1", minHeight: "480px", border: "0"}}></iframe>
                        </div>
                    )}

                    {selectedOption === "addIngredient" && role === "Admin" && (
                        <div className="text-center flex justify-content-center align-items-center">
                            <iframe src="https://scribehow.com/viewer/User_guide_for_ingredient-related_features__ybhJ3z7gSzyPoWunPUwWUQ?scrollToActionId=a10b31df" width="50%" height="50%" allow="fullscreen" style={{aspectRatio: "1 / 1", minHeight: "480px", border: "0"}}></iframe>
                        </div>
                    )}

                    {selectedOption === "importIngredient" && (
                        <div className="text-center flex justify-content-center align-items-center">
                            <iframe src="https://scribehow.com/viewer/User_guide_for_ingredient-related_features__ybhJ3z7gSzyPoWunPUwWUQ?scrollToActionId=52363050" width="50%" height="50%" allow="fullscreen" style={{aspectRatio: "1 / 1", minHeight: "480px", border: "0"}}></iframe>
                        </div>
                    )}

                    {selectedOption === "deleteIngredient" && (
                        <div className="text-center flex justify-content-center align-items-center">
                            <iframe src="https://scribehow.com/viewer/User_guide_for_ingredient-related_features__ybhJ3z7gSzyPoWunPUwWUQ?scrollToActionId=3c966fd5" width="50%" height="50%" allow="fullscreen" style={{aspectRatio: "1 / 1", minHeight: "480px", border: "0"}}></iframe>
                        </div>
                    )}

                    {selectedOption === "addFeed" && (
                        <div className="text-center flex justify-content-center align-items-center">
                            <iframe src="https://scribehow.com/viewer/User_guide_for_feed-related_features__H9QJ7hYdS1yjok616e_Zhg?scrollToActionId=79cb9582" width="50%" height="50%" allow="fullscreen" style={{aspectRatio: "1 / 1", minHeight: "480px", border: "0"}}></iframe>
                        </div>
                    )}

                    {selectedOption === "updateFeed" && (
                        <div className="text-center flex justify-content-center align-items-center">
                            <iframe src="https://scribehow.com/viewer/User_guide_for_feed-related_features__H9QJ7hYdS1yjok616e_Zhg?scrollToActionId=eed53448" width="50%" height="50%" allow="fullscreen" style={{aspectRatio: "1 / 1", minHeight: "480px", border: "0"}}></iframe>
                        </div>
                    )}

                    {selectedOption === "deleteFeed" && (
                        <div className="text-center flex justify-content-center align-items-center">
                            <iframe src="https://scribehow.com/viewer/User_guide_for_feed-related_features__H9QJ7hYdS1yjok616e_Zhg?scrollToActionId=3f12ba72" width="50%" height="50%" allow="fullscreen" style={{aspectRatio: "1 / 1", minHeight: "480px", border: "0"}}></iframe>
                        </div>
                    )}

                    {selectedOption === "downloadCSV" && (
                        <div className="text-center flex justify-content-center align-items-center">
                            <iframe src="https://scribehow.com/viewer/User_guide_for_feed-related_features__H9QJ7hYdS1yjok616e_Zhg?scrollToActionId=aba5d353" width="50%" height="50%" allow="fullscreen" style={{aspectRatio: "1 / 1", minHeight: "480px", border: "0"}}></iframe>
                        </div>
                    )}
                </Panel>
            )}
            </Card>
            <Card 
                className="mt-3" 
                style={{ backgroundColor: "#e4eee7", borderRadius: "15px", padding: "20px", color: "#333" }}
            >
                <p style={{ margin: 0 }}>
                    For any issues not listed above, please contact Michael at m.salini@deakin.edu.au
                </p>
            </Card>
        </div>
            );
};
export default UserGuide