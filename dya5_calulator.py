# Day 5 - input() + 조건문 + 에러 처리로 계산기 완성

print("==동훈님의 미니 계산기 v1.0==")
print("지원 연산 : + - * /(나머지 %도 ok)")

# 사용자 입력 받기
try:
    num1 = float(input("첫 번째 숫자: "))
    operator = input("연산자 (+ - * / %): ")
    num2 = float(input("두 번째 숫자: "))

    # 계산 로직
    if operator == "+":
        result = num1 + num2
    elif operator == "-":
        result = num1 - num2
    elif operator == "*":
        result = num1 * num2
    elif operator == "/":
        if num2 == 0:
            result = "오류: 0으로 나눌 수 없습니다!"
        else:
            result = num1 / num2
    elif operator == "%":
        if num2 == 0:
            result = "오류: 0으로 나눌 수 없습니다!"
        else:
            result = num1 % num2
    else:
        result = "잘못된 연산자입니다! (+ - * / % 만 지원)"
    
    # 결과 출력 (f-string으로 예쁘게)
    print("-" * 30)
    print(f"{num1}{operator}{num2} ={result}")
    print("-" * 30)

except ValueError:
    print("오류 : 숫자를 제대로 입력해주세요! (문자나 공백은 안 돼요)")
except Exception as e :
    print(f"알 수 없는 오류 발생: {e}")