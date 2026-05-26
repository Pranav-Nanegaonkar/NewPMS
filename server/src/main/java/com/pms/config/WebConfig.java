package com.pms.config;

import org.springframework.context.annotation.Configuration;

/**
 * Web MVC configuration.
 * CORS is handled by SecurityConfig's CorsConfigurationSource bean
 * to ensure it works correctly with Spring Security's filter chain.
 */
@Configuration
public class WebConfig {
    // CORS configuration is managed in SecurityConfig


}
