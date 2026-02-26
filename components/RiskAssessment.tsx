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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <button
            onClick={() => {
              setAssessmentType("individual");
              resetAssessment();
            }}
            className={`group relative overflow-hidden rounded-2xl p-6 text-left transition-all ${
              assessmentType === "individual"
                ? "bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-xl scale-105"
                : "bg-white border-2 border-gray-200 hover:border-violet-400 hover:shadow-lg"
            }`}
          >
            <div className="relative z-10">
              <div className="text-4xl mb-3">👤</div>
              <h3 className={`text-lg font-bold mb-2 ${
                assessmentType === "individual" ? "text-white" : "text-[#0A1628]"
              }`}>
                Individual Worker Risk
              </h3>
              <p className={`text-sm ${
                assessmentType === "individual" ? "text-white/90" : "text-gray-600"
              }`}>
                Identify at-risk employees before injuries occur
              </p>
            </div>
            {assessmentType === "individual" && (
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 to-purple-700/20 animate-pulse" />
            )}
          </button>
          
          <button
            onClick={() => {
              setAssessmentType("psychosocial");
              resetAssessment();
            }}
            className={`group relative overflow-hidden rounded-2xl p-6 text-left transition-all ${
              assessmentType === "psychosocial"
                ? "bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-xl scale-105"
                : "bg-white border-2 border-gray-200 hover:border-blue-400 hover:shadow-lg"
            }`}
          >
            <div className="relative z-10">
              <div className="text-4xl mb-3">🧠</div>
              <h3 className={`text-lg font-bold mb-2 ${
                assessmentType === "psychosocial" ? "text-white" : "text-[#0A1628]"
              }`}>
                Psychosocial Hazards
              </h3>
              <p className={`text-sm ${
                assessmentType === "psychosocial" ? "text-white/90" : "text-gray-600"
              }`}>
                Assess workplace stress, culture & mental health risks
              </p>
            </div>
            {assessmentType === "psychosocial" && (
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-cyan-700/20 animate-pulse" />
            )}
          </button>
          
          <button
            onClick={() => {
              setAssessmentType("wellbeing");
              resetAssessment();
            }}
            className={`group relative overflow-hidden rounded-2xl p-6 text-left transition-all ${
              assessmentType === "wellbeing"
                ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xl scale-105"
                : "bg-white border-2 border-gray-200 hover:border-emerald-400 hover:shadow-lg"
            }`}
          >
            <div className="relative z-10">
              <div className="text-4xl mb-3">💚</div>
              <h3 className={`text-lg font-bold mb-2 ${
                assessmentType === "wellbeing" ? "text-white" : "text-[#0A1628]"
              }`}>
                Health & Wellbeing Profile
              </h3>
              <p className={`text-sm ${
                assessmentType === "wellbeing" ? "text-white/90" : "text-gray-600"
              }`}>
                Measure organizational wellbeing maturity
              </p>
            </div>
            {assessmentType === "wellbeing" && (
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-teal-700/20 animate-pulse" />
            )}
          </button>
        </div>

        {/* Questions */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 sm:p-8 mb-8 border border-gray-200 shadow-lg">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00E676] to-[#00D168] flex items-center justify-center text-white text-xl font-bold">
                {assessmentType === "individual" && "👤"}
                {assessmentType === "psychosocial" && "🧠"}
                {assessmentType === "wellbeing" && "💚"}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-[#0A1628]">
                  {assessmentType === "individual" && "Individual Worker Assessment"}
                  {assessmentType === "psychosocial" &&
                    "Organizational Psychosocial Hazards"}
                  {assessmentType === "wellbeing" &&
                    "Organizational Health & Wellbeing"}
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  {assessmentType === "individual" &&
                    "Check all items that apply to the worker being assessed."}
                  {assessmentType === "psychosocial" &&
                    "Check all psychosocial hazards present in your organization."}
                  {assessmentType === "wellbeing" &&
                    "Check all items that are currently in place at your organization."}
                </p>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 font-medium">Progress</span>
                <span className="text-[#00E676] font-bold">{score} / {maxScore}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#00E676] to-[#00D168] transition-all duration-300 ease-out"
                  style={{ width: `${(score / maxScore) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {currentQuestions.map((category, catIndex) => (
              <div key={catIndex} className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-8 bg-gradient-to-b from-[#00E676] to-[#00D168] rounded-full" />
                  <h4 className="font-bold text-[#0A1628] text-base">
                    {category.category}
                  </h4>
                </div>
                <div className="space-y-2">
                  {category.questions.map((question, qIndex) => {
                    const key = `${catIndex}-${qIndex}`;
                    const isChecked = responses[key] || false;
                    return (
                      <label
                        key={key}
                        className={`flex items-start gap-3 p-3 rounded-lg transition-all cursor-pointer ${
                          isChecked 
                            ? "bg-[#00E676]/10 border-2 border-[#00E676]/30" 
                            : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggle(key)}
                          className="mt-1 w-5 h-5 text-[#00E676] focus:ring-[#00E676] rounded border-gray-300"
                        />
                        <span className={`text-sm flex-1 ${
                          isChecked ? "text-[#0A1628] font-medium" : "text-gray-700"
                        }`}>
                          {question}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Current Score Card */}
          <div className="mt-6 p-6 bg-gradient-to-br from-[#0A1628] to-[#1a2638] rounded-xl text-white shadow-xl">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-white/70 text-sm uppercase tracking-wider">Current Score</span>
                <div className="text-4xl font-bold mt-1">
                  {score} <span className="text-2xl text-white/60">/ {maxScore}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-5xl font-bold text-[#00E676]">
                  {Math.round((score / maxScore) * 100)}%
                </div>
                <span className="text-white/70 text-sm">Complete</span>
              </div>
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
            className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-6 sm:p-10 border-2 border-gray-200 shadow-2xl"
          >
            {/* Risk Level Header */}
            <div className="text-center mb-8">
              <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${risk.bg} ${risk.color.replace("text-", "border-")} border-4 mb-4`}>
                <span className="text-4xl">
                  {risk.level === "High Risk" && "⚠️"}
                  {risk.level === "Moderate Risk" && "⚡"}
                  {risk.level === "Low Risk" && "✓"}
                  {risk.level === "Minimal Risk" && "✓"}
                  {risk.level === "Excellent" && "🌟"}
                  {risk.level === "Good" && "✓"}
                  {risk.level === "Moderate" && "⚡"}
                  {risk.level === "At Risk" && "⚠️"}
                </span>
              </div>
              <h3 className={`text-4xl font-bold ${risk.color} mb-2`}>
                {risk.level}
              </h3>
              <p className="text-gray-600 text-lg">
                Score: {score} out of {maxScore} ({Math.round((score / maxScore) * 100)}%)
              </p>
            </div>

            {/* Visual Graph */}
            <div className="mb-8 p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
              <h4 className="text-lg font-bold text-[#0A1628] mb-4 text-center">Risk Level Visualization</h4>
              
              {/* Circular Progress */}
              <div className="flex justify-center mb-6">
                <div className="relative w-48 h-48">
                  {/* Background circle */}
                  <svg className="transform -rotate-90 w-48 h-48">
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="#E5E7EB"
                      strokeWidth="16"
                      fill="none"
                    />
                    {/* Progress circle */}
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke={
                        risk.color === "text-red-500" ? "#EF4444" :
                        risk.color === "text-amber-500" ? "#F59E0B" :
                        risk.color === "text-blue-500" ? "#3B82F6" :
                        "#10B981"
                      }
                      strokeWidth="16"
                      fill="none"
                      strokeDasharray={`${(score / maxScore) * 553} 553`}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  {/* Center text */}
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <div className={`text-5xl font-bold ${risk.color}`}>
                      {Math.round((score / maxScore) * 100)}
                    </div>
                    <div className="text-gray-500 text-sm font-medium">of {maxScore}</div>
                  </div>
                </div>
              </div>

              {/* Bar Graph by Category */}
              <div className="space-y-3">
                <h5 className="font-semibold text-[#0A1628] text-sm mb-3">Breakdown by Category:</h5>
                {currentQuestions.map((category, catIndex) => {
                  const categoryScore = category.questions.filter((_, qIndex) => 
                    responses[`${catIndex}-${qIndex}`]
                  ).length;
                  const categoryMax = category.questions.length;
                  const categoryPercent = (categoryScore / categoryMax) * 100;
                  
                  return (
                    <div key={catIndex} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium text-gray-700">{category.category}</span>
                        <span className="text-gray-500">{categoryScore}/{categoryMax}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 rounded-full ${
                            categoryPercent >= 60 ? "bg-red-500" :
                            categoryPercent >= 40 ? "bg-amber-500" :
                            categoryPercent >= 20 ? "bg-blue-500" :
                            "bg-green-500"
                          }`}
                          style={{ width: `${categoryPercent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
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
