# day13_modules.py
# 모듈 불러오기

# 1. 내가 만든 모듈 불러오기
import birkman_tools
import my_calculator

# 2. 자주 쓰는 내장 모듈
import random
import math
from datetime import datetime

print("=== Day 13 모듈 실습===\n")

# birkman_tools 사용
birkman_tools.print_birkman(
    기술=97, 야외=84, 과학=84, 
    예술=82, 관리=82, 숫자=79
)


best = birkman_tools.get_best_area(기술=97, 야외=84, 과학=84)
print(f"\n최고 강점 영역: {best}\n")

# my_calculator 사용
print("계산기 테스트:")
print(f"10 + 25 = {my_calculator.add(10, 25)}")
print(f"원 넓이 (반지름 5): {my_calculator.circle_area(5):.2f}")

# random 모듈 사용
print("\n랜덤 테스트:")
print("오늘의 행운 번호:", random.randint(1, 45))

# math 모듈 사용
print(f"π 값: {math.pi:.4f}")

# datetime 사용
now = datetime.now()
print(f"현재 시간: {now.strftime('%Y년 %m월 %d일 %H:%M')}")

# as 사용해서 별칭 주기 (자주 쓰는 방식)
import birkman_tools as bt
bt.print_birkman(기술=97, 숫자=79)