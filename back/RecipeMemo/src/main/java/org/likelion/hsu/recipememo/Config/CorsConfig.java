package org.likelion.hsu.recipememo.Config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * CORS(Cross-Origin Resource Sharing) 설정
 * 프론트엔드와 백엔드가 다른 도메인에서 실행될 때 필요한 설정
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Value("${spring.profiles.active:dev}")
    private String activeProfile;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        if ("prod".equals(activeProfile)) {
            // 프로덕션 환경: 특정 도메인만 허용 (보안 강화)
            registry.addMapping("/**")
                    .allowedOrigins(
                            "https://your-frontend-domain.com", // 실제 프론트엔드 도메인으로 변경 필요
                            "https://your-app.up.railway.app" // Railway 프론트엔드 도메인
                    )
                    .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                    .allowedHeaders("*")
                    .allowCredentials(false) // 프로덕션에서는 필요시에만 true
                    .maxAge(3600); // preflight 캐시 시간 (1시간)
        } else {
            // 개발 환경: 여러 개발 환경 지원
            registry.addMapping("/**")
                    .allowedOrigins(
                            "http://localhost:3000", // React 개발 서버
                            "http://localhost:3001", // 대안 포트
                            "http://127.0.0.1:3000", // 로컬호스트 대안
                            "https://*.up.railway.app", // Railway 도메인 (와일드카드)
                            "https://*.ngrok.io", // ngrok 임시 도메인
                            "https://*.vercel.app", // Vercel 배포
                            "https://*.netlify.app" // Netlify 배포
                    )
                    .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                    .allowedHeaders("*")
                    .allowCredentials(false)
                    .maxAge(86400); // 개발 환경에서는 하루 캐시
        }
    }
}
