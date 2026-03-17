import React from 'react';
import { PlayCircle } from 'lucide-react';

const TrainingVideo: React.FC = () => {
    return (
        <div className="p-4 md:p-8 space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                    <PlayCircle size={24} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Training Video</h1>
                    <p className="text-gray-500 text-sm">Learn how to use the Document & Subscription platform effectively.</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="aspect-video w-full max-w-5xl mx-auto shadow-2xl rounded-xl overflow-hidden my-8">
                    <iframe
                        className="w-full h-full"
                        src="https://www.youtube.com/embed/IBkxB7SuSsM?si=J0Z94j_H5p-4j09k"
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                    ></iframe>
                </div>
            </div>

            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 mt-8">
                <h3 className="text-indigo-900 font-semibold mb-2">Need more help?</h3>
                <p className="text-indigo-700 text-sm">
                    If you have questions after watching the training video, please contact our support team or check the Settings page for documentation.
                </p>
            </div>
        </div>
    );
};

export default TrainingVideo;
