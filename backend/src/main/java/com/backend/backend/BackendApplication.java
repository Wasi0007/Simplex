package com.backend.backend;

import com.backend.backend.data.models.Role;
import com.backend.backend.data.models.User;
import com.backend.backend.data.repositories.RoleRepository;
import com.backend.backend.data.repositories.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.core.annotation.Order;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

@SpringBootApplication
@EnableJpaAuditing
public class BackendApplication {

    public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}


	@Bean
	@Order(Integer.MAX_VALUE)
	@Transactional
	public CommandLineRunner runner(RoleRepository roleRepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
		return args -> {
			if(roleRepository.findByName("USER").isEmpty()){

				Role role = Role.builder().name("USER").build();
				roleRepository.save(
						role
				);
			}

			var userRole = roleRepository.findByName("USER")
					.orElseThrow(() -> new IllegalStateException("ROLE User not initialized"));

			User check = userRepository.findByEmail("admin@gmail.com").orElse(null);
			if(check == null){
				var user = User.builder()
						.firstName("Admin")
						.lastName("Admin")
						.email("admin@gmail.com")
						.password(passwordEncoder.encode("11223344"))
						.accountLocked(true)
						.enabled(true)
						.roles(List.of(userRole))
						.build();

				userRepository.save(user);
			}

		};
	}
}
