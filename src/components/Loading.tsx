import { Loader } from "lucide-react";
export function Loading(){
    return(
        <div className="flex flex-col items-center justify-center h-screen bg-[var(--background-color)]">
        <Loader className="animate-spin text-[var(--primary-color)] mb-4" size={40} />
        <p className="text-gray-400">Carregando página e dados, por favor aguarde...</p>
      </div>
    )
}