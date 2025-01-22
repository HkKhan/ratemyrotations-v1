import React, { useState } from "react";
import { Send, HelpCircle } from "lucide-react";
import { submitRotationReview } from "./api/rotationApi";

const RotationForm = () => {
  const [formData, setFormData] = useState({
    hospitalName: "",
    city: "",
    state: "",
    specialty: "",
    startDate: "",
    lengthWeeks: "",
    teamMembers: "",
    review: {
      rating: 0,
      pros: "",
      cons: "",
      avgHours: "",
      teaching: 0,
      supervision: 0,
    },
  });

  const [showProsTip, setShowProsTip] = useState(false);
  const [showConsTip, setShowConsTip] = useState(false);

  // Comprehensive list of medical specialties
  const specialties = [
    // Core Specialties
    "Internal Medicine",
    "Surgery (General)",
    "Pediatrics",
    "Emergency Medicine",
    "Family Medicine",
    "Obstetrics & Gynecology",
    "Psychiatry",
    // Surgical Subspecialties
    "Orthopedic Surgery",
    "Neurosurgery",
    "Plastic Surgery",
    "Otolaryngology (ENT)",
    "Urology",
    "Vascular Surgery",
    "Thoracic Surgery",
    "Pediatric Surgery",
    // Medicine Subspecialties
    "Cardiology",
    "Gastroenterology",
    "Pulmonology",
    "Nephrology",
    "Endocrinology",
    "Hematology/Oncology",
    "Rheumatology",
    "Infectious Disease",
    "Critical Care",
    // Other Specialties
    "Anesthesiology",
    "Radiology (Diagnostic)",
    "Interventional Radiology",
    "Neurology",
    "Pathology",
    "Physical Medicine & Rehabilitation",
    "Dermatology",
    "Ophthalmology",
    // Subspecialties
    "Transplant Surgery",
    "Pediatric Cardiology",
    "Neonatology",
    "Pain Medicine",
    "Sleep Medicine",
    "Palliative Care",
    "Sports Medicine",
  ].sort();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitRotationReview(formData);
      alert("Rotation site submitted successfully!");
      setFormData({
        hospitalName: "",
        city: "",
        state: "",
        specialty: "",
        startDate: "",
        lengthWeeks: "",
        teamMembers: "",
        review: {
          rating: 0,
          pros: "",
          cons: "",
          avgHours: "",
          teaching: 0,
          supervision: 0,
        },
      });
    } catch (error) {
      console.error("Error submitting rotation:", error);
      alert("Error submitting rotation. Please try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Add a Rotation</h1>
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
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">City</label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-lg border"
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">State</label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-lg border"
              value={formData.state}
              onChange={(e) =>
                setFormData({ ...formData, state: e.target.value })
              }
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Specialty</label>
          <input
            type="text"
            list="specialties"
            className="w-full px-4 py-2 rounded-lg border"
            value={formData.specialty}
            onChange={(e) =>
              setFormData({ ...formData, specialty: e.target.value })
            }
            placeholder="Type to search specialties..."
            required
          />
          <datalist id="specialties">
            {specialties.map((specialty) => (
              <option key={specialty} value={specialty} />
            ))}
          </datalist>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <input
              type="month"
              className="w-full px-4 py-2 rounded-lg border"
              value={formData.startDate}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Length (weeks)
            </label>
            <input
              type="number"
              min="1"
              max="52"
              className="w-full px-4 py-2 rounded-lg border"
              value={formData.lengthWeeks}
              onChange={(e) =>
                setFormData({ ...formData, lengthWeeks: e.target.value })
              }
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Team Members (Optional)
            <span className="text-gray-500 text-xs ml-2">
              Residents, attendings, or teams you worked with most
            </span>
          </label>
          <textarea
            className="w-full px-4 py-2 rounded-lg border"
            rows="2"
            value={formData.teamMembers}
            onChange={(e) =>
              setFormData({ ...formData, teamMembers: e.target.value })
            }
            placeholder="Dr. Smith (attending), Blue team, etc."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Overall Rating
          </label>
          <div className="flex gap-2 justify-center">
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
              max="24"
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

        <div className="relative">
          <label className="block text-sm font-medium mb-1 flex items-center">
            Pros
            <HelpCircle
              size={16}
              className="ml-2 text-gray-400 cursor-help"
              onMouseEnter={() => setShowProsTip(true)}
              onMouseLeave={() => setShowProsTip(false)}
            />
          </label>
          {showProsTip && (
            <div className="absolute z-10 bg-white border rounded-lg p-4 shadow-lg w-80">
              <p className="text-sm text-gray-600">Consider including:</p>
              <ul className="text-sm text-gray-600 list-disc ml-4 mt-2">
                <li>
                  Grading fairness (e.g., "Fair grading - honors achievable with
                  hard work")
                </li>
                <li>Schedule details (e.g., "Typical start time 7AM")</li>
                <li>EMR system and efficiency</li>
                <li>Teaching quality and frequency</li>
                <li>Procedure opportunities</li>
                <li>Team dynamics and support</li>
              </ul>
            </div>
          )}
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

        <div className="relative">
          <label className="block text-sm font-medium mb-1 flex items-center">
            Cons
            <HelpCircle
              size={16}
              className="ml-2 text-gray-400 cursor-help"
              onMouseEnter={() => setShowConsTip(true)}
              onMouseLeave={() => setShowConsTip(false)}
            />
          </label>
          {showConsTip && (
            <div className="absolute z-10 bg-white border rounded-lg p-4 shadow-lg w-80">
              <p className="text-sm text-gray-600">Consider including:</p>
              <ul className="text-sm text-gray-600 list-disc ml-4 mt-2">
                <li>Grading concerns (e.g., "Very few honors given")</li>
                <li>Schedule challenges (e.g., "Inconsistent hours")</li>
                <li>EMR/technical limitations</li>
                <li>Supervision issues</li>
                <li>Learning opportunity limitations</li>
                <li>Logistical challenges</li>
              </ul>
            </div>
          )}
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
          Submit Rotation Review
        </button>
      </form>
    </div>
  );
};

export default RotationForm;
