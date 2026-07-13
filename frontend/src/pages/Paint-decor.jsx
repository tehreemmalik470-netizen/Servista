import React from 'react';

const PaintDecor = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black mb-6">Professional Painting & Decor</h1>
        <p className="text-slate-600 mb-8">
          Hum aapke ghar aur office ko dete hain ek naya aur shandaar look 
          humare expert painting aur decoration services ke saath.
        </p>

        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
          <h2 className="text-xl font-bold mb-4">Our Services:</h2>
          <ul className="list-disc pl-5 space-y-2 text-slate-700">
            <li>Interior & Exterior Painting</li>
            <li>Wall Texture & Wallpaper Installation</li>
            <li>False Ceiling & Decorative Work</li>
            <li>Surface Preparation & Priming</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PaintDecor;