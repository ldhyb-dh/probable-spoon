# Day 4 -문자열 고급 +포매팅

#1. 문자열 인덱싱 & 슬라이싱
text = "부산 해운대 최고!"
print(text[0])       #"부"
print(text[1])       #"산"
print(text[-1])      #"!"
print(text[0:3])     #"부산"
print(text[3:])      #"해운대 최고!"
print(text[:3])      #"부산"
print(text[::2])     #"부 운 고"

#2. 문자열 메서드
print(text.upper())  #대문자
print(text.lower())  #소문자
print(text.replace("최고", "사항해")) #부산 해운대 사랑해!
print(text.find("해운대"))  #3(위치 반환, 없으면-1)
print("해운대" in text)     #True (포함 여부)
print(text.split)          #[부산, 해운대, 최고!](공백 기준 리스트)

#3. f-string 포매팅
name = "동훈"
age =25
tech_score = 98
city = "부산" 

# 기본
print(f"안녕하세요, {name}님! {age}살 {city}거주 중입니다.")

#계산식도 바로 넣기
print(f"내년 나이는 {age+1}살이에요.")

#정렬 +소수점 + 쉼표
print(f"기술 점수 : {tech_score:>10}%")
print(f"기술 점수 : {tech_score:<10}%")
print(f"기술 점수 : {tech_score:^10}%")
print(f"점수 : {tech_score:05d}")

#실생활 예시 
temp = 24.5
humidity = 65
print(f"부산 현재 날씨 : 온돈{temp: .1f}°C, 습도 {humidity}%")