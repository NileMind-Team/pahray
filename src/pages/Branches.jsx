import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaClock,
  FaPhone,
  FaWhatsapp,
  FaEnvelope,
  FaCity,
  FaBuilding,
  FaSearch,
  FaCheckCircle,
  FaTimesCircle,
  FaEye,
  FaMap,
  FaTimes,
} from "react-icons/fa";
import axiosInstance from "../api/axiosInstance";
import Swal from "sweetalert2";

const Branches = () => {
  const [branches, setBranches] = useState([]);
  const [filteredBranches, setFilteredBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [showMapModal, setShowMapModal] = useState(false);
  const [selectedBranchForMap, setSelectedBranchForMap] = useState(null);

  useEffect(() => {
    const fetchBranchesAndCities = async () => {
      try {
        const [branchesRes] = await Promise.all([
          axiosInstance.get("/api/Branches/GetAll"),
        ]);

        if (branchesRes.status === 200) {
          setBranches(branchesRes.data);
          setFilteredBranches(branchesRes.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        Swal.fire({
          icon: "error",
          title: "خطأ",
          text: "فشل في تحميل بيانات الفروع",
          timer: 2000,
          showConfirmButton: false,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBranchesAndCities();
  }, []);

  useEffect(() => {
    let filtered = branches;

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (branch) =>
          branch.name?.toLowerCase().includes(searchLower) ||
          branch.address?.toLowerCase().includes(searchLower) ||
          branch.city?.name?.toLowerCase().includes(searchLower)
      );
    }

    setFilteredBranches(filtered);
  }, [searchTerm, branches]);

  const convertToArabicNumbers = (number) => {
    const arabicNumbers = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
    return number.toString().replace(/\d/g, (digit) => arabicNumbers[digit]);
  };

  const formatTimeTo12HourArabic = (timeString) => {
    if (!timeString) return "";

    try {
      const [hours, minutes] = timeString.split(":");
      let hour = parseInt(hours);
      const minute = minutes || "00";

      const period = hour >= 12 ? "م" : "ص";
      hour = hour % 12 || 12;

      const arabicHour = convertToArabicNumbers(hour);
      const arabicMinute = convertToArabicNumbers(minute);

      return `${arabicHour}:${arabicMinute} ${period}`;
    } catch (error) {
      console.error("Error formatting time:", error);
      return timeString;
    }
  };

  const getStatusText = (status) => {
    return status === "Open" ? "مفتوح الآن" : "مغلق حالياً";
  };

  const getStatusColor = (status, isActive) => {
    if (!isActive) return "bg-red-500 text-white";
    return status === "Open"
      ? "bg-green-500 text-white"
      : "bg-yellow-500 text-white";
  };

  const getStatusIcon = (status, isActive) => {
    if (!isActive) return <FaTimesCircle className="text-red-500" />;
    return status === "Open" ? (
      <FaCheckCircle className="text-green-500" />
    ) : (
      <FaTimesCircle className="text-yellow-500" />
    );
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    return formatTimeTo12HourArabic(timeString.substring(0, 5));
  };

  const getPhoneTypeArabic = (type) => {
    switch (type) {
      case "Mobile":
        return "موبايل";
      case "Landline":
        return "أرضي";
      case "Other":
        return "آخر";
      default:
        return type;
    }
  };

  const handleViewOnMap = (branch) => {
    setSelectedBranchForMap(branch);
    setShowMapModal(true);
  };

  const closeMapModal = () => {
    setShowMapModal(false);
    setSelectedBranchForMap(null);
  };

  const toggleBranchDetails = (branch) => {
    setSelectedBranch(selectedBranch?.id === branch.id ? null : branch);
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-[#fff8e7] to-[#ffe5b4] dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 px-4"
        dir="rtl"
      >
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#E41E26]"></div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-white via-[#fff8e7] to-[#ffe5b4] dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 px-3 sm:px-4 md:px-6 py-3 sm:py-6 relative font-sans overflow-hidden transition-colors duration-300"
      dir="rtl"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-10 sm:-left-20 -top-10 sm:-top-20 w-40 h-40 sm:w-60 sm:h-60 md:w-80 md:h-80 bg-gradient-to-r from-[#E41E26]/10 to-[#FDB913]/10 rounded-full blur-2xl sm:blur-3xl animate-pulse"></div>
        <div className="absolute -right-10 sm:-right-20 -bottom-10 sm:-bottom-20 w-40 h-40 sm:w-60 sm:h-60 md:w-80 md:h-80 bg-gradient-to-r from-[#FDB913]/10 to-[#E41E26]/10 rounded-full blur-2xl sm:blur-3xl animate-pulse"></div>
      </div>

      {/* Map Modal */}
      <AnimatePresence>
        {showMapModal && selectedBranchForMap && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl w-full max-w-4xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-3">
                  <FaMap className="text-[#E41E26] text-xl" />
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                    موقع {selectedBranchForMap.name}
                  </h3>
                </div>
                <button
                  onClick={closeMapModal}
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-300 transition-colors"
                >
                  <FaTimes size={16} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                <div className="p-4">
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {selectedBranchForMap.address}
                    </p>
                  </div>

                  {selectedBranchForMap.locationUrl ? (
                    <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
                      <iframe
                        src={selectedBranchForMap.locationUrl}
                        width="100%"
                        height="400"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title={`خريطة فرع ${selectedBranchForMap.name}`}
                        className="w-full"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-64 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <div className="text-center">
                        <FaMap className="text-gray-400 text-4xl mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">
                          رابط الخريطة غير متوفر لهذا الفرع
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="max-w-6xl mx-auto bg-white/90 backdrop-blur-xl shadow-xl sm:shadow-2xl rounded-2xl sm:rounded-3xl border border-white/50 relative overflow-hidden dark:bg-gray-800/90 dark:border-gray-700/50"
      >
        {/* Header */}
        <div className="relative h-36 sm:h-40 md:h-44 lg:h-52 bg-gradient-to-r from-[#E41E26] to-[#FDB913] overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute -top-4 sm:-top-6 -right-4 sm:-right-6 w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 bg-white/10 rounded-full"></div>
          <div className="absolute -bottom-4 sm:-bottom-6 -left-4 sm:-left-6 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-32 lg:h-32 bg-white/10 rounded-full"></div>

          <div className="relative z-10 h-full flex flex-col justify-end items-center text-center px-4 sm:px-6 pb-6 sm:pb-8 md:pb-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-3"
            >
              <div className="p-2 sm:p-3 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl">
                <FaBuilding className="text-white text-xl sm:text-2xl md:text-3xl" />
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white">
                فروعنا
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-white/80 text-xs sm:text-sm md:text-base"
            >
              اكتشف فروع Chicken One القريبة منك وتعرّف على تفاصيل كل فرع
            </motion.p>
          </div>
        </div>

        {/* Content */}
        <div className="relative px-3 sm:px-4 md:px-6 lg:px-8 pb-4 sm:pb-6 md:pb-8">
          {/* Filters Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8 sm:mb-12 mt-6 sm:mt-8"
          >
            {/* Search Input Only */}
            <div className="max-w-2xl mx-auto">
              <div className="relative group">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#E41E26] text-sm transition-all duration-300 group-focus-within:scale-110" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white rounded-xl sm:rounded-2xl pl-10 pr-4 py-3 sm:py-4 outline-none focus:ring-2 focus:ring-[#E41E26] focus:border-transparent transition-all duration-200 text-sm sm:text-base shadow-lg"
                  placeholder="ابحث باسم الفرع أو العنوان أو المدينة..."
                />
              </div>
            </div>

            {/* Results Count */}
            <div className="text-center mt-4">
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                عرض{" "}
                <span className="font-bold text-[#E41E26]">
                  {filteredBranches.length}
                </span>{" "}
                من أصل{" "}
                <span className="font-bold text-[#E41E26]">
                  {branches.length}
                </span>{" "}
                فرع
              </p>
            </div>
          </motion.div>

          {/* Branches List */}
          {filteredBranches.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:bg-gray-700/80 dark:border-gray-600/50 my-6"
            >
              <div className="max-w-md mx-auto">
                <div className="bg-gradient-to-r from-[#E41E26] to-[#FDB913] w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaBuilding className="text-white text-3xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                  لا توجد فروع
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
                  {searchTerm
                    ? "لم نتمكن من العثور على فروع تطابق بحثك"
                    : "لا توجد فروع متاحة حالياً"}
                </p>
                {searchTerm && (
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSearchTerm("");
                    }}
                    className="bg-gradient-to-r from-[#E41E26] to-[#FDB913] text-white px-8 py-4 rounded-2xl font-bold hover:shadow-2xl transition-all duration-300 text-lg"
                  >
                    عرض جميع الفروع
                  </motion.button>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div layout className="space-y-4 sm:space-y-6">
              {filteredBranches.map((branch, index) => (
                <motion.div
                  key={branch.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/80 backdrop-blur-sm dark:bg-gray-700/80 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 dark:border-gray-600/50 overflow-hidden group"
                >
                  {/* Branch Header */}
                  <div
                    className="p-4 sm:p-6 cursor-pointer"
                    onClick={() => toggleBranchDetails(branch)}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      {/* Branch Info */}
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-gradient-to-r from-[#E41E26] to-[#FDB913] rounded-xl text-white">
                              <FaBuilding className="text-lg" />
                            </div>
                            <div className="flex-1">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                                  {branch.name}
                                </h3>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <div className="flex items-center gap-1">
                                    {getStatusIcon(
                                      branch.status,
                                      branch.isActive
                                    )}
                                    <div
                                      className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                        branch.status,
                                        branch.isActive
                                      )}`}
                                    >
                                      {branch.isActive ? "نشط" : "غير نشط"}
                                    </div>
                                  </div>
                                  <div
                                    className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                      branch.status,
                                      branch.isActive
                                    )}`}
                                  >
                                    {getStatusText(branch.status)}
                                  </div>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                  <FaCity className="text-[#E41E26]" />
                                  <span className="font-medium">
                                    {branch.city?.name}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                  <FaClock className="text-[#E41E26]" />
                                  <span className="font-medium">
                                    {formatTime(branch.openingTime)} -{" "}
                                    {formatTime(branch.closingTime)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Toggle Button - Fixed Icon */}
                      <div className="flex-shrink-0">
                        <div
                          className={`p-2 rounded-lg transition-colors duration-300 ${
                            selectedBranch?.id === branch.id
                              ? "bg-[#E41E26] text-white"
                              : "bg-gray-100 dark:bg-gray-600 text-[#E41E26]"
                          }`}
                        >
                          <FaEye className="text-lg" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expandable Details */}
                  <AnimatePresence>
                    {selectedBranch?.id === branch.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-gray-200 dark:border-gray-600"
                      >
                        <div className="p-4 sm:p-6">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Contact Information */}
                            <div className="space-y-4">
                              <h4 className="text-lg font-bold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-600 pb-2">
                                معلومات التواصل
                              </h4>

                              {/* Address */}
                              <div className="flex items-start gap-3">
                                <FaMapMarkerAlt className="text-[#E41E26] mt-1 flex-shrink-0" />
                                <div>
                                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
                                    العنوان
                                  </p>
                                  <p className="text-gray-800 dark:text-gray-200 font-medium">
                                    {branch.address}
                                  </p>
                                </div>
                              </div>

                              {/* Email */}
                              {branch.email && (
                                <div className="flex items-start gap-3">
                                  <FaEnvelope className="text-[#E41E26] mt-1 flex-shrink-0" />
                                  <div>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
                                      البريد الإلكتروني
                                    </p>
                                    <p className="text-gray-800 dark:text-gray-200 font-medium">
                                      {branch.email}
                                    </p>
                                  </div>
                                </div>
                              )}

                              {/* Phone Numbers */}
                              {branch.phoneNumbers &&
                                branch.phoneNumbers.length > 0 && (
                                  <div className="flex items-start gap-3">
                                    <FaPhone className="text-[#E41E26] mt-1 flex-shrink-0" />
                                    <div className="flex-1">
                                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                                        أرقام الهاتف
                                      </p>
                                      <div className="space-y-2">
                                        {branch.phoneNumbers.map(
                                          (phone, idx) => (
                                            <div
                                              key={idx}
                                              className="flex items-center justify-between bg-gray-50 dark:bg-gray-600 rounded-lg px-3 py-2"
                                            >
                                              <div className="flex items-center gap-3">
                                                <span className="text-gray-800 dark:text-gray-200 font-medium">
                                                  {phone.phone}
                                                </span>
                                                <span className="text-gray-500 dark:text-gray-400 text-xs bg-gray-200 dark:bg-gray-500 px-2 py-1 rounded">
                                                  {getPhoneTypeArabic(
                                                    phone.type
                                                  )}
                                                </span>
                                              </div>
                                              {phone.isWhatsapp && (
                                                <FaWhatsapp className="text-green-500 text-lg" />
                                              )}
                                            </div>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                )}
                            </div>

                            {/* Map & Actions */}
                            <div className="space-y-4">
                              <h4 className="text-lg font-bold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-600 pb-2">
                                الموقع والخدمات
                              </h4>

                              {/* Status Details */}
                              <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-600 dark:to-gray-700 rounded-xl p-4">
                                <div className="grid grid-cols-2 gap-4 text-center">
                                  <div className="text-center">
                                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
                                      حالة الفرع
                                    </p>
                                    <div className="flex items-center justify-center gap-1">
                                      {getStatusIcon(
                                        branch.status,
                                        branch.isActive
                                      )}
                                      <div
                                        className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                          branch.status,
                                          branch.isActive
                                        )}`}
                                      >
                                        {branch.isActive ? "نشط" : "غير نشط"}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-center">
                                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
                                      ساعات العمل
                                    </p>
                                    <p className="text-gray-800 dark:text-gray-200 font-bold">
                                      {formatTime(branch.openingTime)} -{" "}
                                      {formatTime(branch.closingTime)}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Action Button */}
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleViewOnMap(branch)}
                                className="w-full py-3 bg-gradient-to-r from-[#E41E26] to-[#FDB913] text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                              >
                                <FaMap className="text-sm" />
                                <span>عرض الخريطة</span>
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Branches;
