package com.bank.poc.core.DTO;

import lombok.Data;

@Data
public class TransactionRequest {

    private String cardNumber;
    private String pin;
    private double amount;
    private String type;   // withdraw/topup
}