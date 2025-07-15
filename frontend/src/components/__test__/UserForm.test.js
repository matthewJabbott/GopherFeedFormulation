import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserForm from '../UserForm';

describe('UserForm Input Validation', () => {
  const mockProps = {
    visible: true,
    onHide: jest.fn(),
    onAddUser: jest.fn(),
    users: [
      {
        username: 'testuser',
        email: 'testuser@example.com'
      },
      {
        username: 'testuser2',
        email: 'testuser2@example.com'
      }
    ],
    usernameLoading: false,
    emailLoading: false,
    saveUserLoading: false,
    onMessage: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation((msg) => {
      if (
        msg.includes('Could not parse CSS stylesheet')
      ) return;
      console.error(msg);
    });
  });

  const renderUserForm = () => {
    return render(<UserForm {...mockProps} />);
  };

  describe('Input Length Validation', () => {
    test('username should not exceed 40 characters', () => {
      renderUserForm();
      const usernameInput = screen.getByLabelText(/username/i);
      
      // Try to input 41 characters
      const longUsername = 'a'.repeat(41);
      fireEvent.change(usernameInput, { target: { value: longUsername } });
      
      // Should only accept 40 characters
      expect(usernameInput.value).toHaveLength(40);
    });

    test('first name should not exceed 40 characters', () => {
      renderUserForm();
      const firstNameInput = screen.getByLabelText(/first name/i);
      
      // Try to input 41 characters
      const longFirstName = 'a'.repeat(41);
      fireEvent.change(firstNameInput, { target: { value: longFirstName } });
      
      // Should only accept 40 characters
      expect(firstNameInput.value).toHaveLength(40);
    });

    test('last name should not exceed 40 characters', () => {
      renderUserForm();
      const lastNameInput = screen.getByLabelText(/last name/i);
      
      // Try to input 41 characters
      const longLastName = 'a'.repeat(41);
      fireEvent.change(lastNameInput, { target: { value: longLastName } });
      
      // Should only accept 40 characters
      expect(lastNameInput.value).toHaveLength(40);
    });

    test('email should not exceed 255 characters', () => {
      renderUserForm();
      const emailInput = screen.getByLabelText(/email/i);
      
      // Try to input 256 characters
      const longEmail = 'a'.repeat(256) + '@example.com';
      fireEvent.change(emailInput, { target: { value: longEmail } });
      
      // Should only accept 255 characters
      expect(emailInput.value).toHaveLength(255);
    });

    test('password should not exceed 40 characters', () => {
      renderUserForm();
      const passwordInput = screen.getByLabelText('Password *', { exact: true });
      
      // Try to input 41 characters
      const longPassword = 'A'.repeat(41);
      fireEvent.change(passwordInput, { target: { value: longPassword } });
      
      // Should only accept 40 characters
      expect(passwordInput.value).toHaveLength(40);
    });
  });

  describe('Username and Email Uniqueness Validation', () => {
    test('username should be unique', () => {
      renderUserForm();
      const usernameInput = screen.getByLabelText(/username/i);

      fireEvent.change(usernameInput, { target: { value: 'testuser' } });
      expect(screen.getByText(/Username already exists./i)).toBeInTheDocument();
    });
    
    test('email should be unique', () => {
      renderUserForm();
      const emailInput = screen.getByLabelText(/email/i);

      fireEvent.change(emailInput, { target: { value: 'testuser@example.com' } });
      expect(screen.getByText(/Email already exists./i)).toBeInTheDocument();
    });
  })

  describe('Input Validation', () => {
    test('username should not be empty', () => {
      renderUserForm();
      const usernameInput = screen.getByLabelText(/username/i);

      fireEvent.change(usernameInput, { target: { value: '' } });
      fireEvent.click(screen.getByText(/Add User/i));

      expect(mockProps.onMessage).toHaveBeenCalledWith({
        severity: "error",
        summary: 'Validation Error',
        detail: 'Username is required.'
      });
    });

    test('first name should not be empty', () => {
      renderUserForm();

      // ensure username is not empty and unique
      const usernameInput = screen.getByLabelText(/username/i);
      fireEvent.change(usernameInput, { target: { value: 'testuser3' } });
      expect(usernameInput.value).toBe('testuser3');

      const firstNameInput = screen.getByLabelText(/first name/i);
      fireEvent.change(firstNameInput, { target: { value: '' } });
      fireEvent.click(screen.getByText(/Add User/i));
      expect(screen.getByText(/First name is required./i)).toBeInTheDocument();

      expect(mockProps.onMessage).toHaveBeenCalledWith({
        severity: "error",
        summary: 'Validation Error',
        detail: 'First name is required.'
      });
    });

    test('last name should not be empty', () => {
      renderUserForm();

      // ensure username is not empty and unique
      const usernameInput = screen.getByLabelText(/username/i);
      fireEvent.change(usernameInput, { target: { value: 'testuser3' } });
      expect(usernameInput.value).toBe('testuser3');

      // ensure first name is not empty
      const firstNameInput = screen.getByLabelText(/first name/i);
      fireEvent.change(firstNameInput, { target: { value: 'test' } });
      expect(firstNameInput.value).toBe('test');

      const lastNameInput = screen.getByLabelText(/last name/i);
      fireEvent.change(lastNameInput, { target: { value: '' } });
      fireEvent.click(screen.getByText(/Add User/i));
      expect(screen.getByText(/Last name is required./i)).toBeInTheDocument();

      expect(mockProps.onMessage).toHaveBeenCalledWith({
        severity: "error",
        summary: 'Validation Error',
        detail: 'Last name is required.'
      });
    });

    test('email should not be empty', () => {
      renderUserForm();

      // ensure username is not empty and unique
      const usernameInput = screen.getByLabelText(/username/i);
      fireEvent.change(usernameInput, { target: { value: 'testuser3' } });
      expect(usernameInput.value).toBe('testuser3');

      // ensure first name is not empty
      const firstNameInput = screen.getByLabelText(/first name/i);
      fireEvent.change(firstNameInput, { target: { value: 'test' } });
      expect(firstNameInput.value).toBe('test');

      // ensure last name is not empty
      const lastNameInput = screen.getByLabelText(/last name/i);
      fireEvent.change(lastNameInput, { target: { value: 'user3' } });
      expect(lastNameInput.value).toBe('user3');

      const emailInput = screen.getByLabelText(/email/i);
      fireEvent.change(emailInput, { target: { value: '' } });
      fireEvent.click(screen.getByText(/Add User/i));
      expect(screen.getByText(/Email is required./i)).toBeInTheDocument();

      expect(mockProps.onMessage).toHaveBeenCalledWith({
        severity: "error",
        summary: 'Validation Error',
        detail: 'Email is required.'
      });
    });

    test('email should be a valid email', () => {
      renderUserForm();

      // ensure username is not empty and unique
      const usernameInput = screen.getByLabelText(/username/i);
      fireEvent.change(usernameInput, { target: { value: 'testuser3' } });
      expect(usernameInput.value).toBe('testuser3');

      // ensure first name is not empty
      const firstNameInput = screen.getByLabelText(/first name/i);
      fireEvent.change(firstNameInput, { target: { value: 'test' } });
      expect(firstNameInput.value).toBe('test');

      // ensure last name is not empty
      const lastNameInput = screen.getByLabelText(/last name/i);
      fireEvent.change(lastNameInput, { target: { value: 'user3' } });
      expect(lastNameInput.value).toBe('user3');

      const emailInput = screen.getByLabelText(/email/i);
      fireEvent.change(emailInput, { target: { value: 'testuser' } });
      fireEvent.click(screen.getByText(/Add User/i));
      expect(screen.getByText(/Invalid email format\/Email is required./i)).toBeInTheDocument();
      expect(mockProps.onMessage).toHaveBeenCalledWith({
        severity: "error",
        summary: 'Validation Error',
        detail: 'Invalid email format.'
      });
    });

    test('password should not be empty', () => {
      renderUserForm();

      // ensure username is not empty and unique
      const usernameInput = screen.getByLabelText(/username/i);
      fireEvent.change(usernameInput, { target: { value: 'testuser3' } });
      expect(usernameInput.value).toBe('testuser3');

      // ensure first name is not empty
      const firstNameInput = screen.getByLabelText(/first name/i);
      fireEvent.change(firstNameInput, { target: { value: 'test' } });
      expect(firstNameInput.value).toBe('test');

      // ensure last name is not empty
      const lastNameInput = screen.getByLabelText(/last name/i);
      fireEvent.change(lastNameInput, { target: { value: 'user3' } });
      expect(lastNameInput.value).toBe('user3');

      // ensure email is not empty
      const emailInput = screen.getByLabelText(/email/i);
      fireEvent.change(emailInput, { target: { value: 'testuser3@example.com' } });
      expect(emailInput.value).toBe('testuser3@example.com');

      const passwordInput = screen.getByLabelText('Password *', { exact: true });
      fireEvent.change(passwordInput, { target: { value: '' } });
      fireEvent.click(screen.getByText(/Add User/i));
      expect(mockProps.onMessage).toHaveBeenCalledWith({
        severity: "error",
        summary: 'Validation Error',
        detail: 'Password is required.'
      });
    });

    test('password should match the strength criteria', () => {
      renderUserForm();

      const passwordInput = screen.getByLabelText('Password *', { exact: true });
      fireEvent.change(passwordInput, { target: { value: '1234567' } });
      fireEvent.click(screen.getByText(/Add User/i));
      expect(screen.getByText(/Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character./i)).toBeInTheDocument();
    });
  });
});