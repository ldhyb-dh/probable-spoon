# Day 12 - 함수 고급: 기본값, *args, **kwargs, lambda

# 1. 매개변수 기본값
def introduce(name, age=25, city ="부산"):
    print(f"안녕하세요! 저는{name}이고, {age}살이며 {city}에 살아요.")

introduce("동훈")                    # age와 city는 기본값 사용
introduce("민수", 30)                # city만 기본값
introduce("영희", 27, "서울")         # 모두 직접 입력

# 2. *args (여러 개의 positional 인자)
def add_all(*numbers):
    return sum(numbers)

print(add_all(1, 2, 3, 4, 5))
print(add_all(10, 20))

# 3. **kwargs (키=값 형태로 여러 개)
def print_profile(**info):
    for key, value in info.items():
        print(f"{key}: {value}")

print_profile(name="동훈", age=25, job="파이썬 공부중", score=97)
print_profile(city="부산", hobby="드론")

# 4. lambda 함수 (한 줄 함수)
square = lambda x: x **2
print(square(5))

add = lambda a, b : a + b
print(add(10, 7))

# 실용 예시: 리스트 정렬할 때 lambda 사용
scores=[("동훈", 97), ("민수", 84), ("영희", 92)]
scores.sort(key=lambda x: x[1], reverse=True)
print(scores)

# 버크만 점수 처리 예시
birkman = {"기술": 97, "야외": 84, "과학":84, "예술": 82}

# lambda + sorted
scorted_birkman = sorted(birkman.items(), key=lambda x: x[1], reverse=True)
print("강점 순위:")
for area, score in scorted_birkman:
    print(f"{area}: {score}%")

def analyze_birkman(**scores):
    """버크만 점수를 받아서 분석해주는 함수"""
    if not scores:
        print("점수가 없습니다.")
        return
    
    total = sum(scores.values())
    avg = total / len(scores)

    print("=== 동호온님 버크만 분석 결과 ===")
    print(f"총 점수: {total}점")
    print(f"평균 점수: {avg:.1f}점\n")

    # 최고/최저 강점 찾기 (lambda 사용)
    best = max(scores.items(), key=lambda x: [1])
    worst = min(scores.items(), key=lambda x: x[1])

    print(f"최고 강점: {best[0]} ({best[1]}%)")
    print(f"가장 낮은 영역: {worst[0]} ({worst[1]}%)")

    for area, score in sorted(scores.items(), key=lambda x: x[1], reverse=True):
        stars = "★" * (score // 10)
        print(f"{area:>6}: {score:3}% {stars}")

# 실제 사용
analyze_birkman(
    기술=97,
    야외=84,
    과학=84,
    예술=82,
    관리=82,
    숫자=79,
    문학=34,
    음악=21
)