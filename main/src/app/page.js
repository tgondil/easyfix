"use client";
import React, { useState, useEffect } from "react";
import { Loader2, X, Edit2, CheckCircle } from "lucide-react";

const residenceHalls = [
  "Akron Hall",
  "Hilltop Apartments",
  "Shreve Hall",
  "Windsor",
  "Wiley Hall",
];

// Generate numbers 1-20 for appliance numbers
const applianceNumbers = Array.from({ length: 20 }, (_, i) => i + 1);

export default function Home() {
  const [name, setName] = useState("");
  const [appliance, setAppliance] = useState("washer");
  const [applianceNumber, setApplianceNumber] = useState("");
  const [residenceHall, setResidenceHall] = useState("");
  const [issue, setIssue] = useState("");
  const [reports, setReports] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingReport, setEditingReport] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      const response = await fetch("/api/reports");
      const data = await response.json();
      setReports(data);
    };
    fetchReports();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const currentTime = new Date().toISOString();

    const reportData = {
      name,
      appliance,
      applianceNumber,
      residenceHall,
      issue,
      timestamp: currentTime,
    };

    const response = await fetch("/api/reports", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reportData),
    });

    if (response.ok) {
      const data = await response.json();
      setReports((prevReports) => [...prevReports, data]);
      resetForm();
    }
    setIsSubmitting(false);
  };

  const handleUpdate = async (reportId) => {
    setIsSubmitting(true); // Optionally, you can set this for a loading state

    const updatedReportData = {
      _id: reportId,
      name: editingReport.name,
      appliance: editingReport.appliance,
      applianceNumber: editingReport.applianceNumber,
      residenceHall: editingReport.residenceHall,
      issue: editingReport.issue,
      timestamp: editingReport.timestamp, // Keep the original timestamp or update if needed
    };

    const response = await fetch(`/api/reports`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedReportData),
    });

    if (response.ok) {
      const updatedReport = await response.json();
      setReports((prevReports) =>
        prevReports.map((r) => (r._id === reportId ? updatedReport : r))
      );
      setEditingReport(null); // Exit edit mode
    }
    setIsSubmitting(false); // Reset loading state
  };

  const handleDelete = async (reportId) => {
    const response = await fetch(`/api/reports?id=${reportId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setReports(reports.filter((r) => r._id !== reportId));
    }
  };

  const resetForm = () => {
    setName("");
    setAppliance("washer");
    setApplianceNumber("");
    setResidenceHall("");
    setIssue("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header Section */}
        <div className="mb-16 text-center space-y-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 blur-xl opacity-20"></div>
            <h1 className="relative text-7xl font-bold tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
                Maintenance Portal
              </span>
            </h1>
          </div>
          <p className="text-lg text-slate-400">
            Report and track washer/dryer maintenance issues in real-time
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form Section */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 backdrop-blur-sm shadow-xl">
            <h2 className="text-2xl font-semibold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Submit New Report
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-slate-400">Appliance</label>
                  <select
                    value={appliance}
                    onChange={(e) => setAppliance(e.target.value)}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    required
                  >
                    <option value="washer">Washer</option>
                    <option value="dryer">Dryer</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-slate-400">Number</label>
                  <select
                    value={applianceNumber}
                    onChange={(e) => setApplianceNumber(e.target.value)}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    required
                  >
                    <option value="">Select #</option>
                    {applianceNumbers.map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-slate-400">Location</label>
                  <select
                    value={residenceHall}
                    onChange={(e) => setResidenceHall(e.target.value)}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    required
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
                <label className="text-sm text-slate-400">Issue Description</label>
                <textarea
                  value={issue}
                  onChange={(e) => setIssue(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 h-24"
                  placeholder="Describe the issue..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-4 rounded-lg font-medium transition duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 shadow-lg"
              >
                {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
                <span>{isSubmitting ? "Submitting..." : "Submit Report"}</span>
              </button>
            </form>
          </div>

          {/* Reports Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Active Reports
            </h2>
            <div className="space-y-4 max-h-[700px] overflow-y-auto pr-4 custom-scrollbar">
              {reports.length > 0 ? (
                reports.map((report) => (
                  <div
                    key={report._id}
                    className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:bg-slate-800/70 transition duration-200 backdrop-blur-sm shadow-lg"
                  >
                    {editingReport && editingReport._id === report._id ? (
                      // Edit Mode
                      <div className="space-y-4">
                        <textarea
                          value={editingReport.issue}
                          onChange={(e) =>
                            setEditingReport({
                              ...editingReport,
                              issue: e.target.value,
                            })
                          }
                          className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                        />
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => setEditingReport(null)}
                            className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition duration-200"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleUpdate(report._id)}
                            className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 transition duration-200"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      // View Mode
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-semibold text-lg">{report.name}</h3>
                            <p className="text-slate-400">
                              {report.appliance.charAt(0).toUpperCase() +
                                report.appliance.slice(1)}{" "}
                              #{report.applianceNumber} • {report.residenceHall}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setEditingReport(report)}
                              className="p-2 rounded-lg hover:bg-slate-700/50 transition duration-200"
                            >
                              <Edit2 className="w-4 h-4 text-blue-400" />
                            </button>
                            <button
                              onClick={() => handleDelete(report._id)}
                              className="p-2 rounded-lg hover:bg-slate-700/50 transition duration-200"
                            >
                              <CheckCircle className="w-4 h-4 text-green-400" />
                            </button>
                          </div>
                        </div>
                        <p className="text-slate-300 mb-3">{report.issue}</p>
                        <span className="text-sm text-slate-500">
                          {new Date(report.timestamp).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-slate-400 bg-slate-800/30 rounded-xl border border-slate-700/50">
                  No active reports
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
