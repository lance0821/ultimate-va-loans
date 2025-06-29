import { expect, test, mock } from 'bun:test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'; // Import user-event


// Mock Next.js navigation
const mockPush = mock(() => {});
mock.module('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

import RegistrationForm from '../RegistrationForm';

test('RegistrationForm renders and validates email', async () => {
  const user = userEvent.setup(); // Set up user-event
  render(<RegistrationForm />);
  
  const emailInput = screen.getByLabelText(/Email/i);
  const submitButton = screen.getByRole('button', { name: /Create Account/i });
  
  // Use user.type to simulate real user typing
  await user.type(emailInput, 'invalid-email');
  
  // Use user.click to simulate a full click event
  await user.click(submitButton);
  
  // Your recommendation to use findByText is correct
  const errorMessage = await screen.findByText(/Please enter a valid email address/i);
  expect(errorMessage).toBeDefined();
});

test('RegistrationForm validates matching passwords', async () => {
  const user = userEvent.setup();
  render(<RegistrationForm />);
  
  const passwordInput = screen.getByLabelText(/^Password$/i);
  const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i);
  const submitButton = screen.getByRole('button', { name: /Create Account/i });
  
  await user.type(passwordInput, 'password123');
  await user.type(confirmPasswordInput, 'password456');
  await user.click(submitButton);
  
  const errorMessage = await screen.findByText(/Passwords do not match/i);
  expect(errorMessage).toBeDefined();
});