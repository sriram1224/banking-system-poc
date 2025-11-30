package com.bank.poc.core;

import com.bank.poc.core.entity.Card;
import com.bank.poc.core.repository.CardRepository;
import com.bank.poc.core.service.PinService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final CardRepository cardRepo;
    private final PinService pinService;

    public DataSeeder(CardRepository cardRepo, PinService pinService) {
        this.cardRepo = cardRepo;
        this.pinService = pinService;
    }

    @Override
    public void run(String... args) throws Exception {

        if (!cardRepo.existsById("4123456789012345")) {
            Card c = new Card();
            c.setCardNumber("4123456789012345");
            c.setPinHash(pinService.hashPin("1234"));
            c.setBalance(1000.00);
            c.setCustomerName("John Doe");

            cardRepo.save(c);
        }
    }
}
