import { useState, useEffect } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend, ScatterChart, Scatter, ComposedChart, Line
} from 'recharts';

function App() {
  const [data, setData] = useState([]);
  const [isAgentOpen, setIsAgentOpen] = useState(true);
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
      {/* Local Agent Sidebar */}
      {isAgentOpen && (
        <Agent 
          dataset={data} 
          onClose={() => setIsAgentOpen(false)} 
        />
      )}
    </div>
  );
}


// function LocalDataAgent({ dataset, onClose }) {
//   const [query, setQuery] = useState("");
//   const [history, setHistory] = useState([]);

//   // This is the "brain" of your agent - it processes the data locally
//   const processQuery = (text) => {
//     const q = text.toLowerCase();
//     let response = "";

//     if (q.includes("total") || q.includes("how many")) {
//       response = `There are a total of ${dataset.length} recorded incidents in the database.`;
//     } 
//     else if (q.includes("highest severity") || q.includes("worst")) {
//       const highSev = dataset.filter(i => i.severity_level >= 3).length;
//       response = `I found ${highSev} critical incidents with a severity level of 3 or higher.`;
//     } 
//     else if (q.includes("project")) {
//       const projects = [...new Set(dataset.map(i => i.job))];
//       response = `Data is being tracked across ${projects.length} projects: ${projects.join(", ")}.`;
//     } 
//     else if (q.includes("common") || q.includes("category")) {
//       const cats = dataset.reduce((acc, curr) => {
//         const cat = curr.primary_category || "Uncategorized";
//         acc[cat] = (acc[cat] || 0) + 1;
//         return acc;
//       }, {});
//       const top = Object.entries(cats).sort((a,b) => b[1] - a[1])[0];
//       response = `The most common incident category is "${top[0]}" with ${top[1]} occurrences.`;
//     } 
//     else {
//       response = "I can help with totals, severity checks, project lists, and category analysis. Try asking 'What is the most common category?'";
//     }

//     setHistory([...history, { type: 'user', text }, { type: 'bot', text: response }]);
//     setQuery("");
//   };

//   return (
//     <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-2xl border-l border-slate-200 flex flex-col z-50 overflow-hidden">
//       <div className="p-4 bg-emerald-600 text-white flex justify-between items-center">
//         <h2 className="font-bold uppercase text-xs tracking-widest">Local Data Agent</h2>
//         <button onClick={onClose} className="hover:text-emerald-200">✕</button>
//       </div>

//       <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50">
//         <div className="bg-white p-3 rounded border border-slate-200 text-xs text-slate-500 italic">
//           Hello! I am a local agent. I process your data directly in the browser. No cloud, no cost.
//         </div>
        
//         {history.map((msg, i) => (
//           <div key={i} className={`p-3 rounded-lg text-sm shadow-sm ${msg.type === 'user' ? 'bg-emerald-100 ml-4' : 'bg-white mr-4 border'}`}>
//             <p>{msg.text}</p>
//           </div>
//         ))}
//       </div>

//       <div className="p-4 border-t bg-white">
//         <div className="flex gap-2">
//           <input 
//             className="flex-1 p-2 border rounded text-sm focus:outline-none focus:border-emerald-500"
//             placeholder="Ask about projects, severity..."
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             onKeyDown={(e) => e.key === 'Enter' && processQuery(query)}
//           />
//           <button 
//             onClick={() => processQuery(query)}
//             className="bg-emerald-600 text-white px-3 py-1 rounded text-sm font-bold"
//           >
//             GO
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

function Agent({ dataset, onClose }) {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  // Generates a text-based summary of the JSON data to feed the AI
  const createSystemPrompt = () => {
    if (!dataset || dataset.length === 0) return "No data available.";

    const total = dataset.length;
    const projectCounts = dataset.reduce((acc, curr) => {
      acc[curr.job] = (acc[curr.job] || 0) + 1;
      return acc;
    }, {});

    const highSeverity = dataset.filter(i => i.severity_level >= 3).length;
    const commonCategory = dataset.reduce((acc, curr) => {
      const cat = curr.primary_category || "General";
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {});

    const topCat = Object.entries(commonCategory).sort((a, b) => b[1] - a[1])[0];

    return `
      You are a safety data assistant. Here is the dashboard data context:
      - Total Incidents: ${total}
      - Incidents by Project: ${JSON.stringify(projectCounts)}
      - High Severity Incidents (Level 3+): ${highSeverity}
      - Most Common Category: ${topCat ? topCat[0] : 'N/A'} (${topCat ? topCat[1] : 0} cases)
      - Recent Incident Sample: ${JSON.stringify(dataset.slice(0, 5))}
      Please answer the user's question based strictly on this data.
    `.trim();
  };

  const handleAsk = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setChat(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await fetch("https://temp.aistoryteller.workers.dev/gpt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Exact format requested: {"input": "", "systemPrompt": ""}
        body: JSON.stringify({
          "input": input,
          "systemPrompt": "none"
        }),
      });

      const aiResponseText = await response.text();
      setChat(prev => [...prev, { role: "ai", text: aiResponseText }]);
    } catch (error) {
      setChat(prev => [...prev, { role: "ai", text: "Error connecting to AI service." }]);
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-2xl border-l flex flex-col z-50 animate-in slide-in-from-right">
      <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
        <h2 className="text-sm font-bold tracking-tight">AI DATA AGENT</h2>
        <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {chat.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-3 rounded-lg text-xs shadow-sm ${
              msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white border text-slate-700'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && <div className="text-[10px] text-blue-600 animate-pulse">Processing data...</div>}
      </div>

      <div className="p-4 border-t bg-white">
        <div className="flex gap-2">
          <input 
            className="flex-1 p-2 border rounded text-xs outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Ask about your data..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
          />
          <button 
            onClick={handleAsk}
            disabled={loading}
            className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-bold hover:bg-blue-700 disabled:opacity-50"
          >
            ASK
          </button>
        </div>
      </div>
    </div>
  );
}

export default App