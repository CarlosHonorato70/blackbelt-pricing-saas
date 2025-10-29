import { Proposal, ProposalItem } from "../drizzle/schema";

interface ProposalData {
  proposal: Proposal & { items?: ProposalItem[] };
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  serviceName?: string;
}

export function generateProposalHTML(data: ProposalData): string {
  const { proposal, clientName, clientEmail, clientPhone } = data;

  const items = proposal.items || [];
  const totalItems = items.reduce((sum, item) => sum + parseFloat(item.itemTotal || "0"), 0);
  const discountAmount = (parseFloat(proposal.discountPercent || "0") / 100) * totalItems;
  const finalTotal = totalItems - discountAmount + parseFloat(proposal.travelFee || "0");

  const itemsHTML = items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${item.serviceId}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">
        R$ ${parseFloat(item.unitValue || "0").toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">
        ${parseFloat(item.volumeDiscount || "0").toFixed(2)}%
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: bold;">
        R$ ${parseFloat(item.itemTotal || "0").toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
      </td>
    </tr>
  `
    )
    .join("");

  const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Proposta ${proposal.proposalNumber}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #1f2937;
          line-height: 1.6;
          background: white;
        }
        
        .container {
          max-width: 900px;
          margin: 0 auto;
          padding: 40px;
          background: white;
        }
        
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
          border-bottom: 3px solid #1e40af;
          padding-bottom: 20px;
        }
        
        .header-left h1 {
          font-size: 28px;
          color: #1e40af;
          margin-bottom: 5px;
        }
        
        .header-left p {
          color: #6b7280;
          font-size: 14px;
        }
        
        .header-right {
          text-align: right;
        }
        
        .header-right .proposal-number {
          font-size: 18px;
          font-weight: bold;
          color: #1f2937;
        }
        
        .header-right .proposal-date {
          color: #6b7280;
          font-size: 14px;
          margin-top: 5px;
        }
        
        .section {
          margin-bottom: 30px;
        }
        
        .section-title {
          font-size: 14px;
          font-weight: bold;
          color: #1e40af;
          text-transform: uppercase;
          margin-bottom: 15px;
          padding-bottom: 8px;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .client-info {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        
        .info-block {
          font-size: 14px;
        }
        
        .info-label {
          color: #6b7280;
          font-weight: 600;
          margin-bottom: 5px;
        }
        
        .info-value {
          color: #1f2937;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        
        thead {
          background-color: #f3f4f6;
        }
        
        th {
          padding: 12px;
          text-align: left;
          font-weight: 600;
          color: #1f2937;
          border-bottom: 2px solid #e5e7eb;
          font-size: 13px;
        }
        
        td {
          padding: 12px;
          border-bottom: 1px solid #e5e7eb;
          font-size: 13px;
        }
        
        .summary {
          margin-top: 30px;
          padding: 20px;
          background-color: #f9fafb;
          border-radius: 8px;
        }
        
        .summary-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
          font-size: 14px;
        }
        
        .summary-row.total {
          border-top: 2px solid #e5e7eb;
          padding-top: 12px;
          font-size: 16px;
          font-weight: bold;
          color: #1e40af;
        }
        
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          text-align: center;
          color: #6b7280;
          font-size: 12px;
        }
        
        .validity {
          background-color: #eff6ff;
          border-left: 4px solid #1e40af;
          padding: 15px;
          margin-bottom: 20px;
          font-size: 13px;
        }
        
        .validity-label {
          color: #1e40af;
          font-weight: 600;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <div class="header-left">
            <h1>Black Belt Consultoria</h1>
            <p>Proposta Comercial</p>
          </div>
          <div class="header-right">
            <div class="proposal-number">${proposal.proposalNumber}</div>
            <div class="proposal-date">${new Date(proposal.createdAt).toLocaleDateString("pt-BR")}</div>
          </div>
        </div>
        
        <!-- Validity Notice -->
        <div class="validity">
          <span class="validity-label">Validade da Proposta:</span> ${proposal.validityDays} dias a partir da data de emissão
        </div>
        
        <!-- Client Information -->
        <div class="section">
          <div class="section-title">Dados do Cliente</div>
          <div class="client-info">
            <div class="info-block">
              <div class="info-label">Cliente</div>
              <div class="info-value">${clientName}</div>
            </div>
            ${clientEmail ? `
            <div class="info-block">
              <div class="info-label">Email</div>
              <div class="info-value">${clientEmail}</div>
            </div>
            ` : ""}
            ${clientPhone ? `
            <div class="info-block">
              <div class="info-label">Telefone</div>
              <div class="info-value">${clientPhone}</div>
            </div>
            ` : ""}
            <div class="info-block">
              <div class="info-label">Regime Tributário</div>
              <div class="info-value">${proposal.taxRegime}</div>
            </div>
          </div>
        </div>
        
        <!-- Items Table -->
        <div class="section">
          <div class="section-title">Itens da Proposta</div>
          <table>
            <thead>
              <tr>
                <th>Serviço</th>
                <th style="text-align: center;">Qtd</th>
                <th style="text-align: right;">Valor Unit.</th>
                <th style="text-align: right;">Desconto</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
          </table>
        </div>
        
        <!-- Summary -->
        <div class="summary">
          <div class="summary-row">
            <span>Subtotal:</span>
            <span>R$ ${totalItems.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
          </div>
          ${parseFloat(proposal.discountPercent || "0") > 0 ? `
          <div class="summary-row">
            <span>Desconto (${proposal.discountPercent || "0"}%):</span>
            <span style="color: #dc2626;">-R$ ${discountAmount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
          </div>
          ` : ""}
          ${parseFloat(proposal.travelFee || "0") > 0 ? `
          <div class="summary-row">
            <span>Taxa de Deslocamento:</span>
            <span>R$ ${parseFloat(proposal.travelFee || "0").toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
          </div>
          ` : ""}
          <div class="summary-row total">
            <span>VALOR TOTAL:</span>
            <span>R$ ${finalTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
        
        <!-- Notes -->
        ${proposal.notes ? `
        <div class="section">
          <div class="section-title">Observações</div>
          <p style="font-size: 13px; color: #1f2937; white-space: pre-wrap;">${proposal.notes}</p>
        </div>
        ` : ""}
        
        <!-- Footer -->
        <div class="footer">
          <p>Esta proposta foi gerada automaticamente pelo sistema Black Belt Pricing SaaS</p>
          <p style="margin-top: 10px;">Documento confidencial - Uso restrito ao cliente</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return html;
}
