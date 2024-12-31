import { Link } from 'react-router-dom';
import { Globe, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center">
              <Globe className="h-6 w-6 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">SpaceLink</span>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Connecting brands with Italy's largest deal communities.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Contact</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <a href="mailto:info@aliensales.it" className="text-base text-gray-600 hover:text-gray-900 flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  info@aliensales.it
                </a>
              </li>
              <li className="flex items-center text-base text-gray-600">
                <MapPin className="h-4 w-4 mr-2" />
                Earth, Milky Way
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Legal</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link to="/legal" className="text-base text-gray-600 hover:text-gray-900">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/legal?tab=privacy" className="text-base text-gray-600 hover:text-gray-900">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-base text-gray-400 text-center">
            © {new Date().getFullYear()} SpaceLink. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}