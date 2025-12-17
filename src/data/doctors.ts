export interface Doctor {
  id: string;
  name: {
    en: string;
    ar: string;
  };
  specialty: {
    en: string;
    ar: string;
  };
  clinicId: string;
  bio: {
    en: string;
    ar: string;
  };
  qualifications: string[];
  experience: number;
  languages: string[];
  image: string;
}

export const doctors: Doctor[] = [
  {
    id: "dr-ahmed-hassan",
    name: { en: "Dr. Ahmed Hassan", ar: "د. أحمد حسن" },
    specialty: { en: "Orthopedic Surgery", ar: "جراحة العظام" },
    clinicId: "orthopedic",
    bio: {
      en: "Board-certified orthopedic surgeon with expertise in joint replacement and sports injuries. Fellow of the Royal College of Surgeons Edinburgh.",
      ar: "جراح عظام معتمد متخصص في استبدال المفاصل وإصابات الرياضة. زميل الكلية الملكية للجراحين في إدنبرة.",
    },
    qualifications: [
      "Royal College of Surgeons Edinburgh",
      "Canadian Board in Orthopedic Surgery",
    ],
    experience: 15,
    languages: ["Arabic", "English"],
    image: "/placeholder.svg",
  },
  {
    id: "dr-sarah-malik",
    name: { en: "Dr. Sarah Malik", ar: "د. سارة مالك" },
    specialty: { en: "Obstetrics & Gynecology", ar: "أمراض النساء والتوليد" },
    clinicId: "obstetrics",
    bio: {
      en: "Specialist in high-risk pregnancies and minimally invasive gynecological procedures. Graduate of Harvard Medical School.",
      ar: "متخصصة في حالات الحمل عالية الخطورة وإجراءات أمراض النساء طفيفة التوغل. خريجة كلية الطب بجامعة هارفارد.",
    },
    qualifications: [
      "Harvard Medical School",
      "American Board of Obstetrics and Gynecology",
    ],
    experience: 12,
    languages: ["Arabic", "English", "French"],
    image: "/placeholder.svg",
  },
  {
    id: "dr-mohammed-ali",
    name: { en: "Dr. Mohammed Ali", ar: "د. محمد علي" },
    specialty: {
      en: "General & Bariatric Surgery",
      ar: "الجراحة العامة وجراحة السمنة",
    },
    clinicId: "general-surgery",
    bio: {
      en: "Expert in laparoscopic and bariatric surgery with over 2000 successful procedures. American Board certified.",
      ar: "خبير في جراحة المناظير وجراحة السمنة مع أكثر من 2000 عملية ناجحة. معتمد من البورد الأمريكي.",
    },
    qualifications: [
      "American Board in Surgery",
      "Royal College of Surgeon Ireland",
    ],
    experience: 18,
    languages: ["Arabic", "English"],
    image: "/placeholder.svg",
  },
  {
    id: "dr-fatima-omar",
    name: { en: "Dr. Fatima Omar", ar: "د. فاطمة عمر" },
    specialty: { en: "Ophthalmology & LASIK", ar: "طب العيون والليزك" },
    clinicId: "ophthalmology",
    bio: {
      en: "Renowned ophthalmologist specializing in cataract surgery and laser vision correction. Pioneer in LASIK procedures in the region.",
      ar: "طبيبة عيون مشهورة متخصصة في جراحة المياه البيضاء وتصحيح النظر بالليزر. رائدة في إجراءات الليزك في المنطقة.",
    },
    qualifications: [
      "Royal College of Surgeons Glasgow",
      "European Board of Ophthalmology",
    ],
    experience: 14,
    languages: ["Arabic", "English", "Urdu"],
    image: "/placeholder.svg",
  },
  {
    id: "dr-khalid-nasser",
    name: { en: "Dr. Khalid Nasser", ar: "د. خالد ناصر" },
    specialty: { en: "Spine Surgery", ar: "جراحة العمود الفقري" },
    clinicId: "spine",
    bio: {
      en: "Leading spine surgeon with expertise in minimally invasive spine procedures and complex spinal reconstructions.",
      ar: "جراح عمود فقري رائد متخصص في إجراءات العمود الفقري طفيفة التوغل وإعادة البناء المعقدة.",
    },
    qualifications: [
      "Canadian Board in Orthopedic Surgery",
      "Fellowship in Spine Surgery",
    ],
    experience: 16,
    languages: ["Arabic", "English"],
    image: "/placeholder.svg",
  },
  {
    id: "dr-layla-ahmed",
    name: { en: "Dr. Layla Ahmed", ar: "د. ليلى أحمد" },
    specialty: { en: "Dermatology & Laser", ar: "الجلدية والليزر" },
    clinicId: "dermatology",
    bio: {
      en: "Dermatologist specializing in cosmetic dermatology, laser treatments, and skin cancer screening.",
      ar: "طبيبة جلدية متخصصة في التجميل والعلاج بالليزر والكشف المبكر عن سرطان الجلد.",
    },
    qualifications: [
      "American Board of Dermatology",
      "European Diploma in Laser Medicine",
    ],
    experience: 10,
    languages: ["Arabic", "English"],
    image: "/placeholder.svg",
  },
  {
    id: "dr-omar-hassan",
    name: { en: "Dr. Omar Hassan", ar: "د. عمر حسن" },
    specialty: {
      en: "Internal Medicine & Diabetes",
      ar: "الطب الباطني والسكري",
    },
    clinicId: "internal-medicine",
    bio: {
      en: "Internal medicine specialist with focus on diabetes management and endocrine disorders.",
      ar: "أخصائي طب باطني متخصص في إدارة السكري واضطرابات الغدد الصماء.",
    },
    qualifications: [
      "American Board of Internal Medicine",
      "Endocrinology Fellowship",
    ],
    experience: 13,
    languages: ["Arabic", "English"],
    image: "/placeholder.svg",
  },
  {
    id: "dr-noura-salem",
    name: { en: "Dr. Noura Salem", ar: "د. نورة سالم" },
    specialty: { en: "Pediatrics", ar: "طب الأطفال" },
    clinicId: "pediatrics",
    bio: {
      en: "Compassionate pediatrician dedicated to child health and development from newborns to adolescents.",
      ar: "طبيبة أطفال حنونة متفانية في صحة الأطفال ونموهم من حديثي الولادة إلى المراهقين.",
    },
    qualifications: ["Royal College of Paediatrics", "Neonatology Fellowship"],
    experience: 11,
    languages: ["Arabic", "English"],
    image: "/placeholder.svg",
  },
];
