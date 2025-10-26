import { Link } from 'react-router-dom';

interface HeaderProps {
  isPublic?: boolean;
}

export const Header = ({ isPublic = false }: HeaderProps) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">F</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Flex Living</h1>
              {!isPublic && (
                <p className="text-xs text-gray-500">Reviews Dashboard</p>
              )}
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {!isPublic && (
            <Link
              to="/properties/example"
              target="_blank"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              View Public Page
            </Link>
          )}
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">M</span>
            </div>
            <span className="text-sm text-gray-700">Manager</span>
          </div>
        </div>
      </div>
    </header>
  );
};