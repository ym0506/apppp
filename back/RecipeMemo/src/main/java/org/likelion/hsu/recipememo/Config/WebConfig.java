package org.likelion.hsu.recipememo.Config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;

/**
 * 웹 설정 클래스 - CORS(Cross-Origin Resource Sharing) 설정 및 정적 리소스 서빙을 담당
 * 프론트엔드(React)에서 백엔드(Spring Boot) API에 접근할 수 있도록 허용
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${upload.path:uploads/}")
    private String uploadPath;

    /**
     * CORS 매핑 설정
     * 
     * @param registry CORS 설정을 등록하는 레지스트리
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**") // "/api/"로 시작하는 모든 엔드포인트에 CORS 적용
                .allowedOrigins(
                        "http://localhost:3000", // React 개발 서버 (기본 포트)
                        "http://localhost:3001", // React 대안 포트
                        "http://127.0.0.1:3000", // localhost 대신 IP 주소 사용
                        "http://127.0.0.1:3001", // localhost 대신 IP 주소 사용 (3001)
                        "http://192.168.*:3000", // 같은 네트워크 내 다른 기기에서 접근
                        "http://192.168.*:3001" // 같은 네트워크 내 다른 기기에서 접근 (3001)
                ) // 허용할 프론트엔드 주소들
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // 허용할 HTTP 메서드들
                .allowedHeaders("*") // 모든 헤더 허용
                .allowCredentials(true) // 쿠키, 인증 정보 포함 허용
                .maxAge(3600); // preflight 요청 캐시 시간 (1시간)
    }

    /**
     * 정적 리소스 핸들러 설정
     * 업로드된 이미지 파일들을 HTTP를 통해 접근 가능하도록 설정
     * 
     * @param registry 리소스 핸들러 등록 레지스트리
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 업로드된 이미지 파일 접근 경로 설정
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + uploadPath)
                .setCachePeriod(3600); // 1시간 캐시

        // 기본 정적 리소스 설정
        registry.addResourceHandler("/static/**")
                .addResourceLocations("classpath:/static/")
                .setCachePeriod(31536000); // 1년 캐시 (정적 파일)

        // 개발용: 디버깅을 위한 로그
        System.out.println("📁 정적 리소스 핸들러 설정 완료: /uploads/** -> file:" + uploadPath);
    }

    /**
     * SPA (Single Page Application) 지원
     * React Router의 client-side routing을 위한 설정
     */
    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // API가 아닌 모든 경로는 index.html로 포워딩 (React Router 지원)
        registry.addViewController("/{spring:[^.]*}")
                .setViewName("forward:/index.html");
    }
}
