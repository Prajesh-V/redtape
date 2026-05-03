// FILE: frontend/components/lawyer-card.tsx

interface LawyerProps {
  lawyer: {
    id: string
    name: string
    experience: string
    location: string
    rating: number
    contact: string
    bio?: string
  }
}

export function LawyerCard({ lawyer }: LawyerProps) {
  return (
    <div className="group p-6 transition-colors duration-150 hover:bg-black hover:text-white">

      {/* Rating badge — top right */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex h-10 w-10 items-center justify-center border-2 border-current bg-[#F2F2F2] group-hover:bg-white group-hover:text-black flex-shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
        <span className="swiss-label text-[#FF3000] group-hover:text-[#FF3000]">
          ★ {lawyer.rating}
        </span>
      </div>

      {/* Name */}
      <h3 className="font-black text-sm uppercase tracking-tight mb-1">{lawyer.name}</h3>

      {/* Location + Experience */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-1">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">{lawyer.location}</span>
        </div>
        <span className="text-black/20 group-hover:text-white/20">|</span>
        <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">{lawyer.experience}</span>
      </div>

      {/* Bio */}
      {lawyer.bio && (
        <p className="text-xs font-medium leading-relaxed text-black/60 group-hover:text-white/60 mb-5">
          {lawyer.bio}
        </p>
      )}

      {/* Contact CTA */}
      <a
        href={`mailto:${lawyer.contact}`}
        className="flex items-center gap-2 border-2 border-current px-4 py-2.5 text-[10px] font-black uppercase tracking-widest transition-colors duration-150 hover:bg-[#FF3000] hover:border-[#FF3000] hover:text-white group-hover:border-white"
        aria-label={`Email ${lawyer.name}`}
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
        </svg>
        Consult Professional
      </a>
    </div>
  )
}