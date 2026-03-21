# Day 10 - 리스트 + 반복문으로 데이터 기록 & 분석

print("=== 부산 날씨 기록기 v1.0 ===")
print("날씨 기록 종료하려면 온도에 'q' 입력\n")

temperatures = []  # 온도 저장할 리스트

while True:
    temp_input = input("오늘 부산 기온 입력 (°C): ").strip()

    if temp_input.lower() == 'q':
        print("기록 종료!")
        break

    try:
        temp = float(temp_input)
        temperatures.append(temp)
        print(f"기록됨: {temp}°C")
    except ValueError:
        print("숫자 또는 'q'만 입력해주세요!")

# 기록 끝난 후 분석
if temperatures:  # 리스트가 비어있지 않으면
    print("\n" + "=" * 40)
    print("=== 기록된 부산 날씨 데이터 ===")

    # 1. 전체 출력 (for + enumerate)
    for day, temp in enumerate(temperatures, start=1):
        print(f"Day {day:2d}: {temp:5.1f}°C")

    # 2. 기본 통계
    total = sum(temperatures)
    count = len(temperatures)
    average = total / count
    max_temp = max(temperatures)
    min_temp = min(temperatures)

    print("-" * 40)
    print(f"총 기록 일수: {count}일")
    print(f"평균 기온  : {average:.1f}°C")
    print(f"최고 기온  : {max_temp:.1f}°C")
    print(f"최저 기온  : {min_temp:.1f}°C")
    print("=" * 40)
else:
    print("아무 데이터도 기록되지 않았습니다.")

# 추가 1: 최고/최저 온도 날짜도 표시 (인덱스 +1)
max_day = temperatures.index(max_temp) +1
min_day = temperatures.index(min_temp) +1
print(f"최고 기온 날짜: Day {max_day}")
print(f"최저 기온 날짜: Day {min_day}")

# 추가 2: 25도 이상이면 "더웠어요!" 표시
print("\n날씨 평가:")
for day, temp in enumerate(temperatures, 1):
    eval_text = "☀️ 더웠어요!" if temp >= 25 else "😊 적당해요"
    print(f"Day {day}: {temp:.1f}°C →{eval_text}")

# 추가 3: 기록 저장하기 (간단 텍스트 파일)
with open("busan_weather.txt", "w", encoding="utf-8") as f:
    f.write("부산 날씨 기록\n")
    for remp in temperatures:
        f.write(f"{temp}\n")
print("데이터를  busan_weather.txt 파일로 저장했습니다!")