import { useState, useEffect } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend, ScatterChart, Scatter, ComposedChart, Line
} from 'recharts';

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetching the data from the public folder
    fetch('/db.dashboard_incidents.json')
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => console.error("Error loading data:", err));
  }, []);

  if (loading) return <div className="flex h-screen items-center justify-center">Loading Dashboard...</div>;

  // 1. Data Processing: Incidents by Project (Bar Chart)
  const projectData = Object.values(data.reduce((acc, curr) => {
    acc[curr.job] = acc[curr.job] || { name: curr.job, incidents: 0, severity: 0 };
    acc[curr.job].incidents += 1;
    acc[curr.job].severity += curr.severity_level;
    return acc;
  }, {}));

  // 2. Data Processing: Incidents by Category (Pie Chart)
  const categoryData = Object.values(data.reduce((acc, curr) => {
    const cat = curr.primary_category || "Uncategorized";
    acc[cat] = acc[cat] || { name: cat, value: 0 };
    acc[cat].value += 1;
    return acc;
  }, {})).slice(0, 5); // Top 5 for clarity

  // 3. Data Processing: Monthly Trend (Area Chart)
  const monthlyData = Object.values(data.reduce((acc, curr) => {
    const key = `${curr.year}-${curr.month}`;
    acc[key] = acc[key] || { month: `M${curr.month}`, count: 0, year: curr.year };
    acc[key].count += 1;
    return acc;
  }, {})).sort((a, b) => a.month.localeCompare(b.month));

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Incident Analytics Dashboard</h1>
        <p className="text-slate-500">Real-time safety data overview</p>
      </header>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Chart 1: Project Distribution (Bar) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4 text-slate-700">Incidents by Project</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip cursor={{fill: '#f1f5f9'}} />
                <Bar dataKey="incidents" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Category Breakdown (Pie) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-semibold mb-4 text-slate-700">Primary Categories</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Monthly Trend (Area) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 lg:col-span-1">
          <h2 className="text-lg font-semibold mb-4 text-slate-700">Monthly Incident Trend</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" />
                <Tooltip />
                <Area type="monotone" dataKey="count" stroke="#8B5CF6" fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Severity vs Incidents (Composed) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 lg:col-span-1">
          <h2 className="text-lg font-semibold mb-4 text-slate-700">Severity Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={projectData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <CartesianGrid stroke="#f5f5f5" />
                <Bar dataKey="incidents" barSize={20} fill="#10B981" />
                <Line type="monotone" dataKey="severity" stroke="#EF4444" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 5: Risk Correlation (Scatter) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 lg:col-span-1">
          <h2 className="text-lg font-semibold mb-4 text-slate-700">Incident Severity Scatter</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart>
                <XAxis type="number" dataKey="month" name="month" unit="" />
                <YAxis type="number" dataKey="severity_level" name="severity" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter name="Incidents" data={data.slice(0, 50)} fill="#F59E0B" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App