import React, { useState } from "react";
import { Send } from "lucide-react";

const RotationForm = () => {
  const [formData, setFormData] = useState({
    hospitalName: "",
    specialty: "",
    location: "",
    review: {
      rating: 0,
      pros: "",
      cons: "",
      avgHours: "",
      teaching: 0,
      supervision: 0,
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/rotations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert("Rotation site submitted successfully!");
        setFormData({
          hospitalName: "",
          specialty: "",
          location: "",
          review: {
            rating: 0,
            pros: "",
            cons: "",
            avgHours: "",
            teaching: 0,
            supervision: 0,
          },
        });
      }
    } catch (error) {
      console.error("Error submitting rotation:", error);
      alert("Error submitting rotation. Please try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Add a Rotation Site</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">
            Hospital Name
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 rounded-lg border"
            value={formData.hospitalName}
            onChange={(e) =>
              setFormData({ ...formData, hospitalName: e.target.value })
            }
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Specialty</label>
          <select
            className="w-full px-4 py-2 rounded-lg border"
            value={formData.specialty}
            onChange={(e) =>
              setFormData({ ...formData, specialty: e.target.value })
            }
            required
          >
            <option value="">Select Specialty</option>
            <option value="Internal Medicine">Internal Medicine</option>
            <option value="Surgery">Surgery</option>
            <option value="Pediatrics">Pediatrics</option>
            <option value="OB/GYN">OB/GYN</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <input
            type="text"
            className="w-full px-4 py-2 rounded-lg border"
            placeholder="City, State"
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Overall Rating
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                type="button"
                className={`w-10 h-10 rounded-full ${
                  formData.review.rating >= num
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
                onClick={() =>
                  setFormData({
                    ...formData,
                    review: { ...formData.review, rating: num },
                  })
                }
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Teaching Quality
            </label>
            <input
              type="number"
              min="1"
              max="5"
              className="w-full px-4 py-2 rounded-lg border"
              value={formData.review.teaching}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  review: {
                    ...formData.review,
                    teaching: parseInt(e.target.value),
                  },
                })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Average Hours/Day
            </label>
            <input
              type="number"
              className="w-full px-4 py-2 rounded-lg border"
              value={formData.review.avgHours}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  review: { ...formData.review, avgHours: e.target.value },
                })
              }
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Pros</label>
          <textarea
            className="w-full px-4 py-2 rounded-lg border"
            rows="3"
            value={formData.review.pros}
            onChange={(e) =>
              setFormData({
                ...formData,
                review: { ...formData.review, pros: e.target.value },
              })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Cons</label>
          <textarea
            className="w-full px-4 py-2 rounded-lg border"
            rows="3"
            value={formData.review.cons}
            onChange={(e) =>
              setFormData({
                ...formData,
                review: { ...formData.review, cons: e.target.value },
              })
            }
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 flex items-center justify-center gap-2"
        >
          <Send size={20} />
          Submit Rotation
        </button>
      </form>
    </div>
  );
};

export default RotationForm;
