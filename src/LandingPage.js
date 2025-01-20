import React, { useState } from "react";
import { Search, BookOpen, Users, Trophy } from "lucide-react";

const LandingPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search logic/navigation
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-blue-600">
              RateMyRotations
            </div>
            <div className="flex gap-6">
              <a href="/search" className="hover:text-blue-600">
                Search
              </a>
              <a href="/add" className="hover:text-blue-600">
                Add Rotation
              </a>
              <a href="/login" className="hover:text-blue-600">
                Login
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-4xl font-bold mb-6">
            Find Your Perfect Medical School Rotation
          </h1>
          <p className="text-xl mb-8">
            Real reviews from medical students for medical students. Make
            informed decisions about your clinical rotations.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                className="w-full px-6 py-4 rounded-lg text-gray-900 shadow-lg"
                placeholder="Search by hospital, specialty, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 p-2 rounded-lg"
              >
                <Search className="text-white" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <BookOpen className="text-blue-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Detailed Reviews</h3>
              <p className="text-gray-600">
                Get insights on teaching quality, workload, and learning
                opportunities
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="text-blue-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Student Community</h3>
              <p className="text-gray-600">
                Join thousands of medical students sharing their experiences
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Trophy className="text-blue-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Find the Best</h3>
              <p className="text-gray-600">
                Discover top-rated rotations that match your career goals
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
