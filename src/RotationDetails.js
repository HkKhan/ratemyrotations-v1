import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Changed from useSearchParams
import {
  Star,
  MapPin,
  UserPen,
  Calendar,
  BookOpen,
  ThumbsDown,
  ThumbsUp,
  Users,
} from "lucide-react";
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
                {Number(site.averageRating)?.toFixed(1) || "N/A"}
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
                  className="mb-5 pb-5 border-b last:border-b-0 bg-gray-50 rounded-lg p-4"
                >
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center">
                      <UserPen size={16} className="mr-2 text-gray-500" />
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

                  {/* Review Text */}
                  <p className="text-gray-600 text-sm mb-4">
                    {/* {review.reviewText} */}
                  </p>

                  {/* Pros Section */}
                  {review.pros && review.pros.length > 0 && (
                    <div className="mb-3">
                      <div className="flex items-center text-green-600 mb-2">
                        <ThumbsUp size={16} className="mr-2" />
                        <h4 className="font-semibold">Pros</h4>
                      </div>
                      <ul className="list-disc list-inside text-sm text-gray-700">
                        {/* {review.pros.map((pro, index) => (
                          <li key={index} className="mb-1">
                            {pro}
                          </li>
                        ))} */}
                        {review.pros}
                      </ul>
                    </div>
                  )}

                  {/* Cons Section */}
                  {review.cons && review.cons.length > 0 && (
                    <div className="mb-3">
                      <div className="flex items-center text-red-600 mb-2">
                        <ThumbsDown size={16} className="mr-2" />
                        <h4 className="font-semibold">Cons</h4>
                      </div>
                      <ul className="list-disc list-inside text-sm text-gray-700">
                        {/* {review.cons.map((con, index) => (
                          <li key={index} className="mb-1">
                            {con}
                          </li>
                        ))} */}
                        {review.cons}
                      </ul>
                    </div>
                  )}

                  {/* Team Members Section */}
                  {review.teamMembers && review.teamMembers.length > 0 && (
                    <div className="mt-4">
                      <div className="flex items-center text-blue-600 mb-2">
                        <Users size={16} className="mr-2" />
                        <h4 className="font-semibold">
                          Team Members Mentioned
                        </h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          {review.teamMembers}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center text-gray-500 text-xs mt-4">
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
