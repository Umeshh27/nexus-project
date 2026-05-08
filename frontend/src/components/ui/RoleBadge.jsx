/**
 * RoleBadge — Displays a color-coded role/permission badge
 * Used on both users and documents to show clearance tier
 */
const ROLE_STYLES = {
  admin: 'bg-[#223959] text-white',
  member: 'bg-[#1fab78] text-white',
  guest: 'bg-[#9acee2] text-[#223959]',
};

const ROLE_LABELS = {
  admin: 'Admin',
  member: 'Member',
  guest: 'Guest',
};

export default function RoleBadge({ role, size = 'sm' }) {
  const sizeClasses = size === 'xs' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-0.5';
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${sizeClasses} ${ROLE_STYLES[role] || 'bg-gray-200 text-gray-600'}`}>
      {ROLE_LABELS[role] || role}
    </span>
  );
}
