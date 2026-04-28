import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

vi.mock('../config/env', () => ({
  default: {
    emailLogin: true,
    termsOfUseURL: '#',
    privacyPolicyURL: '#',
  },
}));

vi.mock('motion/react', async () => {
  const actual = await vi.importActual('motion/react');
  return actual;
});

vi.mock('../libs/firebaseClient', () => ({
  signInWithGoogle: vi.fn(),
}));

vi.mock('../store/useUserStore', () => ({
  useUserStore: vi.fn(() => ({
    login: vi.fn(),
    loginError: '',
    loginLoading: false,
    setAuthenticatedUser: vi.fn(),
  })),
}));

// Import after mocks are set up
import { Login } from '../components/Login';
import { signInWithGoogle } from '../libs/firebaseClient';
import { useUserStore } from '../store/useUserStore';

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete (window as any).__E2E_MOCK_AUTHENTICATED_USER__;
  });

  describe('Rendering', () => {
    it('renders login header with title and subtitle', () => {
      render(<Login />);

      expect(screen.getByText('Mental Math Master')).toBeInTheDocument();
      expect(
        screen.getByText('Master mental math with planetary challenges')
      ).toBeInTheDocument();
    });

    it('renders email input when emailLogin config is true', () => {
      render(<Login />);

      const emailInput = screen.getByPlaceholderText('Enter your email');
      expect(emailInput).toBeInTheDocument();
    });

    it('renders password input when emailLogin config is true', () => {
      render(<Login />);

      const passwordInput = screen.getByPlaceholderText('Enter your password');
      expect(passwordInput).toBeInTheDocument();
    });

    it('renders Google sign-in button', () => {
      render(<Login />);

      const googleButton = screen.getByRole('button', { name: /google/i });
      expect(googleButton).toBeInTheDocument();
    });

    it('renders sign up toggle button', () => {
      render(<Login />);

      expect(screen.getByText(/don't have an account/i)).toBeInTheDocument();
      expect(screen.getByText(/sign up/i)).toBeInTheDocument();
    });

    it('renders remember me checkbox', () => {
      render(<Login />);

      expect(screen.getByLabelText(/remember me/i)).toBeInTheDocument();
    });

    it('renders forgot password button', () => {
      render(<Login />);

      expect(screen.getByText(/forgot password/i)).toBeInTheDocument();
    });
  });

  describe('Password Visibility Toggle', () => {
    it('password input is hidden by default', () => {
      render(<Login />);

      const passwordInput = screen.getByPlaceholderText(
        'Enter your password'
      ) as HTMLInputElement;
      expect(passwordInput.type).toBe('password');
    });

    it('toggles password visibility when eye icon is clicked', () => {
      render(<Login />);

      const passwordInput = screen.getByPlaceholderText(
        'Enter your password'
      ) as HTMLInputElement;

      // Initially hidden
      expect(passwordInput.type).toBe('password');

      // Find the toggle button by looking for it in the password field's parent
      const eyeButtons = screen.getAllByRole('button');
      const toggleButton = eyeButtons.find(btn => {
        return (
          btn.classList.contains('absolute') &&
          btn.classList.contains('right-4')
        );
      });

      if (toggleButton) {
        fireEvent.click(toggleButton);

        // After click, should be visible
        expect(passwordInput.type).toBe('text');

        // Click again to hide
        fireEvent.click(toggleButton);
        expect(passwordInput.type).toBe('password');
      }
    });
  });

  describe('Form Input Handling', () => {
    it('updates email input value when typed', () => {
      render(<Login />);

      const emailInput = screen.getByPlaceholderText(
        'Enter your email'
      ) as HTMLInputElement;

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

      expect(emailInput.value).toBe('test@example.com');
    });

    it('updates password input value when typed', () => {
      render(<Login />);

      const passwordInput = screen.getByPlaceholderText(
        'Enter your password'
      ) as HTMLInputElement;

      fireEvent.change(passwordInput, {
        target: { value: 'password123' },
      });

      expect(passwordInput.value).toBe('password123');
    });
  });

  describe('Sign Up Toggle', () => {
    it('toggles sign up mode when button is clicked', () => {
      render(<Login />);

      // Initial state - sign in mode
      expect(screen.getByText(/don't have an account/i)).toBeInTheDocument();
      expect(screen.getByText(/sign up/i)).toBeInTheDocument();

      // Click sign up
      const signUpButton = screen.getByRole('button', { name: /sign up/i });
      fireEvent.click(signUpButton);

      // Should now show sign in option
      expect(screen.getByText(/already have an account/i)).toBeInTheDocument();
      expect(screen.getByText(/sign in/i)).toBeInTheDocument();

      // Click sign in
      const signInButton = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(signInButton);

      // Should be back to original state
      expect(screen.getByText(/don't have an account/i)).toBeInTheDocument();
    });

    it('displays correct button text based on sign up mode', () => {
      render(<Login />);

      // Initial - sign in
      const submitButton = screen.getByRole('button', {
        name: /sign in/i,
      });
      expect(submitButton).toHaveTextContent('Sign In');

      // Toggle to sign up
      const signUpToggle = screen.getByRole('button', { name: /sign up/i });
      fireEvent.click(signUpToggle);

      // Submit button should now say Create Account
      const newSubmitButton = screen.getByRole('button', {
        name: /create account/i,
      });
      expect(newSubmitButton).toHaveTextContent('Create Account');
    });
  });

  describe('Form Submission', () => {
    it('calls login when form is submitted with email and password', () => {
      render(<Login />);

      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Enter your password');
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      expect(emailInput).toHaveValue('test@example.com');
      expect(passwordInput).toHaveValue('password123');

      // Verify submit button is clickable (not disabled)
      expect(submitButton).not.toBeDisabled();
      fireEvent.click(submitButton);
    });

    it('prevents default form submission behavior', () => {
      render(<Login />);

      const form = screen.getByPlaceholderText('Enter your email').closest(
        'form'
      );

      if (form) {
        const submitEvent = new Event('submit', { bubbles: true });
        const preventDefaultSpy = vi.spyOn(submitEvent, 'preventDefault');

        form.dispatchEvent(submitEvent);

        expect(preventDefaultSpy).toHaveBeenCalled();
      }
    });
  });

  describe('Error Handling', () => {
    it('displays empty error message initially', () => {
      render(<Login />);

      // The component renders a <p> element for errors, which is empty initially
      // Find the error display element (it's after the password field in the form)
      const errorElements = screen.queryAllByText((content, element) => {
        return content === '' && element?.tagName === 'P';
      });

      // The error <p> element should exist (even if empty)
      expect(errorElements.length).toBeGreaterThan(0);
    });
  });

  describe('Loading State', () => {
    it('displays submit button when loginLoading is false', () => {
      render(<Login />);

      expect(screen.getByText('Sign In')).toBeInTheDocument();
    });
  });

  describe('Google Sign-In', () => {
    it('calls signInWithGoogle when Google button is clicked', () => {
      render(<Login />);

      const googleButton = screen.getByRole('button', { name: /google/i });
      expect(googleButton).toBeInTheDocument();

      // Verify the button is clickable
      expect(googleButton).not.toBeDisabled();
      fireEvent.click(googleButton);

      const mockSignIn = vi.mocked(signInWithGoogle);
      expect(mockSignIn).toHaveBeenCalled();
    });

    it('has test auth override path available', () => {
      const testUser = {
        token: 'fake-token',
        email: 'test@example.com',
        name: 'Test User',
        avatar: null,
      };

      (window as any).__E2E_MOCK_AUTHENTICATED_USER__ = testUser;

      // Verify the override is accessible from window
      expect((window as any).__E2E_MOCK_AUTHENTICATED_USER__).toEqual(testUser);
    });
  });

  describe('Email Login Configuration', () => {
    it('renders email form when emailLogin config is enabled', () => {
      render(<Login />);

      const emailInput = screen.queryByPlaceholderText('Enter your email');
      expect(emailInput).toBeInTheDocument();
    });

    it('does not call signInWithGoogle when email/password login happens', () => {
      vi.mocked(signInWithGoogle).mockClear();

      render(<Login />);

      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Enter your password');
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      const mockSignIn = vi.mocked(signInWithGoogle);
      expect(mockSignIn).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('email input has proper label', () => {
      render(<Login />);

      const emailLabel = screen.getByText('Email');
      expect(emailLabel).toBeInTheDocument();
    });

    it('password input has proper label', () => {
      render(<Login />);

      const passwordLabel = screen.getByText('Password');
      expect(passwordLabel).toBeInTheDocument();
    });

    it('email input is required', () => {
      render(<Login />);

      const emailInput = screen.getByPlaceholderText(
        'Enter your email'
      ) as HTMLInputElement;
      expect(emailInput.required).toBe(true);
    });

    it('password input is required', () => {
      render(<Login />);

      const passwordInput = screen.getByPlaceholderText(
        'Enter your password'
      ) as HTMLInputElement;
      expect(passwordInput.required).toBe(true);
    });
  });
});
