"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function LoginRedirect() {
  const router = useRouter()
  
  useEffect(() => {
    router.replace("/")
  }, [router])

  return (
    <div className="min-h-screen bg-white flex justify-center items-center">
      <div className="animate-spin h-6 w-6 border-2 border-black border-t-transparent"></div>
    </div>
  )
}
