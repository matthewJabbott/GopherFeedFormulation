import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { IngredientForm } from '../IngredientForm';
import { MemoryRouter } from 'react-router';

const mockNavigate = jest.fn();

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockNavigate,
}));

describe('IngredientForm Component', () => {
    const defaultProps = {
        onSubmit: jest.fn(),
        onMessage: jest.fn(),
        initialData: {},
        saveLoading: false,
        role: 'Admin',
    };

    beforeAll(() => {
        jest.spyOn(console, 'error').mockImplementation((msg) => {
          if (
            msg.includes('Could not parse CSS stylesheet')
          ) return;
          console.error(msg);
        });
    });

    const renderForm = (props = {}) =>
    render(
        <MemoryRouter>
            <IngredientForm {...defaultProps} {...props} />
        </MemoryRouter>
    );

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('General Validation', () => {
        test('shows error if ingredient name is empty', () => {
            renderForm({...defaultProps});
            
            const submitButton = screen.getByRole('button', { name: /add ingredient/i });
            fireEvent.click(submitButton);
        
            expect(defaultProps.onMessage).toHaveBeenCalledWith({
                success: false,
                severity: "error",
                message: 'Please fill in the required fields.'
            });

            expect(screen.getByText(/ingredient name is required/i)).toBeInTheDocument();
        });

        test('should not allow input more than 255 characters in ingredient name', () => {
            renderForm({...defaultProps});
            
            const input = screen.getByLabelText(/ingredient name/i);
            fireEvent.change(input, { target: { value: "a".repeat(256) } });
            fireEvent.blur(input); // Trigger blur event to validate the input

            expect(input).toHaveValue("a".repeat(255));
        })

        test('should not render "Core Ingredient" checkbox for member role', () => {
            renderForm({ ...defaultProps, role: 'member' });
        
            const checkbox = screen.queryByLabelText(/core ingredient/i);
            expect(checkbox).not.toBeInTheDocument();
        });
    });

    describe('Input Number Validation', () => {
        test('should not allow string input for number fields', () => {
            renderForm({...defaultProps});
            
            const input = screen.getByLabelText(/dry matter/i);
            fireEvent.change(input, { target: { value: 'abc' } });
            fireEvent.blur(input);

            expect(input).toHaveValue("");
        });

        test('should not allow input greater than 99999999.99', async () => {
            renderForm({...defaultProps});
        
            const input = screen.getByLabelText(/crude protein/i);
            fireEvent.change(input, { target: { value: 100000000 } });
            fireEvent.blur(input);
        
            expect(input).toHaveValue("99,999,999.99");
        });

        test('should not allow input more than 2 decimal places', async () => {
            renderForm({...defaultProps});
        
            const input = screen.getByLabelText(/crude protein/i);
            fireEvent.change(input, { target: { value: 99.1232424 } });
            fireEvent.blur(input); 
        
            expect(input).toHaveValue("99.12");
        });    
    });

});
