import React, { useRef } from "react";
import { Search, BookOpen, Users, Trophy } from "lucide-react";
import RotationSearchTable from "./RotationSearchTable";
import SearchBar from "./SearchBar";

const LandingPage = () => {
  const tableRef = useRef(null);

  return (
    <div className="min-h-screen">
      <nav className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-[#CE7B91]">
              RateMyRotations
            </div>
            <div className="flex gap-6">
              <a href="/add" className="hover:text-[#CE7B91]">
                Add Rotation
              </a>
              <a href="/search" className="hover:text-[#CE7B91]">
                Search
              </a>
            </div>
          </div>
        </div>
      </nav>

      <div className="bg-gradient-to-r from-[#CE7B91] to-[#B8D3D1] text-white py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-4xl font-bold mb-6">
            Find Your Perfect Medical School Rotation
          </h1>
          <p className="text-xl mb-8">
            Real reviews from medical students for medical students. Make
            informed decisions about your clinical rotations.
          </p>

          <SearchBar />
        </div>
      </div>

      <div className="py-16 bg-[#C0E8F9] bg-opacity-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-[#CE7B91] bg-opacity-20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <BookOpen className="text-[#CE7B91]" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Detailed Reviews</h3>
              <p className="text-gray-600">
                Get insights on teaching quality, workload, and learning
                opportunities
              </p>
            </div>
            <div className="text-center">
              <div className="bg-[#CE7B91] bg-opacity-20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="text-[#CE7B91]" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Student Community</h3>
              <p className="text-gray-600">
                Join thousands of medical students sharing their experiences
              </p>
            </div>
            <div className="text-center">
              <div className="bg-[#CE7B91] bg-opacity-20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Trophy className="text-[#CE7B91]" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Find the Best</h3>
              <p className="text-gray-600">
                Discover top-rated rotations that match your career goals
              </p>
            </div>
          </div>
        </div>
      </div>

      <div ref={tableRef} className="pb-16">
        <RotationSearchTable />
      </div>
    </div>
  );
};

export default LandingPage;
