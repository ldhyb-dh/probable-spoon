# Day 16 - 클래스(Class) 기본

# 1. 가장 기본적인 클래스
class Person:
    def __init__(self, name, age):  # 생성자 (객체를 만들 때 자동으로 실행)
        self.name = name            # 속성 (attribute)
        self.age = age

    def introdunce(self):           # 메서드 (method)
        print(f"안녕하세요! 저는 {self.name}이고, {self.age}살입니다.")

    def get_birth_year(self):
        return 2026 - self.age
    
# 객체(인스턴스) 생성
donghoon = Person("이동훈", 25)
donghoon.introdunce()
print(f"출생년도: {donghoon.get_birth_year()}년")

# 2. 버크만 점수를 다루는 클래스 (실전 예시)
class BirkmanProfile:
    def __init__(self, name):
        self.name = name
        self.scores = {}          # 딕셔너리로 점수 저장
        
    def add_score(self, area, score):
        self.scores[area] = score

    def show_analysis(self):
        print(f"\n==={self.name}님 버크만 분석 ===")
        sorted_scores = sorted(self.scores.items(), key=lambda x:x[1], reverse=True)

        for area, score in sorted_scores:
            stars = "★" * (score // 10)
            print(f"{area:>6}: {score:3}% {stars}")

        if self.scores:
            best = max(self.scores, key=self.scores.get)
            print(f"\n최고 강점 → {best} ({self.scores[best]}%)")

profile = BirkmanProfile("동호온")
profile.add_score("기술", 97)
profile.add_score("야외", 84)
profile.add_score("과학", 84)
profile.add_score("예술", 82)
profile.add_score("숫자", 79)

profile.show_analysis()

class WeatherData:
    def __init__(self, location="부산"):
        self.location = location
        self.temperatures = []

    def add_temp(self, temp):
        self.temperatures.append(temp)

    def get_average(self):
        if not self.temperatures:
            return 0
        return sum(self.temperatures) / len(self.temperatures)
    
    def show_report(self):
        print(f"\n==={self.location} 날씨 보고서 ===")
        print(f"총 기록 일수: {len(self.temperatures)}일")
        print(f"평균기온: {self.get_average():.1f}°C")
        print(f"최고 기온: {max(self.temperatures):.1f}°C")
        print(f"최저 기온: {min(self.temperatures):.1f}°C")


weather = WeatherData("부산")
weather.add_temp(24.5)
weather.add_temp(26.8)
weather.add_temp(23.1)
weather.add_temp(25.4)
weather.show_report()
