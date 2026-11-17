// Trimmed copies of the UAT submissions (fiscal year 2026/27, period P7). Only
// the fields the matching code reads are kept, and only a few staffing lines.
// What matters is the shape of the Overhead lines in each initiative:
//   PCN  budget: expenseItem ""               report: Building/Lease, ...
//   CHC  budget: expenseItem "Overhead Budget" report: Building/Lease, ...
//   UPCC budget: typeOfCare ""                report: typeOfCare "Overhead"

const HA = "Health Authority";
const DOFP = "Division Of Family Practice";
const CLINICAL = "Clinical & Traditional Wellness Resources";

const staff = (
  expenseItem: string,
  expenseItemSubType: string,
  extra: Record<string, unknown> = {}
) => ({
  expenseCategory: HA,
  expenseSubCategory: CLINICAL,
  expenseItem,
  expenseItemSubType,
  ...extra,
});

const overheadReport = (
  expenseItem: string,
  expenseItemSubType: string,
  extra: Record<string, unknown> = {}
) => ({
  expenseCategory: HA,
  expenseSubCategory: "Overhead",
  expenseItem,
  expenseItemSubType,
  p7: 100,
  ...extra,
});

// ---- CHC ------------------------------------------------------------------
export const chcBudget = {
  fiscalYear: "2026/27",
  healthAuthority: "Fraser",
  communityName: "Surrey-North Delta",
  chcName: "Elizabeth Fry Health Centre (EHC)",
  chcBudget: [
    staff("Registered Nurse", "Level 3", { approvedFtes: 3.45 }),
    staff("Social Worker & Disciplines Allied to Social Work", "", {
      approvedFtes: 2,
    }),
    {
      expenseCategory: HA,
      expenseSubCategory: "Overhead",
      expenseItem: "Overhead Budget",
      expenseItemSubType: "",
      approvedFtes: 0,
      approvedBudget: 680222.39,
    },
  ],
};

export const chcOverheadItems: [string, string][] = [
  ["Maintenance", "Building Maintenance"],
  ["Other", "IMIT/IT (e.g., EMR)"],
  ["Other", "Professional Services & Bookkeeping"],
  ["Other", "Travel"],
  ["Salary", "Medical Office Assistant (MOA)"],
  ["Salary", "Staffing Services"],
  ["Supplies", "Supplies (Med-Surg, Office)"],
];

export const chcReport = {
  fiscalYear: "2026/27",
  periodReported: 7,
  healthAuthority: "Fraser",
  communityName: "Surrey-North Delta",
  chcName: "Elizabeth Fry Health Centre (EHC)",
  financialData: {
    clinical: {
      financials: [
        staff("Registered Nurse", "Level 3", { p7: 107887.65 }),
        staff("Social Worker & Disciplines Allied to Social Work", "", {
          p7: 97744.87,
        }),
      ],
    },
    overhead: {
      budget: { ytdExpenseVarianceNote: "chc overhead note" },
      financials: chcOverheadItems.map(([item, sub]) =>
        overheadReport(item, sub)
      ),
    },
    additionalNotes: "",
  },
};

// ---- UPCC -----------------------------------------------------------------
const lc = "Longitudinal Care (LC)";
const uc = "Urgent Care (UC)";

export const upccBudget = {
  fiscalYear: "2026/27",
  healthAuthority: "Fraser",
  communityName: "Abbotsford",
  upccName: "Abbotsford",
  upccBudget: [
    // the same item in two types of care: must stay separate
    staff("Registered Nurse", "Level 3", { typeOfCare: lc }),
    staff("Registered Nurse", "Level 3", { typeOfCare: uc }),
    {
      expenseCategory: HA,
      expenseSubCategory: "Overhead",
      typeOfCare: "",
      expenseItem: "",
      expenseItemSubType: "",
      approvedFtesInclRelief: 0,
      approvedBudget: 1045975.07,
    },
  ],
};

export const upccOverheadItems: [string, string][] = [
  ["Building", "Lease"],
  ["Maintenance", "Building Maintenance"],
  ["Other", "IMIT/IT (e.g., EMR)"],
  ["Salary", "Medical Office Assistant (MOA)"],
  ["Supplies", "Supplies - General"],
];

export const upccReport = {
  fiscalYear: "2026/27",
  periodReported: 7,
  healthAuthority: "Fraser",
  communityName: "Abbotsford",
  upccName: "Abbotsford",
  financialData: {
    clinical: {
      longitudinalCare: {
        financials: [
          staff("Registered Nurse", "Level 3", { typeOfCare: lc, p7: 1 }),
        ],
      },
      urgentCare: {
        financials: [
          staff("Registered Nurse", "Level 3", { typeOfCare: uc, p7: 2 }),
        ],
      },
    },
    overhead: {
      budget: { ytdExpenseVarianceNote: "upcc overhead note" },
      financials: upccOverheadItems.map(([item, sub]) =>
        overheadReport(item, sub, { typeOfCare: "Overhead" })
      ),
    },
    additionalNotes: "",
  },
};

// ---- PCN ------------------------------------------------------------------
export const pcnBudget = {
  fiscalYear: "2026/27",
  healthAuthority: "Fraser",
  communityName: "Abbotsford",
  pcnBudget: [
    {
      expenseCategory: HA,
      expenseSubCategory: "Health Clinical Traditional Wellness Resources",
      expenseItem: "Registered Nurse",
      expenseItemSubType: "Level 3",
      annualBudget: 299000,
    },
    {
      expenseCategory: DOFP,
      expenseSubCategory: "Overhead",
      expenseItem: "",
      expenseItemSubType: "",
      annualBudget: 123075,
    },
    {
      expenseCategory: HA,
      expenseSubCategory: "Overhead",
      expenseItem: "",
      expenseItemSubType: "",
      annualBudget: 1085808,
    },
  ],
};

export const pcnOverheadItems: [string, string][] = [
  ["Building", "Lease"],
  ["Maintenance", "Building Maintenance"],
  ["Salary", "APP Overhead"],
  ["Supplies", "Drugs"],
];

export const pcnDofpOverheadItems: [string, string][] = [
  ["Building", "Lease"],
  ["Building", "Utilities"],
  ["Maintenance", "Janitorial"],
  ["Other", "Admin"],
  ["Supplies", "Office equipment and supplies"],
];

export const pcnReport = {
  fiscalYear: "2026/27",
  periodReported: 7,
  healthAuthority: "Fraser",
  communityName: "Abbotsford",
  financialData: {
    dofp: {
      overhead: {
        budget: { ytdExpenseVarianceNote: "dofp overhead note" },
        financials: pcnDofpOverheadItems.map(([item, sub]) =>
          overheadReport(item, sub, { expenseCategory: DOFP })
        ),
      },
    },
    healthAuthority: {
      clinical: {
        financials: [
          {
            expenseCategory: HA,
            expenseSubCategory: "Health Clinical Traditional Wellness Resources",
            expenseItem: "Registered Nurse",
            expenseItemSubType: "Level 3",
            p7: 79366.42,
          },
        ],
      },
      overhead: {
        budget: { ytdExpenseVarianceNote: "pcn ha overhead note" },
        financials: pcnOverheadItems.map(([item, sub]) =>
          overheadReport(item, sub)
        ),
      },
    },
    notes: "",
  },
};
