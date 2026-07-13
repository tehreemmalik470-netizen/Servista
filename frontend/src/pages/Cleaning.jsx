import React from 'react';

const Cleaning = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black mb-6">Professional Cleaning Services</h1>
        <p className="text-slate-600 mb-8">
          Hum provide karte hain thorough home aur office cleaning services, 
          taake aapka environment rahe saaf aur healthy.
        </p>

        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
          <h2 className="text-xl font-bold mb-4">Cleaning Packages:</h2>
          <ul className="list-disc pl-5 space-y-2 text-slate-700">
            <li>Deep House Cleaning</li>
            <li>Kitchen & Bathroom Sanitization</li>
            <li>Floor Scrubbing & Polishing</li>
            <li>Post-Construction Cleaning</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Cleaning;