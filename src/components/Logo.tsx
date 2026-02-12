import React from "react";
import { LayoutDashboard} from 'lucide-react';
interface LogoProps {
    image?: string | null
}
export default function Logo({image}: LogoProps){
    if(!image){
        return <LayoutDashboard className="text-[var(--primary-color)]"/>
    }
    return <img src={image} className="w-32 h-10 object-contain"/>
}