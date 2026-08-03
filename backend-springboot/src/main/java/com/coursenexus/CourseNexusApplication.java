package com.coursenexus;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class CourseNexusApplication {
	public static void main(String[] args) {
		SpringApplication.run(CourseNexusApplication.class, args);
	}
}

