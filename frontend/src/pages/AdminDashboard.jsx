import React, { useEffect, useState } from 'react';

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [providers, setProviders] = useState([]);
  const [selectedProviders, setSelectedProviders] = useState({});
  
  const [providerSearchTerm, setProviderSearchTerm] = useState({});
  const [globalProviderSearch, setGlobalProviderSearch] = useState('');
  
  const [activeTab, setActiveTab] = useState('bookings');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const bookingsRes = await fetch('http://localhost:5000/api/bookings/all');
        const bookingsData = await bookingsRes.json();
        if (bookingsRes.ok && Array.isArray(bookingsData)) setBookings(bookingsData);
        
        const providersRes = await fetch('http://localhost:5000/api/auth/providers');
        const providersData = await providersRes.json();
        if (providersRes.ok && Array.isArray(providersData)) setProviders(providersData);

        setLoading(false);
      } catch (error) {
        console.error("Dashboard fetch error:", error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getBookingPrice = (booking) => {
    const directTotal = Number(booking.total || booking.totalPrice || booking.amount || booking.price || booking.totalAmount);
    if (!isNaN(directTotal) && directTotal > 0) return directTotal;

    const itemsArray = booking.items || booking.bookedItems || booking.services;
    if (Array.isArray(itemsArray) && itemsArray.length > 0) {
      const calculatedSum = itemsArray.reduce((sum, item) => {
        const itemPrice = Number(item.price || item.cost || 0);
        const itemQty = Number(item.qty || item.quantity || 1);
        return sum + (itemPrice * itemQty);
      }, 0);
      if (calculatedSum > 0) return calculatedSum;
    }
    return 2500;
  };

  const getBookingServiceName = (booking) => {
    const itemsArray = booking.items || booking.bookedItems || booking.services;
    if (Array.isArray(itemsArray) && itemsArray.length > 0) {
      return itemsArray.map(i => i.name || i.title || i.serviceName).filter(Boolean).join(', ');
    }
    return booking.serviceTitle || booking.serviceName || booking.service || booking.selectedService || 'Multiple Services';
  };

  const getPaymentInfo = (booking) => {
    let pd = booking.paymentDetails || booking.payment || booking.paymentInfo || {};
    
    if (typeof pd === 'string') {
      try {
        pd = JSON.parse(pd);
      } catch (e) {
        pd = { rawText: pd };
      }
    }

    const senderAcc = pd.senderAccountNo || pd.walletNumber || pd.accountNo || pd.senderAccount || booking.senderAccountNo || booking.walletNumber || booking.accountNo;
    const senderNm = pd.senderName || booking.senderName;
    const trxId = pd.transactionId || pd.trxId || booking.transactionId || booking.trxId;
    const paymentMethod = booking.paymentMethod || pd.method || pd.paymentMethod || 'Easypaisa / JazzCash';

    return { senderAcc, senderNm, trxId, paymentMethod, pd };
  };

  const handleAssignAndApprove = async (bookingId) => {
    const providerId = selectedProviders[bookingId];
    if (!providerId) {
      alert("Please select a provider first!");
      return;
    }

    const chosenProvider = providers.find(p => (p._id || p.id) === providerId);

    try {
      const response = await fetch(`http://localhost:5000/api/bookings/update-status/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'Approved',
          providerId: chosenProvider._id || chosenProvider.id,
          providerName: chosenProvider.name
        })
      });

      if (response.ok) {
        alert(`Task assigned to ${chosenProvider.name}!`);
        setBookings(prev => prev.map(b => 
          b._id === bookingId ? { ...b, status: 'Approved', providerName: chosenProvider.name, providerId: chosenProvider._id || chosenProvider.id } : b
        ));
      } else {
        alert("Failed to update status.");
      }
    } catch (error) {
      console.error("Assignment error:", error);
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;
    setBookings(prev => prev.filter(b => b._id !== bookingId));
  };
      
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#F4F7FC]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1E40AF]"></div>
      </div>
    );
  }

  const activeBookingsList = bookings.filter(b => {
    const st = (b.status || 'Pending').toLowerCase();
    return st === 'pending' || st === 'approved' || st === 'rescheduled';
  });

  const assignedBookingsList = bookings.filter(b => {
    const st = (b.status || '').toLowerCase();
    const hasProvider = Boolean(b.providerName || b.providerId);
    return st === 'approved' && hasProvider; 
  });

  const completedCount = bookings.filter(b => (b.status || '').toLowerCase() === 'completed').length;
  const totalProviders = providers.length;
  const totalRevenueCollected = bookings.reduce((acc, curr) => acc + getBookingPrice(curr), 0);
  const adminShare = totalRevenueCollected * 0.20;
  const providerShare = totalRevenueCollected * 0.80;

  const getFilteredBookings = () => {
    if (activeTab === 'assigned') {
      return assignedBookingsList;
    }
    if (statusFilter === 'ActiveClients') {
      return activeBookingsList;
    }
    if (statusFilter === 'CompletedTasks') {
      return bookings.filter(b => (b.status || '').toLowerCase() === 'completed');
    }
    return bookings;
  };

  const getFilteredProviders = () => {
    return providers.filter(p => {
      const matchSkill = p.skill && p.skill.toLowerCase().includes(globalProviderSearch.toLowerCase());
      const matchName = p.name && p.name.toLowerCase().includes(globalProviderSearch.toLowerCase());
      return matchSkill || matchName;
    });
  };

  return (
    <div className="min-h-screen bg-[#F4F7FC] text-[#0F172A] flex font-sans antialiased flex-col">
      <div className="flex flex-1">
        
        {/* SIDEBAR */}
        <div className="w-64 bg-[#0B1528] border-r border-[#1E293B]/60 flex flex-col p-6 shadow-xl text-white">
          <div className="mb-6">
            <p className="text-[10px] bg-blue-900/40 text-blue-300 w-fit px-2 py-0.5 rounded font-extrabold tracking-widest border border-blue-800/40">SYSTEM OVERSEER</p>
          </div>
          
          <nav className="flex-1 space-y-2 text-sm font-bold tracking-wide">
            <button 
              onClick={() => { setActiveTab('bookings'); setStatusFilter('All'); }} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'bookings' && statusFilter === 'All' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-[#152238] hover:text-white'}`}
            >
              📋 Booking Requests ({activeBookingsList.length})
            </button>
            <button 
              onClick={() => { setActiveTab('assigned'); setStatusFilter('All'); }} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'assigned' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-[#152238] hover:text-white'}`}
            >
              ✅ Assigned Bookings ({assignedBookingsList.length})
            </button>
            <button 
              onClick={() => setActiveTab('providers')} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'providers' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-[#152238] hover:text-white'}`}
            >
              🛠️ Providers Registry ({totalProviders})
            </button>
            <button 
              onClick={() => setActiveTab('ledger')} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'ledger' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-[#152238] hover:text-white'}`}
            >
              💰 Gross Splitting (80/20)
            </button>
          </nav>
        </div>

        {/* MAIN CONTENT */}
        <div className="flex-1 flex flex-col min-w-0 p-8 space-y-8 overflow-y-auto">
          
          {/* ANALYTICS CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div 
              onClick={() => { setActiveTab('bookings'); setStatusFilter('ActiveClients'); }}
              className={`p-5 rounded-2xl shadow-md border cursor-pointer transition-all hover:scale-[1.01] ${statusFilter === 'ActiveClients' && activeTab === 'bookings' ? 'bg-[#0B1528] border-blue-500 text-white' : 'bg-white border-slate-200 text-[#0F172A]'}`}
            >
              <div className="text-xs font-bold uppercase opacity-80">Clients Summary</div>
              <div className="text-3xl font-black mt-2">{activeBookingsList.length} <span className="text-xs font-medium">Active</span></div>
            </div>

            <div 
              onClick={() => { setActiveTab('bookings'); setStatusFilter('CompletedTasks'); }}
              className={`p-5 rounded-2xl shadow-md border cursor-pointer transition-all hover:scale-[1.01] ${statusFilter === 'CompletedTasks' && activeTab === 'bookings' ? 'bg-[#0B1528] border-purple-500 text-white' : 'bg-white border-slate-200 text-[#0F172A]'}`}
            >
              <div className="text-xs font-bold uppercase opacity-80">Task Progress</div>
              <div className="text-3xl font-black mt-2 text-purple-600">{completedCount} <span className="text-xs font-medium">Finished</span></div>
            </div>

            <div onClick={() => setActiveTab('providers')} className="bg-white border border-slate-200 p-5 rounded-2xl shadow-md cursor-pointer hover:scale-[1.01] transition-all">
              <div className="text-slate-500 text-xs font-bold uppercase">Provider Resources</div>
              <div className="text-3xl font-black text-blue-600 mt-2">{totalProviders} <span className="text-xs text-slate-400">Registered</span></div>
            </div>

            <div onClick={() => setActiveTab('ledger')} className="bg-[#0B1528] text-white border border-slate-800 p-5 rounded-2xl shadow-md cursor-pointer hover:scale-[1.01] transition-all">
              <div className="text-slate-400 text-xs font-bold uppercase">Gross Revenue (80/20)</div>
              <div className="text-2xl font-black text-emerald-400 mt-2">Rs. {totalRevenueCollected.toLocaleString()}</div>
            </div>
          </div>

          {/* TAB 1 & ASSIGNED: BOOKINGS PIPELINE */}
          {(activeTab === 'bookings' || activeTab === 'assigned') && (
            <div className="bg-[#0B1528] rounded-2xl border border-slate-800 shadow-xl overflow-hidden text-white">
              <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-[#0D1B3E]/30">
                <h3 className="font-extrabold text-white text-base">
                    {activeTab === 'assigned' ? 'Assigned Bookings Pipeline' : 'Client Bookings & Sub-Services Pipeline'}
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-slate-400 font-bold text-xs uppercase border-b border-slate-800">
                        <th className="p-5 pl-6">Client & Target Service</th>
                        <th className="p-5">Location & Schedule</th>
                        <th className="p-5">Payment Verification</th>
                        <th className="p-5">Status</th>
                        <th className="p-5">Staff Dispatch</th>
                        <th className="p-5 pr-6 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm font-semibold text-slate-300">
                      {getFilteredBookings().length === 0 ? (
                        <tr>
                          <td colSpan="6" className="p-8 text-center text-slate-500 italic">No bookings found in this view.</td>
                        </tr>
                      ) : (
                        getFilteredBookings().map((booking) => {
                          const isPendingOrRescheduled = (booking.status || 'Pending').toLowerCase() === 'pending' || (booking.status || '').toLowerCase() === 'rescheduled';
                          const currentSearch = providerSearchTerm[booking._id] || '';
                          const filteredMatchingProviders = providers.filter(p => p.name.toLowerCase().includes(currentSearch.toLowerCase()) || p.skill.toLowerCase().includes(currentSearch.toLowerCase()));

                          const { senderAcc, senderNm, trxId, paymentMethod, pd } = getPaymentInfo(booking);
                          const hasAnyPaymentField = senderAcc || senderNm || trxId || (pd && typeof pd === 'object' && Object.keys(pd).length > 0 && !pd.rawText);

                          return (
                            <tr key={booking._id} className="border-b border-slate-800/50 align-top">
                              <td className="p-5 pl-6">
                                <div className="font-extrabold text-white text-base">{booking.customerName || booking.name}</div>
                                <div className="text-xs text-blue-400 font-black uppercase mt-1">{getBookingServiceName(booking)}</div>
                                <div className="text-xs text-emerald-400 font-bold mt-1">Price: Rs. {getBookingPrice(booking)}</div>
                                {booking.email && <div className="text-[11px] text-slate-400 mt-0.5">Email: {booking.email}</div>}
                                {booking.phone && <div className="text-[11px] text-slate-400">Phone: {booking.phone}</div>}
                              </td>
                              <td className="p-5 text-xs text-slate-400 space-y-1">
                                <div>📍 {booking.address || booking.location || 'Sialkot'}</div>
                                {booking.date && <div>📅 {booking.date}</div>}
                                {booking.time && <div>⏰ {booking.time}</div>}
                              </td>
                              <td className="p-5 text-xs">
                                <div className="font-bold text-white uppercase bg-slate-800/80 px-2 py-0.5 rounded w-fit mb-1">
                                  {paymentMethod}
                                </div>
                                {hasAnyPaymentField || senderAcc || senderNm || trxId ? (
                                  <div className="space-y-1 text-slate-300 bg-[#070E1A] p-2.5 rounded border border-slate-800 mt-1">
                                    {senderAcc && (
                                      <div><span className="text-slate-500">Sender Acc:</span> <span className="text-white font-mono">{senderAcc}</span></div>
                                    )}
                                    {senderNm && (
                                      <div><span className="text-slate-500">Sender Name:</span> <span className="text-white">{senderNm}</span></div>
                                    )}
                                    {trxId && (
                                      <div><span className="text-slate-500">TRX ID:</span> <span className="text-amber-400 font-bold">{trxId}</span></div>
                                    )}
                                    {pd.rawText && (
                                      <div><span className="text-slate-500">Details:</span> <span className="text-white">{pd.rawText}</span></div>
                                    )}
                                    {typeof pd === 'object' && !senderAcc && !senderNm && !trxId && !pd.rawText && Object.entries(pd)
                                      .filter(([k]) => k !== 'senderAccountNo' && k !== 'walletNumber' && k !== 'accountNo' && k !== 'senderAccount' && k !== 'senderName' && k !== 'transactionId' && k !== 'trxId')
                                      .map(([k, v]) => (
                                        v ? <div key={k}><span className="text-slate-500">{k}:</span> <span className="text-white">{String(v)}</span></div> : null
                                      ))}
                                  </div>
                                ) : (
                                  <span className="text-slate-500 italic">No payment details provided</span>
                                )}
                              </td>
                              <td className="p-5">
                                <span className="px-3 py-1 text-xs font-black rounded-lg uppercase bg-amber-500/10 text-amber-400">
                                  {booking.status || 'Pending'}
                                </span>
                              </td>
                              <td className="p-5">
                                {isPendingOrRescheduled ? (
                                  <div className="space-y-2">
                                    <input 
                                      type="text"
                                      placeholder="Filter staff..."
                                      className="w-full bg-[#070E1A] border border-slate-700 rounded p-1.5 text-xs text-white"
                                      value={currentSearch}
                                      onChange={(e) => setProviderSearchTerm({...providerSearchTerm, [booking._id]: e.target.value})}
                                    />
                                    <select
                                      className="w-full bg-[#070E1A] border border-slate-700 rounded p-1.5 text-xs text-slate-300"
                                      onChange={(e) => setSelectedProviders({ ...selectedProviders, [booking._id]: e.target.value })}
                                    >
                                      <option value="" hidden>Select Expert</option>
                                      {filteredMatchingProviders.map(p => (
                                        <option key={p._id || p.id} value={p._id || p.id}>{p.name} ({p.skill})</option>
                                      ))}
                                    </select>
                                  </div>
                                ) : (
                                  <span className="text-xs font-bold text-slate-400">Assigned: {booking.providerName}</span>
                                )}
                              </td>
                              <td className="p-5 pr-6 text-center">
                                <div className="flex items-center justify-center gap-2">
                                  {isPendingOrRescheduled && (
                                    <button 
                                      onClick={() => handleAssignAndApprove(booking._id)} 
                                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold uppercase transition-all"
                                    >
                                      Approve
                                    </button>
                                  )}
                                  <button 
                                    onClick={() => handleDeleteBooking(booking._id)} 
                                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-bold uppercase transition-all"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: PROVIDERS REGISTRY */}
          {activeTab === 'providers' && (
            <div className="bg-[#0B1528] text-white rounded-2xl border border-slate-800 shadow-xl p-6 space-y-4">
              <h3 className="font-extrabold text-white text-base">Registered Service Providers & Banking Info</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#070E1A] text-slate-400 font-bold text-xs uppercase border-b border-slate-800">
                        <th className="p-4">Name & Address</th>
                        <th className="p-4">Skill</th>
                        <th className="p-4">Wallet / Bank</th>
                        <th className="p-4">Account Details</th>
                        <th className="p-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-sm">
                      {getFilteredProviders().map((p) => {
                        const isEasypaisaOrJazzcash = p.walletType && (p.walletType.toLowerCase().includes('easypaisa') || p.walletType.toLowerCase().includes('jazzcash'));

                        return (
                          <tr key={p._id || p.id}>
                            <td className="p-4">
                              <div className="font-bold text-white">{p.name}</div>
                              <div className="text-xs text-slate-400 mt-0.5">📍 {p.address || p.location || 'N/A'}</div>
                            </td>
                            <td className="p-4 text-blue-400">{p.skill}</td>
                            <td className="p-4 font-semibold text-slate-300">
                              {p.walletType || 'Direct Bank Transfer / Card'} {p.bankName ? `(${p.bankName})` : ''}
                            </td>
                            <td className="p-4 text-xs text-slate-300 space-y-0.5">
                              <div><span className="text-slate-500">Title:</span> {p.accountTitle || 'N/A'}</div>
                              {isEasypaisaOrJazzcash ? (
                                <>
                                  <div><span className="text-slate-500">No:</span> <span className="font-mono text-amber-400">{p.accountNumber || 'N/A'}</span></div>
                                  <div><span className="text-slate-500">Mobile:</span> <span className="font-mono text-emerald-400">{p.mobileNumber || p.accountNumber || 'N/A'}</span></div>
                                </>
                              ) : (
                                <div><span className="text-slate-500">No:</span> <span className="font-mono text-amber-400">{p.accountNumber || 'N/A'}</span></div>
                              )}
                            </td>
                            <td className="p-4"><span className="text-emerald-400">{p.isAvailable ? '🟢 Online' : '🔴 Busy'}</span></td>
                          </tr>
                        );
                      })}
                    </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: GROSS SPLITTING LEDGER */}
          {activeTab === 'ledger' && (
            <div className="bg-[#0B1528] text-white rounded-2xl border border-slate-800 shadow-xl p-6 space-y-6">
              <h3 className="font-extrabold text-white text-base">Gross Splitting Ledger & Financial Calculations</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#070E1A] p-5 rounded-xl border border-slate-800">
                  <div className="text-slate-400 text-xs font-bold uppercase">Total Revenue</div>
                  <div className="text-2xl font-black text-white mt-2">Rs. {totalRevenueCollected.toLocaleString()}</div>
                </div>
                <div className="bg-[#070E1A] p-5 rounded-xl border border-slate-800">
                  <div className="text-slate-400 text-xs font-bold uppercase">Admin Share (20%)</div>
                  <div className="text-2xl font-black text-blue-400 mt-2">Rs. {adminShare.toLocaleString()}</div>
                </div>
                <div className="bg-[#070E1A] p-5 rounded-xl border border-slate-800">
                  <div className="text-slate-400 text-xs font-bold uppercase">Staff Payouts (80%)</div>
                  <div className="text-2xl font-black text-purple-400 mt-2">Rs. {providerShare.toLocaleString()}</div>
                </div>
              </div>

            <div className="bg-[#070E1A] rounded-xl border border-slate-800 overflow-hidden mt-6">
              <div className="p-4 border-b border-slate-800 bg-[#0B1528]">
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-300">Service-wise Revenue, Provider Payout & Bank Info</h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-slate-400 font-bold text-xs uppercase border-b border-slate-800 bg-[#070E1A]">
                        <th className="p-4 pl-6">Client Name</th>
                        <th className="p-4">Service Name</th>
                        <th className="p-4">Assigned Provider & Bank Info</th>
                        <th className="p-4">Total Price</th>
                        <th className="p-4">Admin (20%)</th>
                        <th className="p-4 pr-6">Provider Payout (80%)</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm font-medium text-slate-300 divide-y divide-slate-800/60">
                      {bookings.map((booking) => {
                        const price = getBookingPrice(booking);
                        const aShare = price * 0.20;
                        const pShare = price * 0.80;
                        const assignedProvObj = providers.find(p => (p._id || p.id) === booking.providerId || p.name === booking.providerName);
                        const isEasypaisaOrJazzcash = assignedProvObj?.walletType && (assignedProvObj.walletType.toLowerCase().includes('easypaisa') || assignedProvObj.walletType.toLowerCase().includes('jazzcash'));

                        return (
                          <tr key={booking._id} className="hover:bg-slate-900/40">
                            <td className="p-4 pl-6 font-bold text-white">{booking.customerName || booking.name || 'N/A'}</td>
                            <td className="p-4 text-blue-400 font-semibold">{getBookingServiceName(booking)}</td>
                            <td className="p-4 text-xs text-slate-300 space-y-0.5">
                              <div className="font-bold text-white">{booking.providerName || <span className="text-amber-400 font-bold">Unassigned</span>}</div>
                              {assignedProvObj && (
                                <div className="mt-1 text-slate-400 space-y-0.5">
                                  <div><span className="text-slate-500">Address:</span> {assignedProvObj.address || assignedProvObj.location || 'N/A'}</div>
                                  <div><span className="text-slate-500">Wallet/Bank:</span> {assignedProvObj.walletType || 'Direct Bank Transfer / Card'} {assignedProvObj.bankName ? `(${assignedProvObj.bankName})` : ''}</div>
                                  <div><span className="text-slate-500">Title:</span> {assignedProvObj.accountTitle || 'N/A'}</div>
                                  {isEasypaisaOrJazzcash ? (
                                    <>
                                      <div><span className="text-slate-500">No:</span> <span className="font-mono text-amber-400">{assignedProvObj.accountNumber || 'N/A'}</span></div>
                                      <div><span className="text-slate-500">Mobile:</span> <span className="font-mono text-emerald-400">{assignedProvObj.mobileNumber || assignedProvObj.accountNumber || 'N/A'}</span></div>
                                    </>
                                  ) : (
                                    <div><span className="text-slate-500">Acc No:</span> <span className="font-mono text-amber-400">{assignedProvObj.accountNumber || 'N/A'}</span></div>
                                  )}
                                </div>
                              )}
                            </td>
                            <td className="p-4 font-bold text-white">Rs. {price.toLocaleString()}</td>
                            <td className="p-4 font-bold text-blue-400">Rs. {aShare.toLocaleString()}</td>
                            <td className="p-4 font-bold text-purple-400">Rs. {pShare.toLocaleString()}</td>
                          </tr>
                        );
                      })}
                      </tbody>
                </table>
              </div>
            </div>

          </div>
          )}

        </div>
      </div>
  </div>
  );
};

export default AdminDashboard;