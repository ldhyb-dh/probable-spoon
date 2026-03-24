# Day 11 - 함수(function) 마스터하기

# 1. 가장 기본 함수
def hello():
    print("안녕하세요! 동훈님")
    print("파이썬 Day 11입니다!")

hello()  # 함수 호출
hello()  # 여러 번 호출 가능

# 2. 매개변수 받는 함수
def introduce(name, age):
    print(f"안녕하세요! 저는 {name}이고, {age}살입니다.")

introduce("동훈", 25)
introduce("부산", 0) # 재미로

# 3. 반환값(return)이 있는 함수
def add(a, b):
    return a + b

result = add(10, 25)
print(f"10 + 25 = {result}")

# 4. 실용적인 함수들 (버크만 + 날씨 관련)
def print_birkman_score(area, score):
    star = "★" * (score // 10)
    print(f"{area:>6} : {score:3}%{star}")

def calculate_average(numbers):
    if not numbers:   # 리스트가 비어있으면
        return 0
    return sum(numbers) / len(numbers)

def get_weather_evaluation(temp):
    if temp >=28:
        return "☀️ 매우 더워요!"
    elif temp >=23:
        return "🌤️ 적당해요"
    else:
        return "❄️ 조금 서늘해요"

# 실제 사용 예시
brikman = {"기술": 97, "야외":84, "과학": 84}

print("\n=== 버크만 점수 출력 ===")
for area, score in brikman.items():
    print_birkman_score(area, score)

temps = [24.5, 26.8, 22.1, 25.3]
avg = calculate_average(temps)
print(f"\n 부산 평균 기온: {avg:.1f}°C")

for t in temps:
    print(f"{t}°C→ {get_weather_evaluation(t)} ")

# 함수로 만든 계산기 (코드가 훨씬 깔끔해집니다!)
def calculate(num1, operator, num2):
    if operator == "+":
        return num1 + num2
    elif operator == "-":
        return num1 - num2
    elif operator == "*":
        return num1 * num2
    elif operator == "/":
        if num2 == 0:
            return "0으로 나눌 수 없습니다!"
        return num1 /num2
    elif operator == "%":
        if num2 == 0:
            return "0으로 나눌 수 없습니다!"
        return num1 % num2
    else:
        return "지원하지 않는 연산자입니다!"
    
# 메인 프로그램
print("=== 함수로 만든 계산기 v3.0===")
while True:
    op = input("\n연산자 (+ - * / % / q종료): ").strip()
    if op.lower() == 'q':
        print("계산기 종료!")
        break

    try:
        n1 = float(input("첫 번쨰 숫자: "))
        n2 = float(input("두 번쨰 숫자: "))
        result = calculate(n1, op, n2)
        print(f"결과: {result}")
    except ValueError:
        print("숫자를 제대로 입력해주세요!")