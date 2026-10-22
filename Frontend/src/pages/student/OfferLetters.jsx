import React, { useState } from 'react';
import { MailOpen, Download, Eye, CheckCircle2, Building2, Calendar, FileText, X } from 'lucide-react';

const OfferLetters = () => {
    const [offers] = useState([
        {
            id: 'off-1',
            role: 'Associate Frontend Developer',
            company: 'Vercel Inc.',
            status: 'Accepted',
            date: 'Oct 15, 2026',
            validUntil: 'Oct 30, 2026',
            ctc: '$85,000 / annum',
            location: 'Remote, US',
            documentText: 'We are pleased to offer you the position of Associate Frontend Developer at Vercel Inc. Your verified proficiency in React.js, Next.js, and web performance optimization evaluated through CareerSync demonstrated strong technical acumen.'
        }
    ]);

    const [previewOffer, setPreviewOffer] = useState(null);

    const handleDownload = (offer) => {
        const element = document.createElement('a');
        const file = new Blob([
            `OFFICIAL OFFER LETTER\n\nCompany: ${offer.company}\nPosition: ${offer.role}\nCompensation: ${offer.ctc}\nLocation: ${offer.location}\nDate: ${offer.date}\nStatus: ${offer.status}\n\nTerms:\n${offer.documentText}\n\nSigned by Vercel Talent Operations.`
        ], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `${offer.company}_Offer_Letter.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    return (
        <div className="max-w-6xl mx-auto pb-12">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center">
                    <MailOpen className="w-8 h-8 mr-3 text-blue-600" />
                    Official Offer Letters & Employment Documents
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                    Manage and review formal recruitment offers, verification certificates, and onboarding packages.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {offers.map(offer => (
                    <div 
                        key={offer.id} 
                        className="bg-white border border-emerald-200 rounded-xl p-6 shadow-sm relative overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
                    >
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500"></div>

                        <div>
                            <div className="flex justify-between items-start mb-4 pl-2">
                                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-full flex items-center">
                                    <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                                    {offer.status}
                                </span>
                                <span className="text-xs text-gray-500 font-medium">Valid until {offer.validUntil}</span>
                            </div>

                            <div className="pl-2 mb-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-1">{offer.role}</h3>
                                <div className="text-sm font-semibold text-blue-600 flex items-center mb-3">
                                    <Building2 className="w-4 h-4 mr-1.5" />
                                    {offer.company}
                                </div>

                                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-xs text-gray-600 space-y-1">
                                    <div><strong>Compensation:</strong> {offer.ctc}</div>
                                    <div><strong>Location:</strong> {offer.location}</div>
                                    <div><strong>Issued Date:</strong> {offer.date}</div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2 pl-2">
                            <button 
                                onClick={() => setPreviewOffer(offer)}
                                className="flex-1 flex justify-center items-center py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold transition-colors"
                            >
                                <Eye className="w-3.5 h-3.5 mr-1.5" />
                                Preview
                            </button>
                            <button 
                                onClick={() => handleDownload(offer)}
                                className="flex-1 flex justify-center items-center py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
                            >
                                <Download className="w-3.5 h-3.5 mr-1.5" />
                                Download Letter
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* PREVIEW MODAL */}
            {previewOffer && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-150">
                        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                            <div>
                                <h3 className="font-bold text-gray-900 text-base">{previewOffer.company} Offer Document</h3>
                                <p className="text-xs text-gray-500">{previewOffer.role}</p>
                            </div>
                            <button onClick={() => setPreviewOffer(null)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4 text-xs text-gray-700 leading-relaxed font-sans">
                            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl font-bold text-emerald-900 text-sm">
                                Congratulations on your official offer with {previewOffer.company}!
                            </div>
                            <p>{previewOffer.documentText}</p>
                            <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 space-y-1">
                                <div><strong>Offered Base:</strong> {previewOffer.ctc}</div>
                                <div><strong>Work Format:</strong> {previewOffer.location}</div>
                            </div>
                        </div>

                        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-2">
                            <button onClick={() => setPreviewOffer(null)} className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-lg">
                                Close
                            </button>
                            <button onClick={() => handleDownload(previewOffer)} className="px-5 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700">
                                Download Copy
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OfferLetters;
