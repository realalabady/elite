export interface Clinic {
  id: string;
  name: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
  icon: string;
  services: {
    en: string[];
    ar: string[];
  };
}

export const clinics: Clinic[] = [
  {
    id: "orthopedic",
    name: { en: "Orthopedic Surgery", ar: "جراحة العظام" },
    description: {
      en: "Comprehensive orthopedic care including joint replacement, fracture treatment, and sports medicine.",
      ar: "رعاية شاملة للعظام تشمل استبدال المفاصل وعلاج الكسور والطب الرياضي.",
    },
    icon: "Bone",
    services: {
      en: [
        "Joint Replacement",
        "Fracture Treatment",
        "Arthroscopy",
        "Hand Surgery",
      ],
      ar: ["استبدال المفاصل", "علاج الكسور", "المناظير", "جراحة اليد"],
    },
  },
  {
    id: "spine",
    name: { en: "Spine Clinic", ar: "عيادة العمود الفقري" },
    description: {
      en: "Specialized treatment for back pain, herniated discs, and spinal deformities.",
      ar: "علاج متخصص لآلام الظهر والانزلاق الغضروفي وتشوهات العمود الفقري.",
    },
    icon: "Activity",
    services: {
      en: [
        "Disc Surgery",
        "Spinal Fusion",
        "Pain Management",
        "Scoliosis Treatment",
      ],
      ar: ["جراحة الغضروف", "دمج الفقرات", "إدارة الألم", "علاج الجنف"],
    },
  },
  {
    id: "sports-medicine",
    name: { en: "Sports Medicine", ar: "الطب الرياضي" },
    description: {
      en: "Treatment and prevention of sports-related injuries for athletes of all levels.",
      ar: "علاج والوقاية من الإصابات الرياضية للرياضيين من جميع المستويات.",
    },
    icon: "Dumbbell",
    services: {
      en: [
        "ACL Reconstruction",
        "Rotator Cuff Repair",
        "Sports Physio",
        "Performance Enhancement",
      ],
      ar: [
        "إعادة بناء الرباط الصليبي",
        "إصلاح الكفة المدورة",
        "العلاج الطبيعي الرياضي",
        "تحسين الأداء",
      ],
    },
  },
  {
    id: "obstetrics",
    name: { en: "Obstetrics & Gynecology", ar: "أمراض النساء والتوليد" },
    description: {
      en: "Complete women's health services including pregnancy care and gynecological treatments.",
      ar: "خدمات صحة المرأة الشاملة بما في ذلك رعاية الحمل وعلاجات أمراض النساء.",
    },
    icon: "Baby",
    services: {
      en: [
        "Pregnancy Follow-up",
        "High-Risk Pregnancy",
        "Infertility Treatment",
        "Gynecological Surgery",
      ],
      ar: ["متابعة الحمل", "الحمل عالي الخطورة", "علاج العقم", "جراحات النساء"],
    },
  },
  {
    id: "general-surgery",
    name: {
      en: "General & Bariatric Surgery",
      ar: "الجراحة العامة وجراحة السمنة",
    },
    description: {
      en: "Advanced surgical procedures including laparoscopic and weight loss surgeries.",
      ar: "إجراءات جراحية متقدمة تشمل جراحة المناظير وجراحات إنقاص الوزن.",
    },
    icon: "Stethoscope",
    services: {
      en: [
        "Gastric Sleeve",
        "Gastric Bypass",
        "Hernia Repair",
        "Gallbladder Surgery",
      ],
      ar: ["تكميم المعدة", "تحويل مسار المعدة", "إصلاح الفتق", "جراحة المرارة"],
    },
  },
  {
    id: "ophthalmology",
    name: { en: "Ophthalmology & LASIK", ar: "طب العيون والليزك" },
    description: {
      en: "Complete eye care from routine exams to advanced laser vision correction.",
      ar: "رعاية عيون شاملة من الفحوصات الروتينية إلى تصحيح النظر بالليزر المتقدم.",
    },
    icon: "Eye",
    services: {
      en: [
        "LASIK Surgery",
        "Cataract Surgery",
        "Glaucoma Treatment",
        "Retina Care",
      ],
      ar: [
        "جراحة الليزك",
        "جراحة المياه البيضاء",
        "علاج الجلوكوما",
        "رعاية الشبكية",
      ],
    },
  },
  {
    id: "dental",
    name: { en: "Dental Clinic", ar: "عيادة الأسنان" },
    description: {
      en: "Comprehensive dental services from preventive care to cosmetic dentistry.",
      ar: "خدمات أسنان شاملة من الرعاية الوقائية إلى تجميل الأسنان.",
    },
    icon: "Smile",
    services: {
      en: [
        "Dental Implants",
        "Cosmetic Dentistry",
        "Root Canal",
        "Orthodontics",
      ],
      ar: ["زراعة الأسنان", "تجميل الأسنان", "علاج العصب", "تقويم الأسنان"],
    },
  },
  {
    id: "dermatology",
    name: { en: "Dermatology & Laser", ar: "الجلدية والليزر" },
    description: {
      en: "Skin care treatments including laser therapy, cosmetic procedures, and medical dermatology.",
      ar: "علاجات العناية بالبشرة تشمل العلاج بالليزر والإجراءات التجميلية والجلدية الطبية.",
    },
    icon: "Sparkles",
    services: {
      en: [
        "Laser Hair Removal",
        "Acne Treatment",
        "Skin Rejuvenation",
        "Botox & Fillers",
      ],
      ar: [
        "إزالة الشعر بالليزر",
        "علاج حب الشباب",
        "تجديد البشرة",
        "البوتوكس والفيلر",
      ],
    },
  },
  {
    id: "internal-medicine",
    name: { en: "Internal Medicine & Diabetes", ar: "الطب الباطني والسكري" },
    description: {
      en: "Management of chronic conditions including diabetes, hypertension, and endocrine disorders.",
      ar: "إدارة الحالات المزمنة بما في ذلك السكري وارتفاع ضغط الدم واضطرابات الغدد الصماء.",
    },
    icon: "Heart",
    services: {
      en: [
        "Diabetes Management",
        "Thyroid Disorders",
        "Hypertension Care",
        "Preventive Health",
      ],
      ar: [
        "إدارة السكري",
        "اضطرابات الغدة الدرقية",
        "رعاية ضغط الدم",
        "الصحة الوقائية",
      ],
    },
  },
  {
    id: "pediatrics",
    name: { en: "Pediatrics", ar: "طب الأطفال" },
    description: {
      en: "Complete healthcare for children from newborns to adolescents.",
      ar: "رعاية صحية شاملة للأطفال من حديثي الولادة إلى المراهقين.",
    },
    icon: "Baby",
    services: {
      en: [
        "Well-Child Visits",
        "Vaccinations",
        "Growth Monitoring",
        "Pediatric Urgent Care",
      ],
      ar: [
        "زيارات صحة الطفل",
        "التطعيمات",
        "مراقبة النمو",
        "الرعاية الطارئة للأطفال",
      ],
    },
  },
  {
    id: "ent",
    name: { en: "ENT (Ear, Nose & Throat)", ar: "الأنف والأذن والحنجرة" },
    description: {
      en: "Treatment of ear, nose, and throat conditions including hearing loss and sinus problems.",
      ar: "علاج حالات الأنف والأذن والحنجرة بما في ذلك فقدان السمع ومشاكل الجيوب الأنفية.",
    },
    icon: "Ear",
    services: {
      en: [
        "Hearing Tests",
        "Sinus Surgery",
        "Tonsillectomy",
        "Voice Disorders",
      ],
      ar: [
        "اختبارات السمع",
        "جراحة الجيوب الأنفية",
        "استئصال اللوزتين",
        "اضطرابات الصوت",
      ],
    },
  },
  {
    id: "gastroenterology",
    name: { en: "Gastroenterology", ar: "أمراض الجهاز الهضمي" },
    description: {
      en: "Diagnosis and treatment of digestive system disorders.",
      ar: "تشخيص وعلاج اضطرابات الجهاز الهضمي.",
    },
    icon: "Activity",
    services: {
      en: ["Endoscopy", "Colonoscopy", "Liver Disease", "IBD Management"],
      ar: [
        "التنظير",
        "منظار القولون",
        "أمراض الكبد",
        "إدارة أمراض الأمعاء الالتهابية",
      ],
    },
  },
  {
    id: "urology",
    name: { en: "Urology & Andrology", ar: "المسالك البولية وأمراض الذكورة" },
    description: {
      en: "Comprehensive urological care including kidney stones, prostate conditions, and men's health.",
      ar: "رعاية مسالك بولية شاملة تشمل حصى الكلى وحالات البروستاتا وصحة الرجل.",
    },
    icon: "Droplet",
    services: {
      en: [
        "Kidney Stone Treatment",
        "Prostate Care",
        "Male Infertility",
        "Urinary Incontinence",
      ],
      ar: ["علاج حصى الكلى", "رعاية البروستاتا", "عقم الذكور", "سلس البول"],
    },
  },
];
