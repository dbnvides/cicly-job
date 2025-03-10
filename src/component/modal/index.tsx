import { useForm } from "react-hook-form";
import { FiX } from "react-icons/fi";

export default function JobModal({ userId, editingJob, setEditingJob ,setIsModalOpen }) {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    
    const onSubmit = (data) => {
      const jobData = {
        ...data,
        userId, // Adiciona o userId ao enviar os dados
      };
  
      // Aqui você faria a chamada para o servidor para adicionar ou editar o job
      if (editingJob) {
        // Se estiver editando, enviar a atualização
        // Exemplo: updateJob(jobData);
      } else {
        // Se estiver criando um novo, enviar a criação
        // Exemplo: createJob(jobData);
      }
  
      setIsModalOpen(false); // Fecha o modal após salvar
      reset(); // Reseta o formulário
    };
  
    return (
     <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{editingJob ? "Edit Job Application" : "Add New Job Application"}</h2>
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
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700">Company</label>
                <input
                  {...register("company", { required: "Company name is required" })}
                  id="company"
                  type="text"
                  defaultValue={editingJob?.company || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
                {errors.company && <p className="text-red-500 text-xs">{errors.company.message}</p>}
              </div>

              <div>
                <label htmlFor="position" className="block text-sm font-medium text-gray-700">Position</label>
                <input
                  {...register("position", { required: "Position is required" })}
                  id="position"
                  type="text"
                  defaultValue={editingJob?.position || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
                {errors.position && <p className="text-red-500 text-xs">{errors.position.message}</p>}
              </div>

              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  {...register("date", { required: "Date is required" })}
                  id="date"
                  type="date"
                  defaultValue={editingJob?.date || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
                {errors.date && <p className="text-red-500 text-xs">{errors.date.message}</p>}
              </div>

              <div>
                <label htmlFor="method" className="block text-sm font-medium text-gray-700">Method</label>
                <select
                  {...register("method", { required: "Method is required" })}
                  id="method"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Email">Email</option>
                  <option value="Phone">Phone</option>
                  <option value="In-person">In-person</option>
                  <option value="Referral">Referral</option>
                </select>
                {errors.method && <p className="text-red-500 text-xs">{errors.method.message}</p>}
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  {...register("status", { required: "Status is required" })}
                  id="status"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Applied">Applied</option>
                  <option value="Interviewing">Interviewing</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Offered">Offered</option>
                </select>
                {errors.status && <p className="text-red-500 text-xs">{errors.status.message}</p>}
              </div>

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
        )
  }
  