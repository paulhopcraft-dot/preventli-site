"use client";

import { useState, useEffect, useRef } from "react";

type AssessmentType = "individual" | "psychosocial" | "wellbeing";

const individualRiskQuestions = [
  {
    category: "Absenteeism - Off the Job",
    questions: [
      "Excessive sick leave",
      "Frequent Monday and/or Friday absences",
      "Higher absenteeism rate than other employees",
      "Instances of unauthorised leave",
      "Failing to report absences in appropriate timeframes",
      "Improbable excuses for absences",
      "Lateness in the mornings or returning from lunch",
      "Previous Workers' Compensation claims (Lost Time)",
    ],
  },
  {
    category: "Absenteeism - On the Job",
    questions: [
      "Continued absences from workspace",
      "Frequent trips to toilet, coffee machine or water fountain",
      "Long coffee breaks",
      "Frequent cigarette breaks",
      "Leaving work early",
      "Frequent visits to medical centre, HR, etc.",
      "Missing or being late to scheduled meetings",
    ],
  },
  {
    category: "Accident Rate",
    questions: [
      "Accidents on the job",
      "Accidents off the job (affecting job performance)",
      "Other employees involved in accidents caused by this person",
      "Near misses",
    ],
  },
  {
    category: "Concentration and Application",
    questions: [
      "Difficulty recalling instructions or job details",
      "Job takes more time than anticipated",
      "Unable to recognise mistakes",
      "Slow or unwilling to learn new tasks",
      "Uneven work patterns – alternate periods of high/low productivity",
    ],
  },
  {
    category: "Job Efficiency",
    questions: [
      "Missed deadlines",
      "Frequent mistakes",
      "Wasting material",
      "Making bad decisions",
    ],
  },
  {
    category: "Employee Relations",
    questions: [
      "Over-reaction to real or imagined criticism",
      "Wide swings in morale",
      "Borrowing money from co-workers",
      "Complaints from co-workers",
      "Avoidance of co-workers",
      "Involved in conflicts or disputes",
    ],
  },
  {
    category: "Performance Management",
    questions: [
      "Informal counselling relating to performance and behaviour",
      "Formal written warning",
      "Final warning",
    ],
  },
  {
    category: "General Presentation",
    questions: [
      "Coming to work in obviously abnormal condition",
      "Intoxicated or drunk on the job",
      "Complaints from customers or public",
      "Improbable excuses for poor performance",
      "Lack of attention to personal grooming",
    ],
  },
  {
    category: "Injury History",
    questions: [
      "Serious injury",
      "Sprain or strain injury > one week off work",
      "Minor injury > one day off work",
    ],
  },
  {
    category: "Employment Duration",
    questions: [
      "Employed less than 1 week",
      "Employed less than 3 months",
      "Employed less than 6 months",
    ],
  },
  {
    category: "Nature of Work",
    questions: ["Physically strenuous", "Repetitive", "Boring/unstimulating"],
  },
  {
    category: "Age Factor",
    questions: ["Under 25 years of age", "Over 45 years of age"],
  },
  {
    category: "Suitable Duties",
    questions: [
      "Unable to provide duties within restrictions",
      "Doctor certifying worker unfit despite existence of suitable duties",
    ],
  },
];

const psychosocialQuestions = [
  {
    category: "Job Demands",
    questions: [
      "Excessive workload or work pace",
      "Insufficient time to complete tasks",
      "Conflicting or unclear job expectations",
      "High emotional demands from customers/clients",
      "Low job variety or repetitive tasks",
    ],
  },
  {
    category: "Job Control",
    questions: [
      "Little control over work tasks or methods",
      "Limited participation in decision-making",
      "Insufficient skills or training for role",
      "No flexibility in work hours or breaks",
      "Limited career development opportunities",
    ],
  },
  {
    category: "Support",
    questions: [
      "Poor supervisor support or feedback",
      "Limited peer support or teamwork",
      "Inadequate resources or equipment",
      "Lack of recognition or reward",
      "Isolated working conditions",
    ],
  },
  {
    category: "Relationships",
    questions: [
      "Workplace conflict or bullying",
      "Poor communication between staff",
      "Discrimination or harassment",
      "Toxic or negative workplace culture",
      "Lack of respect from colleagues or management",
    ],
  },
  {
    category: "Role Clarity",
    questions: [
      "Unclear job role or responsibilities",
      "Conflicting demands from different managers",
      "Frequent organisational change",
      "Job insecurity or fear of redundancy",
      "Inadequate induction or onboarding",
    ],
  },
  {
    category: "Work-Life Balance",
    questions: [
      "Long working hours or excessive overtime",
      "Work interfering with personal/family time",
      "No adequate rest breaks or leave",
      "On-call or shift work disrupting sleep",
      "Travel demands affecting home life",
    ],
  },
];

