# Day 3 - 연산자 마스터하기

# 1. 산술 연산자 (사칙연산 + 나머지 + 제곱)
a = 10
b = 3
print(a + b)   # 13
print(a - b)   # 7
print(a * b)   # 30
print(a / b)   # 3.333... (실수)
print(a // b)  # 3 (정수 나눗셈, 몫)
print(a % b)   # 1 (나머지)
print(a ** 2)  # 100 (제곱)

# 2. 비교 연산자 (True/False 반환)
print(a > b)    # True
print(a < b)    # False
print(a == 10)  # True (같다)
print(a != 5)   # True (다르다)
print(a >= 10)  # True

# 3. 논리 연산자 (and, or, not)
print(True and False)  # False
print(True or False)   # True
print(not True)        # False

# 실생활 예시: 부산 날씨 체크
temperature = 25
is_sunny = True

if temperature >= 20 and is_sunny:
    print("오늘 부산 날씨 최고! 나가자~")

# 4. 복합 대입 연산자 (편리!)
score = 80
score += 10    # score = score + 10 → 90
score -= 5     # 85
score *= 2     # 170
print(score)

