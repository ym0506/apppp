package org.likelion.hsu.recipememo.Dto.Response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.likelion.hsu.recipememo.Entity.Recipe;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RecipeTitleResponseDto {
    private Long id;
    private String title;
    private String imageUrl;

    public static RecipeTitleResponseDto from(Recipe recipe) {
        return new RecipeTitleResponseDto(
                recipe.getId(),
                recipe.getTitle(),
                recipe.getImageUrl()
        );
    }
}
