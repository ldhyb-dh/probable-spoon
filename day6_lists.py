# Day 6 - 리스트(list) 마스터하기

# 1. 리스트 만들기 (대괄호 [] 사용)
subway = ["김철수", "박민수", "이영희"]
print(subway) #['김철수', '박민수', '이영희']

# 다양한 타입 섞어서 OK
mix_lsit =["버크만", 97, True, "부산"]
print(mix_lsit)

# 2. 인덱싱 & 슬라이싱 (문자열과 똑같이!)
print(subway[0]) # '김철수' (첫 번째)
print(subway[-1]) # '이영희' (마지막)
print(subway[0:2]) # ['김철수', '박민수'] (0~1까지)

# 3. 리스트 수정·추가·삭제
subway[1] = "이동훈"
print(subway) # 수정

subway.append("홍길동")
print(subway) # 끝에 추가

subway.insert(1, "신입사원")
print(subway) # 원하는 위치에 삽입

popped = subway.pop()
print(popped) # 마지막 삭제 + 반환
print(subway) # 삭제된 값: '홍길동'

subway.remove("김철수")
print(subway) # 삭제된 값: '홍길동'

# 4. 자주 쓰는 메서드
number = [5, 2, 8, 1, 9]
number.sort() # 오름차순 정렬
print(number) # [1, 2, 5, 8, 9]

number.reverse() # 역순
print(number) #[9, 8, 5, 2, 1]

number.clear() # 전부 삭제
print(number) # []

# 5. 실생활 예시: 부산 날씨 데이터 리스트
temps =[24.5, 25.1, 23.8, 26.0, 22.9]
print(f"오늘 부산 평균 기온 : {sum(temps)/len(temps):1f}°C")
print(f"최고 기온 : {max(temps)}°C")
print(f"최저 기온 : {min(temps)}°C")                 

# 치킨 당첨자 뽑기 (리스트 + random 맛보기)
import random  # random 모듈 불러오기

users = ["동훈", "민수", "철수", "지누", "영희", "민지", "길동"]
print("치킨 이벤트 참가자:", users)

winner =random.choice(users)
print(f"축하합니당! 치킨 당첨자 : {winner}님!")

# 보너스: 3명 뽑기 (shuffle + 슬라이싱)
random.shuffle(users)
print("당첨자 3명 :", users[:3])