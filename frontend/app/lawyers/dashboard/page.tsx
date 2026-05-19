"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

// Mock case definition
interface ActiveCase {
  id: string
  clientName: string
  caseTitle: string
  status: "ACTIVE" | "PENDING SIGNATURE" | "RESOLVED"
  noticeTitle: string
  noticeContent: string
  dateCreated: string
}

const INITIAL_CASES: ActiveCase[] = [
  {
    id: "RT-2026-089",
    clientName: "Karan Malhotra",
    caseTitle: "Eviction Dispute - Residential Sublease",
    status: "ACTIVE",
    noticeTitle: "Eviction Notice under Sec 106, TP Act",
    noticeContent: `LEGAL NOTICE\n\nTo,\nMr. Ramesh Kumar\nFlat 402, Oakwood Apartments,\nIndiranagar, Bengaluru - 560038\n\nDear Sir,\n\nUnder instructions from my client, Mr. Karan Malhotra (Owner), I hereby serve you notice that your sublease of Flat 402, Oakwood Apartments, is hereby terminated effective 15 days from receipt of this notice due to non-payment of rent for the consecutive months of March and April 2026.\n\nYou are directed to clear outstanding dues of ₹45,000 and hand over vacant possession of the premises on or before June 5, 2026, failing which my client will be constrained to initiate legal proceedings for eviction and recovery of mesne profits.\n\nYours faithfully,\n[Lawyer Signature]\nSenior Counsel, RedTape Legal`,
    dateCreated: "2026-05-10"
  },
  {
    id: "RT-2026-112",
    clientName: "Priya Sen",
    caseTitle: "Employment Breach & Unpaid Compensation",
    status: "ACTIVE",
    noticeTitle: "Demand & Show Cause Notice for Unpaid Salary",
    noticeContent: `LEGAL NOTICE\n\nTo,\nThe Directors,\nMetro Corp Solutions Ltd.,\nOuter Ring Road, Bengaluru - 560103\n\nDear Sirs,\n\nUnder instructions from my client, Ms. Priya Sen, former Lead Architect, I hereby call upon you to release her unpaid salary for March and April 2026, totaling ₹2,40,000, along with her relieving letter and experience certificate.\n\nMy client resigned on April 15, 2026, serving her full notice period. Non-payment of salary and withholding of employment documents is a direct violation of the employment contract and applicable labor laws.\n\nYou are required to settle these dues within 7 days of receipt of this notice, failing which civil and criminal actions will be initiated.\n\nYours faithfully,\n[Lawyer Signature]\nSenior Counsel, RedTape Legal`,
    dateCreated: "2026-05-14"
  },
  {
    id: "RT-2026-144",
    clientName: "Aarav Mehta",
    caseTitle: "Consumer Grievance - Defective Hardware Services",
    status: "PENDING SIGNATURE",
    noticeTitle: "Notice of Deficient Service under Consumer Protection Act",
    noticeContent: `LEGAL NOTICE\n\nTo,\nQuickLogistics Logistics Center,\nBommanahalli, Bengaluru - 560068\n\nDear Sir,\n\nUnder instructions from my client, Mr. Aarav Mehta, I serve you this notice regarding severe deficiency of service. My client booked an urgent shipment of fragile tech equipment (consignment #QL-9831) on May 1, 2026, paying a premium courier fee of ₹8,500.\n\nThe shipment was delivered 9 days late, with the primary servers severely crushed and water-damaged. Your team has refused liability or refund.\n\nWe hereby demand a full refund and damages of ₹1,50,000 for server replacement and loss of business within 10 days, failing which we will approach the District Consumer Disputes Redressal Commission.\n\nYours faithfully,\n[Lawyer Signature]\nSenior Counsel, RedTape Legal`,
    dateCreated: "2026-05-18"
  }
]

