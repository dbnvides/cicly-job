import {useState } from "react";
import { format } from "date-fns";
import { FiX } from "react-icons/fi";

export const ModalAddJob = ({setIsModalOpen, setJobs, jobs}) =>{
      const [editingJob, setEditingJob] = useState(null);
      const [formData, setFormData] = useState({
        companyName: "",
        position: "",
        applicationDate: format(new Date(), "yyyy-MM-dd"),
        applicationMethod: "Online",
        status: "Applied"
      });
    
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
    return(
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
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
        </div>
    )
}