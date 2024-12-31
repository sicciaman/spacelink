import { ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EmptyPackages() {
  return (
    <div className="text-center py-12 bg-white rounded-lg shadow">
      <div className="mx-auto w-24 h-24 flex items-center justify-center rounded-full bg-blue-50">
        <ShoppingBag className="h-12 w-12 text-blue-600" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-gray-900">No packages purchased</h3>
      <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
        Get started by purchasing your first promotional package to begin booking posts on our channels.
      </p>
      <div className="mt-6">
        <Link
          to="/purchase"
          className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Buy Your First Package
        </Link>
      </div>
    </div>
  );
}