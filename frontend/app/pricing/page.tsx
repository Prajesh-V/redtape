"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

// Plan interfaces
interface Plan {
  name: string
  subtitle: string
  monthlyPrice: number
  yearlyPrice: number
  description: string
  features: string[]
  ctaText: string
  featured: boolean
  tag?: string
}

const PLANS: Plan[] = [
  {
    name: "FREE",
    subtitle: "For basic legal checks",
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: "Get immediate answers to simple legal questions and run initial documents checks.",
    features: [
      "5 Legal document generations",
      "5 Automated clause analyses",
      "Limited chatbot tokens",
      "5% Lawyer match commission",
      "Standard PDF exports"
    ],
    ctaText: "Get Started",
    featured: false
  },
  {
    name: "LITE",
    subtitle: "Most popular for citizens",
    monthlyPrice: 199,
    yearlyPrice: 159, // Billed annually: 1990/yr (~159/mo)
    description: "Designed for active freelancers, tenants, and families needing regular contract drafting.",
    features: [
      "30 Legal document generations",
      "30 Automated clause analyses",
      "Extended chatbot tokens",
      "2% Lawyer match commission",
      "Priority PDF rendering",
      "Document revision history"
    ],
    ctaText: "Choose Lite",
    featured: true,
    tag: "RECOMMENDED"
  },
  {
    name: "MAXX",
    subtitle: "The ultimate power tier",
    monthlyPrice: 999,
    yearlyPrice: 799, // Billed annually: 9590/yr (~799/mo)
    description: "Uncapped resources for heavy users, legal researchers, and small enterprise workflows.",
    features: [
      "Unlimited document generations",
      "Unlimited clause analyses",
      "Unlimited chatbot tokens",
      "0% Lawyer match commission",
      "Ultra-priority processing",
      "Full API access (Beta)",
      "24/7 AI dedicated support"
    ],
    ctaText: "Go Maxx",
    featured: false
  }
]

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  
  // Checkout flow states
  const [checkoutStep, setCheckoutStep] = useState<"form" | "processing" | "success">("form")
  const [fakeCardNumber, setFakeCardNumber] = useState("")
  const [fakeExpiry, setFakeExpiry] = useState("")
  const [fakeCvv, setFakeCvv] = useState("")
  const [fakeName, setFakeName] = useState("")
  const [paymentError, setPaymentError] = useState("")
  
  const handleOpenCheckout = (plan: Plan) => {
    setSelectedPlan(plan)
    setCheckoutStep("form")
    setFakeCardNumber("")
    setFakeExpiry("")
    setFakeCvv("")
    setFakeName("")
    setPaymentError("")
  }

  const handleCloseCheckout = () => {
    setSelectedPlan(null)
  }

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (selectedPlan?.monthlyPrice === 0) {
      // Free plan directly activates
      setCheckoutStep("processing")
      setTimeout(() => {
        setCheckoutStep("success")
      }, 1000)
      return
    }

    if (!fakeCardNumber.trim() || !fakeExpiry.trim() || !fakeCvv.trim() || !fakeName.trim()) {
      setPaymentError("All payment fields are required.")
      return
    }

    setPaymentError("")
    setCheckoutStep("processing")

    // Premium simulated delay
    setTimeout(() => {
      setCheckoutStep("success")
    }, 1800)
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      
      <main className="flex-1">
        {/* =====================================================
            HEADER — Asymmetric layout, big typography
            ===================================================== */}
        <div className="border-b-2 border-black">
          <div className="mx-auto max-w-7xl">
            <div className="border-b-2 border-black px-6 py-3 md:px-12">
              <span className="swiss-section-number">07. Pricing</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-12">
              <div className="col-span-8 px-6 py-12 md:border-r-2 md:border-black md:px-12 animate-reveal">
                <h1 className="font-black text-5xl md:text-7xl tracking-tighter uppercase leading-none text-black">
                  Zero<br />
                  <span className="text-[#FF3000]">Red Tape.</span><br />
                  Fair Rates.
                </h1>
              </div>
              <div className="col-span-4 flex items-end px-6 py-12 md:px-10 swiss-diagonal animate-reveal [animation-delay:150ms]">
                <div>
                  <p className="text-xs font-bold tracking-widest text-black/40 uppercase mb-3">
                    // TRANSPARENT SYSTEM
                  </p>
                  <p className="text-sm font-medium leading-relaxed text-black/60 max-w-xs">
                    Access premium document generation and robust clause check pipelines. Pay only for what you require. No hidden retention fees.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            TOGGLE — Billing Cycle Switcher
            ===================================================== */}
        <section className="border-b-2 border-black py-8 bg-neutral-50 relative">
          <div className="absolute inset-0 swiss-grid-pattern pointer-events-none opacity-40" />
          <div className="mx-auto max-w-7xl px-6 md:px-12 flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
            <div>
              <span className="swiss-label text-black/40">Select Cycle</span>
              <h2 className="text-lg font-black uppercase mt-1">Flexible Options</h2>
            </div>

            {/* Swiss billing switcher */}
            <div className="flex items-center gap-4">
              <span className={`text-xs font-bold tracking-wider uppercase transition-colors duration-150 ${billingCycle === "monthly" ? "text-black" : "text-black/40"}`}>
                Monthly Billing
              </span>
              <button 
                onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
                className="w-16 h-8 border-2 border-black bg-white flex items-center p-1 cursor-pointer transition-colors hover:border-[#FF3000]"
                aria-label="Toggle billing cycle"
              >
                <div className={`w-5 h-5 bg-black transition-transform duration-200 ${billingCycle === "yearly" ? "translate-x-8 bg-[#FF3000]" : "translate-x-0"}`} />
              </button>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold tracking-wider uppercase transition-colors duration-150 ${billingCycle === "yearly" ? "text-[#FF3000]" : "text-black/40"}`}>
                  Yearly Billing
                </span>
                <span className="text-[9px] font-bold bg-[#FF3000] text-white px-2 py-0.5 tracking-wider uppercase">
                  Save 20%
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            PRICING GRID — 3 Columns
            ===================================================== */}
        <section className="border-b-2 border-black">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-3">
              {PLANS.map((plan, index) => {
                const currentPrice = billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice
                const yearlyTotal = plan.yearlyPrice * 12
                
                return (
                  <div
                    key={plan.name}
                    className={`relative p-8 md:p-12 flex flex-col justify-between transition-all duration-150 group
                      ${index < 2 ? "border-b-2 md:border-b-0 border-black md:border-r-2" : ""}
                      ${plan.featured ? "bg-black text-white" : "bg-white text-black"}
                    `}
                  >
                    <div>
                      {/* Popular / Recommended Tag */}
                      {plan.featured && (
                        <div className="absolute top-0 right-0 left-0 bg-[#FF3000] text-white py-1 px-4 text-center text-[10px] font-black uppercase tracking-[0.2em] border-b-2 border-black">
                          {plan.tag}
                        </div>
                      )}

                      {/* Header */}
                      <div className="flex justify-between items-baseline mb-4 mt-4">
                        <h3 className="text-3xl font-black tracking-tighter uppercase">
                          {plan.name}
                        </h3>
                        {plan.featured && (
                          <span className="text-xs px-2 py-0.5 border border-white/40 text-[#FF3000] font-mono font-bold tracking-wider">
                            SECURE_X
                          </span>
                        )}
                      </div>
                      
                      <p className={`text-xs font-bold uppercase tracking-wider mb-8 ${plan.featured ? "text-[#FF3000]" : "text-black/50"}`}>
                        {plan.subtitle}
                      </p>

                      {/* Price Section */}
                      <div className="mb-8 border-y-2 py-6 border-current">
                        <div className="flex items-baseline gap-2">
                          <span className="text-5xl font-black tracking-tight">
                            ₹{currentPrice}
                          </span>
                          <span className="text-xs font-bold tracking-widest uppercase opacity-70">
                            / month
                          </span>
                        </div>
                        {billingCycle === "yearly" && plan.monthlyPrice > 0 && (
                          <p className="text-[10px] font-bold tracking-wider uppercase mt-2 text-[#FF3000]">
                            Billed annually (₹{yearlyTotal} total)
                          </p>
                        )}
                        {plan.monthlyPrice === 0 && (
                          <p className="text-[10px] font-bold tracking-wider uppercase mt-2 opacity-55">
                            Free forever framework
                          </p>
                        )}
                      </div>

                      <p className="text-sm leading-relaxed mb-8 font-medium opacity-80">
                        {plan.description}
                      </p>

                      {/* Divider */}
                      <div className="swiss-label text-[10px] opacity-40 mb-4 tracking-[0.2em]">
                        // Features Included
                      </div>

                      {/* Feature List */}
                      <ul className="space-y-4 mb-12">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-start text-xs font-semibold leading-normal">
                            {/* Custom Swiss Red Square Bullet */}
                            <span className="h-2 w-2 mt-1.5 mr-3 shrink-0 bg-[#FF3000]" aria-hidden="true" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA Button */}
                    <button
                      onClick={() => handleOpenCheckout(plan)}
                      className={`w-full justify-center ${
                        plan.featured 
                          ? "swiss-btn-secondary bg-white text-black hover:bg-neutral-100 hover:text-black border-2 border-white hover:border-[#FF3000]" 
                          : "swiss-btn-primary bg-black text-white hover:bg-[#FF3000] border-2 border-black"
                      }`}
                    >
                      {plan.ctaText}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* =====================================================
            FAQ SECTION — Swiss Grid Asymmetric
            ===================================================== */}
        <section className="bg-neutral-50 relative py-16 md:py-24">
          <div className="absolute inset-0 swiss-dots pointer-events-none opacity-50" />
          <div className="mx-auto max-w-7xl px-6 md:px-12 relative z-10">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Left header column */}
              <div className="lg:col-span-5">
                <span className="swiss-section-number">FAQ // DETAILS</span>
                <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mt-3 mb-6">
                  Frequently Asked Questions
                </h2>
                <div className="w-16 h-2 bg-[#FF3000]" />
              </div>

              {/* Right questions columns */}
              <div className="lg:col-span-7 space-y-8">
                {[
                  {
                    q: "Can I cancel my subscription at any time?",
                    a: "Yes. All paid subscriptions operate on a month-to-month or year-to-year basis. You can downgrade or cancel instantly through your user dashboard with zero penalty clauses."
                  },
                  {
                    q: "What count as 'Document Generations'?",
                    a: "Each legal notice drafted by our AI is a document generation. You can revise a drafted document as much as you like within 48 hours of initial draft without consuming extra plan credits."
                  },
                  {
                    q: "How does the Lawyer Find commission work?",
                    a: "When you hire a verified lawyer directly through our Find Lawyer matching tool, REDTAPE charges a small processing fee. While the Free tier requires a 5% commission on billing, the Lite tier lowers this to 2%, and Maxx users pay absolutely zero."
                  },
                  {
                    q: "Is contract analysis secure?",
                    a: "Absolutely. REDTAPE utilizes bank-grade, secure localized hashing. We do not store or read your uploaded contracts past active processing unless you explicitly save them to your secure storage directory."
                  }
                ].map((faq, i) => (
                  <div key={i} className="border-b border-black/10 pb-6">
                    <h3 className="text-base font-black uppercase tracking-tight text-black mb-3">
                      💡 {faq.q}
                    </h3>
                    <p className="text-sm font-medium leading-relaxed text-black/60">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>
      </main>

      {/* =====================================================
          CHECKOUT MODAL FLOW (Swiss Styled)
          ===================================================== */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-none p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white border-4 border-black animate-reveal">
            
            {/* Modal Header */}
            <div className="border-b-2 border-black p-6 bg-black text-white flex justify-between items-center">
              <div>
                <span className="text-[10px] font-mono text-[#FF3000] tracking-[0.25em] font-black">
                  TRANSACTION_SHELL_V1.1
                </span>
                <h3 className="text-2xl font-black uppercase tracking-tight mt-1">
                  Activate {selectedPlan.name}
                </h3>
              </div>
              <button 
                onClick={handleCloseCheckout}
                className="h-10 w-10 border border-white/30 flex items-center justify-center hover:bg-[#FF3000] hover:text-white transition-colors cursor-pointer text-white font-bold"
                aria-label="Close checkout"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 md:p-8">
              
              {checkoutStep === "form" && (
                <form onSubmit={handlePay} className="space-y-6">
                  
                  {/* Purchase Summary */}
                  <div className="border-2 border-black p-4 bg-neutral-50 space-y-2">
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs font-bold tracking-wider uppercase text-black/50">Plan Details:</span>
                      <span className="text-sm font-black uppercase">{selectedPlan.name} Tier</span>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs font-bold tracking-wider uppercase text-black/50">Billing Cycle:</span>
                      <span className="text-xs font-black uppercase text-[#FF3000]">{billingCycle} billing</span>
                    </div>
                    <div className="border-t border-black/10 pt-2 flex justify-between items-baseline">
                      <span className="text-xs font-black tracking-wider uppercase">Due Today:</span>
                      <span className="text-xl font-black">
                        ₹{billingCycle === "monthly" ? selectedPlan.monthlyPrice : selectedPlan.yearlyPrice * 12}
                      </span>
                    </div>
                  </div>

                  {selectedPlan.monthlyPrice > 0 ? (
                    <>
                      {/* Fake Payment Inputs */}
                      <div className="space-y-4">
                        <div>
                          <label className="swiss-label text-black/50 block mb-1">
                            Cardholder Name
                          </label>
                          <input 
                            type="text" 
                            required
                            value={fakeName}
                            onChange={(e) => setFakeName(e.target.value)}
                            placeholder="E.g., RAJESH SHARMA"
                            className="swiss-input uppercase font-mono"
                          />
                        </div>

                        <div>
                          <label className="swiss-label text-black/50 block mb-1">
                            Card Number
                          </label>
                          <input 
                            type="text" 
                            required
                            maxLength={19}
                            value={fakeCardNumber}
                            onChange={(e) => {
                              // Card spaces filter
                              const val = e.target.value.replace(/\D/g, "")
                              const matches = val.match(/\d{4,16}/g)
                              const match = (matches && matches[0]) || ""
                              const parts = []

                              for (let i = 0, len = match.length; i < len; i += 4) {
                                parts.push(match.substring(i, i + 4))
                              }

                              if (parts.length > 0) {
                                setFakeCardNumber(parts.join(" "))
                              } else {
                                setFakeCardNumber(val)
                              }
                            }}
                            placeholder="4111 2222 3333 4444"
                            className="swiss-input font-mono"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="swiss-label text-black/50 block mb-1">
                              Expiry Date
                            </label>
                            <input 
                              type="text" 
                              required
                              maxLength={5}
                              value={fakeExpiry}
                              onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, "")
                                if (val.length >= 2) {
                                  setFakeExpiry(val.substring(0, 2) + "/" + val.substring(2, 4))
                                } else {
                                  setFakeExpiry(val)
                                }
                              }}
                              placeholder="MM/YY"
                              className="swiss-input font-mono text-center"
                            />
                          </div>
                          <div>
                            <label className="swiss-label text-black/50 block mb-1">
                              CVV Secure Code
                            </label>
                            <input 
                              type="password" 
                              required
                              maxLength={3}
                              value={fakeCvv}
                              onChange={(e) => setFakeCvv(e.target.value.replace(/\D/g, ""))}
                              placeholder="•••"
                              className="swiss-input font-mono text-center"
                            />
                          </div>
                        </div>
                      </div>

                      {paymentError && (
                        <div className="border border-[#FF3000] bg-[#FF3000]/5 p-3 text-xs font-bold text-[#FF3000] uppercase tracking-wider">
                          ⚠️ Error: {paymentError}
                        </div>
                      )}

                      {/* Payment Action Button */}
                      <button type="submit" className="swiss-btn-primary w-full justify-center">
                        <span className="flex items-center gap-2">
                          💳 Secure Checkout
                        </span>
                      </button>
                    </>
                  ) : (
                    <>
                      {/* Free Plan Activation Details */}
                      <p className="text-xs font-medium leading-relaxed text-black/60">
                        Activation requires zero credit card holds. Click below to register the free credentials on your profile and start analysis pipelines.
                      </p>
                      
                      <button type="submit" className="swiss-btn-primary w-full justify-center">
                        Confirm Activation
                      </button>
                    </>
                  )}
                </form>
              )}

              {checkoutStep === "processing" && (
                <div className="py-12 flex flex-col items-center justify-center space-y-6">
                  {/* Processing animation spinner */}
                  <div className="h-14 w-14 border-4 border-black border-t-[#FF3000] animate-spin" />
                  <div className="text-center">
                    <span className="swiss-label text-black/40 block mb-2">// NET_TRANSMISSION</span>
                    <h4 className="text-lg font-black uppercase tracking-tight">
                      Processing Payment...
                    </h4>
                    <p className="text-xs font-medium text-black/50 mt-1">
                      Authorizing securely. Please do not close this modal.
                    </p>
                  </div>
                </div>
              )}

              {checkoutStep === "success" && (
                <div className="py-8 flex flex-col items-center justify-center text-center space-y-6 animate-reveal">
                  {/* Success indicator Swiss Red Cross */}
                  <div className="h-16 w-16 bg-[#FF3000] text-white flex items-center justify-center font-black text-3xl">
                    ✚
                  </div>
                  
                  <div>
                    <span className="swiss-section-number text-emerald-600 block mb-2">STATUS // SECURE_SUCCESS</span>
                    <h4 className="text-3xl font-black uppercase tracking-tighter">
                      Plan Activated!
                    </h4>
                    <p className="text-xs font-medium text-black/60 max-w-xs mt-3 leading-relaxed">
                      Your profile has been upgraded to the <strong>{selectedPlan.name}</strong> framework. High capacity pipelines have been assigned to your session.
                    </p>
                  </div>

                  <button 
                    onClick={handleCloseCheckout}
                    className="swiss-btn-primary px-8"
                  >
                    Enter Platform
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
