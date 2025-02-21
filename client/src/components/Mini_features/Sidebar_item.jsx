import React from "react";

function SidebarItem({ icon, label, isActive, onClick, count }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300 group
      ${isActive
                    ? 'bg-primary-500/10 text-primary-400 shadow-lg border border-primary-500/20'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
        >
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${isActive ? 'bg-primary-500/20' : 'bg-white/5 group-hover:bg-white/10'} transition-colors`}>
                    {icon}
                </div>
                <span className="font-medium">{label}</span>
            </div>
            {count && (
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${isActive ? 'bg-primary-500/20 text-primary-400' : 'bg-white/10 text-gray-400 group-hover:bg-white/20'
                    } transition-colors`}>
                    {count}
                </span>
            )}
        </button>
    )
}

export default SidebarItem