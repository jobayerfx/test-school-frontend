// components/Sidebar.tsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';

const Sidebar = () => {
  const pathname = usePathname();

  const { user } = useSelector((state: any) => state.auth);

  const menu = [
    { label: 'Dashboard', path: '/dashboard', roles: ['admin', 'student'] },
    { label: 'Questions', path: '/questions', roles: ['admin'] },
    { label: 'Reports', path: '/reports/', roles: ['admin'] },
    { label: 'Tests Start', path: '/tests/start', roles: ['student'] },
    { label: 'Certificates', path: '/certificates', roles: ['student'] }
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white flex-shrink-0">
      <div className="p-4 text-2xl font-bold border-b border-gray-700">Admin Panel</div>
      <nav className="p-4 space-y-2">
        {menu
          .filter((item) => item.roles.includes(user?.role))
          .map((item) => (
            <Link
            key={item.path}
            href={item.path}
            className={`block px-3 py-2 rounded ${
              pathname === item.path ? 'bg-blue-600' : 'hover:bg-gray-700'
            }`}
          >
            {item.label}
          </Link>
          ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
