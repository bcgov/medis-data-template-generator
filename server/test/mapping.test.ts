// Tests for mapping.mapFinancialItems: which reported lines end up under which
// budget line. Pure functions, no CHEFS or MinIO. The data in
// fixtures/overheadSubmissions.ts is trimmed from real UAT submissions.
//
// The "Overhead" tests in the two failing groups describe the intended
// behaviour; they fail until Overhead lines are matched on category and
// subcategory only.
import { describe, expect, it } from "vitest";
import mapping from "../api/utils/mapping";
import {
  chcBudget,
  chcOverheadItems,
  chcReport,
  pcnBudget,
  pcnDofpOverheadItems,
  pcnOverheadItems,
  pcnReport,
  upccBudget,
  upccOverheadItems,
  upccReport,
} from "./fixtures/overheadSubmissions";

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));

const run = (
  budget: any,
  report: any,
  initiative: "pcn" | "chc" | "upcc" | "nppcc"
) => mapping.mapFinancialItems(budget, report, "Fraser", initiative, "P7");

// PCN has two overhead budget lines (Division Of Family Practice and Health
// Authority); the other initiatives only have the Health Authority one.
const overheadRow = (rows: any[], category = "Health Authority") =>
  rows.find(
    (r) =>
      r.budget.expenseSubCategory === "Overhead" &&
      r.budget.expenseCategory === category
  );

const reported = (row: any) =>
  row.reporting.map(
    (r: any) => `${r.expenseItem} / ${r.expenseItemSubType}`
  );

describe("Overhead lines", () => {
  it("PCN: blank budget item gets every reported overhead line", () => {
    const row = overheadRow(run(pcnBudget, pcnReport, "pcn"));
    expect(row.reporting).toHaveLength(pcnOverheadItems.length);
  });

  it('CHC: budget item "Overhead Budget" still gets every reported overhead line', () => {
    const row = overheadRow(run(chcBudget, chcReport, "chc"));
    expect(row.reporting).toHaveLength(chcOverheadItems.length);
  });

  it('UPCC: budget type of care "" vs reported "Overhead" still matches', () => {
    const row = overheadRow(run(upccBudget, upccReport, "upcc"));
    expect(row.reporting).toHaveLength(upccOverheadItems.length);
  });

  it("UPCC: reported type of care 'N/A' also matches a blank budget one", () => {
    const report = clone(upccReport);
    report.financialData.overhead.financials.forEach((l: any) => {
      l.typeOfCare = "N/A";
    });
    const row = overheadRow(run(upccBudget, report, "upcc"));
    expect(row.reporting).toHaveLength(upccOverheadItems.length);
  });

  it("UPCC: reported overhead lines with no type of care also match", () => {
    const report = clone(upccReport);
    report.financialData.overhead.financials.forEach((l: any) => {
      delete l.typeOfCare;
    });
    const row = overheadRow(run(upccBudget, report, "upcc"));
    expect(row.reporting).toHaveLength(upccOverheadItems.length);
  });

  it("an overhead line added by the user (new item name) is kept", () => {
    const report = clone(chcReport);
    report.financialData.overhead.financials.push({
      expenseCategory: "Health Authority",
      expenseSubCategory: "Overhead",
      expenseItem: "Other",
      expenseItemSubType: "Something added later",
      p7: 5,
    } as any);
    const row = overheadRow(run(chcBudget, report, "chc"));
    expect(reported(row)).toContain("Other / Something added later");
  });

  it("overhead lines are not attached to non-overhead budget lines", () => {
    const rows = run(chcBudget, chcReport, "chc");
    for (const row of rows) {
      if (row.budget.expenseSubCategory !== "Overhead") {
        expect(
          row.reporting.every(
            (r: any) => r.expenseSubCategory !== "Overhead"
          )
        ).toBe(true);
      }
    }
  });
});

describe("Staffing lines (matching must stay as it is)", () => {
  it("CHC: matches item and sub-type exactly", () => {
    const rows = run(chcBudget, chcReport, "chc");
    const rn = rows.find((r: any) => r.budget.expenseItem === "Registered Nurse");
    expect(rn.reporting).toHaveLength(1);
    expect(rn.reporting[0].p7).toBe(107887.65);
  });

  it("UPCC: the same item in LC and UC stays separate", () => {
    const rows = run(upccBudget, upccReport, "upcc");
    const lcRow = rows.find(
      (r: any) => r.budget.typeOfCare === "Longitudinal Care (LC)"
    );
    const ucRow = rows.find(
      (r: any) => r.budget.typeOfCare === "Urgent Care (UC)"
    );
    expect(lcRow.reporting.map((r: any) => r.p7)).toEqual([1]);
    expect(ucRow.reporting.map((r: any) => r.p7)).toEqual([2]);
  });

  it("an empty dropdown saved as {} counts as no sub-type", () => {
    const budget = clone(chcBudget);
    const report = clone(chcReport);
    budget.chcBudget[1].expenseItemSubType = {} as any;
    report.financialData.clinical.financials[1].expenseItemSubType = "" as any;
    const rows = run(budget, report, "chc");
    const sw = rows.find((r: any) =>
      r.budget.expenseItem.startsWith("Social Worker")
    );
    expect(sw.reporting).toHaveLength(1);
  });

  it("a staffing line with different sub-types does not match", () => {
    const report = clone(chcReport);
    report.financialData.clinical.financials[0].expenseItemSubType = "Level 4";
    const rows = run(chcBudget, report, "chc");
    const rn = rows.find((r: any) => r.budget.expenseItem === "Registered Nurse");
    expect(rn.reporting).toHaveLength(0);
  });
});

