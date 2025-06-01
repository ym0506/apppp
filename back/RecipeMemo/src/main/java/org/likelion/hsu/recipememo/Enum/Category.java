package org.likelion.hsu.recipememo.Enum;

public enum Category {
    KOREAN("한식"), JAPANESE("일식"), CHINESE("중식"), WESTERN("양식");
//enum 타입으로 고정된 4개의 카테고리를 정의.

    private final String displayName;
    //각 enum 상수에 연결된 출력용 문자열(한글) 을 저장하기 위한 필드.

    Category(String displayName) {
        this.displayName = displayName;
    }
    //enum은 생성자를 가질 수 있으며, 여기서는 각 enum 값에 해당하는 한글 이름을 넣기 위한 생성자.

    public String getDisplayName() {
        return displayName;
    }
    //각 enum 값에서 한글 이름을 꺼낼 수 있는 getter.

    public static Category fromDisplayName(String displayName) {
        for (Category category : Category.values()) {
            if (category.displayName.equals(displayName)) {
                return category;
            }
        }
        throw new IllegalArgumentException("Invalid category name: " + displayName);
    }
    //입력된 문자열(예: "한식")이 어떤 enum 값과 매칭되는지 확인해서 Category 타입으로 변환.
    //예: "한식" → Category.KOREAN
    //만약 "떡볶이" 같이 정의되지 않은 값이 들어오면 예외 발생.
}
