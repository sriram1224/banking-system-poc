package com.bank.poc.core.controller;

import com.bank.poc.core.DTO.TransactionRequest;
import com.bank.poc.core.entity.Card;
import com.bank.poc.core.entity.Transaction;
import com.bank.poc.core.repository.CardRepository;
import com.bank.poc.core.repository.TransactionRepository;
import com.bank.poc.core.service.PinService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequiredArgsConstructor
public class ProcessingController {

    private final CardRepository cardRepo;
    private final TransactionRepository txRepo;
    private final PinService pinService;

    @GetMapping("/transactions/all")
    public Object getAllTransactions() {
        return txRepo.findAll();
    }


    @GetMapping("/transactions")
    public Object getTransactions(@RequestParam String cardNumber) {
        return txRepo.findByCardNumber(cardNumber);
    }


    @GetMapping("/balance")
    public ResponseEntity<?> getBalance(@RequestParam String cardNumber) {
        return cardRepo.findById(cardNumber)
                .<ResponseEntity<?>>map(card -> ResponseEntity.ok(card.getBalance()))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Card not found"));
    }

    @PostMapping("/process")
    public Object process(@RequestBody TransactionRequest req) {

        Transaction tx = new Transaction();
        tx.setCardNumber(req.getCardNumber());
        tx.setAmount(req.getAmount());
        tx.setType(req.getType());
        tx.setTimestamp(LocalDateTime.now());

        // 1. Card exists?
        Card card = cardRepo.findById(req.getCardNumber()).orElse(null);
        if (card == null) {
            tx.setStatus("FAILED");
            tx.setReason("Invalid card");
            txRepo.save(tx);
            return tx;
        }

        // 2. PIN validation
        String hashed = pinService.hashPin(req.getPin());
        if (!hashed.equals(card.getPinHash())) {
            tx.setStatus("FAILED");
            tx.setReason("Invalid PIN");
            txRepo.save(tx);
            return tx;
        }

        // 3. Process
        if (req.getType().equalsIgnoreCase("withdraw")) {

            if (card.getBalance() < req.getAmount()) {
                tx.setStatus("FAILED");
                tx.setReason("Insufficient balance");
                txRepo.save(tx);
                return tx;
            }

            card.setBalance(card.getBalance() - req.getAmount());

        } else if (req.getType().equalsIgnoreCase("topup")) {

            card.setBalance(card.getBalance() + req.getAmount());

        } else {
            tx.setStatus("FAILED");
            tx.setReason("Invalid type");
            txRepo.save(tx);
            return tx;
        }

        // 4. Save updated balance
        cardRepo.save(card);

        // 5. Save transaction log
        tx.setStatus("SUCCESS");
        tx.setReason("Transaction complete");
        txRepo.save(tx);

        return tx;
    }
}
