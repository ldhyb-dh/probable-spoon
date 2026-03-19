# Day 7 - 사전(dict) + 튜플(tuple)

#1. 튜플(tuple) - 변경 불가능한리스트 (소괄호())

coordinates = (37.5665, 126.9780)
print(coordinates)
print(coordinates[0]) #37.5665
print(coordinates[1]) #126.9780

#리스트와 비교
list_example = [1, 2, 3]
list_example[0] = 10 #OK(변경 가능)
#coordinates[0] = 100 #에러! 튜플은 수정 불가

# 여러 값 한 번에 받기
lat, lon= coordinates
print(f"부산 위도/경도 예시: {lat}, {lon}")

#2. 사전(dict) - 키:값 쌍 (중괄호{})
cabinet = {
    "A-3": "김철수",
    "B-7": "박민수",
    "C-1": "동훈이"
}
print(cabinet)
print(cabinet["A-3"])

#값 추가 수정
cabinet["D-5"] = "신입사원"
cabinet["A-3"] = "이동훈이"
print(cabinet)

#값 가져오기 (get () 안전하게!)
print(cabinet.get("Z-9"))
print(cabinet.get("Z-9", "없음"))

#키 확인
print("A-3" in cabinet) #True
print("Z-9" in cabinet) #False

#삭제
del cabinet["B-7"]
print(cabinet)

#모든 키 값 보기
print(cabinet.keys()) # dict_keys(['A-3', 'C-1', 'D-5'])
print(cabinet.values()) # dict_values(['최동호온', '동호온', '신입사원'])
print(cabinet.items()) # dict_items([('A-3', '최동호온'), ...])

#실생활 예시 :버크만 점수 저장
birkman = {
    "기술" : 97,
    "야외" : 84,
    "과학" : 84,
    "예술" : 82,
    "관리" : 82
}
print(f"동훈님 기술 점수 : {birkman['기술']}% ")

for area, score in birkman.items() :
    print (f"{area} : {score}%")

# 버크만 점수 관리기
birkman = {
    "기술": 97,
    "야외": 84,
    "과학": 84,
    "예술": 82,
    "관리": 82,
    "숫자": 79,
    "문학": 34,
    "음악": 21
}

print("=== 동훈님 버크만 점수 ===")
for key, value in birkman.items():
    star ="★" * (value//10) # 10점당 별 1개
    print(f"{key:>6}: {value}%{star}")

# 최고 강점 찾기
best_area = max(birkman, key=birkman.get)
print(f"\n 최고 강점 : {best_area} ({birkman[best_area]}%)")