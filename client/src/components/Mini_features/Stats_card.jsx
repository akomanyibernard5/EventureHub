import React from "react";

function Stats_card({ label, value, icon, color, trend }) {
    return (
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 border border-white/5 hover:border-white/10 group">
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <p className="text-gray-400 text-sm font-medium">{label}</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-bold text-white group-hover:text-primary-400 transition-colors">{value}</h3>
                        {trend && (
                            <span className={`text-sm ${trend > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
                            </span>
                        )}
                    </div>
                </div>
                <div className={`w-16 h-16 rounded-2xl ${color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    {icon}
                </div>
            </div>
        </div>
    )
}

export default Stats_card;