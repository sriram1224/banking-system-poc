package com.bank.poc.gateway.controller;

import com.bank.poc.gateway.DTO.TransactionRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@RequiredArgsConstructor
public class TransactionController {

    private final RestTemplate restTemplate;

    @PostMapping("/transaction")
    public Object handleTransaction(@RequestBody TransactionRequest req) {

        // 1. Validate card number
        if (req.getCardNumber() == null || req.getCardNumber().isEmpty()) {
            return error("Card number is required");
        }

        // 2. Validate card range — requirement from assignment
        if (!req.getCardNumber().startsWith("4")) {
            return error("Card range not supported");
        }
        if (req.getPin() == null || req.getPin().isEmpty()) {
            return error("PIN is required");
        }

        // 3. Validate amount
        if (req.getAmount() <= 0) {
            return error("Amount must be greater than zero");
        }

        // 4. Validate type
        if (!req.getType().equalsIgnoreCase("withdraw") &&
                !req.getType().equalsIgnoreCase("topup")) {
            return error("Invalid type");
        }

        // 5. Forward to System 2 (CoreBank)
        String url = "https://system2-corebank.onrender.com/process";

        return restTemplate.postForObject(url, req, Object.class);
    }

    // helper
    private Object error(String msg) {
        return new ErrorResponse("FAILED", msg);
    }

    record ErrorResponse(String status, String reason) {}
}
