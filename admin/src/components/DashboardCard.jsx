import React from 'react';

function DashboardCard({ title, value, icon, color }) {
  return (
    <div className={`p-5 rounded-xl shadow-lg w-full sm:w-[45%] lg:w-[23%] bg-[${color}] bg-opacity-20 border border-gray-600`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-300">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
        <div className="text-white text-3xl">{icon}</div>
      </div>
    </div>
  );
}

export default DashboardCard;
