# day14_weather_with_file.py
# 리스트 + while + 함수 + 파일 입출력 결합

def save_weather(temperatures):
    with open("busan_weather_history.txt", "a", encoding="utf-8") as f:
        f.write(f"\n=== 기록일: 2026년 3월 30일 ===\n")
        for i, temp in enumerate(temperatures, 1):
            f.write(f"Day {i}: {temp:.1f}°C\n")
        avg = sum(temperatures) / len(temperatures)
        f.write(f"편균 기온: {avg:.1f}°C\n")
        f.write("-" * 40 +"\n")

print("=== 부산 날씨 기록기 with 파일 저장 === \n")

temps = []
while True:
    inp = input("기온 입력(°C) 또는 'p'로 종료: ").strip()
    if inp.lower()== 'q':
        break
    try:
        temp = float(inp)
        temps.append(temp)
        print(f"기록됨: {temp}°C")
    except ValueError:
        print("숫자 또는 'q'를 입력해주세요!")

if temps:
    save_weather(temps)
    print(f"\n총 {len(temps)}일 기록이 파일에 저장되었습니다!")
    print("파일명: busan_weather_history.txt")
else:
    print("기록된 데이터가 없습니다.")