import React from 'react';

const Carpenter = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black mb-6">Expert Carpenter Services</h1>
        <p className="text-slate-600 mb-8">
          Hum provide karte hain premium carpentry services, jisme furniture repair, 
          woodwork installation, aur custom fittings shamil hain.
        </p>

        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
          <h2 className="text-xl font-bold mb-4">Services Offered:</h2>
          <ul className="list-disc pl-5 space-y-2 text-slate-700">
            <li>Furniture Repair & Polishing</li>
            <li>Door & Window Installation</li>
            <li>Custom Woodwork & Cabinets</li>
            <li>General Wood Maintenance</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Carpenter;

