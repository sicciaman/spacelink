import { Link } from 'react-router-dom';
import { Shield, Calendar, Package, MessageSquare, Settings, Star } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="prose prose-blue max-w-none">
      <div className="flex items-center space-x-2 mb-8">
        <Shield className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold m-0">Terms of Service</h1>
      </div>

      <div className="space-y-12">
        <section>
          <div className="flex items-center space-x-2 mb-4">
            <Star className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold m-0">1. Prime Subscription</h2>
          </div>
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <ul className="list-none p-0 m-0 space-y-3">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                Prime subscription costs €48 per month
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                Subscription can be cancelled at any time
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                Benefits continue until the end of the billing period
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                Access to bundle pricing with up to 30% savings
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                Priority booking slots and extended scheduling (30 days)
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                Premium support and priority during high-demand periods
              </li>
            </ul>
          </div>
        </section>

        <section>
          <div className="flex items-center space-x-2 mb-4">
            <Calendar className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold m-0">2. Booking and Scheduling</h2>
          </div>
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <ul className="list-none p-0 m-0 space-y-3">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                Prime members can choose specific time slots
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                Standard users get first available slot of the day
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                Maximum of 2 deals per day per user
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                72-hour minimum wait between reposts of the same deal
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                Prime members can book up to 30 days in advance
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                Standard users can book up to 2 days in advance
              </li>
            </ul>
          </div>
        </section>

        {/* Rest of the sections remain unchanged */}
      </div>
    </div>
  );
}