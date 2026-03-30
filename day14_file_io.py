# Day 14 - 파일 입출력 (File I/O)

print("=== Day 14 파일 입출력 실습 ===\n")

# 1. 파일 쓰기 (새로 만들기)
with open("birkman_score.txt","w", encoding="utf-8") as f:
    f.write("===동훈님 버크만 점수 기록 ===\n")
    f.write(f"기술: 97%\n")
    f.write(f"야외: 84%\n")
    f.write(f"과학: 84%\n")
    f.write(f"예술: 82%\n")
    f.write(f"관리: 82%\n")
    f.write(f"숫자: 79%\n")

print(" birkman_score.txt 파일에 저장 완료!")

# 2. 파일 추가 쓰기 (a = append)
with open("birkman_score.txt", "a", encoding="utf-8") as f:
    f.write("\n--- 2026년 3월 3일 기록 완료---\n")

# 3. 파일 읽기
print("\n 파일 내용 읽기:")
with open("birkman_score.txt", "r", encoding="utf-8") as f:
    content = f.read()
    print(content)

# 4. 줄 단위로 읽기 (리스트로 반환)
print("\n 줄 단위로 읽기:")
with open ("birkman_score.txt", "r", encoding="utf-8") as f:
    lines = f.readlines()
    for line in lines:
        print(line.strip())

# 5. 실용 예시: 부산 날씨 기록 저장하기
def save_weather_data(temperatures, filename="busan_weather.txt"):
    with open(filename, "a", encoding="utf-8") as f:
        f.write(f"\n=== 기록 날짜: 2026-03-30 ===\n")
        for i, temp in enumerate(temperatures, 1):
            f.write(f"Day {i}: {temp}°C\n")
        f.write(f"평균: {sum(temperatures)/len(temperatures):.1f}°C\n")
    print(f" {filename}에 날씨 데이터 저장 완료!")

# 테스트 실행
temps = [24.5, 26.8, 23.1, 25.4]
save_weather_data(temps)

# 파일 읽어서 확인
print("\n저장된 날씨 데이터 확인!:")
with open("busan_weather.txt", "r", encoding="utf-8") as f:
    print(f.read())