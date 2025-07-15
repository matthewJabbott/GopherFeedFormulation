import React, { useEffect, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Checkbox } from "primereact/checkbox";
import { Accordion } from "primereact/accordion";
import { AccordionTab } from "primereact/accordion";
import { Button } from "primereact/button";
import { useNavigate } from "react-router";
import { useState } from "react";

export const IngredientForm = ({
  onSubmit,
  onMessage,
  initialData,
  saveLoading,
  role
}) => {

  const [formData, setFormData] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    setFormData(initialData || {});
  }, [initialData]);

  const fields = {
    general: [
      { id: 'name', label: 'Ingredient Name *', type: 'text' },
      ...(role === 'Admin' ? [
        { id: 'isCore', label: 'Core Ingredient', type: 'checkbox' }
      ] : [])
    ],
    nutritional1: [
      "dry matter",
      "crude protein",
      "digestible protein",
      "total lipid",
      "carbohydrate",
      "total phosphorus",
      "calcium",
      "ash",
      "gross energy",
      "digestible energy",
    ],
    nutritional2: [
      "alanine",
      "arginine",
      "aspartic acid",
      "cysteine",
      "glutamic acid",
      "glycine",
      "histidine",
      "isoleucine",
      "leucine",
      "lysine",
      "methionine",
      "phenylalanine",
      "proline",
      "serine",
      "taurine",
      "threonine",
      "tyrosine",
      "valine",
    ],
    nutritional3: [
      "c14:0",
      "c16:0",
      "c16:1",
      "c18:0",
      "c18:1",
      "c18:2n-6",
      "c18:3n-3",
      "c20:4n-6",
      "c20:5n-3",
      "c22:6n-3",
      "sfa",
      "mufa",
      "pufa",
      "lcpufa",
      "lc n-3",
      "lc n-6",
    ],
  };

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
    setValidationErrors({ ...validationErrors, [name]: "" }); 
  };
    
  const validateForm = () => {
    const errors = {};
    if (!formData.name) {
      errors.name = "Ingredient Name is required.";
    }
    return errors;
  };
    
  const handleSubmit = async (e) => {
    e.preventDefault();
    const ingredientName = document.getElementById("name");
    if (role === 'Admin') {
      const checkbox = document.getElementById("isCore");
      if (checkbox && checkbox.checked) {
        formData.isCore = 1;
      } else {
        formData.isCore = 0;
      }
    } else {
      formData.isCore = 0;
    }
    const errors = validateForm();
  
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      onMessage({ success: false, severity: "error", message: 'Please fill in the required fields.' });
      return;
    }
    onSubmit(formData);
  };  

  const renderInputs = (keys) => (
    <div className="p-fluid grid">
      {keys.map((field) => {
        const isObjectField = typeof field === 'object';
        const id = isObjectField ? field.id : field;
        const label = isObjectField
        ? field.label
        : field.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
        const htmlSafeId = id.replace(/\s+/g, '_');
        return (
          <div key={id} className={id === "name" ? "col-6 mb-2" : "col-6 md:col-4 lg:col-2 mb-2"}>
            <label id={`label-${htmlSafeId}`} className="block mb-1">{label}</label>
            {isObjectField && field.type === 'checkbox' ? (
              <div className="flex align-items-center">
                <Checkbox
                  inputId={id}
                  checked={!!formData[id]}
                  onChange={(e) => handleChange(id, e.checked)}
                />
              </div>
            ) : isObjectField ? (
              <>
              <InputText
                id={id}
                value={formData[id] || ""}
                aria-labelledby={`label-${htmlSafeId}`}
                onChange={(e) => {
                  const val = e.target.value.slice(0, 255);
                  handleChange(id, val)
                }}
                className={validationErrors[id] ? "p-invalid" : ""}
                maxLength={255}
              />
              {validationErrors[id] && (
              <small className="p-error">{validationErrors[id]}</small>
              )}
              </>
            ) : (
              <InputNumber
                inputId={htmlSafeId}
                value={formData[id] || null}
                aria-labelledby={`label-${htmlSafeId}`}
                onChange={(e) => {
                  let rawValue = e.value;
                  let clampedValue = rawValue;
                  if (rawValue > 99999999.99) {
                    clampedValue = 99999999.99;
                  }
                  handleChange(id, clampedValue);
                }}
                mode="decimal"
                minFractionDigits={2}
                maxFractionDigits={2}
                max={99999999.99}
                min={0}
              />
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <>
    <form onSubmit={handleSubmit}>
      <Accordion multiple activeIndex={[0, 1, 2, 3]} className="custom-accordion">
        <AccordionTab header="General Information">
          {renderInputs(fields.general)}
        </AccordionTab>
        <AccordionTab header="Nutrients">
          {renderInputs(fields.nutritional1)}
        </AccordionTab>
        <AccordionTab header="Amino Acids">
          {renderInputs(fields.nutritional2)}
        </AccordionTab>
        <AccordionTab header="Fatty Acids">
          {renderInputs(fields.nutritional3)}
        </AccordionTab>
      </Accordion>
      <div className="flex justify-content-end gap-2 mt-4">
        <Button type="submit" label="Add Ingredient" className="text-white unified-button" loading={saveLoading}/>
        <Button 
          label="Cancel" severity="secondary" text 
          onClick={() => { 
            if (role==="Admin") {
              navigate("/view-ingredients-admin")
            } else {
              navigate("/view-ingredients")
            }
          }
        }/>
      </div>
    </form>
    </>
  );
};
