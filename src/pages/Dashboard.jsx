import { useState } from "react";

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState("Today");

  // Pie chart sector calculations
  const pieData = [
    { label: "Smartphones", value: 8, color: "#F97316" }, // Orange
    { label: "Refrigerator", value: 13, color: "#22C55E" }, // Green
    { label: "TV", value: 12, color: "#C084FC" }, // Purple
    { label: "2 Wheeler", value: 18, color: "#EAB308" }, // Yellow
    { label: "Car", value: 10, color: "#06B6D4" }, // Cyan
    { label: "Gold", value: 12, color: "#3B82F6" }, // Blue
    { label: "Home", value: 7, color: "#6366F1" }, // Indigo
    { label: "Personal", value: 10, color: "#EF4444" }, // Red
    { label: "Tractor", value: 10, color: "#A16207" } // Brown
  ];

  let accumulatedPercent = 0;
  const getCoordinatesForPercent = (percent) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  const slices = pieData.map((slice) => {
    const startPercent = accumulatedPercent;
    accumulatedPercent += slice.value / 100;
    const endPercent = accumulatedPercent;

    // Shift by -0.25 to start at top (12 o'clock)
    const [startX, startY] = getCoordinatesForPercent(startPercent - 0.25);
    const [endX, endY] = getCoordinatesForPercent(endPercent - 0.25);

    const largeArcFlag = slice.value > 50 ? 1 : 0;

    const r = 90;
    const cx = 110;
    const cy = 110;

    const x1 = cx + startX * r;
    const y1 = cy + startY * r;
    const x2 = cx + endX * r;
    const y2 = cy + endY * r;

    const d = `
      M ${cx} ${cy}
      L ${x1} ${y1}
      A ${r} ${r} 0 ${largeArcFlag} 1 ${x2} ${y2}
      Z
    `;

    // Label coordinates
    const midPercent = startPercent + (slice.value / 100) / 2 - 0.25;
    const [midX, midY] = getCoordinatesForPercent(midPercent);
    const tx = cx + midX * (r * 0.65);
    const ty = cy + midY * (r * 0.65);

    return {
      d,
      color: slice.color,
      tx,
      ty,
      percentage: `${slice.value}%`
    };
  });

  return (
    <div className="flex flex-col gap-6 animate-[wh-slide-up_0.22s_ease]">
      {/* 3 Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Total Leads */}
        <div className="bg-white rounded-xl border border-[#EBF1FA] p-6 flex flex-col justify-between h-[155px] shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] relative overflow-hidden group cursor-pointer">
          <div className="flex justify-between items-start">
            <span className="text-[15px] font-medium text-gray-500">Total Leads</span>
            <div className="w-10 h-10 rounded-lg bg-[#EBF3FE] flex items-center justify-center text-[#2B4282] transition-transform group-hover:scale-110">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
          </div>
          <div className="flex flex-col gap-1 mt-auto">
            <h3 className="text-3xl font-extrabold text-[#1E293B] tracking-tight">30,67,498</h3>
            <span className="text-[12.5px] font-medium text-gray-400">
              This Month <span className="text-gray-500 font-semibold ml-1">+3.7 %</span>
            </span>
          </div>
        </div>

        {/* Card 2: Total Loan Distributed */}
        <div className="bg-white rounded-xl border border-[#EBF1FA] p-6 flex flex-col justify-between h-[155px] shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] relative overflow-hidden group cursor-pointer">
          <div className="flex justify-between items-start">
            <span className="text-[15px] font-medium text-gray-500">Total Loan Distributed</span>
            <div className="w-10 h-10 rounded-lg bg-[#EBF3FE] flex items-center justify-center text-[#2B4282] transition-transform group-hover:scale-110">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="10" rx="2" />
                <path d="M12 2v9" />
                <path d="M8 5h8" />
                <path d="M12 11c1.5 0 3-1 3-2.5S13.5 6 12 6s-3 1-3 2.5 1.5 2.5 3 2.5Z" />
              </svg>
            </div>
          </div>
          <div className="flex flex-col gap-1 mt-auto">
            <h3 className="text-3xl font-extrabold text-[#1E293B] tracking-tight">₹102,50,98,764</h3>
            <span className="text-[12.5px] font-medium text-gray-400">
              This Month <span className="text-gray-500 font-semibold ml-1">-1.7 %</span>
            </span>
          </div>
        </div>

        {/* Card 3: Collection Pending */}
        <div className="bg-white rounded-xl border border-[#EBF1FA] p-6 flex flex-col justify-between h-[155px] shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] relative overflow-hidden group cursor-pointer">
          <div className="flex justify-between items-start">
            <span className="text-[15px] font-medium text-gray-500">Collection Pending</span>
            <div className="w-10 h-10 rounded-lg bg-[#EBF3FE] flex items-center justify-center text-[#2B4282] transition-transform group-hover:scale-110">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="20" height="14" rx="2" ry="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
                <path d="M6 14h2" />
                <path d="M10 14h6" />
              </svg>
            </div>
          </div>
          <div className="flex flex-col gap-1 mt-auto">
            <h3 className="text-3xl font-extrabold text-[#1E293B] tracking-tight">₹50,98,764</h3>
            <span className="text-[12.5px] font-medium text-gray-400">
              This Month <span className="text-gray-500 font-semibold ml-1">-1.7 %</span>
            </span>
          </div>
        </div>
      </div>

      {/* Row 2: Charts (Total Revenue Chart & Loan Sales Chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Total Revenue Chart Card */}
        <div className="bg-white rounded-3xl border border-[#eef2f1] p-6 lg:col-span-3 flex flex-col gap-5 cursor-pointer">
          <div className="flex items-center gap-4 border-b border-[#f3f6f5] pb-4">
            <h2 className="text-[16px] font-extrabold text-[#16221f]">Total Revenue Chart</h2>
            <span className="text-gray-300">|</span>
            <div className="flex items-center gap-5 text-xs font-semibold text-gray-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2B4282]" /> This year (2026)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-gray-400" /> Last year (2025)
              </span>
            </div>
          </div>

          <div className="flex gap-4">
            {/* Y Axis Labels */}
            <div className="flex flex-col justify-between text-[11px] font-semibold text-gray-400 h-[190px] text-right w-[42px] select-none py-1">
              <span>₹200K</span>
              <span>₹100K</span>
              <span>₹50K</span>
              <span>₹30K</span>
              <span>₹20K</span>
              <span>₹10K</span>
              <span>₹0</span>
            </div>

            {/* SVG Plot */}
            <div className="flex-1 flex flex-col justify-between">
              <div className="relative h-[190px] w-full">
                {/* Horizontal gridlines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none select-none">
                  {[...Array(7)].map((_, i) => (
                    <div key={i} className="border-b border-[#f1f4f3] w-full" />
                  ))}
                </div>

                <svg className="absolute inset-0 w-full h-[190px] overflow-visible" viewBox="0 0 600 190" preserveAspectRatio="none">
                  {/* Last Year line (dotted gray) */}
                  <path
                    d="M 10,180 C 40,170 70,100 120,110 C 170,120 220,160 270,150 C 320,140 370,50 420,80 C 470,110 520,70 590,55"
                    fill="none"
                    stroke="#9CA3AF"
                    strokeWidth="2.5"
                    strokeDasharray="4,4"
                    strokeLinecap="round"
                  />
                  {/* This Year line (solid navy blue) */}
                  <path
                    d="M 10,155 C 50,140 70,180 120,175 C 170,170 220,130 270,125 C 320,120 370,120 420,70 C 470,25 520,95 590,75"
                    fill="none"
                    stroke="#2B4282"
                    strokeWidth="3.0"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              {/* X Axis Labels */}
              <div className="flex justify-between text-[11px] font-semibold text-gray-400 mt-2 px-1 select-none">
                {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(m => (
                  <span key={m} className="w-[30px] text-center">{m}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Loan Sales Chart Card */}
        <div className="bg-white rounded-3xl border border-[#eef2f1] p-6 lg:col-span-2 flex flex-col gap-4 cursor-pointer">
          <div className="flex justify-between items-center border-b border-[#f3f6f5] pb-4">
            <h2 className="text-[16px] font-extrabold text-[#16221f]">Loan Sales Chart</h2>
            <div className="relative">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="appearance-none bg-[#F7F9FA] border border-[#e2e8f0] rounded-xl px-4 py-1.5 pr-8 text-xs font-bold text-gray-600 outline-none cursor-pointer hover:bg-gray-100/50"
              >
                <option>Today</option>
                <option>This Week</option>
                <option>This Month</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex gap-4 h-[190px] mt-1">
            {/* Y Axis Labels */}
            <div className="flex flex-col justify-between text-[10px] font-semibold text-gray-400 h-full text-right w-[38px] select-none py-0.5">
              <span>₹500k</span>
              <span>₹200k</span>
              <span>₹100k</span>
              <span>₹50k</span>
              <span>₹40k</span>
              <span>₹30k</span>
              <span>₹20k</span>
              <span>₹10k</span>
              <span>0</span>
            </div>

            {/* Bars Area */}
            <div className="flex-1 flex justify-around items-end h-full relative">
              {/* Gridlines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none select-none">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="border-b border-[#f1f4f3] w-full" />
                ))}
              </div>

              {/* Bar 1 */}
              <div className="flex flex-col items-center justify-end h-full w-[38px] z-10">
                <div className="bg-[#374151] w-5 rounded-t-md h-[78%] transition-all duration-500 hover:opacity-90" />
                <span className="text-[9px] font-bold text-gray-400 text-center leading-tight mt-1.5 truncate w-full">Mobiles on EMI</span>
              </div>

              {/* Bar 2 (Navy active bar with tooltip) */}
              <div className="flex flex-col items-center justify-end h-full w-[38px] z-10 relative">
                {/* 53k Tooltip */}
                <div className="absolute bottom-[56%] mb-1 bg-white text-[#1E293B] border border-[#e2e8f0] text-[9px] font-extrabold px-2 py-0.5 rounded shadow-md animate-bounce select-none">
                  53k
                </div>
                <div className="bg-[#2B4282] w-5 rounded-t-md h-[50%] transition-all duration-500 hover:opacity-90 shadow-md shadow-[#2b4282]/25" />
                <span className="text-[9px] font-bold text-gray-400 text-center leading-tight mt-1.5 truncate w-full">Electronics on EMI</span>
              </div>

              {/* Bar 3 */}
              <div className="flex flex-col items-center justify-end h-full w-[38px] z-10">
                <div className="bg-[#374151] w-5 rounded-t-md h-[38%] transition-all duration-500 hover:opacity-90" />
                <span className="text-[9px] font-bold text-gray-400 text-center leading-tight mt-1.5 truncate w-full">Two Wheeler Loan</span>
              </div>

              {/* Bar 4 */}
              <div className="flex flex-col items-center justify-end h-full w-[38px] z-10">
                <div className="bg-[#374151] w-5 rounded-t-md h-[68%] transition-all duration-500 hover:opacity-90" />
                <span className="text-[9px] font-bold text-gray-400 text-center leading-tight mt-1.5 truncate w-full">Used Car Loan</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Pie Chart & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales contribution of Services Card */}
        <div className="bg-white rounded-3xl border border-[#eef2f1] p-6 flex flex-col gap-4 cursor-pointer">
          <div className="flex justify-between items-center border-b border-[#f3f6f5] pb-4">
            <h2 className="text-[16px] font-extrabold text-[#16221f]">Sales contribution of Services</h2>
            <div className="relative">
              <select className="appearance-none bg-[#F7F9FA] border border-[#e2e8f0] rounded-xl px-4 py-1.5 pr-8 text-xs font-bold text-gray-600 outline-none cursor-pointer hover:bg-gray-100/50">
                <option>Today</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
            {/* Pie Chart SVG */}
            <div className="relative w-[220px] h-[220px]">
              <svg width="220" height="220" viewBox="0 0 220 220" className="overflow-visible select-none">
                {slices.map((slice, i) => (
                  <path
                    key={i}
                    d={slice.d}
                    fill={slice.color}
                    className="transition-all duration-300 hover:scale-[1.03] origin-[110px_110px]"
                  />
                ))}
                {/* Overlay percentages on slices */}
                {slices.map((slice, i) => (
                  <text
                    key={`text-${i}`}
                    x={slice.tx}
                    y={slice.ty}
                    fill="white"
                    fontSize="9.5"
                    fontWeight="800"
                    textAnchor="middle"
                    dominantBaseline="central"
                  >
                    {slice.percentage}
                  </text>
                ))}
              </svg>
            </div>

            {/* Legend Grid */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-xs font-bold text-gray-600">
              {pieData.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="truncate">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity Card */}
        <div className="bg-white rounded-3xl border border-[#eef2f1] p-6 flex flex-col gap-4 cursor-pointer">
          <div className="border-b border-[#f3f6f5] pb-4">
            <h2 className="text-[16px] font-extrabold text-[#16221f]">Recent Activity</h2>
          </div>

          <div className="flex-1 flex flex-col justify-between">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#fcfdfd]">
                    <th className="px-4 py-2.5 text-xs font-bold text-gray-500 border-b border-[#eef2f1]">Time</th>
                    <th className="px-4 py-2.5 text-xs font-bold text-gray-500 border-b border-[#eef2f1]">Activity</th>
                    <th className="px-4 py-2.5 text-xs font-bold text-gray-500 border-b border-[#eef2f1] text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f4f3]">
                  {[
                    { time: "6:35 AM", text: "Lorem ipsum dolor sit amet consectetur." },
                    { time: "6:33 AM", text: "Lorem ipsum dolor sit amet consectetur." },
                    { time: "6:32 AM", text: "Lorem ipsum dolor sit amet consectetur." },
                    { time: "6:31 AM", text: "Lorem ipsum dolor sit amet consectetur." },
                    { time: "6:30 AM", text: "Lorem ipsum dolor sit amet consectetur." }
                  ].map((act, i) => (
                    <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3 text-xs font-semibold text-gray-500 whitespace-nowrap">{act.time}</td>
                      <td className="px-4 py-3 text-xs font-bold text-gray-700">{act.text}</td>
                      <td className="px-4 py-3 text-right">
                        <button className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#EBF3FE] hover:bg-[#DBE7FF] text-[#2B4282] transition-colors border-none cursor-pointer">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
