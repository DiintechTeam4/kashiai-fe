import React, { useEffect, useState } from 'react'

export default function Overview() {
  const [totalPoojas, setTotalPoojas] = useState(0)
  const [totalDarshans, setTotalDarshans] = useState(0)
  const [totalUsers, setTotalUsers] = useState(0)


  const backendUrl='http://localhost:5000';

  const gettotalpooja=async()=>{
    const response=await fetch(`${backendUrl}/api/poojas/totalpooja`)
    const data=await response.json();
    setTotalPoojas(data.totalPoojas);
  }
  const gettotalDarshans=async()=>{
    const response=await fetch(`${backendUrl}/api/darshan/totaldarshans`)
    const data=await response.json();
    console.log(data)
    setTotalDarshans(data.totalDarshans);
  }
  const gettotalUsers=async()=>{
    const response=await fetch(`${backendUrl}/api/admin/usersection/totalusers`)
    const data=await response.json();
    console.log(data)
    setTotalUsers(data.totalUsers);
  }

  useEffect(() => {
    gettotalpooja();
    gettotalDarshans();
    gettotalUsers();
  }, []);
  
  return (
    <div className='w-full hide-scrollbar'>
      <h1 className='text-4xl font-bold hover:text-red-900 mt-2'>Overview</h1>
      <div className='flex-start flex mt-10 w-full'>
      <div className="grid grid-cols-3 gap-10 w-full">
      {/* Card 1: Total Pooja */}
      <div className="bg-white shadow-lg rounded-xl px-10 py-6 text-center items-center hover:shadow-xl transition">
        <h2 className="text-xl font-semibold text-gray-700">Total Pooja</h2>
        <p><i className="fa-solid fa-user text-2xl mt-4"></i></p>

        <p className="text-4xl text-red-600 mt-4 font-bold">{totalPoojas}</p>
      </div>

      {/* Card 2: Total Darshan */}
      <div className="bg-white shadow-lg rounded-xl px-10 py-6 text-center hover:shadow-xl transition">
        <h2 className="text-xl font-semibold text-gray-700">Total Darshan</h2>
        <p><i className="fa-solid fa-user text-2xl mt-4"></i></p>

        <p className="text-4xl text-red-600 mt-4 font-bold">{totalDarshans}</p>
      </div>
      {/* Card 2: Total users */}
      <div className="bg-white shadow-lg rounded-xl px-10 py-6 text-center hover:shadow-xl transition">
        <h2 className="text-xl font-semibold text-gray-700">Total Users</h2>
        <p><i className="fa-solid fa-user text-2xl mt-4"></i></p>
        <p className="text-4xl text-red-600 mt-4 font-bold">{totalUsers}</p>
      </div>
      {/* Card 2: Total Astro
      <div className="bg-white shadow-lg rounded-xl px-10 py-6 text-center hover:shadow-xl transition">
        <h2 className="text-xl font-semibold text-gray-700">Total Astro</h2>
        <p><i className="fa-solid fa-user text-2xl mt-4"></i></p>

        <p className="text-4xl text-red-600 mt-4 font-bold">150</p>
      </div>
      <div className="bg-white shadow-lg rounded-xl px-10 py-6 text-center hover:shadow-xl transition">
        <h2 className="text-xl font-semibold text-gray-700">Total Keys</h2>
        <p><i className="fa-solid fa-user text-2xl mt-4"></i></p>

        <p className="text-4xl text-red-600 mt-4 font-bold">150</p>
      </div>
      <div className="bg-white shadow-lg rounded-xl px-10 py-6 text-center hover:shadow-xl transition">
        <h2 className="text-xl font-semibold text-gray-700">Total Credits</h2>
        <p><i className="fa-solid fa-user text-2xl mt-4"></i></p>

        <p className="text-4xl text-red-600 mt-4 font-bold">150</p>
      </div> */}
      
    </div>
      </div>
    </div>
  )
}
