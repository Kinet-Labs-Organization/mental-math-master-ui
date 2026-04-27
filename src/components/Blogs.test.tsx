import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { Blogs } from './Blogs';

// Mock the stores and hooks
const mockUseGenericStore = vi.hoisted(() => ({
  useGenericStore: vi.fn(),
}));

const mockUseNavigate = vi.hoisted(() => vi.fn());

vi.mock('../store/useGenericStore', () => mockUseGenericStore);

vi.mock('react-router-dom', () => ({
  useNavigate: mockUseNavigate,
}));

vi.mock('./shared/skeleton-loader', () => ({
  default: ({ height, width, radius }: any) => (
    <div data-testid="skeleton" style={{ height, width, borderRadius: radius }}>
      Skeleton
    </div>
  ),
}));

// Mock window.open
const mockOpen = vi.fn();
Object.defineProperty(window, 'open', {
  writable: true,
  value: mockOpen,
});

describe('Blogs', () => {
  const mockFetchBlogs = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseNavigate.mockReturnValue(vi.fn());
  });

  it('renders loading skeleton when loading is true', () => {
    mockUseGenericStore.useGenericStore.mockReturnValue({
      blogs: [],
      blogsLoading: true,
      fetchBlogs: mockFetchBlogs,
    });

    render(<Blogs />);

    const skeletons = screen.getAllByTestId('skeleton');
    expect(skeletons.length).toBeGreaterThan(0);
    expect(mockFetchBlogs).toHaveBeenCalled();
  });

  it('renders blogs when not loading', () => {
    const mockBlogs = [
      { link: 'https://example.com/1', image: 'img1.jpg', title: 'Blog 1', read: '3 min' },
      { link: 'https://example.com/2', image: 'img2.jpg', title: 'Blog 2' },
    ];

    mockUseGenericStore.useGenericStore.mockReturnValue({
      blogs: mockBlogs,
      blogsLoading: false,
      fetchBlogs: mockFetchBlogs,
    });

    render(<Blogs />);

    expect(screen.getByText('Blog 1')).toBeInTheDocument();
    expect(screen.getByText('Blog 2')).toBeInTheDocument();
    expect(screen.getByText('3 min read')).toBeInTheDocument();
    expect(screen.getByText('5 min read')).toBeInTheDocument(); // default for second blog
    expect(mockFetchBlogs).toHaveBeenCalled();
  });

  it('navigates back when back button is clicked', () => {
    const mockNavigate = vi.fn();
    mockUseNavigate.mockReturnValue(mockNavigate);

    mockUseGenericStore.useGenericStore.mockReturnValue({
      blogs: [],
      blogsLoading: false,
      fetchBlogs: mockFetchBlogs,
    });

    render(<Blogs />);

    const backButton = screen.getByRole('button');
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('opens blog link when blog is clicked', () => {
    const mockBlogs = [
      { link: 'https://example.com/1', image: 'img1.jpg', title: 'Blog 1', read: '3 min' },
    ];

    mockUseGenericStore.useGenericStore.mockReturnValue({
      blogs: mockBlogs,
      blogsLoading: false,
      fetchBlogs: mockFetchBlogs,
    });

    render(<Blogs />);

    const blogCard = screen.getByText('Blog 1').closest('div');
    fireEvent.click(blogCard!);

    expect(mockOpen).toHaveBeenCalledWith('https://example.com/1', '_blank', 'noopener,noreferrer');
  });
});