/**
 * ErrorAlert
 *
 * Small alert box used to show errors. If `message` is falsy the
 * component renders null to keep markup minimal.
 */
export default function ErrorAlert({ title, message, className = '' }) {
  if (!message) return null;

  return (
    <div className={`p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm ${className}`} role="alert">
      <div className="flex items-start gap-2">
        <span className="material-symbols-outlined text-red-600 text-lg leading-none mt-0.5" aria-hidden="true">
          error
        </span>
        <div>
          {title ? <p className="font-semibold">{title}</p> : null}
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
}