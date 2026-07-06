package com.hiresense.recruitment.config;

import com.hiresense.recruitment.model.Company;
import com.hiresense.recruitment.repository.CompanyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component("recruitmentDatabaseSeeder")
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private CompanyRepository companyRepository;

    @Override
    public void run(String... args) throws Exception {
        if (companyRepository.count() == 0) {
            Company company = Company.builder()
                    .name("Tech Corp")
                    .logoUrl("https://logo.clearbit.com/techcorp.com")
                    .website("https://techcorp.com")
                    .verified(true)
                    .build();
            companyRepository.save(company);
            System.out.println("[DatabaseSeeder] Seeded company: Tech Corp");
        }
    }
}
