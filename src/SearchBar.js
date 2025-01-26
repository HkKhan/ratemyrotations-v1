import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Search } from "lucide-react";
import { HospitalNameAutocomplete } from "./HospitalNameAutocomplete";
import { StateAutocomplete } from "./StateAutocomplete";
import { SpecialtyAutocomplete } from "./SpecialtiesAutocomplete";
import { CityAutocomplete } from "./CityAutocomplete";

const SearchBar = () => {
  const [searchType, setSearchType] = useState("specialty");
  const [formData, setFormData] = useState({
    specialty: "",
    hospitalName: "",
    city: "",
    state: "",
  });
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();

    const queryParams = new URLSearchParams();

    switch (searchType) {
      case "specialty":
        if (formData.specialty)
          queryParams.set("specialty", formData.specialty);
        break;
      case "hospitalName":
        if (formData.hospitalName)
          queryParams.set("hospitalName", formData.hospitalName);
        break;
      case "city":
        if (formData.city) queryParams.set("city", formData.city);
        break;
      case "state":
        if (formData.state) queryParams.set("state", formData.state);
        break;
    }

    if (queryParams.toString()) {
      navigate(`/search?${queryParams.toString()}`);
    }
  };

  // Get placeholder text based on search type
  const getPlaceholder = () => {
    switch (searchType) {
      case "specialty":
        return "Search by specialty...";
      case "hospitalName":
        return "Search by hospital...";
      case "city":
        return "Search by city...";
      case "state":
        return "Search by state...";
      default:
        return "Search...";
    }
  };

  // Render the appropriate autocomplete component based on search type
  const renderAutocomplete = () => {
    const commonProps = {
      formData,
      setFormData,
      placeholder: getPlaceholder(),
    };

    switch (searchType) {
      case "specialty":
        return (
          <SpecialtyAutocomplete
            formData={formData}
            setFormData={setFormData}
            placeholder="Search by specialty..."
          />
        );
      case "hospitalName":
        return (
          <HospitalNameAutocomplete
            formData={formData}
            setFormData={setFormData}
            placeholder="Search by hospital..."
          />
        );
      case "city":
        return (
          <CityAutocomplete
            formData={formData}
            setFormData={setFormData}
            placeholder="Search by city..."
          />
        );
      case "state":
        return (
          <StateAutocomplete
            formData={formData}
            setFormData={setFormData}
            placeholder="Search by state..."
          />
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
      <div className="flex items-center">
        {/* Search Type Dropdown */}
        <div className="relative mr-2">
          <select
            value={searchType}
            onChange={(e) => {
              // Reset form data when changing search type
              setFormData({
                specialty: "",
                hospitalName: "",
                city: "",
                state: "",
              });
              setSearchType(e.target.value);
            }}
            className="px-6 py-4 pr-10 rounded-lg text-gray-900 shadow-lg border-0 appearance-none bg-white focus:outline-none transition-all duration-300 outline-none"
          >
            <option value="specialty">Specialty</option>
            <option value="hospitalName">Hospital</option>
            <option value="city">City</option>
            <option value="state">State</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#CE7B91] pointer-events-none" />
        </div>

        {/* Dynamic Autocomplete with Search Button */}
        <div className="relative flex-grow">
          {renderAutocomplete()}
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#CE7B91] p-2 rounded-lg hover:bg-[#B8D3D1] transition-colors h-[calc(100%-8px)] aspect-square flex items-center justify-center"
          >
            <Search className="text-white w-5 h-5" />
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
