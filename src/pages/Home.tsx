import { Link } from 'react-router-dom';
import { useChannels } from '../hooks/useChannels';
import { Rocket } from 'lucide-react';

export default function Home() {
  const { data: channels, isLoading } = useChannels();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
          <span className="block">Book Your Sponsored Posts</span>
          <span className="block text-blue-600">Reach Your Audience</span>
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Choose from our selection of premium Telegram channels and start promoting your content today.
        </p>
        <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
          <Link
            to="/purchase"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <Rocket className="mr-2 h-5 w-5" />
            Buy Posts
          </Link>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
          Our Channels
        </h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {channels?.map((channel) => (
            <div
              key={channel.id}
              className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:border-gray-400"
            >
              <h3 className="text-lg font-medium text-gray-900">{channel.name}</h3>
              <p className="mt-1 text-sm text-gray-500">{channel.description}</p>
              <a
                href={channel.telegram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Join Channel
                <span className="ml-2">→</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}