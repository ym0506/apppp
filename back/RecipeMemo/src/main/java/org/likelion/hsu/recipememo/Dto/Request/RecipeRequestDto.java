package org.likelion.hsu.recipememo.Dto.Request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RecipeRequestDto {
    private String title;
    private String category;
    private String cookingTime;
    private String difficulty;
    private List<String> ingredients;
    private String content;
    private List<String> steps;
    private String firebaseUid;
}
