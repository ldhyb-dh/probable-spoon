# Day 8 - 세트(set) + 자료구조 변환 + for 반복문 맛보기

#1. 세트(set) -중복 제거, 순서없음(중괄호{})
my_set = {1, 2, 3, 3, 3, 4}
print(my_set) #{1, 2, 3, 4}

java ={"유재석", "김태호", "양세형", "박명수"}
python = {"유재석", "김태호", "아이유"}

# 교집합 (둘 다 할 줄 아는 사람)
print(java & python)
print(java.intersection(python))

# 합집합 (둘 중 하나라도)
print(java | python)
print(java.union(python))

# 차집합 (java는 할 줄 알지만 python은 못하는 사람)
print(java - python)
print(java.difference(python))

# 추가·삭제
python.add("김종국")
python.remove("아이유")
print(python)

# 2. 자료구조 변환 (list ↔ tuple ↔ set)
menu = ["피자", "햄버거", "치킨", "피자"] # list
menu_set = set(menu) # set으로 → 중복 제거
print(menu_set) # {'피자', '햄버거', '치킨'}

menu_list = list(menu_set) # 다시 list로
menu_tuple = tuple(menu_set) # tuple로
print(menu_list)
print(menu_tuple)

# 3. for 반복문 기본 + range()
# 리스트 순회
for name in java:
    print(f"{name}님, 안녕하세요!")

# range()로 숫자 반복
for i in range(5):  # 0 ~ 4
    print(i)

for i in range(3, 10, 2): # 3부터 9까지 2씩 증가
    print(i) # 3 5 7 9

# 실생활 예시: 버크만 점수 평균 계산
birkman_scores = [97, 84, 84, 82, 82, 79, 34, 21]
total = 0
for score in birkman_scores:
    total += score
    print(f"현재 합계: {total}")

average = total/ len(birkman_scores)
print(f"버크만 평균 점수 : {average:1f}%")

# 참가자 명단 중복 제거 + 등수 매기기
participants = ["동훈", "민수", "영희", "철수", "민수", "길동"]
unique_part = list(set(participants)) # 중복 제거 후 리스트로

print("=== 참가자 명단 (중복 제거) ===")
for rank, name in enumerate(unique_part, start=1):
    print(f"{rank}둥: {name}")

print(f"총 참가자 수: {len(unique_part)}명")