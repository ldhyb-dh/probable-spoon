# Day 9 - while 반복문 마스터하기

#1. 기본 while (조건이 True인 동안 반복)
i = 1
while i<= 5 :
    print(f"반복 {i}회차")
    i += 1 # 중요! i 증가 안 하면 무한 루프

# 2. 무한 루프 + break로 탈출
while True:
    user_input = input("종료하려면 'q' 입력(아무거나 입력해도 OK)")
    print(f"입련한 값: {user_input}")

    if user_input.lower() == 'q':
        print("프로그램 종료!")
        break # 즉시 while 탈출

# 3. continue 예시 (특정 조건일 때 스킵)
i = 0
while i < 10:
    i += 1
    if i % 2 == 0:        # 짝수면 스킵
        continue
    print(f"홀수만 출력: {i}")  # 1 3 5 7 9 가 나와야 함

# 동호온님의 미니 계산기 v2.0 - 계속 계산 가능!
print("=== 동훈님 미니 계산기 v 2.0 ===")
print("지원: + - * / %  종료: 'q' 입력 \n")

while True:
    try:
        # 연산자 먼저 받아서 q 체크 (편의성 업!)
        operator = input ("연산자 (+ - * / % /q종료):").strip()

        if operator.lower() =='q':
            print("계산기 종료! 오늘도 수고하셨습니다~")
            break

        num1 = float(input("첫 번째 숫자: "))
        num2 = float(input("두 번째 숫자: "))

        if operator == "+":
            result = num1 + num2
        elif operator == "-":
            result = num1 - num2
        elif operator == "*":
            result = num1 * num2
        elif operator == "/":
            if num2 == 0:
                print("오류: 0 으로 나눌 수 없습니다!")
                continue
            result = num1 / num2
        elif operator == "%":
            if num2 == 0:
                print("오류: 0 으로 나눌수 없습니다!")
                continue
            result = num1 % num2
        else:
            print("지원하지 않는 연산자입니다!")
            continue

        print("-" * 40)
        print(f"{num1} {operator} {num2} = {result: 2f}")
        print("-" * 40)

    except ValueError:
        print("오류: 숫자를 제대로 입력해주세요!")
        continue
    except Exception as e:
        print(f"알 수 없는 오류: {e}")
        continue