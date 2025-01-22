import { useState, useEffect } from "react";
import { Search, ChevronDown, ChevronUp, Star, Clock } from "lucide-react";

const RotationSearchTable = ({ initialSearchTerm = "" }) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [rotations, setRotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({
    key: "averageRating",
    direction: "desc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  // Fetch data only once on component mount
  useEffect(() => {
    const fetchRotations = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/search?q=`
        );
        const data = await response.json();
        setRotations(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching rotations:", error);
        setLoading(false);
      }
    };

    fetchRotations();
  }, []); // Empty dependency array - only fetch once

  // Update searchTerm when initialSearchTerm changes
  useEffect(() => {
    setSearchTerm(initialSearchTerm);
    setCurrentPage(1); // Reset to first page when search term changes
  }, [initialSearchTerm]);

  const sortData = (data) => {
    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  };

  const requestSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const filteredData = rotations?.filter((rotation) => {
    if (!searchTerm) return true;

    const searchFields = [
      rotation.hospitalName,
      rotation.specialty,
      rotation.city,
      rotation.state,
    ].map((field) => String(field).toLowerCase());

    return searchFields.some((field) =>
      field.includes(searchTerm.toLowerCase())
    );
  });

  const sortedAndFilteredData = sortData(filteredData);
  const paginatedData = sortedAndFilteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? (
        <ChevronUp className="w-4 h-4" />
      ) : (
        <ChevronDown className="w-4 h-4" />
      );
    }
    return <ChevronDown className="w-4 h-4 opacity-0 group-hover:opacity-50" />;
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      {/* Search Bar - Simplified version without shadcn dependency */}
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by rotation site, specialty, city, or state..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-200 h-11 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th
                  className="py-4 px-6 text-left cursor-pointer group border-b border-gray-200"
                  onClick={() => requestSort("hospitalName")}
                >
                  <div className="flex items-center space-x-1">
                    <span className="font-medium text-sm text-gray-600">
                      Rotation Site
                    </span>
                    {getSortIcon("hospitalName")}
                  </div>
                </th>
                <th
                  className="py-4 px-6 text-left cursor-pointer group border-b border-gray-200"
                  onClick={() => requestSort("specialty")}
                >
                  <div className="flex items-center space-x-1">
                    <span className="font-medium text-sm text-gray-600">
                      Specialty
                    </span>
                    {getSortIcon("specialty")}
                  </div>
                </th>
                <th
                  className="py-4 px-6 text-left cursor-pointer group border-b border-gray-200"
                  onClick={() => requestSort("avgHours")}
                >
                  <div className="flex items-center space-x-1">
                    <span className="font-medium text-sm text-gray-600">
                      Hours/Week
                    </span>
                    {getSortIcon("avgHours")}
                  </div>
                </th>
                <th
                  className="py-4 px-6 text-left cursor-pointer group border-b border-gray-200"
                  onClick={() => requestSort("averageRating")}
                >
                  <div className="flex items-center space-x-1">
                    <span className="font-medium text-sm text-gray-600">
                      Rating
                    </span>
                    {getSortIcon("averageRating")}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center py-8">
                    Loading...
                  </td>
                </tr>
              ) : (
                paginatedData.map((rotation) => (
                  <tr
                    key={`${rotation.siteId}-${rotation.specialty}`}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="font-medium text-blue-600 hover:text-blue-800">
                        {rotation.hospitalName}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {rotation.city}, {rotation.state}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-gray-900">{rotation.specialty}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900">
                          {rotation.avgHours}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="font-medium text-gray-900">
                          {rotation.averageRating.toFixed(1)}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white px-6 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Showing{" "}
            {Math.min(
              (currentPage - 1) * itemsPerPage + 1,
              filteredData.length
            )}{" "}
            to {Math.min(currentPage * itemsPerPage, filteredData.length)} of{" "}
            {filteredData.length} results
          </div>
          <div className="flex space-x-1">
            {Array.from(
              { length: Math.ceil(filteredData.length / itemsPerPage) },
              (_, i) => i + 1
            ).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 text-sm rounded ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RotationSearchTable;
