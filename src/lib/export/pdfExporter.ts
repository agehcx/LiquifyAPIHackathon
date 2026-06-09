import type { TaxReport } from "@/types/domain";
import { formatDateUtc, formatTokenQty, formatUsd } from "@/lib/format/number";
import PDFDocument from "pdfkit";

async function toPdf(report: TaxReport): Promise<Buffer> {
  const doc = new PDFDocument({ margin: 50 });

  doc.fontSize(25).text(`DeFi TaxGen — Tax Report ${report.taxYear}`, { align: "center" });
  doc.moveDown();

  doc.fontSize(12).text(`Wallet: ${report.address}`);
  doc.fontSize(12).text(`Cost basis method: ${report.summary.costBasisMethod}`);
  doc.moveDown();

  // Summary
  doc.fontSize(18).text("Summary", { underline: true });
  doc.moveDown();
  doc.fontSize(12).text(`Short-term capital gain (USD): ${formatUsd(report.summary.shortTermGainUsd)}`);
  doc.fontSize(12).text(`Long-term capital gain (USD): ${formatUsd(report.summary.longTermGainUsd)}`);
  doc.fontSize(12).text(`Total capital gain (USD): ${formatUsd(report.summary.totalCapitalGainUsd)}`);
  doc.fontSize(12).text(`Total ordinary income (USD): ${formatUsd(report.summary.totalOrdinaryIncomeUsd)}`);
  doc.moveDown();

  // Capital Gains
  doc.fontSize(18).text("Capital Gains / Losses (Form 8949)", { underline: true });
  doc.moveDown();
  const gainsHeaders = ["Description", "Quantity", "Date Acquired", "Date Sold", "Proceeds", "Cost Basis", "Gain/Loss"];
  // a table for capital gains
  const gainsRows = report.gainLossRows.map(r => [
    r.symbol,
    formatTokenQty(r.quantityRaw, r.decimals),
    formatDateUtc(r.acquiredAt),
    formatDateUtc(r.disposedAt),
    formatUsd(r.proceedsUsd),
    formatUsd(r.costBasisUsd),
    formatUsd(r.gainLossUsd),
  ]);
  // draw the table
  const gainsTableTop = doc.y;
  doc.font("Helvetica-Bold");
  gainsHeaders.forEach((header, i) => {
    doc.text(header, 50 + i * 80, gainsTableTop);
  });
  doc.font("Helvetica");
  gainsRows.forEach((row, i) => {
    row.forEach((cell, j) => {
      doc.text(cell, 50 + j * 80, gainsTableTop + (i + 1) * 20);
    });
  });

  doc.moveDown(report.gainLossRows.length + 2);

  // Ordinary Income
  doc.fontSize(18).text("Ordinary Income", { underline: true });
  doc.moveDown();
  const incomeHeaders = ["Description", "Date Received", "Type", "Amount (USD)"];
  // a table for ordinary income
  const incomeRows = report.incomeRows.map(r => [
    r.symbol,
    formatDateUtc(r.receivedAt),
    r.kind === "STAKING_INCOME" ? "Staking" : "Airdrop",
    formatUsd(r.amountUsd),
  ]);

  // draw the table
    const incomeTableTop = doc.y;
    doc.font("Helvetica-Bold");
    incomeHeaders.forEach((header, i) => {
        doc.text(header, 50 + i * 120, incomeTableTop);
    });
    doc.font("Helvetica");
    incomeRows.forEach((row, i) => {
        row.forEach((cell, j) => {
            doc.text(cell, 50 + j * 120, incomeTableTop + (i + 1) * 20);
        });
    });


  const buffers: Buffer[] = [];
  doc.on("data", buffers.push.bind(buffers));

  return new Promise((resolve, reject) => {
    doc.on("end", () => {
      resolve(Buffer.concat(buffers));
    });
    doc.on("error", reject);
    doc.end();
  });
}

export { toPdf };
