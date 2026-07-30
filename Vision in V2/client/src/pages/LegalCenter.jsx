import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ShieldCheck, FileText, Copy, Printer, CheckCircle2, Scale } from 'lucide-react';

export const LegalCenter = () => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [disclosingParty, setDisclosingParty] = useState(user?.startupName || user?.name || 'AgriSense AI');
  const [receivingParty, setReceivingParty] = useState('Co-Founder Candidate / Investor');
  const [purpose, setPurpose] = useState('Evaluating technical co-founder partnership and reviewing core proprietary source code & pitch materials.');
  const [governingState, setGoverningState] = useState('Karnataka / Tamil Nadu, India');
  const [jurisdictionDays, setJurisdictionDays] = useState('2');

  const ndaTemplateText = `MUTUAL NON-DISCLOSURE AGREEMENT (NDA)

This Non-Disclosure Agreement ("Agreement") is entered into as of ${new Date().toLocaleDateString()} by and between:

DISCLOSING PARTY: ${disclosingParty}
RECEIVING PARTY: ${receivingParty}

1. PURPOSE OF DISCLOSURE
The Disclosing Party agrees to share proprietary business concepts, software architecture, and IP details for the purpose of:
"${purpose}"

2. CONFIDENTIAL INFORMATION
Confidential Information includes, but is not limited to: startup source code, business models, user metrics, customer research, and IP timestamp seals issued via VisionIn.

3. OBLIGATIONS OF RECEIVING PARTY
The Receiving Party agrees to hold all Confidential Information in strict confidence for a period of ${jurisdictionDays} years from the date of disclosure.

4. GOVERNING LAW
This Agreement shall be governed by and construed in accordance with the laws of ${governingState}.

IN WITNESS WHEREOF, the parties have executed this Agreement on VisionIn IP Platform.

Disclosing Party Signature: _______________________ (${disclosingParty})
Receiving Party Signature: _______________________ (${receivingParty})`;

  const handleCopyNDA = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(ndaTemplateText);
      addToast('NDA document copied to clipboard!', 'success');
    }
  };

  const handlePrintNDA = () => {
    const printWin = window.open('', '_blank');
    printWin.document.write(`<pre style="font-family:monospace; padding:24px; white-space:pre-wrap;">${ndaTemplateText}</pre>`);
    printWin.document.close();
    printWin.print();
  };

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#1D4ED8] border border-[#1E293B] rounded-2xl p-6 shadow-md">
        <div className="flex items-center gap-2 mb-1">
          <Scale className="w-5 h-5 text-sky-400" />
          <h2 className="text-xl font-bold text-white tracking-tight">Legal & IP Resource Center</h2>
        </div>
        <p className="text-slate-300 text-xs max-w-xl leading-relaxed">
          Generate custom non-disclosure agreements (NDAs), inspect founder equity agreements, and learn best practices for protecting student startup IP.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Customization Controls */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-brand" /> Interactive NDA Generator
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Disclosing Party (Your Startup / Name)</label>
              <input
                type="text"
                value={disclosingParty}
                onChange={(e) => setDisclosingParty(e.target.value)}
                className="w-full bg-[#1E293B] border border-[#1E293B] rounded-xl p-2.5 text-white outline-none focus:border-brand"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Receiving Party (Candidate / Investor)</label>
              <input
                type="text"
                value={receivingParty}
                onChange={(e) => setReceivingParty(e.target.value)}
                className="w-full bg-[#1E293B] border border-[#1E293B] rounded-xl p-2.5 text-white outline-none focus:border-brand"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Purpose of Discussion</label>
              <textarea
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                rows={2}
                className="w-full bg-[#1E293B] border border-[#1E293B] rounded-xl p-2.5 text-white outline-none focus:border-brand resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Governing Jurisdiction</label>
                <input
                  type="text"
                  value={governingState}
                  onChange={(e) => setGoverningState(e.target.value)}
                  className="w-full bg-[#1E293B] border border-[#1E293B] rounded-xl p-2.5 text-white outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Confidentiality Term (Years)</label>
                <input
                  type="number"
                  value={jurisdictionDays}
                  onChange={(e) => setJurisdictionDays(e.target.value)}
                  className="w-full bg-[#1E293B] border border-[#1E293B] rounded-xl p-2.5 text-white outline-none focus:border-brand"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={handleCopyNDA}
                className="flex-1 py-2.5 rounded-xl bg-brand text-white font-semibold flex items-center justify-center gap-1.5 shadow-md hover:bg-blue-600 transition-colors"
              >
                <Copy className="w-4 h-4" /> Copy NDA Text
              </button>
              <button
                onClick={handlePrintNDA}
                className="py-2.5 px-4 rounded-xl bg-[#1E293B] text-slate-200 hover:text-white font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Printer className="w-4 h-4" /> Print PDF
              </button>
            </div>
          </div>
        </div>

        {/* NDA Live Document Preview */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-5 shadow-sm space-y-3 flex flex-col">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-2">
            <h4 className="font-bold text-xs text-slate-300 uppercase tracking-wider">Document Live Preview</h4>
            <span className="text-[10px] text-emerald-400 font-mono">READY TO EXECUTE</span>
          </div>

          <pre className="flex-1 bg-[#070B14] p-4 rounded-xl border border-[#1E293B] text-[11px] text-slate-300 font-mono whitespace-pre-wrap overflow-y-auto max-h-[380px] leading-relaxed">
            {ndaTemplateText}
          </pre>
        </div>

      </div>
    </div>
  );
};
