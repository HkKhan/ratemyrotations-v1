import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Star, MapPin, Clock, BookOpen, Search } from "lucide-react";
import { Card } from "./components/ui/card";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Extract search parameters with a default empty string
  const specialty = searchParams.get("specialty") || "";
  const hospitalName = searchParams.get("hospitalName") || "";
  const city = searchParams.get("city") || "";
  const state = searchParams.get("state") || "";

  useEffect(() => {
    // Only fetch if at least one search parameter is present
    const shouldFetch = specialty || hospitalName || city || state;

    if (shouldFetch) {
      const fetchResults = async () => {
        setLoading(true);
        try {
          // Construct query string dynamically
          const queryParams = new URLSearchParams();
          if (specialty) queryParams.set("specialty", specialty);
          if (hospitalName) queryParams.set("hospitalName", hospitalName);
          if (city) queryParams.set("city", city);
          if (state) queryParams.set("state", state);

          const response = await fetch(
            `${
              process.env.REACT_APP_API_BASE_URL
            }/search?${queryParams.toString()}`,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          setResults(data.items || []);
          setError(null);
        } catch (error) {
          console.error("Search error:", error);
          setError(error.message);
          setResults([]);
        } finally {
          setLoading(false);
        }
      };

      fetchResults();
    } else {
      // Reset results when no search parameters are present
      setResults([]);
      setLoading(false);
    }
  }, [specialty, hospitalName, city, state]);

  // SearchBar component can be defined here or imported
  const SearchBar = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchType, setSearchType] = useState("specialty");
    const navigate = useNavigate();

    const handleSearch = (e) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        // Create a query string based on the selected search type
        const queryParams = new URLSearchParams();
        queryParams.set(searchType, encodeURIComponent(searchQuery.trim()));
        navigate(`/search?${queryParams.toString()}`);
      }
    };

    return (
      <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
        <div className="flex items-center">
          {/* Search Type Dropdown */}
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="mr-2 px-3 py-4 rounded-lg text-gray-900 shadow-lg"
          >
            <option value="specialty">Specialty</option>
            <option value="hospitalName">Hospital</option>
            <option value="city">City</option>
            <option value="state">State</option>
          </select>

          {/* Search Input */}
          <div className="relative flex-grow">
            <input
              type="text"
              className="w-full px-6 py-4 rounded-lg text-gray-900 shadow-lg"
              placeholder={`Search by ${searchType}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#CE7B91] p-2 rounded-lg hover:bg-[#B8D3D1] transition-colors"
            >
              <Search className="text-white" />
            </button>
          </div>
        </div>
      </form>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <SearchBar />
      {(specialty || hospitalName || city || state) && !error && (
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Search Results</h1>
          <p className="text-gray-600">
            Found {results.length} rotation{" "}
            {results.length === 1 ? "site" : "sites"}
          </p>
        </div>
      )}
      {error ? (
        <div className="text-red-600">Error: {error}</div>
      ) : loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        (specialty || hospitalName || city || state) && (
          <div className="grid gap-4 md:grid-cols-2">
            {results.length === 0 ? (
              <div className="text-gray-600">No results found</div>
            ) : (
              results.map((site) => (
                <Card
                  key={site.siteId}
                  className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() =>
                    navigate(`/rotation/${encodeURIComponent(site.siteId)}`)
                  }
                >
                  <div className="flex flex-col h-full">
                    <div className="flex justify-between items-start">
                      <h2 className="text-xl font-semibold text-blue-600">
                        {site.hospitalName}
                      </h2>
                      <div className="flex items-center">
                        <Star
                          className="text-yellow-400 fill-current"
                          size={20}
                        />
                        <span className="ml-1 font-semibold">
                          {site.averageRating?.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center text-gray-600">
                        <MapPin size={16} className="mr-2" />
                        {site.city}, {site.state}
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                          {site.specialty}
                        </span>
                        <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                          {site.totalReviews}{" "}
                          {site.totalReviews === 1 ? "review" : "reviews"}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )
      )}
    </div>
  );
};

export default SearchResults;
