"use client";
import { useState } from "react";
import { PlusCircle, Trash2, CheckCircle, Loader2 } from "lucide-react";

const BatchUpload = ({ residenceHalls, onBatchComplete }) => {
  const [reports, setReports] = useState([]);
  const [currentReport, setCurrentReport] = useState({
    name: "",
    appliance: "washer",
    applianceNumber: "",
    residenceHall: "",
    issue: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentReport((prev) => ({
      ...prev,
      [name]: name === "applianceNumber" ? Number(value) : value,
    }));
  };

  const addToQueue = (e) => {
    e.preventDefault();
    if (
      !currentReport.name ||
      !currentReport.applianceNumber ||
      !currentReport.residenceHall ||
      !currentReport.issue
    ) {
      alert("Please fill out all fields");
      return;
    }

    setReports((prev) => [...prev, { ...currentReport }]);
    setCurrentReport({
      name: "",
      appliance: "washer",
      applianceNumber: "",
      residenceHall: "",
      issue: "",
    });
  };

  const removeFromQueue = (index) => {
    setReports((prev) => prev.filter((_, i) => i !== index));
  };

  const submitBatch = async () => {
    if (reports.length === 0) {
      alert("Please add at least one report to the queue");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/reports/prepared", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reports),
      });

      if (response.ok) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          setReports([]);
          if (onBatchComplete) onBatchComplete();
        }, 2000);
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || "Failed to submit batch"}`);
      }
    } catch (error) {
      console.error("Error submitting batch:", error);
      alert("An error occurred while submitting the batch");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-8 backdrop-blur-sm shadow-xl transition-all duration-300 relative overflow-hidden">
      {/* Background glow effect */}
      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-600/20 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full pointer-events-none"></div>
      
      {/* Success overlay */}
      {showSuccess && (
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="text-center space-y-4 animate-scale-in">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <p className="text-xl font-medium text-white">Transaction Complete!</p>
            <p className="text-slate-300">{reports.length} reports successfully submitted</p>
          </div>
        </div>
      )}

      <h2 className="text-2xl font-semibold mb-8 bg-gradient-to-r from-violet-400 to-indigo-500 bg-clip-text text-transparent flex items-center gap-2">
        <span className="p-1.5 bg-gradient-to-br from-violet-500/20 to-indigo-500/20 rounded-lg">
          <PlusCircle className="w-5 h-5 text-indigo-400" />
        </span>
        Batch Upload 
        <span className="text-base font-normal text-slate-500 ml-1">(Using Transactions)</span>
      </h2>

      <form onSubmit={addToQueue} className="space-y-6 mb-8">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-400">Name</label>
          <input
            type="text"
            name="name"
            value={currentReport.name}
            onChange={handleInputChange}
            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
            placeholder="Enter your name"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Appliance</label>
            <select
              name="appliance"
              value={currentReport.appliance}
              onChange={handleInputChange}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
            >
              <option value="washer">Washer</option>
              <option value="dryer">Dryer</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Number</label>
            <select
              name="applianceNumber"
              value={currentReport.applianceNumber}
              onChange={handleInputChange}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
            >
              <option value="">Select #</option>
              {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Location</label>
            <select
              name="residenceHall"
              value={currentReport.residenceHall}
              onChange={handleInputChange}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
            >
              <option value="">Select Hall</option>
              {residenceHalls.map((hall, index) => (
                <option key={index} value={hall}>
                  {hall}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-400">Issue Description</label>
          <textarea
            name="issue"
            value={currentReport.issue}
            onChange={handleInputChange}
            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 h-24 resize-none"
            placeholder="Describe the issue"
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full py-3 px-6 rounded-lg font-medium text-white bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 transition-all duration-200 transform hover:translate-y-[-2px] active:translate-y-[0px] focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50 shadow-lg shadow-indigo-500/20"
        >
          <div className="flex items-center justify-center gap-2">
            <PlusCircle className="w-5 h-5" />
            <span>Add to Queue</span>
          </div>
        </button>
      </form>

      {reports.length > 0 && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-slate-850/50 rounded-xl border border-slate-700/50 overflow-hidden">
            <div className="px-4 py-3 bg-gradient-to-r from-slate-800 to-slate-800/50 border-b border-slate-700/50 flex items-center justify-between">
              <h3 className="text-lg font-medium text-slate-300 flex items-center gap-2">
                Reports Queue
                <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 text-xs rounded-full">
                  {reports.length}
                </span>
              </h3>
            </div>
            
            <div className="divide-y divide-slate-700/30">
              {reports.length === 0 ? (
                <div className="p-4 text-center text-slate-500">No reports in queue</div>
              ) : (
                <div className="max-h-64 overflow-y-auto">
                  {reports.map((report, index) => (
                    <div
                      key={index}
                      className="p-4 hover:bg-slate-800/50 transition-colors flex justify-between items-center group"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white">{report.name}</span>
                          <span className="px-2 py-0.5 bg-slate-700/50 text-slate-400 text-xs rounded-full">
                            {report.residenceHall}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 flex items-center gap-2">
                          <span className="capitalize">{report.appliance}</span>
                          <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                          <span>Unit #{report.applianceNumber}</span>
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromQueue(index)}
                        className="text-slate-500 hover:text-red-400 p-1.5 rounded-full hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={submitBatch}
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 rounded-lg font-medium text-white bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none transform hover:translate-y-[-2px] active:translate-y-[0px] focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-opacity-50 shadow-lg shadow-violet-500/20"
          >
            <div className="flex items-center justify-center gap-2">
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing Transaction...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Submit Batch</span>
                </>
              )}
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default BatchUpload; 