import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import LatestDestinationCard from "../components/LatestDestinationCard";
import { motion } from "framer-motion";
import { Search, Sparkles, Shield, Star } from "lucide-react";
import { useState } from "react";

const Home = () => {
  const { data: hotels, isLoading } = useQuery("fetchQuery", () => apiClient.fetchHotels());
  const [destination, setDestination] = useState('');
  const [isSearched, setIsSearched] = useState(false);

  // Logic to filter hotels based on user input
  const filteredHotels = hotels?.filter((hotel) =>
    hotel.city.toLowerCase().includes(destination.toLowerCase()) ||
    hotel.country.toLowerCase().includes(destination.toLowerCase()) ||
    hotel.name.toLowerCase().includes(destination.toLowerCase())
  ) || [];

  const handleSearch = () => {
    if (destination.trim() !== "") {
      setIsSearched(true);
      // Smooth scroll to the results section
      document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Determine which hotels to display
  const displayHotels = isSearched ? filteredHotels : hotels || [];
  const topRowHotels = displayHotels.slice(0, 2);
  const bottomRowHotels = displayHotels.slice(2, 5);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  if (isLoading) {
    return (
      <div className="space-y-12">
        <div className="relative h-[600px] rounded-3xl overflow-hidden shimmer"></div>
        <div className="grid gap-6">
          <div className="grid md:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-[400px] rounded-2xl bg-gray-200 shimmer"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative max-h-[85vh] flex flex-col justify-center rounded-3xl overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900"
      >
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative px-6 py-24">
          <div className="mx-auto max-w-4xl text-center ">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm mb-6"
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span className="text-sm font-medium text-white">
                Trusted by thousands of travelers worldwide
              </span>
            </motion.div>

            <motion.h1
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-5xl md:text-6xl font-bold tracking-tight text-white mb-6"
            >
              Discover Your Perfect
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300">
                Getaway Experience
              </span>
            </motion.h1>

            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <div className="relative w-full max-w-xl">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => {
                    setDestination(e.target.value);
                    if (e.target.value === "") setIsSearched(false);
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search by city, country, or hotel name..."
                  className="w-full pl-12 pr-32 py-4 rounded-xl bg-white text-gray-900 focus:ring-4 focus:ring-blue-400 outline-none transition-all"
                />
                <button 
                  onClick={handleSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Search
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Animated Scroll Down Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-white/60 text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-white rounded-full"></div>
          </div>
        </motion.div>
      </motion.section>

      {/* Trust Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: Shield, title: "Secure Booking", description: "Your payment and personal info are protected" },
          { icon: Star, title: "Verified Stays", description: "Every property is personally vetted" },
          { icon: "✨", title: "Best Price", description: "Found a lower price? We'll match it" },
        ].map((feature) => (
          <div key={feature.title} className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              {typeof feature.icon === "string" ? <span className="text-2xl">{feature.icon}</span> : <feature.icon className="w-6 h-6 text-blue-600" />}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Section */}
      <motion.section
        id="results-section"
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-8 scroll-mt-20"
      >
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-bold text-gray-900">
              {isSearched ? `Results for "${destination}"` : "Featured Destinations"}
            </h2>
            <p className="text-gray-600 mt-2">
              {isSearched ? `We found ${filteredHotels.length} matches` : "Handpicked stays for an exceptional travel experience"}
            </p>
          </div>
          {isSearched && (
            <button 
              onClick={() => { setIsSearched(false); setDestination(""); }}
              className="text-blue-600 font-medium hover:underline"
            >
              Clear Results
            </button>
          )}
        </motion.div>

        {isSearched && filteredHotels.length === 0 ? (
          <motion.div 
            variants={itemVariants}
            className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200"
          >
            <div className="text-6xl mb-4">🏙️</div>
            <h3 className="text-2xl font-bold text-gray-900">No destinations found</h3>
            <p className="text-gray-500 max-w-sm mx-auto mt-2">
              We couldn't find any hotels matching "{destination}". Try checking your spelling or searching a different city.
            </p>
          </motion.div>
        ) : (
          <motion.div variants={itemVariants} className="grid gap-6">
            <div className="grid md:grid-cols-2 gap-6">
              {topRowHotels.map((hotel) => (
                <LatestDestinationCard key={hotel._id} hotel={hotel} />
              ))}
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {bottomRowHotels.map((hotel) => (
                <LatestDestinationCard key={hotel._id} hotel={hotel} />
              ))}
            </div>
          </motion.div>
        )}
      </motion.section>
    </div>
  );
};

export default Home;