import React, {useEffect, useState, useRef, useMemo } from "react";
import { addIngredientService } from "../services/ingredientService";
import { useLocation, useNavigate } from "react-router";
import { Button } from "primereact/button";
import { useAuth } from '@clerk/clerk-react';
import { Message } from 'primereact/message';
import { Toast } from 'primereact/toast';
import { useUserRole } from '../utils/UserRole';
import { IngredientForm } from "../components/IngredientForm";

const AddIngredient = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({});
  const { getToken } = useAuth();
  const [showTip, setShowTip] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const rawData = location.state?.originalIngredient;
  const toast = useRef(null);
  const { role } = useUserRole();

  const ingredientsData = useMemo(() => {
    if (!rawData) return undefined;
    const { id, isCore, created_by, clerk_id, created_at, ...rest } = rawData;
    return rest;
  }, [rawData]);

  const handleFormSubmit = async (data) => {
    try {
      setSaveLoading(true);
      const token = await getToken();
      const response = await addIngredientService(data, token);

      if (response.success) {
        handleMessage({ success: true, severity: "success", message: 'Ingredient added successfully!' });
        setTimeout(() => {
          setSaveLoading(false);
          if (role === "Admin") {
            navigate("/view-ingredients-admin");
          } else {
            navigate("/view-ingredients");
          }
        }, 3500);
      }
    } catch (error) {
      handleMessage({ success: false, severity: "error", message: error.message || 'Failed to add ingredient' });
      setSaveLoading(false);
    }
  };

  const handleMessage = ({ success, severity, message }) => {
    toast.current?.show({
      severity: severity,
      summary: success ? 'Success' : 'Error',
      detail: message,
      life: 3000
    });
  };

  const mapOriginalIngredientToFormData = (original) => {
    const mapped = {};
  
    for (const key in original) {  
      const newKey = key.toLowerCase();
  
      if (newKey === "name") {
        mapped[newKey] = original[key];
      } else {
        mapped[newKey] = original[key] !== "" ? parseFloat(original[key]) : null; // Parse numbers
      }
    }
  
    return mapped;
  };
  
  useEffect(() => {
    if (ingredientsData) {
      const mappedData = mapOriginalIngredientToFormData(ingredientsData);
      setFormData(mappedData);
    }
  }, [ingredientsData]);
  
  return (
      <div className="p-5">
          <Toast ref={toast} position="top-right" />
          {/* Header and Message */}
          <div className="flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
            <h2 className="text-4xl font-bold m-0">Add new ingredient</h2>
    
            {showTip && (
              <Message
                severity="info"
                style={{
                  backgroundColor: '#e6f4fa',
                  border: '1px solid #b6e0f2',
                  color: '#0c5460',
                  borderRadius: '8px',
                  padding: '1rem',
                  maxWidth: '700px',
                }}
                content={
                  <div className="flex justify-content-between align-items-start w-full">
                    <span className="mr-3">
                      To use existing ingredient data, <b>select one checkbox</b> from the ingredient table and <b>click the "Add Ingredient" button</b> on the 
                      <span 
                        className="underline cursor-pointer " 
                        onClick={() => { 
                          if (role==="Admin") {
                            navigate("/view-ingredients-admin")
                          } else {
                            navigate("/view-ingredients")
                          }}
                        } 
                      > View Ingredients</span> page.
                    </span>
                    <Button
                      icon="pi pi-times"
                      className="p-button-text p-button-sm"
                      onClick={() => setShowTip(false)}
                      style={{ color: '#0c5460' }}
                    />
                  </div>
                }
              />
            )}
          </div>

          <IngredientForm 
            onSubmit={handleFormSubmit}
            onMessage={handleMessage}
            initialData={formData}
            saveLoading={saveLoading}
            role={role}
          />

      </div>
  );
};

export default AddIngredient;