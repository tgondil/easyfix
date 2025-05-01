"use client";
import React, { useState, useEffect } from "react";
import { Loader2, X, Edit2, CheckCircle } from "lucide-react";
import BatchUpload from "./components/BatchUpload";

const residenceHalls = [
  "Hilltop Apartments",
  "Shreve Hall",
  "Windsor",
  "Wiley Hall",
];


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
  const [filterAppliance, setFilterAppliance] = useState("");
  const [filterHall, setFilterHall] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredReports, setFilteredReports] = useState([]);
  const [reportStats, setReportStats] = useState(null);

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
    setIsSubmitting(true);

    const updatedReportData = {
      _id: reportId,
      name: editingReport.name,
      appliance: editingReport.appliance,
      applianceNumber: editingReport.applianceNumber,
      residenceHall: editingReport.residenceHall,
      issue: editingReport.issue,
      timestamp: editingReport.timestamp,
    };

    const response = await fetch(`/api/reports`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedReportData),
    });

    if (response.ok) {
      const updatedReport = await response.json();
      setReports((prevReports) =>
        prevReports.map((r) => (r._id === reportId ? updatedReport : r))
      );
      setEditingReport(null);
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (reportId) => {
    const response = await fetch(`/api/reports?id=${reportId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setReports(reports.filter((r) => r._id !== reportId));
    }
  };

  const generateReport = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (startDate) queryParams.append('startDate', startDate);
      if (endDate) queryParams.append('endDate', endDate);
      if (filterAppliance) queryParams.append('appliance', filterAppliance);
      if (filterHall) queryParams.append('residenceHall', filterHall);
      
      const response = await fetch(`/api/reports/prepared?${queryParams}`);
      const data = await response.json();
      
      if (data.reports && data.stats) {
        setFilteredReports(data.reports);
        setReportStats(data.stats);
      }
    } catch (error) {
      console.error("Error generating report:", error);
    }
  };

  useEffect(() => {
    const fetchHalls = async () => {
      try {
        const response = await fetch("/api/reports/prepared?action=getResidenceHalls");
        const data = await response.json();
        
        if (data && Array.isArray(data)) {
          const hallNames = data.map(hall => hall.name);
          if (hallNames.length > 0 && !arraysEqual(hallNames, residenceHalls)) {
            console.log("Using dynamically loaded residence halls");
          }
        }
      } catch (error) {
        console.error("Error fetching residence halls:", error);
      }
    };
    
    // Simple helper to compare arrays
    const arraysEqual = (a, b) => {
      if (a.length !== b.length) return false;
      return a.every((val, idx) => val === b[idx]);
    };
    
    fetchHalls();
  }, []);

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
        <div className="mb-16 text-center space-y-4 pt-8">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-32">
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
                <label className="text-sm text-slate-400">
                  Issue Description
                </label>
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

          {/* Batch Upload Section (Transaction Example) */}
          <BatchUpload 
            residenceHalls={residenceHalls} 
            onBatchComplete={() => {
              // Refresh reports after batch upload
              fetch("/api/reports")
                .then(response => response.json())
                .then(data => {
                  setReports(data);
                })
                .catch(error => console.error("Error fetching reports:", error));
            }} 
          />
        </div>

        {/* Updated Reports Section - Full Width */}
        <div className="mb-16 bg-slate-800/40 border border-slate-700 rounded-xl overflow-hidden backdrop-blur-sm shadow-xl relative">
          {/* Background glow effect */}
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-600/10 blur-[100px] rounded-full pointer-events-none"></div>
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full pointer-events-none"></div>
          
          <div className="p-6 bg-gradient-to-r from-slate-800 to-slate-800/50 border-b border-slate-700/50">
            <h2 className="text-2xl font-semibold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
              </svg>
              Active Reports
              <span className="ml-2 px-2.5 py-1 text-xs bg-purple-500/20 text-purple-300 rounded-full">
                {reports.length}
              </span>
            </h2>
          </div>
          
          {reports.length > 0 ? (
            <div className="divide-y divide-slate-700/30">
              {reports.map((report) => (
                <div
                  key={report._id}
                  className="p-6 hover:bg-slate-800/50 transition-colors"
                >
                  {editingReport && editingReport._id === report._id ? (
                    // Edit Mode
                    <div className="max-w-4xl mx-auto space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-slate-300">Editing Report</h3>
                        <button
                          onClick={() => setEditingReport(null)}
                          className="p-1.5 rounded-full hover:bg-slate-700/70 transition-colors"
                        >
                          <X className="w-4 h-4 text-slate-400" />
                        </button>
                      </div>
                      <textarea
                        value={editingReport.issue}
                        onChange={(e) =>
                          setEditingReport({
                            ...editingReport,
                            issue: e.target.value,
                          })
                        }
                        className="w-full bg-slate-900/70 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 h-28"
                      />
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => setEditingReport(null)}
                          className="px-4 py-2 rounded-lg border border-slate-600 hover:bg-slate-700 text-slate-300 transition duration-200 text-sm"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleUpdate(report._id)}
                          disabled={isSubmitting}
                          className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white transition duration-200 shadow-md shadow-purple-500/10 flex items-center gap-2 text-sm"
                        >
                          {isSubmitting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <CheckCircle className="w-4 h-4" />
                          )}
                          Save Changes
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div className="max-w-4xl mx-auto">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`px-2.5 py-1 text-xs rounded-full capitalize flex items-center gap-1.5 ${
                              report.appliance === 'washer' 
                                ? 'bg-blue-500/20 text-blue-300' 
                                : 'bg-purple-500/20 text-purple-300'
                            }`}>
                              <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                              {report.appliance} #{report.applianceNumber}
                            </span>
                            <span className="px-2.5 py-1 text-xs bg-slate-700/40 text-slate-400 rounded-full">
                              {report.residenceHall}
                            </span>
                          </div>
                          
                          <h3 className="font-medium text-lg text-white mb-1">
                            {report.name}
                          </h3>
                          
                          <p className="text-slate-300 mb-3 leading-relaxed">
                            {report.issue}
                          </p>
                          
                          <time className="text-sm text-slate-500 flex items-center gap-1.5">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10"></circle>
                              <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                            {new Date(report.timestamp).toLocaleString()}
                          </time>
                        </div>
                        
                        <div className="flex gap-2 shrink-0 sm:self-start">
                          <button
                            onClick={() => setEditingReport(report)}
                            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 transition-colors group"
                            title="Edit Report"
                          >
                            <Edit2 className="w-4 h-4 text-blue-400 group-hover:text-blue-300" />
                          </button>
                          <button
                            onClick={() => handleDelete(report._id)}
                            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 transition-colors group"
                            title="Mark as Resolved"
                          >
                            <CheckCircle className="w-4 h-4 text-green-400 group-hover:text-green-300" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="max-w-sm mx-auto py-12 px-8 rounded-xl bg-slate-800/30 border border-slate-700/50">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 mx-auto mb-4 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                  <path d="M7 8h10"></path>
                  <path d="M7 12h10"></path>
                  <path d="M7 16h4"></path>
                </svg>
                <p className="text-slate-400">No active reports</p>
                <p className="text-sm text-slate-500 mt-1">Submit a new report to get started</p>
              </div>
            </div>
          )}
        </div>

        {/* Report Filtering and Statistics Section */}
        <div className="mb-12 bg-slate-800/40 border border-slate-700 rounded-xl p-8 backdrop-blur-sm shadow-xl relative overflow-hidden">
          {/* Background glow effect */}
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-cyan-600/10 blur-[100px] rounded-full pointer-events-none"></div>
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <h2 className="text-2xl font-semibold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent flex items-center gap-2">
              <span className="p-1.5 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </span>
              Report Generator
            </h2>
            
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => {
                  setFilterAppliance("");
                  setFilterHall("");
                  setStartDate("");
                  setEndDate("");
                }}
                className="px-3 py-1.5 text-xs bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"></path>
                  <path d="M12 5v14"></path>
                </svg>
                Reset Filters
              </button>
              
              <button
                onClick={generateReport}
                className="px-3 py-1.5 text-xs bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-md shadow-blue-500/10"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.3-4.3"></path>
                </svg>
                Generate Report
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Appliance Type</label>
              <select
                value={filterAppliance}
                onChange={(e) => setFilterAppliance(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition duration-200"
              >
                <option value="">All Types</option>
                <option value="washer">Washer</option>
                <option value="dryer">Dryer</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Residence Hall</label>
              <select
                value={filterHall}
                onChange={(e) => setFilterHall(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition duration-200"
              >
                <option value="">All Halls</option>
                {residenceHalls.map((hall, index) => (
                  <option key={index} value={hall}>
                    {hall}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition duration-200"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition duration-200"
              />
            </div>
          </div>
          
          {reportStats && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 animate-fade-in">
              <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 p-4 rounded-xl border border-slate-700/50 flex flex-col">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Total Reports</span>
                <span className="text-3xl font-bold text-white">{reportStats.totalReports}</span>
              </div>
              
              <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 p-4 rounded-xl border border-slate-700/50 flex flex-col">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Most Reported</span>
                <span className="text-3xl font-bold text-white capitalize">{reportStats.mostReportedType}</span>
              </div>
              
              <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 p-4 rounded-xl border border-slate-700/50 flex flex-col">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Avg. Reports/Day</span>
                <span className="text-3xl font-bold text-white">{reportStats.avgPerDay}</span>
              </div>
            </div>
          )}
          
          {/* Filtered Reports Table */}
          {filteredReports.length > 0 && (
            <div className="rounded-xl border border-slate-700/50 overflow-hidden bg-slate-900/30 animate-slide-in-bottom">
              <div className="px-4 py-3 bg-gradient-to-r from-slate-800 to-slate-800/50 border-b border-slate-700/50">
                <h3 className="font-medium text-slate-300">
                  Filtered Reports ({filteredReports.length})
                </h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-800/50 text-left">
                      <th className="p-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Name</th>
                      <th className="p-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Location</th>
                      <th className="p-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Appliance</th>
                      <th className="p-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Date</th>
                      <th className="p-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Issue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredReports.map((report) => (
                      <tr key={report._id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="p-3 text-sm text-slate-300">{report.name}</td>
                        <td className="p-3 text-sm text-slate-300">{report.residenceHall}</td>
                        <td className="p-3 text-sm">
                          <span className={`px-2 py-1 text-xs rounded-full capitalize ${
                            report.appliance === 'washer' 
                              ? 'bg-blue-500/20 text-blue-400' 
                              : 'bg-purple-500/20 text-purple-400'
                          }`}>
                            {report.appliance} #{report.applianceNumber}
                          </span>
                        </td>
                        <td className="p-3 text-sm text-slate-400">
                          {new Date(report.timestamp).toLocaleDateString()}
                        </td>
                        <td className="p-3 text-sm text-slate-300 max-w-xs truncate">
                          {report.issue}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
