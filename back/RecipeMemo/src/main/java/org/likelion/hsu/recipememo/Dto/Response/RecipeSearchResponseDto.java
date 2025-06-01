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
public class RecipeSearchResponseDto {
    private List<RecipeTitleResponseDto> results;
}
//검색 API의 응답 결과를 담는 리스트
//RecipeTitleDto → 레시피의 id와 title만 담고 있는 간단한 DTO
//List<RecipeTitleDto> → 그걸 여러 개 묶은 것 (검색 결과가 여러 개니까)

//작동 흐름 정리 (Controller → Service → Repository)
//1. 사용자가 /api/recipes/search?q=김치 요청
//2. Controller에서 Service 호출
//3. Service는 Repository에서 title LIKE '%김치%'인 레시피 리스트 받아옴
//4. 각 Recipe 객체를 RecipeTitleDto로 바꿈
//5. 이 DTO들을 리스트로 묶어서 RecipeSearchResponse에 넣음
//6. JSON으로 응답