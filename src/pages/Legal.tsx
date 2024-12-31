import { useState } from 'react';
import { cn } from '../lib/utils/styles';
import TermsOfService from '../components/legal/TermsOfService';
import PrivacyPolicy from '../components/legal/PrivacyPolicy';

export default function Legal() {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy'>('terms');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('terms')}
            className={cn(
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
              activeTab === 'terms'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            )}
          >
            Terms of Service
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={cn(
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
              activeTab === 'privacy'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            )}
          >
            Privacy Policy
          </button>
        </nav>
      </div>

      <div className="bg-white shadow-sm rounded-lg p-8">
        {activeTab === 'terms' ? <TermsOfService /> : <PrivacyPolicy />}
      </div>
    </div>
  );
}