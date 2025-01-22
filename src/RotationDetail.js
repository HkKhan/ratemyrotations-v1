import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Star, Clock, Calendar, Users, Award, AlertCircle } from "lucide-react";

const RotationDetail = () => {
  const { siteId } = useParams();
  const [site, setSite] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSiteDetails = async () => {
      try {
        const response = await fetch(`/api/rotation/${siteId}`);
        const data = await response.json();
        setSite(data);
      } catch (error) {
        console.error("Error fetching site details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSiteDetails();
  }, [siteId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h1 className="text-3xl font-bold mb-2">{site.hospitalName}</h1>
        <div className="flex items-center text-gray-600 mb-4">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
            {site.specialty}
          </span>
          <span className="mx-2">•</span>
          <span>{site.location}</span>
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center">
            <Star className="text-yellow-400 fill-current" size={24} />
            <span className="ml-1 text-2xl font-bold">
              {site.averageRating.toFixed(1)}
            </span>
          </div>
          <div className="text-gray-600">
            <span className="font-semibold">{site.totalReviews}</span> reviews
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="space-y-6">
        {site.reviews.map((review) => (
          <div
            key={review.reviewId}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <div className="bg-blue-100 rounded-full p-2">
                  <Users className="text-blue-600" size={20} />
                </div>
                <div className="ml-3">
                  <div className="text-sm text-gray-600">
                    {review.startDate}
                  </div>
                  <div className="text-sm text-gray-600">
                    {review.lengthWeeks} weeks
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <Star className="text-yellow-400 fill-current" size={20} />
                <span className="ml-1 font-bold">{review.rating}</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-4">
              <div>
                <h3 className="flex items-center text-green-600 font-semibold mb-2">
                  <Award size={16} className="mr-1" /> Pros
                </h3>
                <p className="text-gray-600">{review.pros}</p>
              </div>
              <div>
                <h3 className="flex items-center text-red-600 font-semibold mb-2">
                  <AlertCircle size={16} className="mr-1" /> Cons
                </h3>
                <p className="text-gray-600">{review.cons}</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Teaching Quality</div>
                  <div className="font-semibold">{review.teaching}/5</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Hours per Day</div>
                  <div className="font-semibold">{review.avgHours}</div>
                </div>
                {review.teamMembers && (
                  <div className="col-span-2">
                    <div className="text-sm text-gray-500">Team Members</div>
                    <div className="font-semibold">{review.teamMembers}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RotationDetail;
