package org.likelion.hsu.recipememo.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.core.env.Environment;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * 애플리케이션 상태 모니터링 컨트롤러
 * Railway 배포 시 헬스체크 및 시스템 상태 확인용
 */
@RestController
@RequestMapping("/api/health")
@RequiredArgsConstructor
public class HealthController {

    private final Environment environment;
    private final DataSource dataSource;

    /**
     * 기본 헬스체크 엔드포인트
     * Railway의 헬스체크에서 사용됨
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("message", "레시피 메모 서버가 정상적으로 실행 중입니다! 🎉");
        health.put("timestamp", LocalDateTime.now().toString());
        health.put("version", "1.0.0");

        return ResponseEntity.ok(health);
    }

    /**
     * 상세 시스템 정보 엔드포인트
     * 개발/운영 환경 모니터링용
     */
    @GetMapping("/info")
    public ResponseEntity<Map<String, Object>> systemInfo() {
        Map<String, Object> info = new HashMap<>();

        // 기본 애플리케이션 정보
        info.put("application", "RecipeMemo API");
        info.put("version", "1.0.0");
        info.put("timestamp", LocalDateTime.now().toString());

        // 환경 정보
        String activeProfile = environment.getProperty("spring.profiles.active", "dev");
        info.put("profile", activeProfile);
        info.put("javaVersion", System.getProperty("java.version"));
        info.put("springBootVersion", org.springframework.boot.SpringBootVersion.getVersion());

        // 시스템 리소스 정보
        Runtime runtime = Runtime.getRuntime();
        Map<String, Object> memory = new HashMap<>();
        memory.put("total", runtime.totalMemory() / (1024 * 1024) + " MB");
        memory.put("free", runtime.freeMemory() / (1024 * 1024) + " MB");
        memory.put("used", (runtime.totalMemory() - runtime.freeMemory()) / (1024 * 1024) + " MB");
        memory.put("max", runtime.maxMemory() / (1024 * 1024) + " MB");
        info.put("memory", memory);

        // 데이터베이스 상태 확인
        info.put("database", checkDatabaseHealth());

        return ResponseEntity.ok(info);
    }

    /**
     * 데이터베이스 연결 상태 확인
     */
    @GetMapping("/db")
    public ResponseEntity<Map<String, Object>> databaseHealth() {
        Map<String, Object> dbHealth = checkDatabaseHealth();

        if ("UP".equals(dbHealth.get("status"))) {
            return ResponseEntity.ok(dbHealth);
        } else {
            return ResponseEntity.status(503).body(dbHealth);
        }
    }

    /**
     * API 엔드포인트 목록
     * 개발용 API 문서 역할
     */
    @GetMapping("/endpoints")
    public ResponseEntity<Map<String, Object>> availableEndpoints() {
        Map<String, Object> endpoints = new HashMap<>();

        Map<String, String> recipeEndpoints = new HashMap<>();
        recipeEndpoints.put("GET /api/recipes/health", "백엔드 연결 테스트");
        recipeEndpoints.put("POST /api/recipes", "레시피 생성");
        recipeEndpoints.put("GET /api/recipes/category/{category}", "카테고리별 레시피 조회");
        recipeEndpoints.put("GET /api/recipes/category/{category}/{id}", "특정 레시피 상세 조회");
        recipeEndpoints.put("GET /api/recipes/search?title={title}", "레시피 검색");
        recipeEndpoints.put("GET /api/recipes/user/{firebaseUid}", "사용자별 레시피 조회");
        recipeEndpoints.put("PUT /api/recipes/{id}", "레시피 수정");
        recipeEndpoints.put("DELETE /api/recipes/{id}", "레시피 삭제");
        recipeEndpoints.put("GET /api/recipes/{id}", "ID로 레시피 조회");

        Map<String, String> healthEndpoints = new HashMap<>();
        healthEndpoints.put("GET /api/health", "기본 헬스체크");
        healthEndpoints.put("GET /api/health/info", "시스템 정보");
        healthEndpoints.put("GET /api/health/db", "데이터베이스 상태");
        healthEndpoints.put("GET /api/health/endpoints", "API 엔드포인트 목록");

        endpoints.put("recipe", recipeEndpoints);
        endpoints.put("health", healthEndpoints);
        endpoints.put("timestamp", LocalDateTime.now().toString());

        return ResponseEntity.ok(endpoints);
    }

    /**
     * 데이터베이스 연결 상태 확인 헬퍼 메서드
     */
    private Map<String, Object> checkDatabaseHealth() {
        Map<String, Object> dbHealth = new HashMap<>();

        try (Connection connection = dataSource.getConnection()) {
            if (connection.isValid(5)) { // 5초 타임아웃
                dbHealth.put("status", "UP");
                dbHealth.put("database", connection.getMetaData().getDatabaseProductName());
                dbHealth.put("url", connection.getMetaData().getURL());
                dbHealth.put("message", "데이터베이스 연결이 정상입니다.");
            } else {
                dbHealth.put("status", "DOWN");
                dbHealth.put("message", "데이터베이스 연결이 유효하지 않습니다.");
            }
        } catch (Exception e) {
            dbHealth.put("status", "DOWN");
            dbHealth.put("message", "데이터베이스 연결 실패: " + e.getMessage());
            dbHealth.put("error", e.getClass().getSimpleName());
        }

        dbHealth.put("timestamp", LocalDateTime.now().toString());
        return dbHealth;
    }
}