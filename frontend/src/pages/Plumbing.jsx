import React from 'react';

const Plumbing = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black mb-6">Professional Plumbing Services</h1>
        <p className="text-slate-600 mb-8">
          Hum provide karte hain quick aur reliable plumbing solutions, 
          leakage se lekar pipe installation tak, har tarah ki plumbing problems ka hal.
        </p>

        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
          <h2 className="text-xl font-bold mb-4">Our Services:</h2>
          <ul className="list-disc pl-5 space-y-2 text-slate-700">
            <li>Leakage Repair & Pipe Fixing</li>
            <li>Tap & Faucet Installation</li>
            <li>Drainage & Sewerage Cleaning</li>
            <li>Bathroom Fitting & Maintenance</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Plumbing;