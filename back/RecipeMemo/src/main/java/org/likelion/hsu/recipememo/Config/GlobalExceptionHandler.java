package org.likelion.hsu.recipememo.Config;

import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import javax.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * 전역 예외 처리기
 * 애플리케이션 전체에서 발생하는 예외를 일관된 형태로 처리
 */
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    /**
     * JSON 파싱 오류 처리
     */
    @ExceptionHandler({ JsonProcessingException.class, HttpMessageNotReadableException.class })
    public ResponseEntity<Map<String, Object>> handleJsonProcessingException(Exception e) {
        log.error("JSON 파싱 오류: {}", e.getMessage(), e);

        Map<String, Object> errorResponse = createErrorResponse(
                "JSON_PARSING_ERROR",
                "요청 데이터를 파싱하는 중 오류가 발생했습니다.",
                HttpStatus.BAD_REQUEST);

        return ResponseEntity.badRequest().body(errorResponse);
    }

    /**
     * 파일 업로드 크기 초과 오류 처리
     */
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<Map<String, Object>> handleMaxUploadSizeExceeded(MaxUploadSizeExceededException e) {
        log.error("파일 크기 초과: {}", e.getMessage());

        Map<String, Object> errorResponse = createErrorResponse(
                "FILE_SIZE_EXCEEDED",
                "업로드 파일 크기가 제한을 초과했습니다. (최대 10MB)",
                HttpStatus.PAYLOAD_TOO_LARGE);

        return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE).body(errorResponse);
    }

    /**
     * 엔티티 찾지 못함 오류 처리
     */
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleEntityNotFound(EntityNotFoundException e) {
        log.error("엔티티 찾지 못함: {}", e.getMessage());

        Map<String, Object> errorResponse = createErrorResponse(
                "ENTITY_NOT_FOUND",
                "요청한 리소스를 찾을 수 없습니다.",
                HttpStatus.NOT_FOUND);

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }

    /**
     * 유효성 검증 실패 처리
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationException(MethodArgumentNotValidException e) {
        log.error("유효성 검증 실패: {}", e.getMessage());

        Map<String, Object> errorResponse = createErrorResponse(
                "VALIDATION_FAILED",
                "입력 데이터 유효성 검증에 실패했습니다.",
                HttpStatus.BAD_REQUEST);

        // 필드별 오류 정보 추가
        Map<String, String> fieldErrors = new HashMap<>();
        e.getBindingResult().getFieldErrors()
                .forEach(error -> fieldErrors.put(error.getField(), error.getDefaultMessage()));
        errorResponse.put("fieldErrors", fieldErrors);

        return ResponseEntity.badRequest().body(errorResponse);
    }

    /**
     * 일반적인 런타임 예외 처리
     */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntimeException(RuntimeException e) {
        log.error("런타임 오류: {}", e.getMessage(), e);

        Map<String, Object> errorResponse = createErrorResponse(
                "RUNTIME_ERROR",
                "서버에서 오류가 발생했습니다.",
                HttpStatus.INTERNAL_SERVER_ERROR);

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }

    /**
     * 예상치 못한 모든 예외 처리
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGenericException(Exception e) {
        log.error("예상치 못한 오류: {}", e.getMessage(), e);

        Map<String, Object> errorResponse = createErrorResponse(
                "INTERNAL_SERVER_ERROR",
                "서버 내부 오류가 발생했습니다.",
                HttpStatus.INTERNAL_SERVER_ERROR);

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }

    /**
     * 에러 응답 생성 헬퍼 메서드
     */
    private Map<String, Object> createErrorResponse(String errorCode, String message, HttpStatus status) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("success", false);
        errorResponse.put("errorCode", errorCode);
        errorResponse.put("message", message);
        errorResponse.put("status", status.value());
        errorResponse.put("timestamp", LocalDateTime.now().toString());
        return errorResponse;
    }
}