import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axios';
import { 
    FaCalendarAlt, FaMapMarkerAlt, FaSearch, 
    FaRegClock, FaTicketAlt, FaShieldAlt, FaArrowRight 
} from 'react-icons/fa';

const Home = () => {
    const [events, setEvents] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [loading, setLoading] = useState(true);

    // Seed file categories matching array
    const categories = ['All', 'Technology', 'Music', 'Business', 'Art'];

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchEvents();
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [search, selectedCategory]);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            let query = `/events?search=${search}`;
            if (selectedCategory !== 'All') {
                query += `&category=${selectedCategory}`;
            }

            const { data } = await api.get(query);
            
            // Client-side Filter & Sort for Upcoming Events
            const currentDate = new Date();
            const upcomingOnly = data.filter(event => new Date(event.date) >= currentDate);
            
            // Sort by nearest upcoming date first
            upcomingOnly.sort((a, b) => new Date(a.date) - new Date(b.date));

            setEvents(upcomingOnly);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Hero Section */}
            <div className="relative bg-black text-white rounded-3xl overflow-hidden mb-12 shadow-2xl">
                <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1600')] bg-cover bg-center"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
                <div className="relative p-8 md:p-16 text-center flex flex-col items-center z-10">
                    <span className="bg-white/10 text-white backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6 border border-white/20">
                        Welcome to Eventora
                    </span>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight tracking-tight drop-shadow-lg">
                        Find Your Next <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500">
                            Unforgettable
                        </span> Experience
                    </h1>
                    <p className="text-gray-300 text-base md:text-xl mb-10 max-w-2xl mx-auto font-light leading-relaxed">
                        Discover technology summits, EDM music festivals, art expos, and business pitch events.
                    </p>

                    <div className="w-full max-w-2xl mx-auto relative flex items-center shadow-2xl group">
                        <FaSearch className="absolute left-6 text-gray-500 text-xl group-focus-within:text-black transition-colors" />
                        <input
                            type="text"
                            placeholder="Search upcoming events by title..."
                            className="w-full pl-16 pr-6 py-4 md:py-5 rounded-full text-base md:text-lg text-black bg-white/95 backdrop-blur-sm border-2 border-transparent focus:border-gray-500 focus:outline-none transition-all placeholder-gray-400 font-medium"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Features Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-gray-900 text-white rounded-xl flex items-center justify-center text-xl mb-3 shadow-md">
                        <FaRegClock />
                    </div>
                    <h3 className="text-base font-bold text-gray-900 mb-1">Instant Booking</h3>
                    <p className="text-gray-500 text-xs">Reserve seats directly with automated availability check.</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-gray-900 text-white rounded-xl flex items-center justify-center text-xl mb-3 shadow-md">
                        <FaTicketAlt />
                    </div>
                    <h3 className="text-base font-bold text-gray-900 mb-1">Digital Tickets</h3>
                    <p className="text-gray-500 text-xs">Access confirmed seat tickets directly in your user dashboard.</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-gray-900 text-white rounded-xl flex items-center justify-center text-xl mb-3 shadow-md">
                        <FaShieldAlt />
                    </div>
                    <h3 className="text-base font-bold text-gray-900 mb-1">Verified Organizers</h3>
                    <p className="text-gray-500 text-xs">All featured events are verified and managed by Eventora admin.</p>
                </div>
            </div>

            {/* Upcoming Events Header & Filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-gray-200 pb-6">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Upcoming Events</h2>
                    <p className="text-sm text-gray-500 mt-1">Live seed database listings sorted by date</p>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                                selectedCategory === cat
                                    ? 'bg-gray-900 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                    <span className="ml-2 px-3 py-1 bg-gray-100 text-gray-800 font-bold text-xs rounded-full border border-gray-200 whitespace-nowrap">
                        {events.length} Available
                    </span>
                </div>
            </div>

            {/* Events Cards Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map((n) => (
                        <div key={n} className="bg-gray-100 animate-pulse rounded-2xl h-96"></div>
                    ))}
                </div>
            ) : events.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-300">
                    <p className="text-xl font-semibold text-gray-600 mb-2">No matching events found</p>
                    <p className="text-sm text-gray-400">Try switching categories or resetting your search term.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.map((event) => {
                        const filledPercentage = Math.round(((event.totalSeats - event.availableSeats) / event.totalSeats) * 100) || 0;
                        const isAlmostFull = event.availableSeats <= event.totalSeats * 0.2;

                        return (
                            <div
                                key={event._id}
                                className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group hover:-translate-y-1"
                            >
                                <div className="h-52 bg-gray-900 overflow-hidden relative">
                                    <img
                                        src={event.image}
                                        alt={event.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <span className="absolute top-4 left-4 bg-black/70 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase border border-white/10">
                                        {event.category}
                                    </span>
                                    <div className="absolute top-4 right-4 bg-white text-gray-900 px-3 py-1 rounded-full text-sm font-extrabold shadow-md">
                                        {event.ticketPrice === 0 ? (
                                            <span className="text-green-600">FREE</span>
                                        ) : (
                                            <span>₹{event.ticketPrice}</span>
                                        )}
                                    </div>
                                </div>

                                <div className="p-6 flex-grow flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-black transition-colors line-clamp-1">
                                            {event.title}
                                        </h3>

                                        <p className="text-gray-500 text-xs line-clamp-2 mb-4 leading-relaxed">
                                            {event.description}
                                        </p>

                                        <div className="space-y-2 mb-6 text-gray-600 text-xs font-medium">
                                            <div className="flex items-center gap-2.5">
                                                <FaCalendarAlt className="text-gray-400 shrink-0" />
                                                <span>
                                                    {new Date(event.date).toLocaleDateString('en-IN', {
                                                        weekday: 'short',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2.5">
                                                <FaMapMarkerAlt className="text-gray-400 shrink-0" />
                                                <span className="truncate">{event.location}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-center text-xs font-medium mb-1.5">
                                            <span className={isAlmostFull ? 'text-red-600 font-bold' : 'text-gray-500'}>
                                                {event.availableSeats === 0 ? 'Sold Out' : `${event.availableSeats} / ${event.totalSeats} seats left`}
                                            </span>
                                            <span className="text-gray-400">{filledPercentage}% booked</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2 mb-5 overflow-hidden">
                                            <div
                                                className={`h-2 rounded-full transition-all duration-500 ${
                                                    isAlmostFull ? 'bg-red-500' : 'bg-gray-900'
                                                }`}
                                                style={{ width: `${filledPercentage}%` }}
                                            ></div>
                                        </div>

                                        <Link
                                            to={`/events/${event._id}`}
                                            className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white font-semibold py-3 px-4 rounded-xl transition duration-200 text-xs shadow-sm"
                                        >
                                            View Details & Book <FaArrowRight className="text-xs" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Home;