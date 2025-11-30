package com.bank.poc.core.service;

import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.stereotype.Service;

@Service
public class PinService {

    public String hashPin(String pin) {
        return DigestUtils.sha256Hex(pin);
    }
}