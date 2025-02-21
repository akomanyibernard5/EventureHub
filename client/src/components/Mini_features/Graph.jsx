import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { User, Ticket, Calendar } from "lucide-react";

// Random data generation for simulation
const generateRandomStats = () => {
    return {
        totalEventsCreated: Math.floor(Math.random() * 50) + 10,
        totalPublishedEvents: Math.floor(Math.random() * 40) + 5,
        totalCancelledEvents: Math.floor(Math.random() * 10),
        totalCompletedEvents: Math.floor(Math.random() * 30),
        totalAttendees: Math.floor(Math.random() * 5000) + 500,
        totalUploads: Math.floor(Math.random() * 300) + 50,
        totalComments: Math.floor(Math.random() * 1000) + 100,
        totalRevenue: Math.floor(Math.random() * 50000) + 5000,
        mostFrequentCategory: "Tech Meetup",
        averageTicketPrice: Math.floor(Math.random() * 100) + 10,
    };
};

const Dashboard = () => {
    const [stats, setStats] = useState(generateRandomStats());

    useEffect(() => {
        setStats(generateRandomStats());
    }, []);

    // Data for charts and graphs
    const eventTrendsData = Array.from({ length: 30 }, (_, i) => ({
        day: `${i + 1}`,
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

    const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

    return (
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Total Metrics Section - Full Width */}
            <div className="p-4 border rounded-lg shadow-lg col-span-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="flex items-center justify-between">
                        <Calendar size={32} className="text-gray-600" />
                        <div>
                            <h3 className="text-xl font-bold text-gray-700">Total Events Created</h3>
                            <p className="text-2xl font-semibold text-gray-900">{stats.totalEventsCreated}</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <Ticket size={32} className="text-gray-600" />
                        <div>
                            <h3 className="text-xl font-bold text-gray-700">Average Ticket Price</h3>
                            <p className="text-2xl font-semibold text-gray-900">${stats.averageTicketPrice}</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <User size={32} className="text-gray-600" />
                        <div>
                            <h3 className="text-xl font-bold text-gray-700">Total Attendees</h3>
                            <p className="text-2xl font-semibold text-gray-900">{stats.totalAttendees}</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <Ticket size={32} className="text-gray-600" />
                        <div>
                            <h3 className="text-xl font-bold text-gray-700">Total Revenue</h3>
                            <p className="text-2xl font-semibold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Event Trends (Last 30 Days) */}
            <div className="col-span-2 p-4 border rounded-lg shadow-lg">
                <h3 className="text-xl font-bold text-gray-700">Event Trends (Last 30 Days)</h3>
                <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={eventTrendsData}>
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="events" stroke="#0088FE" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Event Type Distribution */}
            <div className="p-4 border rounded-lg shadow-lg">
                <h3 className="text-xl font-bold text-gray-700">Event Type Distribution</h3>
                <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                        <Pie data={eventTypeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                            {eventTypeData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Revenue by Event */}
            <div className="p-4 border rounded-lg shadow-lg">
                <h3 className="text-xl font-bold text-gray-700">Revenue by Event</h3>
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={revenueData}>
                        <XAxis dataKey="event" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="revenue" fill="#00C49F" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Top 10 Most Commented Events */}
            <div className="p-4 border rounded-lg shadow-lg">
                <h3 className="text-xl font-bold text-gray-700">Top 10 Most Commented Events</h3>
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={topCommentedEvents}>
                        <XAxis dataKey="event" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="comments" fill="#FFBB28" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Top 10 Most Registered Events */}
            <div className="p-4 border rounded-lg shadow-lg">
                <h3 className="text-xl font-bold text-gray-700">Top 10 Most Registered Events</h3>
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={topRegisteredEvents}>
                        <XAxis dataKey="event" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="attendees" fill="#0088FE" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default Dashboard;
