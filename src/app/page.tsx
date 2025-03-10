'use client'

import { useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX } from "react-icons/fi";
import { format } from "date-fns";
import { Method, Status } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from 'react-hook-form';


interface Job {
  id: number;
  company: string;
  position: string;
  date: string;
  method: Method;
  status: Status;
  usuarioId: number;
  link: string;
}

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();

  const { data: jobs, error, isLoading } = useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      const res = await fetch(`/api/job/1`);
      if (!res.ok) throw new Error("Erro ao buscar jobs");
      return res.json();
    }
  });

  const usuarioId = 1

  const deleteJobMutation = useMutation({
    mutationFn: async (id: number) => {
      await fetch(`/api/job/${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    }
  });

  const addJobMutation = useMutation({
    mutationFn: async (newJob: { company: string; position: string; date: string; method: Method; status: Status, link: string }) => {
      const response = await fetch('/api/job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newJob)
      });
      if (!response.ok) {
        throw new Error('Erro ao adicionar o job');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
    onError: (error) => {
      console.log('Erro:', error);
    }
  });

  const editJobMutation = useMutation({
    mutationFn: async (newJob: { id: number; company?: string; position?: string; date?: string; method?: Method; status?: Status, link?:string }) => {
      const response = await fetch(`/api/job/${editingJob!.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newJob)
      });
      if (!response.ok) {
        throw new Error('Erro ao adicionar o job');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
    onError: (error) => {
      console.log('Erro:', error);
    }
  });
  
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = (data: { position: string; date: string; method: Method; status: Status; link:string }) => {
    
    
    if(editingJob){
      const id = editingJob!.id
      editJobMutation.mutate({...data, usuarioId, id})
      reset();
      setIsModalOpen(false);
      return
    }

    addJobMutation.mutate({ ...data, usuarioId });
    reset();
    setIsModalOpen(false);
  };
  
  const handleDelete = (id: number) => {
    deleteJobMutation.mutate(id);
  };

  const handleEdit = (job: Job) => {
    setEditingJob(job);
    setIsModalOpen(true);
  };

  const filteredJobs = jobs?.filter(job =>
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const StatusBadge = ({ status }: { status: Status }) => {
    const getStatusColor = (status: Status) => {
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

  const formatarDataBR = (dataISO: string) => {
    const [year, month, day] = dataISO.split("-");
    return `${day}/${month}/${year}`;
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
                <FiPlus className="inline mr-2" /> Add Job
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Link</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {filteredJobs?.map((job: Job) => (
                <tr key={job.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{job.company}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{job.position}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatarDataBR(job.date)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{job.method}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={job.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap"><a href={job.link} target="_blank" className="underline text-blue-700">Link</a></td>
                  
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

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{editingJob ? "Atualização da vaga" : "Nova vaga aplicada"}</h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingJob(null);
                  reset();
                }}
                className="text-gray-400 hover:text-gray-500"
                aria-label="Close modal"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <fieldset>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700">Empresa</label>
                <input
                  {...register("company", { required: "Company name is required" })}
                  id="company"
                  type="text"
                  defaultValue={editingJob?.company || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
                {errors.company && <p className="text-red-500 text-xs">{errors.company.message}</p>}
              </fieldset>

              <fieldset>
                <label htmlFor="position" className="block text-sm font-medium text-gray-700">Posição</label>
                <input
                  {...register("position", { required: "Position is required" })}
                  id="position"
                  type="text"
                  defaultValue={editingJob?.position || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
                {errors.position && <p className="text-red-500 text-xs">{errors.position.message}</p>}
              </fieldset>

              <fieldset>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">Data</label>
                <input
                  {...register("date", { required: "Date is required" })}
                  id="date"
                  type="date"
                  defaultValue={editingJob?.date || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
                {errors.date && <p className="text-red-500 text-xs">{errors.date.message}</p>}
              </fieldset>

              <fieldset>
                <label htmlFor="method" className="block text-sm font-medium text-gray-700">Metodo de aplicação</label>
                <select
                  {...register("method", { required: "Method is required" })}
                  id="method"
                  defaultValue={editingJob?.method || 'EMAIL'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="EMAIL">Email</option>
                  <option value="ONLINE">Online</option>
                  <option value="REFERRAL">Indicado</option>
                </select>
                {errors.method && <p className="text-red-500 text-xs">{errors.method.message}</p>}
              </fieldset>

              <fieldset>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  {...register("status", { required: "Status is required" })}
                  id="status"
                  defaultValue={editingJob?.status || 'APPLIED'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="APPLIED">Aplicado</option>
                  <option value="INTERVIEWING">Entrevistando</option>
                  <option value="REJECTED">Rejeitado</option>
                  <option value="OFFERED">Proposta oferecida</option>
                </select>
                {errors.status && <p className="text-red-500 text-xs">{errors.status.message}</p>}
              </fieldset>

              <fieldset>
                <label htmlFor="link" className="block text-sm font-medium text-gray-700">Link</label>
                <input
                  {...register("link", { required: "link is required" })}
                  id="link"
                  type="text"
                  defaultValue={editingJob?.link || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
                {errors.link && <p className="text-red-500 text-xs">{errors.link.message}</p>}
              </fieldset>

              <div className="mt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingJob(null);
                    reset();
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
        
      )}
    </div>
  );
}
