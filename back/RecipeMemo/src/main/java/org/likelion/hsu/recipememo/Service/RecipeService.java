package org.likelion.hsu.recipememo.Service;

import lombok.RequiredArgsConstructor;
import org.likelion.hsu.recipememo.Dto.Request.RecipeRequestDto;
import org.likelion.hsu.recipememo.Dto.Response.RecipeListResponseDto;
import org.likelion.hsu.recipememo.Dto.Response.RecipeResponseDto;
import org.likelion.hsu.recipememo.Dto.Response.RecipeSearchResponseDto;
import org.likelion.hsu.recipememo.Dto.Response.RecipeTitleResponseDto;
import org.likelion.hsu.recipememo.Entity.Recipe;
import org.likelion.hsu.recipememo.Enum.Category;
import org.likelion.hsu.recipememo.Repository.RecipeRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecipeService {

    // 레시피 데이터베이스와 통신하는 JPA 리포지토리를 이 클래스 내부에서 사용하겠다는 선언.
    private final RecipeRepository recipeRepository;

    // 사용자가 입력한 레시피 정보와 이미지 파일을 받아 DB와 서버에 저장하는 기능
    public RecipeResponseDto createRecipeWithImage(RecipeRequestDto dto, MultipartFile imageFile) throws IOException {
        String imagePath = null;

        if (imageFile != null && !imageFile.isEmpty()) {
            String fileName = UUID.randomUUID() + "_" + imageFile.getOriginalFilename();
            Path imageDir = Paths.get("uploads");
            Files.createDirectories(imageDir);
            Path filePath = imageDir.resolve(fileName);
            Files.copy(imageFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            imagePath = "/uploads/" + fileName;
        }

        // DTO → Entity 변환 및 저장
        Recipe recipe = Recipe.builder()
                .title(dto.getTitle())
                .category(Category.fromDisplayName(dto.getCategory()))
                .cookingTime(dto.getCookingTime())
                .difficulty(dto.getDifficulty())
                .ingredients(dto.getIngredients())
                .content(dto.getContent())
                .steps(dto.getSteps())
                .imageUrl(imagePath)
                .firebaseUid(dto.getFirebaseUid())
                .build();

        return RecipeResponseDto.from(recipeRepository.save(recipe));
        // DB에 레시피 저장 (save())
        // 저장된 Recipe 엔티티를 RecipeResponseDto로 변환해 응답
    }
    // createRecipeWithImage() 메서드는 사용자가 보낸 레시피 정보(JSON) 와 이미지 파일을 함께 받아서,
    // 이미지는 서버에 저장하고, 레시피는 DB에 저장한 뒤, 저장된 정보를 DTO로 반환하는 역할을 한다.

    // 특정 카테고리에 속한 레시피들의 제목과 이미지 목록을 반환하는 기능
    public RecipeListResponseDto getAllTitlesByCategory(Category category) {
        List<RecipeTitleResponseDto> titles = recipeRepository.findByCategory(category).stream()
                .map(RecipeTitleResponseDto::from)
                .collect(Collectors.toList());
        return new RecipeListResponseDto(category.getDisplayName(), titles); // DTO에는 displayName을 넘겨주면 됨
    }

    // 특정 카테고리와 ID에 해당하는 레시피 한 개를 상세 조회하는 기능
    public RecipeResponseDto getRecipeByCategoryAndId(Category category, Long id) {
        Recipe recipe = recipeRepository.findByIdAndCategory(id, category)
                .orElseThrow(() -> new RuntimeException("카테고리 및 ID에 해당하는 레시피를 찾을 수 없습니다."));
        return RecipeResponseDto.from(recipe);
    }

    // 기존에 등록된 레시피를 새로운 내용으로 수정하고, 필요 시 이미지도 새로 교체하는 기능
    public RecipeResponseDto updateRecipe(Long id, RecipeRequestDto dto, MultipartFile imageFile) throws IOException {
        Recipe recipe = recipeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("레시피를 찾을 수 없습니다."));

        recipe.setTitle(dto.getTitle());
        recipe.setCategory(Category.fromDisplayName(dto.getCategory()));
        recipe.setCookingTime(dto.getCookingTime());
        recipe.setDifficulty(dto.getDifficulty());
        recipe.setIngredients(dto.getIngredients());
        recipe.setContent(dto.getContent());
        recipe.setSteps(dto.getSteps());

        if (imageFile != null && !imageFile.isEmpty()) {
            String fileName = UUID.randomUUID() + "_" + imageFile.getOriginalFilename();
            Path imageDir = Paths.get("uploads");
            Files.createDirectories(imageDir);
            Path filePath = imageDir.resolve(fileName);
            Files.copy(imageFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            recipe.setImageUrl("/uploads/" + fileName);
        }

        return RecipeResponseDto.from(recipeRepository.save(recipe));
    }

    // 특정 ID에 해당하는 레시피를 데이터베이스에서 삭제하는 기능
    public void deleteRecipe(Long id) {
        Recipe recipe = recipeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("레시피를 찾을 수 없습니다."));
        recipeRepository.delete(recipe);
    }

    // 레시피 제목에 특정 키워드가 포함된 경우 그 레시피들의 목록을 검색해서 응답하는 기능
    public RecipeSearchResponseDto searchRecipesByTitle(String title) {
        List<RecipeTitleResponseDto> results = recipeRepository.findByTitleContainingIgnoreCase(title).stream()
                .map(RecipeTitleResponseDto::from)
                .collect(Collectors.toList());
        return new RecipeSearchResponseDto(results);
    }

    // 특정 사용자가 작성한 모든 레시피를 조회하는 기능
    public List<RecipeTitleResponseDto> getRecipesByFirebaseUid(String firebaseUid) {
        return recipeRepository.findByFirebaseUid(firebaseUid).stream()
                .map(RecipeTitleResponseDto::from)
                .collect(Collectors.toList());
    }

    // ID만으로 개별 레시피 상세 조회하는 기능 - 마이페이지에서 사용
    public RecipeResponseDto getRecipeById(Long id) {
        Recipe recipe = recipeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("레시피를 찾을 수 없습니다."));
        return RecipeResponseDto.from(recipe);
    }
}
