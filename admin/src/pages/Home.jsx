import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUsers, FaShoppingCart, FaRupeeSign } from 'react-icons/fa';
import Nav from '../components/Nav';
import Sidebar from '../components/Sidebar';

function Home() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0
  });
  

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:3000/admin/stats', { withCredentials: true });
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: <FaUsers className="text-4xl text-blue-900" />,
      bg: "bg-blue-500"
    },
    {
      label: "Total Orders",
      value: stats.totalOrders,
      icon: <FaShoppingCart className="text-4xl text-green-900" />,
      bg: "bg-green-500"
    },
    {
      label: "Total Revenue",
      value: `₹${stats.totalRevenue}`,
      icon: <FaRupeeSign className="text-4xl text-yellow-900" />,
      bg: "bg-yellow-500"
    }
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-bl from-[#0c2025] to-[#141414] text-white">
      <Nav />
      <div className="flex">
        <Sidebar />
        <main className="w-[82%] ml-[20vw]  flex-1 px-6 md:px-12 pt-24">
          <h1 className="text-4xl font-bold mb-10">Admin Dashboard</h1>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {statCards.map((card, index) => (
              <div
                key={index}
                className={`rounded-2xl p-6 ${card.bg} hover:scale-105 transition-transform duration-300 shadow-lg`}
              >
                <div className="flex items-center gap-4">
                  {card.icon}
                  <div>
                    <p className="text-sm text-white">{card.label}</p>
                    <h2 className="text-2xl font-semibold">{card.value}</h2>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Home;
