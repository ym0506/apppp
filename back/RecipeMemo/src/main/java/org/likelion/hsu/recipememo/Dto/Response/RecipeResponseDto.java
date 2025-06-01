package org.likelion.hsu.recipememo.Dto.Response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.likelion.hsu.recipememo.Entity.Recipe;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RecipeResponseDto {
    private Long id;
    private String title;
    private String category;
    private String cookingTime;
    private String difficulty;
    private List<String> ingredients;
    private String content;
    private List<String> steps;
    private String imageUrl;
    private String firebaseUid;

    public static RecipeResponseDto from(Recipe recipe) {
        return new RecipeResponseDto(
                recipe.getId(),
                recipe.getTitle(),
                recipe.getCategory().getDisplayName(),
                recipe.getCookingTime(),
                recipe.getDifficulty(),
                recipe.getIngredients(),
                recipe.getContent(),
                recipe.getSteps(),
                recipe.getImageUrl(),
                recipe.getFirebaseUid());
    }
}
// public static RecipeResponseDto from(Recipe recipe)
// ->이 메서드는 엔티티 Recipe → DTO RecipeResponseDto로 변환할 때 사용됨.
