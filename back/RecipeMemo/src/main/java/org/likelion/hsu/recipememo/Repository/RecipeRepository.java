package org.likelion.hsu.recipememo.Repository;

import org.likelion.hsu.recipememo.Entity.Recipe;
import org.likelion.hsu.recipememo.Enum.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RecipeRepository extends JpaRepository<Recipe, Long> {
    List<Recipe> findByCategory(Category category); //해당 카테고리에 속한 모든 레시피들을 조회합니다.
    Optional<Recipe> findByIdAndCategory(Long id, Category category); //특정 ID와 특정 카테고리가 모두 일치하는 레시피 한 개를 찾습니다.
    List<Recipe> findByTitleContainingIgnoreCase(String title); //제목에 입력한 문자열이 포함되어 있는 레시피들을 (대소문자 무시하고) 검색합니다.
    List<Recipe> findByFirebaseUid(String firebaseUid); //특정 사용자(Firebase UID)가 등록한 모든 레시피를 조회합니다.
}
//findBy: JPA에서 쿼리를 자동 생성하겠다는 선언
//Title: Recipe 엔티티 안의 title필드를 기준으로
//Containing: LIKE %값% 처럼 포함 여부로 필터링
//IgnoreCase: 대소문자 구분 없이 검색
//(String title): 메서드 호출 시 외부에서 전달받는 검색어
//title은 단순히 전달받는 변수 이름일 뿐이고, 실제 쿼리 생성에 영향을 주는 건 메서드 이름(ContainingIgnoreCase)쪽임