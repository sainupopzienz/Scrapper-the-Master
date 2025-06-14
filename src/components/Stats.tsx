import React from 'react';
import { Users, Download, Globe, Zap } from 'lucide-react';

const Stats: React.FC = () => {
  const stats = [
    {
      icon: <Users className="w-6 h-6" />,
      label: 'Active Users',
      value: '2,847',
      color: 'text-blue-400'
    },
    {
      icon: <Download className="w-6 h-6" />,
      label: 'Sites Scraped',
      value: '15,293',
      color: 'text-green-400'
    },
    {
      icon: <Globe className="w-6 h-6" />,
      label: 'Countries',
      value: '67',
      color: 'text-purple-400'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      label: 'Success Rate',
      value: '99.2%',
      color: 'text-yellow-400'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
      {stats.map((stat, index) => (
        <div key={index} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 text-center">
          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-700 mb-3 ${stat.color}`}>
            {stat.icon}
          </div>
          <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
          <div className="text-sm text-gray-400">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

export default Stats;