import React from 'react';

const PestControl = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black mb-6">Pest Control Services</h1>
        <p className="text-slate-600 mb-8">
          Hum provide karte hain safe aur effective pest control solutions, 
          taake aapka ghar rahe insects aur pests se bilkul paak.
        </p>

        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
          <h2 className="text-xl font-bold mb-4">Our Specializations:</h2>
          <ul className="list-disc pl-5 space-y-2 text-slate-700">
            <li>Cockroach & Ant Control</li>
            <li>Termite Treatment (Deemak ka ilaaj)</li>
            <li>Rodent & Rat Removal</li>
            <li>Bed Bug & Mosquito Fumigation</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PestControl;