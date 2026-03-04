import { Loader } from "lucide-react";
import { useIntl } from "react-intl";
export function Loading(){
    const intl = useIntl();
    return(
        <div className="flex flex-col items-center justify-center h-screen bg-[var(--background-color)]">
        <Loader className="animate-spin text-[var(--primary-color)] mb-4" size={40} />
        <p className="text-gray-400">{intl.formatMessage({ id: 'common.loadingPageData' })}</p>
      </div>
    )
}