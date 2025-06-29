import { expect, test, mock } from 'bun:test';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegistrationForm from '../RegistrationForm';

// Mock Next.js navigation
const mockPush = mock(() => {});
mock.module('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    pathname: '/',
    query: {},
  }),
}));

test('RegistrationForm renders and validates email', async () => {
  render(<RegistrationForm />);
  
  const emailInput = screen.getByLabelText(/Email/i);
  const submitButton = screen.getByRole('button', { name: /Create Account/i });
  
  // Enter invalid email
  fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
  
  // Submit the form
  fireEvent.click(submitButton);
  
  // Wait for React Hook Form to process validation and show the error
  const errorMessage = await screen.findByText(/Please enter a valid email address/i);
  expect(errorMessage).toBeDefined();
});

test('RegistrationForm validates matching passwords', async () => {
  render(<RegistrationForm />);
  
  // Fill in all fields to trigger password matching validation
  const emailInput = screen.getByLabelText(/Email/i);
  const passwordInput = screen.getByLabelText(/^Password$/i);
  const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i);
  const submitButton = screen.getByRole('button', { name: /Create Account/i });
  
  // Enter valid email (to pass email validation)
  fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
  
  // Enter mismatched passwords
  fireEvent.change(passwordInput, { target: { value: 'password123' } });
  fireEvent.change(confirmPasswordInput, { target: { value: 'password456' } });
  
  // Submit the form
  fireEvent.click(submitButton);
  
  // Wait for the error message
  const errorMessage = await screen.findByText(/Passwords do not match/i);
  expect(errorMessage).toBeDefined();
});

test('RegistrationForm submits successfully with valid data', async () => {
    // Create the basic mock function
  const mockFetchFunction = mock(() => 
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ user: { id: '123' } }),
      status: 200,
      statusText: 'OK',
      headers: new Headers(),
    } as Response)
  );
  
  // Add the required static properties
  Object.assign(mockFetchFunction, {
    preconnect: () => {}, // Empty implementation for testing
  });
  
  // Use the double assertion pattern: first to 'unknown', then to the target type
  global.fetch = mockFetchFunction as unknown as typeof fetch;

  render(<RegistrationForm />);
  
  // Fill in all fields correctly
  fireEvent.change(screen.getByLabelText(/Email/i), { 
    target: { value: 'user@example.com' } 
  });
  fireEvent.change(screen.getByLabelText(/^Password$/i), { 
    target: { value: 'SecurePass123!' } 
  });
  fireEvent.change(screen.getByLabelText(/Confirm Password/i), { 
    target: { value: 'SecurePass123!' } 
  });
  
  // Submit the form
  fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));
  
  // Wait for the button text to change to "Creating Account..."
  await screen.findByText(/Creating Account.../i);
  
  // Verify the API was called
  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledWith('/api/auth/register', expect.any(Object));
  });
  
  // Verify navigation happened
  await waitFor(() => {
    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });
});