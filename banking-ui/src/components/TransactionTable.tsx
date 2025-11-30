import React from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
} from "@mui/material";

export interface TxRecord {
  id?: number;
  cardNumber: string;
  type: string;
  amount: number;
  status: string;
  reason?: string;
  timestamp?: string;
}

interface Props {
  rows: TxRecord[];
  showCard?: boolean;
  compact?: boolean;
}

const statusColor = (status: string) => {
  switch (status?.toUpperCase()) {
    case "SUCCESS":
      return "success";
    case "FAILED":
      return "error";
    default:
      return "default";
  }
};

export const TransactionTable: React.FC<Props> = ({
  rows,
  showCard = false,
  compact = false,
}) => {
  return (
    <Table
      size={compact ? "small" : "medium"}
      sx={{ maxWidth: "100%", border: "1px solid #e0e0e0" }}
    >
      <TableHead>
        <TableRow>
          {showCard && <TableCell>Card</TableCell>}
          <TableCell>Time</TableCell>
          <TableCell>Type</TableCell>
          <TableCell align="right">Amount</TableCell>
          <TableCell>Status</TableCell>
          <TableCell>Reason</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((r) => {
          const dateStr = r.timestamp
            ? new Date(r.timestamp).toLocaleString()
            : "—";
          return (
            <TableRow
              key={
                r.id ?? `${r.cardNumber}-${r.timestamp}-${r.type}-${r.amount}`
              }
            >
              {showCard && (
                <TableCell sx={{ fontFamily: "monospace" }}>
                  {r.cardNumber}
                </TableCell>
              )}
              <TableCell>{dateStr}</TableCell>
              <TableCell sx={{ textTransform: "capitalize" }}>
                {r.type}
              </TableCell>
              <TableCell align="right">{r.amount.toFixed(2)}</TableCell>
              <TableCell>
                <Chip
                  size="small"
                  label={r.status}
                  color={statusColor(r.status)}
                  variant={r.status === "SUCCESS" ? "filled" : "outlined"}
                />
              </TableCell>
              <TableCell sx={{ maxWidth: 240 }}>
                {r.reason && r.reason !== "Transaction complete"
                  ? r.reason
                  : r.status === "SUCCESS"
                  ? "—"
                  : r.reason || "—"}
              </TableCell>
            </TableRow>
          );
        })}
        {rows.length === 0 && (
          <TableRow>
            <TableCell
              colSpan={showCard ? 6 : 5}
              align="center"
              sx={{ fontStyle: "italic", color: "#666" }}
            >
              No transactions yet
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default TransactionTable;
