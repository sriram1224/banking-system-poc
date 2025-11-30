/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { apiGateway } from "../services/apiGateway";
import { apiCore } from "../services/apiCore";
import { TextField, Button, Paper, Typography, Box } from "@mui/material";
import { toast } from "sonner";
import TransactionTable from "../components/TransactionTable";

export default function CustomerDashboard() {
  const storedCard = sessionStorage.getItem("cardNumber");
  const cardNumber = storedCard || "4123456789012345";
  const [balance, setBalance] = useState<number>(0);
  const [tx, setTx] = useState<any[]>([]);
  const [amount, setAmount] = useState<string>("");
  const [pin, setPin] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const load = async () => {
    try {
      const bal = await apiCore.get(`/balance?cardNumber=${cardNumber}`);
      setBalance(bal.data);
    } catch (e: any) {
      setMessage(
        typeof e?.response?.data === "string"
          ? e.response.data
          : "Failed to fetch balance"
      );
    }
    try {
      const history = await apiCore.get(
        `/transactions?cardNumber=${cardNumber}`
      );
      setTx(history.data);
    } catch {
      // ignore
    }
  };

  const doTransaction = async (txnType: "topup" | "withdraw") => {
    setMessage("");
    const amt = parseFloat(amount);
    if (Number.isNaN(amt) || amt <= 0) {
      setMessage("Enter a valid positive amount");
      toast.error("Amount must be positive");
      return;
    }
    if (!pin) {
      setMessage("PIN is required");
      toast.error("PIN is required");
      return;
    }
    try {
      setLoading(true);
      const res = await apiGateway.post("/transaction", {
        cardNumber,
        pin,
        amount: amt,
        type: txnType,
      });
      const data = res.data;
      if (data?.status && data.status !== "SUCCESS") {
        const reason = data.reason || "Transaction failed";
        setMessage(reason);
        toast.error(reason);
      } else {
        setMessage("Transaction successful");
        toast.success(
          `${txnType === "topup" ? "Top-up" : "Withdraw"} successful`
        );
      }
      await load();
    } catch (e: any) {
      const reason =
        e?.response?.data?.reason || e?.message || "Request failed";
      setMessage(reason);
      toast.error(reason);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    load();
  }, []);

  const disabled = loading || !amount || Number.parseFloat(amount) <= 0 || !pin;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        p: 4,
        maxWidth: 1000,
        width: "100%",
      }}
    >
      <Typography variant="h4" fontWeight={600}>
        Customer Dashboard
      </Typography>
      <Paper
        elevation={1}
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            Card
          </Typography>
          <Typography variant="body1" fontFamily="monospace">
            {cardNumber}
          </Typography>
        </Box>
        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            Balance
          </Typography>
          <Typography variant="h6" color="primary">
            ₹{balance.toFixed(2)}
          </Typography>
        </Box>
      </Paper>
      <Paper
        elevation={1}
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <TextField
          label="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          size="small"
        />
        <TextField
          label="PIN"
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          size="small"
        />
        <Button
          variant="contained"
          disabled={disabled}
          onClick={() => doTransaction("topup")}
          startIcon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path
                d="M12 5v14m-7-7h14"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          }
        >
          {loading ? "Processing..." : "Top Up"}
        </Button>
        <Button
          variant="outlined"
          disabled={disabled}
          onClick={() => doTransaction("withdraw")}
          startIcon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path
                d="M12 19V5m-7 7h14"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          }
        >
          {loading ? "Processing..." : "Withdraw"}
        </Button>
        {message && (
          <Typography
            variant="body2"
            color={message.includes("success") ? "success.main" : "error.main"}
          >
            {message}
          </Typography>
        )}
      </Paper>
      <Typography variant="h6">Transaction History</Typography>
      <Paper elevation={1} sx={{ p: 0 }}>
        <TransactionTable rows={tx} showCard={false} />
      </Paper>
    </Box>
  );
}