describe("Overhead budget line with text in the item / sub-type columns", () => {
  // The case UAT reported: any text next to the Overhead budget line.
  const cases: [string, any, any, "pcn" | "chc" | "upcc", number][] = [
    ["PCN", pcnBudget, pcnReport, "pcn", pcnOverheadItems.length],
    ["CHC", chcBudget, chcReport, "chc", chcOverheadItems.length],
    ["UPCC", upccBudget, upccReport, "upcc", upccOverheadItems.length],
  ];

  const overheadBudgetLine = (budget: any, initiative: string) =>
    budget[`${initiative}Budget`].find(
      (b: any) =>
        b.expenseSubCategory === "Overhead" &&
        b.expenseCategory === "Health Authority"
    );

  it.each(cases)("%s: text in expenseItem", (_n, budget, report, init, n) => {
    const b = clone(budget);
    overheadBudgetLine(b, init).expenseItem = "Overhead Budget";
    expect(overheadRow(run(b, report, init)).reporting).toHaveLength(n);
  });

  it.each(cases)("%s: text in item and sub-type", (_n, budget, report, init, n) => {
    const b = clone(budget);
    const line = overheadBudgetLine(b, init);
    line.expenseItem = "Other";
    line.expenseItemSubType = "Admin";
    expect(overheadRow(run(b, report, init)).reporting).toHaveLength(n);
  });

  it.each(cases)("%s: text in sub-type only", (_n, budget, report, init, n) => {
    const b = clone(budget);
    overheadBudgetLine(b, init).expenseItemSubType = "Admin";
    expect(overheadRow(run(b, report, init)).reporting).toHaveLength(n);
  });
});

describe("PCN has two separate overhead groups", () => {
  const rows = run(pcnBudget, pcnReport, "pcn");

  it("Division Of Family Practice overhead gets only its own lines", () => {
    const row = overheadRow(rows, "Division Of Family Practice");
    expect(row.reporting).toHaveLength(pcnDofpOverheadItems.length);
    expect(
      row.reporting.every(
        (r: any) => r.expenseCategory === "Division Of Family Practice"
      )
    ).toBe(true);
  });

  it("Health Authority overhead does not pick up the DoFP lines", () => {
    const row = overheadRow(rows, "Health Authority");
    expect(row.reporting).toHaveLength(pcnOverheadItems.length);
    expect(
      row.reporting.every((r: any) => r.expenseCategory === "Health Authority")
    ).toBe(true);
  });
});

describe("Overhead notes and zero values", () => {
  it("each overhead row carries the notes from its own overhead.budget", () => {
    const pcn = run(pcnBudget, pcnReport, "pcn");
    expect(
      overheadRow(pcn, "Division Of Family Practice").submissionInformation
        .budgetLevel.ytdExpenseVarianceNote
    ).toBe("dofp overhead note");
    expect(
      overheadRow(pcn).submissionInformation.budgetLevel.ytdExpenseVarianceNote
    ).toBe("pcn ha overhead note");
    expect(
      overheadRow(run(chcBudget, chcReport, "chc")).submissionInformation
        .budgetLevel.ytdExpenseVarianceNote
    ).toBe("chc overhead note");
    expect(
      overheadRow(run(upccBudget, upccReport, "upcc")).submissionInformation
        .budgetLevel.ytdExpenseVarianceNote
    ).toBe("upcc overhead note");
  });

  it("a reported overhead line with 0 spending is kept (PCN)", () => {
    const report = clone(pcnReport);
    report.financialData.healthAuthority.overhead.financials[0].p7 = 0;
    const row = overheadRow(run(pcnBudget, report, "pcn"));
    expect(row.reporting).toHaveLength(pcnOverheadItems.length);
  });
});

describe("Budget has Overhead but the report has none", () => {
  it.each([
    ["CHC", chcBudget, chcReport, "chc"],
    ["UPCC", upccBudget, upccReport, "upcc"],
  ] as const)("%s: the Overhead row is kept with no reported lines", (_n, budget, report, init) => {
    const r = clone(report);
    delete (r.financialData as any).overhead;
    const row = overheadRow(run(budget, r, init));
    expect(row).toBeDefined();
    expect(row.reporting).toEqual([]);
    expect(row.submissionInformation.budgetLevel).toEqual({});
  });
});

describe("No report submitted", () => {
  it("returns the budget lines with empty reporting", () => {
    const rows = run(chcBudget, undefined, "chc");
    expect(rows).toHaveLength(chcBudget.chcBudget.length);
    expect(rows.every((r: any) => r.reporting.length === 0)).toBe(true);
  });
});
