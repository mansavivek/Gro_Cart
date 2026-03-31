import { render, screen } from '@testing-library/react';
import Input from '../components/ui/Input';

describe('Input component', () => {
  it('renders label', () => {
    render(<Input label="Email" />);
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('renders error message', () => {
    render(<Input label="Email" error="Required" />);
    expect(screen.getByText('Required')).toBeInTheDocument();
  });

  it('applies error border class when error is set', () => {
    render(<Input label="Test" error="Error" />);
    expect(screen.getByRole('textbox')).toHaveClass('border-red-400');
  });
});
