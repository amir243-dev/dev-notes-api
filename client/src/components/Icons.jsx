export const Logo = () => <div className="logo">&gt;_</div>;

export const IconFlame = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path
      d="M8 1.5c.3 1.9 1.3 3 2.4 4.2 1 1.1 2.1 2.3 2.1 4.3A4.5 4.5 0 0 1 8 14.5a4.5 4.5 0 0 1-4.5-4.5c0-1.4.6-2.5 1.4-3.5.3.8.8 1.4 1.6 1.8C6.2 6 6.9 3.6 8 1.5z"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
  </svg>
);

export const IconChevron = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path
      d="M4 6l4 4 4-4"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
