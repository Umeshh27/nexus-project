export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {Icon && <Icon size={56} className="text-gray-200 mb-4" />}
      <h3 className="text-lg font-semibold text-gray-500">{title}</h3>
      {description && (
        <p className="text-sm text-gray-400 mt-1 max-w-sm">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
