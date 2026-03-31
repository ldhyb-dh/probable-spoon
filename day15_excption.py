# Day 15 - 예외 처리 (try-except)

print("=== Day 15 예외 처리 실습 ===\n")

# 1. 기본 형태
try:
    num =int(input("숫자를 입력하세요: "))
    result = 100/ num
    print(f"100 / {num} = {result:.2f}")
except ValueError:
    print("오류: 숫자만 입력해주세요!")
except ZeroDivisionError:
    print("오류: 0으로 나눌 수 없습니다!")
except Exception as e:        # 모든 예외 잡기 (마지막에 써야 함)
    print(f"알 수 없는 오류 발생: {e}")
else:
    print("정상적으로 계산 완료!") # 예외가 발생하지 않았을 때만 실행
finally:
    print("프로그램 종료 처리 완료\n") # 예외 발생 여부와 상관없이 항상 실행

# 2. 실전 예시: 안전한 계산기 함수
def safe_calculator():
    while True:
        try:
            a = float(input("\n 첫 번쨰 숫자: "))
            b = float(input("두 번쨰 숫자: "))
            op = input("연산자 (+ - * /): ").strip()

            if op == "+":
                result = a + b
            elif op =="-":
                result = a- b
            elif op == "*":
                result = a * b
            elif op == "/":
                result = a / b
            else:
                print("지원하지 않는 연산자입니다.")
                continue

            print(f"결과: {result:.2f}")
            break

        except ValueError:
            print("숫자를 제대로 입력해주세요!")
        except ZeroDivisionError:
            print("0으로 나눌 수 없습니다!")
        except Exception as e:
            print(f"알 수 없는 오류: {e}")

# 3. 파일 입출력 + 예외 처리 결합
def safe_save_date(data, filename="data.txt"):
    try:
        with open(filename, "a", encoding="utf-8") as f:
            f.write(str(data) + "\n")
        print(f"{filename}에 저장 성공!")
    except PermissionError:
        print("파일 쓰기 권한이 없습니다.")
    except Exception as e:
        print(f"파일 저장 중 오류: {e}")

# 테스트 실행
safe_calculator()

# 날씨 데이터 안전 저장 예시
temps = [24.5, 26.8, 23.1]
safe_save_date(temps, "busan_weather_safe.txt")
