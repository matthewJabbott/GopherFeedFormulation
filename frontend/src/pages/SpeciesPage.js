import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { TabView, TabPanel } from "primereact/tabview";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { useAuth } from "@clerk/clerk-react";

// Import API services
import {
  getAllSpecies,
  deleteSpecies,
  searchSpecies,
} from "../services/speciesService";

// These would typically be in a separate constants file
const WEIGHT_CATEGORIES = {
  1: "Nursery (<350 g)",
  2: "Grower (350-1000 g)",
  3: "Large (1000+ g)",
  4: "Nursery (0-5 g)",
  5: "Grower (5-15 g)",
  6: "Large (15-30+ g)",
};

// Diet specifications data
const DIET_SPECS = {
  "1-1": {
    protein_min: 46,
    protein_max: 52,
    lipid_min: 20,
    lipid_max: 24,
    gross_energy_min: 20,
    gross_energy_max: 23,
    phosphorus_min: 1,
    phosphorus_max: 2,
    lcPUFA_min: 2,
    lcPUFA_max: 4,
  },
  "1-2": {
    protein_min: 40,
    protein_max: 46,
    lipid_min: 24,
    lipid_max: 30,
    gross_energy_min: 23,
    gross_energy_max: 26,
    phosphorus_min: 1,
    phosphorus_max: 2,
    lcPUFA_min: 1,
    lcPUFA_max: 3,
  },
  "1-3": {
    protein_min: 36,
    protein_max: 42,
    lipid_min: 30,
    lipid_max: 38,
    gross_energy_min: 24,
    gross_energy_max: 28,
    phosphorus_min: 0.5,
    phosphorus_max: 1.5,
    lcPUFA_min: 0,
    lcPUFA_max: 2,
  },
  "2-1": {
    protein_min: 50,
    protein_max: 55,
    lipid_min: 10,
    lipid_max: 15,
    gross_energy_min: 18,
    gross_energy_max: 19,
    phosphorus_min: 1,
    phosphorus_max: 0,
  },
  "2-2": { protein_min: 45, protein_max: 50, lipid_min: 15, lipid_max: 20 },
  "2-3": {
    protein_min: 40,
    protein_max: 45,
    lipid_min: 20,
    lipid_max: 25,
    gross_energy_min: 20,
    gross_energy_max: 22,
    phosphorus_min: 0.8,
  },
};

// Ingredient specifications data
const INGREDIENT_SPECS = {
  "1-1": [
    { ingredient_name: "Fishmeal (anchovy)", min_value: 30, max_value: 50 },
    { ingredient_name: "Poultry meal", min_value: 0, max_value: 15 },
    { ingredient_name: "Wheat flour", min_value: 10, max_value: 100 },
  ],
  "1-2": [
    { ingredient_name: "Fishmeal (anchovy)", min_value: 15, max_value: 50 },
    { ingredient_name: "Poultry meal", min_value: 0, max_value: 15 },
    { ingredient_name: "Wheat flour", min_value: 10, max_value: 100 },
  ],
  "1-3": [
    { ingredient_name: "Fishmeal (anchovy)", min_value: 5, max_value: 50 },
    { ingredient_name: "Poultry meal", min_value: 0, max_value: 15 },
    { ingredient_name: "Wheat flour", min_value: 15, max_value: 100 },
  ],
  "2-1": [
    { ingredient_name: "Fishmeal (anchovy)", min_value: 15, max_value: 30 },
    { ingredient_name: "Fish oil (Menhaden)", min_value: 4, max_value: null },
  ],
};

