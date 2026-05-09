export interface Tribe {
  id: string;
  code: string;       // الرمز العددي أو النصي (مثل 505, F-16)
  name: string;
  aliases: string[];
  color: string;      // لون مميز للعرض بدلاً من العلم
}

export const TRIBES: Tribe[] = [
  { id: "ashraf", code: "515", name: "الأشراف", aliases: ["الأشراف", "اشراف", "شريف", "515"], color: "#8B4513" },
  { id: "baqum", code: "911", name: "البقوم", aliases: ["البقوم", "بقوم", "911", "بقم"], color: "#2E8B57" },
  { id: "tamim", code: "811", name: "بني تميم", aliases: ["بني تميم", "تميم", "811", "تميمي"], color: "#1E90FF" },
  { id: "harith", code: "501", name: "بني حارث", aliases: ["بني حارث", "حارث", "501", "حارثي"], color: "#DAA520" },
  { id: "khalid", code: "912", name: "بني خالد", aliases: ["بني خالد", "خالد", "912", "خالدي"], color: "#CD5C5C" }, // غيرت الرمز إلى 912 لتجنب تكرار 911
  { id: "shahr", code: "507", name: "بني شهر", aliases: ["بني شهر", "شهر", "507"], color: "#4682B4" },
  { id: "harb", code: "111", name: "حرب", aliases: ["حرب", "حربي", "111"], color: "#A0522D" },
  { id: "dawasir", code: "502", name: "الدواسر", aliases: ["الدواسر", "دواسر", "502"], color: "#556B2F" },
  { id: "rashayda", code: "404", name: "الرشايدة", aliases: ["الرشايدة", "رشايدة", "404", "رشيدي"], color: "#8B008B" },
  { id: "zahran", code: "702", name: "زهران", aliases: ["زهران", "زهراني", "702"], color: "#FF8C00" },
  { id: "subaie", code: "503", name: "سبيع", aliases: ["سبيع", "سبيعي", "503"], color: "#2F4F4F" },
  { id: "sahool", code: "515", name: "السهول", aliases: ["السهول", "سهول", "515"], color: "#6A5ACD" },
  { id: "shararat", code: "509", name: "شرارات", aliases: ["شرارات", "شراري", "509"], color: "#B8860B" },
  { id: "shammar", code: "555", name: "شمر", aliases: ["شمر", "شمري", "F-16", "555"], color: "#DC143C" },
  { id: "otaibah", code: "511", name: "عتيبة", aliases: ["عتيبة", "عتيبي", "511"], color: "#FFD700" },
  { id: "anazah", code: "501", name: "عنزة", aliases: ["عنزة", "عنزي", "B-52", "501"], color: "#32CD32" },
  { id: "ghamid", code: "707", name: "غامد", aliases: ["غامد", "غامدي", "07", "707"], color: "#9370DB" },
  { id: "qhtan", code: "505", name: "قحطان", aliases: ["قحطان", "قحطاني", "505"], color: "#B22222" },
  { id: "mutair", code: "305", name: "مطير", aliases: ["مطير", "مطيري", "305"], color: "#228B22" },
  { id: "yam", code: "711", name: "يام", aliases: ["يام", "يامي", "711"], color: "#FF4500" },
  { id: "juhaynah", code: "518", name: "جهينة", aliases: ["جهينة", "جهني", "518"], color: "#20B2AA" },
  { id: "bali", code: "811", name: "بلي", aliases: ["بلي", "بليوي", "811"], color: "#FF69B4" },
];