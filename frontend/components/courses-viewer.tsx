"use client"

import { useState } from "react"
import { DocumentChatbot } from "./document-chatbot"

interface Course {
  id: string
  title: string
  description: string
  lessons: string[]
}

const COURSES: Course[] = [
  {
    id: "indian-contract-law-101",
    title: "Indian Contract Law 101",
    description: "Learn the basics of contract law in India, what makes an agreement legally binding, and how to spot unfair clauses.",
    lessons: ["1. Introduction to Contracts", "2. Offer and Acceptance", "3. Void and Voidable Contracts", "4. Breach of Contract"],
  },
  {
    id: "consumer-rights",
    title: "Understanding Consumer Rights",
    description: "A comprehensive guide to your rights as a consumer in India and how to approach the Consumer Court.",
    lessons: ["1. Who is a Consumer?", "2. Unfair Trade Practices", "3. Filing a Complaint", "4. Consumer Courts"],
  },
  {
    id: "labor-laws",
    title: "Labor Laws & Employee Rights",
    description: "Understand your rights as an employee, including minimum wage, termination, and workplace safety.",
    lessons: ["1. Minimum Wages Act", "2. Unfair Dismissal", "3. Workplace Harassment", "4. PF and Gratuity Basics"],
  },
]

export function CoursesViewer() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)

  if (selectedCourse) {
    const courseContext = `You are an expert legal teacher for the course: "${selectedCourse.title}". 
The course covers the following topics:
${selectedCourse.lessons.join("\n")}
Course description: ${selectedCourse.description}

Your goal is to act as a helpful teacher. Break down complex legal jargon into easy-to-understand concepts for an Indian citizen.
Answer the student's questions, guide them through the lessons, and provide practical examples.`

    return (
      <div className="space-y-6 animate-in fade-in duration-200">
        <button
          className="swiss-btn-ghost text-xs"
          onClick={() => setSelectedCourse(null)}
        >
          ← Back to Courses
        </button>
        <div className="border-2 border-black">
          <div className="border-b-2 border-black px-6 py-4 swiss-grid-pattern">
            <h2 className="font-black text-xl uppercase tracking-tighter">{selectedCourse.title}</h2>
            <p className="text-sm font-medium text-black/60 mt-1">{selectedCourse.description}</p>
          </div>
          <div className="p-6 md:p-8">
            <p className="swiss-label mb-4 text-[#FF3000]">Course Syllabus</p>
            <ul className="space-y-2 mb-8">
              {selectedCourse.lessons.map(lesson => (
                <li key={lesson} className="text-sm font-medium text-black/80">{lesson}</li>
              ))}
            </ul>
            <p className="swiss-label mb-4 text-[#FF3000]">Ask Your Teacher</p>
            <DocumentChatbot
              documentContext={courseContext}
              documentName={`Teacher for ${selectedCourse.title}`}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {COURSES.map(course => (
        <div key={course.id} className="border-2 border-black flex flex-col group transition-colors hover:border-[#FF3000]">
          <div className="p-6 flex-1">
            <p className="swiss-label mb-2 text-[#FF3000]">Course</p>
            <h3 className="font-black text-lg uppercase tracking-tight mb-3 group-hover:text-[#FF3000] transition-colors">{course.title}</h3>
            <p className="text-sm font-medium text-black/70 leading-relaxed">{course.description}</p>
          </div>
          <div className="border-t-2 border-black p-4">
            <button
              onClick={() => setSelectedCourse(course)}
              className="swiss-btn-primary w-full justify-center"
            >
              Start Course
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
