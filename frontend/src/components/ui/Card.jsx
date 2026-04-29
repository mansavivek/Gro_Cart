/**
 * Card
 *
 * Simple presentational container with rounded corners and shadow used
 * throughout the app for grouping related content.
 */
export default function Card({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 ${className}`}>
      {children}
    </div>
  );
}
