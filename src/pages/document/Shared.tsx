import { useState, useEffect } from 'react';
import { Search, FileText, Download, Mail, MessageCircle, Loader2 } from 'lucide-react';
import useHeaderStore from '../../store/headerStore';
import { formatDate } from '../../utils/dateFormatter';
import { authFetch, API_BASE_URL } from '../../utils/apiClient';
import { toast } from 'react-hot-toast';

interface ShareRecord {
    id: number;
    share_no: string;
    document_id: string;
    document_name: string;
    document_serial: string;
    document_url: string;
    recipient_name: string;
    phone: string;
    shared_via: string;
    shared_at: string;
}

const SharedDocuments = () => {
    const { setTitle } = useHeaderStore();
    const [history, setHistory] = useState<ShareRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const res = await authFetch(`${API_BASE_URL}/whatsapp/history`);
            const data = await res.json();
            if (res.ok && data.success) {
                setHistory(data.data);
            } else {
                throw new Error(data.error || 'Failed to fetch history');
            }
        } catch (error: any) {
            console.error('Fetch history error:', error);
            toast.error(error.message || 'Failed to load share history');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setTitle('Share History');
        fetchHistory();
    }, [setTitle]);

    const filteredData = history.filter(item => 
        (item.share_no || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.document_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.recipient_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.document_serial || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.phone || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDownload = (url: string) => {
        if (!url) return;
        window.open(url, '_blank');
    };

    return (
        <div className="space-y-6 pb-20">
             {/* Header & Search */}
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div>
                     <h1 className="text-2xl font-bold text-gray-800">
                        Share History
                     </h1>
                     <p className="text-sm text-gray-500 mt-1">Track all your shared documents</p>
                </div>
                <div className="relative w-full sm:w-auto min-w-[300px]">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                        type="text"
                        placeholder="Search by Share No, Recipient, Serial..."
                        className="pl-10 pr-4 py-2.5 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
             </div>

             {loading ? (
                 <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                     <Loader2 size={40} className="text-indigo-600 animate-spin mb-4" />
                     <p className="text-gray-500">Loading share history...</p>
                 </div>
             ) : (
                 <>
                     {/* Desktop Table */}
                     <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="p-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Share No.</th>
                                        <th className="p-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Date & Time</th>
                                        <th className="p-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Serial No.</th>
                                        <th className="p-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Document Name</th>
                                        <th className="p-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Document File</th>
                                        <th className="p-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Shared Via</th>
                                        <th className="p-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Recipient Name</th>
                                        <th className="p-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Contact Info</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filteredData.map((item) => (
                                        <tr key={item.id} className="hover:bg-indigo-50/10 transition-colors">
                                            <td className="p-3 text-sm font-medium text-indigo-600">{item.share_no}</td>
                                            <td className="p-3 text-sm text-gray-600 whitespace-nowrap">{formatDate(item.shared_at)}</td>
                                            <td className="p-3 text-sm text-gray-900 font-mono">{item.document_serial || '-'}</td>
                                            <td className="p-3 text-sm text-gray-900">
                                                <div className="flex items-center gap-2">
                                                    <FileText size={16} className="text-gray-400" />
                                                    <span className="truncate max-w-[180px]" title={item.document_name}>{item.document_name}</span>
                                                </div>
                                            </td>
                                            <td className="p-3">
                                                {item.document_url ? (
                                                    <button 
                                                        onClick={() => handleDownload(item.document_url)}
                                                        className="flex items-center gap-1.5 text-xs text-indigo-600 font-medium hover:text-indigo-800 transition-colors bg-indigo-50 px-2 py-1 rounded-lg"
                                                    >
                                                        <Download size={14} />
                                                        View
                                                    </button>
                                                ) : (
                                                    <span className="text-xs text-gray-400">Not available</span>
                                                )}
                                            </td>
                                            <td className="p-3 text-sm text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    {item.shared_via === 'Email' ? <Mail size={16} className="text-blue-500"/> : <MessageCircle size={16} className="text-green-500"/>}
                                                    {item.shared_via}
                                                </div>
                                            </td>
                                            <td className="p-3 text-sm text-gray-900 font-medium">{item.recipient_name || '-'}</td>
                                            <td className="p-3 text-sm text-gray-500 whitespace-nowrap">{item.phone}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                         {filteredData.length === 0 && (
                             <div className="p-12 text-center text-gray-500">
                                 <Search className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                                 <p>No share history found matching your search.</p>
                             </div>
                         )}
                     </div>

                     {/* Mobile View */}
                     <div className="md:hidden space-y-4">
                         {filteredData.map((item) => (
                             <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-3">
                                 <div className="flex justify-between items-start">
                                     <div className="flex items-center gap-2">
                                         <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{item.share_no}</span>
                                         <p className="text-xs text-gray-400">{formatDate(item.shared_at)}</p>
                                     </div>
                                 </div>
                                 
                                 <div className="border-t border-gray-50 pt-3 flex flex-col space-y-2.5">
                                     <div className="flex items-start justify-between">
                                         <span className="text-xs text-gray-500">Document:</span>
                                         <div className="text-right">
                                            <span className="text-sm font-medium text-gray-900 block">{item.document_name}</span>
                                            <span className="text-[10px] text-gray-400 font-mono block">{item.document_serial || '-'}</span>
                                         </div>
                                     </div>
                                     
                                     <div className="flex items-center justify-between">
                                         <span className="text-xs text-gray-500">Recipient:</span>
                                         <div className="text-right">
                                             <span className="text-sm text-gray-900 block">{item.recipient_name || '-'}</span>
                                             <span className="text-xs text-gray-400 block">{item.phone}</span>
                                         </div>
                                     </div>

                                     <div className="flex items-center justify-between">
                                         <span className="text-xs text-gray-500">Shared Via:</span>
                                         <div className="flex items-center gap-1.5 text-sm text-gray-700">
                                             {item.shared_via === 'Email' ? <Mail size={14} className="text-blue-500"/> : <MessageCircle size={14} className="text-green-500"/>}
                                             {item.shared_via}
                                         </div>
                                     </div>

                                    {item.document_url && (
                                        <button 
                                            onClick={() => handleDownload(item.document_url)}
                                            className="w-full mt-2 flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 rounded-lg text-xs font-medium transition-colors"
                                        >
                                            <Download size={14} />
                                            View File
                                        </button>
                                    )}
                                 </div>
                             </div>
                         ))}
                         
                         {filteredData.length === 0 && (
                             <div className="p-8 text-center text-gray-500 bg-white rounded-xl border border-gray-100">
                                 <p>No records found</p>
                             </div>
                         )}
                     </div>
                 </>
             )}
        </div>
    );
};

export default SharedDocuments;
