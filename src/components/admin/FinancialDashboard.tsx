'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, ArrowDownLeft, ArrowUpRight, FileText } from 'lucide-react';

export default function FinancialDashboard() {
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
                    <p className="text-gray-400 text-sm mb-1">Net Revenue</p>
                    <h3 className="text-3xl font-black text-white">450,230 BDT</h3>
                    <div className="flex items-center gap-1 text-green-500 text-xs mt-2">
                        <ArrowUpRight size={14} />
                        <span>12.5% vs last month</span>
                    </div>
                </div>
                <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
                    <p className="text-gray-400 text-sm mb-1">Platform Fees</p>
                    <h3 className="text-3xl font-black text-white">15,450 BDT</h3>
                    <div className="flex items-center gap-1 text-cyan-500 text-xs mt-2">
                        <DollarSign size={14} />
                        <span>3.5% avg rate</span>
                    </div>
                </div>
                <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
                    <p className="text-gray-400 text-sm mb-1">Refunds Processed</p>
                    <h3 className="text-3xl font-black text-red-400">2,300 BDT</h3>
                    <div className="flex items-center gap-1 text-red-500 text-xs mt-2">
                        <ArrowDownLeft size={14} />
                        <span>0.5% refund rate</span>
                    </div>
                </div>
            </div>

            <div className="bg-[#161B2B] border border-white/5 rounded-3xl p-8">
                <div className="flex items-center justify-between mb-8">
                    <h4 className="text-lg font-bold">Recent Transactions</h4>
                    <button className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm font-medium">
                        <FileText size={16} /> Export CSV
                    </button>
                </div>
                <div className="space-y-4">
                    <TransactionItem name="John Doe" amount="2,500 BDT" status="Completed" date="Today, 2:45 PM" />
                    <TransactionItem name="Jane Smith" amount="1,200 BDT" status="Pending" date="Today, 1:20 PM" />
                    <TransactionItem name="Event Co." amount="15,000 BDT" status="Completed" date="Yesterday" />
                </div>
            </div>
        </div>
    );
}

function TransactionItem({ name, amount, status, date }: any) {
    return (
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-500">
                    <DollarSign size={20} />
                </div>
                <div>
                    <p className="font-bold text-sm">{name}</p>
                    <p className="text-xs text-gray-500">{date}</p>
                </div>
            </div>
            <div className="text-right">
                <p className="font-bold text-white">{amount}</p>
                <span className={`text-[10px] uppercase font-black ${status === 'Completed' ? 'text-green-500' : 'text-yellow-500'}`}>{status}</span>
            </div>
        </div>
    );
}
