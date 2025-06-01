package org.likelion.hsu.recipememo.Dto.Response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RecipeListResponseDto {
    private String category;
    private List<RecipeTitleResponseDto> recipes;
}
