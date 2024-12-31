import { Link } from 'react-router-dom';
import { Shield, User, Calendar, Lock, Key, Mail } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="prose prose-blue max-w-none">
      <div className="flex items-center space-x-2 mb-8">
        <Shield className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold m-0">Privacy Policy</h1>
      </div>

      <div className="space-y-12">
        <section>
          <div className="flex items-center space-x-2 mb-4">
            <User className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold m-0">1. Information We Collect</h2>
          </div>
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-medium mb-4">Account Information</h3>
            <ul className="list-none p-0 m-0 space-y-2 mb-6">
              <li className="flex items-center">
                <span className="text-blue-600 mr-2">•</span>
                Email address
              </li>
              <li className="flex items-center">
                <span className="text-blue-600 mr-2">•</span>
                Name and company details
              </li>
              <li className="flex items-center">
                <span className="text-blue-600 mr-2">•</span>
                Telegram username
              </li>
            </ul>

            <h3 className="text-lg font-medium mb-4">Booking Information</h3>
            <ul className="list-none p-0 m-0 space-y-2">
              <li className="flex items-center">
                <span className="text-blue-600 mr-2">•</span>
                Scheduled post dates and times
              </li>
              <li className="flex items-center">
                <span className="text-blue-600 mr-2">•</span>
                Product links and promotional details
              </li>
              <li className="flex items-center">
                <span className="text-blue-600 mr-2">•</span>
                Pricing information
              </li>
            </ul>
          </div>
        </section>

        <section>
          <div className="flex items-center space-x-2 mb-4">
            <Calendar className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold m-0">2. How We Use Your Information</h2>
          </div>
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <ul className="list-none p-0 m-0 space-y-3">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                To manage your booking schedule and posts
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                To process payments and maintain package records
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                To send important notifications about your bookings
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                To improve our services and user experience
              </li>
            </ul>
          </div>
        </section>

        <section>
          <div className="flex items-center space-x-2 mb-4">
            <Lock className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold m-0">3. Data Security</h2>
          </div>
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <ul className="list-none p-0 m-0 space-y-3">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                We use industry-standard security measures to protect your data
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                All data is encrypted in transit and at rest
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                Regular security audits are performed
              </li>
            </ul>
          </div>
        </section>

        <section>
          <div className="flex items-center space-x-2 mb-4">
            <Key className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold m-0">4. Your Rights</h2>
          </div>
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <ul className="list-none p-0 m-0 space-y-3">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                Access your personal information
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                Correct inaccurate data
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                Request deletion of your data
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                Export your data
              </li>
            </ul>
          </div>
        </section>

        <section>
          <div className="flex items-center space-x-2 mb-4">
            <Mail className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold m-0">5. Contact Information</h2>
          </div>
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <p className="m-0 mb-4">For privacy-related inquiries, contact us at:</p>
            <ul className="list-none p-0 m-0 space-y-3">
              <li className="flex items-center">
                <Mail className="h-4 w-4 text-blue-600 mr-2" />
                <a href="mailto:info@aliensales.it" className="text-blue-600 hover:text-blue-700">
                  info@aliensales.it
                </a>
              </li>
            </ul>
          </div>
        </section>
      </div>

      <div className="mt-12 pt-8 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}