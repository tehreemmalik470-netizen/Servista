import React from 'react';

const Solar = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black mb-6">Solar Energy Solutions</h1>
        <p className="text-slate-600 mb-8">
          Hum provide karte hain modern solar panel installation services, 
          taake aap apni electricity cost kam kar sakein aur eco-friendly energy use karein.
        </p>

        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
          <h2 className="text-xl font-bold mb-4">Our Solar Services:</h2>
          <ul className="list-disc pl-5 space-y-2 text-slate-700">
            <li>Solar Panel System Design & Installation</li>
            <li>Inverter & Battery Setup</li>
            <li>Solar System Maintenance & Cleaning</li>
            <li>Energy Efficiency Audits</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Solar;