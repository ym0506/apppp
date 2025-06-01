package org.likelion.hsu.recipememo.Entity;

import javax.persistence.*;
import lombok.*;
import org.likelion.hsu.recipememo.Enum.Category;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Recipe {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title; // 요리 제목

    @Enumerated(EnumType.STRING)
    private Category category; // 한식, 중식, 일식, 양식

    private String cookingTime; // 소요 시간
    private String difficulty; // 난이도

    @ElementCollection
    private List<String> ingredients; // 재료 목록 (String에서 List<String>으로 변경)

    private String content; // 요리 소개

    @ElementCollection
    private List<String> steps; // 요리과정 단계별 설명

    private String imageUrl; // 요리 완성 사진 URL(서버에 저장된 경로)

    @Column(nullable = false)
    private String firebaseUid; // Firebase 사용자 UID
}
