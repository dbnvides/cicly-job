'use client'

import { format } from "date-fns";
import { useEffect, useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiSearch} from "react-icons/fi";
import { FiX } from "react-icons/fi";

export default function Home() {
  const [jobs, setJobs] = useState(() => {
    const savedJobs = localStorage.getItem("jobs");
    return savedJobs ? JSON.parse(savedJobs) : [];
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingJob, setEditingJob] = useState(null);
  const [formData, setFormData] = useState({
    companyName: "",
    position: "",
    applicationDate: format(new Date(), "yyyy-MM-dd"),
    applicationMethod: "Online",
    status: "Applied"
  });
  
  const handleEdit = (job) => {
    setEditingJob(job);
    setFormData({ ...job });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
  const updatedJobs = jobs.filter(job => job.id !== id);
  setJobs(updatedJobs);
  localStorage.setItem("jobs", JSON.stringify(updatedJobs));
};

  const filteredJobs = jobs.filter(job =>
    job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const StatusBadge = ({ status }) => {
    const getStatusColor = (status) => {
      const colors = {
        Applied: "bg-blue-100 text-blue-800",
        Interviewing: "bg-yellow-100 text-yellow-800",
        Rejected: "bg-red-100 text-red-800",
        Offered: "bg-green-100 text-green-800"
      };
      return colors[status] || colors.Applied;
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
        {status}
      </span>
    );
  };

  useEffect(() => {
    if (jobs.length > 0) {
      localStorage.setItem("jobs", JSON.stringify(jobs));
    }
  }, [jobs]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingJob) {
      setJobs(jobs.map(job => job.id === editingJob.id ? { ...formData, id: editingJob.id } : job));
    } else {
      setJobs([...jobs, { ...formData, id: Date.now() }]);
    }
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
      setFormData({
      companyName: "",
      position: "",
      applicationDate: format(new Date(), "yyyy-MM-dd"),
      applicationMethod: "Online",
      status: "Applied"
      });
  setEditingJob(null);
  };

  return (
   <div className="min-h-screen bg-gray-50"> 
   
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Cicly Jobs</h1>
          <div className="flex space-x-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                aria-label="Add new job application"
              >
                <FiPlus className="inline mr-2" />Add Job
              </button>
              <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors">
                Sign In
              </button>
          </div>
        </div>
      </nav>
    </header>
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 relative">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search jobs..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <section className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {filteredJobs.map((job) => (
              <tr key={job.id}>
                <td className="px-6 py-4 whitespace-nowrap">{job.companyName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{job.position}</td>
                <td className="px-6 py-4 whitespace-nowrap">{job.applicationDate}</td>
                <td className="px-6 py-4 whitespace-nowrap">{job.applicationMethod}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={job.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => handleEdit(job)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                    aria-label="Edit job application"
                  >
                    <FiEdit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(job.id)}
                    className="text-red-600 hover:text-red-900"
                    aria-label="Delete job application"
                  >
                    <FiTrash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
              ))}
          </tbody>
        </table>

       
      </section>
    </main>
    {isModalOpen && 
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{editingJob ? "Edit Job Application" : "Add New Job Application"}</h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-500"
                aria-label="Close modal"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Company Name</label>
                <input
                  type="text"
                  id="companyName"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="position" className="block text-sm font-medium text-gray-700">Position</label>
                <input
                  type="text"
                  id="position"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="applicationDate" className="block text-sm font-medium text-gray-700">Application Date</label>
                <input
                  type="date"
                  id="applicationDate"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formData.applicationDate}
                  onChange={(e) => setFormData({ ...formData, applicationDate: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="applicationMethod" className="block text-sm font-medium text-gray-700">Application Method</label>
                <select
                  id="applicationMethod"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formData.applicationMethod}
                  onChange={(e) => setFormData({ ...formData, applicationMethod: e.target.value })}
                >
                  <option>Online</option>
                  <option>Email</option>
                  <option>Referral</option>
                </select>
              </div>
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  id="status"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option>Applied</option>
                  <option>Interviewing</option>
                  <option>Rejected</option>
                  <option>Offered</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editingJob ? "Update" : "Add"} Job
                </button>
              </div>
            </form>
          </div>
      </div>}
   </div>
   
  );
}