const wellbeingQuestions = [
  {
    category: "Leadership & Culture",
    questions: [
      "Senior leaders prioritise health and wellbeing",
      "Managers actively support work-life balance",
      "Open communication about mental health",
      "Regular wellbeing check-ins or surveys",
      "Wellbeing integrated into business strategy",
    ],
  },
  {
    category: "Physical Health Support",
    questions: [
      "Ergonomic assessments and equipment provided",
      "Access to health screenings or flu vaccinations",
      "Encouragement of physical activity or exercise",
      "Healthy food options available at work",
      "Early intervention programs for injuries",
    ],
  },
  {
    category: "Mental Health Support",
    questions: [
      "Employee Assistance Program (EAP) available",
      "Mental health training for managers",
      "Stigma-free environment for mental health discussions",
      "Access to counselling or psychological support",
      "Stress management or resilience programs",
    ],
  },
  {
    category: "Work Design",
    questions: [
      "Reasonable and achievable workloads",
      "Flexible working arrangements available",
      "Job variety and opportunities for skill development",
      "Clear policies on working hours and overtime",
      "Regular breaks encouraged and monitored",
    ],
  },
  {
    category: "Return to Work & Rehabilitation",
    questions: [
      "Structured return-to-work programs in place",
      "Access to medical professionals for early intervention",
      "Suitable duties available for injured workers",
      "Proactive management of workers compensation claims",
      "Support for workers with chronic health conditions",
    ],
  },
  {
    category: "Measurement & Review",
    questions: [
      "Regular tracking of absenteeism and injury rates",
      "Wellbeing metrics reported to leadership",
      "Action plans developed from employee feedback",
      "Wellbeing initiatives regularly reviewed and improved",
      "Benchmarking against industry standards",
    ],
  },
];

