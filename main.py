# main.py
from birkman_profile import BirkmanProfile
import os

# 폴더 자동 생성
os.makedirs("data", exist_ok=True)

print("=== MyBirkman Manager v1.0===\n")

# 파일에서 불러오기 시도
profile =BirkmanProfile.load_from_file()

while True:
    print("\n1. 점수 입력")
    print("2. 현재 분석 보기")
    print("3. 기록 저장")
    print("4. 과거 기록 보기")
    print("5. 종료")

    choice = input("\n메뉴 선택 (1~5): ").strip()

    try:
        if choice == "1":
            print("\n영역별 점수 입력 (0~100)")
            areas = ["기술", "야외", "과학", "예술", "관리", "숫자"]
            for area in areas:
                while True:
                    try:
                        score = int(input(f"{area} 점수: "))
                        profile.add_score(area, score)
                        break
                    except ValueError:
                        print("숫자만 입력해주세요!")

            note = input("오늘 메모 (선택): ")
            profile.add_record(note)

        elif choice == "2":
            print(f"\n=== {profile.name}님 현태 버크만 분석 ===")
            for area, score in sorted(profile.scores.items(), key=lambda x: x[1], reverse=True):
                print(f"{area:>6}: {score:3}% {'★' * (score//10)}")
            print(f"\n평균: {profile.get_average():.1f}%")
            print(f"최고 강점: {profile.get_best_area()}")

        elif choice == "3":
            profile.save_to_file()

        elif choice == "4":
            if profile.records:
                print(f"\n=== 과거 기록 ({len(profile.records)}회) ===")
                for i, rec in enumerate(profile.records, 1):
                    print(f"{i}. {rec['data']} - 평균 {sum(rec['scores'].values())/len(rec['scores']):.1f}%")
            else:
                print("아직 저장된 기록이 없습니다.")
        elif choice == "5":
            profile.save_to_file()
            print("프로그램을 종료합니다. 수고하셨습니다!")
            break

        else:
            print("1~5번 중에서 선택해주세요.")

    except Exception as e:
        print(f"오류 발생: {e}")