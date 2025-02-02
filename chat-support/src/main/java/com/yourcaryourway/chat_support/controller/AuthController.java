package com.yourcaryourway.chat_support.controller;

import com.yourcaryourway.chat_support.dtos.Connexion;
import com.yourcaryourway.chat_support.dtos.Credential;
import com.yourcaryourway.chat_support.dtos.Inscription;
import com.yourcaryourway.chat_support.dtos.TokenAndIdRecord;
import com.yourcaryourway.chat_support.models.User;
import com.yourcaryourway.chat_support.services.JwtService;
import com.yourcaryourway.chat_support.services.UserInfoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

/**
 * Controller responsible for handling authentication-related operations.
 * This includes user registration, login, and retrieving current user information.
 */
@Validated
@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Authentication management API")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    private static final String AUTHENTICATION_FAILED = "Authentication failed";
    private static final String INVALID_USER_REQUEST = "Invalid user request";
    public static final String FAILED_TO_REGISTER_USER = "Failed to register user";
    public static final String FAILED_TO_RETRIEVE_CURRENT_USER = "Failed to retrieve current user";

    private final UserInfoService userInfoService;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthController(UserInfoService userInfoService, AuthenticationManager authenticationManager, JwtService jwtService) {
        this.userInfoService = userInfoService;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @SecurityRequirements
    @Operation(summary = "Register a new user", description = "Creates a new user account and returns a JWT token")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully registered",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = TokenDto.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input")
    })
    @PostMapping("/register")
    public ResponseEntity<TokenDto> register(@Valid @RequestBody Inscription inscriptionRecord) {
        try {
            User user = new User(inscriptionRecord.username(), inscriptionRecord.email(), inscriptionRecord.password());
            userInfoService.addUser(user);
            String token = authenticateAndGetToken(inscriptionRecord.email(), inscriptionRecord.password());
            logger.info("User registered successfully: {}", inscriptionRecord.email());
            return ResponseEntity.status(HttpStatus.OK).body(new TokenDto(token));
        } catch (Exception e) {
            logger.error("Error during user registration: {}", e.getMessage());
            throw new RuntimeException(FAILED_TO_REGISTER_USER, e);
        }
    }

    @SecurityRequirements
    @Operation(summary = "Login user", description = "Authenticates a user and returns a JWT token")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully authenticated",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = TokenDto.class))),
            @ApiResponse(responseCode = "401", description = "Authentication failed")
    })
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody Connexion connexionRecord) {
        logger.info("Beginning of the authentication process for : {}", connexionRecord.email());
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(connexionRecord.email(), connexionRecord.password())
            );
            if (authentication.isAuthenticated()) {
                String token = jwtService.generateToken(authentication);
                UUID id = jwtService.getCurrentUser(authentication).getId();
                logger.info("User logged in successfully: {}", connexionRecord.email());
                return ResponseEntity.ok(new TokenAndIdRecord(token, id));
            } else {
                logger.warn("Authentication failed for user: {}", connexionRecord.email());
                return ResponseEntity.status(401).body("{\"message\": \"error\"}");
            }
        } catch (Exception e) {
            logger.error("Error during login: {}", e.getMessage());
            throw new RuntimeException(AUTHENTICATION_FAILED);
        }
    }

    @Operation(summary = "Get current user credentials", description = "Retrieves the details of the currently authenticated user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved user details",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = Credential.class))),
            @ApiResponse(responseCode = "401", description = "Not authenticated"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    @GetMapping(value = "/credentials", produces = MediaType.APPLICATION_JSON_VALUE)
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<Credential> getCurrentUser() {
        try {
            User currentUser = jwtService.getCurrentUser();
            Credential credential = new Credential(currentUser.getFirstName(), currentUser.getEmail());
            logger.info("Retrieved current user: {}", currentUser.getEmail());
            return ResponseEntity.ok(credential);
        } catch (Exception e) {
            logger.error("Error retrieving current user: {}", e.getMessage());
            throw new RuntimeException(FAILED_TO_RETRIEVE_CURRENT_USER);
        }
    }

    private String authenticateAndGetToken(String email, String password) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
        );
        if (authentication.isAuthenticated()) {
            return jwtService.generateToken(authentication);
        } else {
            logger.warn("Invalid authentication request for user: {}", email);
            throw new RuntimeException(INVALID_USER_REQUEST);
        }
    }

    public record TokenDto(String token) {}
}