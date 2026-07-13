import React from 'react';

const Shifting = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black mb-6">Home Shifting Services</h1>
        <p className="text-slate-600 mb-8">
          Hum provide karte hain safe aur stress-free shifting services, 
          taake aapka saman ek jagah se dusri jagah hifazat se pahunch sake.
        </p>

        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
          <h2 className="text-xl font-bold mb-4">Shifting Solutions:</h2>
          <ul className="list-disc pl-5 space-y-2 text-slate-700">
            <li>Packing & Unpacking Services</li>
            <li>Furniture Disassembly & Reassembly</li>
            <li>Local Household Shifting</li>
            <li>Office Relocation Support</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Shifting;