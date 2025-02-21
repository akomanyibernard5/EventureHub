import { useState, useEffect, useContext } from 'react';
import { EventContext } from "../../contexts/EventContext.jsx";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { User, CircleDollarSign, Calendar } from "lucide-react";


function LiveGraph() {
  const { activeSection, url } = useContext(EventContext);
  const [events, setEvents] = useState([]);
  const [totalUploads, setTotalUploads] = useState(0)
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [userData, setUserData] = useState(null)
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData')
    setUserData(JSON.parse(storedUserData))
  }, [])

  const eventTrendsData = Array.from({ length: 30 }, (_, i) => ({
    day: `Day ${i + 1}`,
    events: Math.floor(Math.random() * 10) + 5,
  }));

  const revenueData = Array.from({ length: 6 }, (_, i) => ({
    event: `Event ${i + 1}`,
    revenue: Math.floor(Math.random() * 10000) + 1000,
  }));

  const eventTypeData = [
    { name: "In-Person", value: Math.random() * 50 },
    { name: "Virtual", value: Math.random() * 30 },
    { name: "Hybrid", value: Math.random() * 20 },
  ];

  const topCommentedEvents = Array.from({ length: 10 }, (_, i) => ({
    event: `Event ${i + 1}`,
    comments: Math.floor(Math.random() * 100) + 20,
  }));

  const topRegisteredEvents = Array.from({ length: 10 }, (_, i) => ({
    event: `Event ${i + 1}`,
    attendees: Math.floor(Math.random() * 500) + 50,
  }));



  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${url}/api/events/stats`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });
        const statsData = await response.json();
        setStats(statsData.success ? statsData : {});
        console.log(statsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    document.title = "EventureHub - Analytics";
  }, []);



  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-white/10 p-6">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="p-4 border rounded-lg shadow-lg col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar size={32} className="text-white" />
                  <h3 className="text-xl font-bold text-white">Total Events Created</h3>
                </div>
                <p className="text-2xl font-semibold text-white">{userData?.eventCount ?? 0}</p>
              </div>


              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <User size={32} className="text-white" />
                  <h3 className="text-xl font-bold text-white">Total Attendees</h3>
                </div>
                <p className="text-2xl font-semibold text-white">{stats.totalAttendees}</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CircleDollarSign size={32} className="text-white" />
                  <h3 className="text-xl font-bold text-white">Average Ticket Price</h3>
                </div>
                <p className="text-2xl font-semibold text-white">${stats.averageTicketPrice}</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CircleDollarSign size={32} className="text-white" />
                  <h3 className="text-xl font-bold text-white">Total Revenue</h3>
                </div>
                <p className="text-2xl font-semibold text-white">${stats.totalRevenue}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-2 p-4 border rounded-lg shadow-lg">
        <h3 className="text-xl font-bold text-white">Event Trends (Last 30 Days)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={stats.event}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="events" stroke="#0088FE" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* <div className="p-4 border rounded-lg shadow-lg">
          <h3 className="text-xl font-bold text-white">Event Type Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={stats.events} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                {stats.events.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div> */}

        {/* Revenue by Event */}
        <div className="p-4 border rounded-lg shadow-lg">
          <h3 className="text-xl font-bold text-white">Revenue by Event</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stats.totalRevenue}>
              <XAxis dataKey="event" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#00C49F" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top 10 Most Commented Events */}
        {/* <div className="p-4 border rounded-lg shadow-lg">
          <h3 className="text-xl font-bold text-white">Top 10 Most Commented Events</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={topCommentedEvents}>
              <XAxis dataKey="event" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="comments" fill="#FFBB28" />
            </BarChart>
          </ResponsiveContainer>
        </div> */}

        {/* Top 10 Most Registered Events */}
        {/* <div className="p-4 border rounded-lg shadow-lg">
          <h3 className="text-xl font-bold text-white">Top 10 Most Registered Events</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={topRegisteredEvents}>
              <XAxis dataKey="event" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="attendees" fill="#0088FE" />
            </BarChart>
          </ResponsiveContainer>
        </div> */}

        {/* <div className="p-4 border rounded-lg shadow-lg">
          <h3 className="text-xl font-bold text-white">Top 10 Most Registered Event Catergory</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={topRegisteredEvents}>
              <XAxis dataKey="event" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="attendees" fill="#0088FE" />
            </BarChart>
          </ResponsiveContainer>
        </div> */}

        <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-white/10 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Created Events</h2>
            <div className="flex items-center gap-4">
              <span className="text-sm text-white">Total Uploads:</span>
              <span className="text-lg font-bold text-white">
                {totalUploads}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {events.map((event, index) => {
              const percentage = (event.uploadCount / 100) + 1;

              return (
                <div key={event._id} className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-white">#{index + 1}</span>
                      <h3 className="text-sm font-medium text-white truncate max-w-[200px]">
                        {event.title}
                      </h3>
                    </div>
                    <span className="text-sm font-medium text-primary-400">
                      {event.uploadCount} {event.uploadCount === 1 ? "upload" : "uploads"}
                    </span>

                  </div>

                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 
                             rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between mt-1 text-xs text-white">
                    <span>{new Date(event.startDate).toLocaleDateString()}</span>
                    <span>{event.category}</span>
                  </div>
                </div>
              )
            })}

            {events.length === 0 && !isLoading && (
              <div className="text-center py-12 text-white">
                No event data available
              </div>
            )}

            {isLoading && (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-white/5 rounded-full w-3/4 mb-2" />
                    <div className="h-2 bg-white/5 rounded-full" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LiveGraph 