export default function LawyerDashboard() {
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [lawyerName, setLawyerName] = useState("")

  // Cases state
  const [cases, setCases] = useState<ActiveCase[]>(INITIAL_CASES)
  const [selectedCaseId, setSelectedCaseId] = useState("RT-2026-089")
  
  // Interactive Editing state
  const [editNotice, setEditNotice] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  
  // Add new case state
  const [showAddForm, setShowAddForm] = useState(false)
  const [newClient, setNewClient] = useState("")
  const [newTitle, setNewTitle] = useState("")
  const [newNoticeTitle, setNewNoticeTitle] = useState("")
  const [newNoticeContent, setNewNoticeContent] = useState("")

  // Subscription state
  const subscriptionTotalDays = 365
  const subscriptionDaysRemaining = 248
  const subscriptionPercent = Math.round((subscriptionDaysRemaining / subscriptionTotalDays) * 100)
  const [showRenewModal, setShowRenewModal] = useState(false)

  useEffect(() => {
    const role = localStorage.getItem("redtape_role")
    const name = localStorage.getItem("redtape_username")
    
    if (role === "lawyer" && name) {
      setAuthorized(true)
      setLawyerName(name)
    } else {
      setAuthorized(false)
    }
    setCheckingAuth(false)
  }, [])

  // Sync edit field when selected case changes
  const selectedCase = cases.find((c) => c.id === selectedCaseId) || cases[0]

  useEffect(() => {
    if (selectedCase) {
      setEditNotice(selectedCase.noticeContent)
      setIsEditing(false)
    }
  }, [selectedCaseId, cases])

  const handleSaveNotice = () => {
    if (!selectedCase) return
    setCases((prevCases) =>
      prevCases.map((c) =>
        c.id === selectedCase.id ? { ...c, noticeContent: editNotice } : c
      )
    )
    setIsEditing(false)
  }

  const handleUpdateStatus = (status: "ACTIVE" | "PENDING SIGNATURE" | "RESOLVED") => {
    if (!selectedCase) return
    setCases((prevCases) =>
      prevCases.map((c) =>
        c.id === selectedCase.id ? { ...c, status } : c
      )
    )
  }

  const handleAddCase = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newClient.trim() || !newTitle.trim() || !newNoticeContent.trim()) {
      alert("Please fill out all primary fields.")
      return
    }

    const newId = `RT-2026-${Math.floor(100 + Math.random() * 900)}`
    const newCaseObj: ActiveCase = {
      id: newId,
      clientName: newClient.trim(),
      caseTitle: newTitle.trim(),
      status: "ACTIVE",
      noticeTitle: newNoticeTitle.trim() || "Legal Notice",
      noticeContent: newNoticeContent.trim(),
      dateCreated: new Date().toISOString().split("T")[0]
    }

    setCases((prev) => [newCaseObj, ...prev])
    setSelectedCaseId(newId)
    setShowAddForm(false)
    
    // Reset form
    setNewClient("")
    setNewTitle("")
    setNewNoticeTitle("")
    setNewNoticeContent("")
  }

  const handleRenewSubscription = () => {
    setShowRenewModal(true)
    setTimeout(() => {
      setShowRenewModal(false)
      alert("Subscription extended by 365 days! Thank you for using RedTape Professional Suite.")
    }, 1500)
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-center items-center font-sans">
        <div className="animate-spin h-8 w-8 border-4 border-black border-t-transparent"></div>
        <p className="mt-4 text-xs font-bold tracking-[0.2em] uppercase">Checking Credentials...</p>
      </div>
    )
  }

  // Auth Guard Screen
  if (!authorized) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <Navbar />
        <main className="flex-1 flex flex-col justify-center items-center py-20 px-6 swiss-grid-pattern">
          <div className="max-w-md w-full border-2 border-black bg-white p-8 space-y-6 text-center animate-reveal">
            <span className="text-5xl">🛑</span>
            <h1 className="text-2xl font-black uppercase tracking-tighter text-black">
              RESTRICTED PORTAL
            </h1>
            <p className="text-sm text-neutral-600 leading-relaxed">
              This terminal is dedicated exclusively to verified Legal Professionals subscribed to RedTape. Please authenticate to access case management logs.
            </p>
            <button
              onClick={() => router.push("/login")}
              className="swiss-btn-primary w-full justify-center"
            >
              Go to Login Page
            </button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 space-y-6">
        
        {/* Dashboard Header Banner */}
        <div className="border-2 border-black bg-white animate-reveal">
          <div className="border-b-2 border-black px-6 py-3 flex justify-between items-center swiss-diagonal">
            <span className="swiss-section-number">07. Manage Cases</span>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-ping"></span>
              <span className="text-[10px] font-bold tracking-wider uppercase text-black">
                Session Active: Counsel {lawyerName}
              </span>
            </div>
          </div>
          <div className="p-6 md:p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-black leading-none">
                Lawyer Cases Console
              </h1>
              <p className="text-sm font-medium text-black/60 mt-2 max-w-xl">
                Edit active case notices, review client files, update filing timelines, and coordinate legal actions under your active RedTape subscription.
              </p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="swiss-btn-primary py-3 px-6 text-xs"
            >
              ➕ Register New Case
            </button>
          </div>
        </div>

        {/* Dashboard Grid Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left panel: Active Cases List */}
          <div className="col-span-1 lg:col-span-4 border-2 border-black bg-white animate-reveal [animation-delay:100ms] h-[600px] flex flex-col">
            <div className="border-b-2 border-black p-4 bg-neutral-50 flex justify-between items-center">
              <span className="swiss-label text-black font-black">Active Files ({cases.length})</span>
              <span className="text-[10px] font-mono text-neutral-400">ORDER: RECENT</span>
            </div>
            
            <div className="flex-1 overflow-y-auto divide-y-2 divide-black">
              {cases.map((c) => {
                const isActive = c.id === selectedCaseId
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCaseId(c.id)}
                    className={`w-full text-left p-4 transition-all duration-150 flex flex-col space-y-2 cursor-pointer ${
                      isActive ? "bg-black text-white" : "bg-white text-black hover:bg-neutral-50"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className={`text-[10px] font-mono border px-1.5 py-0.5 font-bold uppercase ${
                        isActive ? "border-white/40 text-white" : "border-black/20 text-neutral-500"
                      }`}>
                        {c.id}
                      </span>
                      <span className={`text-[9px] font-bold tracking-widest px-2 py-0.5 ${
                        c.status === "ACTIVE" 
                          ? "bg-green-500 text-white" 
                          : c.status === "PENDING SIGNATURE" 
                            ? "bg-amber-500 text-black" 
                            : "bg-blue-500 text-white"
                      }`}>
                        {c.status}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-black text-xs uppercase tracking-tight leading-snug line-clamp-1">
                        {c.clientName}
                      </h4>
                      <p className={`text-[11px] leading-tight line-clamp-2 mt-1 ${
                        isActive ? "text-white/70" : "text-black/60"
                      }`}>
                        {c.caseTitle}
                      </p>
                    </div>
                    <div className="flex justify-between items-center pt-2 text-[9px] font-medium opacity-60">
                      <span>DOC: NOTICE</span>
                      <span>Filed: {c.dateCreated}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Right panel: Notice Viewer, Editor & Actions */}
          <div className="col-span-1 lg:col-span-8 border-2 border-black bg-white animate-reveal [animation-delay:200ms] h-[600px] flex flex-col">
            {selectedCase ? (
              <>
                {/* Panel Header */}
                <div className="border-b-2 border-black p-4 bg-neutral-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono text-neutral-400">CURRENTLY MANAGING: {selectedCase.id}</span>
                    <h3 className="font-black text-sm uppercase tracking-tight text-black mt-0.5">
                      {selectedCase.clientName} — {selectedCase.caseTitle}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-black/60 uppercase">Status:</span>
                    <select
                      value={selectedCase.status}
                      onChange={(e) => handleUpdateStatus(e.target.value as any)}
                      className="border-2 border-black bg-white text-xs font-bold px-2 py-1 outline-none"
                    >
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="PENDING SIGNATURE">PENDING SIGNATURE</option>
                      <option value="RESOLVED">RESOLVED</option>
                    </select>
                  </div>
                </div>

                {/* Panel Content Workspace */}
                <div className="flex-1 flex flex-col p-6 overflow-y-auto space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="space-y-0.5">
                      <span className="swiss-section-number">Notice Document File</span>
                      <h4 className="font-black text-xs uppercase tracking-tight text-neutral-700">
                        {selectedCase.noticeTitle}
                      </h4>
                    </div>

                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="text-xs font-bold uppercase tracking-wider text-[#FF3000] border-b-2 border-transparent hover:border-[#FF3000] pb-0.5"
                      >
                        ✍️ Edit Notice Text
                      </button>
                    ) : (
                      <div className="flex gap-3">
                        <button
                          onClick={handleSaveNotice}
                          className="text-xs font-bold uppercase tracking-wider text-green-600 hover:text-green-700"
                        >
                          💾 Save Changes
                        </button>
                        <button
                          onClick={() => {
                            setEditNotice(selectedCase.noticeContent)
                            setIsEditing(false)
                          }}
                          className="text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-neutral-600"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Notice Content Box */}
                  <div className="flex-1 flex flex-col border-2 border-black bg-neutral-50 p-4 font-mono text-xs relative swiss-noise min-h-[300px]">
                    <div className="absolute top-2 right-2 text-[9px] font-mono text-neutral-400 select-none">
                      REDTAPE_PREVIEW // DRAFT_MODE
                    </div>

                    {isEditing ? (
                      <textarea
                        value={editNotice}
                        onChange={(e) => setEditNotice(e.target.value)}
                        className="flex-1 w-full bg-white border-2 border-black p-4 outline-none font-mono text-xs leading-relaxed resize-none focus:border-[#FF3000]"
                      />
                    ) : (
                      <div className="flex-1 whitespace-pre-wrap leading-relaxed text-black/85 bg-white p-4 border border-neutral-300 shadow-inner overflow-y-auto">
                        {selectedCase.noticeContent}
                      </div>
                    )}
                  </div>
                </div>

                {/* Panel Footer Actions */}
                <div className="border-t-2 border-black p-4 bg-neutral-50 flex flex-wrap gap-3 justify-between items-center">
                  <span className="text-[10px] font-mono text-neutral-500">
                    Last modified: Today
                  </span>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => alert("PDF successfully compiled and downloaded to local downloads directory.")}
                      className="border-2 border-black px-4 py-2 bg-white text-black hover:bg-neutral-100 text-[10px] font-black uppercase tracking-wider transition-colors"
                    >
                      🖨️ Download PDF
                    </button>
                    <button
                      onClick={() => {
                        const email = prompt("Enter client/respondent email address:", "recipient@domain.com")
                        if (email) alert(`Legal notice served to ${email} successfully via RedTape Verified Mail.`)
                      }}
                      className="swiss-btn-primary h-9 px-4 text-[10px]"
                    >
                      ✉️ Serve / Send Email
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex justify-center items-center text-center p-12">
                <p className="text-neutral-500 text-xs uppercase tracking-widest font-black">
                  No active cases found. Please create a new case to start managing files.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Add Case Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-center items-center p-4">
            <div className="bg-white border-2 border-black max-w-xl w-full max-h-[90vh] flex flex-col animate-reveal">
              <div className="border-b-2 border-black p-4 bg-black text-white flex justify-between items-center">
                <span className="swiss-label text-white">➕ Register Active File</span>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-white hover:text-[#FF3000] font-black text-sm"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddCase} className="p-6 overflow-y-auto space-y-4">
                <div>
                  <label className="swiss-label text-black/60 block mb-1">Client Full Name</label>
                  <input
                    type="text"
                    required
                    value={newClient}
                    onChange={(e) => setNewClient(e.target.value)}
                    placeholder="E.g., Devendra Sharma"
                    className="swiss-input"
                  />
                </div>

                <div>
                  <label className="swiss-label text-black/60 block mb-1">Case Dispute Name / Title</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="E.g., Security Deposit Recovery dispute"
                    className="swiss-input"
                  />
                </div>

                <div>
                  <label className="swiss-label text-black/60 block mb-1">Notice Document Title</label>
                  <input
                    type="text"
                    required
                    value={newNoticeTitle}
                    onChange={(e) => setNewNoticeTitle(e.target.value)}
                    placeholder="E.g., Legal Notice under Section 21 of Arbitration Act"
                    className="swiss-input"
                  />
                </div>

                <div>
                  <label className="swiss-label text-black/60 block mb-1">Draft Notice Content / Body</label>
                  <textarea
                    required
                    value={newNoticeContent}
                    onChange={(e) => setNewNoticeContent(e.target.value)}
                    placeholder="Write or copy notice details..."
                    className="swiss-textarea h-40"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="border border-black px-4 py-2 hover:bg-neutral-100 text-xs font-bold uppercase"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="swiss-btn-primary h-10 px-6 text-xs"
                  >
                    Register File
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Subscription status block — extremely premium HSL red details */}
        <div className="border-2 border-black bg-white p-6 animate-reveal [animation-delay:300ms]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            {/* Left side: Subscription Info */}
            <div className="space-y-2">
              <span className="swiss-section-number">Subscription Ledger</span>
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-black uppercase tracking-tight text-black">
                  RedTape Professional Suite
                </h3>
                <span className="bg-[#FF3000] text-white text-[9px] font-black tracking-widest px-2 py-0.5 uppercase flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse"></span>
                  Active
                </span>
              </div>
              <p className="text-xs text-neutral-600 font-medium">
                Plan features unlimited legal notice edits, court format recommendations, and smart LLM clause reviews.
              </p>
            </div>

            {/* Right side: Progress Bar & Renew */}
            <div className="w-full md:max-w-md space-y-3">
              <div className="flex justify-between items-end text-xs font-bold">
                <span className="uppercase text-black/60">Subscription Lifecycle</span>
                <span className="text-[#FF3000] uppercase font-black">{subscriptionDaysRemaining} Days Active Remaining</span>
              </div>
              
              {/* Premium Progress Bar */}
              <div className="swiss-progress border border-black">
                <div 
                  className="swiss-progress-bar bg-[#FF3000]"
                  style={{ width: `${subscriptionPercent}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-[10px] font-mono text-neutral-400">
                <span>Active since: June 2025</span>
                <span>Expires: January 22, 2027</span>
              </div>

              {/* Interactive Renew Button */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleRenewSubscription}
                  disabled={showRenewModal}
                  className="swiss-btn-secondary py-2 px-4 text-[10px] h-9"
                >
                  {showRenewModal ? "Processing Extension..." : "🔄 Extend Professional Plan"}
                </button>
              </div>
            </div>

          </div>
        </div>

      </main>
      
      <Footer />
    </div>
  )
}
