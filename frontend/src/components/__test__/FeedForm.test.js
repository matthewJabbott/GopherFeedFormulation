import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FeedForm } from '../FeedForm';
import { MemoryRouter } from 'react-router';

const mockNavigate = jest.fn();
const mockOnSave = jest.fn();
const mockSetFormulationResult = jest.fn();
const mockSetDownloadCSVData = jest.fn();
const mockOnMessage = jest.fn();

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockNavigate,
}));

describe('FeedForm Component', () => {
  const mockIngredients = [
    { id: 1, Name: 'Fishmeal (anchovy)', dry_matter: 92.2, crude_protein: 68.8, digestible_protein: 58.5, total_lipid: 6.5, carbohydrate: 1.9, total_phosphorus: 2.4, calcium: 4.5, ash: 15.0, gross_energy: 1.9, digestible_energy: 1.5, alanine: 3.9, arginine: 3.5, aspartic_acid: 6.1, cysteine: 0.2, glutamic_acid: 8.4, glycine: 3.7, histidine: 1.9, isoleucine: 2.5, leucine: 4.6, lysine: 5.2, methionine: 1.8, phenylalanine: 2.4, proline: 2.5, serine: 2.4, taurine: 0.6, threonine: 2.6, tyrosine: 1.9, valine: 3.1, C14_0: 0.4, C16_0: 13.4, C16_1: 4.0, C18_0: 3.2, C18_1: 5.3, C18_2n_6: 0.7, C18_3n_3: 0.5, C20_4n_6: 0.7, C20_5n_3: 8.6, C22_6n_3: 11.0, SFA: 21.2, MUFA: 12.3, PUFA: 25.2, lcPUFA: 22.3, LC_n_3: 21.2, LC_n_6: 1.1, isCore: 1 },
    { id: 2, Name: 'Poultry meal', dry_matter: 95.0, crude_protein: 66.0, digestible_protein: 56.1, total_lipid: 14.1, carbohydrate: 0.7, total_phosphorus: 2.2, calcium: 1.1, ash: 14.2, gross_energy: 2.1, digestible_energy: 1.9, alanine: 4.3, arginine: 4.5, aspartic_acid: 5.2, cysteine: 1.1, glutamic_acid: 8.2, glycine: 6.1, histidine: 1.2, isoleucine: 2.5, leucine: 4.6, lysine: 3.6, methionine: 1.4, phenylalanine: 2.5, proline: 4.9, serine: 3.5, taurine: 0.3, threonine: 2.7, tyrosine: 1.8, valine: 2.7, C14_0: 1.4, C16_0: 22.6, C16_1: 4.9, C18_0: 7.3, C18_1: 44.1, C18_2n_6: 11.9, C18_3n_3: 2.2, C20_4n_6: 0.5, C20_5n_3: 0.8, C22_6n_3: 1.3, SFA: 32.3, MUFA: 53.0, PUFA: 17.8, lcPUFA: 3.3, LC_n_3: 2.5, LC_n_6: 0.8, isCore: 1 },
    { id: 3, Name: 'Meat meal', dry_matter: 95.2, crude_protein: 50.0, digestible_protein: 42.5, total_lipid: 10.9, carbohydrate: 7.1, total_phosphorus: 4.9, calcium: 11.5, ash: 27.2, gross_energy: 1.7, digestible_energy: 1.6, alanine: 3.8, arginine: 3.4, aspartic_acid: 3.7, cysteine: 0.1, glutamic_acid: 6.3, glycine: 7.5, histidine: 0.8, isoleucine: 1.1, leucine: 2.9, lysine: 2.6, methionine: 0.7, phenylalanine: 1.7, proline: 4.4, serine: 2.0, taurine: 0.0, threonine: 1.6, tyrosine: 1.0, valine: 2.1, C14_0: 2.9, C16_0: 23.5, C16_1: 2.2, C18_0: 18.4, C18_1: 29.1, C18_2n_6: 1.3, C18_3n_3: 0.2, C20_4n_6: 0.1, C20_5n_3: 0.0, C22_6n_3: 0.0, SFA: 45.9, MUFA: 33.3, PUFA: 1.8, lcPUFA: 0.2, LC_n_3: 0.1, LC_n_6: 0.1, isCore: 1 }
  ];

  const defaultProps = {
    ingredients: mockIngredients,
    existingFeedNames: ['Test Feed 1', 'Test Feed 2'],
    setFeedNameExists: jest.fn(),
    saveLoading: false,
    onSave: mockOnSave,
    setFormulationResult: mockSetFormulationResult,
    selectedUnit: 'g.kg',
    onMessage: mockOnMessage,
    setDownloadCSVData: mockSetDownloadCSVData
  };

  const renderForm = (props = {}) => {
    const ref = React.createRef();
    const utils = render(
      <MemoryRouter>
        <FeedForm ref={ref} {...defaultProps} {...props} />
      </MemoryRouter>
    );
    return { ...utils, ref };
  };

  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation((msg) => {
      if (
        msg.includes('Could not parse CSS stylesheet')
      ) return;
      console.error(msg);
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('General Information Validation', () => {
    test ('should not allow more than 40 characters for feed name', async () => {
      renderForm({...defaultProps});

      const input = screen.getByLabelText(/feed name/i);
      fireEvent.change(input, { target: { value: ("a").repeat(42) } });
      fireEvent.blur(input);

      expect(input).toHaveValue(("a").repeat(40));
    });

    test ('should not allow existing feed name', async () => {
      renderForm({...defaultProps});

      const input = screen.getByLabelText(/feed name/i);
      fireEvent.change(input, { target: { value: "Test Feed 1" } });
      fireEvent.blur(input);

      expect(input).toHaveValue("Test Feed 1");

      expect(screen.getByText(/Feed name already exists/i)).toBeInTheDocument();
    });

    test ('should not allow more than 100 characters for feed description', async () => {
      renderForm({...defaultProps});

      const input = screen.getByLabelText(/feed description/i);
      fireEvent.change(input, { target: { value: ("a").repeat(102) } });
      fireEvent.blur(input);

      expect(input).toHaveValue(("a").repeat(100));
    });
  });
    
  describe('Percentage Input Validation', () => {
    test('should not allow string input for percentage input', async () => {
      renderForm({...defaultProps});      

      const percentageInput = screen.getByLabelText('percentage-1');
      expect(percentageInput).toBeInTheDocument();

      fireEvent.change(percentageInput, { target: { value: "abc" } });
      fireEvent.blur(percentageInput);

      expect(percentageInput.value).toBe("");
    });

    test('should not allow percentage input greater than 100.50', async () => {
      renderForm({...defaultProps});
      
      const percentageInput = screen.getByLabelText('percentage-1');
      expect(percentageInput).toBeInTheDocument();

      fireEvent.change(percentageInput, { target: { value: "101" } });
      fireEvent.blur(percentageInput);

      expect(percentageInput.value).toBe("100.50");
    });

    test('should not allow percentage input more than 2 decimal places', async () => {
      renderForm({...defaultProps});

      const percentageInput = screen.getByLabelText('percentage-1');
      expect(percentageInput).toBeInTheDocument();

      fireEvent.change(percentageInput, { target: { value: "99.505" } });
      fireEvent.blur(percentageInput);

      expect(percentageInput.value).toBe("99.51");
    });
  });

  describe('Cost Input Validation', () => {
    test('should not allow string input for cost input', async () => {
      renderForm({...defaultProps});

      const costInput = screen.getByLabelText('cost-1');
      expect(costInput).toBeInTheDocument();

      fireEvent.change(costInput, { target: { value: "abc" } });
      fireEvent.blur(costInput);

      expect(costInput.value).toBe("");
    });

    test('should not allow cost input greater than 99999.99', async () => {
      renderForm({...defaultProps});

      const costInput = screen.getByLabelText('cost-1');
      expect(costInput).toBeInTheDocument();

      fireEvent.change(costInput, { target: { value: "100000" } });
      fireEvent.blur(costInput);

      expect(costInput.value).toBe("99,999.99"); 
    });

    test('should not allow cost input more than 2 decimal places', async () => {
      renderForm({...defaultProps});

      const costInput = screen.getByLabelText('cost-1');
      expect(costInput).toBeInTheDocument();
      
      fireEvent.change(costInput, { target: { value: "100.505" } });
      fireEvent.blur(costInput);

      expect(costInput.value).toBe("100.51");
    });
  });

  describe('Carbon Footprint Input Validation', () => {
    test('should not allow string input for carbon footprint input', async () => {
      renderForm({...defaultProps});

      const carbonFootprintInput = screen.getByLabelText('carbon-footprint-1');
      expect(carbonFootprintInput).toBeInTheDocument();

      fireEvent.change(carbonFootprintInput, { target: { value: "abc" } });
      fireEvent.blur(carbonFootprintInput);

      expect(carbonFootprintInput.value).toBe("");
    });

    test('should not allow carbon footprint input greater than 99999.99', async () => {
      renderForm({...defaultProps});

      const carbonFootprintInput = screen.getByLabelText('carbon-footprint-1');
      expect(carbonFootprintInput).toBeInTheDocument();

      fireEvent.change(carbonFootprintInput, { target: { value: "100000" } });
      fireEvent.blur(carbonFootprintInput);

      expect(carbonFootprintInput.value).toBe("99,999.99");
    });

    test('should not allow carbon footprint input more than 2 decimal places', async () => {
      renderForm({...defaultProps});

      const carbonFootprintInput = screen.getByLabelText('carbon-footprint-1');
      expect(carbonFootprintInput).toBeInTheDocument();
      
      fireEvent.change(carbonFootprintInput, { target: { value: "100.505" } });
      fireEvent.blur(carbonFootprintInput);

      expect(carbonFootprintInput.value).toBe("100.51");
    });
  });
});