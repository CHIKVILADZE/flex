import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageSquare, 
  BarChart3, 
  Settings,
  Star
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Reviews', href: '/reviews', icon: MessageSquare },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Ratings', href: '/ratings', icon: Star },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-16 md:w-64 bg-white border-r border-gray-200 flex flex-col transition-all duration-300">
      <div className="flex-1 py-6 px-2 md:px-4">
        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-2 md:px-4 py-3 rounded-lg text-sm font-medium transition-colors group relative ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                title={item.name} // Tooltip for mobile when text is hidden
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="hidden md:block">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-2 md:p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 hidden md:block">
          <p>Flex Living Manager Portal</p>
          <p className="mt-1">v1.0.0</p>
        </div>
        <div className="text-xs text-gray-500 md:hidden text-center">
          <p>v1.0.0</p>
        </div>
      </div>
    </aside>
  );
};