export default function RiskAssessment() {
  const [assessmentType, setAssessmentType] =
    useState<AssessmentType>("individual");
  const [responses, setResponses] = useState<Record<string, boolean>>({});
  const [showResults, setShowResults] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );
    const el = ref.current;
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleToggle = (key: string) => {
    setResponses((prev) => ({ ...prev, [key]: !prev[key] }));
    setShowResults(false);
  };

  const calculateScore = () => {
    const total = Object.values(responses).filter(Boolean).length;
    return total;
  };

  const getMaxScore = () => {
    let max = 0;
    if (assessmentType === "individual") {
      individualRiskQuestions.forEach((cat) => (max += cat.questions.length));
    } else if (assessmentType === "psychosocial") {
      psychosocialQuestions.forEach((cat) => (max += cat.questions.length));
    } else {
      wellbeingQuestions.forEach((cat) => (max += cat.questions.length));
    }
    return max;
  };

  const getRiskLevel = (score: number, max: number) => {
    const percentage = (score / max) * 100;
    if (assessmentType === "wellbeing") {
      // Inverted for wellbeing (higher = better)
      if (percentage >= 70)
        return { level: "Excellent", color: "text-green-500", bg: "bg-green-50" };
      if (percentage >= 50)
        return { level: "Good", color: "text-blue-500", bg: "bg-blue-50" };
      if (percentage >= 30)
        return {
          level: "Moderate",
          color: "text-amber-500",
          bg: "bg-amber-50",
        };
      return { level: "At Risk", color: "text-red-500", bg: "bg-red-50" };
    } else {
      // Normal risk assessment (higher = worse)
      if (percentage >= 60)
        return { level: "High Risk", color: "text-red-500", bg: "bg-red-50" };
      if (percentage >= 40)
        return {
          level: "Moderate Risk",
          color: "text-amber-500",
          bg: "bg-amber-50",
        };
      if (percentage >= 20)
        return { level: "Low Risk", color: "text-blue-500", bg: "bg-blue-50" };
      return {
        level: "Minimal Risk",
        color: "text-green-500",
        bg: "bg-green-50",
      };
    }
  };

  const resetAssessment = () => {
    setResponses({});
    setShowResults(false);
  };

  const handleSubmit = () => {
    setShowResults(true);
    // Scroll to results
    setTimeout(() => {
      document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const currentQuestions =
    assessmentType === "individual"
      ? individualRiskQuestions
      : assessmentType === "psychosocial"
      ? psychosocialQuestions
      : wellbeingQuestions;

  const score = calculateScore();
  const maxScore = getMaxScore();
  const risk = getRiskLevel(score, maxScore);

  return (
    <section id="risk-assessment" className="py-20 bg-white">
      <div
        ref={ref}
        className="section-observe max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="text-center mb-12">
          <span className="text-[#00E676] text-sm font-semibold uppercase tracking-widest">
            Free Risk Assessment
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0A1628] mt-3 mb-4">
            Identify risks before they become claims
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Use our evidence-based assessment tools to evaluate individual
            worker risk, organizational psychosocial hazards, and overall
            workplace wellbeing.
          </p>
        </div>

        {/* Assessment Type Selector */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10 justify-center">
          <button
            onClick={() => {
              setAssessmentType("individual");
              resetAssessment();
            }}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              assessmentType === "individual"
                ? "bg-[#00E676] text-[#0A1628]"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Individual Worker Risk
          </button>
          <button
            onClick={() => {
              setAssessmentType("psychosocial");
              resetAssessment();
            }}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              assessmentType === "psychosocial"
                ? "bg-[#00E676] text-[#0A1628]"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Psychosocial Hazards
          </button>
          <button
            onClick={() => {
              setAssessmentType("wellbeing");
              resetAssessment();
            }}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              assessmentType === "wellbeing"
                ? "bg-[#00E676] text-[#0A1628]"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Health & Wellbeing Profile
          </button>
        </div>

        {/* Questions */}
        <div className="bg-[#F8F9FA] rounded-2xl p-6 sm:p-8 mb-8">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-[#0A1628] mb-2">
              {assessmentType === "individual" && "Individual Worker Assessment"}
              {assessmentType === "psychosocial" &&
                "Organizational Psychosocial Hazards"}
              {assessmentType === "wellbeing" &&
                "Organizational Health & Wellbeing"}
            </h3>
            <p className="text-gray-600 text-sm">
              {assessmentType === "individual" &&
                "Check all items that apply to the worker being assessed."}
              {assessmentType === "psychosocial" &&
                "Check all psychosocial hazards present in your organization."}
              {assessmentType === "wellbeing" &&
                "Check all items that are currently in place at your organization."}
            </p>
          </div>

          <div className="space-y-6">
            {currentQuestions.map((category, catIndex) => (
              <div key={catIndex} className="space-y-3">
                <h4 className="font-semibold text-[#0A1628] text-sm uppercase tracking-wide">
                  {category.category}
                </h4>
                <div className="space-y-2">
                  {category.questions.map((question, qIndex) => {
                    const key = `${catIndex}-${qIndex}`;
                    return (
                      <label
                        key={key}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-white transition-colors cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={responses[key] || false}
                          onChange={() => handleToggle(key)}
                          className="mt-1 w-4 h-4 text-[#00E676] focus:ring-[#00E676] rounded border-gray-300"
                        />
                        <span className="text-gray-700 text-sm flex-1">
                          {question}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Current Score */}
          <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Current Score:</span>
              <span className="text-2xl font-bold text-[#0A1628]">
                {score} / {maxScore}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={handleSubmit}
              className="flex-1 bg-[#00E676] text-[#0A1628] px-6 py-3 rounded-lg font-semibold hover:bg-[#00D168] transition-all"
            >
              Get Risk Assessment
            </button>
            <button
              onClick={resetAssessment}
              className="px-6 py-3 rounded-lg font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Results */}
        {showResults && (
          <div
            id="results"
            className={`${risk.bg} rounded-2xl p-6 sm:p-8 border-2 ${risk.color.replace("text-", "border-")}`}
          >
            <div className="text-center mb-6">
              <h3 className={`text-3xl font-bold ${risk.color} mb-2`}>
                {risk.level}
              </h3>
              <p className="text-gray-700">
                Score: {score} out of {maxScore} ({Math.round((score / maxScore) * 100)}
                %)
              </p>
            </div>

            <div className="prose prose-sm max-w-none text-gray-700">
              {assessmentType === "individual" && (
                <>
                  <h4 className="font-bold text-[#0A1628]">Recommendations:</h4>
                  {score >= maxScore * 0.6 ? (
                    <ul>
                      <li>
                        <strong>Immediate Action Required:</strong> This worker
                        shows multiple high-risk indicators. Consider immediate
                        intervention, medical assessment, and workload review.
                      </li>
                      <li>
                        Engage a medical professional through our telehealth
                        network for early assessment.
                      </li>
                      <li>
                        Review suitable duties and potential workplace
                        modifications.
                      </li>
                      <li>
                        Document all interventions and monitor closely for 30
                        days.
                      </li>
                    </ul>
                  ) : score >= maxScore * 0.4 ? (
                    <ul>
                      <li>
                        <strong>Moderate Risk:</strong> Implement preventive
                        measures and closer supervision.
                      </li>
                      <li>
                        Schedule a wellbeing check-in with the worker within 7
                        days.
                      </li>
                      <li>
                        Review workload, training needs, and any recent changes
                        affecting performance.
                      </li>
                      <li>
                        Consider ergonomic assessment or job rotation if work is
                        repetitive/strenuous.
                      </li>
                    </ul>
                  ) : (
                    <ul>
                      <li>
                        <strong>Low Risk:</strong> Continue standard monitoring
                        and support.
                      </li>
                      <li>
                        Maintain regular performance reviews and open
                        communication.
                      </li>
                      <li>
                        Ensure worker is aware of support services available.
                      </li>
                    </ul>
                  )}
                </>
              )}

              {assessmentType === "psychosocial" && (
                <>
                  <h4 className="font-bold text-[#0A1628]">Recommendations:</h4>
                  {score >= maxScore * 0.6 ? (
                    <ul>
                      <li>
                        <strong>Critical Risk:</strong> Multiple psychosocial
                        hazards identified. Immediate organizational intervention
                        required.
                      </li>
                      <li>
                        Conduct comprehensive workplace culture review and staff
                        consultation.
                      </li>
                      <li>
                        Implement anti-bullying and harassment policies if not in
                        place.
                      </li>
                      <li>
                        Engage external WHS consultant for psychosocial risk
                        management plan.
                      </li>
                      <li>
                        Consider leadership training and organizational change
                        management.
                      </li>
                    </ul>
                  ) : score >= maxScore * 0.4 ? (
                    <ul>
                      <li>
                        <strong>Moderate Risk:</strong> Several psychosocial
                        hazards present. Action plan recommended.
                      </li>
                      <li>
                        Prioritize the highest-risk areas identified (e.g., job
                        demands, support, relationships).
                      </li>
                      <li>
                        Conduct employee surveys to understand specific concerns.
                      </li>
                      <li>
                        Implement manager training on psychosocial risk
                        awareness.
                      </li>
                      <li>
                        Review and improve communication, workload management,
                        and support systems.
                      </li>
                    </ul>
                  ) : (
                    <ul>
                      <li>
                        <strong>Low Risk:</strong> Your organization is managing
                        psychosocial hazards well.
                      </li>
                      <li>
                        Continue regular monitoring through employee surveys and
                        feedback.
                      </li>
                      <li>
                        Maintain focus on early identification and proactive
                        intervention.
                      </li>
                      <li>
                        Consider benchmarking against industry best practice.
                      </li>
                    </ul>
                  )}
                </>
              )}

              {assessmentType === "wellbeing" && (
                <>
                  <h4 className="font-bold text-[#0A1628]">Recommendations:</h4>
                  {score >= maxScore * 0.7 ? (
                    <ul>
                      <li>
                        <strong>Excellent:</strong> Your organization has strong
                        health and wellbeing foundations in place.
                      </li>
                      <li>
                        Continue measuring outcomes and refining programs based
                        on data.
                      </li>
                      <li>
                        Share your success internally and consider case studies
                        or benchmarking participation.
                      </li>
                      <li>
                        Explore advanced initiatives like mental health first aid
                        or resilience training.
                      </li>
                    </ul>
                  ) : score >= maxScore * 0.5 ? (
                    <ul>
                      <li>
                        <strong>Good Foundation:</strong> You have several
                        wellbeing initiatives in place. Opportunity to expand.
                      </li>
                      <li>
                        Identify gaps (e.g., mental health support, physical
                        health programs, work design).
                      </li>
                      <li>
                        Increase leadership visibility and communication around
                        wellbeing priorities.
                      </li>
                      <li>
                        Implement measurement systems to track absenteeism,
                        injuries, and engagement.
                      </li>
                    </ul>
                  ) : (
                    <ul>
                      <li>
                        <strong>Significant Improvement Needed:</strong> Limited
                        wellbeing support currently in place.
                      </li>
                      <li>
                        Start with foundational programs: EAP, ergonomic
                        assessments, return-to-work processes.
                      </li>
                      <li>
                        Engage leadership to prioritize wellbeing as a strategic
                        business priority.
                      </li>
                      <li>
                        Consider engaging a wellbeing consultant or accessing
                        Preventli's platform for structured support.
                      </li>
                      <li>
                        Set measurable goals and review progress quarterly.
                      </li>
                    </ul>
                  )}
                </>
              )}
            </div>

            <div className="mt-6 p-4 bg-white rounded-lg">
              <h4 className="font-bold text-[#0A1628] mb-2">
                Want expert help?
              </h4>
              <p className="text-gray-700 text-sm mb-4">
                Preventli's AI-powered platform automates risk assessment,
                provides real-time alerts, and connects you with WHS consultants
                and telehealth doctors for immediate support.
              </p>
              <a
                href="#contact"
                className="inline-block bg-[#0A1628] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#1a2638] transition-all"
              >
                Book a Free Consultation
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
