import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Changed from useSearchParams
import { Star, MapPin, User, Calendar, BookOpen } from "lucide-react";
import { Card } from "./components/ui/card";

const RotationDetails = () => {
  const { siteId } = useParams(); // Get siteId from URL path
  const [site, setSite] = useState(null); // Changed from array to single object
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSiteDetails = async () => {
      try {
        if (!siteId) {
          throw new Error("No site ID provided");
        }

        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/rotation/${siteId}`,
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

        if (!data.siteId) {
          throw new Error("Invalid site data structure");
        }

        setSite(data);
        setLoading(false);
      } catch (error) {
        console.error("Fetch error:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchSiteDetails();
  }, [siteId]); // Only depend on siteId

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600 text-center mt-10">Error: {error}</div>;
  }

  if (!site) {
    return <div className="text-center mt-10">Site not found</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        {site.hospitalName} {site.specialty && `- ${site.specialty}`}
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-1 gap-6">
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-semibold text-blue-600">
              {site.hospitalName}
            </h2>
            <div className="flex items-center">
              <Star className="text-yellow-400 fill-current mr-1" size={20} />
              <span className="font-semibold">
                {site.averageRating?.toFixed(1) || "N/A"}
              </span>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center text-gray-600">
              <MapPin size={16} className="mr-2" />
              {site.city}, {site.state}
            </div>
            <div className="flex items-center text-gray-600">
              <BookOpen size={16} className="mr-2" />
              {site.specialty}
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">
              Reviews ({site.totalReviews || 0})
            </h3>
            {site.reviews?.length > 0 ? (
              site.reviews.map((review) => (
                <div
                  key={review.reviewId}
                  className="mb-3 pb-3 border-b last:border-b-0"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <User size={16} className="mr-2 text-gray-500" />
                      <span className="font-medium text-gray-700">
                        {review.anonymized ? "Anonymous" : review.authorName}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Star
                        className="text-yellow-400 fill-current mr-1"
                        size={16}
                      />
                      <span>{review.rating}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">{review.reviewText}</p>
                  <div className="flex items-center text-gray-500 text-xs mt-2">
                    <Calendar size={12} className="mr-2" />
                    {new Date(review.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-500">No reviews yet</div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RotationDetails;
