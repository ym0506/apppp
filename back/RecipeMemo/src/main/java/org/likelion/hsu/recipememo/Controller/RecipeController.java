package org.likelion.hsu.recipememo.Controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.RequiredArgsConstructor;
import org.likelion.hsu.recipememo.Dto.Response.RecipeListResponseDto;
import org.likelion.hsu.recipememo.Dto.Request.RecipeRequestDto;
import org.likelion.hsu.recipememo.Dto.Response.RecipeResponseDto;
import org.likelion.hsu.recipememo.Dto.Response.RecipeSearchResponseDto;
import org.likelion.hsu.recipememo.Dto.Response.RecipeTitleResponseDto;
import org.likelion.hsu.recipememo.Enum.Category;
import org.likelion.hsu.recipememo.Service.RecipeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/recipes")
@RequiredArgsConstructor
public class RecipeController {

    // 컨트롤러에서 레시피 관련 기능을 쓸 수 있도록, RecipeService를 주입 받는 선언
    private final RecipeService recipeService;

    // API 연결 테스트용 엔드포인트
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "OK");
        response.put("message", "백엔드 서버가 정상적으로 실행 중입니다! 🎉");
        response.put("timestamp", java.time.LocalDateTime.now().toString());
        return ResponseEntity.ok(response);
    }

    // 레시피 생성(사용자가 JSON + 이미지 파일을 함께 업로드해서 레시피를 등록하는 기능)
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<RecipeResponseDto> createRecipe(
            @RequestPart("recipe") String recipeJson, // multipart/form-data의 part 이름이 "recipe"인 문자열을 받음
            @RequestPart(value = "imageFile", required = false) MultipartFile imageFile // required = false → 이미지 파일은
                                                                                        // 필수가 아님 (이미지 없이도 등록 가능)
    ) throws IOException {
        try {
            ObjectMapper mapper = new ObjectMapper(); // JSON 처리 도구 생성 (Jackson 라이브러리 사용)
            mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false); // 알 수 없는 속성 무시
            mapper.configure(DeserializationFeature.ACCEPT_EMPTY_STRING_AS_NULL_OBJECT, true); // 빈 문자열을 null로 처리

            System.out.println("Received JSON: " + recipeJson); // 디버깅용 로그

            RecipeRequestDto dto = mapper.readValue(recipeJson, RecipeRequestDto.class); // JSON 문자열 → RecipeRequestDto
                                                                                         // 객체로 변환

            System.out.println("Parsed DTO: " + dto.getTitle() + ", ingredients: " + dto.getIngredients()); // 디버깅용 로그

            return ResponseEntity.status(HttpStatus.CREATED).body(recipeService.createRecipeWithImage(dto, imageFile));
        } catch (JsonProcessingException e) {
            System.err.println("JSON parsing error: " + e.getMessage());
            System.err.println("Received JSON content: " + recipeJson);
            e.printStackTrace();

            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "JSON 파싱 오류");
            errorResponse.put("message", "요청 데이터 형식이 올바르지 않습니다: " + e.getMessage());
            errorResponse.put("receivedData", recipeJson);

            return ResponseEntity.badRequest().body(null);
        } catch (Exception e) {
            System.err.println("Unexpected error: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
        // 서비스 계층의 createRecipeWithImage(dto, imageFile) 메서드에 변환된 DTO와 이미지 파일 전달
    }
    // 클라이언트가 multipart/form-data 형식으로 보낸 JSON 문자열 + 이미지 파일을 받아서,
    // JSON 문자열을 자바 객체(DTO)로 변환하고,
    // 서비스 계층으로 전달하여 DB에 저장 + 이미지 파일 서버에 저장,
    // 성공 시 201 CREATED 응답과 함께 저장된 레시피 정보를 반환.

    // 카테고리 클릭 시 요리 제목 + 이미지 목록 조회
    @GetMapping("/category/{category}")
    public ResponseEntity<RecipeListResponseDto> getRecipeTitlesByCategory(@PathVariable String category) {
        return ResponseEntity.ok(recipeService.getAllTitlesByCategory(Category.valueOf(category.toUpperCase())));
    }
    // @PathVariable String category: 클라이언트가 URL에 넣은 category 값을 메서드 파라미터로 받아옵니다. 예:
    // /category/KOREAN → category = "KOREAN"
    // recipeService.getAllTitlesByCategory(...): 실제로 DB에서 해당 카테고리에 해당하는 레시피들을 조회하는
    // 서비스 로직을 호출합니다.
    // Category.valueOf(category.toUpperCase()): 문자열을 enum Category로 바꾸는 코드.
    // valueOf()는 반드시 대문자로 된 enum 이름이 필요하기 때문에 .toUpperCase()를 붙임.

    // 제목 클릭 시 상세 레시피 조회
    @GetMapping("/category/{category}/{id}")
    public ResponseEntity<RecipeResponseDto> getRecipeByCategoryAndId(@PathVariable String category,
            @PathVariable Long id) {
        return ResponseEntity.ok(recipeService.getRecipeByCategoryAndId(Category.valueOf(category.toUpperCase()), id));
    }
    // @PathVariable Long id: URL 경로의 {id} 값을 받아옴.
    // recipeService.getRecipeByCategoryAndId(...): 서비스 계층에 카테고리 + ID를 전달해서 해당 레시피를
    // DB에서 찾아옴.

    // 레시피 제목 검색
    @GetMapping("/search")
    public ResponseEntity<RecipeSearchResponseDto> searchRecipes(@RequestParam("title") String title) {
        return ResponseEntity.ok(recipeService.searchRecipesByTitle(title));
    }
    // 예를들어 사용자가 이와 같이 요청하면 GET /api/recipes/search?title=김치
    // @RequestParam("title")가 김치 값을 title 변수에 넣어주고
    // recipeService.searchRecipesByTitle("김치")가 실행됨
    // 즉, 파라미터 이름만 "q"에서 "title"로 바꾼 거고, 기능이나 동작은 완전히 동일함
    // 프론트에서 보낼 파라미터 이름이 "title"일 때 (예: axios.get('/search?title=김치')) q->title로 바꾸면
    // 좋음(코드 가독성이 좋아짐)

    // 특정 사용자가 작성한 모든 레시피의 제목과 이미지 정보를 조회
    @GetMapping("/user/{firebaseUid}")
    public ResponseEntity<List<RecipeTitleResponseDto>> getRecipesByUser(@PathVariable String firebaseUid) {
        return ResponseEntity.ok(recipeService.getRecipesByFirebaseUid(firebaseUid));
    }
    // 요청 예시: GET /api/recipes/user/abc123
    // → abc123은 Firebase에서 발급받은 고유 사용자 UID(UserID)
    // 서비스 계층에 UID를 전달하여 해당 사용자의 레시피들을 조회

    // 특정 레시피 ID를 대상으로 전체 수정
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<RecipeResponseDto> updateRecipe(
            @PathVariable Long id,
            @RequestPart("recipe") String recipeJson,
            @RequestPart(value = "imageFile", required = false) MultipartFile imageFile) throws IOException {
        try {
            ObjectMapper mapper = new ObjectMapper();
            mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            mapper.configure(DeserializationFeature.ACCEPT_EMPTY_STRING_AS_NULL_OBJECT, true);

            RecipeRequestDto dto = mapper.readValue(recipeJson, RecipeRequestDto.class);
            return ResponseEntity.ok(recipeService.updateRecipe(id, dto, imageFile));
        } catch (JsonProcessingException e) {
            System.err.println("JSON parsing error in update: " + e.getMessage());
            System.err.println("Received JSON content: " + recipeJson);
            e.printStackTrace();

            return ResponseEntity.badRequest().body(null);
        } catch (Exception e) {
            System.err.println("Unexpected error in update: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
    // @RequestBody RecipeRequestDto dto → 사용자가 보낸 새로운 내용들 (제목, 카테고리, 내용, 과정 등)
    // recipeService.updateRecipe(id, dto) → 해당 ID의 레시피를 찾아서 새 값으로 갱신

    // URL에 /api/recipes/3처럼 ID를 지정해서 삭제 요청
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecipe(@PathVariable Long id) {
        recipeService.deleteRecipe(id);
        return ResponseEntity.noContent().build();
    }
    // @PathVariable Long id: 이 경로에서 넘어온 id 값(예: 3번 레시피)을 받음
    // recipeService.deleteRecipe(id): 해당 ID를 가진 레시피 한 개를 찾아 삭제
    // return ResponseEntity.noContent().build();
    // → "요청은 잘 처리됐고, 응답 데이터는 없어요"라는 의미의 204 응답을 만드는 코드
    // → DELETE 요청 처리 시에 아주 정석적으로 쓰이는 방식
    // → noContent(): 상태 코드 204 No Content를 의미함

    // ID만으로 개별 레시피 상세 조회 - 마이페이지에서 사용 (맨 마지막에 배치)
    @GetMapping("/{id}")
    public ResponseEntity<RecipeResponseDto> getRecipeById(@PathVariable Long id) {
        return ResponseEntity.ok(recipeService.getRecipeById(id));
    }
    // 요청 예시: GET /api/recipes/123
    // → ID가 123인 레시피의 상세 정보를 조회
    // 카테고리 구분 없이 ID만으로 바로 조회

    /**
     * 전역 예외 처리기 - JSON 파싱 오류 처리
     */
    @ExceptionHandler(JsonProcessingException.class)
    public ResponseEntity<Map<String, String>> handleJsonProcessingException(JsonProcessingException e) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", "JSON_PARSING_ERROR");
        errorResponse.put("message", "요청 데이터를 파싱하는 중 오류가 발생했습니다: " + e.getMessage());
        errorResponse.put("timestamp", java.time.LocalDateTime.now().toString());

        return ResponseEntity.badRequest().body(errorResponse);
    }

    /**
     * 전역 예외 처리기 - 일반적인 런타임 오류 처리
     */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException e) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", "RUNTIME_ERROR");
        errorResponse.put("message", e.getMessage());
        errorResponse.put("timestamp", java.time.LocalDateTime.now().toString());

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }
}
