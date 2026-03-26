# birkman_tools.py

def print_birkman(**scores):
    print("=== 버크만 분석 결과===")
    for area, score in sorted(scores.items(), key=lambda x: x[1], reverse=True):
        stars = "★" * (score // 10)
        print(f"{area:>6}: {score:3}% {stars}")

def get_best_area(**scores):
    if not scores:
        return None
    best = max(scores.items(), key=lambda x: x[1])
    return best[0]

def calculate_average_score(**scores):
    if not scores:
        return 0
    return sum(scores.values()) / len(scores)