const SpeciesPage = () => {
  const navigate = useNavigate();
  const toast = useRef(null);
  const { getToken } = useAuth();

  // State definitions
  const [species, setSpecies] = useState([]);
  const [expandedRows, setExpandedRows] = useState(null);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [selectedSpecies, setSelectedSpecies] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  // Toast helper function
  const showToast = (severity, summary, detail, life = 3000) => {
    toast.current?.show({ severity, summary, detail, life });
  };

  // Transform API data to the format needed by the UI
  const transformApiToFrontend = (apiData) => {
    if (!apiData || !Array.isArray(apiData)) return [];

    const speciesMap = {};

    apiData.forEach((item) => {
      const speciesId = item.id;

      // Create parent species entry if it doesn't exist
      if (!speciesMap[speciesId]) {
        speciesMap[speciesId] = {
          id: speciesId,
          name: item.common_name,
          scientificName: item.scientific_name,
          type: "Fish",
          isParent: true,
          description: item.general_info || "",
          children: [],
        };
      }

      // Add weight categories as children
      for (let wcId = 1; wcId <= 6; wcId++) {
        const dietKey = `${speciesId}-${wcId}`;
        if (DIET_SPECS[dietKey]) {
          speciesMap[speciesId].children.push({
            id: `${speciesId}-${wcId}`,
            name: `${item.common_name} - ${WEIGHT_CATEGORIES[wcId]}`,
            scientificName: item.scientific_name,
            type: "Lifestage",
            parentId: speciesId,
            weightCatId: wcId,
            description: item.general_info || "",
            dietSpecs: DIET_SPECS[dietKey],
            ingredients: INGREDIENT_SPECS[dietKey] || [],
          });
        }
      }
    });

    return Object.values(speciesMap);
  };

  // Fetch all species data
  const fetchSpecies = useCallback(async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const response = await getAllSpecies(token);

      if (response.success) {
        setSpecies(transformApiToFrontend(response.data));
      } else {
        showToast("error", "Error", "Failed to fetch species data");
      }
    } catch (err) {
      console.error("Error fetching species:", err);
      showToast(
        "error",
        "Error",
        "Failed to fetch species data from the server"
      );
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  // Load data on component mount
  useEffect(() => {
    fetchSpecies();
  }, [fetchSpecies]);

  // Handle search
  const handleSearch = async (e) => {
    e.preventDefault();

    if (isSearchActive) {
      setSearchTerm("");
      setIsSearchActive(false);
      fetchSpecies();
      return;
    }

    if (!searchTerm.trim()) {
      fetchSpecies();
      return;
    }

    try {
      setLoading(true);
      const token = await getToken();
      const response = await searchSpecies(token, searchTerm);

      if (response.success) {
        setSpecies(transformApiToFrontend(response.data));
        setIsSearchActive(true);
      } else {
        showToast("error", "Error", "Failed to search species");
      }
    } catch (err) {
      console.error("Error searching species:", err);
      showToast("error", "Error", "Failed to search species");
    } finally {
      setLoading(false);
    }
  };

  // Navigation handlers
  const handleViewSpecies = (species) => {
    setSelectedSpecies(species);
    setActiveTab(0);
  };

  const handleAddSpecies = () => navigate("/add-species");

  const handleAddCategory = (parentId) =>
    navigate(`/add-species?parentId=${parentId}`);

  const handleEditSpecies = (id) => {
    navigate(`/add-species/${id}`);
    setUnsavedChanges(true);
  };

  const handleUseAsTemplate = () => {
    if (selectedSpecies) {
      navigate(`/add-feed?templateSpecies=${selectedSpecies.id}`);
    }
  };

  // Delete related functions
  const confirmDelete = (species) => {
    setSelectedSpecies(species);
    setDeleteDialog(true);
  };

  const hideDeleteDialog = () => setDeleteDialog(false);

  const deleteSpeciesItem = async () => {
    try {
      const token = await getToken();
      const idToDelete = selectedSpecies.parentId
        ? selectedSpecies.parentId.toString()
        : selectedSpecies.id.toString();

      const response = await deleteSpecies(token, idToDelete);

      if (response.success) {
        if (selectedSpecies.parentId) {
          // If it's a subcategory, update the parent
          setSpecies((prevSpecies) =>
            prevSpecies.map((item) => {
              if (item.id.toString() === selectedSpecies.parentId.toString()) {
                return {
                  ...item,
                  children: item.children.filter(
                    (child) => child.id !== selectedSpecies.id
                  ),
                };
              }
              return item;
            })
          );
        } else {
          // If it's a parent species, remove it completely
          setSpecies((prevSpecies) =>
            prevSpecies.filter(
              (item) => item.id.toString() !== selectedSpecies.id.toString()
            )
          );
        }

        setDeleteDialog(false);
        setSelectedSpecies(null);
        showToast(
          "success",
          "Success",
          `${selectedSpecies.name} deleted successfully`
        );
      } else {
        showToast(
          "error",
          "Error",
          response.message || "Failed to delete species"
        );
      }
    } catch (err) {
      showToast(
        "error",
        "Error",
        err.response?.data?.message || "Failed to delete species"
      );
      console.error(err);
    }
  };

  // Save changes handler
  const handleSaveChanges = () => {
    // Implementation would go here for saving changes
    setUnsavedChanges(false);
    showToast("success", "Success", "Changes saved successfully");
  };

  // Action templates
  const parentActionTemplate = (rowData) => (
    <div className="flex gap-2">
      <Button
        icon="pi pi-plus"
        className="p-button-rounded p-button-text"
        onClick={() => handleAddCategory(rowData.id)}
        tooltip="Add Subcategory"
      />
      <Button
        icon="pi pi-eye"
        className={`p-button-rounded p-button-text ${
          selectedSpecies && selectedSpecies.id === rowData.id
            ? "p-button-info"
            : ""
        }`}
        onClick={() => handleViewSpecies(rowData)}
        tooltip="View"
      />
    </div>
  );

  const childActionTemplate = (rowData) => (
    <div className="flex gap-2">
      <Button
        icon="pi pi-pencil"
        className="p-button-rounded p-button-text"
        onClick={() => handleEditSpecies(rowData.id)}
        tooltip="Edit"
      />
      <Button
        icon="pi pi-trash"
        className="p-button-rounded p-button-text p-button-danger"
        onClick={() => confirmDelete(rowData)}
        tooltip="Delete"
      />
      <Button
        icon="pi pi-eye"
        className={`p-button-rounded p-button-text ${
          selectedSpecies && selectedSpecies.id === rowData.id
            ? "p-button-info"
            : ""
        }`}
        onClick={() => handleViewSpecies(rowData)}
        tooltip="View"
      />
    </div>
  );

  const actionBodyTemplate = (rowData) =>
    rowData.isParent
      ? parentActionTemplate(rowData)
      : childActionTemplate(rowData);

  // Row expansion template
  const rowExpansionTemplate = (data) => (
    <div className="pl-4 ml-2">
      {data.children && data.children.length > 0 ? (
        <DataTable
          value={data.children}
          className="p-datatable-sm"
          showHeaders={false}
        >
          <Column field="name" style={{ fontWeight: "normal" }} />
          <Column body={childActionTemplate} style={{ width: "150px" }} />
        </DataTable>
      ) : (
        <div className="p-3 text-center">
          <i className="pi pi-info-circle mr-2"></i>
          No subcategories available
        </div>
      )}
    </div>
  );

  // Diet specifications renderers
  const renderDietSpecs = () => {
    if (!selectedSpecies) return <p>No species selected</p>;

    if (selectedSpecies.isParent) {
      return renderComparisonDietSpecs();
    }

    const dietSpecs = selectedSpecies.dietSpecs;
    if (!dietSpecs) {
      return (
        <div className="p-4 text-center">
          <i
            className="pi pi-info-circle text-3xl mb-3"
            style={{ color: "var(--primary-color)" }}
          ></i>
          <p>No diet specifications available for this species.</p>
        </div>
      );
    }

    // Convert to DataTable format
    const specRows = [
      { label: "Fish Weight", value: selectedSpecies.name.split(" - ")[1] },
      {
        label: "Protein",
        value: `${dietSpecs.protein_min}-${dietSpecs.protein_max}%`,
      },
      {
        label: "Lipid",
        value: `${dietSpecs.lipid_min}-${dietSpecs.lipid_max}%`,
      },
      {
        label: "Gross Energy (MJ)",
        value:
          dietSpecs.gross_energy_min && dietSpecs.gross_energy_max
            ? `${dietSpecs.gross_energy_min}-${dietSpecs.gross_energy_max}`
            : "Not specified",
      },
      {
        label: "Total Phosphorus",
        value:
          dietSpecs.phosphorus_min || dietSpecs.phosphorus_max
            ? `${dietSpecs.phosphorus_min || ""} ${
                dietSpecs.phosphorus_max ? "- " + dietSpecs.phosphorus_max : ""
              }%`
            : "Not specified",
      },
      {
        label: "Long-chain PUFA",
        value:
          dietSpecs.lcPUFA_min || dietSpecs.lcPUFA_max
            ? `${dietSpecs.lcPUFA_min || ""} ${
                dietSpecs.lcPUFA_max ? "- " + dietSpecs.lcPUFA_max : ""
              }%`
            : "Not specified",
      },
    ];

    return (
      <DataTable value={specRows} className="p-datatable-sm">
        <Column
          field="label"
          header="Specification"
          style={{ fontWeight: "bold" }}
        />
        <Column field="value" header="Value" />
      </DataTable>
    );
  };

  const renderComparisonDietSpecs = () => {
    if (
      !selectedSpecies ||
      !selectedSpecies.children ||
      selectedSpecies.children.length === 0
    ) {
      return (
        <div className="p-4 text-center">
          <i
            className="pi pi-info-circle text-3xl mb-3"
            style={{ color: "var(--primary-color)" }}
          ></i>
          <p>No subcategories available for comparison.</p>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 border text-left">Specification</th>
              {selectedSpecies.children.map((child) => (
                <th key={child.id} className="p-3 border text-left">
                  {child.name.split(" - ")[1]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-3 border font-medium">Protein</td>
              {selectedSpecies.children.map((child) => (
                <td key={`${child.id}-protein`} className="p-3 border">
                  {child.dietSpecs?.protein_min}-{child.dietSpecs?.protein_max}%
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-3 border font-medium">Lipid</td>
              {selectedSpecies.children.map((child) => (
                <td key={`${child.id}-lipid`} className="p-3 border">
                  {child.dietSpecs?.lipid_min}-{child.dietSpecs?.lipid_max}%
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-3 border font-medium">Gross Energy (MJ)</td>
              {selectedSpecies.children.map((child) => (
                <td key={`${child.id}-ge`} className="p-3 border">
                  {child.dietSpecs?.gross_energy_min &&
                  child.dietSpecs?.gross_energy_max
                    ? `${child.dietSpecs.gross_energy_min}-${child.dietSpecs.gross_energy_max}`
                    : "Not specified"}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-3 border font-medium">Total Phosphorus</td>
              {selectedSpecies.children.map((child) => (
                <td key={`${child.id}-phosphorus`} className="p-3 border">
                  {child.dietSpecs?.phosphorus_min ||
                  child.dietSpecs?.phosphorus_max
                    ? `${child.dietSpecs.phosphorus_min || ""} ${
                        child.dietSpecs.phosphorus_max
                          ? "- " + child.dietSpecs.phosphorus_max
                          : ""
                      }%`
                    : "Not specified"}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-3 border font-medium">Long-chain PUFA</td>
              {selectedSpecies.children.map((child) => (
                <td key={`${child.id}-lcpufa`} className="p-3 border">
                  {child.dietSpecs?.lcPUFA_min || child.dietSpecs?.lcPUFA_max
                    ? `${child.dietSpecs.lcPUFA_min || ""} ${
                        child.dietSpecs.lcPUFA_max
                          ? "- " + child.dietSpecs.lcPUFA_max
                          : ""
                      }%`
                    : "Not specified"}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  // Ingredient specifications renderers
  const renderIngredientSpecs = () => {
    if (!selectedSpecies) return <p>No species selected</p>;

    if (selectedSpecies.isParent) {
      return renderComparisonIngredientSpecs();
    }

    const specs = selectedSpecies.ingredients;
    if (!specs || specs.length === 0) {
      return (
        <div className="p-4 text-center">
          <i
            className="pi pi-info-circle text-3xl mb-3"
            style={{ color: "var(--primary-color)" }}
          ></i>
          <p>No ingredient specifications available for this species.</p>
        </div>
      );
    }

    return (
      <DataTable value={specs} className="p-datatable-sm">
        <Column
          field="ingredient_name"
          header="Ingredient"
          style={{ fontWeight: "bold" }}
        />
        <Column
          field="min_value"
          header="Min %"
          body={(rowData) => rowData.min_value || "Not specified"}
        />
        <Column
          field="max_value"
          header="Max %"
          body={(rowData) => rowData.max_value || "Not specified"}
        />
      </DataTable>
    );
  };

  const renderComparisonIngredientSpecs = () => {
    if (
      !selectedSpecies ||
      !selectedSpecies.children ||
      selectedSpecies.children.length === 0
    ) {
      return (
        <div className="p-4 text-center">
          <i
            className="pi pi-info-circle text-3xl mb-3"
            style={{ color: "var(--primary-color)" }}
          ></i>
          <p>No subcategories available for comparison.</p>
        </div>
      );
    }

    // Find all unique ingredients across children
    const allIngredients = new Set();
    selectedSpecies.children.forEach((child) => {
      if (child.ingredients && child.ingredients.length > 0) {
        child.ingredients.forEach((spec) => {
          allIngredients.add(spec.ingredient_name);
        });
      }
    });

    if (allIngredients.size === 0) {
      return (
        <div className="p-4 text-center">
          <i
            className="pi pi-info-circle text-3xl mb-3"
            style={{ color: "var(--primary-color)" }}
          ></i>
          <p>No ingredient specifications available for comparison.</p>
        </div>
      );
    }

    const ingredientsArray = Array.from(allIngredients);

    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 border text-left">Ingredient</th>
              {selectedSpecies.children.map((child) => (
                <th key={child.id} className="p-3 border text-left">
                  {child.name.split(" - ")[1]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ingredientsArray.map((ingredient, idx) => (
              <tr key={idx}>
                <td className="p-3 border font-medium">{ingredient}</td>
                {selectedSpecies.children.map((child) => {
                  const spec = child.ingredients
                    ? child.ingredients.find(
                        (s) => s.ingredient_name === ingredient
                      )
                    : null;

                  return (
                    <td
                      key={`${child.id}-${ingredient}`}
                      className="p-3 border"
                    >
                      {spec
                        ? `${spec.min_value || "0"}${
                            spec.max_value ? " - " + spec.max_value : ""
                          }%`
                        : "-"}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Delete dialog footer
  const deleteDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-danger"
        onClick={deleteSpeciesItem}
      />
    </React.Fragment>
  );

  return (
    <div className="species-page p-4">
      <Toast ref={toast} />

      <div className="grid">
        {/* Left panel - Species List */}
        <div className="col-12 md:col-5">
          <Card>
            <div className="flex mb-4">
              <span className="flex-1 mr-2">
                <InputText
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search species..."
                  className="w-full"
                />
              </span>
              <Button
                label={isSearchActive ? "Clear" : "Search"}
                icon={isSearchActive ? "pi pi-times" : "pi pi-search"}
                className={
                  isSearchActive ? "p-button p-button-danger" : "p-button"
                }
                onClick={handleSearch}
                style={
                  isSearchActive
                    ? {}
                    : { backgroundColor: "var(--primary-color)" }
                }
              />
            </div>

            <DataTable
              value={species.filter((s) => s.isParent)}
              expandedRows={expandedRows}
              onRowToggle={(e) => setExpandedRows(e.data)}
              rowExpansionTemplate={rowExpansionTemplate}
              paginator
              rows={5}
              loading={loading}
              emptyMessage="No species found"
              className="p-datatable-sm"
              stripedRows
            >
              <Column expander style={{ width: "3em" }} />
              <Column field="name" header="Species Name" sortable />
              <Column
                body={actionBodyTemplate}
                header="Action"
                style={{ width: "150px" }}
              />
            </DataTable>

            <div className="flex justify-content-end mt-4">
              <Button
                label="Add Species Category"
                icon="pi pi-plus"
                className="p-button"
                onClick={handleAddSpecies}
                style={{ backgroundColor: "var(--primary-color)" }}
              />
            </div>
          </Card>
        </div>

        {/* Right panel - Species Details */}
        <div className="col-12 md:col-7">
          {selectedSpecies ? (
            <Card>
              <div className="mb-4">
                <h2 className="text-2xl font-semibold">
                  {selectedSpecies.name}
                </h2>
                <p className="text-gray-600 italic">
                  {selectedSpecies.scientificName}
                </p>
              </div>

              <TabView
                activeIndex={activeTab}
                onTabChange={(e) => setActiveTab(e.index)}
              >
                <TabPanel header="General Info">
                  <p className="line-height-3">
                    {selectedSpecies.description || "No description available."}
                  </p>
                </TabPanel>

                <TabPanel header="Diet Specs">{renderDietSpecs()}</TabPanel>

                <TabPanel header="Ingredient Specs">
                  {renderIngredientSpecs()}
                </TabPanel>
              </TabView>

              <div className="flex gap-2 mt-4">
                {!selectedSpecies.isParent && (
                  <>
                    <Button
                      label="Use as Template"
                      icon="pi pi-file"
                      className="p-button"
                      onClick={handleUseAsTemplate}
                      style={{ backgroundColor: "var(--primary-color)" }}
                    />
                    <Button
                      label="Edit"
                      icon="pi pi-pencil"
                      className="p-button"
                      onClick={() => handleEditSpecies(selectedSpecies.id)}
                      style={{ backgroundColor: "var(--primary-color)" }}
                    />
                    <Button
                      label="Delete"
                      icon="pi pi-trash"
                      className="p-button p-button-danger"
                      onClick={() => confirmDelete(selectedSpecies)}
                    />
                  </>
                )}
                {unsavedChanges && (
                  <Button
                    label="Save Changes"
                    icon="pi pi-save"
                    className="p-button p-button-success"
                    onClick={handleSaveChanges}
                  />
                )}
              </div>
            </Card>
          ) : (
            <Card>
              <div className="flex flex-column align-items-center justify-content-center p-5">
                <i
                  className="pi pi-info-circle text-5xl mb-3"
                  style={{ color: "var(--primary-color)" }}
                ></i>
                <h3>Species Details</h3>
                <p className="text-center line-height-3">
                  Please click on the view icon <i className="pi pi-eye"></i>{" "}
                  next to a species or subcategory to view its details.
                </p>
                <p className="text-center line-height-3 mt-2">
                  You can expand a species category by clicking the{" "}
                  <i className="pi pi-chevron-down"></i> icon to see its
                  subcategories.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <Dialog
        visible={deleteDialog}
        style={{ width: "450px" }}
        header="Confirm Delete"
        modal
        footer={deleteDialogFooter}
        onHide={hideDeleteDialog}
      >
        <div className="flex align-items-center justify-content-center">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {selectedSpecies && (
            <span>
              Are you sure you want to delete <b>{selectedSpecies.name}</b>?
            </span>
          )}
        </div>
      </Dialog>
    </div>
  );
};

export default SpeciesPage;
