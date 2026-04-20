// src/components/dashboard/DashboardCharts.jsx
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, Cell } from 'recharts';
import { FiTrendingUp, FiCalendar, FiPackage, FiUserCheck } from "react-icons/fi";
import { getLocalDateString } from '../../utils/helpers';

// 1. Các định nghĩa màu sắc gradient (Dùng chung cho các biểu đồ)
const SvgDefinitions = () => (
  <defs>
    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/><stop offset="95%" stopColor="#6366f1" stopOpacity={0}/></linearGradient>
    <linearGradient id="colorCustomerBar" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.9}/><stop offset="95%" stopColor="#10b981" stopOpacity={0.3}/></linearGradient>
    <linearGradient id="colorSold" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/><stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/></linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="rgba(79, 70, 229, 0.25)" /></filter>
  </defs>
);

// 2. Component Biểu đồ Doanh Thu
export const RevenueChart = ({ revenueData, filterMode, setFilterMode, startDate, setStartDate, endDate, setEndDate }) => (
  <div className="card border-0 bg-white h-100 shadow-sm" style={{ borderRadius: '20px' }}>
    <div className="card-header bg-white border-0 pt-4 pb-2 px-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="fw-bolder text-dark m-0 d-flex align-items-center"><FiTrendingUp className="me-2 fs-5 text-primary" /> Phân Tích Doanh Thu</h6>
        <div className="d-flex align-items-center bg-light rounded-pill px-3 py-1 border">
          <FiCalendar className="text-muted me-2" />
          <select className="form-select form-select-sm bg-transparent border-0 fw-bold text-primary shadow-none cursor-pointer p-0 pe-3" value={filterMode} onChange={(e) => setFilterMode(e.target.value)}>
            <option value="day">Theo Ngày</option><option value="month">Theo Tháng</option><option value="year">Theo Năm</option>
          </select>
        </div>
      </div>
      <div className="d-flex gap-2">
        <div className="flex-fill"><label className="small text-muted fw-semibold mb-1">Từ ngày</label><input type="date" className="form-control form-control-sm bg-light border-0 fw-medium text-dark" max={getLocalDateString(new Date())} value={startDate} onChange={(e) => setStartDate(e.target.value)} /></div>
        <div className="flex-fill"><label className="small text-muted fw-semibold mb-1">Đến ngày</label><input type="date" className="form-control form-control-sm bg-light border-0 fw-medium text-dark" max={getLocalDateString(new Date())} value={endDate} onChange={(e) => setEndDate(e.target.value)} /></div>
      </div>
    </div>
    <div className="card-body px-4 pb-4 mt-2">
      <div style={{ width: '100%', height: 180 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <SvgDefinitions /><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8', fontWeight: 500}} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8', fontWeight: 500}} />
            <Tooltip contentStyle={{border: 'none', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', padding: '10px 15px'}} formatter={(value) => [`$${value}`, "Doanh thu"]} />
            <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);

// 3. Component Biểu đồ Top Sản phẩm
export const TopProductsChart = ({ realTopRanking }) => (
  <div className="card border-0 bg-white h-100 shadow-sm" style={{ borderRadius: '20px' }}>
    <div className="card-header bg-white border-0 pt-4 pb-0 px-4"><h6 className="fw-bolder text-dark m-0 d-flex align-items-center"><FiPackage className="me-2 fs-5 text-warning" /> Top Sản Phẩm Bán Chạy (SL)</h6></div>
    <div className="card-body p-4 pt-3">
      {realTopRanking.length === 0 ? (<div className="text-center text-muted py-5 mt-4">Chưa có sản phẩm.</div>) : (
        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={realTopRanking} margin={{ top: 20, right: 10, left: -25, bottom: 0 }}>
              <SvgDefinitions /><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#94a3b8', fontWeight: 600}} tickFormatter={(val) => val.length > 8 ? `${val.substring(0, 8)}...` : val} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8', fontWeight: 500}} />
              <Tooltip contentStyle={{border: 'none', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', padding: '10px 15px'}} formatter={(value) => [`${value} cái`, "Đã bán"]} />
              <Area type="monotone" dataKey="sold" stroke="#f59e0b" strokeWidth={4} fillOpacity={1} fill="url(#colorSold)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  </div>
);

// 4. Component Biểu đồ Top Khách hàng
const CustomCustomerTick = ({ x, y, payload, allCustomers }) => {
  const customer = allCustomers.find(c => c.name === payload.value);
  const avatarUrl = customer?.avatar || `https://ui-avatars.com/api/?name=${payload.value}&background=random`;
  return (
    <g transform={`translate(${x},${y})`}>
      <defs><clipPath id={`clipCircle-${payload.index}`}><circle cx="0" cy="20" r="16" /></clipPath></defs>
      <image x="-16" y="4" width="32" height="32" xlinkHref={avatarUrl} clipPath={`url(#clipCircle-${payload.index})`} />
      <text x="0" y="55" textAnchor="middle" fill="#64748b" fontSize={11} fontWeight={600}>{payload.value.length > 10 ? `${payload.value.substring(0, 8)}...` : payload.value}</text>
    </g>
  );
};

export const TopCustomersChart = ({ top10Customers, allCustomers }) => (
  <div className="card border-0 bg-white shadow-sm p-4" style={{ borderRadius: '20px' }}>
    <h6 className="fw-bold mb-5 d-flex align-items-center"><FiUserCheck className="me-2 fs-5 text-success" /> Top 10 Khách Hàng Chi Tiêu Nhiều Nhất</h6>
    <div style={{ width: '100%', height: 350 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={top10Customers} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <SvgDefinitions /><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} interval={0} tick={<CustomCustomerTick allCustomers={allCustomers} />} />
          <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
          <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} formatter={(val) => [`$${val.toLocaleString()}`, 'Tổng chi tiêu']} />
          <Bar dataKey="spent" radius={[10, 10, 0, 0]} barSize={45}>
            {top10Customers.map((entry, index) => <Cell key={`cell-${index}`} fill="url(#colorCustomerBar)" filter="url(#shadow)" />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);