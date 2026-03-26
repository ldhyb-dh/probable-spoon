# my_calculator.py

def add(a, b):
    return a + b

def subtract(a, b):
    return a - b

def multiply(a, b):
    return a * b

def divide(a, b):
    if b ==0:
        return "0으로 나눌 수 없습니다!"
    return a / b

# 간단한 과학 계산 함수
def circle_area(radius):
    import math
    return math.pi * radius ** 2