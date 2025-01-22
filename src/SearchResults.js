import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, MapPin, Star, Users } from "lucide-react";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      const query = searchParams.get("q");
      if (!query) {
        setLoading(false);
        return;
      }

      try {
        console.log(
          "fetching",
          `${process.env.REACT_APP_API_BASE_URL}/search?q=${encodeURIComponent(
            query
          )}`
        );
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/search?q=${encodeURIComponent(
            query
          )}`,
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
        setResults(data);
      } catch (error) {
        console.error("Search error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchParams]);

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Search Results</h1>
        <p className="text-gray-600">Found {results.length} rotation sites</p>
      </div>
      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {results.length === 0 ? (
            <div className="text-gray-600">No results found</div>
          ) : (
            results.map((site) => (
              <div
                key={site.siteId}
                className="border rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/rotation/${site.siteId}`)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-blue-600">
                      {site.hospitalName}
                    </h2>
                    <div className="flex items-center text-gray-600 mt-1">
                      <MapPin size={16} className="mr-1" />
                      {site.location}
                    </div>
                    <div className="mt-2">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        {site.specialty}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center">
                      <Star
                        className="text-yellow-400 fill-current"
                        size={20}
                      />
                      <span className="ml-1 font-semibold">
                        {site.averageRating?.toFixed(1)}
                      </span>
                    </div>
                    <div className="flex items-center mt-1 text-gray-600">
                      <Users size={16} className="mr-1" />
                      {site.totalReviews} reviews
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
