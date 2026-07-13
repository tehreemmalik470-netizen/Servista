import React from 'react';

const Electrician = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black mb-6">Expert Electrician Services</h1>
        <p className="text-slate-600 mb-8">
          Hum provide karte hain certified aur experienced electricians, 
          jo aapke ghar ke electrical issues ko safely fix karte hain.
        </p>

        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
          <h2 className="text-xl font-bold mb-4">Electrical Solutions:</h2>
          <ul className="list-disc pl-5 space-y-2 text-slate-700">
            <li>Wiring Repair & Installation</li>
            <li>Switchboard & Socket Fixing</li>
            <li>Circuit Breaker (MCB) Troubleshooting</li>
            <li>Light Fixture & Fan Installation</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Electrician;
