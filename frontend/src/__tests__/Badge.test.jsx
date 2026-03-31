import { render, screen } from '@testing-library/react';
import Badge, { orderStatusBadge } from '../components/ui/Badge';

describe('Badge component', () => {
  it('renders children', () => {
    render(<Badge>pending</Badge>);
    expect(screen.getByText('pending')).toBeInTheDocument();
  });

  it('applies green color', () => {
    render(<Badge color="green">Delivered</Badge>);
    expect(screen.getByText('Delivered')).toHaveClass('bg-green-100');
  });
});

describe('orderStatusBadge', () => {
  it('returns yellow for pending', () => {
    expect(orderStatusBadge('pending')).toBe('yellow');
  });

  it('returns green for delivered', () => {
    expect(orderStatusBadge('delivered')).toBe('green');
  });

  it('returns blue for in_progress', () => {
    expect(orderStatusBadge('in_progress')).toBe('blue');
  });

  it('returns gray for unknown status', () => {
    expect(orderStatusBadge('unknown')).toBe('gray');
  });
});
